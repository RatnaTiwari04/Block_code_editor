export const BLOCK_TYPES = {
  // Variables & Data Types
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

  CONSTANT: {
    id: 'constant',
    label: 'Constant',
    icon: '🔒',
    description: 'Create a constant value',
    inputs: [],
    outputs: ['value'],
    fields: [
      {
        name: 'name',
        label: 'Constant Name',
        type: 'text',
        placeholder: 'PI'
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        placeholder: '3.14159'
      }
    ]
  },

  // Data Types
  NUMBER: {
    id: 'number',
    label: 'Number',
    icon: '🔢',
    description: 'Create a number value',
    inputs: [],
    outputs: ['value'],
    fields: [
      {
        name: 'value',
        label: 'Number Value',
        type: 'number',
        placeholder: '42'
      }
    ]
  },

  STRING: {
    id: 'string',
    label: 'String',
    icon: '📝',
    description: 'Create a text string',
    inputs: [],
    outputs: ['value'],
    fields: [
      {
        name: 'value',
        label: 'Text Value',
        type: 'text',
        placeholder: 'Hello World'
      }
    ]
  },

  BOOLEAN: {
    id: 'boolean',
    label: 'Boolean',
    icon: '✅',
    description: 'Create a true/false value',
    inputs: [],
    outputs: ['value'],
    fields: [
      {
        name: 'value',
        label: 'Boolean Value',
        type: 'select',
        options: ['true', 'false'],
        placeholder: 'true'
      }
    ]
  },

  ARRAY: {
    id: 'array',
    label: 'Array',
    icon: '📋',
    description: 'Create an array/list',
    inputs: [],
    outputs: ['array'],
    fields: [
      {
        name: 'name',
        label: 'Array Name',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'values',
        label: 'Values (comma separated)',
        type: 'text',
        placeholder: '1, 2, 3, 4'
      }
    ]
  },

  OBJECT: {
    id: 'object',
    label: 'Object',
    icon: '🏗️',
    description: 'Create an object',
    inputs: [],
    outputs: ['object'],
    fields: [
      {
        name: 'name',
        label: 'Object Name',
        type: 'text',
        placeholder: 'myObject'
      },
      {
        name: 'properties',
        label: 'Properties (JSON format)',
        type: 'textarea',
        placeholder: '{"name": "John", "age": 30}'
      }
    ]
  },

  // Functions
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

  FUNCTION_CALL: {
    id: 'function_call',
    label: 'Function Call',
    icon: '📞',
    description: 'Call a function',
    inputs: ['function'],
    outputs: ['result'],
    fields: [
      {
        name: 'functionName',
        label: 'Function Name',
        type: 'text',
        placeholder: 'myFunction'
      },
      {
        name: 'arguments',
        label: 'Arguments',
        type: 'text',
        placeholder: '1, 2, 3'
      }
    ]
  },

  RETURN: {
    id: 'return',
    label: 'Return',
    icon: '↩️',
    description: 'Return a value from function',
    inputs: ['value'],
    outputs: [],
    fields: [
      {
        name: 'value',
        label: 'Return Value',
        type: 'text',
        placeholder: 'result'
      }
    ]
  },

  // Control Flow
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

  ELSE_IF: {
    id: 'else_if',
    label: 'Else If',
    icon: '🔀',
    description: 'Additional condition in if chain',
    inputs: ['condition'],
    outputs: ['then', 'next'],
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'x === 5'
      },
      {
        name: 'then',
        label: 'Then (if true)',
        type: 'textarea',
        placeholder: 'console.log("x equals 5");'
      }
    ]
  },

  SWITCH: {
    id: 'switch',
    label: 'Switch Statement',
    icon: '🎛️',
    description: 'Multi-way conditional',
    inputs: ['value'],
    outputs: ['cases', 'default'],
    fields: [
      {
        name: 'value',
        label: 'Switch Value',
        type: 'text',
        placeholder: 'x'
      },
      {
        name: 'cases',
        label: 'Cases (JSON)',
        type: 'textarea',
        placeholder: '{"case1": "code1", "case2": "code2"}'
      },
      {
        name: 'default',
        label: 'Default Case',
        type: 'textarea',
        placeholder: 'console.log("default");'
      }
    ]
  },

  // Loops
  LOOP: {
    id: 'for_loop',
    label: 'For Loop',
    icon: '🔄',
    description: 'Repeat code with counter',
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

  WHILE_LOOP: {
    id: 'while_loop',
    label: 'While Loop',
    icon: '🔁',
    description: 'Repeat while condition is true',
    inputs: ['condition'],
    outputs: ['body'],
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'x < 10'
      },
      {
        name: 'body',
        label: 'Loop Body',
        type: 'textarea',
        placeholder: 'x++; console.log(x);'
      }
    ]
  },

  DO_WHILE_LOOP: {
    id: 'do_while_loop',
    label: 'Do-While Loop',
    icon: '🔃',
    description: 'Execute once, then repeat while condition is true',
    inputs: ['condition'],
    outputs: ['body'],
    fields: [
      {
        name: 'body',
        label: 'Loop Body',
        type: 'textarea',
        placeholder: 'x++; console.log(x);'
      },
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'x < 10'
      }
    ]
  },

  FOR_EACH: {
    id: 'for_each',
    label: 'For Each',
    icon: '🔄',
    description: 'Iterate over array elements',
    inputs: ['array'],
    outputs: ['body'],
    fields: [
      {
        name: 'array',
        label: 'Array',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'variable',
        label: 'Element Variable',
        type: 'text',
        placeholder: 'item'
      },
      {
        name: 'body',
        label: 'Loop Body',
        type: 'textarea',
        placeholder: 'console.log(item);'
      }
    ]
  },

  BREAK: {
    id: 'break',
    label: 'Break',
    icon: '🛑',
    description: 'Break out of loop',
    inputs: [],
    outputs: [],
    fields: []
  },

  CONTINUE: {
    id: 'continue',
    label: 'Continue',
    icon: '⏭️',
    description: 'Skip to next iteration',
    inputs: [],
    outputs: [],
    fields: []
  },

  // Mathematical Operations
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
        type: 'select',
        options: ['+', '-', '*', '/', '%', '**'],
        placeholder: '+'
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

  MATH_FUNCTION: {
    id: 'math_function',
    label: 'Math Function',
    icon: '📐',
    description: 'Mathematical functions',
    inputs: ['value'],
    outputs: ['result'],
    fields: [
      {
        name: 'function',
        label: 'Function',
        type: 'select',
        options: ['abs', 'ceil', 'floor', 'round', 'sqrt', 'pow', 'sin', 'cos', 'tan', 'log', 'random'],
        placeholder: 'abs'
      },
      {
        name: 'value',
        label: 'Input Value',
        type: 'text',
        placeholder: '-5'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'result'
      }
    ]
  },

  INCREMENT: {
    id: 'increment',
    label: 'Increment',
    icon: '⬆️',
    description: 'Increase variable by 1',
    inputs: ['variable'],
    outputs: ['result'],
    fields: [
      {
        name: 'variable',
        label: 'Variable',
        type: 'text',
        placeholder: 'counter'
      }
    ]
  },

  DECREMENT: {
    id: 'decrement',
    label: 'Decrement',
    icon: '⬇️',
    description: 'Decrease variable by 1',
    inputs: ['variable'],
    outputs: ['result'],
    fields: [
      {
        name: 'variable',
        label: 'Variable',
        type: 'text',
        placeholder: 'counter'
      }
    ]
  },

  // Comparison & Logic
  COMPARISON: {
    id: 'comparison',
    label: 'Comparison',
    icon: '⚖️',
    description: 'Compare two values',
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
        type: 'select',
        options: ['==', '===', '!=', '!==', '>', '<', '>=', '<='],
        placeholder: '=='
      },
      {
        name: 'right',
        label: 'Right Value',
        type: 'text',
        placeholder: '3'
      }
    ]
  },

  LOGICAL: {
    id: 'logical',
    label: 'Logical Operation',
    icon: '🧠',
    description: 'Logical AND, OR, NOT',
    inputs: ['left', 'right'],
    outputs: ['result'],
    fields: [
      {
        name: 'left',
        label: 'Left Value',
        type: 'text',
        placeholder: 'true'
      },
      {
        name: 'operator',
        label: 'Operator',
        type: 'select',
        options: ['&&', '||', '!'],
        placeholder: '&&'
      },
      {
        name: 'right',
        label: 'Right Value',
        type: 'text',
        placeholder: 'false'
      }
    ]
  },

  // String Operations
  STRING_CONCAT: {
    id: 'string_concat',
    label: 'String Concatenation',
    icon: '🔗',
    description: 'Join strings together',
    inputs: ['left', 'right'],
    outputs: ['result'],
    fields: [
      {
        name: 'left',
        label: 'First String',
        type: 'text',
        placeholder: 'Hello'
      },
      {
        name: 'right',
        label: 'Second String',
        type: 'text',
        placeholder: 'World'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'result'
      }
    ]
  },

  STRING_LENGTH: {
    id: 'string_length',
    label: 'String Length',
    icon: '📏',
    description: 'Get length of string',
    inputs: ['string'],
    outputs: ['length'],
    fields: [
      {
        name: 'string',
        label: 'String',
        type: 'text',
        placeholder: 'myString'
      },
      {
        name: 'result',
        label: 'Store Length In',
        type: 'text',
        placeholder: 'length'
      }
    ]
  },

  SUBSTRING: {
    id: 'substring',
    label: 'Substring',
    icon: '✂️',
    description: 'Extract part of string',
    inputs: ['string'],
    outputs: ['result'],
    fields: [
      {
        name: 'string',
        label: 'String',
        type: 'text',
        placeholder: 'myString'
      },
      {
        name: 'start',
        label: 'Start Index',
        type: 'number',
        placeholder: '0'
      },
      {
        name: 'end',
        label: 'End Index',
        type: 'number',
        placeholder: '5'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'result'
      }
    ]
  },

  // Array Operations
  ARRAY_LENGTH: {
    id: 'array_length',
    label: 'Array Length',
    icon: '📐',
    description: 'Get array length',
    inputs: ['array'],
    outputs: ['length'],
    fields: [
      {
        name: 'array',
        label: 'Array',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'result',
        label: 'Store Length In',
        type: 'text',
        placeholder: 'length'
      }
    ]
  },

  ARRAY_PUSH: {
    id: 'array_push',
    label: 'Array Push',
    icon: '📌',
    description: 'Add element to end of array',
    inputs: ['array', 'value'],
    outputs: ['array'],
    fields: [
      {
        name: 'array',
        label: 'Array',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'value',
        label: 'Value to Add',
        type: 'text',
        placeholder: 'newValue'
      }
    ]
  },

  ARRAY_POP: {
    id: 'array_pop',
    label: 'Array Pop',
    icon: '🗑️',
    description: 'Remove last element from array',
    inputs: ['array'],
    outputs: ['array', 'value'],
    fields: [
      {
        name: 'array',
        label: 'Array',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'result',
        label: 'Store Removed Value In',
        type: 'text',
        placeholder: 'removedValue'
      }
    ]
  },

  ARRAY_GET: {
    id: 'array_get',
    label: 'Array Get',
    icon: '🎯',
    description: 'Get element at index',
    inputs: ['array', 'index'],
    outputs: ['value'],
    fields: [
      {
        name: 'array',
        label: 'Array',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'index',
        label: 'Index',
        type: 'number',
        placeholder: '0'
      },
      {
        name: 'result',
        label: 'Store Value In',
        type: 'text',
        placeholder: 'value'
      }
    ]
  },

  ARRAY_SET: {
    id: 'array_set',
    label: 'Array Set',
    icon: '📝',
    description: 'Set element at index',
    inputs: ['array', 'index', 'value'],
    outputs: ['array'],
    fields: [
      {
        name: 'array',
        label: 'Array',
        type: 'text',
        placeholder: 'myArray'
      },
      {
        name: 'index',
        label: 'Index',
        type: 'number',
        placeholder: '0'
      },
      {
        name: 'value',
        label: 'New Value',
        type: 'text',
        placeholder: 'newValue'
      }
    ]
  },

  // Input/Output
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

  ALERT: {
    id: 'alert',
    label: 'Alert',
    icon: '🚨',
    description: 'Show alert dialog',
    inputs: ['message'],
    outputs: [],
    fields: [
      {
        name: 'message',
        label: 'Alert Message',
        type: 'text',
        placeholder: 'Alert message'
      }
    ]
  },

  // Error Handling
  TRY_CATCH: {
    id: 'try_catch',
    label: 'Try-Catch',
    icon: '🛡️',
    description: 'Handle errors',
    inputs: [],
    outputs: ['try', 'catch', 'finally'],
    fields: [
      {
        name: 'try',
        label: 'Try Block',
        type: 'textarea',
        placeholder: 'risky code here'
      },
      {
        name: 'catch',
        label: 'Catch Block',
        type: 'textarea',
        placeholder: 'handle error here'
      },
      {
        name: 'finally',
        label: 'Finally Block (optional)',
        type: 'textarea',
        placeholder: 'cleanup code here'
      }
    ]
  },

  THROW: {
    id: 'throw',
    label: 'Throw Error',
    icon: '💥',
    description: 'Throw an error',
    inputs: ['message'],
    outputs: [],
    fields: [
      {
        name: 'message',
        label: 'Error Message',
        type: 'text',
        placeholder: 'Something went wrong'
      }
    ]
  },

  // Timing
  DELAY: {
    id: 'delay',
    label: 'Delay/Sleep',
    icon: '⏱️',
    description: 'Wait for specified time',
    inputs: [],
    outputs: ['next'],
    fields: [
      {
        name: 'duration',
        label: 'Duration (ms)',
        type: 'number',
        placeholder: '1000'
      }
    ]
  },

  TIMER: {
    id: 'timer',
    label: 'Timer',
    icon: '⏰',
    description: 'Execute code after delay',
    inputs: [],
    outputs: ['callback'],
    fields: [
      {
        name: 'duration',
        label: 'Duration (ms)',
        type: 'number',
        placeholder: '1000'
      },
      {
        name: 'callback',
        label: 'Code to Execute',
        type: 'textarea',
        placeholder: 'console.log("Timer finished");'
      }
    ]
  },

  // Type Conversion
  TO_STRING: {
    id: 'to_string',
    label: 'To String',
    icon: '🔤',
    description: 'Convert to string',
    inputs: ['value'],
    outputs: ['result'],
    fields: [
      {
        name: 'value',
        label: 'Value to Convert',
        type: 'text',
        placeholder: '42'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'stringValue'
      }
    ]
  },

  TO_NUMBER: {
    id: 'to_number',
    label: 'To Number',
    icon: '🔢',
    description: 'Convert to number',
    inputs: ['value'],
    outputs: ['result'],
    fields: [
      {
        name: 'value',
        label: 'Value to Convert',
        type: 'text',
        placeholder: '"42"'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'numberValue'
      }
    ]
  },

  TO_BOOLEAN: {
    id: 'to_boolean',
    label: 'To Boolean',
    icon: '✅',
    description: 'Convert to boolean',
    inputs: ['value'],
    outputs: ['result'],
    fields: [
      {
        name: 'value',
        label: 'Value to Convert',
        type: 'text',
        placeholder: '1'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'boolValue'
      }
    ]
  },

  // Random
  RANDOM: {
    id: 'random',
    label: 'Random Number',
    icon: '🎲',
    description: 'Generate random number',
    inputs: [],
    outputs: ['result'],
    fields: [
      {
        name: 'min',
        label: 'Minimum',
        type: 'number',
        placeholder: '0'
      },
      {
        name: 'max',
        label: 'Maximum',
        type: 'number',
        placeholder: '100'
      },
      {
        name: 'result',
        label: 'Store Result In',
        type: 'text',
        placeholder: 'randomValue'
      }
    ]
  },

  // Comments & Documentation
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
  },

  // Start/End blocks
  START: {
    id: 'start',
    label: 'Start',
    icon: '🚀',
    description: 'Program entry point',
    inputs: [],
    outputs: ['next'],
    fields: []
  },

  END: {
    id: 'end',
    label: 'End',
    icon: '🏁',
    description: 'Program termination',
    inputs: ['previous'],
    outputs: [],
    fields: []
  }
};