function setup()
{
    createCanvas(800, 800);
    noLoop();
    noSmooth();
}

function draw()
{
    background(0);

    let partitions_across = 50;
    let partition_width = width / partitions_across;
    let partitions_down = 50;
    let partition_height = height / partitions_down;

    stroke(255);
    noFill();

    let points = Array(partitions_across * partitions_down);

    let index = 0;

    for (var y = 0; y < height; y += partition_height)
    {
        for (var x = 0; x < width; x += partition_width)
        {
            points[index] = createVector(x + random(0, partition_width), y + random(0, partition_height));
            index ++;
        }
    }
    
    let my_point;
    let nearest_point_index;

    my_point = points.splice(0, 1)[0];
    nearest_point_index = getNearestPoint(my_point, points);
    stroke(random(0, 255));
    line(my_point.x, my_point.y, points[nearest_point_index].x, points[nearest_point_index].y);

    while (points.length > 1)
    {
        my_point = points.splice(nearest_point_index, 1)[0];
        nearest_point_index = getNearestPoint(my_point, points);
        stroke(random(0, 255));
        line(my_point.x, my_point.y, points[nearest_point_index].x, points[nearest_point_index].y);
    }

    let square_divisions = 19;
    let square_width = square_height = min(width, height) / square_divisions;

    noStroke();

    let alpha = 150;
    
    count = 0;
    for (var y = square_height; y < height - square_height; y += square_height * 3)
    {
        for (var x = square_width; x < width - square_width; x += square_width * 3)
        {
            if (count == 5
                || count == 7
                || count == 15
                || count == 20
                || count == 28
                || count == 30)
                fill(255, 33, 144, alpha)
            else
                fill(235, 88, 52, alpha);
            rect(x, y, square_width * 2, square_height * 2);
            count ++;
        }
    }
}

function getNearestPoint(point, points)
{
    // assume that point is not in points
    //
    //console.log(points);
    let smallest_value = ((points[0].x - point.x) ** 2 + (points[0].y - point.y) ** 2) ** 0.5;
    let closest_point_index = 0;

    let value;
    let index = 1;
    while (index < points.length)
    {
        value = abs(points[index].x - point.x) + abs(points[index].y - point.y);
        if (value < smallest_value)
        {
            smallest_value = value;
            closest_point_index = index;
        }
        index ++;
    }

    return closest_point_index;
}
