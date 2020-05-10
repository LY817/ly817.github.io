部署最简单的微服务到k8s集群

- k8s实验环境：本地使用vagrant + virtualBox搭建的3节点 [参考](https://github.com/rootsongjc/kubernetes-vagrant-centos-cluster)

- 微服务结构

  - 服务注册中心：使用SpringCloud EurekaServer作为服务发现 

    不使用k8s自带的service，模拟微服务系统迁移到k8s，减少代码改动

  - 用户服务

    - mysql

  - zuul网关

    - redis
    - 调用用户服务 访问数据库
    - 通过ingress暴露服务
      - 身份验证服务 

## 部署Eureka Server 集群

### 构建配置

#### YAML配置

> ##### Headless Service
>
> 不用k8s service自己的负载均衡，使用eureka的服务发现机制
>
> ##### StatefulSet

```yaml
apiVersion: v1
kind: Service
metadata:
  name: eureka-service-internal
  labels:
    app: eureka-service-internal
  namespace: ms-sparrow
spec:
  clusterIP: None # 设置为None表示这个service为headless
  ports:
    - port: 8761
      protocol: TCP
      targetPort: 8761
  selector:
    app: eureka
  type: ClusterIP

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: eureka
spec:
  selector:
    matchLabels:
      app: eureka
  serviceName: "eureka-service-internal"
  replicas: 3
  template:
    metadata:
      labels:
        app: eureka
    spec:
      terminationGracePeriodSeconds: 10
      containers:
        - env:
            - name: MY_NODE_NAME
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
            - name: MY_POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: MY_POD_NAMESPACE # 传入当前命名空间
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: MY_POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: MY_IN_SERVICE_NAME # 因为pod 通过域名互相访问，需要使用headless 服务名称
              value: eureka-service-internal
            - name: EUREKA_APPLICATION_NAME
              value: "eureka"
            - name: EUREKA_REPLICAS
              value: "3"
          image: registry.cn-hangzhou.aliyuncs.com/ms-sparrow/sparrow-eureka-server:latest
          imagePullPolicy: IfNotPresent
          name: eureka-container
          ports:
            - containerPort: 8761
              protocol: TCP
```

#### 集群参数传递

通过环境变量的方式，通知到Pod容器中的应用进程所在K8S集群节点的相关信息

```properties
HOSTNAME=eureka-0
TERM=xterm
CA_CERTIFICATES_JAVA_VERSION=20140324
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
PWD=/
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre
LANG=C.UTF-8
JAVA_VERSION=8u111
SHLVL=1
HOME=/root
JAVA_DEBIAN_VERSION=8u111-b14-2~bpo8+1

KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT=tcp://10.254.0.1:443
KUBERNETES_SERVICE_PORT=443
EUREKA_APPLICATION_NAME=eureka
KUBERNETES_SERVICE_HOST=10.254.0.1
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_SERVICE_PORT_HTTPS=443
EUREKA_REPLICAS=3
KUBERNETES_PORT_443_TCP_ADDR=10.254.0.1
KUBERNETES_PORT_443_TCP=tcp://10.254.0.1:443

MY_POD_NAMESPACE=default
MY_IN_SERVICE_NAME=eureka-service-internal
MY_POD_NAME=eureka-0
MY_NODE_NAME=node2
MY_POD_IP=172.33.24.2
```



### 采坑

使用virtualBox虚拟机构建的集群，pod分配到不同的node，跨物理节点会访问不到



### K8S Service 🆚 应用自带注册中心

k8s中抽象出来Service的概念模型，通过DNS解析实现了负载均衡。

如果需要使用自己的服务注册发现机制

