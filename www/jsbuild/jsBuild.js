var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationManager = (function () {
    function AnimationManager() {
    }
    Object.defineProperty(AnimationManager, "Instance", {
        get: function () {
            if (AnimationManager.instance == null) {
                AnimationManager.instance = new AnimationManager();
            }
            return AnimationManager.instance;
        },
        enumerable: true,
        configurable: true
    });
    AnimationManager.getOrCreate = function (name, sizeX, sizeY, pivotX, pivotY) {
        if (sizeX === void 0) { sizeX = 138; }
        if (sizeY === void 0) { sizeY = 134; }
        if (pivotX === void 0) { pivotX = 65; }
        if (pivotY === void 0) { pivotY = 62; }
        var ani = Pool.getItemByCreateFun('animation', function () {
            return new Animation();
        });
        ani.clear();
        ani.loadAtlas(Assets.Json[name], null, name);
        ani.index = 0;
        ani.zOrder = DisplayOrder.BulletBoom;
        ani.interval = 16;
        ani.size(sizeX, sizeY);
        var bounds = ani.getGraphicBounds();
        ani.pivot(pivotX, pivotY);
        return ani;
    };
    return AnimationManager;
}());
var LoadingAttr = {
    width: 300,
    height: 28
};
var base64 = {
    loading: 'data:image/png;base64,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',
    loadingBg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAcCAYAAADbcIJsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbpJREFUeNrs3d8xA1EUB+CNN3lSQlRACdEBFYgKRAVGBeiACuhAOhAVWBXwFK/OlZuRmEX8zc34vpkzYezk4Tz85t61e0+r+oTH0agTH5u5AH7CIGq42m4/fHRha46QWouPftRuVEdvgV8yjDqN4Dr7UmBFWKWgOoxa00vgj9RRexFcg7kCK6+qLqK6egcsyEmE1sG7gZXD6qpynwpYvLMIrb3JLysNFwgroBS9WEQdNwZW/oOwAkrSj2zantkS5kcWbvUGKFAdW8P16RXWoZ4AherEoqrXyqurdKP9Xk+Agg0nK6xtvQAKtzkJrA29AEo3CSz/GQSWJrAABBaAwAL+bWDVWgEsS2DdaAWwLIF1qRVA4ernwFptt9OWcKAfQMHOp19+7lbjo2UASpPOe395+TkfR2prCJToKA2pmDlxNL8EfV0ZNgGU4zLCaif9MPMcVh6zs5OXXwCLlibpvH1EcoRWumArXwiwsJVVyqLpeYWNT7pPhdaJngF/LAXUQdoGvh6uOs8g1XSSw35UTx+BXw6q02o83qvxtlRr3m/KN+S71fgomnR+luGqwHfVUXdRg6bBqa89CTAAPp1jaUy8HZ8AAAAASUVORK5CYII='
};
var Loading = (function () {
    function Loading() {
        this.percent = 0;
        this.container = document.createElement('div');
        this.container.id = 'loading-container';
        this.bg = document.createElement('div');
        this.bg.style.margin = 'auto';
        this.bg.style.position = 'absolute';
        this.bg.style.width = LoadingAttr.width + 'px';
        this.bg.style.height = LoadingAttr.height + 'px';
        this.bg.style.top = '50%';
        this.bg.style.left = '0';
        this.bg.style.right = '0';
        this.bg.style.marginTop = '20px';
        this.bg.style.background = 'url(' + base64.loadingBg + ')';
        this.process = document.createElement('div');
        this.process.style.width = '0px';
        this.process.style.height = LoadingAttr.height + 'px';
        this.process.style.backgroundImage = 'url(' + base64.loading + ')';
        this.text = document.createElement('div');
        this.text.innerHTML = '游戏资源加载中...' + this.percent + '%';
        this.text.style.margin = 'auto';
        this.text.style.position = 'absolute';
        this.text.style.width = LoadingAttr.width + 'px';
        this.text.style.height = LoadingAttr.height + 'px';
        this.text.style.top = '50%';
        this.text.style.left = '0';
        this.text.style.right = '0';
        this.text.style.color = '#ffffff';
        this.text.style.textAlign = 'center';
        this.text.style.fontSize = '26px';
        this.text.style.fontFamily = 'cursive';
        this.text.style.marginTop = '-30px';
        document.body.appendChild(this.container);
        this.container.appendChild(this.bg);
        this.container.appendChild(this.text);
        this.bg.appendChild(this.process);
    }
    Loading.prototype.setProcess = function (percent) {
        if (percent < 0)
            percent = 0;
        if (percent > 1)
            percent = 1;
        this.percent = percent;
        this.process.style.width = LoadingAttr.width * percent + 'px';
        this.text.innerHTML = '游戏资源加载中...' + Math.round(this.percent * 100) + '%';
    };
    Loading.prototype.hide = function () {
        this.container.style.display = 'none';
    };
    return Loading;
}());
var MsgAttr = {
    width: 408,
    height: 316
};
var MsgManager = (function () {
    function MsgManager() {
        this._showing = false;
    }
    Object.defineProperty(MsgManager.prototype, "msg", {
        get: function () {
            return this._msg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MsgManager.prototype, "tipsText", {
        get: function () {
            return this._tipsText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MsgManager, "Instance", {
        get: function () {
            if (MsgManager.instance == null) {
                MsgManager.instance = new MsgManager();
            }
            return MsgManager.instance;
        },
        enumerable: true,
        configurable: true
    });
    MsgManager.prototype.showMessage = function (text, size, func) {
        var _this = this;
        if (!this._msg) {
            this._msgContainer = new View();
            this._msgContainer.zOrder = DisplayOrder.Msg;
            this._msgContainer.mouseEnabled = true;
            this._msg = new Sprite();
            this._msg.loadImage(Assets.Img.msgBg);
            this._msg.pivot(MsgAttr.width / 2, MsgAttr.height / 2);
            this._msg.size(MsgAttr.width, MsgAttr.height);
            this._msg.name = DisplayName.Loading;
            this._msg.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this._textSprite = new LayaText();
            this._textSprite.font = '等线';
            this._textSprite.overflow = LayaText.HIDDEN;
            this._textSprite.wordWrap = true;
            this._textSprite.align = 'center';
            this._textSprite.valign = 'middle';
            this._textSprite.size(260, 300);
            this._textSprite.pivot(this._textSprite.width / 2, this._textSprite.height / 2);
            this._textSprite.pos(this._msg.width / 2, this._msg.height / 2);
            this._msg.addChild(this._textSprite);
        }
        this._showing = true;
        Tween.clearAll(this._msg);
        this._msg.alpha = 0;
        this._msg.scale(0, 0);
        this._textSprite.text = text;
        this._textSprite.color = '#000000';
        this._textSprite.fontSize = 46;
        if (size)
            this._textSprite.fontSize = size;
        Tween.to(this._msg, { alpha: 1, scaleX: 1, scaleY: 1 }, 600, Ease['backInOut'], Handler.create(this, function () {
            _this._showing = false;
            if (func)
                func.apply(_this);
        }));
        this._msgContainer.addChild(this._msg);
        Laya.stage.addChild(this._msgContainer);
    };
    MsgManager.prototype.removeMessage = function (func) {
        var _this = this;
        if (this._showing)
            return;
        Tween.to(this._msg, { alpha: 0, scaleX: 0, scaleY: 0 }, 500, null, Handler.create(this, function () {
            if (func)
                func.apply(_this);
            Laya.stage.removeChild(_this._msgContainer);
            _this._msgContainer.removeChildren();
            _this._showing = false;
        }));
    };
    MsgManager.prototype.setText = function (text, color) {
        if (this._textSprite)
            this._textSprite.text = text;
        if (color)
            this._textSprite.color = color;
    };
    MsgManager.prototype.showTips = function (text) {
        this._tipsText = new LayaText();
        this._tipsText.font = '等线';
        this._tipsText.overflow = LayaText.HIDDEN;
        this._tipsText.wordWrap = true;
        this._tipsText.align = 'left';
        this._tipsText.valign = 'middle';
        this._tipsText.size(226, 300);
        this._tipsText.pivot(this._tipsText.width / 2, this._tipsText.height / 2);
        this._tipsText.pos(Laya.stage.width / 2, Laya.stage.height - 100);
        this._tipsText.text = text;
        this._tipsText.color = '#ffffff';
        this._tipsText.fontSize = 26;
        this.removeTips();
        Laya.stage.addChild(this._tipsText);
    };
    MsgManager.prototype.removeTips = function () {
        if (this._tipsText)
            Laya.stage.removeChild(this._tipsText);
    };
    return MsgManager;
}());
var ScorePanel = (function (_super) {
    __extends(ScorePanel, _super);
    function ScorePanel(type) {
        _super.call(this);
        this.type = type;
        this.loadImage(Assets.Img.scoreBg);
        this.zOrder = DisplayOrder.ScorePanel;
        if (type === 'mine') {
            this.userName = Socket.Instance.mName;
        }
        else if (type === 'your') {
            this.userName = Socket.Instance.yName;
        }
        this.repos();
        this.initInfo();
    }
    ScorePanel.prototype.initInfo = function () {
        var score;
        this._name = new LayaText();
        this._score = new LayaText();
        this._balls = new LayaText();
        if (this.type === 'mine') {
            score = ScoreManager.Instance.mscore;
        }
        else if (this.type === 'your') {
            score = ScoreManager.Instance.yscore;
        }
        this._name.fontSize = 20;
        this._name.pos(6, 2);
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
    };
    ScorePanel.prototype.updateScore = function (score) {
        this._score.text = '得分:' + score.toString();
    };
    ScorePanel.prototype.updateBalls = function (balls) {
        if (this._balls.text !== balls.toString()) {
            Tween.from(this._balls, { y: 10, alpha: 0 }, 300, Ease.backIn);
        }
        this._balls.text = balls.toString();
    };
    ScorePanel.prototype.repos = function () {
        if (Laya.stage.width >= 1280) {
            if (this.type === 'mine') {
                this.pos(global.leftEdge - 400, Laya.stage.height - 47);
            }
            else if (this.type === 'your') {
                this.pos(global.leftEdge - 400, 0);
            }
        }
        else {
            if (this.type === 'mine') {
                this.pos(0, Laya.stage.height - 47);
            }
            else if (this.type === 'your') {
                this.pos(0, 0);
            }
        }
    };
    ScorePanel.prototype.remove = function () {
        this.removeSelf();
    };
    return ScorePanel;
}(laya.display.Sprite));
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var startUI = (function (_super) {
        __extends(startUI, _super);
        function startUI() {
            _super.call(this);
        }
        startUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.startUI.uiView);
        };
        startUI.uiView = { "type": "View", "child": [{ "props": { "x": 132, "y": 396, "skin": "start/btnbg.png", "label": "随机匹配", "width": 216, "height": 86, "sizeGrid": "0,0,0,0", "labelSize": 37, "labelBold": false, "var": "btnMatch", "labelFont": "等线", "labelColors": "#000,#000,#000,#000", "stateNum": "3", "disabled": false, "mouseThrough": false }, "type": "Button" }, { "props": { "x": 132, "y": 503, "skin": "start/btnbg.png", "label": "创建房间", "width": 216, "height": 86, "sizeGrid": "2,4,-2,1", "labelSize": 37, "labelBold": false, "var": "btnCreateRoom", "labelFont": "等线", "toggle": false, "labelColors": "#000,#000,#000,#000", "stateNum": "3" }, "type": "Button" }, { "props": { "x": 132, "y": 609, "skin": "start/btnbg.png", "label": "加入房间", "width": 216, "height": 86, "sizeGrid": "2,4,-2,1", "labelSize": 37, "labelBold": false, "var": "btnJoinRoom", "labelFont": "等线", "toggle": false, "labelColors": "#000,#000,#000,#000", "stateNum": "3" }, "type": "Button" }, { "props": { "x": 8, "y": 160, "skin": "start/logo.png", "width": 462, "height": 100 }, "type": "Image" }], "props": { "width": 480, "height": 800, "labelColors": "(#333,#567356,#333#567356)" } };
        return startUI;
    }(View));
    ui.startUI = startUI;
    var ResultPageUI = (function (_super) {
        __extends(ResultPageUI, _super);
        function ResultPageUI() {
            _super.call(this);
        }
        ResultPageUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.ResultPageUI.uiView);
        };
        ResultPageUI.uiView = { "type": "View", "child": [{ "props": { "x": 4, "y": -4, "skin": "ResultPage/resultbg.png" }, "type": "Image" }, { "props": { "x": 60, "y": -7, "var": "word" }, "type": "Image" }, { "props": { "x": 62, "y": 160, "text": "myname", "width": 94, "height": 23, "var": "myNameText", "fontSize": 20, "color": "#101010", "font": "微软雅黑" }, "type": "Label" }, { "props": { "x": 200, "y": 160, "text": "yourname", "width": 109, "height": 23, "var": "yourNameText", "fontSize": 20, "color": "#3A3A3A", "font": "微软雅黑" }, "type": "Label" }, { "props": { "x": 61, "y": 202, "text": "进球数", "width": 94, "height": 23, "fontSize": 20, "color": "#969696", "font": "等线" }, "type": "Label" }, { "props": { "x": 200, "y": 202, "text": "进球数", "width": 94, "height": 23, "fontSize": 20, "color": "#969696", "font": "等线" }, "type": "Label" }, { "props": { "x": 63, "y": 232, "text": "0", "width": 94, "height": 23, "fontSize": 20, "color": "#00C6F4", "font": "微软雅黑", "var": "myBalls" }, "type": "Label" }, { "props": { "x": 200, "y": 232, "text": "0", "width": 77, "height": 23, "fontSize": 20, "color": "#6D6D6D", "font": "微软雅黑", "var": "yourBalls" }, "type": "Label" }, { "props": { "x": 62, "y": 272, "text": "总得分", "width": 94, "height": 23, "fontSize": 20, "color": "#969696", "font": "等线" }, "type": "Label" }, { "props": { "x": 200, "y": 272, "text": "总得分", "width": 94, "height": 23, "fontSize": 20, "color": "#969696", "font": "等线" }, "type": "Label" }, { "props": { "x": 62, "y": 310, "text": "0", "width": 94, "height": 23, "fontSize": 20, "color": "#00C6F4", "font": "微软雅黑", "var": "myScore" }, "type": "Label" }, { "props": { "x": 200, "y": 310, "text": "0", "width": 94, "height": 23, "fontSize": 20, "color": "#6D6D6D", "font": "微软雅黑", "var": "yourScore" }, "type": "Label" }, { "props": { "x": 123, "y": 354, "label": "返回", "width": 122, "height": 36, "labelFont": "等线", "labelStrokeColor": "#000000", "labelSize": 22, "strokeColors": "#0BE0DA", "stateNum": "1", "labelColors": "#ffffff", "skin": "ResultPage/btnbg.png", "var": "backBtn" }, "type": "Button" }], "props": { "font": "等线" } };
        return ResultPageUI;
    }(View));
    ui.ResultPageUI = ResultPageUI;
})(ui || (ui = {}));
var ResultPage = (function (_super) {
    __extends(ResultPage, _super);
    function ResultPage(data) {
        _super.call(this);
        this.word.loadImage('ResultPage/' + data.result + '.png');
        this.myNameText.text = data.myname;
        this.yourNameText.text = data.yourname;
        this.myBalls.text = data.myballs;
        this.yourBalls.text = data.yourballs;
        this.myScore.text = data.myscore;
        this.yourScore.text = data.yourscore;
        this.pivot(this.width / 2, this.height / 2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.zOrder = DisplayOrder.ResultPage;
        this.backBtn.on(LayaEvent.CLICK, this, this.onBtnBack);
    }
    ResultPage.prototype.onBtnBack = function () {
        SoundManager.playSound(Assets.Sound.button_001);
        Main.Instance.backToMenu();
        this.remove();
    };
    ResultPage.prototype.repos = function () {
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
    };
    ResultPage.prototype.remove = function () {
        this.removeSelf();
    };
    return ResultPage;
}(ui.ResultPageUI));
var ScoreConfig = {
    bulletExplosions: 1,
    balls: 8,
    winBalls: 10
};
var ScoreManager = (function () {
    function ScoreManager() {
        this.mballs = 0;
        this.yballs = 0;
    }
    Object.defineProperty(ScoreManager, "Instance", {
        get: function () {
            if (ScoreManager.instance == null) {
                ScoreManager.instance = new ScoreManager();
            }
            return ScoreManager.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreManager.prototype, "mscore", {
        get: function () {
            return this._mscore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreManager.prototype, "yscore", {
        get: function () {
            return this._yscore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreManager.prototype, "myScorePanel", {
        get: function () {
            return this._myScorePanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreManager.prototype, "yourScorePanel", {
        get: function () {
            return this._yourScorePanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreManager.prototype, "resultView", {
        get: function () {
            return this._resultView;
        },
        enumerable: true,
        configurable: true
    });
    ScoreManager.prototype.initScore = function () {
        this._mscore = { score: 0, balls: 0, bulletExplosions: 0 };
        this._yscore = { score: 0, balls: 0, bulletExplosions: 0 };
        this._myScorePanel = new ScorePanel('mine');
        this._yourScorePanel = new ScorePanel('your');
        Laya.stage.addChild(this._myScorePanel);
        Laya.stage.addChild(this._yourScorePanel);
    };
    ScoreManager.prototype.setScores = function (type, data) {
        if (type === 'mine') {
            this._mscore.balls = data.balls;
            this._mscore.bulletExplosions = data.explosions;
            this._mscore.score = data.score;
        }
        else if (type === 'your') {
            this._yscore.balls = data.balls;
            this._yscore.bulletExplosions = data.explosions;
            this._yscore.score = data.score;
        }
        this.updateScore();
    };
    ScoreManager.prototype.updateScore = function () {
        this.myScorePanel.updateScore(this._mscore.score);
        this.myScorePanel.updateBalls(this._mscore.balls);
        this.yourScorePanel.updateScore(this._yscore.score);
        this.yourScorePanel.updateBalls(this._yscore.balls);
    };
    ScoreManager.prototype.removeScorePanel = function () {
        if (this.myScorePanel)
            this.myScorePanel.remove();
        if (this.yourScorePanel)
            this.yourScorePanel.remove();
    };
    ScoreManager.prototype.checkBalls = function (whoseball) {
        if (whoseball === 'mine' && ScoreManager.Instance.mballs >= ScoreConfig.winBalls) {
            Game.Instance.gameOver();
        }
        else if (whoseball === 'your' && ScoreManager.Instance.yballs >= ScoreConfig.winBalls) {
            Game.Instance.gameOver();
        }
    };
    ScoreManager.prototype.showGameResult = function (data) {
        var mydata, yourdata, mindex, result, re;
        data = data.scores;
        if (this._resultView)
            this.resultView.remove();
        for (var i in data) {
            if (data[i].id === Socket.Instance.getUid()) {
                mydata = data[i];
                mindex = i;
            }
        }
        if (!mydata) {
            console.log('error: user id not exist in scores data.');
            return;
        }
        yourdata = data[1 - mindex];
        result = mydata.score > yourdata.score ? 'win' : (mydata.score < yourdata.score ? 'lose' : 'tie');
        re = {
            result: result,
            myname: mydata.name,
            yourname: yourdata.name,
            myballs: mydata.balls,
            yourballs: yourdata.balls,
            myscore: mydata.score,
            yourscore: yourdata.score
        };
        this._resultView = new ResultPage(re);
        this._resultView.scale(0, 0);
        Laya.stage.addChild(this._resultView);
        Tween.to(this._resultView, { scaleX: 1, scaleY: 1 }, 500, Ease['backOut']);
        if (result === 'win' || result === 'tie')
            SoundManager.playSound(Assets.Sound.gamewin);
        else
            SoundManager.playSound(Assets.Sound.gameover);
    };
    ScoreManager.prototype.removeResultView = function () {
        if (this._resultView)
            this._resultView.remove();
    };
    return ScoreManager;
}());
var config = {
    gameWidth: 480,
    gameHeight: 800,
    socketServer: 'ws://localhost:3100'
};
var BaseBall = (function (_super) {
    __extends(BaseBall, _super);
    function BaseBall() {
        _super.call(this);
    }
    Object.defineProperty(BaseBall.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBall.prototype, "vx", {
        get: function () {
            return this._vx;
        },
        set: function (v) {
            this._vx = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBall.prototype, "vy", {
        get: function () {
            return this._vy;
        },
        set: function (v) {
            this._vy = v;
        },
        enumerable: true,
        configurable: true
    });
    return BaseBall;
}(laya.display.Sprite));
var BallAttr = {
    width: 74,
    height: 74,
    imgWidth: 90,
    imgHeight: 90,
    velocity: 6,
    weight: 2.2
};
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(direction) {
        _super.call(this);
        this._friction = 0.01;
        this._roDirection = 0;
        this._status = 1;
        this._animTime = 0;
        this._fallPosList = [];
        this.graphics.loadImage(Assets.Img.ball);
        this.pivot(BallAttr.imgWidth / 2, BallAttr.imgHeight / 2);
        this.size(BallAttr.width, BallAttr.height);
        this.zOrder = DisplayOrder.Ball;
        this.posCenter();
        this._direction = direction;
        this._radius = BallAttr.width / 2;
        this.initVelocity();
        this._weight = BallAttr.weight;
    }
    Object.defineProperty(Ball.prototype, "roDirection", {
        get: function () {
            return this._roDirection;
        },
        set: function (d) {
            this._roDirection = d;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        set: function (w) {
            this._weight = w;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "direction", {
        set: function (d) {
            this._direction = d;
        },
        enumerable: true,
        configurable: true
    });
    Ball.prototype.update = function () {
        if (this.actionInStatus())
            return;
        this.x = Utils.floatN(this.x + this._vx);
        this.y = Utils.floatN(this.y + this._vy);
        if (this._roDirection !== 0) {
            var rv = Utils.floatN(Math.sqrt(Math.pow(this._vx, 2) + Math.pow(this._vy, 2)) * 2);
            this.rotation = this.rotation + (this._roDirection < 0 ? -1 : 1) * rv;
        }
        this._nextX = this.x + this._vx;
        this._nextY = this.y + this._vy;
        if (this._nextX < BallAttr.width / 2 || this._nextX > config.gameWidth - BallAttr.width / 2) {
            this.x = (this._nextX < BallAttr.width / 2) ? BallAttr.width / 2 : config.gameWidth - BallAttr.width / 2;
            this._vx *= -1;
            SoundManager.playSound(Assets.Sound.hit_002);
        }
        var whoseball = this._nextY < -50 ? 'mine' : 'your';
        if (this._nextY < -50 || this._nextY > config.gameHeight + 50) {
            this.vx = 0;
            this.vy = 0;
            var game = Game.Instance;
            game.status = 0;
            Bullet.boomAllBullets();
            for (var _i = 0, _a = Main.Instance.gamePage._childs; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.className && child.className === 'Bullet')
                    Main.Instance.gamePage.removeChild(child);
            }
            Game.Instance.timer.clearTaskList();
            if (this._nextY < -50) {
                ScoreManager.Instance.mballs++;
                Socket.Instance.ballIn();
                SoundManager.playSound(Assets.Sound.mscore);
            }
            else {
                ScoreManager.Instance.yballs++;
                SoundManager.playSound(Assets.Sound.yscore);
            }
            ScoreManager.Instance.checkBalls(whoseball);
            this._animTime = 0;
            this._status = 3;
        }
        var fx = Utils.floatN(Math.abs(this._friction * this.vx / BallAttr.velocity));
        var fy = Utils.floatN(Math.abs(this._friction * this.vy / BallAttr.velocity));
        this._vx = Math.abs(this._vx) < 0.1 ? 0 : Utils.floatN(this._vx > 0 ? this._vx - fx : this._vx + fx);
        this._vy = Math.abs(this._vy) < 0.1 ? 0 : Utils.floatN(this._vy > 0 ? this._vy - fy : this._vy + fy);
    };
    Ball.prototype.compRDirection = function (x, y, vx, vy) {
        var p = Utils.posToLine(this.x, this.y, x, y, vx, vy);
        if ((vx <= 0 && vy <= 0) || (vx < 0 && vy >= 0)) {
            if (p > 0)
                this.roDirection = 1;
            if (p < 0)
                this.roDirection = -1;
        }
        else if ((vx > 0 && vy < 0) || (vx >= 0 && vy > 0)) {
            if (p > 0)
                this.roDirection = -1;
            if (p < 0)
                this.roDirection = 1;
        }
        if (global.syn)
            this.roDirection *= -1;
    };
    Ball.prototype.initVelocity = function () {
        this._vx = Utils.floatN(BallAttr.velocity * Math.round(Math.sin(90 * Math.PI / 180)) * (this._direction === 0 ? -1 : 1));
        this._vy = Utils.floatN(-1 * BallAttr.velocity * Math.round(Math.cos(90 * Math.PI / 180)));
    };
    Ball.prototype.posCenter = function () {
        this.pos(config.gameWidth / 2, config.gameHeight / 2);
    };
    Ball.prototype.actionInStatus = function () {
        if (this._status === 3) {
            this._animTime += 1;
            if (this._animTime > 30) {
                this.fallDown();
            }
            return true;
        }
        if (this._status === 2) {
            var easeValue = Ease.bounceOut(this._animTime, 5, -4, 1000);
            this._animTime += 16;
            this.scale(easeValue, easeValue);
            this._fallPosList.push(easeValue);
            if (this._fallPosList.length > 3)
                this._fallPosList.shift();
            if (this._fallPosList[1] < this._fallPosList[0] && this._fallPosList[1] < this._fallPosList[2])
                SoundManager.playSound(Assets.Sound.hit_002);
            if (this._animTime > 1000) {
                var direction = Game.Instance.getBallDirection();
                this.scale(1, 1);
                this._status = 1;
                this._roDirection = 0;
                this._direction = Game.Instance.ballDirectionFactor ? direction : 1 - direction;
                this.initVelocity();
                Game.Instance.status = 1;
                Game.Instance.toolTagContainer.unlock();
                this._fallPosList = [];
            }
            return true;
        }
        return false;
    };
    Ball.prototype.fallDown = function () {
        this._animTime = 0;
        this.posCenter();
        this._status = 2;
        this.weight = BallAttr.weight;
        this.removeChildren();
    };
    Ball.prototype.isNormalStatus = function () {
        return this._status === 1;
    };
    Ball.prototype.getFrozen = function () {
        var _this = this;
        var ice = new Sprite();
        ice.loadImage(Assets.Img.ball_effect_ice);
        ice.pivot(41, 41);
        ice.x = 45;
        ice.y = 45;
        this.removeChildren();
        this.addChild(ice);
        this.weight = 8;
        if (global.syn) {
            this.vx = Utils.floatN(this.vx / this.weight);
            this.vy = Utils.floatN(this.vy / this.weight);
        }
        else {
            this.vx = Utils.floatN((this.vx * -1) / this.weight);
            this.vy = Utils.floatN((this.vy * -1) / this.weight);
            this.vx *= -1;
            this.vy *= -1;
        }
        Game.Instance.timer.clearTaskByName('frozen');
        Game.Instance.timer.setTimeout(function () {
            _this.weight = BallAttr.weight;
            _this.removeChildren();
        }, 300, this, 'frozen');
    };
    Ball.prototype.release = function () {
        this.weight = BallAttr.weight;
        this.removeChildren();
    };
    return Ball;
}(BaseBall));
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        _super.call(this);
        this.className = 'Bullet';
        this.zOrder = DisplayOrder.Bullet;
    }
    Bullet.getOrCreate = function (angle, power, type, owner) {
        var bullet = Pool.getItemByCreateFun(type, function () {
            switch (type) {
                case 'StandardBullet':
                    if (owner === 'self')
                        return new StandardBullet();
                    else if (owner === 'opponent')
                        return new StandardBullet();
                case 'IceBullet':
                    return new IceBullet();
                case 'DivisionBullet':
                    return new DivisionBullet();
                case 'DivisionChildBullet':
                    return new DivisionChildBullet();
                case 'SmokeBullet':
                    return new SmokeBullet();
                case 'BombBullet':
                    return new BombBullet();
                default: {
                    console.log('not exist bullet type.');
                    return new StandardBullet();
                }
            }
        });
        bullet.init(angle, power, owner);
        if (owner === 'self')
            Bullet.myBullets.push(bullet);
        else if (owner === 'opponent')
            Bullet.yourBullets.push(bullet);
        return bullet;
    };
    Bullet.prototype.init = function (angle, power, owner) {
    };
    Bullet.prototype.update = function () {
        this.collision();
        this.x = Utils.floatN(this.x + this._vx);
        this.y = Utils.floatN(this.y + this._vy);
        this._nextX = this.x + this._vx;
        this._nextY = this.y + this._vy;
        if (this._nextX < this.width / 2 || this._nextX > config.gameWidth - this.width / 2) {
            this.x = (this._nextX < this.width / 2) ? this.width / 2 : config.gameWidth - this.width / 2;
            this._vx *= -1;
        }
        if (this.y < -1 * this.width / 2 || this.y > config.gameHeight + this.height / 2) {
            this.release();
        }
    };
    Bullet.prototype.collision = function () {
        var bullets;
        var ball = Game.Instance.ball;
        if (this._owner === 'self' && global.syn === 0) {
            bullets = Bullet.yourBullets;
            for (var _i = 0, bullets_1 = bullets; _i < bullets_1.length; _i++) {
                var b = bullets_1[_i];
                this.collisionBullets(this, b);
            }
        }
        else if (this._owner === 'opponent' && global.syn === 1) {
            bullets = Bullet.myBullets;
            for (var _a = 0, bullets_2 = bullets; _a < bullets_2.length; _a++) {
                var b = bullets_2[_a];
                this.collisionBullets(this, b);
            }
        }
        this.collisionBall(ball);
    };
    Bullet.prototype.collisionBullets = function (object1, object2) {
        var convert = global.syn ? false : true;
        var nextObject1 = {
            x: object1.x + object1.vx,
            y: object1.y + object1.vy,
            radius: object1.radius
        };
        var nextObject2 = {
            x: object2.x + object2.vx,
            y: object2.y + object2.vy,
            radius: object2.radius
        };
        if (Utils.isCircleCollision(nextObject1, nextObject2)) {
            _a = Utils.fixCollision(Utils.p(object1.x, object1.y), Utils.p(object2.x, object2.y), object1.radius, object2.radius, convert), object1.x = _a[0], object1.y = _a[1], object2.x = _a[2], object2.y = _a[3];
            _b = Utils.compBallRebound(Utils.p(object1.x, object1.y), Utils.p(object2.x, object2.y), { vx: object1.vx, vy: object1.vy }, { vx: object2.vx, vy: object2.vy }, convert), object1.vx = _b[0], object1.vy = _b[1], object2.vx = _b[2], object2.vy = _b[3];
        }
        var _a, _b;
    };
    Bullet.prototype.collisionBall = function (ball) {
        var nextObject1 = {
            x: this.x + this.vx,
            y: this.y + this.vy,
            radius: this.radius
        };
        var nextObject2 = {
            x: ball.x + ball.vx,
            y: ball.y + ball.vy,
            radius: ball.radius
        };
        if (Utils.isCircleCollision(nextObject1, nextObject2)) {
            this.calculateBallPhysics(ball);
        }
    };
    Bullet.prototype.calculateBallPhysics = function (ball) {
        this.fixBallPosition(ball);
        ball.compRDirection(this.x, this.y, this.vx, this.vy);
        this.calculateBallVelocity(ball);
    };
    Bullet.prototype.fixBallPosition = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert), this.x = _a[0], this.y = _a[1], ball.x = _a[2], ball.y = _a[3];
        var _a;
    };
    Bullet.prototype.calculateBallVelocity = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.compBallRebound(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), { vx: this.vx, vy: this.vy }, { vx: ball.vx, vy: ball.vy }, convert), this.vx = _a[0], this.vy = _a[1], ball.vx = _a[2], ball.vy = _a[3];
        this.simulateWeight(ball);
        var _a;
    };
    Bullet.prototype.simulateWeight = function (ball) {
        if (global.syn) {
            ball.vx = Utils.floatN(ball.vx / ball.weight);
            ball.vy = Utils.floatN(ball.vy / ball.weight);
        }
        else {
            ball.vx = Utils.floatN((ball.vx * -1) / ball.weight);
            ball.vy = Utils.floatN((ball.vy * -1) / ball.weight);
            ball.vx *= -1;
            ball.vy *= -1;
        }
    };
    Bullet.boomAllBullets = function () {
        while (Bullet.myBullets.length > 0) {
            Bullet.myBullets[0].releaseAction();
        }
        while (Bullet.yourBullets.length > 0) {
            Bullet.yourBullets[0].releaseAction();
        }
    };
    Bullet.prototype.releaseAction = function () {
        this.release();
    };
    Bullet.prototype.release = function () {
        this.removeFromArr();
        this.removeSelf();
        Pool.recover(this._type, this);
    };
    Bullet.prototype.removeFromArr = function () {
        var list;
        if (this._owner === 'self') {
            list = Bullet.myBullets;
            list.splice(list.indexOf(this), 1);
        }
        else if (this._owner === 'opponent') {
            list = Bullet.yourBullets;
            list.splice(list.indexOf(this), 1);
        }
    };
    Bullet.myBullets = [];
    Bullet.yourBullets = [];
    return Bullet;
}(BaseBall));
var StandardBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
};
var StandardBullet = (function (_super) {
    __extends(StandardBullet, _super);
    function StandardBullet() {
        _super.call(this);
        this._type = 'standard';
        this.pivot(StandardBulletAttr.imgWidth / 2, StandardBulletAttr.imgHeight / 2);
        this.size(StandardBulletAttr.width, StandardBulletAttr.height);
        this._radius = StandardBulletAttr.width / 2;
    }
    StandardBullet.prototype.init = function (angle, power, owner) {
        var v = Utils.floatN(StandardBulletAttr.velocity - (1 - power) * 12);
        this.loadImage(owner === 'self' ? Assets.Img.bulletm : owner === 'opponent' ? Assets.Img.bullety : '');
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    };
    StandardBullet.prototype.fixBallPosition = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert), this.x = _a[0], this.y = _a[1], ball.x = _a[2], ball.y = _a[3];
        var distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        if (distance < 38) {
            if (this._owner === 'self' && ball.isNormalStatus())
                Socket.Instance.causeExplosion();
            this.releaseAction();
            SoundManager.playSound(Assets.Sound.boom_001, 1);
        }
        else {
            SoundManager.playSound(Assets.Sound.hit_001, 1);
        }
        var _a;
    };
    StandardBullet.prototype.releaseAction = function () {
        var pos = Utils.p(this.x, this.y);
        var name = this._owner === 'self' ? 'blue_boom' : this._owner === 'opponent' ? 'red_boom' : '';
        var ani = AnimationManager.getOrCreate(name);
        var gamePage = Main.Instance.gamePage;
        ani.pos(pos.x, pos.y);
        ani.off(LayaEvent.COMPLETE, ani, function () { });
        ani.on(LayaEvent.COMPLETE, ani, function () {
            Pool.recover(name, ani);
            ani.removeSelf();
        });
        gamePage.addChild(ani);
        ani.play(0, false, name);
        this.release();
    };
    return StandardBullet;
}(Bullet));
var IceBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
};
var IceBullet = (function (_super) {
    __extends(IceBullet, _super);
    function IceBullet() {
        _super.call(this);
        this._type = 'ice';
        this.pivot(IceBulletAttr.imgWidth / 2, IceBulletAttr.imgHeight / 2);
        this.size(IceBulletAttr.width, IceBulletAttr.height);
        this._radius = IceBulletAttr.width / 2;
    }
    IceBullet.prototype.init = function (angle, power, owner) {
        var v = Utils.floatN(IceBulletAttr.velocity - (1 - power) * 12);
        this.loadImage(Assets.Img.bullet_ice);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    };
    IceBullet.prototype.calculateBallPhysics = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert), this.x = _a[0], this.y = _a[1], ball.x = _a[2], ball.y = _a[3];
        var distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        ball.compRDirection(this.x, this.y, this.vx, this.vy);
        _b = Utils.compBallRebound(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), { vx: this.vx, vy: this.vy }, { vx: ball.vx, vy: ball.vy }, convert), this.vx = _b[0], this.vy = _b[1], ball.vx = _b[2], ball.vy = _b[3];
        this.simulateWeight(ball);
        this.releaseAction();
        this.frozen(ball);
        if (this._owner === 'self' && ball.isNormalStatus())
            Socket.Instance.causeExplosion();
        var _a, _b;
    };
    IceBullet.prototype.frozen = function (object) {
        object.getFrozen();
        SoundManager.playSound(Assets.Sound.frozen);
    };
    IceBullet.prototype.releaseAction = function () {
        var pos = Utils.p(this.x, this.y);
        var name = 'blue_boom';
        var ani = AnimationManager.getOrCreate(name);
        var gamePage = Main.Instance.gamePage;
        ani.pos(pos.x, pos.y);
        ani.off(LayaEvent.COMPLETE, ani, function () { });
        ani.on(LayaEvent.COMPLETE, ani, function () {
            Pool.recover(name, ani);
            ani.removeSelf();
        });
        gamePage.addChild(ani);
        ani.play(0, false, name);
        this.release();
    };
    return IceBullet;
}(Bullet));
var DivisionBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
};
var DivisionBullet = (function (_super) {
    __extends(DivisionBullet, _super);
    function DivisionBullet() {
        _super.call(this);
        this._type = 'division';
        this.pivot(DivisionBulletAttr.imgWidth / 2, DivisionBulletAttr.imgHeight / 2);
        this.size(DivisionBulletAttr.width, DivisionBulletAttr.height);
        this._radius = DivisionBulletAttr.width / 2;
    }
    DivisionBullet.prototype.init = function (angle, power, owner) {
        var _this = this;
        var v = Utils.floatN(DivisionBulletAttr.velocity - (1 - power) * 12);
        this.loadImage(Assets.Img.bullet_division);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
        Game.Instance.timer.setTimeout(function () {
            _this.divideEffect();
            _this.divide();
        }, 10, this);
    };
    DivisionBullet.prototype.divide = function () {
        var gamePage = Main.Instance.gamePage;
        var angle = Utils.floatN(Math.atan(this.vx / this.vy) * 180 / Math.PI * -1);
        for (var i = 0; i < 3; i++) {
            var bullet = Bullet.getOrCreate(Utils.floatN(angle + (i - 1) * 20 + (this._owner === 'opponent' ? 180 : 0)), 0.6, 'DivisionChildBullet', this._owner);
            bullet.pos(this.x, this.y);
            gamePage.addChild(bullet);
        }
        SoundManager.playSound(Assets.Sound.boom_003);
    };
    DivisionBullet.prototype.divideEffect = function () {
        var pos = Utils.p(this.x, this.y);
        var name = 'green_boom';
        var ani = AnimationManager.getOrCreate(name);
        var gamePage = Main.Instance.gamePage;
        ani.pos(pos.x, pos.y);
        ani.off(LayaEvent.COMPLETE, ani, function () { });
        ani.on(LayaEvent.COMPLETE, ani, function () {
            Pool.recover(name, ani);
            ani.removeSelf();
        });
        gamePage.addChild(ani);
        ani.play(0, false, name);
        this.release();
    };
    return DivisionBullet;
}(Bullet));
var DivisionChildBullet = (function (_super) {
    __extends(DivisionChildBullet, _super);
    function DivisionChildBullet() {
        _super.call(this);
        this._type = 'divisionchild';
        this.pivot(DivisionBulletAttr.imgWidth / 2, DivisionBulletAttr.imgHeight / 2);
        this.size(DivisionBulletAttr.width, DivisionBulletAttr.height);
        this._radius = DivisionBulletAttr.width / 2;
    }
    DivisionChildBullet.prototype.init = function (angle, power, owner) {
        var v = Utils.floatN(DivisionBulletAttr.velocity - (1 - power) * 12);
        this.loadImage(Assets.Img.bullet_division);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    };
    DivisionChildBullet.prototype.fixBallPosition = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert), this.x = _a[0], this.y = _a[1], ball.x = _a[2], ball.y = _a[3];
        var distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        SoundManager.playSound(Assets.Sound.hit_001, 1);
        var _a;
    };
    return DivisionChildBullet;
}(Bullet));
var SmokeBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
};
var SmokeBullet = (function (_super) {
    __extends(SmokeBullet, _super);
    function SmokeBullet() {
        _super.call(this);
        this._type = 'smoke';
        this.pivot(SmokeBulletAttr.imgWidth / 2, SmokeBulletAttr.imgHeight / 2);
        this.size(SmokeBulletAttr.width, SmokeBulletAttr.height);
        this._radius = SmokeBulletAttr.width / 2;
    }
    SmokeBullet.prototype.init = function (angle, power, owner) {
        var v = Utils.floatN(IceBulletAttr.velocity - (1 - power) * 12);
        this.loadImage(Assets.Img.bullet_smoke);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    };
    SmokeBullet.prototype.update = function () {
        _super.prototype.update.call(this);
        if ((this._owner === 'self' && this.y < 160) || (this._owner === 'opponent' && this.y > config.gameHeight - 160)) {
            this.makeSmoke();
            this.release();
        }
    };
    SmokeBullet.prototype.fixBallPosition = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert), this.x = _a[0], this.y = _a[1], ball.x = _a[2], ball.y = _a[3];
        var distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        SoundManager.playSound(Assets.Sound.hit_001, 1);
        var _a;
    };
    SmokeBullet.prototype.makeSmoke = function () {
        var _this = this;
        var pos = Utils.p(this.x, this.y);
        var name = 'smoke';
        var ani = AnimationManager.getOrCreate(name, 500, 250, 250, 125);
        var gamePage = Main.Instance.gamePage;
        var smoke;
        var taskName = this._owner === 'self' ? 'stopSmoke1' : 'stopSmoke2';
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
        Game.Instance.timer.setTimeout(function () {
            if (_this._owner === 'self')
                Game.Instance.smoke1 = null;
            else
                Game.Instance.smoke2 = null;
            if (!Game.Instance.smoke1 && !Game.Instance.smoke2)
                SoundManager.stopSound(Assets.Sound.smoke);
            Tween.to(ani, { alpha: 0 }, 800, Ease.linearInOut, Handler.create(_this, function () {
                ani.alpha = 1;
                Pool.recover(name, ani);
                ani.removeSelf();
            }));
        }, 500, this, taskName, true);
        if (this._owner === 'self') {
            Game.Instance.smoke1 = ani;
        }
        else
            Game.Instance.smoke2 = ani;
    };
    return SmokeBullet;
}(Bullet));
var BombBulletAttr = {
    width: 40,
    height: 40,
    imgWidth: 39,
    imgHeight: 39,
    velocity: 20
};
var BombBullet = (function (_super) {
    __extends(BombBullet, _super);
    function BombBullet() {
        _super.call(this);
        this._type = 'bomb';
        this.pivot(BombBulletAttr.imgWidth / 2, BombBulletAttr.imgHeight / 2);
        this.size(BombBulletAttr.width, BombBulletAttr.height);
        this._radius = BombBulletAttr.width / 2;
    }
    BombBullet.prototype.init = function (angle, power, owner) {
        var v = Utils.floatN(BombBulletAttr.velocity - (1 - power) * 12);
        this.loadImage(Assets.Img.bullet_bomb);
        this._owner = owner;
        this._vx = Utils.floatN((v * Math.sin(angle * Math.PI / 180)));
        this._vy = Utils.floatN((-1 * v * Math.cos(angle * Math.PI / 180)));
    };
    BombBullet.prototype.update = function () {
        this.collision();
        this.x = Utils.floatN(this.x + this._vx);
        this.y = Utils.floatN(this.y + this._vy);
        this._nextX = this.x + this._vx;
        this._nextY = this.y + this._vy;
        if (this._nextX < this.width / 2 || this._nextX > config.gameWidth - this.width / 2) {
            this.x = (this._nextX < this.width / 2) ? this.width / 2 : config.gameWidth - this.width / 2;
            this.boomEffect();
            this.boom();
        }
        if (this.y < -1 * this.width / 2 || this.y > config.gameHeight + this.height / 2) {
            this.release();
        }
    };
    BombBullet.prototype.collisionBullets = function (object1, object2) {
        var convert = global.syn ? false : true;
        var nextObject1 = {
            x: object1.x + object1.vx,
            y: object1.y + object1.vy,
            radius: object1.radius
        };
        var nextObject2 = {
            x: object2.x + object2.vx,
            y: object2.y + object2.vy,
            radius: object2.radius
        };
        if (Utils.isCircleCollision(nextObject1, nextObject2)) {
            _a = Utils.fixCollision(Utils.p(object1.x, object1.y), Utils.p(object2.x, object2.y), object1.radius, object2.radius, convert), object1.x = _a[0], object1.y = _a[1], object2.x = _a[2], object2.y = _a[3];
            _b = Utils.compBallRebound(Utils.p(object1.x, object1.y), Utils.p(object2.x, object2.y), { vx: object1.vx, vy: object1.vy }, { vx: object2.vx, vy: object2.vy }, convert), object1.vx = _b[0], object1.vy = _b[1], object2.vx = _b[2], object2.vy = _b[3];
            this.boomEffect();
            this.boom();
        }
        var _a, _b;
    };
    BombBullet.prototype.calculateBallPhysics = function (ball) {
        var convert = global.syn ? false : true;
        _a = Utils.fixCollision(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), this.radius, ball.radius, convert), this.x = _a[0], this.y = _a[1], ball.x = _a[2], ball.y = _a[3];
        var distance = Utils.distanceToLine(ball.x, ball.y, this.x, this.y, this.vx, this.vy);
        ball.compRDirection(this.x, this.y, this.vx, this.vy);
        _b = Utils.compBallRebound(Utils.p(this.x, this.y), Utils.p(ball.x, ball.y), { vx: this.vx, vy: this.vy }, { vx: ball.vx, vy: ball.vy }, convert), this.vx = _b[0], this.vy = _b[1], ball.vx = _b[2], ball.vy = _b[3];
        this.boomEffect();
        this.boom();
        if (this._owner === 'self' && ball.isNormalStatus())
            Socket.Instance.causeExplosion();
        var _a, _b;
    };
    BombBullet.prototype.boom = function () {
        var ball = Game.Instance.ball;
        this.boomPhysics(ball);
        if (global.syn) {
            for (var _i = 0, _a = Bullet.myBullets; _i < _a.length; _i++) {
                var bullet = _a[_i];
                this.boomPhysics(bullet);
            }
            for (var _b = 0, _c = Bullet.yourBullets; _b < _c.length; _b++) {
                var bullet = _c[_b];
                this.boomPhysics(bullet);
            }
        }
        else {
            for (var _d = 0, _e = Bullet.yourBullets; _d < _e.length; _d++) {
                var bullet = _e[_d];
                this.boomPhysics(bullet);
            }
            for (var _f = 0, _g = Bullet.myBullets; _f < _g.length; _f++) {
                var bullet = _g[_f];
                this.boomPhysics(bullet);
            }
        }
    };
    BombBullet.prototype.boomPhysics = function (object) {
        var convert = global.syn ? false : true;
        var thisx = this.x;
        var thisy = this.y;
        var objectx = object.x;
        var objecty = object.y;
        if (convert) {
            thisx = Utils.floatN(config.gameWidth - thisx);
            thisy = Utils.floatN(config.gameHeight - thisy);
            objectx = Utils.floatN(config.gameWidth - objectx);
            objecty = Utils.floatN(config.gameHeight - objecty);
        }
        var distance = Utils.floatN(Utils.pLength(Utils.p(objectx, objecty), Utils.p(thisx, thisy)));
        if (distance <= 180 && distance > 0) {
            var rate = (objectx - thisx) / (objecty - thisy);
            var power = (180 - distance) / 800;
            object.vx = Utils.floatN((objectx - thisx) * power);
            object.vy = Utils.floatN((objecty - thisy) * power);
            if (convert) {
                object.vx = Utils.floatN(object.vx * -1);
                object.vy = Utils.floatN(object.vy * -1);
            }
        }
    };
    BombBullet.prototype.boomEffect = function () {
        var pos = Utils.p(this.x, this.y);
        var name = 'boom';
        var ani = AnimationManager.getOrCreate(name, 291, 291, 145, 145);
        var gamePage = Main.Instance.gamePage;
        ani.pos(pos.x, pos.y);
        ani.off(LayaEvent.COMPLETE, ani, function () { });
        ani.on(LayaEvent.COMPLETE, ani, function () {
            Pool.recover(name, ani);
            ani.removeSelf();
        });
        gamePage.addChild(ani);
        ani.play(0, false, name);
        SoundManager.playSound(Assets.Sound.boom_002);
        this.release();
    };
    return BombBullet;
}(Bullet));
var CannonAttr = {
    width: 71,
    height: 111,
    imgWidth: 71,
    imgHeight: 111
};
var Cannon = (function (_super) {
    __extends(Cannon, _super);
    function Cannon(opponent) {
        _super.call(this);
        this.loadImage(opponent ? Assets.Img.cannon_y : Assets.Img.cannon_m);
        this.pivot(CannonAttr.imgWidth / 2, 75);
        this.pos(config.gameWidth / 2, config.gameHeight);
        this.size(CannonAttr.width, CannonAttr.height);
        this.zOrder = DisplayOrder.Cannon;
        this.opponent = opponent;
        if (opponent) {
            this.pos(config.gameWidth / 2, 0);
            this.addShadow();
            this.setAngle(this.rotation + 180);
        }
        else {
            this.addShadow();
        }
    }
    Cannon.prototype.getAngle = function () {
        return this.rotation;
    };
    Cannon.prototype.setAngle = function (angle) {
        if (!this.opponent && (angle > 82 || angle < -82)) {
            angle = angle > 0 ? 82 : -82;
        }
        if (this.opponent && (angle < 98 || angle > 262)) {
            angle = angle < 98 ? 98 : 262;
        }
        this.rotation = angle;
        this._shadow.rotation = angle;
    };
    Cannon.prototype.shoot = function (angle, power, bulletType) {
        var bullet;
        var gamePage = Main.Instance.gamePage;
        if (this.opponent) {
            this.setAngle(angle + 180);
            bullet = Bullet.getOrCreate(angle + 180, power, bulletType, 'opponent');
        }
        else {
            bullet = Bullet.getOrCreate(angle, power, bulletType, 'self');
        }
        if (bullet) {
            gamePage.addChild(bullet);
        }
        else
            console.log('Bullet is lock.');
        bullet.pos(this.x, this.y);
        SoundManager.playSound(Assets.Sound.shoot, 1);
    };
    Cannon.prototype.addShadow = function () {
        this._shadow = new Sprite();
        this._shadow.loadImage(Assets.Img.cannon_shadow);
        this._shadow.pivot(41, 75);
        if (this.opponent) {
            this._shadow.pos(this.x - 20, this.y - 10);
        }
        else {
            this._shadow.pos(this.x - 20, this.y + 10);
        }
        this._shadow.zOrder = DisplayOrder.Shadow;
        Main.Instance.gamePage.addChild(this._shadow);
    };
    Cannon.prototype.remove = function () {
        this.removeSelf();
        this._shadow.removeSelf();
    };
    return Cannon;
}(laya.display.Sprite));
var ProcessAttr = {
    width: 22,
    height: 188,
    bulletCost: 0.2
};
var BulletProcess = (function (_super) {
    __extends(BulletProcess, _super);
    function BulletProcess() {
        _super.call(this);
        this.loadImage(Assets.Img.processBg);
        this.size(ProcessAttr.width, ProcessAttr.height);
        this.pivot(ProcessAttr.width, ProcessAttr.height);
        this.zOrder = DisplayOrder.ProcessBar;
        this.repos();
        this.pmask = new Sprite();
        this.pmask.loadImage(Assets.Img.process);
        this.pmask.size(ProcessAttr.width, ProcessAttr.height);
        this.pmask.pos(0, ProcessAttr.height / 2);
        this.process = new Sprite();
        this.process.loadImage(Assets.Img.process);
        this.process.size(ProcessAttr.width, ProcessAttr.height);
        this.process.mask = this.pmask;
        this.percent = 0.5;
        this.addChild(this.process);
        Laya.stage.addChild(this);
    }
    BulletProcess.prototype.update = function () {
        if (this.pmask.y <= 0) {
            this.pmask.y = 0;
            return;
        }
        this.pmask.pos(0, this.pmask.y - 0.5);
        this.percent = 1 - (this.pmask.y / ProcessAttr.height);
    };
    BulletProcess.prototype.costOne = function (num) {
        if (!num)
            num = 1;
        if (num < 0.5)
            num = 0.5;
        if (this.percent >= (ProcessAttr.bulletCost * num)) {
            this.percent -= (ProcessAttr.bulletCost * num);
            this.pmask.pos(0, ProcessAttr.height * (1 - this.percent));
            return true;
        }
        else
            return false;
    };
    BulletProcess.prototype.repos = function () {
        if (Laya.stage.width >= 1280) {
            this.pos(global.rightEdge + 400, Laya.stage.height);
        }
        else
            this.pos(Laya.stage.width, Laya.stage.height);
    };
    BulletProcess.prototype.remove = function () {
        this.removeSelf();
    };
    return BulletProcess;
}(laya.display.Sprite));
var TimerAttr = {
    width: 102,
    height: 40,
    time: 180
};
var Timer = (function (_super) {
    __extends(Timer, _super);
    function Timer() {
        _super.call(this);
        this._frame = 0;
        this._timeValue = TimerAttr.time;
        this._timeTaskList = [];
        this.loadImage(Assets.Img.timerBg);
        this.zOrder = DisplayOrder.Timer;
        this.size(TimerAttr.width, TimerAttr.height);
        this.pivot(this.width, 0);
        this.repos();
        this._time = new LayaText();
        this._time.font = 'Arial';
        this._time.fontSize = 33;
        this._time.color = '#000000';
        this._time.align = 'center';
        this._time.valign = 'middle';
        this._time.size(110, 38);
        this._time.pivot(this._time.width / 2, this._time.height / 2);
        this._time.pos(this.width / 2 + 2, this.height / 2 - 2);
        this._time.text = this.convertToString(this._timeValue);
        this.addChild(this._time);
        Laya.stage.addChild(this);
    }
    Object.defineProperty(Timer.prototype, "timeValue", {
        get: function () {
            return this._timeValue;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.update = function () {
        this._frame++;
        if (this._frame >= 60) {
            this._timeValue--;
            this._time.text = this.convertToString(this._timeValue);
            this._frame = 0;
            if (this._timeValue === 30) {
                this._time.color = '#F41414';
            }
            if (this._timeValue <= 0 && Game.Instance.status != 0) {
                Game.Instance.gameOver();
            }
        }
        for (var _i = 0, _a = this._timeTaskList; _i < _a.length; _i++) {
            var task = _a[_i];
            task.frame++;
            if (task.frame >= task.goalFrame) {
                task.goalFunc.apply(task.context);
                this._timeTaskList.splice(this._timeTaskList.indexOf(task), 1);
            }
        }
    };
    Timer.prototype.isTimeout = function () {
        return this._timeValue <= 0;
    };
    Timer.prototype.repos = function () {
        if (Laya.stage.width >= 1280) {
            this.pos(global.rightEdge + 400, 0);
        }
        else
            this.pos(Laya.stage.width, 0);
    };
    Timer.prototype.convertToString = function (time) {
        var minute, second, res = '';
        if (time < 0)
            return '00:00';
        minute = Math.floor(time / 60);
        second = time % 60;
        if (minute < 10)
            res = res + '0' + minute.toString();
        else
            res = res + minute.toString();
        res += ':';
        if (second < 10)
            res = res + '0' + second.toString();
        else
            res = res += second.toString();
        return res;
    };
    Timer.prototype.setTimeout = function (func, timeFrame, context, taskName, clear) {
        this._timeTaskList.push({ frame: 0, goalFrame: timeFrame, goalFunc: func, context: context, taskName: taskName || '', clear: clear || false });
    };
    Timer.prototype.runTaskByName = function (name) {
        for (var _i = 0, _a = this._timeTaskList; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.taskName === name) {
                task.goalFunc.apply(task.context);
                this._timeTaskList.splice(this._timeTaskList.indexOf(task), 1);
            }
        }
    };
    Timer.prototype.clearTaskList = function () {
        for (var _i = 0, _a = this._timeTaskList; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.clear)
                task.goalFunc.apply(task.context);
        }
        this._timeTaskList = [];
    };
    Timer.prototype.clearTaskByName = function (name) {
        for (var _i = 0, _a = this._timeTaskList; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.taskName === name)
                this._timeTaskList.splice(this._timeTaskList.indexOf(task), 1);
        }
    };
    Timer.prototype.remove = function () {
        this.removeSelf();
    };
    return Timer;
}(laya.display.Sprite));
var DashLine = (function (_super) {
    __extends(DashLine, _super);
    function DashLine(x, y) {
        _super.call(this);
        this.zOrder = DisplayOrder.AssistLine;
        this.pos(x, y);
    }
    DashLine.prototype.drawAssistLine = function (goalPoint) {
        var p = { x: 0, y: 0 }, arr = [], length, dotLength = 20, dotNum, xadd, yadd;
        p.x = goalPoint.x - this.x;
        p.y = goalPoint.y - this.y;
        length = Utils.pLength(goalPoint, Utils.p(this.x, this.y));
        dotNum = Math.ceil(length / dotLength);
        xadd = dotLength * (p.x) / length;
        yadd = dotLength * (p.y) / length;
        this.clearLines();
        for (var i = 0; i < dotNum; i++) {
            if (i % 2 !== 0) {
                var line = new Sprite();
                this.addChild(line);
                line.graphics.drawLine((i - 1) * xadd, (i - 1) * yadd, i * xadd, i * yadd, '#ffffff', 2);
            }
        }
    };
    DashLine.prototype.clearLines = function () {
        this.removeChildren();
    };
    DashLine.prototype.remove = function () {
        this.removeSelf();
    };
    return DashLine;
}(laya.display.Sprite));
var ToolTag = (function (_super) {
    __extends(ToolTag, _super);
    function ToolTag(id) {
        _super.call(this);
        this._select = false;
        this._id = id;
        this._name = Tool[id].name;
        this.loadImage(Assets.Img['tooltag_' + Tool[id].tag]);
        this.size(72, 34);
        this._text = new LayaText();
        this._text.text = this._name;
        this._text.align = 'right';
        this._text.valign = 'middle';
        this._text.size(68, 34);
        this._text.font = '幼圆';
        this._text.fontSize = 20;
        this.addChild(this._text);
    }
    Object.defineProperty(ToolTag.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolTag.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    ToolTag.prototype.isSelect = function () {
        if (this._select)
            return true;
        else
            return false;
    };
    ToolTag.prototype.select = function () {
        if (this._select)
            return;
        this._select = true;
        Tween.clearAll(this);
        Tween.to(this, { x: -8 }, 200, Ease.backInOut);
    };
    ToolTag.prototype.unselect = function () {
        if (!this._select)
            return;
        this._select = false;
        Tween.clearAll(this);
        Tween.to(this, { x: -52 }, 200, Ease.backInOut);
    };
    ToolTag.prototype.useTag = function (nextTag) {
        this._select = false;
        this.alpha = 0;
        this.changeTag(nextTag);
        this.x = -72;
        this.alpha = 1;
        Tween.to(this, { x: -52 }, 300, Ease.backInOut);
    };
    ToolTag.prototype.changeTag = function (id) {
        this._id = id;
        this._name = Tool[id].name;
        this.loadImage(Assets.Img['tooltag_' + Tool[id].tag]);
        this._text.text = this._name;
    };
    return ToolTag;
}(laya.display.Sprite));
var ToolTagContainer = (function (_super) {
    __extends(ToolTagContainer, _super);
    function ToolTagContainer() {
        _super.call(this);
        this._tagList = [];
        this._tagIds = ['IceBullet', 'DivisionBullet', 'SmokeBullet', 'BombBullet'];
        this._nextTagIds = [];
        this._lock = false;
        var tag0 = new ToolTag('StandardBullet');
        var tag1 = new ToolTag('IceBullet');
        var tag2 = new ToolTag('DivisionBullet');
        this._tagList.push(tag0);
        this._tagList.push(tag1);
        this._tagList.push(tag2);
        tag0.pos(-52, 0);
        tag1.pos(-52, 47);
        tag2.pos(-52, 94);
        tag0.select();
        this._selectIndex = 0;
        this._nextTagIds = this.getHiddenTagIds();
        this.zOrder = DisplayOrder.ToolContainer;
        this.repos();
        this.addChildren(tag0, tag1, tag2);
        Laya.stage.addChild(this);
    }
    Object.defineProperty(ToolTagContainer.prototype, "tagList", {
        get: function () {
            return this._tagList;
        },
        enumerable: true,
        configurable: true
    });
    ToolTagContainer.prototype.isLock = function () {
        return this._lock;
    };
    ToolTagContainer.prototype.lock = function () {
        this._lock = true;
    };
    ToolTagContainer.prototype.unlock = function () {
        this._lock = false;
    };
    ToolTagContainer.prototype.isSelectFirst = function () {
        return this._selectIndex === 0;
    };
    ToolTagContainer.prototype.getSelectedToolId = function () {
        return this._tagList[this._selectIndex].id;
    };
    ToolTagContainer.prototype.getHiddenTagIds = function () {
        var tags = this._tagIds.slice(0, this._tagIds.length);
        for (var _i = 0, _a = this._tagList; _i < _a.length; _i++) {
            var t = _a[_i];
            if (tags.indexOf(t.id) >= 0) {
                tags.splice(tags.indexOf(t.id), 1);
            }
        }
        return tags;
    };
    ToolTagContainer.prototype.useSelectTag = function () {
        this.unlock();
        if (this._selectIndex === 0)
            return;
        var tag = this._tagList[this._selectIndex];
        var nextTag;
        this._nextTagIds.push(tag.id);
        this._selectIndex = 0;
        this._tagList[this._selectIndex].select();
        nextTag = this._nextTagIds.shift();
        tag.useTag(nextTag);
    };
    ToolTagContainer.prototype.selectTag = function (num) {
        if (this._selectIndex === num)
            return;
        this._tagList[this._selectIndex].unselect();
        this._tagList[num].select();
        this._selectIndex = num;
    };
    ToolTagContainer.prototype.selectNext = function () {
        var index;
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        this._tagList[this._selectIndex].unselect();
        index = this._selectIndex + 1;
        if (index === this._tagList.length)
            index = 0;
        this._tagList[index].select();
        this._selectIndex = index;
    };
    ToolTagContainer.prototype.selectPrevious = function () {
        var index;
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        this._tagList[this._selectIndex].unselect();
        index = this._selectIndex - 1;
        if (index < 0)
            index = this._tagList.length - 1;
        this._tagList[index].select();
        this._selectIndex = index;
    };
    ToolTagContainer.prototype.select = function (index) {
        for (var _i = 0, _a = this._tagList; _i < _a.length; _i++) {
            var t = _a[_i];
            t.unselect();
        }
        this._tagList[index].select();
        this._selectIndex = index;
    };
    ToolTagContainer.prototype.repos = function () {
        if (Laya.stage.width >= 1280) {
            this.pos(global.leftEdge - 348, 336);
        }
        else {
            this.pos(0, 336);
        }
    };
    ToolTagContainer.prototype.remove = function () {
        this.removeChildren();
        this.removeSelf();
    };
    return ToolTagContainer;
}(laya.display.Sprite));
var BtnSwitch = (function (_super) {
    __extends(BtnSwitch, _super);
    function BtnSwitch() {
        _super.call(this);
        this._funcLock = false;
        this.loadImage(Assets.Img.btn_switch_bg);
        this.repos();
        this.size(80, 210);
        this.zOrder = DisplayOrder.BtnSwitch;
        this._centerBtn = new Sprite();
        this._centerBtn.loadImage(Assets.Img.btn_switch_center);
        this._centerBtn.size(50, 50);
        this._centerBtn.pivot(25, 25);
        this._centerBtn.pos(40, this.height / 2);
        this.on(LayaEvent.MOUSE_DOWN, this, this.onMouseDown);
        this.addChild(this._centerBtn);
        Laya.stage.addChild(this);
    }
    BtnSwitch.prototype.onMouseDown = function (e) {
        Tween.clearAll(this._centerBtn);
        Laya.stage.on(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(LayaEvent.MOUSE_OUT, this, this.onMouseUp);
    };
    BtnSwitch.prototype.onMouseUp = function (e) {
        Laya.stage.off(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.off(LayaEvent.MOUSE_OUT, this, this.onMouseUp);
        this._funcLock = false;
        Tween.to(this._centerBtn, { x: 40, y: this.height / 2 }, 500, Ease.circOut);
    };
    BtnSwitch.prototype.onMouseMove = function (e) {
        var mouse, length, bpos, cpos, limitLength;
        mouse = Utils.p(Laya.stage.mouseX, Laya.stage.mouseY);
        cpos = Utils.p(this.width / 2, this.height / 2);
        bpos = Utils.p(mouse.x - this.x, mouse.y - this.y);
        length = Utils.pLength(bpos, cpos);
        limitLength = this.height / 2 - this._centerBtn.height / 2;
        if (length >= limitLength) {
            if (this._funcLock === false) {
                if (bpos.y > cpos.y) {
                    Game.Instance.toolTagContainer.selectNext();
                    SoundManager.playSound(Assets.Sound.button_001);
                }
                else if (bpos.y < cpos.y) {
                    Game.Instance.toolTagContainer.selectPrevious();
                    SoundManager.playSound(Assets.Sound.button_001);
                }
                this._funcLock = true;
            }
            if (bpos.y > cpos.y) {
                this._centerBtn.y = this.height - this._centerBtn.height / 2;
            }
            else {
                this._centerBtn.y = this._centerBtn.height / 2;
            }
            return;
        }
        this._centerBtn.y = bpos.y;
    };
    BtnSwitch.prototype.beMouseUp = function () {
        this.onMouseUp();
    };
    BtnSwitch.prototype.repos = function () {
        if (Laya.stage.width >= 1280) {
            this.pos(global.leftEdge - 400, 500);
        }
        else {
            this.pos(0, 500);
        }
    };
    BtnSwitch.prototype.remove = function () {
        this.removeSelf();
    };
    return BtnSwitch;
}(laya.display.Sprite));
var Game = (function () {
    function Game() {
        this.keyframe = 0;
        this.curframe = 0;
        this._status = -1;
        this._updateList = [];
        this.ballDirections = [];
        this.ballDirectionFactor = 0;
    }
    Object.defineProperty(Game, "Instance", {
        get: function () {
            if (Game.instance == null) {
                Game.instance = new Game();
            }
            return Game.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "ball", {
        get: function () {
            return this._ball;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "bulletProcess", {
        get: function () {
            return this._bulletProcess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "timer", {
        get: function () {
            return this._timer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            this._status = status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "counter", {
        get: function () {
            return this._counter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "toolTagContainer", {
        get: function () {
            return this._toolTagContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "btnSwitch", {
        get: function () {
            return this._btnSwitch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "updateList", {
        get: function () {
            return this._updateList;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.getBallDirection = function () {
        if (!this.ballDirections.length)
            return;
        var direction = this.ballDirections.shift();
        this.ballDirections.push(direction);
        return direction;
    };
    Game.prototype.getCounter = function (func) {
        this._counter = new CountDown(3, func);
        return this._counter;
    };
    Game.prototype.initScene = function () {
        this.initBG();
        this.initRole();
        this.initUI();
    };
    Game.prototype.startLoop = function () {
        this._updateList.splice(0, 180);
        Laya.timer.frameLoop(1, this, this.update);
    };
    Game.prototype.initBG = function () {
        var gamePage = Main.Instance.gamePage;
        this._gameBg = new Sprite();
        this._gameBg.loadImage(Assets.Img.gamebg);
        this._gameBg.pivot(640, 400);
        this._gameBg.pos(config.gameWidth / 2, config.gameHeight / 2);
        gamePage.addChild(this._gameBg);
    };
    Game.prototype.initRole = function () {
        var gamePage = Main.Instance.gamePage;
        this._myCannon = new Cannon(false);
        this._yourCannon = new Cannon(true);
        gamePage.addChild(this._myCannon);
        gamePage.addChild(this._yourCannon);
    };
    Game.prototype.initUI = function () {
        ScoreManager.Instance.initScore();
        this._bulletProcess = new BulletProcess();
        this._pprocess = new PProcess();
        this._timer = new Timer();
        this._toolTagContainer = new ToolTagContainer();
        this._btnSwitch = new BtnSwitch();
        this._dashLine = new DashLine(this._myCannon.x, this._myCannon.y);
        Main.Instance.gamePage.addChild(this._dashLine);
    };
    Game.prototype.initBall = function (direction) {
        var gamePage = Main.Instance.gamePage;
        this._ball = new Ball(direction);
        gamePage.addChild(this._ball);
    };
    Game.prototype.initControl = function () {
        this._gameBg.on(LayaEvent.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(LayaEvent.KEY_PRESS, this, this.onKeyPress);
    };
    Game.prototype.stopControl = function () {
        this._gameBg.off(LayaEvent.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.off(LayaEvent.KEY_PRESS, this, this.onKeyPress);
    };
    Game.prototype.onKeyPress = function (e) {
        var toolTagContainer = Game.Instance.toolTagContainer;
        switch (e.keyCode) {
            case 49:
                toolTagContainer.selectTag(0);
                break;
            case 50:
                toolTagContainer.selectTag(1);
                break;
            case 51:
                toolTagContainer.selectTag(2);
                break;
        }
    };
    Game.prototype.onMouseDown = function (e) {
        this._gameBg.on(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        this._gameBg.on(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        this._gameBg.on(LayaEvent.MOUSE_OUT, this, this.onMouseUp);
        this._pprocess.start();
        var mouse = Utils.p(Laya.stage.mouseX - global.leftEdge, Laya.stage.mouseY);
        var vector = Utils.p(mouse.x - this._myCannon.x, mouse.y - this._myCannon.y);
        var angle = -1 * Math.atan(vector.x / vector.y) * 180 / Math.PI;
        this._dashLine.drawAssistLine(mouse);
        this._myCannon.setAngle(angle);
    };
    Game.prototype.onMouseUp = function (e) {
        var toolTagContainer = Game.Instance.toolTagContainer;
        this._gameBg.off(LayaEvent.MOUSE_MOVE, this, this.onMouseMove);
        this._gameBg.off(LayaEvent.MOUSE_UP, this, this.onMouseUp);
        this._gameBg.off(LayaEvent.MOUSE_OUT, this, this.onMouseUp);
        this._dashLine.clearLines();
        if (this._status !== 0 && !toolTagContainer.isLock() && this.bulletProcess.costOne(this._pprocess.percent * 2 + (toolTagContainer.isSelectFirst() ? 0 : 0.4))) {
            var ctrlData = {
                angle: this._myCannon.getAngle(),
                power: this._pprocess.percent,
                bulletType: toolTagContainer.getSelectedToolId()
            };
            toolTagContainer.lock();
            Socket.Instance.sendCtrl(ctrlData);
        }
        this._pprocess.stop();
    };
    Game.prototype.onMouseMove = function (e) {
        var mouse = Utils.p(Laya.stage.mouseX - global.leftEdge, Laya.stage.mouseY);
        var vector = Utils.p(mouse.x - this._myCannon.x, mouse.y - this._myCannon.y);
        var angle = -1 * Math.atan(vector.x / vector.y) * 180 / Math.PI;
        this._dashLine.drawAssistLine(mouse);
        this._myCannon.setAngle(angle);
    };
    Game.prototype.update = function () {
        this.checkUpdateList();
    };
    Game.prototype.checkUpdateList = function () {
        var l = this._updateList.length;
        if (l > 0 && l < 10) {
            var data = this._updateList.splice(0, 1)[0];
            this.runFramePack(data);
            this.runFrameLogic();
        }
        else if (l >= 10) {
            var dlength = l < 100 ? 2 : Math.ceil(l / 50);
            var data = this._updateList.splice(0, dlength);
            for (var i = 0; i < data.length; i++) {
                this.runFramePack(data[i]);
                this.runFrameLogic();
            }
        }
        else {
            return;
        }
    };
    Game.prototype.runFrameLogic = function () {
        if (global.syn === 0) {
            for (var _i = 0, _a = Bullet.myBullets; _i < _a.length; _i++) {
                var bA = _a[_i];
                bA.update();
            }
            for (var _b = 0, _c = Bullet.yourBullets; _b < _c.length; _b++) {
                var bB = _c[_b];
                bB.update();
            }
        }
        else if (global.syn === 1) {
            for (var _d = 0, _e = Bullet.yourBullets; _d < _e.length; _d++) {
                var bB = _e[_d];
                bB.update();
            }
            for (var _f = 0, _g = Bullet.myBullets; _f < _g.length; _f++) {
                var bA = _g[_f];
                bA.update();
            }
        }
        this._ball.update();
        this._bulletProcess.update();
        this._pprocess.update();
        this._timer.update();
    };
    Game.prototype.runFramePack = function (data) {
        var uid = Socket.Instance.getUid();
        var role;
        for (var _i = 0, _a = data.ctrls; _i < _a.length; _i++) {
            var c = _a[_i];
            role = c.id === uid ? 'myrole' : 'yourrole';
            this.playData(role, c.ctrl);
        }
        this.curframe = data.keyframe;
    };
    Game.prototype.pushUpdateData = function (data) {
        this._updateList.push(data);
    };
    Game.prototype.clearUpdateList = function () {
        if (this._updateList.length > 0)
            this._updateList = [];
    };
    Game.prototype.playData = function (role, ctrl) {
        var toolTagContainer = Game.Instance.toolTagContainer;
        if (this._status === 0)
            return;
        if (role === 'myrole') {
            this._myCannon.shoot(ctrl.angle, ctrl.power, ctrl.bulletType);
            toolTagContainer.useSelectTag();
        }
        else if (role === 'yourrole') {
            this._yourCannon.shoot(ctrl.angle, ctrl.power, ctrl.bulletType);
        }
    };
    Game.prototype.gameOver = function () {
        if (this._status === -1)
            return;
        Laya.timer.clearAll(this);
        Bullet.boomAllBullets();
        Game.Instance.timer.clearTaskList();
        ScoreManager.Instance.mballs = 0;
        ScoreManager.Instance.yballs = 0;
        this.status = 0;
        this.clearObjects();
        this.stopControl();
        if (this.counter)
            this.counter.stop();
    };
    Game.prototype.clearObjects = function () {
        if (this._updateList)
            this._updateList = [];
        if (this._bulletProcess)
            this._bulletProcess.remove();
        if (this._timer)
            this._timer.remove();
        if (this._ball)
            this._ball.removeSelf();
        if (this._myCannon)
            this._myCannon.remove();
        if (this._yourCannon)
            this._yourCannon.remove();
        if (this._pprocess)
            this._pprocess.remove();
        if (this._toolTagContainer)
            this._toolTagContainer.remove();
        if (this._btnSwitch)
            this._btnSwitch.remove();
        if (this._dashLine)
            this._dashLine.remove();
        ScoreManager.Instance.removeScorePanel();
    };
    return Game;
}());
var global = {
    leftEdge: 0,
    rightEdge: 0,
    syn: 0
};
var DisplayName = {
    StartPage: 'startpage',
    GamePage: 'gamepage',
    Loading: 'loading'
};
var DisplayOrder = {
    Background: 0,
    StartPage: 1,
    GamePage: 2,
    Background_H: 3,
    Loading: 5,
    AssistLine: 10,
    Shadow: 15,
    Bullet: 16,
    BulletBoom: 18,
    Ball: 20,
    Smoke: 21,
    Cannon: 22,
    BtnSwitch: 25,
    ToolContainer: 26,
    PProcess: 27,
    ProcessBar: 28,
    Timer: 29,
    ResultPage: 30,
    CountText: 31,
    ScorePanel: 32,
    Msg: 35
};
var Tool = {
    StandardBullet: {
        tag: 'bullet',
        name: '子弹'
    },
    IceBullet: {
        tag: 'ice',
        name: '冰弹'
    },
    DivisionBullet: {
        tag: 'division',
        name: '分裂弹'
    },
    SmokeBullet: {
        tag: 'smoke',
        name: '烟雾弹'
    },
    BombBullet: {
        tag: 'bomb',
        name: '炸弹'
    }
};
var Assets = {
    Img: {
        gamebg: 'res/gamebg.png',
        cannon_m: 'res/cannon_m.png',
        cannon_y: 'res/cannon_y.png',
        cannon_shadow: 'res/cannon_shadow.png',
        bulletm: 'res/bullet_m.png',
        bullety: 'res/bullet_y.png',
        bullet_ice: 'res/bullet_ice.png',
        bullet_division: 'res/bullet_division.png',
        bullet_bomb: 'res/bullet_bomb.png',
        bullet_smoke: 'res/bullet_smoke.png',
        ball: 'res/ball.png',
        process: 'res/process.png',
        processBg: 'res/processbg.png',
        startBg: 'res/startbg.png',
        msgBg: 'res/msgbg.png',
        scoreBg: 'res/scorebg.png',
        timerBg: 'res/timerbg.png',
        pprocess: 'res/pprocess.png',
        pprocessbg: 'res/pprocessbg.png',
        tooltag_ice: 'res/tooltag_ice.png',
        tooltag_division: 'res/tooltag_division.png',
        tooltag_smoke: 'res/tooltag_smoke.png',
        tooltag_bullet: 'res/tooltag_bullet.png',
        tooltag_bomb: 'res/tooltag_bomb.png',
        btn_switch_bg: 'res/btn_switch_bg.png',
        btn_switch_center: 'res/btn_switch_center.png',
        ball_effect_ice: 'res/ice.png'
    },
    Json: {
        start_json: 'res/start.json',
        result_json: 'res/ResultPage.json',
        blue_boom: 'res/blueboom.json',
        red_boom: 'res/redboom.json',
        green_boom: 'res/greenboom.json',
        boom: 'res/boom.json',
        smoke: 'res/smoke.json'
    },
    Sound: {
        hit_001: 'res/sounds/hit001.mp3',
        hit_002: 'res/sounds/hit002.mp3',
        boom_001: 'res/sounds/boom001.mp3',
        boom_002: 'res/sounds/boom002.mp3',
        boom_003: 'res/sounds/boom003.mp3',
        button_001: 'res/sounds/button001.mp3',
        shoot: 'res/sounds/shoot.mp3',
        smoke: 'res/sounds/smoke.mp3',
        frozen: 'res/sounds/frozen.mp3',
        findmatch: 'res/sounds/findmatch.mp3',
        counter: 'res/sounds/counter.mp3',
        gamestart: 'res/sounds/gamestart.mp3',
        gamewin: 'res/sounds/gamewin.mp3',
        gameover: 'res/sounds/gameover.mp3',
        mscore: 'res/sounds/mscore.mp3',
        yscore: 'res/sounds/yscore.mp3'
    },
    font: {
        num: 'res/numfont.fnt'
    }
};
var CountDown = (function (_super) {
    __extends(CountDown, _super);
    function CountDown(num, cb) {
        _super.call(this);
        this.font = 'diyfont';
        this.text = num.toString();
        this.pivot(this.width / 2, this.height / 2);
        this.pos(config.gameWidth / 2, config.gameHeight / 2 - 10);
        this.zOrder = DisplayOrder.CountText;
        this.animateCount(3, cb);
        SoundManager.playSound(Assets.Sound.counter, 0);
    }
    CountDown.prototype.animateCount = function (num, cb) {
        var _this = this;
        Laya.timer.once(1000, this, function () {
            num--;
            _this.text = num.toString();
            if (num <= 0) {
                _this.remove();
                cb.call(_this);
                SoundManager.stopSound(Assets.Sound.counter);
                SoundManager.playSound(Assets.Sound.gamestart);
                return;
            }
            _this.animateCount(num, cb);
        });
    };
    CountDown.prototype.stop = function () {
        Laya.timer.clearAll(this);
    };
    CountDown.prototype.remove = function () {
        this.stop();
        this.removeSelf();
    };
    return CountDown;
}(laya.display.Text));
var Socket = (function () {
    function Socket() {
        this.uid = '';
        this._mName = '';
        this._yName = '';
        this._active = true;
        this._socket = io.connect(config.socketServer);
    }
    Object.defineProperty(Socket, "Instance", {
        get: function () {
            if (Socket.instance == null) {
                Socket.instance = new Socket();
            }
            return Socket.instance;
        },
        enumerable: true,
        configurable: true
    });
    Socket.prototype.getUid = function () {
        return this.uid;
    };
    Object.defineProperty(Socket.prototype, "mName", {
        get: function () {
            return this._mName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Socket.prototype, "yName", {
        get: function () {
            return this._yName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Socket.prototype, "socket", {
        get: function () {
            return this._socket;
        },
        enumerable: true,
        configurable: true
    });
    Socket.prototype.getCurrentGame = function () {
        return this.game;
    };
    Socket.prototype.initListen = function () {
        var _this = this;
        this._socket.on('disconnect', function () {
            Game.Instance.gameOver();
            MsgManager.Instance.showMessage('与服务器断开连接', 30);
            _this._active = false;
            console.log('client disconnect');
        });
        this._socket.on('connect_error', function (error) {
            if (_this._active) {
                MsgManager.Instance.showMessage('连接服务器失败', 30);
                _this._active = false;
                console.log(error);
            }
        });
        this._socket.on('user:loginSuccess', function (data) {
            _this.uid = data.uid;
            _this._mName = data.username;
            console.log('login success');
        });
        this._socket.on('room:created', function (data) {
            console.log('create room success');
            _this.game = Game.Instance;
            global.syn = data.ballDirection;
            _this._yName = data.opponent;
            MsgManager.Instance.setText('找到比赛');
            SoundManager.playSound(Assets.Sound.findmatch);
            _this.game.clearUpdateList();
            Laya.timer.once(2000, _this, function () {
                _this.getReady();
            });
        });
        this._socket.on('frame:update', function (update) {
            _this.game.pushUpdateData(update);
        });
        this._socket.on('game:start', function (data) {
            MsgManager.Instance.removeMessage(function () {
                _this.game.initScene();
                _this.game.ballDirections = data.directions;
                _this.game.ballDirectionFactor = data.id === _this.uid ? 1 : 0;
                var direction = _this.game.getBallDirection();
                _this.game.initBall(_this.game.ballDirectionFactor ? direction : 1 - direction);
                Main.Instance.removeBackground();
                Main.Instance.gamePage.addChild(Game.Instance.getCounter(function () {
                    _this.game.status = 1;
                    _this.game.initControl();
                    _this.game.startLoop();
                }));
            });
        });
        this._socket.on('game:scorein', function (data) {
            var scores = data.scores;
            if (data.id === _this.uid) {
                ScoreManager.Instance.setScores('mine', { explosions: scores.explosions, balls: scores.balls, score: scores.score });
            }
            else {
                ScoreManager.Instance.setScores('your', { explosions: scores.explosions, balls: scores.balls, score: scores.score });
            }
        });
        this._socket.on('game:scores', function (data) {
            if (data.msg) {
                Game.Instance.gameOver();
                MsgManager.Instance.showMessage(data.msg, 28, function () {
                    Laya.timer.once(800, _this, function () {
                        MsgManager.Instance.removeMessage();
                        ScoreManager.Instance.showGameResult(data);
                    });
                });
                console.log('opponent leave room.');
            }
            else {
                Game.Instance.gameOver();
                if (Game.Instance.timer.isTimeout()) {
                    MsgManager.Instance.showMessage('时间到，比赛结束', 30, function () {
                        Laya.timer.once(1000, _this, function () {
                            MsgManager.Instance.removeMessage(function () {
                                ScoreManager.Instance.showGameResult(data);
                            });
                        });
                    });
                }
                else
                    ScoreManager.Instance.showGameResult(data);
            }
        });
        this._socket.on('game:error', function (data) {
            console.log(data.msg);
        });
        this._socket.on('sys:msg', function (data) {
            console.log('system message: ' + data.msg);
        });
        this._socket.on('connect_timeout', function () {
            console.log('connect timeout');
        });
        this._socket.on('reconnect', function () {
            console.log('client reconnect');
        });
        this._socket.on('connect', function () {
            console.log('client connected');
        });
    };
    Socket.prototype.login = function (name) {
        this._socket.emit('user:login', { name: name });
    };
    Socket.prototype.match = function () {
        this._socket.emit('room:match');
    };
    Socket.prototype.getReady = function () {
        this._socket.emit('user:ready');
    };
    Socket.prototype.sendCtrl = function (ctrlData) {
        this._socket.emit('user:ctrl', { id: this.uid, ctrl: ctrlData });
    };
    Socket.prototype.causeExplosion = function () {
        this._socket.emit('game:scorein', { id: this.uid, type: 'bulletExplosion' });
    };
    Socket.prototype.ballIn = function () {
        this._socket.emit('game:scorein', { id: this.uid, type: 'ballin' });
    };
    Socket.prototype.leaveRoom = function () {
        this._socket.emit('room:leave');
    };
    return Socket;
}());
var StartPage = (function (_super) {
    __extends(StartPage, _super);
    function StartPage() {
        _super.call(this);
        this.name = DisplayName.StartPage;
        this.zOrder = DisplayOrder.StartPage;
        this.pos(global.leftEdge, 0);
        this.btnMatch.on(LayaEvent.CLICK, this, this.onBtnMatch);
        this.btnJoinRoom.on(LayaEvent.CLICK, this, this.onBtnJoinRoom);
        this.btnCreateRoom.on(LayaEvent.CLICK, this, this.onBtnCreateRoom);
    }
    StartPage.prototype.onBtnMatch = function () {
        var _this = this;
        SoundManager.playSound(Assets.Sound.button_001);
        Tween.to(this, { alpha: 0 }, 200, null, Handler.create(this, function () {
            _this.remove();
            _this.alpha = 1;
            MsgManager.Instance.showMessage('寻找比赛中');
            MsgManager.Instance.showTips('胜利条件\n(1).进球数达到10个\n(2).最终分数更高');
            Socket.Instance.match();
        }));
    };
    StartPage.prototype.onBtnJoinRoom = function () {
        SoundManager.playSound(Assets.Sound.button_001);
        alert('房间功能尚未上线');
    };
    StartPage.prototype.onBtnCreateRoom = function () {
        SoundManager.playSound(Assets.Sound.button_001);
        alert('房间功能尚未上线');
    };
    StartPage.prototype.remove = function () {
        this.removeSelf();
    };
    StartPage.prototype.disableBtn = function () {
        this.btnMatch.offAll();
    };
    return StartPage;
}(ui.startUI));
var Utils;
(function (Utils) {
    function showLoading() {
        var text = new LayaText();
        text.name = DisplayName.Loading;
        text.color = "#FFFFFF";
        text.font = "Impact";
        text.fontSize = 50;
        text.text = "finding match......";
        text.x = Laya.stage.width / 2 - text.width / 2;
        text.y = Laya.stage.height / 2 - text.height / 2;
        Laya.stage.addChild(text);
    }
    Utils.showLoading = showLoading;
    function isRectangleCollision(objectA, objectB) {
        var xDis = Math.abs(objectA.x - objectB.x);
        var yDis = Math.abs(objectA.y - objectB.y);
        if (xDis <= (objectA.width + objectB.width) / 2 &&
            yDis <= (objectA.height + objectB.height) / 2) {
            return true;
        }
        return false;
    }
    Utils.isRectangleCollision = isRectangleCollision;
    function isCircleCollision(circleA, circleB) {
        var rc = Math.sqrt(Math.pow(circleA.x - circleB.x, 2) + Math.pow(circleA.y - circleB.y, 2));
        if (rc <= (circleA.radius + circleB.radius)) {
            return true;
        }
        return false;
    }
    Utils.isCircleCollision = isCircleCollision;
    function compBallRebound(posA, posB, vA, vB, convert) {
        if (convert === void 0) { convert = false; }
        if (convert) {
            posA.x = Utils.floatN(config.gameWidth - posA.x);
            posA.y = Utils.floatN(config.gameHeight - posA.y);
            posB.x = Utils.floatN(config.gameWidth - posB.x);
            posB.y = Utils.floatN(config.gameHeight - posB.y);
            vA.vx *= -1;
            vA.vy *= -1;
            vB.vx *= -1;
            vB.vy *= -1;
        }
        var rc = Utils.pLength(posA, posB);
        var ax = rc === 0 ? 0 : ((vA.vx - vB.vx) * Math.pow((posA.x - posB.x), 2) + (vA.vy - vB.vy) * (posA.x - posB.x) * (posA.y - posB.y)) / Math.pow(rc, 2);
        var ay = rc === 0 ? 0 : ((vA.vy - vB.vy) * Math.pow((posA.y - posB.y), 2) + (vA.vx - vB.vx) * (posA.x - posB.x) * (posA.y - posB.y)) / Math.pow(rc, 2);
        var vAx = Utils.floatN(vA.vx - ax), vAy = Utils.floatN(vA.vy - ay), vBx = Utils.floatN(vB.vx + ax), vBy = Utils.floatN(vB.vy + ay);
        if (convert) {
            vAx *= -1;
            vAy *= -1;
            vBx *= -1;
            vBy *= -1;
        }
        return [vAx, vAy, vBx, vBy];
    }
    Utils.compBallRebound = compBallRebound;
    function fixCollision(posA, posB, rA, rB, convert) {
        if (convert === void 0) { convert = false; }
        if (convert) {
            posA.x = Utils.floatN(config.gameWidth - posA.x);
            posA.y = Utils.floatN(config.gameHeight - posA.y);
            posB.x = Utils.floatN(config.gameWidth - posB.x);
            posB.y = Utils.floatN(config.gameHeight - posB.y);
        }
        var rc = Utils.pLength(posA, posB);
        var length = (rA + rB - rc) / 2;
        var cx = rc === 0 ? 0 : length * (posA.x - posB.x) / rc;
        var cy = rc === 0 ? 0 : length * (posA.y - posB.y) / rc;
        var ax = Utils.floatN(posA.x + cx);
        var ay = Utils.floatN(posA.y + cy);
        var bx = Utils.floatN(posB.x - cx);
        var by = Utils.floatN(posB.y - cy);
        if (convert) {
            ax = Utils.floatN(config.gameWidth - ax);
            ay = Utils.floatN(config.gameHeight - ay);
            bx = Utils.floatN(config.gameWidth - bx);
            by = Utils.floatN(config.gameHeight - by);
        }
        return [ax, ay, bx, by];
    }
    Utils.fixCollision = fixCollision;
    function standardAngle(angle) {
        var offset, res;
        if (angle > 180) {
            offset = Math.floor((angle + 180) / 360) * 360;
            res = angle - offset;
        }
        else if (angle < -180) {
            offset = Math.floor((180 - angle) / 360) * 360;
            res = angle + offset;
        }
        else {
            res = angle;
        }
        return res;
    }
    Utils.standardAngle = standardAngle;
    function distanceToLine(pointx, pointy, linex, liney, vx, vy) {
        var A, B, C;
        A = vy;
        B = vx * -1;
        C = liney * vx - linex * vy;
        var s = Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2));
        var g = pointx * A + pointy * B + C;
        return Math.round(Math.abs(g / s));
    }
    Utils.distanceToLine = distanceToLine;
    function posToLine(pointx, pointy, linex, liney, vx, vy) {
        var A, B, C, pos;
        A = vy;
        B = vx * -1;
        C = liney * vx - linex * vy;
        pos = A * pointx + B * pointy + C;
        if (pos < 0)
            return 1;
        else if (pos > 0)
            return -1;
        else
            return 0;
    }
    Utils.posToLine = posToLine;
    function p(x, y) {
        return { x: x, y: y };
    }
    Utils.p = p;
    function floatN(input, fNum) {
        if (fNum === void 0) { fNum = 6; }
        var temp = 1;
        for (var i = 0; i < fNum; i++) {
            temp *= 10;
        }
        return Math.round(input * temp) / temp;
    }
    Utils.floatN = floatN;
    function toInt(input) {
        return parseInt(input + '');
    }
    Utils.toInt = toInt;
    function pLength(p1, p2) {
        return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
    }
    Utils.pLength = pLength;
    function crossingPointLC(point1, center, radius) {
        var p, w, a, b, c, x1, y1, x2, y2;
        w = (point1.y - center.y) / (point1.x - center.x);
        p = Math.pow(w, 2);
        a = p + 1;
        b = -2 * center.x * a;
        c = Math.pow(center.x, 2) * a - Math.pow(radius, 2);
        x1 = (-1 * b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        x2 = (-1 * b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        y1 = w * x1 - w * center.x + center.y;
        y2 = w * x2 - w * center.x + center.y;
        if (point1.x === center.x) {
            x1 = center.x;
            x2 = center.x;
            y1 = center.y + radius;
            y2 = center.y - radius;
        }
        if (Math.abs(point1.x - x1) < Math.abs(point1.x - x2) ||
            Math.abs(point1.y - y1) < Math.abs(point1.y - y2))
            return Utils.p(x1, y1);
        else
            return Utils.p(x2, y2);
    }
    Utils.crossingPointLC = crossingPointLC;
})(Utils || (Utils = {}));
var Animation = laya.display.Animation;
var Rectangle = laya.maths.Rectangle;
var BitmapFont = laya.display.BitmapFont;
var Tween = laya.utils.Tween;
var Ease = laya.utils.Ease;
var WebGL = laya.webgl.WebGL;
var Sprite = laya.display.Sprite;
var Handler = laya.utils.Handler;
var Loader = laya.net.Loader;
var Texture = laya.resource.Texture;
var LayaText = laya.display.Text;
var LayaEvent = laya.events.Event;
var Pool = laya.utils.Pool;
var ColorFilter = Laya.ColorFilter;
var SoundManager = Laya.SoundManager;
var Main = (function () {
    function Main() {
        this.assets = [];
        var assetsKeys = Object.keys(Assets.Img);
        var jsonKeys = Object.keys(Assets.Json);
        var soundKeys = Object.keys(Assets.Sound);
        for (var j = 0; j < soundKeys.length; j++) {
            this.assets.push({ url: Assets.Sound[soundKeys[j]], type: Loader.SOUND });
        }
        for (var i = 0; i < assetsKeys.length; i++) {
            this.assets.push({ url: Assets.Img[assetsKeys[i]], type: Loader.IMAGE });
        }
        for (var j = 0; j < jsonKeys.length; j++) {
            this.assets.push({ url: Assets.Json[jsonKeys[j]], type: Loader.ATLAS });
        }
        this.initLaya();
        this._loading = new Loading();
        Laya.stage.on(LayaEvent.RESIZE, this, this.onStageResize);
        Laya.loader.load(this.assets, Handler.create(this, this.onLoaded), Handler.create(this, this.onLoading, null, false), Loader.TEXT);
    }
    Object.defineProperty(Main, "Instance", {
        get: function () {
            if (Main.instance == null) {
                Main.instance = new Main();
            }
            return Main.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "gamePage", {
        get: function () {
            return this._gamePage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "startPage", {
        get: function () {
            return this._startPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "bg", {
        get: function () {
            return this._bg;
        },
        enumerable: true,
        configurable: true
    });
    Main.prototype.onLoaded = function () {
        var _this = this;
        this._loading.hide();
        this.initSocket();
        this._bitmapfont = new BitmapFont();
        this._bitmapfont.loadFont(Assets.font.num, Handler.create(this, function () {
            LayaText.registerBitmapFont('diyfont', _this._bitmapfont);
        }));
        this._gamePage = new Sprite();
        this._gamePage.name = DisplayName.GamePage;
        this._gamePage.zOrder = DisplayOrder.GamePage;
        this._gamePage.pivot(config.gameWidth / 2, config.gameHeight / 2);
        this._gamePage.pos(global.leftEdge + config.gameWidth / 2, config.gameHeight / 2);
        this._startPage = new StartPage();
        this.showBackground();
        global.leftEdge = (Laya.stage.width - config.gameWidth) / 2;
        global.rightEdge = (Laya.stage.width + config.gameWidth) / 2;
        Laya.stage.addChild(this._gamePage);
        Laya.stage.addChild(this._startPage);
    };
    Main.prototype.onLoading = function (progress) {
        this._loading.setProcess(progress);
    };
    Main.prototype.showBackground = function () {
        this._bg = new Sprite();
        this._bg.loadImage(Assets.Img.startBg);
        this._bg.pivot(640, 400);
        this._bg.zOrder = DisplayOrder.Background;
        this._bg.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        Laya.stage.addChild(this._bg);
    };
    Main.prototype.removeBackground = function () {
        var _this = this;
        this._bg.zOrder = DisplayOrder.Background_H;
        Tween.to(this._bg, { alpha: 0 }, 1000, null, Handler.create(this, function () {
            Laya.stage.removeChild(_this._bg);
            _this._bg.alpha = 1;
            _this._bg.zOrder = DisplayOrder.Background;
        }));
    };
    Main.prototype.onStageResize = function () {
        global.leftEdge = (Laya.stage.width - config.gameWidth) / 2;
        global.rightEdge = (Laya.stage.width + config.gameWidth) / 2;
        this.repos();
    };
    Main.prototype.initLaya = function () {
        Laya.init(config.gameWidth, config.gameHeight, WebGL);
        Laya.stage.scaleMode = 'fixedheight';
        Laya.stage.alignH = 'center';
        Laya.stage.alignV = 'middle';
        Laya.stage.bgColor = '#000000';
    };
    Main.prototype.initSocket = function () {
        var socket = Socket.Instance;
        socket.initListen();
        socket.login('user' + Math.round(Math.random() * 1000));
    };
    Main.prototype.backToMenu = function () {
        var _this = this;
        MsgManager.Instance.removeMessage();
        ScoreManager.Instance.removeResultView();
        Laya.stage.addChild(this._bg);
        Laya.stage.addChild(this.startPage);
        Tween.to(this.gamePage, { y: -800, alpha: 0 }, 800, null, Handler.create(this, function () {
            _this.gamePage.alpha = 1;
            _this.gamePage.y = config.gameHeight / 2;
            _this.gamePage.removeChildren();
        }));
    };
    Main.prototype.repos = function () {
        var msg = MsgManager.Instance.msg;
        var tipsText = MsgManager.Instance.tipsText;
        var bulletProcess = Game.Instance.bulletProcess;
        var timer = Game.Instance.timer;
        var toolTagContainer = Game.Instance.toolTagContainer;
        var btnSwitch = Game.Instance.btnSwitch;
        var myScorePanel = ScoreManager.Instance.myScorePanel;
        var yourScorePanel = ScoreManager.Instance.yourScorePanel;
        var resultView = ScoreManager.Instance.resultView;
        if (this._startPage)
            this._startPage.pos(global.leftEdge, 0);
        if (this._gamePage)
            this._gamePage.pos(global.leftEdge + config.gameWidth / 2, config.gameHeight / 2);
        if (this._bg)
            this._bg.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        if (msg)
            msg.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        if (tipsText)
            tipsText.pos(Laya.stage.width / 2, Laya.stage.height - 100);
        if (bulletProcess)
            bulletProcess.repos();
        if (timer)
            timer.repos();
        if (toolTagContainer)
            toolTagContainer.repos();
        if (btnSwitch)
            btnSwitch.repos();
        if (myScorePanel)
            myScorePanel.repos();
        if (yourScorePanel)
            yourScorePanel.repos();
        if (resultView)
            resultView.repos();
    };
    return Main;
}());
Main.Instance;
var PProcessAttr = {
    width: 34,
    height: 8
};
var PProcess = (function (_super) {
    __extends(PProcess, _super);
    function PProcess() {
        _super.call(this);
        this._status = 0;
        this.loadImage(Assets.Img.pprocessbg);
        this.size(PProcessAttr.width, PProcessAttr.height);
        this.pivot(PProcessAttr.width / 2, PProcessAttr.height / 2);
        this.zOrder = DisplayOrder.PProcess;
        this.repos();
        this.pmask = new Sprite();
        this.pmask.loadImage(Assets.Img.pprocess);
        this.pmask.size(PProcessAttr.width, PProcessAttr.height);
        this.pmask.pos(-1 * PProcessAttr.width, 0);
        this.process = new Sprite();
        this.process.loadImage(Assets.Img.pprocess);
        this.process.size(PProcessAttr.width, PProcessAttr.height);
        this.process.mask = this.pmask;
        this.percent = 0;
        this.addChild(this.process);
        Main.Instance.gamePage.addChild(this);
    }
    PProcess.prototype.update = function () {
        if (this._status)
            this.runProcess();
    };
    PProcess.prototype.runProcess = function () {
        this.percent += 0.03;
        if (this.percent > 1)
            this.percent = 1;
        this.pmask.pos(-1 * PProcessAttr.width * (1 - this.percent), 0);
    };
    PProcess.prototype.reduceProcess = function () {
        this.percent -= 0.05;
        if (this.percent < 0)
            this.percent = 0;
        this.pmask.pos(-1 * PProcessAttr.width * (1 - this.percent), 0);
    };
    PProcess.prototype.clearProcess = function () {
        this.percent = 0;
        this.pmask.pos(-1 * PProcessAttr.width * (1 - this.percent), 0);
    };
    PProcess.prototype.start = function () {
        this._status = 1;
    };
    PProcess.prototype.stop = function () {
        this._status = 0;
        this.clearProcess();
    };
    PProcess.prototype.repos = function () {
        this.pos(config.gameWidth / 2, config.gameHeight - 10);
    };
    PProcess.prototype.remove = function () {
        this.removeSelf();
    };
    return PProcess;
}(laya.display.Sprite));
var TiledMap;
(function (TiledMap_1) {
    var TiledMap = laya.map.TiledMap;
    var Sprite = laya.display.Sprite;
    var Rectangle = laya.maths.Rectangle;
    var Browser = laya.utils.Browser;
    var Handler = laya.utils.Handler;
    var Point = laya.maths.Point;
    var TiledMapManager = (function () {
        function TiledMapManager() {
            this.mLastMouseX = 0;
            this.mLastMouseY = 0;
            this.mX = 0;
            this.mY = 0;
            this.tiledMap = new TiledMap();
            this.mX = this.mY = 0;
            this.tiledMap.createMap("res/tiledMap/isometric_grass_and_water.json", new Rectangle(0, 0, Laya.stage.width, Laya.stage.height), Handler.create(this, this.mapLoaded), null, new Point(1600, 800));
            Laya.stage.on("click", this, this.onStageClick);
        }
        TiledMapManager.prototype.resize = function () {
            this.tiledMap.changeViewPort(this.mX, this.mY, Browser.width, Browser.height);
        };
        TiledMapManager.prototype.mouseDown = function () {
            this.mLastMouseX = Laya.stage.mouseX;
            this.mLastMouseY = Laya.stage.mouseY;
            Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.mouseMove);
        };
        TiledMapManager.prototype.mouseMove = function () {
            this.tiledMap.moveViewPort(this.mX - (Laya.stage.mouseX - this.mLastMouseX), this.mY - (Laya.stage.mouseY - this.mLastMouseY));
        };
        TiledMapManager.prototype.mouseUp = function () {
            this.mX = this.mX - (Laya.stage.mouseX - this.mLastMouseX);
            this.mY = this.mY - (Laya.stage.mouseY - this.mLastMouseY);
            Laya.stage.off(laya.events.Event.MOUSE_MOVE, this, this.mouseMove);
        };
        TiledMapManager.prototype.completeHandler = function () {
            console.log("地图创建完成");
            console.log("ClientW:" + Browser.clientWidth + " ClientH:" + Browser.clientHeight);
            Laya.stage.on(laya.events.Event.RESIZE, this, this.resize);
            this.resize();
        };
        TiledMapManager.prototype.mapLoaded = function () {
            this.layer = this.tiledMap.getLayerByIndex(0);
            var radiusX = 32;
            var radiusY = Math.tan(180 / Math.PI * 30) * radiusX;
            var color = "cyan";
            this.sprite = new Sprite();
            this.sprite.graphics.drawLine(0, 0, -radiusX, radiusY, color);
            this.sprite.graphics.drawLine(0, 0, radiusX, radiusY, color);
            this.sprite.graphics.drawLine(-radiusX, radiusY, 0, radiusY * 2, color);
            this.sprite.graphics.drawLine(radiusX, radiusY, 0, radiusY * 2, color);
            Laya.stage.addChild(this.sprite);
        };
        TiledMapManager.prototype.onStageClick = function () {
            var p = new Point(0, 0);
            this.layer.getTilePositionByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY, p);
            this.layer.getScreenPositionByTilePos(Math.floor(p.x), Math.floor(p.y), p);
            this.sprite.pos(p.x, p.y);
        };
        return TiledMapManager;
    }());
    TiledMap_1.TiledMapManager = TiledMapManager;
})(TiledMap || (TiledMap = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuaW1hdGlvbk1hbmFnZXIudHMiLCJMb2FkaW5nLnRzIiwiTXNnTWFuYWdlci50cyIsImdhbWVvYmplY3QvU2NvcmVQYW5lbC50cyIsInVpL3VpLnRzIiwidWkvdmlldy9SZXN1bHRQYWdlLnRzIiwiU2NvcmVNYW5hZ2VyLnRzIiwiY29uZmlnLnRzIiwiZ2FtZW9iamVjdC9CYXNlQmFsbC50cyIsImdhbWVvYmplY3QvQmFsbC50cyIsImdhbWVvYmplY3QvYnVsbGV0L0J1bGxldC50cyIsImdhbWVvYmplY3QvYnVsbGV0L1N0YW5kYXJkQnVsbGV0LnRzIiwiZ2FtZW9iamVjdC9idWxsZXQvSWNlQnVsbGV0LnRzIiwiZ2FtZW9iamVjdC9idWxsZXQvRGl2aXNpb25CdWxsZXQudHMiLCJnYW1lb2JqZWN0L2J1bGxldC9TbW9rZUJ1bGxldC50cyIsImdhbWVvYmplY3QvYnVsbGV0L0JvbWJCdWxsZXQudHMiLCJnYW1lb2JqZWN0L0Nhbm5vbi50cyIsImdhbWVvYmplY3QvQnVsbGV0UHJvY2Vzcy50cyIsImdhbWVvYmplY3QvVGltZXIudHMiLCJnYW1lb2JqZWN0L0Rhc2hMaW5lLnRzIiwiZ2FtZW9iamVjdC90b29sL1Rvb2xUYWcudHMiLCJnYW1lb2JqZWN0L3Rvb2wvVG9vbFRhZ0NvbnRhaW5lci50cyIsImdhbWVvYmplY3QvdG9vbC9CdG5Td2l0Y2gudHMiLCJnYW1lLnRzIiwiZ2xvYmFsLnRzIiwiZ2FtZW9iamVjdC9Db3VudERvd24udHMiLCJzb2NrZXQvU29ja2V0LnRzIiwidWkvdmlldy9TdGFydFBhZ2UudHMiLCJ1dGlscy9VdGlscy50cyIsIm1haW4udHMiLCJnYW1lb2JqZWN0L1BQcm9jZXNzLnRzIiwidGlsZWRtYXAvVGlsZWRNYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQTtJQUVJO0lBRUEsQ0FBQztJQUdELHNCQUFrQiw0QkFBUTthQUExQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsSUFBSSxJ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QUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsV0FBVyxFQUFDLElBQUksRUFBQyxhQUFhLEVBQUMscUJBQXFCLEVBQUMsVUFBVSxFQUFDLEdBQUcsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLGNBQWMsRUFBQyxLQUFLLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLGlCQUFpQixFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxVQUFVLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxlQUFlLEVBQUMsV0FBVyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxxQkFBcUIsRUFBQyxVQUFVLEVBQUMsR0FBRyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsVUFBVSxFQUFDLFdBQVcsRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsYUFBYSxFQUFDLFdBQVcsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMscUJBQXFCLEVBQUMsVUFBVSxFQUFDLEdBQUcsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLGFBQWEsRUFBQyw0QkFBNEIsRUFBQyxFQUFDLENBQUM7UUFPcGhDLGNBQUM7SUFBRCxDQWJBLEFBYUMsQ0FiNEIsSUFBSSxHQWFoQztJQWJZLFVBQU8sVUFhbkIsQ0FBQTtJQUVEO1FBQWtDLGdDQUFJO1FBV2xDO1lBQWUsaUJBQU8sQ0FBQTtRQUFBLENBQUM7UUFDdkIscUNBQWMsR0FBZDtZQUVJLGdCQUFLLENBQUMsY0FBYyxXQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFOYyxtQkFBTSxHQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyx5QkFBeUIsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsY0FBYyxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsVUFBVSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLFdBQVcsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxXQUFXLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFDLElBQUksRUFBQyxrQkFBa0IsRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsc0JBQXNCLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsRUFBQyxDQUFDO1FBTzV3RCxtQkFBQztJQUFELENBakJBLEFBaUJDLENBakJpQyxJQUFJLEdBaUJyQztJQWpCWSxlQUFZLGVBaUJ4QixDQUFBO0FBQ0wsQ0FBQyxFQWxDTSxFQUFFLEtBQUYsRUFBRSxRQWtDUjtBQ3BDRDtJQUF5Qiw4QkFBZTtJQUVwQyxvQkFBWSxJQUFJO1FBQ1osaUJBQU8sQ0FBQztRQUVSLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRXJDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFFdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSw4QkFBUyxHQUFoQjtRQUNJLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUdoRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU0sMEJBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTSwyQkFBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFDTCxpQkFBQztBQUFELENBcENBLEFBb0NDLENBcEN3QixFQUFFLENBQUMsWUFBWSxHQW9DdkM7QUN2QkQsSUFBTSxXQUFXLEdBQUc7SUFDaEIsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixLQUFLLEVBQUUsQ0FBQztJQUNSLFFBQVEsRUFBRSxFQUFFO0NBQ2YsQ0FBQTtBQUtEO0lBVUk7UUFITyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBVyxDQUFDLENBQUM7SUFJMUIsQ0FBQztJQUdELHNCQUFrQix3QkFBUTthQUExQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsWUFBWSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQy9DLENBQUM7WUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGdDQUFNO2FBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGdDQUFNO2FBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHNDQUFZO2FBQWhCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDOUIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx3Q0FBYzthQUFsQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ2hDLENBQUM7OztPQUFBO0lBQ0Qsc0JBQUksb0NBQVU7YUFBZDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzVCLENBQUM7OztPQUFBO0lBS00sZ0NBQVMsR0FBaEI7UUFHSSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLENBQUMsRUFBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUtNLGdDQUFTLEdBQWhCLFVBQWlCLElBQVksRUFBRSxJQUFJO1FBQy9CLEVBQUUsQ0FBQSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEMsQ0FBQztRQUNELElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUtNLGtDQUFXLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBS00sdUNBQWdCLEdBQXZCO1FBQ0ksRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDekQsQ0FBQztJQUtNLGlDQUFVLEdBQWpCLFVBQWtCLFNBQWlCO1FBQy9CLEVBQUUsQ0FBQSxDQUFDLFNBQVMsS0FBSyxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLFNBQVMsS0FBSyxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixDQUFDO0lBQ0wsQ0FBQztJQUtNLHFDQUFjLEdBQXJCLFVBQXNCLElBQUk7UUFDdEIsSUFBSSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBRXpDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRW5CLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRzlDLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7UUFDTCxDQUFDO1FBR0QsRUFBRSxDQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFFLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFHaEcsRUFBRSxHQUFHO1lBQ0QsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDbkIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLE9BQU8sRUFBRSxNQUFNLENBQUMsS0FBSztZQUNyQixTQUFTLEVBQUUsUUFBUSxDQUFDLEtBQUs7WUFDekIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ3JCLFNBQVMsRUFBRSxRQUFRLENBQUMsS0FBSztTQUM1QixDQUFDO1FBR0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBR3RDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUV6RSxFQUFFLENBQUEsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUM7WUFBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEYsSUFBSTtZQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBS00sdUNBQWdCLEdBQXZCO1FBQ0ksRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FqS0EsQUFpS0MsSUFBQTtBQ3pMRCxJQUFNLE1BQU0sR0FBRztJQUNYLFNBQVMsRUFBRSxHQUFHO0lBQ2QsVUFBVSxFQUFFLEdBQUc7SUFJZixZQUFZLEVBQUUscUJBQXFCO0NBRXRDLENBQUM7QUNMRjtJQUF1Qiw0QkFBbUI7SUFRdEM7UUFDSSxpQkFBTyxDQUFDO0lBQ1osQ0FBQztJQUVELHNCQUFJLDRCQUFNO2FBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHdCQUFFO2FBQU47WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDO2FBTUQsVUFBTyxDQUFRO1lBQ1gsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQzs7O09BUkE7SUFFRCxzQkFBSSx3QkFBRTthQUFOO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQzthQU1ELFVBQU8sQ0FBUTtZQUNYLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7OztPQVJBO0lBU0wsZUFBQztBQUFELENBL0JBLEFBK0JDLENBL0JzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0ErQnpDO0FDakNELElBQU0sUUFBUSxHQUFHO0lBQ2IsS0FBSyxFQUFFLEVBQUU7SUFDVCxNQUFNLEVBQUUsRUFBRTtJQUNWLFFBQVEsRUFBRSxFQUFFO0lBQ1osU0FBUyxFQUFFLEVBQUU7SUFDYixRQUFRLEVBQUUsQ0FBQztJQUNYLE1BQU0sRUFBRSxHQUFHO0NBQ2QsQ0FBQTtBQUtEO0lBQW1CLHdCQUFRO0lBZXZCLGNBQVksU0FBaUI7UUFDekIsaUJBQU8sQ0FBQztRQWRKLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFFekIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFJekIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUVwQixjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBR3RCLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBS2hDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDbkMsQ0FBQztJQUVELHNCQUFJLDZCQUFXO2FBQWY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixDQUFDO2FBRUQsVUFBZ0IsQ0FBUztZQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUMxQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLHdCQUFNO2FBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDO2FBQ0QsVUFBVyxDQUFTO1lBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUM7OztPQUhBO0lBS0Qsc0JBQUksMkJBQVM7YUFBYixVQUFjLENBQVM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFLTSxxQkFBTSxHQUFiO1FBR0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRWxDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFcEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFFLENBQUM7UUFHRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUdoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFH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SSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMs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QUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7UUFFeEUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFFdkMsSUFBSSxHQUFHLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUM7UUFDOUIsSUFBSSxHQUFHLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUM7UUFFOUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElB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Q0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUVELElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2RCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbkMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLElBQUks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QUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDZCxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNkLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QixFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0IsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLElBQUk7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQXpCZSxxQkFBZSxrQkF5QjlCLENBQUE7QUFDTCxDQUFDLEVBck9NLEtBQUssS0FBTCxLQUFLLFFBcU9YO0FDbE9ELElBQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzFDLElBQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ3hDLElBQU8sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzVDLElBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hDLElBQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzlCLElBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hDLElBQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3BDLElBQU8sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3BDLElBQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ2hDLElBQU8sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLElBQU8sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3BDLElBQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3JDLElBQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzlCLElBQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDdEMsSUFBTyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUt4QztJQVVJO1FBUlEsV0FBTSxHQUFrQixFQUFFLENBQUM7UUFTL0IsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUMsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUNELEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFDRCxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FB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LElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRWEsc0NBQVksR0FBcEI7WUFDTCxJQUFJLENBQUMsR0FBVSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDQyxzQkFBQztJQUFELENBdEVBLEFBc0VDLElBQUE7SUF0RVksMEJBQWUsa0JBc0UzQixDQUFBO0FBQ0wsQ0FBQyxFQWhGTSxRQUFRLEtBQVIsUUFBUSxRQWdGZCIsImZpbGUiOiJqc0J1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDliqjnlLvnrqHnkIbnsbtcbiAqL1xuXG5jbGFzcyBBbmltYXRpb25NYW5hZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEFuaW1hdGlvbk1hbmFnZXI7XG4gICAgcHVibGljIHN0YXRpYyBnZXQgSW5zdGFuY2UoKTogQW5pbWF0aW9uTWFuYWdlciB7XG4gICAgICAgIGlmIChBbmltYXRpb25NYW5hZ2VyLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgIEFuaW1hdGlvbk1hbmFnZXIuaW5zdGFuY2UgPSBuZXcgQW5pbWF0aW9uTWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBbmltYXRpb25NYW5hZ2VyLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluS4gOS4quWKqOeUu+WunuS+i1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUobmFtZTogc3RyaW5nLCBzaXplWDogbnVtYmVyID0gMTM4LCBzaXplWTogbnVtYmVyID0gMTM0LCBwaXZvdFg6IG51bWJlciA9IDY1LCBwaXZvdFk6IG51bWJlciA9IDYyKSB7XG4gICAgICAgIGxldCBhbmk6QW5pbWF0aW9uID0gUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oJ2FuaW1hdGlvbicsICgpID0+IHsgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYW5pLmNsZWFyKCk7XG4gICAgICAgIGFuaS5sb2FkQXRsYXMoQXNzZXRzLkpzb25bbmFtZV0sIG51bGwsIG5hbWUpO1xuICAgICAgICBhbmkuaW5kZXggPSAwO1xuICAgICAgICBhbmkuek9yZGVyID0gRGlzcGxheU9yZGVyLkJ1bGxldEJvb207XG4gICAgICAgIGFuaS5pbnRlcnZhbCA9IDE2O1xuICAgICAgICBhbmkuc2l6ZShzaXplWCwgc2l6ZVkpO1xuXG4gICAgICAgIGxldCBib3VuZHM6IFJlY3RhbmdsZSA9IGFuaS5nZXRHcmFwaGljQm91bmRzKCk7XG5cdFx0YW5pLnBpdm90KHBpdm90WCwgcGl2b3RZKTtcblxuICAgICAgICByZXR1cm4gYW5pO1xuICAgIH1cbn0iLCJjb25zdCBMb2FkaW5nQXR0ciA9IHtcbiAgICB3aWR0aDogMzAwLFxuICAgIGhlaWdodDogMjhcbn07XG5cbmNvbnN0IGJhc2U2NCA9IHtcbiAgICBsb2FkaW5nOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUFjQ0FZQUFBRGJjSUpzQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUJ4MUpSRUZVZU5yc1hFdHlHemNRUmM5UVZKWStnbk1EbDNXQUtEZVFUeEI3bjFTY1pWSVZTZDVFMlRrdTZRQzZnWjBUbUQ0QWZZWGtDRnFMSEx3QW1BK0g1QXcramFFanVmcVZJTEZJRFFiZDZIbm9iamFnbEVBZ0VBZ0VBb0ZBSUJBSUJBS0JRUEN3UWFrWFBMKytPbE5FMzVuMnpMU3VFd3gwUmVaZDc0MTdIK3ZvZ1FXR0RQQ1ZBYWFpTUNZRHdzcVBIQzU2L2JQSDZSa1ROYXJUaWVPazZOSFh2ekdodm9mZXhxQWxocS9OZWtpNE5nZlBXK0ROWStoYWpIeE1qTEY2L3pVa2lOV1orOEVuODNyeCtmeHlNU2xoR2FKNnJhaTRVTFB5Q1JXbFVtVmgrS3BvZWpDL0RIbFJrdEZ0QzZJVHpJZkFzdzZBcjR6UVBURkVXRGxHTndBZE0zNjJqTFVCNlluMTBwY1JPekxRbEN0cEJHOFFrRDMzU0h5YVUwbFpNMGsxVmtiTkpLU1EzWXgydGZjWkdyS0NNd2JBakVoWENsWDFyOUw2MWZMaXpTS0xzSjVmLzJFSXFuaVBvanlsb3lORjVjeTAwbkJYVVRkTFZFVDczVkdhNHZXQUhzaWpWK0tzdnNoWVFnS0dON3h5aGZ1a2hJY3hScDFoN3dKK0daRDZnTVNQU2U5NVdQa0VNcXh0Sk9zN2hiQlNQT25VeFJYUjVBRVdRV29HMGFYT1J6dlBOTVJjc0NRRmR6OW83Wm9sTEwxZUs2eFg1clgrYTNsKytRdkx2aDFabGJPUE5KczlVNWFzWmtlcU1HUlZPTkpxUGF5YXNKeC9SU2xjdUcwRktSNldZaElQTzFxTXZGQm5ySXdoQTBKa3VFQ0tMK05ZdUtBeTVhS2VmaER6b0lQcFlUVlRSUnl2TnBMTTlNREM4WmdJYTJ6aG8wUjc5RjJyaDRSQkU2NjNrMlE4SzNMZWxiYmVWVWRZcmxYVjdmTDNpMWZKOW4xeTgrZGJtczlmRi9PNVVwYXNYRE9FWlVKQzYyVjFaRVh0bEpFaVNuY3prUkNLZ0duUVdSNVdwTkhwQStiVDRuSllpSHdpRW1RSVhvTm9PZmE4RXhieElwREQ4bnZmeEpBajdHRnh3a0Y0RnoxS3RJLytDQ2xkZFpQZXJ5VjFHbnNlbXBDUWRFMVlocTBNVWExcjBscXRsRjdkSzFWVkw1Ym5GeCtpeDNseWZYVktzL0lqSFgranl2bHhRMWd6NTJIVklXRk5XUDNjRlJGRkIzQkJJd0JHMWNNTEZ4RDA0bGk1c2Q0NDlaU2VDWHhrZ21sbDZIV3BKM1ZOOXh6cFNKV0FsZVFQaHMzTUR5a2dBL2xJS1ZHT0dDODlKNVRtSjkwUmZUOWdoTXpRWmJGcXdrSkxXS1k1NzhxUWxpRXNHTUxTOS9kM0psVDhkbm54NXE3ZlJURTZ3SUorVmpiMHN5VGxXcmtocTUwY1ZrdGM2RTBvT25GbzR0Z2xOekNadXRzdkxzaWpVczhYSFF3OUxCbkI4dWNlbDgzQit6NDVIWFROY29STEk5WHBKT2YwdUdiZWEzUGptL2JFL05QWkhpMTVsSEptTzNUaFgxRjMzaWVycitaQkZRZ0UvOE9hVkpPWTQ1S1d0QnF1NmY0Uy9SQkZXQ2MzSmh5MFROaDZVVnZlVlBIUWxtT0JRUEJJQWJXSjBGeDZxZUVhVlJQV2FSUmhVZHRKUWUyRlhlZ25qcFZBSUpqVzJkb21yYTNLZytpUThPRW5PZ1FDd2RmZ1pTVWs5SXBoTjYxSm16ZjFFbTJ4VjB5MXVFQWdFS1M1UUwzcTk2YkIxUVVpanJDV1AvNjZjTit2dWtyVWhxemFxbFRzMWlzTEJBSUIyNy9hSnlwWDZ1QnFNQmJSSWFHNThBT3F1Z3JWVmFKMlpmUTFpUWxwQ1FTQ3JEaXdJNmVxcWNlcXVhYm1tTW82UjMvdlhqWWI3MUMvVTlYNlRGZHJSVlhwNmlac0hZWDFyMXpoR3NvNktiK1RHcU9kVXZmWVBYK3gyVEVLOVJ1OE5tNDgwUjhlaUxkM0s2RVJJd2N5RGVpZ2JyOGFkUEhINUdCbFM1RTNWNXg5aGtOekZTdUhyMHFMTXZUamt3Tk01YVRjRDBQUGFhK1lGTTAyTUdvanRzcTJkZWNjd2I3VzFaMzVwOXVrdVRpNXVmcEk4K05UbXMvcmZZVE5Ya0piaTFWc3ZucFUxT3NxK2x2RWdRMlRVeng4dm8yeE92REE4aCtTa1FyaWlRbEVKK28weWZBYUk5SUpPazJWSTlvdkIvKzBodER4TXBSNXZNelFOakxma1QyOFNuZXdhMkNEbTU4VEt0WlQrdDIxVTZpQml2emRyVGx0cFh2VjI1cXpYcmxxZC9QZW0rWDU1V1c4aDFXSGhTL1VhdldQZWZrRTNaRVFockJNdzZhNGF6UGd2YThpa1dCb0NlYkQ4QVp5OXhKU2hBeXBSN09reURITjVtZi9seVpqT2dLWEJBT0VsYnVOS1BWakF0aDc2WHkyTU9VbTdyalRMekk4Zmt5c1ZKOCsrd2FMN2IrdGQrVkNRcHR5YWttckpxdkZFRmtGQ2V2elQ3L2RuVnhmZlc5STY3MGhyS2VWNlZ5WHpYN0NmakZwT3kyVU12WG9KaWN0SThZa3JJbjM5UTE5cUE5d05NdWdoOFhjU3haelR5UmY0dy8weU5NNW1Qck9DWmNPWWlEZ1hVTytBNGx3V0Z1ZGxLOUdGem5zSHpIVHJJcTZxVUJvQ2N0NVZvYTB6T3VGc281U3pzSmlqNWt4N1BUV2hJQXY3WGxZN3ZDK29zNWhkUjRWRVh2VlNqdUh5UitKRTZhNFIySytBV21iWXJtRWhlQjE0TXVCeUxCendHdUpEcWQyNW9DVjMvR0U3akhIeS9CQ0hrWll5OHcxNllqelpZaDcySjduQ0tISlRoeEYvM3haRlR6QXp5WGE2eVQ3blFrUDM0MTVWc21lc010cFhWODlCZEhMNW9qazArMEVPN0Z2a0VzbTArUmJrSFgwOENCaFplYVV4dnFuQXhBdk5lRWltRVFYYzA4ZEhSS0NmVVR5VlBwT3VYM3VLUjhjRDR1YmIyVW4zWkVtMnZnNUxadlRHa3l6aWZVRm9EK1pkMjQvbjEvZUtZRkFJQkFJQkFLQlFDQVFDQVFDZ2VDUjR6OEJCZ0JqT2Z1OEsrRlZZZ0FBQUFCSlJVNUVya0pnZ2c9PScsXG4gICAgbG9hZGluZ0JnOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUFjQ0FZQUFBRGJjSUpzQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUFicEpSRUZVZU5yczNkOHhBMUVVQitDTk4zbFNRbFJBQ2RFQkZZZ0tSQVZHQmVpQUN1aEFPaEFWV0JYd0ZLL09sWnVSbUVYOHpjMzR2cGt6WWV6azRUejg1dDYxZTArcitvVEgwYWdUSDV1NUFIN0NJR3E0Mm00L2ZIUmhhNDZRV291UGZ0UnVWRWR2Z1Y4eWpEcU40RHI3VW1CRldLV2dPb3hhMDB2Z2o5UlJleEZjZzdrQ0s2K3FMcUs2ZWdjc3lFbUUxc0c3Z1pYRDZxcHlud3BZdkxNSXJiM0pMeXNORndncm9CUzlXRVFkTndaVy9vT3dBa3JTajJ6YW50a1M1a2NXYnZVR0tGQWRXOFAxNlJYV29aNEFoZXJFb3FyWHlxdXJkS1A5WGsrQWdnMG5LNnh0dlFBS3R6a0pyQTI5QUVvM0NTei9HUVNXSnJBQUJCYUF3QUwrYldEVldnRXNTMkRkYUFXd0xJRjFxUlZBNGVybndGcHR0OU9XY0tBZlFNSE9wMTkrN2xiam8yVUFTcFBPZTM5NStUa2ZSMnByQ0pUb0tBMnBtRGx4Tkw4RWZWMFpOZ0dVNHpMQ2FpZjlNUE1jVmg2enM1T1hYd0NMbGlicHZIMUVjb1JXdW1Bclh3aXdzSlZWeXFMcGVZV05UN3BQaGRhSm5nRi9MQVhVUWRvR3ZoNnVPczhnMVhTU3czNVVUeCtCWHc2cTAybzgzcXZ4dGxScjNtL0tOK1M3MWZnb21uUitsdUdxd0hmVlVYZFJnNmJCcWE4OUNUQUFQcDFqYVV5OEhaOEFBQUFBU1VWT1JLNUNZSUk9J1xufTtcblxuLyoqXG4gKiDliqDovb3pobXpnaJcbiAqL1xuY2xhc3MgTG9hZGluZyB7XG4gICAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgYmc6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgcHJvY2VzczogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcbiAgICAvLyDov5vluqbnjodcbiAgICBwdWJsaWMgcGVyY2VudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5wZXJjZW50ID0gMDtcbiAgICAgICBcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuaWQgPSAnbG9hZGluZy1jb250YWluZXInO1xuXG4gICAgICAgIHRoaXMuYmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XG4gICAgICAgIHRoaXMuYmcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICB0aGlzLmJnLnN0eWxlLndpZHRoID0gTG9hZGluZ0F0dHIud2lkdGggKyAncHgnO1xuICAgICAgICB0aGlzLmJnLnN0eWxlLmhlaWdodCA9IExvYWRpbmdBdHRyLmhlaWdodCArICdweCc7XG4gICAgICAgIHRoaXMuYmcuc3R5bGUudG9wID0gJzUwJSc7XG4gICAgICAgIHRoaXMuYmcuc3R5bGUubGVmdCA9ICcwJztcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5yaWdodCA9ICcwJztcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5tYXJnaW5Ub3AgPSAnMjBweCc7XG4gICAgICAgIHRoaXMuYmcuc3R5bGUuYmFja2dyb3VuZCA9ICd1cmwoJyArIGJhc2U2NC5sb2FkaW5nQmcgKyAnKSc7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMucHJvY2Vzcy5zdHlsZS53aWR0aCA9ICcwcHgnO1xuICAgICAgICB0aGlzLnByb2Nlc3Muc3R5bGUuaGVpZ2h0ID0gTG9hZGluZ0F0dHIuaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5wcm9jZXNzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIGJhc2U2NC5sb2FkaW5nICsgJyknO1xuXG4gICAgICAgIHRoaXMudGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnRleHQuaW5uZXJIVE1MID0gJ+a4uOaIj+i1hOa6kOWKoOi9veS4rS4uLicgKyB0aGlzLnBlcmNlbnQgKyAnJSc7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS53aWR0aCA9IExvYWRpbmdBdHRyLndpZHRoICsgJ3B4JztcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLmhlaWdodCA9IExvYWRpbmdBdHRyLmhlaWdodCArICdweCc7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS50b3AgPSAnNTAlJztcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5yaWdodCA9ICcwJztcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLmNvbG9yID0gJyNmZmZmZmYnO1xuICAgICAgICB0aGlzLnRleHQuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5mb250U2l6ZSA9ICcyNnB4JztcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLmZvbnRGYW1pbHkgPSAnY3Vyc2l2ZSc7XG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTMwcHgnO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJnKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50ZXh0KTtcbiAgICAgICAgdGhpcy5iZy5hcHBlbmRDaGlsZCh0aGlzLnByb2Nlc3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiuvue9rui/m+W6plxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRQcm9jZXNzKHBlcmNlbnQ6IG51bWJlcikge1xuICAgICAgICBpZihwZXJjZW50IDwgMCkgcGVyY2VudCA9IDA7XG4gICAgICAgIGlmKHBlcmNlbnQgPiAxKSBwZXJjZW50ID0gMTtcblxuICAgICAgICB0aGlzLnBlcmNlbnQgPSBwZXJjZW50O1xuICAgICAgICB0aGlzLnByb2Nlc3Muc3R5bGUud2lkdGggPSBMb2FkaW5nQXR0ci53aWR0aCAqIHBlcmNlbnQgKyAncHgnO1xuICAgICAgICB0aGlzLnRleHQuaW5uZXJIVE1MID0gJ+a4uOaIj+i1hOa6kOWKoOi9veS4rS4uLicgKyBNYXRoLnJvdW5kKHRoaXMucGVyY2VudCAqIDEwMCkrICclJztcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG59IiwiY29uc3QgTXNnQXR0ciA9IHtcbiAgICB3aWR0aDogNDA4LFxuICAgIGhlaWdodDogMzE2XG59XG4vKipcbiAqIOa2iOaBr+euoeeQhlxuICovXG5jbGFzcyBNc2dNYW5hZ2VyIHtcbiAgICBwcml2YXRlIF9tc2c6IFNwcml0ZTtcbiAgICBwcml2YXRlIF9tc2dDb250YWluZXI6IFZpZXc7XG4gICAgcHJpdmF0ZSBfdGV4dFNwcml0ZTogTGF5YVRleHQ7XG4gICAgcHJpdmF0ZSBfc2hvd2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3RpcHNUZXh0OiBMYXlhVGV4dDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG1zZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21zZztcbiAgICB9XG5cbiAgICBnZXQgdGlwc1RleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aXBzVGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTXNnTWFuYWdlcjtcbiAgICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpOiBNc2dNYW5hZ2VyIHtcbiAgICAgICAgaWYgKE1zZ01hbmFnZXIuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgTXNnTWFuYWdlci5pbnN0YW5jZSA9IG5ldyBNc2dNYW5hZ2VyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1zZ01hbmFnZXIuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8g5pi+56S65raI5oGvXG4gICAgcHVibGljIHNob3dNZXNzYWdlKHRleHQ6IHN0cmluZywgc2l6ZT86IG51bWJlciwgZnVuYz86ICgpID0+IHZvaWQpIHtcblxuICAgICAgICBpZiAoIXRoaXMuX21zZykge1xuXG4gICAgICAgICAgICAvLyDmtojmga/lsYIg5a655ZmoXG4gICAgICAgICAgICB0aGlzLl9tc2dDb250YWluZXIgPSBuZXcgVmlldygpO1xuICAgICAgICAgICAgdGhpcy5fbXNnQ29udGFpbmVyLnpPcmRlciA9IERpc3BsYXlPcmRlci5Nc2c7XG4gICAgICAgICAgICB0aGlzLl9tc2dDb250YWluZXIubW91c2VFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8g5raI5oGv6IOM5pmvXG4gICAgICAgICAgICB0aGlzLl9tc2cgPSBuZXcgU3ByaXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9tc2cubG9hZEltYWdlKEFzc2V0cy5JbWcubXNnQmcpO1xuICAgICAgICAgICAgdGhpcy5fbXNnLnBpdm90KE1zZ0F0dHIud2lkdGggLyAyLCBNc2dBdHRyLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgdGhpcy5fbXNnLnNpemUoTXNnQXR0ci53aWR0aCwgTXNnQXR0ci5oZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5fbXNnLm5hbWUgPSBEaXNwbGF5TmFtZS5Mb2FkaW5nO1xuICAgICAgICAgICAgdGhpcy5fbXNnLnBvcyhMYXlhLnN0YWdlLndpZHRoIC8gMiwgTGF5YS5zdGFnZS5oZWlnaHQgLyAyKTtcblxuICAgICAgICAgICAgLy8g5paH5a2XXG4gICAgICAgICAgICB0aGlzLl90ZXh0U3ByaXRlID0gbmV3IExheWFUZXh0KCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0U3ByaXRlLmZvbnQgPSAn562J57q/JztcbiAgICAgICAgICAgIHRoaXMuX3RleHRTcHJpdGUub3ZlcmZsb3cgPSBMYXlhVGV4dC5ISURERU47XG4gICAgICAgICAgICB0aGlzLl90ZXh0U3ByaXRlLndvcmRXcmFwID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRTcHJpdGUuYWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIHRoaXMuX3RleHRTcHJpdGUudmFsaWduID0gJ21pZGRsZSc7XG4gICAgICAgICAgICB0aGlzLl90ZXh0U3ByaXRlLnNpemUoMjYwLCAzMDApO1xuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS5waXZvdCh0aGlzLl90ZXh0U3ByaXRlLndpZHRoIC8gMiwgdGhpcy5fdGV4dFNwcml0ZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRTcHJpdGUucG9zKHRoaXMuX21zZy53aWR0aCAvIDIsIHRoaXMuX21zZy5oZWlnaHQgLyAyKTtcblxuICAgICAgICAgICAgdGhpcy5fbXNnLmFkZENoaWxkKHRoaXMuX3RleHRTcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g54q25oCB5Y+Y5Li65pi+56S65LitXG4gICAgICAgIHRoaXMuX3Nob3dpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIOa4hemZpOaJp+ihjOS4reeahOWKqOeUu1xuICAgICAgICBUd2Vlbi5jbGVhckFsbCh0aGlzLl9tc2cpO1xuXG4gICAgICAgIC8vIOavj+asoeaYvuekuua2iOaBr+mHjeaWsOiuvue9rlxuICAgICAgICB0aGlzLl9tc2cuYWxwaGEgPSAwO1xuICAgICAgICB0aGlzLl9tc2cuc2NhbGUoMCwgMCk7XG4gICAgICAgIHRoaXMuX3RleHRTcHJpdGUudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuX3RleHRTcHJpdGUuY29sb3IgPSAnIzAwMDAwMCc7XG4gICAgICAgIHRoaXMuX3RleHRTcHJpdGUuZm9udFNpemUgPSA0NjtcblxuICAgICAgICAvLyDlj6/pgInlj4LmlbAg5bC65a+46K6+572uXG4gICAgICAgIGlmIChzaXplKSB0aGlzLl90ZXh0U3ByaXRlLmZvbnRTaXplID0gc2l6ZTtcblxuICAgICAgICAvLyDmiafooYzliqjnlLtcbiAgICAgICAgVHdlZW4udG8odGhpcy5fbXNnLCB7IGFscGhhOiAxLCBzY2FsZVg6IDEsIHNjYWxlWTogMSB9LCA2MDAsIEVhc2VbJ2JhY2tJbk91dCddLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zaG93aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZnVuYykgZnVuYy5hcHBseSh0aGlzKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOa3u+WKoOWIsOaYvuekuuWxglxuICAgICAgICB0aGlzLl9tc2dDb250YWluZXIuYWRkQ2hpbGQodGhpcy5fbXNnKTtcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9tc2dDb250YWluZXIpO1xuICAgIH1cblxuICAgIC8vIOenu+mZpOa2iOaBr1xuICAgIHB1YmxpYyByZW1vdmVNZXNzYWdlKGZ1bmM/OiAoKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgLy8g5aaC5p6c5pi+56S65Lit77yM5YiZ5LiN56e76ZmkXG4gICAgICAgIGlmICh0aGlzLl9zaG93aW5nKSByZXR1cm47XG5cbiAgICAgICAgLy8g6YCA5Zy65Yqo55S7XG4gICAgICAgIFR3ZWVuLnRvKHRoaXMuX21zZywgeyBhbHBoYTogMCwgc2NhbGVYOiAwLCBzY2FsZVk6IDAgfSwgNTAwLCBudWxsLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIOWPr+mAieWPguaVsCDlm57osIPlh73mlbBcbiAgICAgICAgICAgIGlmIChmdW5jKSBmdW5jLmFwcGx5KHRoaXMpO1xuXG4gICAgICAgICAgICAvLyDnp7vpmaTmlbDmja4g5pu05o2i54q25oCBXG4gICAgICAgICAgICBMYXlhLnN0YWdlLnJlbW92ZUNoaWxkKHRoaXMuX21zZ0NvbnRhaW5lcik7XG4gICAgICAgICAgICB0aGlzLl9tc2dDb250YWluZXIucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3dpbmcgPSBmYWxzZTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8vIOiuvue9ruaWh+acrFxuICAgIHB1YmxpYyBzZXRUZXh0KHRleHQ6IHN0cmluZywgY29sb3I/KSB7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0U3ByaXRlKSB0aGlzLl90ZXh0U3ByaXRlLnRleHQgPSB0ZXh0O1xuICAgICAgICBpZiAoY29sb3IpIHRoaXMuX3RleHRTcHJpdGUuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd1RpcHModGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3RpcHNUZXh0ID0gbmV3IExheWFUZXh0KCk7XG4gICAgICAgIHRoaXMuX3RpcHNUZXh0LmZvbnQgPSAn562J57q/JztcbiAgICAgICAgdGhpcy5fdGlwc1RleHQub3ZlcmZsb3cgPSBMYXlhVGV4dC5ISURERU47XG4gICAgICAgIHRoaXMuX3RpcHNUZXh0LndvcmRXcmFwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdGlwc1RleHQuYWxpZ24gPSAnbGVmdCc7XG4gICAgICAgIHRoaXMuX3RpcHNUZXh0LnZhbGlnbiA9ICdtaWRkbGUnO1xuICAgICAgICB0aGlzLl90aXBzVGV4dC5zaXplKDIyNiwgMzAwKTtcbiAgICAgICAgdGhpcy5fdGlwc1RleHQucGl2b3QodGhpcy5fdGlwc1RleHQud2lkdGggLyAyLCB0aGlzLl90aXBzVGV4dC5oZWlnaHQgLyAyKTtcbiAgICAgICAgdGhpcy5fdGlwc1RleHQucG9zKExheWEuc3RhZ2Uud2lkdGggLyAyLCBMYXlhLnN0YWdlLmhlaWdodCAtIDEwMCk7XG4gICAgICAgIHRoaXMuX3RpcHNUZXh0LnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLl90aXBzVGV4dC5jb2xvciA9ICcjZmZmZmZmJztcbiAgICAgICAgdGhpcy5fdGlwc1RleHQuZm9udFNpemUgPSAyNjtcblxuICAgICAgICB0aGlzLnJlbW92ZVRpcHMoKTtcblxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX3RpcHNUZXh0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlVGlwcygpIHtcbiAgICAgICAgaWYodGhpcy5fdGlwc1RleHQpIExheWEuc3RhZ2UucmVtb3ZlQ2hpbGQodGhpcy5fdGlwc1RleHQpO1xuICAgIH1cbn0iLCIvKipcbiAqIOa4uOaIj+WIhuaVsOadv1xuICovXG5jbGFzcyBTY29yZVBhbmVsIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZXtcbiAgICBwcml2YXRlIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSB0eXBlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfbmFtZTogTGF5YVRleHQ7XG4gICAgcHJpdmF0ZSBfYmFsbHM6IExheWFUZXh0O1xuICAgIHByaXZhdGUgX3Njb3JlOiBMYXlhVGV4dDtcblxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5zY29yZUJnKTtcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuU2NvcmVQYW5lbDtcbiAgICAgICAgaWYodHlwZSA9PT0gJ21pbmUnKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gU29ja2V0Lkluc3RhbmNlLm1OYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ3lvdXInKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gU29ja2V0Lkluc3RhbmNlLnlOYW1lO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnJlcG9zKCk7XG5cbiAgICAgICAgdGhpcy5pbml0SW5mbygpO1xuICAgIH1cblxuICAgIC8vIOWIneWni+WMluS/oeaBr1xuICAgIHByaXZhdGUgaW5pdEluZm8oKSB7XG4gICAgICAgIGxldCBzY29yZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX25hbWUgPSBuZXcgTGF5YVRleHQoKTtcbiAgICAgICAgdGhpcy5fc2NvcmUgPSBuZXcgTGF5YVRleHQoKTtcbiAgICAgICAgdGhpcy5fYmFsbHMgPSBuZXcgTGF5YVRleHQoKTtcblxuICAgICAgICBpZih0aGlzLnR5cGUgPT09ICdtaW5lJykge1xuICAgICAgICAgICAgc2NvcmUgPSBTY29yZU1hbmFnZXIuSW5zdGFuY2UubXNjb3JlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy50eXBlID09PSAneW91cicpIHtcbiAgICAgICAgICAgIHNjb3JlID0gU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnlzY29yZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX25hbWUuZm9udFNpemUgPSAyMDtcbiAgICAgICAgdGhpcy5fbmFtZS5wb3MoNiwyKTtcbiAgICAgICAgdGhpcy5fbmFtZS50ZXh0ID0gdGhpcy51c2VyTmFtZTtcblxuICAgICAgICB0aGlzLl9zY29yZS5mb250U2l6ZSA9IDE2O1xuICAgICAgICB0aGlzLl9zY29yZS5wb3MoNSwgMjgpO1xuICAgICAgICB0aGlzLl9zY29yZS50ZXh0ID0gJ+W+l+WIhjonICsgc2NvcmUuc2NvcmUudG9TdHJpbmcoKTtcblxuICAgICAgICB0aGlzLl9iYWxscy5mb250U2l6ZSA9IDE2O1xuICAgICAgICB0aGlzLl9iYWxscy5wb3MoODQsIDI4KTtcbiAgICAgICAgdGhpcy5fYmFsbHMuc2l6ZSgxOCwgMTgpO1xuICAgICAgICB0aGlzLl9iYWxscy5hbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICB0aGlzLl9iYWxscy50ZXh0ID0gc2NvcmUuYmFsbHMudG9TdHJpbmcoKTtcblxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX25hbWUpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Njb3JlKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9iYWxscyk7XG4gICAgfVxuXG4gICAgLy8g5pu05paw5YiG5pWw5YC8XG4gICAgcHVibGljIHVwZGF0ZVNjb3JlKHNjb3JlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc2NvcmUudGV4dCA9ICflvpfliIY6JyArIHNjb3JlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgLy8g5pu05paw6L+b55CD5pWwXG4gICAgcHVibGljIHVwZGF0ZUJhbGxzKGJhbGxzOiBudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5fYmFsbHMudGV4dCAhPT0gYmFsbHMudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgVHdlZW4uZnJvbSh0aGlzLl9iYWxscywge3k6IDEwLCBhbHBoYTogMH0sIDMwMCwgRWFzZS5iYWNrSW4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2JhbGxzLnRleHQgPSBiYWxscy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIOmHjeWumuS9jVxuICAgIHB1YmxpYyByZXBvcygpIHtcbiAgICAgICAgaWYoTGF5YS5zdGFnZS53aWR0aCA+PSAxMjgwKSB7XG4gICAgICAgICAgICBpZih0aGlzLnR5cGUgPT09ICdtaW5lJykge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zKGdsb2JhbC5sZWZ0RWRnZSAtIDQwMCwgTGF5YS5zdGFnZS5oZWlnaHQgLSA0Nyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMudHlwZSA9PT0gJ3lvdXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3MoZ2xvYmFsLmxlZnRFZGdlIC0gNDAwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMudHlwZSA9PT0gJ21pbmUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3MoMCwgTGF5YS5zdGFnZS5oZWlnaHQgLSA0Nyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMudHlwZSA9PT0gJ3lvdXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3MoMCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnMvbGF5YUFpci5kLnRzXCIgLz5cblxuaW1wb3J0IFZpZXc9bGF5YS51aS5WaWV3O1xuaW1wb3J0IERpYWxvZz1sYXlhLnVpLkRpYWxvZzsgICAgICAgICAgICAgICAgICBcbm1vZHVsZSB1aSB7XG4gICAgZXhwb3J0IGNsYXNzIHN0YXJ0VUkgZXh0ZW5kcyBWaWV3IHtcblxuICAgICAgICBwdWJsaWMgYnRuTWF0Y2g6bGF5YS51aS5CdXR0b247XG5cdFx0cHVibGljIGJ0bkpvaW5Sb29tOmxheWEudWkuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5DcmVhdGVSb29tOmxheWEudWkuQnV0dG9uO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlZpZXdcIixcImNoaWxkXCI6W3tcInByb3BzXCI6e1wieFwiOjEzMixcInlcIjozOTYsXCJza2luXCI6XCJzdGFydC9idG5iZy5wbmdcIixcImxhYmVsXCI6XCLpmo/mnLrljLnphY1cIixcIndpZHRoXCI6MjE2LFwiaGVpZ2h0XCI6ODYsXCJzaXplR3JpZFwiOlwiMCwwLDAsMFwiLFwibGFiZWxTaXplXCI6MzcsXCJsYWJlbEJvbGRcIjpmYWxzZSxcInZhclwiOlwiYnRuTWF0Y2hcIixcImxhYmVsRm9udFwiOlwi562J57q/XCIsXCJsYWJlbENvbG9yc1wiOlwiIzAwMCwjMDAwLCMwMDAsIzAwMFwiLFwic3RhdGVOdW1cIjpcIjNcIixcImRpc2FibGVkXCI6ZmFsc2UsXCJtb3VzZVRocm91Z2hcIjpmYWxzZX0sXCJ0eXBlXCI6XCJCdXR0b25cIn0se1wicHJvcHNcIjp7XCJ4XCI6MTMyLFwieVwiOjUwMyxcInNraW5cIjpcInN0YXJ0L2J0bmJnLnBuZ1wiLFwibGFiZWxcIjpcIuWIm+W7uuaIv+mXtFwiLFwid2lkdGhcIjoyMTYsXCJoZWlnaHRcIjo4NixcInNpemVHcmlkXCI6XCIyLDQsLTIsMVwiLFwibGFiZWxTaXplXCI6MzcsXCJsYWJlbEJvbGRcIjpmYWxzZSxcInZhclwiOlwiYnRuQ3JlYXRlUm9vbVwiLFwibGFiZWxGb250XCI6XCLnrYnnur9cIixcInRvZ2dsZVwiOmZhbHNlLFwibGFiZWxDb2xvcnNcIjpcIiMwMDAsIzAwMCwjMDAwLCMwMDBcIixcInN0YXRlTnVtXCI6XCIzXCJ9LFwidHlwZVwiOlwiQnV0dG9uXCJ9LHtcInByb3BzXCI6e1wieFwiOjEzMixcInlcIjo2MDksXCJza2luXCI6XCJzdGFydC9idG5iZy5wbmdcIixcImxhYmVsXCI6XCLliqDlhaXmiL/pl7RcIixcIndpZHRoXCI6MjE2LFwiaGVpZ2h0XCI6ODYsXCJzaXplR3JpZFwiOlwiMiw0LC0yLDFcIixcImxhYmVsU2l6ZVwiOjM3LFwibGFiZWxCb2xkXCI6ZmFsc2UsXCJ2YXJcIjpcImJ0bkpvaW5Sb29tXCIsXCJsYWJlbEZvbnRcIjpcIuetiee6v1wiLFwidG9nZ2xlXCI6ZmFsc2UsXCJsYWJlbENvbG9yc1wiOlwiIzAwMCwjMDAwLCMwMDAsIzAwMFwiLFwic3RhdGVOdW1cIjpcIjNcIn0sXCJ0eXBlXCI6XCJCdXR0b25cIn0se1wicHJvcHNcIjp7XCJ4XCI6OCxcInlcIjoxNjAsXCJza2luXCI6XCJzdGFydC9sb2dvLnBuZ1wiLFwid2lkdGhcIjo0NjIsXCJoZWlnaHRcIjoxMDB9LFwidHlwZVwiOlwiSW1hZ2VcIn1dLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjQ4MCxcImhlaWdodFwiOjgwMCxcImxhYmVsQ29sb3JzXCI6XCIoIzMzMywjNTY3MzU2LCMzMzMjNTY3MzU2KVwifX07XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XG4gICAgICAgIFxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyh1aS5zdGFydFVJLnVpVmlldyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUmVzdWx0UGFnZVVJIGV4dGVuZHMgVmlldyB7XG4gICAgICAgIHB1YmxpYyB3b3JkOkxheWEuSW1hZ2U7XG5cdFx0cHVibGljIG15TmFtZVRleHQ6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgeW91ck5hbWVUZXh0OkxheWEuTGFiZWw7XG5cdFx0cHVibGljIG15QmFsbHM6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgeW91ckJhbGxzOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIG15U2NvcmU6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgeW91clNjb3JlOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIGJhY2tCdG46TGF5YS5CdXR0b247XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAgdWlWaWV3OmFueSA9e1widHlwZVwiOlwiVmlld1wiLFwiY2hpbGRcIjpbe1wicHJvcHNcIjp7XCJ4XCI6NCxcInlcIjotNCxcInNraW5cIjpcIlJlc3VsdFBhZ2UvcmVzdWx0YmcucG5nXCJ9LFwidHlwZVwiOlwiSW1hZ2VcIn0se1wicHJvcHNcIjp7XCJ4XCI6NjAsXCJ5XCI6LTcsXCJ2YXJcIjpcIndvcmRcIn0sXCJ0eXBlXCI6XCJJbWFnZVwifSx7XCJwcm9wc1wiOntcInhcIjo2MixcInlcIjoxNjAsXCJ0ZXh0XCI6XCJteW5hbWVcIixcIndpZHRoXCI6OTQsXCJoZWlnaHRcIjoyMyxcInZhclwiOlwibXlOYW1lVGV4dFwiLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjMTAxMDEwXCIsXCJmb250XCI6XCLlvq7ova/pm4Xpu5FcIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjoyMDAsXCJ5XCI6MTYwLFwidGV4dFwiOlwieW91cm5hbWVcIixcIndpZHRoXCI6MTA5LFwiaGVpZ2h0XCI6MjMsXCJ2YXJcIjpcInlvdXJOYW1lVGV4dFwiLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjM0EzQTNBXCIsXCJmb250XCI6XCLlvq7ova/pm4Xpu5FcIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjo2MSxcInlcIjoyMDIsXCJ0ZXh0XCI6XCLov5vnkIPmlbBcIixcIndpZHRoXCI6OTQsXCJoZWlnaHRcIjoyMyxcImZvbnRTaXplXCI6MjAsXCJjb2xvclwiOlwiIzk2OTY5NlwiLFwiZm9udFwiOlwi562J57q/XCJ9LFwidHlwZVwiOlwiTGFiZWxcIn0se1wicHJvcHNcIjp7XCJ4XCI6MjAwLFwieVwiOjIwMixcInRleHRcIjpcIui/m+eQg+aVsFwiLFwid2lkdGhcIjo5NCxcImhlaWdodFwiOjIzLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjOTY5Njk2XCIsXCJmb250XCI6XCLnrYnnur9cIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjo2MyxcInlcIjoyMzIsXCJ0ZXh0XCI6XCIwXCIsXCJ3aWR0aFwiOjk0LFwiaGVpZ2h0XCI6MjMsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiMwMEM2RjRcIixcImZvbnRcIjpcIuW+rui9r+mbhem7kVwiLFwidmFyXCI6XCJteUJhbGxzXCJ9LFwidHlwZVwiOlwiTGFiZWxcIn0se1wicHJvcHNcIjp7XCJ4XCI6MjAwLFwieVwiOjIzMixcInRleHRcIjpcIjBcIixcIndpZHRoXCI6NzcsXCJoZWlnaHRcIjoyMyxcImZvbnRTaXplXCI6MjAsXCJjb2xvclwiOlwiIzZENkQ2RFwiLFwiZm9udFwiOlwi5b6u6L2v6ZuF6buRXCIsXCJ2YXJcIjpcInlvdXJCYWxsc1wifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjYyLFwieVwiOjI3MixcInRleHRcIjpcIuaAu+W+l+WIhlwiLFwid2lkdGhcIjo5NCxcImhlaWdodFwiOjIzLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjOTY5Njk2XCIsXCJmb250XCI6XCLnrYnnur9cIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjoyMDAsXCJ5XCI6MjcyLFwidGV4dFwiOlwi5oC75b6X5YiGXCIsXCJ3aWR0aFwiOjk0LFwiaGVpZ2h0XCI6MjMsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiM5Njk2OTZcIixcImZvbnRcIjpcIuetiee6v1wifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjYyLFwieVwiOjMxMCxcInRleHRcIjpcIjBcIixcIndpZHRoXCI6OTQsXCJoZWlnaHRcIjoyMyxcImZvbnRTaXplXCI6MjAsXCJjb2xvclwiOlwiIzAwQzZGNFwiLFwiZm9udFwiOlwi5b6u6L2v6ZuF6buRXCIsXCJ2YXJcIjpcIm15U2NvcmVcIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjoyMDAsXCJ5XCI6MzEwLFwidGV4dFwiOlwiMFwiLFwid2lkdGhcIjo5NCxcImhlaWdodFwiOjIzLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjNkQ2RDZEXCIsXCJmb250XCI6XCLlvq7ova/pm4Xpu5FcIixcInZhclwiOlwieW91clNjb3JlXCJ9LFwidHlwZVwiOlwiTGFiZWxcIn0se1wicHJvcHNcIjp7XCJ4XCI6MTIzLFwieVwiOjM1NCxcImxhYmVsXCI6XCLov5Tlm55cIixcIndpZHRoXCI6MTIyLFwiaGVpZ2h0XCI6MzYsXCJsYWJlbEZvbnRcIjpcIuetiee6v1wiLFwibGFiZWxTdHJva2VDb2xvclwiOlwiIzAwMDAwMFwiLFwibGFiZWxTaXplXCI6MjIsXCJzdHJva2VDb2xvcnNcIjpcIiMwQkUwREFcIixcInN0YXRlTnVtXCI6XCIxXCIsXCJsYWJlbENvbG9yc1wiOlwiI2ZmZmZmZlwiLFwic2tpblwiOlwiUmVzdWx0UGFnZS9idG5iZy5wbmdcIixcInZhclwiOlwiYmFja0J0blwifSxcInR5cGVcIjpcIkJ1dHRvblwifV0sXCJwcm9wc1wiOntcImZvbnRcIjpcIuetiee6v1wifX07XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XG4gICAgICAgIFxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyh1aS5SZXN1bHRQYWdlVUkudWlWaWV3KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdWkudHNcIiAvPlxuXG5jbGFzcyBSZXN1bHRQYWdlIGV4dGVuZHMgdWkuUmVzdWx0UGFnZVVJIHtcblxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLndvcmQubG9hZEltYWdlKCdSZXN1bHRQYWdlLycgKyBkYXRhLnJlc3VsdCArICcucG5nJyk7XG4gICAgICAgIHRoaXMubXlOYW1lVGV4dC50ZXh0ID0gZGF0YS5teW5hbWU7XG4gICAgICAgIHRoaXMueW91ck5hbWVUZXh0LnRleHQgPSBkYXRhLnlvdXJuYW1lO1xuICAgICAgICB0aGlzLm15QmFsbHMudGV4dCA9IGRhdGEubXliYWxscztcbiAgICAgICAgdGhpcy55b3VyQmFsbHMudGV4dCA9IGRhdGEueW91cmJhbGxzO1xuICAgICAgICB0aGlzLm15U2NvcmUudGV4dCA9IGRhdGEubXlzY29yZTtcbiAgICAgICAgdGhpcy55b3VyU2NvcmUudGV4dCA9IGRhdGEueW91cnNjb3JlO1xuXG4gICAgICAgIHRoaXMucGl2b3QodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgdGhpcy5wb3MoTGF5YS5zdGFnZS53aWR0aC8yLCBMYXlhLnN0YWdlLmhlaWdodC8yKTtcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuUmVzdWx0UGFnZTtcblxuICAgICAgICB0aGlzLmJhY2tCdG4ub24oTGF5YUV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLm9uQnRuQmFjayk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uQnRuQmFjaygpIHtcbiAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuYnV0dG9uXzAwMSk7XG4gICAgICAgIFxuICAgICAgICAvLyDlnLrmma/ovazmjaJcbiAgICAgICAgTWFpbi5JbnN0YW5jZS5iYWNrVG9NZW51KCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwb3MoKSB7XG4gICAgICAgIHRoaXMucG9zKExheWEuc3RhZ2Uud2lkdGgvMiwgTGF5YS5zdGFnZS5oZWlnaHQvMik7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZigpO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nYW1lb2JqZWN0L1Njb3JlUGFuZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdWkvdmlldy9SZXN1bHRQYWdlLnRzXCIgLz5cblxuLyoqXG4gKiDliIbmlbDnu5PmnoRcbiAqL1xuaW50ZXJmYWNlIFNjb3JlIHtcbiAgICBzY29yZTogbnVtYmVyO1xuICAgIGJhbGxzOiBudW1iZXI7XG4gICAgYnVsbGV0RXhwbG9zaW9uczogbnVtYmVyO1xufVxuXG4vKipcbiAqIOWIhuaVsOadg+mHjeiuvue9rlxuICovXG5jb25zdCBTY29yZUNvbmZpZyA9IHtcbiAgICBidWxsZXRFeHBsb3Npb25zOiAxLFxuICAgIGJhbGxzOiA4LFxuICAgIHdpbkJhbGxzOiAxMFxufVxuXG4vKipcbiAqIOW+l+WIhueuoeeQhuexu1xuICovXG5jbGFzcyBTY29yZU1hbmFnZXIge1xuICAgIHByaXZhdGUgX21zY29yZTogU2NvcmU7XG4gICAgcHJpdmF0ZSBfeXNjb3JlOiBTY29yZTtcbiAgICBwcml2YXRlIF9teVNjb3JlUGFuZWw6IFNjb3JlUGFuZWw7XG4gICAgcHJpdmF0ZSBfeW91clNjb3JlUGFuZWw6IFNjb3JlUGFuZWw7XG4gICAgcHJpdmF0ZSBfcmVzdWx0VmlldzogUmVzdWx0UGFnZTtcblxuICAgIHB1YmxpYyBtYmFsbHM6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHliYWxsczogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFNjb3JlTWFuYWdlcjtcbiAgICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpOiBTY29yZU1hbmFnZXIge1xuICAgICAgICBpZiAoU2NvcmVNYW5hZ2VyLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgIFNjb3JlTWFuYWdlci5pbnN0YW5jZSA9IG5ldyBTY29yZU1hbmFnZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU2NvcmVNYW5hZ2VyLmluc3RhbmNlO1xuICAgIH1cblxuICAgIGdldCBtc2NvcmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tc2NvcmU7XG4gICAgfVxuXG4gICAgZ2V0IHlzY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3lzY29yZTtcbiAgICB9XG5cbiAgICBnZXQgbXlTY29yZVBhbmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbXlTY29yZVBhbmVsO1xuICAgIH1cblxuICAgIGdldCB5b3VyU2NvcmVQYW5lbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3lvdXJTY29yZVBhbmVsO1xuICAgIH1cbiAgICBnZXQgcmVzdWx0VmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdFZpZXc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5aeL5YyW5YiG5pWw5ZKM5YiG5pWw5p2/XG4gICAgICovXG4gICAgcHVibGljIGluaXRTY29yZSgpIHtcblxuICAgICAgICAvLyDlj4zmlrnliIbmlbDmnb8g5Yid5aeL5YyW5YiG5pWwXG4gICAgICAgIHRoaXMuX21zY29yZSA9IHtzY29yZTogMCwgYmFsbHM6IDAsIGJ1bGxldEV4cGxvc2lvbnM6IDB9O1xuICAgICAgICB0aGlzLl95c2NvcmUgPSB7c2NvcmU6IDAsIGJhbGxzOiAwLCBidWxsZXRFeHBsb3Npb25zOiAwfTtcbiAgICAgICAgdGhpcy5fbXlTY29yZVBhbmVsID0gbmV3IFNjb3JlUGFuZWwoJ21pbmUnKTtcbiAgICAgICAgdGhpcy5feW91clNjb3JlUGFuZWwgPSBuZXcgU2NvcmVQYW5lbCgneW91cicpO1xuXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fbXlTY29yZVBhbmVsKTtcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl95b3VyU2NvcmVQYW5lbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5qC55o2u5pWw5o2u6K6+572u5YiG5pWwXG4gICAgICovXG4gICAgcHVibGljIHNldFNjb3Jlcyh0eXBlOiBzdHJpbmcsIGRhdGEpIHtcbiAgICAgICAgaWYodHlwZSA9PT0gJ21pbmUnKSB7XG4gICAgICAgICAgICB0aGlzLl9tc2NvcmUuYmFsbHMgPSBkYXRhLmJhbGxzO1xuICAgICAgICAgICAgdGhpcy5fbXNjb3JlLmJ1bGxldEV4cGxvc2lvbnMgPSBkYXRhLmV4cGxvc2lvbnM7XG4gICAgICAgICAgICB0aGlzLl9tc2NvcmUuc2NvcmUgPSBkYXRhLnNjb3JlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ3lvdXInKSB7XG4gICAgICAgICAgICB0aGlzLl95c2NvcmUuYmFsbHMgPSBkYXRhLmJhbGxzO1xuICAgICAgICAgICAgdGhpcy5feXNjb3JlLmJ1bGxldEV4cGxvc2lvbnMgPSBkYXRhLmV4cGxvc2lvbnM7XG4gICAgICAgICAgICB0aGlzLl95c2NvcmUuc2NvcmUgPSBkYXRhLnNjb3JlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOabtOaWsOWIhuaVsOaVsOaNruaYvuekulxuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGVTY29yZSgpIHtcbiAgICAgICAgdGhpcy5teVNjb3JlUGFuZWwudXBkYXRlU2NvcmUodGhpcy5fbXNjb3JlLnNjb3JlKTtcbiAgICAgICAgdGhpcy5teVNjb3JlUGFuZWwudXBkYXRlQmFsbHModGhpcy5fbXNjb3JlLmJhbGxzKTtcbiAgICAgICAgdGhpcy55b3VyU2NvcmVQYW5lbC51cGRhdGVTY29yZSh0aGlzLl95c2NvcmUuc2NvcmUpO1xuICAgICAgICB0aGlzLnlvdXJTY29yZVBhbmVsLnVwZGF0ZUJhbGxzKHRoaXMuX3lzY29yZS5iYWxscyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog56e76Zmk5YiG5pWw5pWw5o2u5pi+56S6XG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZVNjb3JlUGFuZWwoKSB7XG4gICAgICAgIGlmKHRoaXMubXlTY29yZVBhbmVsKSB0aGlzLm15U2NvcmVQYW5lbC5yZW1vdmUoKTtcbiAgICAgICAgaWYodGhpcy55b3VyU2NvcmVQYW5lbCkgdGhpcy55b3VyU2NvcmVQYW5lbC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliKTmlq3ov5vnkIPmlbDmmK/lkKbovr7liLDotZvngrlcbiAgICAgKi9cbiAgICBwdWJsaWMgY2hlY2tCYWxscyh3aG9zZWJhbGw6IHN0cmluZykge1xuICAgICAgICBpZih3aG9zZWJhbGwgPT09ICdtaW5lJyAmJiBTY29yZU1hbmFnZXIuSW5zdGFuY2UubWJhbGxzID49IFNjb3JlQ29uZmlnLndpbkJhbGxzKSB7XG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih3aG9zZWJhbGwgPT09ICd5b3VyJyAmJiBTY29yZU1hbmFnZXIuSW5zdGFuY2UueWJhbGxzID49IFNjb3JlQ29uZmlnLndpbkJhbGxzKSB7XG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrliIbmlbDnu5PnrpfnlYzpnaJcbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvd0dhbWVSZXN1bHQoZGF0YSkge1xuICAgICAgICBsZXQgbXlkYXRhLCB5b3VyZGF0YSwgbWluZGV4LCByZXN1bHQsIHJlO1xuXG4gICAgICAgIGRhdGEgPSBkYXRhLnNjb3JlcztcblxuICAgICAgICBpZih0aGlzLl9yZXN1bHRWaWV3KSB0aGlzLnJlc3VsdFZpZXcucmVtb3ZlKCk7XG5cbiAgICAgICAgLy8g5Yy56YWN5Ye66Ieq5bex55qE5YiG5pWwXG4gICAgICAgIGZvcihsZXQgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZihkYXRhW2ldLmlkID09PSBTb2NrZXQuSW5zdGFuY2UuZ2V0VWlkKCkpIHtcbiAgICAgICAgICAgICAgICBteWRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIG1pbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOWuuemUmeWkhOeQhlxuICAgICAgICBpZighbXlkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IHVzZXIgaWQgbm90IGV4aXN0IGluIHNjb3JlcyBkYXRhLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgeW91cmRhdGEgPSBkYXRhWzEgLSBtaW5kZXhdO1xuICAgICAgICByZXN1bHQgPSBteWRhdGEuc2NvcmUgPiB5b3VyZGF0YS5zY29yZT8gJ3dpbicgOiAobXlkYXRhLnNjb3JlIDwgeW91cmRhdGEuc2NvcmU/ICdsb3NlJyA6ICd0aWUnKTtcblxuICAgICAgICAvLyDmoLzlvI/ljJbmlbDmja5cbiAgICAgICAgcmUgPSB7XG4gICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgIG15bmFtZTogbXlkYXRhLm5hbWUsXG4gICAgICAgICAgICB5b3VybmFtZTogeW91cmRhdGEubmFtZSxcbiAgICAgICAgICAgIG15YmFsbHM6IG15ZGF0YS5iYWxscyxcbiAgICAgICAgICAgIHlvdXJiYWxsczogeW91cmRhdGEuYmFsbHMsXG4gICAgICAgICAgICBteXNjb3JlOiBteWRhdGEuc2NvcmUsXG4gICAgICAgICAgICB5b3Vyc2NvcmU6IHlvdXJkYXRhLnNjb3JlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8g5pi+56S65q+U6LWb57uT5p6cXG4gICAgICAgIHRoaXMuX3Jlc3VsdFZpZXcgPSBuZXcgUmVzdWx0UGFnZShyZSk7XG4gICAgICAgIHRoaXMuX3Jlc3VsdFZpZXcuc2NhbGUoMCwgMCk7XG5cbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9yZXN1bHRWaWV3KTtcblxuICAgICAgICAvL+OAgOaJp+ihjOWKqOeUu1xuICAgICAgICBUd2Vlbi50byh0aGlzLl9yZXN1bHRWaWV3LCB7c2NhbGVYOiAxLCBzY2FsZVk6IDF9LCA1MDAsIEVhc2VbJ2JhY2tPdXQnXSk7XG5cbiAgICAgICAgaWYocmVzdWx0ID09PSAnd2luJyB8fCByZXN1bHQgPT09ICd0aWUnKSBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5nYW1ld2luKTtcbiAgICAgICAgZWxzZSBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5nYW1lb3Zlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog56e76Zmk5YiG5pWw55WM6Z2iXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZVJlc3VsdFZpZXcoKSB7XG4gICAgICAgIGlmKHRoaXMuX3Jlc3VsdFZpZXcpIHRoaXMuX3Jlc3VsdFZpZXcucmVtb3ZlKCk7XG4gICAgfVxufSIsImNvbnN0IGNvbmZpZyA9IHtcbiAgICBnYW1lV2lkdGg6IDQ4MCxcbiAgICBnYW1lSGVpZ2h0OiA4MDAsXG5cbiAgICAvLyBzb2NrZXRTZXJ2ZXI6ICd3czovLzE5Mi4xNjguMi4xMTk6MzEwMCdcbiAgICAvLyBzb2NrZXRTZXJ2ZXI6ICd3czovLzEwNi43NS4xNDUuMTQwOjMxMDAnXG4gICAgc29ja2V0U2VydmVyOiAnd3M6Ly9sb2NhbGhvc3Q6MzEwMCdcbiAgICAvLyBzb2NrZXRTZXJ2ZXI6ICd3czovL3NvY2tldHNlcnZlci00MDFlZi5jb2RpbmcuaW8vJ1xufTsiLCIvKipcbiAqIOWfuuehgOeQg+exu1xuICovXG5jbGFzcyBCYXNlQmFsbCBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xuICAgIHByb3RlY3RlZCBfcmFkaXVzOiBudW1iZXI7XG5cbiAgICBwcm90ZWN0ZWQgX3Z4OiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIF92eTogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBfbmV4dFg6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgX25leHRZOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBnZXQgcmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzO1xuICAgIH1cblxuICAgIGdldCB2eCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Z4O1xuICAgIH1cblxuICAgIGdldCB2eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Z5O1xuICAgIH1cblxuICAgIHNldCB2eCh2Om51bWJlcikge1xuICAgICAgICB0aGlzLl92eCA9IHY7XG4gICAgfVxuXG4gICAgc2V0IHZ5KHY6bnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3Z5ID0gdjtcbiAgICB9XG59IiwiXG5jb25zdCBCYWxsQXR0ciA9IHtcbiAgICB3aWR0aDogNzQsXG4gICAgaGVpZ2h0OiA3NCxcbiAgICBpbWdXaWR0aDogOTAsXG4gICAgaW1nSGVpZ2h0OiA5MCxcbiAgICB2ZWxvY2l0eTogNixcbiAgICB3ZWlnaHQ6IDIuMlxufVxuXG4vKipcbiAqIOavlOi1m+eQg+exuzBcbiAqL1xuY2xhc3MgQmFsbCBleHRlbmRzIEJhc2VCYWxsIHtcbiAgICAvLyDmkanmk6bliptcbiAgICBwcml2YXRlIF9mcmljdGlvbjogbnVtYmVyID0gMC4wMTtcbiAgICAvLyDml4vovazmlrnlkJEgLTHvvJrpgIbml7bpkoggMe+8mumhuuaXtumSiCAw77ya5LiN5peL6L2sXG4gICAgcHJpdmF0ZSBfcm9EaXJlY3Rpb246IG51bWJlciA9IDA7XG4gICAgLy8g5pa55ZCR5ZCM5q2l6L6F5Yqp5YC8XG4gICAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBudW1iZXI7XG4gICAgLy8g55CD55qE54q25oCBIDHvvJog5q2j5bi4IDLvvJrkuIvpmY3liqjnlLvkuK0gIDM6IOWBnOatoueKtuaAgVxuICAgIHByaXZhdGUgX3N0YXR1czogbnVtYmVyID0gMTtcbiAgICAvLyDliqjnlLvmiafooYzml7bliLvovoXliqnlgLxcbiAgICBwcml2YXRlIF9hbmltVGltZTogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF93ZWlnaHQ6IG51bWJlcjtcblxuICAgIHByaXZhdGUgX2ZhbGxQb3NMaXN0OiBudW1iZXJbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoZGlyZWN0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmdyYXBoaWNzLmxvYWRJbWFnZShBc3NldHMuSW1nLmJhbGwpO1xuICAgICAgICB0aGlzLnBpdm90KEJhbGxBdHRyLmltZ1dpZHRoIC8gMiwgQmFsbEF0dHIuaW1nSGVpZ2h0IC8gMik7XG4gICAgICAgIHRoaXMuc2l6ZShCYWxsQXR0ci53aWR0aCwgQmFsbEF0dHIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQmFsbDtcbiAgICAgICAgdGhpcy5wb3NDZW50ZXIoKTtcblxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMuX3JhZGl1cyA9IEJhbGxBdHRyLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5pbml0VmVsb2NpdHkoKTtcblxuICAgICAgICB0aGlzLl93ZWlnaHQgPSBCYWxsQXR0ci53ZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0IHJvRGlyZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm9EaXJlY3Rpb247XG4gICAgfVxuXG4gICAgc2V0IHJvRGlyZWN0aW9uKGQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9yb0RpcmVjdGlvbiA9IGQ7XG4gICAgfVxuXG4gICAgZ2V0IHdlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlaWdodDtcbiAgICB9XG4gICAgc2V0IHdlaWdodCh3OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fd2VpZ2h0ID0gdztcbiAgICB9XG5cbiAgICBzZXQgZGlyZWN0aW9uKGQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOW4p+abtOaWsFxuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGUoKSB7XG5cbiAgICAgICAgLy8g5LiN5ZCM54q25oCB5LiL55qE5Yqo5L2cXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbkluU3RhdHVzKCkpIHJldHVybjtcblxuICAgICAgICB0aGlzLnggPSBVdGlscy5mbG9hdE4odGhpcy54ICsgdGhpcy5fdngpO1xuICAgICAgICB0aGlzLnkgPSBVdGlscy5mbG9hdE4odGhpcy55ICsgdGhpcy5fdnkpO1xuXG4gICAgICAgIC8vIOiHquaXi+i9rFxuICAgICAgICBpZiAodGhpcy5fcm9EaXJlY3Rpb24gIT09IDApIHtcbiAgICAgICAgICAgIGxldCBydiA9IFV0aWxzLmZsb2F0TihNYXRoLnNxcnQoTWF0aC5wb3codGhpcy5fdngsIDIpICsgTWF0aC5wb3codGhpcy5fdnksIDIpKSAqIDIpO1xuXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbiArICh0aGlzLl9yb0RpcmVjdGlvbiA8IDAgPyAtMSA6IDEpICogcnY7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDotornlYxcbiAgICAgICAgdGhpcy5fbmV4dFggPSB0aGlzLnggKyB0aGlzLl92eDtcbiAgICAgICAgdGhpcy5fbmV4dFkgPSB0aGlzLnkgKyB0aGlzLl92eTtcblxuICAgICAgICAvLyDnorDliLDkuKTovrnnmoTlopnlo4FcbiAgICAgICAgaWYgKHRoaXMuX25leHRYIDwgQmFsbEF0dHIud2lkdGggLyAyIHx8IHRoaXMuX25leHRYID4gY29uZmlnLmdhbWVXaWR0aCAtIEJhbGxBdHRyLndpZHRoIC8gMikge1xuICAgICAgICAgICAgdGhpcy54ID0gKHRoaXMuX25leHRYIDwgQmFsbEF0dHIud2lkdGggLyAyKSA/IEJhbGxBdHRyLndpZHRoIC8gMiA6IGNvbmZpZy5nYW1lV2lkdGggLSBCYWxsQXR0ci53aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLl92eCAqPSAtMTtcbiAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmhpdF8wMDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6L+b5YWl5bex5pa55oiW5a+55pa555qE6b6Z6ZeoXG4gICAgICAgIGxldCB3aG9zZWJhbGwgPSB0aGlzLl9uZXh0WSA8IC01MCA/ICdtaW5lJyA6ICd5b3VyJztcbiAgICAgICAgaWYgKHRoaXMuX25leHRZIDwgLTUwIHx8IHRoaXMuX25leHRZID4gY29uZmlnLmdhbWVIZWlnaHQgKyA1MCkge1xuICAgICAgICAgICAgdGhpcy52eCA9IDA7XG4gICAgICAgICAgICB0aGlzLnZ5ID0gMDtcblxuICAgICAgICAgICAgbGV0IGdhbWUgPSBHYW1lLkluc3RhbmNlO1xuXG4gICAgICAgICAgICBnYW1lLnN0YXR1cyA9IDA7XG5cbiAgICAgICAgICAgIC8vIOS9v+e8k+WtmOS4reeahOWtkOW8ueeIhueCuFxuICAgICAgICAgICAgQnVsbGV0LmJvb21BbGxCdWxsZXRzKCk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2UuX2NoaWxkcykge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jbGFzc05hbWUgJiYgY2hpbGQuY2xhc3NOYW1lID09PSAnQnVsbGV0JykgTWFpbi5JbnN0YW5jZS5nYW1lUGFnZS5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOa4heeQhuacquWujOaIkOeahOiuoeaXtuWZqOS7u+WKoVxuICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS50aW1lci5jbGVhclRhc2tMaXN0KCk7XG5cbiAgICAgICAgICAgIC8vIOi/m+eQg+W+l+WIhlxuICAgICAgICAgICAgaWYgKHRoaXMuX25leHRZIDwgLTUwKSB7XG4gICAgICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLm1iYWxscysrO1xuICAgICAgICAgICAgICAgIFNvY2tldC5JbnN0YW5jZS5iYWxsSW4oKTtcbiAgICAgICAgICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5tc2NvcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnliYWxscysrO1xuICAgICAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLnlzY29yZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIpOaWreaYr+WQpue7k+adn+avlOi1m1xuICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLmNoZWNrQmFsbHMod2hvc2ViYWxsKTtcblxuICAgICAgICAgICAgLy8g5bu26L+f5LiA5q615pe26Ze05ZCO5omn6KGM5o6J6JC95Yqo55S7XG4gICAgICAgICAgICB0aGlzLl9hbmltVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSAzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5pGp5pOm5YeP6YCfXG4gICAgICAgIGxldCBmeCA9IFV0aWxzLmZsb2F0TihNYXRoLmFicyh0aGlzLl9mcmljdGlvbiAqIHRoaXMudnggLyBCYWxsQXR0ci52ZWxvY2l0eSkpO1xuICAgICAgICBsZXQgZnkgPSBVdGlscy5mbG9hdE4oTWF0aC5hYnModGhpcy5fZnJpY3Rpb24gKiB0aGlzLnZ5IC8gQmFsbEF0dHIudmVsb2NpdHkpKTtcblxuICAgICAgICB0aGlzLl92eCA9IE1hdGguYWJzKHRoaXMuX3Z4KSA8IDAuMSA/IDAgOiBVdGlscy5mbG9hdE4odGhpcy5fdnggPiAwID8gdGhpcy5fdnggLSBmeCA6IHRoaXMuX3Z4ICsgZngpO1xuICAgICAgICB0aGlzLl92eSA9IE1hdGguYWJzKHRoaXMuX3Z5KSA8IDAuMSA/IDAgOiBVdGlscy5mbG9hdE4odGhpcy5fdnkgPiAwID8gdGhpcy5fdnkgLSBmeSA6IHRoaXMuX3Z5ICsgZnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiuoeeul+aXi+i9rOaWueWQkVxuICAgICAqIEBwYXJhbSB4IOWtkOW8ueeahHjkvY3nva5cbiAgICAgKiBAcGFyYW0geSDlrZDlvLnnmoR55L2N572uXG4gICAgICogQHBhcmFtIHZ4IOWtkOW8ueeahHjpgJ/luqZcbiAgICAgKiBAcGFyYW0gdnkg5a2Q5by555qEeemAn+W6plxuICAgICAqL1xuICAgIHB1YmxpYyBjb21wUkRpcmVjdGlvbih4OiBudW1iZXIsIHk6IG51bWJlciwgdng6IG51bWJlciwgdnk6IG51bWJlcikge1xuICAgICAgICBsZXQgcCA9IFV0aWxzLnBvc1RvTGluZSh0aGlzLngsIHRoaXMueSwgeCwgeSwgdngsIHZ5KTtcbiAgICAgICAgaWYgKCh2eCA8PSAwICYmIHZ5IDw9IDApIHx8ICh2eCA8IDAgJiYgdnkgPj0gMCkpIHtcbiAgICAgICAgICAgIGlmIChwID4gMCkgdGhpcy5yb0RpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICBpZiAocCA8IDApIHRoaXMucm9EaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgodnggPiAwICYmIHZ5IDwgMCkgfHwgKHZ4ID49IDAgJiYgdnkgPiAwKSkge1xuICAgICAgICAgICAgaWYgKHAgPiAwKSB0aGlzLnJvRGlyZWN0aW9uID0gLTE7XG4gICAgICAgICAgICBpZiAocCA8IDApIHRoaXMucm9EaXJlY3Rpb24gPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnbG9iYWwuc3luKSB0aGlzLnJvRGlyZWN0aW9uICo9IC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMlumAn+W6puWQkemHj1xuICAgICAqL1xuICAgIHB1YmxpYyBpbml0VmVsb2NpdHkoKSB7XG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKEJhbGxBdHRyLnZlbG9jaXR5ICogTWF0aC5yb3VuZChNYXRoLnNpbig5MCAqIE1hdGguUEkgLyAxODApKSAqICh0aGlzLl9kaXJlY3Rpb24gPT09IDAgPyAtMSA6IDEpKTtcbiAgICAgICAgdGhpcy5fdnkgPSBVdGlscy5mbG9hdE4oLTEgKiBCYWxsQXR0ci52ZWxvY2l0eSAqIE1hdGgucm91bmQoTWF0aC5jb3MoOTAgKiBNYXRoLlBJIC8gMTgwKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWumuS9jeWIsOS4reW/g1xuICAgICAqL1xuICAgIHB1YmxpYyBwb3NDZW50ZXIoKSB7XG4gICAgICAgIHRoaXMucG9zKGNvbmZpZy5nYW1lV2lkdGggLyAyLCBjb25maWcuZ2FtZUhlaWdodCAvIDIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4jeWQjOeKtuaAgeS4i+eahOWKqOS9nFxuICAgICAqL1xuICAgIHByaXZhdGUgYWN0aW9uSW5TdGF0dXMoKSB7XG5cbiAgICAgICAgLy8g5YGc5q2i5LiA5q615pe26Ze05ZCO5omn6KGM5o6J6JC95Yqo55S7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0dXMgPT09IDMpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1UaW1lICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5fYW5pbVRpbWUgPiAzMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmFsbERvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5LiL6ZmN5Yqo55S7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0dXMgPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBlYXNlVmFsdWUgPSBFYXNlLmJvdW5jZU91dCh0aGlzLl9hbmltVGltZSwgNSwgLTQsIDEwMDApO1xuICAgICAgICAgICAgdGhpcy5fYW5pbVRpbWUgKz0gMTY7XG4gICAgICAgICAgICB0aGlzLnNjYWxlKGVhc2VWYWx1ZSwgZWFzZVZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuX2ZhbGxQb3NMaXN0LnB1c2goZWFzZVZhbHVlKTtcblxuICAgICAgICAgICAgLy8g5Yik5pat5pyA5L2O54K55pe25pKt5pS+5aOw6Z+zXG4gICAgICAgICAgICBpZiAodGhpcy5fZmFsbFBvc0xpc3QubGVuZ3RoID4gMykgdGhpcy5fZmFsbFBvc0xpc3Quc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9mYWxsUG9zTGlzdFsxXSA8IHRoaXMuX2ZhbGxQb3NMaXN0WzBdICYmIHRoaXMuX2ZhbGxQb3NMaXN0WzFdIDwgdGhpcy5fZmFsbFBvc0xpc3RbMl0pIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmhpdF8wMDIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYW5pbVRpbWUgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IEdhbWUuSW5zdGFuY2UuZ2V0QmFsbERpcmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUoMSwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb0RpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gR2FtZS5JbnN0YW5jZS5iYWxsRGlyZWN0aW9uRmFjdG9yPyBkaXJlY3Rpb24gOiAxIC0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFZlbG9jaXR5KCk7XG4gICAgICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS5zdGF0dXMgPSAxO1xuICAgICAgICAgICAgICAgIEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lci51bmxvY2soKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWxsUG9zTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmiafooYzmjonokL3liqjnlLtcbiAgICAgKi9cbiAgICBwdWJsaWMgZmFsbERvd24oKSB7XG4gICAgICAgIHRoaXMuX2FuaW1UaW1lID0gMDtcbiAgICAgICAgdGhpcy5wb3NDZW50ZXIoKTtcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gMjtcbiAgICAgICAgdGhpcy53ZWlnaHQgPSBCYWxsQXR0ci53ZWlnaHQ7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNOb3JtYWxTdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXMgPT09IDE7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZyb3plbigpIHtcblxuICAgICAgICBsZXQgaWNlID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICBpY2UubG9hZEltYWdlKEFzc2V0cy5JbWcuYmFsbF9lZmZlY3RfaWNlKTtcbiAgICAgICAgaWNlLnBpdm90KDQxLCA0MSk7XG4gICAgICAgIGljZS54ID0gNDU7XG4gICAgICAgIGljZS55ID0gNDU7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGljZSk7XG4gICAgICAgIHRoaXMud2VpZ2h0ID0gODtcbiAgICAgICAgaWYgKGdsb2JhbC5zeW4pIHtcbiAgICAgICAgICAgIHRoaXMudnggPSBVdGlscy5mbG9hdE4odGhpcy52eCAvIHRoaXMud2VpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMudnkgPSBVdGlscy5mbG9hdE4odGhpcy52eSAvIHRoaXMud2VpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudnggPSBVdGlscy5mbG9hdE4oKHRoaXMudnggKiAtMSkgLyB0aGlzLndlaWdodCk7XG4gICAgICAgICAgICB0aGlzLnZ5ID0gVXRpbHMuZmxvYXROKCh0aGlzLnZ5ICogLTEpIC8gdGhpcy53ZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy52eCAqPSAtMTtcbiAgICAgICAgICAgIHRoaXMudnkgKj0gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLmNsZWFyVGFza0J5TmFtZSgnZnJvemVuJyk7XG4gICAgICAgIEdhbWUuSW5zdGFuY2UudGltZXIuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndlaWdodCA9IEJhbGxBdHRyLndlaWdodDtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgfSwgMzAwLCB0aGlzLCAnZnJvemVuJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWxlYXNlKCkge1xuICAgICAgICB0aGlzLndlaWdodCA9IEJhbGxBdHRyLndlaWdodDtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xuICAgIH1cbn1cbiIsIlxuLyoqXG4gKiDlrZDlvLnnsbtcbiAqL1xuY2xhc3MgQnVsbGV0IGV4dGVuZHMgQmFzZUJhbGwge1xuICAgIC8qKlxuICAgICAqIOWtkOW8ueexu+WeiyDlrZDlvLnmiYDlsZ7mlrlcbiAgICAgKiBtYnVsbGV0IC8geWJ1bGxldFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfb3duZXI6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX3R5cGU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiDlrZDlvLnnvJPlrZjpmJ/liJdcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG15QnVsbGV0czogQXJyYXk8QnVsbGV0PiA9IFtdO1xuICAgIHB1YmxpYyBzdGF0aWMgeW91ckJ1bGxldHM6IEFycmF5PEJ1bGxldD4gPSBbXTtcblxuICAgIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZyA9ICdCdWxsZXQnO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQnVsbGV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7juWvueixoeaxoOS4reWPluS4gOS4quWunuS+i1xuICAgICAqIEBwYXJhbSBhbmdsZSDnlJ/miJDlrZDlvLnnmoTop5LluqZcbiAgICAgKiBAcGFyYW0gcG93ZXIg55Sf5oiQ5a2Q5by555qE5Yid5aeL5Yqb5bqmXG4gICAgICogQHBhcmFtIHR5cGUg5a2Q5by555qE57G75Z6LXG4gICAgICogICAgICBTdGFuZGFyZEJ1bGxldCDmoIflh4blrZDlvLlcbiAgICAgKiAgICAgIEljZUJ1bGxldCDlhrDlhrvlvLlcbiAgICAgKiAgICAgIERpdmlzaW9uQnVsbGV0IOWIhuijguW8uVxuICAgICAqICAgICAgU21va2VCdWxsZXQg54Of6Zu+5by5XG4gICAgICogICAgICBCb21iQnVsbGV0IOW3qOWei+eCuOW8uVxuICAgICAqIEBwYXJhbSBvd25lciDlrZDlvLnnmoTmiYDlsZ7mlrlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIHR5cGU6IHN0cmluZywgb3duZXI6IHN0cmluZykge1xuXG4gICAgICAgIGxldCBidWxsZXQgPSBQb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bih0eXBlLCAoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdTdGFuZGFyZEJ1bGxldCc6XG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gJ3NlbGYnKSByZXR1cm4gbmV3IFN0YW5kYXJkQnVsbGV0KCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG93bmVyID09PSAnb3Bwb25lbnQnKSByZXR1cm4gbmV3IFN0YW5kYXJkQnVsbGV0KCk7XG4gICAgICAgICAgICAgICAgY2FzZSAnSWNlQnVsbGV0JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJY2VCdWxsZXQoKTtcbiAgICAgICAgICAgICAgICBjYXNlICdEaXZpc2lvbkJ1bGxldCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGl2aXNpb25CdWxsZXQoKTtcbiAgICAgICAgICAgICAgICBjYXNlICdEaXZpc2lvbkNoaWxkQnVsbGV0JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEaXZpc2lvbkNoaWxkQnVsbGV0KCk7XG4gICAgICAgICAgICAgICAgY2FzZSAnU21va2VCdWxsZXQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNtb2tlQnVsbGV0KCk7XG4gICAgICAgICAgICAgICAgY2FzZSAnQm9tYkJ1bGxldCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQm9tYkJ1bGxldCgpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHsgY29uc29sZS5sb2coJ25vdCBleGlzdCBidWxsZXQgdHlwZS4nKTsgcmV0dXJuIG5ldyBTdGFuZGFyZEJ1bGxldCgpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJ1bGxldC5pbml0KGFuZ2xlLCBwb3dlciwgb3duZXIpO1xuXG4gICAgICAgIC8vIOWtmOaUvuWIsOWvueW6lOeahOaVsOe7hOS4rVxuICAgICAgICBpZiAob3duZXIgPT09ICdzZWxmJykgQnVsbGV0Lm15QnVsbGV0cy5wdXNoKGJ1bGxldCk7XG4gICAgICAgIGVsc2UgaWYgKG93bmVyID09PSAnb3Bwb25lbnQnKSBCdWxsZXQueW91ckJ1bGxldHMucHVzaChidWxsZXQpO1xuXG4gICAgICAgIHJldHVybiBidWxsZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5aeL5YyW5a2Q5by5XG4gICAgICogQHBhcmFtIGFuZ2xlIOinkuW6plxuICAgICAqIEBwYXJhbSB2ZWxvY2l0eSDliJ3lp4vpgJ/luqZcbiAgICAgKiBAcGFyYW0gdHlwZSDlrZDlvLnnsbvlnovvvIhtYnVsbGV0OuaIkeeahOWtkOW8ue+8jHlidWxsZXQ65a+55pa555qE5a2Q5by5KVxuICAgICAqIEBwYXJhbSBwb3dlciDlipvluqYgMCB+IDFcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdChhbmdsZTogbnVtYmVyLCBwb3dlcjogbnVtYmVyLCBvd25lcjogc3RyaW5nKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5bin6YC76L6RXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZSgpIHtcblxuICAgICAgICAvLyAg56Kw5pKe5qOA5rWLXG4gICAgICAgIHRoaXMuY29sbGlzaW9uKCk7XG5cbiAgICAgICAgdGhpcy54ID0gVXRpbHMuZmxvYXROKHRoaXMueCArIHRoaXMuX3Z4KTtcbiAgICAgICAgdGhpcy55ID0gVXRpbHMuZmxvYXROKHRoaXMueSArIHRoaXMuX3Z5KTtcblxuICAgICAgICAvLyDotornlYxcbiAgICAgICAgdGhpcy5fbmV4dFggPSB0aGlzLnggKyB0aGlzLl92eDtcbiAgICAgICAgdGhpcy5fbmV4dFkgPSB0aGlzLnkgKyB0aGlzLl92eTtcblxuICAgICAgICBpZiAodGhpcy5fbmV4dFggPCB0aGlzLndpZHRoIC8gMiB8fCB0aGlzLl9uZXh0WCA+IGNvbmZpZy5nYW1lV2lkdGggLSB0aGlzLndpZHRoIC8gMikge1xuICAgICAgICAgICAgdGhpcy54ID0gKHRoaXMuX25leHRYIDwgdGhpcy53aWR0aCAvIDIpID8gdGhpcy53aWR0aCAvIDIgOiBjb25maWcuZ2FtZVdpZHRoIC0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLl92eCAqPSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnkgPCAtMSAqIHRoaXMud2lkdGggLyAyIHx8IHRoaXMueSA+IGNvbmZpZy5nYW1lSGVpZ2h0ICsgdGhpcy5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeisOaSnuajgOa1i1xuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsaXNpb24oKSB7XG4gICAgICAgIGxldCBidWxsZXRzO1xuICAgICAgICBsZXQgYmFsbCA9IEdhbWUuSW5zdGFuY2UuYmFsbDtcblxuICAgICAgICAvLyDmo4DmtYvlrZDlvLnkuYvpl7TnmoTnorDmkp4g5qC55o2uc3lu5ZCM5q2l5YC856Gu5a6a5Lul5ZOq5pa55a2Q5by55L2c5Li656Kw5pKe5qOA5rWL5Li75L2TXG4gICAgICAgIGlmICh0aGlzLl9vd25lciA9PT0gJ3NlbGYnICYmIGdsb2JhbC5zeW4gPT09IDApIHtcbiAgICAgICAgICAgIGJ1bGxldHMgPSBCdWxsZXQueW91ckJ1bGxldHM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGIgb2YgYnVsbGV0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uQnVsbGV0cyh0aGlzLCBiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9vd25lciA9PT0gJ29wcG9uZW50JyAmJiBnbG9iYWwuc3luID09PSAxKSB7XG4gICAgICAgICAgICBidWxsZXRzID0gQnVsbGV0Lm15QnVsbGV0cztcblxuICAgICAgICAgICAgZm9yIChsZXQgYiBvZiBidWxsZXRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25CdWxsZXRzKHRoaXMsIGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5qOA5rWL5a2Q5by55LiO55CD5LmL6Ze055qE56Kw5pKeXG4gICAgICAgIHRoaXMuY29sbGlzaW9uQmFsbChiYWxsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDorqHnrpfkuKTlrZDlvLnnorDmkp7lkI7nmoTniannkIbov5DliqhcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY29sbGlzaW9uQnVsbGV0cyhvYmplY3QxOiBCdWxsZXQsIG9iamVjdDI6IEJ1bGxldCkge1xuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XG5cbiAgICAgICAgLy8g5LiL5LiA5bin55qE5L2N572uXG4gICAgICAgIGxldCBuZXh0T2JqZWN0MSA9IHtcbiAgICAgICAgICAgIHg6IG9iamVjdDEueCArIG9iamVjdDEudngsXG4gICAgICAgICAgICB5OiBvYmplY3QxLnkgKyBvYmplY3QxLnZ5LFxuICAgICAgICAgICAgcmFkaXVzOiBvYmplY3QxLnJhZGl1c1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBuZXh0T2JqZWN0MiA9IHtcbiAgICAgICAgICAgIHg6IG9iamVjdDIueCArIG9iamVjdDIudngsXG4gICAgICAgICAgICB5OiBvYmplY3QyLnkgKyBvYmplY3QyLnZ5LFxuICAgICAgICAgICAgcmFkaXVzOiBvYmplY3QyLnJhZGl1c1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChVdGlscy5pc0NpcmNsZUNvbGxpc2lvbihuZXh0T2JqZWN0MSwgbmV4dE9iamVjdDIpKSB7XG4gICAgICAgICAgICBbb2JqZWN0MS54LCBvYmplY3QxLnksIG9iamVjdDIueCwgb2JqZWN0Mi55XSA9IFV0aWxzLmZpeENvbGxpc2lvbihVdGlscy5wKG9iamVjdDEueCwgb2JqZWN0MS55KSwgVXRpbHMucChvYmplY3QyLngsIG9iamVjdDIueSksIG9iamVjdDEucmFkaXVzLCBvYmplY3QyLnJhZGl1cywgY29udmVydCk7XG5cbiAgICAgICAgICAgIFtvYmplY3QxLnZ4LCBvYmplY3QxLnZ5LCBvYmplY3QyLnZ4LCBvYmplY3QyLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKG9iamVjdDEueCwgb2JqZWN0MS55KSwgVXRpbHMucChvYmplY3QyLngsIG9iamVjdDIueSksIHsgdng6IG9iamVjdDEudngsIHZ5OiBvYmplY3QxLnZ5IH0sIHsgdng6IG9iamVjdDIudngsIHZ5OiBvYmplY3QyLnZ5IH0sIGNvbnZlcnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K6h566X5a2Q5by55ZKM55CD56Kw5pKe5ZCO55qE54mp55CG6L+Q5YqoXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNvbGxpc2lvbkJhbGwoYmFsbDogQmFsbCkge1xuXG4gICAgICAgIC8vIOS4i+S4gOS9jee9rlxuICAgICAgICBsZXQgbmV4dE9iamVjdDEgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnggKyB0aGlzLnZ4LFxuICAgICAgICAgICAgeTogdGhpcy55ICsgdGhpcy52eSxcbiAgICAgICAgICAgIHJhZGl1czogdGhpcy5yYWRpdXNcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgbmV4dE9iamVjdDIgPSB7XG4gICAgICAgICAgICB4OiBiYWxsLnggKyBiYWxsLnZ4LFxuICAgICAgICAgICAgeTogYmFsbC55ICsgYmFsbC52eSxcbiAgICAgICAgICAgIHJhZGl1czogYmFsbC5yYWRpdXNcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoVXRpbHMuaXNDaXJjbGVDb2xsaXNpb24obmV4dE9iamVjdDEsIG5leHRPYmplY3QyKSkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVCYWxsUGh5c2ljcyhiYWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVCYWxsUGh5c2ljcyhiYWxsOiBCYWxsKSB7XG5cbiAgICAgICAgdGhpcy5maXhCYWxsUG9zaXRpb24oYmFsbCk7XG5cbiAgICAgICAgLy8g6K6h566X55CD55qE5peL6L2s5pa55ZCRXG4gICAgICAgIGJhbGwuY29tcFJEaXJlY3Rpb24odGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQmFsbFZlbG9jaXR5KGJhbGwpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmaXhCYWxsUG9zaXRpb24oYmFsbDogQmFsbCkge1xuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XG5cbiAgICAgICAgW3RoaXMueCwgdGhpcy55LCBiYWxsLngsIGJhbGwueV0gPSBVdGlscy5maXhDb2xsaXNpb24oVXRpbHMucCh0aGlzLngsIHRoaXMueSksIFV0aWxzLnAoYmFsbC54LCBiYWxsLnkpLCB0aGlzLnJhZGl1cywgYmFsbC5yYWRpdXMsIGNvbnZlcnQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVCYWxsVmVsb2NpdHkoYmFsbDogQmFsbCkge1xuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XG5cbiAgICAgICAgW3RoaXMudngsIHRoaXMudnksIGJhbGwudngsIGJhbGwudnldID0gVXRpbHMuY29tcEJhbGxSZWJvdW5kKFV0aWxzLnAodGhpcy54LCB0aGlzLnkpLCBVdGlscy5wKGJhbGwueCwgYmFsbC55KSwgeyB2eDogdGhpcy52eCwgdnk6IHRoaXMudnkgfSwgeyB2eDogYmFsbC52eCwgdnk6IGJhbGwudnkgfSwgY29udmVydCk7XG5cbiAgICAgICAgdGhpcy5zaW11bGF0ZVdlaWdodChiYWxsKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltdWxhdGVXZWlnaHQoYmFsbDogQmFsbCkge1xuICAgICAgICAvLyDlr7nnkIPov5vooYzlh4/pgJ/lpITnkIbvvIzmqKHmi5/lsI/nkIPnmoTph43ph49cbiAgICAgICAgaWYgKGdsb2JhbC5zeW4pIHtcbiAgICAgICAgICAgIGJhbGwudnggPSBVdGlscy5mbG9hdE4oYmFsbC52eCAvIGJhbGwud2VpZ2h0KTtcbiAgICAgICAgICAgIGJhbGwudnkgPSBVdGlscy5mbG9hdE4oYmFsbC52eSAvIGJhbGwud2VpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJhbGwudnggPSBVdGlscy5mbG9hdE4oKGJhbGwudnggKiAtMSkgLyBiYWxsLndlaWdodCk7XG4gICAgICAgICAgICBiYWxsLnZ5ID0gVXRpbHMuZmxvYXROKChiYWxsLnZ5ICogLTEpIC8gYmFsbC53ZWlnaHQpO1xuICAgICAgICAgICAgYmFsbC52eCAqPSAtMTtcbiAgICAgICAgICAgIGJhbGwudnkgKj0gLTE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkvb/nvJPlrZjpmJ/liJfkuK3miYDmnInlrZDlvLnniIbngrhcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGJvb21BbGxCdWxsZXRzKCkge1xuICAgICAgICB3aGlsZSAoQnVsbGV0Lm15QnVsbGV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBCdWxsZXQubXlCdWxsZXRzWzBdLnJlbGVhc2VBY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoQnVsbGV0LnlvdXJCdWxsZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIEJ1bGxldC55b3VyQnVsbGV0c1swXS5yZWxlYXNlQWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpgIDlnLrliqjkvZxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVsZWFzZUFjdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Zue5pS25a2Q5by5XG4gICAgICovXG4gICAgcHVibGljIHJlbGVhc2UoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUFycigpO1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICAgICAgUG9vbC5yZWNvdmVyKHRoaXMuX3R5cGUsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7juWFqOWxgOaVsOe7hOS4reWIoOmZpFxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVGcm9tQXJyKCkge1xuICAgICAgICBsZXQgbGlzdDtcblxuICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJykge1xuICAgICAgICAgICAgbGlzdCA9IEJ1bGxldC5teUJ1bGxldHM7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShsaXN0LmluZGV4T2YodGhpcyksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX293bmVyID09PSAnb3Bwb25lbnQnKSB7XG4gICAgICAgICAgICBsaXN0ID0gQnVsbGV0LnlvdXJCdWxsZXRzO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UobGlzdC5pbmRleE9mKHRoaXMpLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJjb25zdCBTdGFuZGFyZEJ1bGxldEF0dHIgPSB7XG4gICAgd2lkdGg6IDQwLFxuICAgIGhlaWdodDogNDAsXG4gICAgaW1nV2lkdGg6IDM5LFxuICAgIGltZ0hlaWdodDogMzksXG4gICAgdmVsb2NpdHk6IDIwXG59XG5cbmNsYXNzIFN0YW5kYXJkQnVsbGV0IGV4dGVuZHMgQnVsbGV0IHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnc3RhbmRhcmQnO1xuXG4gICAgICAgIHRoaXMucGl2b3QoU3RhbmRhcmRCdWxsZXRBdHRyLmltZ1dpZHRoIC8gMiwgU3RhbmRhcmRCdWxsZXRBdHRyLmltZ0hlaWdodCAvIDIpO1xuICAgICAgICB0aGlzLnNpemUoU3RhbmRhcmRCdWxsZXRBdHRyLndpZHRoLCBTdGFuZGFyZEJ1bGxldEF0dHIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gU3RhbmRhcmRCdWxsZXRBdHRyLndpZHRoIC8gMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliJ3lp4vljJblrZDlvLlcbiAgICAgKiBAcGFyYW0gYW5nbGUg6KeS5bqmXG4gICAgICogQHBhcmFtIHZlbG9jaXR5IOWIneWni+mAn+W6plxuICAgICAqIEBwYXJhbSB0eXBlIOWtkOW8ueexu+Wei++8iG1idWxsZXQ65oiR55qE5a2Q5by577yMeWJ1bGxldDrlr7nmlrnnmoTlrZDlvLkpXG4gICAgICogQHBhcmFtIHBvd2VyIOWKm+W6piAwIH4gMVxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIG93bmVyOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHYgPSBVdGlscy5mbG9hdE4oU3RhbmRhcmRCdWxsZXRBdHRyLnZlbG9jaXR5IC0gKDEgLSBwb3dlcikgKiAxMik7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1hZ2Uob3duZXIgPT09ICdzZWxmJyA/IEFzc2V0cy5JbWcuYnVsbGV0bSA6IG93bmVyID09PSAnb3Bwb25lbnQnID8gQXNzZXRzLkltZy5idWxsZXR5IDogJycpO1xuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLl92eCA9IFV0aWxzLmZsb2F0TigodiAqIE1hdGguc2luKGFuZ2xlICogTWF0aC5QSSAvIDE4MCkpKTtcbiAgICAgICAgdGhpcy5fdnkgPSBVdGlscy5mbG9hdE4oKC0xICogdiAqIE1hdGguY29zKGFuZ2xlICogTWF0aC5QSSAvIDE4MCkpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZml4QmFsbFBvc2l0aW9uKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGNvbnZlcnQgPSBnbG9iYWwuc3luID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgIFt0aGlzLngsIHRoaXMueSwgYmFsbC54LCBiYWxsLnldID0gVXRpbHMuZml4Q29sbGlzaW9uKFV0aWxzLnAodGhpcy54LCB0aGlzLnkpLCBVdGlscy5wKGJhbGwueCwgYmFsbC55KSwgdGhpcy5yYWRpdXMsIGJhbGwucmFkaXVzLCBjb252ZXJ0KTtcblxuICAgICAgICAvLyDorqHnrpfnkIPlv4PliLDnm7Tnur/nmoTot53nprtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVXRpbHMuZGlzdGFuY2VUb0xpbmUoYmFsbC54LCBiYWxsLnksIHRoaXMueCwgdGhpcy55LCB0aGlzLnZ4LCB0aGlzLnZ5KTtcblxuICAgICAgICAvLyDlpoLmnpzlrZDlvLnkuI7lsI/nkIPmk6bogqnogIzov4fvvIzkuI3niIbngrhcbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgMzgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lciA9PT0gJ3NlbGYnICYmIGJhbGwuaXNOb3JtYWxTdGF0dXMoKSkgU29ja2V0Lkluc3RhbmNlLmNhdXNlRXhwbG9zaW9uKCk7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VBY3Rpb24oKTtcbiAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJvb21fMDAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmhpdF8wMDEsIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YCA5Zy65Yqo5L2cIC0g54iG54K45Yqo55S7XG4gICAgICovXG4gICAgcHVibGljIHJlbGVhc2VBY3Rpb24oKSB7XG4gICAgICAgIGxldCBwb3MgPSBVdGlscy5wKHRoaXMueCwgdGhpcy55KTtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLl9vd25lciA9PT0gJ3NlbGYnID8gJ2JsdWVfYm9vbScgOiB0aGlzLl9vd25lciA9PT0gJ29wcG9uZW50JyA/ICdyZWRfYm9vbScgOiAnJztcbiAgICAgICAgbGV0IGFuaSA9IEFuaW1hdGlvbk1hbmFnZXIuZ2V0T3JDcmVhdGUobmFtZSk7XG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XG5cbiAgICAgICAgYW5pLnBvcyhwb3MueCwgcG9zLnkpO1xuXG4gICAgICAgIGFuaS5vZmYoTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHsgfSk7XG4gICAgICAgIGFuaS5vbihMYXlhRXZlbnQuQ09NUExFVEUsIGFuaSwgKCkgPT4ge1xuICAgICAgICAgICAgUG9vbC5yZWNvdmVyKG5hbWUsIGFuaSk7XG4gICAgICAgICAgICBhbmkucmVtb3ZlU2VsZigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZChhbmkpO1xuXG4gICAgICAgIGFuaS5wbGF5KDAsIGZhbHNlLCBuYW1lKTtcblxuICAgICAgICB0aGlzLnJlbGVhc2UoKTtcbiAgICB9XG59IiwiY29uc3QgSWNlQnVsbGV0QXR0ciA9IHtcbiAgICB3aWR0aDogNDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBpbWdXaWR0aDogMzksXG4gICAgaW1nSGVpZ2h0OiAzOSxcbiAgICB2ZWxvY2l0eTogMjBcbn1cbi8qKlxuICog5Yaw5Ya75by5XG4gKi9cbmNsYXNzIEljZUJ1bGxldCBleHRlbmRzIEJ1bGxldCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLl90eXBlID0gJ2ljZSc7XG4gICAgICAgIHRoaXMucGl2b3QoSWNlQnVsbGV0QXR0ci5pbWdXaWR0aCAvIDIsIEljZUJ1bGxldEF0dHIuaW1nSGVpZ2h0IC8gMik7XG4gICAgICAgIHRoaXMuc2l6ZShJY2VCdWxsZXRBdHRyLndpZHRoLCBJY2VCdWxsZXRBdHRyLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX3JhZGl1cyA9IEljZUJ1bGxldEF0dHIud2lkdGggLyAyO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIG93bmVyOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHYgPSBVdGlscy5mbG9hdE4oSWNlQnVsbGV0QXR0ci52ZWxvY2l0eSAtICgxIC0gcG93ZXIpICogMTIpO1xuXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcuYnVsbGV0X2ljZSk7XG4gICAgICAgIHRoaXMuX293bmVyID0gb3duZXI7XG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xuICAgICAgICB0aGlzLl92eSA9IFV0aWxzLmZsb2F0TigoLTEgKiB2ICogTWF0aC5jb3MoYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVCYWxsUGh5c2ljcyhiYWxsOiBCYWxsKSB7XG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcblxuICAgICAgICBbdGhpcy54LCB0aGlzLnksIGJhbGwueCwgYmFsbC55XSA9IFV0aWxzLmZpeENvbGxpc2lvbihVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHRoaXMucmFkaXVzLCBiYWxsLnJhZGl1cywgY29udmVydCk7XG5cbiAgICAgICAgLy8g6K6h566X55CD5b+D5Yiw55u057q/55qE6Led56a7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IFV0aWxzLmRpc3RhbmNlVG9MaW5lKGJhbGwueCwgYmFsbC55LCB0aGlzLngsIHRoaXMueSwgdGhpcy52eCwgdGhpcy52eSk7XG5cbiAgICAgICAgLy8g6K6h566X55CD55qE5peL6L2s5pa55ZCRXG4gICAgICAgIGJhbGwuY29tcFJEaXJlY3Rpb24odGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xuXG4gICAgICAgIFt0aGlzLnZ4LCB0aGlzLnZ5LCBiYWxsLnZ4LCBiYWxsLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHsgdng6IHRoaXMudngsIHZ5OiB0aGlzLnZ5IH0sIHsgdng6IGJhbGwudngsIHZ5OiBiYWxsLnZ5IH0sIGNvbnZlcnQpO1xuXG4gICAgICAgIHRoaXMuc2ltdWxhdGVXZWlnaHQoYmFsbCk7XG5cbiAgICAgICAgdGhpcy5yZWxlYXNlQWN0aW9uKCk7XG4gICAgICAgIHRoaXMuZnJvemVuKGJhbGwpO1xuICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiBiYWxsLmlzTm9ybWFsU3RhdHVzKCkpIFNvY2tldC5JbnN0YW5jZS5jYXVzZUV4cGxvc2lvbigpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmcm96ZW4ob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdC5nZXRGcm96ZW4oKTtcblxuICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5mcm96ZW4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOmAgOWcuuWKqOS9nCAtIOeIhueCuOWKqOeUu1xuICAgICAqL1xuICAgIHB1YmxpYyByZWxlYXNlQWN0aW9uKCkge1xuICAgICAgICBsZXQgcG9zID0gVXRpbHMucCh0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIGxldCBuYW1lID0gJ2JsdWVfYm9vbSc7XG4gICAgICAgIGxldCBhbmkgPSBBbmltYXRpb25NYW5hZ2VyLmdldE9yQ3JlYXRlKG5hbWUpO1xuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xuXG4gICAgICAgIGFuaS5wb3MocG9zLngsIHBvcy55KTtcblxuICAgICAgICBhbmkub2ZmKExheWFFdmVudC5DT01QTEVURSwgYW5pLCAoKSA9PiB7IH0pO1xuICAgICAgICBhbmkub24oTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHtcbiAgICAgICAgICAgIFBvb2wucmVjb3ZlcihuYW1lLCBhbmkpO1xuICAgICAgICAgICAgYW5pLnJlbW92ZVNlbGYoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQoYW5pKTtcblxuICAgICAgICBhbmkucGxheSgwLCBmYWxzZSwgbmFtZSk7XG5cbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgfVxufSIsImNvbnN0IERpdmlzaW9uQnVsbGV0QXR0ciA9IHtcbiAgICB3aWR0aDogNDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBpbWdXaWR0aDogMzksXG4gICAgaW1nSGVpZ2h0OiAzOSxcbiAgICB2ZWxvY2l0eTogMjBcbn1cbi8qKlxuICog5YiG6KOC5by5XG4gKi9cbmNsYXNzIERpdmlzaW9uQnVsbGV0IGV4dGVuZHMgQnVsbGV0IHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnZGl2aXNpb24nO1xuXG4gICAgICAgIHRoaXMucGl2b3QoRGl2aXNpb25CdWxsZXRBdHRyLmltZ1dpZHRoIC8gMiwgRGl2aXNpb25CdWxsZXRBdHRyLmltZ0hlaWdodCAvIDIpO1xuICAgICAgICB0aGlzLnNpemUoRGl2aXNpb25CdWxsZXRBdHRyLndpZHRoLCBEaXZpc2lvbkJ1bGxldEF0dHIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gRGl2aXNpb25CdWxsZXRBdHRyLndpZHRoIC8gMjtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChhbmdsZTogbnVtYmVyLCBwb3dlcjogbnVtYmVyLCBvd25lcjogc3RyaW5nKSB7XG4gICAgICAgIGxldCB2ID0gVXRpbHMuZmxvYXROKERpdmlzaW9uQnVsbGV0QXR0ci52ZWxvY2l0eSAtICgxIC0gcG93ZXIpICogMTIpO1xuXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcuYnVsbGV0X2RpdmlzaW9uKTtcbiAgICAgICAgdGhpcy5fb3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy5fdnggPSBVdGlscy5mbG9hdE4oKHYgKiBNYXRoLnNpbihhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XG5cbiAgICAgICAgR2FtZS5JbnN0YW5jZS50aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGl2aWRlRWZmZWN0KCk7XG4gICAgICAgICAgICB0aGlzLmRpdmlkZSgpO1xuICAgICAgICB9LCAxMCwgdGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGRpdmlkZSgpIHtcbiAgICAgICAgbGV0IGdhbWVQYWdlID0gTWFpbi5JbnN0YW5jZS5nYW1lUGFnZTtcbiAgICAgICAgbGV0IGFuZ2xlID0gVXRpbHMuZmxvYXROKE1hdGguYXRhbih0aGlzLnZ4IC8gdGhpcy52eSkgKiAxODAgLyBNYXRoLlBJICogLTEpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0ID0gQnVsbGV0LmdldE9yQ3JlYXRlKFV0aWxzLmZsb2F0TihhbmdsZSArIChpIC0gMSkgKiAyMCArICh0aGlzLl9vd25lciA9PT0gJ29wcG9uZW50JyA/IDE4MCA6IDApKSwgMC42LCAnRGl2aXNpb25DaGlsZEJ1bGxldCcsIHRoaXMuX293bmVyKTtcbiAgICAgICAgICAgIGJ1bGxldC5wb3ModGhpcy54LCB0aGlzLnkpO1xuICAgICAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQoYnVsbGV0KTtcbiAgICAgICAgfVxuICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5ib29tXzAwMyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YCA5Zy65Yqo5L2cIC0g54iG54K45Yqo55S7XG4gICAgICovXG4gICAgcHVibGljIGRpdmlkZUVmZmVjdCgpIHtcbiAgICAgICAgbGV0IHBvcyA9IFV0aWxzLnAodGhpcy54LCB0aGlzLnkpO1xuICAgICAgICBsZXQgbmFtZSA9ICdncmVlbl9ib29tJztcbiAgICAgICAgbGV0IGFuaSA9IEFuaW1hdGlvbk1hbmFnZXIuZ2V0T3JDcmVhdGUobmFtZSk7XG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XG5cbiAgICAgICAgYW5pLnBvcyhwb3MueCwgcG9zLnkpO1xuXG4gICAgICAgIGFuaS5vZmYoTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHsgfSk7XG4gICAgICAgIGFuaS5vbihMYXlhRXZlbnQuQ09NUExFVEUsIGFuaSwgKCkgPT4ge1xuICAgICAgICAgICAgUG9vbC5yZWNvdmVyKG5hbWUsIGFuaSk7XG4gICAgICAgICAgICBhbmkucmVtb3ZlU2VsZigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZChhbmkpO1xuXG4gICAgICAgIGFuaS5wbGF5KDAsIGZhbHNlLCBuYW1lKTtcblxuICAgICAgICB0aGlzLnJlbGVhc2UoKTtcbiAgICB9XG59XG5cbmNsYXNzIERpdmlzaW9uQ2hpbGRCdWxsZXQgZXh0ZW5kcyBCdWxsZXQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnZGl2aXNpb25jaGlsZCc7XG5cbiAgICAgICAgdGhpcy5waXZvdChEaXZpc2lvbkJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBEaXZpc2lvbkJ1bGxldEF0dHIuaW1nSGVpZ2h0IC8gMik7XG4gICAgICAgIHRoaXMuc2l6ZShEaXZpc2lvbkJ1bGxldEF0dHIud2lkdGgsIERpdmlzaW9uQnVsbGV0QXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9yYWRpdXMgPSBEaXZpc2lvbkJ1bGxldEF0dHIud2lkdGggLyAyO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIG93bmVyOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHYgPSBVdGlscy5mbG9hdE4oRGl2aXNpb25CdWxsZXRBdHRyLnZlbG9jaXR5IC0gKDEgLSBwb3dlcikgKiAxMik7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5idWxsZXRfZGl2aXNpb24pO1xuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLl92eCA9IFV0aWxzLmZsb2F0TigodiAqIE1hdGguc2luKGFuZ2xlICogTWF0aC5QSSAvIDE4MCkpKTtcbiAgICAgICAgdGhpcy5fdnkgPSBVdGlscy5mbG9hdE4oKC0xICogdiAqIE1hdGguY29zKGFuZ2xlICogTWF0aC5QSSAvIDE4MCkpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZml4QmFsbFBvc2l0aW9uKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGNvbnZlcnQgPSBnbG9iYWwuc3luID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgIFt0aGlzLngsIHRoaXMueSwgYmFsbC54LCBiYWxsLnldID0gVXRpbHMuZml4Q29sbGlzaW9uKFV0aWxzLnAodGhpcy54LCB0aGlzLnkpLCBVdGlscy5wKGJhbGwueCwgYmFsbC55KSwgdGhpcy5yYWRpdXMsIGJhbGwucmFkaXVzLCBjb252ZXJ0KTtcblxuICAgICAgICAvLyDorqHnrpfnkIPlv4PliLDnm7Tnur/nmoTot53nprtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVXRpbHMuZGlzdGFuY2VUb0xpbmUoYmFsbC54LCBiYWxsLnksIHRoaXMueCwgdGhpcy55LCB0aGlzLnZ4LCB0aGlzLnZ5KTtcbiAgICAgICAgXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmhpdF8wMDEsIDEpO1xuICAgIH1cbn0iLCJjb25zdCBTbW9rZUJ1bGxldEF0dHIgPSB7XG4gICAgd2lkdGg6IDQwLFxuICAgIGhlaWdodDogNDAsXG4gICAgaW1nV2lkdGg6IDM5LFxuICAgIGltZ0hlaWdodDogMzksXG4gICAgdmVsb2NpdHk6IDIwXG59XG4vKipcbiAqIOW3qOefs+eCruW8uVxuICovXG5jbGFzcyBTbW9rZUJ1bGxldCBleHRlbmRzIEJ1bGxldCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLl90eXBlID0gJ3Ntb2tlJztcbiAgICAgICAgdGhpcy5waXZvdChTbW9rZUJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBTbW9rZUJ1bGxldEF0dHIuaW1nSGVpZ2h0IC8gMik7XG4gICAgICAgIHRoaXMuc2l6ZShTbW9rZUJ1bGxldEF0dHIud2lkdGgsIFNtb2tlQnVsbGV0QXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9yYWRpdXMgPSBTbW9rZUJ1bGxldEF0dHIud2lkdGggLyAyO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIG93bmVyOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHYgPSBVdGlscy5mbG9hdE4oSWNlQnVsbGV0QXR0ci52ZWxvY2l0eSAtICgxIC0gcG93ZXIpICogMTIpO1xuXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcuYnVsbGV0X3Ntb2tlKTtcbiAgICAgICAgdGhpcy5fb3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy5fdnggPSBVdGlscy5mbG9hdE4oKHYgKiBNYXRoLnNpbihhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpIHtcblxuICAgICAgICBzdXBlci51cGRhdGUoKTtcblxuICAgICAgICBpZiAoKHRoaXMuX293bmVyID09PSAnc2VsZicgJiYgdGhpcy55IDwgMTYwKSB8fCAodGhpcy5fb3duZXIgPT09ICdvcHBvbmVudCcgJiYgdGhpcy55ID4gY29uZmlnLmdhbWVIZWlnaHQgLSAxNjApKSB7XG4gICAgICAgICAgICB0aGlzLm1ha2VTbW9rZSgpO1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZml4QmFsbFBvc2l0aW9uKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGNvbnZlcnQgPSBnbG9iYWwuc3luID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgIFt0aGlzLngsIHRoaXMueSwgYmFsbC54LCBiYWxsLnldID0gVXRpbHMuZml4Q29sbGlzaW9uKFV0aWxzLnAodGhpcy54LCB0aGlzLnkpLCBVdGlscy5wKGJhbGwueCwgYmFsbC55KSwgdGhpcy5yYWRpdXMsIGJhbGwucmFkaXVzLCBjb252ZXJ0KTtcblxuICAgICAgICAvLyDorqHnrpfnkIPlv4PliLDnm7Tnur/nmoTot53nprtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVXRpbHMuZGlzdGFuY2VUb0xpbmUoYmFsbC54LCBiYWxsLnksIHRoaXMueCwgdGhpcy55LCB0aGlzLnZ4LCB0aGlzLnZ5KTtcbiAgICAgICAgXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmhpdF8wMDEsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICog54Of6Zu+5pWI5p6cXG4gICAgKi9cbiAgICBwdWJsaWMgbWFrZVNtb2tlKCkge1xuICAgICAgICBsZXQgcG9zID0gVXRpbHMucCh0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIGxldCBuYW1lID0gJ3Ntb2tlJztcbiAgICAgICAgbGV0IGFuaSA9IEFuaW1hdGlvbk1hbmFnZXIuZ2V0T3JDcmVhdGUobmFtZSwgNTAwLCAyNTAsIDI1MCwgMTI1KTtcbiAgICAgICAgbGV0IGdhbWVQYWdlID0gTWFpbi5JbnN0YW5jZS5nYW1lUGFnZTtcbiAgICAgICAgbGV0IHNtb2tlO1xuICAgICAgICBsZXQgdGFza05hbWUgPSB0aGlzLl9vd25lciA9PT0gJ3NlbGYnID8gJ3N0b3BTbW9rZTEnIDogJ3N0b3BTbW9rZTInO1xuXG4gICAgICAgIGlmICh0aGlzLl9vd25lciA9PT0gJ3NlbGYnICYmIEdhbWUuSW5zdGFuY2Uuc21va2UxKSB7XG4gICAgICAgICAgICBzbW9rZSA9IEdhbWUuSW5zdGFuY2Uuc21va2UxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLnJ1blRhc2tCeU5hbWUodGFza05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX293bmVyID09PSAnb3Bwb25lbnQnICYmIEdhbWUuSW5zdGFuY2Uuc21va2UyKSB7XG4gICAgICAgICAgICBzbW9rZSA9IEdhbWUuSW5zdGFuY2Uuc21va2UyO1xuXG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLnJ1blRhc2tCeU5hbWUodGFza05hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pLnBvcyhjb25maWcuZ2FtZVdpZHRoIC8gMiwgcG9zLnkpO1xuICAgICAgICBhbmkuaW50ZXJ2YWwgPSAxMDA7XG4gICAgICAgIGFuaS5zY2FsZSgwLjEsIDAuMSk7XG4gICAgICAgIGFuaS56T3JkZXIgPSBEaXNwbGF5T3JkZXIuU21va2U7XG5cbiAgICAgICAgVHdlZW4udG8oYW5pLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxIH0sIDMwMCk7XG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKGFuaSk7XG4gICAgICAgIGFuaS5wbGF5KDAsIHRydWUsIG5hbWUpO1xuXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLnNtb2tlLCAwKTtcblxuICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJykgR2FtZS5JbnN0YW5jZS5zbW9rZTEgPSBudWxsO1xuICAgICAgICAgICAgZWxzZSBHYW1lLkluc3RhbmNlLnNtb2tlMiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIUdhbWUuSW5zdGFuY2Uuc21va2UxICYmICFHYW1lLkluc3RhbmNlLnNtb2tlMikgU291bmRNYW5hZ2VyLnN0b3BTb3VuZChBc3NldHMuU291bmQuc21va2UpO1xuICAgICAgICAgICAgVHdlZW4udG8oYW5pLCB7IGFscGhhOiAwIH0sIDgwMCwgRWFzZS5saW5lYXJJbk91dCwgSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFuaS5hbHBoYSA9IDE7XG4gICAgICAgICAgICAgICAgUG9vbC5yZWNvdmVyKG5hbWUsIGFuaSk7XG4gICAgICAgICAgICAgICAgYW5pLnJlbW92ZVNlbGYoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSwgNTAwLCB0aGlzLCB0YXNrTmFtZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX293bmVyID09PSAnc2VsZicpIHsgR2FtZS5JbnN0YW5jZS5zbW9rZTEgPSBhbmk7IH1cbiAgICAgICAgZWxzZSBHYW1lLkluc3RhbmNlLnNtb2tlMiA9IGFuaTtcbiAgICB9XG59IiwiY29uc3QgQm9tYkJ1bGxldEF0dHIgPSB7XG4gICAgd2lkdGg6IDQwLFxuICAgIGhlaWdodDogNDAsXG4gICAgaW1nV2lkdGg6IDM5LFxuICAgIGltZ0hlaWdodDogMzksXG4gICAgdmVsb2NpdHk6IDIwXG59XG5cbi8qKlxuICog5beo5Z6L54K45by5XG4gKi9cbmNsYXNzIEJvbWJCdWxsZXQgZXh0ZW5kcyBCdWxsZXQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5fdHlwZSA9ICdib21iJztcbiAgICAgICAgdGhpcy5waXZvdChCb21iQnVsbGV0QXR0ci5pbWdXaWR0aCAvIDIsIEJvbWJCdWxsZXRBdHRyLmltZ0hlaWdodCAvIDIpO1xuICAgICAgICB0aGlzLnNpemUoQm9tYkJ1bGxldEF0dHIud2lkdGgsIEJvbWJCdWxsZXRBdHRyLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX3JhZGl1cyA9IEJvbWJCdWxsZXRBdHRyLndpZHRoIC8gMjtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChhbmdsZTogbnVtYmVyLCBwb3dlcjogbnVtYmVyLCBvd25lcjogc3RyaW5nKSB7XG4gICAgICAgIGxldCB2ID0gVXRpbHMuZmxvYXROKEJvbWJCdWxsZXRBdHRyLnZlbG9jaXR5IC0gKDEgLSBwb3dlcikgKiAxMik7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5idWxsZXRfYm9tYik7XG4gICAgICAgIHRoaXMuX293bmVyID0gb3duZXI7XG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xuICAgICAgICB0aGlzLl92eSA9IFV0aWxzLmZsb2F0TigoLTEgKiB2ICogTWF0aC5jb3MoYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XG5cbiAgICAgICAgLy8gIOeisOaSnuajgOa1i1xuICAgICAgICB0aGlzLmNvbGxpc2lvbigpO1xuXG4gICAgICAgIHRoaXMueCA9IFV0aWxzLmZsb2F0Tih0aGlzLnggKyB0aGlzLl92eCk7XG4gICAgICAgIHRoaXMueSA9IFV0aWxzLmZsb2F0Tih0aGlzLnkgKyB0aGlzLl92eSk7XG5cbiAgICAgICAgLy8g6LaK55WMXG4gICAgICAgIHRoaXMuX25leHRYID0gdGhpcy54ICsgdGhpcy5fdng7XG4gICAgICAgIHRoaXMuX25leHRZID0gdGhpcy55ICsgdGhpcy5fdnk7XG5cbiAgICAgICAgaWYgKHRoaXMuX25leHRYIDwgdGhpcy53aWR0aCAvIDIgfHwgdGhpcy5fbmV4dFggPiBjb25maWcuZ2FtZVdpZHRoIC0gdGhpcy53aWR0aCAvIDIpIHtcbiAgICAgICAgICAgIHRoaXMueCA9ICh0aGlzLl9uZXh0WCA8IHRoaXMud2lkdGggLyAyKSA/IHRoaXMud2lkdGggLyAyIDogY29uZmlnLmdhbWVXaWR0aCAtIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgdGhpcy5ib29tRWZmZWN0KCk7XG4gICAgICAgICAgICB0aGlzLmJvb20oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnkgPCAtMSAqIHRoaXMud2lkdGggLyAyIHx8IHRoaXMueSA+IGNvbmZpZy5nYW1lSGVpZ2h0ICsgdGhpcy5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjb2xsaXNpb25CdWxsZXRzKG9iamVjdDE6IEJ1bGxldCwgb2JqZWN0MjogQnVsbGV0KSB7XG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcblxuICAgICAgICAvLyDkuIvkuIDluKfnmoTkvY3nva5cbiAgICAgICAgbGV0IG5leHRPYmplY3QxID0ge1xuICAgICAgICAgICAgeDogb2JqZWN0MS54ICsgb2JqZWN0MS52eCxcbiAgICAgICAgICAgIHk6IG9iamVjdDEueSArIG9iamVjdDEudnksXG4gICAgICAgICAgICByYWRpdXM6IG9iamVjdDEucmFkaXVzXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IG5leHRPYmplY3QyID0ge1xuICAgICAgICAgICAgeDogb2JqZWN0Mi54ICsgb2JqZWN0Mi52eCxcbiAgICAgICAgICAgIHk6IG9iamVjdDIueSArIG9iamVjdDIudnksXG4gICAgICAgICAgICByYWRpdXM6IG9iamVjdDIucmFkaXVzXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKFV0aWxzLmlzQ2lyY2xlQ29sbGlzaW9uKG5leHRPYmplY3QxLCBuZXh0T2JqZWN0MikpIHtcbiAgICAgICAgICAgIFtvYmplY3QxLngsIG9iamVjdDEueSwgb2JqZWN0Mi54LCBvYmplY3QyLnldID0gVXRpbHMuZml4Q29sbGlzaW9uKFV0aWxzLnAob2JqZWN0MS54LCBvYmplY3QxLnkpLCBVdGlscy5wKG9iamVjdDIueCwgb2JqZWN0Mi55KSwgb2JqZWN0MS5yYWRpdXMsIG9iamVjdDIucmFkaXVzLCBjb252ZXJ0KTtcbiAgICAgICAgICAgIFtvYmplY3QxLnZ4LCBvYmplY3QxLnZ5LCBvYmplY3QyLnZ4LCBvYmplY3QyLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKG9iamVjdDEueCwgb2JqZWN0MS55KSwgVXRpbHMucChvYmplY3QyLngsIG9iamVjdDIueSksIHsgdng6IG9iamVjdDEudngsIHZ5OiBvYmplY3QxLnZ5IH0sIHsgdng6IG9iamVjdDIudngsIHZ5OiBvYmplY3QyLnZ5IH0sIGNvbnZlcnQpO1xuICAgICAgICAgICAgdGhpcy5ib29tRWZmZWN0KCk7XG4gICAgICAgICAgICB0aGlzLmJvb20oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVCYWxsUGh5c2ljcyhiYWxsOiBCYWxsKSB7XG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcblxuICAgICAgICBbdGhpcy54LCB0aGlzLnksIGJhbGwueCwgYmFsbC55XSA9IFV0aWxzLmZpeENvbGxpc2lvbihVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHRoaXMucmFkaXVzLCBiYWxsLnJhZGl1cywgY29udmVydCk7XG5cbiAgICAgICAgLy8g6K6h566X55CD5b+D5Yiw55u057q/55qE6Led56a7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IFV0aWxzLmRpc3RhbmNlVG9MaW5lKGJhbGwueCwgYmFsbC55LCB0aGlzLngsIHRoaXMueSwgdGhpcy52eCwgdGhpcy52eSk7XG5cbiAgICAgICAgLy8g6K6h566X55CD55qE5peL6L2s5pa55ZCRXG4gICAgICAgIGJhbGwuY29tcFJEaXJlY3Rpb24odGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xuXG4gICAgICAgIFt0aGlzLnZ4LCB0aGlzLnZ5LCBiYWxsLnZ4LCBiYWxsLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHsgdng6IHRoaXMudngsIHZ5OiB0aGlzLnZ5IH0sIHsgdng6IGJhbGwudngsIHZ5OiBiYWxsLnZ5IH0sIGNvbnZlcnQpO1xuXG4gICAgICAgIC8vdGhpcy5zaW11bGF0ZVdlaWdodChiYWxsKTtcblxuICAgICAgICB0aGlzLmJvb21FZmZlY3QoKTtcbiAgICAgICAgdGhpcy5ib29tKCk7XG4gICAgICAgIGlmICh0aGlzLl9vd25lciA9PT0gJ3NlbGYnICYmIGJhbGwuaXNOb3JtYWxTdGF0dXMoKSkgU29ja2V0Lkluc3RhbmNlLmNhdXNlRXhwbG9zaW9uKCk7XG4gICAgfVxuXG4gICAgYm9vbSgpIHtcbiAgICAgICAgbGV0IGJhbGwgPSBHYW1lLkluc3RhbmNlLmJhbGw7XG5cbiAgICAgICAgdGhpcy5ib29tUGh5c2ljcyhiYWxsKTtcblxuICAgICAgICBpZiAoZ2xvYmFsLnN5bikge1xuICAgICAgICAgICAgZm9yIChsZXQgYnVsbGV0IG9mIEJ1bGxldC5teUJ1bGxldHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvb21QaHlzaWNzKGJ1bGxldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGJ1bGxldCBvZiBCdWxsZXQueW91ckJ1bGxldHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvb21QaHlzaWNzKGJ1bGxldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBidWxsZXQgb2YgQnVsbGV0LnlvdXJCdWxsZXRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib29tUGh5c2ljcyhidWxsZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgYnVsbGV0IG9mIEJ1bGxldC5teUJ1bGxldHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvb21QaHlzaWNzKGJ1bGxldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGJvb21QaHlzaWNzKG9iamVjdCkge1xuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIGxldCB0aGlzeCA9IHRoaXMueDtcbiAgICAgICAgbGV0IHRoaXN5ID0gdGhpcy55O1xuICAgICAgICBsZXQgb2JqZWN0eCA9IG9iamVjdC54O1xuICAgICAgICBsZXQgb2JqZWN0eSA9IG9iamVjdC55O1xuICAgICAgICBpZiAoY29udmVydCkge1xuICAgICAgICAgICAgdGhpc3ggPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVXaWR0aCAtIHRoaXN4KTtcbiAgICAgICAgICAgIHRoaXN5ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lSGVpZ2h0IC0gdGhpc3kpO1xuICAgICAgICAgICAgb2JqZWN0eCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gb2JqZWN0eCk7XG4gICAgICAgICAgICBvYmplY3R5ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lSGVpZ2h0IC0gb2JqZWN0eSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVXRpbHMuZmxvYXROKFV0aWxzLnBMZW5ndGgoVXRpbHMucChvYmplY3R4LCBvYmplY3R5KSwgVXRpbHMucCh0aGlzeCwgdGhpc3kpKSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGlzdGFuY2UgPD0gMTgwICYmIGRpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgbGV0IHJhdGUgPSAob2JqZWN0eCAtIHRoaXN4KSAvIChvYmplY3R5IC0gdGhpc3kpO1xuICAgICAgICAgICAgbGV0IHBvd2VyID0gKDE4MCAtIGRpc3RhbmNlKSAvIDgwMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb2JqZWN0LnZ4ID0gVXRpbHMuZmxvYXROKChvYmplY3R4IC0gdGhpc3gpICogcG93ZXIpO1xuICAgICAgICAgICAgb2JqZWN0LnZ5ID0gVXRpbHMuZmxvYXROKChvYmplY3R5IC0gdGhpc3kpICogcG93ZXIpO1xuICAgICAgICAgICAgaWYgKGNvbnZlcnQpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QudnggPSBVdGlscy5mbG9hdE4ob2JqZWN0LnZ4ICogLTEpO1xuICAgICAgICAgICAgICAgIG9iamVjdC52eSA9IFV0aWxzLmZsb2F0TihvYmplY3QudnkgKiAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpgIDlnLrliqjkvZwgLSDniIbngrjliqjnlLtcbiAgICAgKi9cbiAgICBwdWJsaWMgYm9vbUVmZmVjdCgpIHtcbiAgICAgICAgbGV0IHBvcyA9IFV0aWxzLnAodGhpcy54LCB0aGlzLnkpO1xuICAgICAgICBsZXQgbmFtZSA9ICdib29tJztcbiAgICAgICAgbGV0IGFuaSA9IEFuaW1hdGlvbk1hbmFnZXIuZ2V0T3JDcmVhdGUobmFtZSwgMjkxLCAyOTEsIDE0NSwgMTQ1KTtcbiAgICAgICAgbGV0IGdhbWVQYWdlID0gTWFpbi5JbnN0YW5jZS5nYW1lUGFnZTtcblxuICAgICAgICBhbmkucG9zKHBvcy54LCBwb3MueSk7XG5cbiAgICAgICAgYW5pLm9mZihMYXlhRXZlbnQuQ09NUExFVEUsIGFuaSwgKCkgPT4geyB9KTtcbiAgICAgICAgYW5pLm9uKExheWFFdmVudC5DT01QTEVURSwgYW5pLCAoKSA9PiB7XG4gICAgICAgICAgICBQb29sLnJlY292ZXIobmFtZSwgYW5pKTtcbiAgICAgICAgICAgIGFuaS5yZW1vdmVTZWxmKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKGFuaSk7XG5cbiAgICAgICAgYW5pLnBsYXkoMCwgZmFsc2UsIG5hbWUpO1xuXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJvb21fMDAyKTtcblxuICAgICAgICB0aGlzLnJlbGVhc2UoKTtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYnVsbGV0L0J1bGxldC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9idWxsZXQvU3RhbmRhcmRCdWxsZXQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYnVsbGV0L0ljZUJ1bGxldC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9idWxsZXQvRGl2aXNpb25CdWxsZXQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYnVsbGV0L1Ntb2tlQnVsbGV0LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2J1bGxldC9Cb21iQnVsbGV0LnRzXCIgLz5cblxuLyoqXG4gKiDop5LoibLlpKflsI9cbiAqL1xuY29uc3QgQ2Fubm9uQXR0ciA9IHtcbiAgICB3aWR0aDogNzEsIFxuICAgIGhlaWdodDogMTExLFxuICAgIGltZ1dpZHRoOiA3MSxcbiAgICBpbWdIZWlnaHQ6IDExMVxufTtcblxuLyoqXG4gKiDngq7lj7DnsbtcbiAqL1xuY2xhc3MgQ2Fubm9uIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZXtcbiAgICBwcml2YXRlIG9wcG9uZW50OiBib29sZWFuO1xuICAgIHByaXZhdGUgX3NoYWRvdzogU3ByaXRlO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9wcG9uZW50IOaYr+WQpuWvueaJi+eahOeCruWPsFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wcG9uZW50OiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubG9hZEltYWdlKG9wcG9uZW50PyBBc3NldHMuSW1nLmNhbm5vbl95IDogQXNzZXRzLkltZy5jYW5ub25fbSk7XG4gICAgICAgIHRoaXMucGl2b3QoQ2Fubm9uQXR0ci5pbWdXaWR0aC8yLCA3NSk7XG4gICAgICAgIHRoaXMucG9zKGNvbmZpZy5nYW1lV2lkdGgvMiwgY29uZmlnLmdhbWVIZWlnaHQpO1xuICAgICAgICB0aGlzLnNpemUoQ2Fubm9uQXR0ci53aWR0aCwgQ2Fubm9uQXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLnpPcmRlciA9IERpc3BsYXlPcmRlci5DYW5ub247XG4gICAgICAgIHRoaXMub3Bwb25lbnQgPSBvcHBvbmVudDtcblxuICAgICAgICBpZihvcHBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5wb3MoY29uZmlnLmdhbWVXaWR0aC8yLCAwKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU2hhZG93KCk7XG4gICAgICAgICAgICB0aGlzLnNldEFuZ2xlKHRoaXMucm90YXRpb24gKyAxODApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRTaGFkb3coKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPlueCruWPsOinkuW6plxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBbmdsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K6+572u5peL6L2s6KeS5bqmXG4gICAgICovXG4gICAgcHVibGljIHNldEFuZ2xlKGFuZ2xlOiBudW1iZXIpIHtcblxuICAgICAgICAvLyDpmZDliLbngq7lj7Dovazliqjop5LluqZcbiAgICAgICAgaWYoIXRoaXMub3Bwb25lbnQgJiYgKGFuZ2xlID4gODIgfHwgYW5nbGUgPCAtODIpKSB7XG4gICAgICAgICAgICBhbmdsZSA9IGFuZ2xlID4gMD8gODIgOiAtODI7ICAgIFxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub3Bwb25lbnQgJiYgKGFuZ2xlIDwgOTggfHwgYW5nbGUgPiAyNjIpKSB7XG4gICAgICAgICAgICBhbmdsZSA9IGFuZ2xlIDwgOTg/IDk4IDogMjYyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcbiAgICAgICAgdGhpcy5fc2hhZG93LnJvdGF0aW9uID0gYW5nbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y+R5bCE5a2Q5by5XG4gICAgICovXG4gICAgcHVibGljIHNob290KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIGJ1bGxldFR5cGU6IHN0cmluZykge1xuICAgICAgICBsZXQgYnVsbGV0O1xuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xuXG4gICAgICAgIGlmKHRoaXMub3Bwb25lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QW5nbGUoYW5nbGUgKyAxODApO1xuICAgICAgICAgICAgYnVsbGV0ID0gQnVsbGV0LmdldE9yQ3JlYXRlKGFuZ2xlICsgMTgwLCBwb3dlciwgYnVsbGV0VHlwZSwgJ29wcG9uZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBidWxsZXQgPSBCdWxsZXQuZ2V0T3JDcmVhdGUoYW5nbGUsIHBvd2VyLCBidWxsZXRUeXBlLCAnc2VsZicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYnVsbGV0KSB7XG4gICAgICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZChidWxsZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgY29uc29sZS5sb2coJ0J1bGxldCBpcyBsb2NrLicpXG5cbiAgICAgICAgYnVsbGV0LnBvcyh0aGlzLngsIHRoaXMueSk7XG5cbiAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuc2hvb3QsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa3u+WKoOmYtOW9seaViOaenFxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkU2hhZG93KCkge1xuICAgICAgICB0aGlzLl9zaGFkb3cgPSBuZXcgU3ByaXRlKCk7XG5cbiAgICAgICAgdGhpcy5fc2hhZG93LmxvYWRJbWFnZShBc3NldHMuSW1nLmNhbm5vbl9zaGFkb3cpO1xuICAgICAgICB0aGlzLl9zaGFkb3cucGl2b3QoNDEsIDc1KTtcbiAgICAgICAgaWYodGhpcy5vcHBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5fc2hhZG93LnBvcyh0aGlzLnggLSAyMCwgdGhpcy55IC0gMTApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2hhZG93LnBvcyh0aGlzLnggLSAyMCwgdGhpcy55ICsgMTApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NoYWRvdy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuU2hhZG93O1xuXG4gICAgICAgIE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2UuYWRkQ2hpbGQodGhpcy5fc2hhZG93KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICAgICAgdGhpcy5fc2hhZG93LnJlbW92ZVNlbGYoKTtcbiAgICB9XG59IiwiXG5jb25zdCBQcm9jZXNzQXR0ciA9IHtcbiAgICB3aWR0aDogMjIsXG4gICAgaGVpZ2h0OiAxODgsXG4gICAgYnVsbGV0Q29zdDogMC4yXG59O1xuXG4vKipcbiAqIOWtkOW8ueWhq+WFhei/m+W6puadoeexu1xuICovXG5jbGFzcyBCdWxsZXRQcm9jZXNzIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZSB7XG4gICAgcHJpdmF0ZSBwcm9jZXNzOiBTcHJpdGU7XG4gICAgcHJpdmF0ZSBwbWFzazogU3ByaXRlO1xuICAgIC8vIOi/m+W6pueOh1xuICAgIHB1YmxpYyBwZXJjZW50OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvLyDog4zmma/mnaFcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5wcm9jZXNzQmcpO1xuICAgICAgICB0aGlzLnNpemUoUHJvY2Vzc0F0dHIud2lkdGgsIFByb2Nlc3NBdHRyLmhlaWdodCk7XG4gICAgICAgIHRoaXMucGl2b3QoUHJvY2Vzc0F0dHIud2lkdGgsIFByb2Nlc3NBdHRyLmhlaWdodCk7XG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlByb2Nlc3NCYXI7XG4gICAgICAgIHRoaXMucmVwb3MoKTtcblxuICAgICAgICAvLyDov5vluqbmnaHlkozokpnniYjpga7nvalcbiAgICAgICAgdGhpcy5wbWFzayA9IG5ldyBTcHJpdGUoKTtcbiAgICAgICAgdGhpcy5wbWFzay5sb2FkSW1hZ2UoQXNzZXRzLkltZy5wcm9jZXNzKTtcbiAgICAgICAgdGhpcy5wbWFzay5zaXplKFByb2Nlc3NBdHRyLndpZHRoLCBQcm9jZXNzQXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLnBtYXNrLnBvcygwLCBQcm9jZXNzQXR0ci5oZWlnaHQvMik7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICB0aGlzLnByb2Nlc3MubG9hZEltYWdlKEFzc2V0cy5JbWcucHJvY2Vzcyk7XG4gICAgICAgIHRoaXMucHJvY2Vzcy5zaXplKFByb2Nlc3NBdHRyLndpZHRoLCBQcm9jZXNzQXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLnByb2Nlc3MubWFzayA9IHRoaXMucG1hc2s7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBlcmNlbnQgPSAwLjU7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wcm9jZXNzKTtcblxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIOW4p+abtOaWsFxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgICAgIGlmKHRoaXMucG1hc2sueSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnBtYXNrLnkgPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG1hc2sucG9zKDAsIHRoaXMucG1hc2sueSAtIDAuNSk7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IDEgLSAodGhpcy5wbWFzay55IC8gUHJvY2Vzc0F0dHIuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAg5raI6ICX5LiA5Liq6L+b5bqmXG4gICAgICovXG4gICAgcHVibGljIGNvc3RPbmUobnVtPzogbnVtYmVyKSB7XG4gICAgICAgIGlmKCFudW0pIG51bSA9IDE7XG4gICAgICAgIGlmKG51bSA8IDAuNSkgbnVtID0gMC41O1xuICAgICAgICBpZih0aGlzLnBlcmNlbnQgPj0gKFByb2Nlc3NBdHRyLmJ1bGxldENvc3QgKiBudW0pKSB7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgLT0gKFByb2Nlc3NBdHRyLmJ1bGxldENvc3QgKiBudW0pO1xuICAgICAgICAgICAgdGhpcy5wbWFzay5wb3MoMCwgUHJvY2Vzc0F0dHIuaGVpZ2h0ICogKDEgLSB0aGlzLnBlcmNlbnQpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIOmHjeaWsOWumuS9jVxuICAgIHB1YmxpYyByZXBvcygpIHtcbiAgICAgICAgaWYoTGF5YS5zdGFnZS53aWR0aCA+PSAxMjgwKSB7XG4gICAgICAgICAgICB0aGlzLnBvcyhnbG9iYWwucmlnaHRFZGdlICsgNDAwLCBMYXlhLnN0YWdlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLnBvcyhMYXlhLnN0YWdlLndpZHRoLCBMYXlhLnN0YWdlLmhlaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxmKCk7XG4gICAgfVxufSIsIlxuLy8g6K6h5pe25Zmo5bGe5oCn77yMdGltZe+8muWAkuiuoeaXtumXtC/ljZXkvY1zXG5jb25zdCBUaW1lckF0dHIgPSB7XG4gICAgd2lkdGg6IDEwMixcbiAgICBoZWlnaHQ6IDQwLFxuICAgIHRpbWU6IDE4MFxufTtcblxuLyoqXG4gKiDmuLjmiI/orqHml7blmahcbiAqL1xuY2xhc3MgVGltZXIgZXh0ZW5kcyBsYXlhLmRpc3BsYXkuU3ByaXRlIHtcbiAgICBwcml2YXRlIF9mcmFtZTogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF90aW1lOiBMYXlhVGV4dDtcbiAgICBwcml2YXRlIF90aW1lVmFsdWU6IG51bWJlciA9IFRpbWVyQXR0ci50aW1lO1xuICAgIHByaXZhdGUgX3RpbWVUYXNrTGlzdDogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcudGltZXJCZyk7XG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlRpbWVyO1xuICAgICAgICB0aGlzLnNpemUoVGltZXJBdHRyLndpZHRoLCBUaW1lckF0dHIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5waXZvdCh0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgdGhpcy5yZXBvcygpO1xuXG4gICAgICAgIHRoaXMuX3RpbWUgPSBuZXcgTGF5YVRleHQoKTtcbiAgICAgICAgdGhpcy5fdGltZS5mb250ID0gJ0FyaWFsJztcbiAgICAgICAgdGhpcy5fdGltZS5mb250U2l6ZSA9IDMzO1xuICAgICAgICB0aGlzLl90aW1lLmNvbG9yID0gJyMwMDAwMDAnO1xuICAgICAgICB0aGlzLl90aW1lLmFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMuX3RpbWUudmFsaWduID0gJ21pZGRsZSc7XG4gICAgICAgIHRoaXMuX3RpbWUuc2l6ZSgxMTAsIDM4KTtcbiAgICAgICAgdGhpcy5fdGltZS5waXZvdCh0aGlzLl90aW1lLndpZHRoLzIsIHRoaXMuX3RpbWUuaGVpZ2h0LzIpO1xuICAgICAgICB0aGlzLl90aW1lLnBvcyh0aGlzLndpZHRoLzIgKyAyLCB0aGlzLmhlaWdodC8yIC0gMik7XG4gICAgICAgIHRoaXMuX3RpbWUudGV4dCA9IHRoaXMuY29udmVydFRvU3RyaW5nKHRoaXMuX3RpbWVWYWx1ZSk7XG5cbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl90aW1lKTtcbiAgICAgICAgXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcyk7XG4gICAgfVxuXG4gICAgZ2V0IHRpbWVWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWVWYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmm7TmlrBcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLl9mcmFtZSsrO1xuICAgICAgICBpZih0aGlzLl9mcmFtZSA+PSA2MCkge1xuICAgICAgICAgICAgdGhpcy5fdGltZVZhbHVlLS07XG4gICAgICAgICAgICB0aGlzLl90aW1lLnRleHQgPSB0aGlzLmNvbnZlcnRUb1N0cmluZyh0aGlzLl90aW1lVmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fZnJhbWUgPSAwO1xuXG4gICAgICAgICAgICBpZih0aGlzLl90aW1lVmFsdWUgPT09IDMwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZS5jb2xvciA9ICcjRjQxNDE0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodGhpcy5fdGltZVZhbHVlIDw9IDAgJiYgR2FtZS5JbnN0YW5jZS5zdGF0dXMgIT0gMCkge1xuXG4gICAgICAgICAgICAgICAgLy8g5ri45oiP57uT5p2fXG4gICAgICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS5nYW1lT3ZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5a6a5pe25Lu75YqhXG4gICAgICAgIGZvcihsZXQgdGFzayBvZiB0aGlzLl90aW1lVGFza0xpc3QpIHtcbiAgICAgICAgICAgIHRhc2suZnJhbWUrKztcbiAgICAgICAgICAgIGlmKHRhc2suZnJhbWUgPj0gdGFzay5nb2FsRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0YXNrLmdvYWxGdW5jLmFwcGx5KHRhc2suY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZVRhc2tMaXN0LnNwbGljZSh0aGlzLl90aW1lVGFza0xpc3QuaW5kZXhPZih0YXNrKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaW1lb3V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGltZVZhbHVlIDw9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YeN5paw5a6a5L2NXG4gICAgICovXG4gICAgcHVibGljIHJlcG9zKCkge1xuICAgICAgICBpZihMYXlhLnN0YWdlLndpZHRoID49IDEyODApIHtcbiAgICAgICAgICAgIHRoaXMucG9zKGdsb2JhbC5yaWdodEVkZ2UgKyA0MDAsIDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgdGhpcy5wb3MoTGF5YS5zdGFnZS53aWR0aCwgMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6L2s5YyW56eS5Li65oyH5a6a5qC85byP5a2X56ym5LiyXG4gICAgICovXG4gICAgcHVibGljIGNvbnZlcnRUb1N0cmluZyh0aW1lOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG1pbnV0ZSwgc2Vjb25kLCByZXMgPSAnJztcblxuICAgICAgICBpZih0aW1lIDwgMCkgcmV0dXJuICcwMDowMCc7XG4gICAgICAgIG1pbnV0ZSA9IE1hdGguZmxvb3IodGltZSAvIDYwKTtcbiAgICAgICAgc2Vjb25kID0gdGltZSAlIDYwO1xuXG4gICAgICAgIGlmKG1pbnV0ZSA8IDEwKSByZXMgPSByZXMgKyAnMCcgKyBtaW51dGUudG9TdHJpbmcoKTtcbiAgICAgICAgZWxzZSByZXMgPSByZXMgKyBtaW51dGUudG9TdHJpbmcoKTtcblxuICAgICAgICByZXMgKz0gJzonO1xuXG4gICAgICAgIGlmKHNlY29uZCA8IDEwKSByZXMgPSByZXMgKyAnMCcgKyBzZWNvbmQudG9TdHJpbmcoKTtcbiAgICAgICAgZWxzZSByZXMgPSByZXMgKz0gc2Vjb25kLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VGltZW91dChmdW5jLCB0aW1lRnJhbWU6IG51bWJlciwgY29udGV4dCwgdGFza05hbWU/OiBzdHJpbmcsIGNsZWFyPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl90aW1lVGFza0xpc3QucHVzaCh7ZnJhbWU6IDAsIGdvYWxGcmFtZTogdGltZUZyYW1lLCBnb2FsRnVuYzogZnVuYywgY29udGV4dDogY29udGV4dCwgdGFza05hbWU6IHRhc2tOYW1lIHx8ICcnLCBjbGVhcjogY2xlYXIgfHwgZmFsc2V9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcnVuVGFza0J5TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgZm9yKGxldCB0YXNrIG9mIHRoaXMuX3RpbWVUYXNrTGlzdCkge1xuICAgICAgICAgICAgaWYodGFzay50YXNrTmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgIHRhc2suZ29hbEZ1bmMuYXBwbHkodGFzay5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lVGFza0xpc3Quc3BsaWNlKHRoaXMuX3RpbWVUYXNrTGlzdC5pbmRleE9mKHRhc2spLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhclRhc2tMaXN0KCkge1xuICAgICAgICBmb3IobGV0IHRhc2sgb2YgdGhpcy5fdGltZVRhc2tMaXN0KSB7XG4gICAgICAgICAgICBpZih0YXNrLmNsZWFyKSB0YXNrLmdvYWxGdW5jLmFwcGx5KHRhc2suY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGltZVRhc2tMaXN0ID0gW107XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyVGFza0J5TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgZm9yKGxldCB0YXNrIG9mIHRoaXMuX3RpbWVUYXNrTGlzdCkge1xuICAgICAgICAgICAgaWYodGFzay50YXNrTmFtZSA9PT0gbmFtZSkgdGhpcy5fdGltZVRhc2tMaXN0LnNwbGljZSh0aGlzLl90aW1lVGFza0xpc3QuaW5kZXhPZih0YXNrKSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnp7vpmaRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICB9XG59IiwiLyoqXG4gKiDomZrnur/nsbtcbiAqL1xuY2xhc3MgRGFzaExpbmUgZXh0ZW5kcyBsYXlhLmRpc3BsYXkuU3ByaXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQXNzaXN0TGluZTtcbiAgICAgICAgdGhpcy5wb3MoeCwgeSk7IFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeUu+eehOWHhui+heWKqee6v1xuICAgICAqL1xuICAgIHB1YmxpYyBkcmF3QXNzaXN0TGluZShnb2FsUG9pbnQ6IFBvaW50KSB7XG4gICAgICAgIGxldCBwID0ge3g6MCx5OjB9LCBhcnIgPSBbXSwgbGVuZ3RoLCBkb3RMZW5ndGggPSAyMCwgZG90TnVtLCB4YWRkLCB5YWRkO1xuXG4gICAgICAgIHAueCA9IGdvYWxQb2ludC54IC0gdGhpcy54O1xuICAgICAgICBwLnkgPSBnb2FsUG9pbnQueSAtIHRoaXMueTtcblxuICAgICAgICBsZW5ndGggPSBVdGlscy5wTGVuZ3RoKGdvYWxQb2ludCwgVXRpbHMucCh0aGlzLngsIHRoaXMueSkpO1xuICAgICAgICBkb3ROdW0gPSBNYXRoLmNlaWwobGVuZ3RoIC8gZG90TGVuZ3RoKTtcblxuICAgICAgICB4YWRkID0gZG90TGVuZ3RoKihwLngpL2xlbmd0aDtcbiAgICAgICAgeWFkZCA9IGRvdExlbmd0aCoocC55KS9sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5jbGVhckxpbmVzKCk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGRvdE51bTsgaSsrKSB7XG4gICAgICAgICAgICBpZihpICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxldCBsaW5lID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobGluZSk7XG4gICAgICAgICAgICAgICAgbGluZS5ncmFwaGljcy5kcmF3TGluZSgoaS0xKSAqIHhhZGQsIChpLTEpICogeWFkZCwgaSAqIHhhZGQsIGkgKiB5YWRkLCAnI2ZmZmZmZicsIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5riF6Zmk6L6F5Yqp57q/XG4gICAgICovXG4gICAgcHVibGljIGNsZWFyTGluZXMoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICB9XG59IiwiLyoqXG4gKiDpgZPlhbfmoIfnrb5cbiAqL1xuY2xhc3MgVG9vbFRhZyBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xuICAgIC8vIOmBk+WFt+agh+etvuWQjVxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmc7XG4gICAgLy8g6YGT5YW35qCH562+5Lit5paH5ZCNXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIC8vIOaYr+WQpuiiq+mAieaLqVxuICAgIHByaXZhdGUgX3NlbGVjdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8vIOmBk+WFt+agh+etvuaWh+Wtl1xuICAgIHByaXZhdGUgX3RleHQ6IExheWFUZXh0O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xuICAgICAgICB0aGlzLl9uYW1lID0gVG9vbFtpZF0ubmFtZTtcblxuICAgICAgICB0aGlzLmxvYWRJbWFnZShBc3NldHMuSW1nWyd0b29sdGFnXycgKyBUb29sW2lkXS50YWddKTtcbiAgICAgICAgdGhpcy5zaXplKDcyLCAzNCk7XG5cbiAgICAgICAgdGhpcy5fdGV4dCA9IG5ldyBMYXlhVGV4dCgpO1xuICAgICAgICB0aGlzLl90ZXh0LnRleHQgPSB0aGlzLl9uYW1lO1xuICAgICAgICB0aGlzLl90ZXh0LmFsaWduID0gJ3JpZ2h0JztcbiAgICAgICAgdGhpcy5fdGV4dC52YWxpZ24gPSAnbWlkZGxlJztcbiAgICAgICAgdGhpcy5fdGV4dC5zaXplKDY4LCAzNCk7XG4gICAgICAgIHRoaXMuX3RleHQuZm9udCA9ICflubzlnIYnO1xuICAgICAgICB0aGlzLl90ZXh0LmZvbnRTaXplID0gMjA7XG5cbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl90ZXh0KTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yik5pat5piv5ZCm6KKr6YCJ5oupXG4gICAgICovXG4gICAgcHVibGljIGlzU2VsZWN0KCkge1xuICAgICAgICBpZih0aGlzLl9zZWxlY3QpIHJldHVybiB0cnVlO1xuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpgInmi6nmoIfnrb5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0KCkge1xuICAgICAgICBpZih0aGlzLl9zZWxlY3QpIHJldHVybjtcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgVHdlZW4uY2xlYXJBbGwodGhpcyk7XG4gICAgICAgIFR3ZWVuLnRvKHRoaXMsIHt4OiAtOH0sIDIwMCwgRWFzZS5iYWNrSW5PdXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWPmOS4uumdnumAieaLqVxuICAgICAqL1xuICAgIHB1YmxpYyB1bnNlbGVjdCgpIHtcbiAgICAgICAgaWYoIXRoaXMuX3NlbGVjdCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgVHdlZW4uY2xlYXJBbGwodGhpcyk7XG4gICAgICAgIFR3ZWVuLnRvKHRoaXMsIHt4OiAtNTJ9LCAyMDAsIEVhc2UuYmFja0luT3V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkvb/nlKjmoIfnrb5cbiAgICAgKi9cbiAgICBwdWJsaWMgdXNlVGFnKG5leHRUYWc6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zZWxlY3QgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmFscGhhID0gMDtcbiAgICAgICAgdGhpcy5jaGFuZ2VUYWcobmV4dFRhZyk7XG4gICAgICAgIHRoaXMueCA9IC03MjtcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XG4gICAgICAgIFR3ZWVuLnRvKHRoaXMsIHt4OiAtNTJ9LCAzMDAsIEVhc2UuYmFja0luT3V0KTtcbiAgICAgICAgLy8gVHdlZW4udG8odGhpcywge2FscGhhOiAwfSwgMzAwLCBudWxsLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLmNoYW5nZVRhZyhuZXh0VGFnKTtcbiAgICAgICAgLy8gICAgIHRoaXMueCA9IC03MjtcbiAgICAgICAgLy8gICAgIHRoaXMuYWxwaGEgPSAxO1xuICAgICAgICAvLyAgICAgVHdlZW4udG8odGhpcywge3g6IC01Mn0sIDMwMCwgRWFzZS5iYWNrSW5PdXQpO1xuICAgICAgICAvLyB9KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pS55Y+Y5qCH562+XG4gICAgICovXG4gICAgcHVibGljIGNoYW5nZVRhZyhpZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgICAgIHRoaXMuX25hbWUgPSBUb29sW2lkXS5uYW1lO1xuXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWdbJ3Rvb2x0YWdfJyArIFRvb2xbaWRdLnRhZ10pO1xuICAgICAgICB0aGlzLl90ZXh0LnRleHQgPSB0aGlzLl9uYW1lO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Ub29sVGFnLnRzXCIgLz5cblxuLyoqXG4gKiDpgZPlhbfmoIfnrb7lrrnlmahcbiAqL1xuY2xhc3MgVG9vbFRhZ0NvbnRhaW5lciBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xuICAgIC8vIOaYvuekuueahOmBk+WFt+agh+etvuaVsOe7hFxuICAgIHByaXZhdGUgX3RhZ0xpc3Q6IEFycmF5PFRvb2xUYWc+ID0gW107XG4gICAgLy8g5omA5pyJ6YGT5YW35qCH562+5ZCNXG4gICAgcHJpdmF0ZSBfdGFnSWRzOiBBcnJheTxzdHJpbmc+ID0gWydJY2VCdWxsZXQnLCAnRGl2aXNpb25CdWxsZXQnLCAnU21va2VCdWxsZXQnLCAnQm9tYkJ1bGxldCddO1xuICAgIC8vIOKAmOS4i+S4gOS4qumBk+WFt+agh+etvuWQjeKAmemYn+WIl1xuICAgIHByaXZhdGUgX25leHRUYWdJZHM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAvLyDpgInkuK3nmoTpgZPlhbfmoIfnrb5pZFxuICAgIHByaXZhdGUgX3NlbGVjdEluZGV4OiBudW1iZXI7XG5cbiAgICBwcml2YXRlIF9sb2NrOiBib29sZWFuID0gZmFsc2U7XG4gICAgXG4gICAgZ2V0IHRhZ0xpc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YWdMaXN0O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGxldCB0YWcwID0gbmV3IFRvb2xUYWcoJ1N0YW5kYXJkQnVsbGV0Jyk7XG4gICAgICAgIGxldCB0YWcxID0gbmV3IFRvb2xUYWcoJ0ljZUJ1bGxldCcpO1xuICAgICAgICBsZXQgdGFnMiA9IG5ldyBUb29sVGFnKCdEaXZpc2lvbkJ1bGxldCcpO1xuXG4gICAgICAgIHRoaXMuX3RhZ0xpc3QucHVzaCh0YWcwKTtcbiAgICAgICAgdGhpcy5fdGFnTGlzdC5wdXNoKHRhZzEpO1xuICAgICAgICB0aGlzLl90YWdMaXN0LnB1c2godGFnMik7XG5cbiAgICAgICAgdGFnMC5wb3MoLTUyLCAwKTtcbiAgICAgICAgdGFnMS5wb3MoLTUyLCA0Nyk7XG4gICAgICAgIHRhZzIucG9zKC01MiwgOTQpO1xuXG4gICAgICAgIC8vIOm7mOiupOmAieS4reesrOS4gOS4qumBk+WFt+agh+etvlxuICAgICAgICB0YWcwLnNlbGVjdCgpO1xuICAgICAgICB0aGlzLl9zZWxlY3RJbmRleCA9IDA7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW4oCY5LiL5LiA5Liq6YGT5YW35qCH562+4oCZ6Zif5YiXXG4gICAgICAgIHRoaXMuX25leHRUYWdJZHMgPSB0aGlzLmdldEhpZGRlblRhZ0lkcygpO1xuXG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlRvb2xDb250YWluZXI7XG4gICAgICAgIHRoaXMucmVwb3MoKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZHJlbih0YWcwLCB0YWcxLCB0YWcyKTtcbiAgICAgICAgXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzTG9jaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2s7XG4gICAgfVxuXG4gICAgcHVibGljIGxvY2soKSB7XG4gICAgICAgIHRoaXMuX2xvY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyB1bmxvY2soKSB7XG4gICAgICAgIHRoaXMuX2xvY2sgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNTZWxlY3RGaXJzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdEluZGV4ID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluW9k+WJjemAieaLqemBk+WFt2lkXG4gICAgICovXG4gICAgcHVibGljIGdldFNlbGVjdGVkVG9vbElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFnTGlzdFt0aGlzLl9zZWxlY3RJbmRleF0uaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W5pyq5pi+56S655qE6YGT5YW35qCH562+aWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SGlkZGVuVGFnSWRzKCkge1xuICAgICAgICBsZXQgdGFncyA9IHRoaXMuX3RhZ0lkcy5zbGljZSgwLCB0aGlzLl90YWdJZHMubGVuZ3RoKTtcbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgdCBvZiB0aGlzLl90YWdMaXN0KSB7XG4gICAgICAgICAgICBpZih0YWdzLmluZGV4T2YodC5pZCkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRhZ3Muc3BsaWNlKHRhZ3MuaW5kZXhPZih0LmlkKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5L2/55So6YCJ5oup55qE6YGT5YW35qCH562+XG4gICAgICovXG4gICAgcHVibGljIHVzZVNlbGVjdFRhZygpIHtcbiAgICAgICAgdGhpcy51bmxvY2soKTtcblxuICAgICAgICAvLyDnrKzkuIDkuKrpgZPlhbfmmK/mma7pgJrlrZDlvLnvvIzkuI3pnIDopoHlj5jljJZcbiAgICAgICAgaWYodGhpcy5fc2VsZWN0SW5kZXggPT09IDApIHJldHVybjtcblxuICAgICAgICBsZXQgdGFnID0gdGhpcy5fdGFnTGlzdFt0aGlzLl9zZWxlY3RJbmRleF07XG4gICAgICAgIGxldCBuZXh0VGFnO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fbmV4dFRhZ0lkcy5wdXNoKHRhZy5pZCk7XG4gICAgICAgIHRoaXMuX3NlbGVjdEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fdGFnTGlzdFt0aGlzLl9zZWxlY3RJbmRleF0uc2VsZWN0KCk7XG5cbiAgICAgICAgbmV4dFRhZyA9IHRoaXMuX25leHRUYWdJZHMuc2hpZnQoKTtcblxuICAgICAgICB0YWcudXNlVGFnKG5leHRUYWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOmAieaLqeaMh+WumumBk+WFt+agh+etvlxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RUYWcobnVtOiBudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5fc2VsZWN0SW5kZXggPT09IG51bSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbdGhpcy5fc2VsZWN0SW5kZXhdLnVuc2VsZWN0KCk7XG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbbnVtXS5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSBudW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YCJ5oup5LiL5LiA5Liq6YGT5YW35qCH562+XG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdE5leHQoKSB7XG4gICAgICAgIGxldCBpbmRleDpudW1iZXI7XG4gICAgICAgIFxuICAgICAgICBpZihuYXZpZ2F0b3IudmlicmF0ZSkge1xuICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUoMTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbdGhpcy5fc2VsZWN0SW5kZXhdLnVuc2VsZWN0KCk7XG5cbiAgICAgICAgaW5kZXggPSB0aGlzLl9zZWxlY3RJbmRleCArIDE7XG4gICAgICAgIGlmKGluZGV4ID09PSB0aGlzLl90YWdMaXN0Lmxlbmd0aCkgaW5kZXggPSAwO1xuXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbaW5kZXhdLnNlbGVjdCgpO1xuICAgICAgICB0aGlzLl9zZWxlY3RJbmRleCA9IGluZGV4O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3RQcmV2aW91cygpIHtcbiAgICAgICAgbGV0IGluZGV4Om51bWJlcjtcblxuICAgICAgICBpZihuYXZpZ2F0b3IudmlicmF0ZSkge1xuICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUoMTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbdGhpcy5fc2VsZWN0SW5kZXhdLnVuc2VsZWN0KCk7XG5cbiAgICAgICAgaW5kZXggPSB0aGlzLl9zZWxlY3RJbmRleCAtIDE7XG4gICAgICAgIGlmKGluZGV4IDwgMCkgaW5kZXggPSB0aGlzLl90YWdMaXN0Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgdGhpcy5fdGFnTGlzdFtpbmRleF0uc2VsZWN0KCk7XG4gICAgICAgIHRoaXMuX3NlbGVjdEluZGV4ID0gaW5kZXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YCJ5oup5oyH5a6a5bqP5Y+355qE6YGT5YW35qCH562+XG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGZvcihsZXQgdCBvZiB0aGlzLl90YWdMaXN0KSB7XG4gICAgICAgICAgICB0LnVuc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbaW5kZXhdLnNlbGVjdCgpO1xuICAgICAgICB0aGlzLl9zZWxlY3RJbmRleCA9IGluZGV4O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBvcygpIHtcbiAgICAgICAgaWYoTGF5YS5zdGFnZS53aWR0aCA+PSAxMjgwKSB7XG4gICAgICAgICAgICB0aGlzLnBvcyhnbG9iYWwubGVmdEVkZ2UgLSAzNDgsIDMzNik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBvcygwLCAzMzYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICB9XG59IiwiLyoqXG4gKiDliIfmjaLpgZPlhbfmjInpkq5cbiAqL1xuY2xhc3MgQnRuU3dpdGNoIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZSB7XG4gICAgcHJpdmF0ZSBfY2VudGVyQnRuOiBTcHJpdGU7XG4gICAgLy8g5Yqf6IO96ZSBIHRydWXml7bkuI3og73mjqfliLbpgZPlhbfmoIfnrb7nmoTliIfmjaJcbiAgICBwcml2YXRlIF9mdW5jTG9jazogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5idG5fc3dpdGNoX2JnKTtcbiAgICAgICAgdGhpcy5yZXBvcygpO1xuICAgICAgICB0aGlzLnNpemUoODAsIDIxMCk7XG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLkJ0blN3aXRjaDtcblxuICAgICAgICB0aGlzLl9jZW50ZXJCdG4gPSBuZXcgU3ByaXRlKCk7XG4gICAgICAgIHRoaXMuX2NlbnRlckJ0bi5sb2FkSW1hZ2UoQXNzZXRzLkltZy5idG5fc3dpdGNoX2NlbnRlcik7XG4gICAgICAgIHRoaXMuX2NlbnRlckJ0bi5zaXplKDUwLCA1MCk7XG4gICAgICAgIHRoaXMuX2NlbnRlckJ0bi5waXZvdCgyNSwgMjUpO1xuICAgICAgICB0aGlzLl9jZW50ZXJCdG4ucG9zKDQwLCB0aGlzLmhlaWdodC8yKTtcblxuICAgICAgICB0aGlzLm9uKExheWFFdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLm9uTW91c2VEb3duKTtcblxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NlbnRlckJ0bik7XG5cbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VEb3duKGU6IExheWFFdmVudCkge1xuICAgICAgICBUd2Vlbi5jbGVhckFsbCh0aGlzLl9jZW50ZXJCdG4pO1xuXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YUV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWFFdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWFFdmVudC5NT1VTRV9PVVQsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VVcChlPzogTGF5YUV2ZW50KSB7XG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWFFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YUV2ZW50Lk1PVVNFX1VQLCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWFFdmVudC5NT1VTRV9PVVQsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgICAgICB0aGlzLl9mdW5jTG9jayA9IGZhbHNlO1xuXG4gICAgICAgIFR3ZWVuLnRvKHRoaXMuX2NlbnRlckJ0biwge3g6IDQwLCB5OiB0aGlzLmhlaWdodC8yfSwgNTAwLCBFYXNlLmNpcmNPdXQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3VzZU1vdmUoZTogTGF5YUV2ZW50KSB7XG4gICAgICAgIGxldCBtb3VzZSwgbGVuZ3RoLCBicG9zLCBjcG9zLCBsaW1pdExlbmd0aDtcblxuICAgICAgICBtb3VzZSA9IFV0aWxzLnAoTGF5YS5zdGFnZS5tb3VzZVgsIExheWEuc3RhZ2UubW91c2VZKTtcbiAgICAgICAgY3BvcyA9IFV0aWxzLnAodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgYnBvcyA9IFV0aWxzLnAobW91c2UueCAtIHRoaXMueCwgbW91c2UueSAtIHRoaXMueSk7XG4gICAgICAgIGxlbmd0aCA9IFV0aWxzLnBMZW5ndGgoYnBvcywgY3Bvcyk7XG4gICAgICAgIGxpbWl0TGVuZ3RoID0gdGhpcy5oZWlnaHQvMiAtIHRoaXMuX2NlbnRlckJ0bi5oZWlnaHQvMjtcbiAgICAgICAgXG4gICAgICAgIGlmKGxlbmd0aCA+PSBsaW1pdExlbmd0aCkge1xuICAgICAgICAgICAgLy8gbGV0IHAgPSBVdGlscy5jcm9zc2luZ1BvaW50TEMoYnBvcywgY3BvcywgbGltaXRMZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyDmjqfliLbpgZPlhbfmoIfnrb7nmoTliIfmjaJcbiAgICAgICAgICAgIGlmKHRoaXMuX2Z1bmNMb2NrID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmKGJwb3MueSA+IGNwb3MueSkge1xuICAgICAgICAgICAgICAgICAgICBHYW1lLkluc3RhbmNlLnRvb2xUYWdDb250YWluZXIuc2VsZWN0TmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5idXR0b25fMDAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihicG9zLnkgPCBjcG9zLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS50b29sVGFnQ29udGFpbmVyLnNlbGVjdFByZXZpb3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJ1dHRvbl8wMDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mdW5jTG9jayA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGJwb3MueSA+IGNwb3MueSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NlbnRlckJ0bi55ID0gdGhpcy5oZWlnaHQgLSB0aGlzLl9jZW50ZXJCdG4uaGVpZ2h0LzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jZW50ZXJCdG4ueSA9IHRoaXMuX2NlbnRlckJ0bi5oZWlnaHQvMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2VudGVyQnRuLnkgPSBicG9zLnk7XG4gICAgfVxuXG4gICAgcHVibGljIGJlTW91c2VVcCgpIHtcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwb3MoKSB7XG4gICAgICAgIGlmKExheWEuc3RhZ2Uud2lkdGggPj0gMTI4MCkge1xuICAgICAgICAgICAgdGhpcy5wb3MoZ2xvYmFsLmxlZnRFZGdlIC0gNDAwLCA1MDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb3MoMCwgNTAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZigpO1xuICAgIH1cbn0iLCJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvQmFzZUJhbGwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZ2FtZW9iamVjdC9CYWxsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvQ2Fubm9uLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvQnVsbGV0UHJvY2Vzcy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nYW1lb2JqZWN0L1RpbWVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvRGFzaExpbmUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZ2FtZW9iamVjdC90b29sL1Rvb2xUYWdDb250YWluZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZ2FtZW9iamVjdC90b29sL0J0blN3aXRjaC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9BbmltYXRpb25NYW5hZ2VyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1Njb3JlTWFuYWdlci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Nc2dNYW5hZ2VyLnRzXCIgLz5cblxuLyoqXG4gKiDluKfmm7TmlrDljIVcbiAqL1xuaW50ZXJmYWNlIEZyYW1lUGFjayB7XG4gICAga2V5ZnJhbWU6IG51bWJlcjtcbiAgICBjdHJsczogQXJyYXk8Q3RybD47XG59XG5cbi8qKlxuICog55So5oi35pON5L2cXG4gKi9cbmludGVyZmFjZSBDdHJsIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGN0cmw6IEN0cmxEYXRhXG59XG5cbmludGVyZmFjZSBDdHJsRGF0YSB7XG4gICAgYW5nbGU6IG51bWJlcixcbiAgICBwb3dlcjogbnVtYmVyLFxuICAgIGJ1bGxldFR5cGU6IHN0cmluZ1xufVxuXG4vKipcbiAqIOa4uOaIj+mAu+i+keexu1xuICovXG5jbGFzcyBHYW1lIHtcbiAgICBwcml2YXRlIGtleWZyYW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgY3VyZnJhbWU6IG51bWJlciA9IDA7XG4gICAgLy8g5ri45oiP54q25oCBXG4gICAgLy8gLTEg5ri45oiP5pyq5byA5aeLXG4gICAgLy8gMCDlgZzmraLvvIjmlrDnkIPnlJ/miJDkuK3vvIkg56aB5q2i5Lu75L2V5pON5L2c5ZKM5LiN5o6l5Y+X5paw55qE5a2Q5by55Y+R5bCE6K+35rGCXG4gICAgLy8gMSDmraPluLjov5DooYxcbiAgICBwdWJsaWMgX3N0YXR1czogbnVtYmVyID0gLTE7XG4gICAgLy8g5bin5pu05paw6Zif5YiXXG4gICAgcHJpdmF0ZSBfdXBkYXRlTGlzdDogQXJyYXk8RnJhbWVQYWNrPiA9IFtdO1xuICAgIC8vIOa4uOaIj+WFg+e0oCDmuLjmiI9VSVxuICAgIHByaXZhdGUgX215Q2Fubm9uOiBDYW5ub247XG4gICAgcHJpdmF0ZSBfeW91ckNhbm5vbjogQ2Fubm9uO1xuICAgIHByaXZhdGUgX2dhbWVCZzogU3ByaXRlO1xuICAgIHByaXZhdGUgX2JhbGw6IEJhbGw7XG4gICAgcHJpdmF0ZSBfZGFzaExpbmU6IERhc2hMaW5lO1xuICAgIHByaXZhdGUgX2J1bGxldFByb2Nlc3M6IEJ1bGxldFByb2Nlc3M7XG4gICAgcHJpdmF0ZSBfcHByb2Nlc3M6IFBQcm9jZXNzO1xuICAgIHByaXZhdGUgX3RpbWVyOiBUaW1lcjtcbiAgICBwcml2YXRlIF9jb3VudGVyOiBDb3VudERvd247XG4gICAgcHJpdmF0ZSBfdG9vbFRhZ0NvbnRhaW5lcjogVG9vbFRhZ0NvbnRhaW5lcjtcbiAgICBwcml2YXRlIF9idG5Td2l0Y2g6IEJ0blN3aXRjaDtcbiAgICBwdWJsaWMgc21va2UxO1xuICAgIHB1YmxpYyBzbW9rZTI7XG4gICAgcHVibGljIGJhbGxEaXJlY3Rpb25zID0gW107XG4gICAgcHVibGljIGJhbGxEaXJlY3Rpb25GYWN0b3IgPSAwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBHYW1lO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IEdhbWUge1xuICAgICAgICBpZiAoR2FtZS5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBHYW1lLmluc3RhbmNlID0gbmV3IEdhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gR2FtZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBnZXQgYmFsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhbGw7XG4gICAgfVxuXG4gICAgZ2V0IGJ1bGxldFByb2Nlc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9idWxsZXRQcm9jZXNzO1xuICAgIH1cblxuICAgIGdldCB0aW1lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWVyO1xuICAgIH1cblxuICAgIGdldCBzdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XG4gICAgfVxuXG4gICAgZ2V0IGNvdW50ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb3VudGVyO1xuICAgIH1cblxuICAgIGdldCB0b29sVGFnQ29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG9vbFRhZ0NvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBnZXQgYnRuU3dpdGNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYnRuU3dpdGNoO1xuICAgIH1cblxuICAgIHNldCBzdGF0dXMoc3RhdHVzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cblxuICAgIGdldCB1cGRhdGVMaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlTGlzdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QmFsbERpcmVjdGlvbigpIHtcbiAgICAgICAgaWYoIXRoaXMuYmFsbERpcmVjdGlvbnMubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSB0aGlzLmJhbGxEaXJlY3Rpb25zLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMuYmFsbERpcmVjdGlvbnMucHVzaChkaXJlY3Rpb24pO1xuICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluS4gOS4quWumuaXtuWZqFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDb3VudGVyKGZ1bmM6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5fY291bnRlciA9IG5ldyBDb3VudERvd24oMywgZnVuYyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb3VudGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMlua4uOaIj+WcuuaZr1xuICAgICAqL1xuICAgIHB1YmxpYyBpbml0U2NlbmUoKSB7XG4gICAgICAgIHRoaXMuaW5pdEJHKCk7XG4gICAgICAgIHRoaXMuaW5pdFJvbGUoKTtcbiAgICAgICAgdGhpcy5pbml0VUkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRMb29wKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVMaXN0LnNwbGljZSgwLCAxODApO1xuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCB0aGlzLCB0aGlzLnVwZGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5aeL5YyW6IOM5pmvXG4gICAgICovXG4gICAgcHJpdmF0ZSBpbml0QkcoKSB7XG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XG5cbiAgICAgICAgdGhpcy5fZ2FtZUJnID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICB0aGlzLl9nYW1lQmcubG9hZEltYWdlKEFzc2V0cy5JbWcuZ2FtZWJnKTtcbiAgICAgICAgdGhpcy5fZ2FtZUJnLnBpdm90KDY0MCwgNDAwKTtcbiAgICAgICAgdGhpcy5fZ2FtZUJnLnBvcyhjb25maWcuZ2FtZVdpZHRoIC8gMiwgY29uZmlnLmdhbWVIZWlnaHQgLyAyKTtcblxuICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZCh0aGlzLl9nYW1lQmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMlua4uOaIj+inkuiJsuWFg+e0oFxuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdFJvbGUoKSB7XG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW5Y+M5pa554Ku5Y+wXG4gICAgICAgIHRoaXMuX215Q2Fubm9uID0gbmV3IENhbm5vbihmYWxzZSk7XG4gICAgICAgIHRoaXMuX3lvdXJDYW5ub24gPSBuZXcgQ2Fubm9uKHRydWUpO1xuXG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKHRoaXMuX215Q2Fubm9uKTtcbiAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQodGhpcy5feW91ckNhbm5vbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5aeL5YyWVUlcbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRVSSgpIHtcblxuICAgICAgICAvLyDliJ3lp4vljJbliIbmlbDlkozliIbmlbDmnb9cbiAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLmluaXRTY29yZSgpO1xuXG4gICAgICAgIC8vIOWtkOW8ueWhq+WFhei/m+W6puadoVxuICAgICAgICB0aGlzLl9idWxsZXRQcm9jZXNzID0gbmV3IEJ1bGxldFByb2Nlc3MoKTtcblxuICAgICAgICAvLyDlipvluqbov5vluqbmnaFcbiAgICAgICAgdGhpcy5fcHByb2Nlc3MgPSBuZXcgUFByb2Nlc3MoKTtcblxuICAgICAgICAvLyDorqHml7blmahcbiAgICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoKTtcblxuICAgICAgICAvLyDpgZPlhbflrrnlmahcbiAgICAgICAgdGhpcy5fdG9vbFRhZ0NvbnRhaW5lciA9IG5ldyBUb29sVGFnQ29udGFpbmVyKCk7XG5cbiAgICAgICAgLy8g5YiH5o2i6YGT5YW35oyJ6ZKuXG4gICAgICAgIHRoaXMuX2J0blN3aXRjaCA9IG5ldyBCdG5Td2l0Y2goKTtcblxuICAgICAgICAvLyDovoXliqnnur9cbiAgICAgICAgdGhpcy5fZGFzaExpbmUgPSBuZXcgRGFzaExpbmUodGhpcy5fbXlDYW5ub24ueCwgdGhpcy5fbXlDYW5ub24ueSk7XG4gICAgICAgIE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2UuYWRkQ2hpbGQodGhpcy5fZGFzaExpbmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMluWwj+eQg1xuICAgICAqL1xuICAgIHB1YmxpYyBpbml0QmFsbChkaXJlY3Rpb246IG51bWJlcikge1xuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xuXG4gICAgICAgIC8vIOWIneWni+WMluavlOi1m+eQg1xuICAgICAgICB0aGlzLl9iYWxsID0gbmV3IEJhbGwoZGlyZWN0aW9uKTtcblxuICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZCh0aGlzLl9iYWxsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliJ3lp4vljJbnjqnlrrbmjqfliLblmahcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdENvbnRyb2woKSB7XG4gICAgICAgIHRoaXMuX2dhbWVCZy5vbihMYXlhRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5vbk1vdXNlRG93bik7XG5cbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhRXZlbnQuS0VZX1BSRVNTLCB0aGlzLCB0aGlzLm9uS2V5UHJlc3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWBnOatouaOp+WItlxuICAgICAqL1xuICAgIHB1YmxpYyBzdG9wQ29udHJvbCgpIHtcbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9mZihMYXlhRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5vbk1vdXNlRG93bik7XG5cbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YUV2ZW50LktFWV9QUkVTUywgdGhpcywgdGhpcy5vbktleVByZXNzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDplK7nm5jmjqfliLZcbiAgICAgKi9cbiAgICBwdWJsaWMgb25LZXlQcmVzcyhlOiBMYXlhRXZlbnQpIHtcbiAgICAgICAgbGV0IHRvb2xUYWdDb250YWluZXIgPSBHYW1lLkluc3RhbmNlLnRvb2xUYWdDb250YWluZXI7XG5cbiAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgNDk6XG4gICAgICAgICAgICAgICAgdG9vbFRhZ0NvbnRhaW5lci5zZWxlY3RUYWcoMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDUwOlxuICAgICAgICAgICAgICAgIHRvb2xUYWdDb250YWluZXIuc2VsZWN0VGFnKDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA1MTpcbiAgICAgICAgICAgICAgICB0b29sVGFnQ29udGFpbmVyLnNlbGVjdFRhZygyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeCueWHu+a7keWKqOaTjeaOp1xuICAgICAqL1xuICAgIHByaXZhdGUgb25Nb3VzZURvd24oZTogTGF5YUV2ZW50KSB7XG5cbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9uKExheWFFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9uKExheWFFdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xuICAgICAgICB0aGlzLl9nYW1lQmcub24oTGF5YUV2ZW50Lk1PVVNFX09VVCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xuXG4gICAgICAgIC8vIOiThOWKm+adoeW8gOWni+iThOWKm1xuICAgICAgICB0aGlzLl9wcHJvY2Vzcy5zdGFydCgpO1xuXG4gICAgICAgIC8vIOiuoeeul+eCueWHu+eCueWSjOeCruWPsOaXi+i9rOinkuW6plxuICAgICAgICBsZXQgbW91c2UgPSBVdGlscy5wKExheWEuc3RhZ2UubW91c2VYIC0gZ2xvYmFsLmxlZnRFZGdlLCBMYXlhLnN0YWdlLm1vdXNlWSk7XG4gICAgICAgIGxldCB2ZWN0b3IgPSBVdGlscy5wKG1vdXNlLnggLSB0aGlzLl9teUNhbm5vbi54LCBtb3VzZS55IC0gdGhpcy5fbXlDYW5ub24ueSk7XG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gLTEgKiBNYXRoLmF0YW4odmVjdG9yLnggLyB2ZWN0b3IueSkgKiAxODAgLyBNYXRoLlBJO1xuXG4gICAgICAgIHRoaXMuX2Rhc2hMaW5lLmRyYXdBc3Npc3RMaW5lKG1vdXNlKTtcbiAgICAgICAgdGhpcy5fbXlDYW5ub24uc2V0QW5nbGUoYW5nbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3VzZVVwKGU6IExheWFFdmVudCkge1xuICAgICAgICBsZXQgdG9vbFRhZ0NvbnRhaW5lciA9IEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lcjtcblxuICAgICAgICB0aGlzLl9nYW1lQmcub2ZmKExheWFFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9mZihMYXlhRXZlbnQuTU9VU0VfVVAsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9mZihMYXlhRXZlbnQuTU9VU0VfT1VULCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICAgICAgLy8g5p2+5omL5riF6Zmk6Jma57q/XG4gICAgICAgIHRoaXMuX2Rhc2hMaW5lLmNsZWFyTGluZXMoKTtcblxuICAgICAgICAvLyDlj5HpgIHlj5HlsITlrZDlvLnor7fmsYJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyAhPT0gMCAmJiAhdG9vbFRhZ0NvbnRhaW5lci5pc0xvY2soKSAmJiB0aGlzLmJ1bGxldFByb2Nlc3MuY29zdE9uZSh0aGlzLl9wcHJvY2Vzcy5wZXJjZW50ICogMiArICh0b29sVGFnQ29udGFpbmVyLmlzU2VsZWN0Rmlyc3QoKT8gMCA6IDAuNCkpKSB7XG4gICAgICAgICAgICBsZXQgY3RybERhdGEgPSB7XG4gICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMuX215Q2Fubm9uLmdldEFuZ2xlKCksXG4gICAgICAgICAgICAgICAgcG93ZXI6IHRoaXMuX3Bwcm9jZXNzLnBlcmNlbnQsXG4gICAgICAgICAgICAgICAgYnVsbGV0VHlwZTogdG9vbFRhZ0NvbnRhaW5lci5nZXRTZWxlY3RlZFRvb2xJZCgpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9vbFRhZ0NvbnRhaW5lci5sb2NrKCk7XG4gICAgICAgICAgICBTb2NrZXQuSW5zdGFuY2Uuc2VuZEN0cmwoY3RybERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5YGc5q2i5bm25riF56m66JOE5Yqb5p2hXG4gICAgICAgIHRoaXMuX3Bwcm9jZXNzLnN0b3AoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VNb3ZlKGU6IExheWFFdmVudCkge1xuICAgICAgICBsZXQgbW91c2UgPSBVdGlscy5wKExheWEuc3RhZ2UubW91c2VYIC0gZ2xvYmFsLmxlZnRFZGdlLCBMYXlhLnN0YWdlLm1vdXNlWSk7XG4gICAgICAgIGxldCB2ZWN0b3IgPSBVdGlscy5wKG1vdXNlLnggLSB0aGlzLl9teUNhbm5vbi54LCBtb3VzZS55IC0gdGhpcy5fbXlDYW5ub24ueSk7XG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gLTEgKiBNYXRoLmF0YW4odmVjdG9yLnggLyB2ZWN0b3IueSkgKiAxODAgLyBNYXRoLlBJO1xuXG4gICAgICAgIHRoaXMuX2Rhc2hMaW5lLmRyYXdBc3Npc3RMaW5lKG1vdXNlKTtcbiAgICAgICAgdGhpcy5fbXlDYW5ub24uc2V0QW5nbGUoYW5nbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOW4p+ebkeWQrFxuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmNoZWNrVXBkYXRlTGlzdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOajgOa1i+aVsOaNruWMhemYn+WIl1xuICAgICAqL1xuICAgIHByaXZhdGUgY2hlY2tVcGRhdGVMaXN0KCkge1xuICAgICAgICBsZXQgbCA9IHRoaXMuX3VwZGF0ZUxpc3QubGVuZ3RoO1xuXG4gICAgICAgIGlmIChsID4gMCAmJiBsIDwgMTApIHtcbiAgICAgICAgICAgIGxldCBkYXRhOiBGcmFtZVBhY2sgPSB0aGlzLl91cGRhdGVMaXN0LnNwbGljZSgwLCAxKVswXTtcbiAgICAgICAgICAgIHRoaXMucnVuRnJhbWVQYWNrKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5ydW5GcmFtZUxvZ2ljKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobCA+PSAxMCkge1xuXG4gICAgICAgICAgICAvLyDmoLnmja7lvoXmiafooYzmlbDmja7lpKflsI/lhrPlrprliqDpgJ/nmoTpgJ/luqZcbiAgICAgICAgICAgIGxldCBkbGVuZ3RoID0gbCA8IDEwMCA/IDIgOiBNYXRoLmNlaWwobCAvIDUwKTtcbiAgICAgICAgICAgIGxldCBkYXRhOiBGcmFtZVBhY2tbXSA9IHRoaXMuX3VwZGF0ZUxpc3Quc3BsaWNlKDAsIGRsZW5ndGgpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bkZyYW1lUGFjayhkYXRhW2ldKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bkZyYW1lTG9naWMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaJp+ihjOa4uOaIj+WFg+e0oOeahOW4p+mAu+i+kVxuICAgICAqL1xuICAgIHByaXZhdGUgcnVuRnJhbWVMb2dpYygpIHtcblxuICAgICAgICAvLyDlrZDlvLlcbiAgICAgICAgaWYgKGdsb2JhbC5zeW4gPT09IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGJBIG9mIEJ1bGxldC5teUJ1bGxldHMpIHtcbiAgICAgICAgICAgICAgICBiQS51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGJCIG9mIEJ1bGxldC55b3VyQnVsbGV0cykge1xuICAgICAgICAgICAgICAgIGJCLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGdsb2JhbC5zeW4gPT09IDEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGJCIG9mIEJ1bGxldC55b3VyQnVsbGV0cykge1xuICAgICAgICAgICAgICAgIGJCLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgYkEgb2YgQnVsbGV0Lm15QnVsbGV0cykge1xuICAgICAgICAgICAgICAgIGJBLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5bCP55CDXG4gICAgICAgIHRoaXMuX2JhbGwudXBkYXRlKCk7XG5cbiAgICAgICAgLy8g5a2Q5by55aGr5YWF6L+b5bqm5p2hXG4gICAgICAgIHRoaXMuX2J1bGxldFByb2Nlc3MudXBkYXRlKCk7XG5cbiAgICAgICAgLy8g6JOE5Yqb5p2hXG4gICAgICAgIHRoaXMuX3Bwcm9jZXNzLnVwZGF0ZSgpO1xuXG4gICAgICAgIC8vIOiuoeaXtuWZqFxuICAgICAgICB0aGlzLl90aW1lci51cGRhdGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDop6PmnpDmnI3liqHlmajluKfmlbDmja5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJ1bkZyYW1lUGFjayhkYXRhOiBGcmFtZVBhY2spIHtcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gU29ja2V0Lkluc3RhbmNlLmdldFVpZCgpO1xuICAgICAgICBsZXQgcm9sZTogc3RyaW5nO1xuXG4gICAgICAgIGZvciAobGV0IGMgb2YgZGF0YS5jdHJscykge1xuICAgICAgICAgICAgcm9sZSA9IGMuaWQgPT09IHVpZCA/ICdteXJvbGUnIDogJ3lvdXJyb2xlJztcblxuICAgICAgICAgICAgdGhpcy5wbGF5RGF0YShyb2xlLCBjLmN0cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJmcmFtZSA9IGRhdGEua2V5ZnJhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pWw5o2u6L6T5YWl6Zif5YiXXG4gICAgICovXG4gICAgcHVibGljIHB1c2hVcGRhdGVEYXRhKGRhdGE6IEZyYW1lUGFjaykge1xuICAgICAgICB0aGlzLl91cGRhdGVMaXN0LnB1c2goZGF0YSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyVXBkYXRlTGlzdCgpIHtcbiAgICAgICAgLy8g5aaC5p6c5pyJ5LiK5LiA5bGA5q6L55WZ5pWw5o2u5YiZ5riF56m65Yig6ZmkXG4gICAgICAgIGlmICh0aGlzLl91cGRhdGVMaXN0Lmxlbmd0aCA+IDApIHRoaXMuX3VwZGF0ZUxpc3QgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDop6PmnpDov5DooYzmlbDmja5cbiAgICAgKi9cbiAgICBwcml2YXRlIHBsYXlEYXRhKHJvbGU6IHN0cmluZywgY3RybDogQ3RybERhdGEpIHtcbiAgICAgICAgbGV0IHRvb2xUYWdDb250YWluZXIgPSBHYW1lLkluc3RhbmNlLnRvb2xUYWdDb250YWluZXI7XG5cbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChyb2xlID09PSAnbXlyb2xlJykge1xuICAgICAgICAgICAgdGhpcy5fbXlDYW5ub24uc2hvb3QoY3RybC5hbmdsZSwgY3RybC5wb3dlciwgY3RybC5idWxsZXRUeXBlKTtcblxuICAgICAgICAgICAgLy8g5L2/55So6YGT5YW355qE5Yqo55S7XG4gICAgICAgICAgICB0b29sVGFnQ29udGFpbmVyLnVzZVNlbGVjdFRhZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJvbGUgPT09ICd5b3Vycm9sZScpIHtcbiAgICAgICAgICAgIHRoaXMuX3lvdXJDYW5ub24uc2hvb3QoY3RybC5hbmdsZSwgY3RybC5wb3dlciwgY3RybC5idWxsZXRUeXBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWBnOatoua4uOaIj1xuICAgICAqL1xuICAgIHB1YmxpYyBnYW1lT3ZlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PT0gLTEpIHJldHVybjtcblxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xuXG4gICAgICAgIC8vIOS9v+e8k+WtmOS4reeahOWtkOW8ueeIhueCuFxuICAgICAgICBCdWxsZXQuYm9vbUFsbEJ1bGxldHMoKTtcblxuICAgICAgICAvLyDmuIXnkIbmnKrlrozmiJDnmoTorqHml7blmajku7vliqFcbiAgICAgICAgR2FtZS5JbnN0YW5jZS50aW1lci5jbGVhclRhc2tMaXN0KCk7XG4gICAgICAgIFxuICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UubWJhbGxzID0gMDtcbiAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnliYWxscyA9IDA7XG5cbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xuICAgICAgICB0aGlzLmNsZWFyT2JqZWN0cygpO1xuICAgICAgICB0aGlzLnN0b3BDb250cm9sKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY291bnRlcikgdGhpcy5jb3VudGVyLnN0b3AoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmuIXnkIblnLrmma/lr7nosaHlkozmlbDmja5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXJPYmplY3RzKCkge1xuICAgICAgICBpZiAodGhpcy5fdXBkYXRlTGlzdCkgdGhpcy5fdXBkYXRlTGlzdCA9IFtdO1xuICAgICAgICBpZiAodGhpcy5fYnVsbGV0UHJvY2VzcykgdGhpcy5fYnVsbGV0UHJvY2Vzcy5yZW1vdmUoKTtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyKSB0aGlzLl90aW1lci5yZW1vdmUoKTtcbiAgICAgICAgaWYgKHRoaXMuX2JhbGwpIHRoaXMuX2JhbGwucmVtb3ZlU2VsZigpO1xuICAgICAgICBpZiAodGhpcy5fbXlDYW5ub24pIHRoaXMuX215Q2Fubm9uLnJlbW92ZSgpO1xuICAgICAgICBpZiAodGhpcy5feW91ckNhbm5vbikgdGhpcy5feW91ckNhbm5vbi5yZW1vdmUoKTtcbiAgICAgICAgaWYgKHRoaXMuX3Bwcm9jZXNzKSB0aGlzLl9wcHJvY2Vzcy5yZW1vdmUoKTtcbiAgICAgICAgaWYgKHRoaXMuX3Rvb2xUYWdDb250YWluZXIpIHRoaXMuX3Rvb2xUYWdDb250YWluZXIucmVtb3ZlKCk7XG4gICAgICAgIGlmICh0aGlzLl9idG5Td2l0Y2gpIHRoaXMuX2J0blN3aXRjaC5yZW1vdmUoKTtcbiAgICAgICAgaWYgKHRoaXMuX2Rhc2hMaW5lKSB0aGlzLl9kYXNoTGluZS5yZW1vdmUoKTtcblxuICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UucmVtb3ZlU2NvcmVQYW5lbCgpO1xuICAgIH1cbn0iLCJ2YXIgZ2xvYmFsID0ge1xuICAgIC8qKlxuICAgICAqIEBkZXNjIOa4uOaIj+WMuuWfn+W3pui+uee8mFxuICAgICAqL1xuICAgIGxlZnRFZGdlOiAwLFxuICAgIC8qKlxuICAgICAqIEBkZXNj5ri45oiP5Yy65Z+f5Y+z6L6557yYXG4gICAgICovXG4gICAgcmlnaHRFZGdlOiAwLFxuICAgIC8qKlxuICAgICAqIOWQjOatpei+heWKqeWAvCAw77ya5L2/55So5bex5pa55a2Q5by56L+b6KGM56Kw5pKe5qOA5rWLIDHvvJrnm7jlj41cbiAgICAgKi9cbiAgICBzeW46IDBcbn07XG5cbi8qKlxuICog5qCH6K6w5pi+56S65bGC5a+56LGhXG4qL1xudmFyIERpc3BsYXlOYW1lID0ge1xuICAgIFN0YXJ0UGFnZTogJ3N0YXJ0cGFnZScsXG4gICAgR2FtZVBhZ2U6ICdnYW1lcGFnZScsXG4gICAgTG9hZGluZzogJ2xvYWRpbmcnXG59O1xuXG4vKipcbiAqIOaYvuekuuWxguaOkuW6j+W6j+WPt1xuICovXG52YXIgRGlzcGxheU9yZGVyID0ge1xuICAgIEJhY2tncm91bmQ6IDAsXG4gICAgU3RhcnRQYWdlOiAxLFxuICAgIEdhbWVQYWdlOiAyLFxuICAgIEJhY2tncm91bmRfSDogMyxcbiAgICBMb2FkaW5nOiA1LFxuICAgIEFzc2lzdExpbmU6IDEwLFxuICAgIFNoYWRvdzogMTUsXG4gICAgQnVsbGV0OiAxNixcbiAgICBCdWxsZXRCb29tOiAxOCxcbiAgICBCYWxsOiAyMCxcbiAgICBTbW9rZTogMjEsXG4gICAgQ2Fubm9uOiAyMixcbiAgICBCdG5Td2l0Y2g6IDI1LFxuICAgIFRvb2xDb250YWluZXI6IDI2LFxuICAgIFBQcm9jZXNzOiAyNyxcbiAgICBQcm9jZXNzQmFyOiAyOCxcbiAgICBUaW1lcjogMjksXG4gICAgUmVzdWx0UGFnZTogMzAsXG4gICAgQ291bnRUZXh0OiAzMSxcbiAgICBTY29yZVBhbmVsOiAzMixcbiAgICBNc2c6IDM1IFxufTtcblxudmFyIFRvb2wgPSB7XG4gICAgU3RhbmRhcmRCdWxsZXQ6IHtcbiAgICAgICAgdGFnOiAnYnVsbGV0JyxcbiAgICAgICAgbmFtZTogJ+WtkOW8uSdcbiAgICB9LFxuICAgIEljZUJ1bGxldDoge1xuICAgICAgICB0YWc6ICdpY2UnLFxuICAgICAgICBuYW1lOiAn5Yaw5by5J1xuICAgIH0sXG4gICAgRGl2aXNpb25CdWxsZXQ6IHtcbiAgICAgICAgdGFnOiAnZGl2aXNpb24nLFxuICAgICAgICBuYW1lOiAn5YiG6KOC5by5J1xuICAgIH0sXG4gICAgU21va2VCdWxsZXQ6IHtcbiAgICAgICAgdGFnOiAnc21va2UnLFxuICAgICAgICBuYW1lOiAn54Of6Zu+5by5J1xuICAgIH0sXG4gICAgQm9tYkJ1bGxldDoge1xuICAgICAgICB0YWc6ICdib21iJyxcbiAgICAgICAgbmFtZTogJ+eCuOW8uSdcbiAgICB9XG59O1xuXG4vKipcbiAqICDlhajlsYDotYTmupDlr7nosaFcbiAqL1xudmFyIEFzc2V0cyA9IHtcbiAgICBJbWc6IHtcbiAgICAgICAgZ2FtZWJnOiAncmVzL2dhbWViZy5wbmcnLFxuICAgICAgICBjYW5ub25fbTogJ3Jlcy9jYW5ub25fbS5wbmcnLFxuICAgICAgICBjYW5ub25feTogJ3Jlcy9jYW5ub25feS5wbmcnLFxuICAgICAgICBjYW5ub25fc2hhZG93OiAncmVzL2Nhbm5vbl9zaGFkb3cucG5nJyxcbiAgICAgICAgYnVsbGV0bTogJ3Jlcy9idWxsZXRfbS5wbmcnLFxuICAgICAgICBidWxsZXR5OiAncmVzL2J1bGxldF95LnBuZycsXG4gICAgICAgIGJ1bGxldF9pY2U6ICdyZXMvYnVsbGV0X2ljZS5wbmcnLFxuICAgICAgICBidWxsZXRfZGl2aXNpb246ICdyZXMvYnVsbGV0X2RpdmlzaW9uLnBuZycsXG4gICAgICAgIGJ1bGxldF9ib21iOiAncmVzL2J1bGxldF9ib21iLnBuZycsXG4gICAgICAgIGJ1bGxldF9zbW9rZTogJ3Jlcy9idWxsZXRfc21va2UucG5nJyxcbiAgICAgICAgYmFsbDogJ3Jlcy9iYWxsLnBuZycsXG4gICAgICAgIHByb2Nlc3M6ICdyZXMvcHJvY2Vzcy5wbmcnLFxuICAgICAgICBwcm9jZXNzQmc6ICdyZXMvcHJvY2Vzc2JnLnBuZycsXG4gICAgICAgIHN0YXJ0Qmc6ICdyZXMvc3RhcnRiZy5wbmcnLFxuICAgICAgICBtc2dCZzogJ3Jlcy9tc2diZy5wbmcnLFxuICAgICAgICBzY29yZUJnOiAncmVzL3Njb3JlYmcucG5nJyxcbiAgICAgICAgdGltZXJCZzogJ3Jlcy90aW1lcmJnLnBuZycsXG4gICAgICAgIHBwcm9jZXNzOiAncmVzL3Bwcm9jZXNzLnBuZycsXG4gICAgICAgIHBwcm9jZXNzYmc6ICdyZXMvcHByb2Nlc3NiZy5wbmcnLFxuICAgICAgICB0b29sdGFnX2ljZTogJ3Jlcy90b29sdGFnX2ljZS5wbmcnLFxuICAgICAgICB0b29sdGFnX2RpdmlzaW9uOiAncmVzL3Rvb2x0YWdfZGl2aXNpb24ucG5nJyxcbiAgICAgICAgdG9vbHRhZ19zbW9rZTogJ3Jlcy90b29sdGFnX3Ntb2tlLnBuZycsXG4gICAgICAgIHRvb2x0YWdfYnVsbGV0OiAncmVzL3Rvb2x0YWdfYnVsbGV0LnBuZycsXG4gICAgICAgIHRvb2x0YWdfYm9tYjogJ3Jlcy90b29sdGFnX2JvbWIucG5nJyxcbiAgICAgICAgYnRuX3N3aXRjaF9iZzogJ3Jlcy9idG5fc3dpdGNoX2JnLnBuZycsXG4gICAgICAgIGJ0bl9zd2l0Y2hfY2VudGVyOiAncmVzL2J0bl9zd2l0Y2hfY2VudGVyLnBuZycsXG4gICAgICAgIGJhbGxfZWZmZWN0X2ljZTogJ3Jlcy9pY2UucG5nJ1xuICAgIH0sXG4gICAgSnNvbjoge1xuICAgICAgICBzdGFydF9qc29uOiAncmVzL3N0YXJ0Lmpzb24nLFxuICAgICAgICByZXN1bHRfanNvbjogJ3Jlcy9SZXN1bHRQYWdlLmpzb24nLFxuICAgICAgICBibHVlX2Jvb206ICdyZXMvYmx1ZWJvb20uanNvbicsXG4gICAgICAgIHJlZF9ib29tOiAncmVzL3JlZGJvb20uanNvbicsXG4gICAgICAgIGdyZWVuX2Jvb206ICdyZXMvZ3JlZW5ib29tLmpzb24nLFxuICAgICAgICBib29tOiAncmVzL2Jvb20uanNvbicsXG4gICAgICAgIHNtb2tlOiAncmVzL3Ntb2tlLmpzb24nXG4gICAgfSxcbiAgICBTb3VuZDoge1xuICAgICAgICBoaXRfMDAxOiAncmVzL3NvdW5kcy9oaXQwMDEubXAzJyxcbiAgICAgICAgaGl0XzAwMjogJ3Jlcy9zb3VuZHMvaGl0MDAyLm1wMycsXG4gICAgICAgIGJvb21fMDAxOiAncmVzL3NvdW5kcy9ib29tMDAxLm1wMycsXG4gICAgICAgIGJvb21fMDAyOiAncmVzL3NvdW5kcy9ib29tMDAyLm1wMycsXG4gICAgICAgIGJvb21fMDAzOiAncmVzL3NvdW5kcy9ib29tMDAzLm1wMycsXG4gICAgICAgIGJ1dHRvbl8wMDE6ICdyZXMvc291bmRzL2J1dHRvbjAwMS5tcDMnLFxuICAgICAgICBzaG9vdDogJ3Jlcy9zb3VuZHMvc2hvb3QubXAzJyxcbiAgICAgICAgc21va2U6ICdyZXMvc291bmRzL3Ntb2tlLm1wMycsXG4gICAgICAgIGZyb3plbjogJ3Jlcy9zb3VuZHMvZnJvemVuLm1wMycsXG4gICAgICAgIGZpbmRtYXRjaDogJ3Jlcy9zb3VuZHMvZmluZG1hdGNoLm1wMycsXG4gICAgICAgIGNvdW50ZXI6ICdyZXMvc291bmRzL2NvdW50ZXIubXAzJyxcbiAgICAgICAgZ2FtZXN0YXJ0OiAncmVzL3NvdW5kcy9nYW1lc3RhcnQubXAzJyxcbiAgICAgICAgZ2FtZXdpbjogJ3Jlcy9zb3VuZHMvZ2FtZXdpbi5tcDMnLFxuICAgICAgICBnYW1lb3ZlcjogJ3Jlcy9zb3VuZHMvZ2FtZW92ZXIubXAzJyxcbiAgICAgICAgbXNjb3JlOiAncmVzL3NvdW5kcy9tc2NvcmUubXAzJyxcbiAgICAgICAgeXNjb3JlOiAncmVzL3NvdW5kcy95c2NvcmUubXAzJ1xuICAgIH0sXG4gICAgZm9udDoge1xuICAgICAgICBudW06ICdyZXMvbnVtZm9udC5mbnQnXG4gICAgfVxufSIsIi8qKlxuICog5YCS6K6h5pe2XG4gKi9cbmNsYXNzIENvdW50RG93biBleHRlbmRzIGxheWEuZGlzcGxheS5UZXh0e1xuXG4gICAgY29uc3RydWN0b3IobnVtOiBudW1iZXIsIGNiOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5mb250ID0gJ2RpeWZvbnQnO1xuICAgICAgICB0aGlzLnRleHQgPSBudW0udG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5waXZvdCh0aGlzLndpZHRoLzIsIHRoaXMuaGVpZ2h0LzIpO1xuICAgICAgICB0aGlzLnBvcyhjb25maWcuZ2FtZVdpZHRoLzIsIGNvbmZpZy5nYW1lSGVpZ2h0LzIgLSAxMCk7XG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLkNvdW50VGV4dDtcblxuICAgICAgICB0aGlzLmFuaW1hdGVDb3VudCgzLCBjYik7XG5cbiAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuY291bnRlciwgMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlQ291bnQobnVtOiBudW1iZXIsIGNiKSB7XG4gICAgICAgIFxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwMCwgdGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgbnVtLS07XG5cbiAgICAgICAgICAgIHRoaXMudGV4dCA9IG51bS50b1N0cmluZygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihudW0gPD0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgY2IuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICBTb3VuZE1hbmFnZXIuc3RvcFNvdW5kKEFzc2V0cy5Tb3VuZC5jb3VudGVyKTtcbiAgICAgICAgICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5nYW1lc3RhcnQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5hbmltYXRlQ291bnQobnVtLCBjYik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdG9wKCkge1xuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0dhbWUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2dhbWVvYmplY3QvQ291bnREb3duLnRzXCIgLz5cblxuY2xhc3MgU29ja2V0IHtcbiAgICBwcml2YXRlIF9zb2NrZXQ7XG4gICAgcHJpdmF0ZSBnYW1lOiBHYW1lO1xuICAgIHByaXZhdGUgdWlkOiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIF9tTmFtZTogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBfeU5hbWU6IHN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgX2FjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gaW8uY29ubmVjdChjb25maWcuc29ja2V0U2VydmVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogU29ja2V0O1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IFNvY2tldCB7XG4gICAgICAgIGlmIChTb2NrZXQuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgU29ja2V0Lmluc3RhbmNlID0gbmV3IFNvY2tldCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTb2NrZXQuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y+W5b6X55So5oi3aWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0VWlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy51aWQ7XG4gICAgfVxuXG4gICAgZ2V0IG1OYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbU5hbWU7XG4gICAgfVxuXG4gICAgZ2V0IHlOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5feU5hbWU7XG4gICAgfVxuXG4gICAgZ2V0IHNvY2tldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlj5blvpflvZPliY3muLjmiI9cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q3VycmVudEdhbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55uR5ZCsc29ja2V05LqL5Lu2XG4gICAgICovXG4gICAgcHVibGljIGluaXRMaXN0ZW4oKSB7XG5cbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuXG4gICAgICAgICAgICAvLyDmuLjmiI/ov5vnqIvnu5PmnZ/lubbmmL7npLrov57mjqXmlq3lvIDkv6Hmga9cbiAgICAgICAgICAgIEdhbWUuSW5zdGFuY2UuZ2FtZU92ZXIoKTtcblxuICAgICAgICAgICAgTXNnTWFuYWdlci5JbnN0YW5jZS5zaG93TWVzc2FnZSgn5LiO5pyN5Yqh5Zmo5pat5byA6L+e5o6lJywgMzApO1xuXG4gICAgICAgICAgICAvLyBzb2NrZXTnirbmgIHmlLnlj5hcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpZW50IGRpc2Nvbm5lY3QnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywgKGVycm9yKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcblxuICAgICAgICAgICAgICAgIC8vIHNvY2tldOa/gOa0u+eKtuaAgeS4i+aYvuekuuS/oeaBr1xuICAgICAgICAgICAgICAgIE1zZ01hbmFnZXIuSW5zdGFuY2Uuc2hvd01lc3NhZ2UoJ+i/nuaOpeacjeWKoeWZqOWksei0pScsIDMwKTtcblxuICAgICAgICAgICAgICAgIC8vIHNvY2tldOeKtuaAgeaUueWPmFxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDnmbvlvZXmiJDlip9cbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCd1c2VyOmxvZ2luU3VjY2VzcycsIChkYXRhOiB7IHVpZDogc3RyaW5nLCB1c2VybmFtZTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHRoaXMudWlkID0gZGF0YS51aWQ7XG4gICAgICAgICAgICB0aGlzLl9tTmFtZSA9IGRhdGEudXNlcm5hbWU7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbiBzdWNjZXNzJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaIv+mXtOWIm+W7uuaIkOWKn1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ3Jvb206Y3JlYXRlZCcsIChkYXRhOiB7IG9wcG9uZW50OiBzdHJpbmcsIGJhbGxEaXJlY3Rpb246IG51bWJlciB9KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlIHJvb20gc3VjY2VzcycpO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBHYW1lLkluc3RhbmNlO1xuXG4gICAgICAgICAgICAvLyDliJ3lp4vljJblkIzmraXovoXliqnlgLxcbiAgICAgICAgICAgIGdsb2JhbC5zeW4gPSBkYXRhLmJhbGxEaXJlY3Rpb247XG5cbiAgICAgICAgICAgIC8vIOWtmOWCqOWvueaWueWQjeWtl1xuICAgICAgICAgICAgdGhpcy5feU5hbWUgPSBkYXRhLm9wcG9uZW50O1xuXG4gICAgICAgICAgICAvLyDmmL7npLrmib7liLDmr5TotZtcbiAgICAgICAgICAgIE1zZ01hbmFnZXIuSW5zdGFuY2Uuc2V0VGV4dCgn5om+5Yiw5q+U6LWbJyk7XG5cbiAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmZpbmRtYXRjaCk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jbGVhclVwZGF0ZUxpc3QoKTtcblxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDIwMDAsIHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFJlYWR5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyDmuLjmiI/kuLvopoHluKfmlbDmja5cbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdmcmFtZTp1cGRhdGUnLCAodXBkYXRlOiBGcmFtZVBhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wdXNoVXBkYXRlRGF0YSh1cGRhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2dhbWU6c3RhcnQnLCAoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyDljrvmjonmtojmga/mmL7npLrmoYZcbiAgICAgICAgICAgIE1zZ01hbmFnZXIuSW5zdGFuY2UucmVtb3ZlTWVzc2FnZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5byA5aeL5ri45oiP6YC76L6RXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmluaXRTY2VuZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5iYWxsRGlyZWN0aW9ucyA9IGRhdGEuZGlyZWN0aW9ucztcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYmFsbERpcmVjdGlvbkZhY3RvciA9IGRhdGEuaWQgPT09IHRoaXMudWlkID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IHRoaXMuZ2FtZS5nZXRCYWxsRGlyZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmluaXRCYWxsKHRoaXMuZ2FtZS5iYWxsRGlyZWN0aW9uRmFjdG9yID8gZGlyZWN0aW9uIDogMSAtIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAvLyDnp7vpmaTlhajlsYDog4zmma9cbiAgICAgICAgICAgICAgICBNYWluLkluc3RhbmNlLnJlbW92ZUJhY2tncm91bmQoKTtcbiAgICAgICAgICAgICAgICAvLyDlvIDlp4vlgJLorqHml7ZcbiAgICAgICAgICAgICAgICBNYWluLkluc3RhbmNlLmdhbWVQYWdlLmFkZENoaWxkKEdhbWUuSW5zdGFuY2UuZ2V0Q291bnRlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0dXMgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuaW5pdENvbnRyb2woKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXJ0TG9vcCgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDmjqXmlLbnkIPnmoTmlrnlkJFcbiAgICAgICAgLy8gdGhpcy5fc29ja2V0Lm9uKCdnYW1lOmJhbGxkaXJlY3Rpb24nLCAoZGF0YSkgPT4ge1xuICAgICAgICAvLyAgICAgLy8gbGV0IGRpcmVjdGlvbiA9IGRhdGEuaWQgPT09IHRoaXMudWlkID8gZGF0YS5kaXJlY3Rpb24gOiAoMSAtIGRhdGEuZGlyZWN0aW9uKTtcbiAgICAgICAgLy8gICAgIC8vIEdhbWUuSW5zdGFuY2UuYmFsbC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIC8vIH0pO1xuXG5cbiAgICAgICAgLy8g5YiG5pWw6L+b6LSm5pi+56S6XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZ2FtZTpzY29yZWluJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxldCBzY29yZXMgPSBkYXRhLnNjb3JlcztcblxuICAgICAgICAgICAgaWYgKGRhdGEuaWQgPT09IHRoaXMudWlkKSB7XG4gICAgICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnNldFNjb3JlcygnbWluZScsIHsgZXhwbG9zaW9uczogc2NvcmVzLmV4cGxvc2lvbnMsIGJhbGxzOiBzY29yZXMuYmFsbHMsIHNjb3JlOiBzY29yZXMuc2NvcmUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2Uuc2V0U2NvcmVzKCd5b3VyJywgeyBleHBsb3Npb25zOiBzY29yZXMuZXhwbG9zaW9ucywgYmFsbHM6IHNjb3Jlcy5iYWxscywgc2NvcmU6IHNjb3Jlcy5zY29yZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5pyA57uI5YiG5pWwXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZ2FtZTpzY29yZXMnLCAoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyDmnInnjqnlrrbnprvnur8g6L+b5YWl5ri45oiP57uT566X6Zi25q61XG4gICAgICAgICAgICBpZiAoZGF0YS5tc2cpIHtcbiAgICAgICAgICAgICAgICAvLyDnu5PmnZ/muLjmiI/ov5vnqItcbiAgICAgICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XG5cbiAgICAgICAgICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnNob3dNZXNzYWdlKGRhdGEubXNnLCAyOCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLCB0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnJlbW92ZU1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNjb3JlTWFuYWdlci5JbnN0YW5jZS5zaG93R2FtZVJlc3VsdChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3Bwb25lbnQgbGVhdmUgcm9vbS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEdhbWUuSW5zdGFuY2UuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgICAgICBpZiAoR2FtZS5JbnN0YW5jZS50aW1lci5pc1RpbWVvdXQoKSkge1xuICAgICAgICAgICAgICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnNob3dNZXNzYWdlKCfml7bpl7TliLDvvIzmr5TotZvnu5PmnZ8nLCAzMCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMDAsIHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnJlbW92ZU1lc3NhZ2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2Uuc2hvd0dhbWVSZXN1bHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnNob3dHYW1lUmVzdWx0KGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2dhbWU6ZXJyb3InLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5tc2cpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ3N5czptc2cnLCAoZGF0YTogeyBtc2c6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3lzdGVtIG1lc3NhZ2U6ICcgKyBkYXRhLm1zZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdF90aW1lb3V0JywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3QgdGltZW91dCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ3JlY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGllbnQgcmVjb25uZWN0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGllbnQgY29ubmVjdGVkJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOmAmui/h+eUqOaIt+WQjeeZu+W9lVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dpbihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ3VzZXI6bG9naW4nLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5a+75om+5q+U6LWbXG4gICAgICovXG4gICAgcHVibGljIG1hdGNoKCkge1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgncm9vbTptYXRjaCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWHhuWkh1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSZWFkeSgpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ3VzZXI6cmVhZHknKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlj5HpgIHmk43kvZxcbiAgICAgKiBAcGFyYW0gY3RybERhdGEg5pON5L2c5pWw5o2uIFxuICAgICAqL1xuICAgIHB1YmxpYyBzZW5kQ3RybChjdHJsRGF0YTogQ3RybERhdGEpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ3VzZXI6Y3RybCcsIHsgaWQ6IHRoaXMudWlkLCBjdHJsOiBjdHJsRGF0YSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlrZDlvLnniIbngrjlvpfliIZcbiAgICAgKi9cbiAgICBwdWJsaWMgY2F1c2VFeHBsb3Npb24oKSB7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdnYW1lOnNjb3JlaW4nLCB7IGlkOiB0aGlzLnVpZCwgdHlwZTogJ2J1bGxldEV4cGxvc2lvbicgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6L+b55CD5b6X5YiGXG4gICAgICovXG4gICAgcHVibGljIGJhbGxJbigpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ2dhbWU6c2NvcmVpbicsIHsgaWQ6IHRoaXMudWlkLCB0eXBlOiAnYmFsbGluJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpgIDlh7rmiL/pl7RcbiAgICAgKi9cbiAgICBwdWJsaWMgbGVhdmVSb29tKCkge1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgncm9vbTpsZWF2ZScpO1xuICAgIH1cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdWkudHNcIiAvPlxuXG5jbGFzcyBTdGFydFBhZ2UgZXh0ZW5kcyB1aS5zdGFydFVJIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5uYW1lID0gRGlzcGxheU5hbWUuU3RhcnRQYWdlO1xuXHRcdHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlN0YXJ0UGFnZTtcblx0XHR0aGlzLnBvcyhnbG9iYWwubGVmdEVkZ2UsIDApO1xuXHRcdHRoaXMuYnRuTWF0Y2gub24oTGF5YUV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLm9uQnRuTWF0Y2gpO1xuXHRcdHRoaXMuYnRuSm9pblJvb20ub24oTGF5YUV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLm9uQnRuSm9pblJvb20pO1xuXHRcdHRoaXMuYnRuQ3JlYXRlUm9vbS5vbihMYXlhRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMub25CdG5DcmVhdGVSb29tKTtcblx0fVxuXG5cdHByaXZhdGUgb25CdG5NYXRjaCgpIHtcblx0XHRTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5idXR0b25fMDAxKTtcblx0XHRcblx0XHQvLyDmuIXnkIbnlYzpnaJVSVxuXHRcdFR3ZWVuLnRvKHRoaXMsIHthbHBoYTogMH0sIDIwMCwgbnVsbCwgSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xuXHRcdFx0dGhpcy5yZW1vdmUoKTtcblxuXHRcdFx0dGhpcy5hbHBoYSA9IDE7XG5cblx0XHRcdC8vIOaYvuekuuetieW+heeVjOmdolxuXHRcdFx0TXNnTWFuYWdlci5JbnN0YW5jZS5zaG93TWVzc2FnZSgn5a+75om+5q+U6LWb5LitJyk7XG5cdFx0XHRNc2dNYW5hZ2VyLkluc3RhbmNlLnNob3dUaXBzKCfog5zliKnmnaHku7ZcXG4oMSku6L+b55CD5pWw6L6+5YiwMTDkuKpcXG4oMiku5pyA57uI5YiG5pWw5pu06auYJyk7XG5cblx0XHRcdC8vIOW8gOWni+ivt+axguWMuemFjVxuXHRcdFx0U29ja2V0Lkluc3RhbmNlLm1hdGNoKCk7XG5cdFx0fSkpO1xuXHR9XG5cblx0cHJpdmF0ZSBvbkJ0bkpvaW5Sb29tKCkge1xuXHRcdFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJ1dHRvbl8wMDEpO1xuXHRcdGFsZXJ0KCfmiL/pl7Tlip/og73lsJrmnKrkuIrnur8nKTtcblx0fVxuXG5cdHByaXZhdGUgb25CdG5DcmVhdGVSb29tKCkge1xuXHRcdFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJ1dHRvbl8wMDEpO1xuXHRcdGFsZXJ0KCfmiL/pl7Tlip/og73lsJrmnKrkuIrnur8nKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmUoKSB7XG5cdFx0dGhpcy5yZW1vdmVTZWxmKCk7XG5cdH1cblxuXHRwdWJsaWMgZGlzYWJsZUJ0bigpIHtcblx0XHR0aGlzLmJ0bk1hdGNoLm9mZkFsbCgpO1xuXHR9XG59IiwiaW50ZXJmYWNlIFBvaW50IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xufVxuXG5tb2R1bGUgVXRpbHMge1xuICAgIC8qKlxuICAgICAqIOaYvuekuuetieW+heeVjOmdolxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBzaG93TG9hZGluZygpIHtcbiAgICAgICAgdmFyIHRleHQ6IExheWFUZXh0ID0gbmV3IExheWFUZXh0KCk7XG5cdFx0XHRcbiAgICAgICAgdGV4dC5uYW1lID0gRGlzcGxheU5hbWUuTG9hZGluZztcbiAgICAgICAgdGV4dC5jb2xvciA9IFwiI0ZGRkZGRlwiO1xuICAgICAgICB0ZXh0LmZvbnQgPSBcIkltcGFjdFwiO1xuICAgICAgICB0ZXh0LmZvbnRTaXplID0gNTA7XG4gICAgICAgIHRleHQudGV4dCA9IFwiZmluZGluZyBtYXRjaC4uLi4uLlwiO1xuICAgICAgICB0ZXh0LnggPSBMYXlhLnN0YWdlLndpZHRoLzIgLSB0ZXh0LndpZHRoLzI7XG4gICAgICAgIHRleHQueSA9IExheWEuc3RhZ2UuaGVpZ2h0LzIgLSB0ZXh0LmhlaWdodC8yO1xuXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGV4dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm5Y+R55Sf56Kw5pKeXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzUmVjdGFuZ2xlQ29sbGlzaW9uKG9iamVjdEEsIG9iamVjdEIpIHtcbiAgICAgICAgdmFyIHhEaXMgPSBNYXRoLmFicyhvYmplY3RBLnggLSBvYmplY3RCLngpO1xuICAgICAgICB2YXIgeURpcyA9IE1hdGguYWJzKG9iamVjdEEueSAtIG9iamVjdEIueSk7XG5cbiAgICAgICAgaWYgKHhEaXMgPD0gKG9iamVjdEEud2lkdGggKyBvYmplY3RCLndpZHRoKSAvIDIgJiZcbiAgICAgICAgICAgIHlEaXMgPD0gKG9iamVjdEEuaGVpZ2h0ICsgb2JqZWN0Qi5oZWlnaHQpIC8gMikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIpOaWreS4pOS4quWchuS5i+mXtOaYr+WQpueisOaSnlxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0NpcmNsZUNvbGxpc2lvbihjaXJjbGVBLCBjaXJjbGVCKSB7XG4gICAgICAgIGxldCByYyA9IE1hdGguc3FydChNYXRoLnBvdyhjaXJjbGVBLnggLSBjaXJjbGVCLngsIDIpICsgTWF0aC5wb3coY2lyY2xlQS55IC0gY2lyY2xlQi55LCAyKSk7XG5cbiAgICAgICAgaWYocmMgPD0gKGNpcmNsZUEucmFkaXVzICsgY2lyY2xlQi5yYWRpdXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K6h566X5Y+N5by55ZCO5Lik5bCP55CD55qE6L+Q5Yqo5pa55ZCRXG4gICAgICogQHBhcmFtIHBvc0Eg5bCP55CDQeeahOS9jee9rlxuICAgICAqIEBwYXJhbSBwb3NCIOWwj+eQg0LnmoTkvY3nva5cbiAgICAgKiBAcGFyYW0gdkEg5bCP55CDQeeahOmAn+W6plxuICAgICAqIEBwYXJhbSB2QiDlsI/nkINC55qE6YCf5bqmXG4gICAgICogQGNvbnZlcnQg5ZCM5q2l6K6h566X6L6F5YqpXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbXBCYWxsUmVib3VuZChwb3NBOiBQb2ludCwgcG9zQjogUG9pbnQsIHZBOiB7dng6bnVtYmVyLCB2eTpudW1iZXJ9LCB2Qjoge3Z4Om51bWJlciwgdnk6bnVtYmVyfSwgY29udmVydDpib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYoY29udmVydCkge1xuICAgICAgICAgICAgcG9zQS54ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lV2lkdGggLSBwb3NBLngpO1xuICAgICAgICAgICAgcG9zQS55ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lSGVpZ2h0IC0gcG9zQS55KTtcbiAgICAgICAgICAgIHBvc0IueCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gcG9zQi54KTtcbiAgICAgICAgICAgIHBvc0IueSA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZUhlaWdodCAtIHBvc0IueSk7XG4gICAgICAgICAgICB2QS52eCAqPSAtMTtcbiAgICAgICAgICAgIHZBLnZ5ICo9IC0xO1xuICAgICAgICAgICAgdkIudnggKj0gLTE7XG4gICAgICAgICAgICB2Qi52eSAqPSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByYyA9IFV0aWxzLnBMZW5ndGgocG9zQSwgcG9zQik7XG4gICAgICAgIGxldCBheCA9IHJjID09PSAwPyAwIDogKCh2QS52eCAtIHZCLnZ4KSpNYXRoLnBvdygocG9zQS54IC0gcG9zQi54KSAsIDIpICsgKHZBLnZ5IC0gdkIudnkpKihwb3NBLnggLSBwb3NCLngpKihwb3NBLnkgLSBwb3NCLnkpKS9NYXRoLnBvdyhyYyAsIDIpO1xuICAgICAgICBsZXQgYXkgPSByYyA9PT0gMD8gMCA6ICgodkEudnkgLSB2Qi52eSkqTWF0aC5wb3coKHBvc0EueSAtIHBvc0IueSkgLCAyKSArICh2QS52eCAtIHZCLnZ4KSoocG9zQS54IC0gcG9zQi54KSoocG9zQS55IC0gcG9zQi55KSkvTWF0aC5wb3cocmMgLCAyKTtcblxuICAgICAgICBsZXQgdkF4ID0gVXRpbHMuZmxvYXROKHZBLnZ4IC0gYXgpLFxuICAgICAgICAgICAgdkF5ID0gVXRpbHMuZmxvYXROKHZBLnZ5IC0gYXkpLFxuICAgICAgICAgICAgdkJ4ID0gVXRpbHMuZmxvYXROKHZCLnZ4ICsgYXgpLFxuICAgICAgICAgICAgdkJ5ID0gVXRpbHMuZmxvYXROKHZCLnZ5ICsgYXkpO1xuXG4gICAgICAgIGlmKGNvbnZlcnQpIHtcbiAgICAgICAgICAgIHZBeCAqPSAtMTtcbiAgICAgICAgICAgIHZBeSAqPSAtMTtcbiAgICAgICAgICAgIHZCeCAqPSAtMTtcbiAgICAgICAgICAgIHZCeSAqPSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbdkF4LCB2QXksIHZCeCwgdkJ5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkv67mraPnorDmkp7kvY3nva5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZml4Q29sbGlzaW9uKHBvc0E6IFBvaW50LCBwb3NCOiBQb2ludCwgckE6IG51bWJlciwgckI6IG51bWJlciwgY29udmVydDpib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYoY29udmVydCkge1xuICAgICAgICAgICAgcG9zQS54ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lV2lkdGggLSBwb3NBLngpO1xuICAgICAgICAgICAgcG9zQS55ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lSGVpZ2h0IC0gcG9zQS55KTtcbiAgICAgICAgICAgIHBvc0IueCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gcG9zQi54KTtcbiAgICAgICAgICAgIHBvc0IueSA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZUhlaWdodCAtIHBvc0IueSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCByYyA9IFV0aWxzLnBMZW5ndGgocG9zQSwgcG9zQik7XG4gICAgICAgIGxldCBsZW5ndGggPSAockEgKyByQiAtIHJjKS8yO1xuICAgICAgICBsZXQgY3ggPSByYyA9PT0gMD8gMCA6IGxlbmd0aCAqIChwb3NBLnggLSBwb3NCLngpIC8gcmM7XG4gICAgICAgIGxldCBjeSA9IHJjID09PSAwPyAwIDogbGVuZ3RoICogKHBvc0EueSAtIHBvc0IueSkgLyByYztcbiAgICAgICAgbGV0IGF4ID0gVXRpbHMuZmxvYXROKHBvc0EueCArIGN4KTtcbiAgICAgICAgbGV0IGF5ID0gVXRpbHMuZmxvYXROKHBvc0EueSArIGN5KTtcbiAgICAgICAgbGV0IGJ4ID0gVXRpbHMuZmxvYXROKHBvc0IueCAtIGN4KTtcbiAgICAgICAgbGV0IGJ5ID0gVXRpbHMuZmxvYXROKHBvc0IueSAtIGN5KTtcblxuICAgICAgICBpZihjb252ZXJ0KSB7XG4gICAgICAgICAgICBheCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gYXgpO1xuICAgICAgICAgICAgYXkgPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVIZWlnaHQgLSBheSk7XG4gICAgICAgICAgICBieCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gYngpO1xuICAgICAgICAgICAgYnkgPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVIZWlnaHQgLSBieSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW2F4LCBheSwgYngsIGJ5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDop5LluqbmoIflh4bljJblpITnkIYgKC0xODAsIDE4MClcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gc3RhbmRhcmRBbmdsZShhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgIGxldCBvZmZzZXQscmVzO1xuXG4gICAgICAgIGlmKGFuZ2xlID4gMTgwKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBNYXRoLmZsb29yKChhbmdsZSArIDE4MCkgLyAzNjApICogMzYwO1xuICAgICAgICAgICAgcmVzID0gYW5nbGUgLSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihhbmdsZSA8IC0xODApIHtcbiAgICAgICAgICAgIG9mZnNldCA9IE1hdGguZmxvb3IoKDE4MCAtIGFuZ2xlKSAvIDM2MCkgKiAzNjA7XG4gICAgICAgICAgICByZXMgPSBhbmdsZSArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IGFuZ2xlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDngrnliLDnm7Tnur/nmoTot53nprtcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VUb0xpbmUocG9pbnR4LCBwb2ludHksIGxpbmV4LCBsaW5leSwgdngsIHZ5KSB7XG4gICAgICAgIGxldCBBLCBCLCBDO1xuXG4gICAgICAgIEEgPSB2eTtcbiAgICAgICAgQiA9IHZ4ICogLTE7XG4gICAgICAgIEMgPSBsaW5leSAqIHZ4IC0gbGluZXggKiB2eTtcblxuICAgICAgICBsZXQgcyA9IE1hdGguc3FydChNYXRoLnBvdyhBICwgMikrTWF0aC5wb3coQiAsIDIpKTtcbiAgICAgICAgbGV0IGcgPSBwb2ludHggKiBBICsgcG9pbnR5ICogQiArIEM7XG5cbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5hYnMoZyAvIHMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDngrnnm7jlr7nkuo7nm7Tnur/nmoTkvY3nva5cbiAgICAgKiBAcmV0dXJuIDE65LiK5pa5IC0xOuS4i+aWuSAwOiDlnKjnm7Tnur/kuIpcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gcG9zVG9MaW5lKHBvaW50eCwgcG9pbnR5LCBsaW5leCwgbGluZXksIHZ4LCB2eSkge1xuICAgICAgICBsZXQgQSwgQiwgQywgcG9zO1xuXG4gICAgICAgIEEgPSB2eTtcbiAgICAgICAgQiA9IHZ4ICogLTE7XG4gICAgICAgIEMgPSBsaW5leSAqIHZ4IC0gbGluZXggKiB2eTtcblxuICAgICAgICBwb3MgPSBBICogcG9pbnR4ICsgQiAqIHBvaW50eSArIEM7XG4gICAgICAgIFxuICAgICAgICBpZihwb3MgPCAwKSByZXR1cm4gMTtcbiAgICAgICAgZWxzZSBpZihwb3MgPiAwKSByZXR1cm4gLTE7XG4gICAgICAgIGVsc2UgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6L+U5ZuecG9pbnTmlbDmja5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gcCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICByZXR1cm4ge3g6IHgsIHk6IHl9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWPluWwj+aVsOeCuVxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBmbG9hdE4oaW5wdXQ6IG51bWJlciwgZk51bTogbnVtYmVyID0gNikge1xuICAgICAgICBsZXQgdGVtcCA9IDE7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmTnVtOyBpKyspIHtcbiAgICAgICAgICAgIHRlbXAgKj0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoaW5wdXQgKiB0ZW1wKSAvIHRlbXA7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvSW50KGlucHV0OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0ICsgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4pOeCueS5i+mXtOi3neemu1xuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBwTGVuZ3RoKHAxOlBvaW50LCBwMjpQb2ludCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHAyLnkgLSBwMS55ICwgMikrTWF0aC5wb3cocDIueCAtIHAxLnggLCAyKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog566X5Ye6IOe7j+i/h+WchuW/g+eahOebtOe6vyDkuI4g5ZyGIOeahOS6pOeCuVxuICAgICAqIEBwYXJhbSBwb2ludDEg55u057q/55qE5LiA5Liq54K5XG4gICAgICogQHBhcmFtIGNlbnRlciDlnIblv4NcbiAgICAgKiBAcGFyYW0gcmFkaXVzIOWchueahOWNiuW+hFxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBjcm9zc2luZ1BvaW50TEMocG9pbnQxOiBQb2ludCwgY2VudGVyOiBQb2ludCwgcmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHAsIHcsIGEsIGIsIGMsIHgxLCB5MSwgeDIsIHkyO1xuXG4gICAgICAgIHcgPSAocG9pbnQxLnkgLSBjZW50ZXIueSkgLyAocG9pbnQxLnggLSBjZW50ZXIueCk7XG4gICAgICAgIHAgPSBNYXRoLnBvdyh3LCAyKTtcbiAgICAgICAgYSA9IHAgKyAxO1xuICAgICAgICBiID0gLTIgKiBjZW50ZXIueCAqIGE7XG4gICAgICAgIGMgPSBNYXRoLnBvdyhjZW50ZXIueCwgMikgKiBhIC0gTWF0aC5wb3cocmFkaXVzLCAyKTtcblxuICAgICAgICB4MSA9ICgtMSAqIGIgKyBNYXRoLnNxcnQoYiAqIGIgLSA0ICogYSAqIGMpKSAvICgyICogYSk7XG4gICAgICAgIHgyID0gKC0xICogYiAtIE1hdGguc3FydChiICogYiAtIDQgKiBhICogYykpIC8gKDIgKiBhKTtcbiAgICAgICAgeTEgPSB3ICogeDEgLSB3ICogY2VudGVyLnggKyBjZW50ZXIueTtcbiAgICAgICAgeTIgPSB3ICogeDIgLSB3ICogY2VudGVyLnggKyBjZW50ZXIueTtcblxuICAgICAgICBpZihwb2ludDEueCA9PT0gY2VudGVyLngpIHtcbiAgICAgICAgICAgIHgxID0gY2VudGVyLng7XG4gICAgICAgICAgICB4MiA9IGNlbnRlci54O1xuICAgICAgICAgICAgeTEgPSBjZW50ZXIueSArIHJhZGl1cztcbiAgICAgICAgICAgIHkyID0gY2VudGVyLnkgLSByYWRpdXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZihNYXRoLmFicyhwb2ludDEueCAtIHgxKSA8IE1hdGguYWJzKHBvaW50MS54IC0geDIpIHx8IFxuICAgICAgICAgICAgTWF0aC5hYnMocG9pbnQxLnkgLSB5MSkgPCBNYXRoLmFicyhwb2ludDEueSAtIHkyKSkgXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMucCh4MSwgeTEpO1xuICAgICAgICBlbHNlIHJldHVybiBVdGlscy5wKHgyLCB5Mik7XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9saWJzL2xheWFBaXIuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9zb2NrZXQvU29ja2V0LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3VpL3ZpZXcvU3RhcnRQYWdlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3V0aWxzL1V0aWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nbG9iYWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vTG9hZGluZy50c1wiIC8+XG5cbmltcG9ydCBBbmltYXRpb24gPSBsYXlhLmRpc3BsYXkuQW5pbWF0aW9uO1xuaW1wb3J0IFJlY3RhbmdsZSA9IGxheWEubWF0aHMuUmVjdGFuZ2xlO1xuaW1wb3J0IEJpdG1hcEZvbnQgPSBsYXlhLmRpc3BsYXkuQml0bWFwRm9udDtcbmltcG9ydCBUd2VlbiA9IGxheWEudXRpbHMuVHdlZW47XG5pbXBvcnQgRWFzZSA9IGxheWEudXRpbHMuRWFzZTtcbmltcG9ydCBXZWJHTCA9IGxheWEud2ViZ2wuV2ViR0w7XG5pbXBvcnQgU3ByaXRlID0gbGF5YS5kaXNwbGF5LlNwcml0ZTtcbmltcG9ydCBIYW5kbGVyID0gbGF5YS51dGlscy5IYW5kbGVyO1xuaW1wb3J0IExvYWRlciA9IGxheWEubmV0LkxvYWRlcjtcbmltcG9ydCBUZXh0dXJlID0gbGF5YS5yZXNvdXJjZS5UZXh0dXJlO1xuaW1wb3J0IExheWFUZXh0ID0gbGF5YS5kaXNwbGF5LlRleHQ7XG5pbXBvcnQgTGF5YUV2ZW50ID0gbGF5YS5ldmVudHMuRXZlbnQ7XG5pbXBvcnQgUG9vbCA9IGxheWEudXRpbHMuUG9vbDtcbmltcG9ydCBDb2xvckZpbHRlciA9IExheWEuQ29sb3JGaWx0ZXI7XG5pbXBvcnQgU291bmRNYW5hZ2VyID0gTGF5YS5Tb3VuZE1hbmFnZXI7XG5cbi8qKlxuICog56iL5bqP5YWl5Y+j57G7XG4gKi9cbmNsYXNzIE1haW4ge1xuICAgIC8vIOi1hOa6kOaVsOe7hFxuICAgIHByaXZhdGUgYXNzZXRzOiBBcnJheTxPYmplY3Q+ID0gW107XG4gICAgLy8g5ri45oiP5Zy65pmv6aG16Z2iXG4gICAgcHJpdmF0ZSBfc3RhcnRQYWdlOiBTdGFydFBhZ2U7XG4gICAgcHJpdmF0ZSBfZ2FtZVBhZ2U6IFNwcml0ZTtcbiAgICBwcml2YXRlIF9iZzogU3ByaXRlO1xuICAgIHByaXZhdGUgX2JpdG1hcGZvbnQ6IEJpdG1hcEZvbnQ7XG4gICAgcHJpdmF0ZSBfbG9hZGluZzogTG9hZGluZztcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IGFzc2V0c0tleXMgPSBPYmplY3Qua2V5cyhBc3NldHMuSW1nKTtcbiAgICAgICAgbGV0IGpzb25LZXlzID0gT2JqZWN0LmtleXMoQXNzZXRzLkpzb24pO1xuICAgICAgICBsZXQgc291bmRLZXlzID0gT2JqZWN0LmtleXMoQXNzZXRzLlNvdW5kKTtcblxuICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgc291bmRLZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLmFzc2V0cy5wdXNoKHt1cmw6IEFzc2V0cy5Tb3VuZFtzb3VuZEtleXNbal1dLCB0eXBlOiBMb2FkZXIuU09VTkR9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXNzZXRzS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hc3NldHMucHVzaCh7dXJsOiBBc3NldHMuSW1nW2Fzc2V0c0tleXNbaV1dLCB0eXBlOiBMb2FkZXIuSU1BR0V9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwganNvbktleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRoaXMuYXNzZXRzLnB1c2goe3VybDogQXNzZXRzLkpzb25banNvbktleXNbal1dLCB0eXBlOiBMb2FkZXIuQVRMQVN9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0TGF5YSgpO1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gbmV3IExvYWRpbmcoKTtcblxuICAgICAgICAvLyByZXNpemVcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhRXZlbnQuUkVTSVpFLCB0aGlzLCB0aGlzLm9uU3RhZ2VSZXNpemUpO1xuXG4gICAgICAgIC8vIOWKoOi9vei1hOa6kFxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHRoaXMuYXNzZXRzLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uTG9hZGVkKSwgSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRpbmcsIG51bGwsIGZhbHNlKSwgTG9hZGVyLlRFWFQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBNYWluO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IE1haW4ge1xuICAgICAgICBpZiAoTWFpbi5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBNYWluLmluc3RhbmNlID0gbmV3IE1haW4oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWFpbi5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBnZXQgZ2FtZVBhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lUGFnZTtcbiAgICB9XG5cbiAgICBnZXQgc3RhcnRQYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRQYWdlO1xuICAgIH1cblxuICAgIGdldCBiZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JnO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiDliqDovb3otYTmupDlroxcbiAgICAgKi9cbiAgICBwcml2YXRlIG9uTG9hZGVkKCkge1xuICAgICAgICB0aGlzLl9sb2FkaW5nLmhpZGUoKTtcblxuICAgICAgICAvLyDliJ3lp4vljJZzb2NrZXRcbiAgICAgICB0aGlzLmluaXRTb2NrZXQoKTtcblxuXG4gICAgICAgIC8vIOWKoOi9veS9jeWbvuWtl+S9k1xuICAgICAgICB0aGlzLl9iaXRtYXBmb250ID0gbmV3IEJpdG1hcEZvbnQoKTtcbiAgICAgICAgdGhpcy5fYml0bWFwZm9udC5sb2FkRm9udChBc3NldHMuZm9udC5udW0sIEhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgIExheWFUZXh0LnJlZ2lzdGVyQml0bWFwRm9udCgnZGl5Zm9udCcsIHRoaXMuX2JpdG1hcGZvbnQpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW56m655qE5ri45oiP5Zy65pmv6aG1XG4gICAgICAgIHRoaXMuX2dhbWVQYWdlID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICB0aGlzLl9nYW1lUGFnZS5uYW1lID0gRGlzcGxheU5hbWUuR2FtZVBhZ2U7XG4gICAgICAgIHRoaXMuX2dhbWVQYWdlLnpPcmRlciA9IERpc3BsYXlPcmRlci5HYW1lUGFnZTtcbiAgICAgICAgdGhpcy5fZ2FtZVBhZ2UucGl2b3QoY29uZmlnLmdhbWVXaWR0aC8yLCBjb25maWcuZ2FtZUhlaWdodC8yKTtcbiAgICAgICAgdGhpcy5fZ2FtZVBhZ2UucG9zKGdsb2JhbC5sZWZ0RWRnZSArIGNvbmZpZy5nYW1lV2lkdGgvMiwgY29uZmlnLmdhbWVIZWlnaHQvMik7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyWc3RhcnRVSVxuICAgICAgICB0aGlzLl9zdGFydFBhZ2UgPSBuZXcgU3RhcnRQYWdlKCk7XG4gICAgICAgIFxuICAgICAgICAvLyDmmL7npLrlhajlsYDog4zmma9cbiAgICAgICAgdGhpcy5zaG93QmFja2dyb3VuZCgpO1xuXG4gICAgICAgIC8vIOWIneWni+WMlua4uOaIj+WcuuaZr+eahOW3pui+uee8mOWSjOWPs+i+uee8mOS9jee9rlxuICAgICAgICBnbG9iYWwubGVmdEVkZ2UgPSAoTGF5YS5zdGFnZS53aWR0aCAtIGNvbmZpZy5nYW1lV2lkdGgpLzI7XG4gICAgICAgIGdsb2JhbC5yaWdodEVkZ2UgPSAoTGF5YS5zdGFnZS53aWR0aCArIGNvbmZpZy5nYW1lV2lkdGgpLzI7XG5cbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9nYW1lUGFnZSk7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fc3RhcnRQYWdlKTsgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWKoOi9veS4rVxuICAgICAqL1xuICAgIHByaXZhdGUgb25Mb2FkaW5nKHByb2dyZXNzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZy5zZXRQcm9jZXNzKHByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmt7vliqDlhajlsYDog4zmma9cbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvd0JhY2tncm91bmQoKSB7XG4gICAgICAgIHRoaXMuX2JnID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICB0aGlzLl9iZy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5zdGFydEJnKTtcbiAgICAgICAgdGhpcy5fYmcucGl2b3QoNjQwLCA0MDApO1xuICAgICAgICB0aGlzLl9iZy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQmFja2dyb3VuZDtcbiAgICAgICAgdGhpcy5fYmcucG9zKExheWEuc3RhZ2Uud2lkdGgvMiwgTGF5YS5zdGFnZS5oZWlnaHQvMik7XG5cbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9iZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55So5Yqo55S755qE5pa55byP56e76Zmk6IOM5pmvXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZUJhY2tncm91bmQoKSB7XG5cbiAgICAgICAgLy8g5oqK6IOM5pmv6K6+572u6auY5LqOZ2FtZXBhZ2XvvIzmnaXovoXliqnlrp7njrDliqjnlLvnmoTnvJPliqjmgKflkozmtYHnlYXmgKdcbiAgICAgICAgdGhpcy5fYmcuek9yZGVyID0gRGlzcGxheU9yZGVyLkJhY2tncm91bmRfSDtcblxuICAgICAgICBUd2Vlbi50byh0aGlzLl9iZywge2FscGhhOiAwfSwgMTAwMCwgbnVsbCwgSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5yZW1vdmVDaGlsZCh0aGlzLl9iZyk7XG4gICAgICAgICAgICB0aGlzLl9iZy5hbHBoYSA9IDE7XG4gICAgICAgICAgICB0aGlzLl9iZy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQmFja2dyb3VuZDtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWxj+W5lXJlc2l6ZemAu+i+kVxuICAgICAqL1xuICAgIHByaXZhdGUgb25TdGFnZVJlc2l6ZSgpIHtcbiAgICAgICAgZ2xvYmFsLmxlZnRFZGdlID0gKExheWEuc3RhZ2Uud2lkdGggLSBjb25maWcuZ2FtZVdpZHRoKS8yO1xuICAgICAgICBnbG9iYWwucmlnaHRFZGdlID0gKExheWEuc3RhZ2Uud2lkdGggKyBjb25maWcuZ2FtZVdpZHRoKS8yO1xuXG4gICAgICAgIHRoaXMucmVwb3MoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliJ3lp4vljJZsYXlh6YWN572uXG4gICAgICovIFxuICAgIHByaXZhdGUgaW5pdExheWEoKSB7XG5cbiAgICAgICAgLy8g5ri45oiP6Iie5Y+w6K6+572uXG4gICAgICAgIExheWEuaW5pdChjb25maWcuZ2FtZVdpZHRoLCBjb25maWcuZ2FtZUhlaWdodCwgV2ViR0wpO1xuICAgICAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9ICdmaXhlZGhlaWdodCc7XG4gICAgICAgIC8vIExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9ICd2ZXJ0aWNhbCc7XG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gJ2NlbnRlcic7XG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gJ21pZGRsZSc7XG4gICAgICAgIExheWEuc3RhZ2UuYmdDb2xvciA9ICcjMDAwMDAwJztcblxuICAgICAgICAvLyBMYXlhLlN0YXQuc2hvdygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMlnNvY2tldFxuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdFNvY2tldCgpIHtcbiAgICAgICAgdmFyIHNvY2tldCA9IFNvY2tldC5JbnN0YW5jZTtcblxuICAgICAgICBzb2NrZXQuaW5pdExpc3RlbigpO1xuICAgICAgICBzb2NrZXQubG9naW4oJ3VzZXInK01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliIfmjaLliLDlvIDlp4voj5zljZXnlYzpnaJcbiAgICAgKi9cbiAgICBwdWJsaWMgYmFja1RvTWVudSgpIHtcblxuICAgICAgICAvLyDljrvpmaTmtojmga/mmL7npLrnlYzpnaLlkozliIbmlbDmmL7npLrnlYzpnaJcbiAgICAgICAgTXNnTWFuYWdlci5JbnN0YW5jZS5yZW1vdmVNZXNzYWdlKCk7XG4gICAgICAgIFNjb3JlTWFuYWdlci5JbnN0YW5jZS5yZW1vdmVSZXN1bHRWaWV3KCk7XG5cbiAgICAgICAgLy8g6YeN5bu65byA5aeL55WM6Z2iXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fYmcpO1xuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuc3RhcnRQYWdlKTtcblxuICAgICAgICAvLyDpgIDlnLrliqjnlLtcbiAgICAgICAgVHdlZW4udG8odGhpcy5nYW1lUGFnZSwge3k6IC04MDAsIGFscGhhOiAwfSwgODAwLCBudWxsLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWVQYWdlLmFscGhhID0gMTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZVBhZ2UueSA9IGNvbmZpZy5nYW1lSGVpZ2h0LzI7XG4gICAgICAgICAgICB0aGlzLmdhbWVQYWdlLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDph43lrprkvY1cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlcG9zKCkge1xuICAgICAgICBsZXQgbXNnID0gTXNnTWFuYWdlci5JbnN0YW5jZS5tc2c7XG4gICAgICAgIGxldCB0aXBzVGV4dCA9IE1zZ01hbmFnZXIuSW5zdGFuY2UudGlwc1RleHQ7XG4gICAgICAgIGxldCBidWxsZXRQcm9jZXNzID0gR2FtZS5JbnN0YW5jZS5idWxsZXRQcm9jZXNzO1xuICAgICAgICBsZXQgdGltZXIgPSBHYW1lLkluc3RhbmNlLnRpbWVyO1xuICAgICAgICBsZXQgdG9vbFRhZ0NvbnRhaW5lciA9IEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lcjtcbiAgICAgICAgbGV0IGJ0blN3aXRjaCA9IEdhbWUuSW5zdGFuY2UuYnRuU3dpdGNoO1xuICAgICAgICBsZXQgbXlTY29yZVBhbmVsID0gU2NvcmVNYW5hZ2VyLkluc3RhbmNlLm15U2NvcmVQYW5lbDtcbiAgICAgICAgbGV0IHlvdXJTY29yZVBhbmVsID0gU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnlvdXJTY29yZVBhbmVsO1xuICAgICAgICBsZXQgcmVzdWx0VmlldyA9IFNjb3JlTWFuYWdlci5JbnN0YW5jZS5yZXN1bHRWaWV3O1xuXG4gICAgICAgIGlmKHRoaXMuX3N0YXJ0UGFnZSkgdGhpcy5fc3RhcnRQYWdlLnBvcyhnbG9iYWwubGVmdEVkZ2UsIDApO1xuICAgICAgICBpZih0aGlzLl9nYW1lUGFnZSkgdGhpcy5fZ2FtZVBhZ2UucG9zKGdsb2JhbC5sZWZ0RWRnZSArIGNvbmZpZy5nYW1lV2lkdGgvMiwgY29uZmlnLmdhbWVIZWlnaHQvMik7XG4gICAgICAgIGlmKHRoaXMuX2JnKSB0aGlzLl9iZy5wb3MoTGF5YS5zdGFnZS53aWR0aC8yLCBMYXlhLnN0YWdlLmhlaWdodC8yKTtcbiAgICAgICAgaWYobXNnKSBtc2cucG9zKExheWEuc3RhZ2Uud2lkdGgvMiwgTGF5YS5zdGFnZS5oZWlnaHQvMik7XG4gICAgICAgIGlmKHRpcHNUZXh0KSB0aXBzVGV4dC5wb3MoTGF5YS5zdGFnZS53aWR0aC8yLCBMYXlhLnN0YWdlLmhlaWdodCAtIDEwMCk7XG4gICAgICAgIGlmKGJ1bGxldFByb2Nlc3MpIGJ1bGxldFByb2Nlc3MucmVwb3MoKTtcbiAgICAgICAgaWYodGltZXIpIHRpbWVyLnJlcG9zKCk7XG4gICAgICAgIGlmKHRvb2xUYWdDb250YWluZXIpIHRvb2xUYWdDb250YWluZXIucmVwb3MoKTtcbiAgICAgICAgaWYoYnRuU3dpdGNoKSBidG5Td2l0Y2gucmVwb3MoKTtcbiAgICAgICAgaWYobXlTY29yZVBhbmVsKSBteVNjb3JlUGFuZWwucmVwb3MoKTtcbiAgICAgICAgaWYoeW91clNjb3JlUGFuZWwpIHlvdXJTY29yZVBhbmVsLnJlcG9zKCk7XG4gICAgICAgIGlmKHJlc3VsdFZpZXcpIHJlc3VsdFZpZXcucmVwb3MoKTtcbiAgICB9XG59XG5cbk1haW4uSW5zdGFuY2U7XG5cbiIsImNvbnN0IFBQcm9jZXNzQXR0ciA9IHtcbiAgICB3aWR0aDogMzQsXG4gICAgaGVpZ2h0OiA4XG59XG4vKipcbiAqIOWKm+W6pui/m+W6puadoVxuICogcG93ZXByb2Nlc3NcbiAqL1xuY2xhc3MgUFByb2Nlc3MgZXh0ZW5kcyBsYXlhLmRpc3BsYXkuU3ByaXRlIHtcbiAgICBwcml2YXRlIHByb2Nlc3M6IFNwcml0ZTtcbiAgICBwcml2YXRlIHBtYXNrOiBTcHJpdGU7XG4gICAgcHVibGljIHBlcmNlbnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIF9zdGF0dXM6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmxvYWRJbWFnZShBc3NldHMuSW1nLnBwcm9jZXNzYmcpO1xuICAgICAgICB0aGlzLnNpemUoUFByb2Nlc3NBdHRyLndpZHRoLCBQUHJvY2Vzc0F0dHIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5waXZvdChQUHJvY2Vzc0F0dHIud2lkdGgvMiwgUFByb2Nlc3NBdHRyLmhlaWdodC8yKTtcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuUFByb2Nlc3M7XG4gICAgICAgIHRoaXMucmVwb3MoKTtcblxuICAgICAgICB0aGlzLnBtYXNrID0gbmV3IFNwcml0ZSgpOyBcbiAgICAgICAgdGhpcy5wbWFzay5sb2FkSW1hZ2UoQXNzZXRzLkltZy5wcHJvY2Vzcyk7XG4gICAgICAgIHRoaXMucG1hc2suc2l6ZShQUHJvY2Vzc0F0dHIud2lkdGgsIFBQcm9jZXNzQXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLnBtYXNrLnBvcygtMSAqIFBQcm9jZXNzQXR0ci53aWR0aCwgMCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFNwcml0ZSgpO1xuICAgICAgICB0aGlzLnByb2Nlc3MubG9hZEltYWdlKEFzc2V0cy5JbWcucHByb2Nlc3MpO1xuICAgICAgICB0aGlzLnByb2Nlc3Muc2l6ZShQUHJvY2Vzc0F0dHIud2lkdGgsIFBQcm9jZXNzQXR0ci5oZWlnaHQpO1xuICAgICAgICB0aGlzLnByb2Nlc3MubWFzayA9IHRoaXMucG1hc2s7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBlcmNlbnQgPSAwOyAgXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wcm9jZXNzKTtcblxuICAgICAgICBNYWluLkluc3RhbmNlLmdhbWVQYWdlLmFkZENoaWxkKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgICAgIGlmKHRoaXMuX3N0YXR1cykgdGhpcy5ydW5Qcm9jZXNzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6L+Q6KGM6L+b5bqm5p2hXG4gICAgICovXG4gICAgcHVibGljIHJ1blByb2Nlc3MoKSB7XG4gICAgICAgIHRoaXMucGVyY2VudCArPSAwLjAzO1xuICAgICAgICBpZih0aGlzLnBlcmNlbnQgPiAxKSB0aGlzLnBlcmNlbnQgPSAxO1xuICAgICAgICB0aGlzLnBtYXNrLnBvcygtMSAqIFBQcm9jZXNzQXR0ci53aWR0aCAqICgxIC0gdGhpcy5wZXJjZW50KSwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZHVjZVByb2Nlc3MoKSB7XG4gICAgICAgIHRoaXMucGVyY2VudCAtPSAwLjA1O1xuICAgICAgICBpZih0aGlzLnBlcmNlbnQgPCAwKSB0aGlzLnBlcmNlbnQgPSAwO1xuICAgICAgICB0aGlzLnBtYXNrLnBvcygtMSAqIFBQcm9jZXNzQXR0ci53aWR0aCAqICgxIC0gdGhpcy5wZXJjZW50KSwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyUHJvY2VzcygpIHtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gMDtcbiAgICAgICAgdGhpcy5wbWFzay5wb3MoLTEgKiBQUHJvY2Vzc0F0dHIud2lkdGggKiAoMSAtIHRoaXMucGVyY2VudCksIDApO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IDE7XG4gICAgfVxuXG4gICAgcHVibGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IDA7XG4gICAgICAgIHRoaXMuY2xlYXJQcm9jZXNzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcG9zKCkge1xuICAgICAgICB0aGlzLnBvcyhjb25maWcuZ2FtZVdpZHRoLzIsIGNvbmZpZy5nYW1lSGVpZ2h0IC0gMTApO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZigpO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlicy9sYXlhQWlyLmQudHNcIiAvPlxuXG4vLyDnk6bniYflnLDlm77mqKHlnZdcbm1vZHVsZSBUaWxlZE1hcCB7XG4gICAgaW1wb3J0IFRpbGVkTWFwID0gbGF5YS5tYXAuVGlsZWRNYXA7XG4gICAgaW1wb3J0IE1hcExheWVyID0gbGF5YS5tYXAuTWFwTGF5ZXI7XG4gICAgaW1wb3J0IFNwcml0ZSA9IGxheWEuZGlzcGxheS5TcHJpdGU7XG4gICAgaW1wb3J0IFJlY3RhbmdsZSA9IGxheWEubWF0aHMuUmVjdGFuZ2xlO1xuICAgIGltcG9ydCBCcm93c2VyID0gbGF5YS51dGlscy5Ccm93c2VyO1xuICAgIGltcG9ydCBIYW5kbGVyID0gbGF5YS51dGlscy5IYW5kbGVyO1xuICAgIGltcG9ydCBQb2ludCA9IGxheWEubWF0aHMuUG9pbnQ7XG5cbiAgICBleHBvcnQgY2xhc3MgVGlsZWRNYXBNYW5hZ2VyIHtcbiAgICAgICAgcHJpdmF0ZSB0aWxlZE1hcDogVGlsZWRNYXA7XG4gICAgICAgIHByaXZhdGUgbGF5ZXI6IE1hcExheWVyO1xuICAgICAgICBwcml2YXRlIHNwcml0ZTogU3ByaXRlO1xuICAgICAgICBwcml2YXRlIG1MYXN0TW91c2VYOiBudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIG1MYXN0TW91c2VZOiBudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIG1YOiBudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIG1ZOiBudW1iZXIgPSAwO1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLnRpbGVkTWFwID0gbmV3IFRpbGVkTWFwKCk7XG4gICAgICAgICAgICB0aGlzLm1YID0gdGhpcy5tWSA9IDA7XG4gICAgICAgICAgICAvL3RoaXMudGlsZWRNYXAuY3JlYXRlTWFwKFwiLi4vLi4vcmVzL3RpbGVkTWFwL2Rlc2VydC5qc29uXCIsIG5ldyBSZWN0YW5nbGUoMCwgMCwgQnJvd3Nlci53aWR0aCwgQnJvd3Nlci5oZWlnaHQpLCBuZXcgSGFuZGxlcih0aGlzLCB0aGlzLmNvbXBsZXRlSGFuZGxlcikpO1xuICAgICAgICAgICAgdGhpcy50aWxlZE1hcC5jcmVhdGVNYXAoXCJyZXMvdGlsZWRNYXAvaXNvbWV0cmljX2dyYXNzX2FuZF93YXRlci5qc29uXCIsIG5ldyBSZWN0YW5nbGUoMCwgMCwgTGF5YS5zdGFnZS53aWR0aCwgTGF5YS5zdGFnZS5oZWlnaHQpLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm1hcExvYWRlZCksIG51bGwsIG5ldyBQb2ludCgxNjAwLCA4MDApKTtcbiAgICAgICAgICAgIC8vIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5tb3VzZURvd24pO1xuICAgICAgICAgICAgLy8gTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5tb3VzZVVwKTtcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oXCJjbGlja1wiLCB0aGlzLCB0aGlzLm9uU3RhZ2VDbGljayk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgcmVzaXplKCk6IHZvaWQge1xuICAgICAgICAgICAgLy8g5pS55Y+Y5Zyw5Zu+6KeG5Y+j5aSn5bCPXG4gICAgICAgICAgICB0aGlzLnRpbGVkTWFwLmNoYW5nZVZpZXdQb3J0KHRoaXMubVgsIHRoaXMubVksIEJyb3dzZXIud2lkdGgsIEJyb3dzZXIuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy/pvKDmoIfmjInkuIvmi5bliqjlnLDlm75cbiAgICAgICAgcHJpdmF0ZSBtb3VzZURvd24oKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLm1MYXN0TW91c2VYID0gTGF5YS5zdGFnZS5tb3VzZVg7XG4gICAgICAgICAgICB0aGlzLm1MYXN0TW91c2VZID0gTGF5YS5zdGFnZS5tb3VzZVk7XG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHRoaXMubW91c2VNb3ZlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgbW91c2VNb3ZlKCk6IHZvaWQge1xuICAgICAgICAgICAgLy/np7vliqjlnLDlm77op4blj6NcbiAgICAgICAgICAgIHRoaXMudGlsZWRNYXAubW92ZVZpZXdQb3J0KHRoaXMubVggLSAoTGF5YS5zdGFnZS5tb3VzZVggLSB0aGlzLm1MYXN0TW91c2VYKSwgdGhpcy5tWSAtIChMYXlhLnN0YWdlLm1vdXNlWSAtIHRoaXMubUxhc3RNb3VzZVkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgbW91c2VVcCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMubVggPSB0aGlzLm1YIC0gKExheWEuc3RhZ2UubW91c2VYIC0gdGhpcy5tTGFzdE1vdXNlWCk7XG4gICAgICAgICAgICB0aGlzLm1ZID0gdGhpcy5tWSAtIChMYXlhLnN0YWdlLm1vdXNlWSAtIHRoaXMubUxhc3RNb3VzZVkpO1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5vZmYobGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgdGhpcy5tb3VzZU1vdmUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIGNvbXBsZXRlSGFuZGxlcigpOiB2b2lkIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Zyw5Zu+5Yib5bu65a6M5oiQXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGllbnRXOlwiICsgQnJvd3Nlci5jbGllbnRXaWR0aCArIFwiIENsaWVudEg6XCIgKyBCcm93c2VyLmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50LlJFU0laRSwgdGhpcywgdGhpcy5yZXNpemUpO1xuICAgICAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBtYXBMb2FkZWQoKTogdm9pZCB7XG5cdFx0XHR0aGlzLmxheWVyID0gdGhpcy50aWxlZE1hcC5nZXRMYXllckJ5SW5kZXgoMCk7XG5cblx0XHRcdHZhciByYWRpdXNYOiBudW1iZXIgPSAzMjtcblx0XHRcdHZhciByYWRpdXNZOiBudW1iZXIgPSBNYXRoLnRhbigxODAgLyBNYXRoLlBJICogMzApICogcmFkaXVzWDtcblx0XHRcdHZhciBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCI7XG5cblx0XHRcdHRoaXMuc3ByaXRlID0gbmV3IFNwcml0ZSgpO1xuXHRcdFx0dGhpcy5zcHJpdGUuZ3JhcGhpY3MuZHJhd0xpbmUoMCwgMCwgLXJhZGl1c1gsIHJhZGl1c1ksIGNvbG9yKTtcblx0XHRcdHRoaXMuc3ByaXRlLmdyYXBoaWNzLmRyYXdMaW5lKDAsIDAsIHJhZGl1c1gsIHJhZGl1c1ksIGNvbG9yKTtcblx0XHRcdHRoaXMuc3ByaXRlLmdyYXBoaWNzLmRyYXdMaW5lKC1yYWRpdXNYLCByYWRpdXNZLCAwLCByYWRpdXNZICogMiwgY29sb3IpO1xuXHRcdFx0dGhpcy5zcHJpdGUuZ3JhcGhpY3MuZHJhd0xpbmUocmFkaXVzWCwgcmFkaXVzWSwgMCwgcmFkaXVzWSAqIDIsIGNvbG9yKTtcblx0XHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5zcHJpdGUpO1xuXHRcdH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgb25TdGFnZUNsaWNrKCkge1xuXHRcdFx0dmFyIHA6IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xuXHRcdFx0dGhpcy5sYXllci5nZXRUaWxlUG9zaXRpb25CeVNjcmVlblBvcyhMYXlhLnN0YWdlLm1vdXNlWCwgTGF5YS5zdGFnZS5tb3VzZVksIHApO1xuXHRcdFx0dGhpcy5sYXllci5nZXRTY3JlZW5Qb3NpdGlvbkJ5VGlsZVBvcyhNYXRoLmZsb29yKHAueCksIE1hdGguZmxvb3IocC55KSwgcCk7XG5cdFx0XHR0aGlzLnNwcml0ZS5wb3MocC54LCBwLnkpO1xuXHRcdH1cbiAgICB9XG59Il19
