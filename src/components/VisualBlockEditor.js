import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';
import BlockPalette from './BlockPalette';
import Block from './Block';
import { BLOCK_TYPES } from '../utils/blockTypes';
import { generateCode } from '../utils/codeGenerator';
import axios from 'axios';

const VisualBlockEditor = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('// Drag blocks from the sidebar to start coding!');
  const [output, setOutput] = useState('Click "Run Code" to see output...');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [projectTitle, setProjectTitle] = useState('');   // NEW: project title
  const canvasRef = useRef(null);

  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: uuidv4(),
      type: blockType,
      position: { 
        x: 100 + (blocks.length * 30), 
        y: 100 + (blocks.length * 30) 
      },
      data: {}
    };
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setSelectedBlock(newBlock.id);
  }, [blocks.length]);

  const updateBlock = useCallback((blockId, updates) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  }, []);

  const deleteBlock = useCallback((blockId) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  const clearCanvas = useCallback(() => {
    setBlocks([]);
    setSelectedBlock(null);
    setGeneratedCode('// Drag blocks from the sidebar to start coding!');
    setOutput('Click "Run Code" to see output...');
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setSelectedBlock(null);
    }
  }, []);

  useEffect(() => {
    const code = generateCode(blocks, selectedLanguage);
    setGeneratedCode(code);
  }, [blocks, selectedLanguage]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    try {
      const response = await fetch('http://localhost:5000/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: generatedCode, language: selectedLanguage }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setIsRunning(false);
  };

  const saveProject = async () => {
    if (!projectTitle) {
      alert('Please enter a project title.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects',{
        title: projectTitle,code: generatedCode,language: selectedLanguage},{
        headers: { Authorization: token }
      });
      alert('Project saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    }
  };

  return (
    <div className="block-editor">
      <BlockPalette onAddBlock={addBlock} />
      
      <div className="main-content">
        <div className="header">
          <h1>🧩 Block Code Editor</h1>
          <div className="header-buttons">
            <input
              type="text"
              placeholder="Project title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              style={{ padding: '5px', fontSize: '14px' }}
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>

            <button onClick={clearCanvas} className="btn btn-danger">
              Clear All
            </button>
            <button onClick={runCode} disabled={isRunning} className="btn btn-success">
              {isRunning ? '⏳ Running...' : '▶️ Run Code'}
            </button>
            <button onClick={saveProject} className="btn btn-primary">
              💾 Save Project
            </button>
          </div>
        </div>

        <div className="workspace">
          <div className="canvas-area">
            <div 
              ref={canvasRef}
              className="canvas"
              onClick={handleCanvasClick}
            >
              {blocks.map((block) => (
                <Block
                  key={block.id}
                  block={block}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                  isSelected={selectedBlock === block.id}
                  onSelect={setSelectedBlock}
                />
              ))}
            </div>
          </div>
          
          <div className="editor-panel">
            <div className="editor-header">
              📝 Generated Code ({selectedLanguage})
            </div>
            <div className="monaco-editor-container">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={generatedCode}
                theme="vs-dark"
                options={{
                  readOnly: false,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true
                }}
              />
            </div>
            
            <div className="output-panel">
              <div className="output-header">
                💻 Console Output
              </div>
              <div className="output-content">
                {output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualBlockEditor;
