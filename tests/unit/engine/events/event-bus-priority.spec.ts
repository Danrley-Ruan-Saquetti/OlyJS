import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EventPriority } from '../../../src/contracts/engine/event'
import { EventBusPriority } from './../../../src/engine/events/event-bus-priority'

describe('Engine: EventBusPriority', () => {
  let bus: EventBusPriority

  beforeEach(() => {
    bus = new EventBusPriority()
  })

  describe('Operações Básicas', () => {
    it('deve criar um event bus vazio', () => {
      const listener = vi.fn()

      bus.emit('test', undefined)

      expect(listener).not.toHaveBeenCalled()
    })

    it('deve registrar e emitir para um listener com prioridade padrão (NORMAL)', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.emit('test', 'data')

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith('data')
    })

    it('deve emitir para múltiplos listeners na mesma prioridade', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()
      const l3 = vi.fn()

      bus.on('test', l1)
      bus.on('test', l2)
      bus.on('test', l3)

      bus.emit('test', 'data')

      expect(l1).toHaveBeenCalledWith('data')
      expect(l2).toHaveBeenCalledWith('data')
      expect(l3).toHaveBeenCalledWith('data')
    })
  })

  describe('Prioridades', () => {
    it('deve executar listeners em ordem de prioridade: HIGH -> NORMAL -> LOW', () => {
      const order: number[] = []

      const high = vi.fn(() => order.push(0))
      const normal = vi.fn(() => order.push(1))
      const low = vi.fn(() => order.push(2))

      bus.on('test', low, EventPriority.LOW)
      bus.on('test', normal, EventPriority.NORMAL)
      bus.on('test', high, EventPriority.HIGH)

      bus.emit('test', undefined)

      expect(order).toEqual([0, 1, 2])
    })

    it('deve manter ordem de registro dentro da mesma prioridade', () => {
      const order: number[] = []

      const h1 = vi.fn(() => order.push(1))
      const h2 = vi.fn(() => order.push(2))
      const h3 = vi.fn(() => order.push(3))

      bus.on('test', h1, EventPriority.HIGH)
      bus.on('test', h2, EventPriority.HIGH)
      bus.on('test', h3, EventPriority.HIGH)

      bus.emit('test', undefined)

      expect(order).toEqual([1, 2, 3])
    })
  })

  describe('Off (Remover Listeners)', () => {
    it('não faz nada se tentar remover listener que não foi registrado', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()

      bus.on('test', l1)

      bus.off('test', l2)

      bus.emit('test', undefined)

      expect(l1).toHaveBeenCalledTimes(1)
    })

    it('remove um listener único', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.off('test', listener)

      bus.emit('test', undefined)

      expect(listener).not.toHaveBeenCalled()
    })

    it('remove apenas a primeira ocorrência de um listener duplicado', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.on('test', listener)

      bus.off('test', listener)

      bus.emit('test', undefined)

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('remove um listener do começo da lista', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()
      const l3 = vi.fn()

      bus.on('test', l1)
      bus.on('test', l2)
      bus.on('test', l3)

      bus.off('test', l1)

      bus.emit('test', undefined)

      expect(l1).not.toHaveBeenCalled()
      expect(l2).toHaveBeenCalledTimes(1)
      expect(l3).toHaveBeenCalledTimes(1)
    })

    it('remove um listener do meio da lista', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()
      const l3 = vi.fn()

      bus.on('test', l1)
      bus.on('test', l2)
      bus.on('test', l3)

      bus.off('test', l2)

      bus.emit('test', undefined)

      expect(l1).toHaveBeenCalledTimes(1)
      expect(l2).not.toHaveBeenCalled()
      expect(l3).toHaveBeenCalledTimes(1)
    })

    it('remove um listener do fim da lista', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()
      const l3 = vi.fn()

      bus.on('test', l1)
      bus.on('test', l2)
      bus.on('test', l3)

      bus.off('test', l3)

      bus.emit('test', undefined)

      expect(l1).toHaveBeenCalledTimes(1)
      expect(l2).toHaveBeenCalledTimes(1)
      expect(l3).not.toHaveBeenCalled()
    })

    it('não faz nada quando off é chamado em evento sem listeners', () => {
      const listener = vi.fn()

      expect(() => bus.off('nonexistent', listener)).not.toThrow()
    })

    it('remove listener de prioridade específica', () => {
      const high = vi.fn()
      const normal = vi.fn()

      bus.on('test', high, EventPriority.HIGH)
      bus.on('test', normal, EventPriority.NORMAL)

      bus.off('test', high)

      bus.emit('test', undefined)

      expect(high).not.toHaveBeenCalled()
      expect(normal).toHaveBeenCalledTimes(1)
    })
  })

  describe('Clear (Limpar Listeners)', () => {
    it('limpa todos os listeners de um evento específico', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()

      bus.on('test', l1)
      bus.on('test', l2)

      bus.clear('test')

      bus.emit('test', undefined)

      expect(l1).not.toHaveBeenCalled()
      expect(l2).not.toHaveBeenCalled()
    })

    it('limpa apenas o evento especificado, mantendo outros intactos', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()

      bus.on('test1', l1)
      bus.on('test2', l2)

      bus.clear('test1')

      bus.emit('test1', undefined)
      bus.emit('test2', undefined)

      expect(l1).not.toHaveBeenCalled()
      expect(l2).toHaveBeenCalledTimes(1)
    })

    it('não faz nada ao limpar evento que não existe', () => {
      expect(() => bus.clear('nonexistent')).not.toThrow()
    })

    it('limpa todos os listeners de todos os eventos quando chamado sem argumento', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()
      const l3 = vi.fn()

      bus.on('test1', l1)
      bus.on('test2', l2)
      bus.on('test3', l3)

      bus.clear()

      bus.emit('test1', undefined)
      bus.emit('test2', undefined)
      bus.emit('test3', undefined)

      expect(l1).not.toHaveBeenCalled()
      expect(l2).not.toHaveBeenCalled()
      expect(l3).not.toHaveBeenCalled()
    })

    it('permite re-registrar listeners após clear', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.clear('test')
      bus.on('test', listener)

      bus.emit('test', undefined)

      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('Dados de Evento', () => {
    it('passa dados primitivos corretamente', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.emit('test', 42)

      expect(listener).toHaveBeenCalledWith(42)
    })

    it('passa objetos corretamente', () => {
      const listener = vi.fn()
      const data = { id: 1, name: 'test' }

      bus.on('test', listener)
      bus.emit('test', data)

      expect(listener).toHaveBeenCalledWith(data)
    })

    it('passa undefined corretamente', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.emit('test', undefined)

      expect(listener).toHaveBeenCalledWith(undefined)
    })

    it('passa null corretamente', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.emit('test', null)

      expect(listener).toHaveBeenCalledWith(null)
    })

    it('passa arrays corretamente', () => {
      const listener = vi.fn()
      const data = [1, 2, 3]

      bus.on('test', listener)
      bus.emit('test', data)

      expect(listener).toHaveBeenCalledWith(data)
    })
  })

  describe('Eventos Diferentes', () => {
    it('não interfere entre eventos diferentes', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()

      bus.on('event1', l1)
      bus.on('event2', l2)

      bus.emit('event1', undefined)

      expect(l1).toHaveBeenCalledTimes(1)
      expect(l2).not.toHaveBeenCalled()

      bus.emit('event2', undefined)

      expect(l1).toHaveBeenCalledTimes(1)
      expect(l2).toHaveBeenCalledTimes(1)
    })

    it('mantém listeners de todos os eventos com clear()', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()

      bus.on('event1', l1)
      bus.on('event2', l2)

      bus.clear()

      bus.emit('event1', undefined)
      bus.emit('event2', undefined)

      expect(l1).not.toHaveBeenCalled()
      expect(l2).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases e Comportamentos Complexos', () => {
    it('listener pode ser registrado para múltiplos eventos', () => {
      const listener = vi.fn()

      bus.on('event1', listener)
      bus.on('event2', listener)

      bus.emit('event1', 'data1')
      bus.emit('event2', 'data2')

      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenNthCalledWith(1, 'data1')
      expect(listener).toHaveBeenNthCalledWith(2, 'data2')
    })

    it('listener pode lançar exceção sem afetar outros listeners', () => {
      const l1 = vi.fn(() => { throw new Error('boom') })
      const l2 = vi.fn()

      bus.on('test', l1)
      bus.on('test', l2)

      expect(() => bus.emit('test', undefined)).toThrow('boom')

      expect(l2).not.toHaveBeenCalled()
    })

    it('comportamento de múltiplas prioridades com off', () => {
      const high = vi.fn()
      const normal = vi.fn()
      const low = vi.fn()

      bus.on('test', high, EventPriority.HIGH)
      bus.on('test', normal, EventPriority.NORMAL)
      bus.on('test', low, EventPriority.LOW)

      bus.off('test', normal)

      bus.emit('test', undefined)

      expect(high).toHaveBeenCalledTimes(1)
      expect(normal).not.toHaveBeenCalled()
      expect(low).toHaveBeenCalledTimes(1)
    })

    it('comportamento de múltiplas listeners na mesma prioridade com off no meio', () => {
      const l1 = vi.fn()
      const l2 = vi.fn()
      const l3 = vi.fn()

      bus.on('test', l1, EventPriority.HIGH)
      bus.on('test', l2, EventPriority.HIGH)
      bus.on('test', l3, EventPriority.HIGH)

      bus.off('test', l2)

      bus.emit('test', undefined)

      expect(l1).toHaveBeenCalledTimes(1)
      expect(l2).not.toHaveBeenCalled()
      expect(l3).toHaveBeenCalledTimes(1)
    })

    it('emit em evento vazio retorna sem erro', () => {
      expect(() => bus.emit('nonexistent', { any: 'data' })).not.toThrow()
    })

    it('permite registrar o mesmo listener múltiplas vezes para o mesmo evento', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.on('test', listener)
      bus.on('test', listener)

      bus.emit('test', undefined)

      expect(listener).toHaveBeenCalledTimes(3)
    })

    it('permite registrar o mesmo listener para múltiplas prioridades do mesmo evento', () => {
      const listener = vi.fn()

      bus.on('test', listener, EventPriority.HIGH)
      bus.on('test', listener, EventPriority.NORMAL)
      bus.on('test', listener, EventPriority.LOW)

      bus.emit('test', undefined)

      expect(listener).toHaveBeenCalledTimes(3)
    })

    it('ciclo completo: register, emit, clear, re-register, emit', () => {
      const listener = vi.fn()

      bus.on('test', listener)
      bus.emit('test', 'first')

      expect(listener).toHaveBeenCalledTimes(1)

      bus.clear('test')
      bus.emit('test', 'second')

      expect(listener).toHaveBeenCalledTimes(1)

      bus.on('test', listener)
      bus.emit('test', 'third')

      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenNthCalledWith(1, 'first')
      expect(listener).toHaveBeenNthCalledWith(2, 'third')
    })
  })
})
