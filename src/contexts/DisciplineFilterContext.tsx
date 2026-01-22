import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o tipo para os dados da disciplina
interface Discipline {
  id: string;
  name: string;
}

// Define o tipo para o contexto
interface DisciplineFilterContextType {
  selectedDisciplines: Discipline[];
  setSelectedDisciplines: (disciplines: Discipline[]) => void;
  toggleDiscipline: (discipline: Discipline) => void;
}

// Cria o contexto com um valor padrão
const DisciplineFilterContext = createContext<DisciplineFilterContextType | undefined>(undefined);

// Cria o provedor do contexto
export const DisciplineFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>([]);

  const toggleDiscipline = (discipline: Discipline) => {
    setSelectedDisciplines(prevSelected => {
      const isSelected = prevSelected.some(d => d.id === discipline.id);
      if (isSelected) {
        return prevSelected.filter(d => d.id !== discipline.id);
      } else {
        return [...prevSelected, discipline];
      }
    });
  };

  return (
    <DisciplineFilterContext.Provider value={{ selectedDisciplines, setSelectedDisciplines, toggleDiscipline }}>
      {children}
    </DisciplineFilterContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useDisciplineFilter = () => {
  const context = useContext(DisciplineFilterContext);
  if (context === undefined) {
    throw new Error('useDisciplineFilter must be used within a DisciplineFilterProvider');
  }
  return context;
};
