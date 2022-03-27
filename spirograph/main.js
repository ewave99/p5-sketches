class Spirograph
{
    constructor(cx, cy, r, cog_r, cog_hole_r)
    {
        this.cx = cx;
        this.cy = cy;
        this.circumcircle = new Circumcircle(r);
        this.cog = new Cog(cog_r, r, cog_hole_r);
        this.cog_theta = 0;
        this.rot_interval = 4;
    }

    update()
    {
        this.moveCog();
    }

    draw()
    {
        this.drawCircumcircle();
        this.drawCog();
    }

    drawCircumcircle()
    {
        circle(this.cx, this.cy, this.circumcircle.r * 2);
    }

    drawCog()
    {
        circle(this.cog.cx, this.cog.cy, this.cog.r * 2);
        line(this.cog.cx, this.cog.cy, this.cog.hole_x, this.cog.hole_y);
    }

    moveCog()
    {
        this.cog_theta += this.rot_interval;
        this.cog.update(this.cog_theta, this.circumcircle.r, this.cx, this.cy);
    }
}

class Circumcircle
{
    constructor(r)
    {
        this.r = r;
    }
}

class Cog
{
    constructor(r, outer_r, hole_r)
    {
        this.r = r;

        this.hole_r = hole_r;
        this.hole_x = 0;
        this.hole_y = 0;

        this.rotation = 0;
        this.ratio = outer_r / r;

        this.cx = 0;
        this.cy = 0;
    }

    update(theta, outer_r, outer_cx, outer_cy)
    {
        this.rotation = - theta * this.ratio;

        this.cx = cos(theta) * (outer_r - this.r) + outer_cx;
        this.cy = sin(theta) * (outer_r - this.r) + outer_cy;

        this.hole_x = cos(this.rotation) * this.hole_r + this.cx;
        this.hole_y = sin(this.rotation) * this.hole_r + this.cy;
    }
}

let spirograph;
let prev_hole_x,
    prev_hole_y;

function setup()
{
    createCanvas(800, 800);
    angleMode(DEGREES);
    frameRate(60);

    let max_r = min(width, height) / 2;

    let r = min(width, height) / 3;

    let cog_r = floor(random(0, r));
    let hole_r = floor(random(0, r));

    spirograph = new Spirograph(
        width / 2,
        height / 2,
        r,
        cog_r,
        hole_r
    );

    spirograph.update();

    prev_hole_x = spirograph.cog.hole_x;
    prev_hole_y = spirograph.cog.hole_y;

    noSmooth();
    stroke(255);
    noFill();
    background(0);
}

function draw()
{
    spirograph.update();

    line(prev_hole_x, prev_hole_y, spirograph.cog.hole_x, spirograph.cog.hole_y);

    prev_hole_x = spirograph.cog.hole_x;
    prev_hole_y = spirograph.cog.hole_y;
}
