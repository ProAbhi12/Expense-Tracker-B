import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // "light", "dark", "gradient"

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "gradient";
      return "light";
    });
  };

  const setThemeMode = (mode) => {
    if (mode === "light" || mode === "dark" || mode === "gradient") {
      setTheme(mode);
    }
  };

  const dark = theme === "dark";
  const gradient = theme === "gradient";

  return (
    <ThemeContext.Provider value={{ dark, gradient, theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook (clean usage)
export const useTheme = () => useContext(ThemeContext);