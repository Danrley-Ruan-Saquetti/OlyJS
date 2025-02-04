import { IEvents, ListenerHandler } from '../utils/index.js'

export interface IObservable<Events extends IEvents> {
  on<EventName extends keyof Events>(event: EventName, handler: ListenerHandler<Events[EventName]>): void
  off<EventName extends keyof Events>(event: EventName, handler: ListenerHandler<Events[EventName]>): void
  emit<EventName extends keyof Events>(event: EventName, data?: Events[EventName]): void
  getListenersByEvent<EventName extends keyof Events>(event: EventName): ListenerHandler[]
  getAllListeners(): ListenerHandler[]
  removeAllListeners(): void
}