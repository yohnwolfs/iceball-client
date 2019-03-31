/// <reference path="../Game.ts" />
/// <reference path="../gameobject/CountDown.ts" />

class Socket {
    private _socket;
    private game: Game;
    private uid: string = '';
    private _mName: string = '';
    private _yName: string = '';
    private _active: boolean = true;

    constructor() {
        this._socket = io.connect(config.socketServer);
    }

    private static instance: Socket;
    public static get Instance(): Socket {
        if (Socket.instance == null) {
            Socket.instance = new Socket();
        }
        return Socket.instance;
    }

    /**
     * 取得用户id
     */
    public getUid() {
        return this.uid;
    }

    get mName() {
        return this._mName;
    }

    get yName() {
        return this._yName;
    }

    get socket() {
        return this._socket;
    }

    /**
     * 取得当前游戏
     */
    public getCurrentGame() {
        return this.game;
    }

    /**
     * 监听socket事件
     */
    public initListen() {

        this._socket.on('disconnect', () => {

            // 游戏进程结束并显示连接断开信息
            Game.Instance.gameOver();

            MsgManager.Instance.showMessage('与服务器断开连接', 30);

            // socket状态改变
            this._active = false;

            console.log('client disconnect');
        });

        this._socket.on('connect_error', (error) => {

            if (this._active) {

                // socket激活状态下显示信息
                MsgManager.Instance.showMessage('连接服务器失败', 30);

                // socket状态改变
                this._active = false;

                console.log(error);
            }
        });

        // 登录成功
        this._socket.on('user:loginSuccess', (data: { uid: string, username: string }) => {
            this.uid = data.uid;
            this._mName = data.username;

            console.log('login success');
        });

        // 房间创建成功
        this._socket.on('room:created', (data: { opponent: string, ballDirection: number }) => {
            console.log('create room success');

            this.game = Game.Instance;

            // 初始化同步辅助值
            global.syn = data.ballDirection;

            // 存储对方名字
            this._yName = data.opponent;

            // 显示找到比赛
            MsgManager.Instance.setText('找到比赛');

            SoundManager.playSound(Assets.Sound.findmatch);

            this.game.clearUpdateList();

            Laya.timer.once(2000, this, () => {
                this.getReady();
            });
        });


        // 游戏主要帧数据
        this._socket.on('frame:update', (update: FramePack) => {
            this.game.pushUpdateData(update);
        });

        this._socket.on('game:start', (data) => {

            // 去掉消息显示框
            MsgManager.Instance.removeMessage(() => {
                // 开始游戏逻辑
                this.game.initScene();
                this.game.ballDirections = data.directions;
                this.game.ballDirectionFactor = data.id === this.uid ? 1 : 0;
                let direction = this.game.getBallDirection();
                this.game.initBall(this.game.ballDirectionFactor ? direction : 1 - direction);

                // 移除全局背景
                Main.Instance.removeBackground();
                // 开始倒计时
                Main.Instance.gamePage.addChild(Game.Instance.getCounter(() => {
                    this.game.status = 1;
                    this.game.initControl();
                    this.game.startLoop();
                }));
            });
        });

        // 接收球的方向
        // this._socket.on('game:balldirection', (data) => {
        //     // let direction = data.id === this.uid ? data.direction : (1 - data.direction);
        //     // Game.Instance.ball.direction = direction;
        // });


        // 分数进账显示
        this._socket.on('game:scorein', (data) => {
            let scores = data.scores;

            if (data.id === this.uid) {
                ScoreManager.Instance.setScores('mine', { explosions: scores.explosions, balls: scores.balls, score: scores.score });
            }
            else {
                ScoreManager.Instance.setScores('your', { explosions: scores.explosions, balls: scores.balls, score: scores.score });
            }
        });

        // 最终分数
        this._socket.on('game:scores', (data) => {

            // 有玩家离线 进入游戏结算阶段
            if (data.msg) {
                // 结束游戏进程
                Game.Instance.gameOver();

                MsgManager.Instance.showMessage(data.msg, 28, () => {
                    Laya.timer.once(800, this, () => {
                        MsgManager.Instance.removeMessage();
                        ScoreManager.Instance.showGameResult(data);
                    });
                });

                console.log('opponent leave room.');
            }
            else {
                Game.Instance.gameOver();
                if (Game.Instance.timer.isTimeout()) {
                    MsgManager.Instance.showMessage('时间到，比赛结束', 30, () => {
                        Laya.timer.once(1000, this, () => {
                            MsgManager.Instance.removeMessage(() => {
                                ScoreManager.Instance.showGameResult(data);
                            });
                        });
                    });
                }
                else ScoreManager.Instance.showGameResult(data);
            }
        });

        this._socket.on('game:error', (data) => {
            console.log(data.msg);
        });

        this._socket.on('sys:msg', (data: { msg: string }) => {
            console.log('system message: ' + data.msg);
        });

        this._socket.on('connect_timeout', () => {
            console.log('connect timeout');
        });

        this._socket.on('reconnect', () => {
            console.log('client reconnect');
        });

        this._socket.on('connect', () => {
            console.log('client connected');
        });
    }

    /**
     * 通过用户名登录
     */
    public login(name: string) {
        this._socket.emit('user:login', { name: name });
    }

    /**
     * 寻找比赛
     */
    public match() {
        this._socket.emit('room:match');
    }

    /**
     * 准备
     */
    public getReady() {
        this._socket.emit('user:ready');
    }

    /**
     * 发送操作
     * @param ctrlData 操作数据 
     */
    public sendCtrl(ctrlData: CtrlData) {
        this._socket.emit('user:ctrl', { id: this.uid, ctrl: ctrlData });
    }

    /**
     * 子弹爆炸得分
     */
    public causeExplosion() {
        this._socket.emit('game:scorein', { id: this.uid, type: 'bulletExplosion' });
    }

    /**
     * 进球得分
     */
    public ballIn() {
        this._socket.emit('game:scorein', { id: this.uid, type: 'ballin' });
    }

    /**
     * 退出房间
     */
    public leaveRoom() {
        this._socket.emit('room:leave');
    }
}


