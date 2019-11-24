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

如果项目已经有了父pom，需要引入SpringBoot特性，但无法继承`spring-boot-starter-parent`（如），可以通过引入`spring-boot-dependencies`依赖来获取SpringBoot特性

> 可以看到 `spring-boot-starter-parent`继承自`spring-boot-dependencies`

通过上述的maven依赖配置，可以获取与当前SpringBoot版本**对应**的配置信息

- starter和第三方库的依赖（约定版本号）
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

通过`mvn instsall`

## jar

pom文件的

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

  SpringBoot jar包启动的实现，使用java -jar命令实际上是执行`org.springframework.boot.loader.JarLauncher`中的main方法

## war

SpringBoot同样也支持生成war包，部署到web容器中

web.xml

# 运行方式

## main方法启动



## maven插件启动



## war包容器启动