
const SURDO_NOTES = {47: "hit", 33: "mute"};
const BAR_DURATION = 1920;

let break1_csv;

let break1;

//Preload: Load MIDI (CSV) files 
function preload() {
    break1_csv = loadStrings("assets/csv/break1.csv");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    break1 = getNoteSequence(break1_csv);
    console.log(break1);
}

function draw() {
    background(255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function getNoteSequence(csv_array) {
    let data = csvArrayToData(csv_array);
    return dataToNoteSequence(data);
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

function dataToNoteSequence(data) {
    let sequence = new Object();
    sequence.values = new Array();
    sequence.positions = new Array();

    for (let record of data) {
        if (getEvent(record) === "Note_on_c") {
            sequence.positions.push(getTime(record));
            sequence.values.push(getNote(record));
        }
    }

    return sequence;
}

function getEvent(record) {
    return record[2];
}

function getTime(record) {
    let value = record[1];
    return scaleTimeValue(value);
}

function scaleTimeValue(value) {
    return value / BAR_DURATION;
}

function getNote(record) {
    let value = record[4];
    return SURDO_NOTES[value];
}