(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{547:function(a,s,v){a.exports=v.p+"assets/img/image-20210606134128004.714d5ab2.png"},548:function(a,s,v){a.exports=v.p+"assets/img/image-20210606184522485.a28c2c9c.png"},549:function(a,s,v){a.exports=v.p+"assets/img/image-20210606184332229.a38ac82a.png"},642:function(a,s,v){"use strict";v.r(s);var _=v(21),t=Object(_.a)({},(function(){var a=this,s=a.$createElement,_=a._self._c||s;return _("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[_("h1",{attrs:{id:"类加载机制"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#类加载机制"}},[a._v("#")]),a._v(" 类加载机制")]),a._v(" "),_("p",[_("img",{attrs:{src:v(547),alt:"image-20210606134128004"}})]),a._v(" "),_("h2",{attrs:{id:"类加载过程"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#类加载过程"}},[a._v("#")]),a._v(" 类加载过程")]),a._v(" "),_("p",[a._v("Java将字节码数据从不同的数据来源读取到JVM中，并"),_("strong",[a._v("映射为JVM认可的数据结构（Class对象）")]),a._v("，这里的数据源可能是各种各样的形态，如jar文件、class文件，甚至是网络数据源等；如果输入数据不是ClassFile的结构，则会抛出ClassFormatError")]),a._v(" "),_("h3",{attrs:{id:"加载-loading"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#加载-loading"}},[a._v("#")]),a._v(" 加载 Loading")]),a._v(" "),_("p",[_("code",[a._v("ClassLoader")]),a._v("的不同实现"),_("RouterLink",{attrs:{to:"/views/java/2019/120601.html#classloader"}},[a._v("详见下文ClassLoader描述")]),a._v("，根据一个类的全限定名来获取这个类的"),_("strong",[a._v("二进制字节流")]),a._v("。")],1),a._v(" "),_("p",[a._v("将该二进制流中的静态存储结构转化为"),_("strong",[a._v("方法区")]),a._v("运行时数据结构。")]),a._v(" "),_("p",[a._v("在内存中生成该类的"),_("strong",[a._v("Class对象")]),a._v("，作为该类的数据访问入口。")]),a._v(" "),_("p",[a._v("此时的class对象没有被初始化")]),a._v(" "),_("h3",{attrs:{id:"链接-linking"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#链接-linking"}},[a._v("#")]),a._v(" 链接 Linking")]),a._v(" "),_("p",[a._v("链接包括（验证 >  准备  > 解析）")]),a._v(" "),_("p",[a._v("作用是将加载到JVM中的二进制字节流的类数据信息合并到JVM的运行时状态中")]),a._v(" "),_("h4",{attrs:{id:"验证-verfication"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#验证-verfication"}},[a._v("#")]),a._v(" 验证 Verfication")]),a._v(" "),_("p",[a._v("JVM需要核验字节信息是符合Java虚拟机规范的，否则就被认为是VerifyError；\n防止恶意信息或者不合规的信息危害JVM的运行，验证阶段有可能触发更多class的加载；")]),a._v(" "),_("h4",{attrs:{id:"准备-preparation"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#准备-preparation"}},[a._v("#")]),a._v(" 准备 Preparation")]),a._v(" "),_("p",[a._v("创建类或接口中的静态变量，并初始化"),_("strong",[a._v("静态变量")]),a._v("的"),_("strong",[a._v("默认初始值")]),a._v("，但没有赋值为代码中定义的值")]),a._v(" "),_("blockquote",[_("p",[a._v("这里的“初始化”和下面的显式初始化阶段是有区别的，侧重点在于"),_("strong",[a._v("分配内存空间")]),a._v("，不会去执行更进一步的JVM指令，不会赋值")])]),a._v(" "),_("p",[_("strong",[a._v("static final")]),a._v("修饰的字段在javac"),_("strong",[a._v("编译时")]),a._v("生成comstantValue属性，在类加载的准备阶段直接把constantValue的值赋给该字段。")]),a._v(" "),_("h4",{attrs:{id:"解析-resolution"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#解析-resolution"}},[a._v("#")]),a._v(" 解析 Resolution")]),a._v(" "),_("p",[a._v("将"),_("strong",[a._v("运行时常量池")]),a._v("中的"),_("strong",[a._v("符号引用")]),a._v("（symbolic reference）替换为"),_("strong",[a._v("直接引用")])]),a._v(" "),_("ul",[_("li",[a._v("符号引用：符号名称")]),a._v(" "),_("li",[a._v("直接引用：内存地址")])]),a._v(" "),_("h3",{attrs:{id:"初始化-initialization"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#初始化-initialization"}},[a._v("#")]),a._v(" 初始化 initialization")]),a._v(" "),_("p",[a._v("在创建的Class对象的基础上，执行static修饰的初始化逻辑")]),a._v(" "),_("ul",[_("li",[_("p",[a._v("静态字段赋值的动作（默认初始值 > 代码中定义的值）")]),a._v(" "),_("p",[a._v("static修饰变量等号右边的赋值逻辑")])]),a._v(" "),_("li",[_("p",[a._v("执行类定义中的静态初始化块内的逻辑"),_("code",[a._v("static {}")])])])]),a._v(" "),_("blockquote",[_("p",[a._v("编译器在编译阶段就会把这部分逻辑整理好，"),_("strong",[a._v("父类型的初始化逻辑优先于当前类型的逻辑")])])]),a._v(" "),_("p",[a._v("类在被Java程序“"),_("strong",[a._v("首次主动使用")]),a._v("”时，才会被初始化")]),a._v(" "),_("ul",[_("li",[a._v("创建实例（new、反射、克隆、反序列化）")]),a._v(" "),_("li",[a._v("调用类的静态方法")]),a._v(" "),_("li",[a._v("调用类或接口的静态字段")]),a._v(" "),_("li",[a._v("使用反射访问Class对象的某些属性")]),a._v(" "),_("li",[a._v("子类被初始化时（但接口的实现类被出示化时，接口不会被初始化）")]),a._v(" "),_("li",[a._v("JVM的入口类")])]),a._v(" "),_("h4",{attrs:{id:"进行类初始化的场景"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#进行类初始化的场景"}},[a._v("#")]),a._v(" 进行类初始化的场景")]),a._v(" "),_("ul",[_("li",[_("p",[a._v("创建类实例"),_("code",[a._v("new Object()")])])]),a._v(" "),_("li",[_("p",[a._v("操作类的静态变量，访问或赋值")])]),a._v(" "),_("li",[_("p",[a._v("调用类的静态方法")])]),a._v(" "),_("li",[_("p",[a._v("通过反射操作Class对象")])]),a._v(" "),_("li",[_("p",[a._v("该类的子类被初始化")])]),a._v(" "),_("li",[_("p",[a._v("包含main方法的类 JVM入口类")])]),a._v(" "),_("li",[_("p",[a._v("使用反射API对类进行反射调用时（但不一定会实例化）")]),a._v(" "),_("p",[a._v("函数指针：初次调用"),_("code",[a._v("MethodHandle")]),a._v("实例，会初始化"),_("code",[a._v("MethodHandle")]),a._v("指向的方法所在的类")])])]),a._v(" "),_("h4",{attrs:{id:"不会进行类初始化的场景"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#不会进行类初始化的场景"}},[a._v("#")]),a._v(" 不会进行类初始化的场景")]),a._v(" "),_("ul",[_("li",[_("p",[a._v("子类引用父类的静态字段，只会触发父类的初始化，而不会触发子类的初始化")])]),a._v(" "),_("li",[_("p",[a._v("声明变量对象类型中的泛型")]),a._v(" "),_("p",[a._v("如"),_("code",[a._v("List<Apple> apples = new ArrayList<>();")]),a._v("，Apple这个类在声明apples不会被初始化")])]),a._v(" "),_("li",[_("p",[_("code",[a._v("static final")]),a._v("修饰的字段（不可变常量）被引用时")]),a._v(" "),_("p",[a._v("区别于"),_("code",[a._v("static")]),a._v("修饰的静态字段")]),a._v(" "),_("p",[a._v("编译时就将不可变常量放入了"),_("strong",[a._v("调用方")]),a._v("类的静态常量池")])]),a._v(" "),_("li",[_("p",[a._v("Class.forName加载指定类，如果第二个参数initialize为false，则不会触发类的初始化")])]),a._v(" "),_("li",[_("p",[a._v("ClassLoader默认的loadClass方法，不会触发初始化动作")])])]),a._v(" "),_("h2",{attrs:{id:"classloader"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#classloader"}},[a._v("#")]),a._v(" ClassLoader")]),a._v(" "),_("p",[a._v("JVM通过ClassLoader读取class二进制字节码文件，检验是否符合格式要求，然后加载到JVM内存(方法区)中，在内存中创建"),_("code",[a._v("java.lang.Class")]),a._v("对象封装了类在方法区的数据结构（JVM规范并没有指定Class对象的存放位置，HotSpot JVM"),_("strong",[a._v("存放在方法区")]),a._v("中）")]),a._v(" "),_("blockquote",[_("p",[a._v("除了数组类的Class对象其他的Class对象都是由ClassLoader创建")]),a._v(" "),_("p",[a._v("数组类的Class对象不是由classLoader创建，JVM运行时动态创建（这种数组的Class类型开头带有L进行区分如"),_("code",[a._v("Ljava.lang.String")]),a._v("）")])]),a._v(" "),_("h3",{attrs:{id:"class文件加载方式"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#class文件加载方式"}},[a._v("#")]),a._v(" class文件加载方式")]),a._v(" "),_("ul",[_("li",[_("p",[a._v("从本地文件系统直接加载")])]),a._v(" "),_("li",[_("p",[a._v("从网络下载")])]),a._v(" "),_("li",[_("p",[a._v("从zip、jar等规定文件中加载")])]),a._v(" "),_("li",[_("p",[a._v("从数据库中加载")])]),a._v(" "),_("li",[_("p",[a._v("通过动态编译运行时生成class文件 "),_("strong",[a._v("动态代理")])])])]),a._v(" "),_("h3",{attrs:{id:"双亲委派机制-parent-delegation"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#双亲委派机制-parent-delegation"}},[a._v("#")]),a._v(" 双亲委派机制 parent delegation")]),a._v(" "),_("p",[a._v("为了更好的保证Java平台的安全性，除了Java虚拟机自带的根类加载器（Bootstrap Class-Loader）以外，其余的类加载器都"),_("strong",[a._v("有且只有一个")]),a._v("父加载器")]),a._v(" "),_("p",[_("img",{attrs:{src:v(548),alt:"image-20210606184522485"}})]),a._v(" "),_("blockquote",[_("p",[a._v("上图中Classloader1和ClassLoader2可以分别加载限定名相同的类，并且无法将Classloader1加载的类转换成Classloader2加载的类。")]),a._v(" "),_("p",[a._v("可以利用这个机制实现版本隔离")])]),a._v(" "),_("h4",{attrs:{id:"设计目的"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#设计目的"}},[a._v("#")]),a._v(" 设计目的")]),a._v(" "),_("p",[a._v("双亲委派机制设计的出发点是为了确立"),_("strong",[a._v("类")]),a._v("在JVM中的唯一性")]),a._v(" "),_("p",[a._v("对于任何一个Class对象都需要由"),_("strong",[a._v("加载它的类加载器")]),a._v("和Class对象"),_("strong",[a._v("本身")]),a._v("共同确立它在JVM中的唯一性，每一个类加载器都拥有一个独立的类命名空间")]),a._v(" "),_("h4",{attrs:{id:"类命名空间"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#类命名空间"}},[a._v("#")]),a._v(" 类命名空间")]),a._v(" "),_("h4",{attrs:{id:"类加载流程"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#类加载流程"}},[a._v("#")]),a._v(" 类加载流程")]),a._v(" "),_("blockquote",[_("p",[a._v("父加载器区别于父类继承，是通过加载器中的属性来指定的，实际上是引用关系")])]),a._v(" "),_("p",[a._v("当Java程序请求某子加载器加载类时，子加载器在自己尝试加载类"),_("strong",[a._v("之前")]),a._v("会委托父加载器去加载，如果父加载器能加载，则由父加载器完成加载类的工作；否则才由子加载器来加载。")]),a._v(" "),_("h3",{attrs:{id:"classloader实现"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#classloader实现"}},[a._v("#")]),a._v(" ClassLoader实现")]),a._v(" "),_("p",[a._v("JDK中的"),_("code",[a._v("java.lang.ClassLoader")]),a._v("是一个抽象类，有多个不同实现")]),a._v(" "),_("p",[_("img",{attrs:{src:v(549),alt:"image-20210606184332229"}})]),a._v(" "),_("h4",{attrs:{id:"启动类加载器-bootstrap-class-loader"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#启动类加载器-bootstrap-class-loader"}},[a._v("#")]),a._v(" 启动类加载器（Bootstrap Class-Loader）")]),a._v(" "),_("p",[a._v("加载 **"),_("code",[a._v("jre/lib")]),a._v("**下面的jar文件，如rt.jar等运行时的核心类库，如"),_("code",[a._v("java.lang.*")]),a._v("。启动类加载器从系统属性"),_("code",[a._v("sun.boot.class.path")]),a._v("所指定的目录中加载类库")]),a._v(" "),_("p",[a._v("启动类加载器的实现依赖于底层操作系统，由C++实现，属于JVM实现的一部分")]),a._v(" "),_("p",[_("strong",[a._v("不继承")]),_("code",[a._v("java.lang.ClassLoader")])]),a._v(" "),_("h4",{attrs:{id:"扩展类加载器-extension-or-ext-class-loader"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#扩展类加载器-extension-or-ext-class-loader"}},[a._v("#")]),a._v(" 扩展类加载器（Extension or Ext Class-Loader）")]),a._v(" "),_("p",[a._v("父加载器是BootstrapClassLoader")]),a._v(" "),_("p",[a._v("负责加载我们放到**"),_("code",[a._v("jre/lib/ext")]),a._v("**目录下面的jar包，这就是所谓的extension机制。该目录也可以通过设置 "),_("code",[a._v("java.ext.dirs")]),a._v("来覆盖")]),a._v(" "),_("p",[a._v("继承"),_("code",[a._v("java.lang.ClassLoader")])]),a._v(" "),_("h4",{attrs:{id:"应用类加载器-application-or-app-class-loader"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#应用类加载器-application-or-app-class-loader"}},[a._v("#")]),a._v(" 应用类加载器（Application or App Class-Loader）")]),a._v(" "),_("p",[a._v("父加载器是ExtensionClassLoader，也是用户自定义类加载器的默认父加载器")]),a._v(" "),_("p",[a._v("从环境变量classpath或者系统属性java.class.path所指的的目录加载类")]),a._v(" "),_("p",[a._v("运行的用户代码（main方法以及其所有依赖）都是有应用类加载器或它的子类加载的。")]),a._v(" "),_("blockquote",[_("p",[a._v("可以通过"),_("code",[a._v("-Djava.sysem.class.loader=com.yourcorp.YourClassLoader")]),a._v("自定义类加载器\n如果我们指定了这个参数，JDK内建的应用类加载器就会成为定制加载器的父亲，这种方式通常用在类似需要改变双亲委派模式的场景。")])]),a._v(" "),_("h4",{attrs:{id:"用户自定义类加载器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#用户自定义类加载器"}},[a._v("#")]),a._v(" 用户自定义类加载器")]),a._v(" "),_("p",[a._v("父加载器为"),_("strong",[a._v("应用类加载器")])]),a._v(" "),_("p",[a._v("用户可以定制类的加载方式")]),a._v(" "),_("p",[a._v("如SpringBoot启动jat jar使用的LaunchedURLClassLoader")]),a._v(" "),_("h3",{attrs:{id:"实现自定义classloader"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#实现自定义classloader"}},[a._v("#")]),a._v(" 实现自定义ClassLoader")]),a._v(" "),_("p",[a._v("继承"),_("code",[a._v("java.lang.ClassLoader")]),a._v("，自身也是堆中的一个对象，可以被垃圾回收")]),a._v(" "),_("h4",{attrs:{id:"classloader抽象类"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#classloader抽象类"}},[a._v("#")]),a._v(" ClassLoader抽象类")]),a._v(" "),_("h5",{attrs:{id:"构造方法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#构造方法"}},[a._v("#")]),a._v(" 构造方法")]),a._v(" "),_("p",[a._v("用于指定类加载器的父亲")]),a._v(" "),_("h6",{attrs:{id:"无参构造方法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#无参构造方法"}},[a._v("#")]),a._v(" 无参构造方法")]),a._v(" "),_("p",[_("code",[a._v("super()")]),a._v(" 无参的构造方法指定的父加载器为"),_("strong",[a._v("应用类加载器")]),a._v("（getSystemClassLoader）")]),a._v(" "),_("h6",{attrs:{id:"指定父加载器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#指定父加载器"}},[a._v("#")]),a._v(" 指定父加载器")]),a._v(" "),_("p",[_("code",[a._v("super(ClassLoader parent)")]),a._v(" 指定父加载器")]),a._v(" "),_("h5",{attrs:{id:"findclass"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#findclass"}},[a._v("#")]),a._v(" "),_("code",[a._v("findClass")])]),a._v(" "),_("p",[a._v("通过类名称加载指定类")]),a._v(" "),_("blockquote",[_("p",[a._v("抽象类中的findClass没有被实现，直接抛出异常，实现类"),_("strong",[a._v("必须Override")]),a._v("这个方法")])]),a._v(" "),_("p",[_("code",[a._v("Class<?> findClass(final String qualifiedClassName)")])]),a._v(" "),_("ul",[_("li",[a._v("通过输入的类限定名称得到对应的Class对象\n"),_("ul",[_("li",[a._v("根据不同的二进制字节码来源实现不同的加载逻辑 "),_("strong",[a._v("自定义IO操作")])]),a._v(" "),_("li",[a._v("将得到的二进制字节数组调用"),_("strong",[a._v("defineClass")]),a._v("，调用JVM实现的native方法，生成Class对象")])])]),a._v(" "),_("li",[a._v("会被loadClass在检查完父类加载器后调用")])]),a._v(" "),_("h5",{attrs:{id:"loadclass"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#loadclass"}},[a._v("#")]),a._v(" "),_("code",[a._v("loadClass")])]),a._v(" "),_("p",[a._v("加载类对象，包含了双亲委派逻辑")]),a._v(" "),_("p",[_("code",[a._v("protected Class<?> loadClass(String name, boolean resolve)")])]),a._v(" "),_("p",[a._v("执行流程")]),a._v(" "),_("ul",[_("li",[a._v("先查看是否已经加载这个类 findLoadedClass\n"),_("ul",[_("li",[a._v("保证在同一个classLoader"),_("strong",[a._v("命名空间")]),a._v("下，不会重复加载Class对象")])])]),a._v(" "),_("li",[a._v("调用父加载器的loadClass来加载Class\n"),_("ul",[_("li",[_("strong",[a._v("双亲委派机制")]),a._v("实现")]),a._v(" "),_("li",[a._v("如果父加载器可以加载就不会由子加载器加载，也不会走子加载器的自定义findClass逻辑")]),a._v(" "),_("li",[a._v("当父加载器不能加载时，才有子加载器加载")])])]),a._v(" "),_("li",[a._v("如果父加载器为空，调用Bootstrap classLoader")]),a._v(" "),_("li",[a._v("如果Bootstrap classLoader无法加载，则调用findClass")])]),a._v(" "),_("h4",{attrs:{id:"获取classloader"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#获取classloader"}},[a._v("#")]),a._v(" 获取ClassLoader")]),a._v(" "),_("h5",{attrs:{id:"class-forname"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#class-forname"}},[a._v("#")]),a._v(" "),_("code",[a._v("Class.forName")])]),a._v(" "),_("p",[a._v('每一个Class对象保存着加载（defined）它的ClassLoader的引用。通过Class.forName("类的全路径")，来获取加载指定类的类加载器对象引用；')]),a._v(" "),_("blockquote",[_("p",[a._v("如果加载该类的加载器为Bootstrap Class-Loader，则返回为空，因为Bootstrap Class-Loader是由C++实现，不继承ClassLoader")])]),a._v(" "),_("h2",{attrs:{id:"类加载次序"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#类加载次序"}},[a._v("#")]),a._v(" 类加载次序")]),a._v(" "),_("ul",[_("li",[_("p",[a._v("jre/lib.rt.jar中的类会被全部加载，classpath下的其他类会在第一次使用的时候加载")])]),a._v(" "),_("li",[_("p",[a._v("启动时，第一个加载的类时入口main方法所在的类")])]),a._v(" "),_("li",[_("p",[a._v("JVM初始化一个类时，要求他的所有父类都已经被初始化，但"),_("strong",[a._v("不适用于接口")]),a._v("（初始化一个类时，不会初始化这个类实现的接口）")])]),a._v(" "),_("li",[_("p",[a._v("一个父接口不会因为子接口或者实现类被初始化而初始化。只有首次使用接口中定义的静态方法时，才会初始化该接口")])])]),a._v(" "),_("h2",{attrs:{id:"命令空间"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#命令空间"}},[a._v("#")]),a._v(" 命令空间")]),a._v(" "),_("p",[a._v("每一个类加载器都有自己的命名空间，命名空间是由该加载器和所有父加载器所加载的类组成")]),a._v(" "),_("p",[a._v("在同一个命名空间中，不会出现类的完整名称（包名+类名）相同的两个类；在不同的命名空间中，可以出现类的完整名称（包名+类名）相同的两个类")]),a._v(" "),_("h2",{attrs:{id:"类卸载"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#类卸载"}},[a._v("#")]),a._v(" 类卸载")]),a._v(" "),_("blockquote",[_("p",[a._v("方法区中的垃圾回收")])]),a._v(" "),_("p",[a._v("当类的Class对象不再被引用，即"),_("strong",[a._v("不可达")]),a._v("时，Class对象就会结束生命周期，Class对象在方法区内的数据也会被卸载。")]),a._v(" "),_("ul",[_("li",[a._v("由JVM自带的类加载器所加载的类，在虚拟机的生命周期中，始终不会被卸载；JVM始终会引用自带的类加载器，而这些类加载器则会始终引用所加载类的Class对象，所以这些由JVM自带的类加载器所加载的类始终是"),_("strong",[a._v("可达")]),a._v("的")]),a._v(" "),_("li",[a._v("由用户自定义加载器所加载的类可以被卸载")])]),a._v(" "),_("blockquote",[_("p",[a._v("Class对象与类加载器"),_("strong",[a._v("双向关联")])]),a._v(" "),_("p",[a._v("类加载器会保存所加载的所有Class对象的引用；一个Class对象也会引用它的类加载器，使用getClassLoader方法获取它的类加载器")]),a._v(" "),_("p",[a._v("一个类的实例总是引用这个类的Class对象，通过Object的getClass方法获取")])]),a._v(" "),_("h3",{attrs:{id:"卸载条件"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#卸载条件"}},[a._v("#")]),a._v(" 卸载条件")]),a._v(" "),_("ul",[_("li",[a._v("堆中不存在类的所有"),_("strong",[a._v("实例对象")])]),a._v(" "),_("li",[a._v("加载这个类的ClassLoader也被回收（ClassLoader会持有它加载Class对象的应用）")]),a._v(" "),_("li",[a._v("Class对象没有任何引用")])])])}),[],!1,null,null,null);s.default=t.exports}}]);