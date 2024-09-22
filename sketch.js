x_dimention = 900
y_dimention = 900

let proto_task = {
    length: 200,//px
    angle: 0,//degr
    starting_point: [x_dimention/2,y_dimention],//xy
    generation: 0,
    seed_info: {
        angle_diff: 70,
        lengt_coeff: 0.70,
    },//passed by reference, not a problem in this case though

    create_children: function(starting_point){
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
let limit = 10;

function shift_point(point, length, degree) {
    degree = degree * (Math.PI/180);//convert to radians
    x_shift = length * Math.sin(degree);
    y_shift = length * Math.cos(degree);
    n_point = [point[0]+ x_shift, point[1]- y_shift];
    //console.log(n_point)
    return(n_point);
}

function perform_task(task){
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
    background(0);
    stroke('white');
    for(let i = 0; i<15; i++){
        for(let j = 1; j <= 2**i; j++){
            perform_task(task_pool.shift());
        }
    }
    task_pool = [proto_task]
}