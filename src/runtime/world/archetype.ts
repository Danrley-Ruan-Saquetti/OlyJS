import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { IColumn } from './column'
import { ComponentRegistry } from './component-registry'

export class Archetype {

  readonly entities: EntityId[] = []

  readonly columns: IColumn[] = []
  readonly columnIds: ComponentId[] = []
  private readonly columnIndex = new Map<ComponentId, number>()

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

  removeEntity(index: number) {
    const last = this.entities.length - 1
    const lastEntity = this.entities[last]

    this.entities[index] = lastEntity
    this.entities.pop()

    let i = 0, length = this.columns.length
    while (i < length) {
      this.columns[i].swap(index, last)
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
