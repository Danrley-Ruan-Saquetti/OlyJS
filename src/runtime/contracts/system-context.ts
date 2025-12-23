import { IWorld } from '../../ecs/world'
import { EventMap, IEventSink } from './event'
import { Input } from './input'
import { DeltaTime } from './time'

export interface SystemContext<Events extends EventMap = {}> {
  readonly world: IWorld
  readonly time: DeltaTime
  readonly input: Input
  readonly events: IEventSink<Events>
}
