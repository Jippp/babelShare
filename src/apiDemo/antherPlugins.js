/**
 * 自定义插件写法
 * @param {*} apis 集合了@bable/parser @babel/traverse @babel/generator等各个库的api
 * @param {*} options 外界传递给该插件的数据
 * @param {*} dirname 文件路径
 * @returns 
 */
module.exports = {
  visitor: {
    Identifier(path) {
      const node = path.node
      if(node.name) {
        console.log('preset plugins!')
        node.name = 'afterPluginVal'
      }
    } 
  }
}