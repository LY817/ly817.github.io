---
layout: post
title: RESTful API设计
tags:
- 微服务
- 设计
date: 2019-10-11 20:33:14
permalink:
categories:
description:
keywords:
---

REST（Representational State Transfer）表象化 状态 转变（表述性状态转变）

REST是一种API的设计风格，基于HTTP。是一组客户端和服务端的行为约束条件和原则

* URI:通过URI来定位一个**资源**：可以是集合（Collection），也可以是资源（Resource）
* METHOD:通过HTTP方法（GET、POST、PUT、DELETE等）来表示对URI资源的**操作**
* 无状态:请求是**无状态**的（从客户端到服务端的每个请求都必须包含理解请求所必需的信息）
  * 没有session
  * 通过随请求携带的token，在服务端的缓存中获取状态信息

# RESTful设计规范
### 请求
#### URI
- URI必须是名词
- 通常使用名词的复数形式
  - 默认表示一个集合 `GET /users`(URI)
  - 需要定位某个资源时，使用 `GET /users/1001`(URL)
- 版本控制

#### 请求方法
- `GET` 获取一个指定资源
- `POST` 创建一个资源
- `PUT` 更新一个资源（需要提供整个的资源）
- `PATCH` 更新一个资源（只需要提供待改变部分的资源）
- `DELETE` 移除一个资源
- `HEAD` 获取一个资源的元数据：例如最近一次更新时间
- `OPTIONS` 获取当前用户

### 响应

数据接收即可使用，无需拆包

> 错误示范
>
> ```http
> HTTP/1.1 200 OK
> Content-Type: application/json
> 
> {
>     "code":200,
>     "data":{
>     "id":1,
>     "name":"rest"
>     }
> }
> ```
>
> 正确的做法
>
> ```http
> HTTP/1.1 200 OK
> Content-Type: application/json
> code: 200
> 
> {
>     "id":1,
>     "name":"rest"
> }
> ```

发生错误时，不要返回 200 状态码

> 错误示范
>
> ```http
> HTTP/1.1 200 OK
> Content-Type: application/json
> 
> {
>   "status": "failure",
>   "data": {
>     "error": "Expected at least two items in list."
>   }
> }
> ```
>
> 正确的做法
>
> ```http
> HTTP/1.1 400 Bad Request
> Content-Type: application/json
> 
> {
>   "error": "Invalid payload.",
>   "detail": {
>      "surname": "This field is required."
>   }
> }
> ```



#### 状态码

客户端的每一次请求，服务器都必须给出回应。

回应包括 HTTP 状态码和数据两部分，HTTP 状态码就是三位数，分成五类

> - `1xx`：相关信息
> - `2xx`：操作成功
> - `3xx`：重定向
> - `4xx`：客户端错误
> - `5xx`：服务器错误
<!--
![本地展示](.\assets\20180721093338663.png)
-->

![博客展示](/img/in-post/micro-service/assets/20180721093338663.png)


#### 响应体

返回的数据格式，不应该是纯文本，而应该是结构化文本表示的数据对象（通常是json或者xml）

* 客户端发送请求时，在header中accept属性设置为`application/json`，表示响应只接受json格式的数据

* 服务器的响应的header，也将`Content-Type`属性要设为`application/json`

# 细节

### 动词的覆盖

有些客户端只能使用`GET`和`POST`这两种方法。服务器必须接受`POST`模拟其他三个方法（`PUT`、`PATCH`、`DELETE`）。

这时，客户端发出的 HTTP 请求，要加上`X-HTTP-Method-Override`属性，告诉服务器应该使用哪一个动词，覆盖`POST`方法

```http
POST /api/Person/4 HTTP/1.1 
X-HTTP-Method-Override: PUT 
```

# 实践

#### 使用SpringMVC构建微服务时，controller方法上不必要映射地址



# 参考

[阮一峰的网络日志-RESTful API 最佳实践](http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)