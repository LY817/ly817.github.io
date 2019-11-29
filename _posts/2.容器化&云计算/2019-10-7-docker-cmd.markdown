---
layout: post
title: "docker命令行速查"
tags:
- docker
- 文档
date: 2019-10-07 21:18:26
author:     "LuoYu"
permalink:
categories:
description:
keywords:
---


![1524547418643](/img/in-post/docker/resources/1524547418643.png)

### 镜像管理

#### 【images】查看本地镜像

`docker images [OPTIONS] [REPOSITORY[:TAG]]`

OPTIONS说明：

- -a :列出本地所有的镜像（含中间映像层，默认情况下，过滤掉中间映像层）
- --digests :显示镜像的摘要信息
- -f :显示满足条件的镜像
- --format :指定返回值的模板文件
- --no-trunc :显示完整的镜像信息
- -q :只显示镜像ID

#### 【rmi】删除本地镜像

`docker rmi [OPTIONS] IMAGE [IMAGE...]`

OPTIONS说明：

- -f :强制删除
- --no-prune :不移除该镜像的过程镜像，默认移除

#### 【build】使用Dockerfile创建镜像（到本地）

`docker build [OPTIONS] PATH | URL | .`

PATH文件路径或URL远程的dockerfile

PTAH使用 '.'表示将当期目录下所有文件提供给docker解析 

OPTIONS说明：

- -t xxxx：给生成的镜像标记一个名字
- --build-arg=[] :设置镜像创建时的变量
- --cpu-shares :设置 cpu 使用权重
- --cpu-period :限制 CPU CFS周期
- --cpu-quota :限制 CPU CFS配额
- --cpuset-cpus :指定使用的CPU id
- --cpuset-mems :指定使用的内存 id
- --disable-content-trust :忽略校验，默认开启
- -f :指定要使用的Dockerfile路径
- --force-rm :设置镜像过程中删除中间容器
- --isolation :使用容器隔离技术
- --label=[] :设置镜像使用的元数据
- -m :**设置内存最大值**
- --memory-swap :设置Swap的最大值为内存+swap，"-1"表示不限swap
- --no-cache :创建镜像的过程不使用缓存
- --pull :尝试去更新镜像的新版本
- -q :安静模式，成功后只输出镜像ID
- --rm :设置镜像成功后删除中间容器；
- --shm-size :设置/dev/shm的大小，默认值是64M
- --ulimit :Ulimit配置

上下文路径

#### 【history】查看指定镜像的创建历史

`docker history [OPTIONS] IMAGE`

OPTIONS说明：

- -H :以可读的格式打印镜像大小和日期，默认为true
- --no-trunc :显示完整的提交记录
- -q :仅列出提交记录ID。

#### 【save】将指定镜像保存成 tar 归档文件

`docker save [OPTIONS] IMAGE [IMAGE...]`

OPTIONS说明：

- -o :输出到的文件

#### 【import】从归档文件tar中创建镜像

`docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]`

OPTIONS说明：

- -c :应用docker 指令创建镜像
- -m :提交时的说明文字

### 仓库管理

#### 【login】登录

#### 【logout】登出

`docker login [OPTIONS] [SERVER]`

`docker logout [OPTIONS] [SERVER]`

OPTIONS说明：

- -u :登陆的用户名
- -p :登陆的密码

#### 【pull】从镜像仓库中拉取或者更新指定镜像

`docker pull [OPTIONS] NAME[:TAG|@DIGEST]`

OPTIONS说明：

- -a :拉取所有 tagged 镜像
- --disable-content-trust :忽略镜像的校验,默认开启

#### 【push】将本地的镜像上传到镜像仓库,要先登陆到镜像仓库

`docker push [OPTIONS] NAME[:TAG]`

OPTIONS说明：

- --disable-content-trust :忽略镜像的校验,默认开启

在push之前需要使用tag创建一个与推送地址符合的镜像命名空间，用来指定推送地址

- `docker tag sparrow-eureka-server:latest registry.cn-shanghai.aliyuncs.com/luoyu817/sparrow-eureka-server:single`

- `docker push registry.cn-shanghai.aliyuncs.com/luoyu817/sparrow-eureka-server:single` 

#### 【search】从Docker Hub查找镜像

`docker search [OPTIONS] TERM`

OPTIONS说明：

- --automated :只列出 automated build类型的镜像
- --no-trunc :显示完整的镜像描述
- -s :列出收藏数不小于指定值的镜像

### 容器管理

#### 【create】创建一个新的容器但不启动它

#### 【run】创建一个新的容器并运行一个命令

run传入的参数可以覆盖构建镜像时设置的参数

`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

OPTIONS说明：

- -a stdin: 指定标准输入输出内容类型，可选 STDIN/STDOUT/STDERR 三项
- -d: **后台运行**容器，并返回容器ID
- -i: 以交互模式运行容器，通常与     -t 同时使用；
- -t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用（加上-it 可Ctrl+q     退出）
- --name="nginx-lb": 为容器指定一个名称；
- --dns 8.8.8.8: 指定容器使用的DNS服务器，默认和宿主一致；
- --dns-search example.com: 指定容器DNS搜索域名，默认和宿主一致；
- -h "mars": 指定容器的hostname；
- **-e username="ritchie": 设置环境变量；**
- **--env-file=[]: 从指定文件读入环境变量；**
- **--cpuset="0-2" or --cpuset="0,1,2": 绑定容器到指定CPU运行【资源分配】**
- -m :设置容器使用内存最大值【资源分配】

网络

可以通过docker network 操作容器间通信的**网桥**

- --net="bridge": 指定容器的网络连接类型，支持 bridge/host/none/container 和自定义
- --network birdge：同上

- **--link=[]: 添加链接到另外一个或多个容器**的ip或别名

- **--expose=[]: 开放一个端口或一组端口**；
- **--ip 172.18.0.10：固定docker局域网分配的ip**
- **-p:绑定容器单个端口到宿主机**
- **-P:--publish-all 开放所有的端口到宿主机**

文件

- **-v:声明挂载的外部数据文件夹**
  - 将`/data`挂载到容器中，并绕过联合文件系统，我们可以在主机上直接操作该目录。任何在该镜像`/data`路径的文件将会被复制到Volume

#### 【start/stop/restart】操作已创建的容器

docker start:启动一个或多少已经被停止的容器

`docker start [OPTIONS] CONTAINER [CONTAINER...]`

docker stop :停止一个运行中的容器

`docker stop [OPTIONS] CONTAINER [CONTAINER...]`

docker restart :重启容器

`docker restart [OPTIONS] CONTAINER [CONTAINER...]`

#### 【kill】杀死一个正在运行的进程

`docker kill [OPTIONS] CONTAINER [CONTAINER...]`

OPTIONS说明：

- -s :向容器发送一个信号

#### 【rm】删除一个或多少容器

`docker rm [OPTIONS] CONTAINER [CONTAINER...]`

OPTIONS说明：

- -f :通过SIGKILL信号**强制删除**一个运行中的容器
- -l :移除容器间的网络连接，而非容器本身
- -v :-v 删除与容器关联的卷

【pause/unpause】暂停和继续

`docker pause [OPTIONS] CONTAINER [CONTAINER...]`

`docker unpause [OPTIONS] CONTAINER [CONTAINER...]`

### 容器操作

#### 【exec】对运行中的容器执行命令或脚本

```shell
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
# 例 进入指定镜像
docker exec -it 11a /bin/bash
# 查看运行中容器的ip地址
docker exec -it 11a ip a
```

OPTIONS说明：

- -d :分离模式: 在后台运行
- -i :即使没有附加也保持STDIN 打开
- -t :分配一个伪终端 **需要指定使用的shell**

#### 【ps】获取容器/镜像的元数据

`docker ps [OPTIONS]`

OPTIONS说明：

- -a :显示所有的容器，**包括未运行的**
- -f :根据条件**过滤**显示的内容
- --format :指定返回值的模板文件
- -l :显示最近创建的容器
- -n :列出最近创建的n个容器
- --no-trunc :不截断输出
- -q :静默模式，只显示容器编号
- -s :显示总的**文件大小**

#### 【inspect】获取容器/镜像的元数据

`docker inspect [OPTIONS] NAME|ID [NAME|ID...]`

OPTIONS说明：

- -f :指定返回值的模板文件
- -s :显示总的文件大小
- --type :为指定类型返回JSON 

#### 【top】查看容器中运行的进程信息，支持 ps 命令参数（在容器外部查看容器内部运行）

`docker top [OPTIONS] CONTAINER [ps OPTIONS]`

#### 【attach】连接到正在运行中的容器-进入一个容器的标准输出（STDIN）

`docker attach [OPTIONS] CONTAINER`

OPTIONS说明：

带上--sig-proxy=false来确保CTRL-D或CTRL-C不会关闭容器

#### 【logs】获取容器的日志

`docker logs [OPTIONS] CONTAINER`

OPTIONS说明：

- -f : 跟踪日志输出
- --since :显示某个开始时间的所有日志
- -t : 显示时间戳
- --tail :仅列出最新N条容器日志

#### 【cp】容器与主机之间的数据拷贝

```shell
# 指定容器中文件拷贝到宿主机指定目录或当前目录
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
# 指定宿主机指定目录或当前目录到容器中的目录
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

OPTIONS说明：

- -L :保持源目标中的链接

## 【$()】批量处理语法

批量删除的容器
`docker rm $(docker ps -aq)`

## 【network】网络操作

在安装docker时会自动创建三个network

```
NETWORK ID          NAME                DRIVER              SCOPE
b51f6e327ab9        bridge              bridge              local
10dc81e6936b        host                host                local
41ceab927a9e        none                null                local
```

> 在启动容器的run命令中，使用 --net来指定启动容器的网络模式
>
> * host模式：使用 --net=host 指定。
> * none模式：使用 --net=none 指定。
> * bridge模式：使用 --net=bridge 指定，默认设置。
> * container模式：使用 --net=container:NAME_or_ID 指定。