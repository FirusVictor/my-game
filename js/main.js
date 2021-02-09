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

    LoadGame() {
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
        dy:0,
        speed: 5
    }

    // html объекты
    obj = $(`<player></player>`);
    sprite = $('<sprite></sprite>');

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
        handgun:{
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
        knife:{
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
        rifle:{
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
        shotgun:{
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

    constructor() {
        // ставим персонажа в начальные координаты
        this.setPosition();

        //запускаем анимацию
        this.startAnimation();
        this.startMovement();
        this.startRotate();

        // добавляем html объекты персонажа в игру
        this.sprite.appendTo(this.obj);
        this.obj.appendTo('#game');
    }

    startRotate(){
        let body = $('body');
        body.on("mousemove",(event)=>{
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            let deg = ((Math.atan2(mouseY - this.position.y, mouseX - this.position.x) + 2 * Math.PI) * 180 / Math.PI) % 360;
            this.obj.css({transform:`rotate(${deg}deg)`})
        })
    }

    startMovement(){
        let body = $('body');
        body.on('keydown',(event)=>{
            switch (event.code){
                case 'KeyA':
                    this.position.dx = -5
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
                case 'KeyW':
                    this.position.dy = -5
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
                case 'KeyD':
                    this.position.dx = 5
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
                case 'KeyS':
                    this.position.dy = 5
                    this.setAnimation(this.animationData.flashlight.move);
                    break;
            }
        });
        body.on('keyup',(event)=>{
            switch (event.code){
                case 'KeyA':
                case 'KeyD':
                    this.position.dx = 0
                    break;
                case 'KeyW':
                case 'KeyS':
                    this.position.dy = 0
                    break;
            }
            if(this.position.dx === 0 && this.position.dy === 0){
                this.setAnimation(this.animation.flashlight.idle);
            }
        });
        setInterval(()=>{
            this.position.x += this.position.dx
            this.position.y += this.position.dy

            this.setPosition();
        }, 1000/60);
    }

    startAnimation(animation = this.animationData.flashlight.idle) {
        let index = 0;
        this.setAnimation(this.animationData.flashlight.idle);
        let animationTimer = setInterval(() => {
            this.sprite.css({background: `url(assets/img/player/${this.animation.name}${index}${this.animation.endName})`})
            index++;
            index = index % this.animation.count;
            console.log(this.animation.name);
        }, 50);
    }

    setPosition() {
        this.obj.offset({
            top: this.position.y,
            left: this.position.x
        });
    }

    setAnimation(animation) {
        this.animation = animation;
        this.sprite.width(animation.width);
        this.sprite.height(animation.height);
    }
}

let temp_name = '';


const menu = new MenuUI();
const game = new Game();
