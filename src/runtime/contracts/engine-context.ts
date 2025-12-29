import { IWorld } from '../../ecs/world'
import { ICommandPublisher } from './command'
import { IEventPublisher } from './event'

export interface EngineContext {
  readonly world: IWorld
  readonly events: IEventPublisher
  readonly commands: ICommandPublisher
}

export interface EngineStartContext {
  readonly world: IWorld
}
