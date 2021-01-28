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
    id = 0;
    name = '';
    position = {
        x: 200,
        y: 200
    }
    obj = $('<player></player>');

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
                name: 'flashlight/meleeattack/survivor-meleeattack_flashlight_',
                endName: '.png',
                width: 316,
                height: 446
            },
            move: {
                count: 20,
                name: 'flashlight/idle/survivor-move_flashlight_',
                endName: '.png',
                width: 305,
                height: 231
            },
        }
    }


    constructor() {
        this.setPosition(this.position.x, this.position.y);
        this.obj.appendTo('#game');
    }

    setPosition(x, y) {
        this.obj.offset({
            top: y,
            left: x
        });
    }
}

let temp_name = '';


const menu = new MenuUI();
const game = new Game();
