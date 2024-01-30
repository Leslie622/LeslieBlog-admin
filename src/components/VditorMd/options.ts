/* 自定义toolbar */
const toolbar = (): IMenuItem[] => {
  type toolbarMapData = {
    [key: string]: IMenuItem
  }
  //tool列表
  const toolEnum: string[] = [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'outdent',
    'indent',
    'check',
    '|',
    'table',
    'quote',
    'code',
    'inline-code',
    'line',
    'upload',
    '|',
    'insert-after',
    'insert-before',
    '|',
    'undo',
    'redo',
    '|',
    'preview',
    'edit-mode',
    'outline',
    'code-theme',
    'content-theme',
    'export',
    'fullscreen'
  ]
  //tool映射
  const toolMap: toolbarMapData = {}
  //设置所有项的tipPosition为"e"
  toolEnum.forEach((toolName) => {
    if (toolName == '|') {
      toolMap[toolName + Math.random()] = {
        name: toolName,
        tipPosition: 'e'
      }
    } else {
      toolMap[toolName] = {
        name: toolName,
        tipPosition: 'e'
      }
    }
  })
  //设置单个tool，例：
  // toolMap['record'] = {
  //   name: 'record',
  //   tipPosition: 's'
  // }
  return Object.values(toolMap)
}

//需要导出的toolbar配置
const toolbarConfig = toolbar()

export default {
  toolbarConfig
}
