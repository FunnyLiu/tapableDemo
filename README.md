# tapableDemo


`webpack`本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是`Tapable`，`webpack`中最核心的负责编译的`Compiler`和负责创建 bundles 的`Compilation`都是`Tapable`的实例。本文主要介绍一下 Tapable 中的钩子函数。

tapable 包暴露出很多钩子类，这些类可以用来为插件创建钩子函数，主要包含以下几种：

``` js
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");

```

所有钩子类的构造函数都接收一个可选的参数，这个参数是一个由字符串参数组成的数组，如下：

```
const hook = new SyncHook(\["arg1", "arg2", "arg3"\]);
复制代码

```

下面我们就详细介绍一下钩子的用法，以及一些钩子类实现的原理。

hooks 概览
==========

常用的钩子主要包含以下几种，分为同步和异步，异步又分为并发执行和串行执行，如下图：

![](https://user-gold-cdn.xitu.io/2018/3/31/1627c9c828c20aa1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) 首先，整体感受下钩子的用法，如下

<table><thead><tr><th>序号</th><th>钩子名称</th><th>执行方式</th><th>使用要点</th></tr></thead><tbody><tr><td>1</td><td>SyncHook</td><td>同步串行</td><td>不关心监听函数的返回值</td></tr><tr><td>2</td><td>SyncBailHook</td><td>同步串行</td><td>只要监听函数中有一个函数的返回值不为 <code>null</code>，则跳过剩下所有的逻辑</td></tr><tr><td>3</td><td>SyncWaterfallHook</td><td>同步串行</td><td>上一个监听函数的返回值可以传给下一个监听函数</td></tr><tr><td>4</td><td>SyncLoopHook</td><td>同步循环</td><td>当监听函数被触发的时候，如果该监听函数返回<code>true</code>时则这个监听函数会反复执行，如果返回 <code>undefined</code> 则表示退出循环</td></tr><tr><td>5</td><td>AsyncParallelHook</td><td>异步并发</td><td>不关心监听函数的返回值</td></tr><tr><td>6</td><td>AsyncParallelBailHook</td><td>异步并发</td><td>只要监听函数的返回值不为 <code>null</code>，就会忽略后面的监听函数执行，直接跳跃到<code>callAsync</code>等触发函数绑定的回调函数，然后执行这个被绑定的回调函数</td></tr><tr><td>7</td><td>AsyncSeriesHook</td><td>异步串行</td><td>不关系<code>callback()</code>的参数</td></tr><tr><td>8</td><td>AsyncSeriesBailHook</td><td>异步串行</td><td><code>callback()</code>的参数不为<code>null</code>，就会直接执行<code>callAsync</code>等触发函数绑定的回调函数</td></tr><tr><td>9</td><td>AsyncSeriesWaterfallHook</td><td>异步串行</td><td>上一个监听函数的中的<code>callback(err, data)</code>的第二个参数, 可以作为下一个监听函数的参数</td></tr></tbody></table>
