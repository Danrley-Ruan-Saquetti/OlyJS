import { Query } from '../runtime/world/query'
import { ComponentDescriptor, ComponentId, ComponentSchema } from './component'
import { EntityId } from './entity'

export interface IWorld {
  instantiate(): EntityId
  destroy(entityId: EntityId): void
  addComponent<TSchema extends ComponentSchema = ComponentSchema>(entityId: EntityId, component: ComponentDescriptor<TSchema>, initialData?: Partial<{ [k in keyof TSchema]: number }>): void
  flush(): void
  createQuery(components: ComponentId[]): Query
}
