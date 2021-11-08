let config = require('lumen-cms-core/config/nextjs_prod_config')


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'de',
    locales: ['en', 'de'],
    localeDetection: false
  }
}
module.exports = config(nextConfig, [], [])
