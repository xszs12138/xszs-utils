import { describe, expect, it } from 'vitest'
import { fileIsWhatMediaType } from './file'

describe('fileIsWhatMediaType', () => {
  it('判断文件类型', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' })
    expect(fileIsWhatMediaType(file)).toEqual('other')
  })
})
