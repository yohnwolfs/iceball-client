
const BallAttr = {
    width: 74,
    height: 74,
    imgWidth: 90,
    imgHeight: 90,
    velocity: 6,
    weight: 2.2
}

/**
 * 比赛球类0
 */
class Ball extends BaseBall {
    // 摩擦力
    private _friction: number = 0.01;
    // 旋转方向 -1：逆时针 1：顺时针 0：不旋转
    private _roDirection: number = 0;
    // 方向同步辅助值
    private _direction: number;
    // 球的状态 1： 正常 2：下降动画中  3: 停止状态
    private _status: number = 1;
    // 动画执行时刻辅助值
    private _animTime: number = 0;
    private _weight: number;

    private _fallPosList: number[] = [];

    constructor(direction: number) {
        super();

        this.graphics.loadImage(Assets.Img.ball);
        this.pivot(BallAttr.imgWidth / 2, BallAttr.imgHeight / 2);
        this.size(BallAttr.width, BallAttr.height);
        this.zOrder = DisplayOrder.Ball;
        this.posCenter();

        this._direction = direction;
        this._radius = BallAttr.width / 2;
        this.initVelocity();

        this._weight = BallAttr.weight;
    }

    get roDirection() {
        return this._roDirection;
    }

    set roDirection(d: number) {
        this._roDirection = d;
    }

    get weight() {
        return this._weight;
    }
    set weight(w: number) {
        this._weight = w;
    }

    set direction(d: number) {
        this._direction = d;
    }

    /**
     * 帧更新
     */
    public update() {

        // 不同状态下的动作
        if (this.actionInStatus()) return;

        this.x = Utils.floatN(this.x + this._vx);
        this.y = Utils.floatN(this.y + this._vy);

        // 自旋转
        if (this._roDirection !== 0) {
            let rv = Utils.floatN(Math.sqrt(Math.pow(this._vx, 2) + Math.pow(this._vy, 2)) * 2);

            this.rotation = this.rotation + (this._roDirection < 0 ? -1 : 1) * rv;
        }

        // 越界
        this._nextX = this.x + this._vx;
        this._nextY = this.y + this._vy;

        // 碰到两边的墙壁
        if (this._nextX < BallAttr.width / 2 || this._nextX > config.gameWidth - BallAttr.width / 2) {
            this.x = (this._nextX < BallAttr.width / 2) ? BallAttr.width / 2 : config.gameWidth - BallAttr.width / 2;
            this._vx *= -1;
            SoundManager.playSound(Assets.Sound.hit_002);
        }

        // 进入己方或对方的龙门
        let whoseball = this._nextY < -50 ? 'mine' : 'your';
        if (this._nextY < -50 || this._nextY > config.gameHeight + 50) {
            this.vx = 0;
            this.vy = 0;

            let game = Game.Instance;

            game.status = 0;

            // 使缓存中的子弹爆炸
            Bullet.boomAllBullets();

            for (let child of Main.Instance.gamePage._childs) {
                if (child.className && child.className === 'Bullet') Main.Instance.gamePage.removeChild(child);
            }

            // 清理未完成的计时器任务
            Game.Instance.timer.clearTaskList();

            // 进球得分
            if (this._nextY < -50) {
                ScoreManager.Instance.mballs++;
                Socket.Instance.ballIn();
                SoundManager.playSound(Assets.Sound.mscore);
            }
            else {
                ScoreManager.Instance.yballs++;
                SoundManager.playSound(Assets.Sound.yscore);
            }

            // 判断是否结束比赛
            ScoreManager.Instance.checkBalls(whoseball);

            // 延迟一段时间后执行掉落动画
            this._animTime = 0;
            this._status = 3;
        }

        // 摩擦减速
        let fx = Utils.floatN(Math.abs(this._friction * this.vx / BallAttr.velocity));
        let fy = Utils.floatN(Math.abs(this._friction * this.vy / BallAttr.velocity));

        this._vx = Math.abs(this._vx) < 0.1 ? 0 : Utils.floatN(this._vx > 0 ? this._vx - fx : this._vx + fx);
        this._vy = Math.abs(this._vy) < 0.1 ? 0 : Utils.floatN(this._vy > 0 ? this._vy - fy : this._vy + fy);
    }

    /**
     * 计算旋转方向
     * @param x 子弹的x位置
     * @param y 子弹的y位置
     * @param vx 子弹的x速度
     * @param vy 子弹的y速度
     */
    public compRDirection(x: number, y: number, vx: number, vy: number) {
        let p = Utils.posToLine(this.x, this.y, x, y, vx, vy);
        if ((vx <= 0 && vy <= 0) || (vx < 0 && vy >= 0)) {
            if (p > 0) this.roDirection = 1;
            if (p < 0) this.roDirection = -1;
        }
        else if ((vx > 0 && vy < 0) || (vx >= 0 && vy > 0)) {
            if (p > 0) this.roDirection = -1;
            if (p < 0) this.roDirection = 1;
        }
        if (global.syn) this.roDirection *= -1;
    }

    /**
     * 初始化速度向量
     */
    public initVelocity() {
        this._vx = Utils.floatN(BallAttr.velocity * Math.round(Math.sin(90 * Math.PI / 180)) * (this._direction === 0 ? -1 : 1));
        this._vy = Utils.floatN(-1 * BallAttr.velocity * Math.round(Math.cos(90 * Math.PI / 180)));
    }

    /**
     * 定位到中心
     */
    public posCenter() {
        this.pos(config.gameWidth / 2, config.gameHeight / 2);
    }

    /**
     * 不同状态下的动作
     */
    private actionInStatus() {

        // 停止一段时间后执行掉落动画
        if (this._status === 3) {
            this._animTime += 1;
            if (this._animTime > 30) {
                this.fallDown();
            }
            return true;
        }

        // 下降动画
        if (this._status === 2) {
            let easeValue = Ease.bounceOut(this._animTime, 5, -4, 1000);
            this._animTime += 16;
            this.scale(easeValue, easeValue);
            this._fallPosList.push(easeValue);

            // 判断最低点时播放声音
            if (this._fallPosList.length > 3) this._fallPosList.shift();
            if (this._fallPosList[1] < this._fallPosList[0] && this._fallPosList[1] < this._fallPosList[2]) SoundManager.playSound(Assets.Sound.hit_002);

            if (this._animTime > 1000) {
                let direction = Game.Instance.getBallDirection();
                this.scale(1, 1);
                this._status = 1;
                this._roDirection = 0;
                this._direction = Game.Instance.ballDirectionFactor? direction : 1 - direction;
                this.initVelocity();
                Game.Instance.status = 1;
                Game.Instance.toolTagContainer.unlock();
                this._fallPosList = [];
            }
            return true;
        }

        return false
    }

    /**
     * 执行掉落动画
     */
    public fallDown() {
        this._animTime = 0;
        this.posCenter();
        this._status = 2;
        this.weight = BallAttr.weight;
        this.removeChildren();
    }

    public isNormalStatus() {
        return this._status === 1;
    }

    public getFrozen() {

        let ice = new Sprite();
        ice.loadImage(Assets.Img.ball_effect_ice);
        ice.pivot(41, 41);
        ice.x = 45;
        ice.y = 45;

        this.removeChildren();
        this.addChild(ice);
        this.weight = 8;
        if (global.syn) {
            this.vx = Utils.floatN(this.vx / this.weight);
            this.vy = Utils.floatN(this.vy / this.weight);
        }
        else {
            this.vx = Utils.floatN((this.vx * -1) / this.weight);
            this.vy = Utils.floatN((this.vy * -1) / this.weight);
            this.vx *= -1;
            this.vy *= -1;
        }

        Game.Instance.timer.clearTaskByName('frozen');
        Game.Instance.timer.setTimeout(() => {
            this.weight = BallAttr.weight;
            this.removeChildren();
        }, 300, this, 'frozen');
    }

    private release() {
        this.weight = BallAttr.weight;
        this.removeChildren();
    }
}
