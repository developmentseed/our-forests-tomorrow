import { sum } from 'd3-array'
import { useAtomValue } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'
import { currentSpeciesAtom, introCompletedAtom, timeStepAtom } from '../atoms'
import { TimestepButton } from '../components/Button.styled'
import { CellTypeEnum } from '../constants'
import useRegionData from '../hooks/useRegionData'
import useRegionStats from '../hooks/useRegionStats'
import SummarySentence from '../components/SummarySentence'
import { formatLatin } from '../utils'
import { MapSentenceWrapper } from './MapSentence.styled'

function MapSentence() {
  const introCompleted = useAtomValue(introCompletedAtom)

  return (
    <MapSentenceWrapper visible={introCompleted}><SummarySentence /></MapSentenceWrapper>
  )
}

export default MapSentence
