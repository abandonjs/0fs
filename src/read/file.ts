import fs from 'fs'
import type { ReadFileOptions } from './type'

/**
 * @title readFile
 * @description 读取文件信息(uft8)
 * @param {string} path 路径
 * @param {ReadFileOptions={ encoding: 'utf8', flag: 'r' }} options 路径
 * @returns {string}
 */
export function readFile<T = string>(
  path: string,
  options: ReadFileOptions = { encoding: 'utf8', flag: 'r' }
): T | string {
  return fs.readFileSync(path, options)
}
