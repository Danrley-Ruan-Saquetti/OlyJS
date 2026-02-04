import { IWorld } from '../../ecs/world'
import { ICommandDomainRegister } from '../engine/command'
import { IEventPublisher } from '../engine/event'
import { Input } from '../engine/input'
import { IScheduler } from '../engine/scheduler'
import { DeltaTime } from '../engine/time'

export interface SystemInitializeContext {
  readonly world: IWorld
  readonly events: IEventPublisher
  readonly commands: ICommandDomainRegister
  readonly scheduler: IScheduler
}

export interface SystemUpdateContext {
  readonly time: DeltaTime
  readonly input: Input
}
