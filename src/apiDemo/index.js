// const path = require('path')
// const fs = require('fs')
// const { parse } = require('@babel/parser')
// const traverse = require('@babel/traverse').default
// const generator = require('@babel/generator').default

// const sourceCode = fs.readFileSync(path.resolve(__dirname, './sourceCode.js'), 'utf-8')

// const ast = parse(sourceCode)
// // console.log(ast)

// traverse(ast, {
//   Identifier(path) {
//     const node = path.node
//     if(node.name) {
//       node.name = 'afterPluginVal'
//     }
//   } 
// })

// const { code } = generator(ast)

// if(code) {
//   fs.writeFileSync(path.resolve(__dirname, './targetCode.js'), code, (err) => {
//     console.log(err)
//   })
// }

const fs = require('fs')
const path = require('path')
const { transformFileSync } = require('@babel/core')
const simplePlugin = require('./simplePlugin')

const { code } = transformFileSync(path.resolve(__dirname, './sourceCode.js'), {
  // 执行顺序是从前往后执行的
  plugins: [
    // 如果需要给插件传参，要将写法改为数组形式
    [simplePlugin, {
      test: 'abc'
    }]
  ],
  parserOpts: {
    tokens: true
  }
})

if(code) {
  fs.writeFileSync(path.resolve(__dirname, './coreTagetCode.js'), code, (err) => {
    console.log(err)
  })
}