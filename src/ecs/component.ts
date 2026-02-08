import { TypedArray } from './archetype'

export type ComponentId = bigint

export interface ComponentIdentifier {
  id: ComponentId
}

export enum ComponentFieldType {
  Int8,
  Uint8,
  Uint8Clamped,
  Int16,
  Uint16,
  Int32,
  Uint32,
  Float16,
  Float32,
  Float64,
  BigInt64,
  BigUint64,
}

export type ComponentSchema = Record<string, ComponentFieldType>

export type InferSchemaValues<T extends ComponentSchema> = {
  [K in keyof T]: number
}

export interface ComponentDescriptor<TName extends string = string, TSchema extends ComponentSchema = ComponentSchema> extends ComponentIdentifier {
  name: TName
  schema: TSchema
}

export type ComponentsToObject<T extends readonly ComponentDescriptor[] = []> = {
  [C in T[number]as C['name']]: Partial<InferSchemaValues<C['schema']>>
}

export type ComponentDataSchema = Record<string, TypedArray>

export interface IComponentData<TShape extends ComponentDataSchema = ComponentDataSchema> {
  readonly size: number
  readonly isFull: boolean
  readonly data: Readonly<TShape>

  push(initialValues?: Partial<{ [K in keyof TShape]: number }>): void
  pop(): void
  swap(indexA: number, indexB: number): void
  copyFrom(other: IComponentData<TShape>, index: number): void
  field<Field extends keyof TShape>(field: Field): TypedArray
}
