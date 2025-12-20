import { describe, expect, it } from 'vitest'
import { chunk, getArrayMax, getArrayMin, isEquals, unique } from './arrayFn'

describe('arrayFn', () => {
  describe('chunk', () => {
    it('应该将数组按照指定数量分组', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]])
    })

    it('当 n <= 0 时应该返回原数组', () => {
      expect(chunk([1, 2, 3], 0)).toEqual([1, 2, 3])
      expect(chunk([1, 2, 3], -1)).toEqual([1, 2, 3])
    })

    it('当数组长度小于 n 时应该返回原数组', () => {
      expect(chunk([1, 2], 5)).toEqual([1, 2])
    })

    it('默认 n=1 时应该返回二维数组', () => {
      expect(chunk([1, 2, 3])).toEqual([[1], [2], [3]])
    })
  })

  describe('unique', () => {
    it('应该去除数组中的重复元素', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('应该处理对象数组的去重', () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1 }
      const obj3 = { a: 2 }
      expect(unique([obj1, obj2, obj3])).toEqual([obj1, obj3])
    })

    it('处理混合情况', () => {
      const obj3 = { a: 1, b: 2 }
      expect(unique([[3, 2, 1], [1, 2, 3], obj3, 'a', 'b', 'a', [1, 2], [1, 2]])).toEqual([[3, 2, 1], [1, 2, 3], obj3, 'a', 'b', [1, 2]])
    })

    it('应该处理 0 和 -0', () => {
      expect(unique([0, -0, 1])).toEqual([0, 1])
    })
  })

  describe('isEquals', () => {
    it('应该正确比较基本类型', () => {
      expect(isEquals(1, 1)).toBe(true)
      expect(isEquals(1, 2)).toBe(false)
      expect(isEquals('hello', 'hello')).toBe(true)
      expect(isEquals('hello', 'world')).toBe(false)
    })

    it('应该正确比较不同类型', () => {
      expect(isEquals(1, '1')).toBe(false)
      expect(isEquals(null, undefined)).toBe(false)
    })

    it('应该正确比较对象', () => {
      expect(isEquals({ a: 1 }, { a: 1 })).toBe(true)
      expect(isEquals({ a: 1 }, { a: 2 })).toBe(false)
      expect(isEquals({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    })

    it('应该正确比较数组', () => {
      expect(isEquals([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(isEquals([1, 2, 3], [1, 2, 4])).toBe(false)
    })
  })
})

describe('getArrayMax', () => {
  it('should return the max of the array', () => {
    expect(getArrayMax([1, 2, 3, 4, 5])).toEqual(5)
  })
})

describe('getArrayMin', () => {
  it('should return the min of the array', () => {
    expect(getArrayMin([1, 2, 3, 4, 5])).toEqual(1)
  })
})
