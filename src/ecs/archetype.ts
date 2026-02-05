import { ComponentDescriptor, ComponentSchema, IComponentData } from './component'
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

export type Signature = bigint

export interface IArchetype {
  readonly signature: Signature
  readonly lastEntity: number
  readonly size: number
  readonly entities: EntityId[]

  addEntity(entityId: EntityId, initialData?: Record<number, any>): void
  addEntityFrom(entityId: EntityId, entityIndex: number, from: IArchetype, initialData?: Record<number, any>): void
  removeEntity(index: number): void
  component<TName extends string, TShape extends ComponentSchema>(component: ComponentDescriptor<TName, TShape>): IComponentData<{ [x in keyof TShape]: TypedArray }>
}
