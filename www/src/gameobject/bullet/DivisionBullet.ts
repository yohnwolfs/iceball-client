const DivisionBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
}
/**
 * 分裂弹
 */
class DivisionBullet extends Bullet {

    constructor() {
        super();

        this._type = 'division';

        this.pivot(DivisionBulletAttr.imgWidth / 2, DivisionBulletAttr.imgHeight / 2);
        this.size(DivisionBulletAttr.width, DivisionBulletAttr.height);
        this._radius = DivisionBulletAttr.width / 2;
    }

    public init(angle: number, power: number, owner: string) {
        let v = Utils.floatN(DivisionBulletAttr.velocity - (1 - power) * 12);

        this.loadImage(Assets.Img.bullet_division);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));

        Game.Instance.timer.setTimeout(() => {
            this.divideEffect();
            this.divide();
        }, 10, this);
    }

    public divide() {
        let gamePage = Main.Instance.gamePage;
        let angle = Utils.floatN(Math.atan(this.vx / this.vy) * 180 / Math.PI * -1);

        for (let i = 0; i < 3; i++) {
            let bullet = Bullet.getOrCreate(Utils.floatN(angle + (i - 1) * 20 + (this._owner === 'opponent' ? 180 : 0)), 0.6, 'DivisionChildBullet', this._owner);
            bullet.pos(this.x, this.y);
            gamePage.addChild(bullet);
        }
        SoundManager.playSound(Assets.Sound.boom_003);
    }

    /**
     * 退场动作 - 爆炸动画
     */
    public divideEffect() {
        let pos = Utils.p(this.x, this.y);
        let name = 'green_boom';
        let ani = AnimationManager.getOrCreate(name);
        let gamePage = Main.Instance.gamePage;

        ani.pos(pos.x, pos.y);

        ani.off(LayaEvent.COMPLETE, ani, () => { });
        ani.on(LayaEvent.COMPLETE, ani, () => {
            Pool.recover(name, ani);
            ani.removeSelf();
        });

        gamePage.addChild(ani);

        ani.play(0, false, name);

        this.release();
    }
}

class DivisionChildBullet extends Bullet {
    constructor() {
        super();

        this._type = 'divisionchild';

        this.pivot(DivisionBulletAttr.imgWidth / 2, DivisionBulletAttr.imgHeight / 2);
        this.size(DivisionBulletAttr.width, DivisionBulletAttr.height);
        this._radius = DivisionBulletAttr.width / 2;
    }

    public init(angle: number, power: number, owner: string) {
        let v = Utils.floatN(DivisionBulletAttr.velocity - (1 - power) * 12);

        this.loadImage(Assets.Img.bullet_division);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    }

    protected fixBallPosition(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.x, this.y, ball.x, ball.y] = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert);

        // 计算球心到直线的距离
        let distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        
        SoundManager.playSound(Assets.Sound.hit_001, 1);
    }
}