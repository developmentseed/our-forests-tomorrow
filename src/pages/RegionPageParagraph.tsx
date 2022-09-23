import { Trans } from 'react-i18next'
import Hexagon from '../components/Hexagon'
import { CellTypeEnum } from '../constants'
import { ValuesByYear } from '../types'
import PageParagraphWrapper from './PageParagraph.styled'

type RegionPageParagraphProps = {
  data: [string, ValuesByYear][]
  type: CellTypeEnum
  region: string
  transKey: string
  onMoreClick: () => void
}

const NUM_TOP_SPECIES = 5

function RegionPageParagraph({
  data,
  type,
  region,
  transKey,
  onMoreClick,
}: RegionPageParagraphProps) {
  const species = data
    .slice(0, NUM_TOP_SPECIES)
    .map((d) => d[1].label)
    .join(', ')
  const numSpecies = data.length - NUM_TOP_SPECIES
  return (
    <PageParagraphWrapper>
      <Hexagon type={type} />
      <span>
        <Trans i18nKey={transKey}>
          {{ species }} and
          <button onClick={onMoreClick}>{{ numSpecies }} more species</button>
          are naturally present in {{ region }}.
        </Trans>
      </span>
    </PageParagraphWrapper>
  )
}

export default RegionPageParagraph
