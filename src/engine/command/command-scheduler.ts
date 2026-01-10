import { ICommandDomain } from '../../contracts/command'

export class CommandScheduler {

  private readonly domains: ICommandDomain[] = []

  register(domain: ICommandDomain) {
    this.domains.push(domain)
  }

  flushAll() {
    let i = 0, length = this.domains.length
    while (i < length) {
      this.domains[i].flush()
      i++
    }
  }
}
