import { IWorld } from '../ecs/world'
import { Input } from '../runtime'
import { IEventSink } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { DeltaTime } from '../runtime/contracts/time'

export class MutableSystemContext implements SystemContext {
  world: IWorld
  time: DeltaTime
  input: Input
  events: IEventSink
}
