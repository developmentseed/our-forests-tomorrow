import { atom } from 'jotai'
import { atomWithHash } from 'jotai/utils'
import { SPECIES_WHITELIST } from './constants_common'
import { SpeciesSortBy, TimeStep } from './types'
export const currentSpeciesAtom = atomWithHash<string>(
  'currentSpecies',
  SPECIES_WHITELIST[Math.floor(SPECIES_WHITELIST.length * Math.random())]
)
export const timeStepAtom = atomWithHash<TimeStep>('timeStep', '2005', {
  replaceState: true,
})

export const navSpeciesSortByAtom = atom<SpeciesSortBy>('vernacular')
