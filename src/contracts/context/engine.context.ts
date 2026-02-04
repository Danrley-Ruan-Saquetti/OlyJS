import { IWorld } from '../../ecs/world'
import { IScheduler } from '../engine/scheduler'

export interface EngineInitializeContext {
  readonly world: IWorld
  readonly scheduler: IScheduler
}
