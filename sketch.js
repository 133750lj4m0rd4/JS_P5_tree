const scale_slider = document.getElementById("scale")
const angle_slider = document.getElementById("angle")
const coef_slider = document.getElementById("coef")

let x_dimention = 1100
let y_dimention = 1100

refresh_picture_trigger = 0

let proto_task = {
    length: 200,//px
    angle: 0,//degr
    starting_point: [x_dimention/2,y_dimention*0.9],//xy
    generation: 0,
    seed_info: {
        angle_diff: 0,
        lengt_coeff: 1,
    },//passed by reference, not a problem in this case though

    create_children: function(starting_point) {
        child1 = Object.create(this);
        child1.starting_point = starting_point;
        child1.length *= child1.seed_info.lengt_coeff;
        child1.angle += child1.seed_info.angle_diff;
        child1.generation += 1;

        child2 = Object.create(child1);
        child2.angle -= child2.seed_info.angle_diff * 2;

        return([child1,child2])
    }
}

let task_pool = [proto_task];
let weight = 10;
let color_pool = ["#00AAAA","#AA00AA","#AAAA00",
                  "#AA0000","#00AA00","#0000AA",]

function shift_point(point, length, degree) {
    degree = degree * (Math.PI/180);//convert to radians
    x_shift = length * Math.sin(degree);
    y_shift = length * Math.cos(degree);
    n_point = [point[0]+ x_shift, point[1]- y_shift];
    //console.log(n_point)
    return(n_point);
}

function perform_task(task) {
    starting_point = task.starting_point;
    ending_point = shift_point(starting_point,
                               task.length,
                               task.angle);
    line(starting_point[0],starting_point[1],
         ending_point[0],ending_point[1]);
    task_pool.push(...task.create_children(ending_point))
}

function setup() {
    createCanvas(x_dimention, y_dimention);
}

function draw() {
    if (refresh_picture_trigger == float(scale_slider.value) + float(angle_slider.value) + float(coef_slider.value)) {
        return
    }
    
    refresh_picture_trigger = float(scale_slider.value) + float(angle_slider.value) + float(coef_slider.value)

    background(0);

    proto_task.length = scale_slider.value;
    proto_task.seed_info.angle_diff = parseFloat(angle_slider.value);
    proto_task.seed_info.lengt_coeff = coef_slider.value/1000
    task_pool = [proto_task];

    for(let i = 0; i<13; i++) {
        stroke(color_pool[i%color_pool.length])
        strokeWeight(weight-i > 0 ? weight-i : 1)
        for(let j = 1; j <= 2**i; j++) {
            perform_task(task_pool.shift());
        }
    }
}