import { Trans } from 'react-i18next'
import Hexagon from '../components/Hexagon'
import { CellTypeEnum } from '../constants'
import { ValuesByYear } from '../types'
import PageParagraphWrapper from './PageParagraph.styled'

type PageParagraphProps = {
  data: [string, ValuesByYear][]
  type: CellTypeEnum
  species: string
  transKey: string
  onMoreClick: () => void
}

function PageParagraph({
  data,
  type,
  species,
  transKey,
  onMoreClick,
}: PageParagraphProps) {
  const regions = data
    .slice(0, 5)
    .map((d) => d[1].label)
    .join(', ')
  const numRegions = data.length
  return (
    <PageParagraphWrapper>
      <Hexagon type={type} />
      <span>
        <Trans i18nKey={transKey}>
          {{ species }} is naturally present in {{ regions }}
          <button onClick={onMoreClick}>
            and {{ numRegions }} more regions
          </button>
        </Trans>
      </span>
    </PageParagraphWrapper>
  )
}

export default PageParagraph
