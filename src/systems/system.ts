import { EventMap } from '@common/event/types'
import { IEngine, IEngineRegisterEvent } from '@core/types'

export abstract class EngineSystem<Events extends EventMap = any> implements IEngineRegisterEvent<Events> {

  abstract registerEngine(engine: IEngine<Events>): void;
}
