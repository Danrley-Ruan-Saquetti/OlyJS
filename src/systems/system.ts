import { EngineContext } from '../contracts/context/engine.context'
import { SystemContext } from '../contracts/context/system.context'
import { ISystem } from '../ecs/system'

export abstract class System implements ISystem {

  initialize(context: EngineContext) { }

  start() { }

  stop() { }

  update(context: SystemContext) { }
}
