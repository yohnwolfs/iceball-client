
/// <reference path="./gameobject/BaseBall.ts" />
/// <reference path="./gameobject/Ball.ts" />
/// <reference path="./gameobject/Cannon.ts" />
/// <reference path="./gameobject/BulletProcess.ts" />
/// <reference path="./gameobject/Timer.ts" />
/// <reference path="./gameobject/DashLine.ts" />
/// <reference path="./gameobject/tool/ToolTagContainer.ts" />
/// <reference path="./gameobject/tool/BtnSwitch.ts" />
/// <reference path="./AnimationManager.ts" />
/// <reference path="./ScoreManager.ts" />
/// <reference path="./MsgManager.ts" />

/**
 * 帧更新包
 */
interface FramePack {
    keyframe: number;
    ctrls: Array<Ctrl>;
}

/**
 * 用户操作
 */
interface Ctrl {
    id: string;
    ctrl: CtrlData
}

interface CtrlData {
    angle: number,
    power: number,
    bulletType: string
}

/**
 * 游戏逻辑类
 */
class Game {
    private keyframe: number = 0;
    private curframe: number = 0;
    // 游戏状态
    // -1 游戏未开始
    // 0 停止（新球生成中） 禁止任何操作和不接受新的子弹发射请求
    // 1 正常运行
    public _status: number = -1;
    // 帧更新队列
    private _updateList: Array<FramePack> = [];
    // 游戏元素 游戏UI
    private _myCannon: Cannon;
    private _yourCannon: Cannon;
    private _gameBg: Sprite;
    private _ball: Ball;
    private _dashLine: DashLine;
    private _bulletProcess: BulletProcess;
    private _pprocess: PProcess;
    private _timer: Timer;
    private _counter: CountDown;
    private _toolTagContainer: ToolTagContainer;
    private _btnSwitch: BtnSwitch;
    public smoke1;
    public smoke2;
    public ballDirections = [];
    public ballDirectionFactor = 0;

    constructor() {
        
    }

    private static instance: Game;
    public static get Instance(): Game {
        if (Game.instance == null) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    get ball() {
        return this._ball;
    }

    get bulletProcess() {
        return this._bulletProcess;
    }

    get timer() {
        return this._timer;
    }

    get status() {
        return this._status;
    }

    get counter() {
        return this._counter;
    }

    get toolTagContainer() {
        return this._toolTagContainer;
    }

    get btnSwitch() {
        return this._btnSwitch;
    }

    set status(status: number) {
        this._status = status;
    }

    get updateList() {
        return this._updateList;
    }

    public getBallDirection() {
        if(!this.ballDirections.length) return;
        let direction = this.ballDirections.shift();
        this.ballDirections.push(direction);
        return direction;
    }

    /**
     * 获取一个定时器
     */
    public getCounter(func: () => void) {
        this._counter = new CountDown(3, func);
        return this._counter;
    }

    /**
     * 初始化游戏场景
     */
    public initScene() {
        this.initBG();
        this.initRole();
        this.initUI();
    }

    public startLoop() {
        this._updateList.splice(0, 180);
        Laya.timer.frameLoop(1, this, this.update);
    }

    /**
     * 初始化背景
     */
    private initBG() {
        let gamePage = Main.Instance.gamePage;

        this._gameBg = new Sprite();
        this._gameBg.loadImage(Assets.Img.gamebg);
        this._gameBg.pivot(640, 400);
        this._gameBg.pos(config.gameWidth / 2, config.gameHeight / 2);

        gamePage.addChild(this._gameBg);
    }

    /**
     * 初始化游戏角色元素
     */
    private initRole() {
        let gamePage = Main.Instance.gamePage;

        // 初始化双方炮台
        this._myCannon = new Cannon(false);
        this._yourCannon = new Cannon(true);

        gamePage.addChild(this._myCannon);
        gamePage.addChild(this._yourCannon);
    }

    /**
     * 初始化UI
     */
    private initUI() {

        // 初始化分数和分数板
        ScoreManager.Instance.initScore();

        // 子弹填充进度条
        this._bulletProcess = new BulletProcess();

        // 力度进度条
        this._pprocess = new PProcess();

        // 计时器
        this._timer = new Timer();

        // 道具容器
        this._toolTagContainer = new ToolTagContainer();

        // 切换道具按钮
        this._btnSwitch = new BtnSwitch();

        // 辅助线
        this._dashLine = new DashLine(this._myCannon.x, this._myCannon.y);
        Main.Instance.gamePage.addChild(this._dashLine);
    }

    /**
     * 初始化小球
     */
    public initBall(direction: number) {
        let gamePage = Main.Instance.gamePage;

        // 初始化比赛球
        this._ball = new Ball(direction);

        gamePage.addChild(this._ball);
    }

    /**
     * 初始化玩家控制器
     */
    public initControl() {
        this._gameBg.on(LayaEvent.MOUSE_DOWN, this, this.onMouseDown);

        Laya.stage.on(LayaEvent.KEY_PRESS, this, this.onKeyPress);
    }

    /**
     * 停止控制
     */
    public stopControl() {
        this._gameBg.off(LayaEvent.MOUSE_DOWN, this, this.onMouseDown);

        Laya.stage.off(LayaEvent.KEY_PRESS, this, this.onKeyPress);
    }

    /**
     * 键盘控制
     */
    public onKeyPress(e: LayaEvent) {
        let toolTagContainer = Game.Instance.toolTagContainer;

        switch (e.keyCode) {
            case 49:
                toolTagContainer.selectTag(0);
                break;
            case 50:
                toolTagContainer.selectTag(1);
                break;
            case 51:
                toolTagContainer.selectTag(2);
                break;
        }
    }

    /**
     * 点击滑动操控
     */
    private onMouseDown(e: LayaEvent) {

        this._gameBg.on(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        this._gameBg.on(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        this._gameBg.on(LayaEvent.MOUSE_OUT, this, this.onMouseUp);

        // 蓄力条开始蓄力
        this._pprocess.start();

        // 计算点击点和炮台旋转角度
        let mouse = Utils.p(Laya.stage.mouseX - global.leftEdge, Laya.stage.mouseY);
        let vector = Utils.p(mouse.x - this._myCannon.x, mouse.y - this._myCannon.y);
        let angle: number = -1 * Math.atan(vector.x / vector.y) * 180 / Math.PI;

        this._dashLine.drawAssistLine(mouse);
        this._myCannon.setAngle(angle);
    }

    private onMouseUp(e: LayaEvent) {
        let toolTagContainer = Game.Instance.toolTagContainer;

        this._gameBg.off(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        this._gameBg.off(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        this._gameBg.off(LayaEvent.MOUSE_OUT, this, this.onMouseUp);

        // 松手清除虚线
        this._dashLine.clearLines();

        // 发送发射子弹请求
        if (this._status !== 0 && !toolTagContainer.isLock() && this.bulletProcess.costOne(this._pprocess.percent * 2 + (toolTagContainer.isSelectFirst()? 0 : 0.4))) {
            let ctrlData = {
                angle: this._myCannon.getAngle(),
                power: this._pprocess.percent,
                bulletType: toolTagContainer.getSelectedToolId()
            };
            toolTagContainer.lock();
            Socket.Instance.sendCtrl(ctrlData);
        }

        // 停止并清空蓄力条
        this._pprocess.stop();
    }

    private onMouseMove(e: LayaEvent) {
        let mouse = Utils.p(Laya.stage.mouseX - global.leftEdge, Laya.stage.mouseY);
        let vector = Utils.p(mouse.x - this._myCannon.x, mouse.y - this._myCannon.y);
        let angle: number = -1 * Math.atan(vector.x / vector.y) * 180 / Math.PI;

        this._dashLine.drawAssistLine(mouse);
        this._myCannon.setAngle(angle);
    }

    /**
     * 帧监听
     */
    private update() {
        this.checkUpdateList();
    }

    /**
     * 检测数据包队列
     */
    private checkUpdateList() {
        let l = this._updateList.length;

        if (l > 0 && l < 10) {
            let data: FramePack = this._updateList.splice(0, 1)[0];
            this.runFramePack(data);
            this.runFrameLogic();
        }
        else if (l >= 10) {

            // 根据待执行数据大小决定加速的速度
            let dlength = l < 100 ? 2 : Math.ceil(l / 50);
            let data: FramePack[] = this._updateList.splice(0, dlength);

            for (let i = 0; i < data.length; i++) {
                this.runFramePack(data[i]);
                this.runFrameLogic();
            }
        }
        else {
            return;
        }
    }

    /**
     * 执行游戏元素的帧逻辑
     */
    private runFrameLogic() {

        // 子弹
        if (global.syn === 0) {
            for (let bA of Bullet.myBullets) {
                bA.update();
            }
            for (let bB of Bullet.yourBullets) {
                bB.update();
            }
        }
        else if (global.syn === 1) {
            for (let bB of Bullet.yourBullets) {
                bB.update();
            }
            for (let bA of Bullet.myBullets) {
                bA.update();
            }
        }

        // 小球
        this._ball.update();

        // 子弹填充进度条
        this._bulletProcess.update();

        // 蓄力条
        this._pprocess.update();

        // 计时器
        this._timer.update();
    }

    /**
     * 解析服务器帧数据
     */
    private runFramePack(data: FramePack) {
        let uid: string = Socket.Instance.getUid();
        let role: string;

        for (let c of data.ctrls) {
            role = c.id === uid ? 'myrole' : 'yourrole';

            this.playData(role, c.ctrl);
        }

        this.curframe = data.keyframe;
    }

    /**
     * 数据输入队列
     */
    public pushUpdateData(data: FramePack) {
        this._updateList.push(data);
    }

    public clearUpdateList() {
        // 如果有上一局残留数据则清空删除
        if (this._updateList.length > 0) this._updateList = [];
    }

    /**
     * 解析运行数据
     */
    private playData(role: string, ctrl: CtrlData) {
        let toolTagContainer = Game.Instance.toolTagContainer;

        if (this._status === 0) return;

        if (role === 'myrole') {
            this._myCannon.shoot(ctrl.angle, ctrl.power, ctrl.bulletType);

            // 使用道具的动画
            toolTagContainer.useSelectTag();
        }
        else if (role === 'yourrole') {
            this._yourCannon.shoot(ctrl.angle, ctrl.power, ctrl.bulletType);
        }
    }

    /**
     * 停止游戏
     */
    public gameOver() {
        if (this._status === -1) return;

        Laya.timer.clearAll(this);

        // 使缓存中的子弹爆炸
        Bullet.boomAllBullets();

        // 清理未完成的计时器任务
        Game.Instance.timer.clearTaskList();
        
        ScoreManager.Instance.mballs = 0;
        ScoreManager.Instance.yballs = 0;

        this.status = 0;
        this.clearObjects();
        this.stopControl();

        if (this.counter) this.counter.stop();
    }

    /**
     * 清理场景对象和数据
     */
    public clearObjects() {
        if (this._updateList) this._updateList = [];
        if (this._bulletProcess) this._bulletProcess.remove();
        if (this._timer) this._timer.remove();
        if (this._ball) this._ball.removeSelf();
        if (this._myCannon) this._myCannon.remove();
        if (this._yourCannon) this._yourCannon.remove();
        if (this._pprocess) this._pprocess.remove();
        if (this._toolTagContainer) this._toolTagContainer.remove();
        if (this._btnSwitch) this._btnSwitch.remove();
        if (this._dashLine) this._dashLine.remove();

        ScoreManager.Instance.removeScorePanel();
    }
}