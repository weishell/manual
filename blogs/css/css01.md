---
title: css系列
date: 2022/09/18
tags:
 - css
categories:
 - css
--- 

## CSS系列

### 1.CSS 的盒子模型

```css
 box-sizing: content-box|border-box|inherit
```
+ 标准盒模型:CSS中的宽（width）=内容（content）的宽
+ IE盒模型:CSS中的宽（width）=内容（content）的宽+（border+padding）*2

---

### 2.BFC实际应用

+ Block Formatting Context，即块级格式化上下文，简单说：BFC就是页面上的一个`隔离的独立容器`，容器里面的子元素不会影响到外面的元素
+ BFC作用 : **多栏布局,清除浮动,上下margin重叠,文字是否环绕图片**

+ 产生方式：
	1. float 不为none
	2. overflow不为visible
	3. position不为relative和static
	4. display为table-cell table-caption inline-block flex之一
	5. 根元素
	
+ 延伸： 关于BFC面试题：为什么第一个子元素设置margin-top父元素会跟着移动
#### 问题：
有时当设置子元素的margin-top，却发现子元素没有出现上外边距的效果，反而是父元素出现了上外边距的效果。
#### 原因：
边距重叠：一个盒子和其子孙的边距重叠。根据规范，一个盒子如果没有上补白和上边框，那么它的上边距应该和其文档流中的第一个孩子元素的上边距重叠。

```html
<!DOCTYPE html>
<html lang="zh">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<style>
		*{
			margin:0;
			padding:0;
		}
		#k1{
			width:300px;
			height:300px;
			background: red;
			/* border:1px solid red;
			margin-top:20px */
		}
		#k2{
			width:100px;
			height:100px;
			margin-top:20px;
			background:orange
		}
	</style>
</head>
<body>
	<div id='k1'>
		<div id='k2'></div>
	</div>
</body>
</html>
```

#### 解决方案
1. 为父元素设置padding
```css
#k1 {
    padding: 1px;
}
```
2. 为父元素设置border
```css
#k1 {
	 border:1px solid red;
}
```
3. 为父元素设置 overflow: hidden
```css
#k1 {
	overflow: hidden
}
```

4. 父级或子元素使用浮动或者绝对定位absolute
```css
#k1 {
	position:absolute
}
```

---