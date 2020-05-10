---
layout: post
title:ConcurrentHashMap原理
tags:
- Java基础
- 面试
- 多线程
- J.U.C
date: 2019-12-12 09:06:21
permalink:
categories:
description:
keywords:
---

# 概述

在ConcurrentHashMap出现（JDK1.5）之前，线程安全的map有两种方式：

1. 使用HashTable：每一个public方法都由synchronized关键字修饰
2. 使用`Collections.synchronizedMap(map)`对一个HashMap对象进行封装，所有方法都由`synchronized(lock){map.xxx}`包装

以上两种方法都是使用synchronized给数据结构整个加锁，将并行转换成串行

ConcurrentHashMap根据HashMap的数据结构细化锁的粒度，提高并发访问的效率

# 原理

## JDK1.8之前

在HashMap数据结构的基础上使用分段锁

 ConcurrentHashMap 由一个个 Segment 组成，Segment 代表”部分“或”一段“的意思，所以很多地方都会将其描述为分段锁。注意，行文中，我很多地方用了“槽”来代表一个 segment

> ConcurrentHashMap 是一个 Segment 数组，Segment 通过继承 ReentrantLock 来进行加锁，所以每次需要加锁的操作锁住的是一个 segment，这样只要保证每个 Segment 是线程安全的，也就实现了全局的线程安全

### 数据结构

![3](Java-JUC-ConcurrentHashMap.assets/3.png)



## JDK1.8之后

直接对每一个数组元素（链表或红黑树的首节点）加锁，锁的粒度更小，而且可以扩展

### 数据结构

与HashMap的数据结构一致，只是对数组的每一个元素添加了访问锁

![4](Java-JUC-ConcurrentHashMap.assets/4.png)

### 实现细节

#### 数组

```java
/**
 * The array of bins. Lazily initialized upon first insertion.
 * Size is always a power of two. Accessed directly by iterators.
 */
transient volatile Node<K,V>[] table;
```

#### 状态标识

大小控制的标识符

为负数时，表示正在进行扩容（-1表示正在初始化，-n表示有n-1个线程在进行扩容操作）；为整数时，表示未进行初始化，表示下一次进行扩容的大小

```java
/**
 * Table initialization and resizing control.  When negative, the
 * table is being initialized or resized: -1 for initialization,
 * else -(1 + the number of active resizing threads).  Otherwise,
 * when table is null, holds the initial table size to use upon
 * creation, or 0 for default. After initialization, holds the
 * next element count value upon which to resize the table.
 */
private transient volatile int sizeCtl;
```

