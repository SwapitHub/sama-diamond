"use client"
import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [helpData, setHelpData] = useState({});

  return (
    <DataContext.Provider value={{ helpData, setHelpData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);