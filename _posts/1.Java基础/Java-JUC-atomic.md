Atomic原理

利用unsafe的CAS，自旋的（加载+计算+CAS写入）

```java
// var1 AtomicInteger对象
// var2 stateOffset 内存偏移量 unsafe方法通过这个值读取AtomicInteger对象的int值
// var4 加数
public final int getAndAddInt(Object var1, long var2, int var4) {
  int var5;
  do {
    // 先取出这个数
    var5 = this.getIntVolatile(var1, var2);
    // 然后用unsafe的CAS更新方法 
    // 如果更新失败 表示有其他线程在进行并发更新 读取新的值
  } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));
  return var5;
}
```

