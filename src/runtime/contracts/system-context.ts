import { World } from '@ecs/world'
import { EventMap } from '@runtime/contracts/event'
import { DeltaTime } from '@runtime/contracts/time'

export interface IEventSink<Events extends EventMap = {}> {
  send<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface SystemContext<Events extends EventMap = {}> {
  world: World
  deltaTime: DeltaTime
  events: IEventSink<Events>
}
