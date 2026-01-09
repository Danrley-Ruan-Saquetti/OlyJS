import { EntityId } from '../../ecs/entity'
import { ActorContext } from '../../runtime/contracts/context/actor.context'

export interface IActor {
  readonly id: EntityId

  start?(): void
  stop?(): void
}

export type ActorClass<ActorInstance extends IActor = IActor> = new (id: EntityId, context: ActorContext) => ActorInstance
