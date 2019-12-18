# 概述

### 线程池的作用

* 减少线程创建和销毁带来的资源消耗
* 复用线程

jdk提供的多线程操作的工具类是`java.util.concurrent`包下的Executor相关的方法

### 多线程相关类的关系图

![img](assets\5bee9c9be4b0d74dc543e107.png)

# 继承链

![1555208240113](assets\1555208240113.png)

## Executor

最顶层接口，定义了线程执行器的基本行为：执行runnable任务

将任务提交和任务执行细节（Runnable）解耦，不用显式的调用run方法或者Thread.start方法

```java
/** 
 * An object that executes submitted {@link Runnable} tasks. This
 * interface provides a way of decoupling（解耦） task submission from the
 * mechanics of how each task will be run, including details of thread
 * use, scheduling, etc.  An {@code Executor} is normally used
 * instead of explicitly（明确） creating threads.
 */
public interface Executor {
    /**
     * Executes the given command at some time in the future.  The command
     * may execute in a new thread, in a pooled thread, or in the calling
     * thread, at the discretion of the {@code Executor} implementation.
     *
     * @param command the runnable task
     * @throws RejectedExecutionException if this task cannot be
     * accepted for execution
     * @throws NullPointerException if command is null
     */
    void execute(Runnable command);
}
```

> * Executor是用来执行提交给它的runnable任务，达到解耦合的目的
> * 用来替代显式的创建线程，有Executor来**集中地使用和调度**线程

## ExecutorService

也是接口，继承自Executor，对执行器的行为做了**扩展**

具备管理执行器和任务生命周期的方法

```java
/**
 * An {@link Executor} that provides methods to manage termination and
 * methods that can produce a {@link Future} for tracking progress of
 * one or more asynchronous（异步） tasks.
 *
 * <p>An {@code ExecutorService} can be shut down, which will cause
 * it to reject new tasks.  Two different methods are provided for
 * shutting down an {@code ExecutorService}. The {@link #shutdown}
 * method will allow previously submitted tasks to execute before
 * terminating, while the {@link #shutdownNow} method prevents waiting
 * tasks from starting and attempts to stop currently executing tasks.
 * Upon termination, an executor has no tasks actively executing, no
 * tasks awaiting execution, and no new tasks can be submitted.  An
 * unused {@code ExecutorService} should be shut down to allow
 * reclamation of its resources.
 *
 * <p>Method {@code submit} extends base method {@link
 * Executor#execute(Runnable)} by creating and returning a {@link Future}
 * that can be used to cancel execution and/or wait for completion.
 * Methods {@code invokeAny} and {@code invokeAll} perform the most
 * commonly useful forms of bulk（使扩大） execution, executing a collection of
 * tasks and then waiting for at least one, or all, to
 * complete. (Class {@link ExecutorCompletionService} can be used to
 * write customized variants of these methods.)
 *
 * <p>The {@link Executors} class provides factory methods for the
 * executor services provided in this package.
 */
```

> 相比与Executor，提供了关闭执行器的方法：shutdown()、shutdownNow()、isShutdown()、isTerminated()，以及返回Future(任务执行的回调)：submit()、invokeAll()、invokeAny()
>
> * submit方法扩展了父类的execute方法，返回一个任务执行线程的“回执” Future，可以通过对Future对象的操作，与执行的线程进行交互（得到返回值、中断、挂起）
> * invokeAny和invokeAll用于批量执行
>
> 

## AbstractExecutorService

ExecutorService的默认**实现**类，使用RunnableFuture实现了submit、invokeAny、invokeAll

```java
/**
 * Provides default implementations of {@link ExecutorService}
 * execution methods. This class implements the {@code submit},
 * {@code invokeAny} and {@code invokeAll} methods using a
 * {@link RunnableFuture} returned by {@code newTaskFor}, which defaults
 * to the {@link FutureTask} class provided in this package.  For example,
 * the implementation of {@code submit(Runnable)} creates an
 * associated {@code RunnableFuture} that is executed and
 * returned. Subclasses may override the {@code newTaskFor} methods
 * to return {@code RunnableFuture} implementations other than
 * {@code FutureTask}.
 */
```

## ThreadPoolExecutor

具体**线程池**的执行器实现

![1555209402813](assets\1555209402813.png)



#### 构造器

```java
ThreadPoolExecutor(int corePoolSize, 
                   int maximumPoolSize, 
                   long keepAliveTime, TimeUnit unit, 
                   BlockingQueue workQueue, 
                   RejectedExecutionHandler handler) 
```

参数解释：

- `corePoolSize` 为线程池的基本大小。
- `maximumPoolSize` 为线程池**最大**线程大小。
- `keepAliveTime` 和 `unit` 则是线程空闲后的存活时间。
- `workQueue` 用于存放任务的阻塞队列（等待队列）
- `handler` 当队列和最大线程池都满了之后的**饱和策略**
  - AbortPolicy：直接抛出异常（默认策略）
  - CallerRunsPolicy：使用调用者所在的线程来执行任务
  - DiscardOldestPolicy：丢弃队列中靠最前的任务，并执行当前任务
  - DiscardPolicy：直接丢弃任务

- `threadFactory`：创建新线程的工程类，默认为Executors.defaultThreadFactory()

#### 状态

![1555213917302](assets\1555213917302.png)                      

```java
// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

- `RUNNING` ：运行状态，指可以接受任务执行队列里的任务。

- `SHUTDOWN` ：指调用了 `shutdown()` 方法，不再接受新任务了，但是队列里的任务得执行完毕。

- `STOP` ：指调用了 `shutdownNow()` 方法，不再接受新任务，同时抛弃阻塞队列里的所有任务并中断所有正在执行任务。

- `TIDYING`： 所有任务都执行完毕，在调用 `shutdown()/shutdownNow()` 中都会尝试更新为这个状态。

- `TERMINATED`： 终止状态，当执行 `terminated()` 后会更新为这个状态。

#### 线程池大小设置

**CPU密集型**：单个任务处理耗时长

线程数=cpu核数或核数+1

**I/O密集型**：单任务耗时不长，但任务多，等待队列中有较多等待的任务

线程数=cpu核数*（1 + 平均等待时间/平均工作时间）

#### 监控接口 ：Extension hooks

可以继承线程池扩展其中的几个函数来自定义监控逻辑：可以在线程执行前、后、终止状态执行自定义逻辑。

```java
// Method invoked prior to executing the given Runnable in the given thread.
protected void beforeExecute(Thread t, Runnable r) { }
// Method invoked upon completion of execution of the given Runnable.
protected void afterExecute(Runnable r, Throwable t) { }
// Method invoked when the Executor has terminated.
protected void terminated() { }
```





## `Executors` 工具包

通过执行器工具类`Executors`来创建，是对ThreadPoolExecutor进行封装，创建常用场景的线程池

在 JDK 1.5 之后加入了相关的 api，常见的**创建线程池方式**有以下几种：

- `newCachedThreadPool()`：**无限**线程池，用于处理大量短时间工作任务

  - 试图缓存线程并重用，当无缓存线程可用时，就会创建新的工作线程
  - 如果线程闲置的时间超过阈值，则会被终止并移除缓存
  - 系统长期闲置时，不消耗资源
  - 不需要设置参数，全自动

- `newFixedThreadPool(nThreads)`：创建**固定大小**的线程池

- `newSingleThreadExecutor()`：创建**单个**线程的线程池

  用于顺序执行任务

  如果线程异常结束，会有另一个线程取代

- `newSingleThreadScheduledExecutor()`和`newScheduledThreadPool(int corePoolSize)`

  定期执行工作调度，两者的区别在与单一工作线程和多工作线程

- `newWorkStealingPool()`：JDK1.8引入

  内部会构建ForkJoinPool，利用work-stealing算法，并行的处理任务，不保证处理顺序

这三个方法都是利用 `ThreadPoolExecutor` 类实现



