import { ActorContext } from '../../contracts/context/actor.context'
import { EntityId } from '../../ecs/entity'
import { IActor } from './type'

export class Actor implements IActor {

  constructor(
    readonly id: EntityId,
    readonly context: ActorContext
  ) { }
}
