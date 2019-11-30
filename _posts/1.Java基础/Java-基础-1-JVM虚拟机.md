---
layout: post
title: JVM虚拟机
tags:
- Java基础
date: 2019-12-01 20:33:14
permalink:
categories:
description:
keywords:
---





# JVM数据区域

> JVM内存模型区别于Java内存模型JMM

![img](assets/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxNy85LzQvZGQzYjE1YjNkODgyNmZhZWFlMjA2Mzk3NmZiOTkyMTM_aW1hZ2VWaWV3Mi8wL3cvMTI4MC9oLzk2MC9mb3JtYXQvd2VicC9pZ25vcmUtZXJyb3IvMQ)

JVM**运行时**数据区域划分

- 线程共享
  - 堆
  - 方法区
    - 运行时常量池
- 线程独占
  - 虚拟机栈
  - 本地方法栈
  - 程序计数器



![img](assets\908514-20160728195713028-1922699910.jpg)



## 线程共享

### 方法区 Method Area

所有线程共享的一块内存区域，用于存储所谓的**元（Meta）数据**，例如类结构信息（Class对象），以及对应的运行时常量池、字段、方法代码等

> #### 永久代 PermGem
>
> java8之前方法区称为永久代，Java8之后被废除，替换为Metaspace(本地内存中) 
>
> PermGem有大小限制，当JVM中动态代理生成太多class对象，就会抛出` java.lang.OutOfMemoryError:PermGenspace `
>
> Metaspace不在JVM中，不受JVM的大小限制

####  运行时常量池（Run-Time Constant Pool） 

方法区的一部分。Java的常量池可以存放各种常量信息，不管是编译期生成的各种字面量，还是需要在运行时决定的符号引用，所以它比一般语言的符号表存储的信息更加宽泛。
程序运行期间，静态存储的数据将随时等候调用。可用`static关键字`指出一个对象的特定元素是静态的。但Java对象本身永远都不会置入静态存储空间。 

### 相关启动参数

> - `-Xmx value` 最大堆体积
> - `-Xms value` 初始的最小堆体积
> - `-XX:NewRatio=value` 老年代和新生代的比例
>    默认情况下，这个数值是3，意味着老年代是新生代的3倍大；换句话说，新生代是堆大小的1/4。
> - `-XX:NewSize=value` 新生代大小
>     可以不用比例的方式调整新生代的大小，直接指定下面的参数，设定具体的内存大小数值
> - `-XX:SurvivorRatio=value`
>     Eden和Survivor的大小是按照比例设置的，如果SurvivorRatio是8，那么Survivor区域就是Eden的1/8大小，也就是新生代的1/10，因为YoungGen=Eden + 2*Survivor

### 堆 Heap

Java内存管理的核心区域，用来放置Java对象实例，几乎所有创建的Java对象实例都是被直接分配在堆上。堆被**所有的线程共享** 

#### 新生代 NewGen

年轻代又分为Eden和Survivor区。Survivor区由FromSpace和ToSpace组成。Eden区占大容量，Survivor两个区占小容量，默认比例是8:1:1 

##### Eden 伊甸园

绝大多数新建的对象都“出生在”Eden ，占用内存很大的对象，会被直接在老年代创建

##### Survivor 幸存者

分为两个大小相同的区域，称为FromSpace和ToSpace。用来放置Minor GC复制-清除算法存活下来的对象

> 用于复制-清除算法，为了解决碎片化。

#### 老年代 OldGen

放置长生命周期的对象，通常都是从Survivor区域拷贝过来的对象（Survivor区存活了）；也可能是占用内存很大的对象，在创建的时候被直接放到老年代； 

## 线程私有

每启动一个线程都会给线程分配一块内存区域

### 程序计数器（PC，Program Counter Register）

指向线程

每个线程都有它自己的程序计数器，并且任何时间一个线程都只有一个方法在执行，也就是所谓的**当前方法**

> 程序计数器会存储当前线程正在执行的Java方法的JVM指令地址；或者，如果是在执行本地方法，则是未指定值（undefined） 

### Java虚拟机栈（Java Virtual Machine Stack）

每个线程在创建时都会创建一个虚拟机栈，其内部保存一个个的栈帧（Stack Frame），对应着一次次的Java方法调用

### 本地方法栈（Native Method Stack） 

native方法调用





# Java执行流程

