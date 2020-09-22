//同步串行	只要监听函数中有一个函数的返回值不为 null，则跳过剩下所有的逻辑
const {
    SyncBailHook
} = require("tapable");

let queue = new SyncBailHook(['name']); 

queue.tap('1', function (name) {
    console.log(name, 1);
});
queue.tap('2', function (name) {
    console.log(name, 2);
    //返回了非 null，所有后面中断了
    return 'wrong'
});
queue.tap('3', function (name) {
    console.log(name, 3);
});

queue.call('webpack');

// 执行结果:
/* 
webpack 1
webpack 2
*/
