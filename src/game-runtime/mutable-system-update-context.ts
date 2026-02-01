import { SystemUpdateContext } from '../contracts/context/system.context'
import { ICommandDomainRegister } from '../contracts/engine/command'
import { IEventSink } from '../contracts/engine/event'
import { Input } from '../contracts/engine/input'
import { DeltaTime } from '../contracts/engine/time'
import { IWorld } from '../ecs/world'

export class MutableSystemUpdateContext implements SystemUpdateContext {
  world: IWorld
  time: DeltaTime
  input: Input
  events: IEventSink
  commands: ICommandDomainRegister
}
