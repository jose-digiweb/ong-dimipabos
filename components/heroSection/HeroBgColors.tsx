/**
 * The {@link HeroBgColors} component
 * @description Two absolutely-positioned blurred colour blobs used as the hero background
 * @returns The rendered background blobs
 */
export const HeroBgColors = () => {
  // Render two blurred circles tinted with the primary and secondary palette
  return (
    <>
      <div className='-left-12 -translate-y-1/2 absolute top-1/2 h-72 w-72 rounded-full bg-secondary/30 blur-3xl' />
      <div className='-right-12 -translate-y-1/2 absolute top-1/2 h-72 w-72 rounded-full bg-primary/30 blur-3xl' />
    </>
  )
}
