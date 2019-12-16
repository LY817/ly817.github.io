---
layout: post
title: RocketMQ配置与部署
tags:
- 分布式
- RocketMQ
date: 2019-12-18 20:33:14
permalink:
categories:
description:
keywords:
---

# 配置

## 操作系统参数

> 配置方式
>
> - 编辑**/etc/sysctl.conf** ，改**vm.overcommit_memory=1**，然后**sysctl -p**使配置文件生效 
>
> - **sysctl vm.overcommit_memory=1** 
>
> - **echo 1 > /proc/sys/vm/overcommit_memory** 

### `vm.overcommit_memory` 系统内存分配策略

可以选择0/1/2，**设置为1**

- 0：当进程向系统申请内存资源时，OS内核会检查可用内存是否足够，如果不够会拒绝申请，会导致进程异常
- 1：表示内核允许分配所有的物理内存，而不管当前的内存状态如何
- 2：表示内核允许分配超过所有物理内存和交换空间总和的内存

### `vm.max_map_count` 进程可开启线程数

默认值为65536，可以调大一点

### `vm.swappiness` 进程swap频率

默认为60，设置为10

- 0：不使用swap，尽量使用物理内存
- 100：尽量使用swap，腾出更多的内存给活跃的进程

#### swap

OS会把一部分磁盘空间作为**swap区域**，如果有的进程不太活跃，操作系统会把改进程调整为睡眠状态，把占用的内存空间腾出来让给其他活跃的进程

### `ulimit ` 最大文件句柄数

默认为1024，对于频繁进行磁盘IO操作或者网络通信时，这个链接数太小，会出现`error:too many open files`的错误

直接拉满 设为1000000

## JVM参数

默认参数写在bin目录启动脚本中

- mqbroker.sh：启动broker
- mynamesvr.sh：启动NameServer

### broker启动参数

```sh
-server 
-Xms8g -Xmx8g -Xmn4g 
-XX:+UseG1GC -XX:G1HeapRegionSize=16m -XX:G1ReservePercent=25 
-XX:InitiatingHeapOccupancyPercent=30 -XX:SoftRefLRUPolicyMSPerMB=0 
-verbose:gc -Xloggc:/dev/shm/mq_gc_%p.log 
-XX:+PrintGCDetails -XX:+PrintGCDateStamps 
-XX:+PrintGCApplicationStoppedTime 
-XX:+PrintAdaptiveSizePolicy 
-XX:+UseGCLogFileRotation 
-XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=30m 
-XX:-OmitStackTraceInFastThrow -XX:+AlwaysPreTouch 
-XX:MaxDirectMemorySize=15g -XX:-UseLargePages -XX:-UseBiasedLocking
```



## RocketMQ配置



# 启动