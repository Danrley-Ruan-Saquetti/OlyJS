import { World } from '@ecs/world'
import { EventMap, IEventQueueProcessor } from '@runtime/contracts/event'
import { DeltaTime } from '@runtime/contracts/time'

export interface SystemContext<Events extends EventMap = {}> {
  world: World
  deltaTime: DeltaTime
  events: IEventQueueProcessor<Events>
}
