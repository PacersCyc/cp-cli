import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import ora from 'ora'
import { promisify } from 'util'
import { download } from './utils/downloadGitRepo'
import { install } from './utils/install'

const exist = promisify(fs.stat)

const init = async (projectName: string) => {
  const projectExist = await exist(projectName).catch(e => {
    if (e.code !== 'ENOENT') {
      console.log(chalk.redBright.bold(e))
    }
  })

  if (projectExist) {
    console.log(chalk.redBright.bold('The file has exited！'))
    return
  }

  inquirer.prompt([
    {
      name: 'descrption',
      message: 'Please enter the project descrption'
    },
    {
      name: 'author',
      message: 'Please enter the project author'
    },
    {
      type: 'list',
      name: 'language',
      message: 'Please choose the program language',
      choices: ['JavaScript', 'TypeScript']
    },
    {
      type: 'list',
      name: 'package',
      message: 'Please choose the package management',
      choices: ['yarn', 'npm']
    }
  ]).then(async (answer) => {
    console.log(answer)
    let loading = ora('downloading template...')
    loading.start()
    loading.color = 'yellow'
    download(projectName, answer.language).then(
      async () => {
        loading.succeed()
        const packageFile = `${projectName}/package.json`
        if (await exist(packageFile)) {
          const data = fs.readFileSync(packageFile).toString()
          let json = JSON.parse(data)
          json.name = projectName
          json.author = answer.author
          json.descrption = answer.descrption
          fs.writeFileSync(packageFile, JSON.stringify(json, null, '\t'), 'utf-8')
          console.log(chalk.green('Project initialization finished!' + '\n'))

          console.log(chalk.yellowBright('start install dependencies...'))
          await install({
            cwd: path.join(process.cwd(), projectName),
            package: answer.package
          }).then(() => {
            console.log()
            console.log('We suggest that you begin by typing:')
            console.log()
            console.log(chalk.cyan('  cd'), projectName)
            console.log(`  ${chalk.cyan(`${answer.package} start`)}`)
          })
        }
      },
      () => {
        loading.fail()
      }
    )
  })
}

module.exports = init