# Docker Compose

## 简介

自动构建镜像、启动容器

使用yml文件将属于一个应用的多个docker run命令 “打包”

Compose 是一个用户定义和运行多个容器的 Docker 应用程序。在 Compose 中你可以使用 YAML 文件来配置你的应用服务。然后，只需要一个简单的命令，就可以创建并启动你配置的所有服务。 

docker-ce安装默认由engine和compose

## 操作步骤

1. 在 Dockfile 中定义你的应用环境，使其可以在任何地方复制。
2. 在 docker-compose.yml 中定义组成应用程序的服务，以便它们可以在隔离的环境中一起运行。
3. 最后，运行`dcoker-compose up`，Compose 将启动并运行整个应用程序。

## yml语法 

#### version 定义版本

#### services 声明服务

* 每一个子节点，对应一个需要启动的**容器名字**（用户自己自定义，它就是服务名称 ） 
  * 子节点包含启动构建这个镜像选用的名称参数

```yml
services:
  web:
    image: dockercloud/hello-world
    ports:
      - 8080
    networks:
      - front-tier
      - back-tier
 
  redis:
    image: redis
    links:
      - web
    networks:
      - back-tier
```

* 服务除了可以基于指定的镜像，还可以基于一份 Dockerfile，在使用 up 启动之时执行构建任务，这个构建标签就是 build，它可以指定 Dockerfile 所在文件夹的路径。Compose 将会利用它自动构建这个镜像，然后使用这个镜像启动服务容器。

#### volumes 定义挂载点



#### networks 定义网桥



## 命令行

#### 【up】执行docker-compose文件

默认执行当前目录下的docker-compose.yml脚本

--scale xxx=N

#### 【down】关闭并删除

#### 【start】

#### 【stop】

#### 【ps】

#### 【scale】

#### 【build】将yml文件中需要从dockerfile编译的镜像先构建成镜像

