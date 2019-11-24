## 

### Spring事务控制

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



### MyBatis事务控制

Mybatis管理事务是分为两种方式:

(1)使用JDBC的事务管理机制,就是利用java.sql.Connection对象完成对事务的提交

(2)使用MANAGED的事务管理机制，这种机制mybatis自身不会去实现事务管理，而是让程序的容器（JBOSS,WebLogic）来实现对事务的管理