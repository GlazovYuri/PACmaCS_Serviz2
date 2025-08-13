import Component from "../loadComponents";
import { io } from "socket.io-client";

const Telemetry: Component = {
  name: "Telemetry",
  factory: (container) => {
    container.element.style.display = "flex";
    container.element.style.flexDirection = "column";
    container.element.style.height = "100%";

    const select = document.createElement("select");
    select.style.marginBottom = "10px";
    container.element.appendChild(select);

    const telemetryBox = document.createElement("pre");
    telemetryBox.style.flexGrow = "1";
    telemetryBox.style.overflow = "auto";
    telemetryBox.style.background = "#1e1e1e";
    telemetryBox.style.color = "#dcdcdc";
    telemetryBox.style.padding = "10px";
    telemetryBox.style.border = "1px solid #555";
    telemetryBox.style.margin = "0";
    container.element.appendChild(telemetryBox);

    let currentTopic = "";
    const telemetryData: Record<string, any> = {};

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

    const socket = io("http://localhost:8001");

    socket.on("connect", () => {
      console.log("Connected to backend");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    socket.on("update_telemetry", (data) => {
      Object.assign(telemetryData, data);

      Object.keys(data).forEach((topic) => {
        if (![...select.options].some((opt) => opt.value === topic)) {
          const option = document.createElement("option");
          option.value = topic;
          option.textContent = topic;
          select.appendChild(option);
        }
      });

      if (!currentTopic && select.options.length > 0) {
        currentTopic = select.options[0].value;
        select.value = currentTopic;
      }

      telemetryBox.textContent = getText(currentTopic);
    });

    select.addEventListener("change", () => {
      currentTopic = select.value;
      telemetryBox.textContent = getText(currentTopic);
    });
  },
};

export default Telemetry;
