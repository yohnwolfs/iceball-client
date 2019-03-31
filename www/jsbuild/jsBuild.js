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
var config = {
    gameWidth: 480,
    gameHeight: 800,
    socketServer: 'ws://106.75.145.140:3100'
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
var LoadingAttr = {
    width: 300,
    height: 28
};
var base64 = {
    loading: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAcCAYAAADbcIJsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABx1JREFUeNrsXEtyGzcQRc9QVJY+gnMDl3WAKDeQTxB7n1ScZVIVSd5E2Tku6QC6gZ0TmD4AfYXkCFqLHLwAmA+H5Aw+jaEjufqVILFIDQbd6HnobjaglEAgEAgEAoFAIBAIBAKBQPCwQakXPL++OlNE35n2zLSuEwx0ReZd7417H+vogQWGDPCVAaaiMCYDwsqPHC56/bPH6RkTNarTieOk6NHXvzGhvofexqAlhq/Neki4NgfPW+DNY+hajHxMjLF6/zUkiNWZ+8En83rx+fxyMSlhGaJ6rai4ULPyCRWlUmVh+KpoejC/DHlRktFtC6ITzIfAsw6Ar4zQPTFEWDlGNwAdM362jLUB6Yn10pcROzLQlCtpBG8QkD33SHyaU0lZM0k1VkbNJKSQ3Yx2tfcZGrKCMwbAjEhXClX1r9L61fLizSKLsJ5f/2EIqniPojyloyNF5cy00nBXUTdLVET73VGa4vWAHsijV+KsvshYQgKGN7xyhfukhIcxRp1h7wJ+GZD6gMSPSe95WPkEMqxtJOs7hbBSPOnUxRXR5AEWQWoG0aXORzvPNMRcsCQFdz9o7ZolLL1eK6xX5rX+a3l++QvLvh1ZlbOPNJs9U5asZkeqMGRVONJqPayasJx/RSlcuG0FKR6WYhIPO1qMvFBnrIwhA0JkuECKL+NYuKAy5aKefhDzoIPpYTVTRRyvNpLM9MDC8ZgIa2zho0R79F2rh4RBE663k2Q8K3LelbbeVUdYrlXV7fL3i1fJ9n1y8+dbms9fF/O5UpasXDOEZUJC62V1ZEXtlJEiSnczkRCKgGnQWR5WpNHpA+bT4nJYiHwiEmQIXoNoOfa8ExbxIpDD8nvfxJAj7GFxwkF4Fz1KtI/+CClddZPeryV1GnsempCQdE1Yhq0MUa1r0lqtlF7dK1VVL5bnFx+ix3lyfXVKs/IjHX+jyvlxQ1gz52HVIWFNWP3cFRFFB3BBIwBG1cMLFxD04li5sd449ZSeCXxkgmll6HWpJ3VN9xzpSJWAleQPhs3MDykgA/lIKVGOGC89J5TmJ90RfT9ghMzQZbFqwkJLWKY578qQliEsGMLS9/d3JlT8dnnx5q7fRTE6wIJ+Vjb0syTlWrkhq50cVktc6E0oOnFo4tglNzCZutsvLsijUs8XHQw9LBnB8ucel83B+z45HXTNcoRLI9XpJOf0uGbea3Pjm/bE/NPZHi15lHJmO3ThX1F33ierr+ZBFQgE/8OaVJOY45KWtBqu6f4S/RBFWCc3Jhy0TNh6UVveVPHQlmOBQPBIAbWJ0Fx6qeEaVRPWaRRhUdtJQe2FXegnjpVAIJjW2domra3Kg+iQ8OEnOgQCwdfgZSUk9IphN61Jmzf1Em2xV0y1uEAgEKS5QL3q96bB1QUijrCWP/66cN+vukrUhqzaqlTs1isLBAIB27/aJypX6uBqMBbRIaG58AOqugrVVaJ2ZfQ1iQlpCQSCrDiwI6eqqcequabmmMo6R3/vXjYb71C/U9X6TFdrRVXp6iZsHYX1r1zhGso6Kb+TGqOdUvfYPX+x2TEK9Ru8Nm480R8eiLd3K6ERIwcyDeigbr8adPHH5GBlS5E3V5x9hkNzFSuHr0qLMvTjkwNM5aTcD0PPaa+YFM02MGojtsq2deccwb7W1Z35p9ukuTi5ufpI8+NTms/rfYTNXkJbi1VsvnpU1Osq+lvEgQ2TUzx8vo2xOvDA8h+SkQriiQlEJ+o0yfAaI9IJOk2VI9ovB/+0htDxMpR5vMzQNjLfkT28Snewa2CDm58TKtZT+t21U6iBivzdrTltpXvV25qzXrlqd/Pem+X55WW8h1WHhS/UavWPefkE3ZEQhrBMw6a4azPgva8ikWBoCebD8AZy9xJShAypR7OkyDHN5mf/lyZjOgKXBAOElbuNKPVjAth76Xy2MOUm7rjTLzI8fkysVJ8++waL7b+td+VCQptyakmrJqvFEFkFCevzT7/dnVxffW9I670hrKeV6VyXzX7CfjFpOy2UMvXoJictI8YkrIn39Q19qA9wNMugh8XcSxZzTyRf4w/0yNM5mPrOCZcOYiDgXUO+A4lwWFudlK9GFznsHzHTrIq6qUBoCct5Voa0zOuFso5SzsJij5kx7PTWhIAv7XlY7vC+os5hdR4VEXvVSjuHyR+JE6a4R2K+AWmbYrmEheB14MuByLBzwGuJDqd25oCV3/GE7jHHy/BCHkZYy8w16YjzZYh72J7nCKHJThxF/3xZFTzAzyXa6yT7nQkP3415VsmesMtpXV89BdHL5ojk0+0EO7FvkEsm0+RbkHX08CBhZeaUxvqnAxAvNeEimEQXc08dHRKCfUTyVPpOuX3uKR8cD4ubb2Un3ZEm2vg5LZvTGkyzifUFoD+Zd24/n1/eKYFAIBAIBAKBQCAQCAQCgeCR4z8BBgBjOfu8K+FVYgAAAABJRU5ErkJggg==',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuaW1hdGlvbk1hbmFnZXIudHMiLCJjb25maWcudHMiLCJnYW1lb2JqZWN0L0Jhc2VCYWxsLnRzIiwiZ2FtZW9iamVjdC9CYWxsLnRzIiwiZ2FtZW9iamVjdC9idWxsZXQvQnVsbGV0LnRzIiwiZ2FtZW9iamVjdC9idWxsZXQvU3RhbmRhcmRCdWxsZXQudHMiLCJnYW1lb2JqZWN0L2J1bGxldC9JY2VCdWxsZXQudHMiLCJnYW1lb2JqZWN0L2J1bGxldC9EaXZpc2lvbkJ1bGxldC50cyIsImdhbWVvYmplY3QvYnVsbGV0L1Ntb2tlQnVsbGV0LnRzIiwiZ2FtZW9iamVjdC9idWxsZXQvQm9tYkJ1bGxldC50cyIsImdhbWVvYmplY3QvQ2Fubm9uLnRzIiwiZ2FtZW9iamVjdC9CdWxsZXRQcm9jZXNzLnRzIiwiZ2FtZW9iamVjdC9UaW1lci50cyIsImdhbWVvYmplY3QvRGFzaExpbmUudHMiLCJnYW1lb2JqZWN0L3Rvb2wvVG9vbFRhZy50cyIsImdhbWVvYmplY3QvdG9vbC9Ub29sVGFnQ29udGFpbmVyLnRzIiwiZ2FtZW9iamVjdC90b29sL0J0blN3aXRjaC50cyIsImdhbWVvYmplY3QvU2NvcmVQYW5lbC50cyIsInVpL3VpLnRzIiwidWkvdmlldy9SZXN1bHRQYWdlLnRzIiwiU2NvcmVNYW5hZ2VyLnRzIiwiTXNnTWFuYWdlci50cyIsIkdhbWUudHMiLCJnbG9iYWwudHMiLCJMb2FkaW5nLnRzIiwiZ2FtZW9iamVjdC9Db3VudERvd24udHMiLCJzb2NrZXQvU29ja2V0LnRzIiwidWkvdmlldy9TdGFydFBhZ2UudHMiLCJ1dGlscy9VdGlscy50cyIsIm1haW4udHMiLCJnYW1lb2JqZWN0L1BQcm9jZXNzLnRzIiwidGlsZWRtYXAvVGlsZWRNYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQTtJQUVJO0lBRUEsQ0FBQztJQUdELHNCQUFrQiw0QkFBUTthQUExQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3ZELENBQUM7WUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1FBQ3JDLENBQUM7OztPQUFBO0lBS2EsNEJBQVcsR0FBekIsVUFBMEIsSUFBWSxFQUFFLEtBQW1CLEVBQUUsS0FBbUIsRUFBRSxNQUFtQixFQUFFLE1BQW1CO1FBQWxGLHFCQUFtQixHQUFuQixXQUFtQjtRQUFFLHFCQUFtQixHQUFuQixXQUFtQjtRQUFFLHNCQUFtQixHQUFuQixXQUFtQjtRQUFFLHNCQUFtQixHQUFuQixXQUFtQjtRQUN0SCxJQUFJLEdBQUcsR0FBYSxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFO1lBQ3JELE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1osR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxHQUFHLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2QixJQUFJLE1BQU0sR0FBYyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNyRCxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUNMLHVCQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQ3RDRCxJQUFNLE1BQU0sR0FBRztJQUNYLFNBQVMsRUFBRSxHQUFHO0lBQ2QsVUFBVSxFQUFFLEdBQUc7SUFHZixZQUFZLEVBQUUsMEJBQTBCO0NBRTNDLENBQUM7QUNKRjtJQUF1Qiw0QkFBbUI7SUFRdEM7UUFDSSxpQkFBTyxDQUFDO0lBQ1osQ0FBQztJQUVELHNCQUFJLDRCQUFNO2FBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHdCQUFFO2FBQU47WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDO2FBTUQsVUFBTyxDQUFRO1lBQ1gsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQzs7O09BUkE7SUFFRCxzQkFBSSx3QkFBRTthQUFOO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQzthQU1ELFVBQU8sQ0FBUTtZQUNYLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7OztPQVJBO0lBU0wsZUFBQztBQUFELENBL0JBLEFBK0JDLENBL0JzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0ErQnpDO0FDakNELElBQU0sUUFBUSxHQUFHO0lBQ2IsS0FBSyxFQUFFLEVBQUU7SUFDVCxNQUFNLEVBQUUsRUFBRTtJQUNWLFFBQVEsRUFBRSxFQUFFO0lBQ1osU0FBUyxFQUFFLEVBQUU7SUFDYixRQUFRLEVBQUUsQ0FBQztJQUNYLE1BQU0sRUFBRSxHQUFHO0NBQ2QsQ0FBQTtBQUtEO0lBQW1CLHdCQUFRO0lBZXZCLGNBQVksU0FBaUI7UUFDekIsaUJBQU8sQ0FBQztRQWRKLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFFekIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFJekIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUVwQixjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBR3RCLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBS2hDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDbkMsQ0FBQztJQUVELHNCQUFJLDZCQUFXO2FBQWY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixDQUFDO2FBRUQsVUFBZ0IsQ0FBUztZQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUMxQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLHdCQUFNO2FBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDO2FBQ0QsVUFBVyxDQUFTO1lBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUM7OztPQUhBO0lBS0Qsc0JBQUksMkJBQVM7YUFBYixVQUFjLENBQVM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFLTSxxQkFBTSxHQUFiO1FBR0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRWxDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFcEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFFLENBQUM7UUFHRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUdoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FB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TSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7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Q0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7UUFFeEUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFFdkMsSUFBSSxHQUFHLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUM7UUFDOUIsSUFBSSxHQUFHLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUM7UUFFOUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsR0FBQyxD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Qyx5QkFBeUIsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsY0FBYyxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsVUFBVSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLFdBQVcsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxXQUFXLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFDLElBQUksRUFBQyxrQkFBa0IsRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsc0JBQXNCLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE9B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QyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBRXBDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBS00sNEJBQVUsR0FBakIsVUFBa0Is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Q0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUVELElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2RCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbkMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLElBQUks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QUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDZCxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNkLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QixFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0IsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLElBQUk7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQXpCZSxxQkFBZSxrQkF5QjlCLENBQUE7QUFDTCxDQUFDLEVBck9NLEtBQUssS0FBTCxLQUFLLFFBcU9YO0FDbE9ELElBQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzFDLElBQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ3hDLElBQU8sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzVDLElBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hDLElBQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzlCLElBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hDLElBQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3BDLElBQU8sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3BDLElBQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ2hDLElBQU8sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLElBQU8sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3BDLElBQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3JDLElBQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzlCLElBQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDdEMsSUFBTyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUt4QztJQVVJO1FBUlEsV0FBTSxHQUFrQixFQUFFLENBQUM7UUFTL0IsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUMsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUNELEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFDRCxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FB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LElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRWEsc0NBQVksR0FBcEI7WUFDTCxJQUFJLENBQUMsR0FBVSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDQyxzQkFBQztJQUFELENBdEVBLEFBc0VDLElBQUE7SUF0RVksMEJBQWUsa0JBc0UzQixDQUFBO0FBQ0wsQ0FBQyxFQWhGTSxRQUFRLEtBQVIsUUFBUSxRQWdGZCIsImZpbGUiOiJqc0J1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOWKqOeUu+euoeeQhuexu1xyXG4gKi9cclxuXHJcbmNsYXNzIEFuaW1hdGlvbk1hbmFnZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQW5pbWF0aW9uTWFuYWdlcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IEFuaW1hdGlvbk1hbmFnZXIge1xyXG4gICAgICAgIGlmIChBbmltYXRpb25NYW5hZ2VyLmluc3RhbmNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgQW5pbWF0aW9uTWFuYWdlci5pbnN0YW5jZSA9IG5ldyBBbmltYXRpb25NYW5hZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBBbmltYXRpb25NYW5hZ2VyLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5LiA5Liq5Yqo55S75a6e5L6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUobmFtZTogc3RyaW5nLCBzaXplWDogbnVtYmVyID0gMTM4LCBzaXplWTogbnVtYmVyID0gMTM0LCBwaXZvdFg6IG51bWJlciA9IDY1LCBwaXZvdFk6IG51bWJlciA9IDYyKSB7XHJcbiAgICAgICAgbGV0IGFuaTpBbmltYXRpb24gPSBQb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bignYW5pbWF0aW9uJywgKCkgPT4geyAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFuaS5jbGVhcigpO1xyXG4gICAgICAgIGFuaS5sb2FkQXRsYXMoQXNzZXRzLkpzb25bbmFtZV0sIG51bGwsIG5hbWUpO1xyXG4gICAgICAgIGFuaS5pbmRleCA9IDA7XHJcbiAgICAgICAgYW5pLnpPcmRlciA9IERpc3BsYXlPcmRlci5CdWxsZXRCb29tO1xyXG4gICAgICAgIGFuaS5pbnRlcnZhbCA9IDE2O1xyXG4gICAgICAgIGFuaS5zaXplKHNpemVYLCBzaXplWSk7XHJcblxyXG4gICAgICAgIGxldCBib3VuZHM6IFJlY3RhbmdsZSA9IGFuaS5nZXRHcmFwaGljQm91bmRzKCk7XHJcblx0XHRhbmkucGl2b3QocGl2b3RYLCBwaXZvdFkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5pO1xyXG4gICAgfVxyXG59IiwiY29uc3QgY29uZmlnID0ge1xyXG4gICAgZ2FtZVdpZHRoOiA0ODAsXHJcbiAgICBnYW1lSGVpZ2h0OiA4MDAsXHJcblxyXG4gICAgLy8gc29ja2V0U2VydmVyOiAnd3M6Ly8xOTIuMTY4LjIuMTE5OjMxMDAnXHJcbiAgICBzb2NrZXRTZXJ2ZXI6ICd3czovLzEwNi43NS4xNDUuMTQwOjMxMDAnXHJcbiAgICAvLyBzb2NrZXRTZXJ2ZXI6ICd3czovL3NvY2tldHNlcnZlci00MDFlZi5jb2RpbmcuaW8vJ1xyXG59OyIsIi8qKlxyXG4gKiDln7rnoYDnkIPnsbtcclxuICovXHJcbmNsYXNzIEJhc2VCYWxsIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZSB7XHJcbiAgICBwcm90ZWN0ZWQgX3JhZGl1czogbnVtYmVyO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdng6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBfdnk6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBfbmV4dFg6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBfbmV4dFk6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByYWRpdXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGl1cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdngoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Z4O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZ4KHY6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdnggPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2eSh2Om51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3Z5ID0gdjtcclxuICAgIH1cclxufSIsIlxyXG5jb25zdCBCYWxsQXR0ciA9IHtcclxuICAgIHdpZHRoOiA3NCxcclxuICAgIGhlaWdodDogNzQsXHJcbiAgICBpbWdXaWR0aDogOTAsXHJcbiAgICBpbWdIZWlnaHQ6IDkwLFxyXG4gICAgdmVsb2NpdHk6IDYsXHJcbiAgICB3ZWlnaHQ6IDIuMlxyXG59XHJcblxyXG4vKipcclxuICog5q+U6LWb55CD57G7MFxyXG4gKi9cclxuY2xhc3MgQmFsbCBleHRlbmRzIEJhc2VCYWxsIHtcclxuICAgIC8vIOaRqeaTpuWKm1xyXG4gICAgcHJpdmF0ZSBfZnJpY3Rpb246IG51bWJlciA9IDAuMDE7XHJcbiAgICAvLyDml4vovazmlrnlkJEgLTHvvJrpgIbml7bpkoggMe+8mumhuuaXtumSiCAw77ya5LiN5peL6L2sXHJcbiAgICBwcml2YXRlIF9yb0RpcmVjdGlvbjogbnVtYmVyID0gMDtcclxuICAgIC8vIOaWueWQkeWQjOatpei+heWKqeWAvFxyXG4gICAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgICAvLyDnkIPnmoTnirbmgIEgMe+8miDmraPluLggMu+8muS4i+mZjeWKqOeUu+S4rSAgMzog5YGc5q2i54q25oCBXHJcbiAgICBwcml2YXRlIF9zdGF0dXM6IG51bWJlciA9IDE7XHJcbiAgICAvLyDliqjnlLvmiafooYzml7bliLvovoXliqnlgLxcclxuICAgIHByaXZhdGUgX2FuaW1UaW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfd2VpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfZmFsbFBvc0xpc3Q6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGlyZWN0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmxvYWRJbWFnZShBc3NldHMuSW1nLmJhbGwpO1xyXG4gICAgICAgIHRoaXMucGl2b3QoQmFsbEF0dHIuaW1nV2lkdGggLyAyLCBCYWxsQXR0ci5pbWdIZWlnaHQgLyAyKTtcclxuICAgICAgICB0aGlzLnNpemUoQmFsbEF0dHIud2lkdGgsIEJhbGxBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQmFsbDtcclxuICAgICAgICB0aGlzLnBvc0NlbnRlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gQmFsbEF0dHIud2lkdGggLyAyO1xyXG4gICAgICAgIHRoaXMuaW5pdFZlbG9jaXR5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3dlaWdodCA9IEJhbGxBdHRyLndlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcm9EaXJlY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvRGlyZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByb0RpcmVjdGlvbihkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yb0RpcmVjdGlvbiA9IGQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2VpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2V0IHdlaWdodCh3OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93ZWlnaHQgPSB3O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBkaXJlY3Rpb24oZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW4p+abtOaWsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlKCkge1xyXG5cclxuICAgICAgICAvLyDkuI3lkIznirbmgIHkuIvnmoTliqjkvZxcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb25JblN0YXR1cygpKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMueCA9IFV0aWxzLmZsb2F0Tih0aGlzLnggKyB0aGlzLl92eCk7XHJcbiAgICAgICAgdGhpcy55ID0gVXRpbHMuZmxvYXROKHRoaXMueSArIHRoaXMuX3Z5KTtcclxuXHJcbiAgICAgICAgLy8g6Ieq5peL6L2sXHJcbiAgICAgICAgaWYgKHRoaXMuX3JvRGlyZWN0aW9uICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBydiA9IFV0aWxzLmZsb2F0TihNYXRoLnNxcnQoTWF0aC5wb3codGhpcy5fdngsIDIpICsgTWF0aC5wb3codGhpcy5fdnksIDIpKSAqIDIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiA9IHRoaXMucm90YXRpb24gKyAodGhpcy5fcm9EaXJlY3Rpb24gPCAwID8gLTEgOiAxKSAqIHJ2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6LaK55WMXHJcbiAgICAgICAgdGhpcy5fbmV4dFggPSB0aGlzLnggKyB0aGlzLl92eDtcclxuICAgICAgICB0aGlzLl9uZXh0WSA9IHRoaXMueSArIHRoaXMuX3Z5O1xyXG5cclxuICAgICAgICAvLyDnorDliLDkuKTovrnnmoTlopnlo4FcclxuICAgICAgICBpZiAodGhpcy5fbmV4dFggPCBCYWxsQXR0ci53aWR0aCAvIDIgfHwgdGhpcy5fbmV4dFggPiBjb25maWcuZ2FtZVdpZHRoIC0gQmFsbEF0dHIud2lkdGggLyAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9ICh0aGlzLl9uZXh0WCA8IEJhbGxBdHRyLndpZHRoIC8gMikgPyBCYWxsQXR0ci53aWR0aCAvIDIgOiBjb25maWcuZ2FtZVdpZHRoIC0gQmFsbEF0dHIud2lkdGggLyAyO1xyXG4gICAgICAgICAgICB0aGlzLl92eCAqPSAtMTtcclxuICAgICAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuaGl0XzAwMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDov5vlhaXlt7HmlrnmiJblr7nmlrnnmoTpvpnpl6hcclxuICAgICAgICBsZXQgd2hvc2ViYWxsID0gdGhpcy5fbmV4dFkgPCAtNTAgPyAnbWluZScgOiAneW91cic7XHJcbiAgICAgICAgaWYgKHRoaXMuX25leHRZIDwgLTUwIHx8IHRoaXMuX25leHRZID4gY29uZmlnLmdhbWVIZWlnaHQgKyA1MCkge1xyXG4gICAgICAgICAgICB0aGlzLnZ4ID0gMDtcclxuICAgICAgICAgICAgdGhpcy52eSA9IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2FtZSA9IEdhbWUuSW5zdGFuY2U7XHJcblxyXG4gICAgICAgICAgICBnYW1lLnN0YXR1cyA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyDkvb/nvJPlrZjkuK3nmoTlrZDlvLnniIbngrhcclxuICAgICAgICAgICAgQnVsbGV0LmJvb21BbGxCdWxsZXRzKCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBNYWluLkluc3RhbmNlLmdhbWVQYWdlLl9jaGlsZHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jbGFzc05hbWUgJiYgY2hpbGQuY2xhc3NOYW1lID09PSAnQnVsbGV0JykgTWFpbi5JbnN0YW5jZS5nYW1lUGFnZS5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOa4heeQhuacquWujOaIkOeahOiuoeaXtuWZqOS7u+WKoVxyXG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLmNsZWFyVGFza0xpc3QoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOi/m+eQg+W+l+WIhlxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbmV4dFkgPCAtNTApIHtcclxuICAgICAgICAgICAgICAgIFNjb3JlTWFuYWdlci5JbnN0YW5jZS5tYmFsbHMrKztcclxuICAgICAgICAgICAgICAgIFNvY2tldC5JbnN0YW5jZS5iYWxsSW4oKTtcclxuICAgICAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLm1zY29yZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UueWJhbGxzKys7XHJcbiAgICAgICAgICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC55c2NvcmUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDliKTmlq3mmK/lkKbnu5PmnZ/mr5TotZtcclxuICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLmNoZWNrQmFsbHMod2hvc2ViYWxsKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOW7tui/n+S4gOauteaXtumXtOWQjuaJp+ihjOaOieiQveWKqOeUu1xyXG4gICAgICAgICAgICB0aGlzLl9hbmltVGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IDM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmkanmk6blh4/pgJ9cclxuICAgICAgICBsZXQgZnggPSBVdGlscy5mbG9hdE4oTWF0aC5hYnModGhpcy5fZnJpY3Rpb24gKiB0aGlzLnZ4IC8gQmFsbEF0dHIudmVsb2NpdHkpKTtcclxuICAgICAgICBsZXQgZnkgPSBVdGlscy5mbG9hdE4oTWF0aC5hYnModGhpcy5fZnJpY3Rpb24gKiB0aGlzLnZ5IC8gQmFsbEF0dHIudmVsb2NpdHkpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdnggPSBNYXRoLmFicyh0aGlzLl92eCkgPCAwLjEgPyAwIDogVXRpbHMuZmxvYXROKHRoaXMuX3Z4ID4gMCA/IHRoaXMuX3Z4IC0gZnggOiB0aGlzLl92eCArIGZ4KTtcclxuICAgICAgICB0aGlzLl92eSA9IE1hdGguYWJzKHRoaXMuX3Z5KSA8IDAuMSA/IDAgOiBVdGlscy5mbG9hdE4odGhpcy5fdnkgPiAwID8gdGhpcy5fdnkgLSBmeSA6IHRoaXMuX3Z5ICsgZnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6h566X5peL6L2s5pa55ZCRXHJcbiAgICAgKiBAcGFyYW0geCDlrZDlvLnnmoR45L2N572uXHJcbiAgICAgKiBAcGFyYW0geSDlrZDlvLnnmoR55L2N572uXHJcbiAgICAgKiBAcGFyYW0gdngg5a2Q5by555qEeOmAn+W6plxyXG4gICAgICogQHBhcmFtIHZ5IOWtkOW8ueeahHnpgJ/luqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbXBSRGlyZWN0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyLCB2eDogbnVtYmVyLCB2eTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHAgPSBVdGlscy5wb3NUb0xpbmUodGhpcy54LCB0aGlzLnksIHgsIHksIHZ4LCB2eSk7XHJcbiAgICAgICAgaWYgKCh2eCA8PSAwICYmIHZ5IDw9IDApIHx8ICh2eCA8IDAgJiYgdnkgPj0gMCkpIHtcclxuICAgICAgICAgICAgaWYgKHAgPiAwKSB0aGlzLnJvRGlyZWN0aW9uID0gMTtcclxuICAgICAgICAgICAgaWYgKHAgPCAwKSB0aGlzLnJvRGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCh2eCA+IDAgJiYgdnkgPCAwKSB8fCAodnggPj0gMCAmJiB2eSA+IDApKSB7XHJcbiAgICAgICAgICAgIGlmIChwID4gMCkgdGhpcy5yb0RpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgICAgICBpZiAocCA8IDApIHRoaXMucm9EaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2xvYmFsLnN5bikgdGhpcy5yb0RpcmVjdGlvbiAqPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlumAn+W6puWQkemHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdFZlbG9jaXR5KCkge1xyXG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKEJhbGxBdHRyLnZlbG9jaXR5ICogTWF0aC5yb3VuZChNYXRoLnNpbig5MCAqIE1hdGguUEkgLyAxODApKSAqICh0aGlzLl9kaXJlY3Rpb24gPT09IDAgPyAtMSA6IDEpKTtcclxuICAgICAgICB0aGlzLl92eSA9IFV0aWxzLmZsb2F0TigtMSAqIEJhbGxBdHRyLnZlbG9jaXR5ICogTWF0aC5yb3VuZChNYXRoLmNvcyg5MCAqIE1hdGguUEkgLyAxODApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrprkvY3liLDkuK3lv4NcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc0NlbnRlcigpIHtcclxuICAgICAgICB0aGlzLnBvcyhjb25maWcuZ2FtZVdpZHRoIC8gMiwgY29uZmlnLmdhbWVIZWlnaHQgLyAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4jeWQjOeKtuaAgeS4i+eahOWKqOS9nFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGlvbkluU3RhdHVzKCkge1xyXG5cclxuICAgICAgICAvLyDlgZzmraLkuIDmrrXml7bpl7TlkI7miafooYzmjonokL3liqjnlLtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdHVzID09PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1UaW1lICs9IDE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hbmltVGltZSA+IDMwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhbGxEb3duKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDkuIvpmY3liqjnlLtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdHVzID09PSAyKSB7XHJcbiAgICAgICAgICAgIGxldCBlYXNlVmFsdWUgPSBFYXNlLmJvdW5jZU91dCh0aGlzLl9hbmltVGltZSwgNSwgLTQsIDEwMDApO1xyXG4gICAgICAgICAgICB0aGlzLl9hbmltVGltZSArPSAxNjtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZShlYXNlVmFsdWUsIGVhc2VWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZhbGxQb3NMaXN0LnB1c2goZWFzZVZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWIpOaWreacgOS9jueCueaXtuaSreaUvuWjsOmfs1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZmFsbFBvc0xpc3QubGVuZ3RoID4gMykgdGhpcy5fZmFsbFBvc0xpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZhbGxQb3NMaXN0WzFdIDwgdGhpcy5fZmFsbFBvc0xpc3RbMF0gJiYgdGhpcy5fZmFsbFBvc0xpc3RbMV0gPCB0aGlzLl9mYWxsUG9zTGlzdFsyXSkgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuaGl0XzAwMik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYW5pbVRpbWUgPiAxMDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gR2FtZS5JbnN0YW5jZS5nZXRCYWxsRGlyZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlKDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JvRGlyZWN0aW9uID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IEdhbWUuSW5zdGFuY2UuYmFsbERpcmVjdGlvbkZhY3Rvcj8gZGlyZWN0aW9uIDogMSAtIGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFZlbG9jaXR5KCk7XHJcbiAgICAgICAgICAgICAgICBHYW1lLkluc3RhbmNlLnN0YXR1cyA9IDE7XHJcbiAgICAgICAgICAgICAgICBHYW1lLkluc3RhbmNlLnRvb2xUYWdDb250YWluZXIudW5sb2NrKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWxsUG9zTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYzmjonokL3liqjnlLtcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZhbGxEb3duKCkge1xyXG4gICAgICAgIHRoaXMuX2FuaW1UaW1lID0gMDtcclxuICAgICAgICB0aGlzLnBvc0NlbnRlcigpO1xyXG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IDI7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSBCYWxsQXR0ci53ZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc05vcm1hbFN0YXR1cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzID09PSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGcm96ZW4oKSB7XHJcblxyXG4gICAgICAgIGxldCBpY2UgPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgaWNlLmxvYWRJbWFnZShBc3NldHMuSW1nLmJhbGxfZWZmZWN0X2ljZSk7XHJcbiAgICAgICAgaWNlLnBpdm90KDQxLCA0MSk7XHJcbiAgICAgICAgaWNlLnggPSA0NTtcclxuICAgICAgICBpY2UueSA9IDQ1O1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChpY2UpO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gODtcclxuICAgICAgICBpZiAoZ2xvYmFsLnN5bikge1xyXG4gICAgICAgICAgICB0aGlzLnZ4ID0gVXRpbHMuZmxvYXROKHRoaXMudnggLyB0aGlzLndlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMudnkgPSBVdGlscy5mbG9hdE4odGhpcy52eSAvIHRoaXMud2VpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudnggPSBVdGlscy5mbG9hdE4oKHRoaXMudnggKiAtMSkgLyB0aGlzLndlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMudnkgPSBVdGlscy5mbG9hdE4oKHRoaXMudnkgKiAtMSkgLyB0aGlzLndlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMudnggKj0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMudnkgKj0gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLmNsZWFyVGFza0J5TmFtZSgnZnJvemVuJyk7XHJcbiAgICAgICAgR2FtZS5JbnN0YW5jZS50aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy53ZWlnaHQgPSBCYWxsQXR0ci53ZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICB9LCAzMDAsIHRoaXMsICdmcm96ZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbGVhc2UoKSB7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSBCYWxsQXR0ci53ZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vKipcclxuICog5a2Q5by557G7XHJcbiAqL1xyXG5jbGFzcyBCdWxsZXQgZXh0ZW5kcyBCYXNlQmFsbCB7XHJcbiAgICAvKipcclxuICAgICAqIOWtkOW8ueexu+WeiyDlrZDlvLnmiYDlsZ7mlrlcclxuICAgICAqIG1idWxsZXQgLyB5YnVsbGV0XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBfb3duZXI6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBfdHlwZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDlvLnnvJPlrZjpmJ/liJdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBteUJ1bGxldHM6IEFycmF5PEJ1bGxldD4gPSBbXTtcclxuICAgIHB1YmxpYyBzdGF0aWMgeW91ckJ1bGxldHM6IEFycmF5PEJ1bGxldD4gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcgPSAnQnVsbGV0JztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnpPcmRlciA9IERpc3BsYXlPcmRlci5CdWxsZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDku47lr7nosaHmsaDkuK3lj5bkuIDkuKrlrp7kvotcclxuICAgICAqIEBwYXJhbSBhbmdsZSDnlJ/miJDlrZDlvLnnmoTop5LluqZcclxuICAgICAqIEBwYXJhbSBwb3dlciDnlJ/miJDlrZDlvLnnmoTliJ3lp4vlipvluqZcclxuICAgICAqIEBwYXJhbSB0eXBlIOWtkOW8ueeahOexu+Wei1xyXG4gICAgICogICAgICBTdGFuZGFyZEJ1bGxldCDmoIflh4blrZDlvLlcclxuICAgICAqICAgICAgSWNlQnVsbGV0IOWGsOWGu+W8uVxyXG4gICAgICogICAgICBEaXZpc2lvbkJ1bGxldCDliIboo4LlvLlcclxuICAgICAqICAgICAgU21va2VCdWxsZXQg54Of6Zu+5by5XHJcbiAgICAgKiAgICAgIEJvbWJCdWxsZXQg5beo5Z6L54K45by5XHJcbiAgICAgKiBAcGFyYW0gb3duZXIg5a2Q5by555qE5omA5bGe5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUoYW5nbGU6IG51bWJlciwgcG93ZXI6IG51bWJlciwgdHlwZTogc3RyaW5nLCBvd25lcjogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGxldCBidWxsZXQgPSBQb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bih0eXBlLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnU3RhbmRhcmRCdWxsZXQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gJ3NlbGYnKSByZXR1cm4gbmV3IFN0YW5kYXJkQnVsbGV0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3duZXIgPT09ICdvcHBvbmVudCcpIHJldHVybiBuZXcgU3RhbmRhcmRCdWxsZXQoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0ljZUJ1bGxldCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJY2VCdWxsZXQoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0RpdmlzaW9uQnVsbGV0JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERpdmlzaW9uQnVsbGV0KCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdEaXZpc2lvbkNoaWxkQnVsbGV0JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERpdmlzaW9uQ2hpbGRCdWxsZXQoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1Ntb2tlQnVsbGV0JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNtb2tlQnVsbGV0KCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdCb21iQnVsbGV0JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJvbWJCdWxsZXQoKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHsgY29uc29sZS5sb2coJ25vdCBleGlzdCBidWxsZXQgdHlwZS4nKTsgcmV0dXJuIG5ldyBTdGFuZGFyZEJ1bGxldCgpOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYnVsbGV0LmluaXQoYW5nbGUsIHBvd2VyLCBvd25lcik7XHJcblxyXG4gICAgICAgIC8vIOWtmOaUvuWIsOWvueW6lOeahOaVsOe7hOS4rVxyXG4gICAgICAgIGlmIChvd25lciA9PT0gJ3NlbGYnKSBCdWxsZXQubXlCdWxsZXRzLnB1c2goYnVsbGV0KTtcclxuICAgICAgICBlbHNlIGlmIChvd25lciA9PT0gJ29wcG9uZW50JykgQnVsbGV0LnlvdXJCdWxsZXRzLnB1c2goYnVsbGV0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1bGxldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluWtkOW8uVxyXG4gICAgICogQHBhcmFtIGFuZ2xlIOinkuW6plxyXG4gICAgICogQHBhcmFtIHZlbG9jaXR5IOWIneWni+mAn+W6plxyXG4gICAgICogQHBhcmFtIHR5cGUg5a2Q5by557G75Z6L77yIbWJ1bGxldDrmiJHnmoTlrZDlvLnvvIx5YnVsbGV0OuWvueaWueeahOWtkOW8uSlcclxuICAgICAqIEBwYXJhbSBwb3dlciDlipvluqYgMCB+IDFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXQoYW5nbGU6IG51bWJlciwgcG93ZXI6IG51bWJlciwgb3duZXI6IHN0cmluZykge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bin6YC76L6RXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XHJcblxyXG4gICAgICAgIC8vICDnorDmkp7mo4DmtYtcclxuICAgICAgICB0aGlzLmNvbGxpc2lvbigpO1xyXG5cclxuICAgICAgICB0aGlzLnggPSBVdGlscy5mbG9hdE4odGhpcy54ICsgdGhpcy5fdngpO1xyXG4gICAgICAgIHRoaXMueSA9IFV0aWxzLmZsb2F0Tih0aGlzLnkgKyB0aGlzLl92eSk7XHJcblxyXG4gICAgICAgIC8vIOi2iueVjFxyXG4gICAgICAgIHRoaXMuX25leHRYID0gdGhpcy54ICsgdGhpcy5fdng7XHJcbiAgICAgICAgdGhpcy5fbmV4dFkgPSB0aGlzLnkgKyB0aGlzLl92eTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX25leHRYIDwgdGhpcy53aWR0aCAvIDIgfHwgdGhpcy5fbmV4dFggPiBjb25maWcuZ2FtZVdpZHRoIC0gdGhpcy53aWR0aCAvIDIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gKHRoaXMuX25leHRYIDwgdGhpcy53aWR0aCAvIDIpID8gdGhpcy53aWR0aCAvIDIgOiBjb25maWcuZ2FtZVdpZHRoIC0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHRoaXMuX3Z4ICo9IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMueSA8IC0xICogdGhpcy53aWR0aCAvIDIgfHwgdGhpcy55ID4gY29uZmlnLmdhbWVIZWlnaHQgKyB0aGlzLmhlaWdodCAvIDIpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56Kw5pKe5qOA5rWLXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb2xsaXNpb24oKSB7XHJcbiAgICAgICAgbGV0IGJ1bGxldHM7XHJcbiAgICAgICAgbGV0IGJhbGwgPSBHYW1lLkluc3RhbmNlLmJhbGw7XHJcblxyXG4gICAgICAgIC8vIOajgOa1i+WtkOW8ueS5i+mXtOeahOeisOaSniDmoLnmja5zeW7lkIzmraXlgLznoa7lrprku6Xlk6rmlrnlrZDlvLnkvZzkuLrnorDmkp7mo4DmtYvkuLvkvZNcclxuICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiBnbG9iYWwuc3luID09PSAwKSB7XHJcbiAgICAgICAgICAgIGJ1bGxldHMgPSBCdWxsZXQueW91ckJ1bGxldHM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBiIG9mIGJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uQnVsbGV0cyh0aGlzLCBiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9vd25lciA9PT0gJ29wcG9uZW50JyAmJiBnbG9iYWwuc3luID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJ1bGxldHMgPSBCdWxsZXQubXlCdWxsZXRzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYiBvZiBidWxsZXRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkJ1bGxldHModGhpcywgYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOajgOa1i+WtkOW8ueS4jueQg+S5i+mXtOeahOeisOaSnlxyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uQmFsbChiYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuoeeul+S4pOWtkOW8ueeisOaSnuWQjueahOeJqeeQhui/kOWKqFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29sbGlzaW9uQnVsbGV0cyhvYmplY3QxOiBCdWxsZXQsIG9iamVjdDI6IEJ1bGxldCkge1xyXG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8g5LiL5LiA5bin55qE5L2N572uXHJcbiAgICAgICAgbGV0IG5leHRPYmplY3QxID0ge1xyXG4gICAgICAgICAgICB4OiBvYmplY3QxLnggKyBvYmplY3QxLnZ4LFxyXG4gICAgICAgICAgICB5OiBvYmplY3QxLnkgKyBvYmplY3QxLnZ5LFxyXG4gICAgICAgICAgICByYWRpdXM6IG9iamVjdDEucmFkaXVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IG5leHRPYmplY3QyID0ge1xyXG4gICAgICAgICAgICB4OiBvYmplY3QyLnggKyBvYmplY3QyLnZ4LFxyXG4gICAgICAgICAgICB5OiBvYmplY3QyLnkgKyBvYmplY3QyLnZ5LFxyXG4gICAgICAgICAgICByYWRpdXM6IG9iamVjdDIucmFkaXVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKFV0aWxzLmlzQ2lyY2xlQ29sbGlzaW9uKG5leHRPYmplY3QxLCBuZXh0T2JqZWN0MikpIHtcclxuICAgICAgICAgICAgW29iamVjdDEueCwgb2JqZWN0MS55LCBvYmplY3QyLngsIG9iamVjdDIueV0gPSBVdGlscy5maXhDb2xsaXNpb24oVXRpbHMucChvYmplY3QxLngsIG9iamVjdDEueSksIFV0aWxzLnAob2JqZWN0Mi54LCBvYmplY3QyLnkpLCBvYmplY3QxLnJhZGl1cywgb2JqZWN0Mi5yYWRpdXMsIGNvbnZlcnQpO1xyXG5cclxuICAgICAgICAgICAgW29iamVjdDEudngsIG9iamVjdDEudnksIG9iamVjdDIudngsIG9iamVjdDIudnldID0gVXRpbHMuY29tcEJhbGxSZWJvdW5kKFV0aWxzLnAob2JqZWN0MS54LCBvYmplY3QxLnkpLCBVdGlscy5wKG9iamVjdDIueCwgb2JqZWN0Mi55KSwgeyB2eDogb2JqZWN0MS52eCwgdnk6IG9iamVjdDEudnkgfSwgeyB2eDogb2JqZWN0Mi52eCwgdnk6IG9iamVjdDIudnkgfSwgY29udmVydCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6h566X5a2Q5by55ZKM55CD56Kw5pKe5ZCO55qE54mp55CG6L+Q5YqoXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBjb2xsaXNpb25CYWxsKGJhbGw6IEJhbGwpIHtcclxuXHJcbiAgICAgICAgLy8g5LiL5LiA5L2N572uXHJcbiAgICAgICAgbGV0IG5leHRPYmplY3QxID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB0aGlzLnZ4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB0aGlzLnZ5LFxyXG4gICAgICAgICAgICByYWRpdXM6IHRoaXMucmFkaXVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IG5leHRPYmplY3QyID0ge1xyXG4gICAgICAgICAgICB4OiBiYWxsLnggKyBiYWxsLnZ4LFxyXG4gICAgICAgICAgICB5OiBiYWxsLnkgKyBiYWxsLnZ5LFxyXG4gICAgICAgICAgICByYWRpdXM6IGJhbGwucmFkaXVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKFV0aWxzLmlzQ2lyY2xlQ29sbGlzaW9uKG5leHRPYmplY3QxLCBuZXh0T2JqZWN0MikpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVCYWxsUGh5c2ljcyhiYWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNhbGN1bGF0ZUJhbGxQaHlzaWNzKGJhbGw6IEJhbGwpIHtcclxuXHJcbiAgICAgICAgdGhpcy5maXhCYWxsUG9zaXRpb24oYmFsbCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+eQg+eahOaXi+i9rOaWueWQkVxyXG4gICAgICAgIGJhbGwuY29tcFJEaXJlY3Rpb24odGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJhbGxWZWxvY2l0eShiYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZml4QmFsbFBvc2l0aW9uKGJhbGw6IEJhbGwpIHtcclxuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XHJcblxyXG4gICAgICAgIFt0aGlzLngsIHRoaXMueSwgYmFsbC54LCBiYWxsLnldID0gVXRpbHMuZml4Q29sbGlzaW9uKFV0aWxzLnAodGhpcy54LCB0aGlzLnkpLCBVdGlscy5wKGJhbGwueCwgYmFsbC55KSwgdGhpcy5yYWRpdXMsIGJhbGwucmFkaXVzLCBjb252ZXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2FsY3VsYXRlQmFsbFZlbG9jaXR5KGJhbGw6IEJhbGwpIHtcclxuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XHJcblxyXG4gICAgICAgIFt0aGlzLnZ4LCB0aGlzLnZ5LCBiYWxsLnZ4LCBiYWxsLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHsgdng6IHRoaXMudngsIHZ5OiB0aGlzLnZ5IH0sIHsgdng6IGJhbGwudngsIHZ5OiBiYWxsLnZ5IH0sIGNvbnZlcnQpO1xyXG5cclxuICAgICAgICB0aGlzLnNpbXVsYXRlV2VpZ2h0KGJhbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzaW11bGF0ZVdlaWdodChiYWxsOiBCYWxsKSB7XHJcbiAgICAgICAgLy8g5a+555CD6L+b6KGM5YeP6YCf5aSE55CG77yM5qih5ouf5bCP55CD55qE6YeN6YePXHJcbiAgICAgICAgaWYgKGdsb2JhbC5zeW4pIHtcclxuICAgICAgICAgICAgYmFsbC52eCA9IFV0aWxzLmZsb2F0TihiYWxsLnZ4IC8gYmFsbC53ZWlnaHQpO1xyXG4gICAgICAgICAgICBiYWxsLnZ5ID0gVXRpbHMuZmxvYXROKGJhbGwudnkgLyBiYWxsLndlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBiYWxsLnZ4ID0gVXRpbHMuZmxvYXROKChiYWxsLnZ4ICogLTEpIC8gYmFsbC53ZWlnaHQpO1xyXG4gICAgICAgICAgICBiYWxsLnZ5ID0gVXRpbHMuZmxvYXROKChiYWxsLnZ5ICogLTEpIC8gYmFsbC53ZWlnaHQpO1xyXG4gICAgICAgICAgICBiYWxsLnZ4ICo9IC0xO1xyXG4gICAgICAgICAgICBiYWxsLnZ5ICo9IC0xO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS9v+e8k+WtmOmYn+WIl+S4reaJgOacieWtkOW8ueeIhueCuFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGJvb21BbGxCdWxsZXRzKCkge1xyXG4gICAgICAgIHdoaWxlIChCdWxsZXQubXlCdWxsZXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgQnVsbGV0Lm15QnVsbGV0c1swXS5yZWxlYXNlQWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChCdWxsZXQueW91ckJ1bGxldHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBCdWxsZXQueW91ckJ1bGxldHNbMF0ucmVsZWFzZUFjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAgOWcuuWKqOS9nFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVsZWFzZUFjdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbGVhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbnuaUtuWtkOW8uVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVsZWFzZSgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUZyb21BcnIoKTtcclxuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcclxuICAgICAgICBQb29sLnJlY292ZXIodGhpcy5fdHlwZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDku47lhajlsYDmlbDnu4TkuK3liKDpmaRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUZyb21BcnIoKSB7XHJcbiAgICAgICAgbGV0IGxpc3Q7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9vd25lciA9PT0gJ3NlbGYnKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBCdWxsZXQubXlCdWxsZXRzO1xyXG4gICAgICAgICAgICBsaXN0LnNwbGljZShsaXN0LmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9vd25lciA9PT0gJ29wcG9uZW50Jykge1xyXG4gICAgICAgICAgICBsaXN0ID0gQnVsbGV0LnlvdXJCdWxsZXRzO1xyXG4gICAgICAgICAgICBsaXN0LnNwbGljZShsaXN0LmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImNvbnN0IFN0YW5kYXJkQnVsbGV0QXR0ciA9IHtcclxuICAgIHdpZHRoOiA0MCxcclxuICAgIGhlaWdodDogNDAsXHJcbiAgICBpbWdXaWR0aDogMzksXHJcbiAgICBpbWdIZWlnaHQ6IDM5LFxyXG4gICAgdmVsb2NpdHk6IDIwXHJcbn1cclxuXHJcbmNsYXNzIFN0YW5kYXJkQnVsbGV0IGV4dGVuZHMgQnVsbGV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gJ3N0YW5kYXJkJztcclxuXHJcbiAgICAgICAgdGhpcy5waXZvdChTdGFuZGFyZEJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBTdGFuZGFyZEJ1bGxldEF0dHIuaW1nSGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5zaXplKFN0YW5kYXJkQnVsbGV0QXR0ci53aWR0aCwgU3RhbmRhcmRCdWxsZXRBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gU3RhbmRhcmRCdWxsZXRBdHRyLndpZHRoIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluWtkOW8uVxyXG4gICAgICogQHBhcmFtIGFuZ2xlIOinkuW6plxyXG4gICAgICogQHBhcmFtIHZlbG9jaXR5IOWIneWni+mAn+W6plxyXG4gICAgICogQHBhcmFtIHR5cGUg5a2Q5by557G75Z6L77yIbWJ1bGxldDrmiJHnmoTlrZDlvLnvvIx5YnVsbGV0OuWvueaWueeahOWtkOW8uSlcclxuICAgICAqIEBwYXJhbSBwb3dlciDlipvluqYgMCB+IDFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXQoYW5nbGU6IG51bWJlciwgcG93ZXI6IG51bWJlciwgb3duZXI6IHN0cmluZykge1xyXG4gICAgICAgIGxldCB2ID0gVXRpbHMuZmxvYXROKFN0YW5kYXJkQnVsbGV0QXR0ci52ZWxvY2l0eSAtICgxIC0gcG93ZXIpICogMTIpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRJbWFnZShvd25lciA9PT0gJ3NlbGYnID8gQXNzZXRzLkltZy5idWxsZXRtIDogb3duZXIgPT09ICdvcHBvbmVudCcgPyBBc3NldHMuSW1nLmJ1bGxldHkgOiAnJyk7XHJcbiAgICAgICAgdGhpcy5fb3duZXIgPSBvd25lcjtcclxuICAgICAgICB0aGlzLl92eCA9IFV0aWxzLmZsb2F0TigodiAqIE1hdGguc2luKGFuZ2xlICogTWF0aC5QSSAvIDE4MCkpKTtcclxuICAgICAgICB0aGlzLl92eSA9IFV0aWxzLmZsb2F0TigoLTEgKiB2ICogTWF0aC5jb3MoYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBmaXhCYWxsUG9zaXRpb24oYmFsbDogQmFsbCkge1xyXG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgW3RoaXMueCwgdGhpcy55LCBiYWxsLngsIGJhbGwueV0gPSBVdGlscy5maXhDb2xsaXNpb24oVXRpbHMucCh0aGlzLngsIHRoaXMueSksIFV0aWxzLnAoYmFsbC54LCBiYWxsLnkpLCB0aGlzLnJhZGl1cywgYmFsbC5yYWRpdXMsIGNvbnZlcnQpO1xyXG5cclxuICAgICAgICAvLyDorqHnrpfnkIPlv4PliLDnm7Tnur/nmoTot53nprtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSBVdGlscy5kaXN0YW5jZVRvTGluZShiYWxsLngsIGJhbGwueSwgdGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xyXG5cclxuICAgICAgICAvLyDlpoLmnpzlrZDlvLnkuI7lsI/nkIPmk6bogqnogIzov4fvvIzkuI3niIbngrhcclxuICAgICAgICBpZiAoZGlzdGFuY2UgPCAzOCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiBiYWxsLmlzTm9ybWFsU3RhdHVzKCkpIFNvY2tldC5JbnN0YW5jZS5jYXVzZUV4cGxvc2lvbigpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VBY3Rpb24oKTtcclxuICAgICAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuYm9vbV8wMDEsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuaGl0XzAwMSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCA5Zy65Yqo5L2cIC0g54iG54K45Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWxlYXNlQWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBwb3MgPSBVdGlscy5wKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuX293bmVyID09PSAnc2VsZicgPyAnYmx1ZV9ib29tJyA6IHRoaXMuX293bmVyID09PSAnb3Bwb25lbnQnID8gJ3JlZF9ib29tJyA6ICcnO1xyXG4gICAgICAgIGxldCBhbmkgPSBBbmltYXRpb25NYW5hZ2VyLmdldE9yQ3JlYXRlKG5hbWUpO1xyXG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XHJcblxyXG4gICAgICAgIGFuaS5wb3MocG9zLngsIHBvcy55KTtcclxuXHJcbiAgICAgICAgYW5pLm9mZihMYXlhRXZlbnQuQ09NUExFVEUsIGFuaSwgKCkgPT4geyB9KTtcclxuICAgICAgICBhbmkub24oTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHtcclxuICAgICAgICAgICAgUG9vbC5yZWNvdmVyKG5hbWUsIGFuaSk7XHJcbiAgICAgICAgICAgIGFuaS5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKGFuaSk7XHJcblxyXG4gICAgICAgIGFuaS5wbGF5KDAsIGZhbHNlLCBuYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICB9XHJcbn0iLCJjb25zdCBJY2VCdWxsZXRBdHRyID0ge1xyXG4gICAgd2lkdGg6IDQwLFxyXG4gICAgaGVpZ2h0OiA0MCxcclxuICAgIGltZ1dpZHRoOiAzOSxcclxuICAgIGltZ0hlaWdodDogMzksXHJcbiAgICB2ZWxvY2l0eTogMjBcclxufVxyXG4vKipcclxuICog5Yaw5Ya75by5XHJcbiAqL1xyXG5jbGFzcyBJY2VCdWxsZXQgZXh0ZW5kcyBCdWxsZXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnaWNlJztcclxuICAgICAgICB0aGlzLnBpdm90KEljZUJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBJY2VCdWxsZXRBdHRyLmltZ0hlaWdodCAvIDIpO1xyXG4gICAgICAgIHRoaXMuc2l6ZShJY2VCdWxsZXRBdHRyLndpZHRoLCBJY2VCdWxsZXRBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gSWNlQnVsbGV0QXR0ci53aWR0aCAvIDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoYW5nbGU6IG51bWJlciwgcG93ZXI6IG51bWJlciwgb3duZXI6IHN0cmluZykge1xyXG4gICAgICAgIGxldCB2ID0gVXRpbHMuZmxvYXROKEljZUJ1bGxldEF0dHIudmVsb2NpdHkgLSAoMSAtIHBvd2VyKSAqIDEyKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5idWxsZXRfaWNlKTtcclxuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xyXG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xyXG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNhbGN1bGF0ZUJhbGxQaHlzaWNzKGJhbGw6IEJhbGwpIHtcclxuICAgICAgICBsZXQgY29udmVydCA9IGdsb2JhbC5zeW4gPyBmYWxzZSA6IHRydWU7XHJcblxyXG4gICAgICAgIFt0aGlzLngsIHRoaXMueSwgYmFsbC54LCBiYWxsLnldID0gVXRpbHMuZml4Q29sbGlzaW9uKFV0aWxzLnAodGhpcy54LCB0aGlzLnkpLCBVdGlscy5wKGJhbGwueCwgYmFsbC55KSwgdGhpcy5yYWRpdXMsIGJhbGwucmFkaXVzLCBjb252ZXJ0KTtcclxuXHJcbiAgICAgICAgLy8g6K6h566X55CD5b+D5Yiw55u057q/55qE6Led56a7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVXRpbHMuZGlzdGFuY2VUb0xpbmUoYmFsbC54LCBiYWxsLnksIHRoaXMueCwgdGhpcy55LCB0aGlzLnZ4LCB0aGlzLnZ5KTtcclxuXHJcbiAgICAgICAgLy8g6K6h566X55CD55qE5peL6L2s5pa55ZCRXHJcbiAgICAgICAgYmFsbC5jb21wUkRpcmVjdGlvbih0aGlzLngsIHRoaXMueSwgdGhpcy52eCwgdGhpcy52eSk7XHJcblxyXG4gICAgICAgIFt0aGlzLnZ4LCB0aGlzLnZ5LCBiYWxsLnZ4LCBiYWxsLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHsgdng6IHRoaXMudngsIHZ5OiB0aGlzLnZ5IH0sIHsgdng6IGJhbGwudngsIHZ5OiBiYWxsLnZ5IH0sIGNvbnZlcnQpO1xyXG5cclxuICAgICAgICB0aGlzLnNpbXVsYXRlV2VpZ2h0KGJhbGwpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbGVhc2VBY3Rpb24oKTtcclxuICAgICAgICB0aGlzLmZyb3plbihiYWxsKTtcclxuICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiBiYWxsLmlzTm9ybWFsU3RhdHVzKCkpIFNvY2tldC5JbnN0YW5jZS5jYXVzZUV4cGxvc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBmcm96ZW4ob2JqZWN0KSB7XHJcbiAgICAgICAgb2JqZWN0LmdldEZyb3plbigpO1xyXG5cclxuICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5mcm96ZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCA5Zy65Yqo5L2cIC0g54iG54K45Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWxlYXNlQWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBwb3MgPSBVdGlscy5wKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICBsZXQgbmFtZSA9ICdibHVlX2Jvb20nO1xyXG4gICAgICAgIGxldCBhbmkgPSBBbmltYXRpb25NYW5hZ2VyLmdldE9yQ3JlYXRlKG5hbWUpO1xyXG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XHJcblxyXG4gICAgICAgIGFuaS5wb3MocG9zLngsIHBvcy55KTtcclxuXHJcbiAgICAgICAgYW5pLm9mZihMYXlhRXZlbnQuQ09NUExFVEUsIGFuaSwgKCkgPT4geyB9KTtcclxuICAgICAgICBhbmkub24oTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHtcclxuICAgICAgICAgICAgUG9vbC5yZWNvdmVyKG5hbWUsIGFuaSk7XHJcbiAgICAgICAgICAgIGFuaS5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKGFuaSk7XHJcblxyXG4gICAgICAgIGFuaS5wbGF5KDAsIGZhbHNlLCBuYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICB9XHJcbn0iLCJjb25zdCBEaXZpc2lvbkJ1bGxldEF0dHIgPSB7XHJcbiAgICB3aWR0aDogNDAsXHJcbiAgICBoZWlnaHQ6IDQwLFxyXG4gICAgaW1nV2lkdGg6IDM5LFxyXG4gICAgaW1nSGVpZ2h0OiAzOSxcclxuICAgIHZlbG9jaXR5OiAyMFxyXG59XHJcbi8qKlxyXG4gKiDliIboo4LlvLlcclxuICovXHJcbmNsYXNzIERpdmlzaW9uQnVsbGV0IGV4dGVuZHMgQnVsbGV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gJ2RpdmlzaW9uJztcclxuXHJcbiAgICAgICAgdGhpcy5waXZvdChEaXZpc2lvbkJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBEaXZpc2lvbkJ1bGxldEF0dHIuaW1nSGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5zaXplKERpdmlzaW9uQnVsbGV0QXR0ci53aWR0aCwgRGl2aXNpb25CdWxsZXRBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gRGl2aXNpb25CdWxsZXRBdHRyLndpZHRoIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdChhbmdsZTogbnVtYmVyLCBwb3dlcjogbnVtYmVyLCBvd25lcjogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHYgPSBVdGlscy5mbG9hdE4oRGl2aXNpb25CdWxsZXRBdHRyLnZlbG9jaXR5IC0gKDEgLSBwb3dlcikgKiAxMik7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcuYnVsbGV0X2RpdmlzaW9uKTtcclxuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xyXG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xyXG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XHJcblxyXG4gICAgICAgIEdhbWUuSW5zdGFuY2UudGltZXIuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGl2aWRlRWZmZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGl2aWRlKCk7XHJcbiAgICAgICAgfSwgMTAsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoKSB7XHJcbiAgICAgICAgbGV0IGdhbWVQYWdlID0gTWFpbi5JbnN0YW5jZS5nYW1lUGFnZTtcclxuICAgICAgICBsZXQgYW5nbGUgPSBVdGlscy5mbG9hdE4oTWF0aC5hdGFuKHRoaXMudnggLyB0aGlzLnZ5KSAqIDE4MCAvIE1hdGguUEkgKiAtMSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBidWxsZXQgPSBCdWxsZXQuZ2V0T3JDcmVhdGUoVXRpbHMuZmxvYXROKGFuZ2xlICsgKGkgLSAxKSAqIDIwICsgKHRoaXMuX293bmVyID09PSAnb3Bwb25lbnQnID8gMTgwIDogMCkpLCAwLjYsICdEaXZpc2lvbkNoaWxkQnVsbGV0JywgdGhpcy5fb3duZXIpO1xyXG4gICAgICAgICAgICBidWxsZXQucG9zKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQoYnVsbGV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuYm9vbV8wMDMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCA5Zy65Yqo5L2cIC0g54iG54K45Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXZpZGVFZmZlY3QoKSB7XHJcbiAgICAgICAgbGV0IHBvcyA9IFV0aWxzLnAodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgICAgIGxldCBuYW1lID0gJ2dyZWVuX2Jvb20nO1xyXG4gICAgICAgIGxldCBhbmkgPSBBbmltYXRpb25NYW5hZ2VyLmdldE9yQ3JlYXRlKG5hbWUpO1xyXG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XHJcblxyXG4gICAgICAgIGFuaS5wb3MocG9zLngsIHBvcy55KTtcclxuXHJcbiAgICAgICAgYW5pLm9mZihMYXlhRXZlbnQuQ09NUExFVEUsIGFuaSwgKCkgPT4geyB9KTtcclxuICAgICAgICBhbmkub24oTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHtcclxuICAgICAgICAgICAgUG9vbC5yZWNvdmVyKG5hbWUsIGFuaSk7XHJcbiAgICAgICAgICAgIGFuaS5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKGFuaSk7XHJcblxyXG4gICAgICAgIGFuaS5wbGF5KDAsIGZhbHNlLCBuYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERpdmlzaW9uQ2hpbGRCdWxsZXQgZXh0ZW5kcyBCdWxsZXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9ICdkaXZpc2lvbmNoaWxkJztcclxuXHJcbiAgICAgICAgdGhpcy5waXZvdChEaXZpc2lvbkJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBEaXZpc2lvbkJ1bGxldEF0dHIuaW1nSGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5zaXplKERpdmlzaW9uQnVsbGV0QXR0ci53aWR0aCwgRGl2aXNpb25CdWxsZXRBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gRGl2aXNpb25CdWxsZXRBdHRyLndpZHRoIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdChhbmdsZTogbnVtYmVyLCBwb3dlcjogbnVtYmVyLCBvd25lcjogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHYgPSBVdGlscy5mbG9hdE4oRGl2aXNpb25CdWxsZXRBdHRyLnZlbG9jaXR5IC0gKDEgLSBwb3dlcikgKiAxMik7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcuYnVsbGV0X2RpdmlzaW9uKTtcclxuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xyXG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xyXG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGZpeEJhbGxQb3NpdGlvbihiYWxsOiBCYWxsKSB7XHJcbiAgICAgICAgbGV0IGNvbnZlcnQgPSBnbG9iYWwuc3luID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuICAgICAgICBbdGhpcy54LCB0aGlzLnksIGJhbGwueCwgYmFsbC55XSA9IFV0aWxzLmZpeENvbGxpc2lvbihVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHRoaXMucmFkaXVzLCBiYWxsLnJhZGl1cywgY29udmVydCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+eQg+W/g+WIsOebtOe6v+eahOi3neemu1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IFV0aWxzLmRpc3RhbmNlVG9MaW5lKGJhbGwueCwgYmFsbC55LCB0aGlzLngsIHRoaXMueSwgdGhpcy52eCwgdGhpcy52eSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuaGl0XzAwMSwgMSk7XHJcbiAgICB9XHJcbn0iLCJjb25zdCBTbW9rZUJ1bGxldEF0dHIgPSB7XHJcbiAgICB3aWR0aDogNDAsXHJcbiAgICBoZWlnaHQ6IDQwLFxyXG4gICAgaW1nV2lkdGg6IDM5LFxyXG4gICAgaW1nSGVpZ2h0OiAzOSxcclxuICAgIHZlbG9jaXR5OiAyMFxyXG59XHJcbi8qKlxyXG4gKiDlt6jnn7Pngq7lvLlcclxuICovXHJcbmNsYXNzIFNtb2tlQnVsbGV0IGV4dGVuZHMgQnVsbGV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gJ3Ntb2tlJztcclxuICAgICAgICB0aGlzLnBpdm90KFNtb2tlQnVsbGV0QXR0ci5pbWdXaWR0aCAvIDIsIFNtb2tlQnVsbGV0QXR0ci5pbWdIZWlnaHQgLyAyKTtcclxuICAgICAgICB0aGlzLnNpemUoU21va2VCdWxsZXRBdHRyLndpZHRoLCBTbW9rZUJ1bGxldEF0dHIuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLl9yYWRpdXMgPSBTbW9rZUJ1bGxldEF0dHIud2lkdGggLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIG93bmVyOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgdiA9IFV0aWxzLmZsb2F0TihJY2VCdWxsZXRBdHRyLnZlbG9jaXR5IC0gKDEgLSBwb3dlcikgKiAxMik7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcuYnVsbGV0X3Ntb2tlKTtcclxuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xyXG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xyXG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIGlmICgodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiB0aGlzLnkgPCAxNjApIHx8ICh0aGlzLl9vd25lciA9PT0gJ29wcG9uZW50JyAmJiB0aGlzLnkgPiBjb25maWcuZ2FtZUhlaWdodCAtIDE2MCkpIHtcclxuICAgICAgICAgICAgdGhpcy5tYWtlU21va2UoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBmaXhCYWxsUG9zaXRpb24oYmFsbDogQmFsbCkge1xyXG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgW3RoaXMueCwgdGhpcy55LCBiYWxsLngsIGJhbGwueV0gPSBVdGlscy5maXhDb2xsaXNpb24oVXRpbHMucCh0aGlzLngsIHRoaXMueSksIFV0aWxzLnAoYmFsbC54LCBiYWxsLnkpLCB0aGlzLnJhZGl1cywgYmFsbC5yYWRpdXMsIGNvbnZlcnQpO1xyXG5cclxuICAgICAgICAvLyDorqHnrpfnkIPlv4PliLDnm7Tnur/nmoTot53nprtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSBVdGlscy5kaXN0YW5jZVRvTGluZShiYWxsLngsIGJhbGwueSwgdGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmhpdF8wMDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiDng5/pm77mlYjmnpxcclxuICAgICovXHJcbiAgICBwdWJsaWMgbWFrZVNtb2tlKCkge1xyXG4gICAgICAgIGxldCBwb3MgPSBVdGlscy5wKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICBsZXQgbmFtZSA9ICdzbW9rZSc7XHJcbiAgICAgICAgbGV0IGFuaSA9IEFuaW1hdGlvbk1hbmFnZXIuZ2V0T3JDcmVhdGUobmFtZSwgNTAwLCAyNTAsIDI1MCwgMTI1KTtcclxuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xyXG4gICAgICAgIGxldCBzbW9rZTtcclxuICAgICAgICBsZXQgdGFza05hbWUgPSB0aGlzLl9vd25lciA9PT0gJ3NlbGYnID8gJ3N0b3BTbW9rZTEnIDogJ3N0b3BTbW9rZTInO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiBHYW1lLkluc3RhbmNlLnNtb2tlMSkge1xyXG4gICAgICAgICAgICBzbW9rZSA9IEdhbWUuSW5zdGFuY2Uuc21va2UxO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS50aW1lci5ydW5UYXNrQnlOYW1lKHRhc2tOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fb3duZXIgPT09ICdvcHBvbmVudCcgJiYgR2FtZS5JbnN0YW5jZS5zbW9rZTIpIHtcclxuICAgICAgICAgICAgc21va2UgPSBHYW1lLkluc3RhbmNlLnNtb2tlMjtcclxuXHJcbiAgICAgICAgICAgIEdhbWUuSW5zdGFuY2UudGltZXIucnVuVGFza0J5TmFtZSh0YXNrTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbmkucG9zKGNvbmZpZy5nYW1lV2lkdGggLyAyLCBwb3MueSk7XHJcbiAgICAgICAgYW5pLmludGVydmFsID0gMTAwO1xyXG4gICAgICAgIGFuaS5zY2FsZSgwLjEsIDAuMSk7XHJcbiAgICAgICAgYW5pLnpPcmRlciA9IERpc3BsYXlPcmRlci5TbW9rZTtcclxuXHJcbiAgICAgICAgVHdlZW4udG8oYW5pLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxIH0sIDMwMCk7XHJcbiAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQoYW5pKTtcclxuICAgICAgICBhbmkucGxheSgwLCB0cnVlLCBuYW1lKTtcclxuXHJcbiAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuc21va2UsIDApO1xyXG5cclxuICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyID09PSAnc2VsZicpIEdhbWUuSW5zdGFuY2Uuc21va2UxID0gbnVsbDtcclxuICAgICAgICAgICAgZWxzZSBHYW1lLkluc3RhbmNlLnNtb2tlMiA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghR2FtZS5JbnN0YW5jZS5zbW9rZTEgJiYgIUdhbWUuSW5zdGFuY2Uuc21va2UyKSBTb3VuZE1hbmFnZXIuc3RvcFNvdW5kKEFzc2V0cy5Tb3VuZC5zbW9rZSk7XHJcbiAgICAgICAgICAgIFR3ZWVuLnRvKGFuaSwgeyBhbHBoYTogMCB9LCA4MDAsIEVhc2UubGluZWFySW5PdXQsIEhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFuaS5hbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICBQb29sLnJlY292ZXIobmFtZSwgYW5pKTtcclxuICAgICAgICAgICAgICAgIGFuaS5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9LCA1MDAsIHRoaXMsIHRhc2tOYW1lLCB0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX293bmVyID09PSAnc2VsZicpIHsgR2FtZS5JbnN0YW5jZS5zbW9rZTEgPSBhbmk7IH1cclxuICAgICAgICBlbHNlIEdhbWUuSW5zdGFuY2Uuc21va2UyID0gYW5pO1xyXG4gICAgfVxyXG59IiwiY29uc3QgQm9tYkJ1bGxldEF0dHIgPSB7XHJcbiAgICB3aWR0aDogNDAsXHJcbiAgICBoZWlnaHQ6IDQwLFxyXG4gICAgaW1nV2lkdGg6IDM5LFxyXG4gICAgaW1nSGVpZ2h0OiAzOSxcclxuICAgIHZlbG9jaXR5OiAyMFxyXG59XHJcblxyXG4vKipcclxuICog5beo5Z6L54K45by5XHJcbiAqL1xyXG5jbGFzcyBCb21iQnVsbGV0IGV4dGVuZHMgQnVsbGV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gJ2JvbWInO1xyXG4gICAgICAgIHRoaXMucGl2b3QoQm9tYkJ1bGxldEF0dHIuaW1nV2lkdGggLyAyLCBCb21iQnVsbGV0QXR0ci5pbWdIZWlnaHQgLyAyKTtcclxuICAgICAgICB0aGlzLnNpemUoQm9tYkJ1bGxldEF0dHIud2lkdGgsIEJvbWJCdWxsZXRBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gQm9tYkJ1bGxldEF0dHIud2lkdGggLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KGFuZ2xlOiBudW1iZXIsIHBvd2VyOiBudW1iZXIsIG93bmVyOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgdiA9IFV0aWxzLmZsb2F0TihCb21iQnVsbGV0QXR0ci52ZWxvY2l0eSAtICgxIC0gcG93ZXIpICogMTIpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRJbWFnZShBc3NldHMuSW1nLmJ1bGxldF9ib21iKTtcclxuICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xyXG4gICAgICAgIHRoaXMuX3Z4ID0gVXRpbHMuZmxvYXROKCh2ICogTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkpO1xyXG4gICAgICAgIHRoaXMuX3Z5ID0gVXRpbHMuZmxvYXROKCgtMSAqIHYgKiBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkgLyAxODApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgLy8gIOeisOaSnuajgOa1i1xyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uKCk7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IFV0aWxzLmZsb2F0Tih0aGlzLnggKyB0aGlzLl92eCk7XHJcbiAgICAgICAgdGhpcy55ID0gVXRpbHMuZmxvYXROKHRoaXMueSArIHRoaXMuX3Z5KTtcclxuXHJcbiAgICAgICAgLy8g6LaK55WMXHJcbiAgICAgICAgdGhpcy5fbmV4dFggPSB0aGlzLnggKyB0aGlzLl92eDtcclxuICAgICAgICB0aGlzLl9uZXh0WSA9IHRoaXMueSArIHRoaXMuX3Z5O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbmV4dFggPCB0aGlzLndpZHRoIC8gMiB8fCB0aGlzLl9uZXh0WCA+IGNvbmZpZy5nYW1lV2lkdGggLSB0aGlzLndpZHRoIC8gMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSAodGhpcy5fbmV4dFggPCB0aGlzLndpZHRoIC8gMikgPyB0aGlzLndpZHRoIC8gMiA6IGNvbmZpZy5nYW1lV2lkdGggLSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5ib29tRWZmZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9vbSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMueSA8IC0xICogdGhpcy53aWR0aCAvIDIgfHwgdGhpcy55ID4gY29uZmlnLmdhbWVIZWlnaHQgKyB0aGlzLmhlaWdodCAvIDIpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb2xsaXNpb25CdWxsZXRzKG9iamVjdDE6IEJ1bGxldCwgb2JqZWN0MjogQnVsbGV0KSB7XHJcbiAgICAgICAgbGV0IGNvbnZlcnQgPSBnbG9iYWwuc3luID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuICAgICAgICAvLyDkuIvkuIDluKfnmoTkvY3nva5cclxuICAgICAgICBsZXQgbmV4dE9iamVjdDEgPSB7XHJcbiAgICAgICAgICAgIHg6IG9iamVjdDEueCArIG9iamVjdDEudngsXHJcbiAgICAgICAgICAgIHk6IG9iamVjdDEueSArIG9iamVjdDEudnksXHJcbiAgICAgICAgICAgIHJhZGl1czogb2JqZWN0MS5yYWRpdXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgbmV4dE9iamVjdDIgPSB7XHJcbiAgICAgICAgICAgIHg6IG9iamVjdDIueCArIG9iamVjdDIudngsXHJcbiAgICAgICAgICAgIHk6IG9iamVjdDIueSArIG9iamVjdDIudnksXHJcbiAgICAgICAgICAgIHJhZGl1czogb2JqZWN0Mi5yYWRpdXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoVXRpbHMuaXNDaXJjbGVDb2xsaXNpb24obmV4dE9iamVjdDEsIG5leHRPYmplY3QyKSkge1xyXG4gICAgICAgICAgICBbb2JqZWN0MS54LCBvYmplY3QxLnksIG9iamVjdDIueCwgb2JqZWN0Mi55XSA9IFV0aWxzLmZpeENvbGxpc2lvbihVdGlscy5wKG9iamVjdDEueCwgb2JqZWN0MS55KSwgVXRpbHMucChvYmplY3QyLngsIG9iamVjdDIueSksIG9iamVjdDEucmFkaXVzLCBvYmplY3QyLnJhZGl1cywgY29udmVydCk7XHJcbiAgICAgICAgICAgIFtvYmplY3QxLnZ4LCBvYmplY3QxLnZ5LCBvYmplY3QyLnZ4LCBvYmplY3QyLnZ5XSA9IFV0aWxzLmNvbXBCYWxsUmVib3VuZChVdGlscy5wKG9iamVjdDEueCwgb2JqZWN0MS55KSwgVXRpbHMucChvYmplY3QyLngsIG9iamVjdDIueSksIHsgdng6IG9iamVjdDEudngsIHZ5OiBvYmplY3QxLnZ5IH0sIHsgdng6IG9iamVjdDIudngsIHZ5OiBvYmplY3QyLnZ5IH0sIGNvbnZlcnQpO1xyXG4gICAgICAgICAgICB0aGlzLmJvb21FZmZlY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5ib29tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVCYWxsUGh5c2ljcyhiYWxsOiBCYWxsKSB7XHJcbiAgICAgICAgbGV0IGNvbnZlcnQgPSBnbG9iYWwuc3luID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuICAgICAgICBbdGhpcy54LCB0aGlzLnksIGJhbGwueCwgYmFsbC55XSA9IFV0aWxzLmZpeENvbGxpc2lvbihVdGlscy5wKHRoaXMueCwgdGhpcy55KSwgVXRpbHMucChiYWxsLngsIGJhbGwueSksIHRoaXMucmFkaXVzLCBiYWxsLnJhZGl1cywgY29udmVydCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+eQg+W/g+WIsOebtOe6v+eahOi3neemu1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IFV0aWxzLmRpc3RhbmNlVG9MaW5lKGJhbGwueCwgYmFsbC55LCB0aGlzLngsIHRoaXMueSwgdGhpcy52eCwgdGhpcy52eSk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+eQg+eahOaXi+i9rOaWueWQkVxyXG4gICAgICAgIGJhbGwuY29tcFJEaXJlY3Rpb24odGhpcy54LCB0aGlzLnksIHRoaXMudngsIHRoaXMudnkpO1xyXG5cclxuICAgICAgICBbdGhpcy52eCwgdGhpcy52eSwgYmFsbC52eCwgYmFsbC52eV0gPSBVdGlscy5jb21wQmFsbFJlYm91bmQoVXRpbHMucCh0aGlzLngsIHRoaXMueSksIFV0aWxzLnAoYmFsbC54LCBiYWxsLnkpLCB7IHZ4OiB0aGlzLnZ4LCB2eTogdGhpcy52eSB9LCB7IHZ4OiBiYWxsLnZ4LCB2eTogYmFsbC52eSB9LCBjb252ZXJ0KTtcclxuXHJcbiAgICAgICAgLy90aGlzLnNpbXVsYXRlV2VpZ2h0KGJhbGwpO1xyXG5cclxuICAgICAgICB0aGlzLmJvb21FZmZlY3QoKTtcclxuICAgICAgICB0aGlzLmJvb20oKTtcclxuICAgICAgICBpZiAodGhpcy5fb3duZXIgPT09ICdzZWxmJyAmJiBiYWxsLmlzTm9ybWFsU3RhdHVzKCkpIFNvY2tldC5JbnN0YW5jZS5jYXVzZUV4cGxvc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGJvb20oKSB7XHJcbiAgICAgICAgbGV0IGJhbGwgPSBHYW1lLkluc3RhbmNlLmJhbGw7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vbVBoeXNpY3MoYmFsbCk7XHJcblxyXG4gICAgICAgIGlmIChnbG9iYWwuc3luKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGJ1bGxldCBvZiBCdWxsZXQubXlCdWxsZXRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvb21QaHlzaWNzKGJ1bGxldCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGJ1bGxldCBvZiBCdWxsZXQueW91ckJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9vbVBoeXNpY3MoYnVsbGV0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYnVsbGV0IG9mIEJ1bGxldC55b3VyQnVsbGV0cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib29tUGh5c2ljcyhidWxsZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGJ1bGxldCBvZiBCdWxsZXQubXlCdWxsZXRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvb21QaHlzaWNzKGJ1bGxldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJvb21QaHlzaWNzKG9iamVjdCkge1xyXG4gICAgICAgIGxldCBjb252ZXJ0ID0gZ2xvYmFsLnN5biA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICBsZXQgdGhpc3ggPSB0aGlzLng7XHJcbiAgICAgICAgbGV0IHRoaXN5ID0gdGhpcy55O1xyXG4gICAgICAgIGxldCBvYmplY3R4ID0gb2JqZWN0Lng7XHJcbiAgICAgICAgbGV0IG9iamVjdHkgPSBvYmplY3QueTtcclxuICAgICAgICBpZiAoY29udmVydCkge1xyXG4gICAgICAgICAgICB0aGlzeCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gdGhpc3gpO1xyXG4gICAgICAgICAgICB0aGlzeSA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZUhlaWdodCAtIHRoaXN5KTtcclxuICAgICAgICAgICAgb2JqZWN0eCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gb2JqZWN0eCk7XHJcbiAgICAgICAgICAgIG9iamVjdHkgPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVIZWlnaHQgLSBvYmplY3R5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVXRpbHMuZmxvYXROKFV0aWxzLnBMZW5ndGgoVXRpbHMucChvYmplY3R4LCBvYmplY3R5KSwgVXRpbHMucCh0aGlzeCwgdGhpc3kpKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlIDw9IDE4MCAmJiBkaXN0YW5jZSA+IDApIHtcclxuICAgICAgICAgICAgbGV0IHJhdGUgPSAob2JqZWN0eCAtIHRoaXN4KSAvIChvYmplY3R5IC0gdGhpc3kpO1xyXG4gICAgICAgICAgICBsZXQgcG93ZXIgPSAoMTgwIC0gZGlzdGFuY2UpIC8gODAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb2JqZWN0LnZ4ID0gVXRpbHMuZmxvYXROKChvYmplY3R4IC0gdGhpc3gpICogcG93ZXIpO1xyXG4gICAgICAgICAgICBvYmplY3QudnkgPSBVdGlscy5mbG9hdE4oKG9iamVjdHkgLSB0aGlzeSkgKiBwb3dlcik7XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QudnggPSBVdGlscy5mbG9hdE4ob2JqZWN0LnZ4ICogLTEpO1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnZ5ID0gVXRpbHMuZmxvYXROKG9iamVjdC52eSAqIC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAgOWcuuWKqOS9nCAtIOeIhueCuOWKqOeUu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYm9vbUVmZmVjdCgpIHtcclxuICAgICAgICBsZXQgcG9zID0gVXRpbHMucCh0aGlzLngsIHRoaXMueSk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSAnYm9vbSc7XHJcbiAgICAgICAgbGV0IGFuaSA9IEFuaW1hdGlvbk1hbmFnZXIuZ2V0T3JDcmVhdGUobmFtZSwgMjkxLCAyOTEsIDE0NSwgMTQ1KTtcclxuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xyXG5cclxuICAgICAgICBhbmkucG9zKHBvcy54LCBwb3MueSk7XHJcblxyXG4gICAgICAgIGFuaS5vZmYoTGF5YUV2ZW50LkNPTVBMRVRFLCBhbmksICgpID0+IHsgfSk7XHJcbiAgICAgICAgYW5pLm9uKExheWFFdmVudC5DT01QTEVURSwgYW5pLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIFBvb2wucmVjb3ZlcihuYW1lLCBhbmkpO1xyXG4gICAgICAgICAgICBhbmkucmVtb3ZlU2VsZigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZChhbmkpO1xyXG5cclxuICAgICAgICBhbmkucGxheSgwLCBmYWxzZSwgbmFtZSk7XHJcblxyXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJvb21fMDAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9idWxsZXQvQnVsbGV0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYnVsbGV0L1N0YW5kYXJkQnVsbGV0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYnVsbGV0L0ljZUJ1bGxldC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2J1bGxldC9EaXZpc2lvbkJ1bGxldC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2J1bGxldC9TbW9rZUJ1bGxldC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2J1bGxldC9Cb21iQnVsbGV0LnRzXCIgLz5cclxuXHJcbi8qKlxyXG4gKiDop5LoibLlpKflsI9cclxuICovXHJcbmNvbnN0IENhbm5vbkF0dHIgPSB7XHJcbiAgICB3aWR0aDogNzEsIFxyXG4gICAgaGVpZ2h0OiAxMTEsXHJcbiAgICBpbWdXaWR0aDogNzEsXHJcbiAgICBpbWdIZWlnaHQ6IDExMVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOeCruWPsOexu1xyXG4gKi9cclxuY2xhc3MgQ2Fubm9uIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZXtcclxuICAgIHByaXZhdGUgb3Bwb25lbnQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zaGFkb3c6IFNwcml0ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBvcHBvbmVudCDmmK/lkKblr7nmiYvnmoTngq7lj7BcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iob3Bwb25lbnQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKG9wcG9uZW50PyBBc3NldHMuSW1nLmNhbm5vbl95IDogQXNzZXRzLkltZy5jYW5ub25fbSk7XHJcbiAgICAgICAgdGhpcy5waXZvdChDYW5ub25BdHRyLmltZ1dpZHRoLzIsIDc1KTtcclxuICAgICAgICB0aGlzLnBvcyhjb25maWcuZ2FtZVdpZHRoLzIsIGNvbmZpZy5nYW1lSGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnNpemUoQ2Fubm9uQXR0ci53aWR0aCwgQ2Fubm9uQXR0ci5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLkNhbm5vbjtcclxuICAgICAgICB0aGlzLm9wcG9uZW50ID0gb3Bwb25lbnQ7XHJcblxyXG4gICAgICAgIGlmKG9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zKGNvbmZpZy5nYW1lV2lkdGgvMiwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU2hhZG93KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QW5nbGUodGhpcy5yb3RhdGlvbiArIDE4MCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNoYWRvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlueCruWPsOinkuW6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QW5nbGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7ml4vovazop5LluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEFuZ2xlKGFuZ2xlOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgLy8g6ZmQ5Yi254Ku5Y+w6L2s5Yqo6KeS5bqmXHJcbiAgICAgICAgaWYoIXRoaXMub3Bwb25lbnQgJiYgKGFuZ2xlID4gODIgfHwgYW5nbGUgPCAtODIpKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlID0gYW5nbGUgPiAwPyA4MiA6IC04MjsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMub3Bwb25lbnQgJiYgKGFuZ2xlIDwgOTggfHwgYW5nbGUgPiAyNjIpKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlID0gYW5nbGUgPCA5OD8gOTggOiAyNjI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcclxuICAgICAgICB0aGlzLl9zaGFkb3cucm90YXRpb24gPSBhbmdsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPkeWwhOWtkOW8uVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvb3QoYW5nbGU6IG51bWJlciwgcG93ZXI6IG51bWJlciwgYnVsbGV0VHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IGJ1bGxldDtcclxuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xyXG5cclxuICAgICAgICBpZih0aGlzLm9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QW5nbGUoYW5nbGUgKyAxODApO1xyXG4gICAgICAgICAgICBidWxsZXQgPSBCdWxsZXQuZ2V0T3JDcmVhdGUoYW5nbGUgKyAxODAsIHBvd2VyLCBidWxsZXRUeXBlLCAnb3Bwb25lbnQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGJ1bGxldCA9IEJ1bGxldC5nZXRPckNyZWF0ZShhbmdsZSwgcG93ZXIsIGJ1bGxldFR5cGUsICdzZWxmJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihidWxsZXQpIHtcclxuICAgICAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQoYnVsbGV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBjb25zb2xlLmxvZygnQnVsbGV0IGlzIGxvY2suJylcclxuXHJcbiAgICAgICAgYnVsbGV0LnBvcyh0aGlzLngsIHRoaXMueSk7XHJcblxyXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLnNob290LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOmYtOW9seaViOaenFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFNoYWRvdygpIHtcclxuICAgICAgICB0aGlzLl9zaGFkb3cgPSBuZXcgU3ByaXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NoYWRvdy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5jYW5ub25fc2hhZG93KTtcclxuICAgICAgICB0aGlzLl9zaGFkb3cucGl2b3QoNDEsIDc1KTtcclxuICAgICAgICBpZih0aGlzLm9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvdy5wb3ModGhpcy54IC0gMjAsIHRoaXMueSAtIDEwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvdy5wb3ModGhpcy54IC0gMjAsIHRoaXMueSArIDEwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2hhZG93LnpPcmRlciA9IERpc3BsYXlPcmRlci5TaGFkb3c7XHJcblxyXG4gICAgICAgIE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2UuYWRkQ2hpbGQodGhpcy5fc2hhZG93KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZigpO1xyXG4gICAgICAgIHRoaXMuX3NoYWRvdy5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY29uc3QgUHJvY2Vzc0F0dHIgPSB7XHJcbiAgICB3aWR0aDogMjIsXHJcbiAgICBoZWlnaHQ6IDE4OCxcclxuICAgIGJ1bGxldENvc3Q6IDAuMlxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOWtkOW8ueWhq+WFhei/m+W6puadoeexu1xyXG4gKi9cclxuY2xhc3MgQnVsbGV0UHJvY2VzcyBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xyXG4gICAgcHJpdmF0ZSBwcm9jZXNzOiBTcHJpdGU7XHJcbiAgICBwcml2YXRlIHBtYXNrOiBTcHJpdGU7XHJcbiAgICAvLyDov5vluqbnjodcclxuICAgIHB1YmxpYyBwZXJjZW50OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8g6IOM5pmv5p2hXHJcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5wcm9jZXNzQmcpO1xyXG4gICAgICAgIHRoaXMuc2l6ZShQcm9jZXNzQXR0ci53aWR0aCwgUHJvY2Vzc0F0dHIuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnBpdm90KFByb2Nlc3NBdHRyLndpZHRoLCBQcm9jZXNzQXR0ci5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlByb2Nlc3NCYXI7XHJcbiAgICAgICAgdGhpcy5yZXBvcygpO1xyXG5cclxuICAgICAgICAvLyDov5vluqbmnaHlkozokpnniYjpga7nvalcclxuICAgICAgICB0aGlzLnBtYXNrID0gbmV3IFNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMucG1hc2subG9hZEltYWdlKEFzc2V0cy5JbWcucHJvY2Vzcyk7XHJcbiAgICAgICAgdGhpcy5wbWFzay5zaXplKFByb2Nlc3NBdHRyLndpZHRoLCBQcm9jZXNzQXR0ci5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMucG1hc2sucG9zKDAsIFByb2Nlc3NBdHRyLmhlaWdodC8yKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5wcm9jZXNzKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3Muc2l6ZShQcm9jZXNzQXR0ci53aWR0aCwgUHJvY2Vzc0F0dHIuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnByb2Nlc3MubWFzayA9IHRoaXMucG1hc2s7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gMC41O1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wcm9jZXNzKTtcclxuXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDluKfmm7TmlrBcclxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbWFzay55IDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5wbWFzay55ID0gMDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBtYXNrLnBvcygwLCB0aGlzLnBtYXNrLnkgLSAwLjUpO1xyXG4gICAgICAgIHRoaXMucGVyY2VudCA9IDEgLSAodGhpcy5wbWFzay55IC8gUHJvY2Vzc0F0dHIuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICDmtojogJfkuIDkuKrov5vluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvc3RPbmUobnVtPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYoIW51bSkgbnVtID0gMTtcclxuICAgICAgICBpZihudW0gPCAwLjUpIG51bSA9IDAuNTtcclxuICAgICAgICBpZih0aGlzLnBlcmNlbnQgPj0gKFByb2Nlc3NBdHRyLmJ1bGxldENvc3QgKiBudW0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGVyY2VudCAtPSAoUHJvY2Vzc0F0dHIuYnVsbGV0Q29zdCAqIG51bSk7XHJcbiAgICAgICAgICAgIHRoaXMucG1hc2sucG9zKDAsIFByb2Nlc3NBdHRyLmhlaWdodCAqICgxIC0gdGhpcy5wZXJjZW50KSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDph43mlrDlrprkvY1cclxuICAgIHB1YmxpYyByZXBvcygpIHtcclxuICAgICAgICBpZihMYXlhLnN0YWdlLndpZHRoID49IDEyODApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3MoZ2xvYmFsLnJpZ2h0RWRnZSArIDQwMCwgTGF5YS5zdGFnZS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHRoaXMucG9zKExheWEuc3RhZ2Uud2lkdGgsIExheWEuc3RhZ2UuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZigpO1xyXG4gICAgfVxyXG59IiwiXHJcbi8vIOiuoeaXtuWZqOWxnuaAp++8jHRpbWXvvJrlgJLorqHml7bpl7Qv5Y2V5L2Nc1xyXG5jb25zdCBUaW1lckF0dHIgPSB7XHJcbiAgICB3aWR0aDogMTAyLFxyXG4gICAgaGVpZ2h0OiA0MCxcclxuICAgIHRpbWU6IDE4MFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOa4uOaIj+iuoeaXtuWZqFxyXG4gKi9cclxuY2xhc3MgVGltZXIgZXh0ZW5kcyBsYXlhLmRpc3BsYXkuU3ByaXRlIHtcclxuICAgIHByaXZhdGUgX2ZyYW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdGltZTogTGF5YVRleHQ7XHJcbiAgICBwcml2YXRlIF90aW1lVmFsdWU6IG51bWJlciA9IFRpbWVyQXR0ci50aW1lO1xyXG4gICAgcHJpdmF0ZSBfdGltZVRhc2tMaXN0OiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcudGltZXJCZyk7XHJcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuVGltZXI7XHJcbiAgICAgICAgdGhpcy5zaXplKFRpbWVyQXR0ci53aWR0aCwgVGltZXJBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5waXZvdCh0aGlzLndpZHRoLCAwKTtcclxuICAgICAgICB0aGlzLnJlcG9zKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3RpbWUgPSBuZXcgTGF5YVRleHQoKTtcclxuICAgICAgICB0aGlzLl90aW1lLmZvbnQgPSAnQXJpYWwnO1xyXG4gICAgICAgIHRoaXMuX3RpbWUuZm9udFNpemUgPSAzMztcclxuICAgICAgICB0aGlzLl90aW1lLmNvbG9yID0gJyMwMDAwMDAnO1xyXG4gICAgICAgIHRoaXMuX3RpbWUuYWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICB0aGlzLl90aW1lLnZhbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuX3RpbWUuc2l6ZSgxMTAsIDM4KTtcclxuICAgICAgICB0aGlzLl90aW1lLnBpdm90KHRoaXMuX3RpbWUud2lkdGgvMiwgdGhpcy5fdGltZS5oZWlnaHQvMik7XHJcbiAgICAgICAgdGhpcy5fdGltZS5wb3ModGhpcy53aWR0aC8yICsgMiwgdGhpcy5oZWlnaHQvMiAtIDIpO1xyXG4gICAgICAgIHRoaXMuX3RpbWUudGV4dCA9IHRoaXMuY29udmVydFRvU3RyaW5nKHRoaXMuX3RpbWVWYWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdGltZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGltZVZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLl9mcmFtZSsrO1xyXG4gICAgICAgIGlmKHRoaXMuX2ZyYW1lID49IDYwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVWYWx1ZS0tO1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lLnRleHQgPSB0aGlzLmNvbnZlcnRUb1N0cmluZyh0aGlzLl90aW1lVmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9mcmFtZSA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLl90aW1lVmFsdWUgPT09IDMwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lLmNvbG9yID0gJyNGNDE0MTQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLl90aW1lVmFsdWUgPD0gMCAmJiBHYW1lLkluc3RhbmNlLnN0YXR1cyAhPSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5ri45oiP57uT5p2fXHJcbiAgICAgICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWumuaXtuS7u+WKoVxyXG4gICAgICAgIGZvcihsZXQgdGFzayBvZiB0aGlzLl90aW1lVGFza0xpc3QpIHtcclxuICAgICAgICAgICAgdGFzay5mcmFtZSsrO1xyXG4gICAgICAgICAgICBpZih0YXNrLmZyYW1lID49IHRhc2suZ29hbEZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0YXNrLmdvYWxGdW5jLmFwcGx5KHRhc2suY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lVGFza0xpc3Quc3BsaWNlKHRoaXMuX3RpbWVUYXNrTGlzdC5pbmRleE9mKHRhc2spLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNUaW1lb3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lVmFsdWUgPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHjeaWsOWumuS9jVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVwb3MoKSB7XHJcbiAgICAgICAgaWYoTGF5YS5zdGFnZS53aWR0aCA+PSAxMjgwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zKGdsb2JhbC5yaWdodEVkZ2UgKyA0MDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHRoaXMucG9zKExheWEuc3RhZ2Uud2lkdGgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L2s5YyW56eS5Li65oyH5a6a5qC85byP5a2X56ym5LiyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9TdHJpbmcodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IG1pbnV0ZSwgc2Vjb25kLCByZXMgPSAnJztcclxuXHJcbiAgICAgICAgaWYodGltZSA8IDApIHJldHVybiAnMDA6MDAnO1xyXG4gICAgICAgIG1pbnV0ZSA9IE1hdGguZmxvb3IodGltZSAvIDYwKTtcclxuICAgICAgICBzZWNvbmQgPSB0aW1lICUgNjA7XHJcblxyXG4gICAgICAgIGlmKG1pbnV0ZSA8IDEwKSByZXMgPSByZXMgKyAnMCcgKyBtaW51dGUudG9TdHJpbmcoKTtcclxuICAgICAgICBlbHNlIHJlcyA9IHJlcyArIG1pbnV0ZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICByZXMgKz0gJzonO1xyXG5cclxuICAgICAgICBpZihzZWNvbmQgPCAxMCkgcmVzID0gcmVzICsgJzAnICsgc2Vjb25kLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgZWxzZSByZXMgPSByZXMgKz0gc2Vjb25kLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFRpbWVvdXQoZnVuYywgdGltZUZyYW1lOiBudW1iZXIsIGNvbnRleHQsIHRhc2tOYW1lPzogc3RyaW5nLCBjbGVhcj86IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl90aW1lVGFza0xpc3QucHVzaCh7ZnJhbWU6IDAsIGdvYWxGcmFtZTogdGltZUZyYW1lLCBnb2FsRnVuYzogZnVuYywgY29udGV4dDogY29udGV4dCwgdGFza05hbWU6IHRhc2tOYW1lIHx8ICcnLCBjbGVhcjogY2xlYXIgfHwgZmFsc2V9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcnVuVGFza0J5TmFtZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IobGV0IHRhc2sgb2YgdGhpcy5fdGltZVRhc2tMaXN0KSB7XHJcbiAgICAgICAgICAgIGlmKHRhc2sudGFza05hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRhc2suZ29hbEZ1bmMuYXBwbHkodGFzay5jb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVUYXNrTGlzdC5zcGxpY2UodGhpcy5fdGltZVRhc2tMaXN0LmluZGV4T2YodGFzayksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhclRhc2tMaXN0KCkge1xyXG4gICAgICAgIGZvcihsZXQgdGFzayBvZiB0aGlzLl90aW1lVGFza0xpc3QpIHtcclxuICAgICAgICAgICAgaWYodGFzay5jbGVhcikgdGFzay5nb2FsRnVuYy5hcHBseSh0YXNrLmNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90aW1lVGFza0xpc3QgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXJUYXNrQnlOYW1lKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGZvcihsZXQgdGFzayBvZiB0aGlzLl90aW1lVGFza0xpc3QpIHtcclxuICAgICAgICAgICAgaWYodGFzay50YXNrTmFtZSA9PT0gbmFtZSkgdGhpcy5fdGltZVRhc2tMaXN0LnNwbGljZSh0aGlzLl90aW1lVGFza0xpc3QuaW5kZXhPZih0YXNrKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76ZmkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog6Jma57q/57G7XHJcbiAqL1xyXG5jbGFzcyBEYXNoTGluZSBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQXNzaXN0TGluZTtcclxuICAgICAgICB0aGlzLnBvcyh4LCB5KTsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLvnnoTlh4bovoXliqnnur9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGRyYXdBc3Npc3RMaW5lKGdvYWxQb2ludDogUG9pbnQpIHtcclxuICAgICAgICBsZXQgcCA9IHt4OjAseTowfSwgYXJyID0gW10sIGxlbmd0aCwgZG90TGVuZ3RoID0gMjAsIGRvdE51bSwgeGFkZCwgeWFkZDtcclxuXHJcbiAgICAgICAgcC54ID0gZ29hbFBvaW50LnggLSB0aGlzLng7XHJcbiAgICAgICAgcC55ID0gZ29hbFBvaW50LnkgLSB0aGlzLnk7XHJcblxyXG4gICAgICAgIGxlbmd0aCA9IFV0aWxzLnBMZW5ndGgoZ29hbFBvaW50LCBVdGlscy5wKHRoaXMueCwgdGhpcy55KSk7XHJcbiAgICAgICAgZG90TnVtID0gTWF0aC5jZWlsKGxlbmd0aCAvIGRvdExlbmd0aCk7XHJcblxyXG4gICAgICAgIHhhZGQgPSBkb3RMZW5ndGgqKHAueCkvbGVuZ3RoO1xyXG4gICAgICAgIHlhZGQgPSBkb3RMZW5ndGgqKHAueSkvbGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyTGluZXMoKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGRvdE51bTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKGkgJSAyICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZSA9IG5ldyBTcHJpdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgICAgICAgICBsaW5lLmdyYXBoaWNzLmRyYXdMaW5lKChpLTEpICogeGFkZCwgKGktMSkgKiB5YWRkLCBpICogeGFkZCwgaSAqIHlhZGQsICcjZmZmZmZmJywgMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTovoXliqnnur9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyTGluZXMoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog6YGT5YW35qCH562+XHJcbiAqL1xyXG5jbGFzcyBUb29sVGFnIGV4dGVuZHMgbGF5YS5kaXNwbGF5LlNwcml0ZSB7XHJcbiAgICAvLyDpgZPlhbfmoIfnrb7lkI1cclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmc7XHJcbiAgICAvLyDpgZPlhbfmoIfnrb7kuK3mloflkI1cclxuICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuICAgIC8vIOaYr+WQpuiiq+mAieaLqVxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAvLyDpgZPlhbfmoIfnrb7mloflrZdcclxuICAgIHByaXZhdGUgX3RleHQ6IExheWFUZXh0O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9uYW1lID0gVG9vbFtpZF0ubmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoQXNzZXRzLkltZ1sndG9vbHRhZ18nICsgVG9vbFtpZF0udGFnXSk7XHJcbiAgICAgICAgdGhpcy5zaXplKDcyLCAzNCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3RleHQgPSBuZXcgTGF5YVRleHQoKTtcclxuICAgICAgICB0aGlzLl90ZXh0LnRleHQgPSB0aGlzLl9uYW1lO1xyXG4gICAgICAgIHRoaXMuX3RleHQuYWxpZ24gPSAncmlnaHQnO1xyXG4gICAgICAgIHRoaXMuX3RleHQudmFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5fdGV4dC5zaXplKDY4LCAzNCk7XHJcbiAgICAgICAgdGhpcy5fdGV4dC5mb250ID0gJ+W5vOWchic7XHJcbiAgICAgICAgdGhpcy5fdGV4dC5mb250U2l6ZSA9IDIwO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3mmK/lkKbooqvpgInmi6lcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzU2VsZWN0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgInmi6nmoIfnrb5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdCgpIHtcclxuICAgICAgICBpZih0aGlzLl9zZWxlY3QpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZWxlY3QgPSB0cnVlO1xyXG4gICAgICAgIFR3ZWVuLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIFR3ZWVuLnRvKHRoaXMsIHt4OiAtOH0sIDIwMCwgRWFzZS5iYWNrSW5PdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Y+Y5Li66Z2e6YCJ5oupXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bnNlbGVjdCgpIHtcclxuICAgICAgICBpZighdGhpcy5fc2VsZWN0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgVHdlZW4uY2xlYXJBbGwodGhpcyk7XHJcbiAgICAgICAgVHdlZW4udG8odGhpcywge3g6IC01Mn0sIDIwMCwgRWFzZS5iYWNrSW5PdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5L2/55So5qCH562+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1c2VUYWcobmV4dFRhZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuYWxwaGEgPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlVGFnKG5leHRUYWcpO1xyXG4gICAgICAgIHRoaXMueCA9IC03MjtcclxuICAgICAgICB0aGlzLmFscGhhID0gMTtcclxuICAgICAgICBUd2Vlbi50byh0aGlzLCB7eDogLTUyfSwgMzAwLCBFYXNlLmJhY2tJbk91dCk7XHJcbiAgICAgICAgLy8gVHdlZW4udG8odGhpcywge2FscGhhOiAwfSwgMzAwLCBudWxsLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuY2hhbmdlVGFnKG5leHRUYWcpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLnggPSAtNzI7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuYWxwaGEgPSAxO1xyXG4gICAgICAgIC8vICAgICBUd2Vlbi50byh0aGlzLCB7eDogLTUyfSwgMzAwLCBFYXNlLmJhY2tJbk91dCk7XHJcbiAgICAgICAgLy8gfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pS55Y+Y5qCH562+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjaGFuZ2VUYWcoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IFRvb2xbaWRdLm5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWdbJ3Rvb2x0YWdfJyArIFRvb2xbaWRdLnRhZ10pO1xyXG4gICAgICAgIHRoaXMuX3RleHQudGV4dCA9IHRoaXMuX25hbWU7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Ub29sVGFnLnRzXCIgLz5cclxuXHJcbi8qKlxyXG4gKiDpgZPlhbfmoIfnrb7lrrnlmahcclxuICovXHJcbmNsYXNzIFRvb2xUYWdDb250YWluZXIgZXh0ZW5kcyBsYXlhLmRpc3BsYXkuU3ByaXRlIHtcclxuICAgIC8vIOaYvuekuueahOmBk+WFt+agh+etvuaVsOe7hFxyXG4gICAgcHJpdmF0ZSBfdGFnTGlzdDogQXJyYXk8VG9vbFRhZz4gPSBbXTtcclxuICAgIC8vIOaJgOaciemBk+WFt+agh+etvuWQjVxyXG4gICAgcHJpdmF0ZSBfdGFnSWRzOiBBcnJheTxzdHJpbmc+ID0gWydJY2VCdWxsZXQnLCAnRGl2aXNpb25CdWxsZXQnLCAnU21va2VCdWxsZXQnLCAnQm9tYkJ1bGxldCddO1xyXG4gICAgLy8g4oCY5LiL5LiA5Liq6YGT5YW35qCH562+5ZCN4oCZ6Zif5YiXXHJcbiAgICBwcml2YXRlIF9uZXh0VGFnSWRzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAvLyDpgInkuK3nmoTpgZPlhbfmoIfnrb5pZFxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIF9sb2NrOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGdldCB0YWdMaXN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90YWdMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGxldCB0YWcwID0gbmV3IFRvb2xUYWcoJ1N0YW5kYXJkQnVsbGV0Jyk7XHJcbiAgICAgICAgbGV0IHRhZzEgPSBuZXcgVG9vbFRhZygnSWNlQnVsbGV0Jyk7XHJcbiAgICAgICAgbGV0IHRhZzIgPSBuZXcgVG9vbFRhZygnRGl2aXNpb25CdWxsZXQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdGFnTGlzdC5wdXNoKHRhZzApO1xyXG4gICAgICAgIHRoaXMuX3RhZ0xpc3QucHVzaCh0YWcxKTtcclxuICAgICAgICB0aGlzLl90YWdMaXN0LnB1c2godGFnMik7XHJcblxyXG4gICAgICAgIHRhZzAucG9zKC01MiwgMCk7XHJcbiAgICAgICAgdGFnMS5wb3MoLTUyLCA0Nyk7XHJcbiAgICAgICAgdGFnMi5wb3MoLTUyLCA5NCk7XHJcblxyXG4gICAgICAgIC8vIOm7mOiupOmAieS4reesrOS4gOS4qumBk+WFt+agh+etvlxyXG4gICAgICAgIHRhZzAuc2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSAwO1xyXG5cclxuICAgICAgICAvLyDliJ3lp4vljJbigJjkuIvkuIDkuKrpgZPlhbfmoIfnrb7igJnpmJ/liJdcclxuICAgICAgICB0aGlzLl9uZXh0VGFnSWRzID0gdGhpcy5nZXRIaWRkZW5UYWdJZHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuVG9vbENvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnJlcG9zKCk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZHJlbih0YWcwLCB0YWcxLCB0YWcyKTtcclxuICAgICAgICBcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0xvY2soKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2s7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5fbG9jayA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVubG9jaygpIHtcclxuICAgICAgICB0aGlzLl9sb2NrID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzU2VsZWN0Rmlyc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdEluZGV4ID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5b2T5YmN6YCJ5oup6YGT5YW3aWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNlbGVjdGVkVG9vbElkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90YWdMaXN0W3RoaXMuX3NlbGVjdEluZGV4XS5pZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluacquaYvuekuueahOmBk+WFt+agh+etvmlkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRIaWRkZW5UYWdJZHMoKSB7XHJcbiAgICAgICAgbGV0IHRhZ3MgPSB0aGlzLl90YWdJZHMuc2xpY2UoMCwgdGhpcy5fdGFnSWRzLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCB0IG9mIHRoaXMuX3RhZ0xpc3QpIHtcclxuICAgICAgICAgICAgaWYodGFncy5pbmRleE9mKHQuaWQpID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRhZ3Muc3BsaWNlKHRhZ3MuaW5kZXhPZih0LmlkKSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkvb/nlKjpgInmi6nnmoTpgZPlhbfmoIfnrb5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHVzZVNlbGVjdFRhZygpIHtcclxuICAgICAgICB0aGlzLnVubG9jaygpO1xyXG5cclxuICAgICAgICAvLyDnrKzkuIDkuKrpgZPlhbfmmK/mma7pgJrlrZDlvLnvvIzkuI3pnIDopoHlj5jljJZcclxuICAgICAgICBpZih0aGlzLl9zZWxlY3RJbmRleCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgdGFnID0gdGhpcy5fdGFnTGlzdFt0aGlzLl9zZWxlY3RJbmRleF07XHJcbiAgICAgICAgbGV0IG5leHRUYWc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbmV4dFRhZ0lkcy5wdXNoKHRhZy5pZCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbdGhpcy5fc2VsZWN0SW5kZXhdLnNlbGVjdCgpO1xyXG5cclxuICAgICAgICBuZXh0VGFnID0gdGhpcy5fbmV4dFRhZ0lkcy5zaGlmdCgpO1xyXG5cclxuICAgICAgICB0YWcudXNlVGFnKG5leHRUYWcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCJ5oup5oyH5a6a6YGT5YW35qCH562+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3RUYWcobnVtOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLl9zZWxlY3RJbmRleCA9PT0gbnVtKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbdGhpcy5fc2VsZWN0SW5kZXhdLnVuc2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fdGFnTGlzdFtudW1dLnNlbGVjdCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdEluZGV4ID0gbnVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCJ5oup5LiL5LiA5Liq6YGT5YW35qCH562+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3ROZXh0KCkge1xyXG4gICAgICAgIGxldCBpbmRleDpudW1iZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYobmF2aWdhdG9yLnZpYnJhdGUpIHtcclxuICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUoMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbdGhpcy5fc2VsZWN0SW5kZXhdLnVuc2VsZWN0KCk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gdGhpcy5fc2VsZWN0SW5kZXggKyAxO1xyXG4gICAgICAgIGlmKGluZGV4ID09PSB0aGlzLl90YWdMaXN0Lmxlbmd0aCkgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICB0aGlzLl90YWdMaXN0W2luZGV4XS5zZWxlY3QoKTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RQcmV2aW91cygpIHtcclxuICAgICAgICBsZXQgaW5kZXg6bnVtYmVyO1xyXG5cclxuICAgICAgICBpZihuYXZpZ2F0b3IudmlicmF0ZSkge1xyXG4gICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZSgxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGFnTGlzdFt0aGlzLl9zZWxlY3RJbmRleF0udW5zZWxlY3QoKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSB0aGlzLl9zZWxlY3RJbmRleCAtIDE7XHJcbiAgICAgICAgaWYoaW5kZXggPCAwKSBpbmRleCA9IHRoaXMuX3RhZ0xpc3QubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5fdGFnTGlzdFtpbmRleF0uc2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAieaLqeaMh+WumuW6j+WPt+eahOmBk+WFt+agh+etvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IobGV0IHQgb2YgdGhpcy5fdGFnTGlzdCkge1xyXG4gICAgICAgICAgICB0LnVuc2VsZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3RhZ0xpc3RbaW5kZXhdLnNlbGVjdCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdEluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcG9zKCkge1xyXG4gICAgICAgIGlmKExheWEuc3RhZ2Uud2lkdGggPj0gMTI4MCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvcyhnbG9iYWwubGVmdEVkZ2UgLSAzNDgsIDMzNik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBvcygwLCAzMzYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDliIfmjaLpgZPlhbfmjInpkq5cclxuICovXHJcbmNsYXNzIEJ0blN3aXRjaCBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xyXG4gICAgcHJpdmF0ZSBfY2VudGVyQnRuOiBTcHJpdGU7XHJcbiAgICAvLyDlip/og73plIEgdHJ1ZeaXtuS4jeiDveaOp+WItumBk+WFt+agh+etvueahOWIh+aNolxyXG4gICAgcHJpdmF0ZSBfZnVuY0xvY2s6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRJbWFnZShBc3NldHMuSW1nLmJ0bl9zd2l0Y2hfYmcpO1xyXG4gICAgICAgIHRoaXMucmVwb3MoKTtcclxuICAgICAgICB0aGlzLnNpemUoODAsIDIxMCk7XHJcbiAgICAgICAgdGhpcy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQnRuU3dpdGNoO1xyXG5cclxuICAgICAgICB0aGlzLl9jZW50ZXJCdG4gPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyQnRuLmxvYWRJbWFnZShBc3NldHMuSW1nLmJ0bl9zd2l0Y2hfY2VudGVyKTtcclxuICAgICAgICB0aGlzLl9jZW50ZXJCdG4uc2l6ZSg1MCwgNTApO1xyXG4gICAgICAgIHRoaXMuX2NlbnRlckJ0bi5waXZvdCgyNSwgMjUpO1xyXG4gICAgICAgIHRoaXMuX2NlbnRlckJ0bi5wb3MoNDAsIHRoaXMuaGVpZ2h0LzIpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKExheWFFdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLm9uTW91c2VEb3duKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9jZW50ZXJCdG4pO1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Nb3VzZURvd24oZTogTGF5YUV2ZW50KSB7XHJcbiAgICAgICAgVHdlZW4uY2xlYXJBbGwodGhpcy5fY2VudGVyQnRuKTtcclxuXHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhRXZlbnQuTU9VU0VfVVAsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWFFdmVudC5NT1VTRV9PVVQsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTW91c2VVcChlPzogTGF5YUV2ZW50KSB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YUV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHRoaXMub25Nb3VzZU1vdmUpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWFFdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWFFdmVudC5NT1VTRV9PVVQsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZnVuY0xvY2sgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgVHdlZW4udG8odGhpcy5fY2VudGVyQnRuLCB7eDogNDAsIHk6IHRoaXMuaGVpZ2h0LzJ9LCA1MDAsIEVhc2UuY2lyY091dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbk1vdXNlTW92ZShlOiBMYXlhRXZlbnQpIHtcclxuICAgICAgICBsZXQgbW91c2UsIGxlbmd0aCwgYnBvcywgY3BvcywgbGltaXRMZW5ndGg7XHJcblxyXG4gICAgICAgIG1vdXNlID0gVXRpbHMucChMYXlhLnN0YWdlLm1vdXNlWCwgTGF5YS5zdGFnZS5tb3VzZVkpO1xyXG4gICAgICAgIGNwb3MgPSBVdGlscy5wKHRoaXMud2lkdGgvMiwgdGhpcy5oZWlnaHQvMik7XHJcbiAgICAgICAgYnBvcyA9IFV0aWxzLnAobW91c2UueCAtIHRoaXMueCwgbW91c2UueSAtIHRoaXMueSk7XHJcbiAgICAgICAgbGVuZ3RoID0gVXRpbHMucExlbmd0aChicG9zLCBjcG9zKTtcclxuICAgICAgICBsaW1pdExlbmd0aCA9IHRoaXMuaGVpZ2h0LzIgLSB0aGlzLl9jZW50ZXJCdG4uaGVpZ2h0LzI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYobGVuZ3RoID49IGxpbWl0TGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIGxldCBwID0gVXRpbHMuY3Jvc3NpbmdQb2ludExDKGJwb3MsIGNwb3MsIGxpbWl0TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaOp+WItumBk+WFt+agh+etvueahOWIh+aNolxyXG4gICAgICAgICAgICBpZih0aGlzLl9mdW5jTG9jayA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmKGJwb3MueSA+IGNwb3MueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lci5zZWxlY3ROZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgU291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuYnV0dG9uXzAwMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGJwb3MueSA8IGNwb3MueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lci5zZWxlY3RQcmV2aW91cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJ1dHRvbl8wMDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnVuY0xvY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihicG9zLnkgPiBjcG9zLnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NlbnRlckJ0bi55ID0gdGhpcy5oZWlnaHQgLSB0aGlzLl9jZW50ZXJCdG4uaGVpZ2h0LzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jZW50ZXJCdG4ueSA9IHRoaXMuX2NlbnRlckJ0bi5oZWlnaHQvMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2VudGVyQnRuLnkgPSBicG9zLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJlTW91c2VVcCgpIHtcclxuICAgICAgICB0aGlzLm9uTW91c2VVcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXBvcygpIHtcclxuICAgICAgICBpZihMYXlhLnN0YWdlLndpZHRoID49IDEyODApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3MoZ2xvYmFsLmxlZnRFZGdlIC0gNDAwLCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wb3MoMCwgNTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDmuLjmiI/liIbmlbDmnb9cclxuICovXHJcbmNsYXNzIFNjb3JlUGFuZWwgZXh0ZW5kcyBsYXlhLmRpc3BsYXkuU3ByaXRle1xyXG4gICAgcHJpdmF0ZSB1c2VyTmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSB0eXBlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9uYW1lOiBMYXlhVGV4dDtcclxuICAgIHByaXZhdGUgX2JhbGxzOiBMYXlhVGV4dDtcclxuICAgIHByaXZhdGUgX3Njb3JlOiBMYXlhVGV4dDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRJbWFnZShBc3NldHMuSW1nLnNjb3JlQmcpO1xyXG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlNjb3JlUGFuZWw7XHJcbiAgICAgICAgaWYodHlwZSA9PT0gJ21pbmUnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSBTb2NrZXQuSW5zdGFuY2UubU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ3lvdXInKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSBTb2NrZXQuSW5zdGFuY2UueU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVwb3MoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0SW5mbygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWIneWni+WMluS/oeaBr1xyXG4gICAgcHJpdmF0ZSBpbml0SW5mbygpIHtcclxuICAgICAgICBsZXQgc2NvcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5ldyBMYXlhVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuX3Njb3JlID0gbmV3IExheWFUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5fYmFsbHMgPSBuZXcgTGF5YVRleHQoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy50eXBlID09PSAnbWluZScpIHtcclxuICAgICAgICAgICAgc2NvcmUgPSBTY29yZU1hbmFnZXIuSW5zdGFuY2UubXNjb3JlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMudHlwZSA9PT0gJ3lvdXInKSB7XHJcbiAgICAgICAgICAgIHNjb3JlID0gU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnlzY29yZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX25hbWUuZm9udFNpemUgPSAyMDtcclxuICAgICAgICB0aGlzLl9uYW1lLnBvcyg2LDIpO1xyXG4gICAgICAgIHRoaXMuX25hbWUudGV4dCA9IHRoaXMudXNlck5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMuX3Njb3JlLmZvbnRTaXplID0gMTY7XHJcbiAgICAgICAgdGhpcy5fc2NvcmUucG9zKDUsIDI4KTtcclxuICAgICAgICB0aGlzLl9zY29yZS50ZXh0ID0gJ+W+l+WIhjonICsgc2NvcmUuc2NvcmUudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYmFsbHMuZm9udFNpemUgPSAxNjtcclxuICAgICAgICB0aGlzLl9iYWxscy5wb3MoODQsIDI4KTtcclxuICAgICAgICB0aGlzLl9iYWxscy5zaXplKDE4LCAxOCk7XHJcbiAgICAgICAgdGhpcy5fYmFsbHMuYWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICB0aGlzLl9iYWxscy50ZXh0ID0gc2NvcmUuYmFsbHMudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9uYW1lKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Njb3JlKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2JhbGxzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmm7TmlrDliIbmlbDlgLxcclxuICAgIHB1YmxpYyB1cGRhdGVTY29yZShzY29yZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2NvcmUudGV4dCA9ICflvpfliIY6JyArIHNjb3JlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5pu05paw6L+b55CD5pWwXHJcbiAgICBwdWJsaWMgdXBkYXRlQmFsbHMoYmFsbHM6IG51bWJlcikge1xyXG4gICAgICAgIGlmKHRoaXMuX2JhbGxzLnRleHQgIT09IGJhbGxzLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgVHdlZW4uZnJvbSh0aGlzLl9iYWxscywge3k6IDEwLCBhbHBoYTogMH0sIDMwMCwgRWFzZS5iYWNrSW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9iYWxscy50ZXh0ID0gYmFsbHMudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDph43lrprkvY1cclxuICAgIHB1YmxpYyByZXBvcygpIHtcclxuICAgICAgICBpZihMYXlhLnN0YWdlLndpZHRoID49IDEyODApIHtcclxuICAgICAgICAgICAgaWYodGhpcy50eXBlID09PSAnbWluZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zKGdsb2JhbC5sZWZ0RWRnZSAtIDQwMCwgTGF5YS5zdGFnZS5oZWlnaHQgLSA0Nyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnR5cGUgPT09ICd5b3VyJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3MoZ2xvYmFsLmxlZnRFZGdlIC0gNDAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy50eXBlID09PSAnbWluZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zKDAsIExheWEuc3RhZ2UuaGVpZ2h0IC0gNDcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy50eXBlID09PSAneW91cicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zKDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlicy9sYXlhQWlyLmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IFZpZXc9bGF5YS51aS5WaWV3O1xyXG5pbXBvcnQgRGlhbG9nPWxheWEudWkuRGlhbG9nOyAgICAgICAgICAgICAgICAgIFxyXG5tb2R1bGUgdWkge1xyXG4gICAgZXhwb3J0IGNsYXNzIHN0YXJ0VUkgZXh0ZW5kcyBWaWV3IHtcclxuXHJcbiAgICAgICAgcHVibGljIGJ0bk1hdGNoOmxheWEudWkuQnV0dG9uO1xyXG5cdFx0cHVibGljIGJ0bkpvaW5Sb29tOmxheWEudWkuQnV0dG9uO1xyXG5cdFx0cHVibGljIGJ0bkNyZWF0ZVJvb206bGF5YS51aS5CdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlZpZXdcIixcImNoaWxkXCI6W3tcInByb3BzXCI6e1wieFwiOjEzMixcInlcIjozOTYsXCJza2luXCI6XCJzdGFydC9idG5iZy5wbmdcIixcImxhYmVsXCI6XCLpmo/mnLrljLnphY1cIixcIndpZHRoXCI6MjE2LFwiaGVpZ2h0XCI6ODYsXCJzaXplR3JpZFwiOlwiMCwwLDAsMFwiLFwibGFiZWxTaXplXCI6MzcsXCJsYWJlbEJvbGRcIjpmYWxzZSxcInZhclwiOlwiYnRuTWF0Y2hcIixcImxhYmVsRm9udFwiOlwi562J57q/XCIsXCJsYWJlbENvbG9yc1wiOlwiIzAwMCwjMDAwLCMwMDAsIzAwMFwiLFwic3RhdGVOdW1cIjpcIjNcIixcImRpc2FibGVkXCI6ZmFsc2UsXCJtb3VzZVRocm91Z2hcIjpmYWxzZX0sXCJ0eXBlXCI6XCJCdXR0b25cIn0se1wicHJvcHNcIjp7XCJ4XCI6MTMyLFwieVwiOjUwMyxcInNraW5cIjpcInN0YXJ0L2J0bmJnLnBuZ1wiLFwibGFiZWxcIjpcIuWIm+W7uuaIv+mXtFwiLFwid2lkdGhcIjoyMTYsXCJoZWlnaHRcIjo4NixcInNpemVHcmlkXCI6XCIyLDQsLTIsMVwiLFwibGFiZWxTaXplXCI6MzcsXCJsYWJlbEJvbGRcIjpmYWxzZSxcInZhclwiOlwiYnRuQ3JlYXRlUm9vbVwiLFwibGFiZWxGb250XCI6XCLnrYnnur9cIixcInRvZ2dsZVwiOmZhbHNlLFwibGFiZWxDb2xvcnNcIjpcIiMwMDAsIzAwMCwjMDAwLCMwMDBcIixcInN0YXRlTnVtXCI6XCIzXCJ9LFwidHlwZVwiOlwiQnV0dG9uXCJ9LHtcInByb3BzXCI6e1wieFwiOjEzMixcInlcIjo2MDksXCJza2luXCI6XCJzdGFydC9idG5iZy5wbmdcIixcImxhYmVsXCI6XCLliqDlhaXmiL/pl7RcIixcIndpZHRoXCI6MjE2LFwiaGVpZ2h0XCI6ODYsXCJzaXplR3JpZFwiOlwiMiw0LC0yLDFcIixcImxhYmVsU2l6ZVwiOjM3LFwibGFiZWxCb2xkXCI6ZmFsc2UsXCJ2YXJcIjpcImJ0bkpvaW5Sb29tXCIsXCJsYWJlbEZvbnRcIjpcIuetiee6v1wiLFwidG9nZ2xlXCI6ZmFsc2UsXCJsYWJlbENvbG9yc1wiOlwiIzAwMCwjMDAwLCMwMDAsIzAwMFwiLFwic3RhdGVOdW1cIjpcIjNcIn0sXCJ0eXBlXCI6XCJCdXR0b25cIn0se1wicHJvcHNcIjp7XCJ4XCI6OCxcInlcIjoxNjAsXCJza2luXCI6XCJzdGFydC9sb2dvLnBuZ1wiLFwid2lkdGhcIjo0NjIsXCJoZWlnaHRcIjoxMDB9LFwidHlwZVwiOlwiSW1hZ2VcIn1dLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjQ4MCxcImhlaWdodFwiOjgwMCxcImxhYmVsQ29sb3JzXCI6XCIoIzMzMywjNTY3MzU2LCMzMzMjNTY3MzU2KVwifX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcodWkuc3RhcnRVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVzdWx0UGFnZVVJIGV4dGVuZHMgVmlldyB7XHJcbiAgICAgICAgcHVibGljIHdvcmQ6TGF5YS5JbWFnZTtcclxuXHRcdHB1YmxpYyBteU5hbWVUZXh0OkxheWEuTGFiZWw7XHJcblx0XHRwdWJsaWMgeW91ck5hbWVUZXh0OkxheWEuTGFiZWw7XHJcblx0XHRwdWJsaWMgbXlCYWxsczpMYXlhLkxhYmVsO1xyXG5cdFx0cHVibGljIHlvdXJCYWxsczpMYXlhLkxhYmVsO1xyXG5cdFx0cHVibGljIG15U2NvcmU6TGF5YS5MYWJlbDtcclxuXHRcdHB1YmxpYyB5b3VyU2NvcmU6TGF5YS5MYWJlbDtcclxuXHRcdHB1YmxpYyBiYWNrQnRuOkxheWEuQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJWaWV3XCIsXCJjaGlsZFwiOlt7XCJwcm9wc1wiOntcInhcIjo0LFwieVwiOi00LFwic2tpblwiOlwiUmVzdWx0UGFnZS9yZXN1bHRiZy5wbmdcIn0sXCJ0eXBlXCI6XCJJbWFnZVwifSx7XCJwcm9wc1wiOntcInhcIjo2MCxcInlcIjotNyxcInZhclwiOlwid29yZFwifSxcInR5cGVcIjpcIkltYWdlXCJ9LHtcInByb3BzXCI6e1wieFwiOjYyLFwieVwiOjE2MCxcInRleHRcIjpcIm15bmFtZVwiLFwid2lkdGhcIjo5NCxcImhlaWdodFwiOjIzLFwidmFyXCI6XCJteU5hbWVUZXh0XCIsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiMxMDEwMTBcIixcImZvbnRcIjpcIuW+rui9r+mbhem7kVwifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjIwMCxcInlcIjoxNjAsXCJ0ZXh0XCI6XCJ5b3VybmFtZVwiLFwid2lkdGhcIjoxMDksXCJoZWlnaHRcIjoyMyxcInZhclwiOlwieW91ck5hbWVUZXh0XCIsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiMzQTNBM0FcIixcImZvbnRcIjpcIuW+rui9r+mbhem7kVwifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjYxLFwieVwiOjIwMixcInRleHRcIjpcIui/m+eQg+aVsFwiLFwid2lkdGhcIjo5NCxcImhlaWdodFwiOjIzLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjOTY5Njk2XCIsXCJmb250XCI6XCLnrYnnur9cIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjoyMDAsXCJ5XCI6MjAyLFwidGV4dFwiOlwi6L+b55CD5pWwXCIsXCJ3aWR0aFwiOjk0LFwiaGVpZ2h0XCI6MjMsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiM5Njk2OTZcIixcImZvbnRcIjpcIuetiee6v1wifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjYzLFwieVwiOjIzMixcInRleHRcIjpcIjBcIixcIndpZHRoXCI6OTQsXCJoZWlnaHRcIjoyMyxcImZvbnRTaXplXCI6MjAsXCJjb2xvclwiOlwiIzAwQzZGNFwiLFwiZm9udFwiOlwi5b6u6L2v6ZuF6buRXCIsXCJ2YXJcIjpcIm15QmFsbHNcIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjoyMDAsXCJ5XCI6MjMyLFwidGV4dFwiOlwiMFwiLFwid2lkdGhcIjo3NyxcImhlaWdodFwiOjIzLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjNkQ2RDZEXCIsXCJmb250XCI6XCLlvq7ova/pm4Xpu5FcIixcInZhclwiOlwieW91ckJhbGxzXCJ9LFwidHlwZVwiOlwiTGFiZWxcIn0se1wicHJvcHNcIjp7XCJ4XCI6NjIsXCJ5XCI6MjcyLFwidGV4dFwiOlwi5oC75b6X5YiGXCIsXCJ3aWR0aFwiOjk0LFwiaGVpZ2h0XCI6MjMsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiM5Njk2OTZcIixcImZvbnRcIjpcIuetiee6v1wifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjIwMCxcInlcIjoyNzIsXCJ0ZXh0XCI6XCLmgLvlvpfliIZcIixcIndpZHRoXCI6OTQsXCJoZWlnaHRcIjoyMyxcImZvbnRTaXplXCI6MjAsXCJjb2xvclwiOlwiIzk2OTY5NlwiLFwiZm9udFwiOlwi562J57q/XCJ9LFwidHlwZVwiOlwiTGFiZWxcIn0se1wicHJvcHNcIjp7XCJ4XCI6NjIsXCJ5XCI6MzEwLFwidGV4dFwiOlwiMFwiLFwid2lkdGhcIjo5NCxcImhlaWdodFwiOjIzLFwiZm9udFNpemVcIjoyMCxcImNvbG9yXCI6XCIjMDBDNkY0XCIsXCJmb250XCI6XCLlvq7ova/pm4Xpu5FcIixcInZhclwiOlwibXlTY29yZVwifSxcInR5cGVcIjpcIkxhYmVsXCJ9LHtcInByb3BzXCI6e1wieFwiOjIwMCxcInlcIjozMTAsXCJ0ZXh0XCI6XCIwXCIsXCJ3aWR0aFwiOjk0LFwiaGVpZ2h0XCI6MjMsXCJmb250U2l6ZVwiOjIwLFwiY29sb3JcIjpcIiM2RDZENkRcIixcImZvbnRcIjpcIuW+rui9r+mbhem7kVwiLFwidmFyXCI6XCJ5b3VyU2NvcmVcIn0sXCJ0eXBlXCI6XCJMYWJlbFwifSx7XCJwcm9wc1wiOntcInhcIjoxMjMsXCJ5XCI6MzU0LFwibGFiZWxcIjpcIui/lOWbnlwiLFwid2lkdGhcIjoxMjIsXCJoZWlnaHRcIjozNixcImxhYmVsRm9udFwiOlwi562J57q/XCIsXCJsYWJlbFN0cm9rZUNvbG9yXCI6XCIjMDAwMDAwXCIsXCJsYWJlbFNpemVcIjoyMixcInN0cm9rZUNvbG9yc1wiOlwiIzBCRTBEQVwiLFwic3RhdGVOdW1cIjpcIjFcIixcImxhYmVsQ29sb3JzXCI6XCIjZmZmZmZmXCIsXCJza2luXCI6XCJSZXN1bHRQYWdlL2J0bmJnLnBuZ1wiLFwidmFyXCI6XCJiYWNrQnRuXCJ9LFwidHlwZVwiOlwiQnV0dG9uXCJ9XSxcInByb3BzXCI6e1wiZm9udFwiOlwi562J57q/XCJ9fTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyh1aS5SZXN1bHRQYWdlVUkudWlWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdWkudHNcIiAvPlxyXG5cclxuY2xhc3MgUmVzdWx0UGFnZSBleHRlbmRzIHVpLlJlc3VsdFBhZ2VVSSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMud29yZC5sb2FkSW1hZ2UoJ1Jlc3VsdFBhZ2UvJyArIGRhdGEucmVzdWx0ICsgJy5wbmcnKTtcclxuICAgICAgICB0aGlzLm15TmFtZVRleHQudGV4dCA9IGRhdGEubXluYW1lO1xyXG4gICAgICAgIHRoaXMueW91ck5hbWVUZXh0LnRleHQgPSBkYXRhLnlvdXJuYW1lO1xyXG4gICAgICAgIHRoaXMubXlCYWxscy50ZXh0ID0gZGF0YS5teWJhbGxzO1xyXG4gICAgICAgIHRoaXMueW91ckJhbGxzLnRleHQgPSBkYXRhLnlvdXJiYWxscztcclxuICAgICAgICB0aGlzLm15U2NvcmUudGV4dCA9IGRhdGEubXlzY29yZTtcclxuICAgICAgICB0aGlzLnlvdXJTY29yZS50ZXh0ID0gZGF0YS55b3Vyc2NvcmU7XHJcblxyXG4gICAgICAgIHRoaXMucGl2b3QodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcclxuICAgICAgICB0aGlzLnBvcyhMYXlhLnN0YWdlLndpZHRoLzIsIExheWEuc3RhZ2UuaGVpZ2h0LzIpO1xyXG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlJlc3VsdFBhZ2U7XHJcblxyXG4gICAgICAgIHRoaXMuYmFja0J0bi5vbihMYXlhRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMub25CdG5CYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25CdG5CYWNrKCkge1xyXG4gICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmJ1dHRvbl8wMDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOWcuuaZr+i9rOaNolxyXG4gICAgICAgIE1haW4uSW5zdGFuY2UuYmFja1RvTWVudSgpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXBvcygpIHtcclxuICAgICAgICB0aGlzLnBvcyhMYXlhLnN0YWdlLndpZHRoLzIsIExheWEuc3RhZ2UuaGVpZ2h0LzIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZigpO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZ2FtZW9iamVjdC9TY29yZVBhbmVsLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdWkvdmlldy9SZXN1bHRQYWdlLnRzXCIgLz5cclxuXHJcbi8qKlxyXG4gKiDliIbmlbDnu5PmnoRcclxuICovXHJcbmludGVyZmFjZSBTY29yZSB7XHJcbiAgICBzY29yZTogbnVtYmVyO1xyXG4gICAgYmFsbHM6IG51bWJlcjtcclxuICAgIGJ1bGxldEV4cGxvc2lvbnM6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIOWIhuaVsOadg+mHjeiuvue9rlxyXG4gKi9cclxuY29uc3QgU2NvcmVDb25maWcgPSB7XHJcbiAgICBidWxsZXRFeHBsb3Npb25zOiAxLFxyXG4gICAgYmFsbHM6IDgsXHJcbiAgICB3aW5CYWxsczogMTBcclxufVxyXG5cclxuLyoqXHJcbiAqIOW+l+WIhueuoeeQhuexu1xyXG4gKi9cclxuY2xhc3MgU2NvcmVNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgX21zY29yZTogU2NvcmU7XHJcbiAgICBwcml2YXRlIF95c2NvcmU6IFNjb3JlO1xyXG4gICAgcHJpdmF0ZSBfbXlTY29yZVBhbmVsOiBTY29yZVBhbmVsO1xyXG4gICAgcHJpdmF0ZSBfeW91clNjb3JlUGFuZWw6IFNjb3JlUGFuZWw7XHJcbiAgICBwcml2YXRlIF9yZXN1bHRWaWV3OiBSZXN1bHRQYWdlO1xyXG5cclxuICAgIHB1YmxpYyBtYmFsbHM6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgeWJhbGxzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogU2NvcmVNYW5hZ2VyO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgSW5zdGFuY2UoKTogU2NvcmVNYW5hZ2VyIHtcclxuICAgICAgICBpZiAoU2NvcmVNYW5hZ2VyLmluc3RhbmNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLmluc3RhbmNlID0gbmV3IFNjb3JlTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU2NvcmVNYW5hZ2VyLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtc2NvcmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21zY29yZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeXNjb3JlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl95c2NvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG15U2NvcmVQYW5lbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbXlTY29yZVBhbmVsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB5b3VyU2NvcmVQYW5lbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feW91clNjb3JlUGFuZWw7XHJcbiAgICB9XHJcbiAgICBnZXQgcmVzdWx0VmlldygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0VmlldztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluWIhuaVsOWSjOWIhuaVsOadv1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdFNjb3JlKCkge1xyXG5cclxuICAgICAgICAvLyDlj4zmlrnliIbmlbDmnb8g5Yid5aeL5YyW5YiG5pWwXHJcbiAgICAgICAgdGhpcy5fbXNjb3JlID0ge3Njb3JlOiAwLCBiYWxsczogMCwgYnVsbGV0RXhwbG9zaW9uczogMH07XHJcbiAgICAgICAgdGhpcy5feXNjb3JlID0ge3Njb3JlOiAwLCBiYWxsczogMCwgYnVsbGV0RXhwbG9zaW9uczogMH07XHJcbiAgICAgICAgdGhpcy5fbXlTY29yZVBhbmVsID0gbmV3IFNjb3JlUGFuZWwoJ21pbmUnKTtcclxuICAgICAgICB0aGlzLl95b3VyU2NvcmVQYW5lbCA9IG5ldyBTY29yZVBhbmVsKCd5b3VyJyk7XHJcblxyXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fbXlTY29yZVBhbmVsKTtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX3lvdXJTY29yZVBhbmVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNruaVsOaNruiuvue9ruWIhuaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0U2NvcmVzKHR5cGU6IHN0cmluZywgZGF0YSkge1xyXG4gICAgICAgIGlmKHR5cGUgPT09ICdtaW5lJykge1xyXG4gICAgICAgICAgICB0aGlzLl9tc2NvcmUuYmFsbHMgPSBkYXRhLmJhbGxzO1xyXG4gICAgICAgICAgICB0aGlzLl9tc2NvcmUuYnVsbGV0RXhwbG9zaW9ucyA9IGRhdGEuZXhwbG9zaW9ucztcclxuICAgICAgICAgICAgdGhpcy5fbXNjb3JlLnNjb3JlID0gZGF0YS5zY29yZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlID09PSAneW91cicpIHtcclxuICAgICAgICAgICAgdGhpcy5feXNjb3JlLmJhbGxzID0gZGF0YS5iYWxscztcclxuICAgICAgICAgICAgdGhpcy5feXNjb3JlLmJ1bGxldEV4cGxvc2lvbnMgPSBkYXRhLmV4cGxvc2lvbnM7XHJcbiAgICAgICAgICAgIHRoaXMuX3lzY29yZS5zY29yZSA9IGRhdGEuc2NvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrDliIbmlbDmlbDmja7mmL7npLpcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZVNjb3JlKCkge1xyXG4gICAgICAgIHRoaXMubXlTY29yZVBhbmVsLnVwZGF0ZVNjb3JlKHRoaXMuX21zY29yZS5zY29yZSk7XHJcbiAgICAgICAgdGhpcy5teVNjb3JlUGFuZWwudXBkYXRlQmFsbHModGhpcy5fbXNjb3JlLmJhbGxzKTtcclxuICAgICAgICB0aGlzLnlvdXJTY29yZVBhbmVsLnVwZGF0ZVNjb3JlKHRoaXMuX3lzY29yZS5zY29yZSk7XHJcbiAgICAgICAgdGhpcy55b3VyU2NvcmVQYW5lbC51cGRhdGVCYWxscyh0aGlzLl95c2NvcmUuYmFsbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5YiG5pWw5pWw5o2u5pi+56S6XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVTY29yZVBhbmVsKCkge1xyXG4gICAgICAgIGlmKHRoaXMubXlTY29yZVBhbmVsKSB0aGlzLm15U2NvcmVQYW5lbC5yZW1vdmUoKTtcclxuICAgICAgICBpZih0aGlzLnlvdXJTY29yZVBhbmVsKSB0aGlzLnlvdXJTY29yZVBhbmVsLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat6L+b55CD5pWw5piv5ZCm6L6+5Yiw6LWb54K5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjaGVja0JhbGxzKHdob3NlYmFsbDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYod2hvc2ViYWxsID09PSAnbWluZScgJiYgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLm1iYWxscyA+PSBTY29yZUNvbmZpZy53aW5CYWxscykge1xyXG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYod2hvc2ViYWxsID09PSAneW91cicgJiYgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnliYWxscyA+PSBTY29yZUNvbmZpZy53aW5CYWxscykge1xyXG4gICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65YiG5pWw57uT566X55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93R2FtZVJlc3VsdChkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15ZGF0YSwgeW91cmRhdGEsIG1pbmRleCwgcmVzdWx0LCByZTtcclxuXHJcbiAgICAgICAgZGF0YSA9IGRhdGEuc2NvcmVzO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9yZXN1bHRWaWV3KSB0aGlzLnJlc3VsdFZpZXcucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIC8vIOWMuemFjeWHuuiHquW3seeahOWIhuaVsFxyXG4gICAgICAgIGZvcihsZXQgaSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmKGRhdGFbaV0uaWQgPT09IFNvY2tldC5JbnN0YW5jZS5nZXRVaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgbXlkYXRhID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgIG1pbmRleCA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5a656ZSZ5aSE55CGXHJcbiAgICAgICAgaWYoIW15ZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IHVzZXIgaWQgbm90IGV4aXN0IGluIHNjb3JlcyBkYXRhLicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB5b3VyZGF0YSA9IGRhdGFbMSAtIG1pbmRleF07XHJcbiAgICAgICAgcmVzdWx0ID0gbXlkYXRhLnNjb3JlID4geW91cmRhdGEuc2NvcmU/ICd3aW4nIDogKG15ZGF0YS5zY29yZSA8IHlvdXJkYXRhLnNjb3JlPyAnbG9zZScgOiAndGllJyk7XHJcblxyXG4gICAgICAgIC8vIOagvOW8j+WMluaVsOaNrlxyXG4gICAgICAgIHJlID0ge1xyXG4gICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcclxuICAgICAgICAgICAgbXluYW1lOiBteWRhdGEubmFtZSxcclxuICAgICAgICAgICAgeW91cm5hbWU6IHlvdXJkYXRhLm5hbWUsXHJcbiAgICAgICAgICAgIG15YmFsbHM6IG15ZGF0YS5iYWxscyxcclxuICAgICAgICAgICAgeW91cmJhbGxzOiB5b3VyZGF0YS5iYWxscyxcclxuICAgICAgICAgICAgbXlzY29yZTogbXlkYXRhLnNjb3JlLFxyXG4gICAgICAgICAgICB5b3Vyc2NvcmU6IHlvdXJkYXRhLnNjb3JlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g5pi+56S65q+U6LWb57uT5p6cXHJcbiAgICAgICAgdGhpcy5fcmVzdWx0VmlldyA9IG5ldyBSZXN1bHRQYWdlKHJlKTtcclxuICAgICAgICB0aGlzLl9yZXN1bHRWaWV3LnNjYWxlKDAsIDApO1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX3Jlc3VsdFZpZXcpO1xyXG5cclxuICAgICAgICAvL+OAgOaJp+ihjOWKqOeUu1xyXG4gICAgICAgIFR3ZWVuLnRvKHRoaXMuX3Jlc3VsdFZpZXcsIHtzY2FsZVg6IDEsIHNjYWxlWTogMX0sIDUwMCwgRWFzZVsnYmFja091dCddKTtcclxuXHJcbiAgICAgICAgaWYocmVzdWx0ID09PSAnd2luJyB8fCByZXN1bHQgPT09ICd0aWUnKSBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5nYW1ld2luKTtcclxuICAgICAgICBlbHNlIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmdhbWVvdmVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOWIhuaVsOeVjOmdolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlUmVzdWx0VmlldygpIHtcclxuICAgICAgICBpZih0aGlzLl9yZXN1bHRWaWV3KSB0aGlzLl9yZXN1bHRWaWV3LnJlbW92ZSgpO1xyXG4gICAgfVxyXG59IiwiY29uc3QgTXNnQXR0ciA9IHtcclxuICAgIHdpZHRoOiA0MDgsXHJcbiAgICBoZWlnaHQ6IDMxNlxyXG59XHJcbi8qKlxyXG4gKiDmtojmga/nrqHnkIZcclxuICovXHJcbmNsYXNzIE1zZ01hbmFnZXIge1xyXG4gICAgcHJpdmF0ZSBfbXNnOiBTcHJpdGU7XHJcbiAgICBwcml2YXRlIF9tc2dDb250YWluZXI6IFZpZXc7XHJcbiAgICBwcml2YXRlIF90ZXh0U3ByaXRlOiBMYXlhVGV4dDtcclxuICAgIHByaXZhdGUgX3Nob3dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3RpcHNUZXh0OiBMYXlhVGV4dDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1zZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbXNnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aXBzVGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGlwc1RleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IE1zZ01hbmFnZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpOiBNc2dNYW5hZ2VyIHtcclxuICAgICAgICBpZiAoTXNnTWFuYWdlci5pbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIE1zZ01hbmFnZXIuaW5zdGFuY2UgPSBuZXcgTXNnTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTXNnTWFuYWdlci5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmmL7npLrmtojmga9cclxuICAgIHB1YmxpYyBzaG93TWVzc2FnZSh0ZXh0OiBzdHJpbmcsIHNpemU/OiBudW1iZXIsIGZ1bmM/OiAoKSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fbXNnKSB7XHJcblxyXG4gICAgICAgICAgICAvLyDmtojmga/lsYIg5a655ZmoXHJcbiAgICAgICAgICAgIHRoaXMuX21zZ0NvbnRhaW5lciA9IG5ldyBWaWV3KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21zZ0NvbnRhaW5lci56T3JkZXIgPSBEaXNwbGF5T3JkZXIuTXNnO1xyXG4gICAgICAgICAgICB0aGlzLl9tc2dDb250YWluZXIubW91c2VFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOa2iOaBr+iDjOaZr1xyXG4gICAgICAgICAgICB0aGlzLl9tc2cgPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21zZy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5tc2dCZyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21zZy5waXZvdChNc2dBdHRyLndpZHRoIC8gMiwgTXNnQXR0ci5oZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgdGhpcy5fbXNnLnNpemUoTXNnQXR0ci53aWR0aCwgTXNnQXR0ci5oZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLl9tc2cubmFtZSA9IERpc3BsYXlOYW1lLkxvYWRpbmc7XHJcbiAgICAgICAgICAgIHRoaXMuX21zZy5wb3MoTGF5YS5zdGFnZS53aWR0aCAvIDIsIExheWEuc3RhZ2UuaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgICAgICAvLyDmloflrZdcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZSA9IG5ldyBMYXlhVGV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0U3ByaXRlLmZvbnQgPSAn562J57q/JztcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS5vdmVyZmxvdyA9IExheWFUZXh0LkhJRERFTjtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS53b3JkV3JhcCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRTcHJpdGUuYWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS52YWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS5zaXplKDI2MCwgMzAwKTtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS5waXZvdCh0aGlzLl90ZXh0U3ByaXRlLndpZHRoIC8gMiwgdGhpcy5fdGV4dFNwcml0ZS5oZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS5wb3ModGhpcy5fbXNnLndpZHRoIC8gMiwgdGhpcy5fbXNnLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbXNnLmFkZENoaWxkKHRoaXMuX3RleHRTcHJpdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g54q25oCB5Y+Y5Li65pi+56S65LitXHJcbiAgICAgICAgdGhpcy5fc2hvd2luZyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIOa4hemZpOaJp+ihjOS4reeahOWKqOeUu1xyXG4gICAgICAgIFR3ZWVuLmNsZWFyQWxsKHRoaXMuX21zZyk7XHJcblxyXG4gICAgICAgIC8vIOavj+asoeaYvuekuua2iOaBr+mHjeaWsOiuvue9rlxyXG4gICAgICAgIHRoaXMuX21zZy5hbHBoYSA9IDA7XHJcbiAgICAgICAgdGhpcy5fbXNnLnNjYWxlKDAsIDApO1xyXG4gICAgICAgIHRoaXMuX3RleHRTcHJpdGUudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5fdGV4dFNwcml0ZS5jb2xvciA9ICcjMDAwMDAwJztcclxuICAgICAgICB0aGlzLl90ZXh0U3ByaXRlLmZvbnRTaXplID0gNDY7XHJcblxyXG4gICAgICAgIC8vIOWPr+mAieWPguaVsCDlsLrlr7jorr7nva5cclxuICAgICAgICBpZiAoc2l6ZSkgdGhpcy5fdGV4dFNwcml0ZS5mb250U2l6ZSA9IHNpemU7XHJcblxyXG4gICAgICAgIC8vIOaJp+ihjOWKqOeUu1xyXG4gICAgICAgIFR3ZWVuLnRvKHRoaXMuX21zZywgeyBhbHBoYTogMSwgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfSwgNjAwLCBFYXNlWydiYWNrSW5PdXQnXSwgSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zaG93aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChmdW5jKSBmdW5jLmFwcGx5KHRoaXMpO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgLy8g5re75Yqg5Yiw5pi+56S65bGCXHJcbiAgICAgICAgdGhpcy5fbXNnQ29udGFpbmVyLmFkZENoaWxkKHRoaXMuX21zZyk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9tc2dDb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOenu+mZpOa2iOaBr1xyXG4gICAgcHVibGljIHJlbW92ZU1lc3NhZ2UoZnVuYz86ICgpID0+IHZvaWQpIHtcclxuXHJcbiAgICAgICAgLy8g5aaC5p6c5pi+56S65Lit77yM5YiZ5LiN56e76ZmkXHJcbiAgICAgICAgaWYgKHRoaXMuX3Nob3dpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8g6YCA5Zy65Yqo55S7XHJcbiAgICAgICAgVHdlZW4udG8odGhpcy5fbXNnLCB7IGFscGhhOiAwLCBzY2FsZVg6IDAsIHNjYWxlWTogMCB9LCA1MDAsIG51bGwsIEhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIOWPr+mAieWPguaVsCDlm57osIPlh73mlbBcclxuICAgICAgICAgICAgaWYgKGZ1bmMpIGZ1bmMuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAvLyDnp7vpmaTmlbDmja4g5pu05o2i54q25oCBXHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UucmVtb3ZlQ2hpbGQodGhpcy5fbXNnQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgdGhpcy5fbXNnQ29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Nob3dpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6K6+572u5paH5pysXHJcbiAgICBwdWJsaWMgc2V0VGV4dCh0ZXh0OiBzdHJpbmcsIGNvbG9yPykge1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0U3ByaXRlKSB0aGlzLl90ZXh0U3ByaXRlLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIGlmIChjb2xvcikgdGhpcy5fdGV4dFNwcml0ZS5jb2xvciA9IGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93VGlwcyh0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90aXBzVGV4dCA9IG5ldyBMYXlhVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuX3RpcHNUZXh0LmZvbnQgPSAn562J57q/JztcclxuICAgICAgICB0aGlzLl90aXBzVGV4dC5vdmVyZmxvdyA9IExheWFUZXh0LkhJRERFTjtcclxuICAgICAgICB0aGlzLl90aXBzVGV4dC53b3JkV3JhcCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdGlwc1RleHQuYWxpZ24gPSAnbGVmdCc7XHJcbiAgICAgICAgdGhpcy5fdGlwc1RleHQudmFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5fdGlwc1RleHQuc2l6ZSgyMjYsIDMwMCk7XHJcbiAgICAgICAgdGhpcy5fdGlwc1RleHQucGl2b3QodGhpcy5fdGlwc1RleHQud2lkdGggLyAyLCB0aGlzLl90aXBzVGV4dC5oZWlnaHQgLyAyKTtcclxuICAgICAgICB0aGlzLl90aXBzVGV4dC5wb3MoTGF5YS5zdGFnZS53aWR0aCAvIDIsIExheWEuc3RhZ2UuaGVpZ2h0IC0gMTAwKTtcclxuICAgICAgICB0aGlzLl90aXBzVGV4dC50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLl90aXBzVGV4dC5jb2xvciA9ICcjZmZmZmZmJztcclxuICAgICAgICB0aGlzLl90aXBzVGV4dC5mb250U2l6ZSA9IDI2O1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZVRpcHMoKTtcclxuXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl90aXBzVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZVRpcHMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fdGlwc1RleHQpIExheWEuc3RhZ2UucmVtb3ZlQ2hpbGQodGhpcy5fdGlwc1RleHQpO1xyXG4gICAgfVxyXG59IiwiXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvQmFzZUJhbGwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nYW1lb2JqZWN0L0JhbGwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nYW1lb2JqZWN0L0Nhbm5vbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvQnVsbGV0UHJvY2Vzcy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dhbWVvYmplY3QvVGltZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nYW1lb2JqZWN0L0Rhc2hMaW5lLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZ2FtZW9iamVjdC90b29sL1Rvb2xUYWdDb250YWluZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nYW1lb2JqZWN0L3Rvb2wvQnRuU3dpdGNoLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vQW5pbWF0aW9uTWFuYWdlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1Njb3JlTWFuYWdlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL01zZ01hbmFnZXIudHNcIiAvPlxyXG5cclxuLyoqXHJcbiAqIOW4p+abtOaWsOWMhVxyXG4gKi9cclxuaW50ZXJmYWNlIEZyYW1lUGFjayB7XHJcbiAgICBrZXlmcmFtZTogbnVtYmVyO1xyXG4gICAgY3RybHM6IEFycmF5PEN0cmw+O1xyXG59XHJcblxyXG4vKipcclxuICog55So5oi35pON5L2cXHJcbiAqL1xyXG5pbnRlcmZhY2UgQ3RybCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgY3RybDogQ3RybERhdGFcclxufVxyXG5cclxuaW50ZXJmYWNlIEN0cmxEYXRhIHtcclxuICAgIGFuZ2xlOiBudW1iZXIsXHJcbiAgICBwb3dlcjogbnVtYmVyLFxyXG4gICAgYnVsbGV0VHlwZTogc3RyaW5nXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/pgLvovpHnsbtcclxuICovXHJcbmNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBrZXlmcmFtZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgY3VyZnJhbWU6IG51bWJlciA9IDA7XHJcbiAgICAvLyDmuLjmiI/nirbmgIFcclxuICAgIC8vIC0xIOa4uOaIj+acquW8gOWni1xyXG4gICAgLy8gMCDlgZzmraLvvIjmlrDnkIPnlJ/miJDkuK3vvIkg56aB5q2i5Lu75L2V5pON5L2c5ZKM5LiN5o6l5Y+X5paw55qE5a2Q5by55Y+R5bCE6K+35rGCXHJcbiAgICAvLyAxIOato+W4uOi/kOihjFxyXG4gICAgcHVibGljIF9zdGF0dXM6IG51bWJlciA9IC0xO1xyXG4gICAgLy8g5bin5pu05paw6Zif5YiXXHJcbiAgICBwcml2YXRlIF91cGRhdGVMaXN0OiBBcnJheTxGcmFtZVBhY2s+ID0gW107XHJcbiAgICAvLyDmuLjmiI/lhYPntKAg5ri45oiPVUlcclxuICAgIHByaXZhdGUgX215Q2Fubm9uOiBDYW5ub247XHJcbiAgICBwcml2YXRlIF95b3VyQ2Fubm9uOiBDYW5ub247XHJcbiAgICBwcml2YXRlIF9nYW1lQmc6IFNwcml0ZTtcclxuICAgIHByaXZhdGUgX2JhbGw6IEJhbGw7XHJcbiAgICBwcml2YXRlIF9kYXNoTGluZTogRGFzaExpbmU7XHJcbiAgICBwcml2YXRlIF9idWxsZXRQcm9jZXNzOiBCdWxsZXRQcm9jZXNzO1xyXG4gICAgcHJpdmF0ZSBfcHByb2Nlc3M6IFBQcm9jZXNzO1xyXG4gICAgcHJpdmF0ZSBfdGltZXI6IFRpbWVyO1xyXG4gICAgcHJpdmF0ZSBfY291bnRlcjogQ291bnREb3duO1xyXG4gICAgcHJpdmF0ZSBfdG9vbFRhZ0NvbnRhaW5lcjogVG9vbFRhZ0NvbnRhaW5lcjtcclxuICAgIHByaXZhdGUgX2J0blN3aXRjaDogQnRuU3dpdGNoO1xyXG4gICAgcHVibGljIHNtb2tlMTtcclxuICAgIHB1YmxpYyBzbW9rZTI7XHJcbiAgICBwdWJsaWMgYmFsbERpcmVjdGlvbnMgPSBbXTtcclxuICAgIHB1YmxpYyBiYWxsRGlyZWN0aW9uRmFjdG9yID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogR2FtZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IEdhbWUge1xyXG4gICAgICAgIGlmIChHYW1lLmluc3RhbmNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgR2FtZS5pbnN0YW5jZSA9IG5ldyBHYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBHYW1lLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBiYWxsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9iYWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBidWxsZXRQcm9jZXNzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9idWxsZXRQcm9jZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aW1lcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGltZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0YXR1cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb3VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb3VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0b29sVGFnQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90b29sVGFnQ29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBidG5Td2l0Y2goKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J0blN3aXRjaDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3RhdHVzKHN0YXR1czogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB1cGRhdGVMaXN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cGRhdGVMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRCYWxsRGlyZWN0aW9uKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLmJhbGxEaXJlY3Rpb25zLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSB0aGlzLmJhbGxEaXJlY3Rpb25zLnNoaWZ0KCk7XHJcbiAgICAgICAgdGhpcy5iYWxsRGlyZWN0aW9ucy5wdXNoKGRpcmVjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluS4gOS4quWumuaXtuWZqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q291bnRlcihmdW5jOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5fY291bnRlciA9IG5ldyBDb3VudERvd24oMywgZnVuYyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmuLjmiI/lnLrmma9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRTY2VuZSgpIHtcclxuICAgICAgICB0aGlzLmluaXRCRygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFJvbGUoKTtcclxuICAgICAgICB0aGlzLmluaXRVSSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydExvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTGlzdC5zcGxpY2UoMCwgMTgwKTtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCB0aGlzLCB0aGlzLnVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbog4zmma9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0QkcoKSB7XHJcbiAgICAgICAgbGV0IGdhbWVQYWdlID0gTWFpbi5JbnN0YW5jZS5nYW1lUGFnZTtcclxuXHJcbiAgICAgICAgdGhpcy5fZ2FtZUJnID0gbmV3IFNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCZy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5nYW1lYmcpO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCZy5waXZvdCg2NDAsIDQwMCk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJnLnBvcyhjb25maWcuZ2FtZVdpZHRoIC8gMiwgY29uZmlnLmdhbWVIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQodGhpcy5fZ2FtZUJnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlua4uOaIj+inkuiJsuWFg+e0oFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRSb2xlKCkge1xyXG4gICAgICAgIGxldCBnYW1lUGFnZSA9IE1haW4uSW5zdGFuY2UuZ2FtZVBhZ2U7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMluWPjOaWueeCruWPsFxyXG4gICAgICAgIHRoaXMuX215Q2Fubm9uID0gbmV3IENhbm5vbihmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5feW91ckNhbm5vbiA9IG5ldyBDYW5ub24odHJ1ZSk7XHJcblxyXG4gICAgICAgIGdhbWVQYWdlLmFkZENoaWxkKHRoaXMuX215Q2Fubm9uKTtcclxuICAgICAgICBnYW1lUGFnZS5hZGRDaGlsZCh0aGlzLl95b3VyQ2Fubm9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllVJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFVJKCkge1xyXG5cclxuICAgICAgICAvLyDliJ3lp4vljJbliIbmlbDlkozliIbmlbDmnb9cclxuICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UuaW5pdFNjb3JlKCk7XHJcblxyXG4gICAgICAgIC8vIOWtkOW8ueWhq+WFhei/m+W6puadoVxyXG4gICAgICAgIHRoaXMuX2J1bGxldFByb2Nlc3MgPSBuZXcgQnVsbGV0UHJvY2VzcygpO1xyXG5cclxuICAgICAgICAvLyDlipvluqbov5vluqbmnaFcclxuICAgICAgICB0aGlzLl9wcHJvY2VzcyA9IG5ldyBQUHJvY2VzcygpO1xyXG5cclxuICAgICAgICAvLyDorqHml7blmahcclxuICAgICAgICB0aGlzLl90aW1lciA9IG5ldyBUaW1lcigpO1xyXG5cclxuICAgICAgICAvLyDpgZPlhbflrrnlmahcclxuICAgICAgICB0aGlzLl90b29sVGFnQ29udGFpbmVyID0gbmV3IFRvb2xUYWdDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgLy8g5YiH5o2i6YGT5YW35oyJ6ZKuXHJcbiAgICAgICAgdGhpcy5fYnRuU3dpdGNoID0gbmV3IEJ0blN3aXRjaCgpO1xyXG5cclxuICAgICAgICAvLyDovoXliqnnur9cclxuICAgICAgICB0aGlzLl9kYXNoTGluZSA9IG5ldyBEYXNoTGluZSh0aGlzLl9teUNhbm5vbi54LCB0aGlzLl9teUNhbm5vbi55KTtcclxuICAgICAgICBNYWluLkluc3RhbmNlLmdhbWVQYWdlLmFkZENoaWxkKHRoaXMuX2Rhc2hMaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluWwj+eQg1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdEJhbGwoZGlyZWN0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgZ2FtZVBhZ2UgPSBNYWluLkluc3RhbmNlLmdhbWVQYWdlO1xyXG5cclxuICAgICAgICAvLyDliJ3lp4vljJbmr5TotZvnkINcclxuICAgICAgICB0aGlzLl9iYWxsID0gbmV3IEJhbGwoZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgZ2FtZVBhZ2UuYWRkQ2hpbGQodGhpcy5fYmFsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbnjqnlrrbmjqfliLblmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRDb250cm9sKCkge1xyXG4gICAgICAgIHRoaXMuX2dhbWVCZy5vbihMYXlhRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5vbk1vdXNlRG93bik7XHJcblxyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YUV2ZW50LktFWV9QUkVTUywgdGhpcywgdGhpcy5vbktleVByZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWBnOatouaOp+WItlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RvcENvbnRyb2woKSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9mZihMYXlhRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5vbk1vdXNlRG93bik7XHJcblxyXG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWFFdmVudC5LRVlfUFJFU1MsIHRoaXMsIHRoaXMub25LZXlQcmVzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplK7nm5jmjqfliLZcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uS2V5UHJlc3MoZTogTGF5YUV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHRvb2xUYWdDb250YWluZXIgPSBHYW1lLkluc3RhbmNlLnRvb2xUYWdDb250YWluZXI7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDk6XHJcbiAgICAgICAgICAgICAgICB0b29sVGFnQ29udGFpbmVyLnNlbGVjdFRhZygwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDUwOlxyXG4gICAgICAgICAgICAgICAgdG9vbFRhZ0NvbnRhaW5lci5zZWxlY3RUYWcoMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA1MTpcclxuICAgICAgICAgICAgICAgIHRvb2xUYWdDb250YWluZXIuc2VsZWN0VGFnKDIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog54K55Ye75ruR5Yqo5pON5o6nXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb25Nb3VzZURvd24oZTogTGF5YUV2ZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2dhbWVCZy5vbihMYXlhRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJnLm9uKExheWFFdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCZy5vbihMYXlhRXZlbnQuTU9VU0VfT1VULCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XHJcblxyXG4gICAgICAgIC8vIOiThOWKm+adoeW8gOWni+iThOWKm1xyXG4gICAgICAgIHRoaXMuX3Bwcm9jZXNzLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+eCueWHu+eCueWSjOeCruWPsOaXi+i9rOinkuW6plxyXG4gICAgICAgIGxldCBtb3VzZSA9IFV0aWxzLnAoTGF5YS5zdGFnZS5tb3VzZVggLSBnbG9iYWwubGVmdEVkZ2UsIExheWEuc3RhZ2UubW91c2VZKTtcclxuICAgICAgICBsZXQgdmVjdG9yID0gVXRpbHMucChtb3VzZS54IC0gdGhpcy5fbXlDYW5ub24ueCwgbW91c2UueSAtIHRoaXMuX215Q2Fubm9uLnkpO1xyXG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gLTEgKiBNYXRoLmF0YW4odmVjdG9yLnggLyB2ZWN0b3IueSkgKiAxODAgLyBNYXRoLlBJO1xyXG5cclxuICAgICAgICB0aGlzLl9kYXNoTGluZS5kcmF3QXNzaXN0TGluZShtb3VzZSk7XHJcbiAgICAgICAgdGhpcy5fbXlDYW5ub24uc2V0QW5nbGUoYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Nb3VzZVVwKGU6IExheWFFdmVudCkge1xyXG4gICAgICAgIGxldCB0b29sVGFnQ29udGFpbmVyID0gR2FtZS5JbnN0YW5jZS50b29sVGFnQ29udGFpbmVyO1xyXG5cclxuICAgICAgICB0aGlzLl9nYW1lQmcub2ZmKExheWFFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCB0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgICAgICB0aGlzLl9nYW1lQmcub2ZmKExheWFFdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCZy5vZmYoTGF5YUV2ZW50Lk1PVVNFX09VVCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xyXG5cclxuICAgICAgICAvLyDmnb7miYvmuIXpmaTomZrnur9cclxuICAgICAgICB0aGlzLl9kYXNoTGluZS5jbGVhckxpbmVzKCk7XHJcblxyXG4gICAgICAgIC8vIOWPkemAgeWPkeWwhOWtkOW8ueivt+axglxyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0dXMgIT09IDAgJiYgIXRvb2xUYWdDb250YWluZXIuaXNMb2NrKCkgJiYgdGhpcy5idWxsZXRQcm9jZXNzLmNvc3RPbmUodGhpcy5fcHByb2Nlc3MucGVyY2VudCAqIDIgKyAodG9vbFRhZ0NvbnRhaW5lci5pc1NlbGVjdEZpcnN0KCk/IDAgOiAwLjQpKSkge1xyXG4gICAgICAgICAgICBsZXQgY3RybERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBhbmdsZTogdGhpcy5fbXlDYW5ub24uZ2V0QW5nbGUoKSxcclxuICAgICAgICAgICAgICAgIHBvd2VyOiB0aGlzLl9wcHJvY2Vzcy5wZXJjZW50LFxyXG4gICAgICAgICAgICAgICAgYnVsbGV0VHlwZTogdG9vbFRhZ0NvbnRhaW5lci5nZXRTZWxlY3RlZFRvb2xJZCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvb2xUYWdDb250YWluZXIubG9jaygpO1xyXG4gICAgICAgICAgICBTb2NrZXQuSW5zdGFuY2Uuc2VuZEN0cmwoY3RybERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5YGc5q2i5bm25riF56m66JOE5Yqb5p2hXHJcbiAgICAgICAgdGhpcy5fcHByb2Nlc3Muc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Nb3VzZU1vdmUoZTogTGF5YUV2ZW50KSB7XHJcbiAgICAgICAgbGV0IG1vdXNlID0gVXRpbHMucChMYXlhLnN0YWdlLm1vdXNlWCAtIGdsb2JhbC5sZWZ0RWRnZSwgTGF5YS5zdGFnZS5tb3VzZVkpO1xyXG4gICAgICAgIGxldCB2ZWN0b3IgPSBVdGlscy5wKG1vdXNlLnggLSB0aGlzLl9teUNhbm5vbi54LCBtb3VzZS55IC0gdGhpcy5fbXlDYW5ub24ueSk7XHJcbiAgICAgICAgbGV0IGFuZ2xlOiBudW1iZXIgPSAtMSAqIE1hdGguYXRhbih2ZWN0b3IueCAvIHZlY3Rvci55KSAqIDE4MCAvIE1hdGguUEk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rhc2hMaW5lLmRyYXdBc3Npc3RMaW5lKG1vdXNlKTtcclxuICAgICAgICB0aGlzLl9teUNhbm5vbi5zZXRBbmdsZShhbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDluKfnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja1VwZGF0ZUxpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOajgOa1i+aVsOaNruWMhemYn+WIl1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNoZWNrVXBkYXRlTGlzdCgpIHtcclxuICAgICAgICBsZXQgbCA9IHRoaXMuX3VwZGF0ZUxpc3QubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAobCA+IDAgJiYgbCA8IDEwKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOiBGcmFtZVBhY2sgPSB0aGlzLl91cGRhdGVMaXN0LnNwbGljZSgwLCAxKVswXTtcclxuICAgICAgICAgICAgdGhpcy5ydW5GcmFtZVBhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuRnJhbWVMb2dpYygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChsID49IDEwKSB7XHJcblxyXG4gICAgICAgICAgICAvLyDmoLnmja7lvoXmiafooYzmlbDmja7lpKflsI/lhrPlrprliqDpgJ/nmoTpgJ/luqZcclxuICAgICAgICAgICAgbGV0IGRsZW5ndGggPSBsIDwgMTAwID8gMiA6IE1hdGguY2VpbChsIC8gNTApO1xyXG4gICAgICAgICAgICBsZXQgZGF0YTogRnJhbWVQYWNrW10gPSB0aGlzLl91cGRhdGVMaXN0LnNwbGljZSgwLCBkbGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ydW5GcmFtZVBhY2soZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bkZyYW1lTG9naWMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOa4uOaIj+WFg+e0oOeahOW4p+mAu+i+kVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJ1bkZyYW1lTG9naWMoKSB7XHJcblxyXG4gICAgICAgIC8vIOWtkOW8uVxyXG4gICAgICAgIGlmIChnbG9iYWwuc3luID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGJBIG9mIEJ1bGxldC5teUJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIGJBLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGJCIG9mIEJ1bGxldC55b3VyQnVsbGV0cykge1xyXG4gICAgICAgICAgICAgICAgYkIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZ2xvYmFsLnN5biA9PT0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBiQiBvZiBCdWxsZXQueW91ckJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIGJCLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGJBIG9mIEJ1bGxldC5teUJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIGJBLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlsI/nkINcclxuICAgICAgICB0aGlzLl9iYWxsLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyDlrZDlvLnloavlhYXov5vluqbmnaFcclxuICAgICAgICB0aGlzLl9idWxsZXRQcm9jZXNzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyDok4TlipvmnaFcclxuICAgICAgICB0aGlzLl9wcHJvY2Vzcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgLy8g6K6h5pe25ZmoXHJcbiAgICAgICAgdGhpcy5fdGltZXIudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6PmnpDmnI3liqHlmajluKfmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBydW5GcmFtZVBhY2soZGF0YTogRnJhbWVQYWNrKSB7XHJcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gU29ja2V0Lkluc3RhbmNlLmdldFVpZCgpO1xyXG4gICAgICAgIGxldCByb2xlOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGMgb2YgZGF0YS5jdHJscykge1xyXG4gICAgICAgICAgICByb2xlID0gYy5pZCA9PT0gdWlkID8gJ215cm9sZScgOiAneW91cnJvbGUnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbGF5RGF0YShyb2xlLCBjLmN0cmwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdXJmcmFtZSA9IGRhdGEua2V5ZnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmlbDmja7ovpPlhaXpmJ/liJdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHB1c2hVcGRhdGVEYXRhKGRhdGE6IEZyYW1lUGFjaykge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxpc3QucHVzaChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXJVcGRhdGVMaXN0KCkge1xyXG4gICAgICAgIC8vIOWmguaenOacieS4iuS4gOWxgOaui+eVmeaVsOaNruWImea4heepuuWIoOmZpFxyXG4gICAgICAgIGlmICh0aGlzLl91cGRhdGVMaXN0Lmxlbmd0aCA+IDApIHRoaXMuX3VwZGF0ZUxpc3QgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOino+aekOi/kOihjOaVsOaNrlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHBsYXlEYXRhKHJvbGU6IHN0cmluZywgY3RybDogQ3RybERhdGEpIHtcclxuICAgICAgICBsZXQgdG9vbFRhZ0NvbnRhaW5lciA9IEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAocm9sZSA9PT0gJ215cm9sZScpIHtcclxuICAgICAgICAgICAgdGhpcy5fbXlDYW5ub24uc2hvb3QoY3RybC5hbmdsZSwgY3RybC5wb3dlciwgY3RybC5idWxsZXRUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOS9v+eUqOmBk+WFt+eahOWKqOeUu1xyXG4gICAgICAgICAgICB0b29sVGFnQ29udGFpbmVyLnVzZVNlbGVjdFRhZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyb2xlID09PSAneW91cnJvbGUnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3lvdXJDYW5ub24uc2hvb3QoY3RybC5hbmdsZSwgY3RybC5wb3dlciwgY3RybC5idWxsZXRUeXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlgZzmraLmuLjmiI9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdhbWVPdmVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0dXMgPT09IC0xKSByZXR1cm47XHJcblxyXG4gICAgICAgIExheWEudGltZXIuY2xlYXJBbGwodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIOS9v+e8k+WtmOS4reeahOWtkOW8ueeIhueCuFxyXG4gICAgICAgIEJ1bGxldC5ib29tQWxsQnVsbGV0cygpO1xyXG5cclxuICAgICAgICAvLyDmuIXnkIbmnKrlrozmiJDnmoTorqHml7blmajku7vliqFcclxuICAgICAgICBHYW1lLkluc3RhbmNlLnRpbWVyLmNsZWFyVGFza0xpc3QoKTtcclxuICAgICAgICBcclxuICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UubWJhbGxzID0gMDtcclxuICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UueWJhbGxzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMuY2xlYXJPYmplY3RzKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wQ29udHJvbCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb3VudGVyKSB0aGlzLmNvdW50ZXIuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF55CG5Zy65pmv5a+56LGh5ZKM5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhck9iamVjdHMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZUxpc3QpIHRoaXMuX3VwZGF0ZUxpc3QgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5fYnVsbGV0UHJvY2VzcykgdGhpcy5fYnVsbGV0UHJvY2Vzcy5yZW1vdmUoKTtcclxuICAgICAgICBpZiAodGhpcy5fdGltZXIpIHRoaXMuX3RpbWVyLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9iYWxsKSB0aGlzLl9iYWxsLnJlbW92ZVNlbGYoKTtcclxuICAgICAgICBpZiAodGhpcy5fbXlDYW5ub24pIHRoaXMuX215Q2Fubm9uLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl95b3VyQ2Fubm9uKSB0aGlzLl95b3VyQ2Fubm9uLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9wcHJvY2VzcykgdGhpcy5fcHByb2Nlc3MucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Rvb2xUYWdDb250YWluZXIpIHRoaXMuX3Rvb2xUYWdDb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2J0blN3aXRjaCkgdGhpcy5fYnRuU3dpdGNoLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9kYXNoTGluZSkgdGhpcy5fZGFzaExpbmUucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIFNjb3JlTWFuYWdlci5JbnN0YW5jZS5yZW1vdmVTY29yZVBhbmVsKCk7XHJcbiAgICB9XHJcbn0iLCJ2YXIgZ2xvYmFsID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzYyDmuLjmiI/ljLrln5/lt6bovrnnvJhcclxuICAgICAqL1xyXG4gICAgbGVmdEVkZ2U6IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNj5ri45oiP5Yy65Z+f5Y+z6L6557yYXHJcbiAgICAgKi9cclxuICAgIHJpZ2h0RWRnZTogMCxcclxuICAgIC8qKlxyXG4gICAgICog5ZCM5q2l6L6F5Yqp5YC8IDDvvJrkvb/nlKjlt7HmlrnlrZDlvLnov5vooYznorDmkp7mo4DmtYsgMe+8muebuOWPjVxyXG4gICAgICovXHJcbiAgICBzeW46IDBcclxufTtcclxuXHJcbi8qKlxyXG4gKiDmoIforrDmmL7npLrlsYLlr7nosaFcclxuKi9cclxudmFyIERpc3BsYXlOYW1lID0ge1xyXG4gICAgU3RhcnRQYWdlOiAnc3RhcnRwYWdlJyxcclxuICAgIEdhbWVQYWdlOiAnZ2FtZXBhZ2UnLFxyXG4gICAgTG9hZGluZzogJ2xvYWRpbmcnXHJcbn07XHJcblxyXG4vKipcclxuICog5pi+56S65bGC5o6S5bqP5bqP5Y+3XHJcbiAqL1xyXG52YXIgRGlzcGxheU9yZGVyID0ge1xyXG4gICAgQmFja2dyb3VuZDogMCxcclxuICAgIFN0YXJ0UGFnZTogMSxcclxuICAgIEdhbWVQYWdlOiAyLFxyXG4gICAgQmFja2dyb3VuZF9IOiAzLFxyXG4gICAgTG9hZGluZzogNSxcclxuICAgIEFzc2lzdExpbmU6IDEwLFxyXG4gICAgU2hhZG93OiAxNSxcclxuICAgIEJ1bGxldDogMTYsXHJcbiAgICBCdWxsZXRCb29tOiAxOCxcclxuICAgIEJhbGw6IDIwLFxyXG4gICAgU21va2U6IDIxLFxyXG4gICAgQ2Fubm9uOiAyMixcclxuICAgIEJ0blN3aXRjaDogMjUsXHJcbiAgICBUb29sQ29udGFpbmVyOiAyNixcclxuICAgIFBQcm9jZXNzOiAyNyxcclxuICAgIFByb2Nlc3NCYXI6IDI4LFxyXG4gICAgVGltZXI6IDI5LFxyXG4gICAgUmVzdWx0UGFnZTogMzAsXHJcbiAgICBDb3VudFRleHQ6IDMxLFxyXG4gICAgU2NvcmVQYW5lbDogMzIsXHJcbiAgICBNc2c6IDM1IFxyXG59O1xyXG5cclxudmFyIFRvb2wgPSB7XHJcbiAgICBTdGFuZGFyZEJ1bGxldDoge1xyXG4gICAgICAgIHRhZzogJ2J1bGxldCcsXHJcbiAgICAgICAgbmFtZTogJ+WtkOW8uSdcclxuICAgIH0sXHJcbiAgICBJY2VCdWxsZXQ6IHtcclxuICAgICAgICB0YWc6ICdpY2UnLFxyXG4gICAgICAgIG5hbWU6ICflhrDlvLknXHJcbiAgICB9LFxyXG4gICAgRGl2aXNpb25CdWxsZXQ6IHtcclxuICAgICAgICB0YWc6ICdkaXZpc2lvbicsXHJcbiAgICAgICAgbmFtZTogJ+WIhuijguW8uSdcclxuICAgIH0sXHJcbiAgICBTbW9rZUJ1bGxldDoge1xyXG4gICAgICAgIHRhZzogJ3Ntb2tlJyxcclxuICAgICAgICBuYW1lOiAn54Of6Zu+5by5J1xyXG4gICAgfSxcclxuICAgIEJvbWJCdWxsZXQ6IHtcclxuICAgICAgICB0YWc6ICdib21iJyxcclxuICAgICAgICBuYW1lOiAn54K45by5J1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqICDlhajlsYDotYTmupDlr7nosaFcclxuICovXHJcbnZhciBBc3NldHMgPSB7XHJcbiAgICBJbWc6IHtcclxuICAgICAgICBnYW1lYmc6ICdyZXMvZ2FtZWJnLnBuZycsXHJcbiAgICAgICAgY2Fubm9uX206ICdyZXMvY2Fubm9uX20ucG5nJyxcclxuICAgICAgICBjYW5ub25feTogJ3Jlcy9jYW5ub25feS5wbmcnLFxyXG4gICAgICAgIGNhbm5vbl9zaGFkb3c6ICdyZXMvY2Fubm9uX3NoYWRvdy5wbmcnLFxyXG4gICAgICAgIGJ1bGxldG06ICdyZXMvYnVsbGV0X20ucG5nJyxcclxuICAgICAgICBidWxsZXR5OiAncmVzL2J1bGxldF95LnBuZycsXHJcbiAgICAgICAgYnVsbGV0X2ljZTogJ3Jlcy9idWxsZXRfaWNlLnBuZycsXHJcbiAgICAgICAgYnVsbGV0X2RpdmlzaW9uOiAncmVzL2J1bGxldF9kaXZpc2lvbi5wbmcnLFxyXG4gICAgICAgIGJ1bGxldF9ib21iOiAncmVzL2J1bGxldF9ib21iLnBuZycsXHJcbiAgICAgICAgYnVsbGV0X3Ntb2tlOiAncmVzL2J1bGxldF9zbW9rZS5wbmcnLFxyXG4gICAgICAgIGJhbGw6ICdyZXMvYmFsbC5wbmcnLFxyXG4gICAgICAgIHByb2Nlc3M6ICdyZXMvcHJvY2Vzcy5wbmcnLFxyXG4gICAgICAgIHByb2Nlc3NCZzogJ3Jlcy9wcm9jZXNzYmcucG5nJyxcclxuICAgICAgICBzdGFydEJnOiAncmVzL3N0YXJ0YmcucG5nJyxcclxuICAgICAgICBtc2dCZzogJ3Jlcy9tc2diZy5wbmcnLFxyXG4gICAgICAgIHNjb3JlQmc6ICdyZXMvc2NvcmViZy5wbmcnLFxyXG4gICAgICAgIHRpbWVyQmc6ICdyZXMvdGltZXJiZy5wbmcnLFxyXG4gICAgICAgIHBwcm9jZXNzOiAncmVzL3Bwcm9jZXNzLnBuZycsXHJcbiAgICAgICAgcHByb2Nlc3NiZzogJ3Jlcy9wcHJvY2Vzc2JnLnBuZycsXHJcbiAgICAgICAgdG9vbHRhZ19pY2U6ICdyZXMvdG9vbHRhZ19pY2UucG5nJyxcclxuICAgICAgICB0b29sdGFnX2RpdmlzaW9uOiAncmVzL3Rvb2x0YWdfZGl2aXNpb24ucG5nJyxcclxuICAgICAgICB0b29sdGFnX3Ntb2tlOiAncmVzL3Rvb2x0YWdfc21va2UucG5nJyxcclxuICAgICAgICB0b29sdGFnX2J1bGxldDogJ3Jlcy90b29sdGFnX2J1bGxldC5wbmcnLFxyXG4gICAgICAgIHRvb2x0YWdfYm9tYjogJ3Jlcy90b29sdGFnX2JvbWIucG5nJyxcclxuICAgICAgICBidG5fc3dpdGNoX2JnOiAncmVzL2J0bl9zd2l0Y2hfYmcucG5nJyxcclxuICAgICAgICBidG5fc3dpdGNoX2NlbnRlcjogJ3Jlcy9idG5fc3dpdGNoX2NlbnRlci5wbmcnLFxyXG4gICAgICAgIGJhbGxfZWZmZWN0X2ljZTogJ3Jlcy9pY2UucG5nJ1xyXG4gICAgfSxcclxuICAgIEpzb246IHtcclxuICAgICAgICBzdGFydF9qc29uOiAncmVzL3N0YXJ0Lmpzb24nLFxyXG4gICAgICAgIHJlc3VsdF9qc29uOiAncmVzL1Jlc3VsdFBhZ2UuanNvbicsXHJcbiAgICAgICAgYmx1ZV9ib29tOiAncmVzL2JsdWVib29tLmpzb24nLFxyXG4gICAgICAgIHJlZF9ib29tOiAncmVzL3JlZGJvb20uanNvbicsXHJcbiAgICAgICAgZ3JlZW5fYm9vbTogJ3Jlcy9ncmVlbmJvb20uanNvbicsXHJcbiAgICAgICAgYm9vbTogJ3Jlcy9ib29tLmpzb24nLFxyXG4gICAgICAgIHNtb2tlOiAncmVzL3Ntb2tlLmpzb24nXHJcbiAgICB9LFxyXG4gICAgU291bmQ6IHtcclxuICAgICAgICBoaXRfMDAxOiAncmVzL3NvdW5kcy9oaXQwMDEubXAzJyxcclxuICAgICAgICBoaXRfMDAyOiAncmVzL3NvdW5kcy9oaXQwMDIubXAzJyxcclxuICAgICAgICBib29tXzAwMTogJ3Jlcy9zb3VuZHMvYm9vbTAwMS5tcDMnLFxyXG4gICAgICAgIGJvb21fMDAyOiAncmVzL3NvdW5kcy9ib29tMDAyLm1wMycsXHJcbiAgICAgICAgYm9vbV8wMDM6ICdyZXMvc291bmRzL2Jvb20wMDMubXAzJyxcclxuICAgICAgICBidXR0b25fMDAxOiAncmVzL3NvdW5kcy9idXR0b24wMDEubXAzJyxcclxuICAgICAgICBzaG9vdDogJ3Jlcy9zb3VuZHMvc2hvb3QubXAzJyxcclxuICAgICAgICBzbW9rZTogJ3Jlcy9zb3VuZHMvc21va2UubXAzJyxcclxuICAgICAgICBmcm96ZW46ICdyZXMvc291bmRzL2Zyb3plbi5tcDMnLFxyXG4gICAgICAgIGZpbmRtYXRjaDogJ3Jlcy9zb3VuZHMvZmluZG1hdGNoLm1wMycsXHJcbiAgICAgICAgY291bnRlcjogJ3Jlcy9zb3VuZHMvY291bnRlci5tcDMnLFxyXG4gICAgICAgIGdhbWVzdGFydDogJ3Jlcy9zb3VuZHMvZ2FtZXN0YXJ0Lm1wMycsXHJcbiAgICAgICAgZ2FtZXdpbjogJ3Jlcy9zb3VuZHMvZ2FtZXdpbi5tcDMnLFxyXG4gICAgICAgIGdhbWVvdmVyOiAncmVzL3NvdW5kcy9nYW1lb3Zlci5tcDMnLFxyXG4gICAgICAgIG1zY29yZTogJ3Jlcy9zb3VuZHMvbXNjb3JlLm1wMycsXHJcbiAgICAgICAgeXNjb3JlOiAncmVzL3NvdW5kcy95c2NvcmUubXAzJ1xyXG4gICAgfSxcclxuICAgIGZvbnQ6IHtcclxuICAgICAgICBudW06ICdyZXMvbnVtZm9udC5mbnQnXHJcbiAgICB9XHJcbn0iLCJjb25zdCBMb2FkaW5nQXR0ciA9IHtcclxuICAgIHdpZHRoOiAzMDAsXHJcbiAgICBoZWlnaHQ6IDI4XHJcbn07XHJcblxyXG5jb25zdCBiYXNlNjQgPSB7XHJcbiAgICBsb2FkaW5nOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUFjQ0FZQUFBRGJjSUpzQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUJ4MUpSRUZVZU5yc1hFdHlHemNRUmM5UVZKWStnbk1EbDNXQUtEZVFUeEI3bjFTY1pWSVZTZDVFMlRrdTZRQzZnWjBUbUQ0QWZZWGtDRnFMSEx3QW1BK0g1QXcramFFanVmcVZJTEZJRFFiZDZIbm9iamFnbEVBZ0VBZ0VBb0ZBSUJBSUJBS0JRUEN3UWFrWFBMKytPbE5FMzVuMnpMU3VFd3gwUmVaZDc0MTdIK3ZvZ1FXR0RQQ1ZBYWFpTUNZRHdzcVBIQzU2L2JQSDZSa1ROYXJUaWVPazZOSFh2ekdodm9mZXhxQWxocS9OZWtpNE5nZlBXK0ROWStoYWpIeE1qTEY2L3pVa2lOV1orOEVuODNyeCtmeHlNU2xoR2FKNnJhaTRVTFB5Q1JXbFVtVmgrS3BvZWpDL0RIbFJrdEZ0QzZJVHpJZkFzdzZBcjR6UVBURkVXRGxHTndBZE0zNjJqTFVCNlluMTBwY1JPekxRbEN0cEJHOFFrRDMzU0h5YVUwbFpNMGsxVmtiTkpLU1EzWXgydGZjWkdyS0NNd2JBakVoWENsWDFyOUw2MWZMaXpTS0xzSjVmLzJFSXFuaVBvanlsb3lORjVjeTAwbkJYVVRkTFZFVDczVkdhNHZXQUhzaWpWK0tzdnNoWVFnS0dON3h5aGZ1a2hJY3hScDFoN3dKK0daRDZnTVNQU2U5NVdQa0VNcXh0Sk9zN2hiQlNQT25VeFJYUjVBRVdRV29HMGFYT1J6dlBOTVJjc0NRRmR6OW83Wm9sTEwxZUs2eFg1clgrYTNsKytRdkx2aDFabGJPUE5KczlVNWFzWmtlcU1HUlZPTkpxUGF5YXNKeC9SU2xjdUcwRktSNldZaElQTzFxTXZGQm5ySXdoQTBKa3VFQ0tMK05ZdUtBeTVhS2VmaER6b0lQcFlUVlRSUnl2TnBMTTlNREM4WmdJYTJ6aG8wUjc5RjJyaDRSQkU2NjNrMlE4SzNMZWxiYmVWVWRZcmxYVjdmTDNpMWZKOW4xeTgrZGJtczlmRi9PNVVwYXNYRE9FWlVKQzYyVjFaRVh0bEpFaVNuY3prUkNLZ0duUVdSNVdwTkhwQStiVDRuSllpSHdpRW1RSVhvTm9PZmE4RXhieElwREQ4bnZmeEpBajdHRnh3a0Y0RnoxS3RJLytDQ2xkZFpQZXJ5VjFHbnNlbXBDUWRFMVlocTBNVWExcjBscXRsRjdkSzFWVkw1Ym5GeCtpeDNseWZYVktzL0lqSFgranl2bHhRMWd6NTJIVklXRk5XUDNjRlJGRkIzQkJJd0JHMWNNTEZ4RDA0bGk1c2Q0NDlaU2VDWHhrZ21sbDZIV3BKM1ZOOXh6cFNKV0FsZVFQaHMzTUR5a2dBL2xJS1ZHT0dDODlKNVRtSjkwUmZUOWdoTXpRWmJGcXdrSkxXS1k1NzhxUWxpRXNHTUxTOS9kM0psVDhkbm54NXE3ZlJURTZ3SUorVmpiMHN5VGxXcmtocTUwY1ZrdGM2RTBvT25GbzR0Z2xOekNadXRzdkxzaWpVczhYSFF3OUxCbkI4dWNlbDgzQit6NDVIWFROY29STEk5WHBKT2YwdUdiZWEzUGptL2JFL05QWkhpMTVsSEptTzNUaFgxRjMzaWVycitaQkZRZ0UvOE9hVkpPWTQ1S1d0QnF1NmY0Uy9SQkZXQ2MzSmh5MFROaDZVVnZlVlBIUWxtT0JRUEJJQWJXSjBGeDZxZUVhVlJQV2FSUmhVZHRKUWUyRlhlZ25qcFZBSUpqVzJkb21yYTNLZytpUThPRW5PZ1FDd2RmZ1pTVWs5SXBoTjYxSm16ZjFFbTJ4VjB5MXVFQWdFS1M1UUwzcTk2YkIxUVVpanJDV1AvNjZjTit2dWtyVWhxemFxbFRzMWlzTEJBSUIyNy9hSnlwWDZ1QnFNQmJSSWFHNThBT3F1Z3JWVmFKMlpmUTFpUWxwQ1FTQ3JEaXdJNmVxcWNlcXVhYm1tTW82UjMvdlhqWWI3MUMvVTlYNlRGZHJSVlhwNmlac0hZWDFyMXpoR3NvNktiK1RHcU9kVXZmWVBYK3gyVEVLOVJ1OE5tNDgwUjhlaUxkM0s2RVJJd2N5RGVpZ2JyOGFkUEhINUdCbFM1RTNWNXg5aGtOekZTdUhyMHFMTXZUamt3Tk01YVRjRDBQUGFhK1lGTTAyTUdvanRzcTJkZWNjd2I3VzFaMzVwOXVrdVRpNXVmcEk4K05UbXMvcmZZVE5Ya0piaTFWc3ZucFUxT3NxK2x2RWdRMlRVeng4dm8yeE92REE4aCtTa1FyaWlRbEVKK28weWZBYUk5SUpPazJWSTlvdkIvKzBodER4TXBSNXZNelFOakxma1QyOFNuZXdhMkNEbTU4VEt0WlQrdDIxVTZpQml2emRyVGx0cFh2VjI1cXpYcmxxZC9QZW0rWDU1V1c4aDFXSGhTL1VhdldQZWZrRTNaRVFockJNdzZhNGF6UGd2YThpa1dCb0NlYkQ4QVp5OXhKU2hBeXBSN09reURITjVtZi9seVpqT2dLWEJBT0VsYnVOS1BWakF0aDc2WHkyTU9VbTdyalRMekk4Zmt5c1ZKOCsrd2FMN2IrdGQrVkNRcHR5YWttckpxdkZFRmtGQ2V2elQ3L2RuVnhmZlc5STY3MGhyS2VWNlZ5WHpYN0NmakZwT3kyVU12WG9KaWN0SThZa3JJbjM5UTE5cUE5d05NdWdoOFhjU3haelR5UmY0dy8weU5NNW1Qck9DWmNPWWlEZ1hVTytBNGx3V0Z1ZGxLOUdGem5zSHpIVHJJcTZxVUJvQ2N0NVZvYTB6T3VGc281U3pzSmlqNWt4N1BUV2hJQXY3WGxZN3ZDK29zNWhkUjRWRVh2VlNqdUh5UitKRTZhNFIySytBV21iWXJtRWhlQjE0TXVCeUxCendHdUpEcWQyNW9DVjMvR0U3akhIeS9CQ0hrWll5OHcxNllqelpZaDcySjduQ0tISlRoeEYvM3haRlR6QXp5WGE2eVQ3blFrUDM0MTVWc21lc010cFhWODlCZEhMNW9qazArMEVPN0Z2a0VzbTArUmJrSFgwOENCaFplYVV4dnFuQXhBdk5lRWltRVFYYzA4ZEhSS0NmVVR5VlBwT3VYM3VLUjhjRDR1YmIyVW4zWkVtMnZnNUxadlRHa3l6aWZVRm9EK1pkMjQvbjEvZUtZRkFJQkFJQkFLQlFDQVFDQVFDZ2VDUjR6OEJCZ0JqT2Z1OEsrRlZZZ0FBQUFCSlJVNUVya0pnZ2c9PScsXHJcbiAgICBsb2FkaW5nQmc6ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVN3QUFBQWNDQVlBQUFEYmNJSnNBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQWJwSlJFRlVlTnJzM2Q4eEExRVVCK0NOTjNsU1FsUkFDZEVCRllnS1JBVkdCZWlBQ3VoQU9oQVZXQlh3RksvT2xadVJtRVg4emMzNHZwa3pZZXprNFR6ODV0NjFlMCtyK29USDBhZ1RINXU1QUg3Q0lHcTQybTQvZkhSaGE0NlFXb3VQZnRSdVZFZHZnVjh5akRxTjREcjdVbUJGV0tXZ09veGEwMHZnajlSUmV4RmNnN2tDSzYrcUxxSzZlZ2NzeUVtRTFzRzdnWlhENnFweW53cFl2TE1JcmIzSkx5c05Gd2dyb0JTOVdFUWROd1pXL29Pd0FrclNqMnphbnRrUzVrY1didlVHS0ZBZFc4UDE2UlhXb1o0QWhlckVvcXJYeXF1cmRLUDlYaytBZ2cwbks2eHR2UUFLdHprSnJBMjlBRW8zQ1N6L0dRU1dKckFBQkJhQXdBTCtiV0RWV2dFc1MyRGRhQVd3TElGMXFSVkE0ZXJud0ZwdHQ5T1djS0FmUU1IT3AxOSs3bGJqbzJVQVNwUE9lMzk1K1RrZlIycHJDSlRvS0EycG1EbHhOTDhFZlYwWk5nR1U0ekxDYWlmOU1QTWNWaDZ6czVPWFh3Q0xsaWJwdkgxRWNvUld1bUFyWHdpd3NKVlZ5cUxwZVlXTlQ3cFBoZGFKbmdGL0xBWFVRZG9Hdmg2dU9zOGcxWFNTdzM1VVR4K0JYdzZxMDJvODNxdnh0bFJyM20vS04rUzcxZmdvbW5SK2x1R3F3SGZWVVhkUmc2YkJxYTg5Q1RBQVBwMWphVXk4SFo4QUFBQUFTVVZPUks1Q1lJST0nXHJcbn07XHJcblxyXG4vKipcclxuICog5Yqg6L296aG16Z2iXHJcbiAqL1xyXG5jbGFzcyBMb2FkaW5nIHtcclxuICAgIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgYmc6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwcm9jZXNzOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAvLyDov5vluqbnjodcclxuICAgIHB1YmxpYyBwZXJjZW50OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGVyY2VudCA9IDA7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmlkID0gJ2xvYWRpbmctY29udGFpbmVyJztcclxuXHJcbiAgICAgICAgdGhpcy5iZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuYmcuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuYmcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgIHRoaXMuYmcuc3R5bGUud2lkdGggPSBMb2FkaW5nQXR0ci53aWR0aCArICdweCc7XHJcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5oZWlnaHQgPSBMb2FkaW5nQXR0ci5oZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIHRoaXMuYmcuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5sZWZ0ID0gJzAnO1xyXG4gICAgICAgIHRoaXMuYmcuc3R5bGUucmlnaHQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5tYXJnaW5Ub3AgPSAnMjBweCc7XHJcbiAgICAgICAgdGhpcy5iZy5zdHlsZS5iYWNrZ3JvdW5kID0gJ3VybCgnICsgYmFzZTY0LmxvYWRpbmdCZyArICcpJztcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzLnN0eWxlLndpZHRoID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzLnN0eWxlLmhlaWdodCA9IExvYWRpbmdBdHRyLmhlaWdodCArICdweCc7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIGJhc2U2NC5sb2FkaW5nICsgJyknO1xyXG5cclxuICAgICAgICB0aGlzLnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLnRleHQuaW5uZXJIVE1MID0gJ+a4uOaIj+i1hOa6kOWKoOi9veS4rS4uLicgKyB0aGlzLnBlcmNlbnQgKyAnJSc7XHJcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLnRleHQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS53aWR0aCA9IExvYWRpbmdBdHRyLndpZHRoICsgJ3B4JztcclxuICAgICAgICB0aGlzLnRleHQuc3R5bGUuaGVpZ2h0ID0gTG9hZGluZ0F0dHIuaGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICB0aGlzLnRleHQuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5jb2xvciA9ICcjZmZmZmZmJztcclxuICAgICAgICB0aGlzLnRleHQuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICAgICAgdGhpcy50ZXh0LnN0eWxlLmZvbnRTaXplID0gJzI2cHgnO1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5mb250RmFtaWx5ID0gJ2N1cnNpdmUnO1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTMwcHgnO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJnKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRleHQpO1xyXG4gICAgICAgIHRoaXMuYmcuYXBwZW5kQ2hpbGQodGhpcy5wcm9jZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9rui/m+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UHJvY2VzcyhwZXJjZW50OiBudW1iZXIpIHtcclxuICAgICAgICBpZihwZXJjZW50IDwgMCkgcGVyY2VudCA9IDA7XHJcbiAgICAgICAgaWYocGVyY2VudCA+IDEpIHBlcmNlbnQgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLnBlcmNlbnQgPSBwZXJjZW50O1xyXG4gICAgICAgIHRoaXMucHJvY2Vzcy5zdHlsZS53aWR0aCA9IExvYWRpbmdBdHRyLndpZHRoICogcGVyY2VudCArICdweCc7XHJcbiAgICAgICAgdGhpcy50ZXh0LmlubmVySFRNTCA9ICfmuLjmiI/otYTmupDliqDovb3kuK0uLi4nICsgTWF0aC5yb3VuZCh0aGlzLnBlcmNlbnQgKiAxMDApKyAnJSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDlgJLorqHml7ZcclxuICovXHJcbmNsYXNzIENvdW50RG93biBleHRlbmRzIGxheWEuZGlzcGxheS5UZXh0e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG51bTogbnVtYmVyLCBjYjogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZm9udCA9ICdkaXlmb250JztcclxuICAgICAgICB0aGlzLnRleHQgPSBudW0udG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLnBpdm90KHRoaXMud2lkdGgvMiwgdGhpcy5oZWlnaHQvMik7XHJcbiAgICAgICAgdGhpcy5wb3MoY29uZmlnLmdhbWVXaWR0aC8yLCBjb25maWcuZ2FtZUhlaWdodC8yIC0gMTApO1xyXG4gICAgICAgIHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLkNvdW50VGV4dDtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRlQ291bnQoMywgY2IpO1xyXG5cclxuICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5jb3VudGVyLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGVDb3VudChudW06IG51bWJlciwgY2IpIHtcclxuICAgICAgICBcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwMCwgdGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgICBudW0tLTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IG51bS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYobnVtIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBjYi5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgU291bmRNYW5hZ2VyLnN0b3BTb3VuZChBc3NldHMuU291bmQuY291bnRlcik7XHJcbiAgICAgICAgICAgICAgICBTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5nYW1lc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVDb3VudChudW0sIGNiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcCgpIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vR2FtZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9nYW1lb2JqZWN0L0NvdW50RG93bi50c1wiIC8+XHJcblxyXG5jbGFzcyBTb2NrZXQge1xyXG4gICAgcHJpdmF0ZSBfc29ja2V0O1xyXG4gICAgcHJpdmF0ZSBnYW1lOiBHYW1lO1xyXG4gICAgcHJpdmF0ZSB1aWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBfbU5hbWU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBfeU5hbWU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBfYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBpby5jb25uZWN0KGNvbmZpZy5zb2NrZXRTZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBTb2NrZXQ7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpOiBTb2NrZXQge1xyXG4gICAgICAgIGlmIChTb2NrZXQuaW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBTb2NrZXQuaW5zdGFuY2UgPSBuZXcgU29ja2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTb2NrZXQuaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj5blvpfnlKjmiLdpZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VWlkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVpZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbU5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB5TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feU5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNvY2tldCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc29ja2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Y+W5b6X5b2T5YmN5ri45oiPXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDdXJyZW50R2FtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55uR5ZCsc29ja2V05LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0TGlzdGVuKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvLyDmuLjmiI/ov5vnqIvnu5PmnZ/lubbmmL7npLrov57mjqXmlq3lvIDkv6Hmga9cclxuICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS5nYW1lT3ZlcigpO1xyXG5cclxuICAgICAgICAgICAgTXNnTWFuYWdlci5JbnN0YW5jZS5zaG93TWVzc2FnZSgn5LiO5pyN5Yqh5Zmo5pat5byA6L+e5o6lJywgMzApO1xyXG5cclxuICAgICAgICAgICAgLy8gc29ja2V054q25oCB5pS55Y+YXHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWVudCBkaXNjb25uZWN0Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdF9lcnJvcicsIChlcnJvcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNvY2tldOa/gOa0u+eKtuaAgeS4i+aYvuekuuS/oeaBr1xyXG4gICAgICAgICAgICAgICAgTXNnTWFuYWdlci5JbnN0YW5jZS5zaG93TWVzc2FnZSgn6L+e5o6l5pyN5Yqh5Zmo5aSx6LSlJywgMzApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNvY2tldOeKtuaAgeaUueWPmFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOeZu+W9leaIkOWKn1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbigndXNlcjpsb2dpblN1Y2Nlc3MnLCAoZGF0YTogeyB1aWQ6IHN0cmluZywgdXNlcm5hbWU6IHN0cmluZyB9KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudWlkID0gZGF0YS51aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX21OYW1lID0gZGF0YS51c2VybmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbiBzdWNjZXNzJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOaIv+mXtOWIm+W7uuaIkOWKn1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbigncm9vbTpjcmVhdGVkJywgKGRhdGE6IHsgb3Bwb25lbnQ6IHN0cmluZywgYmFsbERpcmVjdGlvbjogbnVtYmVyIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZSByb29tIHN1Y2Nlc3MnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZSA9IEdhbWUuSW5zdGFuY2U7XHJcblxyXG4gICAgICAgICAgICAvLyDliJ3lp4vljJblkIzmraXovoXliqnlgLxcclxuICAgICAgICAgICAgZ2xvYmFsLnN5biA9IGRhdGEuYmFsbERpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgICAgIC8vIOWtmOWCqOWvueaWueWQjeWtl1xyXG4gICAgICAgICAgICB0aGlzLl95TmFtZSA9IGRhdGEub3Bwb25lbnQ7XHJcblxyXG4gICAgICAgICAgICAvLyDmmL7npLrmib7liLDmr5TotZtcclxuICAgICAgICAgICAgTXNnTWFuYWdlci5JbnN0YW5jZS5zZXRUZXh0KCfmib7liLDmr5TotZsnKTtcclxuXHJcbiAgICAgICAgICAgIFNvdW5kTWFuYWdlci5wbGF5U291bmQoQXNzZXRzLlNvdW5kLmZpbmRtYXRjaCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY2xlYXJVcGRhdGVMaXN0KCk7XHJcblxyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMjAwMCwgdGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRSZWFkeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIOa4uOaIj+S4u+imgeW4p+aVsOaNrlxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZnJhbWU6dXBkYXRlJywgKHVwZGF0ZTogRnJhbWVQYWNrKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wdXNoVXBkYXRlRGF0YSh1cGRhdGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2dhbWU6c3RhcnQnLCAoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgLy8g5Y675o6J5raI5oGv5pi+56S65qGGXHJcbiAgICAgICAgICAgIE1zZ01hbmFnZXIuSW5zdGFuY2UucmVtb3ZlTWVzc2FnZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyDlvIDlp4vmuLjmiI/pgLvovpFcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5pbml0U2NlbmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5iYWxsRGlyZWN0aW9ucyA9IGRhdGEuZGlyZWN0aW9ucztcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5iYWxsRGlyZWN0aW9uRmFjdG9yID0gZGF0YS5pZCA9PT0gdGhpcy51aWQgPyAxIDogMDtcclxuICAgICAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSB0aGlzLmdhbWUuZ2V0QmFsbERpcmVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmluaXRCYWxsKHRoaXMuZ2FtZS5iYWxsRGlyZWN0aW9uRmFjdG9yID8gZGlyZWN0aW9uIDogMSAtIGRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g56e76Zmk5YWo5bGA6IOM5pmvXHJcbiAgICAgICAgICAgICAgICBNYWluLkluc3RhbmNlLnJlbW92ZUJhY2tncm91bmQoKTtcclxuICAgICAgICAgICAgICAgIC8vIOW8gOWni+WAkuiuoeaXtlxyXG4gICAgICAgICAgICAgICAgTWFpbi5JbnN0YW5jZS5nYW1lUGFnZS5hZGRDaGlsZChHYW1lLkluc3RhbmNlLmdldENvdW50ZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0dXMgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5pbml0Q29udHJvbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGFydExvb3AoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOaOpeaUtueQg+eahOaWueWQkVxyXG4gICAgICAgIC8vIHRoaXMuX3NvY2tldC5vbignZ2FtZTpiYWxsZGlyZWN0aW9uJywgKGRhdGEpID0+IHtcclxuICAgICAgICAvLyAgICAgLy8gbGV0IGRpcmVjdGlvbiA9IGRhdGEuaWQgPT09IHRoaXMudWlkID8gZGF0YS5kaXJlY3Rpb24gOiAoMSAtIGRhdGEuZGlyZWN0aW9uKTtcclxuICAgICAgICAvLyAgICAgLy8gR2FtZS5JbnN0YW5jZS5iYWxsLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuICAgICAgICAvLyB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIOWIhuaVsOi/m+i0puaYvuekulxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZ2FtZTpzY29yZWluJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNjb3JlcyA9IGRhdGEuc2NvcmVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGEuaWQgPT09IHRoaXMudWlkKSB7XHJcbiAgICAgICAgICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2Uuc2V0U2NvcmVzKCdtaW5lJywgeyBleHBsb3Npb25zOiBzY29yZXMuZXhwbG9zaW9ucywgYmFsbHM6IHNjb3Jlcy5iYWxscywgc2NvcmU6IHNjb3Jlcy5zY29yZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFNjb3JlTWFuYWdlci5JbnN0YW5jZS5zZXRTY29yZXMoJ3lvdXInLCB7IGV4cGxvc2lvbnM6IHNjb3Jlcy5leHBsb3Npb25zLCBiYWxsczogc2NvcmVzLmJhbGxzLCBzY29yZTogc2NvcmVzLnNjb3JlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOacgOe7iOWIhuaVsFxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZ2FtZTpzY29yZXMnLCAoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgLy8g5pyJ546p5a6256a757q/IOi/m+WFpea4uOaIj+e7k+eul+mYtuautVxyXG4gICAgICAgICAgICBpZiAoZGF0YS5tc2cpIHtcclxuICAgICAgICAgICAgICAgIC8vIOe7k+adn+a4uOaIj+i/m+eoi1xyXG4gICAgICAgICAgICAgICAgR2FtZS5JbnN0YW5jZS5nYW1lT3ZlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIE1zZ01hbmFnZXIuSW5zdGFuY2Uuc2hvd01lc3NhZ2UoZGF0YS5tc2csIDI4LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCwgdGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnJlbW92ZU1lc3NhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnNob3dHYW1lUmVzdWx0KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29wcG9uZW50IGxlYXZlIHJvb20uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBHYW1lLkluc3RhbmNlLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoR2FtZS5JbnN0YW5jZS50aW1lci5pc1RpbWVvdXQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIE1zZ01hbmFnZXIuSW5zdGFuY2Uuc2hvd01lc3NhZ2UoJ+aXtumXtOWIsO+8jOavlOi1m+e7k+adnycsIDMwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAwLCB0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnJlbW92ZU1lc3NhZ2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNjb3JlTWFuYWdlci5JbnN0YW5jZS5zaG93R2FtZVJlc3VsdChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnNob3dHYW1lUmVzdWx0KGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZ2FtZTplcnJvcicsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubXNnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdzeXM6bXNnJywgKGRhdGE6IHsgbXNnOiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3lzdGVtIG1lc3NhZ2U6ICcgKyBkYXRhLm1zZyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdF90aW1lb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY29ubmVjdCB0aW1lb3V0Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbigncmVjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpZW50IHJlY29ubmVjdCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGllbnQgY29ubmVjdGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJrov4fnlKjmiLflkI3nmbvlvZVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxvZ2luKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCd1c2VyOmxvZ2luJywgeyBuYW1lOiBuYW1lIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+75om+5q+U6LWbXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtYXRjaCgpIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgncm9vbTptYXRjaCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YeG5aSHXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSZWFkeSgpIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgndXNlcjpyZWFkeScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Y+R6YCB5pON5L2cXHJcbiAgICAgKiBAcGFyYW0gY3RybERhdGEg5pON5L2c5pWw5o2uIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VuZEN0cmwoY3RybERhdGE6IEN0cmxEYXRhKSB7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ3VzZXI6Y3RybCcsIHsgaWQ6IHRoaXMudWlkLCBjdHJsOiBjdHJsRGF0YSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOW8ueeIhueCuOW+l+WIhlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2F1c2VFeHBsb3Npb24oKSB7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ2dhbWU6c2NvcmVpbicsIHsgaWQ6IHRoaXMudWlkLCB0eXBlOiAnYnVsbGV0RXhwbG9zaW9uJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/m+eQg+W+l+WIhlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYmFsbEluKCkge1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdnYW1lOnNjb3JlaW4nLCB7IGlkOiB0aGlzLnVpZCwgdHlwZTogJ2JhbGxpbicgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgIDlh7rmiL/pl7RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxlYXZlUm9vbSgpIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgncm9vbTpsZWF2ZScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3VpLnRzXCIgLz5cclxuXHJcbmNsYXNzIFN0YXJ0UGFnZSBleHRlbmRzIHVpLnN0YXJ0VUkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IERpc3BsYXlOYW1lLlN0YXJ0UGFnZTtcclxuXHRcdHRoaXMuek9yZGVyID0gRGlzcGxheU9yZGVyLlN0YXJ0UGFnZTtcclxuXHRcdHRoaXMucG9zKGdsb2JhbC5sZWZ0RWRnZSwgMCk7XHJcblx0XHR0aGlzLmJ0bk1hdGNoLm9uKExheWFFdmVudC5DTElDSywgdGhpcywgdGhpcy5vbkJ0bk1hdGNoKTtcclxuXHRcdHRoaXMuYnRuSm9pblJvb20ub24oTGF5YUV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLm9uQnRuSm9pblJvb20pO1xyXG5cdFx0dGhpcy5idG5DcmVhdGVSb29tLm9uKExheWFFdmVudC5DTElDSywgdGhpcywgdGhpcy5vbkJ0bkNyZWF0ZVJvb20pO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkJ0bk1hdGNoKCkge1xyXG5cdFx0U291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuYnV0dG9uXzAwMSk7XHJcblx0XHRcclxuXHRcdC8vIOa4heeQhueVjOmdolVJXHJcblx0XHRUd2Vlbi50byh0aGlzLCB7YWxwaGE6IDB9LCAyMDAsIG51bGwsIEhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHJcblx0XHRcdHRoaXMuYWxwaGEgPSAxO1xyXG5cclxuXHRcdFx0Ly8g5pi+56S6562J5b6F55WM6Z2iXHJcblx0XHRcdE1zZ01hbmFnZXIuSW5zdGFuY2Uuc2hvd01lc3NhZ2UoJ+Wvu+aJvuavlOi1m+S4rScpO1xyXG5cdFx0XHRNc2dNYW5hZ2VyLkluc3RhbmNlLnNob3dUaXBzKCfog5zliKnmnaHku7ZcXG4oMSku6L+b55CD5pWw6L6+5YiwMTDkuKpcXG4oMiku5pyA57uI5YiG5pWw5pu06auYJyk7XHJcblxyXG5cdFx0XHQvLyDlvIDlp4vor7fmsYLljLnphY1cclxuXHRcdFx0U29ja2V0Lkluc3RhbmNlLm1hdGNoKCk7XHJcblx0XHR9KSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uQnRuSm9pblJvb20oKSB7XHJcblx0XHRTb3VuZE1hbmFnZXIucGxheVNvdW5kKEFzc2V0cy5Tb3VuZC5idXR0b25fMDAxKTtcclxuXHRcdGFsZXJ0KCfmiL/pl7Tlip/og73lsJrmnKrkuIrnur8nKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25CdG5DcmVhdGVSb29tKCkge1xyXG5cdFx0U291bmRNYW5hZ2VyLnBsYXlTb3VuZChBc3NldHMuU291bmQuYnV0dG9uXzAwMSk7XHJcblx0XHRhbGVydCgn5oi/6Ze05Yqf6IO95bCa5pyq5LiK57q/Jyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlKCkge1xyXG5cdFx0dGhpcy5yZW1vdmVTZWxmKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzYWJsZUJ0bigpIHtcclxuXHRcdHRoaXMuYnRuTWF0Y2gub2ZmQWxsKCk7XHJcblx0fVxyXG59IiwiaW50ZXJmYWNlIFBvaW50IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxufVxyXG5cclxubW9kdWxlIFV0aWxzIHtcclxuICAgIC8qKlxyXG4gICAgICog5pi+56S6562J5b6F55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzaG93TG9hZGluZygpIHtcclxuICAgICAgICB2YXIgdGV4dDogTGF5YVRleHQgPSBuZXcgTGF5YVRleHQoKTtcclxuXHRcdFx0XHJcbiAgICAgICAgdGV4dC5uYW1lID0gRGlzcGxheU5hbWUuTG9hZGluZztcclxuICAgICAgICB0ZXh0LmNvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgdGV4dC5mb250ID0gXCJJbXBhY3RcIjtcclxuICAgICAgICB0ZXh0LmZvbnRTaXplID0gNTA7XHJcbiAgICAgICAgdGV4dC50ZXh0ID0gXCJmaW5kaW5nIG1hdGNoLi4uLi4uXCI7XHJcbiAgICAgICAgdGV4dC54ID0gTGF5YS5zdGFnZS53aWR0aC8yIC0gdGV4dC53aWR0aC8yO1xyXG4gICAgICAgIHRleHQueSA9IExheWEuc3RhZ2UuaGVpZ2h0LzIgLSB0ZXh0LmhlaWdodC8yO1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm5Y+R55Sf56Kw5pKeXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc1JlY3RhbmdsZUNvbGxpc2lvbihvYmplY3RBLCBvYmplY3RCKSB7XHJcbiAgICAgICAgdmFyIHhEaXMgPSBNYXRoLmFicyhvYmplY3RBLnggLSBvYmplY3RCLngpO1xyXG4gICAgICAgIHZhciB5RGlzID0gTWF0aC5hYnMob2JqZWN0QS55IC0gb2JqZWN0Qi55KTtcclxuXHJcbiAgICAgICAgaWYgKHhEaXMgPD0gKG9iamVjdEEud2lkdGggKyBvYmplY3RCLndpZHRoKSAvIDIgJiZcclxuICAgICAgICAgICAgeURpcyA8PSAob2JqZWN0QS5oZWlnaHQgKyBvYmplY3RCLmhlaWdodCkgLyAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3kuKTkuKrlnIbkuYvpl7TmmK/lkKbnorDmkp5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzQ2lyY2xlQ29sbGlzaW9uKGNpcmNsZUEsIGNpcmNsZUIpIHtcclxuICAgICAgICBsZXQgcmMgPSBNYXRoLnNxcnQoTWF0aC5wb3coY2lyY2xlQS54IC0gY2lyY2xlQi54LCAyKSArIE1hdGgucG93KGNpcmNsZUEueSAtIGNpcmNsZUIueSwgMikpO1xyXG5cclxuICAgICAgICBpZihyYyA8PSAoY2lyY2xlQS5yYWRpdXMgKyBjaXJjbGVCLnJhZGl1cykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuoeeul+WPjeW8ueWQjuS4pOWwj+eQg+eahOi/kOWKqOaWueWQkVxyXG4gICAgICogQHBhcmFtIHBvc0Eg5bCP55CDQeeahOS9jee9rlxyXG4gICAgICogQHBhcmFtIHBvc0Ig5bCP55CDQueahOS9jee9rlxyXG4gICAgICogQHBhcmFtIHZBIOWwj+eQg0HnmoTpgJ/luqZcclxuICAgICAqIEBwYXJhbSB2QiDlsI/nkINC55qE6YCf5bqmXHJcbiAgICAgKiBAY29udmVydCDlkIzmraXorqHnrpfovoXliqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbXBCYWxsUmVib3VuZChwb3NBOiBQb2ludCwgcG9zQjogUG9pbnQsIHZBOiB7dng6bnVtYmVyLCB2eTpudW1iZXJ9LCB2Qjoge3Z4Om51bWJlciwgdnk6bnVtYmVyfSwgY29udmVydDpib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZihjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgIHBvc0EueCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gcG9zQS54KTtcclxuICAgICAgICAgICAgcG9zQS55ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lSGVpZ2h0IC0gcG9zQS55KTtcclxuICAgICAgICAgICAgcG9zQi54ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lV2lkdGggLSBwb3NCLngpO1xyXG4gICAgICAgICAgICBwb3NCLnkgPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVIZWlnaHQgLSBwb3NCLnkpO1xyXG4gICAgICAgICAgICB2QS52eCAqPSAtMTtcclxuICAgICAgICAgICAgdkEudnkgKj0gLTE7XHJcbiAgICAgICAgICAgIHZCLnZ4ICo9IC0xO1xyXG4gICAgICAgICAgICB2Qi52eSAqPSAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYyA9IFV0aWxzLnBMZW5ndGgocG9zQSwgcG9zQik7XHJcbiAgICAgICAgbGV0IGF4ID0gcmMgPT09IDA/IDAgOiAoKHZBLnZ4IC0gdkIudngpKk1hdGgucG93KChwb3NBLnggLSBwb3NCLngpICwgMikgKyAodkEudnkgLSB2Qi52eSkqKHBvc0EueCAtIHBvc0IueCkqKHBvc0EueSAtIHBvc0IueSkpL01hdGgucG93KHJjICwgMik7XHJcbiAgICAgICAgbGV0IGF5ID0gcmMgPT09IDA/IDAgOiAoKHZBLnZ5IC0gdkIudnkpKk1hdGgucG93KChwb3NBLnkgLSBwb3NCLnkpICwgMikgKyAodkEudnggLSB2Qi52eCkqKHBvc0EueCAtIHBvc0IueCkqKHBvc0EueSAtIHBvc0IueSkpL01hdGgucG93KHJjICwgMik7XHJcblxyXG4gICAgICAgIGxldCB2QXggPSBVdGlscy5mbG9hdE4odkEudnggLSBheCksXHJcbiAgICAgICAgICAgIHZBeSA9IFV0aWxzLmZsb2F0Tih2QS52eSAtIGF5KSxcclxuICAgICAgICAgICAgdkJ4ID0gVXRpbHMuZmxvYXROKHZCLnZ4ICsgYXgpLFxyXG4gICAgICAgICAgICB2QnkgPSBVdGlscy5mbG9hdE4odkIudnkgKyBheSk7XHJcblxyXG4gICAgICAgIGlmKGNvbnZlcnQpIHtcclxuICAgICAgICAgICAgdkF4ICo9IC0xO1xyXG4gICAgICAgICAgICB2QXkgKj0gLTE7XHJcbiAgICAgICAgICAgIHZCeCAqPSAtMTtcclxuICAgICAgICAgICAgdkJ5ICo9IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFt2QXgsIHZBeSwgdkJ4LCB2QnldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5L+u5q2j56Kw5pKe5L2N572uXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBmaXhDb2xsaXNpb24ocG9zQTogUG9pbnQsIHBvc0I6IFBvaW50LCByQTogbnVtYmVyLCByQjogbnVtYmVyLCBjb252ZXJ0OmJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmKGNvbnZlcnQpIHtcclxuICAgICAgICAgICAgcG9zQS54ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lV2lkdGggLSBwb3NBLngpO1xyXG4gICAgICAgICAgICBwb3NBLnkgPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVIZWlnaHQgLSBwb3NBLnkpO1xyXG4gICAgICAgICAgICBwb3NCLnggPSBVdGlscy5mbG9hdE4oY29uZmlnLmdhbWVXaWR0aCAtIHBvc0IueCk7XHJcbiAgICAgICAgICAgIHBvc0IueSA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZUhlaWdodCAtIHBvc0IueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCByYyA9IFV0aWxzLnBMZW5ndGgocG9zQSwgcG9zQik7XHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IChyQSArIHJCIC0gcmMpLzI7XHJcbiAgICAgICAgbGV0IGN4ID0gcmMgPT09IDA/IDAgOiBsZW5ndGggKiAocG9zQS54IC0gcG9zQi54KSAvIHJjO1xyXG4gICAgICAgIGxldCBjeSA9IHJjID09PSAwPyAwIDogbGVuZ3RoICogKHBvc0EueSAtIHBvc0IueSkgLyByYztcclxuICAgICAgICBsZXQgYXggPSBVdGlscy5mbG9hdE4ocG9zQS54ICsgY3gpO1xyXG4gICAgICAgIGxldCBheSA9IFV0aWxzLmZsb2F0Tihwb3NBLnkgKyBjeSk7XHJcbiAgICAgICAgbGV0IGJ4ID0gVXRpbHMuZmxvYXROKHBvc0IueCAtIGN4KTtcclxuICAgICAgICBsZXQgYnkgPSBVdGlscy5mbG9hdE4ocG9zQi55IC0gY3kpO1xyXG5cclxuICAgICAgICBpZihjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgIGF4ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lV2lkdGggLSBheCk7XHJcbiAgICAgICAgICAgIGF5ID0gVXRpbHMuZmxvYXROKGNvbmZpZy5nYW1lSGVpZ2h0IC0gYXkpO1xyXG4gICAgICAgICAgICBieCA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZVdpZHRoIC0gYngpO1xyXG4gICAgICAgICAgICBieSA9IFV0aWxzLmZsb2F0Tihjb25maWcuZ2FtZUhlaWdodCAtIGJ5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbYXgsIGF5LCBieCwgYnldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6KeS5bqm5qCH5YeG5YyW5aSE55CGICgtMTgwLCAxODApXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzdGFuZGFyZEFuZ2xlKGFuZ2xlOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgb2Zmc2V0LHJlcztcclxuXHJcbiAgICAgICAgaWYoYW5nbGUgPiAxODApIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5mbG9vcigoYW5nbGUgKyAxODApIC8gMzYwKSAqIDM2MDtcclxuICAgICAgICAgICAgcmVzID0gYW5nbGUgLSBvZmZzZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoYW5nbGUgPCAtMTgwKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IE1hdGguZmxvb3IoKDE4MCAtIGFuZ2xlKSAvIDM2MCkgKiAzNjA7XHJcbiAgICAgICAgICAgIHJlcyA9IGFuZ2xlICsgb2Zmc2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzID0gYW5nbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog54K55Yiw55u057q/55qE6Led56a7XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZVRvTGluZShwb2ludHgsIHBvaW50eSwgbGluZXgsIGxpbmV5LCB2eCwgdnkpIHtcclxuICAgICAgICBsZXQgQSwgQiwgQztcclxuXHJcbiAgICAgICAgQSA9IHZ5O1xyXG4gICAgICAgIEIgPSB2eCAqIC0xO1xyXG4gICAgICAgIEMgPSBsaW5leSAqIHZ4IC0gbGluZXggKiB2eTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNxcnQoTWF0aC5wb3coQSAsIDIpK01hdGgucG93KEIgLCAyKSk7XHJcbiAgICAgICAgbGV0IGcgPSBwb2ludHggKiBBICsgcG9pbnR5ICogQiArIEM7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKE1hdGguYWJzKGcgLyBzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDngrnnm7jlr7nkuo7nm7Tnur/nmoTkvY3nva5cclxuICAgICAqIEByZXR1cm4gMTrkuIrmlrkgLTE65LiL5pa5IDA6IOWcqOebtOe6v+S4ilxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcG9zVG9MaW5lKHBvaW50eCwgcG9pbnR5LCBsaW5leCwgbGluZXksIHZ4LCB2eSkge1xyXG4gICAgICAgIGxldCBBLCBCLCBDLCBwb3M7XHJcblxyXG4gICAgICAgIEEgPSB2eTtcclxuICAgICAgICBCID0gdnggKiAtMTtcclxuICAgICAgICBDID0gbGluZXkgKiB2eCAtIGxpbmV4ICogdnk7XHJcblxyXG4gICAgICAgIHBvcyA9IEEgKiBwb2ludHggKyBCICogcG9pbnR5ICsgQztcclxuICAgICAgICBcclxuICAgICAgICBpZihwb3MgPCAwKSByZXR1cm4gMTtcclxuICAgICAgICBlbHNlIGlmKHBvcyA+IDApIHJldHVybiAtMTtcclxuICAgICAgICBlbHNlIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5ZuecG9pbnTmlbDmja5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4ge3g6IHgsIHk6IHl9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Y+W5bCP5pWw54K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBmbG9hdE4oaW5wdXQ6IG51bWJlciwgZk51bTogbnVtYmVyID0gNikge1xyXG4gICAgICAgIGxldCB0ZW1wID0gMTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZk51bTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRlbXAgKj0gMTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGlucHV0ICogdGVtcCkgLyB0ZW1wO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB0b0ludChpbnB1dDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0ICsgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Lik54K55LmL6Ze06Led56a7XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBwTGVuZ3RoKHAxOlBvaW50LCBwMjpQb2ludCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3cocDIueSAtIHAxLnkgLCAyKStNYXRoLnBvdyhwMi54IC0gcDEueCAsIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeul+WHuiDnu4/ov4flnIblv4PnmoTnm7Tnur8g5LiOIOWchiDnmoTkuqTngrlcclxuICAgICAqIEBwYXJhbSBwb2ludDEg55u057q/55qE5LiA5Liq54K5XHJcbiAgICAgKiBAcGFyYW0gY2VudGVyIOWchuW/g1xyXG4gICAgICogQHBhcmFtIHJhZGl1cyDlnIbnmoTljYrlvoRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNyb3NzaW5nUG9pbnRMQyhwb2ludDE6IFBvaW50LCBjZW50ZXI6IFBvaW50LCByYWRpdXM6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBwLCB3LCBhLCBiLCBjLCB4MSwgeTEsIHgyLCB5MjtcclxuXHJcbiAgICAgICAgdyA9IChwb2ludDEueSAtIGNlbnRlci55KSAvIChwb2ludDEueCAtIGNlbnRlci54KTtcclxuICAgICAgICBwID0gTWF0aC5wb3codywgMik7XHJcbiAgICAgICAgYSA9IHAgKyAxO1xyXG4gICAgICAgIGIgPSAtMiAqIGNlbnRlci54ICogYTtcclxuICAgICAgICBjID0gTWF0aC5wb3coY2VudGVyLngsIDIpICogYSAtIE1hdGgucG93KHJhZGl1cywgMik7XHJcblxyXG4gICAgICAgIHgxID0gKC0xICogYiArIE1hdGguc3FydChiICogYiAtIDQgKiBhICogYykpIC8gKDIgKiBhKTtcclxuICAgICAgICB4MiA9ICgtMSAqIGIgLSBNYXRoLnNxcnQoYiAqIGIgLSA0ICogYSAqIGMpKSAvICgyICogYSk7XHJcbiAgICAgICAgeTEgPSB3ICogeDEgLSB3ICogY2VudGVyLnggKyBjZW50ZXIueTtcclxuICAgICAgICB5MiA9IHcgKiB4MiAtIHcgKiBjZW50ZXIueCArIGNlbnRlci55O1xyXG5cclxuICAgICAgICBpZihwb2ludDEueCA9PT0gY2VudGVyLngpIHtcclxuICAgICAgICAgICAgeDEgPSBjZW50ZXIueDtcclxuICAgICAgICAgICAgeDIgPSBjZW50ZXIueDtcclxuICAgICAgICAgICAgeTEgPSBjZW50ZXIueSArIHJhZGl1cztcclxuICAgICAgICAgICAgeTIgPSBjZW50ZXIueSAtIHJhZGl1cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKE1hdGguYWJzKHBvaW50MS54IC0geDEpIDwgTWF0aC5hYnMocG9pbnQxLnggLSB4MikgfHwgXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHBvaW50MS55IC0geTEpIDwgTWF0aC5hYnMocG9pbnQxLnkgLSB5MikpIFxyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMucCh4MSwgeTEpO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIFV0aWxzLnAoeDIsIHkyKTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9saWJzL2xheWFBaXIuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3NvY2tldC9Tb2NrZXQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi91aS92aWV3L1N0YXJ0UGFnZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3V0aWxzL1V0aWxzLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vY29uZmlnLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZ2xvYmFsLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vTG9hZGluZy50c1wiIC8+XHJcblxyXG5pbXBvcnQgQW5pbWF0aW9uID0gbGF5YS5kaXNwbGF5LkFuaW1hdGlvbjtcclxuaW1wb3J0IFJlY3RhbmdsZSA9IGxheWEubWF0aHMuUmVjdGFuZ2xlO1xyXG5pbXBvcnQgQml0bWFwRm9udCA9IGxheWEuZGlzcGxheS5CaXRtYXBGb250O1xyXG5pbXBvcnQgVHdlZW4gPSBsYXlhLnV0aWxzLlR3ZWVuO1xyXG5pbXBvcnQgRWFzZSA9IGxheWEudXRpbHMuRWFzZTtcclxuaW1wb3J0IFdlYkdMID0gbGF5YS53ZWJnbC5XZWJHTDtcclxuaW1wb3J0IFNwcml0ZSA9IGxheWEuZGlzcGxheS5TcHJpdGU7XHJcbmltcG9ydCBIYW5kbGVyID0gbGF5YS51dGlscy5IYW5kbGVyO1xyXG5pbXBvcnQgTG9hZGVyID0gbGF5YS5uZXQuTG9hZGVyO1xyXG5pbXBvcnQgVGV4dHVyZSA9IGxheWEucmVzb3VyY2UuVGV4dHVyZTtcclxuaW1wb3J0IExheWFUZXh0ID0gbGF5YS5kaXNwbGF5LlRleHQ7XHJcbmltcG9ydCBMYXlhRXZlbnQgPSBsYXlhLmV2ZW50cy5FdmVudDtcclxuaW1wb3J0IFBvb2wgPSBsYXlhLnV0aWxzLlBvb2w7XHJcbmltcG9ydCBDb2xvckZpbHRlciA9IExheWEuQ29sb3JGaWx0ZXI7XHJcbmltcG9ydCBTb3VuZE1hbmFnZXIgPSBMYXlhLlNvdW5kTWFuYWdlcjtcclxuXHJcbi8qKlxyXG4gKiDnqIvluo/lhaXlj6PnsbtcclxuICovXHJcbmNsYXNzIE1haW4ge1xyXG4gICAgLy8g6LWE5rqQ5pWw57uEXHJcbiAgICBwcml2YXRlIGFzc2V0czogQXJyYXk8T2JqZWN0PiA9IFtdO1xyXG4gICAgLy8g5ri45oiP5Zy65pmv6aG16Z2iXHJcbiAgICBwcml2YXRlIF9zdGFydFBhZ2U6IFN0YXJ0UGFnZTtcclxuICAgIHByaXZhdGUgX2dhbWVQYWdlOiBTcHJpdGU7XHJcbiAgICBwcml2YXRlIF9iZzogU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBfYml0bWFwZm9udDogQml0bWFwRm9udDtcclxuICAgIHByaXZhdGUgX2xvYWRpbmc6IExvYWRpbmc7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBhc3NldHNLZXlzID0gT2JqZWN0LmtleXMoQXNzZXRzLkltZyk7XHJcbiAgICAgICAgbGV0IGpzb25LZXlzID0gT2JqZWN0LmtleXMoQXNzZXRzLkpzb24pO1xyXG4gICAgICAgIGxldCBzb3VuZEtleXMgPSBPYmplY3Qua2V5cyhBc3NldHMuU291bmQpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgc291bmRLZXlzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXNzZXRzLnB1c2goe3VybDogQXNzZXRzLlNvdW5kW3NvdW5kS2V5c1tqXV0sIHR5cGU6IExvYWRlci5TT1VORH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXNzZXRzS2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFzc2V0cy5wdXNoKHt1cmw6IEFzc2V0cy5JbWdbYXNzZXRzS2V5c1tpXV0sIHR5cGU6IExvYWRlci5JTUFHRX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwganNvbktleXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hc3NldHMucHVzaCh7dXJsOiBBc3NldHMuSnNvbltqc29uS2V5c1tqXV0sIHR5cGU6IExvYWRlci5BVExBU30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRMYXlhKCk7XHJcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IG5ldyBMb2FkaW5nKCk7XHJcblxyXG4gICAgICAgIC8vIHJlc2l6ZVxyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YUV2ZW50LlJFU0laRSwgdGhpcywgdGhpcy5vblN0YWdlUmVzaXplKTtcclxuXHJcbiAgICAgICAgLy8g5Yqg6L296LWE5rqQXHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh0aGlzLmFzc2V0cywgSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRlZCksIEhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkaW5nLCBudWxsLCBmYWxzZSksIExvYWRlci5URVhUKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTWFpbjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IE1haW4ge1xyXG4gICAgICAgIGlmIChNYWluLmluc3RhbmNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgTWFpbi5pbnN0YW5jZSA9IG5ldyBNYWluKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYWluLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBnYW1lUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0YXJ0UGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRQYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBiZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L296LWE5rqQ5a6MXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb25Mb2FkZWQoKSB7XHJcbiAgICAgICAgdGhpcy5fbG9hZGluZy5oaWRlKCk7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMlnNvY2tldFxyXG4gICAgICAgdGhpcy5pbml0U29ja2V0KCk7XHJcblxyXG5cclxuICAgICAgICAvLyDliqDovb3kvY3lm77lrZfkvZNcclxuICAgICAgICB0aGlzLl9iaXRtYXBmb250ID0gbmV3IEJpdG1hcEZvbnQoKTtcclxuICAgICAgICB0aGlzLl9iaXRtYXBmb250LmxvYWRGb250KEFzc2V0cy5mb250Lm51bSwgSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgICBMYXlhVGV4dC5yZWdpc3RlckJpdG1hcEZvbnQoJ2RpeWZvbnQnLCB0aGlzLl9iaXRtYXBmb250KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMluepuueahOa4uOaIj+WcuuaZr+mhtVxyXG4gICAgICAgIHRoaXMuX2dhbWVQYWdlID0gbmV3IFNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2dhbWVQYWdlLm5hbWUgPSBEaXNwbGF5TmFtZS5HYW1lUGFnZTtcclxuICAgICAgICB0aGlzLl9nYW1lUGFnZS56T3JkZXIgPSBEaXNwbGF5T3JkZXIuR2FtZVBhZ2U7XHJcbiAgICAgICAgdGhpcy5fZ2FtZVBhZ2UucGl2b3QoY29uZmlnLmdhbWVXaWR0aC8yLCBjb25maWcuZ2FtZUhlaWdodC8yKTtcclxuICAgICAgICB0aGlzLl9nYW1lUGFnZS5wb3MoZ2xvYmFsLmxlZnRFZGdlICsgY29uZmlnLmdhbWVXaWR0aC8yLCBjb25maWcuZ2FtZUhlaWdodC8yKTtcclxuXHJcbiAgICAgICAgLy8g5Yid5aeL5YyWc3RhcnRVSVxyXG4gICAgICAgIHRoaXMuX3N0YXJ0UGFnZSA9IG5ldyBTdGFydFBhZ2UoKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDmmL7npLrlhajlsYDog4zmma9cclxuICAgICAgICB0aGlzLnNob3dCYWNrZ3JvdW5kKCk7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMlua4uOaIj+WcuuaZr+eahOW3pui+uee8mOWSjOWPs+i+uee8mOS9jee9rlxyXG4gICAgICAgIGdsb2JhbC5sZWZ0RWRnZSA9IChMYXlhLnN0YWdlLndpZHRoIC0gY29uZmlnLmdhbWVXaWR0aCkvMjtcclxuICAgICAgICBnbG9iYWwucmlnaHRFZGdlID0gKExheWEuc3RhZ2Uud2lkdGggKyBjb25maWcuZ2FtZVdpZHRoKS8yO1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX2dhbWVQYWdlKTtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX3N0YXJ0UGFnZSk7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9veS4rVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhwcm9ncmVzczogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbG9hZGluZy5zZXRQcm9jZXNzKHByb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOWFqOWxgOiDjOaZr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0JhY2tncm91bmQoKSB7XHJcbiAgICAgICAgdGhpcy5fYmcgPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5fYmcubG9hZEltYWdlKEFzc2V0cy5JbWcuc3RhcnRCZyk7XHJcbiAgICAgICAgdGhpcy5fYmcucGl2b3QoNjQwLCA0MDApO1xyXG4gICAgICAgIHRoaXMuX2JnLnpPcmRlciA9IERpc3BsYXlPcmRlci5CYWNrZ3JvdW5kO1xyXG4gICAgICAgIHRoaXMuX2JnLnBvcyhMYXlhLnN0YWdlLndpZHRoLzIsIExheWEuc3RhZ2UuaGVpZ2h0LzIpO1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX2JnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUqOWKqOeUu+eahOaWueW8j+enu+mZpOiDjOaZr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQmFja2dyb3VuZCgpIHtcclxuXHJcbiAgICAgICAgLy8g5oqK6IOM5pmv6K6+572u6auY5LqOZ2FtZXBhZ2XvvIzmnaXovoXliqnlrp7njrDliqjnlLvnmoTnvJPliqjmgKflkozmtYHnlYXmgKdcclxuICAgICAgICB0aGlzLl9iZy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQmFja2dyb3VuZF9IO1xyXG5cclxuICAgICAgICBUd2Vlbi50byh0aGlzLl9iZywge2FscGhhOiAwfSwgMTAwMCwgbnVsbCwgSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLnJlbW92ZUNoaWxkKHRoaXMuX2JnKTtcclxuICAgICAgICAgICAgdGhpcy5fYmcuYWxwaGEgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9iZy56T3JkZXIgPSBEaXNwbGF5T3JkZXIuQmFja2dyb3VuZDtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsY/luZVyZXNpemXpgLvovpFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvblN0YWdlUmVzaXplKCkge1xyXG4gICAgICAgIGdsb2JhbC5sZWZ0RWRnZSA9IChMYXlhLnN0YWdlLndpZHRoIC0gY29uZmlnLmdhbWVXaWR0aCkvMjtcclxuICAgICAgICBnbG9iYWwucmlnaHRFZGdlID0gKExheWEuc3RhZ2Uud2lkdGggKyBjb25maWcuZ2FtZVdpZHRoKS8yO1xyXG5cclxuICAgICAgICB0aGlzLnJlcG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJZsYXlh6YWN572uXHJcbiAgICAgKi8gXHJcbiAgICBwcml2YXRlIGluaXRMYXlhKCkge1xyXG5cclxuICAgICAgICAvLyDmuLjmiI/oiJ7lj7Dorr7nva5cclxuICAgICAgICBMYXlhLmluaXQoY29uZmlnLmdhbWVXaWR0aCwgY29uZmlnLmdhbWVIZWlnaHQsIFdlYkdMKTtcclxuICAgICAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9ICdmaXhlZGhlaWdodCc7XHJcbiAgICAgICAgLy8gTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gJ3ZlcnRpY2FsJztcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduSCA9ICdjZW50ZXInO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gJ21pZGRsZSc7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5iZ0NvbG9yID0gJyMwMDAwMDAnO1xyXG5cclxuICAgICAgICAvLyBMYXlhLlN0YXQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWc29ja2V0XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFNvY2tldCgpIHtcclxuICAgICAgICB2YXIgc29ja2V0ID0gU29ja2V0Lkluc3RhbmNlO1xyXG5cclxuICAgICAgICBzb2NrZXQuaW5pdExpc3RlbigpO1xyXG4gICAgICAgIHNvY2tldC5sb2dpbigndXNlcicrTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YiH5o2i5Yiw5byA5aeL6I+c5Y2V55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBiYWNrVG9NZW51KCkge1xyXG5cclxuICAgICAgICAvLyDljrvpmaTmtojmga/mmL7npLrnlYzpnaLlkozliIbmlbDmmL7npLrnlYzpnaJcclxuICAgICAgICBNc2dNYW5hZ2VyLkluc3RhbmNlLnJlbW92ZU1lc3NhZ2UoKTtcclxuICAgICAgICBTY29yZU1hbmFnZXIuSW5zdGFuY2UucmVtb3ZlUmVzdWx0VmlldygpO1xyXG5cclxuICAgICAgICAvLyDph43lu7rlvIDlp4vnlYzpnaJcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX2JnKTtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuc3RhcnRQYWdlKTtcclxuXHJcbiAgICAgICAgLy8g6YCA5Zy65Yqo55S7XHJcbiAgICAgICAgVHdlZW4udG8odGhpcy5nYW1lUGFnZSwge3k6IC04MDAsIGFscGhhOiAwfSwgODAwLCBudWxsLCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZVBhZ2UuYWxwaGEgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVQYWdlLnkgPSBjb25maWcuZ2FtZUhlaWdodC8yO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVQYWdlLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN5a6a5L2NXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVwb3MoKSB7XHJcbiAgICAgICAgbGV0IG1zZyA9IE1zZ01hbmFnZXIuSW5zdGFuY2UubXNnO1xyXG4gICAgICAgIGxldCB0aXBzVGV4dCA9IE1zZ01hbmFnZXIuSW5zdGFuY2UudGlwc1RleHQ7XHJcbiAgICAgICAgbGV0IGJ1bGxldFByb2Nlc3MgPSBHYW1lLkluc3RhbmNlLmJ1bGxldFByb2Nlc3M7XHJcbiAgICAgICAgbGV0IHRpbWVyID0gR2FtZS5JbnN0YW5jZS50aW1lcjtcclxuICAgICAgICBsZXQgdG9vbFRhZ0NvbnRhaW5lciA9IEdhbWUuSW5zdGFuY2UudG9vbFRhZ0NvbnRhaW5lcjtcclxuICAgICAgICBsZXQgYnRuU3dpdGNoID0gR2FtZS5JbnN0YW5jZS5idG5Td2l0Y2g7XHJcbiAgICAgICAgbGV0IG15U2NvcmVQYW5lbCA9IFNjb3JlTWFuYWdlci5JbnN0YW5jZS5teVNjb3JlUGFuZWw7XHJcbiAgICAgICAgbGV0IHlvdXJTY29yZVBhbmVsID0gU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnlvdXJTY29yZVBhbmVsO1xyXG4gICAgICAgIGxldCByZXN1bHRWaWV3ID0gU2NvcmVNYW5hZ2VyLkluc3RhbmNlLnJlc3VsdFZpZXc7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3N0YXJ0UGFnZSkgdGhpcy5fc3RhcnRQYWdlLnBvcyhnbG9iYWwubGVmdEVkZ2UsIDApO1xyXG4gICAgICAgIGlmKHRoaXMuX2dhbWVQYWdlKSB0aGlzLl9nYW1lUGFnZS5wb3MoZ2xvYmFsLmxlZnRFZGdlICsgY29uZmlnLmdhbWVXaWR0aC8yLCBjb25maWcuZ2FtZUhlaWdodC8yKTtcclxuICAgICAgICBpZih0aGlzLl9iZykgdGhpcy5fYmcucG9zKExheWEuc3RhZ2Uud2lkdGgvMiwgTGF5YS5zdGFnZS5oZWlnaHQvMik7XHJcbiAgICAgICAgaWYobXNnKSBtc2cucG9zKExheWEuc3RhZ2Uud2lkdGgvMiwgTGF5YS5zdGFnZS5oZWlnaHQvMik7XHJcbiAgICAgICAgaWYodGlwc1RleHQpIHRpcHNUZXh0LnBvcyhMYXlhLnN0YWdlLndpZHRoLzIsIExheWEuc3RhZ2UuaGVpZ2h0IC0gMTAwKTtcclxuICAgICAgICBpZihidWxsZXRQcm9jZXNzKSBidWxsZXRQcm9jZXNzLnJlcG9zKCk7XHJcbiAgICAgICAgaWYodGltZXIpIHRpbWVyLnJlcG9zKCk7XHJcbiAgICAgICAgaWYodG9vbFRhZ0NvbnRhaW5lcikgdG9vbFRhZ0NvbnRhaW5lci5yZXBvcygpO1xyXG4gICAgICAgIGlmKGJ0blN3aXRjaCkgYnRuU3dpdGNoLnJlcG9zKCk7XHJcbiAgICAgICAgaWYobXlTY29yZVBhbmVsKSBteVNjb3JlUGFuZWwucmVwb3MoKTtcclxuICAgICAgICBpZih5b3VyU2NvcmVQYW5lbCkgeW91clNjb3JlUGFuZWwucmVwb3MoKTtcclxuICAgICAgICBpZihyZXN1bHRWaWV3KSByZXN1bHRWaWV3LnJlcG9zKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1haW4uSW5zdGFuY2U7XHJcblxyXG4iLCJjb25zdCBQUHJvY2Vzc0F0dHIgPSB7XHJcbiAgICB3aWR0aDogMzQsXHJcbiAgICBoZWlnaHQ6IDhcclxufVxyXG4vKipcclxuICog5Yqb5bqm6L+b5bqm5p2hXHJcbiAqIHBvd2Vwcm9jZXNzXHJcbiAqL1xyXG5jbGFzcyBQUHJvY2VzcyBleHRlbmRzIGxheWEuZGlzcGxheS5TcHJpdGUge1xyXG4gICAgcHJpdmF0ZSBwcm9jZXNzOiBTcHJpdGU7XHJcbiAgICBwcml2YXRlIHBtYXNrOiBTcHJpdGU7XHJcbiAgICBwdWJsaWMgcGVyY2VudDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc3RhdHVzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEltYWdlKEFzc2V0cy5JbWcucHByb2Nlc3NiZyk7XHJcbiAgICAgICAgdGhpcy5zaXplKFBQcm9jZXNzQXR0ci53aWR0aCwgUFByb2Nlc3NBdHRyLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5waXZvdChQUHJvY2Vzc0F0dHIud2lkdGgvMiwgUFByb2Nlc3NBdHRyLmhlaWdodC8yKTtcclxuICAgICAgICB0aGlzLnpPcmRlciA9IERpc3BsYXlPcmRlci5QUHJvY2VzcztcclxuICAgICAgICB0aGlzLnJlcG9zKCk7XHJcblxyXG4gICAgICAgIHRoaXMucG1hc2sgPSBuZXcgU3ByaXRlKCk7IFxyXG4gICAgICAgIHRoaXMucG1hc2subG9hZEltYWdlKEFzc2V0cy5JbWcucHByb2Nlc3MpO1xyXG4gICAgICAgIHRoaXMucG1hc2suc2l6ZShQUHJvY2Vzc0F0dHIud2lkdGgsIFBQcm9jZXNzQXR0ci5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMucG1hc2sucG9zKC0xICogUFByb2Nlc3NBdHRyLndpZHRoLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzcy5sb2FkSW1hZ2UoQXNzZXRzLkltZy5wcHJvY2Vzcyk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzLnNpemUoUFByb2Nlc3NBdHRyLndpZHRoLCBQUHJvY2Vzc0F0dHIuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnByb2Nlc3MubWFzayA9IHRoaXMucG1hc2s7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gMDsgIFxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wcm9jZXNzKTtcclxuXHJcbiAgICAgICAgTWFpbi5JbnN0YW5jZS5nYW1lUGFnZS5hZGRDaGlsZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3N0YXR1cykgdGhpcy5ydW5Qcm9jZXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5DooYzov5vluqbmnaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJ1blByb2Nlc3MoKSB7XHJcbiAgICAgICAgdGhpcy5wZXJjZW50ICs9IDAuMDM7XHJcbiAgICAgICAgaWYodGhpcy5wZXJjZW50ID4gMSkgdGhpcy5wZXJjZW50ID0gMTtcclxuICAgICAgICB0aGlzLnBtYXNrLnBvcygtMSAqIFBQcm9jZXNzQXR0ci53aWR0aCAqICgxIC0gdGhpcy5wZXJjZW50KSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZHVjZVByb2Nlc3MoKSB7XHJcbiAgICAgICAgdGhpcy5wZXJjZW50IC09IDAuMDU7XHJcbiAgICAgICAgaWYodGhpcy5wZXJjZW50IDwgMCkgdGhpcy5wZXJjZW50ID0gMDtcclxuICAgICAgICB0aGlzLnBtYXNrLnBvcygtMSAqIFBQcm9jZXNzQXR0ci53aWR0aCAqICgxIC0gdGhpcy5wZXJjZW50KSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyUHJvY2VzcygpIHtcclxuICAgICAgICB0aGlzLnBlcmNlbnQgPSAwO1xyXG4gICAgICAgIHRoaXMucG1hc2sucG9zKC0xICogUFByb2Nlc3NBdHRyLndpZHRoICogKDEgLSB0aGlzLnBlcmNlbnQpLCAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gMDtcclxuICAgICAgICB0aGlzLmNsZWFyUHJvY2VzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXBvcygpIHtcclxuICAgICAgICB0aGlzLnBvcyhjb25maWcuZ2FtZVdpZHRoLzIsIGNvbmZpZy5nYW1lSGVpZ2h0IC0gMTApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlicy9sYXlhQWlyLmQudHNcIiAvPlxyXG5cclxuLy8g55Om54mH5Zyw5Zu+5qih5Z2XXHJcbm1vZHVsZSBUaWxlZE1hcCB7XHJcbiAgICBpbXBvcnQgVGlsZWRNYXAgPSBsYXlhLm1hcC5UaWxlZE1hcDtcclxuICAgIGltcG9ydCBNYXBMYXllciA9IGxheWEubWFwLk1hcExheWVyO1xyXG4gICAgaW1wb3J0IFNwcml0ZSA9IGxheWEuZGlzcGxheS5TcHJpdGU7XHJcbiAgICBpbXBvcnQgUmVjdGFuZ2xlID0gbGF5YS5tYXRocy5SZWN0YW5nbGU7XHJcbiAgICBpbXBvcnQgQnJvd3NlciA9IGxheWEudXRpbHMuQnJvd3NlcjtcclxuICAgIGltcG9ydCBIYW5kbGVyID0gbGF5YS51dGlscy5IYW5kbGVyO1xyXG4gICAgaW1wb3J0IFBvaW50ID0gbGF5YS5tYXRocy5Qb2ludDtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGlsZWRNYXBNYW5hZ2VyIHtcclxuICAgICAgICBwcml2YXRlIHRpbGVkTWFwOiBUaWxlZE1hcDtcclxuICAgICAgICBwcml2YXRlIGxheWVyOiBNYXBMYXllcjtcclxuICAgICAgICBwcml2YXRlIHNwcml0ZTogU3ByaXRlO1xyXG4gICAgICAgIHByaXZhdGUgbUxhc3RNb3VzZVg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgcHJpdmF0ZSBtTGFzdE1vdXNlWTogbnVtYmVyID0gMDtcclxuICAgICAgICBwcml2YXRlIG1YOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIHByaXZhdGUgbVk6IG51bWJlciA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZWRNYXAgPSBuZXcgVGlsZWRNYXAoKTtcclxuICAgICAgICAgICAgdGhpcy5tWCA9IHRoaXMubVkgPSAwO1xyXG4gICAgICAgICAgICAvL3RoaXMudGlsZWRNYXAuY3JlYXRlTWFwKFwiLi4vLi4vcmVzL3RpbGVkTWFwL2Rlc2VydC5qc29uXCIsIG5ldyBSZWN0YW5nbGUoMCwgMCwgQnJvd3Nlci53aWR0aCwgQnJvd3Nlci5oZWlnaHQpLCBuZXcgSGFuZGxlcih0aGlzLCB0aGlzLmNvbXBsZXRlSGFuZGxlcikpO1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVkTWFwLmNyZWF0ZU1hcChcInJlcy90aWxlZE1hcC9pc29tZXRyaWNfZ3Jhc3NfYW5kX3dhdGVyLmpzb25cIiwgbmV3IFJlY3RhbmdsZSgwLCAwLCBMYXlhLnN0YWdlLndpZHRoLCBMYXlhLnN0YWdlLmhlaWdodCksIEhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMubWFwTG9hZGVkKSwgbnVsbCwgbmV3IFBvaW50KDE2MDAsIDgwMCkpO1xyXG4gICAgICAgICAgICAvLyBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIHRoaXMubW91c2VEb3duKTtcclxuICAgICAgICAgICAgLy8gTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCwgdGhpcywgdGhpcy5tb3VzZVVwKTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5vbihcImNsaWNrXCIsIHRoaXMsIHRoaXMub25TdGFnZUNsaWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSByZXNpemUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIOaUueWPmOWcsOWbvuinhuWPo+Wkp+Wwj1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVkTWFwLmNoYW5nZVZpZXdQb3J0KHRoaXMubVgsIHRoaXMubVksIEJyb3dzZXIud2lkdGgsIEJyb3dzZXIuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy/pvKDmoIfmjInkuIvmi5bliqjlnLDlm75cclxuICAgICAgICBwcml2YXRlIG1vdXNlRG93bigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5tTGFzdE1vdXNlWCA9IExheWEuc3RhZ2UubW91c2VYO1xyXG4gICAgICAgICAgICB0aGlzLm1MYXN0TW91c2VZID0gTGF5YS5zdGFnZS5tb3VzZVk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgdGhpcy5tb3VzZU1vdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBtb3VzZU1vdmUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8v56e75Yqo5Zyw5Zu+6KeG5Y+jXHJcbiAgICAgICAgICAgIHRoaXMudGlsZWRNYXAubW92ZVZpZXdQb3J0KHRoaXMubVggLSAoTGF5YS5zdGFnZS5tb3VzZVggLSB0aGlzLm1MYXN0TW91c2VYKSwgdGhpcy5tWSAtIChMYXlhLnN0YWdlLm1vdXNlWSAtIHRoaXMubUxhc3RNb3VzZVkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgbW91c2VVcCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5tWCA9IHRoaXMubVggLSAoTGF5YS5zdGFnZS5tb3VzZVggLSB0aGlzLm1MYXN0TW91c2VYKTtcclxuICAgICAgICAgICAgdGhpcy5tWSA9IHRoaXMubVkgLSAoTGF5YS5zdGFnZS5tb3VzZVkgLSB0aGlzLm1MYXN0TW91c2VZKTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5vZmYobGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgdGhpcy5tb3VzZU1vdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGNvbXBsZXRlSGFuZGxlcigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLlnLDlm77liJvlu7rlrozmiJBcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50VzpcIiArIEJyb3dzZXIuY2xpZW50V2lkdGggKyBcIiBDbGllbnRIOlwiICsgQnJvd3Nlci5jbGllbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50LlJFU0laRSwgdGhpcywgdGhpcy5yZXNpemUpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIG1hcExvYWRlZCgpOiB2b2lkIHtcclxuXHRcdFx0dGhpcy5sYXllciA9IHRoaXMudGlsZWRNYXAuZ2V0TGF5ZXJCeUluZGV4KDApO1xyXG5cclxuXHRcdFx0dmFyIHJhZGl1c1g6IG51bWJlciA9IDMyO1xyXG5cdFx0XHR2YXIgcmFkaXVzWTogbnVtYmVyID0gTWF0aC50YW4oMTgwIC8gTWF0aC5QSSAqIDMwKSAqIHJhZGl1c1g7XHJcblx0XHRcdHZhciBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCI7XHJcblxyXG5cdFx0XHR0aGlzLnNwcml0ZSA9IG5ldyBTcHJpdGUoKTtcclxuXHRcdFx0dGhpcy5zcHJpdGUuZ3JhcGhpY3MuZHJhd0xpbmUoMCwgMCwgLXJhZGl1c1gsIHJhZGl1c1ksIGNvbG9yKTtcclxuXHRcdFx0dGhpcy5zcHJpdGUuZ3JhcGhpY3MuZHJhd0xpbmUoMCwgMCwgcmFkaXVzWCwgcmFkaXVzWSwgY29sb3IpO1xyXG5cdFx0XHR0aGlzLnNwcml0ZS5ncmFwaGljcy5kcmF3TGluZSgtcmFkaXVzWCwgcmFkaXVzWSwgMCwgcmFkaXVzWSAqIDIsIGNvbG9yKTtcclxuXHRcdFx0dGhpcy5zcHJpdGUuZ3JhcGhpY3MuZHJhd0xpbmUocmFkaXVzWCwgcmFkaXVzWSwgMCwgcmFkaXVzWSAqIDIsIGNvbG9yKTtcclxuXHRcdFx0TGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLnNwcml0ZSk7XHJcblx0XHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBvblN0YWdlQ2xpY2soKSB7XHJcblx0XHRcdHZhciBwOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcclxuXHRcdFx0dGhpcy5sYXllci5nZXRUaWxlUG9zaXRpb25CeVNjcmVlblBvcyhMYXlhLnN0YWdlLm1vdXNlWCwgTGF5YS5zdGFnZS5tb3VzZVksIHApO1xyXG5cdFx0XHR0aGlzLmxheWVyLmdldFNjcmVlblBvc2l0aW9uQnlUaWxlUG9zKE1hdGguZmxvb3IocC54KSwgTWF0aC5mbG9vcihwLnkpLCBwKTtcclxuXHRcdFx0dGhpcy5zcHJpdGUucG9zKHAueCwgcC55KTtcclxuXHRcdH1cclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
