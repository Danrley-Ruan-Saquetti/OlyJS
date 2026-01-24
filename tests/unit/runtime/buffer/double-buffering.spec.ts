import { beforeEach, describe, expect, it } from 'vitest'

import { DoubleBuffering } from './../../../../src/runtime/buffer/double-buffering'

describe('Runtime: DoubleBuffering', () => {
  let buffer: DoubleBuffering<number>

  beforeEach(() => {
    buffer = new DoubleBuffering()
  })

  describe('Operações Básicas', () => {
    it('deve criar um buffer com tamanho inicial zero', () => {
      expect(buffer.size()).toBe(0)
    })

    it('deve enviar um item para o buffer', () => {
      buffer.send(42)

      expect(buffer.size()).toBe(1)
    })

    it('deve fazer flush e retornar os items', () => {
      buffer.send(42)

      const result = buffer.flush()

      expect(result).toEqual([42])
    })

    it('deve retornar o tamanho correto após flush', () => {
      buffer.send(42)
      buffer.flush()

      expect(buffer.size()).toBe(0)
    })

    it('deve enviar múltiplos items', () => {
      buffer.send(1)
      buffer.send(2)
      buffer.send(3)

      const result = buffer.flush()

      expect(result).toEqual([1, 2, 3])
    })

    it('deve manter a ordem dos items', () => {
      buffer.send(5)
      buffer.send(2)
      buffer.send(8)
      buffer.send(1)

      const result = buffer.flush()

      expect(result).toEqual([5, 2, 8, 1])
    })
  })

  describe('Buffer Vazio', () => {
    it('deve fazer flush em buffer vazio', () => {
      const result = buffer.flush()

      expect(result).toEqual([])
    })

    it('deve retornar tamanho zero para buffer vazio após flush', () => {
      buffer.flush()

      expect(buffer.size()).toBe(0)
    })

    it('deve fazer flush múltiplo em buffer vazio', () => {
      const result1 = buffer.flush()
      const result2 = buffer.flush()

      expect(result1).toEqual([])
      expect(result2).toEqual([])

      expect(buffer.size()).toBe(0)
    })
  })

  describe('Flush Múltiplo', () => {
    it('deve fazer flush duas vezes consecutivas com dados', () => {
      buffer.send(1)
      buffer.send(2)

      expect(buffer.size()).toBe(2)

      const result1 = buffer.flush()

      expect(result1).toEqual([1, 2])
      expect(buffer.size()).toBe(0)

      const result2 = buffer.flush()

      expect(result2).toEqual([])
      expect(buffer.size()).toBe(0)
    })

    it('deve fazer flush múltiplo com dados adicionados', () => {
      buffer.send(1)
      buffer.send(2)

      const result1 = buffer.flush()

      expect(result1).toEqual([1, 2])

      buffer.send(3)
      buffer.send(4)

      const result2 = buffer.flush()

      expect(result2).toEqual([3, 4])

      const result3 = buffer.flush()

      expect(result3).toEqual([])
    })

    it('deve fazer flush três vezes consecutivas', () => {
      buffer.send(10)

      const result1 = buffer.flush()

      expect(result1).toEqual([10])

      buffer.send(20)

      const result2 = buffer.flush()

      expect(result2).toEqual([20])

      buffer.send(30)

      const result3 = buffer.flush()

      expect(result3).toEqual([30])
    })
  })

  describe('Ciclo Send/Flush', () => {
    it('deve alternar send e flush corretamente', () => {
      buffer.send(1)
      buffer.send(2)

      const result1 = buffer.flush()

      expect(result1).toEqual([1, 2])

      buffer.send(3)

      const result2 = buffer.flush()

      expect(result2).toEqual([3])

      const result3 = buffer.flush()

      expect(result3).toEqual([])

      buffer.send(4)
      buffer.send(5)
      buffer.send(6)

      const result4 = buffer.flush()

      expect(result4).toEqual([4, 5, 6])
    })

    it('deve manter estado consistente após ciclos', () => {
      for (let i = 0; i < 3; i++) {
        buffer.send(i * 10)
        buffer.send(i * 10 + 1)

        expect(buffer.size()).toBe(2)

        const result = buffer.flush()

        expect(result.length).toBe(2)
        expect(buffer.size()).toBe(0)
      }
    })
  })

  describe('Comportamento de Buffer Duplo', () => {
    it('deve trocar corretamente os buffers', () => {
      buffer.send(100)
      buffer.send(200)

      expect(buffer.size()).toBe(2)

      const result = buffer.flush()

      expect(result).toEqual([100, 200])

      buffer.send(300)

      expect(result).toEqual([100, 200])
    })

    it('deve reutilizar array entre ciclos', () => {
      buffer.send(1)
      buffer.send(2)

      const result1 = buffer.flush()

      buffer.send(3)

      expect(result1).toEqual([1, 2])

      const result2 = buffer.flush()

      expect(result2).toEqual([3])
      expect(result1).toEqual([])
    })

    it('deve limpar o buffer correto após flush', () => {
      buffer.send(1)
      buffer.send(2)
      buffer.send(3)
      buffer.flush()

      const nextFlush = buffer.flush()

      expect(nextFlush).toEqual([])
      expect(buffer.size()).toBe(0)
    })
  })

  describe('Valores Especiais', () => {
    it('deve lidar com zero', () => {
      buffer.send(0)

      const result = buffer.flush()

      expect(result).toEqual([0])
    })

    it('deve lidar com números negativos', () => {
      buffer.send(-5)
      buffer.send(-10)
      buffer.send(-1)

      const result = buffer.flush()

      expect(result).toEqual([-5, -10, -1])
    })

    it('deve lidar com números grandes', () => {
      const large = Number.MAX_SAFE_INTEGER

      buffer.send(large)

      const result = buffer.flush()

      expect(result).toEqual([large])
    })

    it('deve lidar com números decimais', () => {
      buffer.send(3.14)
      buffer.send(2.71)

      const result = buffer.flush()

      expect(result[0]).toBeCloseTo(3.14)
      expect(result[1]).toBeCloseTo(2.71)
    })
  })

  describe('Tipos Diferentes', () => {
    it('deve lidar com strings', () => {
      const stringBuffer = new DoubleBuffering<string>()

      stringBuffer.send('hello')
      stringBuffer.send('world')

      const result = stringBuffer.flush()

      expect(result).toEqual(['hello', 'world'])
    })

    it('deve lidar com objetos', () => {
      const objBuffer = new DoubleBuffering<{ id: number; name: string }>()

      objBuffer.send({ id: 1, name: 'alice' })
      objBuffer.send({ id: 2, name: 'bob' })

      const result = objBuffer.flush()

      expect(result).toEqual([
        { id: 1, name: 'alice' },
        { id: 2, name: 'bob' },
      ])
    })

    it('deve lidar com booleanos', () => {
      const boolBuffer = new DoubleBuffering<boolean>()

      boolBuffer.send(true)
      boolBuffer.send(false)
      boolBuffer.send(true)

      const result = boolBuffer.flush()

      expect(result).toEqual([true, false, true])
    })

    it('deve lidar com null e undefined', () => {
      const nullBuffer = new DoubleBuffering<number | null | undefined>()

      nullBuffer.send(1)
      nullBuffer.send(null as any)
      nullBuffer.send(2)
      nullBuffer.send(undefined as any)

      const result = nullBuffer.flush()

      expect(result[0]).toBe(1)
      expect(result[1]).toBe(null)
      expect(result[2]).toBe(2)
      expect(result[3]).toBe(undefined)
    })

    it('deve lidar com arrays', () => {
      const arrayBuffer = new DoubleBuffering<number[]>()

      arrayBuffer.send([1, 2, 3])
      arrayBuffer.send([4, 5])

      const result = arrayBuffer.flush()

      expect(result).toEqual([[1, 2, 3], [4, 5]])
    })
  })

  describe('Cobertura de Size', () => {
    it('size() deve retornar 0 inicialmente', () => {
      expect(buffer.size()).toBe(0)
    })

    it('size() deve retornar tamanho após primeiro flush', () => {
      buffer.send(1)
      buffer.send(2)

      expect(buffer.size()).toBe(2)

      buffer.flush()

      expect(buffer.size()).toBe(0)
    })

    it('size() deve retornar tamanho acumulado', () => {
      buffer.send(1)
      buffer.send(2)

      expect(buffer.size()).toBe(2)

      buffer.flush()

      expect(buffer.size()).toBe(0)

      buffer.send(3)
      buffer.send(4)
      buffer.send(5)

      expect(buffer.size()).toBe(3)

      buffer.flush()

      expect(buffer.size()).toBe(0)
    })

    it('size() deve refletir swap buffer após flush', () => {
      buffer.send(1)

      expect(buffer.size()).toBe(1)

      buffer.flush()

      expect(buffer.size()).toBe(0)

      buffer.send(2)

      expect(buffer.size()).toBe(1)

      buffer.flush()

      expect(buffer.size()).toBe(0)
    })
  })

  describe('Padrão de Uso Real', () => {
    it('deve processar eventos em batch', () => {
      buffer.send(1)
      buffer.send(2)
      buffer.send(3)

      const events = buffer.flush()

      expect(events).toEqual([1, 2, 3])

      buffer.send(4)

      expect(buffer.size()).toBe(1)

      buffer.flush()

      expect(buffer.size()).toBe(0)
    })

    it('deve manter fila de dois níveis', () => {
      const events1 = [1, 2]
      const events2 = [3, 4, 5]

      events1.forEach(e => buffer.send(e))

      const batch1 = buffer.flush()

      expect(batch1).toEqual(events1)

      events2.forEach(e => buffer.send(e))

      const batch2 = buffer.flush()

      expect(batch2).toEqual(events2)

      const batch3 = buffer.flush()

      expect(batch3).toEqual([])
    })
  })

  describe('Cobertura Completa', () => {
    it('deve cobrir todas as linhas de código', () => {
      const testBuffer = new DoubleBuffering<number>()

      testBuffer.send(1)
      testBuffer.send(2)
      testBuffer.send(3)

      expect(testBuffer.size()).toBe(3)

      const result = testBuffer.flush()

      expect(result.length).toBe(3)

      testBuffer.send(4)

      testBuffer.flush()
      testBuffer.flush()

      expect(testBuffer.size()).toBe(0)
    })
  })
})
