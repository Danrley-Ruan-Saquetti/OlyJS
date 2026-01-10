export class CommandListenerAlreadyRegisteredException extends Error {

  constructor(event: string) {
    super(`Event "${event}" already registered for this command domain`)
  }
}
