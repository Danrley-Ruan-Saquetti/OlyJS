import { World } from '@ecs/world'
import { EventMap, IEventSender } from '@runtime/contracts/event'
import { DeltaTime } from '@runtime/contracts/time'

export type IEventSink<Events extends EventMap = {}> = IEventSender<Events>

export interface SystemContext<Events extends EventMap = {}> {
  readonly world: World
  readonly deltaTime: DeltaTime
  readonly events: IEventSink<Events>
}
