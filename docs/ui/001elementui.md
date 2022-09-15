## elementui
elementui

## 怎么使用
```js
theme: defaultTheme({
		contributorsText: '来源',
		lastUpdatedText: '更新时间',
		logo: '/images/logo.jpg',
		sidebarDepth: 3,
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
			
			
			theme: defaultTheme({
				contributorsText: '来源',
				lastUpdatedText: '更新时间',
				logo: '/images/logo.jpg',
				sidebarDepth: 3,
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
```


## html
adsf1