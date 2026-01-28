import { IWorld } from '../../ecs/world'
import { ICommandDomainRegister } from '../engine/command'
import { IEventPublisher } from '../engine/event'

export interface EngineContext {
  readonly world: IWorld
  readonly events: IEventPublisher
  readonly commands: ICommandDomainRegister
}

export interface EngineInitializeContext {
  readonly world: IWorld
}
