import { World } from '../../ecs/world'
import { EventMap, IEventPublisher } from './event'

export interface EngineContext<Events extends EventMap = {}> {
  readonly world: World
  readonly events: IEventPublisher<Events>
}

export interface EngineStartContext {
  readonly world: World
}
