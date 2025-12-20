import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { excelAutoBestWidthPlugin, excelAutoMergeCellPlugin, excelMartNumberPlugin } from './plugins'

export type FileMediaType = 'image' | 'video' | 'audio' | 'other'
export function fileIsWhatMediaType(file: File): FileMediaType {
  const mediaType = file.type
  if (mediaType.startsWith('image/')) {
    return 'image'
  }
  else if (mediaType.startsWith('video/')) {
    return 'video'
  }
  else if (mediaType.startsWith('audio/')) {
    return 'audio'
  }
  else {
    return 'other'
  }
}

/**
 * 通用文件下载工具函数
 * @param file 下载地址（网络文件URL | Blob/File对象 | 文本内容）
 * @param fileName 下载后的文件名（含扩展名，如 'data.json'）
 * @param options.type 文件MIME类型（仅url为文本/Blob时生效，如 'application/json'）
 * @param options.method 请求方法（仅网络文件生效，默认 'GET'）
 * @param options.headers 请求头（仅网络文件生效，如 { Authorization: 'token' }）
 * @param options.onProgress 下载进度回调（仅网络文件生效，参数为进度0-100）
 * @returns Promise<void> 下载结果
 */
export async function downloadFileByUri(
  file: string | Blob | File,
  fileName: string = 'download',
  options: {
    type?: string
    method?: string
    headers?: Record<string, string>
    onProgress?: (progress: number) => void
  } = {
    method: 'GET',
    headers: {},
    onProgress: () => { },
  },
): Promise<void> {
  let blob: Blob

  // 1. 处理 Blob/File 输入
  if (file instanceof File || file instanceof Blob) {
    blob = options.type ? file.slice(0, file.size, options.type) : file
  }
  // 2. 网络地址或 Base64/文本内容
  else if (typeof file === 'string') {
    const trimmedFile = file.trim()

    // 2.1 判断是否可能是网络链接（http(s) 或 // 或类似 data: 或 blob:）
    const isUrl = /^https?:\/\/|^\/\//i.test(trimmedFile)
    const isDataUri = /^data:/i.test(trimmedFile)
    const isBlobUri = /^blob:/i.test(trimmedFile)

    if (isDataUri) {
      // 处理 Data URI (data:image/png;base64,...)
      try {
        const response = await fetch(trimmedFile)
        blob = await response.blob()
      }
      catch (error) {
        throw new Error(`解析 Data URI 失败: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    else if (isBlobUri) {
      // 处理 Blob URI
      try {
        const response = await fetch(trimmedFile)
        blob = await response.blob()
      }
      catch (error) {
        throw new Error(`读取 Blob URI 失败: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    else if (isUrl) {
      // fetch 下载网络文件
      const controller = options.onProgress ? new AbortController() : undefined

      try {
        const response = await fetch(trimmedFile, {
          method: options.method || 'GET',
          headers: options.headers || {},
          signal: controller?.signal,
        })

        if (!response.ok) {
          throw new Error(`下载文件失败: ${response.status} ${response.statusText}`)
        }

        if (response.body && options.onProgress) {
          // 响应带 body、可读取流，显示进度
          const contentLength = Number(response.headers.get('Content-Length') || '0')
          const reader = response.body.getReader()
          let loaded = 0
          const chunks: BlobPart[] = []

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done)
                break

              if (value) {
                chunks.push(value)
                loaded += value.length

                if (contentLength > 0) {
                  const progress = Math.min(100, Math.round((loaded / contentLength) * 100))
                  options.onProgress(progress)
                }
                else {
                  // content-length未知，显示不确定进度
                  options.onProgress(-1)
                }
              }
            }

            const contentType = options.type || response.headers.get('Content-Type') || undefined
            blob = new Blob(chunks, { type: contentType })
          }
          catch (readError) {
            controller?.abort()
            throw new Error(`读取响应流失败: ${readError instanceof Error ? readError.message : String(readError)}`)
          }
        }
        else {
          // 普通 fetch，无进度回调
          blob = await response.blob()
          if (options.onProgress) {
            options.onProgress(100)
          }
        }
      }
      catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('下载已取消')
        }
        throw error
      }
    }
    else {
      // 不是 url，而是数据文本，比如要下载成 .txt/.json 等
      blob = new Blob([trimmedFile], { type: options.type || 'text/plain;charset=utf-8' })
    }
  }
  else {
    // 其它类型，转换为 Blob
    blob = new Blob([file as BlobPart], { type: options.type || 'application/octet-stream' })
  }

  // 下载
  if (typeof document === 'undefined') {
    throw new TypeError('此函数需要在浏览器环境中使用')
  }

  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'download'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    // 延迟清理，确保下载开始
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a)
      }
      URL.revokeObjectURL(url)
    }, 100)
  }
  catch (error) {
    URL.revokeObjectURL(url)
    throw new Error(`下载文件失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

interface SheetOptions {
  data: Record<string, any>[]
  tableHeader: { header: string, key: string }[]
  sheetName: string
  plugins?: ExportExcelPlugin[]
}

type ExportExcelPlugin = ExcelAutoMergeCellPlugin | ExcelAutoBestWidthPlugin | ExcelMartNumberPlugin

interface ExportOptions {
  fileName: string
}

interface ExcelAutoMergeCellPlugin {
  name: 'autoMergeCell'
}

interface ExcelAutoBestWidthPlugin {
  name: 'autoBestWidth'
  options?: {
    maxThreshold?: number
  }
}

interface ExcelMartNumberPlugin {
  name: 'excelMartNumber'
  options: {
    martMaxNumber: number
    markFontOptions: Partial<ExcelJS.Font>
  }
}

// 导出Excel插件 合并单元格
// export type ExportExcelPlugin = {
//   name: 'autoMergeCell' | 'autoBestWidth' | 'excelMartNumber'
//   options?: {
//     maxThreshold?: number
//   }
// }
/**
 * 导出Excel
 * @param sheetOptions 表单选项
 * @param exportOptions 导出选项
 * @param cellFormatFunction 单元格格式化函数
 * @returns Promise<void>
 */
export async function exportExcel(
  sheetOptions: SheetOptions[] | SheetOptions,
  exportOptions: ExportOptions | string,
  cellFormatFunction: (cell: ExcelJS.Cell) => void,
): Promise<void> {
  try {
    if (typeof window === 'undefined') {
      console.warn('warn: this function can only be used in the browser environment')
      return
    }

    const workbook = new ExcelJS.Workbook()
    const sheets = Array.isArray(sheetOptions) ? sheetOptions : [sheetOptions]
    sheets.forEach(({ data, tableHeader, sheetName, plugins }) => {
      const worksheet = workbook.addWorksheet(sheetName)
      worksheet.addRow(tableHeader.map(h => h.header))
      data.forEach((item) => {
        worksheet.addRow(tableHeader.map(h => item[h.key]))
      })
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cellFormatFunction(cell)
        })
      })
      plugins?.forEach((plugin) => {
        if (plugin.name === 'autoMergeCell') {
          excelAutoMergeCellPlugin(worksheet)
        }
        else if (plugin.name === 'autoBestWidth') {
          excelAutoBestWidthPlugin(worksheet, plugin.options as { martMaxNumber: number } | undefined)
        }
        else if (plugin.name === 'excelMartNumber') {
          excelMartNumberPlugin(worksheet, plugin.options as { martMaxNumber: number, markFontOptions: Partial<ExcelJS.Font> } | undefined)
        }
      })
    })
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    )
    saveAs(blob, typeof exportOptions === 'string' ? exportOptions : exportOptions.fileName)
  }
  catch (error) {
    console.error('export excel failed reason:', error)
  }
}
