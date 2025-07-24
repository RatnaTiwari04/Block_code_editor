export const BLOCK_TYPES = {
  VARIABLE: {
    id: 'variable',
    label: 'Variable',
    icon: '📦',
    description: 'Create a variable',
    inputs: [],
    outputs: ['value'],
    fields: [
      {
        name: 'name',
        label: 'Variable Name',
        type: 'text',
        placeholder: 'myVariable'
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        placeholder: '42 or "hello"'
      }
    ]
  },
  
  FUNCTION: {
    id: 'function',
    label: 'Function',
    icon: '⚙️',
    description: 'Define a function',
    inputs: [],
    outputs: ['function'],
    fields: [
      {
        name: 'name',
        label: 'Function Name',
        type: 'text',
        placeholder: 'myFunction'
      },
      {
        name: 'params',
        label: 'Parameters',
        type: 'text',
        placeholder: 'a, b, c'
      },
      {
        name: 'body',
        label: 'Function Body',
        type: 'textarea',
        placeholder: 'return a + b;'
      }
    ]
  },
  
  IF: {
    id: 'if',
    label: 'If Statement',
    icon: '🔀',
    description: 'Conditional logic',
    inputs: ['condition'],
    outputs: ['then', 'else'],
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'x > 5'
      },
      {
        name: 'then',
        label: 'Then (if true)',
        type: 'textarea',
        placeholder: 'console.log("condition is true");'
      },
      {
        name: 'else',
        label: 'Else (if false)',
        type: 'textarea',
        placeholder: 'console.log("condition is false");'
      }
    ]
  },
  
  LOOP: {
    id: 'loop',
    label: 'For Loop',
    icon: '🔄',
    description: 'Repeat code multiple times',
    inputs: [],
    outputs: ['body'],
    fields: [
      {
        name: 'variable',
        label: 'Loop Variable',
        type: 'text',
        placeholder: 'i'
      },
      {
        name: 'start',
        label: 'Start Value',
        type: 'text',
        placeholder: '0'
      },
      {
        name: 'end',
        label: 'End Value',
        type: 'text',
        placeholder: '10'
      },
      {
        name: 'step',
        label: 'Step',
        type: 'text',
        placeholder: '1'
      },
      {
        name: 'body',
        label: 'Loop Body',
        type: 'textarea',
        placeholder: 'console.log(i);'
      }
    ]
  },
  
  PRINT: {
    id: 'print',
    label: 'Console Log',
    icon: '🖨️',
    description: 'Print output to console',
    inputs: ['value'],
    outputs: [],
    fields: [
      {
        name: 'value',
        label: 'Value to Print',
        type: 'text',
        placeholder: '"Hello World!" or variableName'
      }
    ]
  },
  
  MATH: {
    id: 'math',
    label: 'Math Operation',
    icon: '➕',
    description: 'Perform mathematical operations',
    inputs: ['left', 'right'],
    outputs: ['result'],
    fields: [
      {
        name: 'left',
        label: 'Left Value',
        type: 'text',
        placeholder: '5'
      },
      {
        name: 'operator',
        label: 'Operator',
        type: 'text',
        placeholder: '+ - * / %'
      },
      {
        name: 'right',
        label: 'Right Value',
        type: 'text',
        placeholder: '3'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'result'
      }
    ]
  },
  
  INPUT: {
    id: 'input',
    label: 'User Input',
    icon: '⌨️',
    description: 'Get input from user',
    inputs: [],
    outputs: ['value'],
    fields: [
      {
        name: 'prompt',
        label: 'Prompt Message',
        type: 'text',
        placeholder: 'Enter your name:'
      },
      {
        name: 'variable',
        label: 'Store In Variable',
        type: 'text',
        placeholder: 'userName'
      }
    ]
  },
  
  COMMENT: {
    id: 'comment',
    label: 'Comment',
    icon: '💬',
    description: 'Add comments to your code',
    inputs: [],
    outputs: [],
    fields: [
      {
        name: 'text',
        label: 'Comment Text',
        type: 'textarea',
        placeholder: 'This is a comment explaining the code'
      }
    ]
  }
};