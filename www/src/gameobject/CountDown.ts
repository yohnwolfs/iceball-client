/**
 * 倒计时
 */
class CountDown extends laya.display.Text{

    constructor(num: number, cb: () => void) {
        super();

        this.font = 'diyfont';
        this.text = num.toString();
        this.pivot(this.width/2, this.height/2);
        this.pos(config.gameWidth/2, config.gameHeight/2 - 10);
        this.zOrder = DisplayOrder.CountText;

        this.animateCount(3, cb);

        SoundManager.playSound(Assets.Sound.counter, 0);
    }

    private animateCount(num: number, cb) {
        
        Laya.timer.once(1000, this, () => {
            num--;

            this.text = num.toString();
            
            if(num <= 0) {
                this.remove();
                cb.call(this);
                SoundManager.stopSound(Assets.Sound.counter);
                SoundManager.playSound(Assets.Sound.gamestart);
                return;
            }
            
            this.animateCount(num, cb);
        });
    }

    public stop() {
        Laya.timer.clearAll(this);
    }

    public remove() {
        this.stop();
        this.removeSelf();
    }
}