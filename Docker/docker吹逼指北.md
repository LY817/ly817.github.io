# docker的作用

## 开发向

#### 简化配置

源代码、运行环境和相关配置，都封装到一个镜像当中

不存在开发环境、测试环境和生产环境的区别

#### 代码流水线管理

#### 调试能力

## 运维向

#### 自动化部署

#### 隔离应用

#### 整合服务器

#### 多租户

# docker基本概念

## docker engine架构



![1547963575679](assets\1547963575679.png)

### Docker Daemon

Docker守护进程，也就是Server端，Server端可以部署在远程，也可以部署在本地，因为Server端与客户端(Docker Client)是**通过Rest API进行通信**

### docker CLI

实现容器和镜像的管理，为用户提供统一的操作界面（命令行交互）

这个客户端提供一个只读的镜像，然后通过镜像可以创建一个或者多个容器(container)，这些容器可以只是一个**RFS(Root File System)**,也可以是一个包含了用户应用的RFS。容器在docker Client中只是一个进程，两个进程是互不可见的。

> CLI：command line interface。命令行接口 不是client的缩写. RFS：Root File System 根文件系统.

## 实现原理

Docker的是基于Linux自带的（Linux。 Containers,LXC）技术

容器有效的将单个操作系统管理的资源划分到孤立的组中，以便更好的在孤立的组之间平衡有冲突的资源使用需求。

> 通过namespaces来隔离pid、net、ipc、mnt、uts
>
> 通过control groups做资源限制 限制一个容器占用的内存、cpu资源
>
> union file systems：container和image的分层和复用

![1547964168803](assets\1547964168803.png)

与虚拟化相比，这样既不需要指令级模拟，也不需要即时编译。容器可以**在核心CPU本地运行指令，而不需要任何专门的解释机制**。此外，也避免了准虚拟化（paravirtualization）和系统调用替换中的复杂性。 简而言之就是，Docker是一个盒子，一个盒子装一个玩具，无论你丢在哪里，你给他通电(glibc)，他就能运行。你的玩具大就用大盒子，小玩具就用小盒子。 两个应用之间的环境是环境是完全隔离的，建立通信机制来互相调用。容器的创建和停止都十分快速（秒级），容器自身对资源的需求十分有限，远比虚拟机本身占用的资源少。

## 基本概念

### 文件系统 RFS

docker中最基本的操作单位就是镜像和容器，本质上是文件和meta data的集合 即RFS 根文件系统

* bootfs：内核空间  linux内核 kernel
* rootfs：用户空间 linux的各个发行版 centos ubuntu Debian等

![1547967111291](assets\1547967111291.png)

如图所示，文件系统是分层的，下层作为上层的依赖

image从Base Image层开始，共享宿主机的linux kernel

image与container的区别：image的文件系统是只读的，而container的文件系统构建在image之上，最上层可以修改，保存应用的运行状态