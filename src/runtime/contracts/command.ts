import { EventName, ListenerHandler } from './event'

export type CommandName = EventName
export type CommandHandler<T = unknown> = ListenerHandler<T>

export interface ICommandRegister {
  register(event: CommandName, handler: CommandHandler): void
}

export interface ICommandSender {
  send(event: CommandName, data: unknown): void
}

export interface ICommandPublisher extends
  ICommandRegister,
  ICommandSender { }
