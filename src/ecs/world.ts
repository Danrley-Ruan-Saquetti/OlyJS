import { Query } from '../runtime/world/query'
import { ComponentId } from './component'
import { EntityId } from './entity'

export interface IWorld {
  instantiate(): EntityId
  destroy(entityId: EntityId): void
  addComponent(entityId: EntityId, componentId: ComponentId): void
  flush(): void
  createQuery(components: ComponentId[]): Query
}
