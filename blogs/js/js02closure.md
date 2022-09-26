---
title: 作用域链和闭包
date: 2022/09/24
tags:
 - js
 - 闭包
categories:
 - js
--- 

### 闭包例题

::: tip 闭包
+ 在计算机科学中对闭包的定义（维基百科）：
	- 闭包（英语：Closure），又称词法闭包（Lexical Closure）或函数闭包（function closures）；
	- 是在支持 头等函数 的编程语言中，实现词法绑定的一种技术；
	- `闭包在实现上是一个结构体，它存储了一个函数和一个关联的环境（相当于一个符号查找表）；`
	- 闭包跟函数最大的区别在于，当捕捉闭包的时候，它的 自由变量 会在捕捉时被确定，这样即使脱离了捕捉时的上下文，它也能照常运行；
+ MDN对JavaScript闭包的解释：
	- 一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）；
	- 也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域；
	- 在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来；
+ 总结：
	- 一个普通的函数function，如果它可以访问外层作用于的自由变量，那么这个函数就是一个闭包；
	- 从广义的角度来说：JavaScript中的函数都是闭包；
	- 从狭义的角度来说：JavaScript中一个函数，如果访问了外层作用于的变量，那么它是一个闭包；
:::

```js
function foo() {
  var name = "foo"
  var age = 18

  function bar() {
    console.log(name)
    console.log(age)
  }
  return bar
}

var fn = foo()
fn()

fn = null
foo = null

// fn()
// fn()
// fn()
// fn()
// fn()
```
+ 在编译前会创建一个globalObject，将代码中的var变量属性值都写入(如图一中go，fn属性创建，初始化)
+ 在执行到该行代码就会赋值或者操作，如果提前打印或者使用，也不会报错
+ 如果是函数，就会在堆中创建一个存储空间指向对应的globalObject
+ 函数执行会创建一个函数执行上下文，也会有一个AO对象对应着拿到属性
+ 执行时再赋值

<div class='imp'>

+ 当函数执行完，函数执行上下文会被弹出栈，AO对象也会被销毁
+ 当再次执行函数时，函数执行上下文和AO对象会再次被创建 
+ **但是图二，bar是被go对象中的fn指向着，根据标记清除，在根元素能找到，bar不会销毁，那么foo的AO对象因为属于bar函数的parentScope的，自然也不会销毁**
+ 图三，当执行完bar函数的操作，那么bar函数的上下文和AO都会清除
+ 图四图五如果go中的fn重置为null，那么从根元素中找不到，虽然bar和foo的AO相互引用，仍然会被清除
+ 图六，当foo也置为null，那么虽然foo函数的parentscope指向go，但是go中找不到foo，根据标记清除，仍然会被清除


</div>



图一：<img src='/img/0002.png'/>

图二：<img src='/img/0001.png'/>

图三：<img src='/img/0003.png'/>

图四：<img src='/img/0004.png'/>

图五：<img src='/img/0005.png'/>

图六：<img src='/img/0006.png'/>


### 闭包内存泄漏

+ 如果不需要的闭包不进行处理，那么会一直占据内存
+ 这里回收一半，可以清楚看到内存回收
+ GC回收不是实时的，因为自身也需要耗费一定的性能
```js
function createFnArray() {
  // var arr = [1, 1, 1, 1, 1, 1, 1, 1,1, 1,1, 1,1 ]
  // 占据的空间是4M x 100 + 其他的内存 = 400M+
  // 1 -> number -> 8byte -> 8M
  // js: 10 3.14 -> number -> 8byte ? js引擎
  // 8byte => 2的64次方 => 4byte
  // 小的数字类型, 在v8中成为Sim, 小数字 2的32次方
  var arr = new Array(1024 * 1024).fill(1)
  return function() {
    console.log(arr.length)
  }
}


// 100 * 100 = 10000 = 10s
var arrayFns = []
for (var i = 0; i < 100; i++) {
  setTimeout(() => {
    arrayFns.push(createFnArray())
  }, i * 100);
}

// arrayFns = null
setTimeout(() => {
  for (var i = 0; i < 50; i++) {
    setTimeout(() => {
      arrayFns.pop()
    }, 100 * i);
  }
}, 10000);
```

<img src='/img/0007.png'/>


### 闭包中未用的变量处理方式

按照规范，age应该是存在闭包之中，但是js引擎考虑到性能，大部分的js引擎会删除age属性。可以通过debugger断点查看闭包中是否还存在age
```js
function foo() {
  var name = "why"
  var age = 18

  function bar() {
    debugger
    console.log(name)
  }

  return bar
}

var fn = foo()
fn()


```


+ Detect data types, simple data types and object data types
+ You can also pass a second parameter, true ensures that the result is the value of Object.prototype.toString such as [object B]B
+ If it is a custom object, get the name of the constructor
