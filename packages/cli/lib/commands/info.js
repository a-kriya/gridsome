import envinfo from 'envinfo'

export default async () => {
  const data = await envinfo
    .run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmPackages: '?(@)gridsome{-*,/*,}',
      npmGlobalPackages: ['@kriya/gridsome-cli']
    })
  console.log(data)
}
