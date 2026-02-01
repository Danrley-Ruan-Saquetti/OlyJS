import { SystemUpdateContext } from '../contracts/context/system.context'
import { Input } from '../contracts/engine/input'
import { DeltaTime } from '../contracts/engine/time'

export class MutableSystemUpdateContext implements SystemUpdateContext {
  time: DeltaTime
  input: Input
}
