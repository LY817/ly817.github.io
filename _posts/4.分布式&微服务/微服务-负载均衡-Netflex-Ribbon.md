微服务负载均衡组件

## Ribbon组件

| 接口                       | 作用                     | 默认实现                                                     |
| -------------------------- | ------------------------ | ------------------------------------------------------------ |
| IClientConfig              | 读取配置                 | DefaultClientConfigImpl                                      |
| IRule                      | 负载均衡规则             | ZoneAvoidanceRule                                            |
| IPing                      | 筛选ping不通的实例       | DummyPing                                                    |
| `ServerList<Server>`       | 交给Ribbon选择的服务列表 | Ribbon(netflix):ConfigurationBasedServerList<br/>SpringCloud Alibaba:NAcosServerList |
| `ServerListFilter<Server>` | 服务实例过滤器           | ZonePreferenceServerListFilter                               |
| ILoaderBalancer            | Ribbon的入口             | ZoneAwareLoaderBalancer                                      |
| ServerListUpdater          | 服务列表更新策略         | PollingServerListUpdater                                     |

## 组件配置

### 使用配置类方式

以**微服务作为粒度**制定负载均衡策略

#### step 1 为服务创建Ribbon配置类

创建一个配置类放在SpringBoot根目录（能被ComponentScan扫描到）

在RibbonClient注解中指向对应的微服务和需要引入的负载均衡配置类

```java
@Configuration
@RibbonClient(name = "user-service",configuration = UserRibbonRoleConfiguration.class)
public class UserRibbonConfiguration {
  
}
```

> 这个配置类可以省略 直接在SpringBoot启动类上标记@RibbonClients注解 实现全局或者多个RibbonClient的
>
> ```java
> @SpringBootApplication
> @RibbonClients({
>         @RibbonClient("name=sparrow-ms-product"),
>         @RibbonClient("name=sparrow-ms-coupon"),
>         @RibbonClient("name=sparrow-ms-trade-log",configuration = UserRibbonRoleConfiguration.class),
> },defaultConfiguration = UserRibbonRoleConfiguration.class)
> public class OrderBootstrap {
>   
> }
> ```

#### step 2 定义对应的负载均衡配置类

在SpringBoot根目录之外创建一个配置类（不会被ComponentScan扫描到），来注入自定义的IRule实现

```java
@Configuration
public class UserRibbonRoleConfiguration {
    @Bean
    public IRule ribbonRule() {
				return new RandomRule();
    }
}
```

> 为什么不让这个注解被扫描到？  是为了让这个配置可以独立的被指定的user-service微服务的RibbonClient，如果被ComponentScan扫描，就会被所有的RibbonClient共用，达不到细粒度的配置负载均衡规则
>
> 解释这个问题，需要提到Spring中“父子上下文”的概念
>
> Spring中有多个上下文（ApplicationContext），是一个“树”状结构的层级关系，SpringBoot启动时扫描启动类所在根目录所有的`@Component`元标注的类到**主上下文**（即树状结构的根）。然后在加载其他plugin的上下文，如SpringMVC的上下文、SpringCloud的Bootstrap上下文
>
> 当RibbonClient要注入ribbonRule时会先从根上下文开始查找，如果找到了就会使用主上下文中的ribbonRule注入，ribbon子上下文中的ribbonRule会被忽略

### 使用配置文件

```yml
user-service: 
	ribbon: 
		NFLoadBalancerRuleClassName: com.netflix.loadbanancer.RandomRule
```

## 负载均衡规则

| 规则名称                  | 特点                                                         |
| ------------------------- | ------------------------------------------------------------ |
| AvailabilityFilteringRule | 过滤掉一只连接失败倍标记为circuit tripped的服务地址，并过滤掉负载搞得服务地址；或者使用一个AvailabilityPredicate来自定义过滤逻辑（根据服务的status来过滤） |
| BestAvailableRule         | 选择一个最小负载的服务地址                                   |
| RandomRule                | 随机从服务列表中选择一个服务地址                             |
| RetryRule                 | 对选定的负载均衡策略加上重试机制，在一个配置时间段内当选择的服务地址调用不成功，则一直尝试使用subRole的方式选择一个可用的服务地址 |
| RoundRobinRole            | 轮训选择，按数组下标轮训服务列表                             |
| WeightResponseTimeRule    | 根据响应时间加权，响应时间越长，权重越小，被选中的可能性越低 |
| ZoneAvoidanceRule         | 综合判断服务部署所在区域（zone）的性能与server可用性         |

