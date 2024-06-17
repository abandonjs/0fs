import { readFile } from './file'
import { isDirectory } from '../util'
import { readTree } from './tree'
import type { ReadTreeOptions, TreeDataUnit } from './type'
import { isEffectArray, isString } from 'asura-eye'

export interface ReadOptions extends ReadTreeOptions {
  /**
   * @description 树状数据
   * @default {true}
   */
  tree?: boolean
  /**
   * @description 数据合并成一个字符串, 没有路径等其他信息
   * @type {boolean|string}
   * @default {false}
   * @version 0.0.7
   */
  dataMerge?: boolean | string
}

/**
 * @title read
 * @description 读取文件(夹)
 * @param {string} path
 * @param {ReadOptions} [options]
 * @returns {string|string[]}
 */
export function read(
  path: string,
  options: ReadOptions = {}
): string | TreeDataUnit {
  const {
    tree = true,
    encoding = 'utf8',
    flag = 'r',
    dataMerge = false
  } = options

  if (isDirectory(path)) {
    const data = readTree(path, options)
    if (dataMerge) {
      const gap = isString(options.dataMerge) ? options.dataMerge : '\n'
      const list: string[] = []
      const loop = (target: any) => {
        const { children, data } = target
        list.push(data)
        if (!isEffectArray(children)) return
        children.forEach(loop)
      }
      loop(data)
      return list.join(gap)
    }
    if (tree) return data
    return data
  }

  return readFile(path, { encoding, flag })
}
