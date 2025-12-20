/* eslint-disable test/no-identical-title */
import { describe, expect, it } from 'vitest'
import { clearEmptyFields, dfsTreeSort, findNodeInTree, flatToTreeRecursive, getSettledDataArray, isCouldBeCalcNumType, isWhatType, modifyKeyNameForRecordList } from './data'

const testArr = [
  {
    id: 1,
    parentId: null,
  },
  {
    id: 2,
    parentId: 1,
  },
  {
    id: 3,
    parentId: 2,
  },
]

describe('flatToTreeRecursive', () => {
  it('将平铺数据转换为树形结构', () => {
    expect(flatToTreeRecursive(testArr, { idKey: 'id', parentIdKey: 'parentId' })).toEqual([
      { id: 1, parentId: null, children: [{ id: 2, parentId: 1, children: [{ id: 3, parentId: 2 }] }] },
    ])
  })
  it('将平铺数据转换为树形结构', () => {
    expect(flatToTreeRecursive(testArr, { idKey: 'id', parentIdKey: 'parentId', childrenKey: 'children222' })).toEqual([
      { id: 1, parentId: null, children222: [{ id: 2, parentId: 1, children222: [{ id: 3, parentId: 2 }] }] },
    ])
  })
})

describe('clearEmptyFields', () => {
  it('清除空字段', () => {
    const data = {
      name: '张三',
      age: null,
      sex: undefined,
      city: 0,
    }
    expect(clearEmptyFields(data)).toEqual({ name: '张三', city: 0 })
  })
})

describe('modifyKeyNameForRecordList', () => {
  it('修改键名映射表', () => {
    const data = [{ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }]
    const sheet = { a: 'A', b: 'B' }
    expect(modifyKeyNameForRecordList(data, sheet)).toEqual([{ A: 1, B: 2 }, { A: 1, B: 2 }, { A: 1, B: 2 }])
  })
})

describe('getSettledDataArray', () => {
  it('获取已解决的数组', async () => {
    const promise1 = new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 200)
    })
    const promise2 = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('error'))
      }, 200)
    })
    const promises = [promise1, promise2]
    const [data1] = await getSettledDataArray(promises).catch(err => err)
    expect(data1).toEqual(1)
  })
})

describe('isWhatType', () => {
  it('判断数据类型', () => {
    expect(isWhatType(1)).toEqual('number')
    expect(isWhatType('1')).toEqual('string')
    expect(isWhatType(true)).toEqual('boolean')
    expect(isWhatType(null)).toEqual('null')
    expect(isWhatType(undefined)).toEqual('undefined')
    expect(isWhatType([])).toEqual('array')
    expect(isWhatType({})).toEqual('object')
  })
})

describe('findNodeInTree', () => {
  const tree = [
    {
      id: 1,
      parentId: null,
      children: [{ id: 2, parentId: 1, children: [{ id: 3, parentId: 2 }] }],
    },
  ]
  it('查找节点', () => {
    expect(findNodeInTree(tree, 3)).toEqual({ id: 3, parentId: 2 })
  })
})

describe('dfsTreeSort', () => {
  it('排序树结构', () => {
    const tree = [
      {
        id: 4,
        parentId: null,
      },
      {
        id: 1,
        parentId: null,
        children: [
          { id: 3, parentId: 1 },
          { id: 2, parentId: 2 },
        ],
      },

    ]
    expect(dfsTreeSort(tree, { sortKey: 'id', direction: 'descending' })).toEqual([
      { id: 4, parentId: null },
      { id: 1, parentId: null, children: [
        { id: 3, parentId: 1 },
        { id: 2, parentId: 2 },
      ] },

    ])
  })
})

describe('isCouldBeCalcNumType', () => {
  it('判断是否可以计算为数字', () => {
    expect(isCouldBeCalcNumType(1)).toEqual(true)
    expect(isCouldBeCalcNumType('1')).toEqual(true)
    expect(isCouldBeCalcNumType(true)).toEqual(false)
    expect(isCouldBeCalcNumType(null)).toEqual(false)
    expect(isCouldBeCalcNumType(undefined)).toEqual(false)
  })
})
