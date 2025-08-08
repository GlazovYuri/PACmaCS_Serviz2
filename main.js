import { GoldenLayout } from "golden-layout";
import "./styles.css";
import { components } from "./components.js";

const layout = new GoldenLayout(document.getElementById("layoutContainer"));

components.forEach((c) => {
  layout.registerComponentFactoryFunction(c.type, c.factory);
});

const startConfig = {
  root: {
    type: "row",
    content: components.map((c) => ({
      type: "component",
      componentType: c.type,
      title: c.label,
      componentState: {},
    })),
  },
};

layout.loadLayout(startConfig);

layout.registerComponentFactoryFunction("example", (container, state) => {
  container.element.innerHTML = `<h2>${state.text}</h2>`;
});

window.addEventListener("resize", () => {
  layout.setSize();
});

const state = components.map(() => ({ visible: true }));

function renderMenu() {
  const ul = document.getElementById("menu");
  ul.innerHTML = "";
  components.forEach((item, idx) => {
    const li = document.createElement("li");
    const ck = document.createElement("input");
    ck.type = "checkbox";
    ck.checked = state[idx].visible;
    ck.addEventListener("change", () => toggleComponent(idx));
    li.append(ck, document.createTextNode(item.label));
    ul.append(li);
  });
}

function toggleComponent(idx) {
  const item = components[idx];
  if (!state[idx].visible) {
    layout.root.addChild({
      type: "component",
      componentType: item.type,
      title: item.label,
      componentState: {},
    });
    state[idx].visible = true;
  } else {
    const toRemove = layout.root.getItemsByFilter(
      (ci) => ci.type === "component" && ci.componentType === item.type
    );
    toRemove.forEach((ci) => ci.remove());
    state[idx].visible = false;
  }
  renderMenu();
}

renderMenu();
