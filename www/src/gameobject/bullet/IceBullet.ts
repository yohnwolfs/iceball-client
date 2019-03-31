const IceBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
}
/**
 * 冰冻弹
 */
class IceBullet extends Bullet {

    constructor() {
        super();

        this._type = 'ice';
        this.pivot(IceBulletAttr.imgWidth / 2, IceBulletAttr.imgHeight / 2);
        this.size(IceBulletAttr.width, IceBulletAttr.height);
        this._radius = IceBulletAttr.width / 2;
    }

    public init(angle: number, power: number, owner: string) {
        let v = Utils.floatN(IceBulletAttr.velocity - (1 - power) * 12);

        this.loadImage(Assets.Img.bullet_ice);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    }

    protected calculateBallPhysics(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.x, this.y, ball.x, ball.y] = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert);

        // 计算球心到直线的距离
        let distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);

        // 计算球的旋转方向
        ball.compRDirection(this.x, this.y, this.vx, this.vy);

        [this.vx, this.vy, ball.vx, ball.vy] = Utils.compBallRebound(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), { vx: this.vx, vy: this.vy }, { vx: ball.vx, vy: ball.vy }, convert);

        this.simulateWeight(ball);

        this.releaseAction();
        this.frozen(ball);
        if (this._owner === 'self' && ball.isNormalStatus()) Socket.Instance.causeExplosion();
    }

    protected frozen(object) {
        object.getFrozen();

        SoundManager.playSound(Assets.Sound.frozen);
    }

    /**
     * 退场动作 - 爆炸动画
     */
    public releaseAction() {
        let pos = Utils.p(this.x, this.y);
        let name = 'blue_boom';
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