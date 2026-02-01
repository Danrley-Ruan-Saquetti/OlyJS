import { SystemContext, SystemInitializeContext } from '../../contracts/context/system.context'
import { ISystem } from '../../ecs/system'

export abstract class System implements ISystem {

  initialize(context: SystemInitializeContext) { }

  start() { }

  stop() { }

  update(context: SystemContext) { }
}
