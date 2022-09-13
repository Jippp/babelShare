module.exports = {
  Identifier(path) {
    const node = path.node
    if(node.name) {
      node.name = 'afterPluginVal'
    }
  } 
}