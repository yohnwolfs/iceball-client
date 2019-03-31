/// <reference path="./bullet/Bullet.ts" />
/// <reference path="./bullet/StandardBullet.ts" />
/// <reference path="./bullet/IceBullet.ts" />
/// <reference path="./bullet/DivisionBullet.ts" />
/// <reference path="./bullet/SmokeBullet.ts" />
/// <reference path="./bullet/BombBullet.ts" />

/**
 * 角色大小
 */
const CannonAttr = {
    width: 71, 
    height: 111,
    imgWidth: 71,
    imgHeight: 111
};

/**
 * 炮台类
 */
class Cannon extends laya.display.Sprite{
    private opponent: boolean;
    private _shadow: Sprite;

    /**
     * @param opponent 是否对手的炮台
     */
    constructor(opponent: boolean) {
        super();
        this.loadImage(opponent? Assets.Img.cannon_y : Assets.Img.cannon_m);
        this.pivot(CannonAttr.imgWidth/2, 75);
        this.pos(config.gameWidth/2, config.gameHeight);
        this.size(CannonAttr.width, CannonAttr.height);
        this.zOrder = DisplayOrder.Cannon;
        this.opponent = opponent;

        if(opponent) {
            this.pos(config.gameWidth/2, 0);
            this.addShadow();
            this.setAngle(this.rotation + 180);
        }
        else {
            this.addShadow();
        }
    }

    /**
     * 获取炮台角度
     */
    public getAngle() {
        return this.rotation;
    }

    /**
     * 设置旋转角度
     */
    public setAngle(angle: number) {

        // 限制炮台转动角度
        if(!this.opponent && (angle > 82 || angle < -82)) {
            angle = angle > 0? 82 : -82;    
        }
        if(this.opponent && (angle < 98 || angle > 262)) {
            angle = angle < 98? 98 : 262;
        }
        this.rotation = angle;
        this._shadow.rotation = angle;
    }

    /**
     * 发射子弹
     */
    public shoot(angle: number, power: number, bulletType: string) {
        let bullet;
        let gamePage = Main.Instance.gamePage;

        if(this.opponent) {
            this.setAngle(angle + 180);
            bullet = Bullet.getOrCreate(angle + 180, power, bulletType, 'opponent');
        }
        else {
            bullet = Bullet.getOrCreate(angle, power, bulletType, 'self');
        }

        if(bullet) {
            gamePage.addChild(bullet);
        }
        else console.log('Bullet is lock.')

        bullet.pos(this.x, this.y);

        SoundManager.playSound(Assets.Sound.shoot, 1);
    }

    /**
     * 添加阴影效果
     */
    private addShadow() {
        this._shadow = new Sprite();

        this._shadow.loadImage(Assets.Img.cannon_shadow);
        this._shadow.pivot(41, 75);
        if(this.opponent) {
            this._shadow.pos(this.x - 20, this.y - 10);
        }
        else {
            this._shadow.pos(this.x - 20, this.y + 10);
        }
        this._shadow.zOrder = DisplayOrder.Shadow;

        Main.Instance.gamePage.addChild(this._shadow);
    }

    public remove() {
        this.removeSelf();
        this._shadow.removeSelf();
    }
}