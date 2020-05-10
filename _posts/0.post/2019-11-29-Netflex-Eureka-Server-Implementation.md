---
layout: post
title: Eureka Server注册中心实现原理
tags:
- 分布式
- 微服务
- SpringCloud
- Eureka
date: 2019-10-31 20:33:14
permalink:
categories:
description:
keywords:
---

![img](\img\in-post\micro-service\assets\8458706-df1cd20c56e7ca51.png)

## 缓存设计

Eureka 的数据存储分了两层：数据存储层和缓存层

### 数据存储层 - 服务注册表 - registry

对注册服务的维护在`com.netflix.eureka.registry.AbstractInstanceRegistry`中实现

```java
private final ConcurrentHashMap<String, Map<String, Lease<InstanceInfo>>> registry
            = new ConcurrentHasdhMap<String, Map<String, Lease<InstanceInfo>>>();
```

registry由两层ConcurrentHashMap组成

- 第一层
  - key：注册的eureka客户端中`spring.application.name`配置的服务名
  - value：指向第二层ConcurrentHashMap的引用，表示key服务名对应的注册服务实例信息集合
- 第二层
  - key：注册的服务实例的InstanceId
  - value：Lease对象 包含了服务详情和服务治理相关的属性  

### 二级缓存层 

通过 Eureka Server 的二层缓存机制，可以非常有效地提升 Eureka Server 的响应时间，通过数据存储层和缓存层的数据切割，根据使用场景来提供不同的数据支持。

在**ResponseCacheImpl**中实现

> `com.netflix.eureka.registry.ResponseCacheImpl`中实现
>
> `com.netflix.eureka.registry.AbstractInstanceRegistry`中调用initializedResponseCache()实现

#### 第一级缓存 - readOnlyCacheMap - 外部读取

> 为了供客户端获取注册信息时使用，供对外暴露的getRegistry接口读取

ResponseCacheImpl中的`ConcurrentHashMap<Key,Value> readOnlyCacheMap`属性

本质上是 ConcurrentHashMap，无过期时间，保存服务信息的对外输出数据结构（Value，区别于registry中的Lease对象）

##### 更新机制

TimerTask定时从二级缓存拉取注册信息

#### 第二级缓存 - readWriteCacheMap - 中间缓存

> 为了**降低注册表registry读写锁竞争**，降低读取频率

 Loading<Key,Value> readWriteCacheMap

本质上是 guava 的缓存，包含定时失效机制，保存服务信息的**对外输出**数据结构（Value） 

##### 过期机制

- 接收到Eureka Client 发送的 register、renew 和 cancel 请求并更新 registry 注册表之后，使二级缓存失效`invalidate(Key... keys)`；
- Eureka Server 自身的 Evict Task 剔除服务后，删除二级缓存；
- 二级缓存本身设置了 guava 的失效机制，隔一段时间后自己自动失效；

##### 更新机制

- Eureka Client 获取全量或者增量的数据时，会先从一级缓存中获取；如果一级缓存中不存在，再从二级缓存中获取；如果二级缓存也不存在，这时候先将registry的数据同步到二级缓存中，再从缓存中获取
- 定时更新一级缓存的时候，会读取二级缓存，如果二级缓存没有数据，也会触发load，拉取registry的注册数据

### 相关实现类关系

![image-20191121125107737](\img\in-post\micro-service\assets\image-20191121125107737.png)

## 数据结构

### 服务注册表

`ConcurrentHashMap<String, Map<String, Lease<InstanceInfo>>>`

#### Lease



#### InstanceInfo



### 缓存

`ConcurrentHashMap<Key,Value>`

`Loading<Key,Value>`

#### Value



## 数据交互

![1574346515486](\img\in-post\micro-service\assets\1574346515486.png)



![img](\img\in-post\micro-service\assets\1158841-20190704115343832-1380910507.png)

> 维护服务列表
>
> LeaseManager接口主要是维护可用服务清单的，它将服务的可能期限抽象为租约期限，该接口负责为一个实例的租约的创建、续约、和下线 

### Eureka Server

#### 对外暴露服务http接口

Eureka注册中心是Servlet应用

使用Jersey框架（@POST/@Consumers）对外提供RESTful HTTP接口

- 接收Eureka客户端请求，维护服务注册表数据（增删改）
- 提供获取最新服务注册表的接口（查询）
- 提供前端可视化界面服务（展示）

#### 维护服务注册表

根据Eureka Client请求维护注册表

> **leaseManager接口**定义了应用实例在服务中的以下核心操作
>  **服务注册register** ，**服务下线cancel**，**服务租约renew**和心跳操作一起保持租约，**服务剔除evict** 

#### Peer之间注册表数据同步

集群部署的注册中心，节点角色对等，互相作为对方的客户端。当其中一个节点进行了注册表变更后，会通知其他的server节点

> InstanceRegistry类继承了 **PeerAwareInstanceRegistryImp**l类
>
> 在服务注册、续约、下线等操作完成后，会去调用PeerAwareInstanceRegistryImpl的相关逻辑。而PeerAwareInstanceRegistryImpl中主要是添加了一个广播的功能，拥有了将服务实例的注册、续约、下线等操作同步到其它Eureka Server的能力。

### Eureka Client

#### 维护服务注册表

封装与Eureka Server交互，更新本地的服务注册表以及更新注册中心自己的状态

#### 服务名解析

为Fegin和Ribbon提供服务名解析接口，通过微服务名称获取实例的实际访问地址集合，供Ribbon负载均衡获取实际访问地址