module.exports = (api, options, dirname) => {
  console.log(options)
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