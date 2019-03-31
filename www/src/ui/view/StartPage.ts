/// <reference path="../ui.ts" />

class StartPage extends ui.startUI {
    constructor() {
		super();

		this.name = DisplayName.StartPage;
		this.zOrder = DisplayOrder.StartPage;
		this.pos(global.leftEdge, 0);
		this.btnMatch.on(LayaEvent.CLICK, this, this.onBtnMatch);
		this.btnJoinRoom.on(LayaEvent.CLICK, this, this.onBtnJoinRoom);
		this.btnCreateRoom.on(LayaEvent.CLICK, this, this.onBtnCreateRoom);
	}

	private onBtnMatch() {
		SoundManager.playSound(Assets.Sound.button_001);
		
		// 清理界面UI
		Tween.to(this, {alpha: 0}, 200, null, Handler.create(this, () => {
			this.remove();

			this.alpha = 1;

			// 显示等待界面
			MsgManager.Instance.showMessage('寻找比赛中');
			MsgManager.Instance.showTips('胜利条件\n(1).进球数达到10个\n(2).最终分数更高');

			// 开始请求匹配
			Socket.Instance.match();
		}));
	}

	private onBtnJoinRoom() {
		SoundManager.playSound(Assets.Sound.button_001);
		alert('房间功能尚未上线');
	}

	private onBtnCreateRoom() {
		SoundManager.playSound(Assets.Sound.button_001);
		alert('房间功能尚未上线');
	}

	public remove() {
		this.removeSelf();
	}

	public disableBtn() {
		this.btnMatch.offAll();
	}
}