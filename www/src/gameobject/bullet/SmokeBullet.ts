const SmokeBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
}
/**
 * 巨石炮弹
 */
class SmokeBullet extends Bullet {

    constructor() {
        super();

        this._type = 'smoke';
        this.pivot(SmokeBulletAttr.imgWidth / 2, SmokeBulletAttr.imgHeight / 2);
        this.size(SmokeBulletAttr.width, SmokeBulletAttr.height);
        this._radius = SmokeBulletAttr.width / 2;
    }

    public init(angle: number, power: number, owner: string) {
        let v = Utils.floatN(IceBulletAttr.velocity - (1 - power) * 12);

        this.loadImage(Assets.Img.bullet_smoke);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    }

    public update() {

        super.update();

        if ((this._owner === 'self' && this.y < 160) || (this._owner === 'opponent' && this.y > config.gameHeight - 160)) {
            this.makeSmoke();
            this.release();
        }
    }

    protected fixBallPosition(ball: Ball) {
        let convert = global.syn ? false : true;

        [this.x, this.y, ball.x, ball.y] = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert);

        // 计算球心到直线的距离
        let distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        
        SoundManager.playSound(Assets.Sound.hit_001, 1);
    }

    /**
    * 烟雾效果
    */
    public makeSmoke() {
        let pos = Utils.p(this.x, this.y);
        let name = 'smoke';
        let ani = AnimationManager.getOrCreate(name, 500, 250, 250, 125);
        let gamePage = Main.Instance.gamePage;
        let smoke;
        let taskName = this._owner === 'self' ? 'stopSmoke1' : 'stopSmoke2';

        if (this._owner === 'self' && Game.Instance.smoke1) {
            smoke = Game.Instance.smoke1;
            
            Game.Instance.timer.runTaskByName(taskName);
        }
        else if (this._owner === 'opponent' && Game.Instance.smoke2) {
            smoke = Game.Instance.smoke2;

            Game.Instance.timer.runTaskByName(taskName);
        }

        ani.pos(config.gameWidth / 2, pos.y);
        ani.interval = 100;
        ani.scale(0.1, 0.1);
        ani.zOrder = DisplayOrder.Smoke;

        Tween.to(ani, { scaleX: 1, scaleY: 1 }, 300);
        gamePage.addChild(ani);
        ani.play(0, true, name);

        SoundManager.playSound(Assets.Sound.smoke, 0);

        Game.Instance.timer.setTimeout(() => {
            
            if (this._owner === 'self') Game.Instance.smoke1 = null;
            else Game.Instance.smoke2 = null;
            if (!Game.Instance.smoke1 && !Game.Instance.smoke2) SoundManager.stopSound(Assets.Sound.smoke);
            Tween.to(ani, { alpha: 0 }, 800, Ease.linearInOut, Handler.create(this, () => {
                ani.alpha = 1;
                Pool.recover(name, ani);
                ani.removeSelf();
            }));
        }, 500, this, taskName, true);

        if (this._owner === 'self') { Game.Instance.smoke1 = ani; }
        else Game.Instance.smoke2 = ani;
    }
}