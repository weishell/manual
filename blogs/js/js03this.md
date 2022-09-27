---
title: this
date: 2022/09/25
tags:
 - js
 - this
categories:
 - js
--- 

### this指向和规则

1. this在全局作用于下指向window
```js
console.log(this)//window
```

2. 使用this，通常都是在函数中使用。
	+ 所有的函数在被调用时，都会创建一个执行上下文：
	+ 这个上下文中记录着函数的调用栈、AO对象等；
	+ this也是其中的一条记录；

3. this的四种绑定规则
	- 绑定一：默认绑定；
	- 绑定二：隐式绑定；
	- 绑定三：显示绑定；
	- 绑定四：new绑定；

+ new绑定 > 显示绑定(apply/call/bind) > 隐式绑定(obj.foo()) > 默认绑定(独立函数调用)
+ new不能同时和apply、call一起使用

#### 默认绑定：`独立函数调用`
独立的函数调用可以理解成 ***函数没有被绑定到某个对象上进行调用***

```js
function foo() {
  console.log(this)
}

foo()//window
```
**bar是个独立函数**，故而this指向window
```js
var obj = {
  name: "why",
  foo: function() {
    console.log(this)
  }
}

var bar = obj.foo
obj.foo() //{name: 'why', foo: ƒ}
bar() // window
```
```js
function foo() {
  function bar() {
    console.log(this)
  }
  return bar
}

var fn = foo()
fn() // window

var obj = {
  name: "why",
  eating: fn
}

obj.eating() // 隐式绑定 {name: 'why', eating: ƒ}
```

#### 隐式绑定
也就是它的调用位置中，是通过某个对象发起的函数调用
```js
object.fn()
// object对象会被js引擎绑定到fn函数的中this里面
```

```js
var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}

var obj2 = {
  name: "obj2",
  bar: obj1.foo
}

obj2.bar()
// {name: 'obj2', bar: ƒ}
```

#### 显示绑定
+ call和apply在执行函数时,是可以明确的绑定this, 这个绑定规则称之为显示绑定
+ ***显示绑定优先级高于隐式绑定*** ，多次重复运用可以考虑bind绑定后再调用
+ **数组.forEach/map/filter/find，可以额外传递this对象**
```js
var names = ["abc", "cba", "nba"]
names.forEach(function(item) {
  console.log(item, this)
}, "abc")
```
```js
function foo() {
  console.log(this)
}

foo.call("fff")//String {'fff'}


// 默认绑定和显示绑定bind冲突: 优先级(显示绑定)

var newFoo = foo.bind("aaa")//String {'aaa'}

newFoo()


var bar = foo
console.log(bar === foo)//true;
console.log(newFoo === foo)//false

console.log(newFoo) 
// function foo() {
//   console.log(this)
// }
// 但是同时有这句话在蓝色感叹号上
// Function was resolved from bound funciton
```

#### new 绑定 
this = 创建出来的对象
```js
function Person(name, age) {
  this.name = name
  this.age = age
}

var p1 = new Person("why", 18)
console.log(p1.name, p1.age)//why 18
```
+ new的优先级高于隐式绑定
```js
var obj = {
  name: "obj",
  foo: function() {
    console.log(this)
  }
}

// new的优先级高于隐式绑定
var f =  obj.foo()
//{name: 'obj', foo: ƒ}

var g =new obj.foo()
//foo {}
```
+ new与bind比较
```js
function foo() {
  console.log(this)
}

var bar = foo.bind("aaa")
var obj = new bar()//foo {}

var baz =foo.bind('bbb')
baz()//String {'bbb'}
```
#### 特殊情况
+ 当绑定null或者undefined时，显示绑定总是返回this是window
```js
function foo() {
  console.log(this)
}


// apply/call/bind: 当传入null/undefined时, 自动将this绑定成全局对象
foo.apply(null)
foo.apply(undefined)

var bar = foo.bind(null)
bar()
```
+ 注意间接函数引用，this会默认为window,且语法中的；不能省略，否则会报错
```js
var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}

var obj2 = {
  name: "obj2"
};//这里的分号一定要加

// obj2.bar = obj1.foo
// obj2.bar() //obj2

(obj2.bar = obj1.foo)()//window
```
+ 箭头函数没有this指向，需要从其父级寻找。
```js
var foo = () => {
  console.log(this)
}

foo()
var obj = {foo: foo}
obj.foo()
foo.call("abc")
//window
//window
//window
```

```js
var name = 'window'

var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person2 = { name: 'person2' }

person1.foo1(); // person1(隐式绑定)
person1.foo1.call(person2); // person2(显示绑定优先级大于隐式绑定)

person1.foo2(); // window(不绑定作用域,上层作用域是全局)
person1.foo2.call(person2); // window

person1.foo3()(); // window(独立函数调用)
person1.foo3.call(person2)(); // window(独立函数调用)
person1.foo3().call(person2); // person2(最终调用返回函数式, 使用的是显示绑定)

person1.foo4()(); // person1(箭头函数不绑定this, 上层作用域this是person1)
person1.foo4.call(person2)(); // person2(上层作用域被显示的绑定了一个person2)
person1.foo4().call(person2); // person1(上层找到person1)
```

```js
var name = 'window'

function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () => console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() // person1
person1.foo1.call(person2) // person2(显示高于隐式绑定)

person1.foo2() // person1 (上层作用域中的this是person1)
person1.foo2.call(person2) // person1 (上层作用域中的this是person1)

person1.foo3()() // window(独立函数调用)
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1
```
```js
var name = 'window'

function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()() // window
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

person1.obj.foo2()() // obj
person1.obj.foo2.call(person2)() // person2
person1.obj.foo2().call(person2) // obj
```