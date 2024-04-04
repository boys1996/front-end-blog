---
date: 2022-06-06
title: 'js开发基础'
tags: 'js基础'
categories: 'web 前端'
sidebar: 'auto'
isTimeLine: true
isShowComment: false
singSort: 1
---
[TOC]

## script常见属性

| 属性名                | 类型    | 备注                                                                                                                                                                 |
| --------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **async**       | Boolean | 表示应该立即开始下载 脚本，但不能阻止其他页面动作，异步执行                                                                                                          |
| **defer**       | Boolean | 表示页面解析和显示完成后再执行脚本，只对外部文件有效                                                                                                                 |
| **charset**     | String  | 规定在外部脚本文件中使用的字符编码，常见 UTF-8                                                                                                                       |
| **crossorigin** | String  | 配置相关请求的CORS（跨域资源共享设置），默认不使用，关键字: anonymous（对此元素的 CORS 请求将不设置凭据标志）、use-credentials（允许你配置元素获取数据的 CORS 请求） |
| **integrity**   | String  | 允许比对接收到的资源和指定的加密签名以验证子资源完整性                                                                                                               |
| **src**         | String  | 规定外部脚本的 URL                                                                                                                                                   |
| **type**        | String  | 规定脚本的 MIME 类型，常用的类型：text/javascript、application/json、module                                                                                          |

## js数据类型

### 一、基本类型

String、Number、Boolean、Symbol、bigInt、undefined、null（特殊）

**Symbol**：作为对象的唯一标识，不被重复的可以所替代，一个symbol值能作为对象属性的标识符

```js
let smb0 = Symbol('abc');
let smb1 = Symbol('abc'); // 还是新创建的一个
console.log(smb0 === smb1); // false
console.log('===============');
let smb2 = Symbol.for('abc'); // 对全局进行注册并保存
let smb3 = Symbol.for('abc'); // 从全局注册中获取
console.log(smb3 === smb2); // true
console.log('===============');// true
```

- 避免被重复的算法所覆盖对象的key，场景可以参考计算id
- Object.getOwnPropertySymbols可以迭代对象上的该属性

**BigInt**：处理失去精度的Number计算

```js
let max = Number.MAX_SAFE_INTEGER; // 最大安全整数
let max1 = max + 1
let max2 = max + 2
console.log(max1 === max2);
console.log('===============');
let bi1 = BigInt(Number.MAX_SAFE_INTEGER) || 9007199254740991n;
let max3 = bi1 + 1n;
let max4 = bi1 + 2n;
console.log(max3 === max4)
console.log('===============');
```

- IE的支持不太好，并且当使用 BigInt 时，带小数的运算会被取整

### 二、引用类型

Object、Function（可以执行的特殊对象）、Array（具备数值下表和有序数据的特殊对象）

### 三、判断数据类型

- typeof ： 判断基本数据类型，且null除外

- instanceof： 判断实例对象是不是构造函数得实例,主要用于判断引用数据类型

  ```js
  // 如：String, Object，Function，Array，Date，RegExp
  var myDate = new Date();
  myDate instanceof Date; // true
  var myString = new String();
  myString instanceof String; // true
  var myArray = new Array();
  myArray instanceof Array; // true
  // 同时也可以判断父类型或者祖先类型的实例
  let fun = function() {}；
  let b = new fun();
  b instanceof fun; // true
  ```
  
- Object.prototype.toString.call()：默认返回其调用者的具体类型，是 toString运行时this指向的对象类型，返回的类型格式为[object,xxx]，，xxx是具体的数据类型，其中包括：String,Number,Boolean,Undefined,Null,Function,Date,Array,RegExp,Error,HTMLDocument等

  ```js
  Object.prototype.toString.call("jerry") // [object String]
  Object.prototype.toString.call(true) // [object Boolean]
  Object.prototype.toString.call(/\d/) // [object RegExp]
  ```
  
- constructor：当一个函数被定义时，JS引擎会为这个函数添加prototype原型，然后再在prototype上添加一个constructor属性，并让其指向该函数的引用 在去判断数据的实例

  ```js
  '1'.constructor === String // true
  new Number(1).constructor === Number // true
  alert.constructor === Function // true
  new Date().constructor === Date // true
  ```

  注：

  1、null和undefined是无效的对象，因此是不会有constructor存在的
  2、JS对象的constructor是不稳定的，这个主要体现在自定义对象上，当开发者重写prototype后，原有的constructor会丢失，constructor会默认为Objec
### 四、typeof 与 instanceof 区别

#### 1、typeof

`typeof` 操作符返回一个字符串，表示未经计算的操作数的类型

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof null // 'object'
typeof [] // 'object'
typeof {} // 'object'
typeof console // 'object'
typeof console.log // 'function'
```

从上面例子，前6个都是基础数据类型。虽然`typeof null`为`object`，但这只是` JavaScript` 存在的一个悠久 `Bug`，不代表`null `就是引用数据类型，并且`null `本身也不是对象

#### 2、instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

```js
object instanceof constructor
```

`object`为实例对象，`constructor`为构造函数

构造函数通过`new`可以实例对象，`instanceof `能判断这个对象是否是之前那个构造函数生成的对象

```js
// 定义构建函数
let Car = function() {}
let benz = new Car()
benz instanceof Car // true
let car = new String('xxx')
car instanceof String // true
let str = 'xxx'
str instanceof String // false
```

`instanceof`的实现原理：

```js
function myInstanceof(left, right) {
    // 这里先用typeof来判断基础数据类型，如果是，直接返回false
    if(typeof left !== 'object' || left === null) return false;
    // getProtypeOf是Object对象自带的API，能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left);
    while(true) {                  
        if(proto === null) return false;
        if(proto === right.prototype) return true;//找到相同原型对象，返回true
        proto = Object.getPrototypeof(proto);
    }
}
```

也就是顺着原型链去找，直到找到相同的原型对象，返回`true`，否则为`false`

#### 3、区别

`typeof`与`instanceof`都是判断数据类型的方法，区别如下：

- `typeof`会返回一个变量的基本类型，`instanceof`返回的是一个布尔值

- `instanceof` 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型
- 而` typeof` 也存在弊端，它虽然可以判断基础数据类型（`null` 除外），但是引用数据类型中，除了` function` 类型以外，其他的也无法判断

可以看到，上述两种方法都有弊端，并不能满足所有场景的需求

如果需要通用检测数据类型，可以采用`Object.prototype.toString`，调用该方法，统一返回格式`“[object Xxx]” `的字符串

下面根据`toString`的基本用法实现一个全局通用的数据类型判断方法：

```js
function getType(obj){
  let type  = typeof obj;
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1'); 
}
```



### 五、栈和堆

栈内存：基本数据类型直接存在栈内存中，采用的是值传递

堆内存：引用数据类型采用地址传递，值放在堆中，key通过地址放在栈中

**js函数调用时是值传递还是地址传递？**
根据传递的类型决定

```js
// 示例1：基本类型（值）传递
var a = 3;// 这里的a是全局变量
function fn(a) {
	//这里的a是局部变量
	a = a + 1;
}
fn(a);// 这里代表将全局变量a的值（3）赋值给局部变量a
console.log(a);// 3；这里的a是全局变量

// 示例2：引用类型（地址值）传递
function fn(obj) {
	// 这里输出局部变量obj的name值
	console.log(obj.name);// 取局部变量地址值对应对象的属性
}
var obj = {name:"Tom"};// 这里是全局变量obj，存的是对象的地址值
fn2(obj);// Tom；将全局变量obj的地址值赋值给局部变量obj
```

**js引擎是如何管理内存**

1. 内存生命周期
   分配小内存空间，得到它的使用权
   存储数据，可以反复进行操作
   释放小内存空间
2. 释放内存
   局部变量：函数执行完自动释放
   对象：成为垃圾对象——>垃圾回收器回收
   （注意：全局变量不会释放）

**函数new的过程中发生了什么**

1、创建一个空对象，将它的引用赋给 this，继承函数的原型

2、通过 this 将属性和方法添加至这个对象

3、最后返回 this 指向的新对象，也就是实例，如果没有手动返回其他任何对象或返回值是基本类型（Number、String、Boolean）的值，会返回 this 指向的新对象，也就是实例，若返回值是引用类型（Object、Array、Function）的值，则实际返回值为这个引用类型

```js

// ES5构造函数
let Parent = function (name, age) {
    //1.创建一个新对象，赋予this，这一步是隐性的，
    // let this = {};
    //2.给this指向的对象赋予构造属性
    this.name = name;
    this.age = age;
    //3.如果没有手动返回对象，则默认返回this指向的这个对象，也是隐性的
    // return this;
};
const child = new Parent();
```



## 类型转换机制

`js`常见的类型转换有：

- 强制转换（显示转换）
- 自动转换（隐式转换）

### 一、显示转换

#### Number()

将任意类型的值转化为数值

![](@public/image/js/013.png)

```js
Number(324) // 324

// 字符串：如果可以被解析为数值，则转换为相应的数值
Number('324') // 324

// 字符串：如果不可以被解析为数值，返回 NaN
Number('324abc') // NaN

// 空字符串转为0
Number('') // 0

// 布尔值：true 转成 1，false 转成 0
Number(true) // 1
Number(false) // 0

// undefined：转成 NaN
Number(undefined) // NaN

// null：转成0
Number(null) // 0

// 对象：通常转换成NaN(除了只包含单个数值的数组)
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5
```

从上面可以看到，`Number`转换的时候是很严格的，只要有一个字符无法转成数值，整个字符串就会被转为`NaN`

#### parseInt()

`parseInt`相比`Number`，就没那么严格了，`parseInt`函数逐个解析字符，遇到不能转换的字符就停下来

```js
parseInt('32a3') //32
```

#### String()

可以将任意类型的值转化成字符串

![](@public/image/js/014.png)

```js
// 数值：转为相应的字符串
String(1) // "1"

//字符串：转换后还是原来的值
String("a") // "a"

//布尔值：true转为字符串"true"，false转为字符串"false"
String(true) // "true"

//undefined：转为字符串"undefined"
String(undefined) // "undefined"

//null：转为字符串"null"
String(null) // "null"

//对象
String({a: 1}) // "[object Object]"
String([1, 2, 3]) // "1,2,3"
```

#### Boolean()

可以将任意类型的值转为布尔值

```js
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean(NaN) // false
Boolean('') // false
Boolean({}) // true
Boolean([]) // true
Boolean(new Boolean(false)) // true
```

### 二、隐式转换

在隐式转换中，我们可能最大的疑惑是 ：何时发生隐式转换？

我们这里可以归纳为两种情况发生隐式转换的场景：

- 比较运算（`==`、`!=`、`>`、`<`）、`if`、`while`需要布尔值地方
- 算术运算（`+`、`-`、`*`、`/`、`%`）

除了上面的场景，还要求运算符两边的操作数不是同一类型



#### 自动转换为布尔值

在需要布尔值的地方，就会将非布尔值的参数自动转为布尔值，系统内部会调用`Boolean`函数

可以得出个小结：

- undefined 
- null 
- false 
- +0 
- -0
- NaN
- ""

除了上面几种会被转化成`false`，其他都换被转化成`true`



#### 自动转换成字符串

遇到预期为字符串的地方，就会将非字符串的值自动转为字符串

具体规则是：先将复合类型的值转为原始类型的值，再将原始类型的值转为字符串

常发生在`+`运算中，一旦存在字符串，则会进行字符串拼接操作

```js
'5' + 1 // '51'
'5' + true // "5true"
'5' + false // "5false"
'5' + {} // "5[object Object]"
'5' + [] // "5"
'5' + function (){} // "5function (){}"
'5' + undefined // "5undefined"
'5' + null // "5null"
```



#### 自动转换成数值

除了`+`有可能把运算子转为字符串，其他运算符都会把运算子自动转成数值

```js
'5' - '2' // 3
'5' * '2' // 10
true - 1  // 0
false - 1 // -1
'1' - 1   // 0
'5' * []    // 0
false / '5' // 0
'abc' - 1   // NaN
null + 1 // 1
undefined + 1 // NaN
```

`null`转为数值时，值为`0` 。`undefined`转为数值时，值为`NaN`



## 原型

- 一个可以被复制（或者叫克隆）的一个类，通过复制原型可以创建一个一模一样的新对象，也可以说原型就是一个模板，在设计语言中更准确的说是一个对象模板
- 原型是定义了一些公用的属性和方法，利用原型创建出来的**新对象**实例会**共享**原型的所有属性和方法

  所有引用类型都有一个 `__proto__`(隐式原型)属性，属性值是一个普通的对象
- 所有函数都有一个 `prototype`(显式原型)属性，属性值是一个普通的对象
- 所有引用类型的 `__proto__`属性指向它构造函数的prototype

简单理解，就是为了提高属性复用，提供的一种继承机制

#### 说说对原型的理解(`面试题`)

    在 JavaScript 中，每当定义一个对象（函数也是对象）时候，对象中都会包含一些预定义的属性。其中每个函数对象都有一个prototype 属性，这个属性指向函数的原型对象，使用原型对象的好处是所有对象实例共享它所包含的属性和方法

#### 显时原型（prototype）

  **prototype** 每一个函数在创建之后，便会拥有一个prototype属性，这个属性指向函数的原型对象，显示原型的作用是用来实现基于原型的继承与属性的共享

#### 隐式原型 （\__proto__）

   `对象.__proto__`时对象独有的，`__proto__`属性都是由**一个对象指向一个对象**，此属性继承自object对象，但Firefox、Safari和Chrome在每个对象上都支持一个属性proto，隐式原型的作用是用来构成原型链，实现基于原型的继承

![](@public/image/js/001.png)

![](@public/image/js/002.png)

#### 什么是原型链(`面试题`)

- 原型链是原型对象创建过程的历史记录，当访问一个对象的某个属性时，会先在这个对象本身属性上查找，如果没有找到，则会去它的__proto__隐式原型上查找，即它的构造函数的prototype，如果还没有找到就会再在构造函数的prototype的__proto__中查找，这样一层一层向上查找就会形成一个链式结构
- 当查找一个对象的属性时，JavaScript 会根据原型链向上遍历对象的原型，直到找到给定名称的属性为止，直到到达原型链的顶部仍然没有找到指定的属性，就会返回 undefined

> **也可以理解为原型链继承时查找属性的过程是先查找自身属性，当自身属性不存在时，会在原型链中逐级查找**
> **所有从原型或更高级原型中的得到、执行的方法，其中的 `this`在执行时，指向 `当前这个触发事件执行的对象`**

#### prototype 和 \__proto__ 区别是什么(`面试题`)

- prototype是构造函数的属性
- `__proto__`是每个实例都有的属性，可以访问 [[prototype]] 属性
- 实例的 `__proto__`与其构造函数的prototype指向的是同一个对象

#### 原型和原型链的区别(`面试题`)

`原型`是为了实现对象间的联系，解决构造函数无法数据共享而引入的一个属性，而 `原型链`是一个实现对象间联系即继承的主要方法

#### constructor属性

constructor属性也是对象才拥有的，它是从一个对象指向一个函数，含义就是指向该对象的构造函数，每个对象都有构造函数（本身拥有或继承而来，继承而来的要结合__proto__属性查看会更清楚点，如下图所示），从上图中可以看出Function这个对象比较特殊，它的构造函数就是它自己（因为Function可以看成是一个函数，也可以是一个对象），所有函数和对象最终都是由Function构造函数得来，所以constructor属性的终点就是Function这个函数。

![](@public/image/js/003.png)

每个对象都可以找到其对应的constructor，因为创建对象的前提是需要有constructor，而这个constructor可能是对象自己本身显式定义的或者通过 `__proto__`在原型链中找到的。而单从constructor这个属性来讲，只有prototype对象才有。每个函数在创建的时候，JS会同时创建一个该函数对应的prototype对象，而函数创建的 `对象.__proto__` === 该函数.prototype，该函数.prototype.constructor===该函数本身，故通过函数创建的对象即使自己没有constructor属性，它也能通过 `__proto__`找到对应的constructor，所以任何对象最终都可以找到其构造函数（null如果当成对象的话，将null除外）

```js
function Foo(){};
let f = new Foo();
```

#### 总结：

1. `__proto__`和 `constructor`属性是**对象**所独有的，`prototype`属性是**函数**所独有的，因为函数也是一种对象，所以函数也拥有 `__proto__`和 `constructor`属性。
2. `__proto__`属性的作用就是当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的 `__proto__`属性所指向的那个对象（父对象）里找，一直找，直到 `__proto__`属性的终点null，再往上找就相当于在null上取值，会报错。通过 `__proto__`属性将对象连接起来的这条链路即我们所谓的原型链。
3. `prototype`属性的**作用**就是让该函数所实例化的对象们都可以找到公用的属性和方法，即 `f.__proto__ === Foo.prototype`。
4. `constructor`属性的含义就是**指向该对象的构造函数**，所有函数（此时看成对象了）最终的构造函数都指向**Function**。

## 深拷贝与浅拷贝

### 一、浅拷贝

    浅拷贝，指的是创建新的数据，这个数据有着原始数据属性值的一份精确拷贝

如果属性是基本类型，拷贝的就是基本类型的值。如果属性是引用类型，拷贝的就是内存地址

即浅拷贝是拷贝一层，深层次的引用类型则共享内存地址

下面简单实现一个浅拷贝

```js
function shallowClone(obj) {
    const newObj = {};
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop)){
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
}
```

在 `JavaScript`中，存在浅拷贝的现象有：

- `Object.assign`

  ```js
  var newObj = Object.assign({}, {
      age: 18,
      nature: ['smart', 'good'],
      names: {
          name1: 'fx',
          name2: 'xka'
      });
  ```
- `Array.prototype.slice()`

  ```js
  const fxArr = ["One", "Two", "Three"]
  const fxArrs = fxArr.slice(0)
  fxArrs[1] = "love";
  console.log(fxArr) // ["One", "Two", "Three"]
  console.log(fxArrs) // ["One", "love", "Three"]
  ```
- `Array.prototype.concat()`

```js
  const fxArr = ["One", "Two", "Three"]
  const fxArrs = fxArr.concat()
  fxArrs[1] = "love";
  console.log(fxArr) // ["One", "Two", "Three"]
  console.log(fxArrs) // ["One", "love", "Three"]
```

- 使用拓展运算符实现的复制

  ```js
  const fxArr = ["One", "Two", "Three"]
  const fxArrs = [...fxArr]
  fxArrs[1] = "love";
  console.log(fxArr) // ["One", "Two", "Three"]
  console.log(fxArrs) // ["One", "love", "Three"]
  ```

### 二、深拷贝

    深拷贝开辟一个新的栈，两个对象属完成相同，但是对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性

常见的深拷贝方式有：

- _.cloneDeep()

  ```js
  const _ = require('lodash');
  const obj1 = {
      a: 1,
      b: { f: { g: 1 } },
      c: [1, 2, 3]
  };
  const obj2 = _.cloneDeep(obj1);
  console.log(obj1.b.f === obj2.b.f);// false
  ```
- jQuery.extend()

  ```js
  const $ = require('jquery');
  const obj1 = {
      a: 1,
      b: { f: { g: 1 } },
      c: [1, 2, 3]
  };
  const obj2 = $.extend(true, {}, obj1);
  console.log(obj1.b.f === obj2.b.f); // false
  ```
- JSON.stringify()

  ```js
  // 但是这种方式存在弊端，会忽略undefined、symbol和函数
  const obj2=JSON.parse(JSON.stringify(obj1));
  ```
- 手写循环递归

  ```js
  function deepClone(obj, hash = new WeakMap()) {
    if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
    if (typeof obj !== "object") return obj;
    // 是对象的话就要进行深拷贝
    if (hash.get(obj)) return hash.get(obj);
    let cloneObj = new obj.constructor();
    // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
    hash.set(obj, cloneObj);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 实现一个递归拷贝
        cloneObj[key] = deepClone(obj[key], hash);
      }
    }
    return cloneObj;
  }
  ```

### 总结：

- 浅拷贝是拷贝一层，属性为对象时，浅拷贝是复制，两个对象指向同一个地址
- 深拷贝是递归拷贝深层次，属性为对象时，深拷贝是新开栈，两个对象指向不同的地址



## BOM

![](@public/image/js/004.png)

#### BOM是什么

`BOM` (Browser Object Model)，浏览器对象模型，提供了独立于内容与浏览器窗口进行交互的对象，

其作用就是跟浏览器做一些交互效果,比如如何进行页面的后退，前进，刷新，浏览器的窗口发生变化，滚动条的滚动，以及获取客户的一些信息如：浏览器品牌版本，屏幕分辨率

浏览器的全部内容可以看成 `DOM`，整个浏览器可以看成 `BOM`。区别如下：

![](@public/image/js/005.png)

#### window

`Bom`的核心对象是 `window`，它表示浏览器的一个实例

在浏览器中，`window`对象有双重角色，即是浏览器窗口的一个接口，又是全局对象

因此所有在全局作用域中声明的变量、函数都会变成 `window`对象的属性和方法

```js
var name = 'js每日一题';
function lookName(){
  alert(this.name);
}

console.log(window.name);  //js每日一题
lookName();                //js每日一题
window.lookName();         //js每日一题
```

关于窗口控制方法如下：

- `moveBy(x,y)`：从当前位置水平移动窗体x个像素，垂直移动窗体y个像素，x为负数，将向左移动窗体，y为负数，将向上移动窗体
- `moveTo(x,y)`：移动窗体左上角到相对于屏幕左上角的(x,y)点
- `resizeBy(w,h)`：相对窗体当前的大小，宽度调整w个像素，高度调整h个像素。如果参数为负值，将缩小窗体，反之扩大窗体
- `resizeTo(w,h)`：把窗体宽度调整为w个像素，高度调整为h个像素
- `scrollTo(x,y)`：如果有滚动条，将横向滚动条移动到相对于窗体宽度为x个像素的位置，将纵向滚动条移动到相对于窗体高度为y个像素的位置
- `scrollBy(x,y)`： 如果有滚动条，将横向滚动条向左移动x个像素，将纵向滚动条向下移动y个像素

`window.open()` 既可以导航到一个特定的 `url`，也可以打开一个新的浏览器窗口

如果 `window.open()` 传递了第二个参数，且该参数是已有窗口或者框架的名称，那么就会在目标窗口加载第一个参数指定的URL

```js
window.open('htttp://www.vue3js.cn','topFrame')
==> < a href=" " target="topFrame"></ a>
```

`window.open()` 会返回新窗口的引用，也就是新窗口的 `window` 对象

```js
const myWin = window.open('http://www.vue3js.cn','myWin')
```

`window.close()` 仅用于通过 `window.open()` 打开的窗口

新创建的 `window` 对象有一个 `opener` 属性，该属性指向打开他的原始窗口对象

#### location

location 对象包含有关当前 URL 的信息，是 Window 对象的一个部分，可通过 window.location 属性来访问

例如：

```http
http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents
```

`location`属性描述如下：

| 属性名   | 例子                                                   | 说明                                |
| -------- | ------------------------------------------------------ | ----------------------------------- |
| hash     | "#contents"                                            | utl中#后面的字符，没有则返回空串    |
| host     | www.wrox.com:80                                        | 服务器名称和端口号                  |
| hostname | www.wrox.com                                           | 域名，不带端口号                    |
| href     | http://www.wrox.com:80/WileyCDA/?q=javascript#contents | 完整url                             |
| pathname | "/WileyCDA/"                                           | 服务器下面的文件路径                |
| port     | 80                                                     | url的端口号，没有则为空             |
| protocol | http:                                                  | 使用的协议                          |
| search   | ?q=javascript                                          | url的查询字符串，通常为？后面的内容 |

除了 `hash`之外，只要修改 `location`的一个属性，就会导致页面重新加载新 `URL`

`location.reload()`，此方法可以重新刷新当前页面。这个方法会根据最有效的方式刷新页面，如果页面自上一次请求以来没有改变过，页面就会从浏览器缓存中重新加载

如果要强制从服务器中重新加载，传递一个参数 `true`即可

#### navigator

`navigator` 对象主要用来获取浏览器的属性，区分浏览器类型。属性较多，且兼容性比较复杂

下表列出了 `navigator`对象接口定义的属性和方法：

![](@public/image/js/006.png)

#### screen

保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度

![](@public/image/js/007.png)

#### history

`history`对象主要用来操作浏览器 `URL`的历史记录，可以通过参数向前，向后，或者向指定 `URL`跳转

常用的属性如下：

- `history.go()`

接收一个整数数字或者字符串参数：向最近的一个记录中包含指定字符串的页面跳转，

```js
history.go('maixaofei.com')
```

当参数为整数数字的时候，正数表示向前跳转指定的页面，负数为向后跳转指定的页面

```js
history.go(3) //向前跳转三个记录
history.go(-1) //向后跳转一个记录
```

- `history.forward()`：向前跳转一个页面
- `history.back()`：向后跳转一个页面
- `history.length`：获取历史记录数

## 客户端检测

#### **能力检测**

    能力检测（又称特性检测）即在JavaScript运行时中使用一套简单的检测逻辑，测试浏览器是否支持某种特性。这种方式不要求事先知道特定浏览器的信息，只需检测自己关心的能力是否存在即可。

能力检测的基本模式如下：

```js
if (object.propertyInQuestion) {}// 使用object.propertyInQuestion
```

比如：

    IE5之前的版本中没有document.getElementById()这个DOM方法，但可以通过document.all属性实现同样的功能。

为此，可以进行如下能力检测：

```js
function getElement(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (document.all) {
    	return document.all[id];
    } else {
    	throw new Error("No way to retrieve element! ");
    }
}
```

    这个getElement()函数的目的是根据给定的ID获取元素。
    
    因为标准的方式是使用document.getElementById()，所以首先测试它。如果这个函数存在（不是undefined），那就使用这个方法；否则检测document.all是否存在，如果存在则使用。如果这两个能力都不存在（基本上不可能），则抛出错误说明功能无法实现。
    	能力检测的关键是理解两个重要概念。首先，如前所述，应该先检测最常用的方式。在前面的例子中就是先检测document.getElementById()再检测document.all。

下面来看一个例子，根据不同浏览器独有的行为推断出浏览器的身份。

这里故意没有使用navigator.userAgent属性，后面会讨论它：

```js
class BrowserDetector {
    constructor() {
        // 测试条件编译
        // IE6~10 支持
        this.isIE_Gte6Lte10 = /＊@cc_on! @＊/false;
        // 测试documentMode
        // IE7~11 支持
        this.isIE_Gte7Lte11 = ! ! document.documentMode;
        ocument.documentMode;
        // 测试StyleMedia构造函数
        // Edge 20 及以上版本支持
        this.isEdge_Gte20 = ! ! window.StyleMedia;
        // 测试Firefox专有扩展安装API
        // 所有版本的Firefox都支持
        this.isFirefox_Gte1 = typeof InstallTrigger ! == 'undefined';
        // 测试chrome对象及其webstore属性
        // Opera的某些版本有window.chrome，但没有window.chrome.webstore
        // 所有版本的Chrome都支持
        // 测试StyleMedia构造函数
        // Edge 20 及以上版本支持
        this.isEdge_Gte20 = ! ! window.StyleMedia;
        // 测试Firefox专有扩展安装API
        // 所有版本的Firefox都支持
        this.isFirefox_Gte1 = typeof InstallTrigger ! == 'undefined';
        // 测试chrome对象及其webstore属性
        // Opera的某些版本有window.chrome，但没有window.chrome.webstore
        // 所有版本的Chrome都支持this.isChrome_Gte1 = ! ! window.chrome &&! ! window.chrome.webstore;
        // Safari早期版本会给构造函数的标签符追加"Constructor"字样，如：
        // window.Element.toString(); // [object ElementConstructor]
        // Safari 3~9.1 支持
        this.isSafari_Gte3Lte9_1 = /constructor/i.test(window.Element);
        // 推送通知API暴露在window对象上
        // 使用默认参数值以避免对undefined调用toString()
        // Safari 7.1 及以上版本支持
        this.isSafari_Gte7_1 =(({pushNotification = {}} = {}) =>
        pushNotification.toString() == '[object SafariRemoteNotification]'
        )(window.safari);
        // 测试addons属性
        // Opera 20 及以上版本支持
        this.isOpera_Gte20 = ! ! window.opr &&! ! window.opr.addons;
        }
        isIE() { return this.isIE_Gte6Lte10 || this.isIE_Gte7Lte11}
    	isEdge() {return this.isEdge_Gte20 && !this.isIE()}
    	sFirefox() { return this.isFirefox_Gte1; }
        isChrome() { return this.isChrome_Gte1; }
        isSafari() { return this.isSafari_Gte3Lte9_1 || this.isSafari_Gte7_1}
    	isOpera() {return this.isOpera_Gte20}
 }
  
```

    这个getElement()函数的目的是根据给定的ID获取元素。因为标准的方式是使用document.getElementById()，所以首先测试它。如果这个函数存在（不是undefined），那就使用这个方法；否则检测document.all是否存在，如果存在则使用。如果这两个能力都不存在（基本上不可能），则抛出错误说明功能无法实现。
    	能力检测的关键是理解两个重要概念。首先，如前所述，应该先检测最常用的方式。在前面的例子中就是先检测document.getElementById()再检测document.all。测试最常用的
    
    这个类暴露的通用浏览器检测方法使用了检测浏览器范围的能力测试。随着浏览器的变迁及发展，可以不断调整底层检测逻辑，但主要的API可以保持不变

#### 用户代理检测

    用户代理检测通过浏览器的用户代理字符串确定使用的是什么浏览器。用户代理字符串包含在每个HTTP请求的头部，在JavaScript中可以通过navigator.userAgent访问。在服务器端，常见的做法是根据接收到的用户代理字符串确定浏览器并执行相应操作。而在客户端，用户代理检测被认为是不可靠的，只应该在没有其他选项时再考虑。
    	用户代理字符串最受争议的地方就是，在很长一段时间里，浏览器都通过在用户代理字符串包含错误或误导性信息来欺骗服务器。要理解背后的原因，必须回顾一下自Web出现之后用户代理字符串的历史。
    
    特性检测和用户代理字符串解析是当前常用的两种识别浏览器的方式。

而navigator和screen对象也提供了关于页面所在软件环境的信息。

- **navigator.oscpunavigator.oscpu**

  通常对应用户代理字符串中操作系统/系统架构相关信息。
- **navigator.vendor**
  通常包含浏览器开发商信息。返回这个字符串是浏览器navigator兼容模式的一个功能。
- **navigator.platform**

    通常表示浏览器所在的操作系统。

- **screen.colorDepth和screen.pixelDepthscreen.colorDepth和screen.pixelDepth**

  表示显示器每像素颜色的位深，返回值都一样。
- **screen.orientation**

  这个属性返回一个ScreenOrientation对象，其中包含Screen Orientation API定义的屏幕信息。

  这里面最有意思的属性是angle和type，前者返回相对于默认状态下屏幕的角度，后者返回以下4种枚举值之一：
  ❑ portrait-rimary

  ❑ portrait-econdary

  ❑ landscape-rimary

  ❑ landscape-econdary
  例如，在Chrome移动版中，screen.orientation返回的信息如下：

  ```js
  // 垂直看
  console.log(screen.orientation.type); // portrait-rimary
  console.log(screen.orientation.angle); // 0
  // 向左转console.log(screen.orientation.type); // landscape-rimary
  console.log(screen.orientation.angle); // 90
  // 向右转
  console.log(screen.orientation.type); // landscape-econdary
  console.log(screen.orientation.angle); // 270
  ```

  **案例：**

  ```js
  let client = function() {
      //呈现引擎
      let engine = {
          ie: 0,
          gecko: 0,
          webkit: 0,
          khtml: 0,
          opera: 0,
          // 完整版本号
          ver: null
      };
      // 浏览器
      let browser = {
          // 主要浏览器
          ie: 0,
          firefox: 0,
          safari: 0,
          konq: 0,
          opera: 0,
          chrome: 0,
          // 具体版本号
          ver: null
      };

      // 平台/设备/操作系统
      let system = {
          win: false,
          mac: false,
          x11: false,
          // 移动设备
          iphone: false,
          ipod: false,
          ipad: false,
          ios: false,
          android: false,
          nokiaN: false,
          winMobile: false,
          // 游戏系统
          wii: false,
          ps: false
      };

      // 检测呈现引擎和浏览器
      let ua = navigator.userAgent;
      if (window.opera) {
          engine.ver = browser.ver = window.opera.version();
          engine.opera = browser.opera = parseFloat(engine.ver);
      } else if (/AppleWebKit\/(\S+)/.test(ua)) {
          // \S 匹配一个非空白字符
          engine.ver = RegExp["$1"];
          engine.webkit = parseFloat(engine.ver);
          // 确定是chrome还是safari
          if (/Chrome\/(\S+)/.test(ua)) {
              browser.ver = RegExp["$1"];
              browser.chrome = parentFloat(browser.ver);
          } else if (/Version\/(\S+)/.test(ua)) {
              browser.ver = RegExp["$1"];
              browser.safari = parentFloat(browser.ver);
          } else {
              //近似的确定版本号
              let safariVersion = 1;
              if (engine.webkit < 100) {
                  let safariVersion = 1;
              } else if (engine.webkit < 312) {
                let safariVersion = 1.2;  
              } else if (engine.webkit < 412) {
                let safariVersion = 1.3;
              } else {
                  let safariVersion = 2;
              }

              browser.safari = browser.ver = safariVersion;
          }
      } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
          engine.ver = browser.ver = RegExp["$1"];
          engine.khtml = browser.konq = parseFloat(engine.ver);
      } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
          engine.ver = RegExp["$1"];
          engine.gecko = parseFloat(engine.ver);

          // 确定是不是firefox
          if (/Firefox\/(\S+)/.test(ua)) {
              browser.ver = RegExp["$1"];
              browser.firefox = parseFloat(browser.ver);
          }
      } else if (/MSIE ([^;]+)/.test(ua)) {
          engine.ver = browser.ver = RegExp["$1"];
          engine.ie = browser.ie = parseFloat(engine.ver);
      }

      // 检测浏览器
      browser.ie = engine.ie;
      browser.opera = engine.opera;

      // 检测平台
      let p = navigator.platform;
      system.win = p.indexOf("Win") == 0;
      system.mac = p.indexOf("Mac") == 0;
      system.x11 = (p == "x11") || (p.indexOf("Linux") == 0);

      // 检测window操作系统
      if (system.win) {
          if (/Win(?:dows)?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
              if (RegExp["$1"] == "NT") {
                  switch(RegExp["$2"]) {
                      case "5.0":
                          break;
                      case "5.1":
                          system.win = "XP";
                          break;
                      case "6.0":
                          system.win = "Vista";
                          break;
                      case "6.1":
                          system.win = "7";
                          break;
                      default:
                          system.win = "NT";
                          break;
                  }
              } else if (RegExp["$1"] == "9x") {
                  system.win = "ME";
              } else {
                  system.win = RegExp["$1"];
              }
          }
      }

      // 移动设备
      system.iphone = ua.indexOf("iPhone") > -1;
      system.ipod = ua.indexOf("iPod") > -1;
      system.ipad = ua.indexOf("ipad") > -1;
      system.nokiaN = ua.indexOf("NokiaN") > -1;

      // windows mobile
      if (system.win == "CE") {
          system.winMobile = system.win;
      } else if (system.win == "Ph") {
          if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
              system.win = "Phone";
              system.winMobile = parseFloat(RegExp["$1"]);
          }
      }

      // 检测ios版本
      if (system.mac && ua.indexOf("Mobile") > -1) {
          if (/CPU (?:iphone)?OS (/d+_\d+)/.test(ua)) {
              system.ios = parseFloat(RegExp.$1.replace("_", "."));
          } else {
              system.ios = 2;  //不能正确检测出来，只能猜测
          }
      }

      // 检测android
      if (/Android (\d+\.\d+)/.test(ua)) {
          system.android = parsentFloat(RegExp.$1);
      }

      // 游戏系统
      system.wii = ua.indexOf("Wii") > -1;
      system.ps = /playstation/i.test(ua);

      // 返回检测对象
      return {
          engine: engine,
          browser: browser,
          system: system
      }
  }();
  ```

## DOM

文档对象模型 (DOM) 是 `HTML` 和 `XML` 文档的编程接口

它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容

任何 `HTML`或 `XML`文档都可以用 `DOM`表示为一个由节点构成的层级结构

节点分很多类型，每种类型对应着文档中不同的信息和（或）标记，也都有自己不同的特性、数据和方法，而且与其他类型有某种关系，如下所示：

```html
<html>
    <head>
        <title>Page</title>
    </head>
    <body>
        <p>Hello World!</p >
    </body>
</html>
```

`DOM`像原子包含着亚原子微粒那样，也有很多类型的 `DOM`节点包含着其他类型的节点。接下来我们先看看其中的三种：

```html
<div>
    <p title="title">
        content
    </p >
</div>
```

上述结构中，`div`、`p`就是元素节点，`content`就是文本节点，`title`就是属性节点

#### 操作

日常前端开发，我们都离不开 `DOM`操作

在以前，我们使用 `Jquery`，`zepto`等库来操作 `DOM`，之后在 `vue`，`Angular`，`React`等框架出现后，我们通过操作数据来控制 `DOM`（绝大多数时候），越来越少的去直接操作 `DOM`

但这并不代表原生操作不重要。相反，`DOM`操作才能有助于我们理解框架深层的内容

下面就来分析 `DOM`常见的操作，主要分为：

- ###### 创建节点

  **createElement**

  创建新元素，接受一个参数，即要创建元素的标签名


  ```js
  const divEl = document.createElement("div");
  ```

  **createTextNode**

  创建一个文本节点

  ```js
  const textEl = document.createTextNode("content");
  ```

  **createDocumentFragment**

  用来创建一个文档碎片，它表示一种轻量级的文档，主要是用来存储临时节点，然后把文档碎片的内容一次性添加到 `DOM`中

  ```js
  const fragment = document.createDocumentFragment();
  ```

  当请求把一个 `DocumentFragment` 节点插入文档树时，插入的不是 `DocumentFragment`自身，而是它的所有子孙节点

  **createAttribute**

  创建属性节点，可以是自定义属性

  ```js
  const dataAttribute = document.createAttribute('custom');
  consle.log(dataAttribute);
  ```
- ###### 查询节点

  **querySelector**

  传入任何有效的 `css` 选择器，即可选中单个 `DOM`元素（首个）：


  ```js
  document.querySelector('.element')
  document.querySelector('#element')
  document.querySelector('div')
  document.querySelector('[name="username"]')
  document.querySelector('div + p > span')
  ```

  如果页面上没有指定的元素时，返回 `null`

  **querySelectorAll**

  返回一个包含节点子树内所有与之相匹配的 `Element`节点列表，如果没有相匹配的，则返回一个空节点列表

  ```js
  const notLive = document.querySelectorAll("p");
  ```

  注：该方法返回的是一个 `NodeList`的静态实例，它是一个静态的“快照”，而非“实时”的查询

  **还有以下查询节点：**

  > document.getElementById('id属性值');返回拥有指定id的对象的引用
  > document.getElementsByClassName('class属性值');返回拥有指定class的对象集合
  > document.getElementsByTagName('标签名');返回拥有指定标签名的对象集合
  > document.getElementsByName('name属性值'); 返回拥有指定名称的对象结合
  > document/element.querySelector('CSS选择器');  仅返回第一个匹配的元素
  > document/element.querySelectorAll('CSS选择器');   返回所有匹配的元素
  > document.documentElement;  获取页面中的HTML标签
  > document.body; 获取页面中的BODY标签
  > document.all[''];  获取页面中的所有元素节点的对象集合型
  >

  除此之外，每个 `DOM`元素还有 `parentNode`、`childNodes`、`firstChild`、`lastChild`、`nextSibling`、`previousSibling`属性，关系图如下图所示

  ![](@public/image/js/008.png)
- ###### 更新节点

  **innerHTML**

  不但可以修改一个 `DOM`节点的文本内容，还可以直接通过 `HTML`片段修改 `DOM`节点内部的子树


  ```js
  // 获取<p id="p">...</p >
  var p = document.getElementById('p');
  // 设置文本为abc:
  p.innerHTML = 'ABC'; // <p id="p">ABC</p >
  // 设置HTML:
  p.innerHTML = 'ABC <span style="color:red">RED</span> XYZ';
  // <p>...</p >的内部结构已修改
  ```

  **innerText、textContent**

  自动对字符串进行 `HTML`编码，保证无法设置任何 `HTML`标签

  ```text
  // 获取<p id="p-id">...</p >
  var p = document.getElementById('p-id');
  // 设置文本:
  p.innerText = '<script>alert("Hi")</script>';
  // HTML被自动编码，无法设置一个<script>节点:
  // <p id="p-id"><script>alert("Hi")</script></p >
  ```

  两者的区别在于读取属性时，`innerText`不返回隐藏元素的文本，而 `textContent`返回所有文本

  **style**

  `DOM`节点的 `style`属性对应所有的 `CSS`，可以直接获取或设置。遇到 `-`需要转化为驼峰命名

  ```js
  // 获取<p id="p-id">...</p >
  const p = document.getElementById('p-id');
  // 设置CSS:
  p.style.color = '#ff0000';
  p.style.fontSize = '20px'; // 驼峰命名
  p.style.paddingTop = '2em';
  ```
- ###### 添加节点

  **innerHTML**

  如果这个DOM节点是空的，例如，`<div></div>`，那么，直接使用 `innerHTML = '<span>child</span>'`就可以修改 `DOM`节点的内容，相当于添加了新的 `DOM`节点

  如果这个DOM节点不是空的，那就不能这么做，因为 `innerHTML`会直接替换掉原来的所有子节点

  **appendChild**

  把一个子节点添加到父节点的最后一个子节点

  举个例子


  ```js
  <!-- HTML结构 -->
  <p id="js">JavaScript</p >
  <div id="list">
      <p id="java">Java</p >
      <p id="python">Python</p >
      <p id="scheme">Scheme</p >
  	<p id="js">JavaScript</p >  <!-- 添加元素 -->
  </div>
  ```

  添加一个 `p`元素

  ```js
  const haskell = document.createElement('p');
  haskell.id = 'js';
  haskell.innerText = 'JavaScript';
  const list = document.getElementById('list');
  list.appendChild(js);
  ```

  **insertBefore**

  把子节点插入到指定的位置，使用方法如下：

  ```js
  parentElement.insertBefore(newElement, referenceElement)
  ```

  子节点会插入到 `referenceElement`之前

  **setAttribute**

  在指定元素中添加一个属性节点，如果元素中已有该属性改变属性值

  ```js
  const div = document.getElementById('id')
  div.setAttribute('class', 'white');//第一个参数属性名，第二个参数属性值。
  ```
- ###### 删除节点

  删除一个节点，首先要获得该节点本身以及它的父节点，然后，调用父节点的 `removeChild`把自己删掉


  ```js
  // 拿到待删除节点:
  const self = document.getElementById('to-be-removed');
  // 拿到父节点:
  const parent = self.parentElement;
  // 删除:
  const removed = parent.removeChild(self);
  removed === self; // true
  ```

  删除后的节点虽然不在文档树中了，但其实它还在内存中，可以随时再次被添加到别的位置

#### 相关链接

https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model

## 事件代理

    事件代理，俗地来讲，就是把一个元素响应事件（`click`、`keydown`......）的函数委托到另一个元素

前面讲到，事件流的都会经过三个阶段： 捕获阶段 -> 目标阶段 -> 冒泡阶段，而事件委托就是在冒泡阶段完成

    事件委托，会把一个或者一组元素的事件委托到它的父层或者更外层元素上，真正绑定事件的是外层元素，而不是目标元素
    
    当事件响应到目标元素上时，会通过事件冒泡机制从而触发它的外层元素的绑定事件上，然后在外层元素上去执行函数

下面举个例子：

    比如一个宿舍的同学同时快递到了，一种笨方法就是他们一个个去领取
    
    较优方法就是把这件事情委托给宿舍长，让一个人出去拿好所有快递，然后再根据收件人一一分发给每个同学
    
    在这里，取快递就是一个事件，每个同学指的是需要响应事件的`DOM`元素，而出去统一领取快递的宿舍长就是代理的元素
    
    所以真正绑定事件的是这个元素，按照收件人分发快递的过程就是在事件执行中，需要判断当前响应的事件应该匹配到被代理元素中的哪一个或者哪几个

#### 应用场景

如果我们有一个列表，列表之中有大量的列表项，我们需要在点击列表项的时候响应一个事件

```js
<ul id="list">
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
  ......
  <li>item n</li>
</ul>
```

如果给每个列表项一一都绑定一个函数，那对于内存消耗是非常大的

```js
// 获取目标元素
const lis = document.getElementsByTagName("li")
// 循环遍历绑定事件
for (let i = 0; i < lis.length; i++) {
    lis[i].onclick = function(e){
        console.log(e.target.innerHTML)
    }
}
```

这时候就可以事件委托，把点击事件绑定在父级元素 `ul`上面，然后执行事件的时候再去匹配目标元素

```js
// 给父层元素绑定事件
document.getElementById('list').addEventListener('click', function (e) {
    // 兼容性处理
    var event = e || window.event;
    var target = event.target || event.srcElement;
    // 判断是否匹配目标元素
    if (target.nodeName.toLocaleLowerCase === 'li') {
        console.log('the content is: ', target.innerHTML);
    }
});
```

还有一种场景是上述列表项并不多，我们给每个列表项都绑定了事件

但是如果用户能够随时动态的增加或者去除列表项元素，那么在每一次改变的时候都需要重新给新增的元素绑定事件，给即将删去的元素解绑事件

如果用了事件委托就没有这种麻烦了，因为事件是绑定在父层的，和目标元素的增减是没有关系的，执行到目标元素是在真正响应执行事件函数的过程中去匹配的

举个例子：

下面 `html`结构中，点击 `input`可以动态添加元素

```html
<input type="button" name="" id="btn" value="添加" />
<ul id="ul1">
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
</ul>
```

使用事件委托

```js
const oBtn = document.getElementById("btn");
const oUl = document.getElementById("ul1");
const num = 4;

//事件委托，添加的子元素也有事件
oUl.onclick = function (ev) {
    ev = ev || window.event;
    const target = ev.target || ev.srcElement;
    if (target.nodeName.toLowerCase() == 'li') {
        console.log('the content is: ', target.innerHTML);
    }

};

//添加新节点
oBtn.onclick = function () {
    num++;
    const oLi = document.createElement('li');
    oLi.innerHTML = `item ${num}`;
    oUl.appendChild(oLi);
};
```

可以看到，使用事件委托，在动态绑定事件的情况下是可以减少很多重复工作的

#### 总结

适合事件委托的事件有：`click`，`mousedown`，`mouseup`，`keydown`，`keyup`，`keypress`

从上面应用场景中，我们就可以看到使用事件委托存在两大优点：

- 减少整个页面所需的内存，提升整体性能
- 动态绑定，减少重复工作

但是使用事件委托也是存在局限性：

- `focus`、`blur`这些事件没有事件冒泡机制，所以无法进行委托绑定事件
- `mousemove`、`mouseout`这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托的

如果把所有事件都用事件代理，可能会出现事件误判，即本不该被触发的事件被绑定上了事件
