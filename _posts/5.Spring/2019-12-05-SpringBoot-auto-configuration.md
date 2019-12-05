---
layout: post
title: SpringBoot特性之自动装配
tags:
- SpringBoot
date: 2019-12-05 12:47:00
permalink:
categories:
description:
keywords:
---



# 注入方式演进

| 版本 | 方式                                                         | 说明                                                         |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1.2  | XML                                                          | 使用XML方式装配Spring Bean                                   |
| 2.0  | XML激活+扫描+组件注解                                        | 模式注解细分角色`@Componment`,`@Service`；<br/>自动注入`@Autowired`；<br/>根据bean名称查找依赖`@Qualifier`；<br/>SpringMVC相关注解； |
| 3.0  | `@Configuration`配置类                                       | 代替XML配置文件，`@Componment`的派生注解<br/>@Bean注入 替代`<bean/>`<br/>@DependsOn、@Primary等代替bean标签中的属性 |
| 3.0  | `@Import`和`@ImportResource`                                 | 标注在**配置类**上<br/>`@Import`导入一个或多个类作为Spring Bean<br/>`@ImportResource`引入XML配置文件 |
| 3.0  | ImportBeanDefinitionRegistrar                                | `@Import`的扩展<br/>自定义bean注册逻辑                       |
| 3.1  | ImportSelector接口                                           | `@Import`的扩展<br/>加载配置类添加选择规则<br/>4.0添加DeferredImportSelector， |
| 3.1  | `@ComponentScan`                                             | 替代`<context:component-scan>`<br/>指定扫描component包       |
| 3.1  | @EnableXXX 封装@Import                                       | 标注在@Configuration标注的配置类上<br/>@EnableXxx中封**装某个功能模块bean的引入**（不是@Configuration的派生注解，不能单独标注） |
| 3.1  | `@Profile`                                                   | 修饰模式注解<br/>根据启动时不同Profile配置，加载对应的组件Bean<br/>- `spring.profiles.active`属性<br/>- ApplicationContext.getEnvironment().setActiveProfiles(“ProfileName”) |
| 4.0  | `@SpringBootApplication`                                     | Spring Boot 1.0发布                                          |
| 4.0  | SpringApplication                                            | SpringBoot启动引导类                                         |
| 4.x  | XXXAutoConfiguration自动配置类                               | 替代@EnableXXX，不需要添加@EnableXXX注解，只用添加对应的maven依赖（在classpath下存在自动配置类依赖，并在/META-INF/spring.factories中注册）就能装载对应的配置<br/>封装了装配条件检查、装配顺序和引入bean装配等操作 |
| 4.0  | `@ConditionalXXX`标注在`@Configuration`或`@Bean`，用来控制是否装配 | **条件装配**<br/>`@ConditionalOnBean` 容器中存在Bean时装配该配置类<br/>`@ConditionalOnClass` classpath中存在指定依赖时装配改配置类<br/>自定义`@ConditionalOnXXX` |


# 自动装配

区别于之前的手动装配，从一开始的XML配置，到后来的`@Configuration`配置类，都需要编辑XML和java文件整合来实现其他模块

Spring Boot的核心思想就是**“约定大于配置”**，自动化装配就是基于这种思想产生的

## `@SpringBootApplication`

通过给启动类添加`@SpringBootApplication`注解来开启SpringBoot特性。使用`SpringApplication.run(启动类.class,args)`，既可启动SpringBoot应用

三合一注解

- `@EnableAutoConfiguration`

  激活自动装配机制，该注解会让SpringBoot根据当前项目所依赖的jar包自动配置到项目中

- `@ComponentScan`

  激活@Component扫描，默认会扫描标注`@SpringBootApplication`的启动类同级的类或者同级包下的所有标注了模式注解的类

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

### AutoConfigurationImportSelector

自动装载classpath下符合装配条件@Configuration配置类

> selectImports方法中调用SpringFactoriesLoader读取`META-INF/spring.factories`配置文件，找到需要加载的XXXAutoConfiguration实现0配置自动加载

#### selectImports

> 调用时机
>
> Springboot应用启动过程中，使用ConfigurationClassParser分析@Configuration标注的配置类时，如果发现注解中存在`@Import(ImportSelectorImpl.class)`的情况，就会创建一个相应的ImportSelector对象， 并调用其selectImports(AnnotationMetadata annotationMetadata)

```java
@Override
public String[] selectImports(AnnotationMetadata annotationMetadata) {
    if (!isEnabled(annotationMetadata)) {
        return NO_IMPORTS;
    }
    // 加载META-INF/spring-autoconfigure-metadata.properties文件
    AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader
            .loadMetadata(this.beanClassLoader);
    AnnotationAttributes attributes = getAttributes(annotationMetadata);
    // 获取所有的自动配置类（META-INF/spring.factories中配置的key为org.springframework.boot.autoconfigure.EnableAutoConfiguration的类）
    List<String> configurations = getCandidateConfigurations(annotationMetadata,
            attributes);
    configurations = removeDuplicates(configurations);
    // 需要排除的自动装配类（springboot的主类上 @SpringBootApplication(exclude = {com.demo.starter.config.DemoConfig.class})指定的排除的自动装配类）
    Set<String> exclusions = getExclusions(annotationMetadata, attributes);
    checkExcludedClasses(configurations, exclusions);
    // 将需要排除的类从 configurations remove掉
    configurations.removeAll(exclusions);
    configurations = filter(configurations, autoConfigurationMetadata);
    fireAutoConfigurationImportEvents(configurations, exclusions);
    return StringUtils.toStringArray(configurations);
}
```

### SpringFactoriesLoader

SpringFactoriesLoader属于Spring框架私有的一种扩展方案，其主要功能就是从指定的配置文件`META-INF/spring.factories`加载配置，即根据@EnableAutoConfiguration的完整类名org.springframework.boot.autoconfigure.EnableAutoConfiguration作为查找的Key，获取对应的一组配置类进行装载

> 约定大于配置思想
>
> 需要被SpringBoot自动装配的第三方依赖，开发对应的XxxAutoConfiguration，并将其注册到classpath下的/META-INF/spring.factories中，就能被SpringBoot识别并装载对应依赖

# starter

利用上述SpringBoot自动装配机制，将第三方功能作为功能模块引入到SpringBoot应用中，封装了注入细节

- 整合了功能模块需要的依赖库
- 相关参数的默认配置
- 第三方bean注入到Spring上下文

SpringBoot中将实现这种功能的项目称为starter。只用在添加对应starter依赖，不需要做额外配置，就可以从Spring容器中获取到功能模块的Bean







