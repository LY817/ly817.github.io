---
layout: post
title: RocketMQ从入门到放弃
tags:
- 分布式
- RocketMQ
date: 2019-12-15 20:33:14
permalink:
categories:
description:
keywords:
---

# 概述

RcoketMQ 是一款低延迟、高可靠、可伸缩、易于使用的消息中间件。具有以下特性：

1. 支持发布/订阅（Pub/Sub）和点对点（P2P）消息模型
2. 在一个队列中可靠的先进先出（FIFO）和严格的顺序传递
3. 支持拉（pull）和推（push）两种消息模式
4. 单一队列百万消息的堆积能力
5. 支持多种消息协议，如 JMS、MQTT 等
6. 分布式高可用的部署架构,满足至少一次消息传递语义
7. 提供 docker 镜像用于隔离测试和云集群部署
8. 提供配置、指标和监控等功能丰富的 Dashboard

# 概念模型

## Topic

Topic 是一种**消息的逻辑分类**，存放同一类数据的数据集合

> 比如说你有订单类的消息，也有库存类的消息，那么就需要进行分类，一个是订单 Topic 存放订单相关的消息，一个是库存 Topic 存储库存相关的消息。

## Message

Message 是消息的载体。一个 Message **必须指定 topic**，相当于寄信的地址。

Message 还有一个可选的 tag 设置，以便消费端可以基于 tag 进行**过滤消息**。也可以添加额外的键值对，例如你需要一个业务 key 来查找 broker 上的消息，方便在开发过程中诊断问题。

### Tag

标签可以被认为是对 Topic 进一步扩展。一般在相同业务模块中通过引入标签来标记不同用途的消息。

## group

集群标识

# 组件

![1540352515138](assets\1540352515138.png)

> 简单说明一下图中箭头含义，从 Broker 开始，Broker Master1 和 Broker Slave1 是主从结构，它们之间会进行数据同步，即 Data Sync。同时每个 Broker 与 NameServer 集群中的所有节点建立长连接，定时注册 Topic 信息到所有 NameServer 中。
>
> Producer 与 NameServer 集群中的其中一个节点（随机选择）建立长连接，定期从 NameServer 获取 Topic 路由信息，并向提供 Topic 服务的 Broker Master 建立长连接，且定时向 Broker 发送心跳。Producer **只能将消息发送到 Broker master**，但是 Consumer 则不一样，它同时和提供 Topic 服务的 Master 和 Slave 建立长连接，既可以从 Broker Master 订阅消息，也可以从 Broker Slave 订阅消息。

采用分布式架构，包含以下4个组件（4种类型的Java进程），各组件可做集群部署。组件之间使用netty长连接进行通信

## NameServer 

维护集群中所有broker的路由信息，为客户端提供轻量级的服务发现。 

每个 NameServer 记录集群完整的路由信息，提供等效的读写服务（Peer-to-Peer 类似Eureka 保证高可用性 损失强一致性 可以通过客户端的补偿），并支持快速存储扩展

> 客户端获取到集群的服务信息，找到topic对应的多个broker服务，实现**基于客户端的负载均衡**，将读写压力分散到集群的多个节点

## Broker

通过提供轻量级的 Topic 和 Queue 机制来处理消息存储,同时支持推（push）和拉（pull）模式以及主从结构的容错机制。

### broker注册服务

在broker配置文件中配置集群中所有NameServer服务地址，启动broker时，会将自己的服务信息注册到所有的NameServer上。并与NameServer使用tcp长连接进行通信，通过**心跳**告知NameServer此Broker节点的监控状况

#### 心跳机制

broker会每隔30s发送心跳到所有的NameServer服务，更新自己的路由信息

##### 服务健康状态

NameServer会每隔10s检查注册的broker是否有120s（4个心跳周期）没有发送心跳。如果有，则认为该broker服务不可用，从路由信息表中删除这个broker

##### 数据存储状态

进行心跳的同时，会告知NameServer自己当前的**数据存储状态**

比如 哪些topic的哪些数据（一个topic的数据分布式存储在多个节点上）存储在当前broker上

### 配置

```properties
# 集群名称
brokerClusterName = testCluster
# broker节点名称 节点中的master和slave都使用相同的节点名称
# 集群中还有其他节点来做负载均衡，可以命名为testNode01
brokerName = testNode00
# 配置NameServer地址 高可用NameServer集群使用','隔开
namesrvAddr=10.192.1.101:9876,10.192.1.102:9876,10.192.1.103:9876
# broker服务端口
listenPort=30911
# mq消息的磁盘存储目录
storePathRootDir=/tmp/rmqstore/node00
storePathCommitLog=/tmp/rmqstore/node00/commitlog

# 发送消息的线程数 与部署集群的CPU核数一致
sendMessageThreadPoolNums=24
# dLeger相关配置 master宕机后选举出新的master
# 开启DLeger 
enableDLegerCommitLog=true
# DLeger主从选举 与brokerName一致 节点下所有的master和slave组成一个DLeger group
dLegerGroup=testNode00
# 指定dLeger服务的地址 节点中的broker配置相同
dLegerPeers=n0-10.192.1.101:40911,n1-10.192.1.102:40911,n2-10.192.1.103:40911
# 当前broker对应的dLeger节点 与dLegerPeers对应
dLegerSelfId=n0
```

## 客户端

客户端会与NameServer建立tcp长连接，拉取集群最新的路由信息，包括：

- 集群中borker的服务地址
- 集群中有哪些topic
- 每个topic的数据存放在哪些broker节点上

### Producer

生产者，产生消息的实例，拥有相同 Producer Group 的 Producer 组成一个集群

### Consumer

消费者，接收消息进行消费的实例，拥有相同 Consumer Group 的Consumer 组成一个集群

# 集群

**横向扩展**（分布式存储）

- 提高集群并发访问能力

**纵向扩展** （主从复制）

- 数据冗余
- 读写分离

## 分布式存储

多个broker主从集群共同处理同一个topic的消息

生产者根据从NameServer拉取的路由信息，得到topic对应的broker节点列表。投递消息时，通过负载均衡算法找到投递的broker，达到**分流**的目的，**提高集群的吞吐量**

消费者根据从NameServer拉取的路由信息，得到topic对应的broker节点列表，与这些broker建立长连接拉取消息

## 主从复制

- 高可用：broker使用主从架构的多副本策略来保证数据的可靠性和**高可用**性
  - 当master节点的服务不可用时，slave中还存在数据备份
  - 4.5版本之前，slave无法自动切换为master，需要手动将配置改为master重启
  - 4.5版本之后，RocketMQ支持Dledger机制（要求只是有2个slave节点），从slave选举出一个节点自动切换成master
- 读写分离：Slave节点分担了这个主从节点的读请求
  - Slave节点分担了master**部分**读请求，但**并不是Master只负责写不负责写**
  - slave对外提供读取服务的前提是master与slave的数据已经达到同步

### Master

接收producer的写请求

#### 配置

### Slave

slave节点不会接收producer客户端的写请求，而是不断从master节点拉取消息。

> slave节点和master节点一样会将自己注册到NameServer中，并于NameServer保持心跳同步状态

#### 配置

# 控制台

## 安装

## 指标