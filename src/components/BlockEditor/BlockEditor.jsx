// src/components/BlockEditor/BlockEditor.jsx
import React, { useState, useEffect } from 'react';
import Block from './Block';
import BlockPalette from './BlockPalette';
import Editor from '@monaco-editor/react';
import generateCode from '../../utils/codeGenerator';
import { BLOCK_TYPES } from './BlockTypes/Constants';

export { BLOCK_TYPES };

const BlockEditor = () => {
  const [blocks, setBlocks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('// Drag blocks to generate code');
  const [output, setOutput] = useState('');

  const addBlock = (typeId) => {
    const type = BLOCK_TYPES[typeId];
    setBlocks((prev) => [
      ...prev,
      {
        ...type,
        id: `${typeId}_${Date.now()}`,
        position: { x: 20, y: 20 + prev.length * 60 },
        data: {},
        label: type.label,
        color: type.color,
      },
    ]);
  };

  const updateBlock = (id, updates) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selected === id) setSelected(null);
  };

  useEffect(() => {
    setCode(generateCode(blocks));
  }, [blocks]);

  const runCode = () => {
    try {
      // eslint-disable-next-line no-eval
      eval(code);
      setOutput('Executed successfully');
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="h-screen flex">
      <BlockPalette onAddBlock={addBlock} />
      <div className="relative flex-1 bg-white border-r">
        {blocks.map((b) => (
          <Block
            key={b.id}
            block={b}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
            onSelect={setSelected}
            isSelected={selected === b.id}
          />
        ))}
      </div>
      <div className="w-1/2 flex flex-col">
        <button
          onClick={runCode}
          className="m-2 bg-green-500 text-white py-2 rounded"
        >
          Run Code
        </button>
        <Editor
          height="60%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          options={{ readOnly: false }}
        />
        <pre className="p-2 bg-gray-900 text-green-400 flex-1 overflow-auto">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default BlockEditor;
