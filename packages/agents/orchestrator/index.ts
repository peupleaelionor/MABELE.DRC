// ─── Agent Orchestrator ────────────────────────────────────────────────────────
// Central orchestrator for all MABELE AI agents.
// Agents are deterministic-first, LLM-optional.
// Each agent receives a typed context and returns a typed result.
// Wire Mastra / LangGraph when MASTRA_API_KEY / LANGGRAPH_URL is configured.

export type AgentName =
  | 'copilot'
  | 'search-agent'
  | 'recommendation-agent'
  | 'pricing-agent'
  | 'fraud-agent'
  | 'moderation-agent'
  | 'messaging-agent'
  | 'payments-agent'
  | 'onboarding-agent'
  | 'growth-agent'
  | 'support-agent'
  | 'merchant-agent'
  | 'security-agent'

export interface AgentContext {
  agentName: AgentName
  userId?: string
  sessionId?: string
  input: Record<string, unknown>
  history?: AgentMessage[]
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AgentResult {
  success: boolean
  output: Record<string, unknown>
  messages?: AgentMessage[]
  toolCalls?: AgentToolCall[]
  error?: string
  latencyMs?: number
}

export interface AgentToolCall {
  tool: string
  input: Record<string, unknown>
  output: Record<string, unknown>
}

export interface AgentHandler {
  run(ctx: AgentContext): Promise<AgentResult>
}

// ─── Registry ─────────────────────────────────────────────────────────────────

class AgentRegistry {
  private handlers = new Map<AgentName, AgentHandler>()

  register(name: AgentName, handler: AgentHandler): void {
    this.handlers.set(name, handler)
  }

  get(name: AgentName): AgentHandler | undefined {
    return this.handlers.get(name)
  }

  async run(ctx: AgentContext): Promise<AgentResult> {
    const handler = this.handlers.get(ctx.agentName)
    if (!handler) {
      return { success: false, output: {}, error: `Agent not found: ${ctx.agentName}` }
    }
    const start = Date.now()
    const result = await handler.run(ctx)
    result.latencyMs = Date.now() - start
    return result
  }
}

export const agentOrchestrator = new AgentRegistry()
