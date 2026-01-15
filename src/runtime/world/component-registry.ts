import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { Column } from './column'
import { ComponentDescriptor, ComponentSchema } from './component'

export class ComponentRegistry {

  private schemas = new Map<ComponentId, ComponentSchema>()

  register(descriptor: ComponentDescriptor): void {
    this.schemas.set(descriptor.id, descriptor.schema)
  }

  createColumn(id: ComponentId) {
    const schema = this.schemas.get(id)

    if (!schema) {
      throw new Error(`Component schema not found for id: ${id}`)
    }

    return new Column(schema, id)
  }

  idsFromSignature(sig: Signature) {
    const ids: bigint[] = []
    let bit = 0n

    while (sig > 0n) {
      if ((sig & 1n) !== 0n) {
        ids.push(bit)
      }

      sig >>= 1n
      bit++
    }

    return ids
  }
}
