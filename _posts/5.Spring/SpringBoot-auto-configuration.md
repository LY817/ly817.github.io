# 注入方式演进

| 版本 | 方式                                               | 说明                                                         |
| ---- | -------------------------------------------------- | ------------------------------------------------------------ |
| 1.2  | XML                                                | 使用XML方式装配Spring Bean                                   |
| 2.0  | XML激活+扫描+组件注解                              | 添加细分角色`@Componment`,`@Service`；<br/>自动注入`@Autowired`；<br/>根据bean名称查找依赖`@Qualifier`；<br/>SpringMVC相关注解； |
| 3.0  | `@Configuration`                                   | 代替XML配置文件，提供一些模板（继承xxxConfigurationSupport），通过方法@Bean注入 |
| 3.1  | @EnableXxx和@Import组合使用 增加配置类导入的灵活性 | 标注在@Configuration标注的配置类上作为入口;使用元注解`@Import`，引入自定义的选择逻辑（实现ImportSelector接口），根据不同的模式（环境）返回不同的配置类 |
| 4.0  | @XxxAutoConfiguration                              | Spring Boot 1.0发布                                          |
| 3.1  | @Profile                                           | 根据启动时不同Profile配置，加载profile对应的组件             |
| 4.0  | @Conditional标注@ConditionalOnxxx                  | 条件装配：通过实现**Condition接口**，匹配context中是否满足对应注解元数据的配置，匹配通过时，@ConditionalOnxxx标注的组件会被注入 |



# 自动装配

区别于之前的手动装配，从一开始的XML配置，到后来的`@Configuration`配置类，都需要编辑XML和java文件整合来实现其他模块

Spring Boot的核心思想就是**“约定大于配置”**，自动化装配就是基于这种思想产生的，根据classpath下

## `@SpringBootApplication`

三合一注解

- `@EnableAutoConfiguration`

  激活自动装配机制

- `@ComponentScan`

  激活@Component扫描

- `@Configuration`

  标注当前类为配置类，可以通过`@Bean`注入bean

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