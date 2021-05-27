---
title: Java篇-死锁的排查方法
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/javabingfa.jpeg
date: 2020-12-21 09:28:01
category: Java相关
tags: 死锁排查
---

# 死锁成立条件

1、`互斥`：某种资源一次只允许一个进程访问，即该资源一旦分配给某个进程，其他进程就不能再访问，直到该进程访问结束。
2、`占有且等待`：一个进程本身占有资源（一种或多种），同时还有资源未得到满足，正在等待其他进程释放该资源。
3、`不可抢占`：别人已经占有了某项资源，你不能因为自己也需要该资源，就去把别人的资源抢过来。
4、`循环等待`：存在一个进程链，使得每个进程都占有下一个进程所需的至少一种资源。

# 如何排查死锁

- jps 查看进程
- jstack 打印堆栈信息
- jconsole 可视化查看详情


# 简单排查示例

<details>
  <summary><span>展开代码</span></summary>
  <br>

```java

public class DeadLock implements Runnable{
    private String lockA;
    private String lockB;
    public DeadLock(String lockA, String lockB) {
        this.lockA = lockA;
        this.lockB = lockB;
    }
    @Override
    public void run() {
        synchronized (lockA){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (lockB){
            }
        }
    }
    public static void main(String[] args) {
        String lockA="lockA";
        String lockB="lockB";
        new Thread(new DeadLock(lockA,lockB),"ThreadAA").start();
        new Thread(new DeadLock(lockB,lockA),"ThreadBB").start();
    }
}
```
</details>

```shell
ikey@mikey:~/Downloads/sdkmoderation/algorithm$ jps
31408 Jps
30899 Launcher
30902 DeadLock
4235 Main
mikey@mikey:~/Downloads/sdkmoderation/algorithm$ jstack 30902
2020-12-21 22:39:40
Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.221-b11 mixed mode):

"Attach Listener" #13 daemon prio=9 os_prio=0 tid=0x00007f60fc001000 nid=0x78e8 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"DestroyJavaVM" #12 prio=5 os_prio=0 tid=0x00007f613c00d800 nid=0x78b7 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"ThreadBB" #11 prio=5 os_prio=0 tid=0x00007f613c20e000 nid=0x78e2 waiting for monitor entry [0x00007f6126944000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at demo.DeadLock.run(DeadLock.java:22)
        - waiting to lock <0x000000076d283280> (a java.lang.String)
        - locked <0x000000076d2832b8> (a java.lang.String)
        at java.lang.Thread.run(Thread.java:748)

"ThreadAA" #10 prio=5 os_prio=0 tid=0x00007f613c20c800 nid=0x78e1 waiting for monitor entry [0x00007f6126a45000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at demo.DeadLock.run(DeadLock.java:22)
        - waiting to lock <0x000000076d2832b8> (a java.lang.String)
        - locked <0x000000076d283280> (a java.lang.String)
        at java.lang.Thread.run(Thread.java:748)

"Service Thread" #9 daemon prio=9 os_prio=0 tid=0x00007f613c207800 nid=0x78df runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread2" #8 daemon prio=9 os_prio=0 tid=0x00007f613c204000 nid=0x78de waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread1" #7 daemon prio=9 os_prio=0 tid=0x00007f613c202000 nid=0x78dd waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread0" #6 daemon prio=9 os_prio=0 tid=0x00007f613c200800 nid=0x78dc waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Monitor Ctrl-Break" #5 daemon prio=5 os_prio=0 tid=0x00007f613c1fe000 nid=0x78db runnable [0x00007f6127262000]
   java.lang.Thread.State: RUNNABLE
        at java.net.SocketInputStream.socketRead0(Native Method)
        at java.net.SocketInputStream.socketRead(SocketInputStream.java:116)
        at java.net.SocketInputStream.read(SocketInputStream.java:171)
        at java.net.SocketInputStream.read(SocketInputStream.java:141)
        at sun.nio.cs.StreamDecoder.readBytes(StreamDecoder.java:284)
        at sun.nio.cs.StreamDecoder.implRead(StreamDecoder.java:326)
        at sun.nio.cs.StreamDecoder.read(StreamDecoder.java:178)
        - locked <0x000000076d2fa148> (a java.io.InputStreamReader)
        at java.io.InputStreamReader.read(InputStreamReader.java:184)
        at java.io.BufferedReader.fill(BufferedReader.java:161)
        at java.io.BufferedReader.readLine(BufferedReader.java:324)
        - locked <0x000000076d2fa148> (a java.io.InputStreamReader)
        at java.io.BufferedReader.readLine(BufferedReader.java:389)
        at com.intellij.rt.execution.application.AppMainV2$1.run(AppMainV2.java:47)

"Signal Dispatcher" #4 daemon prio=9 os_prio=0 tid=0x00007f613c183000 nid=0x78c6 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Finalizer" #3 daemon prio=8 os_prio=0 tid=0x00007f613c151000 nid=0x78c5 in Object.wait() [0x00007f61278f7000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x000000076d188ed8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:144)
        - locked <0x000000076d188ed8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:165)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:216)

"Reference Handler" #2 daemon prio=10 os_prio=0 tid=0x00007f613c14c800 nid=0x78c4 in Object.wait() [0x00007f61279f8000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x000000076d186c00> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:502)
        at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
        - locked <0x000000076d186c00> (a java.lang.ref.Reference$Lock)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"VM Thread" os_prio=0 tid=0x00007f613c143000 nid=0x78c1 runnable 

"GC task thread#0 (ParallelGC)" os_prio=0 tid=0x00007f613c023800 nid=0x78bc runnable 

"GC task thread#1 (ParallelGC)" os_prio=0 tid=0x00007f613c025000 nid=0x78bd runnable 

"GC task thread#2 (ParallelGC)" os_prio=0 tid=0x00007f613c027000 nid=0x78be runnable 

"GC task thread#3 (ParallelGC)" os_prio=0 tid=0x00007f613c028800 nid=0x78bf runnable 

"VM Periodic Task Thread" os_prio=0 tid=0x00007f613c20a000 nid=0x78e0 waiting on condition 

JNI global references: 12


Found one Java-level deadlock:
=============================
"ThreadBB":
  waiting to lock monitor 0x00007f6104006528 (object 0x000000076d283280, a java.lang.String),
  which is held by "ThreadAA"
"ThreadAA":
  waiting to lock monitor 0x00007f6104005088 (object 0x000000076d2832b8, a java.lang.String),
  which is held by "ThreadBB"

Java stack information for the threads listed above:
===================================================
"ThreadBB":
        at demo.DeadLock.run(DeadLock.java:22)
        - waiting to lock <0x000000076d283280> (a java.lang.String)
        - locked <0x000000076d2832b8> (a java.lang.String)
        at java.lang.Thread.run(Thread.java:748)
"ThreadAA":
        at demo.DeadLock.run(DeadLock.java:22)
        - waiting to lock <0x000000076d2832b8> (a java.lang.String)
        - locked <0x000000076d283280> (a java.lang.String)
        at java.lang.Thread.run(Thread.java:748)

Found 1 deadlock.

```


# 参考相关资料

[如何快速排查死锁？如何避免死锁？（值得收藏）](https://blog.csdn.net/yuandengta/article/details/107189812)   


 