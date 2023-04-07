import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { MapRef } from 'react-map-gl'
import {
  currentSpeciesAtom,
  // introIntersectionRatioAtom,
  introStepAtom,
  timeStepAtom,
} from '../atoms'
import { MAP_DEFAULT_VIEWPORT } from '../constants'
import { IntroStepEnum } from '../intro/Intro'

export function useIntroMapTransitions(
  viewState: any,
  setViewState: (args: any) => void,
  mapRef: MapRef | null
) {
  const introStep = useAtomValue(introStepAtom)
  // const introIntersectionRatio = useAtomValue(introIntersectionRatioAtom)
  const setCurrentSpecies = useSetAtom(currentSpeciesAtom)
  const setTimeStep = useSetAtom(timeStepAtom)
  useEffect(() => {
    switch (introStep) {
      case IntroStepEnum.Title:
      case IntroStepEnum.Forests:
      case IntroStepEnum.Species:
        setCurrentSpecies('Fagus_sylvatica')
        setTimeStep('2095')
        mapRef?.flyTo({
          center: [
            MAP_DEFAULT_VIEWPORT.longitude,
            MAP_DEFAULT_VIEWPORT.latitude,
          ],
          ...MAP_DEFAULT_VIEWPORT,
          duration: 0,
        })
        break
      case IntroStepEnum.Map:
        mapRef?.flyTo({
          center: [0, 45],
          pitch: 80,
          bearing: 50,
          zoom: 5,
          duration: 15000,
        })
        break
      case IntroStepEnum.SpeciesExampleMap:
        setCurrentSpecies('Quercus_ilex')
        setTimeStep('2005')
        mapRef?.flyTo({
          center: [5, 40],
          pitch: 20,
          bearing: 0,
          zoom: 4,
          duration: 5000,
        })
        break
      case IntroStepEnum.Timesteps:
        setTimeStep('2095')
        // TODO
        break
      case IntroStepEnum.Decolonization:
        mapRef?.flyTo({
          center: [-5, 40],
          pitch: 20,
          bearing: 0,
          zoom: 5,
          duration: 5000,
        })
        break
      case IntroStepEnum.Suitable:
        mapRef?.flyTo({
          center: [0, 48],
          pitch: 60,
          bearing: 0,
          zoom: 5,
          duration: 5000,
        })
        break
      case IntroStepEnum.Chart:
        mapRef?.flyTo({
          center: [5, 40],
          pitch: 20,
          bearing: 0,
          zoom: 4,
          duration: 5000,
        })
        break
      case IntroStepEnum.RegionMap:
        mapRef?.flyTo({
          center: [-5, 40],
          pitch: 20,
          bearing: 0,
          zoom: 5,
          duration: 5000,
        })
        break

      case IntroStepEnum.UIExplanation:
        mapRef?.flyTo({
          center: [
            MAP_DEFAULT_VIEWPORT.longitude,
            MAP_DEFAULT_VIEWPORT.latitude,
          ],
          ...MAP_DEFAULT_VIEWPORT,
          duration: 1000,
        })
        break
      default:
        break
    }
  }, [introStep])
}
