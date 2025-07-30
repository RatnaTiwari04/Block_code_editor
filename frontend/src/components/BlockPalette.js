import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { BLOCK_TYPES } from '../utils/blockTypes';
import './BlockPalette.css';

const BlockPalette = ({ onAddBlock }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter blocks based on search term
  const filteredBlocks = Object.entries(BLOCK_TYPES).filter(([key, blockType]) =>
    blockType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blockType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar">
      <h3 className="sidebar-header">🔧 Blocks</h3>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block-search"
          />
        </div>
      </div>

      <div className="blocks-list-container">
        <div className="blocks-list">
          {filteredBlocks.map(([key, blockType]) => (
            <button
              key={key}
              onClick={() => onAddBlock(key)}
              className={`block-item block-${blockType.id}`}
              title={blockType.description}
            >
              {blockType.icon} {blockType.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="usage-instructions">
        <p><strong>How to use:</strong></p>
        <ul>
          <li>Click blocks to add them</li>
          <li>Drag blocks around canvas</li>
          <li>Double-click to edit values</li>
          <li>Generated code appears on right</li>
          <li>Click "Run Code" to execute</li>
        </ul>
      </div>
    </div>
  );
};

export default BlockPalette;