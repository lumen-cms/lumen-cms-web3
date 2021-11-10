const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
// const {resolve} = require('path')
// const {
//   compilerOptions
// } = require('../tsconfig.json')
//
// const alias = Object.entries(compilerOptions.paths)
//   .reduce((acc, [key, [value]]) => {
//     const aliasKey = key
//     const path = value
//     return {
//       ...acc,
//       [aliasKey]: resolve(path)
//     }
//   }, {})

// console.log(alias)

module.exports = {
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  'addons': [
    // '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  core: {
    // builder: 'storybook-builder-vite'
    builder: 'webpack5'
  },
  // async viteFinal (config, {configType}) {
  //   // customize the Vite config here
  //   config.resolve.alias = alias
  //
  //
  //   // return the customized config
  //   return config
  // },
  webpackFinal: async (config, {configType}) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];


    // config.module.rules.push({
    //   test: /\.ts|tsx|js|jsx$/,
    //   use: {
    //     loader: 'babel-loader',
    //     options: {
    //       presets: [
    //         'next/babel'
    //       ],
    //       plugins: [],
    //       include: [
    //         // path.resolve('resources/assets/js/'),
    //         path.resolve('node_modules/lumen-cms-core/')
    //       ],
    //       exclude: /node_modules\/(?!lumen-cms-core).+/
    //     }
    //   }
    // })

    // Return the altered config
    return config
  },
  typescript: {
    check: true,
    //   checkOptions: {},
    reactDocgen: false
    //   reactDocgenTypescriptOptions: {
    //     shouldExtractLiteralValuesFromEnum: true,
    //     propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    //   }
  }
}
