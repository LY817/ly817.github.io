# Docker架构

Docker提供一个开发、打包、运行应用的平台，把运行的应用和底层infrastructure隔离开

![1527234757293](.\assets\1527234757293.png)

## Docker Engine

![1527234891268](.\assets\1527234891268.png)

### 后台进程（dockerd）

也可以叫做DOCKER_HOST或Docker deamon（运行的进程名叫dockerd），作为docker中相关概念的实现

可以不和client运行在同一个主机上

### REST API Server

### CLI接口

通过REST API调用docker后台进程

#### 交互示意图

![1527235619902](.\assets\1527235619902.png)





### docker基础知识

#### 底层基础支持

##### Namespaces

linux中用来自带 用来隔离资源：pid（进程）、net（网络）、ipc、mnt（文件）、uts

##### Control groups

资源限制 cpu 内存

##### Union file systems

container和image的分层 减少冗余



### image

![1527237732160](.\assets\1527237732160.png)

#### 概念

##### 文件系统

image是文件和meta data（元数据）的集合（root filesystem）

##### 分层

image是分层的，并且每一层都可以添加 修改 删除文件，成为一个新的image

##### 依赖

不同的image可以共享相同的基础image

##### 只读

image本身是read-only

##### 基础镜像

直接基于linux kernel的image，成为base image，多为linux的发行版本



### container

![1527238781685](.\assets\1527238781685.png)



##### 创建

由docker run image来创建

##### 可写

在image layer上建立一个container layer（可读写）

##### 职责

image复制app的存储和分发，container负责运行app



