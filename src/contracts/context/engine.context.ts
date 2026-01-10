import { IWorld } from '../../ecs/world'
import { ICommandDomainRegister } from '../command'
import { IEventPublisher } from '../event'

export interface EngineContext {
  readonly world: IWorld
  readonly events: IEventPublisher
  readonly commands: ICommandDomainRegister
}

export interface EngineStartContext {
  readonly world: IWorld
}
