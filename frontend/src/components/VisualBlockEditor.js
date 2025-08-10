import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(true);
  const canvasRef = useRef(null);

  // Positioning constants
  const blockWidth = 180;
  const blockHeight = 140;
  const startX = 50;
  const startY = 50;
  const gapX = 20;
  const gapY = 20;

  // Reposition all blocks based on current canvas width
  const repositionBlocks = useCallback((blocksToPosition) => {
    const canvas = canvasRef.current;
    if (!canvas) return blocksToPosition;

    const canvasWidth = canvas.offsetWidth - startX;
    const blocksPerRow = Math.max(1, Math.floor(canvasWidth / (blockWidth + gapX)));

    return blocksToPosition.map((block, index) => {
      const col = index % blocksPerRow;
      const row = Math.floor(index / blocksPerRow);

      return {
        ...block,
        position: {
          x: startX + col * (blockWidth + gapX),
          y: startY + row * (blockHeight + gapY),
        }
      };
    });
  }, [blockWidth, blockHeight, startX, startY, gapX, gapY]);

  // Add a new block and reposition all blocks
  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: uuidv4(),
      type: blockType,
      position: { x: 0, y: 0 }, // temporary, will reposition below
      data: {},
    };

    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks, newBlock];
      const repositioned = repositionBlocks(newBlocks);
      return repositioned;
    });

    setSelectedBlock(newBlock.id);

    setConnections(prev => {
      if (blocks.length === 0) return prev;
      const lastBlock = blocks[blocks.length - 1];
      return [...prev, { from: lastBlock.id, to: newBlock.id }];
    });

  }, [blocks.length, repositionBlocks, blocks]);

  // Update a block
  const updateBlock = useCallback((blockId, updates) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, []);

  // Delete a block and update connections
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

  // Reposition blocks on editor panel toggle
  useEffect(() => {
    setBlocks(prev => repositionBlocks(prev));
  }, [isEditorPanelOpen, repositionBlocks]);

  // Optional: reposition on window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setBlocks(prev => repositionBlocks(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [repositionBlocks]);

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

  const toggleEditorPanel = () => {
    setIsEditorPanelOpen(prev => !prev);
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
          <div
            className="canvas-area"
            style={{
              flex: isEditorPanelOpen ? '1' : '1 1 100%',
              transition: 'all 0.3s ease'
            }}
          >
            <div ref={canvasRef} className="canvas" onClick={handleCanvasClick}>
              <svg style={{ position: 'absolute', width: '100%', minHeight: '2000px', pointerEvents: 'none' }}>
                {connections.map((conn, idx) => {
                  const from = blocks.find(b => b.id === conn.from);
                  const to = blocks.find(b => b.id === conn.to);
                  if (!from || !to) return null;
                  return (
                    <path
                      key={idx}
                      d={`
                        M ${from.position.x + 100},${from.position.y + 65} 
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
          <button
            onClick={toggleEditorPanel}
            style={{
              position: 'absolute',
              right: isEditorPanelOpen ? '400px' : '0px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#2c3e50',
              color: 'white',
              border: 'none',
              padding: '12px 6px',
              borderRadius: '6px 0 0 6px',
              cursor: 'pointer',
              zIndex: 1000,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.2)'
            }}
            title={isEditorPanelOpen ? "Hide Code Panel" : "Show Code Panel"}
          >
            {isEditorPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div
            style={{
              width: isEditorPanelOpen ? '400px' : '0px',
              opacity: isEditorPanelOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              borderLeft: isEditorPanelOpen ? '1px solid #ddd' : 'none'
            }}
          >
            <div style={{
              background: '#2c3e50',
              color: 'white',
              padding: '10px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              📝 Generated Code ({selectedLanguage})
            </div>
            <div style={{ flex: 1, minHeight: '300px' }}>
              <Editor
                height="100%"
                language={selectedLanguage}
                value={generatedCode}
                theme="vs-dark"
                options={{ readOnly: false, minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>
            <div style={{ borderTop: '1px solid #ddd' }}>
              <div style={{
                background: '#34495e',
                color: 'white',
                padding: '8px 10px',
                fontWeight: 'bold',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>
                💻 Console Output
              </div>
              <div style={{
                padding: '10px',
                background: '#0c0c0c',
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                height: '150px',
                overflowY: 'auto',
                color: '#56E01C'
              }}>
                {output}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default VisualBlockEditor;
