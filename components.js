export const components = [
  {
    type: "CompA",
    label: "Компонент А",
    factory: (container) => {
      container.element.innerHTML = "<div>Это компонент A</div>";
    },
  },
  {
    type: "CompB",
    label: "Компонент Б",
    factory: (container) => {
      container.element.innerHTML = "<div>Это компонент B</div>";
    },
  },
  {
    type: "CompC",
    label: "Компонент C",
    factory: (container) => {
      container.element.innerHTML = "<div>Это компонент C</div>";
    },
  },
];
