import { sum } from 'd3-array'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { currentSpeciesAtom, introCompletedAtom, timeStepAtom } from '../atoms'
import { CellTypeEnum, CellTypesString } from '../constants'
import { ValuesByYear } from '../types'
import { formatLatin } from '../utils'
import { MapSentenceWrapper } from './MapSentence.styled'

type MapSentenceProps = {
  timeseriesData: ValuesByYear | null
}

function MapSentence({ timeseriesData }: MapSentenceProps) {
  const { t } = useTranslation()
  const year = useAtomValue(timeStepAtom)
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  if (!timeseriesData || !timeseriesData[year]) return null

  const species = formatLatin(currentSpecies)
  const context = t('mapLegend.context', undefined, { year })

  let sentence
  if (year === '2005') {
    sentence = t('mapLegend.current', undefined, { species })
  } else {
    const yearData = timeseriesData[year] as number[]
    const reference = timeseriesData[2005] as number
    const total = sum(yearData)

    const pcts = {
      pctDecolonized: Math.round((yearData[0] / reference) * 100),
      pctStable: Math.round((yearData[1] / reference) * 100),
      pctSuitable: Math.round((yearData[2] / reference) * 100),
    }

    const getSentence = (key: string) => {
      let pctsObj: Record<string, string | undefined> = {}
      if (total > 0) {
        pctsObj.pctDecolonized = t('mapLegend.pctDecolonized', undefined, {
          pct: pcts.pctDecolonized,
        })
        pctsObj.pctStable = t('mapLegend.pctStable', undefined, {
          pct: pcts.pctStable,
        })
        // case where suitable pct is Infinity/very high
        pctsObj.pctSuitable =
          pcts.pctSuitable < 10000
            ? t('mapLegend.pctSuitable', undefined, { pct: pcts.pctSuitable })
            : undefined
      }
      return t(`mapLegend.${key}`, undefined, {
        context,
        species,
        year,
        ...pctsObj,
      })
    }

    if (total === 0) sentence = getSentence(t('noData'))

    // as a proportion of the total
    const ratios = [0, 1, 2].map((i) => yearData[i] / total)

    const dominant = ratios.flatMap((v, i) => (v > 0.7 ? [i] : []))
    const majority = ratios.flatMap((v, i) => (v > 0.5 ? [i] : []))
    const secondary = ratios.flatMap((v, i) =>
      v > 0.35 && v <= 0.7 ? [i] : []
    )
    const tertiary = ratios.flatMap((v, i) => (v > 0.2 && v <= 0.5 ? [i] : []))

    let key: string | null = null
    if (dominant.length) {
      key = `overwhelmingly${CellTypesString[dominant[0]]}`
    } else {
      if (secondary.length === 2) {
        key = `both${CellTypesString[secondary[0]]}And${
          CellTypesString[secondary[1]]
        }`
      } else if (majority.length) {
        let biggestTertiaryValue = Number.NEGATIVE_INFINITY
        let biggestTertiaryIndex = 0
        ratios.forEach((r, i) => {
          if (r > biggestTertiaryValue && tertiary.includes(i)) {
            biggestTertiaryValue = r
            biggestTertiaryIndex = i
          }
        })
        key = `mostly${CellTypesString[majority[0]]}Somewhat${
          CellTypesString[biggestTertiaryIndex]
        }`
      } else {
        sentence = getSentence('equal')
      }
    }

    if (key) {
      sentence = getSentence(key)
    }
  }

  return (
    <MapSentenceWrapper visible={introCompleted}>{sentence}</MapSentenceWrapper>
  )
}

export default MapSentence
