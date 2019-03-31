interface Socket {
    emit(event:string, data:Object): any;
}

declare var io: {
    (url:string, opts:Object): Socket;
    
    connect(url:string): any;
    on(event:string, cb:any): any;
} 