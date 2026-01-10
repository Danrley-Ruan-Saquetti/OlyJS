import { IComponent } from '../ecs/component'
import { IActor } from '../gameplay/actor/type'

export class Component implements IComponent {

  constructor(
    readonly owner: IActor
  ) { }
}
