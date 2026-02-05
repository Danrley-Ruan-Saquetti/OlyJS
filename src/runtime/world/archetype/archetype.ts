import { IArchetype, Signature, TypedArray } from '../../../ecs/archetype'
import { ComponentDescriptor, ComponentId, ComponentSchema, IComponentData } from '../../../ecs/component'
import { EntityId } from '../../../ecs/entity'
import { ComponentRegistry } from '../component-registry'

export class Archetype implements IArchetype {

  private readonly _entities: EntityId[] = []

  private readonly components: IComponentData[] = []
  private readonly componentIds: ComponentId[] = []
  private readonly componentIndex = new Map<ComponentId, number>()

  get entities() { return this._entities }
  get lastEntity() { return this._entities[this._entities.length - 1] }
  get size() { return this._entities.length }

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
    this._entities.push(entityId)

    let i = 0, length = this.components.length
    while (i < length) {
      this.components[i].push()
      i++
    }
  }

  addEntityFrom(entityId: EntityId, entityIndex: number, from: Archetype, initialData?: Record<number, any>) {
    this._entities.push(entityId)

    let i = 0, length = this.components.length
    while (i < length) {
      const componentId = this.componentIds[i]
      const fromIndex = from.componentIndex.get(componentId)

      if (fromIndex !== undefined) {
        this.components[i].copyFrom(from.components[fromIndex], entityIndex)
      } else {
        const initial = initialData ? initialData[componentId as any] : undefined
        this.components[i].push(initial)
      }

      i++
    }
  }

  removeEntity(index: number) {
    const lastIndex = this._entities.length - 1
    const lastEntity = this._entities[lastIndex]

    this._entities[index] = lastEntity
    this._entities.pop()

    let i = 0, length = this.components.length
    while (i < length) {
      this.components[i].swap(index, lastIndex)
      this.components[i].pop()

      i++
    }
  }

  component<TName extends string, TShape extends ComponentSchema>(component: ComponentDescriptor<TName, TShape>) {
    return this.components[this.componentIndex.get(component.id)!] as IComponentData<{ [x in keyof TShape]: TypedArray }>
  }
}
