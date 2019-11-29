---
layout: post
title: SpringBoot特性之构建独立应用
tags:
- SpringBoot
date: 2019-11-29 12:47:00
permalink:
categories:
description:
keywords:
---



# Maven配置

Spring Boot应用的maven配置

## 继承依赖

SpringBoot应用的pom文件，通过继承`spring-boot-starter-parent`，获取SpringBoot的特性

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.0.RELEASE</version>
    <relativePath/>
</parent>
```

如果项目已经有了父pom，需要引入SpringBoot特性，但无法继承`spring-boot-starter-parent`（比如在SpringBoot基础上构建的SpringCloud项目的依赖就是通过添加`spring-cloud-dependencies`依赖实现的），可以通过引入`spring-boot-dependencies`依赖来获取SpringBoot特性

> 可以看到 `spring-boot-starter-parent`继承自`spring-boot-dependencies`

通过上述的maven依赖配置，可以获取与当前SpringBoot版本**对应**的配置信息（约定版本号）

- starter和第三方库的依赖
- 引入相关maven插件依赖

> 将SpringBoot版本对应的所有依赖的版本信息都规约`spring-boot-dependencies`中。
>
> 子项目再引用时，不需要配置依赖的版本号，通过继承的`spring-boot-dependencies`中的配置找到适配版本的依赖

## 添加插件

SpringBoot应用需要在pom引入spring-boot-maven-plugin开启SpringBoot相关功能

- 打包：fat jar，war

```xml
 <build>
     <plugins>
         <plugin>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-maven-plugin</artifactId>
         </plugin>
     </plugins>
</build>
```

## 添加依赖

根据需要，在pom文件中引入第三方库的starter依赖，不需要版本号，使用parent中规约的对应版本号

# 打包

pom文件中引入spring-boot-maven-plugin依赖后，通过`mvn package`打包

## jar

### 目录结构

fat jar解压后的文件目录

- BOOT-INF/classes

  包编译后的class文件 

- BOT-INF/lib

  应用依赖的JAR包 

- META-INF

  应用相关的元信息，如MANIFEST.MF文件和maven配置

  MANIFEST.MF作为jar包的说明文件，指定启动类为JarLauncher，并为SpringBoot启动的扩展属性

  ```
  Manifest-Version: 1.0
  Implementation-Title: sparrow-eureka-server
  Implementation-Version: 1.0-SNAPSHOT
  Built-By: admin
  Implementation-Vendor-Id: org.ly817
  Spring-Boot-Version: 2.0.0.RELEASE
  Main-Class: org.springframework.boot.loader.JarLauncher
  Start-Class: org.ly817.server.SparrowEurekaServerApplication
  Spring-Boot-Classes: BOOT-INF/classes/
  Spring-Boot-Lib: BOOT-INF/lib/
  Created-By: Apache Maven 3.3.9
  Build-Jdk: 1.8.0_60
  Implementation-URL: https://projects.spring.io/spring-boot/#/spring-boot-starter-parent/sparrow/sparrow-eureka-server
  ```

  - Main-Class：定义jar文件的入口类，该类必须是含有main方法的可执行类，定义了该属性即可通过
  - Start-Class：指定SpringBoot应用的入口类
  - Spring-Boot-Classes：指定SpringBoot应用项目的编译后的字节码文件目录
  - Spring-Boot-Lib：指定SpringBoot应用项目第三方依赖库目录

- org.springframework.boot.loader包

  SpringBoot jar包启动的实现
  
  使用java -jar命令实际上是执行`org.springframework.boot.loader.JarLauncher`中的main方法

## war

SpringBoot同样也支持生成war包，部署到web容器中

### 打包设置

默认情况打包会生成jar包，

1. 在pom文件中配置`<packaging>war</packaging>`

2. 设置打包时排除tomcat依赖，有web容器提供

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-tomcat</artifactId>
       <scope>provided</scope>
   </dependency>
   ```

   默认情况下，tomcat的依赖会被作为内置web容器实现引入，需要排除tomcat依赖放在与web容器冲突

3. SpringBootServletInitializer

   SpringBoot的启动类继承SpringBootServletInitializer

   可以通过重写SpringBootServletInitializer的方法来对web的相关对象进行自定义操作（如servlet、listener，替代传统的web.xml配置）

> 关于web.xml
>
> SpringBoot遵循[Servlet 3.0规范 JSR 315](https://jcp.org/en/jsr/detail?id=315)，通过Servlet 3.0提供的接口`javax.servlet.ServletContainerInitializer`，结合SPI机制，在`spring-web`包下发现`META-INF/services/javax.servlet.ServletContainerInitializer`实现类：`org.springframework.web.SpringServletContainerInitializer`从而进行初始化，包括对`DispatcherServlet`的注册，`ContextLoaderListener`的注册等等，最终免去`web.xml`

### 目录结构

- WEB-INF

  与正常的war包一样

  - lib
  - lib-privided
  - classes
  - web.xml

- META-INF

  应用相关的元信息，如MANIFEST.MF文件和maven配置

  与fat jar不同的是MANIFEST.MF中Main-Class的值改为了 org.springframework.boot.loader.**JarLauncher**

- org.springframework.boot.loader包

  SpringBoot应用加载器

# 启动原理

从上述jar文件目录结构可以推测，在使用maven插件生成SpringBoot项目的jar包时，执行完正常的编译打包后，会进行repackage操作，生成我们最后看到的fat jar文件

SpringBoot件被放到BOOT-INF/classes目录下；项目的依赖库被放到BOOT-INF/lib目录（普通的jar不会包含所依赖的jar文件）。

fat jar文件的根目录，存放的是spring-boot-loader（`org.springframework.boot.loader`）包，使用java -jar启动SpringBoot fat jar时，实际上是读取META_INF/MANIFEST.MF文件中的Main-class属性，执行`org.springframework.boot.loader.JarLauncher`

## spring-boot-loader

SpringBoot生成的fat jar和war包实际上是通过spring-boot-loader启动

### Launcher

SpringBoot启动的基本实现类

#### 基本流程

- 读取MANIFEST.MF文件中的Start-Class，获取SpringBootApplication启动类路径
- 为SpringBoot应用加载启动所需的**classpath**运行环境（lib依赖包，配置文件）
- 通过MainMethodRunner，调用SpringBootApplication启动类

#### 实现子类 

- ExecutableArchiveLauncher 

  读取MANIFEST.MF文件中的Start-Class，获取SpringBoot启动类

  - JarLauncher

    加载fat jar中的相关资源

  - WarLauncher

    加载war中相关资源

### Archive 资源文档

在spring boot里，抽象出了Archive的概念

一个archive可以是一个jar（JarFileArchive），也可以是一个文件目录（ExplodedArchive）。可以理解为Spring boot抽象出来的统一访问资源的层

```java
public abstract class Archive {
    // 每一个Archive对应一个URL 表示文件位置
	public abstract URL getUrl();
	public String getMainClass();
	public abstract Collection<Entry> getEntries();
    // 获取嵌套的子文档
	public abstract List<Archive> getNestedArchives(EntryFilter filter);
}
```

### MainMethodRunner

利用Java反射调用SpringBootApplication启动类的main方法，启动SpringBoot应用

# 运行方式

## 开发阶段

### main方法启动

开发中最常用的方式，运行SpringBoot入口类的main方法

### maven插件启动

引入spring-boot-maven-plugin插件，在pom文件同级目录下，通过`mvn spring-boot:run`启动SpringBoot应用

传入命令行参数：`mvn spring-boot:run -Drun.arguments="--server.port=8888"`

## 部署阶段

### jar包启动

使用SpringBoot打包插件生成的fat jar包后，通过命令`java -jar spring-app-0.0.1.SNAPSHOT.jar` 启动SpringBoot项目

传入命令行参数：`java -jar spring-app.jar --server.port=8081`

### war包容器启动

按上述步骤生成war包，通过web容器启动