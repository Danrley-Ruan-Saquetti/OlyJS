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
  getColumnIndex(componentId: ComponentId): void
  getColumn(componentId: ComponentId): void
}
