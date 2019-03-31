/**
 * 虚线类
 */
class DashLine extends laya.display.Sprite {

    constructor(x: number, y: number) {
        super();

        this.zOrder = DisplayOrder.AssistLine;
        this.pos(x, y); 
    }

    /**
     * 画瞄准辅助线
     */
    public drawAssistLine(goalPoint: Point) {
        let p = {x:0,y:0}, arr = [], length, dotLength = 20, dotNum, xadd, yadd;

        p.x = goalPoint.x - this.x;
        p.y = goalPoint.y - this.y;

        length = Utils.pLength(goalPoint, Utils.p(this.x, this.y));
        dotNum = Math.ceil(length / dotLength);

        xadd = dotLength*(p.x)/length;
        yadd = dotLength*(p.y)/length;

        this.clearLines();

        for(let i = 0; i < dotNum; i++) {
            if(i % 2 !== 0) {
                let line = new Sprite();
                this.addChild(line);
                line.graphics.drawLine((i-1) * xadd, (i-1) * yadd, i * xadd, i * yadd, '#ffffff', 2);
            }
        }
    }

    /**
     * 清除辅助线
     */
    public clearLines() {
        this.removeChildren();
    }

    public remove() {
        this.removeSelf();
    }
}