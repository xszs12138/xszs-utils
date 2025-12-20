import type ExcelJS from 'exceljs'
import { isArray, isCouldBeCalcNumType, isObject } from '../../Data/data'
/**
 * Excel 自动合并单元格插件
 * 按列进行竖向合并，合并相同内容的相邻单元格
 * @param worksheet Excel 工作表对象
 */
export function excelAutoMergeCellPlugin(worksheet: ExcelJS.Worksheet): void {
  // 将数字列号转换为 Excel 列字母（1->A, 2->B, ..., 26->Z, 27->AA, ...）
  const getColumnLetter = (colNum: number): string => {
    let result = ''
    let num = colNum
    while (num > 0) {
      num--
      result = String.fromCharCode(65 + (num % 26)) + result
      num = Math.floor(num / 26)
    }
    return result
  }

  // 获取工作表的总行数和总列数
  const rowCount = worksheet.rowCount
  const columnCount = worksheet.columnCount

  if (rowCount < 2 || columnCount < 1) {
    // 至少需要2行（1行表头 + 1行数据）才能合并
    return
  }

  // 遍历每一列
  for (let colIndex = 1; colIndex <= columnCount; colIndex++) {
    const colLetter = getColumnLetter(colIndex)
    let startRow = 2 // 从第2行开始（第1行是表头）
    let currentValue: string | null = null

    // 从第2行开始遍历（第1行是表头）
    for (let rowIndex = 2; rowIndex <= rowCount; rowIndex++) {
      const cell = worksheet.getCell(rowIndex, colIndex)
      const value = cell.value

      // 将值转换为可比较的字符串（处理 null、undefined）
      const normalizedValue = value === null || value === undefined ? '' : String(value)

      if (normalizedValue === currentValue) {
        // 当前值与上一个值相同，继续，等待下一个不同的值或结束
        continue
      }
      else {
        // 值发生变化（或第一次读取），检查是否需要合并之前的单元格
        if (currentValue !== null && startRow < rowIndex - 1) {
          // 有需要合并的单元格（至少2行相同值）
          try {
            worksheet.mergeCells(`${colLetter}${startRow}:${colLetter}${rowIndex - 1}`)
          }
          catch (error) {
            console.warn(`合并单元格失败 ${colLetter}${startRow}:${colLetter}${rowIndex - 1}:`, error)
          }
        }
        // 重置起始行和当前值
        startRow = rowIndex
        currentValue = normalizedValue
      }
    }

    // 处理最后一组相同值的合并
    if (currentValue !== null && startRow < rowCount) {
      try {
        worksheet.mergeCells(`${colLetter}${startRow}:${colLetter}${rowCount}`)
      }
      catch (error) {
        console.warn(`合并单元格失败 ${colLetter}${startRow}:${colLetter}${rowCount}:`, error)
      }
    }
  }
}

/**
 * Excel 自动最佳宽度插件
 * 根据内容自动调整列宽
 * @param worksheet Excel 工作表对象
 * @param options 插件选项
 * @param options.martMaxNumber 最大阈值 默认值为1000
 */
export function excelAutoBestWidthPlugin(worksheet: ExcelJS.Worksheet, options: { martMaxNumber: number } | undefined): void {
  const MAX_THRESHOLD = options?.martMaxNumber ?? 100 // 注意：这个值暂时设置为100，后续可以考虑根据实际情况调整通过传递参数来设置
  worksheet.columns?.forEach((col) => {
    let maxLength = 10

    col?.eachCell?.((cell) => {
      if (isObject(cell.value) || isArray(cell.value))
        return
      const cellValueLength = cell.value?.toString().length ?? 0
      maxLength = cellValueLength > maxLength ? cellValueLength : maxLength
    })
    col.width = Math.min(maxLength + 2, MAX_THRESHOLD)
  })
}

/**
 * 对于超过一定数值的数据高亮显示插件
 *
 * @param worksheet Excel 工作表对象
 * @param options 插件选项
 * @param options.martMaxNumber 视为标记数值的阈值 默认值为100
 * @param options.markFontOptions 字体选项 默认值为红色
 */
export function excelMartNumberPlugin(worksheet: ExcelJS.Worksheet, options: { martMaxNumber: number, markFontOptions: Partial<ExcelJS.Font> } | undefined): void {
  const DEFAULT_MART_MAX_NUMBER = 100
  const DEFAULT_MARK_FONT_OPTIONS: Partial<ExcelJS.Font> = { color: { argb: 'FFFF0000' } }
  worksheet.columns?.forEach((col) => {
    col?.eachCell?.({ includeEmpty: true }, (cell) => {
      if (!isCouldBeCalcNumType(cell.value))
        return
      if (Number(cell.value!) > (options?.martMaxNumber ?? DEFAULT_MART_MAX_NUMBER)) {
        cell.font = { ...cell.font, ...DEFAULT_MARK_FONT_OPTIONS }
      }
    })
  })
}
