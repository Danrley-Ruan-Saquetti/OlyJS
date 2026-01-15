import { ComponentId } from '../../ecs/component'

export interface ComponentSchema<T = any> {
  size: number
  construct: () => T
}

export interface ComponentDescriptor {
  id: ComponentId
  schema: ComponentSchema
}
