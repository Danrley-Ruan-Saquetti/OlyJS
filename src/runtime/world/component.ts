import { ComponentId } from '../../ecs/component'

export interface ComponentSchema<T = any> {
  construct: () => T
  clone?: (value: T) => T
}

export interface ComponentDescriptor<T = any> {
  id: ComponentId
  schema: ComponentSchema<T>
}
