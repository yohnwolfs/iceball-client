const StandardBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
}

class StandardBullet extends Bullet {

    constructor() {
        super();

        this._type = 'standard';

        this.pivot(StandardBulletAttr.imgWidth / 2, StandardBulletAttr.imgHeight / 2);
        this.size(StandardBulletAttr.width, StandardBulletAttr.height);
        this._radius = StandardBulletAttr.width / 2;
    }

    /**
     * 初始化子弹
     * @param angle 角度
     * @param velocity 初始速度
     * @param type 子弹类型（mbullet:我的子弹，ybullet:对方的子弹)
     * @param power 力度 0 ~ 1
     */
    public init(angle: number, power: number, owner: string) {
        let v = Utils.floatN(StandardBulletAttr.velocity - (1 - power) * 12);

        this.loadImage(owner === 'self' ? Assets.Img.bulletm : owner === 'opponent' ? Assets.Img.bullety : '');
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    }

    protected fixBallPosition(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.x, this.y, ball.x, ball.y] = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert);

        // 计算球心到直线的距离
        let distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);

        // 如果子弹与小球擦肩而过，不爆炸
        if (distance < 38) {
            if (this._owner === 'self' && ball.isNormalStatus()) Socket.Instance.causeExplosion();
            this.releaseAction();
            SoundManager.playSound(Assets.Sound.boom_001, 1);
        }
        else {
            SoundManager.playSound(Assets.Sound.hit_001, 1);
        }
    }

    /**
     * 退场动作 - 爆炸动画
     */
    public releaseAction() {
        let pos = Utils.p(this.x, this.y);
        let name = this._owner === 'self' ? 'blue_boom' : this._owner === 'opponent' ? 'red_boom' : '';
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