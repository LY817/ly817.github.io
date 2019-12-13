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

使用netty进行通信，组件之间使用长连接

# 组件

## NameServer



## Broker



# 角色

## Producer 生产者



## Consumer 消费者



# 主从集群





## NameServer与Broker通讯

### 通讯方式

Broker会跟每个NameServer都建立一个TCP长连接 

# 分布式存储

多个broker主从集群共同处理同一个topic的消息

生产者从NameServer