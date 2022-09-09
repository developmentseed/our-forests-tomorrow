import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import {
  currentSpeciesAtom,
  introCompletedAtom,
  introIntersectionRatioAtom,
  introStepAtom,
  timeStepAtom,
} from '../atoms'
import { MAP_DEFAULT_VIEWPORT } from '../constants'
import { IntroStepEnum } from '../intro/Intro'
import { easeOutCubic } from '../utils'

export function useIntroMapTransitions(
  viewState: any,
  setViewState: (args: any) => void
) {
  const introCompleted = useAtomValue(introCompletedAtom)
  const introStep = useAtomValue(introStepAtom)
  const introIntersectionRatio = useAtomValue(introIntersectionRatioAtom)
  const setCurrentSpecies = useSetAtom(currentSpeciesAtom)
  const setTimeStep = useSetAtom(timeStepAtom)
  useEffect(() => {
    if (introCompleted) {
      setViewState({
        ...viewState,
        ...MAP_DEFAULT_VIEWPORT,
        transitionDuration: 1000,
      })
    } else {
      if (introStep < IntroStepEnum.Map) {
        setCurrentSpecies('Fagus_sylvatica')
        setTimeStep('2095')
        setViewState({
          ...viewState,
          zoom: 3,
          pitch: 80,
          latitude: 80,
          longitude: 30,
          bearing: 10,
          transitionDuration: 300,
        })
      } else if (introStep === IntroStepEnum.Map) {
        setViewState({
          ...viewState,
          pitch: 80,
          bearing: 50,
          transitionDuration: 15000,
          transitionEasing: easeOutCubic,
          zoom: 6,
          latitude: 45,
          longitude: 0,
        })
      } else if (introStep === IntroStepEnum.SpeciesExampleMap) {
        setCurrentSpecies('Quercus_ilex')
        setTimeStep('2005')
        setViewState({
          ...viewState,
          pitch: 20,
          bearing: 0,
          transitionDuration: 5000,
          transitionEasing: easeOutCubic,
          zoom: 4,
          latitude: 40,
          longitude: 5,
        })
      } else if (introStep === IntroStepEnum.Timesteps) {
        setTimeStep('2095')
        // TODO
        console.log(introIntersectionRatio)
      } else if (introStep === IntroStepEnum.Decolonization) {
        setViewState({
          ...viewState,
          pitch: 20,
          bearing: 0,
          transitionDuration: 5000,
          transitionEasing: easeOutCubic,
          zoom: 5,
          latitude: 40,
          longitude: -5,
        })
      } else if (introStep === IntroStepEnum.Suitable) {
        setViewState({
          ...viewState,
          pitch: 60,
          bearing: -15,
          transitionDuration: 5000,
          transitionEasing: easeOutCubic,
          zoom: 5,
          latitude: 48,
          longitude: 0,
        })
      } else if (introStep === IntroStepEnum.Chart) {
        setViewState({
          ...viewState,
          pitch: 20,
          bearing: 0,
          transitionDuration: 5000,
          transitionEasing: easeOutCubic,
          zoom: 4,
          latitude: 40,
          longitude: 5,
        })
      } else if (introStep === IntroStepEnum.RegionMap) {
        setViewState({
          ...viewState,
          pitch: 20,
          bearing: 0,
          transitionDuration: 5000,
          transitionEasing: easeOutCubic,
          zoom: 5,
          latitude: 40,
          longitude: -5,
        })
      }
    }
  }, [introCompleted, introStep, introIntersectionRatio, setViewState])
}
