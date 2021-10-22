---
title: Java篇-自定义注解
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/annotation-logo.png'
hide: false
date: 2018-03-08 13:49:25
category: Java相关
tags: 注解
---

# 简介

Java 注解（Annotation）又称 Java 标注，是 JDK5.0 引入的一种注释机制。
Java 语言中的类、方法、变量、参数和包等都可以被标注。和 Javadoc 不同，Java 标注可以通过反射获取标注内容。在编译器生成类文件时，标注可以被嵌入到字节码中。Java 虚拟机可以保留标注内容，在运行时可以获取到标注内容 。 当然它也支持自定义 Java 标注。

# 元注解

- `@Retention` - 标识这个注解怎么保存，是只在代码中，还是编入class文件中，或者是在运行时可以通过反射访问。

- `@Documented` - 标记这些注解是否包含在用户文档中。

- `@Target` - 标记这个注解应该是哪种 Java 成员。

- `@Inherited` - 标记这个注解是继承于哪个注解类(默认 注解并没有继承于任何子类)

  从 Java 7 开始，额外添加了 3 个注解:
  
- `@SafeVarargs` - Java 7 开始支持，忽略任何使用参数为泛型变量的方法或构造函数调用产生的警告。

- `@FunctionalInterface` - Java 8 开始支持，标识一个匿名函数或函数式接口。

- `@Repeatable` - Java 8 开始支持，标识某注解可以在同一个声明上使用多次。

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

# 简单案例

>打印日志注解的实现

1.定义注解
```java
package com.example.annotation.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)//作用于方法
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    //注解属性
    String name()  default "";;
    String prot() default "";;
    String value() default "默认值";
}
```
2.定义切面和解析
```java
package com.example.annotation.aop;

import com.example.annotation.annotation.Log;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * 切面
 */
@Aspect // 注解声明一个切面
@Component // 受spring管理的容器
public class LogAspect {
    @Pointcut("@annotation(com.example.annotation.annotation.Log)") // 注解声明切点，注解的全限定名
    public void annotationPointcut() {
    };

    /**
     * befor
     * @param joinPoint
     */
    @Before("annotationPointcut()")
    public void before(JoinPoint joinPoint){
        MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        String name = method.getName();
        //获取方法上的注解
        Log annotation = method.getAnnotation(Log.class);
        System.out.println(name+"方法执行之前执行");
        System.out.println("name:"+annotation.name());
    }

    /**
     * after
     * @param joinPoint
     */
    @After("annotationPointcut()")
    public void after(JoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        String name = method.getName();
        //获取方法上的注解
        Log annotation = method.getAnnotation(Log.class);
        System.out.println(name+"方法执行之后执行");
        System.out.println("name:"+annotation.name());
    }
}
```
3.使用注解
```java
@RestController
public class Controller {

    @Log(name = "测试日志注解")
    @RequestMapping("/")
    public String logAnnoMethod(){
        System.out.println("Controller logAnnoMethod Method body execute...");
        return "success";
    }
}
```
4.测试使用
```java
@SpringBootApplication
@Configuration //注册被spring管理
@EnableAspectJAutoProxy //注解开启对aspectJ的支持
public class AnnotationApplication {
  public static void main(String[] args) {
    SpringApplication.run(AnnotationApplication.class, args);
  }
}
```

5.使用效果

![打印日志](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/I9fQXR4DCdtlsW8.png)

# 参考资料

[Java自定义注解](https://www.cnblogs.com/liangweiping/p/3837332.html)   


 