/// <reference path="../libs/layaAir.d.ts" />
/// <reference path="./socket/Socket.ts" />
/// <reference path="./ui/view/StartPage.ts" />
/// <reference path="./utils/Utils.ts" />
/// <reference path="./config.ts" />
/// <reference path="./global.ts" />
/// <reference path="./Loading.ts" />

import Animation = laya.display.Animation;
import Rectangle = laya.maths.Rectangle;
import BitmapFont = laya.display.BitmapFont;
import Tween = laya.utils.Tween;
import Ease = laya.utils.Ease;
import WebGL = laya.webgl.WebGL;
import Sprite = laya.display.Sprite;
import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;
import Texture = laya.resource.Texture;
import LayaText = laya.display.Text;
import LayaEvent = laya.events.Event;
import Pool = laya.utils.Pool;
import ColorFilter = Laya.ColorFilter;
import SoundManager = Laya.SoundManager;

/**
 * 程序入口类
 */
class Main {
    // 资源数组
    private assets: Array<Object> = [];
    // 游戏场景页面
    private _startPage: StartPage;
    private _gamePage: Sprite;
    private _bg: Sprite;
    private _bitmapfont: BitmapFont;
    private _loading: Loading;
    
    constructor() {
        let assetsKeys = Object.keys(Assets.Img);
        let jsonKeys = Object.keys(Assets.Json);
        let soundKeys = Object.keys(Assets.Sound);

        for(let j = 0; j < soundKeys.length; j++) {
            this.assets.push({url: Assets.Sound[soundKeys[j]], type: Loader.SOUND});
        }
        for(let i = 0; i < assetsKeys.length; i++) {
            this.assets.push({url: Assets.Img[assetsKeys[i]], type: Loader.IMAGE});
        }
        for(let j = 0; j < jsonKeys.length; j++) {
            this.assets.push({url: Assets.Json[jsonKeys[j]], type: Loader.ATLAS});
        }
        
        this.initLaya();
        this._loading = new Loading();

        // resize
        Laya.stage.on(LayaEvent.RESIZE, this, this.onStageResize);

        // 加载资源
        Laya.loader.load(this.assets, Handler.create(this, this.onLoaded), Handler.create(this, this.onLoading, null, false), Loader.TEXT);
    }

    private static instance: Main;
    public static get Instance(): Main {
        if (Main.instance == null) {
            Main.instance = new Main();
        }
        return Main.instance;
    }

    get gamePage() {
        return this._gamePage;
    }

    get startPage() {
        return this._startPage;
    }

    get bg() {
        return this._bg;
    }
    
    /**
     * 加载资源完
     */
    private onLoaded() {
        this._loading.hide();

        // 初始化socket
       this.initSocket();


        // 加载位图字体
        this._bitmapfont = new BitmapFont();
        this._bitmapfont.loadFont(Assets.font.num, Handler.create(this, () => {
            LayaText.registerBitmapFont('diyfont', this._bitmapfont);
        }));

        // 初始化空的游戏场景页
        this._gamePage = new Sprite();
        this._gamePage.name = DisplayName.GamePage;
        this._gamePage.zOrder = DisplayOrder.GamePage;
        this._gamePage.pivot(config.gameWidth/2, config.gameHeight/2);
        this._gamePage.pos(global.leftEdge + config.gameWidth/2, config.gameHeight/2);

        // 初始化startUI
        this._startPage = new StartPage();
        
        // 显示全局背景
        this.showBackground();

        // 初始化游戏场景的左边缘和右边缘位置
        global.leftEdge = (Laya.stage.width - config.gameWidth)/2;
        global.rightEdge = (Laya.stage.width + config.gameWidth)/2;

        Laya.stage.addChild(this._gamePage);
        Laya.stage.addChild(this._startPage);  
    }

    /**
     * 加载中
     */
    private onLoading(progress: number) {
        this._loading.setProcess(progress);
    }

    /**
     * 添加全局背景
     */
    public showBackground() {
        this._bg = new Sprite();
        this._bg.loadImage(Assets.Img.startBg);
        this._bg.pivot(640, 400);
        this._bg.zOrder = DisplayOrder.Background;
        this._bg.pos(Laya.stage.width/2, Laya.stage.height/2);

        Laya.stage.addChild(this._bg);
    }

    /**
     * 用动画的方式移除背景
     */
    public removeBackground() {

        // 把背景设置高于gamepage，来辅助实现动画的缓动性和流畅性
        this._bg.zOrder = DisplayOrder.Background_H;

        Tween.to(this._bg, {alpha: 0}, 1000, null, Handler.create(this, () => {
            Laya.stage.removeChild(this._bg);
            this._bg.alpha = 1;
            this._bg.zOrder = DisplayOrder.Background;
        }));
    }

    /**
     * 屏幕resize逻辑
     */
    private onStageResize() {
        global.leftEdge = (Laya.stage.width - config.gameWidth)/2;
        global.rightEdge = (Laya.stage.width + config.gameWidth)/2;

        this.repos();
    }

    /**
     * 初始化laya配置
     */ 
    private initLaya() {

        // 游戏舞台设置
        Laya.init(config.gameWidth, config.gameHeight, WebGL);
        Laya.stage.scaleMode = 'fixedheight';
        // Laya.stage.screenMode = 'vertical';
        Laya.stage.alignH = 'center';
        Laya.stage.alignV = 'middle';
        Laya.stage.bgColor = '#000000';

        // Laya.Stat.show();
    }

    /**
     * 初始化socket
     */
    private initSocket() {
        var socket = Socket.Instance;

        socket.initListen();
        socket.login('user'+Math.round(Math.random() * 1000));
    }

    /**
     * 切换到开始菜单界面
     */
    public backToMenu() {

        // 去除消息显示界面和分数显示界面
        MsgManager.Instance.removeMessage();
        ScoreManager.Instance.removeResultView();

        // 重建开始界面
        Laya.stage.addChild(this._bg);
        Laya.stage.addChild(this.startPage);

        // 退场动画
        Tween.to(this.gamePage, {y: -800, alpha: 0}, 800, null, Handler.create(this, () => {
            this.gamePage.alpha = 1;
            this.gamePage.y = config.gameHeight/2;
            this.gamePage.removeChildren();
        }));
    }

    /**
     * 重定位
     */
    private repos() {
        let msg = MsgManager.Instance.msg;
        let tipsText = MsgManager.Instance.tipsText;
        let bulletProcess = Game.Instance.bulletProcess;
        let timer = Game.Instance.timer;
        let toolTagContainer = Game.Instance.toolTagContainer;
        let btnSwitch = Game.Instance.btnSwitch;
        let myScorePanel = ScoreManager.Instance.myScorePanel;
        let yourScorePanel = ScoreManager.Instance.yourScorePanel;
        let resultView = ScoreManager.Instance.resultView;

        if(this._startPage) this._startPage.pos(global.leftEdge, 0);
        if(this._gamePage) this._gamePage.pos(global.leftEdge + config.gameWidth/2, config.gameHeight/2);
        if(this._bg) this._bg.pos(Laya.stage.width/2, Laya.stage.height/2);
        if(msg) msg.pos(Laya.stage.width/2, Laya.stage.height/2);
        if(tipsText) tipsText.pos(Laya.stage.width/2, Laya.stage.height - 100);
        if(bulletProcess) bulletProcess.repos();
        if(timer) timer.repos();
        if(toolTagContainer) toolTagContainer.repos();
        if(btnSwitch) btnSwitch.repos();
        if(myScorePanel) myScorePanel.repos();
        if(yourScorePanel) yourScorePanel.repos();
        if(resultView) resultView.repos();
    }
}

Main.Instance;

