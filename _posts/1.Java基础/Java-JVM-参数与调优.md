# JVM参数规范

### 前缀

#### 标准参数

-version

-help

#### `-X` 非标准选项

-Xint 解释执行

-Xcomp 编译执行

-Xmixed 混合模式执行

#### `-XX` 非稳定选项



### 开启/关闭配置 Boolean类型

+表示开启 -表示关闭

```
-XX:+UseCompressedOops # 表示开启 压缩指针
-XX:-UseCompressedOops # 表示关闭 压缩指针
```

### 设置参数值 KV类型

`-XX:PermSize=256M`

#### 常用设置简写

```
-Xms3072M # 设置堆内存大小
-Xmx3072M # 最大堆内存大小 最好与Xms 防止抖动
-Xmn2048M # 堆内存中新生代大小
-Xss1M # 线程栈大小
```

# 内存设置

![image-20200108130918261](assets\image-20200108130918261.png)

### 堆内存大小限制

- `-Xms`  堆内存的大小

- `-Xmx`  允许堆内存扩张到的最大大小

> 通常这两个参数都设置为完全一样的大小

### 堆内存中新生代与老年代

`-Xmn`  堆内存中新生代大小 

剩下来的就是老年代的大小

### 方法区内存大小限制

#### JDK1.8以前

`-XX:PermSize`  永久代大小

`-XX:MaxPermSize`  永久代最大大小

#### JDK1.8之后

`-XX:MetaspaceSize`

`-XX:MaxMetaspaceSize`

#### 线程内存

`-Xss`  每个线程方法栈内存大小

# 查看

`java -XX:+PrintFlagsInital`

JVM初始化参数

`java -XX:+PrintFlagsFinal`

查看最终参数 使用`:=`区分时候修改过