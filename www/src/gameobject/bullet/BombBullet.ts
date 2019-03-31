const BombBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
}

/**
 * 巨型炸弹
 */
class BombBullet extends Bullet {

    constructor() {
        super();

        this._type = 'bomb';
        this.pivot(BombBulletAttr.imgWidth / 2, BombBulletAttr.imgHeight / 2);
        this.size(BombBulletAttr.width, BombBulletAttr.height);
        this._radius = BombBulletAttr.width / 2;
    }

    public init(angle: number, power: number, owner: string) {
        let v = Utils.floatN(BombBulletAttr.velocity - (1 - power) * 12);

        this.loadImage(Assets.Img.bullet_bomb);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    }

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
            this.boomEffect();
            this.boom();
        }

        if (this.y < -1 * this.width / 2 || this.y > config.gameHeight + this.height / 2) {
            this.release();
        }
    }

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
            this.boomEffect();
            this.boom();
        }
    }

    protected calculateBallPhysics(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.x, this.y, ball.x, ball.y] = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert);

        // 计算球心到直线的距离
        let distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);

        // 计算球的旋转方向
        ball.compRDirection(this.x, this.y, this.vx, this.vy);

        [this.vx, this.vy, ball.vx, ball.vy] = Utils.compBallRebound(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), { vx: this.vx, vy: this.vy }, { vx: ball.vx, vy: ball.vy }, convert);

        //this.simulateWeight(ball);

        this.boomEffect();
        this.boom();
        if (this._owner === 'self' && ball.isNormalStatus()) Socket.Instance.causeExplosion();
    }

    boom() {
        let ball = Game.Instance.ball;

        this.boomPhysics(ball);

        if (global.syn) {
            for (let bullet of Bullet.myBullets) {
                this.boomPhysics(bullet);
            }

            for (let bullet of Bullet.yourBullets) {
                this.boomPhysics(bullet);
            }
        }
        else {
            for (let bullet of Bullet.yourBullets) {
                this.boomPhysics(bullet);
            }
            for (let bullet of Bullet.myBullets) {
                this.boomPhysics(bullet);
            }
        }

    }

    boomPhysics(object) {
        let convert = global.syn ? false : true;
        let thisx = this.x;
        let thisy = this.y;
        let objectx = object.x;
        let objecty = object.y;
        if (convert) {
            thisx = Utils.floatN(config.gameWidth - thisx);
            thisy = Utils.floatN(config.gameHeight - thisy);
            objectx = Utils.floatN(config.gameWidth - objectx);
            objecty = Utils.floatN(config.gameHeight - objecty);
        }
        let distance = Utils.floatN(Utils.pLength(Utils.p(objectx, objecty), Utils.p(thisx, thisy)));
        
        if (distance <= 180 && distance > 0) {
            let rate = (objectx - thisx) / (objecty - thisy);
            let power = (180 - distance) / 800;
            
            object.vx = Utils.floatN((objectx - thisx) * power);
            object.vy = Utils.floatN((objecty - thisy) * power);
            if (convert) {
                object.vx = Utils.floatN(object.vx * -1);
                object.vy = Utils.floatN(object.vy * -1);
            }
        }
    }

    /**
     * 退场动作 - 爆炸动画
     */
    public boomEffect() {
        let pos = Utils.p(this.x, this.y);
        let name = 'boom';
        let ani = AnimationManager.getOrCreate(name, 291, 291, 145, 145);
        let gamePage = Main.Instance.gamePage;

        ani.pos(pos.x, pos.y);

        ani.off(LayaEvent.COMPLETE, ani, () => { });
        ani.on(LayaEvent.COMPLETE, ani, () => {
            Pool.recover(name, ani);
            ani.removeSelf();
        });

        gamePage.addChild(ani);

        ani.play(0, false, name);

        SoundManager.playSound(Assets.Sound.boom_002);

        this.release();
    }
}