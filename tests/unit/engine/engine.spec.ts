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

  describe('initialize', () => {
    it('deve setar o world no context', () => {
      const world = {}

      engine.initialize({ world } as any)

      expect(engine.context.world).toBe(world)
    })

    it('deve lançar erro quando chamado duas vezes', () => {
      const world = {}

      engine.initialize({ world } as any)

      expect(() => {
        engine.initialize({ world } as any)
      }).toThrow('It is not possible to initialize an engine that has already been initialized')
    })
  })

  describe('start', () => {
    beforeEach(() => {
      engine.initialize({ world: {} } as any)
    })

    it('deve chamar startAll e marcar isRunning como true', () => {
      const startSpy = vi.spyOn(SystemScheduler.prototype, 'startAll')

      engine.start()

      expect(engine.isRunning()).toBe(true)
      expect(startSpy).toHaveBeenCalledTimes(1)
    })

    it('deve lançar erro quando chamado duas vezes', () => {
      engine.start()

      expect(() => {
        engine.start()
      }).toThrow('Engine already started')
    })
  })

  describe('stop', () => {
    it('deve lançar erro quando não está rodando', () => {
      expect(() => {
        engine.stop()
      }).toThrow('Engine already stopped')
    })

    it('deve chamar stopAll e marcar isRunning como false', () => {
      const stopSpy = vi.spyOn(SystemScheduler.prototype, 'stopAll')

      engine.initialize({ world: {} } as any)
      engine.start()
      engine.stop()

      expect(stopSpy).toHaveBeenCalledTimes(1)
      expect(engine.isRunning()).toBe(false)
    })
  })

  describe('tick', () => {
    it('não faz nada quando não está rodando', () => {
      const tickSpy = vi.spyOn(SystemScheduler.prototype, 'tickAll')
      const execSpy = vi.spyOn(DoubleBufferingConsumer.prototype, 'execute')
      const flushSpy = vi.spyOn(CommandScheduler.prototype, 'flushAll')

      engine.tick({} as any)

      expect(tickSpy).toHaveBeenCalledTimes(0)
      expect(execSpy).toHaveBeenCalledTimes(0)
      expect(flushSpy).toHaveBeenCalledTimes(0)
    })

    it('chama tickAll, execute e flushAll na ordem correta quando rodando', () => {
      const order: string[] = []

      vi.spyOn(SystemScheduler.prototype, 'tickAll').mockImplementation(() => order.push('tick'))
      vi.spyOn(DoubleBufferingConsumer.prototype, 'execute').mockImplementation(() => order.push('execute'))
      vi.spyOn(CommandScheduler.prototype, 'flushAll').mockImplementation(() => order.push('flush'))

      engine.initialize({ world: {} } as any)
      engine.start()
      engine.tick({ frame: 1 } as any)

      expect(order).toEqual(['tick', 'execute', 'flush'])
    })
  })

  describe('registerSystem', () => {
    it('delega para SystemScheduler e chama initialize no sistema', () => {
      const sys = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn() }

      engine.registerSystem(sys)

      expect(sys.initialize).toHaveBeenCalledTimes(1)
      expect(sys.initialize).toHaveBeenCalledWith(engine.context)
    })
  })

  describe('registerCommandDomain', () => {
    it('delega para CommandScheduler.register', () => {
      const domain = { flush: vi.fn() }
      const registerSpy = vi.spyOn(CommandScheduler.prototype, 'register')

      engine.registerCommandDomain(domain as any)

      expect(registerSpy).toHaveBeenCalledTimes(1)
      expect(registerSpy).toHaveBeenCalledWith(domain)
    })
  })

  describe('context.events', () => {
    it('send usa DoubleBufferingConsumer.send', () => {
      const sendSpy = vi.spyOn(DoubleBufferingConsumer.prototype, 'send')

      engine.context.events.send('event.test', { ok: true })

      expect(sendSpy).toHaveBeenCalledTimes(1)
      expect(sendSpy).toHaveBeenCalledWith(['event.test', { ok: true }])
    })
  })
})
