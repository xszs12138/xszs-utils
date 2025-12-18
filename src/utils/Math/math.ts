import Decimal from 'decimal.js'
import { unique } from '../Array/arrayFn'
import { isArray, isCouldBeClacType, isNumber } from '../Data/data'

/**
 * @description 获取指定范围内的随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 *
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export type NumberLike = number | undefined | null | string
/**
 * @description 获取数组中每个元素的合计值
 * @param arr 数组
 * @param calcKeys 要计算的键值，可以是一个键值，也可以是一个键值数组
 * @returns 每个元素的合计值
 * @example
 * getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a','b']) // { a: 4, b: 9 }
 * getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], 'a') // { a: 4 }
 * getArrayTotal([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a','a']) // { a: 4 }
 */
export function getArrayTotal<T extends Record<string, NumberLike>>(arr: T[], calcKeys?: keyof T | (keyof T)[]): Record<string, number> {
  return arr.reduce((acc, curr) => {
    if (calcKeys) {
      if (Array.isArray(calcKeys)) {
        unique(calcKeys).forEach((key) => {
          acc[key as string] = new Decimal(acc[key as string] || 0).plus(new Decimal(curr[key as string] || 0)).toNumber()
        })
      }
      else {
        acc[calcKeys as string] = new Decimal(acc[calcKeys as string] || 0).plus(new Decimal(curr[calcKeys as string] || 0)).toNumber()
      }
    }
    else {
      Object.keys(curr).forEach((key) => {
        if (isNumber(curr[key])) {
          acc[key as string] = new Decimal(acc[key as string] || 0).plus(new Decimal(curr[key as string] || 0)).toNumber()
        }
      })
    }
    return acc
  }, {} as Record<string, number>)
}
/**
 * @description 获取数组中每个元素的平均值
 * @param arr 数组
 * @param calcKeys 要计算的键值，可以是一个键值，也可以是一个键值数组
 * @returns 每个元素的平均值
 * @example
 * getArrayAverage([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a','b']) // { a: 2, b: 3.5 }
 * getArrayAverage([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], 'a') // { a: 2 }
 * getArrayAverage([{ a: 1, b: 2 }, { a: null, b: 3 }, { a: 3, b: 4 }], ['a','a']) // { a: 2 }
 */
export function getArrayAverage<T extends Record<string, any>>(arr: T[], calcKeys?: keyof T | (keyof T)[], allowNull: boolean = false): Record<string, number> {
  const total = getArrayTotal(arr, calcKeys)
  return Object.keys(total).reduce((acc, key) => {
    if (allowNull) {
      acc[key] = new Decimal(total[key]).div(arr.length).toNumber()
    }
    else {
      let isValidCount = 0
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] !== null && arr[i][key] !== undefined)
          isValidCount++
      }
      acc[key] = new Decimal(total[key]).div(isValidCount).toNumber()
    }
    return acc
  }, {} as Record<string, number>)
}

/**
 * 将对象中的指定键的值格式化为指定的小数位数
 * @param {T} data - 要格式化的对象
 * @param {Array<keyof T>} keys - 要格式化的键数组
 * @param {number} [fractionDigits] - 小数位数，默认为2
 * @returns {T} 返回格式化后的对象
 *
 * 该方法用于将对象中的指定键的值格式化为指定的小数位数。
 * 例如，当传入的对象为 { a: 1.2345, b: 2.3456 }，键数组为 ['a', 'b']，小数位数为 2 时，返回的对象为 { a: '1.23', b: '2.35' }。
 */
export function toFixedByKeys<T extends Record<string, any>>(data: T, keys?: (keyof T)[], fractionDigits: number = 2): T {
  if (!data || typeof data !== 'object' || (isArray(keys) && keys.length === 0)) {
    return {} as T
  }
  if (keys && keys.length > 0) {
    return keys.reduce((acc, key) => {
      acc[key as string] = isCouldBeClacType(data[key]) ? new Decimal(data[key] ?? 0).toFixed(fractionDigits) : data[key]
      return acc
    }, {} as Record<string, string>) as T
  }

  return Object.keys(data).reduce((acc, key) => {
    acc[key as string] = isCouldBeClacType(data[key]) ? new Decimal(data[key] ?? 0).toFixed(fractionDigits) : data[key]
    return acc
  }, {} as Record<string, string>) as T
}
