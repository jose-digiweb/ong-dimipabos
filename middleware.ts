import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

/**
 * The default middleware
 * @description Delegates to next-intl's middleware to handle locale detection,
 * redirects from `/` to `/<locale>`, and validation of locale segments.
 */
export default createMiddleware(routing)

/**
 * The {@link config} export
 * @description Matcher that runs the middleware on every request except Next.js internals,
 * file-convention assets and the API surface.
 */
export const config = {
  // Match everything except:
  //   - `/_next/*`            (Next.js internals)
  //   - `/_vercel/*`          (Vercel internals)
  //   - `/cdn-cgi/*`          (Cloudflare Image Transformations)
  //   - Any path with a dot   (static files: icons, OG images, manifests, robots, sitemap)
  matcher: '/((?!api|_next|_vercel|cdn-cgi|.*\\..*).*)',
}
