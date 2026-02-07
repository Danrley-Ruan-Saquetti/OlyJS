import { PrefabEntityProperties } from '../runtime'
import { EntityLocation } from '../runtime/world/archetype/entity-location'
import { EntityBuilder } from '../runtime/world/entity-builder'
import { Query } from '../runtime/world/query'
import { ArchetypeProfile } from './archetype'
import { ComponentDescriptor, ComponentsToObject } from './component'
import { EntityId } from './entity'

export type IWoldSpawnProperties = {
  components?: { component: ComponentDescriptor, data?: unknown }[]
  profile?: ArchetypeProfile
}

export interface IWorld {
  spawn(props: IWoldSpawnProperties): EntityId
  destroy(entityId: EntityId): void
  addComponent<TComponent extends ComponentDescriptor>(entityId: EntityId, component: TComponent, initialData?: ComponentsToObject<[TComponent]>): void
  flush(): void
  createPrefab(properties?: PrefabEntityProperties): EntityBuilder
  createQuery(components: ComponentDescriptor[]): Query
  findFirst(components: ComponentDescriptor[]): EntityId | undefined
  findSingleton(components: ComponentDescriptor[]): EntityId | undefined
  expectSingleton(components: ComponentDescriptor[]): EntityId
  getEntity(entityId: number): EntityLocation
}
