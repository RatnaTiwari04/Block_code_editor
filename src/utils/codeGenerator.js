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
    case 'STRING':
      return generateStringCode(data,lang);
    case 'BOOLEAN':
      return generateBooleanCode(data,lang);
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
    case 'COMPARISON':
      return generateComparisonCode(data,lang);
    case 'LOGICAL':
      return generateLogicalCode(data,lang);
    case 'STRING_CONCAT':
      return generateStringConcatCode(data,lang);
    case 'STRING_LENGTH':
      return generateStringLengthCode(data,lang);
    case 'SUBSTRING':
      return generateSubstringCode(data,lang);
    case 'ARRAY_LENGTH':
      return generateArrayLengthCode(data,lang);
    case 'ARRAY_PUSH':
      return generateArrayPushCode(data,lang);
    case 'ARRAY_POP':
      return generateArrayPopCode(data,lang);
    case 'ARRAY_SET':
      return generateArraySetCode(data,lang);
    case 'ARRAY_GET':
      return generateArrayGetCode(data,lang);
    case 'INPUT':
      return generateInputCode(data, lang);
    case 'ALERT':
      return generateAlertCode(data,lang);
    case 'TRY_CATCH':
      return generateTryCatchCode(data,lang);
    case 'THROW':
      return generateThrowCode(data,lang);
    case 'DELAY':
      return generateDelayCode(data,lang);
    case 'TIMER':
      return generateTimerCode(data,lang);
    case 'TO_STRING':
      return generateToStringCode(data,lang);
    case 'TO_NUMBER':
      return generateToNumberCode(data,lang);
    case 'TO_BOOLEAN':
      return generateToBooleanCode(data,lang);
    case 'RANDOM':
      return generateRandomCode(data,lang);
    case 'COMMENT':
      return generateCommentCode(data, lang);
    case 'START':
      return generateStartCode(data,lang);
    case 'END':
      return generateEndCode(data,lang);
    default:
      return `// Unknown block type: ${block.type}`;
  }
};
const generateVariableCode = (data, lang) => {
  const name = data.name || 'myVariable';
  const value = data.value || '0';
  const isInteger = Number.isInteger(Number(value));
  const formattedValue = isInteger ? value : `"${value}"`; 

  switch (lang) {
    case 'python':
      return `${name} = ${formattedValue}`;
    case 'java':
      if (isInteger) {
        return `int ${name} = ${formattedValue};`;
      } else {
        return `// Invalid assignment for type 'int'. Only integer values are allowed for 'int'.`;
      }
    case 'cpp':
    case 'c':
      if (isInteger) {
        return `int ${name} = ${formattedValue};`;
      } else {
        return `// Invalid assignment for type 'int'. Only integer values are allowed for 'int'.`;
      }
    default:
      return `let ${name} = ${formattedValue};`; 
  }
};
const generateStringCode = (data, lang) => {
  const name = data.name || 'myString';
  const value = data.value || '';
  const formattedValue = `"${value}"`;

  switch (lang) {
    case 'python':
      return `${name} = ${formattedValue}`;
    case 'java':
      return `String ${name} = ${formattedValue};`;
    case 'cpp':
    case 'c':
      return `std::string ${name} = ${formattedValue};`;
    default:
      return `let ${name} = ${formattedValue};`;
  }
};
const generateBooleanCode = (data, lang) => {
  const name = data.name || 'myBool';
  const value = data.value || 'false';
  const formattedValue = value === 'true' ? 'true' : 'false';

  switch (lang) {
    case 'python':
      return `${name} = ${formattedValue}`;
    case 'java':
      return `boolean ${name} = ${formattedValue};`;
    case 'cpp':
    case 'c':
      return `bool ${name} = ${formattedValue};`;
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
  const args = rawArgs.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0);
  const isNumeric = (val) => !isNaN(val) && val !== '';
  const formatArg = (arg) => {
    if (isNumeric(arg)) return arg;
    if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) return arg;
    return `"${arg}"`;
  };
  const formattedArgs = args.map(formatArg).join(', ');
  const semicolon = (lang === 'python') ? '' : ';';
  const callLine = `${functionName}(${formattedArgs})${semicolon}`;
  const indentedCall = `  ${callLine}`;
  switch (lang) {
    case 'python':
      return indentedCall.trim();
    case 'java':
    case 'cpp':
    case 'c':
    case 'javascript':
    default:
      return indentedCall;
  }
};
const generateReturnCode = (data, lang) => {
  let value = data.value || '';
  const isNumeric = (val) => !isNaN(val) && val !== '';
  const isQuoted = (val) => (val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"));
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
  const indentedThen = thenCode
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : line)
    .join('\n');

  switch (lang) {
    case 'python':
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
const generateComparisonCode = (data, lang) => {
  const left = data.left || 'a';
  const operator = data.operator || '==';
  const right = data.right || 'b';

  let validOp = operator;
  if (lang === 'python' && (operator === '===' || operator === '!==')) {
    validOp = operator === '===' ? '==' : '!=';
  }

  return `${left} ${validOp} ${right}`;
};
const generateLogicalCode = (data, lang) => {
  const left = data.left || 'true';
  const operator = data.operator || '&&';
  const right = data.right || 'false';

  if (operator === '!') {
    return `${operator}${left}`;
  }

  return `${left} ${operator} ${right}`;
};
const generateStringConcatCode = (data, lang) => {
  const left = data.left || '"Hello"';
  const right = data.right || '"World"';
  const result = data.result || 'result';

  switch (lang) {
    case 'python':
      return `${result} = ${left} + ${right}`;
    case 'java':
      return `String ${result} = ${left} + ${right};`;
    case 'cpp':
    case 'c':
      return `// String concat not directly supported in C. Use sprintf or strcat.\nchar ${result}[100];\nsprintf(${result}, "%s%s", ${left}, ${right});`;
    case 'javascript':
    default:
      return `let ${result} = ${left} + ${right};`;
  }
};
const generateStringLengthCode = (data, lang) => {
  const str = data.string || 'myString';
  const result = data.result || 'length';

  switch (lang) {
    case 'python':
      return `${result} = len(${str})`;
    case 'java':
      return `int ${result} = ${str}.length();`;
    case 'cpp':
      return `int ${result} = ${str}.length();`;
    case 'c':
      return `int ${result} = strlen(${str});`;
    case 'javascript':
    default:
      return `let ${result} = ${str}.length;`;
  }
};
const generateSubstringCode = (data, lang) => {
  const str = data.string || 'myString';
  const start = data.start || 0;
  const end = data.end || 5;
  const result = data.result || 'result';

  switch (lang) {
    case 'python':
      return `${result} = ${str}[${start}:${end}]`;
    case 'java':
      return `String ${result} = ${str}.substring(${start}, ${end});`;
    case 'cpp':
      return `std::string ${result} = ${str}.substr(${start}, ${end - start});`;
    case 'c':
      return `// C does not have built-in substring. Use strncpy or manual loop.`;
    case 'javascript':
    default:
      return `let ${result} = ${str}.substring(${start}, ${end});`;
  }
};
const generateArrayLengthCode = (data, lang) => {
  const array = data.array || 'myArray';
  const result = data.result || 'length';

  switch (lang) {
    case 'python':
      return `${result} = len(${array})`;
    case 'java':
      return `int ${result} = ${array}.length;`;
    case 'cpp':
      return `int ${result} = sizeof(${array}) / sizeof(${array}[0]);`;
    case 'c':
      return `int ${result} = sizeof(${array}) / sizeof(${array}[0]);`;
    case 'javascript':
    default:
      return `let ${result} = ${array}.length;`;
  }
};
const generateArrayPushCode = (data, lang) => {
  const arrayName = data.array || 'myArray'; // Default array name
  const value = data.value || 'newValue'; // Default value to add

  switch (lang) {
    case 'python':
      return `${arrayName}.append(${value})`; // Python: append to list
    case 'java':
      return `${arrayName}.add(${value});`; // Java: add to ArrayList
    case 'cpp':
    case 'c':
      return `${arrayName}.push_back(${value});`; // C++: push to vector
    default:
      return `${arrayName}.push(${value});`; // JavaScript: push to array
  }
};
const generateArrayPopCode = (data, lang) => {
  const arrayName = data.array || 'myArray'; // Default array name
  const resultName = data.result || 'removedValue'; // Default variable to store popped value

  switch (lang) {
    case 'python':
      return `${resultName} = ${arrayName}.pop()`; // Python: pop from list
    case 'java':
      return `${resultName} = ${arrayName}.remove(${arrayName}.size() - 1);`; // Java: remove last element from ArrayList
    case 'cpp':
    case 'c':
      return `auto ${resultName} = ${arrayName}.back(); ${arrayName}.pop_back();`; // C++: pop from vector
    default:
      return `let ${resultName} = ${arrayName}.pop();`; // JavaScript: pop from array
  }
};
const generateArrayGetCode = (data, lang) => {
  const arrayName = data.array || 'myArray'; // Default array name
  const index = data.index || 0; // Default index is 0
  const resultName = data.result || 'value'; // Default variable to store the fetched value

  switch (lang) {
    case 'python':
      return `${resultName} = ${arrayName}[${index}]`; // Python: access list by index
    case 'java':
      return `${resultName} = ${arrayName}.get(${index});`; // Java: access ArrayList by index
    case 'cpp':
    case 'c':
      return `auto ${resultName} = ${arrayName}[${index}];`; // C++: access vector by index
    default:
      return `let ${resultName} = ${arrayName}[${index}];`; // JavaScript: access array by index
  }
};
const generateArraySetCode = (data, lang) => {
  const arrayName = data.array || 'myArray'; // Default array name
  const index = data.index || 0; // Default index is 0
  const value = data.value || 'newValue'; // Default value to set

  switch (lang) {
    case 'python':
      return `${arrayName}[${index}] = ${value}`; // Python: set list element by index
    case 'java':
      return `${arrayName}.set(${index}, ${value});`; // Java: set ArrayList element by index
    case 'cpp':
    case 'c':
      return `${arrayName}[${index}] = ${value};`; // C++: set vector element by index
    default:
      return `${arrayName}[${index}] = ${value};`; // JavaScript: set array element by index
  }
};
const generateInputCode = (data, lang) => {
  const promptMessage = data.prompt || 'Enter your input:'; // Default prompt message
  const variableName = data.variable || 'userInput'; // Default variable name

  switch (lang) {
    case 'python':
      return `${variableName} = input("${promptMessage}")`; // Python: get input using input()
    case 'java':
      return `Scanner scanner = new Scanner(System.in);\n${variableName} = scanner.nextLine();`; // Java: use Scanner to get input
    case 'cpp':
    case 'c':
      return `#include <iostream>\n#include <string>\nstd::string ${variableName};\nstd::cout << "${promptMessage}";\nstd::getline(std::cin, ${variableName});`; // C++: use getline for input
    default:
      return `let ${variableName} = prompt("${promptMessage}");`;
  }
};
const generateAlertCode = (data, lang) => {
  const message = data.message || 'Alert message';

  switch (lang) {
    case 'python':
      return `print("${message}")`; // Python: print message
    case 'java':
      return `JOptionPane.showMessageDialog(null, "${message}");`; // Java: show message dialog
    case 'cpp':
      return `std::cout << "${message}" << std::endl;`; // C++: print message to console
    default:
      return `alert("${message}");`; // JavaScript: show alert
  }
};
const generateTryCatchCode = (data, lang) => {
  const tryBlock = data.try || 'risky code here';
  const catchBlock = data.catch || 'handle error here';
  const finallyBlock = data.finally || ''; // Finally block is optional

  switch (lang) {
    case 'python':
      return `try:\n  ${tryBlock}\nexcept Exception as e:\n  ${catchBlock}\nfinally:\n  ${finallyBlock}`;
    case 'java':
      return `try {\n  ${tryBlock}\n} catch (Exception e) {\n  ${catchBlock}\n} finally {\n  ${finallyBlock}\n}`;
    case 'cpp':
    case 'c':
      return `try {\n  ${tryBlock}\n} catch (const std::exception& e) {\n  ${catchBlock}\n} finally {\n  ${finallyBlock}\n}`;
    default:
      return `try {\n  ${tryBlock}\n} catch (error) {\n  ${catchBlock}\n} finally {\n  ${finallyBlock}\n}`;
  }
};
const generateThrowCode = (data, lang) => {
  const message = data.message || 'Something went wrong';

  switch (lang) {
    case 'python':
      return `raise Exception("${message}")`; // Python: raise an exception
    case 'java':
      return `throw new Exception("${message}");`; // Java: throw an exception
    case 'cpp':
    case 'c':
      return `throw std::runtime_error("${message}");`; // C++: throw runtime error
    default:
      return `throw new Error("${message}");`; // JavaScript: throw an error
  }
};
const generateDelayCode = (data, lang) => {
  const duration = data.duration || 1000; // Default to 1000ms

  switch (lang) {
    case 'python':
      return `import time\n time.sleep(${duration / 1000})`; // Python: sleep for duration (converted to seconds)
    case 'java':
      return `Thread.sleep(${duration});`; // Java: sleep for duration in milliseconds
    case 'cpp':
    case 'c':
      return `#include <chrono>\n#include <thread>\nstd::this_thread::sleep_for(std::chrono::milliseconds(${duration}));`; // C++: sleep for duration
    default:
      return `setTimeout(() => {}, ${duration});`; // JavaScript: wait using setTimeout
  }
};
const generateTimerCode = (data, lang) => {
  const duration = data.duration || 1000; // Default to 1000ms
  const callback = data.callback || 'console.log("Timer finished");';

  switch (lang) {
    case 'python':
      return `import time\n time.sleep(${duration / 1000})\n${callback}`; // Python: wait for duration and execute code
    case 'java':
      return `new java.util.Timer().schedule(new java.util.TimerTask() {\n  public void run() {\n    ${callback}\n  }\n}, ${duration});`; // Java: use Timer to execute code
    case 'cpp':
    case 'c':
      return `std::this_thread::sleep_for(std::chrono::milliseconds(${duration}));\n${callback}`; // C++: sleep and execute callback
    default:
      return `setTimeout(() => { ${callback} }, ${duration});`; // JavaScript: execute code after delay
  }
};
const generateToStringCode = (data, lang) => {
  const value = data.value || '42';
  const result = data.result || 'stringValue';

  switch (lang) {
    case 'python':
      return `${result} = str(${value})`; // Python: convert to string using str()
    case 'java':
      return `${result} = String.valueOf(${value});`; // Java: convert to string using String.valueOf()
    case 'cpp':
    case 'c':
      return `std::string ${result} = std::to_string(${value});`; // C++: convert to string using to_string()
    default:
      return `let ${result} = String(${value});`; // JavaScript: convert to string using String()
  }
};
const generateToNumberCode = (data, lang) => {
  const value = data.value || '"42"'; // Default to string "42"
  const result = data.result || 'numberValue';

  switch (lang) {
    case 'python':
      return `${result} = float(${value})`; // Python: convert to float
    case 'java':
      return `${result} = Integer.parseInt(${value});`; // Java: convert to integer using parseInt()
    case 'cpp':
    case 'c':
      return `int ${result} = std::stoi(${value});`; // C++: convert to integer using stoi()
    default:
      return `let ${result} = Number(${value});`; // JavaScript: convert to number using Number()
  }
};
const generateToBooleanCode = (data, lang) => {
  const value = data.value || '1'; // Default to "1"
  const result = data.result || 'boolValue';

  switch (lang) {
    case 'python':
      return `${result} = bool(${value})`; // Python: convert to boolean using bool()
    case 'java':
      return `${result} = Boolean.parseBoolean(${value});`; // Java: convert to boolean using parseBoolean()
    case 'cpp':
    case 'c':
      return `bool ${result} = (${value} != 0);`; // C++: convert to boolean using comparison
    default:
      return `let ${result} = Boolean(${value});`; // JavaScript: convert to boolean using Boolean()
  }
};
const generateRandomCode = (data, lang) => {
  const min = data.min || 0; // Default minimum value is 0
  const max = data.max || 100; // Default maximum value is 100
  const result = data.result || 'randomValue'; // Default result variable name

  switch (lang) {
    case 'python':
      return `${result} = random.randint(${min}, ${max})`; // Python: random.randint for range
    case 'java':
      return `${result} = (int)(Math.random() * (${max} - ${min} + 1)) + ${min}`; // Java: generate random integer in range
    case 'cpp':
    case 'c':
      return `#include <cstdlib>\n#include <ctime>\nstd::srand(std::time(0));\n${result} = std::rand() % (${max} - ${min} + 1) + ${min};`; // C++: use std::rand to generate random number
    default:
      return `${result} = Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min};`; // JavaScript: Math.random for random number
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
const generateStartCode = (data, lang) => {
  switch (lang) {
    case 'python':
      return `# Program Start`;
    case 'java':
      return `public class Main { public static void main(String[] args) {`;
    case 'cpp':
    case 'c':
      return `#include <iostream>\nint main() {`;
    default:
      return `function start() {`;
  }
};
const generateEndCode = (data, lang) => {
  switch (lang) {
    case 'python':
      return `# Program End\n`;
    case 'java':
      return `}`;
    case 'cpp':
    case 'c':
      return `return 0;\n}`;
    default:
      return `}`;
  }
};
