import { IArchetype, Signature } from '../../../ecs/archetype'
import { ComponentId, IComponentData } from '../../../ecs/component'
import { EntityId } from '../../../ecs/entity'
import { ComponentRegistry } from '../component-registry'

export class Archetype implements IArchetype {

  private readonly entities: EntityId[] = []

  private readonly components: IComponentData[] = []
  private readonly componentIds: ComponentId[] = []
  private readonly componentIndex = new Map<ComponentId, number>()

  get lastEntity() {
    return this.entities[this.entities.length - 1]
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
      this.componentIds.push(ids[i])
      this.components.push(registry.createComponent(ids[i]))
      this.componentIndex.set(ids[i], this.components.length - 1)

      i++
    }
  }

  addEntity(entityId: EntityId) {
    this.entities.push(entityId)

    let i = 0, length = this.components.length
    while (i < length) {
      this.components[i].pushDefault()
      i++
    }
  }

  addEntityFrom(entityId: EntityId, entityIndex: number, from: Archetype) {
    this.entities.push(entityId)

    let i = 0, length = from.components.length
    while (i < length) {
      const componentId = from.componentIds[i]
      const toIndex = this.componentIndex.get(componentId)

      if (toIndex !== undefined) {
        this.components[toIndex].copyFrom(from.components[i], entityIndex)
      }

      i++
    }
  }

  removeEntity(index: number) {
    const lastIndex = this.entities.length - 1
    const lastEntity = this.entities[lastIndex]

    this.entities[index] = lastEntity
    this.entities.pop()

    let i = 0, length = this.components.length
    while (i < length) {
      this.components[i].swap(index, lastIndex)
      this.components[i].pop()

      i++
    }
  }

  component(componentId: ComponentId) {
    return this.components[this.componentIndex.get(componentId)!]
  }
}
