import { Query } from '../runtime/world/query'
import { ComponentDescriptor, ComponentId, ComponentsToObject } from './component'
import { EntityId } from './entity'

export interface IWorld {
  instantiate(components?: { component: ComponentDescriptor, data?: unknown }[]): EntityId
  destroy(entityId: EntityId): void
  addComponent<TComponent extends ComponentDescriptor>(entityId: EntityId, component: TComponent, initialData?: ComponentsToObject<[TComponent]>): void
  flush(): void
  createQuery(components: ComponentId[]): Query
}
