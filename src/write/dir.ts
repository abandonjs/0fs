import fs, { type MakeDirectoryOptions } from 'fs'

/**
 * @title writeDir
 * @description 创建文件目录
 * @param {string} path 文件目录
 * @param {MakeDirectoryOptions={recursive:true}} [options] 
 * @returns {boolean}
 */
export function mkdir(path: string, options: MakeDirectoryOptions = {}) {

	try {
		fs.mkdirSync(path, { recursive: true, ...options })
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}