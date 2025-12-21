import { ISystem } from '../ecs/system'
import { EventMap, SystemContext } from '../runtime'
import { EngineContext } from '../runtime/contracts/engine-context'

export abstract class EngineSystem<Events extends EventMap = {}> implements ISystem<Events> {

  start(context: EngineContext<Events>) { }

  stop() { }

  update(context: SystemContext<Events>) { }
}
