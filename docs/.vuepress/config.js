const { resolve } = require('path')

module.exports = {
    base: '/yublog/',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'renderer',
            description: 'Detailed renderer'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: '渲染器',
            description: '也许是讲渲染器相关内容中最细最全的了吧'
        }
    },
    themeConfig: {
        displayAllHeaders: true,
        sidebarDepth: 2,
        locales: {
            '/': {
                label: 'English',
                sidebar: [
                    '/'
                ]
            },
            '/zh/': {
                label: '简体中文',
                editLinkText: '在 GitHub 上编辑此页',
                sidebar: [
                    ['/zh/webpack', 'webpack'],
                    ['/zh/浏览器原理', '浏览器原理'],
                    ['/zh/抓包工具', '抓包工具'],
                    ['/zh/面试', '面试'],
                    ['/zh/React', 'React'],
                    ['/zh/Redux', 'Redux'],
                    ['/zh/react-router', 'react-router'],


                ],
                nav: [
                    // { text: '捐赠者名单', link: '/zh/donor-list' },
                ]
            }
        },
        repo: 'sxyuzhenhua/yublog',
        docsDir: 'docs',
        editLinks: true,
        sidebar: 'auto'
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@as': resolve(__dirname, './assets'),
                '@imgs': resolve(__dirname, './assets/imgs')
            }
        }
    }
}