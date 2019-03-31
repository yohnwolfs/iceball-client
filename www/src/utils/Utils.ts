interface Point {
    x: number;
    y: number;
}

module Utils {
    /**
     * 显示等待界面
     */
    export function showLoading() {
        var text: LayaText = new LayaText();
			
        text.name = DisplayName.Loading;
        text.color = "#FFFFFF";
        text.font = "Impact";
        text.fontSize = 50;
        text.text = "finding match......";
        text.x = Laya.stage.width/2 - text.width/2;
        text.y = Laya.stage.height/2 - text.height/2;

        Laya.stage.addChild(text);
    }

    /**
     * 判断两个矩形是否发生碰撞
     */
    export function isRectangleCollision(objectA, objectB) {
        var xDis = Math.abs(objectA.x - objectB.x);
        var yDis = Math.abs(objectA.y - objectB.y);

        if (xDis <= (objectA.width + objectB.width) / 2 &&
            yDis <= (objectA.height + objectB.height) / 2) {
            return true;
        }
        return false;
    }

    /**
     * 判断两个圆之间是否碰撞
     */
    export function isCircleCollision(circleA, circleB) {
        let rc = Math.sqrt(Math.pow(circleA.x - circleB.x, 2) + Math.pow(circleA.y - circleB.y, 2));

        if(rc <= (circleA.radius + circleB.radius)) {
            return true;
        }
        return false;
    }

    /**
     * 计算反弹后两小球的运动方向
     * @param posA 小球A的位置
     * @param posB 小球B的位置
     * @param vA 小球A的速度
     * @param vB 小球B的速度
     * @convert 同步计算辅助
     */
    export function compBallRebound(posA: Point, posB: Point, vA: {vx:number, vy:number}, vB: {vx:number, vy:number}, convert:boolean = false) {
        if(convert) {
            posA.x = Utils.floatN(config.gameWidth - posA.x);
            posA.y = Utils.floatN(config.gameHeight - posA.y);
            posB.x = Utils.floatN(config.gameWidth - posB.x);
            posB.y = Utils.floatN(config.gameHeight - posB.y);
            vA.vx *= -1;
            vA.vy *= -1;
            vB.vx *= -1;
            vB.vy *= -1;
        }

        let rc = Utils.pLength(posA, posB);
        let ax = rc === 0? 0 : ((vA.vx - vB.vx)*Math.pow((posA.x - posB.x) , 2) + (vA.vy - vB.vy)*(posA.x - posB.x)*(posA.y - posB.y))/Math.pow(rc , 2);
        let ay = rc === 0? 0 : ((vA.vy - vB.vy)*Math.pow((posA.y - posB.y) , 2) + (vA.vx - vB.vx)*(posA.x - posB.x)*(posA.y - posB.y))/Math.pow(rc , 2);

        let vAx = Utils.floatN(vA.vx - ax),
            vAy = Utils.floatN(vA.vy - ay),
            vBx = Utils.floatN(vB.vx + ax),
            vBy = Utils.floatN(vB.vy + ay);

        if(convert) {
            vAx *= -1;
            vAy *= -1;
            vBx *= -1;
            vBy *= -1;
        }

        return [vAx, vAy, vBx, vBy];
    }

    /**
     * 修正碰撞位置
     */
    export function fixCollision(posA: Point, posB: Point, rA: number, rB: number, convert:boolean = false) {
        if(convert) {
            posA.x = Utils.floatN(config.gameWidth - posA.x);
            posA.y = Utils.floatN(config.gameHeight - posA.y);
            posB.x = Utils.floatN(config.gameWidth - posB.x);
            posB.y = Utils.floatN(config.gameHeight - posB.y);
        }
        
        let rc = Utils.pLength(posA, posB);
        let length = (rA + rB - rc)/2;
        let cx = rc === 0? 0 : length * (posA.x - posB.x) / rc;
        let cy = rc === 0? 0 : length * (posA.y - posB.y) / rc;
        let ax = Utils.floatN(posA.x + cx);
        let ay = Utils.floatN(posA.y + cy);
        let bx = Utils.floatN(posB.x - cx);
        let by = Utils.floatN(posB.y - cy);

        if(convert) {
            ax = Utils.floatN(config.gameWidth - ax);
            ay = Utils.floatN(config.gameHeight - ay);
            bx = Utils.floatN(config.gameWidth - bx);
            by = Utils.floatN(config.gameHeight - by);
        }

        return [ax, ay, bx, by];
    }

    /**
     * 角度标准化处理 (-180, 180)
     */
    export function standardAngle(angle: number) {
        let offset,res;

        if(angle > 180) {
            offset = Math.floor((angle + 180) / 360) * 360;
            res = angle - offset;
        }
        else if(angle < -180) {
            offset = Math.floor((180 - angle) / 360) * 360;
            res = angle + offset;
        }
        else {
            res = angle;
        }

        return res;
    }

    /**
     * 点到直线的距离
     */
    export function distanceToLine(pointx, pointy, linex, liney, vx, vy) {
        let A, B, C;

        A = vy;
        B = vx * -1;
        C = liney * vx - linex * vy;

        let s = Math.sqrt(Math.pow(A , 2)+Math.pow(B , 2));
        let g = pointx * A + pointy * B + C;

        return Math.round(Math.abs(g / s));
    }

    /**
     * 点相对于直线的位置
     * @return 1:上方 -1:下方 0: 在直线上
     */
    export function posToLine(pointx, pointy, linex, liney, vx, vy) {
        let A, B, C, pos;

        A = vy;
        B = vx * -1;
        C = liney * vx - linex * vy;

        pos = A * pointx + B * pointy + C;
        
        if(pos < 0) return 1;
        else if(pos > 0) return -1;
        else return 0;
    }

    /**
     * 返回point数据
     */
    export function p(x: number, y: number) {
        return {x: x, y: y};
    }

    /**
     * 取小数点
     */
    export function floatN(input: number, fNum: number = 6) {
        let temp = 1;
        for(let i = 0; i < fNum; i++) {
            temp *= 10;
        }
        return Math.round(input * temp) / temp;
    }

    export function toInt(input: number) {
        return parseInt(input + '');
    }

    /**
     * 两点之间距离
     */
    export function pLength(p1:Point, p2:Point) {
        return Math.sqrt(Math.pow(p2.y - p1.y , 2)+Math.pow(p2.x - p1.x , 2));
    }

    /**
     * 算出 经过圆心的直线 与 圆 的交点
     * @param point1 直线的一个点
     * @param center 圆心
     * @param radius 圆的半径
     */
    export function crossingPointLC(point1: Point, center: Point, radius: number) {
        let p, w, a, b, c, x1, y1, x2, y2;

        w = (point1.y - center.y) / (point1.x - center.x);
        p = Math.pow(w, 2);
        a = p + 1;
        b = -2 * center.x * a;
        c = Math.pow(center.x, 2) * a - Math.pow(radius, 2);

        x1 = (-1 * b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        x2 = (-1 * b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        y1 = w * x1 - w * center.x + center.y;
        y2 = w * x2 - w * center.x + center.y;

        if(point1.x === center.x) {
            x1 = center.x;
            x2 = center.x;
            y1 = center.y + radius;
            y2 = center.y - radius;
        }

        if(Math.abs(point1.x - x1) < Math.abs(point1.x - x2) || 
            Math.abs(point1.y - y1) < Math.abs(point1.y - y2)) 
            return Utils.p(x1, y1);
        else return Utils.p(x2, y2);
    }
}