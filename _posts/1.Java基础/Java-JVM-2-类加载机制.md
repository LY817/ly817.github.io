# 类加载机制

## 类加载过程

### 加载 Loading 

Java将字节码数据从不同的数据来源读取到JVM中，并**映射为JVM认可的数据结构（Class对象）**，这里的数据源可能是各种各样的形态，如jar文件、class文件，甚至是网络数据源等；如果输入数据不是ClassFile的结构，则会抛出ClassFormatError

### 验证 Verfication

JVM需要核验字节信息是符合Java虚拟机规范的，否则就被认为是VerifyError；
防止恶意信息或者不合规的信息危害JVM的运行，验证阶段有可能触发更多class的加载；

### 准备 Preparation

创建类或接口中的静态变量，并初始化**静态变量**的**默认初始值**，但没有赋值为代码中定义的值

> 这里的“初始化”和下面的显式初始化阶段是有区别的，侧重点在于**分配内存空间**，不会去执行更进一步的JVM指令，不会赋值

**static final**修饰的字段在javac**编译时**生成comstantValue属性，在类加载的准备阶段直接把constantValue的值赋给该字段。

### 解析 Resolution

将**运行时常量池**中的符号引用（symbolic reference）替换为直接引用

- 符号引用：符号名称
- 直接引用：内存地址

### 初始化 initialization

真正去执行**类初始化的代码逻辑**

- 静态字段赋值的动作（默认初始值 > 代码中定义的值）

- 执行类定义中的静态初始化块内的逻辑

> 编译器在编译阶段就会把这部分逻辑整理好，**父类型的初始化逻辑优先于当前类型的逻辑**

类在被Java程序“**首次主动使用**”时，才会被初始化

#### 进行初始化的场景

- 创建类实例`new Object()`
- 操作类的静态变量，访问或赋值
- 调用类的静态方法
- 通过反射操作Class对象
- 该类的子类被初始化
- 包含mian方法的类 JVM入口类

#### 不会进行初始化的场景

- static final修饰的属性被引用时（编译时就将不可变常量放入了调用方类的静态常量池）

## ClassLoader

JVM通过ClassLoader读取class二进制字节码文件，检验是否符合格式要求，然后加载到JVM内存(方法区)中，在内存中创建`java.lang.Class`对象封装了类在方法区的数据结构（JVM规范并没有指定Class对象的存放位置，HotSpot JVM**存放在方法区**中）

> 除了数组类的Class对象其他的Class对象都是由ClassLoader创建
>
> 数组类的Class对象不是由classLoader创建，JVM运行时动态创建（这种数组的Class类型开头带有L进行区分如`Ljava.lang.String`）

### class文件加载方式

- 从本地文件系统直接加载

- 从网络下载
- 从zip、jar等规定文件中加载
- 从数据库中加载
- 通过动态编译运行时生成class文件 **动态代理**

### 双亲委派机制 parent delegation

为了更好的保证Java平台的安全性，除了Java虚拟机自带的根类加载器（Bootstrap Class-Loader）以外，其余的类加载器都**有且只有一个**父加载器

<img src="assets\image-20191202124213930.png" alt="image-20191202124213930" style="zoom:80%;" /> 

> 父加载器区别于父类继承，是通过加载器中的属性来指定的，实际上是引用关系

当Java程序请求某子加载器加载类时，子加载器在自己尝试加载类**之前**会委托父加载器去加载，如果父加载器能加载，则由父加载器完成加载类的工作；否则才由子加载器来加载。

![image-20191204124820507](assets\image-20191204124820507.png)

### ClassLoader实现

JDK中的`java.lang.ClassLoader`是一个抽象类，有多个不同实现

#### 启动类加载器（Bootstrap Class-Loader）

加载 **`jre/lib`**下面的jar文件，如rt.jar等运行时的核心类库，如`java.lang.*`。启动类加载器从系统属性`sun.boot.class.path`所指定的目录中加载类库

启动类加载器的实现依赖于底层操作系统，由C++实现，属于JVM实现的一部分

**不继承**`java.lang.ClassLoader`

#### 扩展类加载器（Extension or Ext Class-Loader）

父加载器是BootstrapClassLoader

负责加载我们放到**`jre/lib/ext`**目录下面的jar包，这就是所谓的extension机制。该目录也可以通过设置 `java.ext.dirs`来覆盖

继承`java.lang.ClassLoader`

#### 应用类加载器（Application or App Class-Loader）

父加载器是ExtensionClassLoader，是用户自定义类加载器的默认父加载器

从环境变量classpath或者系统属性java.class.path所指的的目录加载类

继承`java.lang.ClassLoader`

> 可以通过`-Djava.sysem.class.loader=com.yourcorp.YourClassLoader`自定义类加载器
> 如果我们指定了这个参数，JDK内建的应用类加载器就会成为定制加载器的父亲，这种方式通常用在类似需要改变双亲委派模式的场景。

#### 用户自定义类加载器

父加载器为**应用类加载器**

用户可以定制类的加载方式

如SpringBoot启动jat jar使用的LaunchedURLClassLoader

### 实现自定义ClassLoader

继承`java.lang.ClassLoader`

#### ClassLoader抽象类

##### 构造方法

用于指定类加载器的父亲

###### 无参构造方法

`super()` 无参的构造方法指定的父加载器为**应用类加载器**（getSystemClassLoader）

###### 指定父加载器

`super(ClassLoader parent)` 指定父加载器

##### findClass

通过类名称加载指定类

> 抽象类中的findClass没有被实现，直接抛出异常，实现类**必须Override**这个方法

`Class<?> findClass(final String qualifiedClassName)`

- 通过输入的类限定名称得到对应的Class对象
  - 根据不同的二进制字节码来源实现不同的加载逻辑 **自定义IO操作**
  - 将得到的二进制字节数组调用**defineClass**，调用JVM实现的native方法，生成Class对象
- 会被loadClass在检查完父类加载器后调用

##### loadClass

加载类对象，包含了双亲委派逻辑

`protected Class<?> loadClass(String name, boolean resolve)`

执行流程

- 先查看是否已经加载这个类 findLoadedClass
  - 保证在同一个classLoader**命名空间**下，不会重复加载Class对象
- 调用父加载器的loadClass来加载Class 
  -  **双亲委派机制**实现
  -  如果父加载器可以加载就不会由子加载器加载，也不会走子加载器的自定义findClass逻辑
  -  当父加载器不能加载时，才有子加载器加载
- 如果父加载器为空，调用Bootstrap classLoader
- 如果Bootstrap classLoader无法加载，则调用findClass

#### 获取ClassLoader

##### Class.forName

每一个Class对象保存着加载（defined）它的ClassLoader的引用。通过Class.forName("类的全路径")，来获取加载指定类的类加载器对象引用；

> 如果加载该类的加载器为Bootstrap Class-Loader，则返回为空，因为Bootstrap Class-Loader是由C++实现，不继承ClassLoader

## 类加载次序

- jre/lib.rt.jar中的类会被全部加载，classpath下的其他类会在第一次使用的时候加载

- 启动时，第一个加载的类时入口main方法所在的类
- JVM初始化一个类时，要求他的所有父类都已经被初始化，但**不适用于接口**（初始化一个类时，不会初始化这个类实现的接口）

- 一个父接口不会因为子接口或者实现类被初始化而初始化。只有首次使用接口中定义的静态方法时，才会初始化该接口

## 命令空间

每一个类加载器都有自己的命名空间，命名空间是由该加载器和所有父加载器所加载的类组成

在同一个命名空间中，不会出现类的完整名称（包名+类名）相同的两个类；在不同的命名空间中，可以出现类的完整名称（包名+类名）相同的两个类

# 类卸载

> 方法区中的垃圾回收

当类的Class对象不再被引用，即**不可达**时，Class对象就会结束生命周期，Class对象在方法区内的数据也会被卸载。

- 由JVM自带的类加载器所加载的类，在虚拟机的生命周期中，始终不会被卸载；JVM始终会引用自带的类加载器，而这些类加载器则会始终引用所加载类的Class对象，所以这些由JVM自带的类加载器所加载的类始终是**可达**的
- 由用户自定义加载器所加载的类可以被卸载

> Class对象与类加载器**双向关联**
>
> 类加载器会保存所加载的所有Class对象的引用；一个Class对象也会引用它的类加载器，使用getClassLoader方法获取它的类加载器
>
> 一个类的实例总是引用这个类的Class对象，通过Object的getClass方法获取

### 卸载条件

- 堆中不存在类的所有实例对象
- 加载这个类的ClassLoader也被回收（ClassLoader会持有它加载Class对象的应用）
- Class对象没有任何引用



