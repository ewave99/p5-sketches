const SOUTH_WEST = 0,
      NORTH_WEST = 1,
      NORTH_EAST = 2,
      SOUTH_EAST = 3;

function setup()
{
    createCanvas(800, 800);
    noLoop();
}

function draw()
{
    background(0);
    stroke(255);
    noFill();

    let scale = 1;

    let x = width / 2;
    let y = height / 2;

    let heading = SOUTH_WEST;

    let prev_n = 0;
    let n = 1;
    let next_n;

    let r;

    for (var i = 0; i < 12; i ++)
    {
        r = n * scale;
        switch(heading)
        {
            case SOUTH_WEST:
                arc(x, y, r * 2, r * 2, 0, HALF_PI, PIE);
                y -= prev_n * scale;
                break;
            case NORTH_WEST:
                arc(x, y, r * 2, r * 2, HALF_PI, PI, PIE);
                x += prev_n * scale;
                break;
            case NORTH_EAST:
                arc(x, y, r * 2, r * 2, PI, PI + HALF_PI, PIE);
                y += prev_n * scale;
                break;
            case SOUTH_EAST:
                arc(x, y, r * 2, r * 2, PI + HALF_PI, TWO_PI, PIE);
                x -= prev_n * scale;
                break;
            default:
                break;
        }

        heading ++;
        heading %= 4;

        next_n = prev_n + n;
        n = next_n;
        prev_n = n;
        n = next_n;

        prev_r = r;
    }
}
