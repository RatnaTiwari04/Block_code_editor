import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';
import BlockPalette from './BlockPalette';
import Block from './Block';
import { generateCode } from '../utils/codeGenerator';
import axios from 'axios';
import Chatbot from './Chatbot';

const VisualBlockEditor = () => {
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('// Drag blocks from the sidebar to start coding!');
  const [output, setOutput] = useState('Click "Run Code" to see output...');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [projectTitle, setProjectTitle] = useState('');
  const canvasRef = useRef(null);

  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: uuidv4(),
      type: blockType,
      position: {
        x: 100 + (blocks.length * 100),
        y: 100 + (blocks.length * 60)
      },
      data: {}
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock.id);

    if (blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1];
      setConnections(prev => [...prev, { from: lastBlock.id, to: newBlock.id }]);
    }
  }, [blocks]);

  const updateBlock = useCallback((blockId, updates) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, []);

  const deleteBlock = useCallback((blockId) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));

    setConnections(prev => {
      const toRemove = prev.filter(conn => conn.from === blockId || conn.to === blockId);

      let updated = prev.filter(conn => conn.from !== blockId && conn.to !== blockId);
      const incoming = toRemove.find(conn => conn.to === blockId);
      const outgoing = toRemove.find(conn => conn.from === blockId);

      if (incoming && outgoing) {
        updated.push({ from: incoming.from, to: outgoing.to });
      }

      return updated;
    });

    if (selectedBlock === blockId) setSelectedBlock(null);
  }, [selectedBlock]);

  const clearCanvas = useCallback(() => {
    setBlocks([]);
    setConnections([]);
    setSelectedBlock(null);
    setGeneratedCode('// Drag blocks from the sidebar to start coding!');
    setOutput('Click "Run Code" to see output...');
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) setSelectedBlock(null);
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
        body: JSON.stringify({ code: generatedCode, language: selectedLanguage })
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setIsRunning(false);
  };

  const saveProject = async () => {
    if (!projectTitle) return alert('Please enter a project title.');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', {
        title: projectTitle,
        code: generatedCode,
        language: selectedLanguage
      }, {
        headers: { Authorization: token }
      });
      alert('Project saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save project. Please Login First');
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
              style={{ padding: '5px', fontSize: '14px', border: '2px solid black', borderRadius: '4px' }}
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
            <button onClick={clearCanvas} className="btn btn-danger">Clear All</button>
            <button onClick={runCode} disabled={isRunning} className="btn btn-success">
              {isRunning ? '⏳ Running...' : '▶️ Run Code'}
            </button>
            <button onClick={saveProject} className="btn btn-primary">💾 Save Project</button>
          </div>
        </div>
        <div className="workspace">
          <div className="canvas-area">
            <div ref={canvasRef} className="canvas" onClick={handleCanvasClick}>
              {/* Draw arrows */}
              <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                {connections.map((conn, idx) => {
                  const from = blocks.find(b => b.id === conn.from);
                  const to = blocks.find(b => b.id === conn.to);
                  if (!from || !to) return null;
                  return (
                    <path
                    key={idx}
                    d={`
                      M ${from.position.x + 100},${from.position.y + 80} 
                      C ${from.position.x + 100},${from.position.y + 120}, 
                      ${to.position.x + 100},${to.position.y - 40}, 
                      ${to.position.x + 100},${to.position.y}
                      `}
                      stroke="black"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      />
                  );
                })}
                <defs>
                  <marker
                  id="arrowhead"
                  viewBox="0 0 10 10"
                  refX="5" refY="5"
                  markerWidth="6" markerHeight="6"
                  orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
                    </marker>
                    </defs>
              </svg>
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
            <div className="editor-header">📝 Generated Code ({selectedLanguage})</div>
            <div className="monaco-editor-container">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={generatedCode}
                theme="vs-dark"
                options={{ readOnly: false, minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>
            <div className="output-panel">
              <div className="output-header">💻 Console Output</div>
              <div className="output-content">{output}</div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};
export default VisualBlockEditor;