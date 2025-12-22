import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/xszs-utils/',
  title: 'xszs/utils 工具库',
  description: '一个实用的 TypeScript 工具函数库',
  themeConfig: {
    nav: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/page/guide/introduction' },
          { text: '开始使用', link: '/page/guide/quick-start' },
        ],
      },
      {
        text: '工具函数',
        items: [
          { text: 'File', link: '/page/tool/file' },
          { text: 'Data', link: '/page/tool/data' },
          { text: 'Time', link: '/page/tool/time' },
          { text: 'Math', link: '/page/tool/math' },
        ],
      },
    ],
    // 改为对象形式，根据路径匹配显示不同的侧边栏
    sidebar: {
      // 指南相关的页面显示指南侧边栏
      '/page/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/page/guide/introduction' },
            { text: '快速开始', link: '/page/guide/quick-start' },
          ],
        },
      ],
      // 工具函数相关的页面显示工具函数侧边栏
      '/page/tool/': [
        {
          text: '工具函数',
          items: [
            { text: 'File', link: '/page/tool/file' },
            { text: 'Data', link: '/page/tool/data' },
            { text: 'Time', link: '/page/tool/time' },
            { text: 'Math', link: '/page/tool/math' },
          ],
        },
      ],
      // 如果需要 API 相关的侧边栏
      '/page/api/': [
        {
          text: 'API',
          items: [
            { text: 'File', link: '/page/api/file' },
            { text: 'Data', link: '/page/api/data' },
            { text: 'String', link: '/page/api/string' },
            { text: 'Number', link: '/page/api/number' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xszs12138/xszs-utils' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@xszs/utils' },
    ],
    search: {
      provider: 'local',
    },
  },
})
