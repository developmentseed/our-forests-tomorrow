import { CellTypeEnum, COLOR_BY_CELL_TYPE } from '../constants'
import { deckColorToCss } from '../utils'

type HexagonProps = {
  type: CellTypeEnum
}

function Hexagon({ type }: HexagonProps) {
  const color =
    type === CellTypeEnum.Suitable
      ? 'url(#hatch)'
      : deckColorToCss(COLOR_BY_CELL_TYPE[type])
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="13"
    >
      <polygon
        points="15 6.5 11.25 12.9951905 3.75 12.9951905 0 6.5 3.75 0.00480947917 11.25 0.00480947917"
        fill={color}
      ></polygon>
    </svg>
  )
}

export default Hexagon
