import { sum } from 'd3-array'
import { useAtomValue } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'
import { currentSpeciesAtom, introCompletedAtom, timeStepAtom,currentRegionAtom } from '../atoms'
import { TimestepButton, WithTooltip } from '../components/Button.styled'
import { CellTypeEnum } from '../constants'
import useRegionData from '../hooks/useRegionData'
import useRegionStats from '../hooks/useRegionStats'
import { Region, ValuesByYear } from '../types'
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

  const currentRegionData = useRegionData()
  const currentRegionStats = useRegionStats()

  const usingTimeseriesData = timeseriesData ? timeseriesData : currentRegionStats?.[currentSpecies]

  if (!usingTimeseriesData) return null

  const species = formatLatin(currentSpecies)

  let sentence
  if (year === '2005') {
    sentence = t('mapLegend.current', undefined, { species })
  } else {
    const yearData = usingTimeseriesData[year] as number[]
    const reference = usingTimeseriesData[2005] as number
    const total = sum(yearData)

    const pcts = {
      pctDecolonized: Math.round((yearData[0] / reference) * 100),
      pctStable: Math.round((yearData[1] / reference) * 100),
      pctSuitable: Math.round((yearData[2] / reference) * 100),
    }

    const getSentence = (key: string) => {
      let pctDecolonized, pctStable, pctSuitable
      if (total > 0) {
        pctDecolonized = t('mapLegend.pctDecolonized', undefined, {
          pct: pcts.pctDecolonized,
        })
        pctStable = t('mapLegend.pctStable', undefined, {
          pct: pcts.pctStable,
        })
        // case where suitable pct is Infinity/very high
        pctSuitable =
          pcts.pctSuitable < 10000
            ? t('mapLegend.pctSuitable', undefined, { pct: pcts.pctSuitable })
            : undefined
      }

      const transKey = `mapLegend.${key}`

      const area = currentRegionData
        ? t('mapLegend.inRegion', undefined, {
            region: currentRegionData.NAME_1 || currentRegionData.COUNTRY,
          })
        : t('mapLegend.here')

      return (
        <Trans i18nKey={transKey}>
          {!currentRegionData ? (
            <WithTooltip title={t('mapLegend.hereExplanation')}>
              {{ area }}
            </WithTooltip>
          ) : (
            <span>{{ area }}</span>
          )}
          , by
          <TimestepButton selected={true}>{{ year }}</TimestepButton>
          {{ species }} is likely to disappear {{ pctDecolonized }}, while in
          some areas it might become suitable {{ pctSuitable }} {{ pctStable }}
        </Trans>
      )
    }

    if (total === 0) sentence = getSentence(t('noData'))
    else {
      // as a proportion of the total
      const ratios = [0, 1, 2].map((i) => yearData[i] / total)

      const dominant = ratios.flatMap((v, i) => (v > 0.7 ? [i] : []))
      const majority = ratios.flatMap((v, i) => (v > 0.5 ? [i] : []))
      const secondary = ratios.flatMap((v, i) =>
        v > 0.35 && v <= 0.7 ? [i] : []
      )
      const tertiary = ratios.flatMap((v, i) =>
        v > 0.2 && v <= 0.5 ? [i] : []
      )

      let key: string | null = null
      if (dominant.length) {
        key = `overwhelmingly${CellTypeEnum[dominant[0]]}`
      } else {
        if (secondary.length === 2) {
          key = `both${CellTypeEnum[secondary[0]]}And${
            CellTypeEnum[secondary[1]]
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
          key = `mostly${CellTypeEnum[majority[0]]}Somewhat${
            CellTypeEnum[biggestTertiaryIndex]
          }`
        } else {
          sentence = getSentence('equal')
        }
      }

      if (key) {
        sentence = getSentence(key)
      }
    }
  }

  return (
    <MapSentenceWrapper visible={introCompleted}>{sentence}</MapSentenceWrapper>
  )
}

export default MapSentence
