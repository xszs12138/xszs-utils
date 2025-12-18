/**
 * @param flatData 平铺数据源
 * @param options 配置项
 * @param options.idKey ID字段名（默认id）
 * @param options.parentIdKey 父ID字段名（默认parentId）
 * @param options.childrenKey 子节点字段名（默认children）
 * @param options.rootParentId 根节点的父ID值（默认null）
 * @returns 树形结构数组
 */
export function flatToTreeRecursive<T extends Record<string, any>>(
  flatData: T[],
  options: {
    idKey?: keyof T
    parentIdKey?: keyof T
    childrenKey?: string
    rootParentId?: T[keyof T] | null | undefined
  } = {},
): Array<T & { [key: string]: any }> {
  const {
    idKey = 'id' as keyof T,
    parentIdKey = 'parentId' as keyof T,
    childrenKey = 'children',
    rootParentId = null as T[keyof T] | undefined,
  } = options

  if (!Array.isArray(flatData) || flatData.length === 0) {
    return []
  }

  const buildChildren = (parentId: T[keyof T] | null | undefined): Array<T & { [key: string]: any }> => {
    const children = flatData.filter(node => node[parentIdKey] === parentId).map((node) => {
      const clonedNode = { ...node } as any
      const children = buildChildren(clonedNode[idKey])
      if (children.length > 0) {
        clonedNode[childrenKey] = children
      }
      return clonedNode as T & { [key: string]: any }
    })
    return children
  }

  return buildChildren(rootParentId)
}

/**
 * @description 递归查找树结构中指定节点
 * @param tree 树结构
 * @param id 节点ID
 * @returns 节点
 */
export function findNodeInTree<T extends Record<string, any>>(tree: T[], findId: string | number, idKey: string | number = 'id', childrenKey: string = 'children'): T | null {
  for (const node of tree) {
    if (node[idKey] === findId)
      return node
    const children = node[childrenKey]
    if (children) {
      const result = findNodeInTree(children, findId, idKey, childrenKey)
      if (result)
        return result as T
    }
  }
  return null
}

/**
 * @param data 数据
 * @returns 清除空字段后的数据
 * @description 清除对象中的空字段，
 */
export function clearEmptyFields<T extends Record<string, any>>(data: T) {
  const newData = { ...data } as T // 浅拷贝数据
  const keys = Object.keys(newData)
  for (const key of keys) {
    if (newData[key] === null || newData[key] === undefined) {
      delete newData[key]
    }
  }
  return newData
}

// ### modifyKeyNameForRecordList

// 将一个对象数组中的每一项的键名通过指定的关系转换成其他的键名。

// **说明**: 该方法用于将一个对象数组中的每一项的键名通过指定的关系转换成其他的键名。例如，当传入的记录列表为 [{ a: 1, b: 2 }]，键名映射表为 { a: 'A', b: 'B' } 时，返回的记录列表为 [{ A: 1, B: 2 }]。

// **参数**:

// - `data` (Array<Record<string, any>>): 要修改的记录列表。
// - `sheet` (Record<string, string>): 键名映射表。

/**
 * @description 将一个对象数组中的每一项的键名通过指定的关系转换成其他的键名。
 * @param data 数据
 * @param sheet 键名映射表
 * @returns 修改键名后的数据
 */
export function modifyKeyNameForRecordList<T extends Record<string, any>>(data: T[], sheet: Record<string, string>): T[] {
  return data.map((item) => {
    const newObj = {} as T
    Object.entries(sheet).forEach((sheet) => {
      const [key, value] = sheet
      if (item[key as keyof T]) {
        newObj[value as keyof T] = item[key as keyof T]
      }
    })
    return newObj
  })
}

/**
 * @description 获取多个Promise结果的数组，如果失败，则返回{ error: reason, value: null }
 * @param promises  Promise<T>[]
 * @returns 已解决的数组
 */
export async function getSettledDataArray<T>(promises: Promise<T>[]) {
  const results = await Promise.allSettled(promises)
  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    else {
      return {
        error: result.reason,
        value: null,
      }
    }
  })
}

/**
 * @description 将一个对象数组中的每一项按照指定的键值进行分组
 * @param data 数据
 * @param key 键值
 * @returns 分组后的数据
 */
export function groupBy<T extends Record<string, any>>(data: T[], key: keyof T): Record<string, T[]> {
  const map = new Map<string, T[]>()
  data.forEach((item) => {
    if (!map.has(String(item[key]))) {
      map.set(String(item[key]), [])
    }
    map.get(String(item[key]))?.push(item)
  })
  return Object.fromEntries(map)
}

export function isArray(data: any): data is Array<any> {
  return Array.isArray(data)
}

export function isObject(data: any): data is Record<string, any> {
  return Object.prototype.toString.call(data) === '[object Object]'
}

export function isString(data: any): data is string {
  return typeof data === 'string'
}

export function isNumber(data: any): data is number {
  return typeof data === 'number'
}

export function isBoolean(data: any): data is boolean {
  return typeof data === 'boolean'
}

export function isNull(data: any): data is null {
  return Object.prototype.toString.call(data) === '[object Null]'
}

export function isCouldBeClacType(data: any): boolean {
  return isNumber(data) || isString(data)
}

export function isUndefined(data: any): data is undefined {
  return Object.prototype.toString.call(data) === '[object Undefined]'
}

type DataType = 'array' | 'object' | 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'unknown'
export function isWhatType(data: any): DataType {
  if (isArray(data))
    return 'array'
  if (isObject(data))
    return 'object'
  if (isString(data))
    return 'string'
  if (isNumber(data))
    return 'number'
  if (isBoolean(data))
    return 'boolean'
  if (isNull(data))
    return 'null'
  if (isUndefined(data))
    return 'undefined'
  return 'unknown'
}

/**
 * @description 深度优先排序树结构
 * @param tree 树结构
 * @param sortKey 排序键值
 * @param direction 排序方向 默认值是升序
 * @returns 排序后的树结构
 */
export type TreeSortDirection = 'ascending' | 'descending'
export function dfsTreeSort<T extends Record<string, any>>(tree: T[], options?: { sortKey?: keyof T, childrenKey?: keyof T, direction?: TreeSortDirection }): T[] {
  const { sortKey = 'id', childrenKey = 'children', direction = 'ascending' } = options || { sortKey: 'id', childrenKey: 'children', direction: 'ascending' }
  return [...tree]
    .sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      if (aValue == null && bValue == null)
        return 0
      if (aValue == null)
        return direction === 'ascending' ? 1 : -1
      if (bValue == null)
        return direction === 'ascending' ? -1 : 1

      if (aValue < bValue)
        return direction === 'ascending' ? -1 : 1
      if (aValue > bValue)
        return direction === 'ascending' ? 1 : -1
      return 0
    })
    .map((node) => {
      if (isArray(node[childrenKey]) && node[childrenKey].length > 0) {
        return {
          ...node,
          children: dfsTreeSort(node[childrenKey], { sortKey, childrenKey, direction }),
        }
      }
      return { ...node }
    })
}
