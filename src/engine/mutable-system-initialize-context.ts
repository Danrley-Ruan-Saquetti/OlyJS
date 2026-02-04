import { IScheduler } from '../contracts'
import { SystemInitializeContext } from '../contracts/context/system.context'
import { ICommandDomainRegister } from '../contracts/engine/command'
import { IEventPublisher } from '../contracts/engine/event'
import { IWorld } from '../ecs/world'

export class MutableSystemInitializeContext implements SystemInitializeContext {
  scheduler: IScheduler
  world: IWorld
  events: IEventPublisher
  commands: ICommandDomainRegister
}
