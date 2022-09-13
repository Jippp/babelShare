const path = require('path')
const fs = require('fs')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const sourceCode = fs.readFileSync(path.resolve(__dirname, './sourceCode.js'), 'utf-8')

const ast = parse(sourceCode)
// console.log(ast)

traverse(ast, {
  Identifier(path) {
    const node = path.node
    if(node.name) {
      node.name = 'afterPluginVal'
    }
  } 
})

const { code } = generator(ast)

if(code) {
  fs.writeFileSync(path.resolve(__dirname, './targetCode.js'), code, (err) => {
    console.log(err)
  })
}