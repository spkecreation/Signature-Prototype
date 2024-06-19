document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let history = [];

    // Set initial brush size and color
    let brushSize = document.getElementById("brushSize").value;
    let brushColor = document.getElementById("brushColor").value;

    // Event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    document.getElementById("brushSize").addEventListener("input", function() {
        brushSize = this.value;
    });

    document.getElementById("brushColor").addEventListener("input", function() {
        brushColor = this.value;
    });

    document.getElementById("clearCanvas").addEventListener("click", function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = []; // Clear history when clearing canvas
    });

    document.getElementById("undoButton").addEventListener("click", function() {
        undoLastDrawing();
    });

    document.getElementById("saveButton").addEventListener("click", function() {
        saveCanvas();
    });

    // Functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;

        ctx.strokeStyle = brushColor;
        ctx.lineCap = "round";
        ctx.lineWidth = brushSize;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        // Save draw coordinates to history
        history.push({
            x1: lastX,
            y1: lastY,
            x2: e.offsetX,
            y2: e.offsetY,
            color: brushColor,
            size: brushSize
        });

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function undoLastDrawing() {
        if (history.length > 0) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Remove last item from history
            history.pop();

            // Redraw remaining history
            redrawHistory();
        }
    }

    function redrawHistory() {
        history.forEach(item => {
            ctx.strokeStyle = item.color;
            ctx.lineWidth = item.size;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(item.x1, item.y1);
            ctx.lineTo(item.x2, item.y2);
            ctx.stroke();
        });
    }

    function saveCanvas() {
        // Create an "invisible" link element
        const link = document.createElement('a');
        link.style.display = 'none';

        // Create a Blob containing the canvas image data
        canvas.toBlob(function(blob) {
            // Create URL for the Blob
            const url = URL.createObjectURL(blob);

            // Set attributes of the link element
            link.href = url;
            link.download = 'drawing.png'; // Default filename

            // Append link to body
            document.body.appendChild(link);

            // Click the link to trigger the download
            link.click();

            // Remove link from body
            document.body.removeChild(link);

            // Release resources
            URL.revokeObjectURL(url);
        });
    }
});
