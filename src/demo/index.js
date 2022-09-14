/*
  一些配置规则：

*/
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

import './style.css';

/**
 * 转化源代码 添加颜色
 * @param {*} sourceCode 
 * @returns 
 */
const generator = (sourceCode) => {
  // const sourceCode = "const name = 'jippp'";
  const targetCode = [];
  
  const ast = parse(sourceCode);
  
  traverse(ast, {
    VariableDeclaration(path) {
      if (path.node.kind === 'const') {
        targetCode.push(`<span class='const'>const</span>`);
      }
    },
    Identifier(path) {
      targetCode.push(`<span class='variable'>${path.node.name}</span>`);
    },
    StringLiteral(path) {
      targetCode.push(`<span class='symbol'>=</span>`);
      targetCode.push(`<span class='value'>${path.node.value};</span>`);
    },
    NumericLiteral(path) {
      targetCode.push(`<span class='symbol'>=</span>`);
      targetCode.push(`<span class='number'>${path.node.value};</span>`);
    }
  });

  return targetCode

}

/**
 * 渲染
 * @param {*} sourceCode 
 */
const render = (sourceCode) => {
  // TODO 错误处理
  let targetCode = []
  try {
    targetCode = generator(sourceCode)
  }catch(err) {
    // console.log(err)
    targetCode.push()
  }

  if(targetCode.length) {
    observer.disconnect()
    // const ele = document.createElement('div')
    // ele.innerHTML = targetCode.join('')
    // app.appendChild(ele)

    app.innerHTML = `<div>${targetCode.join('')}</div>`
    runObserver()
  }

}

// const targetCode = generator(`const name = 123`)

const app = document.getElementById('app')
const sourceCodeList = []

/**
 * 监听器：对输入进行监听得到源代码
 */
const observer = new MutationObserver((mutationList) => {
  console.log(mutationList)
  const list = mutationList[0]

  sourceCodeList.splice(0)
  // dom增加 删除
  if(list.type === 'childList') {
    const addNodes = list.addedNodes, removeNodes = list.removedNodes;
    const addLen = addNodes.length
    const removeLen = removeNodes.length

    if(addLen) {
      for(let i = 0; i < addLen; i++) {
        if(addNodes[i].nodeType === 1) {
          // sourceCode += addNodes[i].innerText
          sourceCodeList.push(addNodes[i].innerText)
        }else if(addNodes[i].nodeType === 3) {
          // sourceCode += addNodes[i].data
          sourceCodeList.push(addNodes[i].data)
        }
      }
    }
    // if(removeLen) {
    //   for(let i = 0; i < removeLen; i++) {
    //     console.log(removeNodes[i].innerHTML)
    //   }
    // }

  // 字符
  }else if(list.type === 'characterData') {
    // sourceCode += list.target.data
    const target = list.target.data
    sourceCodeList.push(target.slice(1) + target.slice(0, 1))
  }

  render(sourceCodeList.join(''))

  // return sourceCode
})

/**
 * 进行监听
 */
const runObserver = () => {
  const observeConfig = { childList: true, subtree: true, characterData: true }
  observer.observe(app, observeConfig)
}

runObserver()




