# 简介

https://spring.io/projects/spring-boot

官网对Spring Boot的介绍

> Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".
>
> We take an opinionated view of the Spring platform and third-party  libraries so you can get started with minimum fuss. Most Spring Boot  applications need very little Spring configuration.

介绍的解读

> Spring boot使创建独立的、产品级的基于Spring的应用程序变得很容易。
>
> 以往基于spring的应用需要配置引入各种依赖、各种配置，解决各种依赖冲突等；使用Spring Boot，只需要运行SpringApplication中的run方法。
>
> 并且Spring Boot提供了各种starter，来固化Spring与第三方类库，只需要在pom文件引入对应的starter，由对应的starter指向具体的依赖，引入默认配置，大大减少了spring应用配置的复杂度。

# Spring Boot特性

- Create stand-alone Spring applications

  创建独立的Spring应用 （可以通过java -jar启动 不需要第三方容器）

- Embed Tomcat, Jetty or Undertow directly (no need to deploy WAR files)

  直接嵌入tomcat、Jetty或Undertow等web容器

- Provide opinionated 'starter' dependencies to simplify your build configuration

  提供固化的第三方starter依赖，简化构建配置

- Automatically configure Spring and 3rd party libraries whenever possible

  当依赖条件满足时，自动地装配第三方类库

- Provide production-ready features such as metrics, health checks and externalized configuration

  提供运维（Production-Ready）特性，如性能指标（Metrics）、健康检查及外部化配置

- Absolutely no code generation and no requirement for XML configuration

  没有代码生成，并且不需要XML配置

## 独立应用

## 内嵌容器

## starter机制

## 运维特性



