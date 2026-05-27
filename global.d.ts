// oxlint-disable-next-line triple-slash-reference -- required to surface ambient Cloudflare bindings
/// <reference path="./cloudflare-env.d.ts" />

// css import type
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
