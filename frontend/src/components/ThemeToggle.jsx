import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    setDark(isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {dark ? "☀️ Claro" : "🌙 Escuro"}
    </button>
  );
}

export default ThemeToggle;