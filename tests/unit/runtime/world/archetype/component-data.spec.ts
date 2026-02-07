import { beforeEach, describe, expect, it } from 'vitest'

import { ComponentFieldType } from '../../../../../src/ecs/component'
import { ComponentData } from '../../../../../src/runtime/world/archetype/components/component-data'

describe('Runtime: ComponentData', () => {
  describe('Operações Básicas', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = {
        position: ComponentFieldType.Float32,
        velocity: ComponentFieldType.Float32,
      }

      componentData = new ComponentData(schema)
    })

    it('deve criar um ComponentData com capacidade inicial', () => {
      expect(componentData.size).toBe(0)
      expect(componentData.isFull).toBe(false)
    })

    it('deve retornar a capacidade correta via getter isFull quando vazio', () => {
      expect(componentData.isFull).toBe(false)
    })

    it('deve inserir um elemento com push', () => {
      componentData.push()

      expect(componentData.size).toBe(1)
      expect(componentData.field('position')[0]).toBe(0)
      expect(componentData.field('velocity')[0]).toBe(0)
    })

    it('deve inserir múltiplos elementos', () => {
      componentData.push()
      componentData.push()
      componentData.push()

      expect(componentData.size).toBe(3)
    })

    it('deve remover o último elemento com pop', () => {
      componentData.push()
      componentData.push()

      componentData.pop()

      expect(componentData.size).toBe(1)
    })

    it('deve retornar data via getter', () => {
      const data = componentData.data

      expect(data).toBeDefined()
      expect(data).toHaveProperty('position')
      expect(data).toHaveProperty('velocity')
    })

    it('deve acessar campo específico com field', () => {
      componentData.push()

      const field = componentData.field('position')

      expect(field).toBeInstanceOf(Float32Array)
      expect(field[0]).toBe(0)
    })
  })

  describe('Inicialização com Capacidade Customizada', () => {
    it('deve criar com capacidade inicial customizada', () => {
      const schema = { x: ComponentFieldType.Int32 }
      const componentData = new ComponentData(schema, 128)

      for (let i = 0; i < 128; i++) {
        componentData.push()
      }

      expect(componentData.size).toBe(128)
      expect(componentData.isFull).toBe(true)
    })

    it('deve usar capacidade padrão de 64 se não especificada', () => {
      const schema = { x: ComponentFieldType.Float64 }
      const componentData = new ComponentData(schema)

      for (let i = 0; i < 64; i++) {
        componentData.push()
      }

      expect(componentData.size).toBe(64)
      expect(componentData.isFull).toBe(true)
    })
  })

  describe('Tipos de Campo', () => {
    it('deve suportar Float32 (Float32Array)', () => {
      const schema = { value: ComponentFieldType.Float32 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Float32Array)
    })

    it('deve suportar Float64 (Float64Array)', () => {
      const schema = { value: ComponentFieldType.Float64 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Float64Array)
    })

    it('deve suportar Int32 (Int32Array)', () => {
      const schema = { value: ComponentFieldType.Int32 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Int32Array)
    })

    it('deve suportar Uint32 (Uint32Array)', () => {
      const schema = { value: ComponentFieldType.Uint32 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Uint32Array)
    })

    it('deve suportar Int16 (Int16Array)', () => {
      const schema = { value: ComponentFieldType.Int16 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Int16Array)
    })

    it('deve suportar Uint8 (Uint8Array)', () => {
      const schema = { value: ComponentFieldType.Uint8 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Uint8Array)
    })

    it('deve suportar Int8 (Int8Array)', () => {
      const schema = { value: ComponentFieldType.Int8 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Int8Array)
    })

    it('deve suportar Uint8Clamped (Uint8ClampedArray)', () => {
      const schema = { value: ComponentFieldType.Uint8Clamped }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Uint8ClampedArray)
    })

    it('deve suportar Uint16 (Uint16Array)', () => {
      const schema = { value: ComponentFieldType.Uint16 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Uint16Array)
    })

    it('deve suportar Float16 (Float16Array)', () => {
      const schema = { value: ComponentFieldType.Float16 }
      const componentData = new ComponentData(schema)

      componentData.push()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Float16Array)
    })

    it('deve suportar BigInt64 (BigInt64Array)', () => {
      const schema = { value: ComponentFieldType.BigInt64 }
      const componentData = new ComponentData(schema)

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(BigInt64Array)
      expect(field.length).toBeGreaterThan(0)
    })

    it('deve suportar BigUint64 (BigUint64Array)', () => {
      const schema = { value: ComponentFieldType.BigUint64 }
      const componentData = new ComponentData(schema)

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(BigUint64Array)
      expect(field.length).toBeGreaterThan(0)
    })

    it('deve suportar múltiplos tipos de campo simultaneamente', () => {
      const schema = {
        int8Val: ComponentFieldType.Int8,
        uint8Val: ComponentFieldType.Uint8,
        uint8ClampedVal: ComponentFieldType.Uint8Clamped,
        int16Val: ComponentFieldType.Int16,
        uint16Val: ComponentFieldType.Uint16,
        int32Val: ComponentFieldType.Int32,
        uint32Val: ComponentFieldType.Uint32,
        float16Val: ComponentFieldType.Float16,
        float32Val: ComponentFieldType.Float32,
        float64Val: ComponentFieldType.Float64,
      }

      const componentData = new ComponentData(schema)

      componentData.push()

      expect(componentData.field('int8Val')).toBeInstanceOf(Int8Array)
      expect(componentData.field('uint8Val')).toBeInstanceOf(Uint8Array)
      expect(componentData.field('uint8ClampedVal')).toBeInstanceOf(Uint8ClampedArray)
      expect(componentData.field('int16Val')).toBeInstanceOf(Int16Array)
      expect(componentData.field('uint16Val')).toBeInstanceOf(Uint16Array)
      expect(componentData.field('int32Val')).toBeInstanceOf(Int32Array)
      expect(componentData.field('uint32Val')).toBeInstanceOf(Uint32Array)
      expect(componentData.field('float16Val')).toBeInstanceOf(Float16Array)
      expect(componentData.field('float32Val')).toBeInstanceOf(Float32Array)
      expect(componentData.field('float64Val')).toBeInstanceOf(Float64Array)
    })
  })

  describe('Swap de Elementos', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.Int32 }
      componentData = new ComponentData(schema, 10)
    })

    it('deve trocar dois elementos', () => {
      componentData.push()
      componentData.push()

      const field = componentData.field('value')
      field[0] = 10
      field[1] = 20

      componentData.swap(0, 1)

      expect(field[0]).toBe(20)
      expect(field[1]).toBe(10)
    })

    it('deve fazer swap de elementos com múltiplos campos', () => {
      const schema = { x: ComponentFieldType.Float32, y: ComponentFieldType.Float32 }
      const data = new ComponentData(schema, 10)

      data.push()
      data.push()

      const xField = data.field('x')
      const yField = data.field('y')

      xField[0] = 1
      yField[0] = 2
      xField[1] = 3
      yField[1] = 4

      data.swap(0, 1)

      expect(xField[0]).toBe(3)
      expect(yField[0]).toBe(4)
      expect(xField[1]).toBe(1)
      expect(yField[1]).toBe(2)
    })

    it('deve fazer swap de um elemento consigo mesmo', () => {
      componentData.push()

      const field = componentData.field('value')
      field[0] = 42

      componentData.swap(0, 0)

      expect(field[0]).toBe(42)
    })

    it('deve fazer swap de últimos elementos', () => {
      componentData.push()
      componentData.push()
      componentData.push()

      const field = componentData.field('value')
      field[1] = 100
      field[2] = 200

      componentData.swap(1, 2)

      expect(field[1]).toBe(200)
      expect(field[2]).toBe(100)
    })
  })

  describe('Crescimento da Capacidade (grow)', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { id: ComponentFieldType.Uint32 }
      componentData = new ComponentData(schema, 10)
    })

    it('deve crescer a capacidade quando ficar cheio', () => {
      for (let i = 0; i < 10; i++) {
        componentData.push()
      }

      expect(componentData.isFull).toBe(true)

      componentData.push()

      expect(componentData.size).toBe(11)
      expect(componentData.isFull).toBe(false)
    })

    it('deve multiplicar a capacidade por 3 após crescimento', () => {
      const schema = { value: ComponentFieldType.Int32 }
      const data = new ComponentData(schema, 10)

      for (let i = 0; i < 10; i++) {
        data.push()
        data.field('value')[i] = i
      }

      data.push()

      for (let i = 0; i < 20; i++) {
        data.push()
      }

      expect(data.size).toBe(31)
    })

    it('deve preservar dados após crescimento', () => {
      const schema = { value: ComponentFieldType.Int32 }
      const data = new ComponentData(schema, 5)

      for (let i = 0; i < 5; i++) {
        data.push()
        data.field('value')[i] = i * 10
      }

      data.push()

      const field = data.field('value')

      expect(field[0]).toBe(0)
      expect(field[1]).toBe(10)
      expect(field[2]).toBe(20)
      expect(field[3]).toBe(30)
      expect(field[4]).toBe(40)
    })

    it('deve crescer múltiplas vezes sucessivamente', () => {
      const schema = { num: ComponentFieldType.Uint32 }
      const data = new ComponentData(schema, 2)

      data.push()
      data.push()

      for (let i = 0; i < 6; i++) {
        data.push()
      }

      for (let i = 0; i < 18; i++) {
        data.push()
      }

      expect(data.size).toBe(26)
    })
  })

  describe('copyFrom - Copiar de Outro ComponentData', () => {
    let source: ComponentData
    let target: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.Float32 }

      source = new ComponentData(schema, 10)
      target = new ComponentData(schema, 10)
    })

    it('deve copiar um elemento de outro ComponentData', () => {
      source.push()

      const field = source.field('value')
      field[0] = 42.5

      target.copyFrom(source, 0)

      expect(target.size).toBe(1)
      expect(target.field('value')[0]).toBe(42.5)
    })

    it('deve copiar múltiplos elementos diferentes', () => {
      source.push()
      source.push()
      source.push()

      const sourceField = source.field('value')
      sourceField[0] = 10
      sourceField[1] = 20
      sourceField[2] = 30

      target.copyFrom(source, 0)
      target.copyFrom(source, 1)
      target.copyFrom(source, 2)

      const targetField = target.field('value')
      expect(targetField[0]).toBe(10)
      expect(targetField[1]).toBe(20)
      expect(targetField[2]).toBe(30)
    })

    it('deve copiar de índice específico', () => {
      source.push()
      source.push()
      source.push()

      const field = source.field('value')
      field[0] = 100
      field[1] = 200
      field[2] = 300

      target.copyFrom(source, 1)

      expect(target.field('value')[0]).toBe(200)
    })

    it('deve copiar com múltiplos campos', () => {
      const schema = { x: ComponentFieldType.Float32, y: ComponentFieldType.Float32 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 10)

      source.push()
      source.push()

      const sourceX = source.field('x')
      const sourceY = source.field('y')
      sourceX[0] = 1.5
      sourceY[0] = 2.5
      sourceX[1] = 3.5
      sourceY[1] = 4.5

      target.copyFrom(source, 0)
      target.copyFrom(source, 1)

      const targetX = target.field('x')
      const targetY = target.field('y')

      expect(targetX[0]).toBe(1.5)
      expect(targetY[0]).toBe(2.5)
      expect(targetX[1]).toBe(3.5)
      expect(targetY[1]).toBe(4.5)
    })

    it('deve copiar e crescer se necessário', () => {
      const schema = { id: ComponentFieldType.Uint32 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 2)

      for (let i = 0; i < 10; i++) {
        source.push()
      }

      expect(target.isFull).toBe(false)

      for (let i = 0; i < 5; i++) {
        target.copyFrom(source, i)
      }

      expect(target.size).toBe(5)
    })

    it('deve copiar após crescimento do alvo', () => {
      const schema = { val: ComponentFieldType.Int32 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 3)

      source.push()
      const sourceField = source.field('val')
      sourceField[0] = 99

      for (let i = 0; i < 3; i++) {
        target.push()
      }

      target.copyFrom(source, 0)

      const targetField = target.field('val')
      expect(targetField[3]).toBe(99)
    })
  })

  describe('Edge Cases - Vazio', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { x: ComponentFieldType.Float32 }
      componentData = new ComponentData(schema)
    })

    it('deve ter size 0 quando criado', () => {
      expect(componentData.size).toBe(0)
    })

    it('deve não estar cheio quando criado', () => {
      expect(componentData.isFull).toBe(false)
    })

    it('deve retornar campos válidos mesmo quando vazio', () => {
      const field = componentData.field('x')

      expect(field).toBeInstanceOf(Float32Array)
      expect(field.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases - Um Único Elemento', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.Int32 }
      componentData = new ComponentData(schema)
    })

    it('deve ter size 1 após um push', () => {
      componentData.push()

      expect(componentData.size).toBe(1)
    })

    it('deve remover o único elemento com pop', () => {
      componentData.push()
      componentData.pop()

      expect(componentData.size).toBe(0)
    })

    it('deve fazer swap consigo mesmo sem erro', () => {
      componentData.push()

      const field = componentData.field('value')
      field[0] = 42

      expect(() => {
        componentData.swap(0, 0)
      }).not.toThrow()

      expect(field[0]).toBe(42)
    })

    it('deve copiar de um ComponentData com um elemento', () => {
      componentData.push()
      const field = componentData.field('value')
      field[0] = 123

      const target = new ComponentData({ value: ComponentFieldType.Int32 })
      target.copyFrom(componentData, 0)

      expect(target.size).toBe(1)
      expect(target.field('value')[0]).toBe(123)
    })
  })

  describe('Edge Cases - Pop Múltiplo', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { id: ComponentFieldType.Uint32 }
      componentData = new ComponentData(schema, 5)
    })

    it('deve fazer pop consecutivamente', () => {
      componentData.push()
      componentData.push()
      componentData.push()

      componentData.pop()
      expect(componentData.size).toBe(2)

      componentData.pop()
      expect(componentData.size).toBe(1)

      componentData.pop()
      expect(componentData.size).toBe(0)
    })

    it('não deve ter size negativo lógico após pop em vazio', () => {
      componentData.pop()

      expect(componentData.size).toBe(0)
    })
  })

  describe('Edge Cases - Muitos Elementos', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.Float64 }
      componentData = new ComponentData(schema, 10)
    })

    it('deve inserir 100 elementos com crescimentos sucessivos', () => {
      for (let i = 0; i < 100; i++) {
        componentData.push()
      }

      expect(componentData.size).toBe(100)
    })

    it('deve preservar dados ao inserir muitos elementos', () => {
      const schema = { id: ComponentFieldType.Int32 }
      const data = new ComponentData(schema, 5)

      for (let i = 0; i < 50; i++) {
        data.push()
        data.field('id')[i] = i * 2
      }

      const field = data.field('id')
      expect(field[0]).toBe(0)
      expect(field[10]).toBe(20)
      expect(field[25]).toBe(50)
      expect(field[49]).toBe(98)
    })

    it('deve fazer swap em muitos elementos', () => {
      for (let i = 0; i < 50; i++) {
        componentData.push()
        componentData.field('value')[i] = i + 0.5
      }

      const field = componentData.field('value')
      const firstVal = field[0]
      const lastVal = field[49]

      componentData.swap(0, 49)

      expect(field[0]).toBe(lastVal)
      expect(field[49]).toBe(firstVal)
    })

    it('deve fazer operações sequenciais com 1000 elementos', () => {
      const schema = { x: ComponentFieldType.Uint32, y: ComponentFieldType.Uint32 }
      const data = new ComponentData(schema, 16)

      for (let i = 0; i < 1000; i++) {
        data.push()
      }

      expect(data.size).toBe(1000)

      for (let i = 0; i < 100; i++) {
        data.pop()
      }

      expect(data.size).toBe(900)
    })
  })

  describe('Edge Cases - Campos Vazios', () => {
    it('deve criar ComponentData com esquema vazio', () => {
      const componentData = new ComponentData({})

      expect(componentData.size).toBe(0)
      expect(componentData.isFull).toBe(false)
    })

    it('deve fazer push em esquema vazio sem erro', () => {
      const componentData = new ComponentData({})

      expect(() => {
        componentData.push()
      }).not.toThrow()

      expect(componentData.size).toBe(1)
    })

    it('deve fazer swap em esquema vazio', () => {
      const componentData = new ComponentData({})

      componentData.push()
      componentData.push()

      expect(() => {
        componentData.swap(0, 1)
      }).not.toThrow()
    })
  })

  describe('Data Property Immutability', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.Float32 }
      componentData = new ComponentData(schema)
    })

    it('deve retornar os mesmos campos via data getter', () => {
      componentData.push()

      const data1 = componentData.data
      const data2 = componentData.data

      expect(data1).toBe(data2)
    })

    it('deve retornar campos atualizados após push', () => {
      const data1 = componentData.data
      const size1 = Object.keys(data1).length

      componentData.push()

      const data2 = componentData.data
      const size2 = Object.keys(data2).length

      expect(size1).toBe(size2)
      expect(data1).toBe(data2)
    })
  })

  describe('Novos Tipos de Campo - Cobertura Completa', () => {
    it('deve suportar Float16 em operações copyFrom', () => {
      const schema = { value: ComponentFieldType.Float16 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 10)

      source.push()
      const sourceField = source.field('value')
      sourceField[0] = 1.5

      target.copyFrom(source, 0)

      expect(target.size).toBe(1)
      expect(target.field('value')[0]).toBe(1.5)
    })

    it('deve suportar Uint8Clamped em operações de crescimento', () => {
      const schema = { value: ComponentFieldType.Uint8Clamped }
      const data = new ComponentData(schema, 5)

      for (let i = 0; i < 10; i++) {
        data.push()
        data.field('value')[i] = Math.min(255, i * 30)
      }

      expect(data.size).toBe(10)
      expect(data.field('value')[0]).toBe(0)
      expect(data.field('value')[9]).toBe(255)
    })

    it('deve suportar Int8 com valores negativos', () => {
      const schema = { value: ComponentFieldType.Int8 }
      const data = new ComponentData(schema)

      data.push()
      const field = data.field('value')
      field[0] = -128

      expect(field[0]).toBe(-128)
    })

    it('deve suportar Uint16 em operações de cópia', () => {
      const schema = { id: ComponentFieldType.Uint16 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 10)

      source.push()
      source.push()

      const sourceField = source.field('id')
      sourceField[0] = 65535
      sourceField[1] = 32768

      target.copyFrom(source, 0)
      target.copyFrom(source, 1)

      const targetField = target.field('id')
      expect(targetField[0]).toBe(65535)
      expect(targetField[1]).toBe(32768)
    })

    it('deve criar BigInt64 e BigUint64 sem inicialização via push', () => {
      const schema = {
        bigInt64: ComponentFieldType.BigInt64,
        bigUint64: ComponentFieldType.BigUint64,
      }

      const data = new ComponentData(schema, 10)

      const bigInt64Field = data.field('bigInt64')
      const bigUint64Field = data.field('bigUint64')

      expect(bigInt64Field).toBeInstanceOf(BigInt64Array)
      expect(bigUint64Field).toBeInstanceOf(BigUint64Array)

      // Atribui valores diretamente sem usar push que não suporta BigInt inicialmente
      bigInt64Field[0] = 100n
      bigUint64Field[0] = 200n

      expect(bigInt64Field[0]).toBe(100n)
      expect(bigUint64Field[0]).toBe(200n)
    })

    it('deve fazer swap com BigInt64 e BigUint64 após atribuição manual', () => {
      const schema = {
        id: ComponentFieldType.BigInt64,
        value: ComponentFieldType.BigUint64,
      }

      const data = new ComponentData(schema, 10)

      const idField = data.field('id')
      const valueField = data.field('value')

      idField[0] = 100n
      idField[1] = 200n
      valueField[0] = 300n
      valueField[1] = 400n

      data.swap(0, 1)

      expect(idField[0]).toBe(200n)
      expect(idField[1]).toBe(100n)
      expect(valueField[0]).toBe(400n)
      expect(valueField[1]).toBe(300n)
    })

    it('deve suportar todos os tipos em um único schema com acesso direto', () => {
      const schema = {
        int8: ComponentFieldType.Int8,
        uint8: ComponentFieldType.Uint8,
        uint8Clamped: ComponentFieldType.Uint8Clamped,
        int16: ComponentFieldType.Int16,
        uint16: ComponentFieldType.Uint16,
        int32: ComponentFieldType.Int32,
        uint32: ComponentFieldType.Uint32,
        float16: ComponentFieldType.Float16,
        float32: ComponentFieldType.Float32,
        float64: ComponentFieldType.Float64,
        bigInt64: ComponentFieldType.BigInt64,
        bigUint64: ComponentFieldType.BigUint64,
      }

      const data = new ComponentData(schema, 10)

      const int8Field = data.field('int8')
      const uint8Field = data.field('uint8')
      const uint8ClampedField = data.field('uint8Clamped')
      const int16Field = data.field('int16')
      const uint16Field = data.field('uint16')
      const int32Field = data.field('int32')
      const uint32Field = data.field('uint32')
      const float16Field = data.field('float16')
      const float32Field = data.field('float32')
      const float64Field = data.field('float64')
      const bigInt64Field = data.field('bigInt64')
      const bigUint64Field = data.field('bigUint64')

      // Atribui valores diretamente
      int8Field[0] = -100
      uint8Field[0] = 200
      uint8ClampedField[0] = 255
      int16Field[0] = -30000
      uint16Field[0] = 65535
      int32Field[0] = -2000000000
      uint32Field[0] = 4000000000
      float16Field[0] = 1.5
      float32Field[0] = 3.14
      float64Field[0] = 3.141592653589793
      bigInt64Field[0] = -BigInt('9223372036854775807')
      bigUint64Field[0] = BigInt('18446744073709551615')

      expect(int8Field[0]).toBe(-100)
      expect(uint8Field[0]).toBe(200)
      expect(uint8ClampedField[0]).toBe(255)
      expect(int16Field[0]).toBe(-30000)
      expect(uint16Field[0]).toBe(65535)
      expect(int32Field[0]).toBe(-2000000000)
      expect(uint32Field[0]).toBe(4000000000)
      expect(float16Field[0]).toBe(1.5)
      expect(float32Field[0]).toBeCloseTo(3.14, 2)
      expect(float64Field[0]).toBe(3.141592653589793)
      expect(bigInt64Field[0]).toBe(-BigInt('9223372036854775807'))
      expect(bigUint64Field[0]).toBe(BigInt('18446744073709551615'))
    })
  })
})
