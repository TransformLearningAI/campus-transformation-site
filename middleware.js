import { NextResponse } from "next/server"

const BOT_PATTERNS = [
  "bot", "crawler", "spider", "slurp", "mediapartners", "facebookexternalhit",
  "linkedinbot", "twitterbot", "whatsapp", "telegrambot", "discordbot",
  "bingpreview", "yandex", "baidu", "duckduckbot", "semrush", "ahrefs",
  "mj12bot", "dotbot", "petalbot", "bytespider", "gptbot", "claudebot",
  "awariobot", "screaming frog", "rogerbot", "archive.org", "ia_archiver",
]

const SCANNER_PATHS = [
  "/.env", "/.git", "/.aws", "/.ssh", "/.docker", "/.cursor", "/.vscode",
  "/wp-admin", "/wp-login", "/wp-content", "/wp-includes", "/wp-config",
  "/xmlrpc", "/phpinfo", "/phpmyadmin", "/adminer", "/server-status",
  "/config.js", "/config.json", "/config.yml", "/config.php", "/settings.js",
  "/credentials", "/secrets", "/debug", "/trace", "/actuator",
  "/cgi-bin", "/admin.php", "/web.config", "/appsettings",
  "/laravel", "/artisan", "/composer.json",
]

// Known spam path patterns (random word slugs probing for open redirects)
const SPAM_PATTERNS = [
  "queen-bed", "regarding-motivate", "cheap-hotel", "buy-now", "free-download",
  "casino", "viagra", "forex", "crypto-", "earn-money",
]

function isBot(ua) {
  const lower = ua.toLowerCase()
  return BOT_PATTERNS.some(p => lower.includes(p))
}

function isJunkPath(pathname) {
  const lower = pathname.toLowerCase()
  if (SCANNER_PATHS.some(p => lower.startsWith(p))) return true
  if (SPAM_PATTERNS.some(p => lower.includes(p))) return true
  // Catch paths with too many hyphens (random-word-spam-slugs)
  const segments = pathname.split('/').filter(Boolean)
  for (const seg of segments) {
    if (seg.split('-').length > 5 && !seg.startsWith('blog')) return true
  }
  return false
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get("user-agent") || ""

  if (!pathname.startsWith("/api/") && !pathname.startsWith("/_next") && !isBot(ua) && !isJunkPath(pathname)) {
    const geo = request.geo || {}
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && serviceKey) {
      fetch(`${supabaseUrl}/rest/v1/page_views`, {
        method: "POST",
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          site: "campustransformation.org",
          path: pathname,
          country: geo.country || null,
          region: geo.region || null,
          city: geo.city || null,
          latitude: geo.latitude || null,
          longitude: geo.longitude || null,
          user_agent: ua || null,
          referer: request.headers.get("referer") || null,
        }),
      }).catch(() => {})
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
