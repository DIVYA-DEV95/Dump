// Get a reference to the canvas element and other relevant elements
const canvas = document.getElementById('canvas');
const body = document.getElementById('main');
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const colorBtns = document.querySelectorAll(".stroke .option");
const bgColorBtns = document.querySelectorAll(".bg-color .option");
const colorPicker = document.querySelector("#color-picker");
const bgColorPicker = document.querySelector("#bgColor-picker");
const widthBtns = document.querySelectorAll(".width-btn");

// Get the 2D drawing context of the canvas
ctx = canvas.getContext("2d");

// Set the canvas size to match the window size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Initialize various drawing-related variables
let isDrawing = false;
let selectedTool = "hand";
let strokeWidth = 3;
let prevMouseX;
let prevMouseY;
let snapshot;
let selectedBgColor = "none";
let selectedColor = "#1e1e1e";

// Event listener for selecting different stroke widths
widthBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        // Remove the "active" class from all width buttons
        widthBtns.forEach(btn => btn.classList.remove("active"));

        // Determine the selected stroke width based on the clicked button
        if (e.target.id === "small") {
            strokeWidth = 3;
        }
        if (e.target.id === "mid") {
            strokeWidth = 8;
        }
        if (e.target.id === "thick") {
            strokeWidth = 12;
        }

        // Add the "active" class to the clicked button
        e.target.classList.add("active");
    });
});

// Functions to draw different shapes (rectangle, diamond, circle, arrow, line)
const drawRect = (e) => {
    if (!fillColor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
};

const drawDiamond = (e) => {
    ctx.beginPath();

    const centerX = (e.offsetX + prevMouseX) / 2;
    const centerY = (e.offsetY + prevMouseY) / 2;

    ctx.moveTo(centerX, e.offsetY); // Top point
    ctx.lineTo(e.offsetX, centerY);  // Right point
    ctx.lineTo(centerX, prevMouseY); // Bottom point
    ctx.lineTo(prevMouseX, centerY);  // Left point

    ctx.closePath();
    ctx.stroke();

    if (fillColor.checked) {
        ctx.fillStyle = selectedBgColor;
        ctx.fill();
    }
};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));

    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    if (fillColor.checked) {
        ctx.fillStyle = selectedBgColor;
        ctx.fill();
    }
};

const drawArrow = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);

    const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX);
    const arrowHeadLength = 20;

    ctx.stroke();

    ctx.save();
    ctx.translate(e.offsetX, e.offsetY);

    ctx.rotate(angle);

    ctx.moveTo(-arrowHeadLength, arrowHeadLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLength, -arrowHeadLength);

    ctx.restore();
    ctx.stroke();
};

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);

    const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX);
    const arrowHeadLength = 20;

    ctx.stroke();

    ctx.moveTo(-arrowHeadLength, arrowHeadLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLength, -arrowHeadLength);

    ctx.restore();
    ctx.stroke();
};

// Function to start drawing
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedBgColor;
};

// Function for drawing while the mouse is moving
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "pencil") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if (selectedTool === "square") {
        drawRect(e);
    }
    else if (selectedTool === "diamond") {
        drawDiamond(e);
    }
    else if (selectedTool === "circle") {
        drawCircle(e);
    }
    else if (selectedTool === "arrow") {
        drawArrow(e);
    }
    else if (selectedTool === "line") {
        drawLine(e);
    }
    else if (selectedTool === "eraser") {
        const eraserSize = strokeWidth * 4;
        ctx.lineWidth = eraserSize;
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = strokeWidth;
    }
};

// Event listeners for selecting different drawing tools
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tool.active").forEach(element => {
            element.classList.remove("active");
        });
        btn.classList add("active");
        selectedTool = btn.id;

        if (selectedTool === "square" || selectedTool === "circle" || selectedTool === "pencil"
            || selectedTool === "diamond" || selectedTool === "arrow" || selectedTool === "line") {
            canvas.style.cursor = "crosshair";
            document.querySelector(".color-palette").style.left = "30px";
        }
        else if (selectedTool === "hand") {
            canvas.style.cursor = "grab";
            document.querySelector(".color-palette").style.left = "-250px";
        }
        else {
            canvas.style.cursor = "default";
            document.querySelector(".color-palette").style.left = "-250px";
        }
    });
});

// Event listeners for selecting stroke colors and background colors
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

bgColorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedBgColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Event listeners for color picker inputs
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

bgColorPicker.addEventListener("change", () => {
    bgColorPicker.parentElement.style.background = bgColorPicker.value;
    bgColorPicker.parentElement.click();
});

// Event listeners for mouse events (up, down, and move) on the canvas
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
