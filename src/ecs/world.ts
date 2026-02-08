import { PrefabEntityProperties } from '../runtime'
import { EntityBuilder } from '../runtime/world/entity/entity-builder'
import { ArchetypeProfile, IArchetype } from './archetype'
import { ComponentDescriptor, ComponentsToObject } from './component'
import { EntityId, EntityLocation } from './entity'
import { IQuery } from './query'

export type IWoldSpawnProperties = {
  components?: { component: ComponentDescriptor, data?: unknown }[]
  profile?: ArchetypeProfile
}

export interface IWorld {
  flush(): void

  spawn(props: IWoldSpawnProperties): EntityId
  destroy(entityId: EntityId): void
  addComponent<TComponent extends ComponentDescriptor>(entityId: EntityId, component: TComponent, initialData?: ComponentsToObject<[TComponent]>): void

  createPrefab(properties?: PrefabEntityProperties): EntityBuilder
  getQuery(components: ComponentDescriptor[]): IQuery

  findFirst(components: ComponentDescriptor[]): EntityId | undefined
  findSingleton(components: ComponentDescriptor[]): EntityId | undefined
  expectSingleton(components: ComponentDescriptor[]): EntityId
  find(components: ComponentDescriptor[]): EntityId[]
  count(components: ComponentDescriptor[]): number
  isEmpty(components: ComponentDescriptor[]): boolean
  exists(components: ComponentDescriptor[]): boolean
  getEntityLocation(entityId: number): EntityLocation | undefined
  expectEntity(entityId: EntityId): EntityLocation
  hasEntity(entityId: number): boolean
  getArchetypes(): MapIterator<IArchetype>
}
