# 启动方式

### “面向对象”构建 `SpringApplication`

```java
SpringApplication springApplication = new SpringApplication(DiveInSpringBootApplication.class);
springApplication.setBannerMode(Banner.Mode.CONSOLE);
springApplication.setWebApplicationType(WebApplicationType.NONE);
springApplication.setAdditionalProfiles("prod");
springApplication.setHeadless(true);
springApplication.run(args);
```

### “链式”构建 `SpringApplicationBuilder`

Fluent Builder API  流畅的构建API

```java
new SpringApplicationBuilder(DiveInSpringBootApplication.class)
.bannerMode(Banner.Mode.CONSOLE)
.web(WebApplicationType.NONE)
.profiles("prod")
.headless(true)
.run(args);
```

# 应用启动流程

## 构造阶段

### SpringApplication构造方法

> 创建一个SpringApplication实例对象，应用上下文会以传入的启动类（被@SpringBootApplication等注解标注）作为根配置类加载Bean
>
> 在调用run方法之前，可以对SpringApplication实例对象的配置进行定制

```java
/**
 * Create a new {@link SpringApplication} instance. The application context will load
 * beans from the specified primary sources (see {@link SpringApplication class-level}
 * documentation for details. The instance can be customized before calling
 * {@link #run(String...)}.
 * @param resourceLoader the resource loader to use
 * @param primarySources the primary bean sources
 * @see #run(Class, String[])
 * @see #setSources(Set)
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    this.webApplicationType = deduceWebApplicationType();
    // 初始化classpath下 META-INF/spring.factories中已配置的ApplicationContextInitializer
    setInitializers((Collection) getSpringFactoriesInstances(
        ApplicationContextInitializer.class));
    // 初始化classpath下所有已配置的 ApplicationListener
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
    // 根据调用栈，推断出 main 方法的类名
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

### 推断WebApplication类型

检查classpath下是否有Web应用的相关依赖，来推断当前应用类型

### 加载Bean

以传入的primarySources作为“源”（root），解析并加载所有符合条件的Bean

#### @EnableAutoConfiguration 自动装配

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
	String ENABLED_OVERRIDE_PROPERTY 
        = "spring.boot.enableautoconfiguration";
	Class<?>[] exclude() default {};
	String[] excludeName() default {};
}
```

@EnableAutoConfiguration注解

- 引入了`@Import(AutoConfigurationImportSelector.class)`

  实现Bean的自动装配，会扫描classpath下所有的spring.factories下，`org.springframework.boot.autoconfigure.EnableAutoConfiguration`键对应的值作为配置类加载

- 引入了`@AutoConfigurationPackage`

  扫描启动类所在包 同级和下级所有被`@Component`派生的模式注解标注的类，作为Bean

#### @SpringBootConfiguration 自身作为配置类

启动类中使用@Bean注入bean

#### 其他引入方式

##### `@EnableXXX`

@Import引入的配置类或者配置选择器（实现`ImportSelector`接口）

##### `@ImportResource`

通过ImportResource引入的xml配置文件

## 准备阶段



## refresh阶段



# spring.factories

spring.factories作为SpringBoot自己实现的SPI机制的“注册表”，约定将**接口与实现类**以**键值对**的形式存在这个配置文件中。SpringBoot启动时，会根据spring.factories的配置加载对应接口的实现类，达到解耦合、扩展性和自动加载的目的

### Spring Framework相关

#### `org.springframework.context.ApplicationContextInitializer`

在`ConfigurableApplicationContext`应用上下文调用**refresh()方法之前**

**回调**`ApplicationContextInitializer.initialize`方法，对应用上下文进行初始化操作

```java
/**
 * Callback interface for initializing a Spring {@link ConfigurableApplicationContext}
 * prior to being {@linkplain ConfigurableApplicationContext#refresh() refreshed}.
 *
 * <p>Typically used within web applications that require some programmatic initialization
 * of the application context. For example, registering property sources or activating
 * profiles against the {@linkplain ConfigurableApplicationContext#getEnvironment()
 * context's environment}. See {@code ContextLoader} and {@code FrameworkServlet} support
 * for declaring a "contextInitializerClasses" context-param and init-param, respectively.
 *
 * <p>{@code ApplicationContextInitializer} processors are encouraged to detect
 * whether Spring's {@link org.springframework.core.Ordered Ordered} interface has been
 * implemented or if the @{@link org.springframework.core.annotation.Order Order}
 * annotation is present and to sort instances accordingly if so prior to invocation.
 *
 * @author Chris Beams
 * @since 3.1
 * @see org.springframework.web.context.ContextLoader#customizeContext
 * @see org.springframework.web.context.ContextLoader#CONTEXT_INITIALIZER_CLASSES_PARAM
 * @see org.springframework.web.servlet.FrameworkServlet#setContextInitializerClasses
 * @see org.springframework.web.servlet.FrameworkServlet#applyInitializers
 */
public interface ApplicationContextInitializer<C extends ConfigurableApplicationContext> {

	/**
	 * Initialize the given application context.
	 * @param applicationContext the application to configure
	 */
	void initialize(C applicationContext);

}
```

#### `org.springframework.context.ApplicationListener`

应用事件监听器

```java
/**
 * Interface to be implemented by application event listeners.
 * Based on the standard {@code java.util.EventListener} interface
 * for the Observer design pattern.
 *
 * <p>As of Spring 3.0, an ApplicationListener can generically declare the event type
 * that it is interested in. When registered with a Spring ApplicationContext, events
 * will be filtered accordingly, with the listener getting invoked for matching event
 * objects only.
 * 3.0后可以声明自己感兴趣的事件
 *
 * @author Rod Johnson
 * @author Juergen Hoeller
 * @param <E> the specific ApplicationEvent subclass to listen to
 * @see org.springframework.context.event.ApplicationEventMulticaster
 */
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {

	/**
	 * Handle an application event.
	 * @param event the event to respond to
	 */
	void onApplicationEvent(E event);

}
```

### Spring Boot相关

#### `org.springframework.boot.autoconfigure.EnableAutoConfiguration`

是SpringBoot自动装配的入口，`@Configuration`标注的配置类，被注册后再启动时会被SpringBoot自动装载

#### `org.springframework.boot.autoconfigure.AutoConfigurationImportFilter`

`AutoConfigurationImportSelector.selectImports`中在加载了所有配置类之后，会使用AutoConfigurationImportFilter的实现对加载的配置类进行一遍过滤，并触发AutoConfigurationImportEvent事件通知AutoConfigurationImportListener

```java
/**
 * Filter that can be registered in {@code spring.factories} to limit the
 * auto-configuration classes considered. This interface is designed to allow fast removal
 * of auto-configuration classes before their bytecode is even read.
 * <p>
 * An {@link AutoConfigurationImportFilter} may implement any of the following
 * {@link org.springframework.beans.factory.Aware Aware} interfaces, and their respective
 * methods will be called prior to {@link #match}:
 * <ul>
 * <li>{@link EnvironmentAware}</li>
 * <li>{@link BeanFactoryAware}</li>
 * <li>{@link BeanClassLoaderAware}</li>
 * <li>{@link ResourceLoaderAware}</li>
 * </ul>
 *
 * @author Phillip Webb
 * @since 1.5.0
 */
@FunctionalInterface
public interface AutoConfigurationImportFilter {

	/**
	 * Apply the filter to the given auto-configuration class candidates.
	 * @param autoConfigurationClasses the auto-configuration classes being considered.
	 * Implementations should not change the values in this array.
	 * @param autoConfigurationMetadata access to the meta-data generated by the
	 * auto-configure annotation processor
	 * @return a boolean array indicating which of the auto-configuration classes should
	 * be imported. The returned array must be the same size as the incoming
	 * {@code autoConfigurationClasses} parameter. Entries containing {@code false} will
	 * not be imported.
	 */
	boolean[] match(String[] autoConfigurationClasses,
			AutoConfigurationMetadata autoConfigurationMetadata);

}
```

#### `org.springframework.boot.autoconfigure.AutoConfigurationImportListener`

监听AutoConfigurationImportEvent事件

配置类被成功加载后，会回调这个onAutoConfigurationImportEvent方法。

然后通过实现的Aware接口获取应用上下文的相关对象（Environment、BeanFactory、BeanClassLoader、ResourceLoader）进行操作

```java
/**
 * Listener that can be registered with {@code spring.factories} to receive details of
 * imported auto-configurations.
 * <p>
 * An {@link AutoConfigurationImportListener} may implement any of the following
 * {@link org.springframework.beans.factory.Aware Aware} interfaces, and their respective
 * methods will be called prior to
 * {@link #onAutoConfigurationImportEvent(AutoConfigurationImportEvent)}:
 * <ul>
 * <li>{@link EnvironmentAware}</li>
 * <li>{@link BeanFactoryAware}</li>
 * <li>{@link BeanClassLoaderAware}</li>
 * <li>{@link ResourceLoaderAware}</li>
 * </ul>
 *
 * @author Phillip Webb
 * @since 1.5.0
 */
@FunctionalInterface
public interface AutoConfigurationImportListener extends EventListener {

	/**
	 * Handle an auto-configuration import event.
	 * @param event the event to respond to
	 */
	void onAutoConfigurationImportEvent(AutoConfigurationImportEvent event);

}
```

#### `org.springframework.boot.diagnostics.FailureAnalyzer`

失败分析器

# 关键注解和接口

## Aware

为非Component Bean 比如事件监听器、工厂类等，注入Spring应用上下文的关键对象 

* `EnvironmentAware`
* `BeanFactoryAware`
* `BeanClassLoaderAware`
* `ResourceLoaderAware`



