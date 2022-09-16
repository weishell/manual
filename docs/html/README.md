## html


1. HTML5 的优点与缺点

+ 优点： 
	- 网络标准统一、HTML5 本身是由 W3C 推荐出来的
	- **多设备、跨平台** (video+audio+canvas解决以前很多安装插件或者兼容代码实现多端功能)
	- 即时更新 websocket
	- 语义化标签，涉及到网站的抓取和索引的时候，对于 SEO 很友好
	- 可以给站点带来更多的多媒体元素(视频和音频)，可以很好的替代 Flash 和 Silverlight
	- 被大量应用于移动应用程序和游戏
+ 缺点： 
	- 安全：web storage、web socket 这样的功能很容易被黑客利用，来盗取用户的信息和资料
	- 完善性：许多特性各浏览器的支持程度也不一样
	- 性能：某些平台上的引擎问题导致 HTML5 性能低下
	- 浏览器兼容性：最大缺点，IE9 以下浏览器几乎全军覆没

---

2. Doctype作用?严格模式与混杂模式如何区分？它们有何意义?
+ 它是 HTML 的文档声明，通过它告诉浏览器，使用哪一个 HTML 版本标准解析文档。`<!DOCTYPE>`这种书写是告诉浏览器，整个文档使用 HTML5 的标准进行解析。
+ HTML5 不需要引入 DTD 文件，而其他类型的文档声明是需要引入 DTD 的。
+ **严格模式：** 又称标准模式，是指浏览器按照 W3C 标准解析代码。
+ **混杂模式：** 又称怪异模式或兼容模式，是指浏览器用自己的方式解析代码。
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">
```
---

3. 描述一下 cookie，sessionStorage 和localStorage 的区别?

- Cookie
	+ 每个域名存储量比较小（各浏览器不同，大致 4K ）+ 所有域名的存储量有限制（各浏览器不同，大致 4K ）+ 有个数限制（各浏览器不同）
	+ 会随请求发送到服务器
- LocalStorage
	+ 永久存储
	+ 单个域名存储量比较大（推荐 5MB ，各浏览器不同）+ 总体数量无限制
- SessionStorage
	+ 只在 Session 内有效
	+ 存储量更大（推荐没有限制，但是实际上各浏览器也不同）
---

4. data-属性的作用是什么？

data- 为 H5 新增的为前端开发者提供自定义的属性，这些属性集可以通过对象的 **dataset** 属性获取，不支持该属性的浏览器可以通过**getAttribute** 方法获取:

需要注意的是：data-之后的以连字符分割的多个单词组成的属性，获取的时候使用驼峰风格。 

所有主流浏览器都支持 data-* 属性。即：当没有合适的属性和元素时，自定义的 data 属性是能够存储页面或App的私有的自定义数据。
```html
<html>
	<div data-a='1990' id="k"></div>
</html>
<script>
	let k =document.getElementById('k')
	console.log(k.dataset.a)//1990 
	console.log(k.getAttribute('data-a'))//1990 //attribute
	console.log(k.id)//k //property
</script>
```
---

5. 对浏览器内核的理解

+ Trident 内核： IE,MaxThon,TT,The World,360, 搜狗浏览器等。[ 又称MSHTML]
+ Gecko 内核： Netscape6 及以上版本， FF,MozillaSuite/SeaMonkey 等
+ Presto 内核： Opera7 及以上。 [Opera 内核原为：Presto ，现为：Blink;]
+ Webkit 内核： Safari,Chrome 等。 [ Chrome 的： Blink （WebKit 的分支）]

主要分成两部分：渲染引擎(layout engineer 或 Rendering Engine) 和JS 引擎。

`渲染引擎`：负责获取网页的内容（HTML、 XML 、图像等等）、整理讯息（例如加入 CSS 等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。

`JS 引擎`：解析和执行 javascript 来实现网页的动态效果。最开始渲染引擎和 JS 引擎并没有区分的很明确，后来JS 引擎越来越独立，内核就倾向于只指渲染引擎。

---