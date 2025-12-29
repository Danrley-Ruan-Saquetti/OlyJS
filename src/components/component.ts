import { IComponent } from '../ecs/component'
import { IActor } from '../gameplay'

export class Component implements IComponent {

  constructor(
    readonly owner: IActor
  ) { }
}
