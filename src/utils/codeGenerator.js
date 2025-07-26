export const generateCode = (blocks, selectedLanguage = 'javascript') => {
  if (!blocks || blocks.length === 0) {
    return '// Drag blocks from the sidebar to start coding!\n// Double-click blocks to edit their properties';
  }

  const isJavaLike = ['java', 'cpp', 'c'].includes(selectedLanguage);

  let code = '';
  let mainBody = '';
  let otherMethods = '';
  const codeHeader = {
    javascript: '// Generated JavaScript code from visual blocks\n\n',
    python: '# Generated Python code from visual blocks\n\n',
    java: '// Generated Java code from visual blocks\n\n',
    cpp: '// Generated C++ code from visual blocks\n\n#include <iostream>\nusing namespace std;\n\n',
    c: '// Generated C code from visual blocks\n\n#include <stdio.h>\n\n'
  }[selectedLanguage] || '';

  code += codeHeader;
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);

  sortedBlocks.forEach((block, index) => {
    const blockCode = generateBlockCode(block, selectedLanguage);
    if (!blockCode.trim()) return;

    if (selectedLanguage === 'java' && block.type === 'FUNCTION') {
      otherMethods += blockCode + '\n\n';
    } else if (isJavaLike) {
      mainBody += blockCode
        .split('\n')
        .map(line => line.trim() ? '    ' + line : line)
        .join('\n') + '\n\n';
    } else {
      code += blockCode + '\n\n';
    }
  });
  if (selectedLanguage === 'java') {
    code += 'public class Main {\n\n';
    code += '  public static void main(String[] args) {\n';
    code += mainBody.trim() + '\n';
    code += '  }\n\n';
    code += otherMethods.trim() + '\n';
    code += '}';
  } else if (selectedLanguage === 'cpp' || selectedLanguage === 'c') {
    code += 'int main() {\n';
    code += mainBody.trim() + '\n';
    code += '  return 0;\n';
    code += '}\n';
  }

  return code;
};

const generateBlockCode = (block, lang) => {
  const data = block.data || {};
  switch (block.type) {
    case 'VARIABLE':
      return generateVariableCode(data, lang);
    case 'CONSTANT':
      return generateConstantCode(data,lang);
    case 'ARRAY':
      return generateArrayCode(data,lang);
    case 'FUNCTION':
      return generateFunctionCode(data, lang);
    case 'FUNCTION_CALL':
      return generateFunctionCallCode(data,lang);
    case 'RETURN':
      return generateReturnCode(data,lang);
    case 'IF':
      return generateIfCode(data, lang);
    case 'ELSE_IF':
      return generateElseIfCode(data,lang);
    case 'SWITCH':
      return generateSwitchCode(data,lang);
    case 'LOOP':
      return generateForLoopCode(data, lang);
    case 'WHILE_LOOP':
      return generateWhileLoopCode(data,lang);
    case 'DO_WHILE_LOOP':
      return generateDoWhileLoopCode(data,lang);
    case 'FOR_EACH':
      return generateForEachLoopCode(data,lang);
    case 'BREAK':
      return generateBreakCode(data,lang);
    case 'CONTINUE':
      return generateContinueCode(data,lang);
    case 'PRINT':
      return generatePrintCode(data, lang);
    case 'MATH':
      return generateMathCode(data, lang);
    case 'MATH_FUNCTION':
      return generateMathFunctionCode(data,lang);
    case 'INCREMENT':
      return generateIncrementCode(data,lang);
    case 'DECREMENT':
      return generateDecrementCode(data,lang);
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
const generateConstantCode = (data, lang) => {
  const name = data.name || 'myVariable';
  const value = data.value || '0';
  const isString = isNaN(value) && !value.includes('"') && !value.includes("'") && isNaN(parseFloat(value));
  const formattedValue = isString ? `"${value}"` : value;

  switch (lang) {
    case 'python':
      return `${name} = ${formattedValue}`;
    case 'java':
      return `const ${name} = ${formattedValue};`;
    case 'cpp':
    case 'c':
      return `const ${name} = ${formattedValue};`;
    default:
      return `const ${name} = ${formattedValue};`;
  }
};
const generateArrayCode = (data, lang) => {
  const name = data.name || 'myArray';
  const rawValues = data.values || '';
  const values = rawValues.split(',').map(v => v.trim()).filter(v => v.length > 0);
  const isNumeric = (val) => !isNaN(val) && val !== '';

  switch (lang) {
    case 'python':
      const pyValues = values.map(v => isNumeric(v) ? v : `"${v}"`);
      return `${name} = [${pyValues.join(', ')}]`;

    case 'java':
      if (values.length === 0) return `int[] ${name} = {};`;

      const firstIsNum = isNumeric(values[0]);
      if (firstIsNum) {
        return `int[] ${name} = { ${values.join(', ')} };`;
      } else {
        const javaStrValues = values.map(v => `"${v}"`);
        return `String[] ${name} = { ${javaStrValues.join(', ')} };`;
      }
    case 'cpp':
    case 'c':
      if (values.length === 0) return `int ${name}[] = {};`;
      if (isNumeric(values[0])) {
        return `int ${name}[] = { ${values.join(', ')} };`;
      } else {
        const cppStrValues = values.map(v => `"${v}"`);
        return `const char* ${name}[] = { ${cppStrValues.join(', ')} };`;
      }
    case 'javascript':
    default:
      const jsValues = values.map(v => isNumeric(v) ? v : `"${v}"`);
      return `const ${name} = [${jsValues.join(', ')}];`;
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
const generateFunctionCallCode = (data, lang) => {
  const functionName = data.functionName || 'myFunction';
  const rawArgs = data.arguments || '';
  // Parse and trim arguments into array
  const args = rawArgs.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0);
  // Helper to check if argument is numeric
  const isNumeric = (val) => !isNaN(val) && val !== '';
  // Format args based on type (quote strings if needed)
  const formatArg = (arg) => {
    if (isNumeric(arg)) return arg;
    if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) return arg;
    return `"${arg}"`;
  };
  const formattedArgs = args.map(formatArg).join(', ');
  // Add semicolon for C, C++, Java, JavaScript (except Python)
  const semicolon = (lang === 'python') ? '' : ';';
  // Final call string
  const callLine = `${functionName}(${formattedArgs})${semicolon}`;
  // Indent call line like your generateFunctionCode body formatting
  const indentedCall = `  ${callLine}`;
  switch (lang) {
    case 'python':
      // Python call — usually inline or inside a function (no braces)
      return indentedCall.trim();
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      // Others — keep indentation and semicolon
      return indentedCall;
  }
};
const generateReturnCode = (data, lang) => {
  let value = data.value || '';
  // Check if value is numeric or already quoted
  const isNumeric = (val) => !isNaN(val) && val !== '';
  const isQuoted = (val) => (val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"));
  // For some languages, quoting strings might be necessary
  if (!isNumeric(value) && !isQuoted(value) && value.length > 0) {
    value = `"${value}"`;
  }
  switch (lang) {
    case 'python':
      return `return ${value}`;
    case 'java':
    case 'cpp':
    case 'c':
      return `return ${value};`;
    case 'javascript':
    default:
      return `return ${value};`;
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
const generateElseIfCode = (data, lang) => {
  const condition = data.condition || 'condition';
  const thenCode = data.then || '';
  
  // Indent each line of thenCode by 2 spaces
  const indentedThen = thenCode
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');

  switch (lang) {
    case 'python':
      // Python elif with colon and indented block
      return `elif ${condition}:\n${indentedThen || '  pass'}`;

    case 'java':
    case 'cpp':
    case 'c':
      // else if with braces and semicolon inside
      return `else if (${condition}) {\n${indentedThen}\n}`;

    case 'javascript':
    default:
      // JS else if same as C-like
      return `else if (${condition}) {\n${indentedThen}\n}`;
  }
};


const generateSwitchCode = (data, lang) => {
  const value = data.value || 'value';
  let casesJson = {};
  try {
    casesJson = JSON.parse(data.cases || '{}');
  } catch {
    // invalid JSON fallback
    casesJson = {};
  }
  const defaultCase = data.default || '';

  // Helper to indent code lines
  const indentLines = (code, indent = '  ') => 
    code.split('\n').map(line => line.trim() ? indent + line : line).join('\n');

  switch (lang) {
    case 'python':
      // Python uses if-elif-else for switch
      const casesPython = Object.entries(casesJson).map(([caseKey, code]) =>
        `elif ${value} == ${caseKey}:\n${indentLines(code || 'pass', '  ')}`
      ).join('\n');
      const defaultPython = defaultCase ? `else:\n${indentLines(defaultCase, '  ')}` : '';
      // first case must be 'if' not 'elif', so fix that if any cases exist
      const pythonSwitch = casesPython.length > 0
        ? `if ${value} == ${Object.entries(casesJson)[0][0]}:\n${indentLines(Object.entries(casesJson)[0][1] || 'pass', '  ')}\n` +
          Object.entries(casesJson).slice(1).map(([caseKey, code]) =>
            `elif ${value} == ${caseKey}:\n${indentLines(code || 'pass', '  ')}`
          ).join('\n') +
          (defaultCase ? `\nelse:\n${indentLines(defaultCase, '  ')}` : '')
        : defaultCase ? `if True:\n${indentLines(defaultCase, '  ')}` : '';
      return pythonSwitch || 'pass';

    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      // C-style switch with cases and default, indented and semicolon-terminated lines
      const casesStr = Object.entries(casesJson).map(([caseKey, code]) => {
        const indentedCode = indentLines(code || '', '    ');
        return `case ${caseKey}:\n${indentedCode}\n    break;`;
      }).join('\n');

      const defaultStr = defaultCase
        ? `default:\n${indentLines(defaultCase, '    ')}\n    break;`
        : '';

      return `switch (${value}) {\n${casesStr}\n${defaultStr}\n}`;
  }
};
const generateForLoopCode = (data, lang) => {
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
const generateWhileLoopCode = (data, lang) => {
  const condition = data.condition || 'true';
  const body = data.body || '';
  const indentedBody = body
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');
  switch (lang) {
    case 'python':
      return `while ${condition}:\n${indentedBody || '  pass'}`;
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return `while (${condition}) {\n${indentedBody}\n}`;
  }
};
const generateDoWhileLoopCode = (data, lang) => {
  const condition = data.condition || 'true';
  const body = data.body || '';
  const indentedBody = body
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');
  switch (lang) {
    case 'python':
      return `while True:\n${indentedBody || '  pass'}\n  if not (${condition}):\n    break`;

    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return `do {\n${indentedBody}\n} while (${condition});`;
  }
};
const generateForEachLoopCode = (data, lang) => {
  const arrayName = data.array || 'myArray';
  const variable = data.variable || 'item';
  const body = data.body || '';
  const indentedBody = body
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');
  switch (lang) {
    case 'python':
      return `for ${variable} in ${arrayName}:\n${indentedBody || '  pass'}`;
    case 'java':
      return `for (Object ${variable} : ${arrayName}) {\n${indentedBody}\n}`;

    case 'cpp':
    case 'c':
      return `for (int i = 0; i < sizeof(${arrayName}) / sizeof(${arrayName}[0]); i++) {\n  auto ${variable} = ${arrayName}[i];\n${indentedBody}\n}`;

    case 'javascript':
    default:
      return `${arrayName}.forEach((${variable}) => {\n${indentedBody}\n});`;
  }
};
const generateBreakCode = (lang) => {
  switch (lang) {
    case 'python':
      return 'break';
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return 'break;';
  }
};
const generateContinueCode = (lang) => {
  switch (lang) {
    case 'python':
      return 'continue';
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return 'continue;';
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
const generateMathFunctionCode = (data, lang) => {
  const func = data.function || 'abs';
  const value = data.value || '0';
  const result = data.result || 'result';

  // Mapping function names for different languages if needed
  const funcMap = {
    python: {
      abs: 'abs',
      ceil: 'math.ceil',
      floor: 'math.floor',
      round: 'round',
      sqrt: 'math.sqrt',
      pow: 'pow',
      sin: 'math.sin',
      cos: 'math.cos',
      tan: 'math.tan',
      log: 'math.log',
      random: 'random.random()'  // random() doesn't take input
    },
    java: {
      abs: 'Math.abs',
      ceil: 'Math.ceil',
      floor: 'Math.floor',
      round: 'Math.round',
      sqrt: 'Math.sqrt',
      pow: 'Math.pow',
      sin: 'Math.sin',
      cos: 'Math.cos',
      tan: 'Math.tan',
      log: 'Math.log',
      random: 'Math.random()' // no input
    },
    cpp: {
      abs: 'abs',
      ceil: 'ceil',
      floor: 'floor',
      round: 'round',
      sqrt: 'sqrt',
      pow: 'pow',
      sin: 'sin',
      cos: 'cos',
      tan: 'tan',
      log: 'log',
      random: '((double)rand() / RAND_MAX)' // no input
    },
    c: {
      abs: 'abs',
      ceil: 'ceil',
      floor: 'floor',
      round: 'round',
      sqrt: 'sqrt',
      pow: 'pow',
      sin: 'sin',
      cos: 'cos',
      tan: 'tan',
      log: 'log',
      random: '((double)rand() / RAND_MAX)' // no input
    },
    javascript: {
      abs: 'Math.abs',
      ceil: 'Math.ceil',
      floor: 'Math.floor',
      round: 'Math.round',
      sqrt: 'Math.sqrt',
      pow: 'Math.pow',
      sin: 'Math.sin',
      cos: 'Math.cos',
      tan: 'Math.tan',
      log: 'Math.log',
      random: 'Math.random()' // no input
    }
  };

  const mappedFunc = (funcMap[lang] && funcMap[lang][func]) || func;

  // Special handling for functions with no input argument e.g. random
  if (func === 'random') {
    switch (lang) {
      case 'python':
        return `import random\n${result} = ${mappedFunc}`;
      case 'java':
      case 'cpp':
      case 'c':
      case 'javascript':
      default:
        return `${result} = ${mappedFunc};`;
    }
  }

  switch (lang) {
    case 'python':
      return `${result} = ${mappedFunc}(${value})`;
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return `${result} = ${mappedFunc}(${value});`;
  }
};


const generateIncrementCode = (data, lang) => {
  const variable = data.variable || 'counter';

  switch (lang) {
    case 'python':
      return `${variable} += 1`;
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return `${variable}++;`;
  }
};

const generateDecrementCode = (data, lang) => {
  const variable = data.variable || 'counter';

  switch (lang) {
    case 'python':
      return `${variable} -= 1`;
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return `${variable}--;`;
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
