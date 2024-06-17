import { mergeJSON } from '..'
import { resolve } from 'path'

mergeJSON(
  [resolve(__dirname, './input/a.json'), resolve(__dirname, './input/b.json')],
  resolve(__dirname, './output/merge.json')
)
