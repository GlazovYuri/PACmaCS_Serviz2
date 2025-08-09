import { GoldenLayout, ComponentContainer, LayoutConfig } from "golden-layout";
import "./styles.css";
import { components } from "./components.js";

const menuContainerElement = document.querySelector("#menuContainer");
const layoutElement: HTMLElement | null =
  document.querySelector("#layoutContainer");

if (menuContainerElement && layoutElement) {
  const goldenLayout = new GoldenLayout(layoutElement);

  components.forEach((c) => {
    goldenLayout.registerComponentFactoryFunction(c.type, c.factory);

    const newItem = document.createElement("li");
    newItem.textContent = c.type;
    menuContainerElement.appendChild(newItem);

    newItem.addEventListener("click", () => {
      goldenLayout.addComponent(c.type, c.factory);
    });
  });

  class MyComponent {
    rootElement: HTMLElement;

    constructor(public container: ComponentContainer) {
      this.rootElement = container.element;
      this.rootElement.innerHTML =
        "<h2>" + "Component Type: MyComponent" + "</h2>";
    }
  }

  const myLayout: LayoutConfig = {
    root: {
      type: "row",
      content: [],
    },
  };

  window.addEventListener("resize", () => {
    goldenLayout.updateRootSize();
  });


  goldenLayout.registerComponentConstructor("MyComponent", MyComponent);

  goldenLayout.loadLayout(myLayout);
}
