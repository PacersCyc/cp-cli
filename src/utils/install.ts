import spawn from 'cross-spawn'

interface installProps {
  cwd:string
  package:string
}

export const install = async (options: installProps) => {
  const cwd = options.cwd
  return new Promise((resolve, reject) => {
    const args = ['install', '--save', '--save-exact', '--loglevel', 'error']
    const child = spawn(options.package, args, {
      cwd,
      stdio: ['pipe', process.stdout, process.stderr]
    })

    child.once('close', (code: number) => {
      if (code !== 0) {
        reject({
          command: `${options.package} ${args.join(' ')}`
        })
        return
      }
      resolve()
    })

    child.once('error', reject)
  })
}