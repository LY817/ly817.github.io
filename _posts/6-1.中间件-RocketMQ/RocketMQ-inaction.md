# MQ应用场景

- 解耦业务流程 提高响应速度

- 重试机制 可靠性投递 屏蔽第三方系统服务不可用的风险

  同步调用 改为异步调用 第三方接口调用失败 会再次消费到消息 重新调用接口，或返回延迟 不会影响己方的服务响应
  
- 延时消息

   给消息设置`DelayTimeLevel`级别 从1到18

  `1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h`

- 事务消息

  发送一个half状态的message，consumer不会感知到这个消息
  
  直到这个消息的producer发送commit请求到broker，将这个half状态的message改为正常，consumer才能消费到这个消息；或者producer发送rollback请求到broker，将half状态的message消息删除。
  
  这个过程由producer客户端与broker保持长连接来维护这个消息的状态


# 源码安装

## 源码与编译

1. clone github上 org.apache.rocketmq 

   - `git clone https://github.com/apache/rocketmq.git`

2. 编译

   - 进入./rocketmq目录

   - 当前为master分支，需要切换到自己需要的分支 如release-4.6或者store_with_dledger origin/store_with_dledger（整合dledger集群选举的分支）

   - 使用maven编译 `mvn -Prelease-all -DskipTests clean install -U`

   - 编译的部署包在`rocketmq/distribution/target`目录

3. 部署