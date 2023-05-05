import { useAtomValue } from 'jotai'
import { introCompletedAtom } from '../atoms'
import SummarySentence from '../components/SummarySentence'
import { MapSentenceWrapper } from './MapSentence.styled'

function MapSentence() {
  const introCompleted = useAtomValue(introCompletedAtom)

  return (
    <MapSentenceWrapper visible={introCompleted}><SummarySentence /></MapSentenceWrapper>
  )
}

export default MapSentence
