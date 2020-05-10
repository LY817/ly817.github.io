## 模块划分

![点击查看源网页](/Users/luoyu/doc/ly817.github.io/_posts/3.MySQL/assets/130029376658731.png)

### 连接模块

包括客户端（驱动）和服务端的连接服务，负责两端之间的数据交互，包含：

- 本地socket通信和大多数基于客户端/服务端实现的类似tcp/ip的通信

- 完成连接受理、授权认证以及相关的安全方案
- 将连接**分发**给处理连接的线程
- 维护服务端的连接池

> #### 客户端数据库连接池
>
> 为了减少数据库连接创建和销毁的开销，客户端会维护一个数据库连接池
>
> Java中常用的数据库连接池有DBCP，C3P0，Druid

### 服务模块

服务层包括大多数核心服务功能，如SQL解析、缓存策略。

所有跨存储引擎的功能都在这一层实现，如**存储过程**、**函数**。

- SQL解析：将SQL解析成二进制的机器码，交给存储引擎来访问文件系统

  在该层，会解析查询语句（SQL api）并创建对应的内部解析树（parser），并对其完成执行策略的优化（optimizer ）如确定查询表的顺序、是否利用索引等，最后**生成引擎能理解的执行操作过程**

- 缓存策略：

### 引擎模块

负责数据的存储和提取，对接服务层的API有不同的实现，封装了文件系统的操作（不同的文件**组织形式**）

### 文件系统

每个表存储的数据都是保存在文件中，文件的访问由存储引擎负责

不同的存储引擎对应不同格式的存储文件

## 常用配置

### 动态配置

#### MAX_CONNECTIONS

允许最大连接数（根据服务器的内存大小设置）

#### INTERACTIVE_TIMEOUT

设置**交互连接**的过期时间

#### WAIT_TIMEOUT

设置非交互连接的过期时间

> INTERACTIVE_TIMEOUT和WAIT_TIMEOUT通常设置成相同，并且不建议设置的过大，减少连接数占用

#### MAX_ALLOWED_PACKET

设置MySQL可以接受数据包的最大值

#### SYNC_BINLOG

表示每写多少次缓存会像磁盘同步一次binlog

------

### 缓存配置

每个查询会话（线程）分配的内存，分配过大会导致

#### SORT_BUFFER_SIZE

设置每个会话使用的**排序缓冲区**内存的大小（用于using temporary的查询）

#### JOIN_BUFFER_SIZE

设置每个会话使用的**连接缓存区**内存的大小

#### READ_BUFFER_SIZE

指定了当一个MYISAM进行**全表扫描**时所分配的读缓存区的大小

查询的临时表也是MYISAM类型的

#### READ_RND_BUFFER_SIZE

设置索引缓冲区的大小

#### BINLOG_CACHE_SIZE

设置每个会话用于缓存未提交的事务缓存大小

------

### 存储引擎参数

#### INNODB_FLUSH_LOG_AT_TRX_COMMIT

事务日志写盘的策略（出现程序异常退出时的数据安全性）

- 0：每秒进行一次重做日志的磁盘刷新操作
- 1：每次事务提交都会刷新事务日志到磁盘中（默认值 不会丢失数据）
- 2：每次事务提交写入**操作系统**缓存，每秒向磁盘刷新一次

#### INNODB_BUFFER_POOL_SIZE

设置**innodb缓冲池**的总大小，应为系统可用内存的75%

#### INNODB_BUFFER_POOL_INSTANCES

**innodb缓冲实例数**，每个实例的大小为总缓存池大小/实例个数

减少锁占用

#### INNODB_FILE_PER_TABLE

设置每一个表**独立**使用一个表空间文件

------

### SQL MODE

MySQL解析处理SQL语句的方式

可以设置多个，用逗号隔开

#### ANSI标准（宽松模式 对数据检查不严格）

可以简写成`SQL_MODE = 'ANSI'`

等价于`SQL_MODE = 'ONLY_FULL_GROUP_BY,ANSI_QUOTES,REAL_AS_FLOAT,PIPES_AS_CONCAT'`

##### ONLY_FULL_GROUP_BY

对于group by聚合操作，select中的非聚合函数列与group by语句中指定的列不一致时，会报错

##### ANSI_QUOTES

不允许sql中使用双引号来**声明字符串**，只能使用单引号

##### REAL_AS_FLOAT

将real类型关键字识别为float，默认状态下为double

##### PIPES_AS_CONCAT

将||视为字符串的连接操作符**而不是或运算符**

mysql中默认的字符串连接用的是concat函数 

#### 严格模式 （TRADITIONAL）

可以简写成`SQL_MODE = 'TRADITIONAL'`

##### STRICT_TRANS_TABLES / STRICT_ALL_TABLES

在**事务存储引擎**或**所有储存引擎**上启用严格模式，SQL语法检查不通过会报错

> 宽松模式下
>
> - 字符串赋值给int时，会赋为0
> - 插入值超过字段的最大值时，会存入边界值

##### ERROR_FOR_DIVISION_BY_ZERO

不允许0作为除数

##### NO_AUTO_CREATE_USER

在用户不存在时，不允许grant语句自动创建用户

##### NO_ZERO_IN_DATE / NO_ZERO_DATE 

日期数据不能含0

##### NO_ENGINE_SUBSTITUTION

当指定引擎不可用时报错

## 运行时配置和静态配置

### 查看配置

`show variables like 'xxxx'`

### 通过命令行进行配置

`set [session/global/persist] xxx = 'yyy'`

8.0之前只支持session和global，即只修改运行时的配置

8.0新增了persist，可以通过命令行修改，并持久化到mysqld-auto.conf中，重启之后配置依然有效

### 通过配置文件配置

> 分为只读配置和动态配置
>
> - 只读配置：需要修改my.conf配置文件再重启才能生效（运行时的配置与配置文件的参数一致）
> - 动态配置：可以通过命令行set命令修改配置（运行时的配置与配置文件的参数可以一致）

#### 通过配置my.conf文件



#### mysqld-auto.conf文件

MySQL 8.0之后新增了persist，可以通过命令行修改，并持久化到mysqld-auto.conf中

mysqld-auto.conf的配置会**覆盖**my.conf的配置