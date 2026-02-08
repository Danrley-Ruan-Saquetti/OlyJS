import { IArchetype } from './archetype'

export type EntityId = number

export type EntityLocation = {
  archetype: IArchetype
  index: number
}
