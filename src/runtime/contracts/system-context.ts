import { World } from '../../ecs/world'
import { EventMap, IEventSender } from './event'
import { DeltaTime } from './time'

export type IEventSink<Events extends EventMap = {}> = IEventSender<Events>

export interface SystemContext<Events extends EventMap = {}> {
  readonly world: World
  readonly deltaTime: DeltaTime
  readonly events: IEventSink<Events>
}
