const renderHtml = (type, value) => {
  let tragetCodeStr = ''
  switch (type) {
    case 'const':
      tragetCodeStr += `<span class='const'>${value}</span>`
      break
    case 'variable':
      tragetCodeStr += `<span class='variable'>&nbsp;${value}</span>`
      break
    case 'value':
      tragetCodeStr += `<span class='symbol'>&nbsp;=</span>`;
      tragetCodeStr += `<span class='value'>&nbsp;${value};</span>`
      break
    case 'number':
      tragetCodeStr += `<span class='symbol'>&nbsp;=</span>`;
      tragetCodeStr += `<span class='number'>&nbsp;${value};</span>`
      break
    default: 
      tragetCodeStr += `<span class='error'>${value}</span>`
  }

  return tragetCodeStr
}

export default renderHtml