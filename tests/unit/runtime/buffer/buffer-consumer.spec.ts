import { beforeEach, describe, expect, it, vi } from 'vitest'

import { IBuffer, IDispatcher } from '../../../src/runtime/buffer/type'
import { BufferConsumer } from './../../../src/runtime/buffer/buffer-consumer'

describe('Runtime: BufferConsumer', () => {
  let mockBuffer: IBuffer<number>
  let mockDispatcher: IDispatcher<number>
  let consumer: BufferConsumer<number>

  beforeEach(() => {
    mockBuffer = {
      send: vi.fn(),
      flush: vi.fn(() => []),
      size: vi.fn(() => 0),
    }

    mockDispatcher = {
      dispatch: vi.fn(),
    }

    consumer = new BufferConsumer(mockBuffer, mockDispatcher)
  })

  describe('Operações Básicas', () => {
    it('deve criar um consumer com buffer e dispatcher', () => {
      expect(consumer).toBeDefined()
    })

    it('deve chamar send do buffer quando envia item', () => {
      consumer.send(42)

      expect(mockBuffer.send).toHaveBeenCalledWith(42)
      expect(mockBuffer.send).toHaveBeenCalledTimes(1)
    })

    it('deve chamar flush quando executa', () => {
      consumer.execute()

      expect(mockBuffer.flush).toHaveBeenCalled()
    })

    it('deve chamar dispatch para cada item do buffer', () => {
      const items = [1, 2, 3]
        ; (mockBuffer.flush as any).mockReturnValueOnce(items)

      consumer.execute()

      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(3)
      expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(1, 1)
      expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(2, 2)
      expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(3, 3)
    })

    it('deve enviar múltiplos items consecutivamente', () => {
      consumer.send(10)
      consumer.send(20)
      consumer.send(30)

      expect(mockBuffer.send).toHaveBeenCalledTimes(3)
      expect(mockBuffer.send).toHaveBeenNthCalledWith(1, 10)
      expect(mockBuffer.send).toHaveBeenNthCalledWith(2, 20)
      expect(mockBuffer.send).toHaveBeenNthCalledWith(3, 30)
    })
  })

  describe('Edge Cases - Sem Dispatcher', () => {
    beforeEach(() => {
      consumer = new BufferConsumer(mockBuffer)
    })

    it('deve criar consumer sem dispatcher', () => {
      expect(consumer).toBeDefined()
    })

    it('deve fazer flush sem dispatcher', () => {
      consumer.execute()

      expect(mockBuffer.flush).toHaveBeenCalled()
    })

    it('deve não lançar erro quando executa sem dispatcher', () => {
      expect(() => {
        consumer.execute()
      }).not.toThrow()
    })

    it('deve retornar undefined quando executa sem dispatcher', () => {
      const result = consumer.execute()

      expect(result).toBeUndefined()
    })

    it('deve permitir send mesmo sem dispatcher', () => {
      expect(() => {
        consumer.send(99)
      }).not.toThrow()
      expect(mockBuffer.send).toHaveBeenCalledWith(99)
    })
  })

  describe('Edge Cases - Buffer Vazio', () => {
    it('deve executar com buffer vazio', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([])

      expect(() => {
        consumer.execute()
      }).not.toThrow()
    })

    it('deve não chamar dispatcher com buffer vazio', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([])

      consumer.execute()

      expect(mockDispatcher.dispatch).not.toHaveBeenCalled()
    })

    it('deve fazer flush mesmo com buffer vazio', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([])

      consumer.execute()

      expect(mockBuffer.flush).toHaveBeenCalled()
    })
  })

  describe('Edge Cases - Um Único Item', () => {
    it('deve despachar um único item', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([42])

      consumer.execute()

      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(1)
      expect(mockDispatcher.dispatch).toHaveBeenCalledWith(42)
    })

    it('deve enviar um único item', () => {
      consumer.send(100)

      expect(mockBuffer.send).toHaveBeenCalledTimes(1)
      expect(mockBuffer.send).toHaveBeenCalledWith(100)
    })
  })

  describe('Edge Cases - Muitos Items', () => {
    it('deve despachar muitos items', () => {
      const items = Array.from({ length: 100 }, (_, i) => i)
        ; (mockBuffer.flush as any).mockReturnValueOnce(items)

      consumer.execute()

      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(100)

      items.forEach((item, index) => {
        expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(index + 1, item)
      })
    })

    it('deve enviar muitos items consecutivamente', () => {
      for (let i = 0; i < 50; i++) {
        consumer.send(i)
      }

      expect(mockBuffer.send).toHaveBeenCalledTimes(50)
    })
  })

  describe('Ordem de Execução', () => {
    it('deve despachar items na ordem correta', () => {
      const callOrder: number[] = []

        ; (mockDispatcher.dispatch as any).mockImplementation((item: number) => {
          callOrder.push(item)
        })

      const items = [3, 1, 4, 1, 5, 9, 2, 6]
        ; (mockBuffer.flush as any).mockReturnValueOnce(items)

      consumer.execute()

      expect(callOrder).toEqual(items)
    })

    it('deve chamar flush antes de dispatch', () => {
      const callOrder: string[] = []

        ; (mockBuffer.flush as any).mockImplementation(() => {
          callOrder.push('flush')
          return [1, 2]
        })

        ; (mockDispatcher.dispatch as any).mockImplementation(() => {
          callOrder.push('dispatch')
        })

      consumer.execute()

      expect(callOrder[0]).toBe('flush')
      expect(callOrder.slice(1)).toEqual(['dispatch', 'dispatch'])
    })
  })

  describe('Tipos Diferentes', () => {
    it('deve lidar com strings', () => {
      const stringBuffer = {
        send: vi.fn(),
        flush: vi.fn(() => ['hello', 'world']),
        size: vi.fn(() => 2),
      }
      const stringDispatcher = {
        dispatch: vi.fn(),
      }
      const stringConsumer = new BufferConsumer(stringBuffer, stringDispatcher)

      stringConsumer.execute()

      expect(stringDispatcher.dispatch).toHaveBeenCalledTimes(2)
      expect(stringDispatcher.dispatch).toHaveBeenNthCalledWith(1, 'hello')
      expect(stringDispatcher.dispatch).toHaveBeenNthCalledWith(2, 'world')
    })

    it('deve lidar com objetos', () => {
      interface Item {
        id: number
        name: string
      }

      const objectBuffer = {
        send: vi.fn(),
        flush: vi.fn(() => [
          { id: 1, name: 'alice' },
          { id: 2, name: 'bob' },
        ]),
        size: vi.fn(() => 2),
      }
      const objectDispatcher = {
        dispatch: vi.fn(),
      }
      const objectConsumer = new BufferConsumer<Item>(objectBuffer as any, objectDispatcher as any)

      objectConsumer.execute()

      expect(objectDispatcher.dispatch).toHaveBeenCalledTimes(2)
      expect(objectDispatcher.dispatch).toHaveBeenNthCalledWith(1, { id: 1, name: 'alice' })
      expect(objectDispatcher.dispatch).toHaveBeenNthCalledWith(2, { id: 2, name: 'bob' })
    })

    it('deve lidar com valores especiais', () => {
      const items = [0, -5, Number.MAX_SAFE_INTEGER, null, undefined]
        ; (mockBuffer.flush as any).mockReturnValueOnce(items)

      consumer = new BufferConsumer<any>(mockBuffer, mockDispatcher)
      consumer.execute()

      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(5)
      items.forEach((item, index) => {
        expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(index + 1, item)
      })
    })
  })

  describe('Ciclos Send/Execute', () => {
    it('deve alternar send e execute', () => {
      const sequence: string[] = []

        ; (mockBuffer.send as any).mockImplementation(() => {
          sequence.push('send')
        })

        ; (mockBuffer.flush as any).mockImplementation(() => {
          sequence.push('flush')
          return [1]
        })

        ; (mockDispatcher.dispatch as any).mockImplementation(() => {
          sequence.push('dispatch')
        })

      consumer.send(1)
      consumer.execute()
      consumer.send(2)
      consumer.execute()

      expect(sequence).toEqual(['send', 'flush', 'dispatch', 'send', 'flush', 'dispatch'])
    })

    it('deve fazer múltiplos sends antes de execute', () => {
      const items = [10, 20, 30]
        ; (mockBuffer.flush as any).mockReturnValueOnce(items)

      consumer.send(10)
      consumer.send(20)
      consumer.send(30)
      consumer.execute()

      expect(mockBuffer.send).toHaveBeenCalledTimes(3)
      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(3)
    })

    it('deve fazer múltiplos executes', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([1]).mockReturnValueOnce([2]).mockReturnValueOnce([])

      consumer.execute()
      consumer.execute()
      consumer.execute()

      expect(mockBuffer.flush).toHaveBeenCalledTimes(3)
      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Cobertura de Código - Loop While', () => {
    it('deve processar todos os items no loop', () => {
      const dispatchCalls: number[] = []

        ; (mockDispatcher.dispatch as any).mockImplementation((item: number) => {
          dispatchCalls.push(item)
        })

      const items = [5, 10, 15, 20, 25]
        ; (mockBuffer.flush as any).mockReturnValueOnce(items)

      consumer.execute()

      expect(dispatchCalls).toEqual(items)
      expect(dispatchCalls.length).toBe(5)
    })

    it('deve iterar corretamente com um item', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([99])

      consumer.execute()

      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(1)
      expect(mockDispatcher.dispatch).toHaveBeenCalledWith(99)
    })

    it('deve iterar corretamente com zero items', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([])

      consumer.execute()

      expect(mockDispatcher.dispatch).not.toHaveBeenCalled()
    })
  })

  describe('Cobertura Completa', () => {
    it('deve cobrir construtor, send e execute', () => {
      const testConsumer = new BufferConsumer(mockBuffer, mockDispatcher)

      testConsumer.send(1)
      testConsumer.send(2)

        ; (mockBuffer.flush as any).mockReturnValueOnce([1, 2])
      testConsumer.execute()

      expect(mockBuffer.send).toHaveBeenCalledTimes(2)
      expect(mockBuffer.flush).toHaveBeenCalledTimes(1)
      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(2)
    })

    it('deve cobrir execute sem dispatcher', () => {
      const testConsumer = new BufferConsumer(mockBuffer)

      testConsumer.send(1)
        ; (mockBuffer.flush as any).mockReturnValueOnce([1])
      testConsumer.execute()

      expect(mockBuffer.send).toHaveBeenCalled()
      expect(mockBuffer.flush).toHaveBeenCalled()
    })

    it('deve cobrir execute com buffer vazio e dispatcher', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([])

      consumer.execute()

      expect(mockBuffer.flush).toHaveBeenCalled()
      expect(mockDispatcher.dispatch).not.toHaveBeenCalled()
    })
  })

  describe('Comportamento de Passthrough', () => {
    it('deve passar items do buffer para dispatcher', () => {
      const testItems = [10, 20, 30]
        ; (mockBuffer.flush as any).mockReturnValueOnce(testItems)

      consumer.execute()

      testItems.forEach((item, index) => {
        expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(index + 1, item)
      })
    })

    it('deve não modificar items entre buffer e dispatcher', () => {
      const originalItem = { id: 1, value: 'test' }
        ; (mockBuffer.flush as any).mockReturnValueOnce([originalItem])

      const consumer = new BufferConsumer<typeof originalItem>(mockBuffer as any, mockDispatcher as any)
      consumer.execute()

      expect(mockDispatcher.dispatch).toHaveBeenCalledWith(originalItem)
    })
  })

  describe('Proteção contra Erros', () => {
    it('deve propagar erros do dispatcher', () => {
      (mockBuffer.flush as any).mockReturnValueOnce([1, 2, 3])
        ; (mockDispatcher.dispatch as any).mockImplementation(() => {
          throw new Error('Dispatch failed')
        })

      expect(() => {
        consumer.execute()
      }).toThrow('Dispatch failed')
    })

    it('deve propagar erros do buffer.send', () => {
      (mockBuffer.send as any).mockImplementation(() => {
        throw new Error('Send failed')
      })

      expect(() => {
        consumer.send(1)
      }).toThrow('Send failed')
    })

    it('deve propagar erros do buffer.flush', () => {
      (mockBuffer.flush as any).mockImplementation(() => {
        throw new Error('Flush failed')
      })

      expect(() => {
        consumer.execute()
      }).toThrow('Flush failed')
    })
  })
})
