import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [english, setEnglish] = useState(false);

  return (
    <LanguageContext.Provider value={{ english, setEnglish }}>
      {children}
    </LanguageContext.Provider>
  );
};