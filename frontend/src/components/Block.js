import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { BLOCK_TYPES } from '../utils/blockTypes';
import COLORS from '../styles/colors';

const Block = ({ block, onUpdate, onDelete, isSelected, onSelect }) => {
  const [localData, setLocalData] = useState(block.data || {});
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const blockRef = useRef(null);

  const blockType = BLOCK_TYPES[block.type];

  // Assign a consistent random color on mount
  const randomColor = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);

  /** Toggle minimize/expand */
  const toggleMinimize = useCallback((e) => {
    e.stopPropagation();
    setIsMinimized(prev => !prev);
  }, []);

  /** Start dragging */
  const handleMouseDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
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

  /** Update position during dragging */
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

  /** Stop dragging */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Later: add snap or connector update logic
  }, []);

  /** Add/remove global listeners on drag */
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

  /** Change block field data */
  const handleDataChange = useCallback((key, value) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    onUpdate(block.id, { data: newData });
  }, [localData, block.id, onUpdate]);

  /** Delete block */
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(block.id);
  }, [block.id, onDelete]);

  /** Select block */
  const handleBlockClick = useCallback((e) => {
    e.stopPropagation();
    onSelect(block.id);
  }, [block.id, onSelect]);

  if (!blockType) return null;

  return (
    <div
      ref={blockRef}
      data-id={block.id} // useful for connectors
      className={`block block-${blockType.id} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        left: block.position.x,
        top: block.position.y,
        zIndex: isDragging ? 1000 : isSelected ? 100 : 10,
        backgroundColor: randomColor,
        transition: 'height 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => e.stopPropagation()}
      onClick={handleBlockClick}
    >
      {/* Visual connection dots */}
      {blockType.inputs?.length > 0 && (
        <div className="connection-input" title="Input connection" />
      )}
      {blockType.outputs?.length > 0 && (
        <div className="connection-output" title="Output connection" />
      )}

      {/* Header with title & buttons */}
      <div className="block-header">
        <span className="block-title">
          {blockType.icon} {blockType.label}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="block-minimize"
            onClick={toggleMinimize}
            title={isMinimized ? "Expand block" : "Minimize block"}>
            {isMinimized ? '🔽' : '🔼'}
          </button>
          <button
            className="block-close"
            onClick={handleDelete}
            title="Delete block">
            ×
          </button>
        </div>
      </div>

      {/* Block fields */}
      {!isMinimized && (
        <>
          {blockType.fields?.length > 0 ? blockType.fields.map((field) => (
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
          )) : (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              Double-click to configure
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Block;
