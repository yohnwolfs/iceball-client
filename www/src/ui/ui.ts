/// <reference path="../../libs/layaAir.d.ts" />

import View=laya.ui.View;
import Dialog=laya.ui.Dialog;                  
module ui {
    export class startUI extends View {

        public btnMatch:laya.ui.Button;
		public btnJoinRoom:laya.ui.Button;
		public btnCreateRoom:laya.ui.Button;

        public static  uiView:any ={"type":"View","child":[{"props":{"x":132,"y":396,"skin":"start/btnbg.png","label":"随机匹配","width":216,"height":86,"sizeGrid":"0,0,0,0","labelSize":37,"labelBold":false,"var":"btnMatch","labelFont":"等线","labelColors":"#000,#000,#000,#000","stateNum":"3","disabled":false,"mouseThrough":false},"type":"Button"},{"props":{"x":132,"y":503,"skin":"start/btnbg.png","label":"创建房间","width":216,"height":86,"sizeGrid":"2,4,-2,1","labelSize":37,"labelBold":false,"var":"btnCreateRoom","labelFont":"等线","toggle":false,"labelColors":"#000,#000,#000,#000","stateNum":"3"},"type":"Button"},{"props":{"x":132,"y":609,"skin":"start/btnbg.png","label":"加入房间","width":216,"height":86,"sizeGrid":"2,4,-2,1","labelSize":37,"labelBold":false,"var":"btnJoinRoom","labelFont":"等线","toggle":false,"labelColors":"#000,#000,#000,#000","stateNum":"3"},"type":"Button"},{"props":{"x":8,"y":160,"skin":"start/logo.png","width":462,"height":100},"type":"Image"}],"props":{"width":480,"height":800,"labelColors":"(#333,#567356,#333#567356)"}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.startUI.uiView);
        }
    }

    export class ResultPageUI extends View {
        public word:Laya.Image;
		public myNameText:Laya.Label;
		public yourNameText:Laya.Label;
		public myBalls:Laya.Label;
		public yourBalls:Laya.Label;
		public myScore:Laya.Label;
		public yourScore:Laya.Label;
		public backBtn:Laya.Button;

        public static  uiView:any ={"type":"View","child":[{"props":{"x":4,"y":-4,"skin":"ResultPage/resultbg.png"},"type":"Image"},{"props":{"x":60,"y":-7,"var":"word"},"type":"Image"},{"props":{"x":62,"y":160,"text":"myname","width":94,"height":23,"var":"myNameText","fontSize":20,"color":"#101010","font":"微软雅黑"},"type":"Label"},{"props":{"x":200,"y":160,"text":"yourname","width":109,"height":23,"var":"yourNameText","fontSize":20,"color":"#3A3A3A","font":"微软雅黑"},"type":"Label"},{"props":{"x":61,"y":202,"text":"进球数","width":94,"height":23,"fontSize":20,"color":"#969696","font":"等线"},"type":"Label"},{"props":{"x":200,"y":202,"text":"进球数","width":94,"height":23,"fontSize":20,"color":"#969696","font":"等线"},"type":"Label"},{"props":{"x":63,"y":232,"text":"0","width":94,"height":23,"fontSize":20,"color":"#00C6F4","font":"微软雅黑","var":"myBalls"},"type":"Label"},{"props":{"x":200,"y":232,"text":"0","width":77,"height":23,"fontSize":20,"color":"#6D6D6D","font":"微软雅黑","var":"yourBalls"},"type":"Label"},{"props":{"x":62,"y":272,"text":"总得分","width":94,"height":23,"fontSize":20,"color":"#969696","font":"等线"},"type":"Label"},{"props":{"x":200,"y":272,"text":"总得分","width":94,"height":23,"fontSize":20,"color":"#969696","font":"等线"},"type":"Label"},{"props":{"x":62,"y":310,"text":"0","width":94,"height":23,"fontSize":20,"color":"#00C6F4","font":"微软雅黑","var":"myScore"},"type":"Label"},{"props":{"x":200,"y":310,"text":"0","width":94,"height":23,"fontSize":20,"color":"#6D6D6D","font":"微软雅黑","var":"yourScore"},"type":"Label"},{"props":{"x":123,"y":354,"label":"返回","width":122,"height":36,"labelFont":"等线","labelStrokeColor":"#000000","labelSize":22,"strokeColors":"#0BE0DA","stateNum":"1","labelColors":"#ffffff","skin":"ResultPage/btnbg.png","var":"backBtn"},"type":"Button"}],"props":{"font":"等线"}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.ResultPageUI.uiView);
        }
    }
}