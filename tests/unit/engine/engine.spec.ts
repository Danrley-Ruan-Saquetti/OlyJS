import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CommandScheduler } from '../../../src/engine/command/command-scheduler'
import { Engine } from '../../../src/engine/engine'
import { SystemScheduler } from '../../../src/engine/system/system-scheduler'
import { DoubleBufferingConsumer } from '../../../src/runtime/buffer/double-buffering-consumer'

describe('Engine', () => {
  let engine: Engine

  beforeEach(() => {
    vi.restoreAllMocks()
    engine = new Engine()
  })

  it('start deve setar world, chamar startAll e marcar isRunning', () => {
    const world = {}
    const startSpy = vi.spyOn(SystemScheduler.prototype, 'startAll')

    engine.start({ world } as any)

    expect(engine.context.world).toBe(world)
    expect(engine.isRunning()).toBe(true)
    expect(startSpy).toHaveBeenCalledTimes(1)
  })

  it('start não deve chamar startAll novamente se já estiver rodando', () => {
    const startSpy = vi.spyOn(SystemScheduler.prototype, 'startAll')

    engine.start({ world: {} } as any)
    engine.start({ world: {} } as any)

    expect(startSpy).toHaveBeenCalledTimes(1)
  })

  it('stop não deve chamar stopAll quando não está rodando', () => {
    const stopSpy = vi.spyOn(SystemScheduler.prototype, 'stopAll')

    engine.stop()

    expect(stopSpy).toHaveBeenCalledTimes(0)
    expect(engine.isRunning()).toBe(false)
  })

  it('stop deve chamar stopAll e marcar isRunning false', () => {
    const stopSpy = vi.spyOn(SystemScheduler.prototype, 'stopAll')

    engine.start({ world: {} } as any)
    engine.stop()

    expect(stopSpy).toHaveBeenCalledTimes(1)
    expect(engine.isRunning()).toBe(false)
  })

  it('tick não faz nada quando não está rodando', () => {
    const tickSpy = vi.spyOn(SystemScheduler.prototype, 'tickAll')
    const execSpy = vi.spyOn(DoubleBufferingConsumer.prototype, 'execute')
    const flushSpy = vi.spyOn(CommandScheduler.prototype, 'flushAll')

    engine.tick({} as any)

    expect(tickSpy).toHaveBeenCalledTimes(0)
    expect(execSpy).toHaveBeenCalledTimes(0)
    expect(flushSpy).toHaveBeenCalledTimes(0)
  })

  it('tick chama tickAll, execute e flushAll na ordem correta quando rodando', () => {
    const order: string[] = []

    vi.spyOn(SystemScheduler.prototype, 'tickAll').mockImplementation(() => order.push('tick'))
    vi.spyOn(DoubleBufferingConsumer.prototype, 'execute').mockImplementation(() => order.push('execute'))
    vi.spyOn(CommandScheduler.prototype, 'flushAll').mockImplementation(() => order.push('flush'))

    engine.start({ world: {} } as any)
    engine.tick({ frame: 1 } as any)

    expect(order).toEqual(['tick', 'execute', 'flush'])
  })

  it('registerSystem delega para SystemScheduler e chama initialize no sistema', () => {
    const sys = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn() }

    engine.registerSystem(sys)

    expect(sys.initialize).toHaveBeenCalledTimes(1)
    expect(sys.initialize).toHaveBeenCalledWith(engine.context)
  })

  it('registerCommandDomain delega para CommandScheduler.register', () => {
    const domain = { flush: vi.fn() }
    const registerSpy = vi.spyOn(CommandScheduler.prototype, 'register')

    engine.registerCommandDomain(domain as any)

    expect(registerSpy).toHaveBeenCalledTimes(1)
    expect(registerSpy).toHaveBeenCalledWith(domain)
  })

  it('context.events.send usa DoubleBufferingConsumer.send', () => {
    const sendSpy = vi.spyOn(DoubleBufferingConsumer.prototype, 'send')

    engine.context.events.send('event.test', { ok: true })

    expect(sendSpy).toHaveBeenCalledTimes(1)
    expect(sendSpy).toHaveBeenCalledWith(['event.test', { ok: true }])
  })
})
