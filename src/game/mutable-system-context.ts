import { IWorld } from '../ecs/world'
import { Input } from '../runtime'
import { EventMap, IEventSink } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { DeltaTime } from '../runtime/contracts/time'

export class MutableSystemContext<Events extends EventMap = any> implements SystemContext<Events> {

  world: IWorld
  time: DeltaTime
  input: Input
  events: IEventSink<Events>
}
