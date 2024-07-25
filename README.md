### 重构git-bare


### 重构要点
```
1、用装饰器重构，让代码简单易懂
2、加入爬虫功能，解决实时数据的影响
3、回测功能
4、服务器化，可以通过浏览器访问，尽量不用微信发命令
5、策略DSL化，可以让用户自定义策略
6、数据来源插件化，即插即用

7、 信号输出经过多个管道，所有管道判断为true，输出信号
   斜率|速度|当前的位置|延迟|成交量  权重都很高

通过通用入口，实现不同的功能


我的功能有：
1、实时数据
2、回测
3、服务器化

模块划分：
0、配置
	- 交易
1、交易
	- 对于Trade来说
2、策略
3、数据
4、信号
5、回测
6、服务器
7、浏览器
8、装饰器


```


### 老框架的问题
```
1、 数据和结果无法形成正反馈，就是动态的调整策略
2、 通过图表来正反馈
3、 数据库反馈数据的建立

```