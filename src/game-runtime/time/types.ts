import { DeltaTime } from '../../contracts/engine/time'

export interface ITimeSource {
  readonly time: Readonly<DeltaTime>
}

export interface ITimerTrackerController {
  reset(): void
  advance(milliseconds: number): void
}

export interface ITimerTracker extends ITimeSource, ITimerTrackerController { }
