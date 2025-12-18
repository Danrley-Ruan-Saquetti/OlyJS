import { World } from '@ecs/world.js'
import { EventMap, IEventQueueProcessor } from '@runtime/contracts/event.js'
import { DeltaTime } from '@runtime/contracts/time.js'

export interface SystemContext<Events extends EventMap = {}> {
  world: World
  deltaTime: DeltaTime
  events: IEventQueueProcessor<Events>
}
