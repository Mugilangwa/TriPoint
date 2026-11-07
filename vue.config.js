const path = require('path');

module.exports = {
    publicPath: '/',

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },

    chainWebpack: config => {
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