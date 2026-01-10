import { EntityId } from '../../ecs/entity'
import { ActorContext } from '../../runtime/contracts/context/actor.context'

export interface IActor {
  readonly id: EntityId
  readonly context: ActorContext

  init?(): void
  start?(): void
  stop?(): void
}

export type ActorClass<ActorInstance extends IActor = IActor> = new (id: EntityId, context: ActorContext) => ActorInstance
