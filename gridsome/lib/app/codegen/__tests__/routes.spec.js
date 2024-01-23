import App from '../../App.js'
import genRoutes from '../routes.js'
import { NOT_FOUND_NAME } from '../../../utils/constants.js'
import { getDirname } from 'cross-dirname'

test('generate a simple route', async () => {
  const app = await new App(getDirname()).init()

  app.pages.createPage({
    path: '/page',
    component: './__fixtures__/PageA.vue'
  })

  expect(genRoutes(app)).toMatchSnapshot()
})

test('generate a route with meta', async () => {
  const app = await new App(getDirname()).init()

  app.pages.createPage({
    path: '/page',
    component: './__fixtures__/PageA.vue',
    route: {
      meta: {
        string: 'test',
        boolean: true,
        number: 2
      }
    }
  })

  expect(genRoutes(app)).toMatchSnapshot()
})

test('generate a route with raw code as meta', async () => {
  const app = await new App(getDirname()).init()

  app.pages.createPage({
    path: '/page',
    component: './__fixtures__/PageA.vue',
    route: {
      meta: {
        $log: `() => console.log('hello!')`
      }
    }
  })

  expect(genRoutes(app)).toMatchSnapshot()
})

test('generate component imports as variables', async () => {
  const app = await new App(getDirname()).init()

  app.pages.createPage({
    path: '/404',
    name: NOT_FOUND_NAME,
    component: './__fixtures__/PageC.vue'
  })

  for (let i = 1; i < 4; i++) {
    app.pages.createPage({
      path: '/page-a/' + i,
      component: './__fixtures__/PageA.vue'
    })
  }

  app.pages.createPage({
    path: '/page-b',
    component: './__fixtures__/PageB.vue'
  })

  app.pages.createPage({
    path: '/user/:id',
    component: './__fixtures__/PageC.vue'
  })

  expect(genRoutes(app)).toMatchSnapshot()
})

test('generate redirect routes', async () => {
  const app = await new App(getDirname(), {
    config: {
      redirects: [
        { from: '/old', to: '/page' }
      ]
    }
  }).init()

  app.pages.createPage({
    path: '/page',
    component: './__fixtures__/PageA.vue'
  })

  expect(genRoutes(app)).toMatchSnapshot()
})
