import Component from "../loadComponents";

const Field: Component = {
  name: "Field",
  factory: (container) => {
    container.element.innerHTML = "<div>Это компонент A</div>";
  },
};

export default Field;
