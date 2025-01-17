
const SURDO_NOTES = {47: "hit", 33: "mute"};
const BAR_DURATION = 1920;

let break1_csv;
let batucada_beginning_csv;
let batucada_loop_csv;
let batucada_ending_csv;

let break1;
let batucada_beginning;
let batucada_loop;
let batucada_ending;

let paper_tape;

//Preload: Load MIDI (CSV) files 
function preload() {
    break1_csv = loadStrings("assets/csv/break1.csv");
    batucada_beginning_csv = loadStrings("assets/csv/batucada-beginning.csv");
    batucada_loop_csv = loadStrings("assets/csv/batucada-loop.csv");
    batucada_ending_csv = loadStrings("assets/csv/batucada-ending.csv");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    break1 = getNoteSequence(break1_csv);
    batucada_beginning = getNoteSequence(batucada_beginning_csv);
    batucada_loop = getNoteSequence(batucada_loop_csv);
    batucada_ending = getNoteSequence(batucada_ending_csv);

    paper_tape = new PaperTape();
    paper_tape.addNoteSequence(break1);
    paper_tape.addNoteSequence(batucada_beginning);
    paper_tape.addNoteSequence(batucada_loop);
    paper_tape.addNoteSequence(batucada_ending);
}

function draw() {
    background(255);
    paper_tape.display();
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
    sequence.note_values = new Array();
    sequence.note_positions = new Array();

    for (let record of data) {
        if (getEvent(record) === "Note_on_c") {
            sequence.note_positions.push(getTime(record));
            sequence.note_values.push(getNote(record));
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


class PaperTape {
    constructor() {
        this.note_values = new Array();
        this.note_positions = new Array();
        this.current_position = 0;
    }

    addNoteSequence(note_sequence) {
        this.note_values.push(...note_sequence.note_values);
        
        let total_time = this.note_positions[this.note_positions.length-1] || 0;
        for (let position of note_sequence.note_positions) {
            this.note_positions.push(total_time + position);
        }
    }

    display() {}
}