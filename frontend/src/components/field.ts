import Component from "../loadComponents";
import { bus, subscribeToTopic, sendMessage } from "../socketManager";

const Field: Component = {
  name: "Field",
  factory: (container) => {
    container.element.style.position = "relative";

    let fieldConfig = defaultFieldCfg;

    // Create field svg
    const svgNS = "http://www.w3.org/2000/svg";
    const fieldSvg = document.createElementNS(svgNS, "svg");
    fieldSvg.style.position = "absolute";
    fieldSvg.style.top = "0";
    fieldSvg.style.left = "0";
    fieldSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    fieldSvg.style.display = "block";
    fieldSvg.style.userSelect = "none";
    fieldSvg.style.touchAction = "none";

    fieldSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    container.element.append(fieldSvg);

    const drawingSvg = document.createElementNS(svgNS, "svg");
    drawingSvg.style.position = "absolute";
    drawingSvg.style.top = "0";
    drawingSvg.style.left = "0";
    drawingSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    container.element.append(drawingSvg);

    // Create display with coords
    const coordsDisplay = document.createElement("div");
    coordsDisplay.style.position = "absolute";
    coordsDisplay.style.bottom = "0";
    coordsDisplay.style.left = "0";
    coordsDisplay.style.background = "rgba(0, 0, 0, 0.6)";
    coordsDisplay.style.color = "white";
    coordsDisplay.style.fontFamily = "monospace";
    coordsDisplay.style.fontSize = "13px";
    coordsDisplay.style.pointerEvents = "none";
    container.element.append(coordsDisplay);

    // Field image initial config
    let scale = 0.9;
    let originX = 0;
    let originY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    // Settings of display with coords

    fieldSvg.addEventListener("mousemove", (e) => {
      const pt = fieldSvg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(fieldSvg.getScreenCTM()?.inverse());

      coordsDisplay.textContent = `X: ${svgP.x.toFixed(
        0
      )}, Y: ${-svgP.y.toFixed(0)}`;
    });
    fieldSvg.addEventListener("mouseleave", (e) => {
      coordsDisplay.textContent = ``;
    });

    // Settings of field image
    function updateTransform() {
      fieldSvg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
      drawingSvg.style.transform = fieldSvg.style.transform;
    }
    container.element.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        const rect = fieldSvg.getBoundingClientRect();

        const scaleFactor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
        const newScale = Math.min(Math.max(scale * scaleFactor, 0.1), 10);

        originX +=
          (e.clientX - (rect.left + rect.right) / 2) * (1 - scaleFactor);
        originY +=
          (e.clientY - (rect.top + rect.bottom) / 2) * (1 - scaleFactor);

        scale = newScale;
        updateTransform();
      },
      { passive: false }
    );
    container.element.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX - originX;
      dragStartY = e.clientY - originY;
    });
    window.addEventListener("mouseup", () => {
      isDragging = false;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      originX = e.clientX - dragStartX;
      originY = e.clientY - dragStartY;
      updateTransform();
    });

    subscribeToTopic("update_geometry");
    bus.on("update_geometry", (data) => {
      console.log("Update field with new data:", data);
      fieldConfig = {
        width: data.length,
        height: data.width,
        leftGoalColor: "#FFFF00",
        rightGoalColor: "#0000FF",
        goalWidth: data.goalWidth,
        goalDepth: data.goalDepth,
        penaltyAreaWidth: data.penaltyAreaWidth,
        penaltyAreaDepth: data.penaltyAreaDepth,
        centerCircleRadius: data.centerCircleRadius,
        borderSize: data.borderSize,
      };
      drawField(fieldSvg, fieldConfig);
      updateViewBox(fieldSvg, drawingSvg, fieldConfig);
      updateTransform();
    });

    subscribeToTopic("update_sprites");
    bus.on("update_sprites", (data) => {
      // console.log("New sprites:", data);
      drawImageSvg(drawingSvg, data);
    });

    drawField(fieldSvg, fieldConfig);
    updateViewBox(fieldSvg, drawingSvg, fieldConfig);
    requestAnimationFrame(() => {
      const windowRect = container.element.getBoundingClientRect();
      const fieldRect = fieldSvg.getBoundingClientRect();
      originX = (windowRect.width - fieldRect.width) / 2;
      originY = (windowRect.height - fieldRect.height) / 2;
      updateTransform();
    });
  },
};

export default Field;

interface FieldConfig {
  width: number;
  height: number;
  leftGoalColor: string;
  rightGoalColor: string;
  goalWidth: number;
  goalDepth: number;
  penaltyAreaWidth: number;
  penaltyAreaDepth: number;
  centerCircleRadius: number;
  borderSize: number;
}

const defaultFieldCfg: FieldConfig = {
  width: 9000,
  height: 6000,
  leftGoalColor: "#0000ff",
  rightGoalColor: "#ffff00",
  goalWidth: 1000,
  goalDepth: 180,
  penaltyAreaWidth: 2000,
  penaltyAreaDepth: 1000,
  centerCircleRadius: 500,
  borderSize: 250,
};

function drawField(fieldSvg: SVGSVGElement, cfg: FieldConfig): void {
  const fieldColor = "#27bb27";
  const lineWidth = "10";
  const goalLineWidth = 40;

  fieldSvg.innerHTML = "";

  const svgNS = "http://www.w3.org/2000/svg";

  fieldSvg.setAttribute(
    "viewBox",
    `${-cfg.width / 2 - cfg.borderSize} ${-cfg.height / 2 - cfg.borderSize} ${
      cfg.width + cfg.borderSize * 2
    } ${cfg.height + cfg.borderSize * 2}`
  );
  fieldSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const field = document.createElementNS(svgNS, "rect");
  field.setAttribute("x", String(-cfg.width / 2 - cfg.borderSize));
  field.setAttribute("y", String(-cfg.height / 2 - cfg.borderSize));
  field.setAttribute("width", String(cfg.width + cfg.borderSize * 2));
  field.setAttribute("height", String(cfg.height + cfg.borderSize * 2));
  field.setAttribute("fill", fieldColor);
  fieldSvg.appendChild(field);

  const boarder_rect = document.createElementNS(svgNS, "rect");
  boarder_rect.setAttribute("x", String(-cfg.width / 2));
  boarder_rect.setAttribute("y", String(-cfg.height / 2));
  boarder_rect.setAttribute("width", String(cfg.width));
  boarder_rect.setAttribute("height", String(cfg.height));
  boarder_rect.setAttribute("fill", fieldColor);
  boarder_rect.setAttribute("stroke", "white");
  boarder_rect.setAttribute("stroke-width", lineWidth);
  fieldSvg.appendChild(boarder_rect);

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("r", String(cfg.centerCircleRadius));
  circle.setAttribute("fill", fieldColor);
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", lineWidth);
  fieldSvg.appendChild(circle);

  const center = document.createElementNS(svgNS, "circle");
  center.setAttribute("r", "25");
  center.setAttribute("fill", "white");
  fieldSvg.appendChild(center);

  const halfLine = document.createElementNS(svgNS, "line");
  halfLine.setAttribute("y1", String(-cfg.height / 2));
  halfLine.setAttribute("y2", String(cfg.height / 2));
  halfLine.setAttribute("stroke", "white");
  halfLine.setAttribute("stroke-width", lineWidth);
  fieldSvg.appendChild(halfLine);

  const leftGoal = document.createElementNS(svgNS, "rect");
  leftGoal.setAttribute(
    "x",
    String(-(cfg.width / 2 + cfg.goalDepth - goalLineWidth / 2))
  );
  leftGoal.setAttribute("y", String(-cfg.goalWidth / 2));
  leftGoal.setAttribute("width", String(cfg.goalDepth));
  leftGoal.setAttribute("height", String(cfg.goalWidth));
  leftGoal.setAttribute("fill", fieldColor);
  leftGoal.setAttribute("stroke", cfg.leftGoalColor);
  leftGoal.setAttribute("stroke-width", String(goalLineWidth));
  fieldSvg.appendChild(leftGoal);

  const leftPenalty = document.createElementNS(svgNS, "rect");
  leftPenalty.setAttribute("x", String(-cfg.width / 2));
  leftPenalty.setAttribute("y", String(-cfg.penaltyAreaWidth / 2));
  leftPenalty.setAttribute("width", String(cfg.penaltyAreaDepth));
  leftPenalty.setAttribute("height", String(cfg.penaltyAreaWidth));
  leftPenalty.setAttribute("fill", fieldColor);
  leftPenalty.setAttribute("stroke", "white");
  leftPenalty.setAttribute("stroke-width", lineWidth);
  fieldSvg.appendChild(leftPenalty);

  const rightGoal = document.createElementNS(svgNS, "rect");
  rightGoal.setAttribute("x", String(cfg.width / 2 - goalLineWidth / 2));
  rightGoal.setAttribute("y", String(-cfg.goalWidth / 2));
  rightGoal.setAttribute("width", String(cfg.goalDepth));
  rightGoal.setAttribute("height", String(cfg.goalWidth));
  rightGoal.setAttribute("fill", fieldColor);
  rightGoal.setAttribute("stroke", cfg.rightGoalColor);
  rightGoal.setAttribute("stroke-width", "50");
  fieldSvg.appendChild(rightGoal);

  const rightPenalty = document.createElementNS(svgNS, "rect");
  rightPenalty.setAttribute("x", String(cfg.width / 2 - cfg.penaltyAreaDepth));
  rightPenalty.setAttribute("y", String(-cfg.penaltyAreaWidth / 2));
  rightPenalty.setAttribute("width", String(cfg.penaltyAreaDepth));
  rightPenalty.setAttribute("height", String(cfg.penaltyAreaWidth));
  rightPenalty.setAttribute("fill", fieldColor);
  rightPenalty.setAttribute("stroke", "white");
  rightPenalty.setAttribute("stroke-width", lineWidth);
  fieldSvg.appendChild(rightPenalty);

  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "0");
  text.setAttribute("y", "0");
  text.setAttribute("fill", "#88dd00");
  text.setAttribute("font-size", "1000");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.textContent = "NO DATA";
  fieldSvg.appendChild(text);
}

function updateViewBox(
  fieldSvg: SVGSVGElement,
  drawingSvg: SVGSVGElement,
  cfg: FieldConfig
) {
  const x = -cfg.width / 2 - cfg.borderSize;
  const y = -cfg.height / 2 - cfg.borderSize;
  const w = cfg.width + cfg.borderSize * 2;
  const h = cfg.height + cfg.borderSize * 2;
  fieldSvg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
  drawingSvg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
}

interface VisionObject {
  type: string;
  x: number;
  y: number;
  rotation?: number;
  robot_id?: number;
  x2?: number;
  y2?: number;
  radius?: number;
}

interface FeedData {
  [layerName: string]: { data: VisionObject[]; is_visible: boolean };
}

function drawImageSvg(svg: SVGSVGElement, json: FeedData) {
  svg.innerHTML = "";

  for (const layerName in json) {
    const layer = json[layerName];
    if (!layer.is_visible) continue;

    layer.data.forEach((element) => {
      switch (element.type) {
        case "ball": {
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", element.x.toString());
          circle.setAttribute("cy", (-element.y).toString());
          circle.setAttribute("r", "25");
          circle.setAttribute("fill", "orange");
          svg.appendChild(circle);
          break;
        }
        case "robot_blu":
        case "robot_yel": {
          const robot = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
          );
          robot.setAttribute("x", (element.x - 50).toString());
          robot.setAttribute("y", (-element.y - 50).toString());
          robot.setAttribute(
            "transform",
            `rotate(${((element.rotation || 0) * 180) / Math.PI}, ${
              element.x
            }, ${element.y})`
          );
          robot.setAttribute("href", `../../images/robot_yel.svg`);
          svg.appendChild(robot);
          break;
        }
        //TODO add more stuff
        default:
          console.warn("Unknown element type:", element.type);
      }
    });
  }
}
