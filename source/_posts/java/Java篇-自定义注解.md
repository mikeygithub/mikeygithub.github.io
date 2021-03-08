---
title: Java篇-自定义注解
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/annotation-logo.png'
hide: false
date: 2018-03-08 13:49:25
category: Java
tags: 注解
---

# 简介

Java 注解（Annotation）又称 Java 标注，是 JDK5.0 引入的一种注释机制。
Java 语言中的类、方法、变量、参数和包等都可以被标注。和 Javadoc 不同，Java 标注可以通过反射获取标注内容。在编译器生成类文件时，标注可以被嵌入到字节码中。Java 虚拟机可以保留标注内容，在运行时可以获取到标注内容 。 当然它也支持自定义 Java 标注。

# 元注解

- @Retention - 标识这个注解怎么保存，是只在代码中，还是编入class文件中，或者是在运行时可以通过反射访问。

- @Documented - 标记这些注解是否包含在用户文档中。

- @Target - 标记这个注解应该是哪种 Java 成员。

- @Inherited - 标记这个注解是继承于哪个注解类(默认 注解并没有继承于任何子类)

  从 Java 7 开始，额外添加了 3 个注解:
  
- @SafeVarargs - Java 7 开始支持，忽略任何使用参数为泛型变量的方法或构造函数调用产生的警告。

- @FunctionalInterface - Java 8 开始支持，标识一个匿名函数或函数式接口。

- @Repeatable - Java 8 开始支持，标识某注解可以在同一个声明上使用多次。

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/28123151-d471f82eb2bc4812b46cc5ff3e9e6b82.jpg)

# 自定义注解

注解

```java
import java.lang.annotation.*;

@Documented
@Inherited
@Target({ ElementType.FIELD, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface Value {
    public String value() default "";
}
```

实体

```java
public class User {

    private String name;
    private String introduce;

    public String getName() {
        return name;
    }
    @Value(value = "mikey")
    public void setName(String name) {
        this.name = name;
    }

    public String getIntroduce() {
        return introduce;
    }

    @Value(value = "i am mikey")
    public void setIntroduce(String introduce) {
        this.introduce = introduce;
    }
}
```

实体工厂

```java
import java.lang.reflect.Method;

public class UserFactory {
    public static User create(){
        User user = new User();
        Method[] methods = User.class.getMethods();
        try {
            for (Method method : methods) {
                if (method.isAnnotationPresent(Value.class)){
                    Value annotation = method.getAnnotation(Value.class);
                    method.invoke(user,annotation.value());
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return user;
    }
}
```

调用

```java
public class Main {
    public static void main(String[] args) {
        User user = UserFactory.create();
        System.out.println(user.getName());
        System.out.println(user.getIntroduce());
    }
}
```

# 参考资料

[Java自定义注解](https://www.cnblogs.com/liangweiping/p/3837332.html)