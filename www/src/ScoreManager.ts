/// <reference path="./gameobject/ScorePanel.ts" />
/// <reference path="./ui/view/ResultPage.ts" />

/**
 * 分数结构
 */
interface Score {
    score: number;
    balls: number;
    bulletExplosions: number;
}

/**
 * 分数权重设置
 */
const ScoreConfig = {
    bulletExplosions: 1,
    balls: 8,
    winBalls: 10
}

/**
 * 得分管理类
 */
class ScoreManager {
    private _mscore: Score;
    private _yscore: Score;
    private _myScorePanel: ScorePanel;
    private _yourScorePanel: ScorePanel;
    private _resultView: ResultPage;

    public mballs: number = 0;
    public yballs: number = 0;

    constructor() {

    }

    private static instance: ScoreManager;
    public static get Instance(): ScoreManager {
        if (ScoreManager.instance == null) {
            ScoreManager.instance = new ScoreManager();
        }
        return ScoreManager.instance;
    }

    get mscore() {
        return this._mscore;
    }

    get yscore() {
        return this._yscore;
    }

    get myScorePanel() {
        return this._myScorePanel;
    }

    get yourScorePanel() {
        return this._yourScorePanel;
    }
    get resultView() {
        return this._resultView;
    }

    /**
     * 初始化分数和分数板
     */
    public initScore() {

        // 双方分数板 初始化分数
        this._mscore = {score: 0, balls: 0, bulletExplosions: 0};
        this._yscore = {score: 0, balls: 0, bulletExplosions: 0};
        this._myScorePanel = new ScorePanel('mine');
        this._yourScorePanel = new ScorePanel('your');

        Laya.stage.addChild(this._myScorePanel);
        Laya.stage.addChild(this._yourScorePanel);
    }

    /**
     * 根据数据设置分数
     */
    public setScores(type: string, data) {
        if(type === 'mine') {
            this._mscore.balls = data.balls;
            this._mscore.bulletExplosions = data.explosions;
            this._mscore.score = data.score;
        }
        else if(type === 'your') {
            this._yscore.balls = data.balls;
            this._yscore.bulletExplosions = data.explosions;
            this._yscore.score = data.score;
        }

        this.updateScore();
    }

    /**
     * 更新分数数据显示
     */
    public updateScore() {
        this.myScorePanel.updateScore(this._mscore.score);
        this.myScorePanel.updateBalls(this._mscore.balls);
        this.yourScorePanel.updateScore(this._yscore.score);
        this.yourScorePanel.updateBalls(this._yscore.balls);
    }

    /**
     * 移除分数数据显示
     */
    public removeScorePanel() {
        if(this.myScorePanel) this.myScorePanel.remove();
        if(this.yourScorePanel) this.yourScorePanel.remove();
    }

    /**
     * 判断进球数是否达到赛点
     */
    public checkBalls(whoseball: string) {
        if(whoseball === 'mine' && ScoreManager.Instance.mballs >= ScoreConfig.winBalls) {
            Game.Instance.gameOver();
        }
        else if(whoseball === 'your' && ScoreManager.Instance.yballs >= ScoreConfig.winBalls) {
            Game.Instance.gameOver();
        }
    }

    /**
     * 显示分数结算界面
     */
    public showGameResult(data) {
        let mydata, yourdata, mindex, result, re;

        data = data.scores;

        if(this._resultView) this.resultView.remove();

        // 匹配出自己的分数
        for(let i in data) {
            if(data[i].id === Socket.Instance.getUid()) {
                mydata = data[i];
                mindex = i;
            }
        }
        
        // 容错处理
        if(!mydata) {
            console.log('error: user id not exist in scores data.');
            return;
        }

        yourdata = data[1 - mindex];
        result = mydata.score > yourdata.score? 'win' : (mydata.score < yourdata.score? 'lose' : 'tie');

        // 格式化数据
        re = {
            result: result,
            myname: mydata.name,
            yourname: yourdata.name,
            myballs: mydata.balls,
            yourballs: yourdata.balls,
            myscore: mydata.score,
            yourscore: yourdata.score
        };

        // 显示比赛结果
        this._resultView = new ResultPage(re);
        this._resultView.scale(0, 0);

        Laya.stage.addChild(this._resultView);

        //　执行动画
        Tween.to(this._resultView, {scaleX: 1, scaleY: 1}, 500, Ease['backOut']);

        if(result === 'win' || result === 'tie') SoundManager.playSound(Assets.Sound.gamewin);
        else SoundManager.playSound(Assets.Sound.gameover);
    }

    /**
     * 移除分数界面
     */
    public removeResultView() {
        if(this._resultView) this._resultView.remove();
    }
}