---
title: 笔记篇-Knife4j入门使用
date: 2020-03-21 01:42:54
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/knife4j.jpeg
category: 学习笔记
tags: 接口文档
---

## knife4j简介

前身:swagger-bootstrap-ui

### swagger简介

>Swagger是一个API接口管理工具，支持在线测试接口数据，根据配置自动生成API文档，结合spring mvc而提供界面化方法文档的一个开源框架。

Swagger主要的项目
Swagger是一组开源项目，主要项目如下：

- Swagger-tools:提供各种与Swagger进行集成和交互的工具。例如模式检验、Swagger 1.2文档转换成Swagger 2.0文档等功能。
- Swagger-core: 用于Java/Scala的的Swagger实现。与JAX-RS(Jersey、Resteasy、CXF…)、Servlets和Play框架进行集成。
- Swagger-js: 用于JavaScript的Swagger实现。
- Swagger-node-express: Swagger模块，用于node.js的Express web应用框架。
- Swagger-ui：一个无依赖的HTML、JS和CSS集合，可以为Swagger兼容API动态生成优雅文档。
- Swagger-codegen：一个模板驱动引擎，通过分析用户Swagger资源声明以各种语言生成客户端代码。
- Swagger-editor：可让使用者在浏览器里以YAML格式编辑Swagger API规范并实时预览文档。可以生成有效的Swagger JSON描述，并用于所有Swagger工具（代码生成、文档等等）中。

### Swagger-Bootstrap-UI简介

>Swagger-Bootstrap-UI是springfox-swagger的增强UI实现，为Java开发者在使用Swagger的时候，能拥有一份简洁、强大的接口文档体验。

## knife4j特点

文档说明：根据Swagger的规范说明，详细列出接口文档的说明，包括接口地址、类型、请求示例、请求参数、响应示例、响应参数、响应码等信息，使用swagger-bootstrap-ui能根据该文档说明，对该接口的使用情况一目了然。

在线调试：提供在线接口联调的强大功能，自动解析当前接口参数,同时包含表单验证，调用参数可返回接口响应内容、headers、Curl请求命令实例、响应时间、响应状态码等信息，帮助开发者在线调试，而不必通过其他测试工具测试接口是否正确,简介、强大。

## knife4j使用

1.创建springboot项目

2.添加依赖

```text
<dependencies>
    <dependency>
        <groupId>com.github.xiaoymin</groupId>
        <artifactId>knife4j-spring-boot-starter</artifactId>
        <!--在引用时请在maven中央仓库搜索最新版本号-->
        <version>2.0.2</version>
    </dependency>
</dependencies>
```

3.配置类
````java
@Configuration
@EnableSwagger2
@EnableKnife4j
@Import(BeanValidatorPluginsConfiguration.class)
public class SwaggerConfiguration {
 
    @Bean(value = "defaultApi2")
    public Docket defaultApi2() {
        Docket docket=new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                //分组名称
                .groupName("2.X版本")
                .select()
                //这里指定Controller扫描包路径
                .apis(RequestHandlerSelectors.basePackage("com.swagger.bootstrap.ui.demo.new2"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }
    
　　private ApiInfo apiInfo() {
   　　 return new ApiInfoBuilder()
      　　  .title("大学生专业学科竞赛项目过程管理系统")
        　　.description("大学生专业学科竞赛项目过程管理系统t文档")
        　　.termsOfServiceUrl("")
        　　.version("3.0.0")
        　　.build();
　　}
}
````
注解说明

`@EnableSwagger2`

该注解是Springfox-swagger框架提供的使用Swagger注解，该注解必须加

`@EnableKnife4j`

该注解是knife4j提供的增强注解,Ui提供了例如动态参数、参数过滤、接口排序等增强功能,如果你想使用这些增强功能就必须加该注解，否则可以不用加

4.访问

在浏览器输入地址：`http://[you_host]:[you_port]/doc.html`

 

 ![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/knife4j-1.png)

 

## knife4j资料

[文档](https://doc.xiaominfo.com/guide/useful.html)

[示例](https://gitee.com/xiaoym/swagger-bootstrap-ui-demo)

[博文](https://www.cnblogs.com/fby698/p/11581845.html)
  


 
