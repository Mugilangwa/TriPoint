
const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/TriPoint/'
        : '/',

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },

    chainWebpack: config => {
        // Remove prefetch plugin
        config.plugins.delete('prefetch');
    },

    configureWebpack: {
        resolve: {
            alias: {
                '@themeConfig': path.resolve(__dirname, 'theme.config.js'),
            }
        }
    }
};
