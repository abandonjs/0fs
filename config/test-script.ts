import { exec } from 'child_process'

const args: string[] = process.argv.slice(2) || []
console.log('运行模块:', args)

const run = (path: string) => {
  console.log(path, ' running...')
  console.log('-----------------------')
  const [root, ...rest] = path.split('/')
  const getUrl = () => {
    const target = `src/${root}/__test__/${rest.join('/')}.ts`

    if (rest.length === 0) {
      return `src/${root}/__test__/index.ts`
    }
    return target
  }
  const command = `ts-node ${getUrl()} `

  console.log(command)
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`)
      console.log('-----------------------')
      console.log(path, ' running error...')
      process.exit(1) // 如果检查失败，阻止提交
    } else {
      console.log(stdout)
      console.log('-----------------------')
      console.log(path, ' running success...')
      process.exit(0) // 检查成功，继续提交
    }
  })
}

args.forEach(run)
