import { IWorld } from '../../ecs/world'
import { ICommandDomainRegister } from '../engine/command'
import { IEventPublisher, IEventSink } from '../engine/event'
import { Input } from '../engine/input'
import { DeltaTime } from '../engine/time'

export interface SystemInitializeContext {
  readonly world: IWorld
  readonly events: IEventPublisher
  readonly commands: ICommandDomainRegister
}

export interface SystemContext {
  readonly world: IWorld
  readonly time: DeltaTime
  readonly input: Input
  readonly events: IEventSink
  readonly commands: ICommandDomainRegister
}
