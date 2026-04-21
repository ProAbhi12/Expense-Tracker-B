import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const getStoredTheme = () => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("theme");
  return saved === "light" || saved === "dark" || saved === "gradient" ? saved : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme); // "light", "dark", "gradient"

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== "theme") return;

      const nextTheme = event.newValue;
      if (nextTheme === "light" || nextTheme === "dark" || nextTheme === "gradient") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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