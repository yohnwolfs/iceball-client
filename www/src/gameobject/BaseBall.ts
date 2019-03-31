/**
 * 基础球类
 */
class BaseBall extends laya.display.Sprite {
    protected _radius: number;

    protected _vx: number;
    protected _vy: number;
    protected _nextX: number;
    protected _nextY: number;

    constructor() {
        super();
    }

    get radius() {
        return this._radius;
    }

    get vx() {
        return this._vx;
    }

    get vy() {
        return this._vy;
    }

    set vx(v:number) {
        this._vx = v;
    }

    set vy(v:number) {
        this._vy = v;
    }
}