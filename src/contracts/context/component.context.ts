import { IWorld } from '../../ecs/world'
import { IEventSink } from '../engine/event'
import { Input } from '../engine/input'
import { DeltaTime } from '../engine/time'

export interface ComponentContext {
  readonly world: IWorld
  readonly time: DeltaTime
  readonly input: Input
  readonly events: IEventSink
}
