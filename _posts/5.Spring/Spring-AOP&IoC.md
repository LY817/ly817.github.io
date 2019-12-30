---
layout: post
title: Spring特性之IoC和AOP
tags:
- Spring
- 面试
date: 2019-12-29 12:47:00
permalink:
categories:
description:
keywords:
---

Spring被创造出来的目的是为了降低程序开发中类之间的耦合

# IoC

> IoC (Inversion of Control) 控制反转，也叫做DI(Dependency Injection) 依赖注入

没有引入IoC框架之前，Java程序中如果需要使用一个对象，要先通过`new`创建对象；

引入Spring IoC框架后，将创建Java对象实例的工作交给Bean容器，由容器对Bean对象进行**统一**的管理

IoC框架的核心是**引入实例容器**，将分散在程序不同位置的调用统一管理

## 控制反转

**将创建对象的控制权，由程序（调用方）转移给IoC容器**，这就是所谓所谓的控制反转

## 依赖注入

IoC容器通过读取**元信息**（配置或注解），将调用方所依赖的Bean引用**注入到调用方声明的成员变量**

> - 调用方也可以是Bean容器中的一个实例
> - 调用方也可以通过BeanFactory的API直接从Bean容器中获取实例

## 实现机制 - 反射

