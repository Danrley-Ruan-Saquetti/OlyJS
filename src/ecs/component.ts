import { IActor } from '../gameplay/actor/type'
import { DeltaTime } from '../runtime/contracts/time'

export interface IComponent {
  readonly owner: IActor

  init?(): void
  start?(): void
  stop?(): void
  update?(deltaTime: DeltaTime): void
}

export type ComponentClass<ComponentInstance extends IComponent = IComponent> = new (owner: IActor) => ComponentInstance
