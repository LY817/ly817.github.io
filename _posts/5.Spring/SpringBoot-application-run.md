SpringBoot应用启动流程



## `@Import`

导入配置类 三种不同的途径

> Indicates one or more {@link Configuration @Configuration} classes to import.
>
> Provides functionality equivalent to the {@code <import/>} element in Spring XML.
> Allows for importing {@code @Configuration} classes, {@link ImportSelector} and
> {@link ImportBeanDefinitionRegistrar} implementations, as well as regular component
> classes (as of 4.2; analogous to {@link AnnotationConfigApplicationContext#register}).
>
> {@code @Bean} definitions declared in imported {@code @Configuration} classes should be
> accessed by using {@link org.springframework.beans.factory.annotation.Autowired @Autowired}
> injection. Either the bean itself can be autowired, or the configuration class instance
> declaring the bean can be autowired. The latter approach allows for explicit, IDE-friendly
> navigation between {@code @Configuration} class methods.
>
> May be declared at the class level or as a meta-annotation.
>
> If XML or other non-{@code @Configuration} bean definition resources need to be
> imported, use the {@link ImportResource @ImportResource} annotation instead.

