import importSync from 'import-sync'

export const isGridsomeProject = (pkgPath) => {
  const projectPkgJson = pkgPath ? importSync(pkgPath) : {}
  const { devDependencies = {}, dependencies = {} } = projectPkgJson
  const packages = { ...devDependencies, ...dependencies }

  return Object.hasOwn(packages, '@kriya/gridsome')
}
