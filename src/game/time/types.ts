import { DeltaTime } from '../../contracts/time'

export interface ITimeSource {
  readonly time: Readonly<DeltaTime>
}

export interface ITimerTrackerController {
  reset(): void
  advance(milliseconds: number): void
}

export interface ITimerTracker extends ITimeSource, ITimerTrackerController { }
