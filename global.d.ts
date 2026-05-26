/// <reference path="./cloudflare-env.d.ts" />

// css import type
declare module '*.css' {
	const content: { [className: string]: string }
	export default content
}
