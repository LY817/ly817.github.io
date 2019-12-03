# 注入方式演进

| 版本 | 方式                                              | 说明                                                         |
| ---- | ------------------------------------------------- | ------------------------------------------------------------ |
| 1.2  | XML                                               | 使用XML方式装配Spring Bean                                   |
| 2.0  | XML激活+扫描+组件注解                             | 添加细分角色`@Componment`,`@Service`；<br/>自动注入`@Autowired`；<br/>根据bean名称查找依赖`@Qualifier`；<br/>SpringMVC相关注解； |
| 3.0  | `@Configuration`配置类                            | 代替XML配置文件<br/>@Bean注入 替代`<bean/>`<br/>@DependsOn、@Primary等代替其中的属性 |
| 3.0  | `@Import`和`@ImportResource`                      | 标注在**配置类**上<br/>`@Import`导入一个或多个类作为Spring Bean<br/>`@ImportResource`引入XML配置文件 |
| 3.1  | @EnableXxx+@Import组合使用 增加配置类导入的灵活性 | 标注在@Configuration标注的配置类上作为入口;<br/>@EnableXxx中封**装某个功能模块bean的引入** |
| 3.1  | @ComponentScan                                    | 替代`<context:component-scan>`<br/>指定扫描component包       |
| 3.1  | @Profile                                          | 修饰模式注解<br/>根据启动时不同Profile配置，加载对应的组件Bean<br/>`spring.profiles.active`属性<br/>ApplicationContext.getEnvironment().setActiveProfiles(“ProfileName”) |
| 4.0  | @XxxAutoConfiguration                             | Spring Boot 1.0发布                                          |
| 4.0  | @Conditional标注@ConditionalOnxxx                 | **条件装配**：通过实现**Conditionpring接口**，匹配context中是否满足对应注解元数据的配置，匹配通过时，@ConditionalOnxxx标注的组件会被注入 |
| 5.0  |                                                   |                                                              |



# 自动装配

区别于之前的手动装配，从一开始的XML配置，到后来的`@Configuration`配置类，都需要编辑XML和java文件整合来实现其他模块

Spring Boot的核心思想就是**“约定大于配置”**，自动化装配就是基于这种思想产生的

- 根据classpath下的依赖是否存在来加载bean
- 根据`/META-INF/spring.factories`中的配置

## `@SpringBootApplication`

通过给启动类添加`@SpringBootApplication`注解来开启SpringBoot特性。使用`SpringApplication.run(启动类.class,args)`，既可启动SpringBoot应用

三合一注解

- `@EnableAutoConfiguration`

  激活自动装配机制，该注解会让SpringBoot根据当前项目所依赖的jar包自动配置到项目中

- `@ComponentScan`

  激活@Component扫描，默认会扫描标注`@SpringBootApplication`的启动类所在目录下所有的

- `@Configuration`

  标注当前类为配置类，可以通过`@Bean`注入bean

### `@EnableAutoConfiguration`

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    ...
}
```

EnableAutoConfiguration中通过`@Import`注解引入AutoConfigurationImportSelector，用来实现auto-configuration

> `@Import`指定的类

### AutoConfigurationImportSelector

#### 加载时机

Springboot应用启动过程中使用ConfigurationClassParser分析@Configuration标注的配置类时，如果发现注解中存在`@Import(ImportSelectorImpl.class)`的情况，就会创建一个相应的ImportSelector对象， 并调用其【ImportSelector对象】方法 public String[] selectImports(AnnotationMetadata annotationMetadata), 这里 EnableAutoConfigurationImportSelector的导入@Import(EnableAutoConfigurationImportSelector.class) 就属于这种情况【发现有@import注解，那么就对该导入类进行一个实例化】,所以ConfigurationClassParser会实例化一个 EnableAutoConfigurationImportSelector 并调用它的 selectImports() 方法。

#### selectImports



入参annotationMetadata包含启动类携带的元数据（注解）

```java
@Override
public String[] selectImports(AnnotationMetadata annotationMetadata) {
    if (!isEnabled(annotationMetadata)) {
        return NO_IMPORTS;
    }
    AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader
            .loadMetadata(this.beanClassLoader);
    AnnotationAttributes attributes = getAttributes(annotationMetadata);
    //获取所有的自动配置类（META-INF/spring.factories中配置的key为org.springframework.boot.autoconfigure.EnableAutoConfiguration的类）
    List<String> configurations = getCandidateConfigurations(annotationMetadata,
            attributes);
    configurations = removeDuplicates(configurations);
    //需要排除的自动装配类（springboot的主类上 @SpringBootApplication(exclude = {com.demo.starter.config.DemoConfig.class})指定的排除的自动装配类）
    Set<String> exclusions = getExclusions(annotationMetadata, attributes);
    checkExcludedClasses(configurations, exclusions);
    //将需要排除的类从 configurations remove掉
    configurations.removeAll(exclusions);
    configurations = filter(configurations, autoConfigurationMetadata);
    fireAutoConfigurationImportEvents(configurations, exclusions);
    return StringUtils.toStringArray(configurations);
}
```

## 模式注解



## 依赖关系

### Order

实现Order接口

### 条件装配 `@Conditional`

`@ConditionalOnClass`:当目标类存在于classpath时予以装配

`@ConditionalOnMissingClass`

## starter

# 实现原理

 `spring-boot-autoconfigure`

SpringFactoriesLoader读取`META-INF/spring.factories`中的配置