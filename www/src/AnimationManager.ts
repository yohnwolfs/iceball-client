/**
 * 动画管理类
 */

class AnimationManager {

    constructor() {

    }

    private static instance: AnimationManager;
    public static get Instance(): AnimationManager {
        if (AnimationManager.instance == null) {
            AnimationManager.instance = new AnimationManager();
        }
        return AnimationManager.instance;
    }

    /**
     * 获取一个动画实例
     */
    public static getOrCreate(name: string, sizeX: number = 138, sizeY: number = 134, pivotX: number = 65, pivotY: number = 62) {
        let ani:Animation = Pool.getItemByCreateFun('animation', () => {        
            return new Animation();
        });

        ani.clear();
        ani.loadAtlas(Assets.Json[name], null, name);
        ani.index = 0;
        ani.zOrder = DisplayOrder.BulletBoom;
        ani.interval = 16;
        ani.size(sizeX, sizeY);

        let bounds: Rectangle = ani.getGraphicBounds();
		ani.pivot(pivotX, pivotY);

        return ani;
    }
}