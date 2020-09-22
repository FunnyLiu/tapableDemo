const { SyncHook } = require("tapable");
//同步串行	不关心监听函数的返回值
let queue = new SyncHook(['name']); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。

// 订阅
queue.tap('1', function (name, name2) {// tap 的第一个参数是用来标识订阅的函数的
    console.log(name, name2, 1);
    return 1;//不关心
});
queue.tap('2', function (name) {
    console.log(name, 2);
});
queue.tap('3', function (name) {
    console.log(name, 3);
});

// 发布
queue.call('webpack', 'webpack-cli');// 发布的时候触发订阅的函数 同时传入参数

// 执行结果:
/* 
webpack undefined 1 // 传入的参数需要和new实例的时候保持一致，否则获取不到多传的参数
webpack 2
webpack 3
*/


let queue2 = new SyncHook(['name1','name2']); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。

// 订阅
queue2.tap('1', function (name, name2) {// tap 的第一个参数是用来标识订阅的函数的
    console.log(name, name2, 1);
});
queue2.call('webpack', 'webpack-cli');// 发布的时候触发订阅的函数 同时传入参数
// 执行结果:
//webpack webpack-cli 1  //获取到了多传的参数