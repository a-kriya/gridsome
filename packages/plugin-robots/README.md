# gridsome-plugin-robots

> Create `robots.txt` for your Gridsome site.

*This gridsome plugin is ported from a gatsby plugin by Marat Dreizin https://github.com/mdreizin/gatsby-plugin-robots-txt*

## Install

`yarn add gridsome-plugin-robots`

or

`npm install --save gridsome-plugin-robots`

## How To Use

`gridsome.config.js`

```js
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.example.com',
  plugins: ['gridsome-plugin-robots']
};
```

## Options

This plugin uses [`generate-robotstxt`](https://github.com/itgalaxy/generate-robotstxt#usage) to generate content of `robots.txt` and it has the following options:

|     Name     |    Type    |                Default                |                                  Description                                   |
| :----------: | :--------: | :-----------------------------------: | :----------------------------------------------------------------------------: |
|    `host`    |  `String`  |       `${siteMetadata.siteUrl}`       |                               Host of your site                                |
|  `sitemap`   |  `String` / `String[]`  | `${siteMetadata.siteUrl}/sitemap.xml` |                             Path(s) to `sitemap.xml`                              |
|   `policy`   | `Policy[]` |                 `[]`                  | List of [`Policy`](https://github.com/itgalaxy/generate-robotstxt#usage) rules |
| `configFile` |  `String`  |              `undefined`              |                          Path to external config file                          |
|   `output`   |  `String`  |             `/robots.txt`             |                     Path where to create the `robots.txt`                      |

`gridsome.config.js`

```js
module.exports = {
  plugins: [
    {
      use: 'gridsome-plugin-robots',
      options: {
        host: 'https://www.example.com',
        sitemap: 'https://www.example.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    }
  ]
};
```

### `env`-option


`gridsome.config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: 'gridsome-plugin-robots',
      options: {
        host: 'https://www.example.com',
        sitemap: 'https://www.example.com/sitemap.xml',
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }]
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          }
        }
      }
    }
  ]
};
```

The `env` key will be taken from `process.env.SITE_ENV` first (see [Site hosting environment](It is custom environment), falling back to `process.env.NODE_ENV`. When this is not available then it defaults to `development`.

You can resolve the `env` key by using `resolveEnv` function:

`gridsome.config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: 'gridsome-plugin-robots',
      options: {
        host: 'https://www.example.com',
        sitemap: 'https://www.example.com/sitemap.xml',
        resolveEnv: () => process.env.WEBSITE_ENV_TYPE,
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }]
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          }
        }
      }
    }
  ]
};
```

#### Netlify

If you would like to disable crawlers for [deploy-previews](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/) you can use the following snippet:

`gridsome.config.js`

```js
const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://www.example.com',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

module.exports = {
  siteUrl,
  plugins: [
    {
      resolve: 'gridsome-plugin-robots',
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{ userAgent: '*' }]
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null
          }
        }
      }
    }
  ]
};
```
