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

  constructor(
    readonly signature: Signature,
    registry: ComponentRegistry
  ) {
    const ids = registry.idsFromSignature(signature)

    for (const id of ids) {
      this.columnIds.push(id)
      this.columns.push(registry.createColumn(id))

      this.columnIndex.set(id, this.columns.length - 1)
    }
  }

  get size() {
    return this.entities.length
  }

  getColumnIndex(componentId: ComponentId) {
    return this.columnIndex.get(componentId) ?? -1
  }

  getColumn(componentId: ComponentId) {
    const idx = this.getColumnIndex(componentId)
    return idx >= 0 ? this.columns[idx] : undefined
  }
}
