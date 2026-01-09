import { ISystem } from '../ecs/system'
import { SystemContext } from '../runtime'
import { EngineContext } from '../runtime/contracts/context/engine.context'

export abstract class EngineSystem implements ISystem {

  initialize(context: EngineContext) { }

  start() { }

  stop() { }

  update(context: SystemContext) { }
}
