import { Query } from '../runtime/world/query'
import { ComponentDescriptor, ComponentId, ComponentSchema } from './component'
import { EntityId } from './entity'

export interface IWorld {
  instantiate(): EntityId
  destroy(entityId: EntityId): void
  addComponent(entityId: EntityId, componentId: ComponentId): void
  registerComponent<TSchema extends ComponentSchema>(schema: TSchema): ComponentDescriptor<TSchema>
  flush(): void
  createQuery(components: ComponentId[]): Query
}
