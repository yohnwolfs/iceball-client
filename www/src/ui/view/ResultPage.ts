/// <reference path="../ui.ts" />

class ResultPage extends ui.ResultPageUI {

    constructor(data) {
        super();

        this.word.loadImage('ResultPage/' + data.result + '.png');
        this.myNameText.text = data.myname;
        this.yourNameText.text = data.yourname;
        this.myBalls.text = data.myballs;
        this.yourBalls.text = data.yourballs;
        this.myScore.text = data.myscore;
        this.yourScore.text = data.yourscore;

        this.pivot(this.width/2, this.height/2);
        this.pos(Laya.stage.width/2, Laya.stage.height/2);
        this.zOrder = DisplayOrder.ResultPage;

        this.backBtn.on(LayaEvent.CLICK, this, this.onBtnBack);
    }

    public onBtnBack() {
        SoundManager.playSound(Assets.Sound.button_001);
        
        // 场景转换
        Main.Instance.backToMenu();

        this.remove();
    }

    public repos() {
        this.pos(Laya.stage.width/2, Laya.stage.height/2);
    }
    
    public remove() {
        this.removeSelf();
    }
}