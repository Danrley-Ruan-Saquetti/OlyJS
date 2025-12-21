import { World } from '../../ecs/world'
import { EventMap, IEventListenerRegistry, IEventSink } from './event'

export interface EngineContext<Events extends EventMap = {}> {
  readonly world: World
  readonly events: IEventSink<Events> & IEventListenerRegistry<Events>
}
