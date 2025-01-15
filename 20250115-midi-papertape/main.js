let break1_csv;
let break1_data;

//Preload: Load MIDI (CSV) files 
function preload() {
    break1_csv = loadStrings("assets/csv/break1.csv");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    break1_data = csvArrayToData(break1_csv);
    for (let line of break1_data) console.log(line);
}

function draw() {
    background(255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function csvArrayToData(csv_array) {
    let array_data = new Array();
    let line_data;
    for (let line of csv_array) {
        line_data = csvLineToData(line);
        array_data.push(line_data);
    }
    return array_data;
}

function csvLineToData(line) {
    let fields = line.match(/\s*(\"[^"]*\"|'[^']*'|[^,]*)\s*(,|$)/g);
    return fields.map(parseValueFromField);
}

function parseValueFromField(field) {
    let m;

    //null value
    m = field.match(/^\s*,?$/);
    if (m) return null; 
    // Double Quoted Text
    m = field.match(/^\s*\"([^"]*)\"\s*,?$/);
    if (m) return m[1]; 
    // Single Quoted Text
    m = field.match(/^\s*'([^']*)'\s*,?$/);
    if (m) return m[1];
    // Boolean
    m = field.match(/^\s*(true|false)\s*,?$/);
    if (m) return m[1] === "true" ? true : false;
    // Integer Number
    m = field.match(/^\s*((?:\+|\-)?\d+)\s*,?$/);
    if (m) return parseInt(m[1]);
    // Floating Point Number
    m = field.match(/^\s*((?:\+|\-)?\d*\.\d*)\s*,?$/);
    if (m) return parseFloat(m[1]);
    // Unquoted Text
    m = field.match(/^\s*(.*?)\s*,?$/) 
    if (m) return m[1]; 
    
    return line;
}