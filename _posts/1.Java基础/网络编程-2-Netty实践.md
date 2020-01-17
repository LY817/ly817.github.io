# 编程范式

## Server

1. 创建主线程循环组（接收分发请求与事件）和工作线程循环组（处理请求的事件）

   ```java
   NioEventLoopGroup boss=new NioEventLoopGroup();
   NioEventLoopGroup work=new NioEventLoopGroup();
   ServerBootstrap bootstrap=new ServerBootstrap();
   bootstrap.group(boss,work);
   ```

2. 配置channel（数据通道 pipeline）参数

   ```java
   bootstrap.channel(NioServerSocketChannel.class);
   bootstrap.childHandler(new NioWebSocketChannelInitializer());
   ```

   NioWebSocketChannelInitializer继承自在ChannelInitializer，在initChannel方法中给socketChannel的为pipeline添加数据处理的handler

3. 绑定服务端口，并启动

   ```java
   Channel channel = bootstrap.bind(8081).sync().channel();
   channel.closeFuture().sync();
   ```

## pipeline设置



## 自定义handler



# 与Spring整合

## 整合Component

## 启动

# 实践

## WebSocket推送服务

### 相关Handler解析

### 连接的处理

使用静态

### 实践

将mq消费客户端获取的消息推送给连接的

## MQTT服务端

### 相关Handler解析

