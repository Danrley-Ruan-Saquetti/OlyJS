import { EntityId } from '../../ecs'
import { IActor } from './type'

export class Actor implements IActor {

  constructor(
    readonly id: EntityId
  ) { }

}
