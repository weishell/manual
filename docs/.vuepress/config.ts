import { defineUserConfig, defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'
import anchor from 'markdown-it-anchor'
export default defineUserConfig({
	sidebarDepth: 1,
	lang: 'zh-CN',
	title: '小册',
	port: 7777,
	description: '前端整理小册',
	head: [
		['link', { rel: 'icon', href: '/images/logo.jpg' }]
	],
	markdown: {
		// anchor: {
		// 	level: [1, 2, 3, 4, 5, 6],
		// 	permalink: anchor.permalink.ariaHidden({
		// 		class: 'header-anchor',
		// 		placement: 'before', //可设置为after
		// 		symbol: '@' //显示文字，可自行修改
		// 	}),
		// },
		code: {
			lineNumbers: false
		},
		headers:{
			options:{
				 level: [2, 3,4],
			}
		}
	},
	plugins: [
		searchPlugin({
			maxSuggestions: 15
		})

	],
	theme: defaultTheme({
		contributorsText: '来源',
		lastUpdatedText: '更新时间',
		logo: '/images/logo.jpg',
		sidebarDepth: 1,
		navbar: [
			{ text: '首页', link: '/' },
			{
				text: '语言',
				children: [
					{ text: 'html', link: '/html/' },
					{ text: 'css', link: '/css/' },
					{ text: 'js', link: '/js/' },
				]
			},
			{
				text: '框架',
				children: [
					{ text: 'vue', link: '/vue/' },
					{ text: 'ui', link: '/ui/' },
				]
			}
		],
		sidebar: {
			'/css/': [{
				text: 'css',
				children: [
					{ text: 'css模块', link: '/css/README.md' }
				],
				// collapsible: true
			}],
			'/html/': [{
				text: 'html',
				children: [
					{ text: 'html模块', link: '/html/README.md' },
				],
				collapsible: true,
			}],
			'/js/': [{
				text: 'js',
				children: [
					{ text: 'js模块', link: '/js/README.md' },
					{ text: '数组', link: '/js/01array.md' },
					{ text: '对象', link: '/js/02object.md' },
					{ text: '性能优化', link: '/js/03performance.md' },
					
				],
				collapsible: true,
			}],
		
			'/ui/': [{
				text: 'ui', link: '/ui/',
				children: [
					{ text: 'ui', link: '/ui/README.md' },
					{ text: 'elementui', link: '001elementui'},
				],
			}],
			'/vue/': [{
				text: 'vue', link: '/vue/',
				children: [
					{ text: 'vue', link: '/vue/README.md' },
				]
			}]



		}

	})
})