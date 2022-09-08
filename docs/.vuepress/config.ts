import { defineUserConfig, defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'
import anchor from 'markdown-it-anchor'
export default defineUserConfig({
	lang: 'zh-CN',
	title: '小册',
	port: 3000,
	description: '前端整理小册',
	head: [
		['link', { rel: 'icon', href: '/images/logo.jpg' }]
	],
	markdown: {
		anchor: {
			level: [1, 2, 3, 4, 5, 6],
			permalink: anchor.permalink.ariaHidden({
				class: 'header-anchor',
				placement: 'before', //可设置为after
				symbol: '@' //显示文字，可自行修改
			}),
		},
		code:{
			lineNumbers:false
		}
	},
	plugins: [
	    searchPlugin({
	      maxSuggestions:10
	    }),
	],
	theme: defaultTheme({
		contributorsText: '来源',
		lastUpdatedText: '更新时间',
		logo: '/images/logo.jpg',
		navbar: [
			{ text: '首页', link: '/' },
			{
				text: '语言',
				children: [
					{ text: 'html', link: '/html/' },
				]
			}
		],
		sidebar: [
			{
				text: 'html', link: '/html/',
				children: [
					{ text: 'html首页', link: '/html/README.md' }
				]

			}
		]
		
	})
})