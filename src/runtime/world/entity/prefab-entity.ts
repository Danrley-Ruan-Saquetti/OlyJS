import { ArchetypeProfile } from '../../../ecs'
import { ComponentDescriptor, ComponentsToObject } from '../../../ecs/component'
import { IWorld } from '../../../ecs/world'
import { mergeComponentData } from '../archetype/components/merge-component-data'

export type PrefabEntityProperties = {
  profile?: ArchetypeProfile
}

export class PrefabEntity<TComponents extends readonly ComponentDescriptor[] = []> {

  constructor(
    private readonly world: IWorld,
    private readonly components: { component: ComponentDescriptor, data?: unknown }[] = [],
    private readonly properties: PrefabEntityProperties = {}
  ) { }

  spawn(overrides?: Partial<ComponentsToObject<TComponents>>) {
    const components = []

    let i = 0, length = this.components.length
    while (i < length) {
      const component = this.components[i]

      const data = overrides
        ? mergeComponentData(component.data, overrides[component.component.name as keyof ComponentsToObject<TComponents>])
        : component.data

      components.push({ component: component.component, data })

      i++
    }

    return this.world.spawn({
      components,
      profile: this.properties.profile
    })
  }

  getQuery() {
    const components = []

    let i = 0, length = this.components.length
    while (i < length) {
      components.push(this.components[i].component)
      i++
    }

    return this.world.getQuery(components)
  }
}
