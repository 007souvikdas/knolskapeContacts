const HTMLwebpackPlugin = require('html-webpack-plugin');

const HTMLwebpackPluginConfig1 = new HTMLwebpackPlugin(
    {
        template: `${__dirname}/public/pages/login.html`,
        filename: 'login.html',
        chunks: ['login'],
        inject: 'body',
    });
const HTMLwebpackPluginConfig2 = new HTMLwebpackPlugin(
    {
        template: `${__dirname}/public/pages/redirect.html`,
        filename: 'redirect.html',
        chunks: ['redirect'],
        inject: 'body',
    });
const HTMLwebpackPluginConfig3 = new HTMLwebpackPlugin(
    {
        template: `${__dirname}/public/pages/contacts.html`,
        filename: 'contacts.html',
        chunks: ['contacts'],
        inject: 'body',
    },
);
const HTMLwebpackPluginConfig4 = new HTMLwebpackPlugin(
    {
        template: `${__dirname}/public/pages/error.html`,
        filename: 'error.html',
    },
);

module.exports = {
    entry: {
        'login': `${__dirname}/public/js/login.js`,
        'redirect': `${__dirname}/public/js/redirect.js`,
        'contacts': `${__dirname}/public/js/contacts.js`,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/build/`,
    },
    plugins: [HTMLwebpackPluginConfig1, HTMLwebpackPluginConfig2, HTMLwebpackPluginConfig3, HTMLwebpackPluginConfig4],
};
