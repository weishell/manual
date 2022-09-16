## 数组

1. 判断数组类型:Object.prototype.toString.call()、instanceof、Array.isArray()以及 typeof优劣
+ typeof：检测不出数组类型,只能检测string、boolean、number、 function 、 object 、undefined、bigint、symbol,且null和array都是object类型
+ instanceof：**用来检测一个对象在其原型链中是否存在一个构造函数的 prototype 属性。** `但它不能检测null 和 undefined,也不能检测简单类型`

-|-
-|-
语法|object instanceof constructor
参数|object（要检测的对象.）constructor（某个构造函数）
描述| ***instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上。***

```js
[].__proto__ === Array.prototype
```
+ constructor检测数据类型法:和instanceof非常相似。但constructor检测 Object与instanceof不一样，还可以处理基本数据类型的检测。
```js
let s1 ='s1'
console.log(s1.__proto__.constructor === String)//true
```
不过函数的 constructor 是不稳定的，这个主要体现在把 类的原型进行重写,***然后没有及时修正。***
```js
	function Animal(params){
　　　　this.species = "动物";
　　}
	Animal.prototype.dosomething = function(){
		console.log("do something")
	}
　	function Cat(name,color){
　　　　this.name = name;
　　　　this.color = color;
　　}
	
	Cat.prototype = new Animal();
	// 没有修正原型的构造函数
	// Cat.prototype.constructor = Cat;
　　var cat1 = new Cat("大毛","黄色");

	console.log(cat1 instanceof Cat) //true
	console.log(cat1.__proto__.constructor === Cat)//false

	console.log(cat1.__proto__)//Animal {species: '动物'}
	console.log(Cat.prototype)//Animal {species: '动物'}
	console.log(cat1.__proto__ === Cat.prototype)//true
```
```js
Cat.prototype.constructor = Cat;
console.log(cat1.__proto__.constructor === Cat)//true
console.log(cat1.__proto__)
/*Animal {species: '动物', constructor: ƒ}
*constructor: ƒ Cat(name,color)
*species: "动物
*/
```

+ Object.prototype.toString.call()：可以判断所有类型，但是自定义对象只会显示是对象类型
	- 不使用自身的toString()原因:Array，Function等都重写了toString
```js
Object.prototype.toString.call(undefined) ; // [object Undefined]
```


---
