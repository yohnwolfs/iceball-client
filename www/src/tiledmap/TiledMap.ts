/// <reference path="../../libs/layaAir.d.ts" />

// 瓦片地图模块
module TiledMap {
    import TiledMap = laya.map.TiledMap;
    import MapLayer = laya.map.MapLayer;
    import Sprite = laya.display.Sprite;
    import Rectangle = laya.maths.Rectangle;
    import Browser = laya.utils.Browser;
    import Handler = laya.utils.Handler;
    import Point = laya.maths.Point;

    export class TiledMapManager {
        private tiledMap: TiledMap;
        private layer: MapLayer;
        private sprite: Sprite;
        private mLastMouseX: number = 0;
        private mLastMouseY: number = 0;
        private mX: number = 0;
        private mY: number = 0;
        
        constructor() {
            this.tiledMap = new TiledMap();
            this.mX = this.mY = 0;
            //this.tiledMap.createMap("../../res/tiledMap/desert.json", new Rectangle(0, 0, Browser.width, Browser.height), new Handler(this, this.completeHandler));
            this.tiledMap.createMap("res/tiledMap/isometric_grass_and_water.json", new Rectangle(0, 0, Laya.stage.width, Laya.stage.height), Handler.create(this, this.mapLoaded), null, new Point(1600, 800));
            // Laya.stage.on(laya.events.Event.MOUSE_DOWN, this, this.mouseDown);
            // Laya.stage.on(laya.events.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on("click", this, this.onStageClick);
        }
        
        private resize(): void {
            // 改变地图视口大小
            this.tiledMap.changeViewPort(this.mX, this.mY, Browser.width, Browser.height);
        }
        
        //鼠标按下拖动地图
        private mouseDown(): void {
            this.mLastMouseX = Laya.stage.mouseX;
            this.mLastMouseY = Laya.stage.mouseY;
            Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.mouseMove);
        }

        private mouseMove(): void {
            //移动地图视口
            this.tiledMap.moveViewPort(this.mX - (Laya.stage.mouseX - this.mLastMouseX), this.mY - (Laya.stage.mouseY - this.mLastMouseY));
        }

        private mouseUp(): void {
            this.mX = this.mX - (Laya.stage.mouseX - this.mLastMouseX);
            this.mY = this.mY - (Laya.stage.mouseY - this.mLastMouseY);
            Laya.stage.off(laya.events.Event.MOUSE_MOVE, this, this.mouseMove);
        }
        
        private completeHandler(): void {
            console.log("地图创建完成");
            console.log("ClientW:" + Browser.clientWidth + " ClientH:" + Browser.clientHeight);
            Laya.stage.on(laya.events.Event.RESIZE, this, this.resize);
            this.resize();
        }
        
        private mapLoaded(): void {
			this.layer = this.tiledMap.getLayerByIndex(0);

			var radiusX: number = 32;
			var radiusY: number = Math.tan(180 / Math.PI * 30) * radiusX;
			var color: string = "cyan";

			this.sprite = new Sprite();
			this.sprite.graphics.drawLine(0, 0, -radiusX, radiusY, color);
			this.sprite.graphics.drawLine(0, 0, radiusX, radiusY, color);
			this.sprite.graphics.drawLine(-radiusX, radiusY, 0, radiusY * 2, color);
			this.sprite.graphics.drawLine(radiusX, radiusY, 0, radiusY * 2, color);
			Laya.stage.addChild(this.sprite);
		}
        
        private onStageClick() {
			var p: Point = new Point(0, 0);
			this.layer.getTilePositionByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY, p);
			this.layer.getScreenPositionByTilePos(Math.floor(p.x), Math.floor(p.y), p);
			this.sprite.pos(p.x, p.y);
		}
    }
}