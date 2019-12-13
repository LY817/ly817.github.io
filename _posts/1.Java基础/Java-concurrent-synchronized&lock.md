---
layout: post
title: Java锁机制
tags:
- Java基础
- 面试
- 多线程
date: 2019-12-12 09:06:21
permalink:
categories:
description:
keywords:
---

# 相关概念

## 锁

锁属于抽象的概念，分为两个角色：共用资源和共用资源的使用者

### mark word

Java中的synchronized通过操作mark word来实现对象锁

markword是java对象数据结构中的一部分,markword数据的长度在32位和64位的虚拟机（未开启压缩指针）中分别为32bit和64bit，它的**最后2bit是锁状态标志位**，用来标记当前对象的状态，对象的所处的状态，决定了markword存储的内容

![1554958110706](E:\blog\_posts\1.Java基础\assets\1554958110706.png)



### 自旋锁

如果持有锁的线程能在很**短时间**内释放锁资源，那么那些等待竞争锁的线程就**不需要做内核态和用户态之间的切换进入阻塞挂起状态**，等待线程只需要等一等（自旋），等持有锁的线程释放锁后即可立即获取锁，这样就**避免用户线程和内核的切换的消耗**。

#### 特点

> 适用于锁的竞争不激烈，且占用锁时间非常短的代码块;但是如果锁的竞争激烈，或者持有锁的线程需要长时间占用锁执行同步块，这时候就不适合使用自旋锁了，因为自旋锁在获取锁前一直都是占用cpu做无用功，**线程自旋的消耗大于线程阻塞挂起操作的消耗**，其它需要cup的线程又不能获取到cpu，造成cpu的浪费

#### 自旋锁时间阈值

线程自旋需要占用CPU时间，不能一直占用CPU自旋做无用功，所以需要设定一个自旋等待的最大时间。如果持有锁的线程执行的时间超过自旋等待的最大时间扔没有释放锁，就会导致其它争用锁的线程在最大等待时间内还是获取不到锁，这时争用线程会**停止自旋进入阻塞状态**

#### 适应性自旋锁

JVM对于自旋周期的选择，jdk1.5这个限度是一定的写死的，在1.6引入了适应性自旋锁，适应性自旋锁意味着自旋的时间不再是固定的了，而是**由前一次在同一个锁上的自旋时间以及锁的拥有者的状态来决定**，基本认为一个线程上下文切换的时间是最佳的一个时间，同时JVM还针对当前CPU的负荷情况做了较多的优化

> 如果平均负载小于CPUs则一直自旋；
> 如果有超过(CPUs/2)个线程正在自旋，则后来线程直接阻塞；
> 如果正在自旋的线程发现Owner发生了变化则延迟自旋时间（自旋计数）或进入阻塞；
> 如果CPU处于节电模式则停止自旋；
> 自旋时间的最坏情况是CPU的存储延迟（CPU A存储了一个数据，到CPU B得知这个数据直接的时间差）；
> 自旋时会适当放弃线程优先级之间的差异；

---

锁膨胀的方向：无锁 》 偏向锁 》轻量级锁 》重量级锁

![1554959500869](E:\blog\_posts\1.Java基础\assets\1554959500869.png)

### 偏向锁

> 适用于同一线程重复获取锁，减少其获取锁的消耗

Java偏向锁(Biased Locking)是Java6引入的一项多线程优化。 

偏向锁，顾名思义，偏向于第一个访问锁的线程

如果在运行过程中，同步锁只有一个线程访问，不存在多线程争用的情况，则线程是不需要触发同步的，减少加锁／解锁的一些CAS操作（比如等待队列的一些CAS操作），这种情况下，就会给线程加一个偏向锁。 
如果在运行过程中，遇到了其他线程抢占锁，则持有偏向锁的线程会被挂起，JVM会消除它身上的偏向锁，将锁恢复到标准的轻量级锁。

> 它通过消除资源无竞争情况下的同步原语，进一步提高了程序的运行性能。

#### CAS

CAS的全称为Compare-And-Swap，是一条CPU的原子指令，其作用是让CPU比较后原子地更新某个位置的值，经过调查发现，其实现方式是基于硬件平台的汇编指令，就是说CAS是**靠硬件实现的**（JVM只是封装了汇编调用，那些AtomicInteger类便是使用了这些封装后的接口）

#### SMP（对称多处理器）

![img](E:\blog\_posts\1.Java基础\assets\411087_1311836022idIz.jpg)

所有的CPU核心会共享一条系统总线（BUS），靠此总线连接主存。每个核都有自己的一级缓存，各核相对于BUS对称分布，因此这种结构称为“对称多处理器”

> Core1和Core2可能会同时把主存中某个位置的值Load到自己的L1 Cache中，当Core1在自己的L1 Cache中修改这个位置的值时，会通过总线，使Core2中L1 Cache对应的值“失效”，而Core2一旦发现自己L1 Cache中的值失效（称为Cache命中缺失）则会通过总线从内存中加载该地址最新的值，大家通过总线的来回通信称为“**Cache一致性流量**”，因为总线被设计为固定的“通信能力”，如果Cache一致性流量过大，总线将成为瓶颈。而当Core1和Core2中的值再次一致时，称为“Cache一致性”，从这个层面来说，锁设计的终极目标便是减少Cache一致性流量。
>
> CAS恰好会导致Cache一致性流量，如果有很多线程都共享同一个对象，当某个Core CAS成功时必然会引起总线风暴，这就是所谓的本地延迟，本质上**偏向锁就是为了消除CAS，降低Cache一致性流量**。

### 偏向锁的实现

锁对象Mark Word线程ID字段设置为偏向的线程id

#### 偏向锁的获取

1. 检查对象的Mark Word中偏向锁的标识是否设置成1，锁标志位是否为01，确认为可偏向状态。

2. 如果为可偏向状态，则检查线程ID是否指向当前线程，如果是（该线程已经持有该对象的偏向锁），进入步骤5，否则进入步骤3。

3. 如果线程ID并未指向当前线程，则通过CAS操作竞争锁。如果竞争成功，则将Mark Word中线程ID设置为当前线程ID，然后执行5；如果竞争失败，执行4。

4. 如果CAS获取偏向锁失败，则表示有竞争。当到达全局安全点（safepoint）时获得偏向锁的线程被挂起，**偏向锁升级为轻量级锁**，然后被阻塞在安全点的线程继续往下执行同步代码。（撤销偏向锁的时候会导致stop the word）

5. 执行同步代码。

#### 偏向锁的释放

偏向锁只有遇到其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，**线程不会主动去释放偏向锁**。偏向锁的撤销，需要等待全局安全点（在这个时间点上没有字节码正在执行），它会首先暂停拥有偏向锁的线程，判断锁对象是否处于被锁定状态，撤销偏向锁后恢复到未锁定（标志位为“01”）或轻量级锁（标志位为“00”）的状态。

#### 特点

无争用场景时的锁

> 始终只有一个线程在执行同步块，在它没有执行完释放锁之前，没有其它线程去执行同步块，在锁无竞争的情况下使用，一旦有了竞争就升级为轻量级锁，升级为轻量级锁的时候需要撤销偏向锁，撤销偏向锁的时候会导致stop the word操作；
>
> 在有锁的竞争时，偏向锁会多做很多额外操作，尤其是撤销偏向所的时候会导致进入安全点，安全点会导致stw，导致性能下降，这种情况下应当禁用； 

### 轻量级锁

> 适用于线程交替执行同步块

轻量级锁是由偏向所升级来的，偏向锁运行在一个线程进入同步块的情况下，当第二个线程加入锁争用的时候，偏向锁就会升级为轻量级锁； 

#### 轻量锁的获取

1. 在代码进入同步块的时候，如果同步对象锁状态为无锁状态（锁标志位为“01”状态，是否为偏向锁为“0”），虚拟机首先将在当前线程的栈帧中建立一个名为锁记录（Lock Record）的空间，用于存储锁对象目前的Mark Word的拷贝，官方称之为 Displaced Mark Word



### 重量级锁



## CPU寄存器

> 由于CPU运算器的运算速度非常快，如果运算器直接操作内存（主存）中的数据，虽然内存中的数据的读写速度已经很快了，跟CPU运算时钟频率相比还是太慢，数据的I/O会成为瓶颈，会拖慢CPU输出的计算性能

所以在CPU设计时，为了提高技术性能，CPU在内部开辟一小块临时存储区域，在进行运算时先将数据从内存加载到这一小块临时存储区域中，运算时就在这一小快临时存储区域内进行，提高了I/O的效率。我们称这一小块临时存储区域为寄存器。

#### 引入的问题

当多个线程同时操作一个**共享**的资源变量时，共享的变量在不同的线程的高速缓存中会存在多个副本。

在对线程并发读写时，就会出现脏读或脏写，导致最终共享变量的计算结果不是我们想要的值。

#### 解决方案:同步机制

![1544595449625](assets\1544595449625.png)

解决缓存不一致性问题，通常来说有以下2种解决方法：

- 通过在总线加LOCK#锁的方式 

- 通过缓存一致性协议 

# 同步API

## `volatile` 线程可见性 &防止指令重排

被标记的变量具有可见性但**不具备原子性**

volatile有两层语义：

* 保证了**不同线程**对这个变量进行操作时的**可见性**，即一个线程修改了某个变量的值，这新值对其他线程来说是立即可见的

* 禁止进行指令重排序

### 实现原理

下面这段话摘自《深入理解Java虚拟机》：

> “观察加入volatile关键字和没有加入volatile关键字时所生成的汇编代码发现，加入volatile关键字时，**会多出一个lock前缀指令**”
>
> lock前缀指令实际上相当于一个**内存屏障**（也成内存栅栏），内存屏障会提供3个功能：
>
> * 它确保指令重排序时不会把其后面的指令排到内存屏障之前的位置，也不会把前面的指令排到内存屏障的后面；即在执行到内存屏障这句指令时，在它前面的操作已经全部完成；
>
> * 它会强制将对缓存的修改操作立即写入主存；
>
> * 如果是写操作，它会导致其他CPU中对应的缓存行无效;

### 使用场景 - 避免涉及原子性

通常来说，使用volatile必须具备以下2个条件：

* 对变量的写操作不依赖于当前值  （例如i++）
* 该变量没有包含在具有其他变量的不变式中

如果使用时不具备以上的两个条件，会涉及到变量操作的原子性（变量的读取-修改-写入），这种情况下需要锁的方式来实现

> synchronized关键字是防止多个线程同时执行一段代码，那么就会很影响程序执行效率，而volatile关键字**在某些情况下性能要优于synchronized**，但是要注意volatile关键字是无法替代synchronized关键字的，因为volatile关键字**无法保证操作的原子性**。
>
> 读操作远远大于写操作，volatile 变量还可以提供优于锁的**性能**优势

##### 状态标记变量

```java
volatile boolean inited = false;
//线程1:加载上下文
context = loadContext();  
inited = true;            
 
//线程2:等待上下文加载好之后 干事
while(!inited){
	sleep();
}
doSomethingInContext(context);
```

##### 单例模式的double-check

```java
class Singleton{
    private volatile static Singleton instance = null;
     
    private Singleton() {
         
    }
    public static Singleton getInstance() {
        //第一次null检查
        if(instance == null) {
            //第二次null检查
            synchronized (Singleton.class) {
                if(instance == null){
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

[参考](https://www.cnblogs.com/dolphin0520/p/3920373.html)

## `synchronized` 同步关键字

语义是可以把任何一个非null**对象**作为"锁"

### 互斥锁

锁是一个抽象的概念，用来保证的资源操作的排他性。

> 互斥性：即在同一时间只允许一个线程持有某个对象锁，这样在同一时间自由一个线程对需要同步的代码块（复合操作）进行访问
>
> 可见性：必须保证在锁被释放前，对共享变量所做的修改，对于随后获得该锁的另一个线程是可见的

在HotSpot的JVM实现中，锁有个专门的名字：**对象监视器**，用来监控被锁定的对象（资源）的访问

底层是通过控制CPU的多个处理核心对缓存和主存的操作行为（CAS，子旋锁、偏向锁等）来实现，具体的实现细节由JVM负责

#### 可重入

synchronized是**可重入**锁，当一个线程获取锁后，还可以再次调用获取锁

> ```java
> synchronized(this){
>      synchronized(this){
> 		
>  	 }
> }
> ```

### 应用场景

#### 修饰一般方法 （对象锁）

当synchronized作用在方法上时，锁住的便是**对象实例**（this）

```java
public class Test {
    public synchronized void hello(){
        // balabala
    }
}
```

synchronized(this){}就是在方法内同步代码块，相当于缩小了冲突的区域

```java
public class Test {
    public void hello(){
        synchronized(this){
            // balabala
        }
    }
}
```

#### 修饰静态方法 （全局锁）

当作用在静态方法时锁住的便是**对象对应的Class实例**，因为Class数据存在于**永久带**，因此静态方法锁相当于该类的一个**全局锁**

```java
public class Test {
    // 全局锁
    public static synchronized void hello(){
        // balabala
    }
}
```

#### 修饰代码块

当synchronized作用于某一个对象实例时，锁住的便是对应的代码块（在代码块中会对这个实例进行多线程操作）

当synchronized作用域一个Class对象

```java
// 实例锁
synchronized(obj){
    // balabala
}
// 全局锁
synchronized(Object.class){
    // balabala
}
// 全局锁
synchronized(obj.getClass()){
    // balabala
}
```

### 对象锁和全局锁

#### 对象锁

对象锁又称为实例锁

#### 全局锁

全局锁又称为类锁，无论此类有多少个实例对象，都共享该锁，对全局的Class对象加锁

### 实现

由`JVM`实现，是通过进入、退出**对象监控器（`Monitor`）**，来实现对象和代码块的同步

在编译时，会在synchronized所影响的区域之前调用`monitor.enter`指令（开启对象监控器），在之后或异常处调用`monitor.exit`指令（结束对象监控器）

其本质就是对一个对象监视器( `Monitor` )进行获取，而这个获取过程具有排他性从而达到了同一时刻只能一个线程访问的目的

#### Java对象头

Java对象在内存中的存储形式分为三个部分：对象头，实例数据。对齐填充，Java对象的锁信息存放在对象头中

对象头由Mark Word和Class Metadata Address组成

![1554713609982](assets\1554713609982.png)

##### Mark Word

![1554726641749](assets\1554726641749.png)

synchronized锁是重量级锁，在Mark Word的标识位为10，指向的是对应monitor对象的地址

##### Class Metadata Address

指向该对象所属类的Class对象

#### Monitor

每个Java对象自带的锁，是由c++实现，JVM维护的

![1554728695018](assets\1554728695018.png)

##### ObjectMonitor

![1554728135381](assets\1554728135381.png)

* WaitSet（等待池）：线程调用wait方法，线程会进入waitSet中，等待被唤醒
* EntryList（锁池）：多个线程竞争锁时，会先进入EntryList
* owner：指向当前**持有锁的线程**

##### ObjectWaiter

ObjectMonitor中对线程的抽象

#### 字节码

编译出的字节码会在同步代码块的前后添加`monitorenter`和`monitorexit`

```java
public class SynchronizedTest {
    public static void main(String[] args) {
//        synchronized (SynchronizedTest.class){
            System.out.println("Synchronize");
//        }
    }
}
```

![1545108562151](assets\1545108562151.png)

##### 关键字

使用synchronized关键字修饰的普通方法会在字节码的descriptor中添加一个`ACC_SYNCHRONIZED`的标识，用来区分是否是同步方法，在调用方法时，会检查这个标识，如果存在则会尝试获取对象的monitor锁

## Object 锁API

wait()、notify/notifyAll() 方法是Object的本地final方法

**必须在synchronized修饰的同步代码块**，用来实现对持有锁的操作和线程间的通信和协调

如果没有持有适当的锁（比如synchronized加锁的对象和调用wait的不是同一个对象）就会抛出IllegalMonitorStateException

### wait()

该方法用来将当**前线程**置入**休眠状态**（让出CPU资源），直到接到通知（notify）或被中断（interrupt）为止。在调用wait()之前，线程必须要获得该对象的对象级别锁，即只能在同步方法或同步块中调用wait()方法。

进入wait()方法后，当前线程释放锁。在从wait()返回前，线程与其他线程重新竞争获得锁。

> wait() 需要被try catch包围，中断也可以使wait等待的线程唤醒

```java
synchronized(count){
    try {
        count.wait(remain);
    } catch (InterruptedException e) {
    }
}
```

### notify/notifyAll()

用来**唤醒**那些等待该对象锁（处于休眠状态）的其他线程，准备获取锁权限

* notify：唤醒一个等待获取锁的线程，选择哪个线程取决于操作系统对多线程管理的实现

* notifyAll：唤醒所有等待获取锁的线程，这些线程将会争取锁的控制权

> 唤醒后，当前线程不会马上退出，而是执行完synchronized控制的所有逻辑后退出（无论notify是否在控制逻辑的最后）

## Thread API

#### 线程的生命周期

![1544667514938](assets\1544667514938.png)

### sleep() 静态方法

让当前线程停止执行，让出cpu给其他的线程，但是**不会释放对象锁资源以及监控的状态**，当指定的时间到了之后又会自动恢复运行状态。

> wait()方法是Object类里面的，主要的意义就是让线程**放弃当前的对象的锁**，进入等待此对象的等待锁定池，只有针对此对象调动notify方法后本线程才能够进入对象锁定池准备获取对象锁进入运行状态。

### yield() 静态方法

使当前线程从执行状态（运行状态）变为可执行态（就绪状态）。然后从众多的可执行态的线程中选择一个进入运行状态（也就是说，当前也就是刚刚的那个线程还是有可能会被再次执行到的，并不是说一定会执行其他线程而该线程在下一次中不会执行到了）

### start() 实例方法

让线程进入准备状态，等待资源。**不是立刻启动线程**（具体什么时候开始执行，有JVM决定）

### join() 静态方法

让父线程等待子线程结束之后才能继续运行（父线程进入阻塞状态）

### interrupt() 实例方法

**发起**中断线程，**安全**的中断线程实例（当做一种线程间通信的方法），**不是立刻终止线程**

> Thread中的stop()和suspend()方法，由于固有的不安全性，已经建议不再使用！

#### 中断阻塞状态的线程 - 抛异常

当线程由于被调用了sleep(), join(), Object.wait()等方法而进入阻塞状态，若此时调用线程的interrupt()将线程的中断标记设为true。由于处于阻塞状态，中断标记会被清除，**同时产生一个InterruptedException异常**

在阻塞的代码处捕捉InterruptedException（比如wait()、lockInterruptibly()，都声明抛出），就能让阻塞的线程安全退出

#### 中断运行状态的线程 - 改标记

> interrupt()**并不会立刻终止**处于“运行状态”的线程！

它会将线程的中断标记设为true，在程序中检查这个标记来判断是继续执行还是退出

```java
@Override
public void run() {
    try {
        // 1. isInterrupted()保证，只要中断标记为true就终止线程。
        while (!isInterrupted()) {
            // 执行任务...
        }
    } catch (InterruptedException ie) {  
        // 2. InterruptedException异常保证，当InterruptedException异常产生时，线程被终止。
    }
}
```

##### jdk中的解释

```
interrupt()的作用是中断本线程。
本线程中断自己是被允许的；其它线程调用本线程的interrupt()方法时，会通过checkAccess()检查权限。这有可能抛出SecurityException异常。
如果本线程是处于阻塞状态：调用线程的wait(), wait(long)或wait(long, int)会让它进入等待(阻塞)状态，或者调用线程的join(), join(long), join(long, int), sleep(long), sleep(long, int)也会让它进入阻塞状态。若线程在阻塞状态时，调用了它的interrupt()方法，那么它的“中断状态”会被清除并且会收到一个InterruptedException异常。例如，线程通过wait()进入阻塞状态，此时通过interrupt()中断该线程；调用interrupt()会立即将线程的中断标记设为“true”，但是由于线程处于阻塞状态，所以该“中断标记”会立即被清除为“false”，同时，会产生一个InterruptedException的异常。
如果线程被阻塞在一个Selector选择器中，那么通过interrupt()中断它时；线程的中断标记会被设置为true，并且它会立即从选择操作中返回。
如果不属于前面所说的情况，那么通过interrupt()中断线程时，它的中断标记会被设置为“true”。
中断一个“已终止的线程”不会产生任何操作。
```

## `Lock` 线程重入锁

Lock是对synchronized同步锁的补充

> 如果这个获取锁的线程由于要等待IO或者其他原因（比如调用sleep方法）被阻塞了，但是又没有释放锁，其他线程便只能等待，试想一下，这多么影响程序执行效率。
>
> 因此就需要有一种机制可以**不让等待的线程一直无期限地等待下去**（比如只等待一定的时间或者能够响应中断）
>
> 可以将synchronized理解成锁标记，上锁和解锁都交个JVM去实现。
>
> 而Lock是在程序中主动控制资源的上锁和解锁，上锁和解锁直接操作硬件

## API

```JAVA
public interface Lock {
    void lock();
    void lockInterruptibly() throws InterruptedException;
    boolean tryLock();
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    void unlock();
    Condition newCondition();
}
```

必须主动去释放锁，并且在**发生异常时，不会自动释放锁**

### 获取锁

#### lock()

> 拿不到锁，就一直阻塞(谁劝也没用)

使用Lock必须在try{}catch{}块中进行，并且将释放锁的操作放在finally块中进行，以保证锁一定被被释放，防止死锁的发生

- 当锁可用，并且当前线程没有持有该锁，直接获取锁并把count set为1.
- 当锁可用，并且当前线程已经持有该锁，直接获取锁并把count增加1.
- 当锁不可用，那么当前线程**被阻塞**，休眠一直到该锁可以获取，然后把持有count设置为1.

```java
Lock lock = new ReentrantLock();
lock.lock();
try{
    //处理任务
}catch(Exception ex){
     
}finally{
    lock.unlock();   //释放锁
}
```

#### lockInterruptibly()

> 与lock方法对应，可以理解为“听劝”的lock方法

字面意思：“能被打扰的锁”。与线程的interrupt方法对应。

通过这个方法去获取锁时，如果lock被别的线程占用，当前线程处于阻塞状态。这个线程能够响应中断，即能够通过interrupt方法中断线程的等待状态。

> 与lock()方法对比，如果lock被别的线程占用，当前线程也会处于阻塞状态，当interrupt方法不能让阻塞的当前线程退出

也就使说，当两个线程同时通过lock.lockInterruptibly()想获取某个锁时，假若此时线程A获取到了锁，而线程B只有在等待，那么对线程B调用threadB.interrupt()方法能够中断线程B的等待过程

由于lockInterruptibly()的声明中抛出了异常，所以lock.lockInterruptibly()必须放在try块中或者在调用lockInterruptibly()的方法外声明抛出InterruptedException

```java
public void method() throws InterruptedException {
    lock.lockInterruptibly();
    try {  
     //.....
    }
    finally {
        lock.unlock();
    }  
}
```

#### tryLock()

> 马上返回，拿到锁返回true，没拿到返回false

* 当获取锁时，只有当该锁资源没有被其他线程持有才可以获取到，并且返回true，同时设置持有count为1；

* 当获取锁时，当前线程已持有该锁，那么锁可用时，返回true，同时设置持有count**加1**；

* 当获取锁时，如果其他线程持有该锁，无可用锁资源，直接返回false，这时候线程不用阻塞等待，可以先去做其他事情；

即使该锁是公平锁fairLock，使用tryLock()的方式获取锁也会是非公平的方式，只要获取锁时该锁可用那么就会直接获取并返回true。这种直接插入的特性在一些特定场景是很有用的。但是如果就是想使用公平的方式的话，可以试一试tryLock(0, TimeUnit.SECONDS)，几乎跟公平锁没区别，只是会监测中断事件。



#### tryLock(long time, TimeUnit unit)

> 带时间限制的tryLock()，拿不到lock，就等一段时间，超时返回false

和tryLock()方法是类似的，只不过区别在于这个方法在拿不到锁时会等待一定的时间，在时间期限之内如果还拿不到锁，就返回false。如果如果一开始拿到锁或者在等待期间内拿到了锁，则返回true

```java
Lock lock = new ReentrantLock();
if(lock.tryLock()) {
     try{
         //处理任务
     }catch(Exception ex){
         
     }finally{
         lock.unlock();   //释放锁
     } 
}else {
    //如果不能获取锁，则直接做其他事情
}
```

## atomic包

JUC下的atomic包使用CAS(compare and set)机制实现线程并发操作的数据一致性