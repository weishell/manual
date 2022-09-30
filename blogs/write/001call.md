---
title: 手写call，apply，bind
date: 2022/09/27
tags:
 - js
 - 手写
categories:
 - js
--- 

### 手写call apply

> this的传递接受和边界情况需要更多的注意调整

+ 最重要的是怎么在自定义call里获取到调用函数
+ 因为函数调用了call，所以在call中的this此时指向的就是函数本身，故而可以定义 var fn = this
+ 需要给call绑定的对象和函数之间建立联系，那么将fn 赋给绑定对象作为其中方法就可以了，然后再调用
+ 调用完之后返回值，再删除绑定对象内刚才多余的fn方法即可
+ 如果参数null和undefined则指向window
```js
Function.prototype.hycall = function(thisArg, ...args) {
  // 在这里可以去执行调用的那个函数(foo)
  // 问题: 得可以获取到是哪一个函数执行了hycall
  // 1.获取需要被执行的函数
  var fn = this

  // 2.对thisArg转成对象类型(防止它传入的是非对象类型)
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg): window

  // 3.调用需要被执行的函数
  thisArg.fn = fn
  var result = thisArg.fn(...args)
  delete thisArg.fn

  // 4.将最终的结果返回出去
  return result
}
```

+ apply基本和call一样，要注意的是apply第二个参数是数组，需要判断是否传了，传了才可以解构。不传的话则需要处理。
```js
Function.prototype.hyapply = function(thisArg, argArray) {
  // 1.获取到要执行的函数
  var fn = this
  // 2.处理绑定的thisArg
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg): window
  // 3.执行函数
  thisArg.fn = fn
  var result
  argArray = argArray || []
  result = thisArg.fn(...argArray)
  delete thisArg.fn
  // 4.返回结果
  return result
}
```

+ 如果调用的对象里正好也要个fn函数呢？可借助于Symbol
```js
const key = Symbol()
// 这里的this为需要执行的方法
context[key] = this
```

### 手写bind
原生bind传递参数，既可以写在bind函数里，也可以写在调用时，也可以两者都写进行合并。
```js
function sum(num1, num2, num3, num4) {
  console.log(num1, num2, num3, num4)
}

var newSum = sum.bind("aaa", 10, 20, 30, 40)
newSum()

var newSum = sum.bind("aaa")
newSum(10, 20, 30, 40)

var newSum = sum.bind("aaa", 10)
newSum(20, 30, 40)
```

```js
Function.prototype.hybind = function(thisArg, ...argArray) {
  // 1.获取到真实需要调用的函数
  var fn = this

  // 2.绑定this
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg): window

  function proxyFn(...args) {
    // 3.将函数放到thisArg中进行调用
    thisArg.fn = fn
    // 特殊: 对两个传入的参数进行合并
    var finalArgs = [...argArray, ...args]
    var result = thisArg.fn(...finalArgs)
    delete thisArg.fn

    // 4.返回结果
    return result
  }

  return proxyFn
}
```