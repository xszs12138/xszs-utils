/**
 * 将数组按照指定数量分组
 * @param arr - 要分组的数组
 * @param n - 每组元素数量，默认为 1
 * @returns 分组后的二维数组
 */
export function chunk<T>(arr: T[], n: number = 1): T[] | T[][] {
  if (n <= 0)
    return arr
  if (arr.length < n)
    return arr

  const result: T[][] = []
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n))
  }
  return result
}

/**
 * @description 判断两个值是否相等
 * @param a - 要判断的值
 * @param b - 要判断的值
 * @returns 是否相等
 *
 */

export function isEquals(a: any, b: any): boolean {
  if (typeof a !== typeof b)
    return false
  if (Object.prototype.toString.call(a) === '[object Object]' && Object.prototype.toString.call(b) === '[object Object]') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length)
      return false
    for (const key of keysA) {
      if (a[key] !== b[key])
        return false
    }
    return true
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  return a === b
}

/**
 * 数组去重
 * @param arr - 要去重的数组
 * @returns 去重后的数组
 * @description 如果[0,-0,1] 返回[0,1] -0，0不进行特殊处理
 */
export function unique<T = any>(arr: T[]): T[] {
  const result: T[] = []
  for (const item of arr) {
    if (!result.some(exist => isEquals(exist, item))) {
      result.push(item)
    }
  }
  return result
}

/**
 * 求数组中的最大值
 * @param arr 数值数组
 * @returns 最大值
 * @example
 * getArrayMax([1, 2, 3, 4, 5]) // 5
 */

export function getArrayMax(arr: number[]): number | undefined {
  if (arr.length === 0)
    return undefined
  let max = arr[0]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}

/**
 * 求数组中的最小值
 * @param arr 数值数组
 * @returns 最小值
 * @example
 * getArrayMin([1, 2, 3, 4, 5]) // 1
 */
export function getArrayMin(arr: number[]): number | undefined {
  if (arr.length === 0)
    return undefined
  let min = arr[0]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i]
    }
  }
  return min
}
