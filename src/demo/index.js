import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import renderHtml from './template';

import './style.css';

const app = document.getElementById('app')

/**
 * 转化源代码 添加颜色
 * @param {*} sourceCode 
 * @returns 
 */
const generator = (sourceCode) => {
  let targetCode = '';
  
  const ast = parse(sourceCode);
  
  traverse(ast, {
    VariableDeclaration(path) {
      if (path.node.kind === 'const') {
        targetCode += renderHtml('const', 'const')
      }
    },
    Identifier(path) {
      targetCode += renderHtml('variable', path.node.name)
    },
    StringLiteral(path) {
      targetCode += renderHtml('value', path.node.value)
    },
    NumericLiteral(path) {
      targetCode += renderHtml('number', path.node.value)
    }
  });

  return targetCode
}

/**
 * 渲染
 * @param {*} sourceCode 
 */
const render = (sourceCode, hasObserve = true) => {
  let targetCode = ''
  try {
    targetCode = generator(sourceCode)
  }catch(err) {
    targetCode = renderHtml('error', sourceCode)
  }

  if(targetCode && sourceCode !== "'") {
    if(!hasObserve) {
      app.innerHTML = `<div>${targetCode}</div>`
    }else {
      observer.disconnect()
      app.innerHTML = `<div>${targetCode}</div>`
      runObserver()
    }
  }
}

/**
 * 监听器：对输入进行监听得到源代码
 */
const observer = new MutationObserver((mutationList) => {
  console.log(mutationList)
  const list = mutationList[0]
  const sourceCodeList = []

  // dom增加
  if(list.type === 'childList') {
    const addNodes = list.addedNodes, removeNodes = list.removedNodes;
    const addLen = addNodes.length
    const removeLen = removeNodes.length

    if(addLen) {
      for(let i = 0; i < addLen; i++) {
        if(addNodes[i].nodeType === 1) {
          sourceCodeList.push(addNodes[i].innerText)
        }else if(addNodes[i].nodeType === 3) {
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
})

/**
 * 进行监听
 */
const runObserver = () => {
  const observeConfig = { childList: true, subtree: true, characterData: true }
  observer.observe(app, observeConfig)
}

runObserver()

// 直接渲染
// render(`const age = 233`, false)
