import commander from 'commander'

const program = new commander.Command()

program
  .command('init <projectName>')
  .description('create and init a project by cp-cli')
  .action((source) => {
    console.log(source)
    require('./init')(...process.argv.slice(3))
  })

program.version(require('../package.json').version, '-v --version')

program.parse(process.argv)