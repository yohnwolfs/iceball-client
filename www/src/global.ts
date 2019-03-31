var global = {
    /**
     * @desc 游戏区域左边缘
     */
    leftEdge: 0,
    /**
     * @desc游戏区域右边缘
     */
    rightEdge: 0,
    /**
     * 同步辅助值 0：使用己方子弹进行碰撞检测 1：相反
     */
    syn: 0
};

/**
 * 标记显示层对象
*/
var DisplayName = {
    StartPage: 'startpage',
    GamePage: 'gamepage',
    Loading: 'loading'
};

/**
 * 显示层排序序号
 */
var DisplayOrder = {
    Background: 0,
    StartPage: 1,
    GamePage: 2,
    Background_H: 3,
    Loading: 5,
    AssistLine: 10,
    Shadow: 15,
    Bullet: 16,
    BulletBoom: 18,
    Ball: 20,
    Smoke: 21,
    Cannon: 22,
    BtnSwitch: 25,
    ToolContainer: 26,
    PProcess: 27,
    ProcessBar: 28,
    Timer: 29,
    ResultPage: 30,
    CountText: 31,
    ScorePanel: 32,
    Msg: 35 
};

var Tool = {
    StandardBullet: {
        tag: 'bullet',
        name: '子弹'
    },
    IceBullet: {
        tag: 'ice',
        name: '冰弹'
    },
    DivisionBullet: {
        tag: 'division',
        name: '分裂弹'
    },
    SmokeBullet: {
        tag: 'smoke',
        name: '烟雾弹'
    },
    BombBullet: {
        tag: 'bomb',
        name: '炸弹'
    }
};

/**
 *  全局资源对象
 */
var Assets = {
    Img: {
        gamebg: 'res/gamebg.png',
        cannon_m: 'res/cannon_m.png',
        cannon_y: 'res/cannon_y.png',
        cannon_shadow: 'res/cannon_shadow.png',
        bulletm: 'res/bullet_m.png',
        bullety: 'res/bullet_y.png',
        bullet_ice: 'res/bullet_ice.png',
        bullet_division: 'res/bullet_division.png',
        bullet_bomb: 'res/bullet_bomb.png',
        bullet_smoke: 'res/bullet_smoke.png',
        ball: 'res/ball.png',
        process: 'res/process.png',
        processBg: 'res/processbg.png',
        startBg: 'res/startbg.png',
        msgBg: 'res/msgbg.png',
        scoreBg: 'res/scorebg.png',
        timerBg: 'res/timerbg.png',
        pprocess: 'res/pprocess.png',
        pprocessbg: 'res/pprocessbg.png',
        tooltag_ice: 'res/tooltag_ice.png',
        tooltag_division: 'res/tooltag_division.png',
        tooltag_smoke: 'res/tooltag_smoke.png',
        tooltag_bullet: 'res/tooltag_bullet.png',
        tooltag_bomb: 'res/tooltag_bomb.png',
        btn_switch_bg: 'res/btn_switch_bg.png',
        btn_switch_center: 'res/btn_switch_center.png',
        ball_effect_ice: 'res/ice.png'
    },
    Json: {
        start_json: 'res/start.json',
        result_json: 'res/ResultPage.json',
        blue_boom: 'res/blueboom.json',
        red_boom: 'res/redboom.json',
        green_boom: 'res/greenboom.json',
        boom: 'res/boom.json',
        smoke: 'res/smoke.json'
    },
    Sound: {
        hit_001: 'res/sounds/hit001.mp3',
        hit_002: 'res/sounds/hit002.mp3',
        boom_001: 'res/sounds/boom001.mp3',
        boom_002: 'res/sounds/boom002.mp3',
        boom_003: 'res/sounds/boom003.mp3',
        button_001: 'res/sounds/button001.mp3',
        shoot: 'res/sounds/shoot.mp3',
        smoke: 'res/sounds/smoke.mp3',
        frozen: 'res/sounds/frozen.mp3',
        findmatch: 'res/sounds/findmatch.mp3',
        counter: 'res/sounds/counter.mp3',
        gamestart: 'res/sounds/gamestart.mp3',
        gamewin: 'res/sounds/gamewin.mp3',
        gameover: 'res/sounds/gameover.mp3',
        mscore: 'res/sounds/mscore.mp3',
        yscore: 'res/sounds/yscore.mp3'
    },
    font: {
        num: 'res/numfont.fnt'
    }
}