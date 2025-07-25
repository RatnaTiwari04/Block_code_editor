export const generateCode = (blocks, selectedLanguage = 'javascript') => {
  if (!blocks || blocks.length === 0) {
    return '// Drag blocks from the sidebar to start coding!\n// Double-click blocks to edit their properties';
  }

  let codeHeader = {
    javascript: '// Generated JavaScript code from visual blocks\n\n',
    python: '# Generated Python code from visual blocks\n\n',
    java: '// Generated Java code from visual blocks\n\npublic class Main {\n  public static void main(String[] args) {\n',
    cpp: '// Generated C++ code from visual blocks\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n',
    c: '// Generated C code from visual blocks\n\n#include <stdio.h>\n\nint main() {\n'
  }[selectedLanguage] || '';

  let code = codeHeader;

  // Sort blocks by vertical position to keep logical order
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);

  sortedBlocks.forEach((block, index) => {
    const blockCode = generateBlockCode(block, selectedLanguage);
    if (blockCode.trim()) {
      // For Java/C/C++, indent inside main()
      if (['java', 'cpp', 'c'].includes(selectedLanguage)) {
        code += blockCode
          .split('\n')
          .map(line => line.trim() ? `  ${line}` : line)
          .join('\n') + '\n';
      } else {
        code += blockCode + '\n';
      }
      if (index < sortedBlocks.length - 1) {
        code += '\n';
      }
    }
  });

  // Close main method for Java/C/C++
  if (selectedLanguage === 'java' || selectedLanguage === 'cpp' || selectedLanguage === 'c') {
    code += '  return 0;\n}\n';
    if (selectedLanguage === 'java') {
      code += '}';
    }
  }

  return code;
};

const generateBlockCode = (block, lang) => {
  const data = block.data || {};
  switch (block.type) {
    case 'VARIABLE':
      return generateVariableCode(data, lang);
    case 'FUNCTION':
      return generateFunctionCode(data, lang);
    case 'IF':
      return generateIfCode(data, lang);
    case 'LOOP':
      return generateLoopCode(data, lang);
    case 'PRINT':
      return generatePrintCode(data, lang);
    case 'MATH':
      return generateMathCode(data, lang);
    case 'INPUT':
      return generateInputCode(data, lang);
    case 'COMMENT':
      return generateCommentCode(data, lang);
    default:
      return `// Unknown block type: ${block.type}`;
  }
};

const generateVariableCode = (data, lang) => {
  const name = data.name || 'myVariable';
  const value = data.value || '0';
  const isString = isNaN(value) && !value.includes('"') && !value.includes("'") && isNaN(parseFloat(value));
  const formattedValue = isString ? `"${value}"` : value;

  switch (lang) {
    case 'python':
      return `${name} = ${formattedValue}`;
    case 'java':
      return `int ${name} = ${formattedValue};`;
    case 'cpp':
    case 'c':
      return `int ${name} = ${formattedValue};`;
    default:
      return `let ${name} = ${formattedValue};`;
  }
};

const generateFunctionCode = (data, lang) => {
  const name = data.name || 'myFunction';
  const params = data.params || '';
  const body = data.body || '';

  const indentedBody = body.split('\n').map(line => line.trim() ? `  ${line}` : line).join('\n');

  switch (lang) {
    case 'python':
      return `def ${name}(${params}):\n${body ? '  ' + indentedBody.replace(/\n/g, '\n  ') : '  pass'}`;
    case 'java':
      return `public static void ${name}(${params}) {\n${indentedBody}\n}`;
    case 'cpp':
    case 'c':
      return `void ${name}(${params}) {\n${indentedBody}\n}`;
    default:
      return `function ${name}(${params}) {\n${indentedBody}\n}`;
  }
};

const generateIfCode = (data, lang) => {
  const condition = data.condition || 'true';
  const thenCode = data.then || '';
  const elseCode = data.else || '';

  const indent = (code) => code.split('\n').map(line => line.trim() ? `  ${line}` : line).join('\n');

  switch (lang) {
    case 'python':
      let pyCode = `if ${condition}:\n${indent(thenCode)}`;
      if (elseCode.trim()) pyCode += `\nelse:\n${indent(elseCode)}`;
      return pyCode;
    default:
      let otherCode = `if (${condition}) {\n${indent(thenCode)}\n}`;
      if (elseCode.trim()) otherCode += ` else {\n${indent(elseCode)}\n}`;
      return otherCode;
  }
};

const generateLoopCode = (data, lang) => {
  const variable = data.variable || 'i';
  const start = data.start || '0';
  const end = data.end || '10';
  const step = data.step || '1';
  const body = data.body || '';

  const indentedBody = body.split('\n').map(line => line.trim() ? `  ${line}` : line).join('\n');

  if (lang === 'python') {
    const rangeExpr = (step === '1') ? `range(${start}, ${end})` : `range(${start}, ${end}, ${step})`;
    return `for ${variable} in ${rangeExpr}:\n${indentedBody.replace(/\n/g, '\n  ')}`;
  } else {
    const stepExpr = (step === '1') ? `${variable}++` : `${variable} += ${step}`;
    return `for (int ${variable} = ${start}; ${variable} < ${end}; ${stepExpr}) {\n${indentedBody}\n}`;
  }
};

const generatePrintCode = (data, lang) => {
  const value = data.value || '"Hello World!"';
  const isVariable = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value.trim());
  const isAlreadyQuoted = value.includes('"') || value.includes("'");

  let formattedValue = value;
  if (!isVariable && !isAlreadyQuoted && isNaN(value)) {
    formattedValue = `"${value}"`;
  }

  switch (lang) {
    case 'python':
      return `print(${formattedValue})`;
    case 'java':
      return `System.out.println(${formattedValue});`;
    case 'cpp':
      return `cout << ${formattedValue} << endl;`;
    case 'c':
      return `printf("%s\\n", ${formattedValue});`;
    default:
      return `console.log(${formattedValue});`;
  }
};

const generateMathCode = (data, lang) => {
  const left = data.left || '0';
  const operator = data.operator || '+';
  const right = data.right || '0';
  const result = data.result || 'result';

  switch (lang) {
    case 'python':
      return `${result} = ${left} ${operator} ${right}`;
    case 'java':
    case 'cpp':
    case 'c':
      return `int ${result} = ${left} ${operator} ${right};`;
    default:
      return `let ${result} = ${left} ${operator} ${right};`;
  }
};

const generateInputCode = (data, lang) => {
  const promptText = data.prompt || 'Enter a value:';
  const variable = data.variable || 'userInput';

  switch (lang) {
    case 'python':
      return `${variable} = input("${promptText}")`;
    case 'java':
      return `// TODO: Scanner input\nString ${variable} = ""; // Replace with actual scanner input`;
    case 'cpp':
      return `string ${variable};\ncout << "${promptText}";\ncin >> ${variable};`;
    case 'c':
      return `char ${variable}[100];\nprintf("${promptText}");\nscanf("%s", ${variable});`;
    default:
      return `// Simulated input\nlet ${variable} = prompt("${promptText}");`;
  }
};

const generateCommentCode = (data, lang) => {
  const text = data.text || 'This is a comment';
  const lines = text.split('\n');

  if (lines.length === 1) {
    switch (lang) {
      case 'python':
        return `# ${text}`;
      default:
        return `// ${text}`;
    }
  } else {
    switch (lang) {
      case 'python':
        return `"""\n${text}\n"""`;
      default:
        return `/*\n${lines.map(line => ` * ${line}`).join('\n')}\n */`;
    }
  }
};
