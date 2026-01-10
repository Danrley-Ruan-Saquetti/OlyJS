import { ICommandDomainRegister } from '../contracts/command'
import { SystemContext } from '../contracts/context/system.context'
import { IEventSink } from '../contracts/event'
import { Input } from '../contracts/input'
import { DeltaTime } from '../contracts/time'
import { IWorld } from '../ecs/world'

export class MutableSystemContext implements SystemContext {
  world: IWorld
  time: DeltaTime
  input: Input
  events: IEventSink
  commands: ICommandDomainRegister
}
