import { createContext, useContext, useState, ReactNode } from "react";

type YearContextType = {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useSelectedYear = () => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useSelectedYear must be used within a YearProvider");
  }
  return context;
};
