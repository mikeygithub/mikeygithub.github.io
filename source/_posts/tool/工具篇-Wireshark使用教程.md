---
title: 网络篇-Wireshark使用教程
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Wireshark.jpeg
hide: false
date: 2021-01-09 10:59:28
category: 工具相关
tags: Wireshark
---

# 工具简介

Wireshark是一个网络数据包分析器。网络包分析器尽可能详细地呈现捕获的包数据。
你可以把网络数据包分析仪想象成一个测量设备，用来检测网络电缆内部发生的事情，就像电工用伏特计检测电缆内部发生的事情一样（当然是在更高的层次上）。
在过去，这些工具要么非常昂贵，要么是专有的，要么两者兼而有之。然而，随着Wireshark的出现，情况发生了变化。Wireshark是免费的，是开源的，是当今最好的数据包分析器之一。

# 安装软件

环境 `Ubuntu18.04`

```shell
sudo apt-get install wireshark
```

启动缺少权限

<p class="note note-danger">
    wireshark:Couldn't run /usr/bin/dumpcap in child process: Permission denied
</p>

解决方法

```shell
sudo apt-get install libcap2-bin wireshark
sudo chgrp myusername /usr/bin/dumpcap
sudo chmod 750 /usr/bin/dumpcap
sudo setcap cap_net_raw,cap_net_admin+eip /usr/bin/dumpcap
```

# 上手使用

![功能详解](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/wireshark-cat.png)

# 参数详解

（1）Frame:   物理层的数据帧概况

（2）Ethernet II: 数据链路层以太网帧头部信息

（3）Internet Protocol Version 4: 互联网层IP包头部信息

（4）Transmission Control Protocol:  传输层T的数据段头部信息，此处是TCP

（5）Hypertext Transfer Protocol:  应用层的信息，此处是HTTP协议

# 参考资料

[Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/)

[wireshark抓包新手使用教程](https://www.cnblogs.com/mq0036/p/11187138.html)   


 