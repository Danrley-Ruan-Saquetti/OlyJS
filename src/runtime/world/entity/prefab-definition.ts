import { IWorld } from '../../../ecs'
import { ComponentDescriptor } from '../../../ecs/component'
import { PrefabEntity, PrefabEntityProperties } from './prefab-entity'

export class PrefabDefinition<TComponents extends readonly ComponentDescriptor[] = []> {

  constructor(
    private readonly components: { component: ComponentDescriptor, data?: unknown }[] = [],
    private readonly properties: PrefabEntityProperties = {}
  ) { }

  instantiate(world: IWorld) {
    return new PrefabEntity<TComponents>(world, this.components, this.properties)
  }
}
