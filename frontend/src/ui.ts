export function setupDropdownToggle(): void {
  const buttonList = document.querySelector<HTMLDivElement>("#buttonList");
  const toggleButton =
    document.querySelector<HTMLButtonElement>("#toggleButton");

  if (!buttonList || !toggleButton) {
    console.warn("UI elements not found");
    return;
  }

  toggleButton.addEventListener("click", () => {
    const isHidden =
      buttonList.style.display === "none" || buttonList.style.display === "";

    if (isHidden) {
      buttonList.style.display = "block";
      toggleButton.textContent = "Hide templates ▲";
    } else {
      buttonList.style.display = "none";
      toggleButton.textContent = "Layout templates ▼";
    }
  });
}
