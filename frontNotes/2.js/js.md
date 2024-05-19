# 初始JavaScript

1. #### **DOM——文档对象模型**

   	**文档对象模型**（DocumentObject Model，简称DOM），是W3C组织推荐的处理可扩展标记语言的标准编程接口。通过 DOM 提供的接口可以对页面上的各种元素进行操作（大小、位置、颜色等）

2. #### **BOM——浏览器对象模型**

   	**浏览器对象模型**(Browser Object Model，简称BOM) 是指浏览器对象模型，它提供了独立于内容的、可以与浏览器窗口进行互动的对象结构。通过BOM可以操作浏览器窗口，比如弹出框、控制浏览器跳转、获取分辨率等。

### 3.6 JS 初体验

	JS 有3种书写位置，分别为行内、内嵌和外部。

1. 行内式

   ```html
   <input type="button" value="点我试试" onclick="alert('Hello World')" />
   ```

2. 内嵌式

   ```html
   <script>
       alert('Hello  World~!');
   </script>
   ```

3. 外部JS文件

   ```html
   <script src="my.js"></script>
   ```


## 4 - JavaScript注释

### 4.1  单行注释

	// 用来注释单行文字（  快捷键   ctrl  +  /   ）

### 4.2 多行注释

多行注释的注释方式如下：

```
/* */  用来注释多行文字（ 默认快捷键  alt +  shift  + a ） 
```


快捷键修改为：   ctrl + shift  +  /

## JavaScript输入输出语句

为了方便信息的输入输出，JS中提供了一些输入输出语句，其常用的语句如下：

| 方法                | 说明                           |
| ------------------- | ------------------------------ |
| alert(msg)          | 浏览器弹出警示框               |
| console.log(msg)    | 浏览器控制台打印输出信息       |
| prompt(info)        | 浏览器弹出输入框，用户可以输入 |
| document.write(arr) | 界面输出                       |

## 变量的概念

### 变量语法扩展

- 更新变量

  一个变量被重新复赋值后，它原有的值就会被覆盖，变量值将以最后一次赋的值为准。

  ```js
  var age = 18;
  age = 81;   // 最后的结果就是81因为18 被覆盖掉了          
  ```

- 同时声明多个变量

  只需要写一个 var， 多个变量名之间使用英文逗号隔开。

  ```js
  var age = 10,  name = 'zs', sex = 2;       
  ```

### 变量命名规范

规则：同JAVA   遵守驼峰命名法。首字母小写，后面单词的首字母需要大写。myFirstName

## 数据类型

### 数据类型简介

```js
var age = 10;        // 这是一个数字型
var areYouOk = '是的';   // 这是一个字符串     
```

- 数据类型的分类

  	JS 把数据类型分为两类：
  	简单数据类型 （Number,String,Boolean,Undefined,Null）
  		复杂数据类型 （object)	


JavaScript 中的简单数据类型及其说明如下：

![](images\图片16.png)

- 数字型 Number

  ​		JavaScript 数字类型既可以保存整数，也可以保存小数(浮点数）。  

  ```js
  var age = 21;       // 整数
  var Age = 21.3747;  // 小数     
  ```

  1. 数字型进制

     最常见的进制有二进制、八进制、十进制、十六进制。

     ```js
       // 1.八进制数字序列范围：0~7
      var num1 = 07;   // 对应十进制的7
      var num2 = 019;  // 对应十进制的19
      var num3 = 08;   // 对应十进制的8
       // 2.十六进制数字序列范围：0~9以及A~F
      var num = 0xA;   
     ```

     现阶段我们只需要记住，在JS中八进制前面加0，十六进制前面加 0x  

  2. 数字型范围

     JavaScript中数值的最大和最小值

     - 最大值：Number.MAX_VALUE，这个值为： 1.7976931348623157e+308

     - 最小值：Number.MIN_VALUE，这个值为：5e-32

3. 数字型三个特殊值

   - Infinity ，代表无穷大，大于任何数值

   - -Infinity ，代表无穷小，小于任何数值

   - NaN ，Not a number，代表一个非数值

  4. isNaN

     用来判断一个变量是否为非数字的类型，返回 true 或者 false

   ```js
var usrAge = 21;
var isOk = isNaN(userAge);
console.log(isNum);          // false ，21 不是一个非数字
var usrName = "andy";
console.log(isNaN(userName));// true ，"andy"是一个非数字
   ```

5. 字符串转义符

| 转义符 | 解释说明                          |
| ------ | --------------------------------- |
| \n     | 换行符，n   是   newline   的意思 |
| \ \    | 斜杠   \                          |
| \'     | '   单引号                        |
| \"     | ”双引号                           |
| \t     | tab  缩进                         |
| \b     | 空格 ，b   是   blank  的意思     |

1. 字符串长度

   ```js
   var strMsg = "我是帅气多金的程序猿！";
   alert(strMsg.length); // 显示 11
   ```

2. 字符串拼接

   ```js
   //1.1 字符串 "相加"
   alert('hello' + ' ' + 'world'); // hello world
   //1.2 数值字符串 "相加"
   alert('100' + '100'); // 100100
   //1.3 数值字符串 + 数值
   alert('11' + 12);     // 1112 
   alert(11 + 12);     // 23 
   ```


- 布尔型Boolean

  ​		布尔类型有两个值：true 和 false ，其中 true 表示真（对），而 false 表示假（错）。

  ​		布尔型和数字型相加的时候， true 的值为 1 ，false 的值为 0。

  ```js
  console.log(true + 1);  // 2
  console.log(false + 1); // 1
  ```

- Undefined 和 Null

  ​		一个声明后没有被赋值的变量会有一个默认值undefined ( 如果进行相连或者相加时，注意结果）

  ```js
  var variable;
  console.log(variable);           // undefined
  console.log('你好' + variable);  // 你好undefined
  console.log(11 + variable);     // NaN
  console.log(true + variable);   //  NaN
  ```

  ​		一个声明变量给 null 值，里面存的值为空（学习对象时，我们继续研究null)

  ```js
  var vari = null;
  console.log('你好' + vari); // 你好null
  console.log(11 + vari);     // 11
  console.log(true + vari);   // 1
  ```

### 获取变量数据类型

- 获取检测变量的数据类型

  ​		typeof 可用来获取检测变量的数据类型

  ```js
  var num = 18;
  console.log(typeof num) // 结果 number      
  ```

  ​		不同类型的返回值

  ![](images\图片18.png)

### 数据类型转换

- 转换为字符串

  ![](images\图片19.png)

- 转换为数字型（重点）

  ![](images\图片20.png)

  - 注意 parseInt 和 parseFloat 单词的大小写，这2个是重点

- 转换为布尔型

  ![](images\图片21.png)

  - 代表空、否定的值会被转换为 false  ，如 ''、0、NaN、null、undefined  

  - 其余值都会被转换为 true

    ```js
    console.log(Boolean('')); // false
    console.log(Boolean(0)); // false
    console.log(Boolean(NaN)); // false
    console.log(Boolean(null)); // false
    console.log(Boolean(undefined)); // false
    console.log(Boolean('小白')); // true
    console.log(Boolean(12)); // true
    ```

## 函数

#### 写法

~~~js
function fn() {
      console.log('我是函数表达式');
}
var fun = fn(aru) {
            console.log('我是函数表达式');
            console.log(aru);
}
~~~

#### arguments

~~~js
function fn() {
     for (var i = 0; i < arguments.length; i++) {
          console.log(arguments[i]); // 1, 2, 3, 4, 5
     }
}
fn(1, 2, 3, 4, 5);
~~~
