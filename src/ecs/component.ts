import { IActor } from '../gameplay/actor/type'

export interface IComponent {
  readonly owner: IActor

  start?(): void
  stop?(): void
  update?(): void
}

export type ComponentInstance<ComponentClass extends IComponent = IComponent> = new (owner: IActor) => ComponentClass
