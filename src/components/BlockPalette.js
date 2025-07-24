import React from 'react';
import { BLOCK_TYPES } from '../utils/blockTypes';

const BlockPalette = ({ onAddBlock }) => {
  return (
    <div className="sidebar">
      <h3>🔧 Blocks</h3>
      <div className="blocks-list">
        {Object.entries(BLOCK_TYPES).map(([key, blockType]) => (
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
      
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#bdc3c7' }}>
        <p><strong>How to use:</strong></p>
        <ul style={{ paddingLeft: '15px', marginTop: '10px' }}>
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