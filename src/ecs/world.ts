import { EntityLocation } from '../runtime/world/archetype/entity-location'
import { EntityBuilder } from '../runtime/world/entity-builder'
import { Query } from '../runtime/world/query'
import { ComponentDescriptor, ComponentId, ComponentsToObject } from './component'
import { EntityId } from './entity'

export interface IWorld {
  spawn(components?: { component: ComponentDescriptor, data?: unknown }[]): EntityId
  destroy(entityId: EntityId): void
  addComponent<TComponent extends ComponentDescriptor>(entityId: EntityId, component: TComponent, initialData?: ComponentsToObject<[TComponent]>): void
  flush(): void
  createPrefab(): EntityBuilder
  createQuery(components: ComponentId[]): Query
  getEntity(entityId: number): EntityLocation
}
