---
title: 源码篇-SpringMVC源码分析
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Spring-MVC-Tutorial.png'
hide: false
date: 2021-02-27 20:26:24
category: 源码分析
tags: SpringMVC源码分析 
---

# 启动流程

> 我们都知道普通的web应用在启动过程中会优先加载web.xml文件,那么就会优先处理DispatcherServlet、ContextLoaderListener这两个类。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/applicationContext.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

那么这两个类的主要作用是什么呢？我们来看看。

- ContextLoaderListener

> 其顶层接口为ServletContextListener其规范了两个接口，销毁和初始化servlet web容器

| **Method Summary** |                                                              |
| ------------------ | ------------------------------------------------------------ |
| ` void`            | `contextDestroyed(ServletContextEvent sce)`      Notification that the servlet context is about to be shut down. |
| ` void`            | `contextInitialized(ServletContextEvent sce)`      Notification that the web application initialization process is starting. |

初始化容器

```java
public WebApplicationContext initWebApplicationContext(ServletContext servletContext) {
    //检查是否已经存在容器
   if (servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE) != null) {
      throw new IllegalStateException(
            "Cannot initialize context because there is already a root application context present - " +
            "check whether you have multiple ContextLoader* definitions in your web.xml!");
   }
    //日志准备
   servletContext.log("Initializing Spring root WebApplicationContext");
   Log logger = LogFactory.getLog(ContextLoader.class);
   if (logger.isInfoEnabled()) {
      logger.info("Root WebApplicationContext: initialization started");
   }
   long startTime = System.currentTimeMillis();
   try {
		//将上下文存储在本地实例变量中，以保证
		//它在ServletContext关闭时可用。
      if (this.context == null) {
          //创建容器
         this.context = createWebApplicationContext(servletContext);
      }
      if (this.context instanceof ConfigurableWebApplicationContext) {
         ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) this.context;
         if (!cwac.isActive()) {
			//容器尚未刷新->提供服务，例如
			//设置父上下文、设置应用程序上下文id等
            if (cwac.getParent() == null) {
				//容器实例在没有显式父级的情况下被注入->
				//确定根web应用程序上下文的父级（如果有）。
               ApplicationContext parent = loadParentContext(servletContext);
               cwac.setParent(parent);
            }
             //刷新容器(重要重要重要下面会展开)
            configureAndRefreshWebApplicationContext(cwac, servletContext);
         }
      }
      servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
		//获取当前线程的类加载器
      ClassLoader ccl = Thread.currentThread().getContextClassLoader();
      if (ccl == ContextLoader.class.getClassLoader()) {
         currentContext = this.context;//如果当前线程的类加载器是容器加载器则将容器赋值给当前线程
      }
      else if (ccl != null) {//否则将其放入池中
         currentContextPerThread.put(ccl, this.context);
      }
      if (logger.isInfoEnabled()) {
         long elapsedTime = System.currentTimeMillis() - startTime;
         logger.info("Root WebApplicationContext initialized in " + elapsedTime + " ms");
      }
      return this.context;//返回容器
   }　 catch (RuntimeException | Error ex) {
      logger.error("Context initialization failed", ex);
      servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, ex);
      throw ex;
   }
}
```

我们来看看是如何配置web容器和刷新的

```java
protected void configureAndRefreshWebApplicationContext(ConfigurableWebApplicationContext wac, ServletContext sc) {
   if (ObjectUtils.identityToString(wac).equals(wac.getId())) {
      // The application context id is still set to its original default value
      // -> assign a more useful id based on available information
      String idParam = sc.getInitParameter(CONTEXT_ID_PARAM);
      if (idParam != null) {
         wac.setId(idParam);
      }
      else {
         // Generate default id...
         wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX +
               ObjectUtils.getDisplayString(sc.getContextPath()));
      }
   }
   wac.setServletContext(sc);
   String configLocationParam = sc.getInitParameter(CONFIG_LOCATION_PARAM);
   if (configLocationParam != null) {
      wac.setConfigLocation(configLocationParam);
   }
   // The wac environment's #initPropertySources will be called in any case when the context
   // is refreshed; do it eagerly here to ensure servlet property sources are in place for
   // use in any post-processing or initialization that occurs below prior to #refresh
   ConfigurableEnvironment env = wac.getEnvironment();
   if (env instanceof ConfigurableWebEnvironment) {
      ((ConfigurableWebEnvironment) env).initPropertySources(sc, null);
   }
   customizeContext(sc, wac);
   wac.refresh();//最主要是这个方法我们下面展开看看
}
```

看是不是很眼熟，没错这就是我们在分析spring的时候的那个refresh方法

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized(this.startupShutdownMonitor) {
        this.prepareRefresh();//做一些准备工作
        ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();
        this.prepareBeanFactory(beanFactory);
        try {
            this.postProcessBeanFactory(beanFactory);
            this.invokeBeanFactoryPostProcessors(beanFactory);
            this.registerBeanPostProcessors(beanFactory);
            this.initMessageSource();
            this.initApplicationEventMulticaster();
            this.onRefresh();
            this.registerListeners();
            this.finishBeanFactoryInitialization(beanFactory);
            this.finishRefresh();
        } catch (BeansException var9) {//出现异常将容器销毁
            if (this.logger.isWarnEnabled()) {
                this.logger.warn("Exception encountered during context initialization - cancelling refresh attempt: " + var9);
            }
            this.destroyBeans();
            this.cancelRefresh(var9);
            throw var9;
        } finally {
            this.resetCommonCaches();//更新缓存
        }

    }
｝
```

# 处理流程

![处理流程图](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/20210303004623.jpg)

找了一下发现这个方法，这就是前端控制器的DispatchServlet

```java
protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {
    this.logRequest(request);
    //在包含的情况下保留请求属性的快照，
	//能够在include之后恢复原始属性。
    Map<String, Object> attributesSnapshot = null;
    if (WebUtils.isIncludeRequest(request)) {
        attributesSnapshot = new HashMap();
        Enumeration attrNames = request.getAttributeNames();
        label95:
        while(true) {
            String attrName;
            do {
                if (!attrNames.hasMoreElements()) {
                    break label95;
                }
                attrName = (String)attrNames.nextElement();
            } while(!this.cleanupAfterInclude && !attrName.startsWith("org.springframework.web.servlet"));

            attributesSnapshot.put(attrName, request.getAttribute(attrName));
        }
    }
	//使框架对象对处理程序和视图对象可用
    request.setAttribute(WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.getWebApplicationContext());
    request.setAttribute(LOCALE_RESOLVER_ATTRIBUTE, this.localeResolver);
    request.setAttribute(THEME_RESOLVER_ATTRIBUTE, this.themeResolver);
    request.setAttribute(THEME_SOURCE_ATTRIBUTE, this.getThemeSource());
    //
    if (this.flashMapManager != null) {
        FlashMap inputFlashMap = this.flashMapManager.retrieveAndUpdate(request, response);
        if (inputFlashMap != null) {
            request.setAttribute(INPUT_FLASH_MAP_ATTRIBUTE, Collections.unmodifiableMap(inputFlashMap));
        }

        request.setAttribute(OUTPUT_FLASH_MAP_ATTRIBUTE, new FlashMap());
        request.setAttribute(FLASH_MAP_MANAGER_ATTRIBUTE, this.flashMapManager);
    }

    try {
        this.doDispatch(request, response);//每个调用都要经过这个方法(重要)
    } finally {
        if (!WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted() && attributesSnapshot != null) {
            this.restoreAttributesAfterInclude(request, attributesSnapshot);
        }

    }

}
```

doDispatch的主要工作就是对请求进行划分、待处理完成后进行调用视图的解析

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
   //初始化必要对象
   HttpServletRequest processedRequest = request;
   HandlerExecutionChain mappedHandler = null;
   boolean multipartRequestParsed = false;
   WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

   try {
      ModelAndView mv = null;
      Exception dispatchException = null;
      try {
         processedRequest = checkMultipart(request);//检查是否为复杂表单
         multipartRequestParsed = (processedRequest != request);
         // 确定当前请求的处理程序。
         mappedHandler = getHandler(processedRequest);
         if (mappedHandler == null) {
            noHandlerFound(processedRequest, response);
            return;
         }
         // 确定当前请求的处理程序适配器。
         HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
         // 处理lastModified的HEAD（如果处理程序支持）。
         String method = request.getMethod();
         boolean isGet = "GET".equals(method);
         if (isGet || "HEAD".equals(method)) {
            long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
            if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
               return;
            }
         }

         if (!mappedHandler.applyPreHandle(processedRequest, response)) {
            return;
         }
         // 实际调用处理程序.
         mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

         if (asyncManager.isConcurrentHandlingStarted()) {
            return;
         }
		//应用缺省视图名称
         applyDefaultViewName(processedRequest, mv);
         //应用一些处理如拦截器
         mappedHandler.applyPostHandle(processedRequest, response, mv);
      }
      catch (Exception ex) {
         dispatchException = ex;
      }
      catch (Throwable err) {
         // As of 4.3, we're processing Errors thrown from handler methods as well,
         // making them available for @ExceptionHandler methods and other scenarios.
         dispatchException = new NestedServletException("Handler dispatch failed", err);
      }
      //渲染视图
      processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
   }
   catch (Exception ex) {
      triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
   }
   catch (Throwable err) {
      triggerAfterCompletion(processedRequest, response, mappedHandler,
            new NestedServletException("Handler processing failed", err));
   }
   finally {
      if (asyncManager.isConcurrentHandlingStarted()) {
         // Instead of postHandle and afterCompletion
         if (mappedHandler != null) {
            mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
         }
      }
      else {
         // 清理多multipart请求使用的所有资源
         if (multipartRequestParsed) {
            cleanupMultipart(processedRequest);
         }
      }
   }
}
```

# 核心类库

DispactcherServlet类

![diagram](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/diagram.png)

该类是SpringMVC的核心类、用于处理请求的枢纽

![DispactcherServlet](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/image-20210303010616423.png)



# 参考资料

[SpringMVC源码分析系列](https://www.cnblogs.com/fangjian0423/p/springMVC-directory-summary.html)
  


 