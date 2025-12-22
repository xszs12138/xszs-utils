import Decimal from 'decimal.js'
import { unique } from '../Array/arrayFn'
import { groupBy } from '../Data/data'
import { getArrayTotal } from '../Math/math'

// 暴露一些预制的时间数组
export const TIMEARRAY_24 = generateTimePeriod(24)
export const TIMEARRAY_24_END = generateTimePeriod(24, 'end')
export const TIMEARRAY_96 = generateTimePeriod(96)
export const TIMEARRAY_96_END = generateTimePeriod(96, 'end')
/**
 * 生成时间点数组
 * @param timeMode - 时间模式，96表示96个时间点，24表示24个时间点
 * @param beginMode - 开始模式，start表示开始时间，end表示结束时间
 * @param dateRange - 日期范围，[开始时间, 结束时间]
 * @example
 * generateTimePeriod(96, 'start') -> ["00:00", "00:15", "00:30"...,"23:45"]
 * generateTimePeriod(24, 'end') -> ["01:00", "02:00", "03:00"...,"24:00"]
 * generateTimePeriod(24, 'start', [1, 2]) -> ["01:00", "02:00"]
 * generateTimePeriod(24, 'end', [1, 2]) -> ["02:00", "03:00"]
 * @returns 时点数组
 */
export function generateTimePeriod(timeMode: 96 | 24, beginMode: 'start' | 'end' = 'start', dateRange?: [number, number]) {
  let timeNum: number = timeMode
  if (dateRange) {
    if ((dateRange[0] >= 0 && dateRange[1] <= 24) && dateRange[0] <= dateRange[1]) {
      if (timeMode === 96) {
        timeNum = (dateRange[1] - dateRange[0]) * 4
      }
      else {
        timeNum = dateRange[1] - dateRange[0] + 1
      }
    }
    else {
      console.warn('dateRange is invalid')
    }
  }

  if (timeMode === 96) {
    let startTime = beginMode === 'start' ? 0 : 15
    if (timeNum !== timeMode)
      startTime = dateRange![0] * 4 * 15 + (beginMode === 'start' ? 0 : 15)
    return Array.from({ length: timeNum }, (_) => {
      const hour = Math.floor(startTime / 60)
      const minute = startTime % 60
      startTime += 15
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    })
  }
  else {
    const result: string[] = []
    const startTime = dateRange ? dateRange![0] : 0
    const endTime = dateRange ? dateRange![1] : 23
    for (let i = startTime; i <= endTime; i++) {
      if (beginMode === 'start') {
        result.push(`${i.toString().padStart(2, '0')}:00`)
      }
      else {
        result.push(`${(i + 1).toString().padStart(2, '0')}:00`)
      }
    }
    return result
  }
}

/**
 * 时间取整函数：向上取整到最近的整点
 * @param timeStr - 时间字符串，格式为 "HH:mm"
 * @returns 向上取整后的时间字符串
 */
export function roundUpToHour(timeStr: string): string {
  const [hour, minute] = timeStr.split(':').map(Number)
  if (minute > 0) {
    return hour === 23 ? '24:00' : `${(hour + 1).toString().padStart(2, '0')}:00`
  }
  return `${hour.toString().padStart(2, '0')}:00`
}

/**
 * 根据指定建值分组并计算合计值
 * @param data 数据
 * @param groupByKey 分组键值
 * @param calcKeys 计算键值
 * @returns 聚合后的数据
 */
export function getGroupDateTotal<T extends Record<string, any>>(data: T[], groupByKey: keyof T, calcKeys?: keyof T | (keyof T)[]): Map<string, Record<string, number>> {
  const groupData = groupBy(data, groupByKey)
  const map = new Map()
  Object.entries(groupData).forEach(([key, value]) => {
    map.set(key, getArrayTotal(value, calcKeys))
  })
  return map
}

/**
 * 判断一个日期是否在一段时间内
 * @param date 日期
 * @param range 时间范围
 * @returns 是否在时间范围内
 */

export function isDateInRange(date: string | Date, range: [string | Date, string | Date]): boolean {
  const dateObj = new Date(date)
  const rangeStart = new Date(range[0])
  const rangeEnd = new Date(range[1])
  return dateObj >= rangeStart && dateObj <= rangeEnd
}

/**
 * 判断一个日期在对比日期之后
 * @param date 日期
 * @param compareDate 对比日期
 * @returns 是否在对比日期之后
 */
export function isDateAfter(date: string | Date, compareDate: string | Date): boolean {
  const dateObj = new Date(date)
  const compareDateObj = new Date(compareDate)
  return dateObj > compareDateObj
}

/**
 * 判断一个日期在对比日期之前
 * @param date 日期
 * @param compareDate 对比日期
 * @returns 是否在对比日期之前
 */
export function isDateBefore(date: string | Date, compareDate: string | Date): boolean {
  const dateObj = new Date(date)
  const compareDateObj = new Date(compareDate)
  return dateObj < compareDateObj
}

type TimeUnit = 'day' | 'hour' | 'minute' | 'second'
/**
 * 获取两个日期之间的天数或小时或分钟或秒
 * @param date1 日期1
 * @param date2 日期2
 * @param unit 单位，'day' | 'hour' | 'minute' | 'second'
 * @returns 天数或小时或分钟或秒
 */
export function getDaysBetweenDates(date1: string | Date, date2: string | Date, unit: TimeUnit = 'day'): number {
  let timeDiff = 0
  switch (unit) {
    case 'day':
      timeDiff = 1000 * 60 * 60 * 24
      break
    case 'hour':
      timeDiff = 1000 * 60 * 60
      break
    case 'minute':
      timeDiff = 1000 * 60
      break
    case 'second':
      timeDiff = 1000
      break
  }
  const date1Obj = new Date(date1)
  const date2Obj = new Date(date2)
  return Math.floor((date2Obj.getTime() - date1Obj.getTime()) / timeDiff)
}

/**
 * 获取日期范围中的最小日期和最大日期
 * @param dateList 日期列表
 * @returns [最小日期,最大日期]
 */
export function getDateRange(dateList: string[] | Set<string> = []): [string, string] | [] {
  if (dateList instanceof Set) {
    if (dateList.size === 0)
      return []
    else if (dateList.size === 1)
      return [Array.from(dateList).at(0)!, Array.from(dateList).at(0)!]
    return [
      Array.from(dateList).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]!,
      Array.from(dateList)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .at(-1)!,
    ]
  }
  else if (Array.isArray(dateList)) {
    if (dateList.length === 0)
      return []
    else if (dateList.length === 1)
      return [dateList.at(0)!, dateList.at(0)!]
    return [dateList.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]!, dateList.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).at(-1)!]
  }
  return []
}

/**
 * @param data 原始数据 @type 必须含有infoDate和infoTime的键
 * @param calcKeys 需要计算的键 @type 必须含有infoDate和infoTime的键 @values string[]
 * @param timePeriodMode 需要转换的目标时间点数 @values TwentyFourTimeHour | NinetySixTimeHour
 * @returns @type T[] 转换后的24点或96点数据
 * @description 根据时间模式转换数据为24点或96点数据 (最好在使用前判断一下 是否需要使用转换函数 比如 24 ---> 24 的情况下 不要调用这个函数)
 * @warning 注意如果你是96点数据 但是会有某个时段内比如00:35没有数据 那么这个函数会自动跳过这个时段 不会计算这个时段的即 这个时段的数据总值除以 **有效个数** 的平均值
 * @example
 * const data = [
 *   { infoDate: '2021-01-01', infoTime: '00:15', actualLoad: 200 },
 *   { infoDate: '2021-01-01', infoTime: '00:30', actualLoad: 300 },
 *   { infoDate: '2021-01-01', infoTime: '00:45', actualLoad: 400 },
 *   { infoDate: '2021-01-01', infoTime: '01:00', actualLoad: 500 },
 * ];
 * const transFormData = transformDataTo24Or96(data, ['actualLoad'], TimePeriodMode.TwentyFourTimeHour);
 * console.log(transFormData); // [{ infoDate: '2021-01-01', infoTime: '01:00', actualLoad: 1400 }];
 */

export enum TimePeriodMode {
  TwentyFourTimeHour = 24,
  NinetySixTimeHour = 96,
}
export type ExcludeKeys<T> = keyof T
export function transformDataTo24Or96<T extends Record<string, any>>(
  originData: T[],
  options: {
    dateKeys: keyof T
    timeKeys: keyof T
    calcKeys: (keyof T)[]
    targetTimePeriodMode: TimePeriodMode
  },
): T[] {
  const { dateKeys, timeKeys, calcKeys, targetTimePeriodMode } = options
  if (originData.length === 0)
    return []
  // 获取所有键，排除需要计算的键和基础键
  const allKeys = Object.keys(originData[0]) as (keyof T)[]
  const oriDataMode = originData.some(item => /^.+:(?:15|30|45)$/.test(item[timeKeys]))
    ? TimePeriodMode.NinetySixTimeHour
    : TimePeriodMode.TwentyFourTimeHour
  if (oriDataMode === targetTimePeriodMode)
    return originData // 如果原始数据模式和目标模式相同，则直接返回原始数据
  // 时间Map [01:00 -> [00:15,....,[01:00]]]
  const TIME_MAP = new Map(
    Array.from({ length: 24 }, (_, i) => [
      `${i === 23 ? '24' : (i + 1).toString().padStart(2, '0')}:00`,
      Array.from({ length: 4 }, (_, j) => {
        const totalMinutes = i * 60 + (j + 1) * 15
        const h = totalMinutes < 1440 ? Math.floor(totalMinutes / 60) : 24
        const m = totalMinutes % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      }),
    ]),
  )
  const excludeKeys = allKeys.filter(key => key !== dateKeys && key !== timeKeys && !calcKeys.includes(key as keyof Omit<T, ExcludeKeys<T>>))
  // 构建时间集合用于快速查找（96点模式使用）
  const oriInfoTimeSet = new Set(originData.map(item => `${item[dateKeys]} ${item[timeKeys]}`))
  // 按日期分组数据，提升查找性能
  const dataByDate = new Map<string, T[]>()
  originData.forEach((item) => {
    const date = item[dateKeys]
    if (!dataByDate.has(date)) {
      dataByDate.set(date, [])
    }
    dataByDate.get(date)!.push(item)
  })

  const dateSetArr = unique(originData.map(item => item[dateKeys]))
  const newData: T[] = []
  const timeArray = targetTimePeriodMode === TimePeriodMode.TwentyFourTimeHour ? TIMEARRAY_24_END : TIMEARRAY_96_END
  const useFixedDivisor = targetTimePeriodMode === TimePeriodMode.NinetySixTimeHour
  dateSetArr.forEach((date) => {
    const dateData = dataByDate.get(date) || []
    timeArray.forEach((time) => {
      const targetTime = useFixedDivisor ? roundUpToHour(time) : time
      const timeKey = `${date} ${targetTime}`
      if (useFixedDivisor && !oriInfoTimeSet.has(timeKey)) {
        return
      }
      const timeMapValues = TIME_MAP.get(targetTime)
      if (!timeMapValues)
        return
      const matchedData = dateData.filter(item => timeMapValues.includes(item[timeKeys]))
      if (matchedData.length === 0)
        return
      const obj = {
        [dateKeys]: date,
        [timeKeys]: time,
      } as T
      calcKeys.forEach((key) => {
        const values = matchedData.map(item => item[key]).filter(v => v !== undefined && v !== null)
        if (values.length === 0) {
          (obj as any)[key] = null
        }
        else {
          const divisor = useFixedDivisor ? 4 : 1;
          (obj as any)[key] = values
            .reduce((sum, curr) => sum.add(new Decimal(curr)), new Decimal(0))
            .div(divisor)
            .toNumber()
        }
      })
      const firstMatchedItem = matchedData[0]
      excludeKeys.forEach((key) => {
        obj[key] = (firstMatchedItem[key] ?? null) as T[keyof T]
      })
      newData.push(obj)
    })
  })
  return newData
}
