import Component from "../loadComponents";
import { bus, subscribeToTopic, sendMessage } from "../socketManager";

const Telemetry: Component = {
  name: "Telemetry",
  factory: (container) => {
    container.element.style.display = "flex";
    container.element.style.flexDirection = "column";
    container.element.style.height = "100%";

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.marginBottom = "10px";

    const selectTopic = document.createElement("select");
    selectTopic.style.height = "30px";
    selectTopic.style.width = "100%";
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear telemetry";
    clearButton.style.height = "30px";
    clearButton.style.width = "100px";
    clearButton.style.flex = "0 0 auto";

    wrapper.appendChild(selectTopic);
    wrapper.appendChild(clearButton);
    container.element.appendChild(wrapper);

    const telemetryBox = document.createElement("pre");
    telemetryBox.style.flexGrow = "1";
    container.element.appendChild(telemetryBox);

    let currentTopic = "";
    let telemetryData: Record<string, any> = {};

    function getText(currentTopic: string): string {
      if (currentTopic in telemetryData) {
        const data = telemetryData[currentTopic];
        if (typeof data === "string") {
          return data;
        } else {
          return JSON.stringify(data, null, 2);
        }
      }
      return "";
    }

    subscribeToTopic("update_telemetry");

    bus.on("update_telemetry", (data) => {
      telemetryData = data;

      const previousTopic = currentTopic;

      selectTopic.innerHTML = "";
      Object.keys(data).forEach((topic) => {
        const option = document.createElement("option");
        option.value = topic;
        option.textContent = topic;
        selectTopic.appendChild(option);
      });

      if (previousTopic && data[previousTopic] !== undefined) {
        currentTopic = previousTopic;
      } else if (selectTopic.options.length > 0) {
        currentTopic = selectTopic.options[0].value;
      }

      selectTopic.value = currentTopic;
      telemetryBox.textContent = getText(currentTopic);
    });

    selectTopic.addEventListener("change", () => {
      currentTopic = selectTopic.value;
      telemetryBox.textContent = getText(currentTopic);
    });

    clearButton.addEventListener("click", () => {
      sendMessage("clear_telemetry", "");
      currentTopic = "";
      selectTopic.innerHTML = "";
    });
  },
};

export default Telemetry;
