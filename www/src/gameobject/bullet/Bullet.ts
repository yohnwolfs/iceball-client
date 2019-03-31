
/**
 * 子弹类
 */
class Bullet extends BaseBall {
    /**
     * 子弹类型 子弹所属方
     * mbullet / ybullet
     */
    protected _owner: string;
    protected _type: string;
    /**
     * 子弹缓存队列
     */
    public static myBullets: Array<Bullet> = [];
    public static yourBullets: Array<Bullet> = [];

    public className: string = 'Bullet';

    constructor() {
        super();

        this.zOrder = DisplayOrder.Bullet;
    }

    /**
     * 从对象池中取一个实例
     * @param angle 生成子弹的角度
     * @param power 生成子弹的初始力度
     * @param type 子弹的类型
     *      StandardBullet 标准子弹
     *      IceBullet 冰冻弹
     *      DivisionBullet 分裂弹
     *      SmokeBullet 烟雾弹
     *      BombBullet 巨型炸弹
     * @param owner 子弹的所属方
     */
    public static getOrCreate(angle: number, power: number, type: string, owner: string) {

        let bullet = Pool.getItemByCreateFun(type, () => {
            switch (type) {
                case 'StandardBullet':
                    if (owner === 'self') return new StandardBullet();
                    else if (owner === 'opponent') return new StandardBullet();
                case 'IceBullet':
                    return new IceBullet();
                case 'DivisionBullet':
                    return new DivisionBullet();
                case 'DivisionChildBullet':
                    return new DivisionChildBullet();
                case 'SmokeBullet':
                    return new SmokeBullet();
                case 'BombBullet':
                    return new BombBullet();
                default: { console.log('not exist bullet type.'); return new StandardBullet(); }
            }
        });

        bullet.init(angle, power, owner);

        // 存放到对应的数组中
        if (owner === 'self') Bullet.myBullets.push(bullet);
        else if (owner === 'opponent') Bullet.yourBullets.push(bullet);

        return bullet;
    }

    /**
     * 初始化子弹
     * @param angle 角度
     * @param velocity 初始速度
     * @param type 子弹类型（mbullet:我的子弹，ybullet:对方的子弹)
     * @param power 力度 0 ~ 1
     */
    public init(angle: number, power: number, owner: string) {
    }

    /**
     * 帧逻辑
     */
    public update() {

        //  碰撞检测
        this.collision();

        this.x = Utils.floatN(this.x + this._vx);
        this.y = Utils.floatN(this.y + this._vy);

        // 越界
        this._nextX = this.x + this._vx;
        this._nextY = this.y + this._vy;

        if (this._nextX < this.width / 2 || this._nextX > config.gameWidth - this.width / 2) {
            this.x = (this._nextX < this.width / 2) ? this.width / 2 : config.gameWidth - this.width / 2;
            this._vx *= -1;
        }

        if (this.y < -1 * this.width / 2 || this.y > config.gameHeight + this.height / 2) {
            this.release();
        }
    }

    /**
     * 碰撞检测
     */
    public collision() {
        let bullets;
        let ball = Game.Instance.ball;

        // 检测子弹之间的碰撞 根据syn同步值确定以哪方子弹作为碰撞检测主体
        if (this._owner === 'self' && global.syn === 0) {
            bullets = Bullet.yourBullets;

            for (let b of bullets) {
                this.collisionBullets(this, b);
            }
        }
        else if (this._owner === 'opponent' && global.syn === 1) {
            bullets = Bullet.myBullets;

            for (let b of bullets) {
                this.collisionBullets(this, b);
            }
        }

        // 检测子弹与球之间的碰撞
        this.collisionBall(ball);
    }

    /**
     * 计算两子弹碰撞后的物理运动
     */
    protected collisionBullets(object1: Bullet, object2: Bullet) {
        let convert = global.syn ? false : true;

        // 下一帧的位置
        let nextObject1 = {
            x: object1.x + object1.vx,
            y: object1.y + object1.vy,
            radius: object1.radius
        };

        let nextObject2 = {
            x: object2.x + object2.vx,
            y: object2.y + object2.vy,
            radius: object2.radius
        };

        if (Utils.isCircleCollision(nextObject1, nextObject2)) {
            [object1.x, object1.y, object2.x, object2.y] = Utils.fixCollision(Utils.p(object1.x, object1.y), Utils.p(object2.x, object2.y), object1.radius, object2.radius, convert);

            [object1.vx, object1.vy, object2.vx, object2.vy] = Utils.compBallRebound(Utils.p(object1.x, object1.y), Utils.p(object2.x, object2.y), { vx: object1.vx, vy: object1.vy }, { vx: object2.vx, vy: object2.vy }, convert);
        }
    }

    /**
     * 计算子弹和球碰撞后的物理运动
     */
    protected collisionBall(ball: Ball) {

        // 下一位置
        let nextObject1 = {
            x: this.x + this.vx,
            y: this.y + this.vy,
            radius: this.radius
        };

        let nextObject2 = {
            x: ball.x + ball.vx,
            y: ball.y + ball.vy,
            radius: ball.radius
        };

        if (Utils.isCircleCollision(nextObject1, nextObject2)) {
            this.calculateBallPhysics(ball);
        }
    }

    protected calculateBallPhysics(ball: Ball) {

        this.fixBallPosition(ball);

        // 计算球的旋转方向
        ball.compRDirection(this.x, this.y, this.vx, this.vy);

        this.calculateBallVelocity(ball);
    }

    protected fixBallPosition(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.x, this.y, ball.x, ball.y] = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert);
    }

    protected calculateBallVelocity(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.vx, this.vy, ball.vx, ball.vy] = Utils.compBallRebound(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), { vx: this.vx, vy: this.vy }, { vx: ball.vx, vy: ball.vy }, convert);

        this.simulateWeight(ball);
    }

    protected simulateWeight(ball: Ball) {
        // 对球进行减速处理，模拟小球的重量
        if (global.syn) {
            ball.vx = Utils.floatN(ball.vx / ball.weight);
            ball.vy = Utils.floatN(ball.vy / ball.weight);
        }
        else {
            ball.vx = Utils.floatN((ball.vx * -1) / ball.weight);
            ball.vy = Utils.floatN((ball.vy * -1) / ball.weight);
            ball.vx *= -1;
            ball.vy *= -1;
        }
    }

    /**
     * 使缓存队列中所有子弹爆炸
     */
    public static boomAllBullets() {
        while (Bullet.myBullets.length > 0) {
            Bullet.myBullets[0].releaseAction();
        }
        while (Bullet.yourBullets.length > 0) {
            Bullet.yourBullets[0].releaseAction();
        }
    }

    /**
     * 退场动作
     */
    public releaseAction() {
        this.release();
    }

    /**
     * 回收子弹
     */
    public release() {
        this.removeFromArr();
        this.removeSelf();
        Pool.recover(this._type, this);
    }

    /**
     * 从全局数组中删除
     */
    public removeFromArr() {
        let list;

        if (this._owner === 'self') {
            list = Bullet.myBullets;
            list.splice(list.indexOf(this), 1);
        }
        else if (this._owner === 'opponent') {
            list = Bullet.yourBullets;
            list.splice(list.indexOf(this), 1);
        }
    }
}