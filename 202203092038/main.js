function setup()
{
    createCanvas(600, 600);
    noLoop();
}

function draw()
{
    background(255);

    let divisions = 20;

    let x_interval = width / (2 * divisions)
    let y_interval = height / (2 * divisions)

    let mid_x = width / 2;
    let mid_y = height / 2;

    noStroke();

    for (var i = divisions - 0.5; i > 0; i --)
    {
        fill(i * 255 / divisions);
        rect(mid_x - x_interval * i,
             mid_y - y_interval * i,
             2 * x_interval * i,
             2 * y_interval * i);
    }
}
