export const generateCode = (blocks) => {
  if (!blocks || blocks.length === 0) {
    return '// Drag blocks from the sidebar to start coding!\n// Double-click blocks to edit their properties';
  }

  let code = '// Generated code from visual blocks\n\n';
  
  // Sort blocks by their vertical position to maintain logical order
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);
  
  sortedBlocks.forEach((block, index) => {
    const blockCode = generateBlockCode(block);
    if (blockCode.trim()) {
      code += blockCode + '\n';
      if (index < sortedBlocks.length - 1) {
        code += '\n'; // Add extra line between blocks
      }
    }
  });
  
  return code;
};

const generateBlockCode = (block) => {
  const data = block.data || {};
  
  switch (block.type) {
    case 'VARIABLE':
      return generateVariableCode(data);
    
    case 'FUNCTION':
      return generateFunctionCode(data);
    
    case 'IF':
      return generateIfCode(data);
    
    case 'LOOP':
      return generateLoopCode(data);
    
    case 'PRINT':
      return generatePrintCode(data);
    
    case 'MATH':
      return generateMathCode(data);
    
    case 'INPUT':
      return generateInputCode(data);
    
    case 'COMMENT':
      return generateCommentCode(data);
    
    default:
      return `// Unknown block type: ${block.type}`;
  }
};

const generateVariableCode = (data) => {
  const name = data.name || 'myVariable';
  const value = data.value || '0';
  
  // Check if value looks like a string (contains quotes or letters)
  const isString = isNaN(value) && !value.includes('"') && !value.includes("'") && isNaN(parseFloat(value));
  const formattedValue = isString ? `"${value}"` : value;
  
  return `let ${name} = ${formattedValue};`;
};

const generateFunctionCode = (data) => {
  const name = data.name || 'myFunction';
  const params = data.params || '';
  const body = data.body || 'return;';
  
  // Ensure proper indentation for function body
  const indentedBody = body.split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');
  
  return `function ${name}(${params}) {\n${indentedBody}\n}`;
};

const generateIfCode = (data) => {
  const condition = data.condition || 'true';
  const thenCode = data.then || 'console.log("condition is true");';
  const elseCode = data.else || '';
  
  // Ensure proper indentation
  const indentedThen = thenCode.split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');
  
  let code = `if (${condition}) {\n${indentedThen}\n}`;
  
  if (elseCode.trim()) {
    const indentedElse = elseCode.split('\n')
      .map(line => line.trim() ? `  ${line}` : line)
      .join('\n');
    code += ` else {\n${indentedElse}\n}`;
  }
  
  return code;
};

const generateLoopCode = (data) => {
  const variable = data.variable || 'i';
  const start = data.start || '0';
  const end = data.end || '10';
  const step = data.step || '1';
  const body = data.body || 'console.log(i);';
  
  // Ensure proper indentation
  const indentedBody = body.split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');
  
  // Generate appropriate loop based on step value
  if (step === '1') {
    return `for (let ${variable} = ${start}; ${variable} < ${end}; ${variable}++) {\n${indentedBody}\n}`;
  } else {
    return `for (let ${variable} = ${start}; ${variable} < ${end}; ${variable} += ${step}) {\n${indentedBody}\n}`;
  }
};

const generatePrintCode = (data) => {
  const value = data.value || '"Hello World!"';
  
  // Check if the value is a variable name (no quotes) or a literal
  const isVariable = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value.trim());
  const isAlreadyQuoted = value.includes('"') || value.includes("'");
  
  let formattedValue = value;
  if (!isVariable && !isAlreadyQuoted && isNaN(value)) {
    formattedValue = `"${value}"`;
  }
  
  return `console.log(${formattedValue});`;
};

const generateMathCode = (data) => {
  const left = data.left || '0';
  const operator = data.operator || '+';
  const right = data.right || '0';
  const result = data.result || 'result';
  
  return `let ${result} = ${left} ${operator} ${right};`;
};

const generateInputCode = (data) => {
  const prompt = data.prompt || 'Enter a value:';
  const variable = data.variable || 'userInput';
  
  // Since we can't use actual prompt() in this environment, we'll simulate it
  return `// Simulated user input (replace with actual input method)\nlet ${variable} = prompt("${prompt}");`;
};

const generateCommentCode = (data) => {
  const text = data.text || 'This is a comment';
  
  // Handle multi-line comments
  const lines = text.split('\n');
  if (lines.length === 1) {
    return `// ${text}`;
  } else {
    return `/*\n${lines.map(line => ` * ${line}`).join('\n')}\n */`;
  }
};