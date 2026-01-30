import { ComponentFieldType } from '../../ecs'
import { ComponentDescriptor, ComponentId, ComponentSchema } from '../../ecs/component'
import { createComponent } from './component-registry'

export type ComponentMap = Map<ComponentId, unknown>

export class EntityBuilder<TComponents extends {} = {}> {

  private readonly defaults: ComponentMap = new Map()

  with<Schema extends ComponentSchema>(component: ComponentDescriptor<Schema>, defaultValue?: Partial<Record<keyof Schema, number>>): EntityBuilder<TComponents & { [P in keyof any]: Schema }> {
    this.defaults.set(component.id, defaultValue)

    return this
  }
}

const Position = createComponent({ x: ComponentFieldType.F32, y: ComponentFieldType.F32 })
const Velocity = createComponent({ x: ComponentFieldType.F32, y: ComponentFieldType.F32, z: ComponentFieldType.F32 })

const player = new EntityBuilder()
  .with(Position, { x: 1, y: 6 })
  .with(Velocity)
