import type { EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { type Plugin, onMounted, watch, nextTick, h } from 'vue'
import { useData, useRoute } from 'vitepress'
import 'vitepress-markdown-timeline/dist/theme/index.css'
import './style/index.css'
// 代码块添加折叠
import codeblocksFold from 'vitepress-plugin-codeblocks-fold'
import 'vitepress-plugin-codeblocks-fold/style/index.css'
// 基于git的页面历史
import {
  NolebaseGitChangelogPlugin
} from '@nolebase/vitepress-plugin-git-changelog/client'
import { InjectionKey } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
// 行内链接预览
import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview/client'
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'
// 顶级的阅读增强，页面右上角小书本
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

// 闪烁高亮当前目标标题
import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading/client'
// 快速复制当前页的url
import { ShareButton } from '@theojs/lumen'
// 组件
import Ncard from './components/Ncard.vue'
import HomeUnderline from './components/HomeUnderline.vue'
import Confetti from './components/Confetti.vue'
import ChangeLogs from './components/ChangeLog.vue'
// 页面属性
import {
  NolebasePagePropertiesPlugin,
} from '@nolebase/vitepress-plugin-page-properties/client'
import '@nolebase/vitepress-plugin-page-properties/client/style.css'
// <mark> 元素增强
import '@nolebase/vitepress-plugin-enhanced-mark/client/style.css'
// 页面底部评论
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
// 代码块内的代码类型提示
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
// 首页公告栏
import { Announcement } from '@theojs/lumen'
// 图标库
import '@theojs/lumen/icon'
// 页脚
import { HomeFooter } from '@theojs/lumen'
import { Footer_Data } from '../data/fooertData'
// 代码组图标样式
import 'virtual:group-icons.css'
export default {
  extends: DefaultTheme,
  enhanceApp ({ app }: EnhanceAppContext) {
    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      spotlight: {
        disableHelp: true,
        defaultToggle: true,
      }
    } as Options)
    app.component('HomeUnderline', HomeUnderline)
    app.component('NCard', Ncard)
    app.component('HomeFooter', HomeFooter)
    app.component('Confetti', Confetti)
    app.component('ChangeLogs', ChangeLogs)
    app.use(TwoslashFloatingVue as unknown as Plugin)
    app.use(NolebaseGitChangelogPlugin as Plugin)
    app.provide(InjectionKey, {
      hideChangelogNoChangesText: true,
      commitsRelativeTime: true,
      displayAuthorsInsideCommitLine: true,
      hideContributorsHeader: true,
      hideChangelogHeader: true
    })
    app.use(NolebaseInlineLinkPreviewPlugin as Plugin)
    app.use(NolebasePagePropertiesPlugin<{
      progress: number
    }>() as Plugin, {
      properties: {
        'zh-CN': [
          {
            key: 'wordCount',
            type: 'dynamic',
            title: '字数',
            options: {
              type: 'wordsCount',
            },
          },
          {
            key: 'readingTime',
            type: 'dynamic',
            title: '阅读时间',
            options: {
              type: 'readingTime',
              dateFnsLocaleName: 'zhCN',
            },
          },
          {
            key: 'updatedAt',
            type: 'datetime',
            title: '更新时间',
            formatAsFrom: true,
            dateFnsLocaleName: 'zhCN',
          },
        ],
      },
    })
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {

      'nav-bar-content-after': () => [
        // 为较宽的屏幕的导航栏添加阅读增强菜单
        h(NolebaseEnhancedReadabilitiesMenu)
      ],
      'aside-outline-before': () => h(ShareButton),
      // 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
      'layout-top': () => [
        h(NolebaseHighlightTargetedHeading),
      ],
      'home-hero-info-before': () => h(Announcement),
      'layout-bottom': () => h(HomeFooter, { Footer_Data }),
    })
  },

  /** 响应式图片缩放 */
  setup () {
    // 获取前言和路由
    const route = useRoute()
    const { frontmatter } = useData()
    // giscus配置
    giscusTalk({
      repo: 'KarinJS/Karin', //仓库
      repoId: 'R_kgDOLcebnw', //仓库ID
      category: 'Announcements', // 讨论分类
      categoryId: 'DIC_kwDOLcebn84CeJZH', //讨论分类ID
      mapping: 'pathname',
      inputPosition: 'bottom',
      lang: 'zh-CN',
    },
      {
        frontmatter, route
      },
      //默认值为true，表示已启用，此参数可以忽略；
      //如果为false，则表示未启用
      //您可以使用“comment:true”序言在页面上单独启用它
      true
    )
    // 代码块添加折叠
    codeblocksFold({ route, frontmatter }, true, 400)

    const initZoom = () => {
      // 响应式的图片放大缩小
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }) // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
}