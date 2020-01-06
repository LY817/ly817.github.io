# Spring事务控制

Spring作为整合层，为整合的数据访问层框架提供了事务管理接口：

`org.springframework.transaction.PlatformTransactionManager`

提供了以下三个操作

```java
//获得事务信息
TransactionStatus getTransaction(TransactionDefinition definition) 
//提交事务
void commit(TransactionStatus status) 
//回滚事务
void rollback(TransactionStatus status)
```

### 事务-TRANSACTION

用户定义的一系列操作，**要么完全执行，要么完全不执行**

数据库的一个逻辑工作单位，由DBMS的事务子系统处理。

3条相关语句：

- BEGIN TRANSACTION
- COMMIT
- ROLLBACK

#### 目的（**提供一个从失败恢复的机制，和一个并发隔离方法** ）

一个数据库事务通常包含了一个序列的对数据库的读/写操作。它的存在包含有以下两个目的：

1. 为数据库操作序列提供了**一个从失败中恢复到正常状态的方法，同时提供了数据库即使在异常状态下仍能保持一致性的方法**
2. 当多个应用程序在**并发**访问数据库时，可以在这些应用程序之间提供一个**隔离方法**，以防止彼此的操作互相干扰

#### 事务特性 - ACID

1. **Atomicity** - 原子性：事务本身必须是原子工作单位，事务的操作要么全部成功，要么全部失败。

2. **Consistency** - 一致性：事务执行的结果必须是使数据库从一个一致性状态变到另一个一致性状态。

   > 一致性的含义是：**数据库中的数据应满足完整性约束**，相当于数据库只包含成功事务提交的结果。

3. **Isolation** - 隔离性：隔离性对**并发执行而言**，一个事务的执行不能被其他事务干扰。一个事务内部的操作及使用的数据对其他并发事务是隔离的。并发执行的各个事务之间不能互相干扰。

4. **Durability** - 持续性：事务完成之后，它对于系统的影响是永久性的。该修改即使出现致命的系统故障也将一直保持。（也称为：Permanence）

#### 数据不一致问题

一个修改问题（L）： 

丢失修改 - lost update：当两个或多个事务选择同一行，基于其最初选定的值进行更新数据时，会发生丢失修改问题。最后的更新将重写由其它事务所做的更新。  

由于RDBMS都有锁机制，所以在并发事务中Lost update不存在

三个读问题（DNP）： 

1. 脏读 - dirty reads：事务T2读取了事务T1已经修改但还未commit的数据，事务T1回滚了数据；

   > 默认隔离级别read committed下也不会发生

2. 不可重复读 - non-repeatable reads：（事务T1在一次事务中两次读取同一行数据）事务T1读取数据后，事务T2对数据进行了更新，当T1再次读取数据后，得到与前一次不同的值；

   > 通常这个实际中应该允许。默认隔离级别下可能发生，启用repeatable read可以防止。

3. 幻影读 - phantom read：（事务T1在一次事务中两次读取同一行数据）事务T1读取了某些（多条记录）记录，事务T2删除/插入了一些记录，当T1再次读相同条件的记录时，发现少了一些记录/多了一些记录。

   > 通常这个实际中应该允许。你不能老锁表啊，实在有需求就设置Serializable吧。

### 管理方式

Spring支持两种事务管理方式：编程式事务管理、声明式事务管理

* **编程式事务**管理：使用TransactionTemplate或者直接使用底层的PlatformTransactionManager。对于编程式事务管理，spring推荐使用TransactionTemplate。 
* **声明式事务**管理：建立在AOP之上的。其本质是对方法前后进行拦截，然后在目标**方法开始之前创建或者加入一个事务**，在执行完目标**方法之后根据执行情况提交或者回滚事务**。
  * **优点**：不需要通过编程的方式管理事务，这样就不需要在业务逻辑代码中掺杂事务管理的代码（**非侵入式编程，解耦合**），只需在配置文件中做相关的事务规则声明(或通过基于@Transactional注解的方式)，便可以将事务规则应用到业务逻辑中
  * **缺点**：最细粒度只能作用到方法级别，无法做到像编程式事务那样可以作用到代码块级别

### Spring事务特性

Spring所有的事务管理策略类都继承自org.springframework.transaction.**PlatformTransactionManager**接口 

#### 事务的隔离级别-ISOLATION

隔离级别是指若干个**并发的事务之间**的隔离程度

|                  | 脏读 | 不可重复读 | 幻读 |
| ---------------- | ---- | ---------- | ---- |
| Read uncommitted | √    | √          | √    |
| Read committed   | ×    | √          | √    |
| Repeatable read  | ×    | ×          | √    |
| Serializable     | ×    | ×          | ×    |

TransactionDefinition 接口中定义了五个表示隔离级别的常量：

- **ISOLATION_READ_UNCOMMITTED**：该隔离级别表示一个事务**可以读取另一个事务修改但还没有提交的数据**。该级别不能防止脏读，不可重复读和幻读，因此很少使用该隔离级别。比如PostgreSQL实际上并没有此级别
- **ISOLATION_READ_COMMITTED**：该隔离级别表示一个事务**只能读取另一个事务已经提交的数据**。该级别可以防止脏读，这也是大多数情况下的推荐值
- **ISOLATION_REPEATABLE_READ**：该隔离级别表示一个事务在整个过程中**可以多次重复执行某个查询，并且每次返回的记录都相同**。该级别可以防止脏读和**不可重复读**
- **ISOLATION_SERIALIZABLE**：所有的事务**依次逐个执行**，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。但是这将严重影响程序的性能。通常情况下也不会用到该级别
- **ISOLATION_DEFAULT**：这是默认值，表示**使用底层数据库的默认隔离级别**。对大部分数据库而言，通常这值就是TransactionDefinition.ISOLATION_READ_COMMITTED

#### 事务传播行为（事务之间）-PROPAGATION

如果在开始当前事务之前，一个**事务上下文**已经存在，此时有若干选项可以指定一个事务性方法的执行行为。

> 示例
>
> 方法A和方法B都使用了事务，在A方法中调用B方法时，就会出现B事务在A事务中
>
> 方法A的事务就是方法B的事务的上下文

在TransactionDefinition定义中包括了如下几个表示传播行为的常量：

- **PROPAGATION_REQUIRED**（默认）：如果当前存在事务上下文，则加入该事务；如果当前没有事务上下文，则**创建一个新的事务**

  > **内层事务加入外层事务**

- PROPAGATION_SUPPORTS：如果当前存在事务上下文，则加入该事务；如果当前没有事务上下文，则**以非事务的方式继续运行**

- PROPAGATION_MANDATORY：如果当前存在事务上下文，则加入该事务；如果当前没有事务上下文，则抛出异常

  > 如果方法B标注PROPAGATION_MANDATORY类型事务
  >
  > 直接调用方法B会直接报错，需要在开启了事务上下文的方法中调用方法B

- **PROPAGATION_REQUIRES_NEW**：创建一个新的事务，如果当前存在事务，则把当前事务挂起

  > **内外层事务相互独立**
  >
  > 比如方法A调用方法B（标注PROPAGATION_REQUIRES_NEW），方法B执行出现异常回滚不会影响事务A的事务

- PROPAGATION_NOT_SUPPORTED：以非事务方式运行，如果当前存在事务，则把当前事务挂起

- PROPAGATION_NEVER：以非事务方式运行，如果当前存在事务，则抛出异常

- **PROPAGATION_NESTED**：嵌套事务 如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于TransactionDefinition.PROPAGATION_REQUIRED

  > **外层事务回滚内层事务也回滚，内层回滚不影响外层事务**

#### 事务超时

事务超时，是指一个**事务所允许执行的最长时间**，如果超过该时间限制但事务还没有完成，则自动回滚事务。

在 TransactionDefinition 中以 int 的值来表示超时时间，其单位是秒。

默认设置为底层事务系统的超时值，如果底层数据库事务系统没有设置超时值，那么就是none，没有超时限制。

#### 事务只读属性

只读事务用于客户代码**只读但不修改数据**的情形，只读事务用于特定情景下的优化，比如使用Hibernate的时候

“只读事务”并不是一个强制选项，它只是一个“暗示”，提示数据库驱动程序和数据库系统，这个事务并不包含更改数据的操作，那么JDBC驱动程序和数据库就有可能根据这种情况对该事务进行一些特定的优化，比方说不安排相应的数据库锁，以减轻事务对数据库的压力，毕竟事务也是要消耗数据库的资源的。 

但是你非要在“只读事务”里面修改数据，也并非不可以，只不过对于数据一致性的保护不像“读写事务”那样保险而已。 

因此，“只读事务”仅仅是一个性能优化的推荐配置而已，并非强制你要这样做不可

#### 事务回滚规则

指示Spring事务管理器回滚一个事务的推荐方法是在当前事务的上下文内**抛出异常**

spring事务管理器会捕捉任何未处理的异常，然后依据规则决定是否回滚抛出异常的事务

默认配置下，spring只有在抛出的异常为运行时unchecked异常时才回滚该事务，也就是抛出的异常为**RuntimeException的子类**(Errors也会导致事务回滚)，而抛出checked异常则不会导致事务回滚。

可以明确的配置在抛出那些异常时回滚事务，包括checked异常。也可以明确定义那些异常抛出时不回滚事务。还可以编程性的通过setRollbackOnly()方法来指示一个事务必须回滚，在调用完setRollbackOnly()后你所能执行的唯一操作就是回滚

@Transactional

| 属性                   | 类型                               | 描述                                   |
| ---------------------- | ---------------------------------- | -------------------------------------- |
| value                  | String                             | 可选的限定描述符，指定使用的事务管理器 |
| propagation            | enum: Propagation                  | 可选的事务传播行为设置                 |
| isolation              | enum: Isolation                    | 可选的事务隔离级别设置                 |
| readOnly               | boolean                            | 读写或只读事务，默认读写               |
| timeout                | int (in seconds granularity)       | 事务超时时间设置                       |
| rollbackFor            | Class对象数组，必须继承自Throwable | 导致事务回滚的异常类数组               |
| rollbackForClassName   | 类名数组，必须继承自Throwable      | 导致事务回滚的异常类名字数组           |
| **noRollbackFor**      | Class对象数组，必须继承自Throwable | 不会导致事务回滚的异常类数组           |
| noRollbackForClassName | 类名数组，必须继承自Throwable      | 不会导致事务回滚的异常类名字数组       |

 @Transactional 可以作用于接口、接口方法、类以及类方法上

当作用于类上时，该类的**所有 public 方法将都具有该类型的事务属性**，同时，我们也可以在方法级别使用该标注来覆盖类级别的定义

虽然 @Transactional 注解可以作用于接口、接口方法、类以及类方法上，但是 Spring 建议**不要在接口或者接口方法上使用该注解**，因为这只有在使用基于接口的代理时它才会生效。另外， @Transactional  注解应该只被应用到 **public** 方法上，这是由 Spring AOP 的本质决定的。如果你在 protected、private 或者默认可见性的方法上使用 @Transactional 注解，这将被忽略，也不会抛出任何异常



# MyBatis事务控制

Mybatis管理事务是分为两种方式:

(1)使用JDBC的事务管理机制,就是利用java.sql.Connection对象完成对事务的提交

(2)使用MANAGED的事务管理机制，这种机制mybatis自身不会去实现事务管理，而是让程序的容器（JBOSS,WebLogic）来实现对事务的管理