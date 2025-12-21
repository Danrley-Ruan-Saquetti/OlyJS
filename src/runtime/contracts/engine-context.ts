import { World } from '../../ecs/world'
import { EventMap, IEventBus } from './event'

export interface EngineContext<Events extends EventMap = {}> {
  readonly world: World
  readonly events: IEventBus<Events>
}
