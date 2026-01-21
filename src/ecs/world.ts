import { ComponentDescriptor } from '../runtime/world/component'
import { Query } from '../runtime/world/query'
import { EntityId } from './entity'

export interface IWorld {
  instantiate(): EntityId
  destroy(entityId: EntityId): void
  addComponent(entityId: EntityId, component: ComponentDescriptor): void
  registerComponent(descriptor: ComponentDescriptor): void
  flush(): void
  createQuery(components: ComponentDescriptor[]): Query
}
