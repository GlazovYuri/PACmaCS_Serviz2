import { GoldenLayout } from "golden-layout";
import "./styles.css";

const config = {
  content: [
    {
      type: "row",
      content: [
        {
          type: "component",
          componentName: "example",
          componentState: { text: "Left Pane" },
        },
        {
          type: "component",
          componentName: "example",
          componentState: { text: "Right Pane" },
        },
      ],
    },
  ],
};

const layout = new GoldenLayout(document.getElementById("layoutContainer"));

layout.registerComponentFactoryFunction("example", (container, state) => {
  container.element.innerHTML = `<h2>${state.text}</h2>`;
});

layout.loadLayout(config);

window.addEventListener("resize", () => {
  layout.setSize();
});
