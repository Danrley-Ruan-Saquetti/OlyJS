import { DeltaTime } from '@runtime/contracts/time.d'

export interface ITimeSource {
  readonly time: Readonly<DeltaTime>
}

export interface ITimerController {
  reset(): void
  tick(): void
}

export interface ITimer extends ITimeSource, ITimerController { }
