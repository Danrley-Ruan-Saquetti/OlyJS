import { IWorld } from '../ecs/world'
import { ICommandDomainRegister } from '../runtime/contracts/command'
import { SystemContext } from '../runtime/contracts/context/system.context'
import { IEventSink } from '../runtime/contracts/event'
import { Input } from '../runtime/contracts/input'
import { DeltaTime } from '../runtime/contracts/time'

export class MutableSystemContext implements SystemContext {
  world: IWorld
  time: DeltaTime
  input: Input
  events: IEventSink
  commands: ICommandDomainRegister
}
