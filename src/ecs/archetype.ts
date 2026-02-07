import { ComponentDescriptor, ComponentSchema, IComponentData } from './component'
import { EntityId } from './entity'

export type Signature = bigint

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float16Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

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
