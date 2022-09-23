type SVGHatchPatternProps = {
  color?: string
  hatchWidth?: number
}

export default function SVGHatchPattern({
  color = '#ff00ff',
  hatchWidth = 1,
}: SVGHatchPatternProps) {
  return (
    <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4">
      <path
        d="M-1,1 l2,-2
             M0,4 l4,-4
             M3,5 l2,-2"
        style={{ stroke: color, strokeWidth: hatchWidth }}
      />
    </pattern>
  )
}
