# MQ应用场景

- 解耦业务流程 提高响应速度

- 重试机制 可靠性投递 屏蔽第三方系统服务不可用的风险

  同步调用 改为异步调用 第三方接口调用失败 会再次消费到消息 重新调用接口，或返回延迟 不会影响己方的服务响应


# 源码编译安装

## 源码与编译

1. clone github上 org.apache.rocketmq

   - `git clone https://github.com/apache/rocketmq.git`

   - 进入./rocketmq目录

   - 当前为master分支，需要切换到自己需要的分支 如release-4.6或者store_with_dledger origin/store_with_dledger（整合dledger集群选举的分支）
   - 使用maven编译 `mvn -Prelease-all -DskipTests clean install -U`
   - 编译的部署包在`rocketmq/distribution/target`目录