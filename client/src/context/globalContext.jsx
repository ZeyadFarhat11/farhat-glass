import { createContext, useContext, useState } from "react";

const Context = createContext();

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const value = {
    globalLoading: loading,
    setGlobalLoading: setLoading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default function useGlobalContext() {
  return useContext(Context);
}
