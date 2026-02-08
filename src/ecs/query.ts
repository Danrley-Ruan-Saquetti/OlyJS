import { IArchetype, Signature } from './archetype'
import { EntityId } from './entity'

export interface IQuery {
  readonly mask: Signature

  build(archetypes: MapIterator<IArchetype>): void

  view(): readonly IArchetype[]
  find(max?: number): EntityId[]
  findFirst(): EntityId | undefined

  count(): number
  isEmpty(): boolean

  onArchetypeAdded(archetype: IArchetype): void
}
