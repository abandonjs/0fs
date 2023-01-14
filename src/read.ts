import fs from 'fs'
import { match, MatchLike } from './util'
import { parse } from 'node-xlsx'
import { CSVLikeDefault } from './constant'


function __match(names: string[] = [], ignore: string[]) {
	return names.filter((name = '') => {
		for (let i = 0; i < ignore.length; i++) {
			const unit: string = ignore[i]

			if (unit === name) {
				return false
			}
			if (unit.indexOf('*') > -1) {
				const [before = '', after = ''] = unit.split('*') || ['', '']
				if (
					(before !== '' && name.indexOf(before) === 0)
					|| (after !== '' && name.indexOf(after) > -1)
				) {
					return false
				}
			}
		}
		return true
	})
}

export function isDirectory(path: string): boolean {
	return fs.lstatSync(path).isDirectory()
}


interface DataUnit {
	name: string
	path?: string
	data?: string
	children?: DataUnit[]
}
interface Config {
	use?: string[]
	depth?: 'auto' | number
	ignore?: string[]
}

export function readDirTree(path: string, config: Config) {
	const { depth = 'auto', ignore = [], use = [] } = config || {}

	const data: DataUnit[] = []

	const dirs = __match(fs.readdirSync(path), ignore)

	dirs.forEach(name => {
		const newPath = path + '/' + name
		const unit: DataUnit = {
			name,
			path,
			data: '',
			children: [],
		}
		if (isDirectory(newPath)) {
			unit.children = readDirTree(newPath, config)
		} else {
			if (use.filter(u => name.indexOf(u) > -1).length > -1)
				unit.data = fs.readFileSync(newPath).toString()
		}
		data.push(unit)
	})


	return data
}


/**
 * @title readXlsx
 * @description 读取xlsx文件数据
 * @param path string 准确的xlsx路径
 */
export function readXlsx(path: string) {
	return parse(fs.readFileSync(path))
}

/**
 * @title xlsxFormat
 * @description 将xlsx数据格式化
 * @param xData 待格式化数据
 * @returns { [SheetName]: SheetData }
 */
export function xlsxFormat(xData: any[]): { [key: string]: any[] } {
	const result = {}
	xData.forEach((unit: { name: string, data: any[][] }) => {
		const { name = '', data = [] } = unit
		if (result[name] === undefined) {
			result[name] = data
		}
	})

	return result
}

/**
 * @title readDir
 * @title 读取文件目录
 * @param path 路径
 * @returns string[]
 */
export function readdir(path: string): string[] {
	return fs.readdirSync(path) || []
}

/**
 * @title readFile
 * @description 读取文件信息(uft8)
 * @param path  路径
 * @returns string
 */
export function readFile(path: string): string {
	return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
}

function loopRead(
	path: string,
	ignore: string | string[] = [],
	matchs: { [key: string]: MatchLike } = {},
	data: { [key: string]: any } = {}
) {

	if (matchs.csv === undefined) {
		matchs.csv = CSVLikeDefault
	}

	if (ignore && match(path, ignore)) {
		return ''
	}

	const isDir = isDirectory(path)

	if (isDir) {

		const dirs: string[] = readdir(path) || []
		dirs.forEach(dir => {
			const pathUnit = path + '/' + dir
			if (ignore && match(pathUnit, ignore)) {
				return
			}
			data[dir] = loopRead(pathUnit, ignore, matchs)
		})
	}

	if (!isDir) {
		if (match(path, matchs.csv)) {
			data = readXlsx(path)
		} else {
			return readFile(path)
		}
	}

	return data
}

/**
 * @title read
 * @description 读取文件目录中文件全部数据
 * @param path string 路径
 * @param ignore ?string|string[]
 * @param matchs { [key:string] : MatchLike }
 * @returns 
 */
export function read(
	path: string,
	ignore?: MatchLike,
	matchs?: { [key: string]: MatchLike }
) {
	return loopRead(path, ignore, matchs)
}

