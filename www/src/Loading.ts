const LoadingAttr = {
    width: 300,
    height: 28
};

const base64 = {
    loading: 'data:image/png;base64,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',
    loadingBg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAcCAYAAADbcIJsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbpJREFUeNrs3d8xA1EUB+CNN3lSQlRACdEBFYgKRAVGBeiACuhAOhAVWBXwFK/OlZuRmEX8zc34vpkzYezk4Tz85t61e0+r+oTH0agTH5u5AH7CIGq42m4/fHRha46QWouPftRuVEdvgV8yjDqN4Dr7UmBFWKWgOoxa00vgj9RRexFcg7kCK6+qLqK6egcsyEmE1sG7gZXD6qpynwpYvLMIrb3JLysNFwgroBS9WEQdNwZW/oOwAkrSj2zantkS5kcWbvUGKFAdW8P16RXWoZ4AherEoqrXyqurdKP9Xk+Agg0nK6xtvQAKtzkJrA29AEo3CSz/GQSWJrAABBaAwAL+bWDVWgEsS2DdaAWwLIF1qRVA4ernwFptt9OWcKAfQMHOp19+7lbjo2UASpPOe395+TkfR2prCJToKA2pmDlxNL8EfV0ZNgGU4zLCaif9MPMcVh6zs5OXXwCLlibpvH1EcoRWumArXwiwsJVVyqLpeYWNT7pPhdaJngF/LAXUQdoGvh6uOs8g1XSSw35UTx+BXw6q02o83qvxtlRr3m/KN+S71fgomnR+luGqwHfVUXdRg6bBqa89CTAAPp1jaUy8HZ8AAAAASUVORK5CYII='
};

/**
 * 加载页面
 */
class Loading {
    private container: HTMLDivElement;
    private bg: HTMLDivElement;
    private process: HTMLDivElement;
    private text: HTMLDivElement;
    // 进度率
    public percent: number;

    constructor() {

        this.percent = 0;
       
        this.container = document.createElement('div');
        this.container.id = 'loading-container';

        this.bg = document.createElement('div');
        this.bg.style.margin = 'auto';
        this.bg.style.position = 'absolute';
        this.bg.style.width = LoadingAttr.width + 'px';
        this.bg.style.height = LoadingAttr.height + 'px';
        this.bg.style.top = '50%';
        this.bg.style.left = '0';
        this.bg.style.right = '0';
        this.bg.style.marginTop = '20px';
        this.bg.style.background = 'url(' + base64.loadingBg + ')';

        this.process = document.createElement('div');
        this.process.style.width = '0px';
        this.process.style.height = LoadingAttr.height + 'px';
        this.process.style.backgroundImage = 'url(' + base64.loading + ')';

        this.text = document.createElement('div');
        this.text.innerHTML = '游戏资源加载中...' + this.percent + '%';
        this.text.style.margin = 'auto';
        this.text.style.position = 'absolute';
        this.text.style.width = LoadingAttr.width + 'px';
        this.text.style.height = LoadingAttr.height + 'px';
        this.text.style.top = '50%';
        this.text.style.left = '0';
        this.text.style.right = '0';
        this.text.style.color = '#ffffff';
        this.text.style.textAlign = 'center';
        this.text.style.fontSize = '26px';
        this.text.style.fontFamily = 'cursive';
        this.text.style.marginTop = '-30px';

        document.body.appendChild(this.container);
        this.container.appendChild(this.bg);
        this.container.appendChild(this.text);
        this.bg.appendChild(this.process);
    }

    /**
     * 设置进度
     */
    public setProcess(percent: number) {
        if(percent < 0) percent = 0;
        if(percent > 1) percent = 1;

        this.percent = percent;
        this.process.style.width = LoadingAttr.width * percent + 'px';
        this.text.innerHTML = '游戏资源加载中...' + Math.round(this.percent * 100)+ '%';
    }

    public hide() {
        this.container.style.display = 'none';
    }
}