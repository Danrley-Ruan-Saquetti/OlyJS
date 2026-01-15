import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { Column, IColumn } from './column'
import { ComponentDescriptor, ComponentSchema } from './component'

export class ComponentRegistry {

  private schemas = new Map<ComponentId, ComponentSchema>()
  private signatureCache = new Map<string, ComponentId[]>()

  register(descriptor: ComponentDescriptor): void {
    this.schemas.set(descriptor.id, descriptor.schema)
  }

  createColumn(id: ComponentId): IColumn {
    const schema = this.schemas.get(id)

    if (!schema) {
      throw new Error(`Component schema not found for id: ${id}`)
    }

    return new Column(schema)
  }

  idsFromSignature(sig: Signature) {
    const key = sig.toString()
    let ids = this.signatureCache.get(key)

    if (ids) {
      return ids
    }

    ids = []

    let bit = 0n
    while (sig > 0n) {
      if ((sig & 1n) !== 0n) {
        ids.push(bit as ComponentId)
      }

      sig >>= 1n
      bit++
    }

    this.signatureCache.set(key, ids)

    return ids
  }
}
