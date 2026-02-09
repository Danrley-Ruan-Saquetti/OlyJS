import { ComponentDescriptor, ComponentsToObject, InferSchemaValues } from '../../../ecs/component'
import { PrefabEntityProperties } from '../entity/prefab-entity'
import { PrefabDefinition } from './prefab-definition'

export class EntityBuilder<TComponents extends readonly ComponentDescriptor[] = []> {

  private readonly defaults: Partial<ComponentsToObject<TComponents>> = {}
  private readonly components: { component: ComponentDescriptor, data?: unknown }[] = []

  constructor(
    private readonly properties: PrefabEntityProperties = {}
  ) { }

  with<TComponent extends ComponentDescriptor>(component: TComponent, defaultValue?: Partial<InferSchemaValues<TComponent['schema']>>) {
    (this.defaults as any)[component.name] = defaultValue ?? {}

    this.components.push({ component, data: defaultValue })

    return this as EntityBuilder<[...TComponents, TComponent]>
  }

  build() {
    return new PrefabDefinition<TComponents>(this.components, this.properties)
  }
}
