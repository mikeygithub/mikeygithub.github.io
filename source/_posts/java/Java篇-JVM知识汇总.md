---
title: Java篇-JVM知识汇总
date: 2020-05-19 17:19:15
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/jvm-1.jpg
category: Java相关
tags: JVM
---

# JVM 知识汇总

# 基本概念

```text
JVM是可运行Java代码的假想计算机，包括一套字节指令集，一组寄存器，一个栈，一个垃圾回收，堆和一个存储方法域．
Jvm是运行在操作系统上的他与硬件没有直接的交互．
```
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/jvm.png)

# 运行过程

>我们都知道Java源文件，通过编译器能够生产相应的.Class文件，也就是字节码文件，而字节码文件又通过Java虚拟机中的解释器，编译成特定机器上的机器码

>Java源文件-->编译器-->字节码文件-->JVM-->机器码

>每一种平台的解释器是不同的，但是实现的虚拟机是相同的，这也就是Java为什么能够跨平台的原因，当一个程序从开始运行，这时虚拟机就开始实例化了，多个程序启动　就会存在多个虚拟机实例．程序退出或者关闭则虚拟机实例消亡，多个虚拟机实例之间数据不能共享<
 
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/RunTimeJvm.png) 

# 线程

>这里所说的线程程序执行过程中的一个线程实体．JVM允许一个应用并发执行多个线程．`Hotspot JVM中的Java线程与原生操作系统线程有直接的映射关系`．当线程本地存储，缓冲区分配，同步对象，栈，程序计数器等准备好以后，就会创建一个操作系统图原生线程，并把他们分配到任何可以的CPU上．当原生线程初始化完毕，就会调用Java线程的run()方法．当线程结束时，会释放原生线程和Java线程的所有资源

### Hotspot JVM后台运行的系统线程主要有下面几个

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/20200519184914.png) 

### JVM 内存区域

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/20200519185041.png) 

>jvm内存区域主要分为线程私有区域［程序计数器，虚拟机栈，本地方法区］，线程共享区域［java堆，方法区］，直接内存．

`线程私有数据区域生命周期与线程相同，依赖用户线程的启动/结束而创建/销毁(在Hotspot VM内)，每个线程都与操作系统的本地线程直接映射，因此这部分内存区域的存/否跟随本地线程的生/死对应`

#### 线程共享区域随虚拟机的启动/关闭而创建/销毁

>直接内存并不是JVM运行时数据区的一部分,但也会被频繁的使用:在JDK1.4引入的NIO提供了基于Channel与Buffer的IO方式．他可以使用Native函数库直接分配堆外内存，然后使用DirectByteBuffer对象作为这个内存的引用进行操作，这样避免了在Java堆和Native中来回复制数据，因此在一场场景中可以显著提高性能．

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200519213321.png) 

# 程序计数器(线程私有)

>一块较小的内存空间，`是当前线程所执行的字节码的行号指示器`，每条线程都要有一个独立的程序计数器，这类内存也称为`线程私有`的内存．

>正在执行Java方法的话，计数器记录的是虚拟机字节码指令的地址(当前指令的地址)．如果还是Native方法则为空．

>这个内存区域是　唯一一个在虚拟机中没有规定任何OutOfMemoryError情况的区域

# 虚拟机栈(线程私有)

>是描述Java方法执行的内存模型，每个方法在执行的同时都会创建一个栈帧(Stack Frame)用于存储局部变量表，操作数栈，动态链接，方法出口等信息．每一个方法从调用直至执行完成的过程，就对应着一个在虚拟机栈中入栈到出栈的过程

>栈帧( Frame)是用来存储数据和部分过程结果的数据结构,同时也被用来处理动态链接(Dynamic Linking)、 方法返回值和异常分派( Dispatch Exception)。栈帧随着方法调用而创建,随着方法结束而销毁——无论方法是正常完成还是异常完成(抛出了在方法内未被捕获的异常)都算作方法结束。


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200519213321.png) 

# 本地方法区(线程私有)

>本地方法区和 Java Stack 作用类似, 区别是虚拟机栈为执行 Java 方法服务, 而本地方法栈则为
 Native 方法服务, 如果一个 VM 实现使用 C-linkage 模型来支持 Native 调用, 那么该栈将会是一个
 C 栈,但 HotSpot VM 直接就把本地方法栈和虚拟机栈合二为一。
 
# 堆(Heap-线程共享)-运行时数据区

>是被线程共享的一块内存区域，`创建的对象和数组都保存在Java堆内存中,也是垃圾收集器进行垃圾收集的最重要的内存区域`，由于现代VM采用分代收集算法，因此Java堆从GC的角度还可以细分为：新生代(Eden区，From Survivor区和To Survivor区)和老年代

# 方法区/永久代(线程共享)

>即我们常说的永久代(Permanent Generation)用于存储被jvm加载的类信息，常量，静态变量，即时编译器编译后的代码等数据．HotSpot VM把GC分代收集扩展至方法区，即使用Java堆的永久代来实现方法区，这样HotSpot的垃圾收集器就可以像管理Java堆一样内存管理这部分内存，而不必为方法区开发专门的内存管理器(永久代的内存回收的主要目标是针对常量池的回收和类型的卸载，因此收益一般很小)

运行时常量

>运行时常量池(Runtime Constant Pool)是方法区的一部分。Class 文件中除了有类的版
 本、字段、方法、接口等描述等信息外,还有一项信息是常量池(Constant Pool Table),用于存放编译期生成的各种字面量和符号引用,这部分内容将在类加
 载后存放到方法区的运行时常量池中。 Java 虚拟机对 Class 文件的每一部分(自然也包括常量
 池)的格式都有严格的规定,每一个字节用于存储哪种数据都必须符合规范上的要求,这样才会
 被虚拟机认可、装载和执行。

# JVM运行时内存

>Java堆GC的角度还可以细分为:新生代(Eden区，From Survivor区和To Survivor区)和老年代

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Jvm_runtime.png)

## 新生代

>是用来存放新生对象的，一般占用堆的1/3空间.由于频繁创建对象，所以新生代会频繁触发MinorGC进行垃圾回收.新生代又分为Eden区、SurvivorFrom、SurvivorTo三个区。

### Eden区
>Java新对象的出生地`（如果新创建的对象占用内存很大，则直接分配到老年代）`当Eden区内存不够的时候就会触发MinorGC，对新生代进行一次垃圾回收。

### SurvivorFrom
>上一次GC的幸存者，作为这一次GC的被扫描者

### SurvivorTo
>保留了一次MinorGC过程中的幸存者

### MinorGC的过程(复制->清空->互换)
>MinorGC采用复制算法

- eden、SurvivorFrom、复制到SurvivorTo年龄+1
>首先，把Eden和SurvivorFrom区域中存活的对象复制到SurvivorTo区域(如果有对象的年龄以及达到了老年的标准，则赋值到老年代)，同时把这些对象的年龄+1（如果SurvivorTo不够位置了就放到老年区）

- 清空Eden、SurvivorFrom
>然后清空Eden和SurvivorFrom中的对象

- SurvivorTo 和 SurvivorFrom互换
>最后，SurvivorTo和SurvivorFrom互换，原SurvivorFrom成为下一次GC时的SurvivorFrom区

# 老年代

`主要存放应用程序中生命周期长的内存对象`

>老年代的对象比较稳定，所以MajorGC不会频繁执行。在进行MajorGC前一般都先进行了一次MinorGC使得有新生代对象晋入老年代，导致空间不够用时才触发。当无法找到足够大的连续空间分配给新创建的较大对象时也会提前触发一次MajorGC进行垃圾回收腾出空间。

>MajorGC采用标记清除算法：首先扫描一次所有老年代，标记出存活的对象，然后回收没有标记的对象。MajorGC的耗时比较长，因为要扫描再回收。MajorGC会产生内存碎片为了减少内存损耗，我们一般需要进行合并或者标记出来方便下次直接分配。当老年代也满足了装不下的时候，就会抛出OOM(OutOfMemory)异常。

# 永久代

>指的是内存的永久保存区域，主要存放Class和Meta(元数据)的信息Class在被加载的时候被放入永久区域，他和存放实例的区域不同　`GC不会在主程序运行期对永久区进行清理`.所以这也导致了永久代的区域会随着加载的Class的增多而胀满，最终抛出OOM异常。

# Java8与元数据

>在Java8中，永久代已经被移除，被一个称为“元数据”（元空间）的区域所取代。元空间的本质和永久代类似，元空间与永久代之间的最大区别在于：元空间并不在虚拟机中，而是使用本地内存。因此默认情况下元空间的大小仅仅受本地内存限制。类的元数据放入native memory字符串池和类的静态变量放入Java堆中，这样可以加载多少类的元数据就不会由MaxPermSize控制，而是由系统实际可用空间来控制。

# 垃圾回收算法
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/jvmrubback.png)

## 如何确定垃圾
- 引用计数法
>在Java中引用和对象是有关联的。如果要操作对象则必须用引用进行。因此很显然一个简单的办法是通过引用计数来判断一个对象是否可以回收。简单的说，即一个对象如果没有任何与之关联的引用，即他们的引用计数都不为零，则说明对象不太可能在被利用到，那么　这个对象就是可回收对象。

- 可达性分析
>为了解决引用计数法的循环引用问题，Java使用了可达性分析方法。通过一系列的“GC roots”对象作为起点搜索。如果在“GC roots”和一个对象之间没有可达路径，则称该对象是不可达的。
要注意的是不可达对象不等价于回收对象，不可达对象变为可回收对象至少要经过两次标记过程，两次标记后仍然是可回收对象，则将面临回收。

- 标记清除法(Mark-Sweep)
>最基础的垃圾回收算法，分为两个阶段，标注和清除。标记阶段标记处所有需要回收的对象，清除阶段回收被标记的对象所占用的空间。如图

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/mark_sweep.png)

缺点：`内存碎片化严重，后续可能发生大对象不能找到可利用空间的问题`

- 复制算法(copying)
>为了解决Mark-Sweep算法内存碎片化的缺陷而被提出的算法。按内存容量将内存划分为等大小的两块。每次只使用期中一块，当这一块内存满后将尚存活的对象复制到另一块上去，把已使用的内存清掉，如图：

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/copy.png)

缺点：`内存被压缩到了原本的一半。且存活对象对象增多的话，Copying算法的效率会大大降低`

- 标记整理算法(Mark-Compact)
>结合以上两个算法，为了避免缺陷而提出。标记阶段和Mark-Sweep算法相同，标记后不是清理对象，而是将存活对象移向内存的一端。然后清除端边界的对象

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Mark-Compact.png)

- 分代收集算法
>分代收集法是目前大部分 JVM 所采用的方法,其核心思想是根据对象存活的不同生命周期将内存划分为不同的域,一般情况下将 GC 堆划分为老生代(Tenured/Old Generation)和新生代(YoungGeneration)。老生代的特点是每次垃圾回收时只有少量对象需要被回收,新生代的特点是每次垃圾回收时都有大量垃圾需要被回收,因此可以根据不同区域选择不同的算法。

新生代与复制算法
>目前大部分 JVM 的 GC 对于新生代都采取 Copying 算法,因为新生代中每次垃圾回收都要
 回收大部分对象,即要复制的操作比较少,但通常并不是按照 1:1 来划分新生代。一般将新生代
 划分为一块较大的 Eden 空间和两个较小的 Survivor 空间(From Space, To Space),每次使用
 Eden 空间和其中的一块 Survivor 空间,当进行回收时,将该两块空间中还存活的对象复制到另
 一块 Survivor 空间中。  
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/young-mark-copy.png)


老年代与标记复制算法
>而老年代因为每次只回收少量对象,因而采用 Mark-Compact 算法。  
1.JAVA 虚拟机提到过的处于方法区的永生代(Permanet Generation),它用来存储 class 类,常量,方法描述等。对永生代的回收主要包括废弃常量和无用的类。
2.对象的内存分配主要在新生代的 Eden Space 和 Survivor Space 的 From Space(Survivor 目前存放对象的那一块),少数情况会直接分配到老生代。
3.当新生代的 Eden Space 和 From Space 空间不足时就会发生一次 GC,进行 GC 后,EdenSpace 和 From Space 区的存活对象会被挪到 To Space,然后将 Eden Space 和 FromSpace 进行清理。
4.如果 To Space 无法足够存储某个对象,则将这个对象存储到老生代。
5.在进行 GC 后,使用的便是 Eden Space 和 To Space 了,如此反复循环。
6.当对象在 Survivor 区躲过一次 GC 后,其年龄就会+1。默认情况下年龄到达 15 的对象会被移到老生代中。


# Java 四种引用类型

- 强引用
>在 Java 中最常见的就是强引用,把一个对象赋给一个引用变量,这个引用变量就是一个强引
用。当一个对象被强引用变量引用时,它处于可达状态,它是不可能被垃圾回收机制回收的,即
使该对象以后永远都不会被用到 JVM 也不会回收。因此强引用是造成 Java 内存泄漏的主要原因之
一。
- 软引用
>软引用需要用 SoftReference 类来实现,对于只有软引用的对象来说,当系统内存足够时它
不会被回收,当系统内存空间不足时它会被回收。软引用通常用在对内存敏感的程序中。
- 弱引用
>弱引用需要用 WeakReference 类来实现,它比软引用的生存期更短,对于只有弱引用的对象
来说,只要垃圾回收机制一运行,不管 JVM 的内存空间是否足够,总会回收该对象占用的内存。
- 虚引用
>虚引用需要 PhantomReference 类来实现,它不能单独使用,必须和引用队列联合使用。虚
引用的主要作用是跟踪对象被垃圾回收的状态。

# GC 分代收集算法 VS 分区收集算法

### 分代收集算法
>当前主流VM垃圾收集都采用“分代收集”(Generational Collection)算法，这种算法会根据对象存活周期的不同将内存划分为几块，如JVM中的`新生代、老年代、永久代`这样就可以根据各年代分别采用最适当的GC算法


# 在新生代-复制算法
每次垃圾收集都能发现大批对象已死, 只有少量存活. 因此选用复制算法, 只需要付出少量
存活对象的复制成本就可以完成收集.

# 在老年代-标记整理算法
因为对象存活率高、没有额外空间对它进行分配担保, 就必须采用“标记—清理”或“标
记—整理”算法来进行回收, 不必进行内存复制, 且直接腾出空闲内存.
分区算法则将整个堆空间划分为连续的不同小区间, 每个小区间独立使用, 独立回收. 这样做的
好处是可以控制一次回收多少个小区间 , 根据目标停顿时间, 每次合理地回收若干个小区间(而不是
整个堆), 从而减少一次 GC 所产生的停顿。

# GC 垃圾收集器
Java 堆内存被划分为新生代和年老代两部分,新生代主要使用复制和标记-清除垃圾回收 算法 ;
年老代主要使用标记-整理垃圾回收算法,因此 java 虚拟中针对新生代和年老代分别提供了多种不
同的垃圾收集器,JDK1.6 中 Sun HotSpot 虚拟机的垃圾收集器如下:

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/JDK16SunHotspot.png)

- Serial 垃圾收集器(单线程、复制算法)
>Serial(英文连续)是最基本垃圾收集器，使用复制算法，曾经是JDK1.3.1之前新生代唯一的垃圾收集器。Serial是一个单线程的收集器，它不但只会使用一个CPU或一条线程去完成垃圾收集工作而且在进行垃圾收集同时，必须暂停所有的工作线程，但是它简单高效，对于限定单个CPU环境来说，没有线程交互的开销，可以获得最高的单线程垃圾收集效率，因此Serial垃圾收集器依然是Java虚拟机在Client模式下默认的新生代垃圾收集器。

- ParNew垃圾收集器(Serial+多线程)
>ParNew垃圾收集器其实是Serial收集器的多线程版本，也是使用多线程进行垃圾收集之外，其余的行为和Serial收集器完全一致，ParNew垃圾收集器在垃圾收集过程中同样也要暂停所有其他的工作线程。ParNew收集器默认开启和CPU数目相同的线程数，可以通过-XX:ParallelGCThreads参数来限制垃圾收集器的线程数。(Parallel:平行的)ParNew虽然是除了多线程和Serial收集器几乎完全一致，但是ParNew垃圾收集器是很多Java虚拟机运行在Server模式下新生代的默认垃圾收集器。

- Parallel Scavenge收集器(多线程复制算法、高效)
>Parallel Scavenge收集器也是一个新生代垃圾收集器，同样使用复制算法，也是一个多线程的垃圾收集器，它重点关注的是程序达到一个可控制的吞吐量(Thoughput,CPU用于运行用户代码的时间/CPU总消耗时间，即吞吐量=运行用户代码时间/(运行用户代码时间+垃圾收集时间))，高吞吐量可以最高效率利用CPU时间尽快完成程序运算任务，主要适用在后台运算而不需要太多交互的任务。自适应调节策略也是ParallelScavenge收集器与ParNew收集器的一个重要区别。

- Serial Old收集器(单线程标记整理算法)
>Serial Old是Serial 垃圾收集器年代老版本，它同样是单线程的收集器，使用标记-整理算法，这个收集器也主要是运行在Client默认的Java虚拟机默认的年代垃圾收集器。在这个模式下，主要有两个用途：

1.在JDK1.5之前版本中与新生代的Parallel　Scavenge收集器搭配使用。

2.作为年老代中使用CMS收集器的后备垃圾收集方案：

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200527092744.png)

```text
新生代 Parallel Scavenge 收集器与 ParNew 收集器工作原理类似,都是多线程的收集器,都使
用的是复制算法,在垃圾收集过程中都需要暂停所有的工作线程。新生代 Parallel
Scavenge/ParNew 与年老代 Serial Old 搭配垃圾收集过程图:
```

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200527092908.png)

- Parallel Old收集器(多线程标记整理算法)
>Parallel Old收集器是Parallel Scavenge的年老代版本，使用多线程的标记-整理算法，在JDK1.才开始提供。
在JDK1.6之前，新生代使用ParallelScavenge收集器只能搭配年老代的Serial Old收集器只能保证新生代的吞吐量优先，无法保证整体的吞吐量，Parallel Old正是为了在老代同样提供吞吐量优先的垃圾收集的搭配策略。
新生代Parallel Scavenge和老年代Parallel Old收集器搭配运行过程图：

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200527095030.png)

- CMS收集器(多线程标记清除算法)
>Concurrent mark sweep(CMS)收集器是一种年老代垃圾收集器，其最主要目标是获取最短垃圾回收停顿时间，和其他年老代使用标记-整理算法不同，它使用多线程的标记-清除算法。最短的垃圾收集停顿时间可以为交互比较高的程序提高用户体验。

`CMS工作机制相比其他的垃圾收集器来说更复杂，整个过程分为以下4个阶段：`

初始标记
>只是标记一下 GC Roots 能直接关联的对象,速度很快,仍然需要暂停所有的工作线程。

并发标记
>进行 GC Roots 跟踪的过程,和用户线程一起工作,不需要暂停工作线程。

重新标记
>为了修正在并发标记期间,因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录,仍然需要暂停所有的工作线程。

并发标记
>清除 GC Roots 不可达对象,和用户线程一起工作,不需要暂停工作线程。由于耗时最长的并发标记和并发清除过程中,垃圾收集线程可以和用户现在一起并发工作,所以总体上来看CMS 收集器的内存回收和用户线程是一起并发地执行。

CMS收集器工作过程

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200527100033.png)

- G1收集器
>Garbage first 垃圾收集器是目前垃圾收集器理论发展的最前沿成果,相比与 CMS 收集器,G1 收
 集器两个最突出的改进是:
 1. 基于标记-整理算法,不产生内存碎片。
 2. 可以非常精确控制停顿时间,在不牺牲吞吐量前提下,实现低停顿垃圾回收。
 >G1 收集器避免全区域垃圾收集,它把堆内存划分为大小固定的几个独立区域,并且跟踪这些区域
 的垃圾收集进度,同时在后台维护一个优先级列表,每次根据所允许的收集时间,优先回收垃圾
 最多的区域。区域划分和优先级区域回收机制,确保 G1 收集器可以在有限时间获得最高的垃圾收
 集效率。
 
 
 # Jvm类加载机制
 >JVM类加载机制分为:`加载、验证、准备、解析、初始化`
 
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200528223950.png)

- 加载
>加载是类加载过程中的一个阶段，这个阶段会在内存中生成一个代表这个类的java.lang.Class对象，作为方法区这个类的各种数据的入口。注意这里不一定是要从一个Class文件获取，这里既可以从ZIP包中读取(比如jar包和war包中读取)，也可以在运行计算生成(动态代理)，也可以由其它文件生成(比如将jsp文件转换成对应的Class类)。
- 验证
>这一阶段的主要目的是为了确保Class文件的字节流中包含的信息是否符合当前虚拟机的要求，并且不会危害自身的安全。
- 准备
>准备阶段是正式为类变量分配内存并设置类变量的初始值阶段，即在方法区中分配这些变量所使用的内存空间，注意这里所说的初始值概念，比如说一个类变量定义为：
```java
public static int v = 8080;
```
实际上变量V在准备阶段过后的初始值为0而不是8080，将V赋值为8080的put static指令是程序被编译后，存放于类构造器<client>方法之中
但是注意如果声明为：
```java
public static  final int v = 8080;
```
在编译阶段会为V生成ConstantValue属性，在准备阶段虚拟机会根据ConstantValue属性将V赋值为8080

- 解析
>解析阶段是指虚拟机将常量池中的符合引用替换为直接引用的过程。符合引用就是class文件中的`CONSTANT_Class_info`，`CONSTANT_Field_Info`，`CONSTANT_Method_Info`等类型常量。

符合引用:
>符号引用与虚拟机实现的布局无关,引用的目标并不一定要已经加载到内存中。各种虚拟机实现的内存布局可以各不相同,但是它们能接受的符号引用必须是一致的,因为符号引用的字面量形式明确定义在 Java 虚拟机规范的 Class 文件格式中。

直接引用:
>直接引用可以是指向目标的指针,相对偏移量或是一个能间接定位到目标的句柄。如果有了直接引用,那引用的目标必定已经在内存中存在.

初始化:
>初始化阶段是类加载最后一个阶段,前面的类加载阶段之后,除了在加载阶段可以自定义类加载器以外,其它操作都由 JVM 主导。到了初始阶段,才开始真正执行类中定义的 Java 程序代码。

类构造器:
>初始化阶段是执行类构造器<client>方法的过程。<client>方法是由编译器自动收集类中的类变量的赋值操作和静态语句块中的语句合并而成的。虚拟机会保证子<client>方法执行之前,父类的<client>方法已经执行完毕,如果一个类中没有对静态变量赋值也没有静态语句块,那么编译器可以不为这个类生成<client>()方法。

`[注]`以下几种情况不会执行类初始化：
1.通过子类引用父类的静态字段，只会触发父类的初始化，而不会触发子类的初始化。
2.定义对象数组，不会触发该类的初始化。
3.常量在编译期间会存入调用类的常量池中，本质上并没有直接引用定义常量的类，也不会触发定义常量所在的类
4.通过类名获取Class对象不会触发类的初始化。
5.通过Class.forName加载指定类时，如果指定参数initialize为false时，也不会触发类初始化，其实这个参数是告诉虚拟机，是否要对类进行初始化。
6.通过ClassLoader默认的loadClass方法也不会触发初始化动作。

# 类加载器
>虚拟机设计团队把加载动作放到JVM外部实现，以便让应用程序决定如何获取所需的类，JVM提供了3种类加载器
- 启动类加载器(Bootstrap ClassLoader)
>负责加载`JAVA_HOME\lib`目录中的，或者通过`-Xbootclasspath`参数指定路径中的，且被虚拟机认可(按文件名识别，如rt.jar)的类。
- 扩展类加载器(Extension ClassLoader)
>负责加载`JAVA_HOME\lib\ext`目录中的，或者通过`java.ext.dirs`系统变量指定路径中的类库。
- 应用程序类加载器(Application ClassLoader)
>负责加载用户路径(classpath)上的类库。
>JVM通过双亲委派模型进行类的加载，当然我们也可以通过继承`java.lang.ClassLoader`实现自定义的类加载器

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/application_classloader.png)

## 双亲委派

>当一个类收到类加载请求，他首先不会尝试自己去加载这个类，而是把这个请求委派给父类去完成，每一层次类加载器都是如此，因此所有的加载请求都应该传送到启动类加载其中，只有当父类加载器反馈自己无法完成这个请求的时候(在它的加载路径下没有找到所需的Class)，子类加载器才会尝试自己去加载。


>采用双亲委派的好处是比如加载位于`rt.jar`包中的类`java.lang.Object`，不管是哪个加载器加载这个类，最终都是委托给顶层的启动类加载器进行加载，这样就保证了使用不同的类加载器最终得到的都是同一个Object对象。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/TIM图片20200529101019.png)


### OSGI(动态模型系统)

>OSGI(Open Service Gateway Initiative)，是面向Java的动态模型系统，是Java动态模块化系统的一系列规范。


# 动态改变构造
OSGi 服务平台提供在多种网络设备上无需重启的动态改变构造的功能。为了最小化耦合度和促使
这些耦合度可管理,OSGi 技术提供一种面向服务的架构,它能使这些组件动态地发现对方。


# 模块化编程与热插拔
OSGi 旨在为实现 Java 程序的模块化编程提供基础条件,基于 OSGi 的程序很可能可以实现模块级的热插拔功能,当程序升级更新时,可以只停用、重新安装然后启动程序的其中一部分,这对企业级程序开发来说是非常具有诱惑力的特性。OSGi 描绘了一个很美好的模块化开发目标,而且定义了实现这个目标的所需要服务与架构,同时也有成熟的框架进行实现支持。但并非所有的应用都适合采用 OSGi 作为基础架构,它在提供强大功能同时,也引入了额外的复杂度,因为它不遵守了类加载的双亲委托模型。  


 