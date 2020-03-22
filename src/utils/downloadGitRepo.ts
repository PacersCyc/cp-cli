import downloadGit from 'download-git-repo'

export const download = async (projectName: string, language: string) => {
  let api = 'microsoft/'
  language === 'JavaScript' 
    ? api = api + 'vscode-react-simple'
    : api = api + 'TypeScript-React-Starter'
  
  return new Promise((resolve, reject) => {
    downloadGit(api, projectName, (err: unknown) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}