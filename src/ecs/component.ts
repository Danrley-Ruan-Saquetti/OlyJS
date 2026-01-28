import { ComponentFieldType, TypedArray } from './archetype'

export type ComponentId = bigint

export type ComponentSchema = Record<string, ComponentFieldType>

export interface ComponentDescriptor<TSchema extends ComponentSchema = ComponentSchema> {
  id: ComponentId
  schema: TSchema
}

export type ComponentDataSchema = Record<string, TypedArray>

export interface IComponentData<TShape extends ComponentDataSchema = ComponentDataSchema> {
  readonly size: number
  readonly isFull: boolean
  readonly data: Readonly<TShape>

  pushDefault(): void
  pop(): void
  swap(indexA: number, indexB: number): void
  copyFrom(other: IComponentData<TShape>, index: number): void
  field<Field extends keyof TShape>(field: Field): TypedArray
}
