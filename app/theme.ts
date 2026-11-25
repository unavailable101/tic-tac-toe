const storageKey = "tic-tac-toe-theme";

export const initializeTheme = `
  try {
    const theme = localStorage.getItem(${JSON.stringify(storageKey)});
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch {}
`;

export function toggleTheme() {
  const root = document.documentElement;
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;

  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The toggle still works for this page when storage is unavailable.
  }
}
