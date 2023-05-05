import { atom } from 'jotai'
import { atomWithHash } from 'jotai/utils'
import { IntroStepEnum } from './intro/Intro'
import { SpeciesSortBy, TimeStep } from './types'
import { GLOBAL_REGION_GID } from './constants'

export const currentSpeciesAtom = atomWithHash<string>(
  'species',
  // SPECIES_WHITELIST[Math.floor(SPECIES_WHITELIST.length * Math.random())]
  'Quercus_ilex'
)
export const currentRegionAtom = atomWithHash<string>('region', GLOBAL_REGION_GID)
export const timeStepAtom = atomWithHash<TimeStep>('timeStep', '2095', {
  replaceState: true,
})
export const currentRCPAtom = atomWithHash<string>('rcp', '85')

export const navSpeciesSortByAtom = atom<SpeciesSortBy>('vernacular')

export const introStepAtom = atom<IntroStepEnum>(IntroStepEnum.Title)
export const introCompletedAtom = atomWithHash<boolean>('introCompleted', false)
export const introIntersectionRatioAtom = atom<{
  [K in IntroStepEnum]?: number
}>({})
