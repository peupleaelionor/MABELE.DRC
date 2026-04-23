// ─── MABELE Security: Honeypot Registry ───────────────────────────────────────
// Any request hitting a honeypot path is from a scanner, crawler, or attacker.
// Instant permanent ban — zero false positives on legitimate users.
// Add paths that legitimate MABELE users will NEVER access.

/** Paths that should never be accessed by legitimate users. */
export const HONEYPOT_PATHS: readonly string[] = [
  // WordPress probes
  '/wp-admin',
  '/wp-login.php',
  '/wp-config.php',
  '/xmlrpc.php',
  '/wp-includes',
  '/wp-content',
  // Sensitive files
  '/.env',
  '/.env.local',
  '/.env.production',
  '/.git',
  '/.gitignore',
  '/.htaccess',
  '/config.php',
  '/config.yml',
  '/config.json',
  '/settings.php',
  '/database.php',
  // Admin panels
  '/admin',
  '/administrator',
  '/phpmyadmin',
  '/pma',
  '/mysql',
  '/sql',
  '/db',
  // Shell probes
  '/shell.php',
  '/webshell.php',
  '/cmd.php',
  '/backdoor.php',
  '/c99.php',
  '/r57.php',
  // Vendor/framework probes
  '/vendor',
  '/composer.json',
  '/composer.lock',
  '/package.json',
  '/node_modules',
  // Common CMS
  '/joomla',
  '/drupal',
  '/magento',
  '/prestashop',
  // Monitoring
  '/actuator',
  '/actuator/health',
  '/env',
  '/metrics',
  '/trace',
  '/heapdump',
  // Other
  '/backup',
  '/old',
  '/test.php',
  '/info.php',
  '/phpinfo.php',
  '/server-status',
  '/server-info',
  '/robots.txt.bak',
]

/** Known scanner/bot user-agent patterns. */
export const SCANNER_UA_PATTERNS: readonly RegExp[] = [
  // Known attack tools
  /sqlmap|nikto|nmap|masscan|zgrab|nuclei|acunetix|nessus|openvas|burpsuite|zaproxy|dirbuster|gobuster|ffuf|wfuzz|hydra|metasploit|havij/i,
  // Raw HTTP clients used as the full UA (automated scripts with no browser wrapper)
  /^python-requests\/[0-9]|^go-http-client\/[12]\.|^curl\/[0-9]/i,
]

/** Injection attack patterns to detect in URL paths and query strings. */
export const INJECTION_PATTERNS: readonly { signal: 'SQLI_PATTERN' | 'XSS_PATTERN' | 'PATH_TRAVERSAL'; re: RegExp }[] = [
  { signal: 'SQLI_PATTERN', re: /(\%27|'|--|;|\b(select|union|insert|update|delete|drop|exec|execute|xp_)\b)/i },
  { signal: 'XSS_PATTERN',  re: /(<script|javascript:|on\w+\s*=|<iframe|<object|<embed)/i },
  { signal: 'PATH_TRAVERSAL', re: /\.\.[/\\]/ },
]

/** Check if a URL path is a honeypot. */
export function isHoneypotPath(pathname: string): boolean {
  const lower = pathname.toLowerCase()
  return HONEYPOT_PATHS.some(h => lower === h || lower.startsWith(h + '/') || lower.startsWith(h + '?'))
}

/** Check if user-agent looks like a scanner. */
export function isScannerUA(userAgent: string): boolean {
  if (!userAgent) return false
  return SCANNER_UA_PATTERNS.some(p => p.test(userAgent))
}

/** Detect injection patterns in a URL (path + search). */
export function detectInjection(url: string): 'SQLI_PATTERN' | 'XSS_PATTERN' | 'PATH_TRAVERSAL' | null {
  for (const { signal, re } of INJECTION_PATTERNS) {
    if (re.test(url)) return signal
  }
  return null
}
