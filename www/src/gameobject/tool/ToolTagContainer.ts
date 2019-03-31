/// <reference path="./ToolTag.ts" />

/**
 * 道具标签容器
 */
class ToolTagContainer extends laya.display.Sprite {
    // 显示的道具标签数组
    private _tagList: Array<ToolTag> = [];
    // 所有道具标签名
    private _tagIds: Array<string> = ['IceBullet', 'DivisionBullet', 'SmokeBullet', 'BombBullet'];
    // ‘下一个道具标签名’队列
    private _nextTagIds: Array<string> = [];
    // 选中的道具标签id
    private _selectIndex: number;

    private _lock: boolean = false;
    
    get tagList() {
        return this._tagList;
    }

    constructor() {
        super();

        let tag0 = new ToolTag('StandardBullet');
        let tag1 = new ToolTag('IceBullet');
        let tag2 = new ToolTag('DivisionBullet');

        this._tagList.push(tag0);
        this._tagList.push(tag1);
        this._tagList.push(tag2);

        tag0.pos(-52, 0);
        tag1.pos(-52, 47);
        tag2.pos(-52, 94);

        // 默认选中第一个道具标签
        tag0.select();
        this._selectIndex = 0;

        // 初始化‘下一个道具标签’队列
        this._nextTagIds = this.getHiddenTagIds();

        this.zOrder = DisplayOrder.ToolContainer;
        this.repos();
        this.addChildren(tag0, tag1, tag2);
        
        Laya.stage.addChild(this);
    }

    public isLock() {
        return this._lock;
    }

    public lock() {
        this._lock = true;
    }

    public unlock() {
        this._lock = false;
    }

    public isSelectFirst() {
        return this._selectIndex === 0;
    }

    /**
     * 获取当前选择道具id
     */
    public getSelectedToolId() {
        return this._tagList[this._selectIndex].id;
    }

    /**
     * 获取未显示的道具标签id
     */
    public getHiddenTagIds() {
        let tags = this._tagIds.slice(0, this._tagIds.length);
        
        for(let t of this._tagList) {
            if(tags.indexOf(t.id) >= 0) {
                tags.splice(tags.indexOf(t.id), 1);
            }
        }
        return tags;
    }

    /**
     * 使用选择的道具标签
     */
    public useSelectTag() {
        this.unlock();

        // 第一个道具是普通子弹，不需要变化
        if(this._selectIndex === 0) return;

        let tag = this._tagList[this._selectIndex];
        let nextTag;
        
        this._nextTagIds.push(tag.id);
        this._selectIndex = 0;
        this._tagList[this._selectIndex].select();

        nextTag = this._nextTagIds.shift();

        tag.useTag(nextTag);
    }

    /**
     * 选择指定道具标签
     */
    public selectTag(num: number) {
        if(this._selectIndex === num) return;

        this._tagList[this._selectIndex].unselect();
        this._tagList[num].select();
        this._selectIndex = num;
    }

    /**
     * 选择下一个道具标签
     */
    public selectNext() {
        let index:number;
        
        if(navigator.vibrate) {
            navigator.vibrate(100);
        }

        this._tagList[this._selectIndex].unselect();

        index = this._selectIndex + 1;
        if(index === this._tagList.length) index = 0;

        this._tagList[index].select();
        this._selectIndex = index;
    }

    public selectPrevious() {
        let index:number;

        if(navigator.vibrate) {
            navigator.vibrate(100);
        }

        this._tagList[this._selectIndex].unselect();

        index = this._selectIndex - 1;
        if(index < 0) index = this._tagList.length - 1;

        this._tagList[index].select();
        this._selectIndex = index;
    }

    /**
     * 选择指定序号的道具标签
     */
    public select(index: number) {
        for(let t of this._tagList) {
            t.unselect();
        }
        
        this._tagList[index].select();
        this._selectIndex = index;
    }

    public repos() {
        if(Laya.stage.width >= 1280) {
            this.pos(global.leftEdge - 348, 336);
        }
        else {
            this.pos(0, 336);
        }
    }

    public remove() {
        this.removeChildren();
        this.removeSelf();
    }
}