import { EntityId } from '../../ecs'
import { ActorContext } from '../../runtime/contracts/context/actor.context'
import { IActor } from './type'

export class Actor implements IActor {

  constructor(
    readonly id: EntityId,
    readonly context: ActorContext
  ) { }
}
