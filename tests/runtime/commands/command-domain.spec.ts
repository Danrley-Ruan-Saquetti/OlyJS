import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CommandDomain } from './../../../src/runtime/commands/command-domain'

describe('Runtime: CommandDomain', () => {
  let domain: CommandDomain

  beforeEach(() => {
    domain = new CommandDomain()
  })

  describe('Construtor', () => {
    it('deve criar domain com maxPriority padrão de 8', () => {
      const testDomain = new CommandDomain()

      expect(testDomain).toBeDefined()
    })

    it('deve criar domain com maxPriority customizado', () => {
      const testDomain = new CommandDomain(16)

      expect(testDomain).toBeDefined()
    })

    it('deve criar domain com maxPriority = 1', () => {
      const testDomain = new CommandDomain(1)

      expect(testDomain).toBeDefined()
    })

    it('deve inicializar com dois buffers vazios', () => {
      const testDomain = new CommandDomain(4)

      expect(() => {
        testDomain.flush()
      }).not.toThrow()
    })
  })

  describe('Registro de Comandos', () => {
    it('deve registrar um comando com handler', () => {
      const handler = vi.fn()

      expect(() => {
        domain.register('move', handler)
      }).not.toThrow()
    })

    it('deve registrar múltiplos comandos diferentes', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()

      domain.register('move', handler1)
      domain.register('jump', handler2)
      domain.register('attack', handler3)

      expect(() => {
        domain.register('move', handler1)
      }).toThrow()
    })

    it('deve registrar comando com priority padrão = 0', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      expect(() => {
        domain.send('cmd', {})
      }).not.toThrow()
    })

    it('deve registrar comando com priority customizada', () => {
      const handler = vi.fn()
      domain.register('high_priority_cmd', handler, 5)

      expect(() => {
        domain.send('high_priority_cmd', {})
      }).not.toThrow()
    })

    it('deve registrar comando com priority máxima', () => {
      const handler = vi.fn()
      domain.register('max_priority', handler, 7)

      domain.send('max_priority', {})

      domain.flush()

      expect(handler).toHaveBeenCalled()
    })

    it('deve lançar erro ao registrar comando duplicado', () => {
      const handler = vi.fn()
      domain.register('duplicate', handler)

      expect(() => {
        domain.register('duplicate', handler)
      }).toThrow('Event "duplicate" already registered for this command domain')
    })

    it('deve lançar erro com mensagem correta para comando duplicado', () => {
      const handler = vi.fn()
      domain.register('test_cmd', handler)

      try {
        domain.register('test_cmd', vi.fn())

        expect(true).toBe(false)
      } catch (error) {
        expect((error as Error).message).toContain('test_cmd')
        expect((error as Error).message).toContain('already registered')
      }
    })
  })

  describe('Envio de Comandos', () => {
    beforeEach(() => {
      domain.register('test', vi.fn())
    })

    it('deve enviar um comando', () => {
      expect(() => {
        domain.send('test', { value: 42 })
      }).not.toThrow()
    })

    it('deve enviar múltiplos comandos diferentes', () => {
      domain.register('cmd1', vi.fn())
      domain.register('cmd2', vi.fn())
      domain.register('cmd3', vi.fn())

      domain.send('cmd1', {})
      domain.send('cmd2', {})
      domain.send('cmd3', {})

      expect(() => {
        domain.flush()
      }).not.toThrow()
    })

    it('deve enviar múltiplos comandos iguais', () => {
      const handler = vi.fn()
      domain.register('repeat', handler)

      domain.send('repeat', { id: 1 })
      domain.send('repeat', { id: 2 })
      domain.send('repeat', { id: 3 })

      domain.flush()

      expect(handler).toHaveBeenCalledTimes(3)
    })

    it('deve aceitar null como data', () => {
      const handler = vi.fn()
      domain.register('nullable', handler)

      domain.send('nullable', null)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(null)
    })

    it('deve aceitar undefined como data', () => {
      const handler = vi.fn()
      domain.register('undefinable', handler)

      domain.send('undefinable', undefined)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(undefined)
    })
  })

  describe('Processamento - Flush Básico', () => {
    it('deve executar handler ao fazer flush', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', { test: 'data' })
      domain.flush()

      expect(handler).toHaveBeenCalled()
      expect(handler).toHaveBeenCalledWith({ test: 'data' })
    })

    it('deve fazer flush de buffer vazio sem erros', () => {
      expect(() => {
        domain.flush()
      }).not.toThrow()
    })

    it('deve fazer flush múltiplo', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 1)
      domain.flush()

      domain.send('cmd', 2)
      domain.flush()

      domain.send('cmd', 3)
      domain.flush()

      expect(handler).toHaveBeenCalledTimes(3)
      expect(handler).toHaveBeenNthCalledWith(1, 1)
      expect(handler).toHaveBeenNthCalledWith(2, 2)
      expect(handler).toHaveBeenNthCalledWith(3, 3)
    })

    it('deve não executar handlers após flush sem novos sends', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', {})
      domain.flush()
      handler.mockClear()

      domain.flush()

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Prioridades e Buckets', () => {
    it('deve processar comandos em ordem de prioridade', () => {
      const callOrder: string[] = []

      const handler1 = vi.fn(() => callOrder.push('p0'))
      const handler2 = vi.fn(() => callOrder.push('p1'))
      const handler3 = vi.fn(() => callOrder.push('p2'))

      domain.register('low', handler1, 2)
      domain.register('mid', handler2, 1)
      domain.register('high', handler3, 0)

      domain.send('low', {})
      domain.send('mid', {})
      domain.send('high', {})

      domain.flush()

      expect(callOrder).toEqual(['high', 'mid', 'low'])
    })

    it('deve processar múltiplos comandos na mesma prioridade em ordem FIFO', () => {
      const callOrder: number[] = []

      const handler = vi.fn((data) => callOrder.push(data))
      domain.register('cmd', handler, 3)

      domain.send('cmd', 1)
      domain.send('cmd', 2)
      domain.send('cmd', 3)
      domain.send('cmd', 4)

      domain.flush()

      expect(callOrder).toEqual([1, 2, 3, 4])
    })

    it('deve processar todos os buckets', () => {
      const results: { cmd: string; priority: number }[] = []

      for (let p = 0; p < 8; p++) {
        domain.register(`cmd_${p}`, () => {
          results.push({ cmd: `cmd_${p}`, priority: p })
        }, p)
      }

      domain.send('cmd_3', {})
      domain.send('cmd_0', {})
      domain.send('cmd_7', {})
      domain.send('cmd_1', {})

      domain.flush()

      expect(results[0].priority).toBe(0)
      expect(results[1].priority).toBe(1)
      expect(results[2].priority).toBe(3)
      expect(results[3].priority).toBe(7)
    })

    it('deve processar com prioridade 0 por padrão', () => {
      const callOrder: string[] = []

      const handler1 = vi.fn(() => callOrder.push('default'))
      const handler2 = vi.fn(() => callOrder.push('explicit'))

      domain.register('default_priority', handler1)
      domain.register('explicit_zero', handler2, 0)

      domain.send('default_priority', {})
      domain.send('explicit_zero', {})

      domain.flush()

      expect(callOrder).toEqual(['default', 'explicit'])
    })
  })

  describe('Double Buffering', () => {
    it('deve alternar buffers corretamente', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 1)
      domain.flush()

      domain.flush()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(1)
    })

    it('deve manter isolamento de buffers entre ciclos', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 'first')
      domain.flush()

      domain.send('cmd', 'second')
      domain.flush()

      domain.send('cmd', 'third')
      domain.flush()

      expect(handler).toHaveBeenCalledTimes(3)
      expect(handler).toHaveBeenNthCalledWith(1, 'first')
      expect(handler).toHaveBeenNthCalledWith(2, 'second')
      expect(handler).toHaveBeenNthCalledWith(3, 'third')
    })

    it('deve limpar readBuffer após flush', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 1)
      domain.flush()
      handler.mockClear()

      domain.flush()

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Dados de Diferentes Tipos', () => {
    it('deve processar objeto como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      const data = { id: 1, name: 'test', nested: { value: 42 } }

      domain.send('cmd', data)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(data)
    })

    it('deve processar string como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 'hello world')
      domain.flush()

      expect(handler).toHaveBeenCalledWith('hello world')
    })

    it('deve processar número como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 42)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(42)
    })

    it('deve processar boolean como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', true)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(true)
    })

    it('deve processar array como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      const data = [1, 2, 3, { nested: 'value' }]
      domain.send('cmd', data)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(data)
    })

    it('deve processar número negativo como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', -999)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(-999)
    })

    it('deve processar zero como data', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 0)
      domain.flush()

      expect(handler).toHaveBeenCalledWith(0)
    })
  })

  describe('Edge Cases - Múltiplos Comandos Complexos', () => {
    it('deve processar mistura de prioridades com múltiplos comandos', () => {
      const callOrder: string[] = []

      domain.register('a', () => callOrder.push('a'), 2)
      domain.register('b', () => callOrder.push('b'), 1)
      domain.register('c', () => callOrder.push('c'), 0)
      domain.register('d', () => callOrder.push('d'), 2)
      domain.register('e', () => callOrder.push('e'), 1)

      domain.send('a', {})
      domain.send('b', {})
      domain.send('c', {})
      domain.send('d', {})
      domain.send('e', {})

      domain.flush()

      expect(callOrder).toEqual(['c', 'b', 'e', 'a', 'd'])
    })

    it('deve processar 100+ comandos corretamente', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      for (let i = 0; i < 100; i++) {
        domain.send('cmd', i)
      }

      domain.flush()

      expect(handler).toHaveBeenCalledTimes(100)
      for (let i = 0; i < 100; i++) {
        expect(handler).toHaveBeenNthCalledWith(i + 1, i)
      }
    })

    it('deve processar commandos com mesmo comando e prioridade múltiplas vezes', () => {
      const handler = vi.fn()
      domain.register('repeat', handler, 3)

      domain.send('repeat', 'a')
      domain.send('repeat', 'b')
      domain.send('repeat', 'c')
      domain.send('repeat', 'd')

      domain.flush()

      expect(handler).toHaveBeenCalledTimes(4)
      expect(handler).toHaveBeenNthCalledWith(1, 'a')
      expect(handler).toHaveBeenNthCalledWith(2, 'b')
      expect(handler).toHaveBeenNthCalledWith(3, 'c')
      expect(handler).toHaveBeenNthCalledWith(4, 'd')
    })
  })

  describe('Ciclos Send/Flush', () => {
    it('deve alternar send e flush múltiplas vezes', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      for (let i = 0; i < 5; i++) {
        domain.send('cmd', i)
        domain.flush()
      }

      expect(handler).toHaveBeenCalledTimes(5)
    })

    it('deve fazer múltiplos sends em um flush', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      for (let i = 0; i < 10; i++) {
        domain.send('cmd', i)
      }

      domain.flush()

      expect(handler).toHaveBeenCalledTimes(10)
    })

    it('deve combinar múltiplos sends e flushes', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 1)
      domain.send('cmd', 2)
      domain.flush()

      domain.send('cmd', 3)
      domain.flush()

      domain.send('cmd', 4)
      domain.send('cmd', 5)
      domain.send('cmd', 6)
      domain.flush()

      expect(handler).toHaveBeenCalledTimes(6)
      expect(handler).toHaveBeenNthCalledWith(1, 1)
      expect(handler).toHaveBeenNthCalledWith(2, 2)
      expect(handler).toHaveBeenNthCalledWith(3, 3)
      expect(handler).toHaveBeenNthCalledWith(4, 4)
      expect(handler).toHaveBeenNthCalledWith(5, 5)
      expect(handler).toHaveBeenNthCalledWith(6, 6)
    })
  })

  describe('Cobertura de Loops', () => {
    it('deve iterar sobre todos os buckets no loop p', () => {
      const bucketsCalled: number[] = []

      for (let p = 0; p < 8; p++) {
        domain.register(`cmd_${p}`, () => {
          bucketsCalled.push(p)
        }, p)
        domain.send(`cmd_${p}`, {})
      }

      domain.flush()

      expect(bucketsCalled).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    })

    it('deve iterar sobre todos os items no loop i', () => {
      const itemsOrder: number[] = []

      const handler = vi.fn((data) => {
        itemsOrder.push(data)
      })

      domain.register('cmd', handler, 2)

      domain.send('cmd', 1)
      domain.send('cmd', 2)
      domain.send('cmd', 3)

      domain.flush()

      expect(itemsOrder).toEqual([1, 2, 3])
    })

    it('deve manter buckets vazios sem erro', () => {
      domain.register('cmd_0', vi.fn(), 0)
      domain.register('cmd_5', vi.fn(), 5)

      domain.send('cmd_0', {})
      domain.send('cmd_5', {})

      expect(() => {
        domain.flush()
      }).not.toThrow()
    })
  })

  describe('Cobertura Completa', () => {
    it('deve cobrir todo o fluxo completo', () => {
      const testDomain = new CommandDomain(4)

      const handler0 = vi.fn()
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      testDomain.register('cmd0', handler0, 0)
      testDomain.register('cmd1', handler1, 1)
      testDomain.register('cmd2', handler2, 2)

      testDomain.send('cmd2', 'data2')
      testDomain.send('cmd0', 'data0')
      testDomain.send('cmd1', 'data1')

      testDomain.flush()

      expect(handler0).toHaveBeenCalledWith('data0')
      expect(handler1).toHaveBeenCalledWith('data1')
      expect(handler2).toHaveBeenCalledWith('data2')

      testDomain.send('cmd0', 'newdata')
      testDomain.flush()

      expect(handler0).toHaveBeenNthCalledWith(2, 'newdata')
    })

    it('deve cobrir XOR no activeBuffer', () => {
      const handler = vi.fn()
      domain.register('cmd', handler)

      domain.send('cmd', 1)
      domain.flush()

      domain.send('cmd', 2)
      domain.flush()

      domain.send('cmd', 3)
      domain.flush()

      expect(handler).toHaveBeenCalledTimes(3)
    })
  })

  describe('Comportamento com MaxPriority Customizado', () => {
    it('deve trabalhar com maxPriority = 2', () => {
      const customDomain = new CommandDomain(2)
      const handler0 = vi.fn()
      const handler1 = vi.fn()

      customDomain.register('p0', handler0, 0)
      customDomain.register('p1', handler1, 1)

      customDomain.send('p0', 'data0')
      customDomain.send('p1', 'data1')
      customDomain.flush()

      expect(handler0).toHaveBeenCalledWith('data0')
      expect(handler1).toHaveBeenCalledWith('data1')
    })

    it('deve trabalhar com maxPriority = 16', () => {
      const customDomain = new CommandDomain(16)

      const handlers = new Map<number, { fn: any; called: boolean }>()
      for (let p = 0; p < 16; p++) {
        const fn = vi.fn()
        handlers.set(p, { fn, called: false })
        customDomain.register(`cmd_${p}`, fn, p)
        customDomain.send(`cmd_${p}`, p)
      }

      customDomain.flush()

      handlers.forEach((handler, priority) => {
        expect(handler.fn).toHaveBeenCalledWith(priority)
      })
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve propagar erros do handler', () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error')
      })

      domain.register('error_cmd', errorHandler)
      domain.send('error_cmd', {})

      expect(() => {
        domain.flush()
      }).toThrow('Handler error')
    })

    it('deve lançar erro ao enviar comando não registrado', () => {
      expect(() => {
        domain.send('unregistered', {})
      }).toThrow()
    })
  })
})
