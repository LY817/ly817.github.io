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

## 实现机制

### 动态代理

BeanFactory通过读取的Bean元信息（BeanDefinition）使用动态代理创建Bean实例

### 反射

通过反射来注入Bean的依赖



# AOP

基于IoC设计模式，Spring容器可以对应Bean进行统一管理

提取通用逻辑，提高代码复用性



## 实现机制 - 动态代理

运行时

Spring利用动态代理创建实例时，会动态生成Bean Class的代理类字节码，内部包含Bean实例

```java
class AService {
    public void doA() {
        
    }
}
```

```java
class AServicePorxy {
    private AService aService;
    
    public void doA() {
        // 执行前事务
        try {
            aService.doA();
        } catch (Exception e) {
            // 执行异常事务
        } finally {
            // 执行后事务
        }  
    }
}
```

### 动态代理实现 cglib和jdkProxy

#### CGLib

不需要代理目标类实现接口，会动态生成目标类的子类的字节码，让后使用classloader加载成Class对象，然后创建代理类实例

#### JDKProxy

代理目标类必须**实现接口**，生成的代理类也实现相同的接口

### 用法

总结 aop:面向切面,通过动态代理的方式来生成其代理对象在方法执行前后加入自己的逻辑 - 代理方式:jdk动态代理(接口)  cglib动态代理(基于类) - 相关名词:  1. JoinPoint连接点:拦截的接口的方法  2. Pointcut切入点:对哪些连接点进行拦截  3. Advice通知:比如前置通知 后置通知 环绕通知  4. aspect切面:切入点和通知组成 - 切入点 execution表达式  1. execution 权限修饰符 返回值类型 包名.类名.方法名(参数) - 通知类型  1. 前置通知:方法执行之前  2. 后置通知:在方法正常执行完毕后(提交事务)  3. 最终通知:在方法正常执行完毕或者出现异常  4. 异常通知:执行过程中出现异常(事物回滚)  5. 环绕通知:方法执行前后,目标方法默认不执行需自己调用方法