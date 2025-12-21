import { World } from '../../ecs/world'
import { EventMap, IEventSink } from './event'
import { DeltaTime } from './time'

export interface SystemContext<Events extends EventMap = {}> {
  readonly world: World
  readonly time: DeltaTime
  readonly events: IEventSink<Events>
}
