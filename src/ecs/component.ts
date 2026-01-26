import { ComponentFieldType } from './archetype'

export type ComponentId = bigint

export type ComponentSchema = Record<string, ComponentFieldType>

export interface ComponentDescriptor<TSchema extends ComponentSchema = ComponentSchema> {
  id: ComponentId
  schema: TSchema
}
