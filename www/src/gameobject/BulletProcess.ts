
const ProcessAttr = {
    width: 22,
    height: 188,
    bulletCost: 0.2
};

/**
 * 子弹填充进度条类
 */
class BulletProcess extends laya.display.Sprite {
    private process: Sprite;
    private pmask: Sprite;
    // 进度率
    public percent: number;

    constructor() {
        super();

        // 背景条
        this.loadImage(Assets.Img.processBg);
        this.size(ProcessAttr.width, ProcessAttr.height);
        this.pivot(ProcessAttr.width, ProcessAttr.height);
        this.zOrder = DisplayOrder.ProcessBar;
        this.repos();

        // 进度条和蒙版遮罩
        this.pmask = new Sprite();
        this.pmask.loadImage(Assets.Img.process);
        this.pmask.size(ProcessAttr.width, ProcessAttr.height);
        this.pmask.pos(0, ProcessAttr.height/2);

        this.process = new Sprite();
        this.process.loadImage(Assets.Img.process);
        this.process.size(ProcessAttr.width, ProcessAttr.height);
        this.process.mask = this.pmask;
        
        this.percent = 0.5;
        this.addChild(this.process);

        Laya.stage.addChild(this);
    }

    // 帧更新
    public update() {
        if(this.pmask.y <= 0) {
            this.pmask.y = 0;
            return;
        }
        this.pmask.pos(0, this.pmask.y - 0.5);
        this.percent = 1 - (this.pmask.y / ProcessAttr.height);
    }

    /**
     *  消耗一个进度
     */
    public costOne(num?: number) {
        if(!num) num = 1;
        if(num < 0.5) num = 0.5;
        if(this.percent >= (ProcessAttr.bulletCost * num)) {
            this.percent -= (ProcessAttr.bulletCost * num);
            this.pmask.pos(0, ProcessAttr.height * (1 - this.percent));
            return true;
        }
        else return false;
    }

    // 重新定位
    public repos() {
        if(Laya.stage.width >= 1280) {
            this.pos(global.rightEdge + 400, Laya.stage.height);
        }
        else this.pos(Laya.stage.width, Laya.stage.height);
    }

    public remove() {
        this.removeSelf();
    }
}