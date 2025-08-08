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

const layout = new GoldenLayout(
  config,
  document.getElementById("layoutContainer")
);

layout.registerComponent("example", (container, state) => {
  container.element.innerHTML = `<h2>${state.text}</h2>`;
});

layout.init();
