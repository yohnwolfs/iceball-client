/**
 * 道具标签
 */
class ToolTag extends laya.display.Sprite {
    // 道具标签名
    private _id: string;
    // 道具标签中文名
    private _name: string;
    // 是否被选择
    private _select: boolean = false;
    // 道具标签文字
    private _text: LayaText;
    
    constructor(id: string) {
        super();

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

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    /**
     * 判断是否被选择
     */
    public isSelect() {
        if(this._select) return true;
        else return false;
    }

    /**
     * 选择标签
     */
    public select() {
        if(this._select) return;
        this._select = true;
        Tween.clearAll(this);
        Tween.to(this, {x: -8}, 200, Ease.backInOut);
    }

    /**
     * 变为非选择
     */
    public unselect() {
        if(!this._select) return;
        this._select = false;
        Tween.clearAll(this);
        Tween.to(this, {x: -52}, 200, Ease.backInOut);
    }

    /**
     * 使用标签
     */
    public useTag(nextTag: string) {
        this._select = false;

        this.alpha = 0;
        this.changeTag(nextTag);
        this.x = -72;
        this.alpha = 1;
        Tween.to(this, {x: -52}, 300, Ease.backInOut);
        // Tween.to(this, {alpha: 0}, 300, null, Handler.create(this, () => {
        //     this.changeTag(nextTag);
        //     this.x = -72;
        //     this.alpha = 1;
        //     Tween.to(this, {x: -52}, 300, Ease.backInOut);
        // }));
    }

    /**
     * 改变标签
     */
    public changeTag(id: string) {
        this._id = id;
        this._name = Tool[id].name;

        this.loadImage(Assets.Img['tooltag_' + Tool[id].tag]);
        this._text.text = this._name;
    }
}