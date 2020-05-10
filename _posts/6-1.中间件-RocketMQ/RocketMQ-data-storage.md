---
layout: post
title: RocketMQ存储实现原理
tags:
- 分布式
- RocketMQ
date: 2019-12-20 20:33:14
permalink:
categories:
description:
keywords:
---

https://blog.csdn.net/Memery_last/article/details/83791165

# 消息分布式存储

RocketMQ的消息数据存储在topic逻辑分区，一个topic可以包含多个MessageQueue，这些MessageQueue可以分布在多个broker节点上，多个broker为一个topic提供消息服务，分担网络负载和磁盘存储

图

## topic

作为消息的逻辑分区 分布式集群存储中的概念？



## MessageQueue



# 存储原理

broker接收到消息后，会将数据写到磁盘

## CommitLog

broker接收到消息后，会顺序的写入到CommitLog目录下的日志中

每一个文件大小限制为1GB，broker会把数据顺序追加到CommitLog目录

> 通过broker启动配置文件的`storePathCommitLog`属性设置CommitLog目录。
>
> 例如：`storePathCommitLog=/tmp/rmqstore/node00/commitlog`

## ConsumeQueue

> 类似**索引**的概念，ConsumeQueue文件里存储的每一条消息对应在CommitLog文件中的消息数据的读取信息
>
> commitLog只单纯的负责存储数据（没有额外的数据结构来表示message属于哪个topic的哪个MessageQueue）。需要通过ConsumeQueue文件来区分这些数据对应的是broker下的MessageQueue

**写入**时，broker的接收到的所有消息顺序存储到commitLog中，同时会根据消息的topic和MessageQueue，将commitLog中的消息的存储信息【**物理存储地址（offset）**、存储的数据**长度**、消息的**tag** 没一条数据长度为20B】写到对应的ConsumeQueue文件中

**查询**时，MessageQueue通过topic、queueId找到ConsumeQueue文件，读取索引找到commitLog中的消息数据

> 存储文件：`$HOME/store/consumequeue/{topic}/{queueId}/{fileName}`
>
> 例如一个名为order的topic，在当前broker下有个两个MessageQueue，则对应的ConsumeQueue文件为
>
> - `$HOME/store/consumequeue/order`
>   - MessageQueueID0
>     - ConsumeQueue0
>     - ConsumeQueue1
>     - ···
>   - MessageQueueID1
>     - ConsumeQueue0
>     - ConsumeQueue1
>     - ···

## 写盘机制

基于操作系统的PageCache和顺序写的两种机制，来提升CommitLog文件的性能

![img](../../../img/in-post/mid-ware/TB1G0L6KpXXXXbOXVXXXXXXXXXX.png)



### 顺序写

broker收到消息数据后，按收到消息的顺序依次写入到CommitLog文件中。每次写入就是在文件末尾追加一条数据就可以了，对文件进行顺序写的性能要比对文件随机写（结构化写入？）的性能提升很多

### PageCache 异步刷盘

写入CommitLog文件的时候，不是直接写入底层的物理磁盘文件的，而是先进入**OS的PageCache内存缓存**中，然后后续由OS的后台线程选一个时间，异步化的将OS PageCache内存缓冲中的数据刷入底层的磁盘文件，这就是所谓的**异步刷盘**

#### 异步刷盘和同步刷盘

异步刷盘模式下，当数据写入到PageCache，操作系统就会返回ACK（表示数据写入成功），这样虽然能提高写入的效率，提高吞吐量

但同时也会存在丢失数据的问题：当数据写入到PageCache当没有来得及写入到磁盘时，这部分内存中的数据就会丢失

##### 同步刷盘

调用操作系统的写入命令时，当数据写入物理磁盘后才会返回ACK（表示数据写入成功）

- 优点：数据不丢失
- 缺点：降低吞吐量作为代价

## 主从同步机制

一组broker组成的高可用的主从集群中，其中一个master角色和多个slave角色；

master接收producer客户端的写请求后，将数据同步给其他的slave节点

### 主从复制模式

同步复制和异步复制是通过Broker配置文件里的brokerRole参数进行设置的，这个参数可以被设置成ASYNC_MASTER、SYNC_MASTER、SLAVE三个值中的一个

#### 同步复制

master接收到消息后，等到master和slave均写成功，才会返回客户端消息发送成功

#### 异步复制

master接收到消息后，只要master写成功了，就会返回客户端消息发送成功，同步到slave节点的动作异步进行

### DLedger 主从切换

> 当master节点宕机后，rocketmq自己不能自动的实现主从切换，而是需要**手动**修改一个slave节点的配置然后重启，将slave切换成master
>
> 引入DLedger插件可以实现leader宕机后，follow节点选举出新的leader，并自动切换

开启DLedger插件，会替代broker来管理CommitLog

#### 开启DLedger功能

##### 安装DLedger组件

DLedger是一个独立的进程，在每一个broker节点上安装一个DLedger服务，DLedger服务会监听一个端口，用于集群中DLedger服务之间的通信

##### broker配置开启DLedger模式

#### Raft协议-选举

- 设定每个节点默认投票给自己
- 如果一轮选举结果 都是选自己，所有节点休眠随机一段时间
- 先唤醒的节点投自己并广播到其他节点
- 后唤醒的节点收到之前唤醒节点的投票后，会投票给先唤醒的节点
- 最终会选举出最先被唤醒的节点 作为master

### Raft协议-多副本同步

数据同步会分为两个阶段：uncommitted阶段和committed阶段

#### uncommitted状态

Leader节点上的DLedger收到一条数据后，会标记为uncommitted状态，通过自己的DLedgerServer组件把这个uncommitted数据发送给Follower Broker的DLedgerServer。

#### committed状态

Follower Broker的DLedgerServer收到uncommitted消息之后，必须返回一个ack给Leader  Broker的DLedgerServer，然后如果Leader Broker收到**超过半数**的Follower  Broker返回ack之后，就会将消息标记为committed状态。

然后Leader Broker上的DLedgerServer就会发送commited消息给Follower Broker机器的DLedgerServer，让他们也把消息标记为comitted状态。

## 消息清理

