import { EntityId } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'

export interface IActor {
  readonly id: EntityId

  start?(): void
  stop?(): void
}

export type ActorClass<ActorInstance extends IActor = IActor> = new (id: EntityId, world: IWorld) => ActorInstance
