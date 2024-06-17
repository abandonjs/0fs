import { isDirectory } from '../util'
import { readFile } from './file'
import { readDir } from './dir'
import { resolve, basename } from 'path'
import type { ReadTreeOptions, TreeDataUnit } from './type'

function _match_(names: string[] = [], ignore: string[]) {
  return names.filter((name = '') => {
    for (let i = 0; i < ignore.length; i++) {
      const unit: string = ignore[i]

      if (unit === name) {
        return false
      }
      if (unit.indexOf('*') > -1) {
        const [before = '', after = ''] = unit.split('*') || ['', '']
        if (
          (before !== '' && name.indexOf(before) === 0) ||
          (after !== '' && name.indexOf(after) > -1)
        ) {
          return false
        }
      }
    }
    return true
  })
}

/**
 * @title readTree
 * @description 读取文件结构,以及内容
 * @param path {string}
 * @param options {?ReadTreeOptions}
 * @returns {TreeDataUnit}
 */
export function readTree(
  path: string,
  options?: ReadTreeOptions
): TreeDataUnit {
  const {
    depth = 'auto',
    ignore = [],
    readData = true,
    encoding = 'utf8',
    flag = 'r',
    withFileTypes
  } = options || {}

  const isDir = isDirectory(path)

  const result: any = {
    name: basename(path),
    path,
    isDir,
    catalogue: undefined,
    data: undefined,
    children: undefined
  }

  if (isDir) {
    const catalogue =
      _match_(readDir(path, { encoding, withFileTypes }), ignore) || []

    result.catalogue = catalogue
    result.children = catalogue.map((item) => {
      return readTree(resolve(path + '/' + item), options)
    })
  } else if (readData) {
    result.data = readFile(path, { encoding, flag })
  }

  return result
}
