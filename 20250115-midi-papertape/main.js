
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

    paper_tape = new PaperTape(width/4, (height-100)/2, width/2, 100);
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
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.note_values = new Array();
        this.note_positions = new Array();
        this.current_position = 0;

        this.bars_displayed = 4;
        this.bar_width = this.w / this.bars_displayed;
    }

    addNoteSequence(note_sequence) {
        this.note_values.push(...note_sequence.note_values);
        
        let total_time = this.note_positions[this.note_positions.length-1] || 0;
        for (let position of note_sequence.note_positions) {
            this.note_positions.push(total_time + position);
        }
    }

    display() {
        this.drawOutline();

        this.drawCrotchetLines();
        this.drawMinimLines();
        this.drawBarLines();

        this.drawNotes();
    }

    drawOutline() {
        noFill();
        stroke(0);
        strokeWeight(3);

        rect(this.x, this.y, this.w, this.h);
    }

    drawBarLines() {
        stroke(0);
        strokeWeight(2);

        let x = this.x;
        for (let i = 0; i < this.bars_displayed; i++) {
            line(x, this.y, x, this.y+this.h);
            x += this.bar_width;
        }
    }

    drawMinimLines() {
        stroke(0);
        strokeWeight(1);

        let parts = 2;
    
        let x = this.x;
        let delta = this.bar_width / parts;
        for (let i = 0; i < this.bars_displayed * parts; i++) {
            line(x, this.y, x, this.y+this.h);
            x += delta;
        }
    }

    drawCrotchetLines() {
        stroke(0);
        strokeWeight(0.5);
        drawingContext.setLineDash([5, 5]);

        let parts = 4;
    
        let x = this.x;
        let delta = this.bar_width / parts;
        for (let i = 0; i < this.bars_displayed * parts; i++) {
            line(x, this.y, x, this.y+this.h);
            x += delta;
        }

        drawingContext.setLineDash([]);
    }
    
    drawNotes() {
        textAlign(CENTER, CENTER);
        let diameter = 20;
        textSize(diameter-5);

        let x;
        let y = this.y + this.h/2;
        let note_text;
        for (let i = 0; i < this.note_values.length; i++) {
            x = this.getNoteX(this.note_positions[i]);
            if (x > this.x + this.w)
                continue;

            note_text = this.getNoteText(this.note_values[i]);

            fill(255);
            stroke(0);
            strokeWeight(1);
            circle(x, y, diameter);

            fill(0);
            noStroke();
            text(note_text, x, y);
        }
    }

    getNoteX(note_position) {
        return this.x + this.bar_width * note_position;
    }

    getNoteText(note_value) {
        if (note_value === "hit")
            return "H";
        if (note_value === "mute")
            return "M";
        return "";
    }
}