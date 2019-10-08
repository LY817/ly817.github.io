---
layout: post
title: "dockerfile语法速查"
tags:
- docker
- 总结
date: 2019-10-8 11:05:58
author:     "LuoYu"
permalink:
categories:
description:
keywords:
---


Docker可以通过 Dockerfile 的内容来**自动构建镜像**（**引导脚本**，作为命令行的扩展，类比Maven构建Java项目的pom文件）。

Dockerfile是一个包含创建镜像所有命令的文本文件，通过**docker build**命令可以根据 Dockerfile 的内容构建镜像，在介绍如何构建之前先介绍下 Dockerfile 的基本语法结构。

根据Dockerfile的版本（文件差异），build生成的image id也不同

每执行一行命令就会生成一层新的镜像

DockerFile分为四部分组成：

- 基础镜像信息
- 维护者信息
- 镜像操作指令
- 容器启动时执行指令

### 基础准备相关指令

#### 【FROM】 基于镜像  指定base image

```dockerfile
FROM <image>
```

- FROM指定构建镜像的基础源镜像，如果本地没有指定的镜像，则会自动从     Docker 的公共库 pull 镜像下来。
- FROM必须是 Dockerfile     中非注释行的第一个指令，即一个 Dockerfile 从FROM语句开始。
- FROM可以在一个 Dockerfile     中出现多次，如果有需求在一个 Dockerfile 中创建多个镜像。
- 如果FROM语句没有指定镜像标签，则默认使用latest标签
- 如果用来制作基础镜像，使用 FROM scratch

#### 【LABEL】 定义镜像的元信息

类似注释

```dockerfile
LABEL maintainer="xxx@126.com"
LABEL version="1.0"
LABEL description="this is description"
```

#### 【MAINTAINER 】作者信息

```dockerfile
MAINTAINER <name>
```

指定创建镜像的用户

#### 【ENV】声明环境变量

```dockerfile
ENV <key> <value>       # 只能设置一个变量
ENV <key>=<value> ...   # 允许一次设置多个变量 用空格隔开
```

指定一个环境变量，会被后续RUN指令使用，并在容器运行时保留

- 之后的dockerfile脚本中可以**引用**
- 生成的容器中，系统的环境变量

#### 【USER】指定运行容器时的用户名或UID

后续的RUN、CMD、ENTRYPOINT也会使用指定用户

#### 【WORKDIR】指定工作目录

为后续的RUN、CMD、ENTRYPOINT指令配置工作目录,如果没有这个目录就会自动创建

可以使用多个WORKDIR指令，后续命令如果参数是相对路径，则会基于之前命令指定的路径

用WORKDIR代替以下命令

```dockerfile
RUN cd /xxx/xx
RUN mkdir /xx/xx
```

#### 【ONBUILD】

配置当所创建的镜像作为其它新创建镜像的基础镜像时，所执行的操作指令

#### 【ADD】导入文件

```dockerfile
ADD <src>... <dest>
ADD hom* /mydir/        # adds all files starting with "hom"
ADD hom?.txt /mydir/    # ? is replaced withany single character
```

ADD复制**本地主机文件**、目录或者**远程文件** URLS 从 并且添加到容器指定路径中 

支持通过GO 的正则模糊匹配【具体规则可参见 Go filepath.Match】

路径必须是**绝对路径**，如果不存在，会自动创建对应目录

或者路径必须是Dockerfile 所在路径的相对路径

**如果是一个目录，只会复制目录下的内容，而目录本身则不会被复制**

tips

- ADD添加压缩文件时会自动**解压缩**
- ADD适用相对路径

  ![1527314952114](/img/in-post/docker/assets/1527314952114.png)

#### 【COPY】导入文件

```dockerfile
COPY <src>... <dest>
```

COPY复制新文件或者目录从并且添加到容器指定路径中 。用法同ADD，**唯一的不同是不能指定远程文件 URLS**

#### 【VOLUME】挂载

```dockerfile
VOLUME ["/data"]
```

本地主机或其他容器挂载的挂载点

#### 【EXPOSE】暴露端口

```dockerfile
EXPOSE 22 80 8443
```

告诉Docker 服务端容器对外映射的本地端口，需要在 docker run 的时候使用-p或者-P选项生效

使用-P,主机会自动分配

### 执行类命令

#### 【RUN】镜像执行命令

```dockerfile
# shell格式 不需要用引号
RUN apt-get install -y vim
# Exec格式 指明运行的命令和该命令的参数
RUN ["executable", "param1", "param2"]
```

每条RUN指令将在当前镜像基础上执行指定命令，并**提交为新的镜像**

**每一个RUN执行都会创建一个新的镜像层（image layer）**

后续的RUN都在之前RUN提交后的镜像为基础，镜像是分层的，可以通过一个镜像的任何一个历史提交点来创建，类似源码的版本控制

尽量将多个命令合并成一行，**避免无用分层**

![1527313971124](/img/in-post/docker/assets/1527313971124.png)

#### 【CMD】容器内执行命令

**使用方式同RUN**

CMD会设置**容器启动后默认执行**的命令和参数

CMD指定在Dockerfile 中**只能使用一次**，如果有多个，则只有最后一个会生效。

CMD的目的是**为了在启动容器时提供一个默认的命令执行选项**

如果用户启动容器时指定了运行的命令，则会覆**盖掉CMD指定的命令**:如果再run image时指定了其他命令，CMD命令会被忽略

同理，可以通过空CMD获取docker run命令行末尾输入的参数，给容器启动后的ENTRYPOINT中的命令作为参数

示例dockerfile 多用于工具型的应用

![1527327769610](/img/in-post/docker/assets/1527327769610.png)

CMD会**在启动容器的时候执行，build时不执行**

RUN只是**在构建镜像的时候执行**，后续镜像构建完成之后，启动容器就与RUN无关

#### 【ENTRYPOINT】容器启动命令

**使用方式同RUN**

让容器**以应用程序或者服务的形式运行**

配置容器启动后执行的命令，并且**不可被 docker run提供的参数覆盖**

CMD是可以被覆盖的

如果需要覆盖，则可以使用docker run --entrypoint选项。

每个 Dockerfile 中只能有一个ENTRYPOINT，当指定多个时，只有最后一个生效
