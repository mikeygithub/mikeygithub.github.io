---
title: Java篇-Future-Task详解
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Future-Task.jpeg'
hide: false
date: 2021-04-12 00:05:01
category: Java相关
tags: Future-Task
---

# 简介

>FutureTask is base concrete implementation of Future interface and provides `asynchronous` processing. It contains the methods to start and cancel a task and also methods that can return the state of the FutureTask as whether it’s completed or cancelled.


```java
FutureTask(Callable<V> callable)
```
Creates a FutureTask that will, upon running, execute the given Callable.
```java
FutureTask(Runnable runnable, V result)
```
Creates a FutureTask that will, upon running, execute the given Runnable, and arrange that get will return the given result on successful completion.

类图

![image-20210418142037763](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/image-20210418142037763.png)

对应的相关方法和属性

![image-20210418142238155](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/image-20210418142238155.png)

运行状态

```java
/**
 * The run state of this task, initially NEW.  The run state
 * transitions to a terminal state only in methods set,
 * setException, and cancel.  During completion, state may take on
 * transient values of COMPLETING (while outcome is being set) or
 * INTERRUPTING (only while interrupting the runner to satisfy a
 * cancel(true)). Transitions from these intermediate to final
 * states use cheaper ordered/lazy writes because values are unique
 * and cannot be further modified.
 *
 * Possible state transitions:
 * NEW -> COMPLETING -> NORMAL
 * NEW -> COMPLETING -> EXCEPTIONAL
 * NEW -> CANCELLED
 * NEW -> INTERRUPTING -> INTERRUPTED
 */
private volatile int state;
private static final int NEW          = 0;
private static final int COMPLETING   = 1;
private static final int NORMAL       = 2;
private static final int EXCEPTIONAL  = 3;
private static final int CANCELLED    = 4;
private static final int INTERRUPTING = 5;
private static final int INTERRUPTED  = 6;
```

底层RUN方法

```java
public void run() {
    if (state != NEW ||!UNSAFE.compareAndSwapObject(this, runnerOffset,null, Thread.currentThread()))return;
    try {
        Callable<V> c = callable;
        if (c != null && state == NEW) {
            V result;
            boolean ran;
            try {
                result = c.call();
                ran = true;
            } catch (Throwable ex) {
                result = null;
                ran = false;
                setException(ex);
            }
            if (ran)
                set(result);
        }
    } finally {
        // runner must be non-null until state is settled to
        // prevent concurrent calls to run()
        runner = null;
        // state must be re-read after nulling runner to prevent
        // leaked interrupts
        int s = state;
        if (s >= INTERRUPTING)
            handlePossibleCancellationInterrupt(s);
    }
}
```



# 案例

```java
class Caculator implements Callable<String>{

    public String call() throws Exception {

        Thread.sleep(2000);

        System.out.println("当前系统时间："+System.currentTimeMillis());

        return Thread.currentThread().getName()+" "+System.currentTimeMillis();
    }
}

public class Main {

    public static void main(String[] args) throws ExecutionException, InterruptedException {

        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(3, 5, 200, TimeUnit.MICROSECONDS, new LinkedBlockingQueue<Runnable>(30));

        for (int i = 0; i < 10; i++) {

            FutureTask futureTask = new FutureTask(new Caculator());

            threadPoolExecutor.submit(futureTask);

        }

        threadPoolExecutor.shutdown();
    }
}
```


# 参考

[JDK1.7 FutureTask](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/FutureTask.html)   


 