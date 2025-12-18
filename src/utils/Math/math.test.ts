import { describe, expect, it } from 'vitest'
import { getArrayAverage, getArrayTotal, toFixedByKeys } from './math'

describe('getArrayTotal', () => {
  it('should return the total of the array', () => {
    expect(getArrayTotal([{ a: 1 }, { a: undefined }, { a: 3 }])).toEqual({ a: 4 })
    expect(getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a', 'b'])).toEqual({ a: 4, b: 9 })
    expect(getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a'])).toEqual({ a: 4 })
    expect(getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], 'a')).toEqual({ a: 4 })
    expect(getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a', 'a'])).toEqual({ a: 4 })
  })
  it('should return the average of the array', () => {
    expect(getArrayAverage([{ a: 1 }, { a: undefined }, { a: 3 }])).toEqual({ a: 2 })
    expect(getArrayAverage([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a', 'b'])).toEqual({ a: 4 / 2, b: 9 / 3 })
    expect(getArrayAverage([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: null }], ['a', 'b'], true)).toEqual({ a: 4 / 3, b: 5 / 3 })
  })
})
describe('toFixedByKeys', () => {
  it('should return the object with the keys formatted to the specified number of decimal places', () => {
    // 指定 keys 和 fractionDigits
    expect(toFixedByKeys({ a: 1.2345, b: 2.3456 }, ['a', 'b'], 2)).toEqual({ a: '1.23', b: '2.35' })
    expect(toFixedByKeys({ a: 1.2345, b: 2.3456 }, ['a', 'b'], 3)).toEqual({ a: '1.235', b: '2.346' })
    expect(toFixedByKeys({ a: 1.2345, b: 2.3456 }, ['a', 'b'], 0)).toEqual({ a: '1', b: '2' })

    // 未指定 keys，默认全部字段
    expect(toFixedByKeys({ a: 1.856, b: 2.1234 })).toEqual({ a: '1.86', b: '2.12' })

    // 浮点数为整数和负数
    expect(toFixedByKeys({ a: 12.9999, b: -7.2311 }, ['a', 'b'], 1)).toEqual({ a: '13.0', b: '-7.2' })
    expect(toFixedByKeys({ x: 0, y: -0.004 }, ['x', 'y'], 2)).toEqual({ x: '0.00', y: '-0.00' })

    // fractionDigits 为 undefined
    expect(toFixedByKeys({ a: 1.2345 }, ['a'])).toEqual({ a: '1.23' })

    // keys 为 undefined, fractionDigits 为 4
    expect(toFixedByKeys({ k1: 3.1415926, k2: 2.71828 }, undefined, 4)).toEqual({ k1: '3.1416', k2: '2.7183' })

    // data 对象中的字段为 null、undefined
    expect(toFixedByKeys({ a: null, b: undefined }, ['a', 'b'], 2)).toEqual({ a: null, b: undefined })

    // data 为 null 或 undefined
    expect(toFixedByKeys(null as any, ['a', 'b'], 2)).toEqual({})
    expect(toFixedByKeys(undefined as any, ['a', 'b'], 2)).toEqual({})
    expect(toFixedByKeys(null as any)).toEqual({})
    expect(toFixedByKeys(undefined as any)).toEqual({})

    // keys 为空数组
    expect(toFixedByKeys({ a: 1.5 }, [], 2)).toEqual({})

    // 对象中含有多个数据类型
    expect(toFixedByKeys({ a: 5, b: undefined, c: null, d: '6.78', e: false }, undefined, 2)).toEqual({ a: '5.00', b: undefined, c: null, d: '6.78', e: false })
  })
})
