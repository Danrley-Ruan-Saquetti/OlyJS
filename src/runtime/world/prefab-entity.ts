import { ComponentDescriptor, ComponentId, IWorld } from '../../ecs'
import { ComponentsToObject } from '../../ecs/component'

export type ComponentMap = ReadonlyMap<ComponentId, unknown>

export class PrefabEntity<TComponents extends readonly ComponentDescriptor[] = []> {

  constructor(
    private readonly world: IWorld,
    private readonly components: { component: ComponentDescriptor, data?: unknown }[] = []
  ) { }

  spawn(overrides?: Partial<ComponentsToObject<TComponents>>) {
    const components = []

    let i = 0, length = this.components.length
    while (i < length) {
      const component = this.components[i]

      components.push({
        component: component.component,
        data: overrides?.[component.component.name as keyof ComponentsToObject<TComponents>] ?? component.data
      })
      i++
    }

    return this.world.instantiate(components)
  }
}
