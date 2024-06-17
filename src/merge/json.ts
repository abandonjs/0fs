import type { Mode, ObjectEncodingOptions } from 'fs'
import { read } from '../read'
import { writeFile } from '../write'
import { isArray, isObject, isString } from 'asura-eye'
import { type ObjectType, stringify } from 'abandonjs'
import { type Abortable } from 'events'

export interface MergeJSONOptions extends ObjectType, ObjectEncodingOptions, Abortable {
  /**
   * @description 合并成一个新的树状的数据结构
   */
  tree?: boolean
  /**
   * @description 添加 `export default`
   */
  toDefaultExport?: boolean
  mode?: Mode | undefined
  flag?: string | undefined
}

/**
 * @title mergeJSON
 * @description 合并多个json文件
 * @param {string|string[]} entry
 * @param {string} output
 * @param {MergeJSONOptions} [option]
 */
export function mergeJSON(entry: string | string[], output: string, option: MergeJSONOptions = {}) {
  const { tree = false, toDefaultExport = false, ...rest } = option

  const handleItemData = (value: any) => {
    console.log(value)
    if (isArray(value)) {
      value.forEach((item, index) => {
        value[index] = handleItemData(item)
      })
    }
    if (isObject(value) && isString(value.data)) {
      try {
        value.data = JSON.parse(value.data)
      } catch (error) {
        console.error('parse error: ', value.name)
      }
    }
    return value
  }
  let data: any = []
  if (isArray(entry)) {
    entry.forEach(item => {
      const itemData = read(item, { tree: true })
      data.push(handleItemData(itemData))
    })
  } else {
    const itemData = read(entry, { tree: true })
    if (isArray(itemData)) {
      data = handleItemData(itemData)
    } else {
      data.push(handleItemData(itemData))
    }
  }

  const getData = () => {
    if (tree && isArray(data)) {
      const result: ObjectType = {}
      data.forEach(item => {
        const { name, data } = item

        result[(name as string).replace(/\.json$/, '')] = data
      })
      return result
    }
    return data
  }

  const getDataString = () => {
    const dataString = stringify(getData(), null, 2)
    if (toDefaultExport) {
      return `export default ${dataString}`
    }
    return dataString
  }
  writeFile(output, getDataString(), rest)
}