### 初识 Node.js

① 浏览器是 JavaScript 的前端运行环境。 

② Node.js 是 JavaScript 的后端运行环境。 

③ Node.js 中无法调用 DOM 和 BOM 等 浏览器内置 API

### fs 文件系统模块

- fs.readFile() 方法，用来读取指定文件中的内容
- fs.writeFile() 方法，用来向指定的文件中写入内容

```js
const fs = require('fs')
```

#### 读取指定文件中的内容

~~~js
fs.readFile(path,[options],callback)
~~~

- 参数1：必选参数，字符串，表示文件的路径。 
- 参数2：可选参数，表示以什么编码格式来读取文件。 
- 参数3：必选参数，文件读取完成后，通过回调函数拿到读取的结果。

