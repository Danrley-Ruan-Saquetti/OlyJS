import { IWorld } from '../ecs/world'
import { Input } from '../runtime'
import { SystemContext } from '../runtime/contracts/context/system.context'
import { IEventSink } from '../runtime/contracts/event'
import { DeltaTime } from '../runtime/contracts/time'

export class MutableSystemContext implements SystemContext {
  world: IWorld
  time: DeltaTime
  input: Input
  events: IEventSink
}
