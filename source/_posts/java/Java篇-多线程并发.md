---
title: Java篇-多线程并发
date: 2020-05-30 12:29:53
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/many_thread.jpeg
category: Java相关
tags: Thread
---

# Java 并发知识库

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/thread.png)

# Java线程实现/创建方式

## 继承Thread
>Thread类本质上是实现了`Runnable`接口的一个实例，代表一个线程的实例。启动线程的唯一方法就是通过`Thread`类的`start`实例方法。start方法是一个native方法，它将启动一个新的线程，并执行run()方法。

```java
public class MyThread extends Thread {
    public void run() {
        System.out.println("MyThread.run()");
    }
}

MyThread myThread = new MyThread();

myThread.start();
```

## 实现Runnable接口
>实现Runnable接口

如果自己的类已经extends另一个类，就无法直接extends Thread此时，可以实现一个Runnable接口。
```java
public class MyThread extends OtherClass implements Runnable {
    public void run () {
        System.out.println("MyThread.run()");
    }
}

//启动 MyThread,需要首先实例化一个 Thread,并传入自己的 MyThread 实例:

MyThread myThread = new MyThread();
Thread thread = new Thread(myThread);
thread.start();

//事实上,当传入一个 Runnable target 参数给 Thread 后,Thread 的 run()方法就会调用
target.run()

public void run() {
    if (target != null) {
        target.run();
    }
}
```
## 执行器方式
>有返回值的任务必须实现 Callable 接口,类似的,无返回值的任务必须 Runnable 接口。执行Callable 任务后,可以获取一个 Future 的对象,在该对象上调用 get 就可以获取到 Callable 任务返回的 Object 了,再结合线程池接口 ExecutorService 就可以实现传说中有返回结果的多线程了。


```java
//创建一个线程池
ExecutorService pool = Executors.newFixedThreadPool(taskSize);
// 创建多个有返回值的任务
List<Future> list = new ArrayList<Future>();
for (int i = 0; i < taskSize; i++) {
Callable c = new MyCallable(i + " ");
// 执行任务并获取 Future 对象
Future f = pool.submit(c);
list.add(f);
}
// 关闭线程池
pool.shutdown();
// 获取所有并发任务的运行结果
for (Future f : list) {
// 从 Future 对象上获取任务的返回值,并输出到控制台
System.out.println("res:" + f.get().toString());
}
```
## 线程池方式
>线程和数据库连接这些资源都是非常宝贵的资源。那么每次需要的时候创建,不需要的时候销毁,是非常浪费资源的。那么我们就可以使用缓存的策略,也就是使用线程池。

```java
// 创建线程池
ExecutorService threadPool = Executors.newFixedThreadPool(10);
while(true) {
    threadPool.execute(new Runnable() { // 提交多个线程任务,并执行
        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " is running ..");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
       }
    });
}
```

### 4种线程池
>Java 里面线程池的顶级接口是 Executor,但是严格意义上讲 Executor 并不是一个线程池,而只是一个执行线程的工具。真正的线程池接口是 ExecutorService。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/threadpool.png)

- NewCachedThreadPool
>创建一个可根据需要创建新线程的线程池，但是在以前构造的线程可用时将重用他们。对于执行很多短期异步任务的程序而言，这些线程池通常可提高程序性能
`调用 execute 将重用以前构造
 的线程(如果线程可用)。如果现有线程没有可用的,则创建一个新线程并添加到池中。终止并
 从缓存中移除那些已有 60 秒钟未被使用的线程。`因此,长时间保持空闲的线程池不会使用任何资源。
 
 
- newFixedThreadPool

>创建一个可重用固定线程数的线程池,以共享的无界队列方式来运行这些线程。在任意点,在大
 多数 nThreads 线程会处于处理任务的活动状态。如果在所有线程处于活动状态时提交附加任务,
 则在有可用线程之前,附加任务将在队列中等待。如果在关闭前的执行期间由于失败而导致任何
 线程终止,那么一个新线程将代替它执行后续的任务(如果需要)。在某个线程被显式地关闭之
 前,池中的线程将一直存在。
 
- newScheduledThreadPool

>创建一个线程池,它可安排在给定延迟后运行命令或者定期地执行。
 
```java
public class ThreadPool {

    public static void main(String[] args) {

        ScheduledExecutorService scheduledThreadPool= Executors.newScheduledThreadPool(3);
        scheduledThreadPool.schedule(new Runnable(){
            @Override
            public void run() {
                System.out.println("延迟三秒");
            }
        }, 3, TimeUnit.SECONDS);
        scheduledThreadPool.scheduleAtFixedRate(new Runnable(){
            @Override
            public void run() {
                System.out.println("延迟 1 秒后每三秒执行一次");
            }
        },1,3,TimeUnit.SECONDS);

    }

}

```
 
 
- newSingleThreadExecutor

>Executors.newSingleThreadExecutor()返回一个线程池(这个线程池只有一个线程),这个线程池可以在线程死后(或发生异常时)重新启动一个线程来替代原来的线程继续执行下去!
 
 
# 线程生命周期(状态)

>当线程被创建并启动以后,它既不是一启动就进入了执行状态,也不是一直处于执行状态。在线程的生命周期中,它要经过新建(New)、就绪(Runnable)、运行(Running)、阻塞(Blocked)和死亡(Dead)5 种状态。尤其是当线程启动以后,它不可能一直"霸占"着 CPU 独自运行,所以 CPU 需要在多条线程之间切换,于是线程状态也会多次在运行、阻塞之间切换
 
 - 新建状态(NEW)
   当程序使用 new 关键字创建了一个线程之后,该线程就处于新建状态,此时仅由 JVM 为其分配
   内存,并初始化其成员变量的值
   
 - 就绪状态(RUNNABLE):
   当线程对象调用了 start()方法之后,该线程处于就绪状态。Java 虚拟机会为其创建方法调用栈和
   程序计数器,等待调度运行。
   
 - 运行状态(RUNNING):
   如果处于就绪状态的线程获得了 CPU,开始执行 run()方法的线程执行体,则该线程处于运行状
   态。
 
 - 阻塞状态(BLOCKED):
   阻塞状态是指线程因为某种原因放弃了 cpu 使用权,也即让出了 cpu timeslice,暂时停止运行。
   直到线程进入可运行(runnable)状态,才有机会再次获得 cpu timeslice 转到运行(running)状
   态。阻塞的情况分三种:
   
   - 等待阻塞( o.wait-> 等待对列):
        运行(running)的线程执行 o.wait()方法,JVM 会把该线程放入等待队列(waitting queue)中。
   - 同步阻塞 (lock-> 锁池 )
        运行(running)的线程在获取对象的同步锁时,若该同步锁被别的线程占用,则 JVM 会把该线
   - 程放入锁池(lock pool)中。
   
   其他阻塞 (sleep/join)
        - 运行(running)的线程执行 Thread.sleep(long ms)或 t.join()方法,或者发出了 I/O 请求时,JVM 会把该线程置为阻塞状态。当 sleep()状态超时、join()等待线程终止或者超时、或者 I/O处理完毕时,线程重新转入可运行(runnable)状态。
 
 - 线程死亡(DEAD)
   线程会以下面三种方式结束,结束后就是死亡状态。
   
   *正常结束*  
   >1.run()或 call()方法执行完成,线程正常结束。
   
   *异常结束*
   >2.线程抛出一个未捕获的 Exception 或 Error。
   
   *调用 stop*
   >3.直接调用该线程的 stop()方法来结束该线程—该方法通常容易导致死锁,不推荐使用。
 
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/QQ图片20200610172044.png)
 
 
 ## 终止线程 4 种方式
 
 - 正常运行结束
 >程序运行结束,线程自动结束。
 
 - 使用退出标志退出线程
 >一般 run()方法执行完,线程就会正常结束,然而,常常有些线程是伺服线程。它们需要长时间的运行,只有在外部某些条件满足的情况下,才能关闭这些线程。使用一个变量来控制循环,例如:最直接的方法就是设一个 boolean 类型的标志,并通过设置这个标志为 true 或 false 来控制 while
 循环是否退出,代码示例:
 
 ```java
public class ThreadSafe extends Thread {
    
    public volatile boolean exit = false;
    
    public void run() {
        while (!exit){
            //do something
        }
    }
}
```
 
定义了一个退出标志 exit,当 exit 为 true 时,while 循环退出,exit 的默认值为 false.在定义 exit
时,使用了一个 Java 关键字 volatile,这个关键字的目的是使 exit 同步,也就是说在同一时刻只
能由一个线程来修改 exit 的值。
 
 - Interrupt 方法结束线程
 >使用 interrupt()方法来中断线程有两种情况:
 
 1.线程处于阻塞状态:如使用了 sleep,同步锁的 wait,socket 中的 receiver,accept 等方法时,
 会使线程处于阻塞状态。当调用线程的 interrupt()方法时,会抛出 InterruptException 异常。
 阻塞中的那个方法抛出这个异常,通过代码捕获该异常,然后 break 跳出循环状态,从而让
 我们有机会结束这个线程的执行。通常很多人认为只要调用 interrupt 方法线程就会结束,实
 际上是错的, 一定要先捕获 InterruptedException 异常之后通过 break 来跳出循环,才能正
 常结束 run 方法。
 
 2.线程未处于阻塞状态:使用 isInterrupted()判断线程的中断标志来退出循环。当使用
 interrupt()方法时,中断标志就会置 true,和使用自定义的标志来控制循环是一样的道理。
 
 
 ```java
public class ThreadSafe extends Thread {
    public void run() {
        while (!isInterrupted()){ //非阻塞过程中通过判断中断标志来退出
            try{
                Thread.sleep(5*1000);//阻塞过程捕获中断异常来退出
            }catch(InterruptedException e){
                e.printStackTrace();
                break;//捕获到异常之后,执行 break 跳出循环
            }
        }
    }
}
```
 
 
 - stop 方法终止线程(线程不安全)
 
 >程序中可以直接使用 thread.stop()来强行终止线程,但是 stop 方法是很危险的,就象突然关
  闭计算机电源,而不是按正常程序关机一样,可能会产生不可预料的结果,不安全主要是:
  thread.stop()调用之后,创建子线程的线程就会抛出 ThreadDeatherror 的错误,并且会释放子
  线程所持有的所有锁。一般任何进行加锁的代码块,都是为了保护数据的一致性,如果在`调用
  thread.stop()后导致了该线程所持有的所有锁的突然释放(不可控制)`,那么被保护数据就有可能呈
  现不一致性,其他线程在使用这些被破坏的数据时,有可能导致一些很奇怪的应用程序错误。因
  此,并不推荐使用 stop 方法来终止线程。
 
 
 
 ## sleep 与 wait 区别
 
 
 1.对于 sleep()方法,我们首先要知道该方法是属于 Thread 类中的。而 wait()方法,则是属于Object 类中的。  
 2.sleep()方法导致了程序暂停执行指定的时间,让出 cpu 该其他线程,但是他的监控状态依然保持者,当指定的时间到了又会自动恢复运行状态。  
 3. 在调用 sleep()方法的过程中,线程不会释放对象锁。  
 4. 而当调用 wait()方法的时候,线程会放弃对象锁,进入等待此对象的等待锁定池,只有针对此对象调用 notify()方法后本线程才进入对象锁定池准备获取对象锁进入运行状态。  
 
 
## start 与 run 区别
 
 1.start()方法来启动线程,真正实现了多线程运行。这时无需等待 run 方法体代码执行完毕,可以直接继续执行下面的代码。  
 2.通过调用 Thread 类的 start()方法来启动一个线程, 这时此线程是处于就绪状态, 并没有运行。  
 3.方法 run()称为线程体,它包含了要执行的这个线程的内容,线程就进入了运行状态,开始运行 run 函数当中的代码。 Run 方法运行结束, 此线程终止。然后 CPU 再调度其它线程。
 
 
## JAVA 后台线程
 
1.定义:守护线程--也称“服务线程”,他是后台线程,它有一个特性,即为用户线程 提供 公共服务,在没有用户线程可服务时会自动离开。  
 
2.优先级:守护线程的优先级比较低,用于为系统中的其它对象和线程提供服务。  
 
3.设置:通过 setDaemon(true)来设置线程为“守护线程”;将一个用户线程设置为守护线程的方式是在 线程对象创建 之前 用线程对象的 setDaemon 方法。  
 
4.在 Daemon 线程中产生的新线程也是 Daemon 的。
 
5.线程则是 JVM 级别的,以 Tomcat 为例,如果你在 Web 应用中启动一个线程,这个线程的生命周期并不会和 Web 应用程序保持同步。也就是说,即使你停止了 Web 应用,这个线程依旧是活跃的。  
 
6.example: 垃圾回收线程就是一个经典的守护线程,当我们的程序中不再有任何运行的 Thread,程序就不会再产生垃圾,垃圾回收器也就无事可做,所以当垃圾回收线程是 JVM 上仅剩的线程时,垃圾回收线程会自动离开。它始终在低级别的状态中运行,用于实时监控和管理系统中的可回收资源。
 
7.生命周期:守护进程(Daemon)是运行在后台的一种特殊进程。它独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。也就是说守护线程不依赖于终端,但是依赖于系统,与系统“同生共死”。当 JVM 中所有的线程都是守护线程的时候,JVM 就可以退出了;如果还有一个或以上的非守护线程则 JVM 不会退出。  
 
 
# JAVA 锁
 
## 乐观锁
>乐观锁是一种乐观思想,即认为读多写少,遇到并发写的可能性低,每次去拿数据的时候都认为别人不会修改,所以不会上锁,但是在更新的时候会判断一下在此期间别人有没有去更新这个数据,
采取在写时先读出当前版本号,然后加锁操作(比较跟上一次的版本号,如果一样则更新),如果失败则要重复读-比较-写的操作。java 中的乐观锁基本都是通过 CAS 操作实现的,CAS 是一种更新的原子操作,
比较当前值跟传入值是否一样,一样则更新,否则失败。
 
 
## 悲观锁
>悲观锁是就是悲观思想,即认为写多,遇到并发写的可能性高,每次去拿数据的时候都认为别人
 会修改,所以每次在读写数据的时候都会上锁,这样别人想读写这个数据就会 block 直到拿到锁。
 java 中的悲观锁就是 Synchronized,AQS 框架下的锁则是先尝试 cas 乐观锁去获取锁,获取不到,
 才会转换为悲观锁,如 RetreenLock。
 
## 自旋锁
>自旋锁原理非常简单,如果持有锁的线程能在很短时间内释放锁资源,那么那些等待竞争锁
 的线程就不需要做内核态和用户态之间的切换进入阻塞挂起状态,它们只需要等一等(自旋),
 等持有锁的线程释放锁后即可立即获取锁,这样就避免用户线程和内核的切换的消耗。
 线程自旋是需要消耗 cup 的,说白了就是让 cup 在做无用功,如果一直获取不到锁,那线程
 也不能一直占用 cup 自旋做无用功,所以需要设定一个自旋等待的最大时间。
 如果持有锁的线程执行的时间超过自旋等待的最大时间扔没有释放锁,就会导致其它争用锁
 的线程在最大等待时间内还是获取不到锁,这时争用线程会停止自旋进入阻塞状态。
 
 
 自旋锁的优缺点
 
 >自旋锁尽可能的减少线程的阻塞,这对于锁的竞争不激烈,且占用锁时间非常短的代码块来
 说性能能大幅度的提升,因为自旋的消耗会小于线程阻塞挂起再唤醒的操作的消耗,这些操作会
 导致线程发生两次上下文切换!
 但是如果锁的竞争激烈,或者持有锁的线程需要长时间占用锁执行同步块,这时候就不适合
 使用自旋锁了,因为自旋锁在获取锁前一直都是占用 cpu 做无用功,占着 XX 不 XX,同时有大量
 线程在竞争一个锁,会导致获取锁的时间很长,线程自旋的消耗大于线程阻塞挂起操作的消耗,
 其它需要 cup 的线程又不能获取到 cpu,造成 cpu 的浪费。所以这种情况下我们要关闭自旋锁;
 
 
 自旋锁时间阈值 ( 1.6 引入了适应性自旋锁)
 
 >自旋锁的目的是为了占着 CPU 的资源不释放,等到获取到锁立即进行处理。但是如何去选择
 自旋的执行时间呢?如果自旋执行时间太长,会有大量的线程处于自旋状态占用 CPU 资源,进而
 会影响整体系统的性能。因此自旋的周期选的额外重要!JVM 对于自旋周期的选择,jdk1.5 这个限度是一定的写死的,在 1.6 引入了适应性自旋锁,适应
 性自旋锁意味着自旋的时间不在是固定的了,而是由前一次在同一个锁上的自旋时间以及锁的拥
 有者的状态来决定,基本认为一个线程上下文切换的时间是最佳的一个时间,同时 JVM 还针对当
 前 CPU 的负荷情况做了较多的优化,如果平均负载小于 CPUs 则一直自旋,如果有超过(CPUs/2)
 个线程正在自旋,则后来线程直接阻塞,如果正在自旋的线程发现 Owner 发生了变化则延迟自旋
 时间(自旋计数)或进入阻塞,如果 CPU 处于节电模式则停止自旋,自旋时间的最坏情况是 CPU
 的存储延迟(CPU A 存储了一个数据,到 CPU B 得知这个数据直接的时间差),自旋时会适当放
 弃线程优先级之间的差异。
 自旋锁的开启
 JDK1.6 中-XX:+UseSpinning 开启;
 `-XX:PreBlockSpin=10` 为自旋次数;
 JDK1.7 后,去掉此参数,由 jvm 控制;
 
 
### Synchronized 同步锁

synchronized 它可以把任意一个非 NULL 的对象当作锁。他属于独占式的悲观锁,同时属于可重入锁。

**Synchronized 作用范围**
1.作用于方法时,锁住的是对象的实例(this);
2.当作用于静态方法时,锁住的是 Class 实例,又因为 Class 的相关数据存储在永久带 PermGen(jdk1.8 则是 metaspace),永久带是全局共享的,因此静态方法锁相当于类的一个全局锁,会锁所有调用该方法的线程;
3.synchronized 作用于一个对象实例时,锁住的是所有以该对象为锁的代码块。它有多个队列,当多个线程一起访问某个对象监视器的时候,对象监视器会将这些线程存储在不同的容器中。

**Synchronized 核心组件**
1) Wait Set:哪些调用 wait 方法被阻塞的线程被放置在这里;
2) Contention List:竞争队列,所有请求锁的线程首先被放在这个竞争队列中;
3) Entry List:Contention List 中那些有资格成为候选资源的线程被移动到 Entry List 中;
4) OnDeck:任意时刻,最多只有一个线程正在竞争锁资源,该线程被成为 OnDeck;
5) Owner:当前已经获取到所资源的线程被称为 Owner;
6) !Owner:当前释放锁的线程。
 
**Synchronized 实现**
 
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/synchronized.png)
 
 
>1.JVM 每次从队列的尾部取出一个数据用于锁竞争候选者(OnDeck),但是并发情况下,
ContentionList 会被大量的并发线程进行 CAS 访问,为了降低对尾部元素的竞争,JVM 会将
一部分线程移动到 EntryList 中作为候选竞争线程。

>2.Owner 线程会在 unlock 时,将 ContentionList 中的部分线程迁移到 EntryList 中,并指定
EntryList 中的某个线程为 OnDeck 线程(一般是最先进去的那个线程)。

>3.Owner 线程并不直接把锁传递给 OnDeck 线程,而是把锁竞争的权利交给 OnDeck,
OnDeck 需要重新竞争锁。这样虽然牺牲了一些公平性,但是能极大的提升系统的吞吐量,在
JVM 中,也把这种选择行为称之为“竞争切换”。

>4.OnDeck 线程获取到锁资源后会变为 Owner 线程,而没有得到锁资源的仍然停留在 EntryList
中。如果 Owner 线程被 wait 方法阻塞,则转移到 WaitSet 队列中,直到某个时刻通过 notify
或者 notifyAll 唤醒,会重新进去 EntryList 中。

>5.处于 ContentionList、EntryList、WaitSet 中的线程都处于阻塞状态,该阻塞是由操作系统
来完成的(Linux 内核下采用 pthread_mutex_lock 内核函数实现的)。

>6.Synchronized 是非公平锁。 Synchronized 在线程进入 ContentionList 时,等待的线程会先
尝试自旋获取锁,如果获取不到就进入 ContentionList,这明显对于已经进入队列的线程是
不公平的,还有一个不公平的事情就是自旋获取锁的线程还可能直接抢占 OnDeck 线程的锁
资源。[参考](https://blog.csdn.net/zqz_zqz/article/details/70233767)

>7.每个对象都有个 monitor 对象,加锁就是在竞争 monitor 对象,代码块加锁是在前后分别加
上 monitorenter 和 monitorexit 指令来实现的,方法加锁是通过一个标记位来判断的

>8.synchronized 是一个重量级操作,需要调用操作系统相关接口,性能是低效的,有可能给线程加锁消耗的时间比有用操作消耗的时间更多。

>9.Java1.6,synchronized 进行了很多的优化,有适应自旋、锁消除、锁粗化、轻量级锁及偏向锁等,效率有了本质上的提高。在之后推出的 Java1.7 与 1.8 中,均对该关键字的实现机理做
了优化。引入了偏向锁和轻量级锁。都是在对象头中有标记位,不需要经过操作系统加锁。

>10.锁可以从偏向锁升级到轻量级锁,再升级到重量级锁。这种升级过程叫做锁膨胀;

>11.JDK 1.6 中默认是开启偏向锁和轻量级锁,可以通过`-XX:-UseBiasedLocking` 来禁用偏向锁。
 
 
 
# ReentrantLock

>ReentantLock 继承接口 Lock 并实现了接口中定义的方法,他是一种可重入锁,除了能完成 synchronized 所能完成的所有工作外,还提供了诸如可响应中断锁、可轮询锁请求、定时锁等避免多线程死锁的方法。

### Lock 接口的主要方法
 
 ```text
void lock(): 执行此方法时, 如果锁处于空闲状态, 当前线程将获取到锁. 相反, 如果锁已经被其他线程持有, 将禁用当前线程, 直到当前线程获取到锁.
boolean tryLock():如果锁可用, 则获取锁, 并立即返回 true, 否则返回 false. 该方法和lock()的区别在于, tryLock()只是"试图"获取锁, 如果锁不可用, 不会导致当前线程被禁用,当前线程仍然继续往下执行代码. 而 lock()方法则是一定要获取到锁, 如果锁不可用, 就一直等待, 在未获得锁之前,当前线程并不继续向下执行.
void unlock():执行此方法时, 当前线程将释放持有的锁. 锁只能由持有者释放, 如果线程并不持有锁, 却执行该方法, 可能导致异常的发生.
Condition newCondition():条件对象,获取等待通知组件。该组件和当前的锁绑定,当前线程只有获取了锁,才能调用该组件的 await()方法,而调用后,当前线程将缩放锁。
getHoldCount() :查询当前线程保持此锁的次数,也就是执行此线程执行 lock 方法的次数。
getQueueLength():返回正等待获取此锁的线程估计数,比如启动 10 个线程,1 个线程获得锁,此时返回的是 9
getWaitQueueLength:(Condition condition)返回等待与此锁相关的给定条件的线程估计数。比如 10 个线程,用同一个 condition 对象,并且此时这 10 个线程都执行了condition 对象的 await 方法,那么此时执行此方法返回 10
hasWaiters(Condition condition) : 查 询 是 否 有 线 程 等 待 与 此 锁 有 关 的 给 定 条 件(condition),对于指定 contidion 对象,有多少线程执行了 condition.await 方法
hasQueuedThread(Thread thread):查询给定线程是否等待获取此锁
hasQueuedThreads():是否有线程等待此锁
isFair():该锁是否公平锁
isHeldByCurrentThread(): 当前线程是否保持锁锁定,线程的执行 lock 方法的前后分别是 false 和 true
isLock():此锁是否有任意线程占用
lockInterruptibly():如果当前线程未被中断,获取锁
tryLock():尝试获得锁,仅在调用时锁未被线程占用,获得锁
tryLock(long timeout TimeUnit unit):如果锁在给定等待时间内没有被另一个线程保持,则获取该锁。
```

# 非公平锁

JVM 按随机、就近原则分配锁的机制则称为不公平锁,ReentrantLock 在构造函数中提供了是否公平锁的初始化方式,默认为非公平锁。非公平锁实际执行的效率要远远超出公平锁,除非程序有特殊需要,否则最常用非公平锁的分配机制。

# 公平锁

公平锁指的是锁的分配机制是公平的,通常先对锁提出获取请求的线程会先被分配到锁,ReentrantLock 在构造函数中提供了是否公平锁的初始化方式来定义公平锁。

# ReentrantLock 与 synchronized

1.ReentrantLock 通过方法 lock()与 unlock()来进行加锁与解锁操作,与 synchronized 会被 JVM 自动解锁机制不同,ReentrantLock 加锁后需要手动进行解锁。为了避免程序出现异常而无法正常解锁的情况,使用 ReentrantLock 必须在 finally 控制块中进行解锁操作。
2.ReentrantLock 相比 synchronized 的优势是可中断、公平锁、多个锁。这种情况下需要使用 ReentrantLock。

ReentrantLock 实现
```java
public class MyService {
    private Lock lock = new ReentrantLock();
    //Lock lock=new ReentrantLock(true);//公平锁
    //Lock lock=new ReentrantLock(false);//非公平锁
    private Condition condition = lock.newCondition();//创建 Condition

    public void testMethod() {
        try {
            lock.lock();//lock 加锁
            //1:wait 方法等待:
            //System.out.println("开始 wait");
            condition.await();
            //通过创建 Condition 对象来使线程 wait,必须先执行 lock.lock 方法获得锁
            //:2:signal 方法唤醒
            condition.signal();//condition 对象的 signal 方法可以唤醒 wait 线程
            for (int i = 0; i < 5; i++) {
                System.out.println("ThreadName=" + Thread.currentThread().getName() + (" " + (i + 1)));
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```


## Condition 类和 Object 类锁方法区别区别
1. Condition 类的 awiat 方法和 Object 类的 wait 方法等效
2. Condition 类的 signal 方法和 Object 类的 notify 方法等效
3. Condition 类的 signalAll 方法和 Object 类的 notifyAll 方法等效
4. ReentrantLock 类可以唤醒指定条件的线程,而 object 的唤醒是随机的

## tryLock 和 lock 和 lockInterruptibly 的区别
1.tryLock 能获得锁就返回 true,不能就立即返回 false,tryLock(long timeout,TimeUnitunit),可以增加时间限制,如果超过该时间段还没获得锁,返回 false
2. lock 能获得锁就返回 true,不能的话一直等待获得锁
3. lock 和 lockInterruptibly,如果两个线程分别执行这两个方法,但此时中断这两个线程,lock 不会抛出异常,而 lockInterruptibly 会抛出异常。

# Semaphore 信号量
Semaphore 是一种基于计数的信号量。它可以设定一个阈值,基于此,多个线程竞争获取许可信号,做完自己的申请后归还,超过阈值后,线程申请许可信号将会被阻塞。Semaphore 可以用来构建一些对象池,资源池之类的,比如数据库连接池实现互斥锁(计数器为 1 )
我们也可以创建计数为 1 的 Semaphore,将其作为一种类似互斥锁的机制,这也叫二元信号量,表示两种互斥状态。
代码实现
它的用法如下:

```java
// 创建一个计数阈值为 5 的信号量对象
// 只能 5 个线程同时访问
Semaphore semp = new Semaphore(5);
try {
    // 申请许可
    semp.acquire();
        try {
            // 业务逻辑
        } catch (Exception e) {
            } finally {
            // 释放许可
            semp.release();
        }
    } catch (InterruptedException e) {
}
```

## Semaphore 与 ReentrantLock

Semaphore 基本能完成 ReentrantLock 的所有工作,使用方法也与之类似,通过 acquire()与
release()方法来获得和释放临界资源。经实测,Semaphone.acquire()方法默认为可响应中断锁,
与 ReentrantLock.lockInterruptibly()作用效果一致,也就是说在等待临界资源的过程中可以被
Thread.interrupt()方法中断。

此外,Semaphore 也实现了`可轮询的锁请求与定时锁的功能`,除了方法名 tryAcquire 与 tryLock
不同,其使用方法与 ReentrantLock 几乎一致。Semaphore 也提供了公平与非公平锁的机制,也
可在构造函数中进行设定。
Semaphore 的锁释放操作也由手动进行,因此与 ReentrantLock 一样,为避免线程因抛出异常而
无法正常释放锁的情况发生,释放锁的操作也必须在 finally 代码块中完成。

### AtomicInteger
首 先 说 明 , 此 处 AtomicInteger , 一 个 提 供 原 子 操 作 的 Integer 的 类 , 常 见 的 还 有
`AtomicBoolean`、`AtomicInteger`、`AtomicLong`、`AtomicReference` 等,他们的实现原理相同,
区别在与运算对象类型的不同。令人兴奋地,还可以通过 AtomicReference<V>将一个对象的所
有操作转化成原子操作。

我们知道,在多线程程序中,诸如++i 或 i++等运算不具有原子性,是不安全的线程操作之一。
通常我们会使用 synchronized 将该操作变成一个原子操作,但 JVM 为此类操作特意提供了一些
同步类,使得使用更方便,且使程序运行效率变得更高。通过相关资料显示,通常 AtomicInteger
的性能是 ReentantLock 的好几倍。
### 可重入锁(递归锁)
本文里面讲的是广义上的可重入锁,而不是单指 JAVA 下的 `ReentrantLock`。可重入锁,也叫
做递归锁,指的是同一线程 外层函数获得锁之后 ,内层递归函数仍然有获取该锁的代码,但不受
影响。在 JAVA 环境下 `ReentrantLock` 和 `synchronized` 都是 可重入锁。



## 公平锁与非公平锁

公平锁( Fair )
加锁前检查是否有排队等待的线程,优先排队等待的线程,先来先得
非公平锁( Nonfair )
加锁时不考虑排队等待问题,直接尝试获取锁,获取不到自动到队尾等待
1. 非公平锁性能比公平锁高 5~10 倍,因为公平锁需要在多核的情况下维护一个队列
2. Java 中的 synchronized 是非公平锁,ReentrantLock 默认的 lock()方法采用的是非公平锁。

### ReadWriteLock 读写锁

为了提高性能,Java 提供了读写锁,在读的地方使用读锁,在写的地方使用写锁,灵活控制,如
果没有写锁的情况下,读是无阻塞的,在一定程度上提高了程序的执行效率。读写锁分为读锁和写
锁,多个读锁不互斥,读锁与写锁互斥,这是由 jvm 自己控制的,你只要上好相应的锁即可。
读锁
如果你的代码只读数据,可以很多人同时读,但不能同时写,那就上读锁
写锁
如果你的代码修改数据,只能有一个人在写,且不能同时读取,那就上写锁。总之,读的时候上
读锁,写的时候上写锁!
Java 中 读 写 锁 有 个 接 口 java.util.concurrent.locks.ReadWriteLock , 也 有 具 体 的 实 现

### ReentrantReadWriteLock

## 共享锁和独占锁

java 并发包提供的加锁模式分为独占锁和共享锁。
独占锁
>独占锁模式下,每次只能有一个线程能持有锁,ReentrantLock 就是以独占方式实现的互斥锁。
独占锁是一种悲观保守的加锁策略,它避免了读/读冲突,如果某个只读线程获取锁,则其他读线
程都只能等待,这种情况下就限制了不必要的并发性,因为读操作并不会影响数据的一致性。

共享锁
>共享锁则允许多个线程同时获取锁,并发访问 共享资源,如:ReadWriteLock。共享锁则是一种
乐观锁,它放宽了加锁策略,允许多个执行读操作的线程同时访问共享资源。

1.AQS 的内部类 Node 定义了两个常量 SHARED 和 EXCLUSIVE,他们分别标识 AQS 队列中等待线程的锁获取模式。
2.java 的并发包中提供了 ReadWriteLock,读-写锁。它允许一个资源可以被多个读操作访问,或者被一个 写操作访问,但两者不能同时进行。


### 重量级锁( Mutex Lock )

Synchronized 是通过对象内部的一个叫做监视器锁(monitor)来实现的。但是监视器锁本质又是依赖于底层的操作系统的 Mutex Lock 来实现的。而操作系统实现线程之间的切换这就需要从用户态转换到核心态,这个成本非常高,状态之间的转换需要相对比较长的时间,这就是为什么
Synchronized 效率低的原因。因此,这种依赖于操作系统 Mutex Lock 所实现的锁我们称之为“重量级锁”。JDK 中对 Synchronized 做的种种优化,其核心都是为了减少这种重量级锁的使用。
JDK1.6 以后,为了减少获得锁和释放锁所带来的性能消耗,提高性能,引入了“轻量级锁”和“偏向锁”。

### 轻量级锁
锁的状态总共有四种:无锁状态、偏向锁、轻量级锁和重量级锁。

**锁升级**
随着锁的竞争,锁可以从偏向锁升级到轻量级锁,再升级的重量级锁(但是锁的升级是单向的,
也就是说只能从低到高升级,不会出现锁的降级)。


  “轻量级”是相对于使用操作系统互斥量来实现的传统锁而言的。但是,首先需要强调一点的是,
轻量级锁并不是用来代替重量级锁的,它的本意是在没有多线程竞争的前提下,减少传统的重量
级锁使用产生的性能消耗。在解释轻量级锁的执行过程之前,先明白一点,轻量级锁所适应的场
景是线程交替执行同步块的情况,如果存在同一时间访问同一锁的情况,就会导致轻量级锁膨胀
为重量级锁。

### 偏向锁
>Hotspot 的作者经过以往的研究发现大多数情况下锁不仅不存在多线程竞争,而且总是由同一线
程多次获得。偏向锁的目的是在某个线程获得锁之后,消除这个线程锁重入(CAS)的开销,看起
来让这个线程得到了偏护。引入偏向锁是为了在无多线程竞争的情况下尽量减少不必要的轻量级
锁执行路径,因为轻量级锁的获取及释放依赖多次 CAS 原子指令,而偏向锁只需要在置换
ThreadID 的时候依赖一次 CAS 原子指令(由于一旦出现多线程竞争的情况就必须撤销偏向锁,所
以偏向锁的撤销操作的性能损耗必须小于节省下来的 CAS 原子指令的性能消耗)。上面说过,轻
量级锁是为了在线程交替执行同步块时提高性能,而偏向锁则是在只有一个线程执行同步块时进
一步提高性能。

### 分段锁
>分段锁也并非一种实际的锁,而是一种思想 ConcurrentHashMap 是学习分段锁的最好实践

### 锁优化

- 减少锁持有时间  
>只用在有线程安全要求的程序上加锁

- 减小锁粒度
>将大对象(这个对象可能会被很多线程访问),拆成小对象,大大增加并行度,降低锁竞争。
降低了锁的竞争,偏向锁,轻量级锁成功率才会提高。最最典型的减小锁粒度的案例就是
ConcurrentHashMap。

- 锁分离
>最常见的锁分离就是读写锁 ReadWriteLock,根据功能进行分离成读锁和写锁,这样读读不互
斥,读写互斥,写写互斥,即保证了线程安全,又提高了性能,具体也请查看[高并发 Java 五]
JDK 并发包 1。读写分离思想可以延伸,只要操作互不影响,锁就可以分离。比如
LinkedBlockingQueue 从头部取出,从尾部放数据

- 锁粗化
>通常情况下,为了保证多线程间的有效并发,会要求每个线程持有锁的时间尽量短,即在使用完
公共资源后,应该立即释放锁。但是,凡事都有一个度,如果对同一个锁不停的进行请求、同步
和释放,其本身也会消耗系统宝贵的资源,反而不利于性能的优化 。
锁消除
锁消除是在编译器级别的事情。在即时编译器时,如果发现不可能被共享的对象,则可以消除这
些对象的锁操作,多数是因为程序员编码不规范引起。
[参考](https://www.jianshu.com/p/39628e1180a9)
4.1.10.

- 线程基本方法
线程相关的基本方法有 `wait,notify,notifyAll,sleep,join,yield` 等。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/threadmethods.png)


## 线程等待(wait)
>调用该方法的线程进入 WAITING 状态,只有等待另外线程的通知或被中断才会返回,需要注意的
是调用 wait()方法后,会释放对象的锁。因此,wait 方法一般用在同步方法或同步代码块中。
4.1.10.2.

## 线程睡眠(sleep)
sleep 导致当前线程休眠,与 wait 方法不同的是 sleep 不会释放当前占有的锁,sleep(long)会导致线程进入 `TIMED-WATING` 状态,而 wait()方法会导致当前线程进入 `WATING` 状态

## 线程让步(yield)
yield 会使当前线程让出 CPU 执行时间片,与其他线程一起重新竞争 CPU 时间片。一般情况下,优先级高的线程有更大的可能性成功竞争得到 CPU 时间片,但这又不是绝对的,有的操作系统对线程优先级并不敏感。

## 线程中断(interrupt)
中断一个线程,其本意是给这个线程一个通知信号,会影响这个线程内部的一个中断标识位。这个线程本身并不会因此而改变状态(如阻塞,终止等)。

1.调用 interrupt()方法并不会中断一个正在运行的线程。也就是说处于 Running 状态的线程并不会因为被中断而被终止,仅仅改变了内部维护的中断标识位而已。

2.若调用 sleep()而使线程处于 TIMED-WATING 状态,这时调用 interrupt()方法,会抛出InterruptedException,从而使线程提前结束 TIMED-WATING 状态。

3.许多声明抛出 InterruptedException 的方法(如 Thread.sleep(long mills 方法)),抛出异常前,都会清除中断标识位,所以抛出异常后,调用 isInterrupted()方法将会返回 false。

4.中断状态是线程固有的一个标识位,可以通过此标识位安全的终止线程。比如,你想终止一个线程 thread 的时候,可以调用 thread.interrupt()方法,在线程的 run 方法内部可以根据 thread.isInterrupted()的值来优雅的终止线程。

### Join 等待其他线程终止
    join() 方法,等待其他线程终止,在当前线程中调用一个线程的 join() 方法,则当前线程转为阻塞状态,回到另一个线程结束,当前线程再由阻塞状态变为就绪状态,等待 cpu 的宠幸。

##### 为什么要用 join()方法?
    很多情况下,主线程生成并启动了子线程,需要用到子线程返回的结果,也就是需要主线程需要在子线程结束后再结束,这时候就要用到 join() 方法。

```text
System.out.println(Thread.currentThread().getName() + "线程运行开始!");
Thread6 thread1 = new Thread6();
thread1.setName("线程 B");
thread1.join();
System.out.println("这时 thread1 执行完毕之后才能执行主线程");
```

### 线程唤醒(notify)
Object 类中的 notify() 方法,唤醒在此对象监视器上等待的单个线程,如果所有线程都在此对象上等待,则会选择唤醒其中一个线程,选择是任意的,并在对实现做出决定时发生,线程通过调
用其中一个 wait() 方法,在对象的监视器上等待,直到当前的线程放弃此对象上的锁定,才能继续执行被唤醒的线程,被唤醒的线程将以常规方式与在该对象上主动同步的其他所有线程进行竞争。类似的方法还有 notifyAll() ,唤醒再次监视器上等待的所有线程。

#### 其他方法:
1. `sleep()`:强迫一个线程睡眠N毫秒。
2. `isAlive()`: 判断一个线程是否存活。
3. `join()`: 等待线程终止。
4. `activeCount()`: 程序中活跃的线程数。
5. `enumerate()`: 枚举程序中的线程。
6. `currentThread()`: 得到当前线程。
7. `isDaemon()`: 一个线程是否为守护线程。
8. `setDaemon()`: 设置一个线程为守护线程。(用户线程和守护线程的区别在于,是否等待主线程依赖于主线程结束而结束)
9.`setName()`: 为线程设置一个名称。
10. `wait()`: 强迫一个线程等待。
11. `notify()`: 通知一个线程继续运行。
12. `setPriority()`: 设置一个线程的优先级。
13. `getPriority()`::获得一个线程的优先级。


## 线程上下文切换

>巧妙地利用了时间片轮转的方式, CPU 给每个任务都服务一定的时间,然后把当前任务的状态保存下来,在加载下一任务的状态后,继续服务下一任务,任务的状态保存及再加载, 这段过程就叫做上下文切换。时间片轮转的方式使多个任务在同一颗 CPU 上执行变成了可能。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/threadcontentchange.png)


#### 进程
(有时候也称做任务)是指一个程序运行的实例。在 Linux 系统中,线程就是能并行运行并且与他们的父进程(创建他们的进程)共享同一地址空间(一段内存区域)和其他资源的轻量级的进程。

### 上下文
是指某一时间点 CPU 寄存器和程序计数器的内容。

### 寄存器
是 CPU 内部的数量较少但是速度很快的内存(与之对应的是 CPU 外部相对较慢的 RAM 主内存)。寄存器通过对常用值(通常是运算的中间值)的快速访问来提高计算机程序运行的速度。

### 程序计数器
是一个专用的寄存器,用于表明指令序列中 CPU 正在执行的位置,存的值为正在执行的指令的位置或者下一个将要被执行的指令的位置,具体依赖于特定的系统。

### PCB-“切换桢”
上下文切换可以认为是内核(操作系统的核心)在 CPU 上对于进程(包括线程)进行切换,上下文切换过程中的信息是保存在进程控制块(PCB, process control block)中的。PCB 还经常被称作“切换桢”(switchframe)。信息会一直保存到 CPU 的内存中,直到他们被再次使用。


###上下文切换的活动:
1. 挂起一个进程,将这个进程在 CPU 中的状态(上下文)存储于内存中的某处。
2. 在内存中检索下一个进程的上下文并将其在 CPU 的寄存器中恢复。
3. 跳转到程序计数器所指向的位置(即跳转到进程被中断时的代码行),以恢复该进程在程序中。

### 引起线程上下文切换的原因
1. 当前执行任务的时间片用完之后,系统 CPU 正常调度下一个任务;
2. 当前执行任务碰到 IO 阻塞,调度器将此任务挂起,继续下一任务;
3. 多个任务抢占锁资源,当前任务没有抢到锁资源,被调度器挂起,继续下一任务;
4. 用户代码挂起当前任务,让出 CPU 时间;
5. 硬件中断;

## 同步锁与死锁

同步锁  
当多个线程同时访问同一个数据时,很容易出现问题。为了避免这种情况出现,我们要保证线程同步互斥,就是指并发执行的多个线程,在同一时间内只允许一个线程访问共享数据。 Java 中可以使用 synchronized 关键字来取得一个对象的同步锁。

死锁  
何为死锁,就是多个线程同时被阻塞,它们中的一个或者全部都在等待某个资源被释放。

线程池原理
线程池做的工作主要是控制运行的线程的数量,处理过程中将任务放入队列,然后在线程创建后启动这些任务,如果线程数量超过了最大数量超出数量的线程排队等候,等其它线程执行完毕,再从队列中取出任务来执行。他的主要特点为:线程复用;控制最大并发数;管理线程。

### 线程复用
每一个 Thread 的类都有一个 start 方法。 当调用 start 启动线程时 Java 虚拟机会调用该类的 run方法。 那么该类的 run() 方法中就是调用了 Runnable 对象的 run() 方法。 我们可以继承重写
Thread 类,在其 start 方法中添加不断循环调用传递过来的 Runnable 对象。 这就是线程池的实现原理。循环方法中不断获取 Runnable 是用 Queue 实现的,在获取下一个 Runnable 之前可以是阻塞的。

### 线程池的组成
一般的线程池主要分为以下 4 个组成部分:
1. 线程池管理器:用于创建并管理线程池
2. 工作线程:线程池中的线程
3. 任务接口:每个任务必须实现的接口,用于工作线程调度其运行
4. 任务队列:用于存放待处理的任务,提供一种缓冲机制
Java 中 的 线 程 池 是 通 过 Executor 框 架 实 现 的 , 该 框 架 中 用 到 了 Executor , Executors ,ExecutorService,ThreadPoolExecutor ,Callable 和 Future、FutureTask 这几个类。



![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/threadpoolcon.png)
ThreadPoolExecutor 的构造方法如下:
````java
public ThreadPoolExecutor(int corePoolSize,int maximumPoolSize, long keepAliveTime,TimeUnit unit, BlockingQueue<Runnable> workQueue) {
    this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,Executors.defaultThreadFactory(), defaultHandler);
}
````

1. corePoolSize:指定了线程池中的线程数量。
2. maximumPoolSize:指定了线程池中的最大线程数量。
3. keepAliveTime:当前线程池数量超过 corePoolSize 时,多余的空闲线程的存活时间,即多次时间内会被销毁。
4. unit:keepAliveTime 的单位。
5. workQueue:任务队列,被提交但尚未被执行的任务。
6. threadFactory:线程工厂,用于创建线程,一般用默认的即可。
7. handler:拒绝策略,当任务太多来不及处理,如何拒绝任务。


#### 拒绝策略
线程池中的线程已经用完了,无法继续为新任务服务,同时,等待队列也已经排满了,再也
塞不下新任务了。这时候我们就需要拒绝策略机制合理的处理这个问题。
JDK 内置的拒绝策略如下:
1. AbortPolicy : 直接抛出异常,阻止系统正常运行。
2. CallerRunsPolicy : 只要线程池未关闭,该策略直接在调用者线程中,运行当前被丢弃的任务。显然这样做不会真的丢弃任务,但是,任务提交线程的性能极有可能会急剧下降。
3. DiscardOldestPolicy : 丢弃最老的一个请求,也就是即将被执行的一个任务,并尝试再次提交当前任务。
4. DiscardPolicy : 该策略默默地丢弃无法处理的任务,不予任何处理。如果允许任务丢失,这是最好的一种方案。以上内置拒绝策略均实现了 RejectedExecutionHandler 接口,若以上策略仍无法满足实际需要,完全可以自己扩展 RejectedExecutionHandler 接口。


### Java 线程池工作过程
1.线程池刚创建时,里面没有一个线程。任务队列是作为参数传进来的。不过,就算队列里面有任务,线程池也不会马上执行它们。
2.当调用 execute() 方法添加一个任务时,线程池会做如下判断:
>a) 如果正在运行的线程数量小于 corePoolSize,那么马上创建线程运行这个任务;

>b) 如果正在运行的线程数量大于或等于 corePoolSize,那么将这个任务放入队列;

>c) 如果这时候队列满了,而且正在运行的线程数量小于 maximumPoolSize,那么还是要创建非核心线程立刻运行这个任务;

>d)如果队列满了,而且正在运行的线程数量大于或等于 maximumPoolSize,那么线程池会抛出异常 RejectExecutionException。
3. 当一个线程完成任务时,它会从队列中取下一个任务来执行。
4. 当一个线程无事可做,超过一定的时间(keepAliveTime)时,线程池会判断,如果当前运行的线程数大于 corePoolSize,那么这个线程就被停掉。所以线程池的所有任务完成后,它最终会收缩到 corePoolSize 的大小。


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/threadwork.png)


### JAVA 阻塞队列原理
>阻塞队列,关键字是阻塞,先理解阻塞的含义,在阻塞队列中,线程阻塞有这样的两种情况:

1.当队列中没有数据的情况下,消费者端的所有线程都会被自动阻塞(挂起),直到有数据放入队列。  
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/thread-1.png)

2.当队列中填满数据的情况下,生产者端的所有线程都会被自动阻塞(挂起),直到队列中有空的位置,线程被自动唤醒。
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/thread-2.png)


### 阻塞队列的主要方法


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/blockqueue.png)

- 抛出异常:抛出一个异常;  
- 特殊值:返回一个特殊值(null 或 false,视情况而定)
- 则塞:在成功操作之前,一直阻塞线程
- 超时:放弃前只在最大的时间内阻塞


### 插入操作:
1:public abstract boolean add(E paramE):将指定元素插入此队列中(如果立即可行且不会违反容量限制),成功时返回 true,如果当前没有可用的空间,则抛出 IllegalStateException。如果该元素是 NULL,则会抛出 NullPointerException 异常。

2:public abstract boolean offer(E paramE):将指定元素插入此队列中(如果立即可行且不会违反容量限制),成功时返回 true,如果当前没有可用的空间,则返回 false。

3:public abstract void put(E paramE) throws InterruptedException: 将指定元素插入此队列中,将等待可用的空间(如果有必要)

````java
public void put(E paramE) throws InterruptedException {
    checkNotNull(paramE);
    ReentrantLock localReentrantLock = this.lock;
    localReentrantLock.lockInterruptibly();
    try {
        while (this.count == this.items.length)
            this.notFull.await();//如果队列满了,则线程阻塞等待
            enqueue(paramE);
            localReentrantLock.unlock();
        } finally {
            localReentrantLock.unlock();
    }
}
````

4:offer(E o, long timeout, TimeUnit unit):可以设定等待的时间,如果在指定的时间内,还不能往队列中加入 BlockingQueue,则返回失败。


### 获取数据操作:


1:poll(time):取走 BlockingQueue 里排在首位的对象,若不能立即取出,则可以等 time 参数规定的时间,取不到时返回 null;

2:poll(long timeout, TimeUnit unit):从 BlockingQueue 取出一个队首的对象,如果在指定时间内,队列一旦有数据可取,则立即返回队列中的数据。否则直到时间超时还没有数据可取,返回失败。

3:take():取走 BlockingQueue 里排在首位的对象,若 BlockingQueue 为空,阻断进入等待状态直到 BlockingQueue 有新的数据被加入。

4.drainTo():一次性从 BlockingQueue 获取所有可用的数据对象(还可以指定获取数据的个数),通过该方法,可以提升获取数据效率;不需要多次分批加锁或释放锁。



### Java中的阻塞队列

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/blocking_queue.png)

- ArrayBlockingQueue: 由数组结构组成的有界阻塞队列.(公平、非公平)
>用数组实现的有界阻塞队列。此队列按照先进先出(FIFO)的原则对元素进行排序。默认情况下
 不保证访问者公平的访问队列,所谓公平访问队列是指阻塞的所有生产者线程或消费者线程,当
 队列可用时,可以按照阻塞的先后顺序访问队列,即先阻塞的生产者线程,可以先往队列里插入
 元素,先阻塞的消费者线程,可以先从队列里获取元素。通常情况下为了保证公平性会降低吞吐
 量。我们可以使用以下代码创建一个公平的阻塞队列:`ArrayBlockingQueue fairQueue = new ArrayBlockingQueue(1000,true);`



- LinkedBlockingQueue: 由链表结构组成的有界阻塞队列.(两个独立锁提高并发)
>基于链表的阻塞队列,同 ArrayListBlockingQueue 类似,此队列按照先进先出(FIFO)的原则对
 元素进行排序。而 LinkedBlockingQueue 之所以能够高效的处理并发数据,还因为其对于生产者
 端和消费者端分别采用了独立的锁来控制数据同步,这也意味着在高并发的情况下生产者和消费
 者可以并行地操作队列中的数据,以此来提高整个队列的并发性能。
 LinkedBlockingQueue 会默认一个类似无限大小的容量(Integer.MAX_VALUE)。



- PriorityBlockingQueue: 支持优先级排序的无界阻塞队列.(compareTo 排序实现优先)
>是 一 个 支持 优 先级 的 无界 队 列 。默 认 情况 下 元素 采 取 自然 顺 序升 序 排列 。 可 以自 定 义实 现
 compareTo()方法来指定元素进行排序规则,或者初始化 PriorityBlockingQueue 时,指定构造
 参数 Comparator 来对元素进行排序。需要注意的是不能保证同优先级元素的顺序。



- DelayQueue: 使用优先级队列实现的无界阻塞队列.(缓存失效、定时任务 )
>是一个支持延时获取元素的无界阻塞队列。队列使用 PriorityQueue 来实现。队列中的元素必须实
 现 Delayed 接口,在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才
 能从队列中提取元素。我们可以将 DelayQueue 运用在以下应用场景:
 
>1.缓存系统的设计:可以用 DelayQueue 保存缓存元素的有效期,使用一个线程循环查询 DelayQueue,一旦能从 DelayQueue 中获取元素时,表示缓存有效期到了。
>2.定时任务调度 : 使用 DelayQueue 保存当天将会执行的任务和执行时间,一旦从DelayQueue 中获取到任务就开始执行,从比如 TimerQueue 就是使用 DelayQueue 实现的。


- SynchronousQueue: 不存储元素的阻塞队列.(不存储数据、可用于传递数据)
>是一个不存储元素的阻塞队列。每一个 put 操作必须等待一个 take 操作,否则不能继续添加元素。
 SynchronousQueue 可以看成是一个传球手,负责把生产者线程处理的数据直接传递给消费者线
 程。队列本身并不存储任何元素,非常适合于传递性场景,比如在一个线程中使用的数据,传递给
 另 外 一 个 线 程 使 用 , SynchronousQueue 的 吞 吐 量 高 于 LinkedBlockingQueue 和
 ArrayBlockingQueue。


- LinkedTransferQueue: 由链表结构组成的无界阻塞队列.
>是 一 个 由 链 表 结 构 组 成 的 无 界 阻 塞 TransferQueue 队 列 。 相 对 于 其 他 阻 塞 队 列 ,
 LinkedTransferQueue 多了 tryTransfer 和 transfer 方法。
 
 >1.transfer 方法:如果当前有消费者正在等待接收元素(消费者使用 take()方法或带时间限制的
 poll()方法时),transfer 方法可以把生产者传入的元素立刻 transfer(传输)给消费者。如
 果没有消费者在等待接收元素,transfer 方法会将元素存放在队列的 tail 节点,并等到该元素
 被消费者消费了才返回。
 
 >2.tryTransfer 方法。则是用来试探下生产者传入的元素是否能直接传给消费者。如果没有消费
 者等待接收元素,则返回 false。和 transfer 方法的区别是 tryTransfer 方法无论消费者是否
 接收,方法立即返回。而 transfer 方法是必须等到消费者消费了才返回。
 对于带有时间限制的 tryTransfer(E e, long timeout, TimeUnit unit)方法,则是试图把生产者传
 入的元素直接传给消费者,但是如果没有消费者消费该元素则等待指定的时间再返回,如果超时
 还没消费元素,则返回 false,如果在超时时间内消费了元素,则返回 true。


- LinkedBlockingDeque: 由链表结构组成的双向阻塞队列.
>是一个由链表结构组成的双向阻塞队列。所谓双向队列指的你可以从队列的两端插入和移出元素。
 双端队列因为多了一个操作队列的入口,在多线程同时入队时,也就减少了一半的竞争。相比其
 他 的 阻 塞 队 列 , LinkedBlockingDeque 多 了 addFirst , addLast , offerFirst , offerLast ,
 peekFirst,peekLast 等方法,以 First 单词结尾的方法,表示插入,获取(peek)或移除双端队
 列的第一个元素。以 Last 单词结尾的方法,表示插入,获取或移除双端队列的最后一个元素。另
 外插入方法 add 等同于 addLast,移除方法 remove 等效于 removeFirst。但是 take 方法却等同
 于 takeFirst,不知道是不是 Jdk 的 bug,使用时还是用带有 First 和 Last 后缀的方法更清楚。
 在初始化 LinkedBlockingDeque 时可以设置容量防止其过渡膨胀。另外双向阻塞队列可以运用在
 “工作窃取”模式中。


### CyclicBarrier、CountDownLatch、Semaphore 的用法

#### CountDownLatch(线程计数器 )
>CountDownLatch 类位于 java.util.concurrent 包下,利用它可以实现类似计数器的功能。比如有
一个任务 A,它要等待其他 4 个任务执行完毕之后才能执行,此时就可以利用 CountDownLatch
来实现这种功能了。

```java
        final CountDownLatch latch = new CountDownLatch(2);
        new Thread() {
            public void run() {
                System.out.println("子线程" + Thread.currentThread().getName() + "正在执行");
                Thread.sleep(3000);
                System.out.println("子线程" + Thread.currentThread().getName() + "执行完毕");
                latch.countDown();
            }

            ;
        }.start();
        new Thread() {
            public void run() {
                System.out.println("子线程" + Thread.currentThread().getName() + "正在执行");
                Thread.sleep(3000);
                System.out.println("子线程" + Thread.currentThread().getName() + "执行完毕");
                latch.countDown();
            }

            ;
        }.start();
        System.out.println("等待 2 个子线程执行完毕...");
        latch.await();
        System.out.println("2 个子线程已经执行完毕");
        System.out.println("继续执行主线程")
```

#### CyclicBarrier(回环栅栏-等待至 barrier 状态再全部同时执行)
>字面意思回环栅栏,通过它可以实现让一组线程等待至某个状态之后再全部同时执行。叫做回环
 是因为当所有等待线程都被释放以后,CyclicBarrier 可以被重用。我们暂且把这个状态就叫做
 barrier,当调用 await()方法之后,线程就处于 barrier 了。
 CyclicBarrier 中最重要的方法就是 await 方法,它有 2 个重载版本:
 
 1.public int await():用来挂起当前线程,直至所有线程都到达 barrier 状态再同时执行后续任务;
 2.public int await(long timeout, TimeUnit unit):让这些线程等待至一定的时间,如果还有线程没有到达 barrier 状态就直接让到达 barrier 的线程执行后续任务。

```java
    public static void main(String[] args) {
        int N = 4;
        CyclicBarrier barrier = new CyclicBarrier(N);
        for(int i=0;i<N;i++)
            new Writer(barrier).start();
    }
    static class Writer extends Thread{
        private CyclicBarrier cyclicBarrier;
        public Writer(CyclicBarrier cyclicBarrier) {
            this.cyclicBarrier = cyclicBarrier;
        }
        @Override
        public void run() {
            try {
                Thread.sleep(5000);
                //以睡眠来模拟线程需要预定写入数据操作
                System.out.println(" 线 程 "+Thread.currentThread().getName()+" 写 入 数 据 完 毕,等待其他线程写入完毕");
                cyclicBarrier.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }catch( BrokenBarrierException e){
                e.printStackTrace();
            }
            System.out.println("所有线程写入完毕,继续处理其他任务,比如数据操作");
        }
    }
```

#### Semaphore(信号量-控制同时访问的线程个数)


Semaphore 翻译成字面意思为 信号量,Semaphore 可以控制同时访问的线程个数,通过
acquire() 获取一个许可,如果没有就等待,而 release() 释放一个许可。
Semaphore 类中比较重要的几个方法:

1.public void acquire(): 用来获取一个许可,若无许可能够获得,则会一直等待,直到获得许可。
2. public void acquire(int permits):获取 permits 个许可
3. public void release() { } :释放许可。注意,在释放许可之前,必须先获获得许可。
4. public void release(int permits) { }:释放 permits 个许可 

>上面 4 个方法都会被阻塞,如果想立即得到执行结果,可以使用下面几个方法

1.public boolean tryAcquire():尝试获取一个许可,若获取成功,则立即返回 true,若获取失败,则立即返回 false
2.public boolean tryAcquire(long timeout, TimeUnit unit):尝试获取一个许可,若在指定的时间内获取成功,则立即返回 true,否则则立即返回 false
3.public boolean tryAcquire(int permits):尝试获取 permits 个许可,若获取成功,则立即返回 true,若获取失败,则立即返回 false
4.public boolean tryAcquire(int permits, long timeout, TimeUnit unit): 尝试获取 permits个许可,若在指定的时间内获取成功,则立即返回 true,否则则立即返回 false
5.还可以通过 availablePermits()方法得到可用的许可数目。例子:若一个工厂有 5 台机器,但是有 8 个工人,一台机器同时只能被一个工人使用,只有使用完了,其他工人才能继续使用。那么我们就可以通过 Semaphore 来实现:

```java
public class SemaphoreDemo {
    public static void main(String[] args) {

        int N = 8;
        //工人数
        Semaphore semaphore = new Semaphore(5); //机器数目
        for (int i = 0; i < N; i++) new Worker(i, semaphore).start();

    }

    static class Worker extends Thread {
        private int num;
        private Semaphore semaphore;

        public Worker(int num, Semaphore semaphore) {
            this.num = num;
            this.semaphore = semaphore;
        }

        @Override
        public void run() {
            try {
                semaphore.acquire();
                System.out.println("工人" + this.num + "占用一个机器在生产...");
                Thread.sleep(2000);
                System.out.println("工人" + this.num + "释放出机器");
                semaphore.release();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

- CountDownLatch 和 CyclicBarrier 都能够实现线程之间的等待,只不过它们侧重点不同;CountDownLatch 一般用于某个线程 A 等待若干个其他线程执行完任务之后,它才执行;而 CyclicBarrier 一般用于一组线程互相等待至某个状态,然后这一组线程再同时执行;另外,CountDownLatch 是不能够重用的,而 CyclicBarrier 是可以重用的。
- Semaphore 其实和锁有点类似,它一般用于控制对某组资源的访问权限。

#### volatile 关键字的作用(变量可见性、禁止重排序)
>Java 语言提供了一种稍弱的同步机制,即 volatile 变量,用来确保将变量的更新操作通知到其他线程。volatile 变量具备两种特性,volatile 变量不会被缓存在寄存器或者对其他处理器不可见的地方,因此在读取 volatile 类型的变量时总会返回最新写入的值。

**变量可见性**
其一是保证该变量对所有线程可见,这里的可见性指的是当一个线程修改了变量的值,那么新的
值对于其他线程是可以立即获取的。
**禁止重排序**
volatile 禁止了指令重排。
`比 sychronized 更轻量级的同步锁`
在访问 volatile 变量时不会执行加锁操作,因此也就不会使执行线程阻塞,因此 volatile 变量是一
种比 sychronized 关键字更轻量级的同步机制。volatile 适合这种场景:一个变量被多个线程共
享,线程直接给这个变量赋值。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/volatile.png)

>当对非 volatile 变量进行读写的时候,每个线程先从内存拷贝变量到 CPU 缓存中。如果计算机有
 多个 CPU,每个线程可能在不同的 CPU 上被处理,这意味着每个线程可以拷贝到不同的 CPU
 cache 中。而声明变量是 volatile 的,JVM 保证了每次读变量都从内存中读,跳过 CPU cache
 这一步。


**适用场景**  
值得说明的是对 volatile 变量的单次读/写操作可以保证原子性的,如 long 和 double 类型变量,
但是并不能保证 i++这种操作的原子性,因为本质上 i++是读、写两次操作。在某些场景下可以
代替 Synchronized。但是,volatile 的不能完全取代 Synchronized 的位置,只有在一些特殊的场景下,
才能适用 volatile。总的来说,必须同时满足下面两个条件才能保证在并发环境的线程安全:

(1)对变量的写操作不依赖于当前值(比如 i++),或者说是单纯的变量赋值(boolean flag = true)。

(2)该变量没有包含在具有其他变量的不变式中,也就是说,不同的 volatile 变量之间,不能互相依赖。只有在状态真正独立于程序内其他内容时才能使用 volatile。



## 如何在两个线程之间共享数据


Java 里面进行多线程通信的主要方式就是共享内存的方式,共享内存主要的关注点有两个:可见
性和有序性原子性。Java 内存模型(JMM)解决了可见性和有序性的问题,而锁解决了原子性的
问题,理想情况下我们希望做到“同步”和“互斥”。有以下常规实现方法:


`将数据抽象成一个类,并将数据的操作作为这个类的方法`

1.将数据抽象成一个类,并将对这个数据的操作作为这个类的方法,这么设计可以和容易做到同步,只要在方法上加”synchronized“

```java
public class Demo {
    public class MyData {
        private int j=0;
        public synchronized void add(){
            j++;
            System.out.println("线程"+Thread.currentThread().getName()+"j 为:"+j);
        }
        public synchronized void dec(){
            j--;
            System.out.println("线程"+Thread.currentThread().getName()+"j 为:"+j);
        }
        public int getData(){
            return j;
        }
    }
    public class AddRunnable implements Runnable{
        MyData data;
        public AddRunnable(MyData data){
            this.data= data;
        }
        public void run() {
            data.add();
        }
    }
    public class DecRunnable implements Runnable {
        MyData data;
        public DecRunnable(MyData data){
            this.data = data;
        }
        public void run() {
            data.dec();
        }
    }
    public static void main(String[] args) {
        MyData data = new MyData();
        Runnable add = new AddRunnable(data);
        Runnable dec = new DecRunnable(data);
        for (int i = 0; i < 2; i++) {
            new Thread(add).start();
            new Thread(dec).start();
        }
    }
}
```

Runnable 对象作为一个类的内部类
2.将 Runnable 对象作为一个类的内部类,共享数据作为这个类的成员变量,每个线程对共享数
据的操作方法也封装在外部类,以便实现对数据的各个操作的同步和互斥,作为内部类的各
个 Runnable 对象调用外部类的这些方法。

````java
public class MyData {
    private int j=0;
    public synchronized void add(){
        j++;
        System.out.println("线程"+Thread.currentThread().getName()+"j 为:"+j);
    }
    public synchronized void dec(){
        j--;
        System.out.println("线程"+Thread.currentThread().getName()+"j 为:"+j);
    }
    public int getData(){
        return j;}
}
public class TestThread {
    public static void main(String[] args) {
        final MyData data = new MyData();
        for(int i=0;i<2;i++){
            new Thread(new Runnable(){
                public void run() {
                    data.add();
                }
            }).start();
            new Thread(new Runnable(){
                public void run() {
                    data.dec();
                }
            }).start();
        }
    }
}
````


### ThreadLocal 作用( 线程本地存储 )

ThreadLocal,很多地方叫做线程本地变量,也有些地方叫做线程本地存储,ThreadLocal 的作用
是提供线程内的局部变量,这种变量在线程的生命周期内起作用,减少同一个线程内多个函数或
者组件之间一些公共变量的传递的复杂度。
ThreadLocalMap (线程的一个属性)
1.每个线程中都有一个自己的 ThreadLocalMap 类对象,可以将线程自己的对象保持到其中,各管各的,线程可以正确的访问到自己的对象。
2.将 一 个共 用的 ThreadLocal 静 态实 例作 为 key, 将 不同 对象 的引 用保存 到 不同 线程 的ThreadLocalMap 中,然后在线程执行的各处通过这个静态 ThreadLocal 实例的 get()方法取得自己线程保存的那个对象,避免了将这个对象作为参数传递的麻烦。
3.ThreadLocalMap 其实就是线程里面的一个属性,它在 Thread 类中定义`ThreadLocal.ThreadLocalMap threadLocals = null;`



![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/ThreadLocal.png)


**使用场景**
最常见的 ThreadLocal 使用场景为 用来解决 数据库连接、Session 管理等。
```java
 private static final ThreadLocal threadSession = new ThreadLocal();
    public static Session getSession() throws InfrastructureException {
        Session s = (Session) threadSession.get();
        try {
            if (s == null) {
                s = getSessionFactory().openSession();
                threadSession.set(s);
            }
        } catch (HibernateException ex) {
            throw new InfrastructureException(ex);
        }
        return s;
    }
```



### synchronized 和 ReentrantLock 的区别


**两者的共同点:**
1. 都是用来协调多线程对共享对象、变量的访问
2. 都是可重入锁,同一线程可以多次获得同一个锁
3. 都保证了可见性和互斥性

**两者的不同点:**
1. ReentrantLock 显示的获得、释放锁,synchronized 隐式获得释放锁
2. ReentrantLock 可响应中断、可轮回,synchronized 是不可以响应中断的,为处理锁的不可用性提供了更高的灵活性
3. ReentrantLock 是 API 级别的,synchronized 是 JVM 级别的
4. ReentrantLock 可以实现公平锁
5. ReentrantLock 通过 Condition 可以绑定多个条件
6. 底层实现不一样, synchronized 是同步阻塞,使用的是悲观并发策略,lock 是同步非阻塞,采用的是乐观并发策略
7.Lock 是一个接口,而 synchronized 是 Java 中的关键字,synchronized 是内置的语言实现。
8.synchronized 在发生异常时,会自动释放线程占有的锁,因此不会导致死锁现象发生;而 Lock 在发生异常时,如果没有主动通过 unLock()去释放锁,则很可能造成死锁现象,因此使用 Lock 时需要在 finally 块中释放锁。
9.Lock 可以让等待锁的线程响应中断,而 synchronized 却不行,使用 synchronized 时,等待的线程会一直等待下去,不能够响应中断。
10. 通过 Lock 可以知道有没有成功获取锁,而 synchronized 却无法办到。
11. Lock 可以提高多个线程进行读操作的效率,既就是实现读写锁等。

### ConcurrentHashMap 并发

减小锁粒度
>减小锁粒度是指缩小锁定对象的范围,从而减小锁冲突的可能性,从而提高系统的并发能力。减
小锁粒度是一种削弱多线程锁竞争的有效手段,这种技术典型的应用是 ConcurrentHashMap(高
性能的 HashMap)类的实现。对于 HashMap 而言,最重要的两个方法是 get 与 set 方法,如果我
们对整个 HashMap 加锁,可以得到线程安全的对象,但是加锁粒度太大。Segment 的大小也被
称为 ConcurrentHashMap 的并发度。

ConcurrentHashMap 分段锁
>ConcurrentHashMap,它内部细分了若干个小的 HashMap,称之为段(Segment)。默认情况下
一个 ConcurrentHashMap 被进一步细分为 16 个段,既就是锁的并发度。
如果需要在 ConcurrentHashMap 中添加一个新的表项,并不是将整个 HashMap 加锁,而是首
先根据 hashcode 得到该表项应该存放在哪个段中,然后对该段加锁,并完成 put 操作。在多线程
环境中,如果多个线程同时进行 put 操作,只要被加入的表项不存放在同一个段中,则线程间可以
做到真正的并行。

ConcurrentHashMap 是由 Segment 数组结构和 HashEntry 数组结构组成
>ConcurrentHashMap 是由 Segment 数组结构和 HashEntry 数组结构组成。Segment 是一种可
重入锁 ReentrantLock,在 ConcurrentHashMap 里扮演锁的角色,HashEntry 则用于存储键值
对数据。一个 ConcurrentHashMap 里包含一个 Segment 数组,Segment 的结构和 HashMap
类似,是一种数组和链表结构, 一个 Segment 里包含一个 HashEntry 数组,每个 HashEntry 是
一个链表结构的元素, 每个 Segment 守护一个 HashEntry 数组里的元素,当对 HashEntry 数组的
数据进行修改时,必须首先获得它对应的 Segment 锁。



![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/ConcurrentHashMap.png)


## Java 中用到的线程调度

抢占式调度:  
  >抢占式调度指的是每条线程执行的时间、线程的切换都由系统控制,系统控制指的是在系统某种
运行机制下,可能每条线程都分同样的执行时间片,也可能是某些线程执行的时间片较长,甚至
某些线程得不到执行的时间片。在这种机制下,一个线程的堵塞不会导致整个进程堵塞。

协同式调度:  
  >协同式调度指某一线程执行完后主动通知系统切换到另一线程上执行,这种模式就像接力赛一样,
一个人跑完自己的路程就把接力棒交接给下一个人,下个人继续往下跑。线程的执行时间由线程
本身控制,线程切换可以预知,不存在多线程同步问题,但它有一个致命弱点:如果一个线程编
写有问题,运行到一半就一直堵塞,那么可能导致整个系统崩溃。


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/threadway.png)


JVM 的线程调度实现(抢占式调度)
>java 使用的线程调使用抢占式调度,Java 中线程会按优先级分配 CPU 时间片运行,且优先级越高
越优先执行,但优先级高并不代表能独自占用执行时间片,可能是优先级高得到越多的执行时间
片,反之,优先级低的分到的执行时间少但不会分配不到执行时间。

线程让出 cpu 的情况:

1.当前运行线程主动放弃 CPU,JVM 暂时放弃 CPU 操作(基于时间片轮转调度的 JVM 操作系统不会让线程永久放弃 CPU,或者说放弃本次时间片的执行权),例如调用 yield()方法。
2. 当前运行线程因为某些原因进入阻塞状态,例如阻塞在 I/O 上。
3. 当前运行线程结束,即运行完 run()方法里面的任务。

### 进程调度算法

优先调度算法

1.先来先服务调度算法(FCFS)
当在作业调度中采用该算法时,每次调度都是从后备作业队列中选择一个或多个最先进入该队列的作业,将它们调入内存,为它们分配资源、创建进程,然后放入就绪队列。在进程调度中采用 FCFS 算法时,则每次调度是从就绪队列中选择一个最先进入该队列的进程,为之分配处理机,使之投入运行。该进程一直运行到完成或发生某事件而阻塞后才放弃处理机,特点是:算法比较简单,可以实现基本上的公平。

2.短作业(进程)优先调度算法
短作业优先(SJF)的调度算法是从后备队列中选择一个或若干个估计运行时间最短的作业,将它们调入内存运行。而短进程优先(SPF)调度算法则是从就绪队列中选出一个估计运行时间最短的进程,将处理机分配给它,使它立即执行并一直执行到完成,或发生某事件而被阻塞放弃处理机时再重新调度。该算法未照顾紧迫型作业。


### 高优先权优先调度算法
为了照顾紧迫型作业,使之在进入系统后便获得优先处理,引入了最高优先权优先(FPF)调度
算法。当把该算法用于作业调度时,系统将从后备队列中选择若干个优先权最高的作业装入内存。
当用于进程调度时,该算法是把处理机分配给就绪队列中优先权最高的进程。

1.非抢占式优先权算法
在这种方式下,系统一旦把处理机分配给就绪队列中优先权最高的进程后,该进程便一直执行下
去,直至完成;或因发生某事件使该进程放弃处理机时。这种调度算法主要用于批处理系统中;
也可用于某些对实时性要求不严的实时系统中。

2.抢占式优先权调度算法
在这种方式下,系统同样是把处理机分配给优先权最高的进程,使之执行。但在其执行期间,只
要又出现了另一个其优先权更高的进程,进程调度程序就立即停止当前进程(原优先权最高的进程)
的执行,重新将处理机分配给新到的优先权最高的进程。显然,这种抢占式的优先权调度算法能
更好地满足紧迫作业的要求,故而常用于要求比较严格的实时系统中,以及对性能要求较高的批
处理和分时系统中。

### 高响应比优先调度算法
在批处理系统中,短作业优先算法是一种比较好的算法,其主要的不足之处是长作业的运行
得不到保证。如果我们能为每个作业引入前面所述的动态优先权,并使作业的优先级随着等待时
间的增加而以速率 a 提高,则长作业在等待一定的时间后,必然有机会分配到处理机。该优先权的
变化规律可描述为:


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/hightresponse.png)


(1) 如果作业的等待时间相同,则要求服务的时间愈短,其优先权愈高,因而该算法有利于短作业。
(2) 当要求服务的时间相同时,作业的优先权决定于其等待时间,等待时间愈长,其优先权愈高,因而它实现的是先来先服务。
(3) 对于长作业,作业的优先级可以随等待时间的增加而提高,当其等待时间足够长时,其优先级便可升到很高,从而也可获得处理机。简言之,该算法既照顾了短作业,又考虑了作业到达的先后次序,不会使长作业长期得不到服务。因此,该算法实现了一种较好的折衷。当然,在利用该算法时,每要进行调度之前,都须先做响应比的计算,这会增加系统开销。

### 基于时间片的轮转调度算法

1.时间片轮转法
在早期的时间片轮转法中,系统将所有的就绪进程按先来先服务的原则排成一个队列,每次调度
时,把 CPU 分配给队首进程,并令其执行一个时间片。时间片的大小从几 ms 到几百 ms。当执行
的时间片用完时,由一个计时器发出时钟中断请求,调度程序便据此信号来停止该进程的执行,
并将它送往就绪队列的末尾;然后,再把处理机分配给就绪队列中新的队首进程,同时也让它执
行一个时间片。这样就可以保证就绪队列中的所有进程在一给定的时间内均能获得一时间片的处
理机执行时间。

2.多级反馈队列调度算法

(1) 应设置多个就绪队列,并为各个队列赋予不同的优先级。第一个队列的优先级最高,第二
个队列次之,其余各队列的优先权逐个降低。该算法赋予各个队列中进程执行时间片的大小也各
不相同,在优先权愈高的队列中,为每个进程所规定的执行时间片就愈小。例如,第二个队列的
时间片要比第一个队列的时间片长一倍,......,第 i+1 个队列的时间片要比第 i 个队列的时间片长
一倍。

(2) 当一个新进程进入内存后,首先将它放入第一队列的末尾,按 FCFS 原则排队等待调度。当
轮到该进程执行时,如它能在该时间片内完成,便可准备撤离系统;如果它在一个时间片结束时
尚未完成,调度程序便将该进程转入第二队列的末尾,再同样地按 FCFS 原则等待调度执行;如果
它在第二队列中运行一个时间片后仍未完成,再依次将它放入第三队列,......,如此下去,当一个
长作业(进程)从第一队列依次降到第 n 队列后,在第 n 队列便采取按时间片轮转的方式运行。

(3) 仅当第一队列空闲时,调度程序才调度第二队列中的进程运行;仅当第 1~(i-1)队列均空时,
才会调度第 i 队列中的进程运行。如果处理机正在第 i 队列中为某进程服务时,又有新进程进入优
先权较高的队列(第 1~(i-1)中的任何一个队列),则此时新进程将抢占正在运行进程的处理机,即
由调度程序把正在运行的进程放回到第 i 队列的末尾,把处理机分配给新到的高优先权进程。
在多级反馈队列调度算法中,如果规定第一个队列的时间片略大于多数人机交互所需之处理时间
时,便能够较好的满足各种类型用户的需要。


# 什么是 CAS( 比较并交换-乐观锁机制-锁自旋 )

### 概念及特性

>CAS(Compare And Swap/Set)比较并交换,CAS 算法的过程是这样:它包含 3 个参数
CAS(V,E,N)。V 表示要更新的变量(内存值),E 表示预期值(旧的),N 表示新值。当且仅当 V 值等
于 E 值时,才会将 V 的值设为 N,如果 V 值和 E 值不同,则说明已经有其他线程做了更新,则当
前线程什么都不做。最后,CAS 返回当前 V 的真实值。
CAS 操作是抱着乐观的态度进行的(乐观锁),它总是认为自己可以成功完成操作。当多个线程同时
使用 CAS 操作一个变量时,只有一个会胜出,并成功更新,其余均会失败。失败的线程不会被挂
起,仅是被告知失败,并且允许再次尝试,当然也允许失败的线程放弃操作。基于这样的原理,
CAS 操作即使没有锁,也可以发现其他线程对当前线程的干扰,并进行恰当的处理。

### 原子包 java.util.concurrent.atomic(锁自旋)

>JDK1.5 的原子包:java.util.concurrent.atomic 这个包里面提供了一组原子类。其基本的特性就
是在多线程环境下,当有多个线程同时执行这些类的实例包含的方法时,具有排他性,即当某个
线程进入方法,执行其中的指令时,不会被其他线程打断,而别的线程就像自旋锁一样,一直等
到该方法执行完成,才由 JVM 从等待队列中选择一个另一个线程进入,这只是一种逻辑上的理解。
相对于对于 synchronized 这种阻塞算法,CAS 是非阻塞算法的一种常见实现。由于一般 CPU 切
换时间比 CPU 指令集操作更加长, 所以 J.U.C 在性能上有了很大的提升。如下代码:

```java
public class AtomicInteger extends Number implements java.io.Serializable {
    private volatile int value;
    public final int get() {
        return value;
    }
    public final int getAndIncrement() {
        for (;;) { //CAS 自旋,一直尝试,直达成功
            int current = get();
            int next = current + 1;
            if (compareAndSet(current, next))
                return current;
        }
    }
    public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }
}
```

getAndIncrement 采用了 CAS 操作,每次从内存中读取数据然后将此数据和+1 后的结果进行
CAS 操作,如果成功就返回结果,否则重试直到成功为止。而 compareAndSet 利用 JNI 来完成
CPU 指令的操作。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/CAS.png)

### ABA 问题
CAS 会导致“ABA 问题”。CAS 算法实现一个重要前提需要取出内存中某时刻的数据,而在下时
刻比较并替换,那么在这个时间差类会导致数据的变化。
比如说一个线程 one 从内存位置 V 中取出 A,这时候另一个线程 two 也从内存中取出 A,并且
two 进行了一些操作变成了 B,然后 two 又将 V 位置的数据变成 A,这时候线程 one 进行 CAS 操
作发现内存中仍然是 A,然后 one 操作成功。尽管线程 one 的 CAS 操作成功,但是不代表这个过
程就是没有问题的。
部分乐观锁的实现是通过版本号(version)的方式来解决 ABA 问题,乐观锁每次在执行数据的修
改操作时,都会带上一个版本号,一旦版本号和数据的版本号一致就可以执行修改操作并对版本
号执行+1 操作,否则就执行失败。因为每次操作的版本号都会随之增加,所以不会出现 ABA 问
题,因为版本号只会增加不会减少。

### 什么是 AQS( 抽象的队列同步器 )
AbstractQueuedSynchronizer 类如其名,抽象的队列式的同步器,AQS 定义了一套多线程访问
共享资源的同步器框架,许多同步类实现都依赖于它,如常用的
`ReentrantLock/Semaphore/CountDownLatch`。


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/ABA.png)

它维护了一个 volatile int state(代表共享资源)和一个 FIFO 线程等待队列(多线程争用资源被
阻塞时会进入此队列)。这里 volatile 是核心关键词,具体 volatile 的语义,在此不述。state 的
访问方式有三种:
- getState()
- setState()
- compareAndSetState()

### AQS 定义两种资源共享方式
- Exclusive 独占资源 -ReentrantLock
- Exclusive(独占,只有一个线程能执行,如 ReentrantLock)
- Share 共享资源 -Semaphore/CountDownLatch
- Share(共享,多个线程可同时执行,如 Semaphore/CountDownLatch)。

AQS 只是一个框架,具体资源的获取/释放方式交由自定义同步器去实现,AQS 这里只定义了一个接口,具体资源的获取交由自定义同步器去实现了(通过 state 的 get/set/CAS)之所以没有定义成
abstract , 是 因 为 独 占 模 式 下 只 用 实 现 tryAcquire-tryRelease , 而 共 享 模 式 下 只 用 实 现tryAcquireShared-tryReleaseShared。如果都定义成 abstract,那么每个模式也要去实现另一模式下的接口。不同的自定义同步器争用共享资源的方式也不同。自定义同步器在实现时只需要实现共享资源 state 的获取与释放方式即可,至于具体线程等待队列的维护(如获取资源失败入队/唤醒出队等),AQS 已经在顶层实现好了。自定义同步器实现时主要实现以下几种方法:
1. isHeldExclusively():该线程是否正在独占资源。只有用到 condition 才需要去实现它。
2. tryAcquire(int):独占方式。尝试获取资源,成功则返回 true,失败则返回 false。
3. tryRelease(int):独占方式。尝试释放资源,成功则返回 true,失败则返回 false。
4. tryAcquireShared(int):共享方式。尝试获取资源。负数表示失败;0 表示成功,但没有剩余可用资源;正数表示成功,且有剩余资源。
5. tryReleaseShared(int):共享方式。尝试释放资源,如果释放后允许唤醒后续等待结点返回true,否则返回 false。


### 同步器的实现是 ABS 核心( state 资源状态计数)
同步器的实现是 ABS 核心,以 ReentrantLock 为例,state 初始化为 0,表示未锁定状态。A 线程
lock()时,会调用 tryAcquire()独占该锁并将 state+1。此后,其他线程再 tryAcquire()时就会失
败,直到 A 线程 unlock()到 state=0(即释放锁)为止,其它线程才有机会获取该锁。当然,释放
锁之前,A 线程自己是可以重复获取此锁的(state 会累加),这就是可重入的概念。但要注意,
获取多少次就要释放多么次,这样才能保证 state 是能回到零态的。
以 CountDownLatch 以例,任务分为 N 个子线程去执行,state 也初始化为 N(注意 N 要与
线程个数一致)。这 N 个子线程是并行执行的,每个子线程执行完后 countDown()一次,state
会 CAS 减 1。等到所有子线程都执行完后(即 state=0),会 unpark()主调用线程,然后主调用线程
就会从 await()函数返回,继续后余动作。

### ReentrantReadWriteLock 实现独占和共享两种方式

一般来说,自定义同步器要么是独占方法,要么是共享方式,他们也只需实现 tryAcquire-tryRelease、tryAcquireShared-tryReleaseShared 中的一种即可。但 AQS 也支持自定义同步器同时实现独占和共享两种方式,如 ReentrantReadWriteLock。  


 