import { Signature } from '../../../ecs/archetype'
import { ComponentId } from '../../../ecs/component'
import { EntityId } from '../../../ecs/entity'
import { ComponentRegistry } from '../component-registry'
import { IColumn } from './column'

export class Archetype {

  readonly entities: EntityId[] = []

  readonly columns: IColumn[] = []
  readonly columnIds: ComponentId[] = []
  private readonly columnIndex = new Map<ComponentId, number>()

  get lastEntity() {
    return this.entities[this.entities.length]
  }

  get size() {
    return this.entities.length
  }

  constructor(
    readonly signature: Signature,
    registry: ComponentRegistry
  ) {
    const ids = registry.idsFromSignature(signature)

    let i = 0, length = ids.length
    while (i < length) {
      this.columnIds.push(ids[i])
      this.columns.push(registry.createColumn(ids[i]))
      this.columnIndex.set(ids[i], this.columns.length - 1)

      i++
    }
  }

  addEntity(entityId: EntityId) {
    this.entities.push(entityId)

    let i = 0, length = this.columns.length
    while (i < length) {
      this.columns[i].pushDefault()
      i++
    }
  }

  addEntityFrom(entityId: EntityId, entityIndex: number, from: Archetype) {
    this.entities.push(entityId)

    let i = 0, length = from.columns.length
    while (i < length) {
      const componentId = from.columnIds[i]
      const toColumnIndex = this.columnIndex.get(componentId)

      if (toColumnIndex) {
        this.columns[toColumnIndex].copyFrom(from.columns[i], entityIndex)
      }

      i++
    }
  }

  removeEntity(index: number) {
    const lastIndex = this.entities.length - 1
    const lastEntity = this.entities[lastIndex]

    this.entities[index] = lastEntity
    this.entities.pop()

    let i = 0, length = this.columns.length
    while (i < length) {
      this.columns[i].swap(index, lastIndex)
      this.columns[i].pop()

      i++
    }
  }

  getColumnIndex(componentId: ComponentId) {
    return this.columnIndex.get(componentId) ?? -1
  }

  getColumn(componentId: ComponentId) {
    const idx = this.getColumnIndex(componentId)
    return idx >= 0 ? this.columns[idx] : undefined
  }
}
