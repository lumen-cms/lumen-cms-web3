let config = require('lumen-cms-core/config/nextjs_dev_config')


/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: 'de',
    locales: ['en', 'de'],
    localeDetection: false
  }
}
module.exports = config(nextConfig, [], [])
