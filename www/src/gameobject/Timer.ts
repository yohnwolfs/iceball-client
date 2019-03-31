
// 计时器属性，time：倒计时间/单位s
const TimerAttr = {
    width: 102,
    height: 40,
    time: 180
};

/**
 * 游戏计时器
 */
class Timer extends laya.display.Sprite {
    private _frame: number = 0;
    private _time: LayaText;
    private _timeValue: number = TimerAttr.time;
    private _timeTaskList: any[] = [];

    constructor() {
        super();

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
        this._time.pivot(this._time.width/2, this._time.height/2);
        this._time.pos(this.width/2 + 2, this.height/2 - 2);
        this._time.text = this.convertToString(this._timeValue);

        this.addChild(this._time);
        
        Laya.stage.addChild(this);
    }

    get timeValue() {
        return this._timeValue;
    }

    /**
     * 更新
     */
    public update() {
        this._frame++;
        if(this._frame >= 60) {
            this._timeValue--;
            this._time.text = this.convertToString(this._timeValue);
            this._frame = 0;

            if(this._timeValue === 30) {
                this._time.color = '#F41414';
            }
            
            if(this._timeValue <= 0 && Game.Instance.status != 0) {

                // 游戏结束
                Game.Instance.gameOver();
            }
        }

        // 定时任务
        for(let task of this._timeTaskList) {
            task.frame++;
            if(task.frame >= task.goalFrame) {
                task.goalFunc.apply(task.context);
                this._timeTaskList.splice(this._timeTaskList.indexOf(task), 1);
            }
        }
    }

    public isTimeout() {
        return this._timeValue <= 0;
    }

    /**
     * 重新定位
     */
    public repos() {
        if(Laya.stage.width >= 1280) {
            this.pos(global.rightEdge + 400, 0);
        }
        else this.pos(Laya.stage.width, 0);
    }

    /**
     * 转化秒为指定格式字符串
     */
    public convertToString(time: number) {
        let minute, second, res = '';

        if(time < 0) return '00:00';
        minute = Math.floor(time / 60);
        second = time % 60;

        if(minute < 10) res = res + '0' + minute.toString();
        else res = res + minute.toString();

        res += ':';

        if(second < 10) res = res + '0' + second.toString();
        else res = res += second.toString();

        return res;
    }

    public setTimeout(func, timeFrame: number, context, taskName?: string, clear?: boolean) {
        this._timeTaskList.push({frame: 0, goalFrame: timeFrame, goalFunc: func, context: context, taskName: taskName || '', clear: clear || false});
    }

    public runTaskByName(name: string) {
        for(let task of this._timeTaskList) {
            if(task.taskName === name) {
                task.goalFunc.apply(task.context);
                this._timeTaskList.splice(this._timeTaskList.indexOf(task), 1);
            }
        }
    }

    public clearTaskList() {
        for(let task of this._timeTaskList) {
            if(task.clear) task.goalFunc.apply(task.context);
        }
        this._timeTaskList = [];
    }

    public clearTaskByName(name: string) {
        for(let task of this._timeTaskList) {
            if(task.taskName === name) this._timeTaskList.splice(this._timeTaskList.indexOf(task), 1);
        }
    }

    /**
     * 移除
     */
    public remove() {
        this.removeSelf();
    }
}