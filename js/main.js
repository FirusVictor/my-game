class MenuUI {
    activeWindow = null;
    menuButtons = {
        CREATE: 'window_create',
        JOIN: 'window_join',
        CHANGE_NAME: 'name',
        EXIT: 'exit',
    }
    openMenu(type) {
        this.activeWindow = type;
        const windows = $('.menu .main-content>*:not(#'+type+')');
        switch (this.activeWindow) {
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
    openModalChangeName(){
        $('#input_player_name').val(temp_name);
        $('.overlay').fadeIn('fast');
        $('.modal.change_name').fadeIn('fast');
    }
    saveName(){
        temp_name = $('#input_player_name').val();
        this.closeModalChangeName();
    }
    closeModalChangeName(){
        $('.overlay').fadeOut('fast');
        $('.modal.change_name').fadeOut('fast');
    }
}

let temp_name = '';


const menu = new MenuUI();
