import Component from "../loadComponents";

const Field: Component = {
  name: "Field",
  factory: (container) => {
    container.element.style.position = "relative";

    let fieldConfig = defaultFieldCfg;

    // Create field svg
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.display = "block";
    svg.style.userSelect = "none";
    svg.style.touchAction = "none";
    drawField(svg, fieldConfig);
    container.element.append(svg);

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
    const pt = svg.createSVGPoint();
    svg.addEventListener("mousemove", (e) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      coordsDisplay.textContent = `X: ${svgP.x.toFixed(
        0
      )}, Y: ${-svgP.y.toFixed(0)}`;
    });
    svg.addEventListener("mouseleave", (e) => {
      coordsDisplay.textContent = ``;
    });

    // Settings of field image
    function updateTransform() {
      svg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    }
    window.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleFactor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
        const newScale = Math.min(Math.max(scale * scaleFactor, 0.1), 10);

        originX = mouseX - ((mouseX - originX) * newScale) / scale;
        originY = mouseY - ((mouseY - originY) * newScale) / scale;

        scale = newScale;

        updateTransform();
      },
      { passive: false }
    );
    window.addEventListener("mousedown", (e) => {
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

    updateTransform();
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
  centerCircleRadius: 1000,
  borderSize: 250,
};

function drawField(svg: SVGSVGElement, cfg: FieldConfig): void {
  const fieldColor = "#27bb27";
  const lineWidth = "10";
  const goalLineWidth = 40;

  const svgNS = "http://www.w3.org/2000/svg";

  svg.setAttribute(
    "viewBox",
    `${-cfg.width / 2 - cfg.borderSize} ${-cfg.height / 2 - cfg.borderSize} ${
      cfg.width + cfg.borderSize * 2
    } ${cfg.height + cfg.borderSize * 2}`
  );
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const field = document.createElementNS(svgNS, "rect");
  field.setAttribute("x", String(-cfg.width / 2 - cfg.borderSize));
  field.setAttribute("y", String(-cfg.height / 2 - cfg.borderSize));
  field.setAttribute("width", String(cfg.width + cfg.borderSize * 2));
  field.setAttribute("height", String(cfg.height + cfg.borderSize * 2));
  field.setAttribute("fill", fieldColor);
  svg.appendChild(field);

  const boarder_rect = document.createElementNS(svgNS, "rect");
  boarder_rect.setAttribute("x", String(-cfg.width / 2));
  boarder_rect.setAttribute("y", String(-cfg.height / 2));
  boarder_rect.setAttribute("width", String(cfg.width));
  boarder_rect.setAttribute("height", String(cfg.height));
  boarder_rect.setAttribute("fill", fieldColor);
  boarder_rect.setAttribute("stroke", "white");
  boarder_rect.setAttribute("stroke-width", lineWidth);
  svg.appendChild(boarder_rect);

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("r", String(cfg.centerCircleRadius));
  circle.setAttribute("fill", fieldColor);
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", lineWidth);
  svg.appendChild(circle);

  const center = document.createElementNS(svgNS, "circle");
  center.setAttribute("r", String(25));
  center.setAttribute("fill", "white");
  svg.appendChild(center);

  const halfLine = document.createElementNS(svgNS, "line");
  halfLine.setAttribute("y1", String(-cfg.height / 2));
  halfLine.setAttribute("y2", String(cfg.height / 2));
  halfLine.setAttribute("stroke", "white");
  halfLine.setAttribute("stroke-width", lineWidth);
  svg.appendChild(halfLine);

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
  svg.appendChild(leftGoal);

  const leftPenalty = document.createElementNS(svgNS, "rect");
  leftPenalty.setAttribute("x", String(-cfg.width / 2));
  leftPenalty.setAttribute("y", String(-cfg.penaltyAreaWidth / 2));
  leftPenalty.setAttribute("width", String(cfg.penaltyAreaDepth));
  leftPenalty.setAttribute("height", String(cfg.penaltyAreaWidth));
  leftPenalty.setAttribute("fill", fieldColor);
  leftPenalty.setAttribute("stroke", "white");
  leftPenalty.setAttribute("stroke-width", lineWidth);
  svg.appendChild(leftPenalty);

  const rightGoal = document.createElementNS(svgNS, "rect");
  rightGoal.setAttribute("x", String(cfg.width / 2 - goalLineWidth / 2));
  rightGoal.setAttribute("y", String(-cfg.goalWidth / 2));
  rightGoal.setAttribute("width", String(cfg.goalDepth));
  rightGoal.setAttribute("height", String(cfg.goalWidth));
  rightGoal.setAttribute("fill", fieldColor);
  rightGoal.setAttribute("stroke", cfg.rightGoalColor);
  rightGoal.setAttribute("stroke-width", "50");
  svg.appendChild(rightGoal);

  const rightPenalty = document.createElementNS(svgNS, "rect");
  rightPenalty.setAttribute("x", String(cfg.width / 2 - cfg.penaltyAreaDepth));
  rightPenalty.setAttribute("y", String(-cfg.penaltyAreaWidth / 2));
  rightPenalty.setAttribute("width", String(cfg.penaltyAreaDepth));
  rightPenalty.setAttribute("height", String(cfg.penaltyAreaWidth));
  rightPenalty.setAttribute("fill", fieldColor);
  rightPenalty.setAttribute("stroke", "white");
  rightPenalty.setAttribute("stroke-width", lineWidth);
  svg.appendChild(rightPenalty);
}
