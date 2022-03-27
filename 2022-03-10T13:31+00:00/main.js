function setup()
{
    createCanvas(800, 800);
    noLoop();
}

function draw()
{
    background(0);

    let cell_width = width / 40;
    let cell_height = height / 40;

    let half_cell_width = cell_width / 2;
    let half_cell_height = cell_height / 2;

    for (var y = 0; y < height; y += cell_height)
    {
        for (var x = 0; x < width; x += cell_width)
        {
            stroke(random(0, 255));

            if (round(random(0, 1)))
                line(x + half_cell_width, y - half_cell_height, x + half_cell_width, y + cell_height + half_cell_height)
            else
                line(x - half_cell_width, y + half_cell_height, x + cell_width + half_cell_width, y + half_cell_height);
        }
    }
}
