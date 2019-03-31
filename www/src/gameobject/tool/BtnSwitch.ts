/**
 * 切换道具按钮
 */
class BtnSwitch extends laya.display.Sprite {
    private _centerBtn: Sprite;
    // 功能锁 true时不能控制道具标签的切换
    private _funcLock: boolean = false;

    constructor() {
        super();

        this.loadImage(Assets.Img.btn_switch_bg);
        this.repos();
        this.size(80, 210);
        this.zOrder = DisplayOrder.BtnSwitch;

        this._centerBtn = new Sprite();
        this._centerBtn.loadImage(Assets.Img.btn_switch_center);
        this._centerBtn.size(50, 50);
        this._centerBtn.pivot(25, 25);
        this._centerBtn.pos(40, this.height/2);

        this.on(LayaEvent.MOUSE_DOWN, this, this.onMouseDown);

        this.addChild(this._centerBtn);

        Laya.stage.addChild(this);
    }

    private onMouseDown(e: LayaEvent) {
        Tween.clearAll(this._centerBtn);

        Laya.stage.on(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(LayaEvent.MOUSE_OUT, this, this.onMouseUp);
    }

    private onMouseUp(e?: LayaEvent) {
        Laya.stage.off(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.off(LayaEvent.MOUSE_OUT, this, this.onMouseUp);

        this._funcLock = false;

        Tween.to(this._centerBtn, {x: 40, y: this.height/2}, 500, Ease.circOut);
    }

    private onMouseMove(e: LayaEvent) {
        let mouse, length, bpos, cpos, limitLength;

        mouse = Utils.p(Laya.stage.mouseX, Laya.stage.mouseY);
        cpos = Utils.p(this.width/2, this.height/2);
        bpos = Utils.p(mouse.x - this.x, mouse.y - this.y);
        length = Utils.pLength(bpos, cpos);
        limitLength = this.height/2 - this._centerBtn.height/2;
        
        if(length >= limitLength) {
            // let p = Utils.crossingPointLC(bpos, cpos, limitLength);

            // 控制道具标签的切换
            if(this._funcLock === false) {
                if(bpos.y > cpos.y) {
                    Game.Instance.toolTagContainer.selectNext();
                    SoundManager.playSound(Assets.Sound.button_001);
                }
                else if(bpos.y < cpos.y) {
                    Game.Instance.toolTagContainer.selectPrevious();
                    SoundManager.playSound(Assets.Sound.button_001);
                }
                this._funcLock = true;
            }

            if(bpos.y > cpos.y) {
                this._centerBtn.y = this.height - this._centerBtn.height/2;
            }
            else {
                this._centerBtn.y = this._centerBtn.height/2;
            }
            
            return;
        }

        this._centerBtn.y = bpos.y;
    }

    public beMouseUp() {
        this.onMouseUp();
    }

    public repos() {
        if(Laya.stage.width >= 1280) {
            this.pos(global.leftEdge - 400, 500);
        }
        else {
            this.pos(0, 500);
        }
    }

    public remove() {
        this.removeSelf();
    }
}