import { pathResolve } from '../../util'
import fs from 'fs'
import * as _ from '..'

const path = pathResolve(__dirname)

const load = async () => {
  const data = await _.read(path('./input'), {
    tree: true
    // ignore: ['copy*']
  })

  fs.writeFile(
    path('./output/tree_data.json'),
    JSON.stringify(data, null, 2),
    () => {
      console.log('Tree Data gen success')
    }
  )

  const data2 = await _.read(path('./input'), {
    dataMerge: true
  })

  fs.writeFile(path('./output/tree_data_merge.txt'), data2.toString(), () => {
    console.log('dataMerge')
  })
}
load()
