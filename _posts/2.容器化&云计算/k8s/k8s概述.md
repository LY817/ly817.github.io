Kubernetes 是一个开源的，用于管理云平台中多个主机上的容器化的应用， Kubernetes 的目标是让部署容器化的应用简单并且高效, Kubernetes 提供了应用部署，规划，更新，维护的一种机制 

# 概念定义

## service

封装多个标签相同的pod，对外提供服务，负载均衡

## Pod

在 Kubernetes 中，最小的管理单元不是一个个独立的容器，而是 Pod 

Pod资源对象是一种集合了一个或多个应用容器、存储资源、专用ip、以及支撑运行的其他选项的逻辑组件

![img](assets\1349539-20190225094840507-1212558195.png)

> Pod其实就是一个应用程序运行的单一实例，它通常由共享资源且关系紧密的一个或多个应用容器组成
>
> Pod中多个容器通过pause共享网络地址（通过localhost可以互相访问），存储挂载等资源

### 自主式pod



### 受控制器管理的pod

#### pod控制器

##### ReplicationController

##### ReplicaSet

##### Deployment



# 组件结构

k8s集群分为master节点和工作节点

## Master节点

管理整个集群的运行

### APIServer

作为整个集群的网关，所有服务访问的统一入口

### Sheduler

负责接收任务，选择合适的工作节点分配任务

> 将合适的资源分配给任务

### Controller Manager

维护基本期望数目

### etcd

对于整个k8s集群非常重要

集群状态持久化存储，维护了k8s集群中不同节点的协调信息

- Flannel：容器的虚拟网络IP分配对应关系

## 工作节点

运行容器，与docker api进行交互

### kubelet

直接与容器引擎（如docker）交互，实现容器的生命周期管理

### kube-proxy

负责pod与pod之间的通信

> 负责写入规则到IPTABLES、ipvs，实现服务映射访问


### docker引擎

## 重要插件

### CoreDNS

为集群中的SVC创建一个域名-IP的对应关系解析

### Dashboard

为用户提供管理界面

### Ingress Controller

### Fedetation

提供跨集群中心多K8S统一管理

### Prometheus

普罗米修斯---监控集群的健康状况

### ELK

日志统一分析

# 网络通信

## Service之间的通信

各个节点的iptables映射规则

## Service中Pod之间通信

假定集群中的所有pod都在一个可以直接连通的网络环境中，可以通过ip互相访问（实际上集群中，不同机器上的pod不能直接通过ip互相访问，需要额外的转换机制实现）

通过overlay network互相访问

## Pod中容器之间通信

其他容器link到pause容器来共享网络栈，通过**localhost+端口**就能互相访问

同一个pod下的容器中的应用的端口不能重复

## Flannel

由CoreOS公司针对k8s设计的一个网络规则服务。

- 让集群不同主机中创建的docker容器都具有全集群唯一的虚拟IP地址
- 在这些虚拟IP之间构建一个覆盖网络（overlay network），通过这个覆盖网络，将数据包在不同主机上的容器之间传递

![image-20191025131528103](assets\image-20191025131528103.png)

- flannel0虚拟网卡：抓取docker0网卡中容器之间通信的数据包
- Flanneld 进程：解析数据包