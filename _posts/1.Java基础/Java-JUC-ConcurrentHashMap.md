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

# 线程安全原理



## JDK1.8前

分段加锁，分为多个小数组（锁粒度为每个小数组）

## JDK1.8后

整个数组，对数组元素的操作加锁（锁粒度为数组元素）

如果是null，先进行CAS操作，进行set操作

同一时间点，只有一个线程能能对数组中的一个元素成功执行CAS操作