/**
 * The HeroBgColors component
 * @description Will render the HeroBgColors
 * @returns {JSX.Element} The HeroBgColors component
 */
export const HeroBgColors = () => {
	return (
		<>
			<div className='-left-12 -translate-y-1/2 absolute top-1/2 h-72 w-72 rounded-full bg-secondary/30 blur-3xl' />
			<div className='-right-12 -translate-y-1/2 absolute top-1/2 h-72 w-72 rounded-full bg-primary/30 blur-3xl' />
		</>
	)
}
