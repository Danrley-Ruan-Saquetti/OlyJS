import { ISystem } from '../ecs/system'
import { SystemContext } from '../runtime'
import { EngineContext } from '../runtime/contracts/engine-context'

export abstract class EngineSystem implements ISystem {

  start(context: EngineContext) { }

  stop() { }

  update(context: SystemContext) { }
}
