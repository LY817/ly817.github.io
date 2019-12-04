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

### class文件加载方式

- 从本地文件系统直接加载

- 从网络下载
- 从zip、jar等规定文件中加载
- 从数据库中加载
- 通过动态编译运行时生成class文件 **动态代理**

### 双亲委派机制

为了更好的保证Java平台的安全性，除了Java虚拟机自带的根类加载器（Bootstrap Class-Loader）以外，其余的类加载器都**有且只有一个**父加载器

<img src="assets\image-20191202124213930.png" alt="image-20191202124213930" style="zoom:80%;" /> 

> 父加载器区别于父类继承，是通过加载器中的属性来指定的，实际上是引用关系

当Java程序请求某子加载器加载类时，子加载器首先会委托父加载器去加载，如果父加载器能加载，则由父加载器完成加载类的工作；否则才由子加载器来加载。

![image-20191204124820507](assets\image-20191204124820507.png)

### ClassLoader实现

JDK中的`java.lang.ClassLoader`是一个抽象类，有多个不同实现

#### 启动类加载器（Bootstrap Class-Loader）

加载 jre/lib下面的jar文件，如rt.jar等运行时的核心类库，如`java.lang.*`。启动类加载器从系统属性`sun.boot.class.path`所指定的目录中加载类库

启动类加载器的实现依赖于底层操作系统，由C++实现，属于JVM实现的一部分

**不继承**`java.lang.ClassLoader`

#### 扩展类加载器（Extension or Ext Class-Loader）

父加载器是BootstrapClassLoader

负责加载我们放到`jre/lib/ext/`目录下面的jar包，这就是所谓的extension机制。该目录也可以通过设置 `java.ext.dirs`来覆盖

继承`java.lang.ClassLoader`

#### 应用类加载器（Application or App Class-Loader）

父加载器是ExtensionClassLoader，是用户自定义类加载器的默认父加载器

从环境变量classpath或者系统属性java.class.path所指的的目录加载类

继承`java.lang.ClassLoader`

> 可以通过`-Djava.sysem.class.loader=com.yourcorp.YourClassLoader`自定义类加载器
> 如果我们指定了这个参数，JDK内建的应用类加载器就会成为定制加载器的父亲，这种方式通常用在类似需要改变双亲委派模式的场景。

#### 用户自定义类加载器

父加载器为应用类加载器

用户可以定制类的加载方式如SpringBoot启动jat jar使用的LaunchedURLClassLoader

继承`java.lang.ClassLoader`

## 类加载次序

JVM初始化一个类时，要求他的所有父类都已经被初始化，但**不适用于接口**（初始化一个类时，不会初始化这个类实现的接口）

一个父接口不会因为子接口或者实现类被初始化而初始化。只有首次使用接口中定义的静态方法时，才会初始化该接口

## 获取ClassLoader

### Class.forName

Class.forName("类的全路径")，来获取加载指定类的类加载器对象引用；

如果加载该类的加载器为Bootstrap Class-Loader，则返回为空，因为Bootstrap Class-Loader是由C++实现，不继承ClassLoader

# 动态代理

## 动态生成class文件

Java编译器编译好Java文件之后，产生.class 文件在磁盘中。这种class文件是二进制文件，内容是只有JVM虚拟机能够识别的机器码。JVM虚拟机读取字节码文件，取出二进制数据，加载到内存中，解析.class文件内的信息，生成对应的 Class对象

> class文件可以在运行期之前通过类加载器；也可以在运行时，在程序中按照Java虚拟机规范对class文件的组织规则生成对应的二进制字节码（开源实现如：ASM，Javassist），然后个给类加载器加载，得到对应的class对象

![1542768554570](../../../mdblog/root/it/java/%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86/assets/1542768554570.png)



## ASM

ASM 是一个 Java 字节码操控框架。它能够以二进制形式修改已有类或者动态生成类。ASM 可以直接产生二进制 class 文件，也可以在类被加载入 JVM之前动态改变类行为。ASM 从类文件中读入信息后，能够改变类行为，分析类信息，甚至能够根据用户要求生成新类

> **不过ASM在创建class字节码的过程中，操纵的级别是底层JVM的汇编指令级别，这要求ASM使用者要对class组织结构和JVM汇编指令有一定的了解**

## Javassist

Javassist是一个开源的分析、编辑和创建Java字节码的类库。是由东京工业大学的数学和计算机科学系的 Shigeru Chiba （千叶 滋）所创建的。它已加入了开放源代码JBoss 应用服务器项目,通过使用Javassist对字节码操作为JBoss实现动态AOP框架。javassist是jboss的一个子项目，其主要的优点，在于**简单而且快速**。直接使用java编码的形式，而不需要了解虚拟机指令，就能动态改变类的结构，或者动态生成类

```java
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.CtNewMethod;
 
public class MyGenerator {
	public static void main(String[] args) throws Exception {
		ClassPool pool = ClassPool.getDefault();
        //创建Programmer类		
		CtClass cc= pool.makeClass("com.samples.Programmer");
		//定义code方法
		CtMethod method = CtNewMethod.make("public void code(){}", cc);
		//插入方法代码
		method.insertBefore("System.out.println(\"I'm a Programmer,Just Coding.....\");");
		cc.addMethod(method);
		//保存生成的字节码
		cc.writeFile("d://temp");
	}
}
```

## 创建代理

代理模式中，有三种角色：Subject角色，RealSubject角色，Proxy角色

- Subject角色负责定义RealSubject和Proxy角色应该实现的接口(API)
- RealSubject角色用来真正完成业务服务功能(Impl)
- Proxy角色负责将自身的Request请求，调用realsubject 对应的request功能来实现业务功能，自己不真正做业务(转发)

### 静态代理

即**使用代理模式**，Proxy类也实现Subject接口，并包含RealSubject的实例，Subject的每一个实现方法调用RealSubject的实例对应的实现方法

静态代理中的proxy类的class文件真实存在classpath下，就是所谓的静态

![1542775692746](../../../mdblog/root/it/java/%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86/assets/1542775692746.png)

> 当在代码阶段规定这种代理关系，Proxy类通过编译器编译成class文件，当系统运行时，此class已经存在了。这种静态的代理模式固然在访问无法访问的资源，增强现有的接口业务功能方面有很大的优点，但是大量使用这种静态代理，会使我们系统内的**类的规模增大**，并且**不易维护**；并且由于Proxy和RealSubject的功能 本质上是相同的，Proxy只是起到了中介的作用，这种代理在系统中的存在，导致系统结构比较臃肿和松散。

#### 静态代理的改进

在运行状态中，需要代理的地方，根据Subject 和RealSubject，**动态地创建一个Proxy**，用完之后，就会销毁，这样就可以避免了Proxy 角色的class在系统中冗杂的问题

不希望静态地有Proxy类存在，希望在代码中，动态生成器二进制代码，加载进来，得到Class对象。

为此，使用Javassist开源框架，在代码中动态地生成StationProxy的字节码（**在内存中完成class的构建、加载、实例化**）

### 动态代理

不使用代理模式（不维护被代理类的实例），而是通过反射，使用`Method`对象调用。Proxy类的实现也不需要有程序员维护

> 上述的**静态代理的改进**虽然减少了系统代码的冗杂度，但是上述做法却增加了在动态创建代理类过程中的复杂度：**手动地创建了太多的业务代码**，并且封装性也不够，完全不具有可拓展性和通用性。如果某个代理类的一些业务逻辑非常复杂，上述的动态创建代理的方式是非常不可取的！

创建代理的目的，无非是在调用真正业务之前或者之后做一些“额外”业务。换一种思路就是：在触发（invoke）真实角色的方法之前或者之后做一些额外的业务。

#### InvocationHandler

那么，为了构造出具有通用性和简单性的代理类，可以将所有的触发真实角色动作交给一个触发的管理器（**避免显示的调用实现类的方法**），让这个管理器统一地管理触发。这种管理器就是InvocationHandler

Proxy需要触发真实角色动作时，只用告诉InvocationHandler：需要调用的方法对象**Method**，方法的**参数**，具体的调用过程由InvocationHandler实现

Proxy类和实现类都实现同一个接口

![1542790658539](../../../mdblog/root/it/java/%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86/assets/1542790658539.png)

有两种实现生成动态代理的思路

- **实现共同的接口 - JDK**

  定义一个功能接口，然后让Proxy 和RealSubject来实现这个接口

- **继承实现类并重写 - cglib**

  因为如果Proxy 继承自RealSubject，这样Proxy则拥有了RealSubject的功能，Proxy还可以通过重写RealSubject中的方法，来实现多态

#### 动态代理实现之JDK

##### 创建代理步骤

1. 获取RealSubject上的所有接口列表
2. 确定要生成的代理类的类名，默认为：com.sun.proxy**.$ProxyXXXX** 
3. 根据需要实现的接口信息，在代码中动态创建该Proxy类的字节码
4. 将对应的字节码转换为对应的class对象
5. 创建InvocationHandler 实例handler，用来处理Proxy所有方法调用
6. Proxy 的class对象以创建的handler对象为参数，实例化一个proxy对象

##### API

JDK通过 java.lang.reflect.Proxy包来支持动态代理

**获取代理对象**

`java.lang.reflect.Proxy`

```JAVA
static Object newProxyInstance(ClassLoader loader,Class<?>[] interfaces,InvocationHandler h);
```

> 参数列表
>
> - loader：类加载器
> - interfaces：代理接口
> - h：触发器 包含具体实现类的引用，负责代理对象中触发实现类的相应方法
>
> 返回一个指定接口的代理类实例，该接口可以将方法调用指派到指定的调用处理程序

**代理方法处理**

`java.lang.reflect.InvocationHandler`

```java
Object invoke(Object proxy,Method method,Object[] args){
    // 前置处理
    Object o = method.invoke(proxy,args);
    // 后置处理
    return o;
}
```

> 在调用代理对象中的每一个方法时，返回的porxy实例内部是直接调用了InvocationHandler 的invoke方法
>
> handler实现类invoke方法中根据代理类传递给自己的method参数来找到实现类的方法，然后通过`Method.invoke(obj,args)`调用实现类的方法，在Method.invoke前后添加所需的业务逻辑



#### 动态代理实现之cglib

> Code Generation Library
>
> 强大的，高性能，高质量的Code生成类库，它可以在运行期扩展Java类与实现Java接口

##### 创建代理步骤

1. 查找A上的所有非final 的public类型的方法定义
2. 将这些方法的定义转换成字节码
3. 将组成的字节码转换成相应的代理的class对象
4. 实现 MethodInterceptor接口，用来处理 对代理类上所有方法的请求（这个接口和JDK动态代理InvocationHandler的功能和角色是一样的）

##### API