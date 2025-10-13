import { createContext, useState } from "react";
export const CursorContext = createContext();
export function CursorProvider({ children }) {
  const [cursorType, setCursorType] = useState("default");
  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  );
}
