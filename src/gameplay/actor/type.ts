import { ActorContext } from '../../contracts/context/actor.context'
import { EntityId } from '../../ecs/entity'

export interface IActor {
  readonly id: EntityId
  readonly context: ActorContext

  init?(): void
  start?(): void
  stop?(): void
}

export type ActorClass<ActorInstance extends IActor = IActor> = new (id: EntityId, context: ActorContext) => ActorInstance
