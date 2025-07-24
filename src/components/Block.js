import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BLOCK_TYPES } from '../utils/blockTypes';

const Block = ({ block, onUpdate, onDelete, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(block.data || {});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const blockRef = useRef(null);

  const blockType = BLOCK_TYPES[block.type];

  const handleMouseDown = useCallback((e) => {
    // Don't start dragging if clicking on an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const rect = blockRef.current.getBoundingClientRect();
    const parentRect = blockRef.current.offsetParent.getBoundingClientRect();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (rect.left - parentRect.left),
      y: e.clientY - (rect.top - parentRect.top)
    });
    
    onSelect(block.id);
  }, [block.id, onSelect]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const parentRect = blockRef.current.offsetParent.getBoundingClientRect();
    const newPosition = {
      x: Math.max(0, e.clientX - parentRect.left - dragStart.x),
      y: Math.max(0, e.clientY - parentRect.top - dragStart.y)
    };
    
    onUpdate(block.id, { position: newPosition });
  }, [isDragging, dragStart, block.id, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDataChange = useCallback((key, value) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    onUpdate(block.id, { data: newData });
  }, [localData, block.id, onUpdate]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(block.id);
  }, [block.id, onDelete]);

  const handleBlockClick = useCallback((e) => {
    e.stopPropagation();
    onSelect(block.id);
  }, [block.id, onSelect]);

  if (!blockType) {
    return null;
  }

  return (
    <div
      ref={blockRef}
      className={`block block-${blockType.id} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: block.position.x,
        top: block.position.y,
        zIndex: isDragging ? 1000 : isSelected ? 100 : 10
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={handleBlockClick}
    >
      {/* Connection points */}
      {blockType.inputs && blockType.inputs.length > 0 && (
        <div className="connection-input" title="Input connection" />
      )}
      
      {blockType.outputs && blockType.outputs.length > 0 && (
        <div className="connection-output" title="Output connection" />
      )}

      {/* Block header */}
      <div className="block-header">
        <span className="block-title">
          {blockType.icon} {blockType.label}
        </span>
        <button 
          className="block-close"
          onClick={handleDelete}
          title="Delete block"
        >
          ×
        </button>
      </div>

      {/* Block inputs */}
      {blockType.fields && blockType.fields.map((field) => (
        <div key={field.name} className="block-input">
          <label className="block-label">{field.label}:</label>
          {field.type === 'textarea' ? (
            <textarea
              className="block-field"
              placeholder={field.placeholder}
              value={localData[field.name] || ''}
              onChange={(e) => handleDataChange(field.name, e.target.value)}
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <input
              type={field.type || 'text'}
              className="block-field"
              placeholder={field.placeholder}
              value={localData[field.name] || ''}
              onChange={(e) => handleDataChange(field.name, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      ))}

      {/* Special message for empty blocks */}
      {(!blockType.fields || blockType.fields.length === 0) && (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
          Double-click to configure
        </div>
      )}
    </div>
  );
};

export default Block;