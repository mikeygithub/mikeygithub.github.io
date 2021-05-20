---
title: 源码篇-MyBatis源码分析
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/mybatis.png'
hide: false
date: 2021-02-27 20:26:43
category: 源码分析
tags: Mybatis
---

# 先上代码

```java
public class Main {
    public static void main(String[] args) throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        try (SqlSession session = sqlSessionFactory.openSession()) {
            BlogMapper mapper = session.getMapper(BlogMapper.class);
            Blog blog = mapper.selectBlog(1);
            System.out.println(blog);
        }
    }
}
```


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

## 构建SQLSessionFactory

先看看顶层接口SqlSessionFactory，主要制定了获取Session的一些规范。

```java
public interface SqlSessionFactory {
    SqlSession openSession();
    SqlSession openSession(boolean var1);
    SqlSession openSession(Connection var1);
    SqlSession openSession(TransactionIsolationLevel var1);
    SqlSession openSession(ExecutorType var1);
    SqlSession openSession(ExecutorType var1, boolean var2);
    SqlSession openSession(ExecutorType var1, TransactionIsolationLevel var2);
    SqlSession openSession(ExecutorType var1, Connection var2);
    Configuration getConfiguration();
}
```

构建SQLSessionFactory

```java
public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
    SqlSessionFactory var5;
    try {
    	//通过xpath进行解析配置文件
        XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
        //这里就是负责解析构建SQLSessionFactory的地方
        var5 = this.build(parser.parse());
    } catch (Exception var14) {
        throw ExceptionFactory.wrapException("Error building SqlSession.", var14);
    } finally {
        ErrorContext.instance().reset();//释放一些资源处理
        try {
            inputStream.close();
        } catch (IOException var13) {
        }
    }
    return var5;
}
```

build方法主要通过读取的配置类和

```java
public SqlSessionFactory build(Configuration config) {
    return new DefaultSqlSessionFactory(config);
}
```

Configuration是从配置文件中读取的配置和一些缺省配置

```java
public Configuration() {
    this.safeResultHandlerEnabled = true;
    this.multipleResultSetsEnabled = true;
    this.useColumnLabel = true;
    this.cacheEnabled = true;
    this.useActualParamName = true;
    this.localCacheScope = LocalCacheScope.SESSION;
    this.jdbcTypeForNull = JdbcType.OTHER;
    this.lazyLoadTriggerMethods = new HashSet(Arrays.asList("equals", "clone", "hashCode", "toString"));
    this.defaultExecutorType = ExecutorType.SIMPLE;
    this.autoMappingBehavior = AutoMappingBehavior.PARTIAL;
    this.autoMappingUnknownColumnBehavior = AutoMappingUnknownColumnBehavior.NONE;
    this.variables = new Properties();
    this.reflectorFactory = new DefaultReflectorFactory();
    this.objectFactory = new DefaultObjectFactory();
    this.objectWrapperFactory = new DefaultObjectWrapperFactory();
    this.lazyLoadingEnabled = false;
    this.proxyFactory = new JavassistProxyFactory();
    this.mapperRegistry = new MapperRegistry(this);
    this.interceptorChain = new InterceptorChain();
    this.typeHandlerRegistry = new TypeHandlerRegistry(this);
    this.typeAliasRegistry = new TypeAliasRegistry();
    this.languageRegistry = new LanguageDriverRegistry();
    this.mappedStatements = (new Configuration.StrictMap("Mapped Statements collection")).conflictMessageProducer((savedValue, targetValue) -> {
        return ". please check " + savedValue.getResource() + " and " + targetValue.getResource();
    });
    this.caches = new Configuration.StrictMap("Caches collection");
    this.resultMaps = new Configuration.StrictMap("Result Maps collection");
    this.parameterMaps = new Configuration.StrictMap("Parameter Maps collection");
    this.keyGenerators = new Configuration.StrictMap("Key Generators collection");
    this.loadedResources = new HashSet();
    this.sqlFragments = new Configuration.StrictMap("XML fragments parsed from previous mappers");
    this.incompleteStatements = new LinkedList();
    this.incompleteCacheRefs = new LinkedList();
    this.incompleteResultMaps = new LinkedList();
    this.incompleteMethods = new LinkedList();
    this.cacheRefMap = new HashMap();
    this.typeAliasRegistry.registerAlias("JDBC", JdbcTransactionFactory.class);
    this.typeAliasRegistry.registerAlias("MANAGED", ManagedTransactionFactory.class);
    this.typeAliasRegistry.registerAlias("JNDI", JndiDataSourceFactory.class);
    this.typeAliasRegistry.registerAlias("POOLED", PooledDataSourceFactory.class);
    this.typeAliasRegistry.registerAlias("UNPOOLED", UnpooledDataSourceFactory.class);
    this.typeAliasRegistry.registerAlias("PERPETUAL", PerpetualCache.class);
    this.typeAliasRegistry.registerAlias("FIFO", FifoCache.class);
    this.typeAliasRegistry.registerAlias("LRU", LruCache.class);
    this.typeAliasRegistry.registerAlias("SOFT", SoftCache.class);
    this.typeAliasRegistry.registerAlias("WEAK", WeakCache.class);
    this.typeAliasRegistry.registerAlias("DB_VENDOR", VendorDatabaseIdProvider.class);
    this.typeAliasRegistry.registerAlias("XML", XMLLanguageDriver.class);
    this.typeAliasRegistry.registerAlias("RAW", RawLanguageDriver.class);
    this.typeAliasRegistry.registerAlias("SLF4J", Slf4jImpl.class);
    this.typeAliasRegistry.registerAlias("COMMONS_LOGGING", JakartaCommonsLoggingImpl.class);
    this.typeAliasRegistry.registerAlias("LOG4J", Log4jImpl.class);
    this.typeAliasRegistry.registerAlias("LOG4J2", Log4j2Impl.class);
    this.typeAliasRegistry.registerAlias("JDK_LOGGING", Jdk14LoggingImpl.class);
    this.typeAliasRegistry.registerAlias("STDOUT_LOGGING", StdOutImpl.class);
    this.typeAliasRegistry.registerAlias("NO_LOGGING", NoLoggingImpl.class);
    this.typeAliasRegistry.registerAlias("CGLIB", CglibProxyFactory.class);
    this.typeAliasRegistry.registerAlias("JAVASSIST", JavassistProxyFactory.class);
    this.languageRegistry.setDefaultDriverClass(XMLLanguageDriver.class);
    this.languageRegistry.register(RawLanguageDriver.class);
}
```

## 打开Session

```java
private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
    //定义相关对象
    Transaction tx = null;
    DefaultSqlSession var8;
    try {
        //从配置中获取环境信息
        Environment environment = this.configuration.getEnvironment();
        //获取TransactionFactory
        TransactionFactory transactionFactory = this.getTransactionFactoryFromEnvironment(environment);
        //根据数据源、事物隔离级别、是否自动提交
        //JdbcTransaction
        tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);
        //创建执行器SIMPLE, REUSE, BATCH三种，省缺SIMPLE
        Executor executor = this.configuration.newExecutor(tx, execType);
        //构造最终SqlSession
        var8 = new DefaultSqlSession(this.configuration, executor, autoCommit);
    } catch (Exception var12) {
        this.closeTransaction(tx);
        throw ExceptionFactory.wrapException("Error opening session.  Cause: " + var12, var12);
    } finally {
        ErrorContext.instance().reset();
    }
    return var8;
}
```

## 获取Mapper

```java
public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
    //获取MapperProxyFactory
  final MapperProxyFactory<T> mapperProxyFactory = (MapperProxyFactory<T>) knownMappers.get(type);
    //在上面方法中绑定其java和数据库对应的类型
  if (mapperProxyFactory == null) {
    throw new BindingException("Type " + type + " is not known to the MapperRegistry.");
  }
  try {
      //通过动态代理将其Mapper返回
    return mapperProxyFactory.newInstance(sqlSession);
  } catch (Exception e) {
    throw new BindingException("Error getting mapper instance. Cause: " + e, e);
  }
}
```

java动态代理

```java
protected T newInstance(MapperProxy<T> mapperProxy) {
  return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[] { mapperInterface }, mapperProxy);
}
```

## 调用方法

通过代理进行调用方法

```java
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
  try {
      //检查当前类是否已经声明
    if (Object.class.equals(method.getDeclaringClass())) {
      return method.invoke(this, args);//返回其调用结果
    } else {
        //在缓存中调用
      return cachedInvoker(method).invoke(proxy, method, args, sqlSession);
    }
  } catch (Throwable t) {
    throw ExceptionUtil.unwrapThrowable(t);
  }
}
```

调用cachedInvoker方法

```java
private MapperMethodInvoker cachedInvoker(Method method) throws Throwable {
  try {
    // A workaround for https://bugs.openjdk.java.net/browse/JDK-8161372
    // It should be removed once the fix is backported to Java 8 or
    // MyBatis drops Java 8 support. See gh-1929
    MapperMethodInvoker invoker = methodCache.get(method);
    if (invoker != null) {
      return invoker;
    }
    return methodCache.computeIfAbsent(method, m -> {
      if (m.isDefault()) {
        try {
          if (privateLookupInMethod == null) {
            return new DefaultMethodInvoker(getMethodHandleJava8(method));
          } else {
            return new DefaultMethodInvoker(getMethodHandleJava9(method));
          }
        } catch (IllegalAccessException | InstantiationException | InvocationTargetException
            | NoSuchMethodException e) {
          throw new RuntimeException(e);
        }
      } else {
        return new PlainMethodInvoker(new MapperMethod(mapperInterface, method, sqlSession.getConfiguration()));
      }
    });
  } catch (RuntimeException re) {
    Throwable cause = re.getCause();
    throw cause == null ? re : cause;
  }
}
```

构建Statement对象

```java
private MappedStatement resolveMappedStatement(Class<?> mapperInterface, String methodName,
    Class<?> declaringClass, Configuration configuration) {
    //看见没有这里进行接口全类名和方法名的拼接了
  String statementId = mapperInterface.getName() + "." + methodName;
  if (configuration.hasStatement(statementId)) {//如果已经存在
      //返回其Statement对象
    return configuration.getMappedStatement(statementId);
  } else if (mapperInterface.equals(declaringClass)) {
    return null;
  }
  for (Class<?> superInterface : mapperInterface.getInterfaces()) {//进行遍历
    if (declaringClass.isAssignableFrom(superInterface)) {
      MappedStatement ms = resolveMappedStatement(superInterface, methodName,
          declaringClass, configuration);
      if (ms != null) {
        return ms;
      }
    }
  }
  return null;
}
```

对其参数进行解析

```java
public ParamNameResolver(Configuration config, Method method) {
  this.useActualParamName = config.isUseActualParamName();
  final Class<?>[] paramTypes = method.getParameterTypes();
  final Annotation[][] paramAnnotations = method.getParameterAnnotations();
  final SortedMap<Integer, String> map = new TreeMap<>();
  int paramCount = paramAnnotations.length;
  // get names from @Param annotations
  for (int paramIndex = 0; paramIndex < paramCount; paramIndex++) {
    if (isSpecialParameter(paramTypes[paramIndex])) {
      // skip special parameters
      continue;
    }
    String name = null;
    for (Annotation annotation : paramAnnotations[paramIndex]) {
      if (annotation instanceof Param) {
        hasParamAnnotation = true;
        name = ((Param) annotation).value();
        break;
      }
    }
    if (name == null) {
      // @Param was not specified.
      if (useActualParamName) {
        name = getActualParamName(method, paramIndex);
      }
      if (name == null) {
        // use the parameter index as the name ("0", "1", ...)
        // gcode issue #71
        name = String.valueOf(map.size());
      }
    }
    map.put(paramIndex, name);
  }
  names = Collections.unmodifiableSortedMap(map);
}
```

没错，就是这个`execute`方法

```java
public Object execute(SqlSession sqlSession, Object[] args) {
  Object result;
  switch (command.getType()) {
    case INSERT: {
      Object param = method.convertArgsToSqlCommandParam(args);
      result = rowCountResult(sqlSession.insert(command.getName(), param));
      break;
    }
    case UPDATE: {
      Object param = method.convertArgsToSqlCommandParam(args);
      result = rowCountResult(sqlSession.update(command.getName(), param));
      break;
    }
    case DELETE: {
      Object param = method.convertArgsToSqlCommandParam(args);
      result = rowCountResult(sqlSession.delete(command.getName(), param));
      break;
    }
    case SELECT:
      if (method.returnsVoid() && method.hasResultHandler()) {
        executeWithResultHandler(sqlSession, args);
        result = null;
      } else if (method.returnsMany()) {
        result = executeForMany(sqlSession, args);
      } else if (method.returnsMap()) {
        result = executeForMap(sqlSession, args);
      } else if (method.returnsCursor()) {
        result = executeForCursor(sqlSession, args);
      } else {
          //转换数据类型
        Object param = method.convertArgsToSqlCommandParam(args);
        result = sqlSession.selectOne(command.getName(), param);
        if (method.returnsOptional()
            && (result == null || !method.getReturnType().equals(result.getClass()))) {
          result = Optional.ofNullable(result);
        }
      }
      break;
    case FLUSH:
      result = sqlSession.flushStatements();
      break;
    default:
      throw new BindingException("Unknown execution method for: " + command.getName());
  }
  if (result == null && method.getReturnType().isPrimitive() && !method.returnsVoid()) {
    throw new BindingException("Mapper method '" + command.getName()
        + " attempted to return null from a method with a primitive return type (" + method.getReturnType() + ").");
  }
  return result;
}
```

调用查询方法

```java
public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
  try {
    MappedStatement ms = configuration.getMappedStatement(statement);
    return executor.query(ms, wrapCollection(parameter), rowBounds, Executor.NO_RESULT_HANDLER);
  } catch (Exception e) {
    throw ExceptionFactory.wrapException("Error querying database.  Cause: " + e, e);
  } finally {
    ErrorContext.instance().reset();
  }
}
```

底层查询方法

```java
@Override
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException {
  BoundSql boundSql = ms.getBoundSql(parameter);
  CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
  return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
}

@SuppressWarnings("unchecked")
@Override
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
  ErrorContext.instance().resource(ms.getResource()).activity("executing a query").object(ms.getId());
  if (closed) {
    throw new ExecutorException("Executor was closed.");
  }
  if (queryStack == 0 && ms.isFlushCacheRequired()) {
    clearLocalCache();
  }
  List<E> list;
  try {
    queryStack++;
    list = resultHandler == null ? (List<E>) localCache.getObject(key) : null;
    if (list != null) {
      handleLocallyCachedOutputParameters(ms, key, parameter, boundSql);
    } else {
        //真正进行查询
      list = queryFromDatabase(ms, parameter, rowBounds, resultHandler, key, boundSql);
    }
  } finally {
    queryStack--;
  }
  if (queryStack == 0) {
    for (DeferredLoad deferredLoad : deferredLoads) {
      deferredLoad.load();
    }
    // issue #601
    deferredLoads.clear();
    if (configuration.getLocalCacheScope() == LocalCacheScope.STATEMENT) {//判断是否清理缓存
      // issue #482
      clearLocalCache();
    }
  }
  return list;
```

继续点开看，是不是和JDBC有点像

```java
public <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException {
  String sql = boundSql.getSql();
  statement.execute(sql);
  return resultSetHandler.handleResultSets(statement);
}
```

处理查询到的结构集

```java
public List<Object> handleResultSets(Statement stmt) throws SQLException {
  ErrorContext.instance().activity("handling results").object(mappedStatement.getId());

  final List<Object> multipleResults = new ArrayList<>();

  int resultSetCount = 0;
  ResultSetWrapper rsw = getFirstResultSet(stmt);

  List<ResultMap> resultMaps = mappedStatement.getResultMaps();
  int resultMapCount = resultMaps.size();
  validateResultMapsCount(rsw, resultMapCount);
  while (rsw != null && resultMapCount > resultSetCount) {
    ResultMap resultMap = resultMaps.get(resultSetCount);
    handleResultSet(rsw, resultMap, multipleResults, null);
    rsw = getNextResultSet(stmt);
    cleanUpAfterHandlingResultSet();
    resultSetCount++;
  }

  String[] resultSets = mappedStatement.getResultSets();
  if (resultSets != null) {
    while (rsw != null && resultSetCount < resultSets.length) {
      ResultMapping parentMapping = nextResultMaps.get(resultSets[resultSetCount]);
      if (parentMapping != null) {
        String nestedResultMapId = parentMapping.getNestedResultMapId();
        ResultMap resultMap = configuration.getResultMap(nestedResultMapId);
        handleResultSet(rsw, resultMap, null, parentMapping);
      }
      rsw = getNextResultSet(stmt);
      cleanUpAfterHandlingResultSet();
      resultSetCount++;
    }
  }

  return collapseSingleResultList(multipleResults);
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


 