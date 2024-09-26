## DOM 介绍

## 获取元素

为什么要获取页面元素？

例如：我们想要操作页面上的某部分(显示/隐藏，动画)，需要先获取到该部分对应的元素，再对其进行操作。

### 根据ID获取

```js
document.getElementById(id)
var timer = document.getElementById('time');
console.log(timer); // <div id="time">2019-9-9</div>
console.log(typeof timer); // object
```

### 根据标签名获取元素

```js
语法：document.getElementsByTagName('标签名') 或者 element.getElementsByTagName('标签名') 
var lis = document.getElementsByTagName('li'); // 返回一个集合
console.log(lis);
console.log(lis[0]);
```

注意：getElementsByTagName()获取到是动态集合，即：当页面增加了标签，这个集合中也就增加了元素。

### H5新增获取元素方式

~~~js
var boxs = document.getElementsByClassName("类名") //  返回多个元素  List<Element> 集合
var boxs = document.querySelector("div") // 返回第一个元素对象 <Element>
var boxs = document.querySelectorAll(".div-class") // 返回多个元素 List<Element> 集合
~~~

### 获取特殊元素（body，html）

~~~js
document.body // 返回body元素对象
document.documentElement // 返回html元素对象
~~~

## 事件基础

### 事件三要素

```js

<div>123</div>
<script> 
    // 1. 获取事件源
    var div = document.querySelector('div');
// 2.绑定事件 注册事件 
// 3.添加事件处理程序 
div.onclick = function() {
    console.log('我被选中了');
} 
```

### 常见的鼠标事件

~~~js
onclick // 鼠标点击左键触发
onmouseover // 鼠标经过触发
onmousemove //鼠标移动触发  
onmouseout // 鼠标离开触发
onfocus // 获得鼠标焦点触发
onblur // 失去鼠标焦点触发
onmouseup // 鼠标弹起触发
onmousedown // 鼠标按下触发      
~~~

## 操作元素

### 改变元素内容（获取或设置）

**innerText改变元素内容**

```js
btn.onclick = function() {
    // innerText会去除空格和换行
    // innerText不会识别html
    // div.innerText = '2019-6-6';
    
    // innerHTML会保留空格和换行	
    // innerHTML会识别 html
    div.innerHTML = getDate();
}
function getDate() {
    var date = new Date(); 
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var day = date.getDay();
    return '今天是：' + year + '年' + month + '月' + dates + '日 ' + arr[day];
} 
```

**案例代码**

```js
<body>
    <div></div>
    <p>
        我是文字
        <span>123</span>
    </p>
    <script>
        // innerText 和 innerHTML的区别 
        // 1. innerText 不识别html标签 非标准  去除空格和换行
        var div = document.querySelector('div');
        // div.innerText = '<strong>今天是：</strong> 2019';
        // 2. innerHTML 识别html标签 W3C标准 保留空格和换行的
        div.innerHTML = '<strong>今天是：</strong> 2019';
        // 这两个属性是可读写的  可以获取元素里面的内容
        var p = document.querySelector('p');
        console.log(p.innerText);
        console.log(p.innerHTML);
    </script>
</body>
```

### 常用元素的属性操作

#### 元素属性

~~~js
1. 改变元素内容 innerText、innerHTML
2. src、href
3. id、alt、title
// 表单元素的属性操作
type、value、checked、selected、disabled
表单元素中有一些属性如：disabled、checked、selected，元素对象的这些属性的值是布尔型。
~~~

#### 属性操作

```js
获取属性值：元素对象.属性名
给属性赋值：元素对象.属性名 = 值
var ldh = document.getElementById('ldh'); 
var img = document.querySelector('img'); 
ldh.onclick = function() { 
    img.src = 'images/zxy.jpg';
    img.title = '张学友思密达';
    input.value = '被点击了';
    // btn.disabled = true; 如果想要某个表单被禁用
    // this 指向的是事件函数的调用者 ldh
    this.disabled = true;
} 
```

### 样式属性操作

~~~js
1. element.style // 行内样式操作
2. element.className // 类名样式操作
~~~

#### 方式1：通过操作style属性

**注意: **

1. JS里面的样式采取驼峰命名法 比如 fontSize、backgroundColor
2. Js 修改 style 样式操作，产生的是行内样式，css 权重比较高

**案例代码**

```js
// div.style里面的属性 采取驼峰命名法 
this.style.backgroundColor = 'purple';
this.style.width = '250px';
box.style.display = 'none';
```

#### 方式2：通过操作className属性

~~~js
会直接更改元素的类名，会覆盖原先的类名className
~~~

**案例代码**

```js
<div class="first">文本</div> 
// 1. 使用 element.style 获得修改元素样式  如果样式比较少 或者 功能简单的情况下使用
var test = document.querySelector('div');
test.onclick = function() { 
    this.className = 'first change';
} 
```

## 排他操作

### 排他思想

1. 所有元素全部清除样式（干掉其他人）

2. 给当前元素设置样式 （留下我自己）

3. 注意顺序不能颠倒，首先干掉其他人，再设置自己

```js
    <button>按钮1</button>
    <button>按钮2</button>
    <button>按钮3</button>
    <button>按钮4</button>
    <button>按钮5</button>
    <script>
        // 1. 获取所有按钮元素
        var btns = document.getElementsByTagName('button');
        // btns得到的是伪数组  里面的每一个元素 btns[i]
        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = function() {
                // (1) 我们先把所有的按钮背景颜色去掉  干掉所有人
                for (var i = 0; i < btns.length; i++) {
                    btns[i].style.backgroundColor = '';
                }
                // (2) 然后才让当前的元素背景颜色为pink 留下我自己
                this.style.backgroundColor = 'pink';

            }
        }
    </script>
```

## 自定义属性操作

### 获取属性值

~~~js
element.属性  // 获取内置属性值(元素本身自带的属性)
element.getAttribute('属性'); // 主要获得自定义的属性 我们程序员自定义的属性
~~~

```js
<div id="demo" index="1" class="nav"></div> 
var div = document.querySelector('div');
// 1. 获取元素的属性值
// (1) element.属性
console.log(div.id);
//(2) element.getAttribute('属性') 我们程序员自己添加的属性我们称为自定义属性 index
div.getAttribute('id');
div.getAttribute('index');
```

### 设置属性值

```js
// 2. 设置元素属性值
// (1) element.属性= '值'
div.id = 'test';
div.className = 'navs';
// (2) element.setAttribute('属性', '值');  主要针对于自定义属性
div.setAttribute('index', 2);
div.setAttribute('class', 'footer'); // class 特殊  这里面写的就是
```

### 移出属性

```js
// 3 移除属性 removeAttribute(属性)    
div.removeAttribute('index');
```

### H5自定义属性

自定义属性目的：是为了保存并使用数据。有些数据可以**保存到页面中**而不用保存到数据库中。

但是有些自定义属性很容易引起歧义，不容易判断是元素的内置属性还是自定义属性。

H5给我们新增了自定义属性：

~~~js
H5规定自定义属性data-开头做为属性名并且赋值，
<div data-index="1"></div>
或者使用 JS 设置
element.setAttribute('data-index',2)
~~~

## 节点

### 父级节点

```js
<div class="demo">
    <div class="box">
        <span class="erweima">×</span>
</div>
</div>
<script>
	// 1. 父节点 parentNode
	var erweima = document.querySelector('.erweima');
	// var box = document.querySelector('.box');
	// 得到的是离元素最近的父级节点(亲爸爸) 如果找不到父节点就返回为 null
	console.log(erweima.parentNode);//  <div class="box"><span class="erweima">×</span>
</div>
</script>
```

### 子节点

**所有子节点**

**子元素节点**

```js
<ul>
    <li>我是li</li>
    <li>我是li</li>
    <li>我是li</li>
    <li>我是li</li>
</ul>
<script>
    // DOM 提供的方法（API）获取
    var ul = document.querySelector('ul');
    var lis = ul.querySelectorAll('li');
    // 1. 子节点  childNodes 所有的子节点 包含 元素节点 文本节点等等
    ul.childNodes ;
    ul.childNodes[0].nodeType ;
    ul.childNodes[1].nodeType ;
    // 2. children 获取所有的子元素节点 也是我们实际开发常用的
    console.log(ul.children);
</script>
```

**实际开发中，firstChild 和 lastChild 包含其他节点，操作不方便，而 firstElementChild 和 lastElementChild 这两个方法有兼容性问题，IE9 以上才支持，那么我们如何获取第一个子元素节点或最后一个子元素节点呢？**

```js
    <ol>
        <li>我是li1</li>
        <li>我是li2</li>
        <li>我是li3</li>
    </ol>
    <script>
        var ol = document.querySelector('ol');
        // 1. firstChild 第一个子节点 不管是文本节点还是元素节点
        console.log(ol.firstChild);
        console.log(ol.lastChild);
        // 2. firstElementChild 返回第一个子元素节点 ie9才支持
        console.log(ol.firstElementChild);
        console.log(ol.lastElementChild);
        // 3. 实际开发的写法  既没有兼容性问题又返回第一个子元素
        console.log(ol.children[0]);
        console.log(ol.children[ol.children.length - 1]);
    </script>
```

### 兄弟节点

```js
    <div>我是div</div>
    <span>我是span</span>
    <script>
        var div = document.querySelector('div');
        // 兄弟节点 包含元素节点或者 文本节点等等
        console.log(div.nextSibling);
        console.log(div.previousSibling);
        // 兄弟元素节点 
        console.log(div.nextElementSibling); // <span>我是span</span>
        console.log(div.previousElementSibling); // null
    </script>
```

###  创建节点    添加节点

```js
<ul>
    <li>123</li>
</ul>
<script>
    // 1. 创建节点元素节点
    var li = document.createElement('li');
    // 2. 添加节点 node.appendChild(child)  node 父级  child 是子级 后面追加元素
    var ul = document.querySelector('ul');
    ul.appendChild(li);
    // 3. 添加节点 node.insertBefore(child, 指定元素);
    var lili = document.createElement('li');
    ul.insertBefore(lili, ul.children[0]); 
</script>
```

# day03 - Web APIs

## 1.1. 节点操作

### 1.1.1 删除节点 

```js
<button>delete</button>
<ul>
    <li>熊大</li>
    <li>熊二</li>
    <li>光头强</li>
</ul>
<script>
    // 1.获取元素
    var ul = document.querySelector('ul');
    var btn = document.querySelector('button'); 
    btn.onclick = function() {
        if (ul.children.length == 0) {
            this.disabled = true;
        } else {
            // 删除节点 
            // node.removeChild(child)
            ul.removeChild(ul.children[0]);
        }
    }
</script>
```

### 1.1.3 复制（克隆）节点

```js
<ul>
    <li>1111</li>
    <li>2</li>
    <li>3</li>
</ul>
<script>
    var ul = document.querySelector('ul');
    // 1. node.cloneNode(); 括号为空或者里面是false 浅拷贝 只复制标签不复制里面的内容
    // 2. node.cloneNode(true); 括号为true 深拷贝 复制标签复制里面的内容
    var lili = ul.children[0].cloneNode(true);
    ul.appendChild(lili);
</script>
```

### 1.1.5 创建元素的三种方式

~~~js
document.write()
element .innerHTML
document.createElement()
~~~



### 1.1.6 innerTHML和createElement效率对比

**innerHTML字符串拼接方式（效率低）**

```js
<script>
    function fn() {
        var d1 = +new Date();
        var str = '';
        for (var i = 0; i < 1000; i++) {
            document.body.innerHTML += '<div style="width:100px; height:2px; border:1px solid blue;"></div>';
        }
        var d2 = +new Date();
        console.log(d2 - d1);
    }
    fn();
</script>
```

**createElement方式（效率一般）**

```js
<script>
    function fn() {
        var d1 = +new Date();

        for (var i = 0; i < 1000; i++) {
            var div = document.createElement('div');
            div.style.width = '100px';
            div.style.height = '2px';
            div.style.border = '1px solid red';
            document.body.appendChild(div);
        }
        var d2 = +new Date();
        console.log(d2 - d1);
    }
    fn();
</script>
```

## 1.3. 事件高级

### 1.3.1. 注册事件（2种方式）

- 传统注册方式

  ~~~
  利用 on 开头的事件 onclick
  <button onclick= "alert('hi~")"></button>
  btn.onclick =function(){}
  ~~~

  特点:注册事件的唯一性，**最后注册的处理函数将会覆盖前面注册的处理函数**

- 监听注册方式

  - w3c标准 **推荐方式**
  - addEventListener()它是一个方法
  - IE9 之前的 IE 不支持此方法，可使用 attachEvent() 代替
  - 特点:**同一个元素同一个事件可以注册多个监听器按注册顺序依次执行**

### 1.3.2 事件监听

#### addEventListener()事件监听（IE9以后支持）

~~~js
eventTarget.addEventlistener(type, listener, useCapture)
~~~

- eventTarget: 需要处理的目标元素
- type:事件类型字符串，比如 click、mouseover 注意这里**不要带on**
- listener:事件处理函数，事件发生时，会调用该监听函数
- useCapture:**可选参数**，是一个布尔值，默认是false。学完DOM 事件流后，我们再进一步学习

#### attacheEvent()事件监听（IE12345678支持）

~~~js
eventTarget.attachEvent(eventNamewithon,callback)
~~~

- eventNameWithOn:事件类型字符串，比如onclick、onmouseover，这里**要带 on**
- callback:事件处理函数，当目标触发事件时回调函数被调用

```js
<button>方法监听注册事件</button>
<button>ie9 attachEvent</button>
<script>
 
   // 2. 事件侦听注册事件 addEventListener 
   // 里面的事件类型是字符串 必定加引号 而且不带on 
    btns[0].addEventListener('click', function() {
        alert(22);
    })
    btns[0].addEventListener('click', function() {
            alert(33);
    })
    // 3. attachEvent ie9以前的版本支持
    btns[1].attachEvent('onclick', function() {
        alert(11);
    })
</script>
```

#### 事件监听兼容性解决方案

~~~js
function removeEventlistener(element,eventName,fn){
     //判断当前浏览器是否支持 removeEventListener 方法
	if (element.addEventListener){
	    //第三个参数 默认是fa1se
	    element.addEventListener(eventName,fn); 
	}else if (element.attachEvent){
	    element.attachEvent('on'+eventName,fn);
	}else {
		element['on'+eventName] = fn;
	}
}
~~~

### 1.3.3. 删除事件（解绑事件）

```js
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <script>
        var divs = document.querySelectorAll('div');
        divs[0].onclick = function() {
            alert(11);
            // 1. 传统方式删除事件
            divs[0].onclick = null;
        }
        // 2. removeEventListener 删除事件
        divs[1].addEventListener('click', fn) // 里面的fn 不需要调用加小括号
        function fn() {
            alert(22);
            divs[1].removeEventListener('click', fn);
        }
        // 3. detachEvent
        divs[2].attachEvent('onclick', fn1);

        function fn1() {
            alert(33);
            divs[2].detachEvent('onclick', fn1);
        }
    </script>
```

**删除事件兼容性解决方案 **

~~~js
function removeEventlistener(element,eventName,fn){
     //判断当前浏览器是否支持 removeEventListener 方法
	if (element.removeEventListener){
	    //第三个参数 默认是fa1se
	    element.removeEventListener(eventName,fn); 
	}else if (element.detachEvent){
	    element.detachEvent('on'+eventName,fn);
	}else {
		element['on'+eventName] = null;
	}
}
~~~

### 1.3.4. DOM事件流

> ```
> html中的标签都是相互嵌套的，我们可以将元素想象成一个盒子装一个盒子，document是最外面的大盒子。
> 当你单击一个div时，同时你也单击了div的父元素，甚至整个页面。
> 
> 那么是先执行父元素的单击事件，还是先执行div的单击事件 ？？？
> ```

> 比如：我们给页面中的一个div注册了单击事件，当你单击了div时，也就单击了body，单击了html，单击了document。

- **事件冒泡:** IE 最早提出，事件开始时由最具体的元素接收，然后逐级向上传播到到 DOM 最顶层节点的过程。
- **事件捕获: **网景 最早提出，由 DOM 最顶层节点开始，然后逐级向下传播到到最具体的元素接收的过程。

> ```
> 当时的2大浏览器霸主谁也不服谁！
> IE 提出从目标元素开始，然后一层一层向外接收事件并响应，也就是冒泡型事件流。
> Netscape（网景公司）提出从最外层开始，然后一层一层向内接收事件并响应，也就是捕获型事件流。
> 
> 江湖纷争，武林盟主也脑壳疼！！！
> 
> 最终，w3c 采用折中的方式，平息了战火，制定了统一的标准 —--— 先捕获再冒泡。
> 现代浏览器都遵循了此标准，所以当事件发生时，会经历3个阶段。
> ```

DOM 事件流会经历3个阶段： 

1. 捕获阶段

2. 当前目标阶段

3. 冒泡阶段 

- **实际开发中我们很少使用事件捕获，我们更关注事件冒泡。**
- **有些事件是没有冒泡的，比如 onblur、onfocus、onmouseenter、onmouseleave**
- **事件冒泡有时候会带来麻烦，有时候又会帮助很巧妙的做某些事件，我们后面讲解**
- 个人感觉就是执行顺序的问题

**事件冒泡**

```js
    
<div class="father">
   <div class="son">son盒子</div>
</div>
<script>
      // JS 代码中只能执行 捕获 或者 冒泡 其中的一个阶段。
      // onclick 和 attachEvent（ie） 在冒泡阶段触发
      // 冒泡阶段 如果addEventListener 第三个参数是 false 或者 省略 
      // son -> father ->body -> html -> document
      var son = document.querySelector('.son');
	  // 给son注册单击事件
      son.addEventListener('click', function() {
          alert('son');
      }, false);
	  // 给father注册单击事件
      var father = document.querySelector('.father');
      father.addEventListener('click', function() {
          alert('father');
      }, false);
	  // 给document注册单击事件，省略第3个参数
      document.addEventListener('click', function() {
          alert('document');
      })
</script>
```

**事件捕获**

```js
    <div class="father">
        <div class="son">son盒子</div>
    </div>
    <script>
        // 事件捕获 如果addEventListener() 第三个参数是 true 那么在捕获阶段触发
        // document -> html -> body -> father -> son
         var son = document.querySelector('.son');
		// 给son注册单击事件，第3个参数为true
         son.addEventListener('click', function() {
             alert('son');
         }, true);
         var father = document.querySelector('.father');
		// 给father注册单击事件，第3个参数为true
         father.addEventListener('click', function() {
             alert('father');
         }, true);
		// 给document注册单击事件，第3个参数为true
        document.addEventListener('click', function() {
            alert('document');
        }, true)
    </script>
```

### 1.3.5. 事件对象

#### 什么是事件对象

事件发生后，跟事件相关的一系列信息数据的集合都放到这个对象里面，这个对象就是事件对象。

比如：  

1. 谁绑定了这个事件。

2. 鼠标触发事件的话，会得到鼠标的相关信息，如鼠标位置。

3. 键盘触发事件的话，会得到键盘的相关信息，如按了哪个键。

~~~js
eventTarget.onclick = function(event){
// 这个 event 就是事件对象，我们还喜欢的写成 e或者 evt
}
eventTarget.addEventlistener('click'，function(event){
    // 这个 event 就是事件对象，我们还喜欢的写成e或者 evt
}
eventTarget.addEventListener('click',fn)
function(event){
    // 这个 event 就是事件对象，我们还喜欢的写成 e 或者 evt
}
~~~

#### 事件对象的兼容性处理

事件对象本身的获取存在兼容问题：

1. 标准浏览器中是浏览器给方法传递的参数，只需要定义形参 e 就可以获取到。

2. 在 IE6~8 中，浏览器不会给方法传递参数，如果需要的话，需要到 window.event 中获取查找。

**解决：**

~~~js
e = e || window.event 
只要"||"前面为false, 不管"||"后面是true 还是 false，都返回 "||" 后面的值。
只要"||"前面为true, 不管"||"后面是true 还是 false，都返回 "||" 前面的值。
~~~

```js
    <div>123</div>
    <script>
        var div = document.querySelector('div');
        div.onclick = function(e) {
                // 事件对象
                e = e || window.event;
                console.log(e);
        }
    </script>
```

#### 事件对象的属性和方法

- e.target：		    返回触发事件的对象标准            标准
- e.srcElement：           返回触发事件的对象                   非标准 ie6-8使用
- e.type：                       返回事件的类型 比如click mouseover 不带on
- e.cancelBubble：        该属性阻止冒泡                           非标准 ie6-8使用
- e.returnValue：           该属性 阻止默认事件(默认行为)   非标准 ie6-8使用 比如不让链接跳转
- e.preventDefault()：    该方法 阻止默认事件(默认行为)   标准 比如不让链接跳转
- e.stopPropagation()： 阻止冒泡                                       标准 

#### e.target 和 this 的区别

-  this 是事件绑定的元素（绑定这个事件处理函数的元素） 。

-  e.target 是事件触发的元素。

> ```
> 常情况下terget 和 this是一致的，
> 但有一种情况不同，那就是在事件冒泡时（父子元素有相同事件，单击子元素，父元素的事件处理函数也会被触发执行），
> 	这时候this指向的是父元素，因为它是绑定事件的元素对象，
> 	而target指向的是子元素，因为他是触发事件的那个具体元素对象。
> ```

```js
    <div>123</div>
    <script>
        var div = document.querySelector('div');
        div.addEventListener('click', function(e) {
            // e.target 和 this指向的都是div
            console.log(e.target); // <div>123</div>
            console.log(this);     // <div>123</div>
        });
    </script>
```

事件冒泡下的e.target和this

```js
<ul>
    <li>abc</li>
    <li>abc</li>
    <li>abc</li>
</ul>
<script>
    var ul = document.querySelector('ul');
    ul.addEventListener('click', function(e) {
    	// 我们给ul 绑定了事件  那么this 就指向ul
    	console.log(this);             // <ul>...</ul>
    	console.log(e.currentTarget);  // <ul>...</ul>
    	// e.target 指向我们点击的那个对象 谁触发了这个事件 我们点击的是li e.target 指向的就是li
    	console.log(e.target);         // <li>abc</li>
    });
</script>
```

### 1.3.6 阻止默认行为

> html中一些标签有默认行为，例如a标签被单击后，默认会进行页面跳转。

```js
    <a href="http://www.baidu.com">百度</a>
    <script>
        // 2. 阻止默认行为 让链接不跳转 
        var a = document.querySelector('a');
        a.addEventListener('click', function(e) {
             e.preventDefault(); //  dom 标准写法
        });
        // 3. 传统的注册方式
        a.onclick = function(e) {
            // 普通浏览器 e.preventDefault();  方法
            e.preventDefault();
            // 低版本浏览器 ie678  returnValue  属性
            e.returnValue = false;
            // 我们可以利用return false 也能阻止默认行为 **没有兼容性问题**
            return false;
        }
    </script>
```

### 1.3.7 阻止事件冒泡

事件冒泡本身的特性，会带来的坏处，也会带来的好处。

```js
    <div class="father">
        <div class="son">son儿子</div>
    </div>
    <script>
        var son = document.querySelector('.son');
		// 给son注册单击事件
        son.addEventListener('click', function(e) {
            alert('son');
            e.stopPropagation(); // stop 停止  Propagation 传播
            window.event.cancelBubble = true; // 非标准 cancel 取消 bubble 泡泡
        }, false);

        var father = document.querySelector('.father');
		// 给father注册单击事件
        father.addEventListener('click', function() {
            alert('father');
        }, false);
		// 给document注册单击事件
        document.addEventListener('click', function() {
            alert('document');
        })
    </script>
```

**阻止事件冒泡的兼容性处理**

~~~js
if(e && e.stopPropagation){
	e.stopPropagation();
}else{
	window.event.cancelBubble = true;
}
~~~

### 1.3.8 事件委托

事件冒泡本身的特性，会带来的坏处，也会带来的好处。

#### 什么是事件委托

```
说白了就是，不给子元素注册事件，给父元素注册事件，把处理代码在父元素的事件中执行
```

事件委托也称为事件代理，在 jQuery 里面称为事件委派。

**生活中的代理：**

- 咱们班有100个学生，快递员有100个快递，如果一个的送花费时间较长。同时每个学生领取的时候，也需要排队领取，也花费时间较长?
- **解决方案：**快递员把100个快递，委托给班主任，班主任把这些快递放到办公室，同学们下课自行领取即可。 

#### 事件委托的原理

​	给父元素注册事件，利用事件冒泡，当子元素的事件触发，会冒泡到父元素。

#### 事件委托的作用

- 我们只操作了一次 DOM ，提高了程序的性能。

- 动态新创建的子元素，也拥有事件。

```js
    <ul>
        <li>知否知否，点我应有弹框在手！</li>
        <li>知否知否，点我应有弹框在手！</li>
        <li>知否知否，点我应有弹框在手！</li>
        <li>知否知否，点我应有弹框在手！</li>
        <li>知否知否，点我应有弹框在手！</li>
    </ul>
    <script> 
        var ul = document.querySelector('ul');
        ul.addEventListener('click', function(e) {
            // e.target 这个可以得到我们点击的对象
            e.target.style.backgroundColor = 'pink';
        })
    </script>
```

### 1.4.1 案例：禁止选中文字和禁止右键菜单

1. contextmenu 我们可以禁用右键菜单
2. 禁止选中文字 selectstart

```js
<body>
    我是一段不愿意分享的文字
    <script>
        // 1. contextmenu 我们可以禁用右键菜单 右击菜单
        document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
        })
        // 2. 禁止选中文字 禁止复制文字复制 selectstart
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
        })
    </script>
</body>
```

### 1.4.2 鼠标事件对象

### 1.4.3 获取鼠标在页面的坐标

```js
    <script>
        // 鼠标事件对象 MouseEvent
        document.addEventListener('click', function(e) {
            // 1. client 鼠标在可视区的x和y坐标
            console.log(e.clientX);
            console.log(e.clientY);
            console.log('---------------------');

            // 2. page 鼠标在页面文档的x和y坐标
            console.log(e.pageX);
            console.log(e.pageY);
            console.log('---------------------');

            // 3. screen 鼠标在电脑屏幕的x和y坐标
            console.log(e.screenX);
            console.log(e.screenY);

        })
    </script>
```

### 1.4.4 案例：跟随鼠标的天使

# day04 - Web APIs

## 1.1. 常用的键盘事件

### 1.1.1 键盘事件

~~~
onkeyup     某个键盘按键被松开时触发
onkeydown   某个键盘按键被按下时触发
onkeypress  某个键盘按键被按下时 触发 但是它不识别功能键 比如 ctrl shift 箭头等 
~~~

**注意:**

- 如果使用addEventListener不需要加on
- onkeypress和前面2个的区别是，它不识别功能键，比如左右箭头，shift等。
- 三个事件的执行顺序是:keydown-- keypress --- keyup
- onkeydown和 onkeyup 不区分字母大小写，它能识别所有的键(包括功能键)，我们更多的使用keydown和keyup
- onkeypress 区分字母大小写在我们实际开发中，不识别功能键，但是keyCode属性能区分大小写，返回不同的ASCII值

```js
    <script>
        // 常用的键盘事件
        //1. keyup 按键弹起的时候触发 
        document.addEventListener('keyup', function() {
            console.log('我弹起了');
        })

        //3. keypress 按键按下的时候触发  不能识别功能键 比如 ctrl shift 左右箭头啊
        document.addEventListener('keypress', function() {
                console.log('我按下了press');
        })
        //2. keydown 按键按下的时候触发  能识别功能键 比如 ctrl shift 左右箭头啊
        document.addEventListener('keydown', function() {
                console.log('我按下了down');
        })
        // 4. 三个事件的执行顺序  keydown -- keypress -- keyup
    </script>
```

### 1.1.2 键盘事件对象

~~~js
keyCode    返回该键的 ASCII 值
~~~

**使用keyCode属性判断用户按下哪个键**

```js
<script>
    // 键盘事件对象中的keyCode属性可以得到相应键的ASCII码值
    document.addEventListener('keyup', function(e) {
        console.log('up:' + e.keyCode);
        // 我们可以利用keycode返回的ASCII码值来判断用户按下了那个键
        if (e.keyCode === 65) {
            alert('您按下的a键');
        } else {
            alert('您没有按下a键')
        }
    })
    document.addEventListener('keypress', function(e) {
        // console.log(e);
        console.log('press:' + e.keyCode);
    })
</script>
```

### 1.1.3 案例：模拟京东按键输入内容

当我们按下 s 键， 光标就定位到搜索框（文本框获得焦点）。

> 注意：触发获得焦点事件，可以使用 元素对象.focus()

```js
    <input type="text">
    <script>
        // 获取输入框
        var search = document.querySelector('input');
		// 给document注册keyup事件
        document.addEventListener('keyup', function(e) {
            // 判断keyCode的值
            if (e.keyCode === 83) {
                // 触发输入框的获得焦点事件
                search.focus();
            }
        })
    </script>
```

### 1.1.4 案例：模拟京东快递单号查询

要求：当我们在文本框中输入内容时，文本框上面自动显示大字号的内容。

```js
    <div class="search">
        <div class="con">123</div>
        <input type="text" placeholder="请输入您的快递单号" class="jd">
    </div>
    <script>
        // 获取要操作的元素
        var con = document.querySelector('.con');
        var jd_input = document.querySelector('.jd');
		// 给输入框注册keyup事件
        jd_input.addEventListener('keyup', function() {
				// 判断输入框内容是否为空
                if (this.value == '') {
                    // 为空，隐藏放大提示盒子
                    con.style.display = 'none';
                } else {
                    // 不为空，显示放大提示盒子，设置盒子的内容
                    con.style.display = 'block';
                    con.innerText = this.value;
                }
            })
        // 给输入框注册失去焦点事件，隐藏放大提示盒子
        jd_input.addEventListener('blur', function() {
                con.style.display = 'none';
            })
        // 给输入框注册获得焦点事件
        jd_input.addEventListener('focus', function() {
            // 判断输入框内容是否为空
            if (this.value !== '') {
                // 不为空则显示提示盒子
                con.style.display = 'block';
            }
        })
    </script>
```

## 1.2. BOM

### 1.2.1. 什么是BOM

​	BOM（Browser Object Model）即浏览器对象模型，它提供了独立于内容而与浏览器窗口进行交互的对象，其核心对象是 window。

​	BOM 由一系列相关的对象构成，并且每个对象都提供了很多方法与属性。

​	BOM 缺乏标准，JavaScript 语法的标准化组织是 ECMA，DOM 的标准化组织是 W3C，BOM 最初是Netscape 浏览器标准的一部分。

### 1.2.2. BOM的构成

BOM 比 DOM 更大，它包含 DOM。

- window：
  - document
  - location
  - navigation
  - screen
  - history

### 1.2.3. 顶级对象window

<span style="color:red">window 对象是浏览器的顶级对象，</span>它具有双重角色。

1. 它是 JS 访问浏览器窗口的一个接口。

2. 它是一个全局对象。定义在全局作用域中的变量、函数都会变成 window对象的属性和方法。在调用的时候可以省略 window，前面学习的对话框都属于window对象方法，如 alert()、prompt() 等.

   <span style="color:red"> **注意:**window下的一个特殊属性window.name</span>

~~~js
var num = 10; 
console.log(window.num);
function fn() {
    console.log(11);
} 
window.fn(); 
window.alert(11) 
var name = 10;
console.log(window.name);
~~~

### 1.2.4. window对象的常见事件

#### 页面（窗口）加载事件（2种）

`window.onload` 是 JavaScript 中的一个事件处理器，它在整个 HTML 页面加载完成后触发。它不仅在页面刚刚加载时触发，还在页面上所有的资源（比如图片、样式表等）都加载完成后触发。所以你可以把它理解为整个页面加载完成的事件，而不仅仅是页面刷新。

**第1种**

~~~js
window.onload =function(){}
或者
window.addEventListener("load",function(){});
~~~

window.onload 是窗口 (页面）加载事件，**当文档内容完全加载完成**会触发该事件(包括图像、脚本文件、CSS 文件等), 就调用的处理函数。

**注意：**

1. 有了 window.onload 就可以把 js 代码写到页面元素的上方，因为 onload 是等页面内容全部加载完毕再去执行处理函数。
2. window.onload 传统注册事件方式,只能**写一次**，如果有多个，会**以最后一个window.onload 为准**
3. 如果使用 addeventListener 则**没有限制**

**第2种**

~~~js
document.addEventlistener ('DOMContentLoaded',function (){ } )
~~~

DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash等等。

IE9以上才支持！！！

如果页面的**图片很多的话**, 从用户访问到onload触发可能需要较长的时间，加载的比较慢, 交互效果就不能实现，必然影响用户的体验，此时用 **DOMContentLoaded 事件比较合适。**

```js
    <script>
         // 不执行 以最后一个window.onload 为准
        window.addEventListener('load', function() {
            var btn = document.querySelector('button');
            btn.addEventListener('click', function() {
                alert('点击我');
            })
        })
		// 后执行 
        window.addEventListener('load', function() {
            alert(22);
        })
		// 先执行
        document.addEventListener('DOMContentLoaded', function() {
            alert(33);
        })
    </script>
```

#### 调整窗口大小事件

```js
window.onresize=function(){}
window.addEventListener("resize",function(){});
```

window.onresize 是调整窗口大小加载事件,  当触发时就调用的处理函数。

注意：

1. 只要窗口大小发生像素变化，就会触发这个事件。

2. 我们经常利用这个事件完成响应式布局。 window.innerWidth 当前屏幕的宽度

```js
    <script>
        // 注册页面加载事件
        window.addEventListener('load', function() {
            var div = document.querySelector('div');
        	// 注册调整窗口大小事件
            window.addEventListener('resize', function() {
                // window.innerWidth 获取窗口大小
                console.log('变化了');
                if (window.innerWidth <= 800) {
                    div.style.display = 'none';
                } else {
                    div.style.display = 'block';
                }
            })
        })
    </script>
    <div></div>
```

### 1.2.5. 定时器（两种）

window 对象给我们提供了 2 个非常好用的方法-定时器。

- setTimeout() 

- setInterval()  

#### setTimeout() 炸弹定时器

##### 开启定时器

```js
window.setTimeout(调用函数，[延迟的毫秒数]);
setTimeout()这个调用函数我们也称为回调函数callback
```

**注意：**

1. window 可以省略.
2. 这个调用函数可以<span style="color:red">直接写函数，或者写函数名</span>或者采取字符串'函数名()'三种形式。第三种不推荐
3. 延迟的毫秒数省略默认是0，如果写，必须是毫秒。
4. 因为定时器可能有很多，所以我们经常给定时器赋值一个标识符

> ```
> 普通函数是按照代码顺序直接调用。
> 
> 简单理解： 回调，就是回头调用的意思。上一件事干完，再回头再调用这个函数。
> 例如：定时器中的调用函数，事件处理函数，也是回调函数。
> 
> 以前我们讲的   element.onclick = function(){}   或者  element.addEventListener("click", fn);   里面的 函数也是回调函数。
> 
> ```



```js
    <script>
        // 回调函数是一个匿名函数
         setTimeout(function() {
             console.log('时间到了');
         }, 2000);
        function callback() {
            console.log('爆炸了');
        }
		// 回调函数是一个有名函数
        var timer1 = setTimeout(callback, 3000);
        var timer2 = setTimeout(callback, 5000);
        // setTimeout('callback()', 3000); // 我们不提倡这个写法
    </script>
```

##### 案例：5秒后关闭广告

```js
<body>
    <img src="images/ad.jpg" alt="" class="ad">
    <script>
        // 获取要操作的元素
        var ad = document.querySelector('.ad');
		// 开启定时器
        setTimeout(function() {
            ad.style.display = 'none';
        }, 5000);
    </script>
</body>
```

##### 停止定时器

~~~js
clearTimeout()方法取消了先前通过调用 setTimeout()建立的定时器。

注意:
1. window 可以省略。
2.里面的参数就是定时器的标识符
~~~

```js
    <button>点击停止定时器</button>
    <script>
        var btn = document.querySelector('button');
		// 开启定时器
        var timer = setTimeout(function() {
            console.log('爆炸了');
        }, 5000);
		// 给按钮注册单击事件
        btn.addEventListener('click', function() {
            // 停止定时器
            clearTimeout(timer);
        })
    </script>
```



#### setInterval() 闹钟定时器

##### 开启定时器

```js
    <script>
        // 1. setInterval 
        setInterval(function() {
            console.log('继续输出');
        }, 1000);
    </script>
```

##### 案例：倒计时

```js
    <div>
        <span class="hour">1</span>
        <span class="minute">2</span>
        <span class="second">3</span>
    </div>
    <script>
        // 1. 获取元素（时分秒盒子） 
        var hour = document.querySelector('.hour'); // 小时的黑色盒子
        var minute = document.querySelector('.minute'); // 分钟的黑色盒子
        var second = document.querySelector('.second'); // 秒数的黑色盒子
        var inputTime = +new Date('2019-5-1 18:00:00'); // 返回的是用户输入时间总的毫秒数

        countDown(); // 我们先调用一次这个函数，防止第一次刷新页面有空白 

        // 2. 开启定时器
        setInterval(countDown, 1000);
		
        function countDown() {
            var nowTime = +new Date(); // 返回的是当前时间总的毫秒数
            var times = (inputTime - nowTime) / 1000; // times是剩余时间总的秒数 
            var h = parseInt(times / 60 / 60 % 24); //时
            h = h < 10 ? '0' + h : h;
            hour.innerHTML = h; // 把剩余的小时给 小时黑色盒子
            var m = parseInt(times / 60 % 60); // 分
            m = m < 10 ? '0' + m : m;
            minute.innerHTML = m;
            var s = parseInt(times % 60); // 当前的秒
            s = s < 10 ? '0' + s : s;
            second.innerHTML = s;
        }
    </script>
```

##### 停止定时器

~~~js
window.clearInterval(timer);
~~~

#### 案例：发送短信倒计时

点击按钮后，该按钮60秒之内不能再次点击，防止重复发送短信。

```js
    手机号码： <input type="number"> <button>发送</button>
    <script>
        var btn = document.querySelector('button');
		// 全局变量，定义剩下的秒数
        var time = 3; 
		// 注册单击事件
        btn.addEventListener('click', function() {
            // 禁用按钮
            btn.disabled = true;
            // 开启定时器
            var timer = setInterval(function() {
                // 判断剩余秒数
                if (time == 0) {
                    // 清除定时器和复原按钮
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.innerHTML = '发送';
                } else {
                    btn.innerHTML = '还剩下' + time + '秒';
                    time--;
                }
            }, 1000);
        });
    </script>
```



### 1.2.6. this指向问题

​	this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，一般情况下this的最终指向的是那个调用它的对象。

现阶段，我们先了解一下几个this指向

```js
    <button>点击</button>
    <script>
        // this 指向问题 一般情况下this的最终指向的是那个调用它的对象
        // 1. 全局作用域或者普通函数中this指向全局对象window（ 注意定时器里面的this指向window）
        console.log(this);
		// 这是个方法 下面的是一个 类
        function fn() {
            console.log(this);
        }
        window.fn();
        window.setTimeout(function() {
            console.log(this);
        }, 1000);
        // 2. 方法调用中谁调用this指向谁
        var o = {
            sayHi: function() {
                console.log(this); // this指向的是 o 这个对象
            }
        }
        o.sayHi();
        var btn = document.querySelector('button');
        btn.addEventListener('click', function() {
                console.log(this); // 事件处理函数中的this指向的是btn这个按钮对象
            })

        // 3. 构造函数中this指向构造函数的实例
	    // 这是个类 上面的是一个 方法
        function Fun() {
            console.log(this); // this 指向的是fun 实例对象
        }
        var fun = new Fun();
    </script>
```



### 1.2.7. location对象

#### 什么是 location 对象

window对象提供了一个location属性用于获取或设置窗体的 URL，获取地址，并且可以用于解析 URL。因为这个属性**返回的是一个对象**，所以我们将这个属性也称为location 对象。

#### location 对象的属性

```js
location.href        获取或者设置 整个URL
location.assign		记录浏览历史，所以可以实现后退功能 
location.replace	因为不记录历史，所以不能后退页面
location.host       返回主机(域名)www.itheima.com
location.port        返回端口号 如果未写返回 空字符串
location.pathname    返回路径
location.search      返回参数
location.hash       返回片段 #后面内容 常见于链接 锚点
```

<span style="color:red">**重点记住: href 和 search**</span>

#### 案例：5分钟自动跳转页面

```js
    <button>点击</button>
    <div></div>
    <script>
        var btn = document.querySelector('button');
        var div = document.querySelector('div');
        btn.addEventListener('click', function() {
            // console.log(location.href);
            location.href = 'www.baidu.com';
        })
        var timer = 5;
        setInterval(function() {
            if (timer == 0) {
                location.href = 'http://www.itcast.cn';
            } else {
                div.innerHTML = '您将在' + timer + '秒钟之后跳转到首页';
                timer--;
            }
        }, 1000);
    </script>
```

#### 案例：获取URL参数

获取URL <span style="color: skyblue">**参数**</span>

```js
    <div></div>
	<script>
        console.log(location.search); // ?uname=andy
        // 1.先去掉？  substr('起始的位置'，截取几个字符);
        var params = location.search.substr(1); // uname=andy
        console.log(params);
        // 2. 利用=把字符串分割为数组 split('=');
        var arr = params.split('=');
        console.log(arr); // ["uname", "ANDY"]
        var div = document.querySelector('div');
        // 3.把数据写入div中
        div.innerHTML = arr[1] + '欢迎您';
    </script>
```

#### location对象的常见方法

```js
    <button>点击</button>
    <script>
        var btn = document.querySelector('button');
        btn.addEventListener('click', function() {
            // 记录浏览历史，所以可以实现后退功能
            // 跟 href 一样，可以跳转页面(也称为重定向页面)
            location.assign('www.baidu.com');
            // 不记录浏览历史，所以不可以实现后退功能
            // 替换当前页面，因为不记录历史，所以不能后退页面
            location.replace('http://www.itcast.cn');
            // 重新加载页面，相当于刷新按钮或者 f5 如果参数为true 强制刷新 ctrl+f5
            location.reload(true);
        })
    </script>
```

### 1.2.8. navigator对象

navigator 对象包含有关浏览器的信息，它有很多属性，我们最常用的是**userAgent**，该属性可以返回由客户机发送服务器的 user-agent 头部的值。

判断用户哪个终端打开页面，实现跳转

```js
if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    window.location.href = "";     //手机
 } else {
    window.location.href = "";     //电脑
 }




<div  
            class="choose-quick-select">
          <div class="select-choose">
            <el-button class="button-select">
              请选择快捷查询
            </el-button>
          </div>
          <div
              v-if="selectContentBox"
              class="select-content-box">
            <el-card style="max-width: 380px">
              <div v-if="selectContentItem===null">
                <el-empty></el-empty>
              </div>
              <div v-else>
                22222
              </div>
            </el-card>
          </div>
        </div>点击按钮button-select会显示selectContentBox元素，点击selectContentBox元素之外的任何位置，selectContentBox消失




















```

### 1.2.9 history对象

window对象给我们提供了一个 history对象，与浏览器历史记录进行交互。该对象包含用户（在浏览器窗口中）访问过的URL。

~~~js
back()     可以后退功能
forward()  前进功能
go(参数)   前进后退功能 参数如果是1 前进1个页面 如果是-1 后退1个页面
~~~

history对象一般在实际开发中比较少用，但是会在一些 OA 办公系统中见到。

## 1.3. JS执行机制

以下代码执行的结果是什么？

```js
 console.log(1);
 setTimeout(function () {
     console.log(3);
 }, 1000);
 console.log(2);
```

以下代码执行的结果是什么？

```js
 console.log(1);
 setTimeout(function () {
     console.log(3);
 }, 0);
 console.log(2);
```



### 1.3.1 JS 是单线程

```js
	单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。
	这样所导致的问题是： 如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞的感觉。
```

