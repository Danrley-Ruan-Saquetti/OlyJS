import { IActor } from '../gameplay/actor/type'
import { ComponentContext } from '../runtime/contracts/context/component.context'

export interface IComponent {
  readonly owner: IActor

  init?(): void
  start?(): void
  stop?(): void
  update?(context: ComponentContext): void
}

export type ComponentClass<ComponentInstance extends IComponent = IComponent> = new (owner: IActor) => ComponentInstance
