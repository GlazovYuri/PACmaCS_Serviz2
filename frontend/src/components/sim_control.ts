import Component from "../loadComponents";
import { bus, subscribeToTopic, sendMessage } from "../socketManager";
import { CustomDropdown, NumberInput } from "../customButtons";

const SimControl: Component = {
  name: "SimControl",
  factory: (container) => {
    container.element.style.position = "relative";
    container.element.style.overflowY = "auto";

    const upHeader = document.createElement("h3");
    upHeader.textContent = "Formations for simulator";
    upHeader.style.padding = "5px 10px";
    upHeader.style.background = "#1a1a1a";
    upHeader.style.display = "flex";
    upHeader.style.flexDirection = "row";
    upHeader.style.height = "auto";
    upHeader.style.width = "auto";
    upHeader.style.userSelect = "none";
    container.element.append(upHeader);

    const firstRow = document.createElement("div");
    firstRow.style.display = "flex";
    firstRow.style.justifyContent = "space-between";
    firstRow.style.width = "90%";
    firstRow.style.margin = "5px 0 0 5%";
    container.element.append(firstRow);

    const btn0 = document.createElement("button");
    btn0.textContent = "0";
    btn0.style.margin = "0";
    btn0.style.width = "40px";
    btn0.style.height = "40px";
    btn0.style.font = "20px Arial, sans-serif";
    firstRow.appendChild(btn0);

    const btn1 = document.createElement("button");
    btn1.textContent = "1";
    btn1.style.cssText = btn0.style.cssText;
    firstRow.appendChild(btn1);

    const btn2 = document.createElement("button");
    btn2.textContent = "2";
    btn2.style.cssText = btn0.style.cssText;
    firstRow.appendChild(btn2);

    const secondRow = document.createElement("div");
    secondRow.style.display = "flex";
    secondRow.style.justifyContent = "center";
    secondRow.style.width = "100%";
    container.element.appendChild(secondRow);

    const randomBtn = document.createElement("button");
    randomBtn.textContent = "Random";
    randomBtn.style.width = "120px";
    randomBtn.style.height = "40px";
    randomBtn.style.font = "20px Arial, sans-serif";
    secondRow.appendChild(randomBtn);

    const downHeader = document.createElement("div");
    downHeader.style.display = "flex";
    downHeader.style.alignItems = "center";
    downHeader.style.justifyContent = "space-between";
    downHeader.style.background = "#1a1a1a";
    downHeader.style.padding = "5px 10px";
    downHeader.style.marginTop = "10px";
    downHeader.style.userSelect = "none";

    const title = document.createElement("h3");
    title.textContent = "Robot control";
    title.style.background = "none";
    title.style.margin = "0";
    title.style.padding = "0";
    title.style.color = "#b0b0b0";
    downHeader.appendChild(title);

    const controlCheckbox = document.createElement("input");
    controlCheckbox.type = "checkbox";
    downHeader.appendChild(controlCheckbox);

    container.element.appendChild(downHeader);

    const containerWrapper = document.createElement("div");
    containerWrapper.style.opacity = "0.5";
    containerWrapper.style.pointerEvents = "none";

    controlCheckbox.addEventListener("change", () => {
      if (controlCheckbox.checked) {
        containerWrapper.style.opacity = "1";
        containerWrapper.style.pointerEvents = "auto";
      } else {
        containerWrapper.style.opacity = "0.5";
        containerWrapper.style.pointerEvents = "none";
      }
    });

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.padding = "5px";

    const selectDropdown = new CustomDropdown({
      options: [{ value: "BLUE" }, { value: "YELLOW" }],
      onChange: (value) => {},
    });
    selectDropdown.element.style.width = "50%";
    wrapper.appendChild(selectDropdown.element);

    const selectNumber = new NumberInput();
    selectNumber.element.style.width = "50%";
    wrapper.appendChild(selectNumber.element);
    containerWrapper.appendChild(wrapper);

    const speedLabel = document.createElement("div");
    speedLabel.style.color = "#b0b0b0";
    speedLabel.style.margin = "10px";
    speedLabel.textContent = `Linear speed 1.0 m/s`;
    speedLabel.style.font = "15px Arial, sans-serif";
    containerWrapper.appendChild(speedLabel);

    const speedSlider = document.createElement("input");
    speedSlider.type = "range";
    speedSlider.style.marginLeft = "10px";
    speedSlider.min = "0";
    speedSlider.max = "2";
    speedSlider.step = "0.1";
    speedSlider.value = "1";
    speedSlider.style.width = "calc(100% - 20px)";

    speedSlider.addEventListener("input", () => {
      const value = parseFloat(speedSlider.value);
      speedLabel.textContent = `Linear speed ${value.toFixed(1)} m/s`;
    });
    containerWrapper.appendChild(speedSlider);

    const wSpeedLabel = document.createElement("div");
    wSpeedLabel.style.color = "#b0b0b0";
    wSpeedLabel.style.margin = "10px";
    wSpeedLabel.textContent = `Angular speed 1.5 rad/s`;
    wSpeedLabel.style.font = "15px Arial, sans-serif";
    containerWrapper.appendChild(wSpeedLabel);

    const wSpeedSlider = document.createElement("input");
    wSpeedSlider.type = "range";
    wSpeedSlider.style.marginLeft = "10px";
    wSpeedSlider.min = "0";
    wSpeedSlider.max = "3";
    wSpeedSlider.step = "0.1";
    wSpeedSlider.value = "1.5";
    wSpeedSlider.style.width = "calc(100% - 20px)";

    wSpeedSlider.addEventListener("input", () => {
      const value = parseFloat(wSpeedSlider.value);
      wSpeedLabel.textContent = `Angular speed ${value.toFixed(1)} rad/s`;
    });
    containerWrapper.appendChild(wSpeedSlider);

    container.element.appendChild(containerWrapper);
  },
};

export default SimControl;
