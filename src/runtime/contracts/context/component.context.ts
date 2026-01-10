import { IWorld } from '../../../ecs/world'
import { IEventSink } from '../event'
import { Input } from '../input'
import { DeltaTime } from '../time'

export interface ComponentContext {
  readonly world: IWorld
  readonly time: DeltaTime
  readonly input: Input
  readonly events: IEventSink
}
