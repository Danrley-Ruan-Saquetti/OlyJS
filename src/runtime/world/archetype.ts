import { Signature } from '../../ecs/archetype'
import { EntityId } from '../../ecs/entity'
import { Column } from './column'
import { ComponentRegistry } from './component-registry'

export class Archetype {

  readonly entities: EntityId[] = []
  readonly columns: Column[] = []

  constructor(
    readonly signature: Signature,
    registry: ComponentRegistry
  ) {
    const ids = registry.idsFromSignature(signature)

    for (const id of ids) {
      this.columns[id as any] = registry.createColumn(id)
    }
  }

  get size(): number {
    return this.entities.length
  }
}
