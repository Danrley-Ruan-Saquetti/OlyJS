import { ComponentId } from './component'
import { EntityId } from './entity'

export type Signature = bigint

export interface IArchetype {
  readonly signature: Signature
  readonly lastEntity: number
  readonly size: number

  addEntity(entityId: EntityId): void
  addEntityFrom(entityId: EntityId, entityIndex: number, from: IArchetype): void
  removeEntity(index: number): void
  getColumn(componentId: ComponentId): IColumn
}

export interface IColumn<T = any> {
  pushDefault(): void
  pop(): void
  swap(indexA: number, indexB: number): void
  copyFrom(other: IColumn, index: number): void
  view(index: number): T
}
