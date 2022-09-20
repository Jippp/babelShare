## babel

---

参考链接：
- [AST explorer](https://astexplorer.net/)
- [babel](https://babeljs.io/)
- [esprima](https://github.com/jquery/esprima)
- [estree](https://github.com/estree/estree)
- [espree](https://github.com/eslint/espree)
- [acorn](https://github.com/acornjs/acorn)
- [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)

### 简介Babel

Babel是一个JavaScript compiler

`Babel`一开始叫做`6To5`，就是将ES6代码转为ES5，用于将高版本代码转为低版本可以兼容的代码。
随着后面`ES标准`不断发展，出现了`ES7/ES8`这些，所以改名为`Babel`。

#### 解析器Parser

解释器Parser和编译器Compiler的区别：编译会转成其他语言，解释器则不会。

js的解释器会通过词法分析、语法分析，将代码转为AST。

Babel内置的Parser是基于`acorn`拓展而来的，叫做`babylon`

简单介绍一下几个JS Parser：

- esprima：是基于Firefox的js引擎`SpiderMonkey`内部规定的AST标准实现的，后来将这个AST标准命名为`ESTree`标准
> github描述如下： Once upon a time, an unsuspecting Mozilla engineer created an API in Firefox that exposed the SpiderMonkey engine's JavaScript parser as a JavaScript API. Said engineer documented the format it produced, and this format caught on as a lingua franca for tools that manipulate JavaScript source code.

- espree：后面随着ES发展越来越快，esprima的更新速度跟不上了之后，eslint在esprima上扩展而来的，遵循的也是`ESTree`标准

- acorn：轻量、快速且支持插件化的js解析器。现在大部分用到js解析器的基本上都是这个，比如espree后面也基于acorn重构了
> github描述如下：A tiny, fast JavaScript parser, written completely in JavaScript.


#### Babel的主要用法

1. 转换高版本语法：用来将代码中的`esnext`的新语法、ts、flow等语法转为当前浏览器可以识别解析的代码实现
2. polyfill：让目标环境可以支持原本不支持的api或者语法
3. 源代码转换：可以用来做一些特殊用途比如代码静态分析

> polyfill是用来抹平不同浏览器之间的差距的，比如一些虽然已经成为了标准但是某些低版本浏览器并没有实现，这种时候就需要polyfill来抹平差距

#### Babel的流程

1. 代码分析阶段Parse：首先会通过词法分析将代码转为一系列的token，然后再通过语法分析将这些tokens转为AST
2. 转化阶段Transform：然后遍历代码分析后得到的AST，进行一系列想要的操作：比如对AST节点增删改之类的，生成一颗新的AST
3. 生成阶段Generate：将转化后的AST再经过语法分析，将Parse阶段省略掉的一些如运算符之类的添加回来，转为目标代码输出

---

### Babel如何工作

Babel提供了一些库，可以通过这些库来完成Babel的工作。

```bash
npm i @babel/parser @babel/traverse @babel/generator -D
```

- @babel/parser
  - 这个库可以将源代码转为AST，完成Parse阶段的工作
- @babel/traverse
  - 这个库可以对AST进行操作，完成对AST指定内容的修改
- @babel/generator
  - 这个库可以对AST转为语法分析再转成JS代码

> 这些库的具体用法可以去官网看，这里不做详细介绍
> 这里只对这些库做一个大致的介绍

#### Parse阶段

```js
const { parse } = require('@babel/parser')
// EMS
// import { parse } from '@babel/parser'

const sourceCode = 'const val = "test value!"'

const ast = parse(ast)
```

```ts
interface File  {
  type: "File";
  program: Program;
  comments?: Array<CommentBlock | CommentLine> | null;
  tokens?: Array<any> | null;
}

function parse(
  input: string,
  options?: ParserOptions
): File;
```

在这个阶段做了这些事情：
- 通过词法分析将字符串源代码转为tokens
- 对tokens进行语法分析转为ast

#### Traverse阶段

> @babel/traverse这个库是以export.default方式导出的，所以用commonJS引用时需要注意一下

```js
const traverser = require('@babel/traverse').default;
// esm
// import traverser from '@babel/traverse'

// ...parse
traverser(ast, {
  // ast node
  Identifier(path) {
    // do something
  }
})
```

这个阶段对ast进行遍历，然后通过配置一系列的visitor对指定的ast节点做增删改之类的操作

#### enter和exit

可以将这两个方法简单的认为是AST遍历时的“生命周期”。
在遍历AST时，如果能和指定的节点匹配上就会先执行`enter函数`，然后再递归遍历子节点，最后执行`exit函数`。

```js
// 这里贴上the-super-tiny-compiler内的代码来解释
function traverseNode(node, parent) {
  let methods = visitor[node.type];

  if (methods && methods.enter) {
    methods.enter(node, parent);
  }

  switch (node.type) {
    // do something here.
  }

  if (methods && methods.exit) {
    methods.exit(node, parent);
  }
}

```

所以指定的节点可以是一个函数，也可以是一个对象：
- 函数：相当于只有enter函数
- 对象：可以配置enter和exit函数

`traverser`函数的第二个参数：

```js
{
  Identifier(path) {
    // ...
  }
}

{
  Identifier： {
    enter(path) {
      // ...
    }
    exit(path) {
      // ...
    }
  }
}
```

##### 访问者模式

在遍历ast节点时，如果和visitor指定的节点类型匹配上了，就会执行该函数来处理节点，这使用了`访问者模式`

访问者模式：表示一个作用于某对象内各个元素的操作，可以在不改变对象结构的前提下去定义作用于其内部各个元素的新操作。

通常在一些对象结构基本不改变，但是操作内部元素的逻辑却需要经常改变时使用，可以通过访问者模式将逻辑和对象结构分离开来，让这二者可以独立维护。

访问者模式大致分为三个部分：对象结构、对象内部元素、访问者

大致模拟的[代码](./visitor.js)

##### babel中的访问者模式

对象结构就是AST，生成之后结构基本不会改变，通过访问者模式可以将数据和逻辑分离
元素就是遍历AST时的各种Node
访问者就是我们传入的各个函数

在`traverse函数`中将元素和访问者关联起来，实现在遍历到具体的`AST Node`时执行相应的Visitor函数

#### Generator阶段

```js
const generator = require('@babel/generator').default
// esm
// import generator from('@babel/generator')

// ...parse
// ...traverse

generator(ast)
```

该阶段对进行操作之后的ast遍历，加上之前`parse`阶段转化时省略掉的一些运算符(如= 空格)等

---

### babel插件

如果想要自己写一个babel插件的话，上面这种先通过parse转成ast，然后再traverse操作ast，最后在generator成代码的话就有些太过于麻烦了。好在babel为我们提供了一个`@babel/core`的包，这个包基于之前说的几种包提供了一个完成的编译流程，我们使用时只需要配置一些参数就可以完成完整的编译过程了。

`@babel/core`这个包提供了三种不同的起点：从源代码字符串、源代码文件、ast开始
具体的用法可以参考[官方文档](https://babeljs.io/docs/en/babel-core)

这里简单介绍一下Babel插件的写法：
```js
module.exports = (apis, options, dirname) => {
  console.log(options, dirname)
  return {
    visitor: {
      Identifier(path) {
        const node = path.node
        if(node.name) {
          node.name = 'afterPluginVal'
        }
      } 
    }
  }
}
```

#### 执行顺序

`plugins`的执行顺序是从前往后执行的，`presets`的执行顺序是从后往前执行的

> presets执行顺序反过来的原因babel官网介绍如下：This was mostly for ensuring backwards compatibility, since most users listed "es2015" before "stage-0".
> 确保兼容性的，防止某些presets兼容性有问题，后执行的可以兜底

`plugins`和`presets`混用时会执行`plugins`后执行`presets`

```js
{
  plugins: [a, b],
  presets: [c, d]
}
```
比如配置了这些plugins和presets，执行顺序：a -> b -> d -> c

测试顺序代码参考[这里](./src/apiDemo/index.js)

#### 自定义presets

`presets`就是`plugins`的集合，也就是说多个`plugins`组成了`presets`

自定义presets的写法如下：
```js
const somePlugin = require('xxx')

module.exports = {
  plugins: [somePlugin]
}

```

---

### 案例

之前说babel可以做很多事情，这里写了一个简单的`代码高亮的案例`，代码在[这里](./src/demo/)

演示效果如下：
![gif演示](./src/demo/demo.gif)
