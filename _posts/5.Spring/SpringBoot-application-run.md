# 应用启动流程

## 启动方式

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

Fluent Builder API

```java
new SpringApplicationBuilder(DiveInSpringBootApplication.class)
.bannerMode(Banner.Mode.CONSOLE)
.web(WebApplicationType.NONE)
.profiles("prod")
.headless(true)
.run(args);
```

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
    setInitializers((Collection) getSpringFactoriesInstances(
        ApplicationContextInitializer.class));
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
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

@EnableAutoConfiguration注解引入了`@Import(AutoConfigurationImportSelector.class)`

实现Bean的自动装配，会扫描classpath下所有的spring.factories下，`org.springframework.boot.autoconfigure.EnableAutoConfiguration`键对应的值作为配置类加载

#### @SpringBootConfiguration 自身作为配置类

启动类中使用@Bean注入bean

#### @ComponentScan

扫描启动类所在包 同级和下级所有被@Component派生的模式注解标注的类

#### 其他引入方式

##### `@EnableXXX`

@Import引入的配置类或者配置选择器（实现`ImportSelector`接口）

##### `@ImportResource`

通过ImportResource引入的xml配置文件

## 准备阶段