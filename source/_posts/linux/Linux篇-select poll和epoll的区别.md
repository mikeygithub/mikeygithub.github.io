---
title: Linux篇-I/O多路复用之select、poll和epoll的区别
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/select-poll-epoll.png
date: 2020-12-03 17:45:11
category: Linux学习
tags: I/O
---

# 用户态和内核态

- 首先，我们明确一个概念，Linux所谓的用户态和内核态，本质是对CPU提供的功能的一层封装抽象。现代CPU，其设计目标主要是为了完美高效的实现一个多任务系统，多任务系统的三个核心特征是：权限分级、数据隔离和任务切换。
以X86_64架构为例，权限分级通过CPU的多模式机制和分段机制实现，数据隔离通过分页机制实现，任务切换通过中断机制和任务机制（TR/TSS）实现。

- 然后，给内核态和用户态一个相对精确的概念定义。内核态和用户态的概念，是Linux为了有效实现CPU的权限分级和数据隔离的目标而出现的，是通过组合CPU的分段机制+分页机制而形成的。
还是以X86_64架构为例，在当CPU处于保护模式下时（X86_64CPU有5种模式，保护模式是其中之一，此时CPU.CR0.PE=1），当CPU.CS=系统代码段时（CS.CPL=0）为内核态，此时通过CPU的指令有操控全部寄存器的权限（包括FLAGS和CR寄存器），
当CPU.CS=用户代码段时（CS.CPL=3）为用户态，此时通过CPU的指令只有操控部分寄存器的权限。

- 所谓“一个进程主动跳进内核态”，是指该进程中的一个执行线程通过INT或者SYSCALL指令，使得当前线程的CS=系统代码段（这里还有不同的细节，不多说了）。

- 每个用户进程都有自己的虚拟地址空间，用户进程之间切换的时候，通过切换页表（CR3）来实现，不用改CS寄存器和DS寄存器。所以没有“代码映射在0-3G”一说。
就像班级名称和学号，同样的学号在不同的班级代表不同的人，同样的虚拟地址在不同的页表中代表不同的物理内存空间。

- 内核态允许多个用户线程同时进入，不存在阻塞的现象，尤其是多核CPU的情况下。

- 除了用户线程可以进入内核态之外，还有内核线程，即内核自己要干的事情，这种线程只运行在内核态。

<br>

从CPU的寄存器视角看，指令运行所处的三种CPU状态
![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/keylin-1.jpg)

从Linux线程角度看，指令运行所处的两种状态（要么属于某线程，要么黑色切换中)
![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/keylin-2.jpg)

Linux下，线程类型*CPU状态决定数据空间
![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/keylin-3.jpg)

<br>

[Linux用户态和内核态怎么理解？ - 知乎](https://www.zhihu.com/question/397142622/answer/1246315406)

# Linux I/O模型

[Linux五种IO模型](https://blog.csdn.net/z_ryan/article/details/80873449)


[Linux下常见的IO模型](https://www.cnblogs.com/luyucheng/p/6249551.html)


# select模型


>epoll跟select都能提供多路I/O复用的解决方案。在现在的Linux内核里有都能够支持，其中epoll是Linux所特有，而select则应该是POSIX所规定，一般操作系统均有实现

select本质上是通过`设置或者检查存放fd标志位的数据结构`来进行下一步处理。这样所带来的缺点是：

1、 单个进程可监视的fd数量被限制，即能监听端口的大小有限。

      一般来说这个数目和系统内存关系很大，具体数目可以cat /proc/sys/fs/file-max察看。32位机默认是1024个。64位机默认是2048.

2、 对socket进行扫描时是线性扫描，即采用轮询的方法，效率较低：

       当套接字比较多的时候，每次select()都要通过遍历FD_SETSIZE个Socket来完成调度,不管哪个Socket是活跃的,都遍历一遍。这会浪费很多CPU时间。如果能给套接字注册某个回调函数，当他们活跃时，自动完成相关操作，那就避免了轮询，这正是epoll与kqueue做的。

3、需要维护一个用来存放大量fd的数据结构，这样会使得用户空间和内核空间在传递该结构时复制开销大


`fd`全称是file descriptor,是进程独有的文件描述符表的索引

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/select-process.png)

# poll 模型

poll本质上和select没有区别，它将用户传入的数组拷贝到内核空间，然后查询每个fd对应的设备状态，如果设备就绪则在设备等待队列中加入一项并继续遍历，如果遍历完所有fd后没有发现就绪设备，则挂起当前进程，直到设备就绪或者主动超时，被唤醒后它又要再次遍历fd。这个过程经历了多次无谓的遍历。

它没有最大连接数的限制，原因是它是基于`链表`来存储的，但是同样有一个缺点：

1、大量的fd的数组被整体复制于用户态和内核地址空间之间，而不管这样的复制是不是有意义。                   

2、poll还有一个特点是“水平触发”，如果报告了fd后，没有被处理，那么下次poll时会再次报告该fd。

# epoll模型

epoll有EPOLLLT和EPOLLET两种触发模式，LT是默认的模式，ET是“高速”模式。LT模式下，只要这个fd还有数据可读，每次 epoll_wait都会返回它的事件，提醒用户程序去操作，而在ET（边缘触发）模式中，它只会提示一次，直到下次再有数据流入之前都不会再提示了，无 论fd中是否还有数据可读。所以在ET模式下，read一个fd的时候一定要把它的buffer读光，也就是说一直读到read的返回值小于请求值，或者 遇到EAGAIN错误。还有一个特点是，epoll使用“事件”的就绪通知方式，通过epoll_ctl注册fd，一旦该fd就绪，内核就会采用类似callback的回调机制来激活该fd，epoll_wait便可以收到通知。

epoll为什么要有EPOLLET触发模式？

如果采用EPOLLLT模式的话，系统中一旦有大量你不需要读写的就绪文件描述符，它们每次调用epoll_wait都会返回，这样会大大降低处理程序检索自己关心的就绪文件描述符的效率.。而采用EPOLLET这种边沿触发模式的话，当被监控的文件描述符上有可读写事件发生时，epoll_wait()会通知处理程序去读写。如果这次没有把数据全部读写完(如读写缓冲区太小)，那么下次调用epoll_wait()时，它不会通知你，也就是它只会通知你一次，直到该文件描述符上出现第二次可读写事件才会通知你！！！这种模式比水平触发效率高，系统不会充斥大量你不关心的就绪文件描述符

epoll的优点

1、没有最大并发连接的限制，能打开的FD的上限远大于1024（1G的内存上能监听约10万个端口）；
2、效率提升，不是轮询的方式，不会随着FD数目的增加效率下降。只有活跃可用的FD才会调用callback函数；
即Epoll最大的优点就在于它只管你“活跃”的连接，而跟连接总数无关，因此在实际的网络环境中，Epoll的效率就会远远高于select和poll。

3、 内存拷贝，利用mmap()文件映射内存加速与内核空间的消息传递；即epoll使用mmap减少复制开销。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/epoll-process.png)

# 区别总结

1、支持一个进程所能打开的最大连接数

select

>单个进程所能打开的最大连接数有FD_SETSIZE宏定义，其大小是32个整数的大小（在32位的机器上，大小就是3232，同理64位机器上FD_SETSIZE为3264），当然我们可以对进行修改，然后重新编译内核，但是性能可能会受到影响，这需要进一步的测试。

poll

>poll本质上和select没有区别，但是它没有最大连接数的限制，原因是它是基于链表来存储的

epoll

>虽然连接数有上限，但是很大，1G内存的机器上可以打开10万左右的连接，2G内存的机器可以打开20万左右的连接

2、FD剧增后带来的IO效率问题

select

>因为每次调用时都会对连接进行线性遍历，所以随着FD的增加会造成遍历速度慢的“线性下降性能问题”。

poll

>同上

epoll

>因为epoll内核中实现是根据每个fd上的callback函数来实现的，只有活跃的socket才会主动调用callback，所以在活跃socket较少的情况下，使用epoll没有前面两者的线性下降的性能问题，但是所有socket都很活跃的情况下，可能会有性能问题。

3、 消息传递方式

select

>内核需要将消息传递到用户空间，都需要内核拷贝动作

poll

>同上

epoll

>epoll通过内核和用户空间共享一块内存来实现的。

**总结**

综上，在选择select，poll，epoll时要根据具体的使用场合以及这三种方式的自身特点。

1、表面上看epoll的性能最好，但是在连接数少并且连接都十分活跃的情况下，select和poll的性能可能比epoll好，毕竟epoll的通知机制需要很多函数回调。

2、select低效是因为每次它都需要轮询。但低效也是相对的，视情况而定，也可通过良好的设计改善


# 底层代码

```text
EPOLL(7)                                                                                  Linux Programmer's Manual                                                                                  EPOLL(7)

NAME
       epoll - I/O event notification facility

SYNOPSIS
       #include <sys/epoll.h>

DESCRIPTION
       The  epoll  API  performs a similar task to poll(2): monitoring multiple file descriptors to see if I/O is possible on any of them.  The epoll API can be used either as an edge-triggered or a level-
       triggered interface and scales well to large numbers of watched file descriptors.  The following system calls are provided to create and manage an epoll instance:

       *  epoll_create(2) creates a new epoll instance and returns a file descriptor referring to that instance.  (The more recent epoll_create1(2) extends the functionality of epoll_create(2).)

       *  Interest in particular file descriptors is then registered via epoll_ctl(2).  The set of file descriptors currently registered on an epoll instance is sometimes called an epoll set.

       *  epoll_wait(2) waits for I/O events, blocking the calling thread if no events are currently available.

   Level-triggered and edge-triggered
       The epoll event distribution interface is able to behave both as edge-triggered (ET) and as level-triggered (LT).  The difference between the two mechanisms can be  described  as  follows.   Suppose
       that this scenario happens:

       1. The file descriptor that represents the read side of a pipe (rfd) is registered on the epoll instance.

       2. A pipe writer writes 2 kB of data on the write side of the pipe.

       3. A call to epoll_wait(2) is done that will return rfd as a ready file descriptor.

       4. The pipe reader reads 1 kB of data from rfd.

       5. A call to epoll_wait(2) is done.

       If the rfd file descriptor has been added to the epoll interface using the EPOLLET (edge-triggered) flag, the call to epoll_wait(2) done in step 5 will probably hang despite the available data still
       present in the file input buffer; meanwhile the remote peer might be expecting a response based on the data it already sent.  The reason for this is that edge-triggered  mode  delivers  events  only
       when  changes occur on the monitored file descriptor.  So, in step 5 the caller might end up waiting for some data that is already present inside the input buffer.  In the above example, an event on
       rfd will be generated because of the write done in 2 and the event is consumed in 3.  Since the read operation done in 4 does not consume the whole buffer data, the call  to  epoll_wait(2)  done  in
       step 5 might block indefinitely.

       An application that employs the EPOLLET flag should use nonblocking file descriptors to avoid having a blocking read or write starve a task that is handling multiple file descriptors.  The suggested
       way to use epoll as an edge-triggered (EPOLLET) interface is as follows:

              i   with nonblocking file descriptors; and

              ii  by waiting for an event only after read(2) or write(2) return EAGAIN.

       By contrast, when used as a level-triggered interface (the default, when EPOLLET is not specified), epoll is simply a faster poll(2), and can be used wherever the latter is used since it shares  the
       same semantics.

       Since  even  with edge-triggered epoll, multiple events can be generated upon receipt of multiple chunks of data, the caller has the option to specify the EPOLLONESHOT flag, to tell epoll to disable
       the associated file descriptor after the receipt of an event with epoll_wait(2).  When the EPOLLONESHOT flag is specified, it is the caller's  responsibility  to  rearm  the  file  descriptor  using
       epoll_ctl(2) with EPOLL_CTL_MOD.

   Interaction with autosleep
       If  the system is in autosleep mode via /sys/power/autosleep and an event happens which wakes the device from sleep, the device driver will keep the device awake only until that event is queued.  To
       keep the device awake until the event has been processed, it is necessary to use the epoll_ctl(2) EPOLLWAKEUP flag.

       When the EPOLLWAKEUP flag is set in the events field for a struct epoll_event, the system will be kept awake from the moment the event is queued, through the epoll_wait(2)  call  which  returns  the
       event until the subsequent epoll_wait(2) call.  If the event should keep the system awake beyond that time, then a separate wake_lock should be taken before the second epoll_wait(2) call.

   /proc interfaces
       The following interfaces can be used to limit the amount of kernel memory consumed by epoll:

       /proc/sys/fs/epoll/max_user_watches (since Linux 2.6.28)
              This  specifies  a  limit  on  the  total  number  of file descriptors that a user can register across all epoll instances on the system.  The limit is per real user ID.  Each registered file
              descriptor costs roughly 90 bytes on a 32-bit kernel, and roughly 160 bytes on a 64-bit kernel.  Currently, the default value for max_user_watches is 1/25 (4%) of the  available  low  memory,
              divided by the registration cost in bytes.

   Example for suggested usage
       While the usage of epoll when employed as a level-triggered interface does have the same semantics as poll(2), the edge-triggered usage requires more clarification to avoid stalls in the application
       event loop.  In this example, listener is a nonblocking socket on which listen(2) has been called.  The function do_use_fd() uses the new ready file descriptor until EAGAIN  is  returned  by  either
       read(2)  or write(2).  An event-driven state machine application should, after having received EAGAIN, record its current state so that at the next call to do_use_fd() it will continue to read(2) or
       write(2) from where it stopped before.
```

```cgo
           #define MAX_EVENTS 10
           struct epoll_event ev, events[MAX_EVENTS];
           int listen_sock, conn_sock, nfds, epollfd;

           /* Code to set up listening socket, 'listen_sock',
              (socket(), bind(), listen()) omitted */

           epollfd = epoll_create1(0);
           if (epollfd == -1) {
               perror("epoll_create1");
               exit(EXIT_FAILURE);
           }

           ev.events = EPOLLIN;
           ev.data.fd = listen_sock;
           if (epoll_ctl(epollfd, EPOLL_CTL_ADD, listen_sock, &ev) == -1) {
               perror("epoll_ctl: listen_sock");
               exit(EXIT_FAILURE);
           }

           for (;;) {
               nfds = epoll_wait(epollfd, events, MAX_EVENTS, -1);
               if (nfds == -1) {
                   perror("epoll_wait");
                   exit(EXIT_FAILURE);
               }

               for (n = 0; n < nfds; ++n) {
                   if (events[n].data.fd == listen_sock) {
                       conn_sock = accept(listen_sock,
                                          (struct sockaddr *) &addr, &addrlen);
                       if (conn_sock == -1) {
                           perror("accept");
                           exit(EXIT_FAILURE);
                       }
                       setnonblocking(conn_sock);
                       ev.events = EPOLLIN | EPOLLET;
                       ev.data.fd = conn_sock;
                       if (epoll_ctl(epollfd, EPOLL_CTL_ADD, conn_sock,
                                   &ev) == -1) {
                           perror("epoll_ctl: conn_sock");
                           exit(EXIT_FAILURE);
                       }
                   } else {
                       do_use_fd(events[n].data.fd);
                   }
               }
           }
``` 

```text
       When used as an edge-triggered interface, for performance reasons, it is possible to add the file descriptor inside the epoll interface (EPOLL_CTL_ADD) once by specifying  (EPOLLIN|EPOLLOUT).   This
       allows you to avoid continuously switching between EPOLLIN and EPOLLOUT calling epoll_ctl(2) with EPOLL_CTL_MOD.

   Questions and answers
       Q0  What is the key used to distinguish the file descriptors registered in an epoll set?

       A0  The key is the combination of the file descriptor number and the open file description (also known as an "open file handle", the kernel's internal representation of an open file).

       Q1  What happens if you register the same file descriptor on an epoll instance twice?

       A1  You will probably get EEXIST.  However, it is possible to add a duplicate (dup(2), dup2(2), fcntl(2) F_DUPFD) file descriptor to the same epoll instance.  This can be a useful technique for fil‐
           tering events, if the duplicate file descriptors are registered with different events masks.

       Q2  Can two epoll instances wait for the same file descriptor?  If so, are events reported to both epoll file descriptors?

       A2  Yes, and events would be reported to both.  However, careful programming may be needed to do this correctly.

       Q3  Is the epoll file descriptor itself poll/epoll/selectable?

       A3  Yes.  If an epoll file descriptor has events waiting, then it will indicate as being readable.

       Q4  What happens if one attempts to put an epoll file descriptor into its own file descriptor set?

       A4  The epoll_ctl(2) call fails (EINVAL).  However, you can add an epoll file descriptor inside another epoll file descriptor set.

       Q5  Can I send an epoll file descriptor over a UNIX domain socket to another process?

       A5  Yes, but it does not make sense to do this, since the receiving process would not have copies of the file descriptors in the epoll set.

       Q6  Will closing a file descriptor cause it to be removed from all epoll sets automatically?

       A6  Yes, but be aware of the following point.  A file descriptor is a reference to an open file description (see open(2)).  Whenever a file descriptor is duplicated  via  dup(2),  dup2(2),  fcntl(2)
           F_DUPFD,  or  fork(2),  a new file descriptor referring to the same open file description is created.  An open file description continues to exist until all file descriptors referring to it have
           been closed.  A file descriptor is removed from an epoll set only after all the file descriptors referring to the underlying open file description  have  been  closed  (or  before  if  the  file
           descriptor  is  explicitly  removed using epoll_ctl(2) EPOLL_CTL_DEL).  This means that even after a file descriptor that is part of an epoll set has been closed, events may be reported for that
           file descriptor if other file descriptors referring to the same underlying file description remain open.

       Q7  If more than one event occurs between epoll_wait(2) calls, are they combined or reported separately?

       A7  They will be combined.

       Q8  Does an operation on a file descriptor affect the already collected but not yet reported events?

       A8  You can do two operations on an existing file descriptor.  Remove would be meaningless for this case.  Modify will reread available I/O.

       Q9  Do I need to continuously read/write a file descriptor until EAGAIN when using the EPOLLET flag (edge-triggered behavior) ?

       A9  Receiving an event from epoll_wait(2) should suggest to you that such file descriptor is ready for the requested I/O  operation.   You  must  consider  it  ready  until  the  next  (nonblocking)
           read/write yields EAGAIN.  When and how you will use the file descriptor is entirely up to you.

           For packet/token-oriented files (e.g., datagram socket, terminal in canonical mode), the only way to detect the end of the read/write I/O space is to continue to read/write until EAGAIN.

           For  stream-oriented  files (e.g., pipe, FIFO, stream socket), the condition that the read/write I/O space is exhausted can also be detected by checking the amount of data read from / written to
           the target file descriptor.  For example, if you call read(2) by asking to read a certain amount of data and read(2) returns a lower number of bytes, you can be sure of having exhausted the read
           I/O  space  for  the  file  descriptor.  The same is true when writing using write(2).  (Avoid this latter technique if you cannot guarantee that the monitored file descriptor always refers to a
           stream-oriented file.)

   Possible pitfalls and ways to avoid them
       o Starvation (edge-triggered)

       If there is a large amount of I/O space, it is possible that by trying to drain it the other files will not get processed causing starvation.  (This problem is not specific to epoll.)

       The solution is to maintain a ready list and mark the file descriptor as ready in its associated data structure, thereby allowing the application to remember which files need  to  be  processed  but
       still round robin amongst all the ready files.  This also supports ignoring subsequent events you receive for file descriptors that are already ready.

       o If using an event cache...

       If  you use an event cache or store all the file descriptors returned from epoll_wait(2), then make sure to provide a way to mark its closure dynamically (i.e., caused by a previous event's process‐
       ing).  Suppose you receive 100 events from epoll_wait(2), and in event #47 a condition causes event #13 to be closed.  If you remove the structure and close(2) the file  descriptor  for  event  #13,
       then your event cache might still say there are events waiting for that file descriptor causing confusion.

       One  solution  for this is to call, during the processing of event 47, epoll_ctl(EPOLL_CTL_DEL) to delete file descriptor 13 and close(2), then mark its associated data structure as removed and link
       it to a cleanup list.  If you find another event for file descriptor 13 in your batch processing, you will discover the file descriptor had been previously removed and there will be no confusion.

VERSIONS
       The epoll API was introduced in Linux kernel 2.5.44.  Support was added to glibc in version 2.3.2.

CONFORMING TO
       The epoll API is Linux-specific.  Some other systems provide similar mechanisms, for example, FreeBSD has kqueue, and Solaris has /dev/poll.

NOTES
       The set of file descriptors that is being monitored via an epoll file descriptor can be viewed via the entry for the epoll file descriptor in the process's /proc/[pid]/fdinfo directory.  See proc(5)
       for further details.

       The kcmp(2) KCMP_EPOLL_TFD operation can be used to test whether a file descriptor is present in an epoll instance.

SEE ALSO
       epoll_create(2), epoll_create1(2), epoll_ctl(2), epoll_wait(2), poll(2), select(2)

COLOPHON
       This  page  is  part  of  release  4.15  of  the  Linux  man-pages  project.   A  description  of  the project, information about reporting bugs, and the latest version of this page, can be found at
       https://www.kernel.org/doc/man-pages/.

Linux                                                                                             2017-09-15                                                                                         EPOLL(7)
```


# 参考资料

[select、poll和epoll的区别](https://www.cnblogs.com/sunweiye/p/11172751.html)

[linux下select/poll/epoll机制的比较](https://www.cnblogs.com/zhaodahai/p/6831456.html)

[select、poll、epoll之间的区别(搜狗面试)](https://www.cnblogs.com/aspirant/p/9166944.html)

[select、poll、epoll的原理与区别](https://blog.csdn.net/nanxiaotao/article/details/90612404)   


 