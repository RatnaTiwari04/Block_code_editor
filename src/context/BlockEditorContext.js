import { createContext, useContext } from 'react';

const BlockEditorContext = createContext(null);

export const useBlockEditor = () => useContext(BlockEditorContext);

export default BlockEditorContext;
