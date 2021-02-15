let globalMouse = {
    x: 0,
    y: 0
}

class MenuUI {
    activeWindow = null;
    menuButtons = {
        CREATE: 'window_create',
        JOIN: 'window_join',
        CHANGE_NAME: 'name',
        EXIT: 'exit',
        TEST: 'test'
    }

    openMenu(type) {
        this.activeWindow = type;
        const windows = $('.menu .main-content>*:not(#' + type + ')');
        switch (this.activeWindow) {
            case this.menuButtons.TEST:
                $('#menu').fadeOut('fast', () => {
                    $('#game').fadeIn('fast');
                    game.LoadGame();
                })
                break;
            case this.menuButtons.CREATE:
                windows.hide('fast', () => {
                    $('#window_create').show('fast');
                });
                break;
            case this.menuButtons.JOIN:
                windows.hide('fast', () => {
                    $('#window_join').show('fast');
                });
                break;
            case this.menuButtons.CHANGE_NAME:
                this.openModalChangeName();
                break;
            case this.menuButtons.EXIT:
                window.close();
                break;
        }
    }

    openModalChangeName() {
        $('#input_player_name').val(temp_name);
        $('.overlay').fadeIn('fast');
        $('.modal.change_name').fadeIn('fast');
    }

    saveName() {
        temp_name = $('#input_player_name').val();
        this.closeModalChangeName();
    }

    closeModalChangeName() {
        $('.overlay').fadeOut('fast');
        $('.modal.change_name').fadeOut('fast');
    }
}

class Game {
    players = [];
    map;

    LoadGame() {
        this.map = new Map();
        this.players.push(new Player());
    }
}

class Player {
    // сетевые параметры
    id = 0;
    name = '';

    // координты
    position = {
        x: 200,
        y: 200,
        dx: 0,
        dy: 0,
        angle: 0,
        speed: 3,
        radius: 20
    }

    // html объекты
    obj = $(`<player></player>`);
    sprite = $('<sprite></sprite>');
    mesh = $(`<mesh></mesh>`).css({
        width: this.position.radius * 2,
        height: this.position.radius * 2
    })


    // анимация
    animationData = {
        flashlight: {
            idle: {
                count: 20,
                name: 'flashlight/idle/survivor-idle_flashlight_',
                endName: '.png',
                width: 303,
                height: 223
            },
            meleeAttack: {
                count: 15,
                name: 'flashlight/meleeAttack/survivor-meleeAttack_flashlight_',
                endName: '.png',
                width: 316,
                height: 246
            },
            move: {
                count: 20,
                name: 'flashlight/move/survivor-move_flashlight_',
                endName: '.png',
                width: 305,
                height: 231
            }
        },
        handgun: {
            idle: {
                count: 20,
                name: 'handgun/idle/survivor-idle_handgun_',
                endName: '.png',
                width: 253,
                height: 216
            },
            meleeAttack: {
                count: 15,
                name: 'handgun/meleeattack/survivor-meleeattack_handgun_',
                endName: '.png',
                width: 291,
                height: 256
            },
            move: {
                count: 20,
                name: 'handgun/move/survivor-move_handgun_',
                endName: '.png',
                width: 258,
                height: 220
            },
            reload: {
                count: 15,
                name: 'handgun/reload/survivor-reload_handgun_',
                endName: '.png',
                width: 260,
                height: 230
            },
            shoot: {
                count: 3,
                name: 'handgun/shoot/survivor-shoot_handgun_',
                endName: '.png',
                width: 255,
                height: 215
            },
        },
        knife: {
            idle: {
                count: 20,
                name: 'knife/idle/survivor-idle_knife_',
                endName: '.png',
                width: 289,
                height: 224
            },
            meleeattack: {
                count: 15,
                name: 'knife/meleeattack/survivor-meleeattack_knife_',
                endName: '.png',
                width: 329,
                height: 300
            },
            move: {
                count: 20,
                name: 'knife/move/survivor-move_knife_',
                endName: '.png',
                width: 279,
                height: 219
            },
        },
        rifle: {
            idle: {
                count: 20,
                name: 'rifle/idle/survivor-idle_rifle_',
                endName: '.png',
                width: 317,
                height: 207
            },
            meleeattack: {
                count: 15,
                name: 'rifle/meleeattack/survivor-meleeattack_rifle_',
                endName: '.png',
                width: 358,
                height: 353
            },
            move: {
                count: 20,
                name: 'rifle/move/survivor-move_rifle_',
                endName: '.png',
                width: 313,
                height: 206
            },
            reload: {
                count: 20,
                name: 'rifle/reload/survivor-reload_rifle_',
                endName: '.png',
                width: 322,
                height: 217
            },
            shoot: {
                count: 3,
                name: 'rifle/shoot/survivor-shoot_rifle_',
                endName: '.png',
                width: 312,
                height: 206
            },
        },
        shotgun: {
            idle: {
                count: 20,
                name: 'shotgun/idle/survivor-idle_shotgun_',
                endName: '.png',
                width: 313,
                height: 207
            },
            meleeattack: {
                count: 15,
                name: 'shotgun/meleeattack/survivor-meleeattack_shotgun_',
                endName: '.png',
                width: 358,
                height: 353
            },
            move: {
                count: 20,
                name: 'shotgun/move/survivor-move_shotgun_',
                endName: '.png',
                width: 313,
                height: 206
            },
            reload: {
                count: 20,
                name: 'shotgun/reload/survivor-reload_shotgun_',
                endName: '.png',
                width: 322,
                height: 217

            },
            shoot: {
                count: 3,
                name: 'shotgun/shoot/survivor-shoot_shotgun_',
                endName: '.png',
                width: 312,
                height: 206

            },
        }
    };
    animation;
    animationTimer;
    scale = 2.5;

    constructor() {
        // ставим персонажа в начальные координаты
        this.setPosition();

        //запускаем анимацию
        this.startAnimation();
        this.startMovement();
        this.startRotate();

        // добавляем html объекты персонажа в игру
        this.mesh.appendTo(this.obj);
        this.sprite.appendTo(this.obj);
        this.obj.appendTo(game.map.obj);
    }

    startRotate() {
        let body = $('body');
        body.on("mousemove", (event) => {
            globalMouse = {x: event.clientX, y: event.clientY};
            this.updateAngle();
        })
    }

    updateAngle() {
        this.position.angle = ((Math.atan2(globalMouse.y - this.position.y - game.map.position.y, globalMouse.x - this.position.x - game.map.position.x) + 2 * Math.PI) * 180 / Math.PI) % 360;
        this.obj.css({transform: `rotate(${this.position.angle}deg)`})
    }

    startMovement() {
        let body = $('body');
        body.on('keydown', (event) => {
            this.updateAngle();
            this.position.dx = 0;
            this.position.dy = 0;
            switch (event.code) {
                case 'KeyA':
                    this.position.dx += -Math.sin((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.position.dy += -Math.cos((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
                case 'KeyW':
                    this.position.dx += Math.cos((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.position.dy += -Math.sin((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
                case 'KeyD':
                    this.position.dx += Math.sin((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.position.dy += Math.cos((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
                case 'KeyS':
                    this.position.dx += -Math.cos((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.position.dy += Math.sin((360 - this.position.angle) * (Math.PI / 180)) * this.position.speed;
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
            }
        });
        body.on('keyup', (event) => {
            switch (event.code) {
                case 'KeyA':
                case 'KeyD':
                case 'KeyW':
                case 'KeyS':
                    this.position.dx = 0
                    this.position.dy = 0
                    break;
            }
            if (this.position.dx === 0 && this.position.dy === 0) {
                this.setAnimation(this.animationData.flashlight.idle);
            }
        });
        setInterval(() => {
            let stop = false;
            game.map.objects.walls.forEach((item) => {
                if (circleRect(
                    this.position.x + this.position.dx,
                    this.position.y + this.position.dy,
                    this.position.radius,
                    item.x,
                    item.y,
                    item.w,
                    item.h
                )) {
                    stop = true;
                }
            })
            if (stop) {
                return;
            }

            this.position.x += this.position.dx
            this.position.y += this.position.dy

            this.setPosition();
        }, 500 / 60);
    }

    startAnimation(animation = this.animationData.flashlight.idle) {
        let index = 0;
        this.setAnimation(this.animationData.flashlight.idle);
        let animationTimer = setInterval(() => {
            this.sprite.css({
                background: `url(assets/img/player/${this.animation.name}${index}${this.animation.endName})`,
                'background-size': 'cover'
            })
            index++;
            index = index % this.animation.count;
        }, 50);
    }

    setPosition() {

        game.map.setPosition(
            (window.innerWidth - window.innerWidth / 2 - this.position.x),
            (window.innerHeight - window.innerHeight / 2 - this.position.y)
        );

        this.obj.css({
            top: this.position.y,
            left: this.position.x
        });
    }

    setAnimation(animation) {
        this.animation = animation;
        this.sprite.width(animation.width / this.scale);
        this.sprite.height(animation.height / this.scale);
    }
}

class Map {
    scale = 1; //Изменение масштаба карты. По умолчанию  = 1
    objects = {
        walls: [
            {x: 0, y: 400, w: 100, h: 15},
            {x: 200, y: 400, w: 300, h: 15},
            {x: 500, y: 188, w: 15, h: 227},
            {x: 500, y: 0, w: 15, h: 88},
            {x: 515, y: 400, w: 239, h: 15},
            {x: 754, y: 88, w: 15, h: 327},
            {x: 754, y: 80, w: 600, h: 15},
            {x: 1039, y: 95, w: 15, h: 320},
            {x: 1309, y: 181, w: 15, h: 263},
            {x: 1324, y: 181, w: 758, h: 15},
            {x: 2082, y: 181, w: 15, h: 114},
            {x: 2082, y: 295, w: 114, h: 15},
            {x: 2196, y: 169, w: 15, h: 141},
            {x: 2196, y: 0, w: 15, h: 70},
            {x: 2196, y: 525, w: 15, h: 197},
            {x: 2211, y: 616, w: 300, h: 15},
            {x: 2511, y: 0, w: 15, h: 631},
            {x: 1309, y: 922, w: 902, h: 15},
            {x: 1294, y: 617, w: 15, h: 320},
            {x: 407, y: 602, w: 902, h: 15},
            {x: 850, y: 617, w: 15, h: 469},
            {x: 392, y: 602, w: 15, h: 130},
            {x: 267, y: 732, w: 140, h: 15},
            {x: 252, y: 732, w: 15, h: 462},
            {x: -4, y: 732, w: 156, h: 15},
            {x: 0, y: 1294, w: 267, h: 15},
            {x: 476, y: 1186, w: 818, h: 15},
            {x: 375, y: 1344, w: 15, h: 187},
            {x: 375, y: 1631, w: 15, h: 180},
            {x: 532, y: 1344, w: 15, h: 112},
            {x: 532, y: 1556, w: 15, h: 255},
            {x: 532, y: 1811, w: 3097, h: 15},
            {x: 2631, y: 1456, w: 15, h: 255},
            {x: 2746, y: 1448, w: 868, h: 15},
            {x: 3614, y: 0, w: 15, h: 1811},
            {x: 0, y: 1811, w: 390, h: 15},
            {x: 382, y: 1811, w: 150, h: 15},
            {x: 0, y: 0, w: 15, h: 1826},
            {x: 15, y: 0, w: 3599, h: 15},

        ],
        floor: {
            x: 0,
            y: 0,
            w: 3614,
            h: 1811
        }
    }
    obj = $(`<map></map>`).css({zoom: this.scale});
    position = {x: 0, y: 0}

    setPosition(x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.obj.css({
            left: x,
            top: y
        })
    }

    constructor() {
        let floor = $(`<floor></floor>`).css({
            width: this.objects.floor.w,
            left: this.objects.floor.x,
            top: this.objects.floor.y,
            height: this.objects.floor.h,
        })
        floor.appendTo(this.obj)
        for (let i = 0; i < this.objects.walls.length; i++) {
            let bg;
            if (this.objects.walls[i].h < this.objects.walls[i].w) {
                bg = 'url(assets/img/walls/horizontal.png)'
            } else {
                bg = 'url(assets/img/walls/vertical.png)'
            }
            let wall = $(`<wall></wall>`).css({
                width: this.objects.walls[i].w,
                left: this.objects.walls[i].x,
                top: this.objects.walls[i].y,
                height: this.objects.walls[i].h,
                background: bg
            })
            wall.appendTo(this.obj)
        }

        this.obj.appendTo('#game');
    }
}

let temp_name = '';


const menu = new MenuUI();
const game = new Game();

function circleRect(cx, cy, radius, rx, ry, rw, rh) {

    // temporary variables to set edges for testing
    let testX = cx;
    let testY = cy;

    // which edge is closest?
    if (cx < rx) testX = rx;      // test left edge
    else if (cx > rx + rw) testX = rx + rw;   // right edge
    if (cy < ry) testY = ry;      // top edge
    else if (cy > ry + rh) testY = ry + rh;   // bottom edge

    // get distance from closest edges
    let distX = cx - testX;
    let distY = cy - testY;
    let distance = Math.sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the radius, collision!
    return distance <= radius;
}

function tutorial() {
    //это array push
    let ggg = [7, 6, 3, 12, 33]
    ggg.push(22)
//получится://[7,6,3,12,33,22]


//это  array length
//просто делаем масив с числами
    let hhh = [1, 2, 3, 4, 677, 898090, 7]
//нам нужно скоротить до трёх например
//это делается вот так:
    hhh.length
//потом получится:let hhh = [1,2,3]
//я это не где не копировал,а писал сам


//foreach выполняет цикл по массиву и имеет внутри себя переменную со значением из массива

    let jjj = [1, 3, 43, 6, 7, 78, 8, 9];

    jjj.forEach((item) => {
        console.log(item)
    });


//это array includes
//делаем масив
    let xxx = [1, 2, 3, "a", "b", "c"];
//например у тебя огромный массив и тебе нужно проверить есть ли буква "d" или число 4
//тогда мы пишем название масива например xxx.includes() в скобках пишем число или букву или слово
    xxx.includes("a");  // истина(есть в массиве)
    xxx.includes("d"); // ложь(нет в массиве)
    xxx.includes("b"); // это истина (есть в массиве)
    xxx.includes(4); // ложь(нет в масиве)
//итог если мы напишем console.log() то нам выведет "a"(true) "d"(false)и т.д


//это array join понял не сразу,но понял
//делаем масив с числами
    let aaa = [1, 2, 3];
//теперь делаем просто обычный let в который напишем название класа а потом .join()
//в скобочках мы пишем либо "+" либо "-" либо пустые" " они по умолчанию расставляют запятые в массиве
    let sss = aaa.join("-");
//итог если мы напишем console.log() нам выведет 1-2-3
}


