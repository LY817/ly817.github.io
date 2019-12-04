## 模式注解 Stereotype Annotations

由@Component派生出来的注解，@Component作为元注解标注的注解

## 依赖关系

### Order

实现Order接口

### 条件装配 `@Conditional`

`@ConditionalOnClass`:当目标类存在于classpath时予以装配

`@ConditionalOnMissingClass`