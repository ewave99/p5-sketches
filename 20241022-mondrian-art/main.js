const ROW_DIVISION = 0;
const COL_DIVISION = 1;


function drawMainOutline() {
    stroke(0);
    strokeWeight(20);
    noFill();
    rect(0, 0, width, height);
}

function generateRectanglePair(division_type, par_x, par_y, par_w, par_h) {
    let rect1, rect2;
    let rect_proportion = int(random(1, 4)) / 5;
    if (division_type === ROW_DIVISION) {
        rect1 = [par_x, par_y, par_w, par_h * rect_proportion];
        rect2 = [par_x, par_y + par_h * rect_proportion, par_w, 
            par_h * (1-rect_proportion)];
    }
    else if (division_type === COL_DIVISION) {
        rect1 = [par_x, par_y, par_w * rect_proportion, par_h];
        rect2 = [par_x + par_w * rect_proportion, par_y, 
            par_w * (1-rect_proportion), par_h];
    }
    return [rect1, rect2];
}

function generateRectangleList() {
    let division_type;
    let stack;
    let rect1, rect2;

    stack = [];

    division_type = random([ROW_DIVISION, COL_DIVISION]);
    [rect1, rect2] = generateRectanglePair(division_type, 0, 0, width, height);
    
    stack.push(rect1);
    stack.push(rect2);

    for (rectangle of stack) {
        if (rectangle[2] < 50 || rectangle[3] < 50) 
            break;
        //division_type = random([ROW_DIVISION, COL_DIVISION]);
        division_type = (division_type === ROW_DIVISION) ? COL_DIVISION : ROW_DIVISION;
        [rect1, rect2] = generateRectanglePair(division_type, ...rectangle);
        stack.push(rect1);
        stack.push(rect2);
    }

    print(stack);

    return stack;
}

function drawRectangles(colour_groups) {
    strokeWeight(10);
    stroke(0);
    for (group of colour_groups) {
        fill(group[0]);
        for (rectangle of group[1])
            rect(...rectangle);
    }
}

function generateColourGroups(rectangles) {
    const COLOURS = ["white", "black", "red", "yellow", "lightskyblue"];
    const NUM_GROUPS = 5;
    let colour_groups = [];
    let group = 0;
    let prev_group = 0;
    let groups_with_names = [];
    for (let i = 0; i < NUM_GROUPS; i++)
        colour_groups.push([]);
    for (rectangle of rectangles) {
        while (group === prev_group)
            group = int(random(5));
        prev_group = group;
        colour_groups[group].push(rectangle);
    }
    for (let i = 0; i < NUM_GROUPS; i++)
        groups_with_names.push([COLOURS[i], colour_groups[i]]);
    return groups_with_names;
}

function drawMondrianArt() {
    background(255);

    let rectangle_list = generateRectangleList();
    let colour_groups = generateColourGroups(rectangle_list);
    drawRectangles(colour_groups);

    drawMainOutline();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    drawMondrianArt();
    noLoop();
}