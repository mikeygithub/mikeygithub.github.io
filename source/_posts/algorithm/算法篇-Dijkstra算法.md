---
title: 算法篇-Dijkstra算法
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Dijkstra.png
date: 2020-12-02 10:08:10
category: 算法学习
tags: 最短路径
---

# 迪克斯特拉算法

迪杰斯特拉算法(Dijkstra)是由荷兰计算机科学家`狄克斯特`拉于1959 年提出的，因此又叫狄克斯特拉算法。是从一个顶点到其余各顶点的最短路径算法，解决的是`有权图中最短路径`问题。

迪杰斯特拉算法主要特点是

>从起始点开始，采用`贪心算法`的策略，`每次遍历到始点距离最近且未访问过的顶点的邻接节点，更新始点到其距离，直到扩展到终点为止`。

# 算法思想

按路径长度递增次序产生算法：

把顶点集合V分成两组： 
- S：已求出的顶点的集合（初始时只含有源点V0） 
- V-S=T：尚未确定的顶点集合 

将T中顶点按递增的次序加入到S中，保证： 
- 从源点V0到S中其他各顶点的长度都不大于从V0到T中任何顶点的最短路径长度  
- 每个顶点对应一个距离值 

S中顶点：从V0到此顶点的长度 
T中顶点：从V0到此顶点的只包括S中顶点作中间顶点的最短路径长度  

依据：可以证明V0到T中顶点Vk的，或是从V0到Vk的直接路径的权值；或是从V0经S中顶点到Vk的路径权值之和。（反证法可证）

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dijkstra-1.gif)


# 求最短路径步骤 

G={V,E}

1. 初始时令 S={V0},T=V-S={其余顶点}，T中顶点对应的距离值,若存在<V0,Vi>，d(V0,Vi)为<V0,Vi>弧上的权值,若不存在<V0,Vi>，d(V0,Vi)为∞ 

2. 从T中选取一个与S中顶点有关联边且权值最小的顶点W，加入到S中  

3. 对其余T中顶点的距离值进行修改：若加进W作中间顶点，从V0到Vi的距离值缩短，则修改此距离值,重复上述步骤2、3，直到S  中包含所有顶点，即W=Vi为止 


# 代码实现

<details>
  <summary><span>展开代码</span></summary>
  <br>

```java

```
</details>

# 参考资料

[Dijkstra算法图文详解](https://blog.csdn.net/lbperfect123/article/details/84281300)


 