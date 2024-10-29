function setup() {
    createCanvas(windowWidth, windowHeight);
}

let Drawing = (function() {
    let path_objects = [];
    let is_drawing = false;

    function createNewPath(r, g, b) {
        if (is_drawing)
            return;

        let path_object = {color: [r, g, b], path: []}
        path_objects.push(path_object);
        is_drawing = true;
    }

    function updatePath() {
        path_objects[path_objects.length-1].path.push([mouseX, mouseY]);
    }

    function endPath() {
        is_drawing = false;
    }

    return {
        getPathObjects: () => path_objects,
        isDrawing: () => is_drawing,
        createNewPath: createNewPath,
        updatePath: updatePath,
        endPath: endPath
    };
})();

let Display = (function() {
    let color_selection = [255, 0, 0];

    function showPath(path_object) {
        stroke(...path_object.color);
        strokeWeight(10);
        noFill();
        beginShape();
        for (let [vx, vy] of path_object.path) {
            vertex(vx, vy);
        }
        endShape();
    }

    function showBackground() {
        background(255);
    }
    
    function showDrawing() {
        for (let path_object of Drawing.getPathObjects()) {
            showPath(path_object);
        }
    }

    function showRedButton() {
        fill(255, 0, 0);
        stroke(0);
        strokeWeight(1);

        square(10, 10, 40);
    }
    
    function showGreenButton() {
        fill(0, 255, 0);
        stroke(0);
        strokeWeight(1);
        square(10, 60, 40);
    }

    function showBlueButton() {
        fill(0, 0, 255);
        stroke(0);
        strokeWeight(1);
        square(10, 110, 40);
    }
    
    function showUI() {
        showRedButton();
        showGreenButton();
        showBlueButton();
    }

    function processButtonPress() {
        if (10 <= mouseX && mouseX <= 50) {
            if (10 <= mouseY && mouseY <= 50) {
                color_selection = [255, 0, 0];
                return true;
            }
            if (60 <= mouseY && mouseY <= 100) {
                color_selection = [0, 255, 0];
                return true;
            }
            if (110 <= mouseY && mouseY <= 150) {
                color_selection = [0, 0, 255];
                return true;
            }
        }
        return false;
    }

    return {
        showBackground: showBackground,
        showDrawing: showDrawing,
        showUI: showUI,
        getColorSelection: () => color_selection,
        processButtonPress: processButtonPress
    }
})();

function draw() {
    Display.showBackground();
    Display.showDrawing();
    Display.showUI();
    if (Drawing.isDrawing())
        Drawing.updatePath();
}

function mousePressed() {
    if (Display.processButtonPress() === true)
        return;
    let color = Display.getColorSelection();
    Drawing.createNewPath(color);
}

function mouseReleased() {
    Drawing.endPath();
}