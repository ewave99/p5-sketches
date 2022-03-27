function setup()
{
    createCanvas(1000, 1000);
    noLoop();
}

function draw()
{
    background(0);

    let circles_across = 4;
    let circles_down   = 4;

    let max_r = width / (min(circles_across, circles_down) * 2);
    let divisions = 5;
    let interval = max_r / divisions;

    let x_space_between = (width - max_r * circles_across) / (circles_across + 1);
    let y_space_between = (height - max_r * circles_down ) / (circles_down + 1);

    let x_start = x_space_between + max_r / 2;
    let y_start = y_space_between + max_r / 2;

    let x_interval = x_space_between + max_r;
    let y_interval = y_space_between + max_r;

    noStroke();

    for (var y = 0; y < circles_down; y ++)
    {
        for (var x = 0; x < circles_across; x ++)
        {
            for (var r = divisions; r > 0; r --)
            {
                fill(random(0, 255), random(0, 255), random(0, 255));
                
                cx = x_start + x_interval * x;
                cy = y_start + y_interval * y;

                circle(cx, cy, r * interval);
            }
        }
    }
}
