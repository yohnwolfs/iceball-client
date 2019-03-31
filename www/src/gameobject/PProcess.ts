const PProcessAttr = {
    width: 34,
    height: 8
}
/**
 * 力度进度条
 * poweprocess
 */
class PProcess extends laya.display.Sprite {
    private process: Sprite;
    private pmask: Sprite;
    public percent: number;
    private _status: number = 0;

    constructor() {
        super();

        this.loadImage(Assets.Img.pprocessbg);
        this.size(PProcessAttr.width, PProcessAttr.height);
        this.pivot(PProcessAttr.width/2, PProcessAttr.height/2);
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

    public update() {
        if(this._status) this.runProcess();
    }

    /**
     * 运行进度条
     */
    public runProcess() {
        this.percent += 0.03;
        if(this.percent > 1) this.percent = 1;
        this.pmask.pos(-1 * PProcessAttr.width * (1 - this.percent), 0);
    }

    public reduceProcess() {
        this.percent -= 0.05;
        if(this.percent < 0) this.percent = 0;
        this.pmask.pos(-1 * PProcessAttr.width * (1 - this.percent), 0);
    }

    public clearProcess() {
        this.percent = 0;
        this.pmask.pos(-1 * PProcessAttr.width * (1 - this.percent), 0);
    }
    
    public start() {
        this._status = 1;
    }

    public stop() {
        this._status = 0;
        this.clearProcess();
    }

    public repos() {
        this.pos(config.gameWidth/2, config.gameHeight - 10);
    }

    public remove() {
        this.removeSelf();
    }
}