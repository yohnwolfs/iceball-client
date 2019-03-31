const MsgAttr = {
    width: 408,
    height: 316
}
/**
 * 消息管理
 */
class MsgManager {
    private _msg: Sprite;
    private _msgContainer: View;
    private _textSprite: LayaText;
    private _showing: boolean = false;
    private _tipsText: LayaText;

    constructor() {

    }

    get msg() {
        return this._msg;
    }

    get tipsText() {
        return this._tipsText;
    }

    private static instance: MsgManager;
    public static get Instance(): MsgManager {
        if (MsgManager.instance == null) {
            MsgManager.instance = new MsgManager();
        }
        return MsgManager.instance;
    }

    // 显示消息
    public showMessage(text: string, size?: number, func?: () => void) {

        if (!this._msg) {

            // 消息层 容器
            this._msgContainer = new View();
            this._msgContainer.zOrder = DisplayOrder.Msg;
            this._msgContainer.mouseEnabled = true;

            // 消息背景
            this._msg = new Sprite();
            this._msg.loadImage(Assets.Img.msgBg);
            this._msg.pivot(MsgAttr.width / 2, MsgAttr.height / 2);
            this._msg.size(MsgAttr.width, MsgAttr.height);
            this._msg.name = DisplayName.Loading;
            this._msg.pos(Laya.stage.width / 2, Laya.stage.height / 2);

            // 文字
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

        // 状态变为显示中
        this._showing = true;

        // 清除执行中的动画
        Tween.clearAll(this._msg);

        // 每次显示消息重新设置
        this._msg.alpha = 0;
        this._msg.scale(0, 0);
        this._textSprite.text = text;
        this._textSprite.color = '#000000';
        this._textSprite.fontSize = 46;

        // 可选参数 尺寸设置
        if (size) this._textSprite.fontSize = size;

        // 执行动画
        Tween.to(this._msg, { alpha: 1, scaleX: 1, scaleY: 1 }, 600, Ease['backInOut'], Handler.create(this, () => {
            this._showing = false;
            if (func) func.apply(this);
        }));

        // 添加到显示层
        this._msgContainer.addChild(this._msg);
        Laya.stage.addChild(this._msgContainer);
    }

    // 移除消息
    public removeMessage(func?: () => void) {

        // 如果显示中，则不移除
        if (this._showing) return;

        // 退场动画
        Tween.to(this._msg, { alpha: 0, scaleX: 0, scaleY: 0 }, 500, null, Handler.create(this, () => {

            // 可选参数 回调函数
            if (func) func.apply(this);

            // 移除数据 更换状态
            Laya.stage.removeChild(this._msgContainer);
            this._msgContainer.removeChildren();
            this._showing = false;
        }));
    }

    // 设置文本
    public setText(text: string, color?) {
        if (this._textSprite) this._textSprite.text = text;
        if (color) this._textSprite.color = color;
    }

    public showTips(text: string) {
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
    }

    public removeTips() {
        if(this._tipsText) Laya.stage.removeChild(this._tipsText);
    }
}