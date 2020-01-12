# 默认方法 `default`

JDK8之后可以为interface添加default方法实现

> 区别于static修饰的类方法，default方法只能被接口的实现实例调用，通过this关键字对实例进行操作

下例为List接口新增的替换默认方法

```java
public interface List<E> extends Collection<E> {
    ...
    default void replaceAll(UnaryOperator<E> operator) {
        Objects.requireNonNull(operator);
        final ListIterator<E> li = this.listIterator();
        while (li.hasNext()) {
            li.set(operator.apply(li.next()));
        }
    }
    ...
}
```

引入default方法的是为了方便接口的升级，在不破坏java现有实现架构的情况下能往接口里增加新方法

JDK8之前如果需要为API提供一个新的功能，需要对接口的所有实现进行修改。JDK8之后只需要在接口中添加default方法，所有现有的接口实现不需要做任何调整，**新的接口实现只用覆盖接口的default方法**即可

> 默认方法为Java接口扩展提高例灵活度
>
> 比如List接口从Java1.2版本之后就没有添加过新的接口，直到Java1.8才添加了新的default方法，结合JDK8的函数式接口的特性，传入自定义逻辑对集合进行操作

# 函数式编程

JDK8以后支持将一段代码以参数的形式传递给另一个方法

## 函数式接口 `@FunctionalInterface`

**有且只有一个**待实现的方法的接口，但可以有其他default方法

一般通过`@FunctionalInterface`这个注解来表明某个接口是一个函数式接口，告知编译器校验待实现方法的唯一性

## lambda表达式

可以理解为是函数式编程中的函数，函数式接口的实现

每个lambda表达式 必须隐式或者显式指定一个函数式接口，单独的lambda表达式无法编译通过

lambda表达式 返回一个函数式接口functionalInterface的实例对象

### 简化

初始状态 lambda表达式的接口分为箭头左边和肩头有右边

- 左边表示的是函数式接口的参数列表

- 右边表示函数式接口实现的方法体

```java
IntUnaryOperator function = (int i) -> {
    // 逻辑
    return i * 2;
};
```

参数列表的类型已经由接口声明 可以省略  只需要作为方法体重的占位符声明

```java
IntUnaryOperator function1 = (i) -> {
    // 逻辑
    return i * 2;
};
```

对于只有一个参数列表的括号可以省略 如果方法没有参数，括号不能省略

```java
IntUnaryOperator function2 = i -> {
    // 逻辑
    return i * 2;
};
```

如果方法体中只有一行 方法体的{}可以省略

```java
IntUnaryOperator function3 = i -> i * 2;
```

如果方法体中只有一样 并且方法体中调用方法的参数和返回值与函数式接口一致，箭头以及箭头左边的参数列表都可以省略，箭头右边的方法调用使用`::`替代`.`

```java
// 使用new创建实例
BuilderFactory builderFactory = (a) -> A::new;
// 普通调用
Function<String,String> toStr = c::doStr;
// 静态调用
Function<String,String> toStr = A::doStaticStr;
```

# Stream API



## 创建流

| 创建方式 | API                                                          |
| -------- | ------------------------------------------------------------ |
| 集合     | 实现Collection接口的集合实现类通过获取流的方法<br/>Collection.stream<br/>Collection.parallelStream |
| 数组     | 通过工具类转换<br/>Arrays.stream()                           |
| 工具类   | IntStream/LongStream.range/rangeClosed (int和long的顺序流)<br/>Random.ints/longs/doubles(随机获取int、long、double类型的流) |
| 自定义   | Stream.generate/iterate                                      |

## 流操作

流的操作分为两种**中间操作**和**终止操作**

多个中间操作可以连接起来形成一个流水线，中间操作执行的动作都不会执行

只有执行了终止操作，所有的中间操作会一次性的全部执行，称为“惰性求值”

### 中间操作

中间操作会将处理结果作为新的流返回，供后续操作

#### 无状态操作

##### map



##### flatMap



##### filter



##### peek



##### unordered



#### 有状态操作

##### distinct

##### sorted

##### limit/skip

#### 终止操作

##### 匹配 match 

返回boolean
