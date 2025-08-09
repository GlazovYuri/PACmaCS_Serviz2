import { GoldenLayout, LayoutConfig } from "golden-layout";
import "./styles.css";
import { components } from "./components.js";

const menuContainerElement = document.querySelector("#menuContainer");
const layoutElement: HTMLElement | null =
  document.querySelector("#layoutContainer");

if (menuContainerElement && layoutElement) {
  const goldenLayout = new GoldenLayout(layoutElement);

  const defaultConfig: LayoutConfig = {
    root: {
      type: "row",
      content: [],
    },
  };

  var savedState = localStorage.getItem("savedState");
  var layoutConfig: LayoutConfig;

  if (savedState) {
    console.log("Previous state restored");
    const resolvedConfig = JSON.parse(savedState);
    layoutConfig = LayoutConfig.fromResolved(resolvedConfig);
  } else {
    console.log("No saved state, loading default layout");
    layoutConfig = defaultConfig;
  }

  components.forEach((c) => {
    goldenLayout.registerComponentFactoryFunction(c.type, c.factory);

    const newItem = document.createElement("li");
    newItem.textContent = c.type;
    menuContainerElement.appendChild(newItem);

    newItem.addEventListener("click", () => {
      goldenLayout.addComponent(c.type, c.factory);
    });
  });

  window.addEventListener("resize", () => {
    goldenLayout.updateRootSize();
  });

  goldenLayout.on("stateChanged", function () {
    const state = goldenLayout.saveLayout();
    localStorage.setItem("savedState", JSON.stringify(state));
  });

  goldenLayout.loadLayout(layoutConfig);
}
