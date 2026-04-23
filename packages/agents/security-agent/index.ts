// ─── MABELE Security Agent ────────────────────────────────────────────────────
// Plugs into the existing agent orchestrator.
// Handles: honeypot triggers, brute-force events, fraud signals, anomalies.
// 100% deterministic — no LLM required — self-maintaining.
//
// Register on app boot:
//   import { securityAgent } from '@mabele/agent-security'
//   import { agentOrchestrator } from '@mabele/agent-orchestrator'
//   agentOrchestrator.register('security-agent', securityAgent)

import type { AgentHandler, AgentContext, AgentResult } from '../orchestrator/index'
import { recordThreat, permanentBan, liftBan, getThreat, isBlocked, type ThreatSignal } from '../../core/security/sentinel'

// ─── Action types ─────────────────────────────────────────────────────────────

type SecurityAction =
  | { type: 'check';         ip: string; userId?: string }
  | { type: 'report_signal'; ip: string; signal: ThreatSignal; userId?: string }
  | { type: 'permanent_ban'; ip: string; reason?: ThreatSignal }
  | { type: 'lift_ban';      ip: string }
  | { type: 'status' }

// ─── Auto-response rules ──────────────────────────────────────────────────────

const AUTO_ESCALATION_RULES: { signal: ThreatSignal; autoBan: boolean; logLevel: 'info' | 'warn' | 'critical' }[] = [
  { signal: 'HONEYPOT_HIT',      autoBan: true,  logLevel: 'critical' },
  { signal: 'SQLI_PATTERN',      autoBan: true,  logLevel: 'critical' },
  { signal: 'XSS_PATTERN',       autoBan: true,  logLevel: 'critical' },
  { signal: 'PATH_TRAVERSAL',    autoBan: true,  logLevel: 'critical' },
  { signal: 'INVALID_SIGNATURE', autoBan: true,  logLevel: 'critical' },
  { signal: 'BRUTE_FORCE',       autoBan: false, logLevel: 'warn'     },
  { signal: 'SCANNER_UA',        autoBan: false, logLevel: 'warn'     },
  { signal: 'RATE_EXCEEDED',     autoBan: false, logLevel: 'info'     },
  { signal: 'MISSING_UA',        autoBan: false, logLevel: 'info'     },
  { signal: 'ANOMALOUS_PAYLOAD', autoBan: false, logLevel: 'warn'     },
  { signal: 'REPEATED_ERRORS',   autoBan: false, logLevel: 'info'     },
  { signal: 'NON_DRC_PAYMENT',   autoBan: false, logLevel: 'warn'     },
]

// ─── Agent Handler ─────────────────────────────────────────────────────────────

class SecurityAgentHandler implements AgentHandler {
  async run(ctx: AgentContext): Promise<AgentResult> {
    const action = ctx.input as unknown as SecurityAction

    switch (action.type) {

      case 'check': {
        const blocked = isBlocked(action.ip, action.userId)
        const threat = getThreat(action.ip, action.userId)
        return {
          success: true,
          output: { blocked, threat, recommendation: blocked ? 'BLOCK' : threat?.level === 'SUSPECT' ? 'REVIEW' : 'ALLOW' },
        }
      }

      case 'report_signal': {
        const rule = AUTO_ESCALATION_RULES.find(r => r.signal === action.signal)
        let threat = recordThreat(action.ip, action.signal, action.userId)

        // Auto-ban if rule says so or score hits critical
        if (rule?.autoBan || threat.score >= 80) {
          permanentBan(action.ip, action.signal)
          threat = { ...threat, level: 'BLOCKED', score: 100 }
        }

        this.log(rule?.logLevel ?? 'info', action.signal, action.ip, action.userId, threat.score)

        return {
          success: true,
          output: {
            threat,
            autoBanned: threat.level === 'BLOCKED',
            logLevel: rule?.logLevel ?? 'info',
          },
        }
      }

      case 'permanent_ban': {
        permanentBan(action.ip, action.reason)
        this.log('critical', 'MANUAL_BAN', action.ip, undefined, 100)
        return { success: true, output: { banned: true, ip: action.ip } }
      }

      case 'lift_ban': {
        liftBan(action.ip)
        return { success: true, output: { lifted: true, ip: action.ip } }
      }

      case 'status': {
        return {
          success: true,
          output: {
            agent: 'security-agent',
            version: '1.0.0',
            status: 'operational',
            capabilities: ['check', 'report_signal', 'permanent_ban', 'lift_ban'],
          },
        }
      }

      default:
        return { success: false, output: {}, error: `Unknown action type: ${(action as { type: string }).type}` }
    }
  }

  private log(level: 'info' | 'warn' | 'critical', signal: string, ip: string, userId?: string, score?: number) {
    const prefix = `[MABELE-SECURITY][${level.toUpperCase()}]`
    const msg = `signal=${signal} ip=${ip}${userId ? ` user=${userId}` : ''} score=${score ?? '?'}`
    if (level === 'critical') console.error(prefix, msg)
    else if (level === 'warn') console.warn(prefix, msg)
    else console.log(prefix, msg)
  }
}

export const securityAgent = new SecurityAgentHandler()
