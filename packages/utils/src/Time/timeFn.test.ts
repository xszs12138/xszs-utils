import { describe, expect, it } from 'vitest'
import { generateTimePeriod, getDateRange, getDaysBetweenDates, isDateAfter, isDateBefore, isDateInRange, transformDataTo24Or96 } from './timeFn'

describe('generateTimePeriod', () => {
  it('因该返回96个时间点', () => {
    expect(generateTimePeriod(96, 'start')).toEqual(
      [
        '00:00',
        '00:15',
        '00:30',
        '00:45',
        '01:00',
        '01:15',
        '01:30',
        '01:45',
        '02:00',
        '02:15',
        '02:30',
        '02:45',
        '03:00',
        '03:15',
        '03:30',
        '03:45',
        '04:00',
        '04:15',
        '04:30',
        '04:45',
        '05:00',
        '05:15',
        '05:30',
        '05:45',
        '06:00',
        '06:15',
        '06:30',
        '06:45',
        '07:00',
        '07:15',
        '07:30',
        '07:45',
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00',
        '11:15',
        '11:30',
        '11:45',
        '12:00',
        '12:15',
        '12:30',
        '12:45',
        '13:00',
        '13:15',
        '13:30',
        '13:45',
        '14:00',
        '14:15',
        '14:30',
        '14:45',
        '15:00',
        '15:15',
        '15:30',
        '15:45',
        '16:00',
        '16:15',
        '16:30',
        '16:45',
        '17:00',
        '17:15',
        '17:30',
        '17:45',
        '18:00',
        '18:15',
        '18:30',
        '18:45',
        '19:00',
        '19:15',
        '19:30',
        '19:45',
        '20:00',
        '20:15',
        '20:30',
        '20:45',
        '21:00',
        '21:15',
        '21:30',
        '21:45',
        '22:00',
        '22:15',
        '22:30',
        '22:45',
        '23:00',
        '23:15',
        '23:30',
        '23:45',
      ],
    )
    expect(generateTimePeriod(96, 'end')).toEqual(
      [
        '00:15',
        '00:30',
        '00:45',
        '01:00',
        '01:15',
        '01:30',
        '01:45',
        '02:00',
        '02:15',
        '02:30',
        '02:45',
        '03:00',
        '03:15',
        '03:30',
        '03:45',
        '04:00',
        '04:15',
        '04:30',
        '04:45',
        '05:00',
        '05:15',
        '05:30',
        '05:45',
        '06:00',
        '06:15',
        '06:30',
        '06:45',
        '07:00',
        '07:15',
        '07:30',
        '07:45',
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00',
        '11:15',
        '11:30',
        '11:45',
        '12:00',
        '12:15',
        '12:30',
        '12:45',
        '13:00',
        '13:15',
        '13:30',
        '13:45',
        '14:00',
        '14:15',
        '14:30',
        '14:45',
        '15:00',
        '15:15',
        '15:30',
        '15:45',
        '16:00',
        '16:15',
        '16:30',
        '16:45',
        '17:00',
        '17:15',
        '17:30',
        '17:45',
        '18:00',
        '18:15',
        '18:30',
        '18:45',
        '19:00',
        '19:15',
        '19:30',
        '19:45',
        '20:00',
        '20:15',
        '20:30',
        '20:45',
        '21:00',
        '21:15',
        '21:30',
        '21:45',
        '22:00',
        '22:15',
        '22:30',
        '22:45',
        '23:00',
        '23:15',
        '23:30',
        '23:45',
        '24:00',
      ],
    )
  })
  it('返回时间范围为1-2的96个时间点', () => {
    expect(generateTimePeriod(96, 'start', [1, 2])).toEqual(
      [
        '01:00',
        '01:15',
        '01:30',
        '01:45',
      ],
    )
    expect(generateTimePeriod(96, 'end', [1, 2])).toEqual(
      [
        '01:15',
        '01:30',
        '01:45',
        '02:00',
      ],
    )
  })
  it('返回时间范围为1-2的24个时间点', () => {
    expect(generateTimePeriod(24, 'start', [1, 2])).toEqual(['01:00', '02:00'])
  })
  it('因该返回24个时间点', () => {
    expect(generateTimePeriod(24, 'start')).toEqual(['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'])
    expect(generateTimePeriod(24, 'end')).toEqual(['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'])
  })
})

describe('isDateInRange', () => {
  it('判断一个日期是否在一段时间内', () => {
    expect(isDateInRange('2025-01-01', ['2025-01-01', '2025-01-02'])).toBe(true)
    expect(isDateInRange('2025-01-10', ['2025-01-01', '2025-01-02'])).toBe(false)
  })

  it('边界情况：日期等于开始时间', () => {
    expect(isDateInRange('2025-01-01', ['2025-01-01', '2025-01-10'])).toBe(true)
  })

  it('边界情况：日期等于结束时间', () => {
    expect(isDateInRange('2025-01-10', ['2025-01-01', '2025-01-10'])).toBe(true)
  })

  it('边界情况：日期早于开始时间', () => {
    expect(isDateInRange('2024-12-31', ['2025-01-01', '2025-01-10'])).toBe(false)
  })

  it('边界情况：日期晚于结束时间', () => {
    expect(isDateInRange('2025-01-11', ['2025-01-01', '2025-01-10'])).toBe(false)
  })

  it('边界情况：开始和结束时间相同', () => {
    expect(isDateInRange('2025-01-01', ['2025-01-01', '2025-01-01'])).toBe(true)
    expect(isDateInRange('2025-01-02', ['2025-01-01', '2025-01-01'])).toBe(false)
  })

  it('边界情况：不同时区的 Date 对象', () => {
    const date = new Date('2025-02-01T12:00:00Z')
    const rangeStart = new Date('2025-02-01T00:00:00+08:00') // 北京时间 2025-02-01
    const rangeEnd = new Date('2025-02-01T23:59:59+08:00')
    expect(isDateInRange(date, [rangeStart, rangeEnd])).toBe(true)
  })

  it('边界情况：日期带有时间(精确到小时/分钟/秒)', () => {
    expect(isDateInRange('2025-03-01T00:00:00', ['2025-03-01T00:00:00', '2025-03-01T23:59:59'])).toBe(true)
    expect(isDateInRange('2025-03-01T23:59:59', ['2025-03-01T00:00:00', '2025-03-01T23:59:59'])).toBe(true)
    expect(isDateInRange('2025-03-02T00:00:00', ['2025-03-01T00:00:00', '2025-03-01T23:59:59'])).toBe(false)
  })

  it('边界情况：使用Date对象和字符串混合', () => {
    expect(isDateInRange(new Date('2025-04-01'), ['2025-04-01', new Date('2025-04-10')])).toBe(true)
    expect(isDateInRange(new Date('2025-04-11'), ['2025-04-01', '2025-04-10'])).toBe(false)
  })
})

describe('isDateAfter', () => {
  it('should return true if date is after compareDate', () => {
    expect(isDateAfter('2025-01-02', '2025-01-01')).toBe(true)
    expect(isDateAfter(new Date('2025-01-02'), '2025-01-01')).toBe(true)
    expect(isDateAfter('2025-01-01T12:01:00', '2025-01-01T12:00:00')).toBe(true)
  })

  it('should return false if date is before or equal to compareDate', () => {
    expect(isDateAfter('2025-01-01', '2025-01-02')).toBe(false)
    expect(isDateAfter('2025-01-01', '2025-01-01')).toBe(false)
    expect(isDateAfter(new Date('2025-01-01T11:59:59'), new Date('2025-01-01T12:00:00'))).toBe(false)
  })

  it('handles Date object and string cross-comparison', () => {
    expect(isDateAfter(new Date('2025-01-03'), '2025-01-02')).toBe(true)
    expect(isDateAfter('2025-01-03', new Date('2025-01-02'))).toBe(true)
  })
  it('should be before today', () => {
    expect(isDateBefore('2025-12-01', new Date())).toBe(true)
  })
})

describe('isDateBefore', () => {
  it('should return true if date is before compareDate', () => {
    expect(isDateBefore('2025-01-01', '2025-01-02')).toBe(true)
    expect(isDateBefore(new Date('2025-01-01'), '2025-01-02')).toBe(true)
    expect(isDateBefore('2025-01-01T12:00:00', '2025-01-01T12:01:00')).toBe(true)
  })

  it('should return false if date is after or equal to compareDate', () => {
    expect(isDateBefore('2025-01-02', '2025-01-01')).toBe(false)
    expect(isDateBefore('2025-01-01', '2025-01-01')).toBe(false)
    expect(isDateBefore(new Date('2025-01-01T12:00:01'), new Date('2025-01-01T12:00:00'))).toBe(false)
  })

  it('handles Date object and string cross-comparison', () => {
    expect(isDateBefore(new Date('2025-01-01'), '2025-01-02')).toBe(true)
    expect(isDateBefore('2025-01-02', new Date('2025-01-03'))).toBe(true)
  })
})

describe('getDaysBetweenDates', () => {
  it('should return the number of days between two dates', () => {
    expect(getDaysBetweenDates('2025-01-01', '2025-01-02')).toBe(1)
    expect(getDaysBetweenDates('2025-01-01', '2025-01-10')).toBe(9)
    expect(getDaysBetweenDates('2025-01-10', '2025-01-01')).toBe(-9)
    expect(getDaysBetweenDates(new Date('2025-01-01'), new Date('2025-01-02'))).toBe(1)
    expect(getDaysBetweenDates('2025-01-01T00:00:00', '2025-01-02T00:00:00')).toBe(1)
    // Same day returns 0
    expect(getDaysBetweenDates('2025-01-01', '2025-01-01')).toBe(0)
  })

  it('should support hour unit', () => {
    expect(getDaysBetweenDates('2025-01-01T00:00:00', '2025-01-01T02:00:00', 'hour')).toBe(2)
    expect(getDaysBetweenDates('2025-01-01T10:15:00', '2025-01-01T12:45:00', 'hour')).toBe(2)
    expect(getDaysBetweenDates('2025-01-02T00:00:00', '2025-01-01T00:00:00', 'hour')).toBe(-24)
    // 字符串类型的测试用例
    expect(getDaysBetweenDates('2025-01-01 00:00:00', '2025-01-01 05:00:00', 'hour')).toBe(5)
    expect(getDaysBetweenDates('2025-01-01 22:00:00', '2025-01-02 01:00:00', 'hour')).toBe(3)
    expect(getDaysBetweenDates('2025/01/01 08:00:00', '2025/01/01 10:30:00', 'hour')).toBe(2)
    expect(getDaysBetweenDates('2025-01-01T15:00:00', '2025-01-01 18:00:00', 'hour')).toBe(3)
  })

  it('should support minute unit', () => {
    expect(getDaysBetweenDates('2025-01-01T00:00:00', '2025-01-01T00:10:00', 'minute')).toBe(10)
    expect(getDaysBetweenDates('2025-01-01T23:50:00', '2025-01-02T00:00:00', 'minute')).toBe(10)
    expect(getDaysBetweenDates('2025-01-01T00:10:00', '2025-01-01T00:00:00', 'minute')).toBe(-10)
    // 字符串类型的测试用例
    expect(getDaysBetweenDates('2025-01-01 00:00:00', '2025-01-01 00:25:00', 'minute')).toBe(25)
    expect(getDaysBetweenDates('2025/01/01 12:30:00', '2025/01/01 13:00:00', 'minute')).toBe(30)
    expect(getDaysBetweenDates('2025-01-01 10:00:00', '2025-01-01T11:05:00', 'minute')).toBe(65)
  })

  it('should support second unit', () => {
    expect(getDaysBetweenDates('2025-01-01T00:00:00', '2025-01-01T00:00:05', 'second')).toBe(5)
    expect(getDaysBetweenDates('2025-01-01T00:00:10', '2025-01-01T00:00:00', 'second')).toBe(-10)
    // 字符串类型的测试用例
    expect(getDaysBetweenDates('2025-01-01 00:00:00', '2025-01-01 00:00:30', 'second')).toBe(30)
    expect(getDaysBetweenDates('2025/01/01 23:59:59', '2025/01/02 00:00:01', 'second')).toBe(2)
    expect(getDaysBetweenDates('2025-01-01T12:00:00', '2025-01-01 12:00:05', 'second')).toBe(5)
    expect(getDaysBetweenDates('2025-01-01 08:00:10', '2025-01-01 08:00:00', 'second')).toBe(-10)
  })
})

describe('getDateRange', () => {
  it('should return the range of dates', () => {
    // 测试空数组
    expect(getDateRange([])).toEqual([])
    // 测试单个元素的数组
    expect(getDateRange(['2025-01-01'])).toEqual(['2025-01-01', '2025-01-01'])
    // 测试两个元素的数组，顺序正序
    expect(getDateRange(['2025-01-01', '2025-01-02'])).toEqual(['2025-01-01', '2025-01-02'])
    // 测试两个元素的数组，顺序倒序
    expect(getDateRange(['2025-01-02', '2025-01-01'])).toEqual(['2025-01-01', '2025-01-02'])
    // 测试多个元素的数组
    expect(getDateRange(['2025-01-05', '2025-01-03', '2025-01-10', '2025-01-01'])).toEqual(['2025-01-01', '2025-01-10'])

    // 测试空 Set
    expect(getDateRange(new Set())).toEqual([])
    // 测试单个元素的 Set
    expect(getDateRange(new Set(['2025-01-01']))).toEqual(['2025-01-01', '2025-01-01'])
    // 测试两个元素的 Set
    expect(getDateRange(new Set(['2025-01-01', '2025-01-02']))).toEqual(['2025-01-01', '2025-01-02'])
    // 测试多个元素的 Set
    expect(getDateRange(new Set(['2025-01-05', '2025-01-03', '2025-01-10', '2025-01-01']))).toEqual(['2025-01-01', '2025-01-10'])

    // 测试有重复元素的数组和 Set
    expect(getDateRange(['2025-01-01', '2025-01-01', '2025-01-01'])).toEqual(['2025-01-01', '2025-01-01'])
    expect(getDateRange(new Set(['2025-01-01', '2025-01-01']))).toEqual(['2025-01-01', '2025-01-01'])

    // 测试不同格式字符串解析
    expect(getDateRange(['2025-01-01', '2025/01/03', '2024-12-31'])).toEqual(['2024-12-31', '2025/01/03'])
    expect(getDateRange(new Set(['2024-12-30T12:00:00', '2024-12-31', '2025-01-01']))).toEqual(['2024-12-30T12:00:00', '2025-01-01'])
  })
})

describe('transformDataTo24Or96', () => {
  it('should return the transformed data for 96->24 aggregation, handle extra keys, multiple dates, and 24->24 identity', () => {
    // 基础 96点转24点
    const data = [
      { infoDate: '2021-01-01', infoTime: '00:15', actualLoad: 200 },
      { infoDate: '2021-01-01', infoTime: '00:30', actualLoad: 300 },
      { infoDate: '2021-01-01', infoTime: '00:45', actualLoad: 400 },
      { infoDate: '2021-01-01', infoTime: '01:00', actualLoad: 500 },
    ]
    expect(
      transformDataTo24Or96(data, {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 24,
      }),
    ).toEqual([{ infoDate: '2021-01-01', infoTime: '01:00', actualLoad: 1400 }])

    // 增加一个无效段（部分时段缺数据应忽略）
    const dataWithGap = [
      { infoDate: '2021-01-01', infoTime: '00:15', actualLoad: 100 },
      { infoDate: '2021-01-01', infoTime: '01:00', actualLoad: 200 },
    ]
    expect(
      transformDataTo24Or96(dataWithGap, {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 24,
      }),
    ).toEqual([{ infoDate: '2021-01-01', infoTime: '01:00', actualLoad: 300 }])

    // 增强：含其他字段，检查其他字段带出逻辑
    const richData = [
      { infoDate: '2021-01-02', infoTime: '11:15', value: 1, note: 'a', actualLoad: 10 },
      { infoDate: '2021-01-02', infoTime: '11:30', value: 2, note: 'a', actualLoad: 10 },
      { infoDate: '2021-01-02', infoTime: '11:45', value: 3, note: 'a', actualLoad: 30 },
      { infoDate: '2021-01-02', infoTime: '12:00', value: 4, note: 'a', actualLoad: 20 },
      { infoDate: '2021-01-02', infoTime: '12:15', value: 9, note: 'b', actualLoad: 9 },
    ]
    expect(
      transformDataTo24Or96(richData, {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 24,
      }),
    ).toEqual([
      {
        infoDate: '2021-01-02',
        infoTime: '12:00',
        actualLoad: 70,
        value: 1,
        note: 'a',
      },
      {
        infoDate: '2021-01-02',
        infoTime: '13:00',
        actualLoad: 9,
        value: 9,
        note: 'b',
      },
    ])

    // 多日期混合聚合
    const multiDate = [
      { infoDate: '2023-01-01', infoTime: '00:15', actualLoad: 1 },
      { infoDate: '2023-01-01', infoTime: '00:30', actualLoad: 3 },
      { infoDate: '2023-01-02', infoTime: '00:15', actualLoad: 7 },
      { infoDate: '2023-01-02', infoTime: '00:30', actualLoad: 9 },
      { infoDate: '2023-01-02', infoTime: '00:45', actualLoad: 8 },
      { infoDate: '2023-01-02', infoTime: '01:00', actualLoad: 10 },
    ]
    expect(
      transformDataTo24Or96(multiDate, {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 24,
      }),
    ).toEqual([
      { infoDate: '2023-01-01', infoTime: '01:00', actualLoad: 4 },
      { infoDate: '2023-01-02', infoTime: '01:00', actualLoad: 34 },
    ])

    // 24点转24点为"identity"
    const pure24h = [
      { infoDate: '2022-01-01', infoTime: '01:00', actualLoad: 100, other: 't' },
      { infoDate: '2022-01-01', infoTime: '02:00', actualLoad: 200, other: 't' },
    ]
    expect(
      transformDataTo24Or96(pure24h, {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 24,
      }),
    ).toEqual([
      { infoDate: '2022-01-01', infoTime: '01:00', actualLoad: 100, other: 't' },
      { infoDate: '2022-01-01', infoTime: '02:00', actualLoad: 200, other: 't' },
    ])
  })

  it('should support 24->96 splitting: split 24 point data into 96 point data', () => {
    // 24点转96点：将每个24点数据拆分成4个96点数据，每个96点数据的值为原值的1/4
    const data24 = [
      { infoDate: '2024-05-01', infoTime: '01:00', actualLoad: 400 },
      { infoDate: '2024-05-01', infoTime: '02:00', actualLoad: 800 },
    ]
    const result = transformDataTo24Or96(data24, {
      dateKeys: 'infoDate',
      timeKeys: 'infoTime',
      calcKeys: ['actualLoad'],
      targetTimePeriodMode: 96,
    })
    expect(result).toEqual([
      { infoDate: '2024-05-01', infoTime: '00:15', actualLoad: 100 },
      { infoDate: '2024-05-01', infoTime: '00:30', actualLoad: 100 },
      { infoDate: '2024-05-01', infoTime: '00:45', actualLoad: 100 },
      { infoDate: '2024-05-01', infoTime: '01:00', actualLoad: 100 },
      { infoDate: '2024-05-01', infoTime: '01:15', actualLoad: 200 },
      { infoDate: '2024-05-01', infoTime: '01:30', actualLoad: 200 },
      { infoDate: '2024-05-01', infoTime: '01:45', actualLoad: 200 },
      { infoDate: '2024-05-01', infoTime: '02:00', actualLoad: 200 },
    ])

    // 测试包含其他字段的情况
    const data24WithExtra = [
      { infoDate: '2024-06-01', infoTime: '01:00', actualLoad: 200, value: 10, note: 'test' },
      { infoDate: '2024-06-01', infoTime: '02:00', actualLoad: 400, value: 20, note: 'test2' },
    ]
    const resultWithExtra = transformDataTo24Or96(data24WithExtra, {
      dateKeys: 'infoDate',
      timeKeys: 'infoTime',
      calcKeys: ['actualLoad'],
      targetTimePeriodMode: 96,
    })
    expect(resultWithExtra).toEqual([
      { infoDate: '2024-06-01', infoTime: '00:15', actualLoad: 50, value: 10, note: 'test' },
      { infoDate: '2024-06-01', infoTime: '00:30', actualLoad: 50, value: 10, note: 'test' },
      { infoDate: '2024-06-01', infoTime: '00:45', actualLoad: 50, value: 10, note: 'test' },
      { infoDate: '2024-06-01', infoTime: '01:00', actualLoad: 50, value: 10, note: 'test' },
      { infoDate: '2024-06-01', infoTime: '01:15', actualLoad: 100, value: 20, note: 'test2' },
      { infoDate: '2024-06-01', infoTime: '01:30', actualLoad: 100, value: 20, note: 'test2' },
      { infoDate: '2024-06-01', infoTime: '01:45', actualLoad: 100, value: 20, note: 'test2' },
      { infoDate: '2024-06-01', infoTime: '02:00', actualLoad: 100, value: 20, note: 'test2' },
    ])

    // 测试多日期的情况
    const multiDate24 = [
      { infoDate: '2024-07-01', infoTime: '01:00', actualLoad: 100 },
      { infoDate: '2024-07-02', infoTime: '01:00', actualLoad: 200 },
    ]
    const multiDateResult = transformDataTo24Or96(multiDate24, {
      dateKeys: 'infoDate',
      timeKeys: 'infoTime',
      calcKeys: ['actualLoad'],
      targetTimePeriodMode: 96,
    })
    expect(multiDateResult).toEqual([
      { infoDate: '2024-07-01', infoTime: '00:15', actualLoad: 25 },
      { infoDate: '2024-07-01', infoTime: '00:30', actualLoad: 25 },
      { infoDate: '2024-07-01', infoTime: '00:45', actualLoad: 25 },
      { infoDate: '2024-07-01', infoTime: '01:00', actualLoad: 25 },
      { infoDate: '2024-07-02', infoTime: '00:15', actualLoad: 50 },
      { infoDate: '2024-07-02', infoTime: '00:30', actualLoad: 50 },
      { infoDate: '2024-07-02', infoTime: '00:45', actualLoad: 50 },
      { infoDate: '2024-07-02', infoTime: '01:00', actualLoad: 50 },
    ])
  })

  it('should support 24->96 splitting: just copy through if already 96 point granularity', () => {
    // 切分成96点时，原本就是96点则不聚合，直接返回
    const already96 = [
      { infoDate: '2024-05-01', infoTime: '00:15', actualLoad: 1 },
      { infoDate: '2024-05-01', infoTime: '00:30', actualLoad: 2 },
    ]
    expect(
      transformDataTo24Or96(already96, {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 96,
      }),
    ).toEqual(already96)
  })

  it('should process empty input', () => {
    expect(
      transformDataTo24Or96([], {
        dateKeys: 'infoDate',
        timeKeys: 'infoTime',
        calcKeys: ['actualLoad'],
        targetTimePeriodMode: 24,
      }),
    ).toEqual([])
  })
})
