import { ComponentDescriptor, ComponentsToObject, InferSchemaValues } from '../../../ecs/component'
import { IWorld } from '../../../ecs/world'
import { PrefabEntity, PrefabEntityProperties } from '../entity/prefab-entity'

export class EntityBuilder<TComponents extends readonly ComponentDescriptor[] = []> {

  private readonly defaults: Partial<ComponentsToObject<TComponents>> = {}
  private readonly components: { component: ComponentDescriptor, data?: unknown }[] = []

  constructor(
    private readonly world: IWorld,
    private readonly properties: PrefabEntityProperties = {}
  ) { }

  with<TComponent extends ComponentDescriptor>(component: TComponent, defaultValue?: Partial<InferSchemaValues<TComponent['schema']>>) {
    (this.defaults as any)[component.name] = defaultValue ?? {}

    this.components.push({ component, data: defaultValue })

    return this as EntityBuilder<[...TComponents, TComponent]>
  }

  build() {
    return new PrefabEntity<TComponents>(this.world, this.components, this.properties)
  }
}
