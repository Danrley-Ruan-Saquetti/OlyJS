import { Signature } from '../../../../ecs/archetype'
import { ComponentDescriptor, ComponentId, ComponentSchema, IComponentData } from '../../../../ecs/component'
import { ComponentData } from './component-data'

export class ComponentRegistry {

  private schemas = new Map<ComponentId, ComponentSchema>()
  private signatureCache = new Map<string, ComponentId[]>()

  private nextId: ComponentId = 1n

  register<TName extends string, TSchema extends ComponentSchema>(name: TName, schema: TSchema): ComponentDescriptor<TName, TSchema> {
    const id = this.nextId++

    this.schemas.set(id, schema)

    return { id, name, schema }
  }

  createComponent(id: ComponentId, initialCapacity?: number): IComponentData {
    const schema = this.schemas.get(id)

    if (!schema) {
      throw new Error(`Component schema not found for id: ${id}`)
    }

    return new ComponentData(schema, initialCapacity)
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

export const GlobalComponentRegistry = new ComponentRegistry()

export function createComponent<TName extends string, TSchema extends ComponentSchema>(name: TName, schema: TSchema) {
  return GlobalComponentRegistry.register(name, schema)
}
