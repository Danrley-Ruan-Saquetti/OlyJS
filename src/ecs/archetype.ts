import { ComponentId } from './component'
import { EntityId } from './entity'

export enum ComponentFieldType {
  F32,
  F64,
  I32,
  U32,
  I16,
  U8,
  BOOL
}
export type TypedArray =
  | Float32Array
  | Float64Array
  | Int32Array
  | Uint32Array
  | Int16Array
  | Uint8Array

export const FieldArrayConstructor: Record<ComponentFieldType, new (initialCapacity?: number) => TypedArray> = {
  [ComponentFieldType.F32]: Float32Array,
  [ComponentFieldType.F64]: Float64Array,
  [ComponentFieldType.I32]: Int32Array,
  [ComponentFieldType.U32]: Uint32Array,
  [ComponentFieldType.I16]: Int16Array,
  [ComponentFieldType.U8]: Uint8Array,
  [ComponentFieldType.BOOL]: Uint8Array
} as const

export type FieldTypeToArray = {
  [ComponentFieldType.F32]: Float32Array
  [ComponentFieldType.F64]: Float64Array
  [ComponentFieldType.I32]: Int32Array
  [ComponentFieldType.U32]: Uint32Array
  [ComponentFieldType.I16]: Int16Array
  [ComponentFieldType.U8]: Uint8Array
  [ComponentFieldType.BOOL]: Uint8Array
}

export type Signature = bigint

export interface IArchetype {
  readonly signature: Signature
  readonly lastEntity: number
  readonly size: number

  addEntity(entityId: EntityId): void
  addEntityFrom(entityId: EntityId, entityIndex: number, from: IArchetype): void
  removeEntity(index: number): void
  component(componentId: ComponentId): IComponentData
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
