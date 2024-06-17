import { copy } from '..'
import path from 'path'

copy(path.resolve(__dirname, './db/a.txt'), path.resolve(__dirname, './db/a_copy.txt'))