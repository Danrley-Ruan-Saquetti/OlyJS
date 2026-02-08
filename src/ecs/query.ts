import { IArchetype, Signature } from './archetype'
import { EntityId, EntityLocation } from './entity'

export interface IQuery {
  readonly mask: Signature

  build(): void

  find(max?: number): EntityId[]
  findFirst(): EntityId | undefined
  findFirstLocation(): EntityLocation | undefined

  count(): number
  isEmpty(): boolean
  has(entityId: EntityId): boolean

  view(): readonly IArchetype[]

  onArchetypeAdded(archetype: IArchetype): void
}
