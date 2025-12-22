import { World } from '../ecs/world'
import { EventMap, IEventSink } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { DeltaTime } from '../runtime/contracts/time'

export class MutableSystemContext<Events extends EventMap = any> implements SystemContext<Events> {

  world: World
  time: DeltaTime
  events: IEventSink<Events>

}
