import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  return saved === "dark";
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook (clean usage)
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);