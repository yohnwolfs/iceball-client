/**
 * 游戏分数板
 */
class ScorePanel extends laya.display.Sprite{
    private userName: string;
    private type: string;
    private _name: LayaText;
    private _balls: LayaText;
    private _score: LayaText;

    constructor(type: string) {
        super();

        this.type = type;

        this.loadImage(Assets.Img.scoreBg);
        this.zOrder = DisplayOrder.ScorePanel;
        if(type === 'mine') {
            this.userName = Socket.Instance.mName;
        }
        else if(type === 'your') {
            this.userName = Socket.Instance.yName;
        }
        
        this.repos();

        this.initInfo();
    }

    // 初始化信息
    private initInfo() {
        let score;
        
        this._name = new LayaText();
        this._score = new LayaText();
        this._balls = new LayaText();

        if(this.type === 'mine') {
            score = ScoreManager.Instance.mscore;
        }
        else if(this.type === 'your') {
            score = ScoreManager.Instance.yscore;
        }

        this._name.fontSize = 20;
        this._name.pos(6,2);
        this._name.text = this.userName;

        this._score.fontSize = 16;
        this._score.pos(5, 28);
        this._score.text = '得分:' + score.score.toString();

        this._balls.fontSize = 16;
        this._balls.pos(84, 28);
        this._balls.size(18, 18);
        this._balls.align = 'center';
        this._balls.text = score.balls.toString();

        this.addChild(this._name);
        this.addChild(this._score);
        this.addChild(this._balls);
    }

    // 更新分数值
    public updateScore(score: number) {
        this._score.text = '得分:' + score.toString();
    }

    // 更新进球数
    public updateBalls(balls: number) {
        if(this._balls.text !== balls.toString()) {
            Tween.from(this._balls, {y: 10, alpha: 0}, 300, Ease.backIn);
        }
        this._balls.text = balls.toString();
    }

    // 重定位
    public repos() {
        if(Laya.stage.width >= 1280) {
            if(this.type === 'mine') {
                this.pos(global.leftEdge - 400, Laya.stage.height - 47);
            }
            else if(this.type === 'your') {
                this.pos(global.leftEdge - 400, 0);
            }
        }
        else {
            if(this.type === 'mine') {
                this.pos(0, Laya.stage.height - 47);
            }
            else if(this.type === 'your') {
                this.pos(0, 0);
            }
        }
    }

    public remove() {
        this.removeSelf();
    }
}