---
title: 源码篇-MyBatis源码分析
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/mybatis.png'
hide: false
date: 2021-02-27 20:26:43
category: 源码分析
tags: Mybatis
---

# 基本概念


# 具体流程

```java
public class Main {
    public static void main(String[] args) throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        //构建SQLSessionFactory
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
		//打开Session
        try (SqlSession session = sqlSessionFactory.openSession()) {
            //获取Mapper
            BlogMapper mapper = session.getMapper(BlogMapper.class);
            //调用方法
            Blog blog = mapper.selectBlog(1);
        }
    }
}
```



```java
public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
    SqlSessionFactory var5;
    try {
    	//通过xpath进行解析配置文件
        XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
        //
        var5 = this.build(parser.parse());
    } catch (Exception var14) {
        throw ExceptionFactory.wrapException("Error building SqlSession.", var14);
    } finally {
        ErrorContext.instance().reset();
        try {
            inputStream.close();
        } catch (IOException var13) {
        }
    }
    return var5;
}
```



# MyBatis核心类


- SqlSessionFactory
- SqlSession
- Mapper





# 参考资料

[官网文档](https://mybatis.org/mybatis-3/)

[Mybatis架构与原理](https://www.jianshu.com/p/15781ec742f2)

[MyBatis架构设计及源代码分析系列(一):MyBatis架构](https://www.cnblogs.com/mengheng/p/3739610.html)