import { IWorld } from '../../ecs/world'
import { ICommandDomainRegister } from '../command'
import { IEventSink } from '../event'
import { Input } from '../input'
import { DeltaTime } from '../time'

export interface SystemContext {
  readonly world: IWorld
  readonly time: DeltaTime
  readonly input: Input
  readonly events: IEventSink
  readonly commands: ICommandDomainRegister
}
