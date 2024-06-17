import { isString } from "asura-eye"

export type MatchLike = string | string[]
/**
 * @title match
 * @description 匹配是否符合rules规则
 * @param {string} str
 * @param {string|string[]} rules
 * @returns {boolean}
 */
export function match(str: string, rules: MatchLike): boolean {
	if (!Array.isArray(rules)) {
		rules = [rules]
	}
	for (let i = 0; i < rules.length; i++) {
		if (isString(rules[i]))
			if (new RegExp(`^${rules[i].replaceAll('*', '.*')}$`).test(str)) {
				return true
			}
	}
	return false
}