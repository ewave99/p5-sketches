class Turtle
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    move(dx, dy)
    {
        this.x += dx;
        this.y += dy;
    }

    goto(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

let turtle;
let stroke_length;
let angles;

function setup()
{
    let dim = min(windowWidth, windowHeight);
    createCanvas(dim, dim);

    turtle = new Turtle(width / 2, height / 2);

    stroke_length = dim / 40;

    background(0);
    stroke(255);
    angleMode(DEGREES);

    let base_poly_n = 16;
    angles = _.range(0, 360, 360 / base_poly_n);
}

function draw()
{
    let x = turtle.x;
    let y = turtle.y;

    let angle = random(angles);

    let dx = cos(angle) * stroke_length;
    let dy = sin(angle) * stroke_length;

    turtle.move(dx, dy);

    turtle.x = constrain(turtle.x, 0, width);
    turtle.y = constrain(turtle.y, 0, width);

    line(x, y, turtle.x, turtle.y);
}
