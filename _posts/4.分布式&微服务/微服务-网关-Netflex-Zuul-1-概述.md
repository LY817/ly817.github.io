# 网关的作用

统一**对外**(比如前端)的API

- 统一登录认证
- 统一前端暴露域名
- http请求与其他形式的微服务如thrift对接

# 核心概念

## 路由信息

请求的转发规则 对应`ZuulProperties.ZuulRoute`

主要属性

- serviceId 微服务名称

- path 映射到zuul网关对外暴露的对应的子路径

  > The path (pattern) for the route

  通过正则表达式匹配，如/user/** 表示user子路径下所有的请求会被转发的对应的微服务

- url 映射的物理地址

  > An alternative is to use a service ID and service discovery to find the physical address.

  可以为空 可通过serviceId与服务发现机制找到对应的物理地址

- sensitiveHeaders 敏感头信息

  网关会根据头信息中的信息进行身份验证，转发给子系统时，会过滤掉头信息中的这些信息，防止转发到跨域的微服务泄露header中的身份验证信息



  

  

  

  

## 过滤器

修改请求和响应的自定义逻辑



# 自定义开发

## 用户认证

`ZuulFilter`过滤器

## 动态路由

自定义`DynamicRouteLocator`