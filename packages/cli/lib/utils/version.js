import chalk from 'chalk'
// import resolveCwd from 'resolve-cwd'
import importSync from 'import-sync'

const packageJson = importSync('../../package.json')

export default function resolveVersions(pkgPath) {
  const cliVersion = packageJson.version
  const versions = [`@kriya/gridsome-cli v${cliVersion}`]

  if (pkgPath) {
    try {
      versions.push(...resolveProjectVersions(pkgPath))
    } catch (err) {
      versions.push('\nFailed to read installed gridsome version:')
      versions.push(chalk.red(err.message))
    }
  }

  return versions.join('\n')
}

function resolveProjectVersions(pkgPath) {
  const versions = []
  const projectPkgJson = importSync(pkgPath)
  const { devDependencies = {}, dependencies = {} } = projectPkgJson
  const packages = { ...devDependencies, ...dependencies }

  if (packages['@kriya/gridsome']) {
    const version = packages['@kriya/gridsome']
    versions.push(`@kriya/gridsome v${version}`)
    // const version = resolvePackageVersion('@kriya/gridsome')
    // if (version) versions.push(`@kriya/gridsome v${version}`)
  }

  // for (const name in packages) {
  //   if (/^@?gridsome[-|\/]/.test(name)) {
  //     const version = resolvePackageVersion(name)
  //     if (version) versions.push(`- ${name} v${version}`)
  //   }
  // }

  // if (versions.length) {
  //   versions.unshift(chalk.grey('\nProject dependencies:'))
  // }

  return versions
}

// function resolvePackageVersion(name) {
//   const pkgPath = resolveCwd.silent(`${name}/package.json`)
//   const pkgJson = pkgPath ? importSync(pkgPath) : null
//   return pkgJson ? pkgJson.version : null
// }
