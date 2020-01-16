# 优化目的

合理优化**堆内存**中新时代、老年代、Eden和Survivor各个区域的大小

避免新时代中的**业务对象**进入老年代，然后被Full GC清理，而是直接在新生代中出生和被回收

尽量减少Full GC的频率

# 手段

## 参数入门

### 前缀

`-X` 非标准选项

`-XX` 非稳定选项

### 开启/关闭配置

+表示开启 -表示关闭

```
-XX:+UseCompressedOops # 表示开启 压缩指针
-XX:-UseCompressedOops # 表示关闭 压缩指针
```

### 设置参数值

`-XX:PermSize=256M`

#### 常用设置简写

```
-Xms3072M # 设置堆内存大小
-Xmx3072M # 最大堆内存大小 最好与Xms 防止抖动
-Xmn2048M # 堆内存中新生代大小
-Xss1M # 线程栈大小
```

## 设置内存大小

```
-Xms3072M 
-Xmx3072M 
-Xmn2048M 
-XX:SurvivorRatio=8 # Eden区与Survivor区比例
-Xss1M # 线程栈大小
-XX:PermSize=256M -XX:MaxPermSize=256M  # 1.8之前方法区 永久代大小
```

- 尽量让每次Minor GC都留在Survivor区中，不进入老年代

## 设置垃圾回收策略

```
 -XX:MaxTenuringThreshold=5 # 升级到老年代的存活次数阈值
 -XX:PretenureSizeThreshold=1M # 大对象直接放入老年代的阈值
 -XX:+UseParNewGC # 设置Minor GC算法为ParNewGC
 -XX:+UseConcMarkSweepGC# 设置Major GC算法为CMS GC
```

# 场景

## 高并发订单系统

产生很多小的订单对象

- 生成订单对象频率高
- 

### 量的大致关系

用户访问量 = 访问量/平均每人20次访问

订单量 = 用户访问量*转化率



## 计算系统

从数据库中查出数据放在JVM内存中处理

- 对象内存占用大
- 驻留时间较长 