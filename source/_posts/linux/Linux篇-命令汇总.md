---
title: Linux篇-命令汇总
date: 2018-07-03 20:21:33
tags: Linux
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/linux.jpeg
category: Linux学习
---


<table>
<tbody>
<tr>
<td style="text-align: center;" colspan="29" height="48"><span style="font-family: 楷体; font-size: 18pt;"><strong>Linux 命令汇总</strong></span></td>
</tr>
<tr>
<td colspan="4" height="19">NO</td>
<td colspan="4" height="19">分类</td>
<td colspan="4" height="19">命令名</td>
<td colspan="8" height="19">用法及参数</td>
<td colspan="8" height="19">功能注解</td>
</tr>
<tr>
<td colspan="4" height="19">1</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4"  height="19">ls</td>
<td colspan="8"  height="19">ls-a</td>
<td colspan="8"  height="19">列出当前目录下的所有文件，包括以.头的隐含文件</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">ls</td>
<td colspan="8" height="19">ls-l或ll</td>
<td colspan="8" height="19">列出当前目录下文件的详细信息</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">pwd</td>
<td colspan="8" height="19">pwd</td>
<td colspan="8" height="19">查看当前所在目录的绝对路经</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">cd</td>
<td colspan="8" height="19">cd..</td>
<td colspan="8" height="19">回当前目录的上一级目录</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">cd</td>
<td colspan="8" height="19">cd-</td>
<td colspan="8" height="19">回上一次所在的目录</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">cd</td>
<td colspan="8" height="19">cd~或cd</td>
<td colspan="8" height="19">回当前用户的宿主目录</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">cd</td>
<td colspan="8" height="19">cd~用户名</td>
<td colspan="8" height="19">回指定用户的宿主目录</td>
</tr>
<tr>
<td colspan="4" height="19">2</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">mkdir</td>
<td colspan="8" height="19">mkdir目录名</td>
<td colspan="8" height="19">创建一个目录</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">mkdir</td>
<td colspan="8" height="19">mkdir–p</td>
<td colspan="8" height="19">递归式去创建一些嵌套目录</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">rmdir</td>
<td colspan="8" height="19">Rmdir空目录名</td>
<td colspan="8" height="19">删除一个空目录</td>
</tr>
<tr>
<td colspan="4" height="19">3</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">rm</td>
<td colspan="8" height="19">rm文件名文件名</td>
<td colspan="8" height="19">删除一个文件或多个文件</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">rm</td>
<td colspan="8" height="19">rm-rf非空目录名</td>
<td colspan="8" height="19">递归删除一个非空目录下的一切，不让提式-f</td>
</tr>
<tr>
<td colspan="4" height="19">4</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">cat</td>
<td colspan="8" height="19">cat文件名</td>
<td colspan="8" height="19">一屏查看文件内容</td>
</tr>
<tr>
<td colspan="4" height="19">5</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">more</td>
<td colspan="8" height="19">more文件名</td>
<td colspan="8" height="19">分页查看文件内容</td>
</tr>
<tr>
<td colspan="4" height="19">6</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">less</td>
<td colspan="8" height="19">less文件名</td>
<td colspan="8" height="19">可控分页查看文件内容</td>
</tr>
<tr>
<td colspan="4" height="19">7</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">grep</td>
<td colspan="8" height="19">grep字符文件名</td>
<td colspan="8" height="19">根据字符匹配来查看文件部分内容</td>
</tr>
<tr>
<td colspan="4" height="19">8</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">mv</td>
<td colspan="8" height="19">mv路经/文件/经/文件</td>
<td colspan="8" height="19">移动相对路经下的文件到绝对路经下</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">mv</td>
<td colspan="8" height="19">mv文件名新名称</td>
<td colspan="8" height="19">在当前目录下改名</td>
</tr>
<tr>
<td colspan="4" height="19">9</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">cp</td>
<td colspan="8" height="19">cp/路经/文件./</td>
<td colspan="8" height="19">移动绝对路经下的文件到当前目录下</td>
</tr>
<tr>
<td colspan="4" height="19">10</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">find</td>
<td colspan="8" height="19">find路经-name“字符串”</td>
<td colspan="8" height="19">查找路经所在范围内满足字符串匹配的文件和目录</td>
</tr>
<tr>
<td colspan="4" height="19">11</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">ln</td>
<td colspan="8" height="19">ln源文件链接名</td>
<td colspan="8" height="19">创建当前目录源文件的硬链接</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="8" height="19">ln/home/test/usr/test1</td>
<td colspan="8" height="19">在/usr下建立/home/test的硬链接</td>
</tr>
<tr>
<td colspan="4" height="19">12</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">ln</td>
<td colspan="8" height="19">Ln-sab</td>
<td colspan="8" height="19">创建当前目录下a的符号链接b</td>
</tr>
<tr>
<td colspan="4" height="19">13</td>
<td colspan="4" height="19">文件管理</td> 
<td colspan="4" height="19">touch</td>
<td colspan="8" height="19">touchfile1file2</td>
<td colspan="8" height="19">创建两个空文件</td>
</tr>
<tr>
<td colspan="4" height="19">14</td>
<td colspan="4" height="19">磁盘管理</td> 
<td colspan="4" height="19">df</td>
<td colspan="8" height="19">df</td>
<td colspan="8" height="19">用于报告文件系统的总容量，使用量，剩余容量。</td>
</tr>
<tr>
<td colspan="4" height="19">15</td>
<td colspan="4" height="19">磁盘管理</td> 
<td colspan="4" height="19">du</td>
<td colspan="8" height="19">du-b/home</td>
<td colspan="8" height="19">查看目前/HOME目录的容量(k)及子目录的容量(k)。</td>
</tr>
<tr>
<td colspan="4" height="19">16</td>
<td colspan="4" height="19">磁盘管理</td> 
<td colspan="4" height="19">fdisk</td>
<td colspan="8" height="19">fdisk-l</td>
<td colspan="8" height="19">查看系统分区信息</td>
</tr>
<tr>
<td colspan="4" height="19">17</td>
<td colspan="4" height="19">磁盘管理</td> 
<td colspan="4" height="19">fdisk</td>
<td colspan="8" height="19">fdisk/dev/sdb</td>
<td colspan="8" height="19">为一块新的SCSI硬盘进行分区</td>
</tr>
<tr>
<td rowspan="2" colspan="4" height="38">18</td>
<td rowspan="2" colspan="4" height="38">磁盘管理</td>
<td rowspan="2" colspan="4" height="38">mkfs.ext3</td>
<td rowspan="2" colspan="8" height="38">Mkfs.ext3/dev/sdb1</td>
<td colspan="8" height="19">为第一块SCSI硬盘的第一主分区格式化成</td>
</tr>
<tr>
<td class="et16" colspan="8" height="19">ext3的文件系统</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">mkfs.ext2</td>
<td colspan="8" height="19">Mkfs.ext2/dev/sdb2</td>
<td colspan="10" height="19">格式化成ext2文件系统</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">磁盘管理</td>
<td colspan="4" height="19"></td>
<td colspan="8" height="19">vfat</td>
<td colspan="8" height="19">Fat文件系统(windows)</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">挂载光驱</td> 
<td colspan="20"  height="19">mount–tiso9660/dev/cdrom/mnt/cdrom</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19">挂载FAT</td> 
<td colspan="14 height="19">mount–tvfat/dev/hda5/mnt/cdrom</td>
<td colspan="8" height="19">挂第一个ide的第五个逻辑分区</td>
</tr>
<tr>
<td colspan="4" height="19">17</td>
<td colspan="4" height="19">磁盘管理</td> 
<td colspan="8" height="19">Umount/mnt/cdrom</td>
<td colspan="12" height="19">卸载/mnt/cdrom为空</td>
</tr>
<tr>
<td colspan="4" height="19">18</td>
<td colspan="4" height="19">文件权限</td> 
<td colspan="5" height="19">chmod</td>
<td colspan="7" height="19">chmodu+sfile</td>
<td colspan="8" height="19">为file的属主加上特殊权限</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="12" height="19">chmodg+rfile</td>
<td colspan="12" height="19">为file的属组加上读权限</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="12" height="19">chmodo+wfile</td>
<td colspan="12" height="19">为file的其它用户加上写权限</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="12" height="19">chmoda-xfile</td>
<td colspan="12" height="19">为file的所有用户减去执行权限</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="4" height="19"></td>
<td colspan="12" height="19">chmod 765 file</td>
<td colspan="10">为file的属主设为完全权限，属组设成读写权，其它用户具有读和执心权限</td>
</tr>
<tr>
<td colspan="4" height="19">19</td>
<td colspan="4" height="19">文件权限</td>
<td colspan="6" height="19">chown</td>
<td colspan="7" height="19">chownroot/home</td>
<td colspan="7" height="19">把/home的属主改成root用户</td>
</tr>
<tr>
<td colspan="4" height="19">20</td>
<td colspan="4" height="19">文件权限</td>
<td colspan="6" height="19">chgrp</td>
<td colspan="7" height="19">chgrproot/home</td>
<td colspan="6" height="19">把/home的属组改成root组</td>
</tr>
<tr>
<td colspan="4" height="19">21</td>
<td colspan="4" height="19">打印管理</td>
<td colspan="13"  height="19">redhat-config-printer-tui</td>
<td colspan="6" height="19">进入安装打印机界面</td>
</tr>
<tr>
<td colspan="4" height="19">22</td>
<td colspan="4" height="19">打印管理</td>
<td colspan="6" height="19">lp</td>
<td colspan="7" height="19">lp–dhptrfile</td>
<td colspan="6" height="19">打印file到hptr的打印机上</td>
</tr>
<tr>
<td colspan="4" height="19">23</td>
<td colspan="4" height="19">打印管理</td>
<td colspan="6" height="19">lpq</td>
<td colspan="7" height="19">Lpq–P打印机名</td>
<td colspan="6" height="19">查看打印机的状态</td>
</tr>
<tr>
<td colspan="4" height="19">24</td>
<td colspan="4" height="19">打印管理</td>
<td colspan="6" height="19">lprm</td>
<td colspan="7" height="19">Lprm–P打印机名a</td>
<td colspan="6" height="19">删除打印机内的打印作业</td>
</tr>
<tr>
<td colspan="4" height="19">25</td>
<td colspan="4" height="19">打印管理</td>
<td class="et8" colspan="4" height="19">disable</td>
<td colspan="8" height="19">Disable–r“changingpaper”HPtr</td>
<td colspan="9" height="19">禁用打印机并提示原因</td>
</tr>
<tr>
<td colspan="4" height="19">26</td>
<td colspan="4" height="19">打印管理</td>
<td colspan="6" height="19">enable</td>
<td colspan="5" height="19">EnableHPtr</td>
<td colspan="9" height="19">重新启用被禁用的</td>
</tr>
<tr>
<td colspan="4" height="19">27</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">useradd</td>
<td colspan="5" height="19">Useradd</td>
<td colspan="7" height="19">创建一个新的用户</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">28</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">groupadd</td>
<td colspan="5" height="19">Groupadd组名</td>
<td colspan="7" height="19">创建一个新的组</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">29</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">passwd</td>
<td colspan="5" height="19">Passwd用户名</td>
<td colspan="7" height="19">为用户创建密码</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">30</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Passwd-d</td>
<td colspan="5" height="19">Passwd-d用户名</td>
<td colspan="7" height="19">删除用户密码也能登陆</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">31</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Passwd-l</td>
<td colspan="5" height="19">Passwd-l用户名</td>
<td colspan="7" height="19">锁定账号密码</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">32</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Passwd-u</td>
<td colspan="5" height="19">Passwd-u用户名</td>
<td colspan="7" height="19">解锁账号密码</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">33</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Passwd-S</td>
<td colspan="5" height="19">Passwd-S用户名</td>
<td colspan="7" height="19">查询账号密码</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">34</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Usermod-l</td>
<td colspan="10" height="19">Usermod-l新用户名老用户名</td>
<td colspan="2" height="19">为用户改名</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">35</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Usermod-L</td>
<td colspan="10" height="19">Usermod-L要锁定用户名</td>
<td colspan="2" height="19">锁定用户登陆</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">36</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Usermod-U</td>
<td colspan="10" height="19">Usermod–U解锁用户名</td>
<td colspan="2" height="19">解锁用户登陆</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">37</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Usermod-u</td>
<td colspan="10" height="19">Usermod–u501用户名</td>
<td colspan="2" height="19">改变用户UID</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">38</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Userdel</td>
<td colspan="10" height="19">Userdel–r用户名</td>
<td colspan="2" height="19">删除用户一切</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">39</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Groupmod-n</td>
<td colspan="10" height="19">Groupmod–n新用户名老用户名</td>
<td colspan="2" height="19">为组改名</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">40</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Groupmod-g</td>
<td colspan="10" height="19">Groupmod–g501组名</td>
<td colspan="2" height="19">改变组GID</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">41</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">groupdel</td>
<td colspan="10" height="19">Groupdel组名先应删它的用户</td>
<td colspan="2" height="19">删除组</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">42</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">gpasswd-a</td>
<td colspan="10" height="19">gpasswd-a用户名组名</td>
<td colspan="2" height="19">增加用户到组</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">43</td>
<td colspan="4" height="19">用户管理</td>
<td colspan="6" height="19">Id</td>
<td colspan="10" height="19">id用户名</td>
<td colspan="2" height="19">查用户信息</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">44</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-qa</td>
<td colspan="10" height="19">rpm–qa|less</td>
<td colspan="2" height="19">查询已安装RPM</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">45</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19"></td>
<td colspan="10" height="19">rpm–qa|grepftp</td>
<td colspan="2" height="19">查询指定RPM</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">46</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-q</td>
<td colspan="10" height="19">rpm-q已安装的RPM包</td>
<td colspan="2" height="19">查是否安装</td>
<td colspan="2" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">47</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19"></td>
<td colspan="10" height="19">rpm-qtelnet-server</td>
<td colspan="4" height="19">查看telnet服务器包</td>
</tr>
<tr>
<td colspan="4" height="19">48</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-qi</td>
<td colspan="10" height="19">rpm–qi软件包名称</td>
<td colspan="4" height="19">查看软件的描述信息</td>
</tr>
<tr>
<td colspan="4" height="19">49</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-ql</td>
<td colspan="10" height="19">rpm–ql软件包名称</td>
<td colspan="4" height="19">查询软件包的文件列表</td>
</tr>
<tr>
<td colspan="4" height="19">50</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-qf</td>
<td colspan="10" height="19">rpm–qf软件包名称</td>
<td colspan="4" height="19">查询某个文件所属的软件包</td>
</tr>
<tr>
<td colspan="4" height="19">51</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-qp</td>
<td colspan="10" height="19">rpm–qp软件包全名</td>
<td colspan="4" height="19">查询未安装的软件包信息</td>
</tr>
<tr>
<td colspan="4" height="19">52</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-e</td>
<td colspan="10" height="19">rpm–e软件包名称</td>
<td colspan="4" height="19">删除具体的软件包</td>
</tr>
<tr>
<td colspan="4" height="19">53</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-U</td>
<td colspan="10" height="19">rpm–Uvh软件包全名</td>
<td colspan="4" height="19">升级软件包并显示过程</td>
</tr>
<tr>
<td colspan="4" height="19">54</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-ivh</td>
<td colspan="10" height="19">rpm–ivh软件包全名</td>
<td colspan="4" height="19">安装软件包并显示过程</td>
</tr>
<tr>
<td colspan="4" height="19">55</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">rpm-V</td>
<td colspan="10" height="19">rpm–V软件包名称</td>
<td colspan="4" height="19">验证软件包的大小，类型等</td>
</tr>
<tr>
<td colspan="4" height="19">56</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar</td>
<td colspan="14" height="19">-c创建包–x释放包-v显示命令过程–z代表压缩包</td>
</tr>
<tr>
<td colspan="4" height="19">57</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar-cf</td>
<td colspan="10" height="19">tar–cvfbenet.tar/home/benet</td>
<td colspan="4" height="19">把/home/benet目录打包</td>
</tr>
<tr>
<td colspan="4" height="19">58</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar-czf</td>
<td colspan="10" height="19">tar–zcvfbenet.tar.gz/mnt</td>
<td colspan="4" height="19">把目录打包并压缩</td>
</tr>
<tr>
<td colspan="4" height="19">59</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar–tf</td>
<td colspan="10" height="19">tar–tfbenet.tar</td>
<td colspan="4" height="19">看非压缩包的文件列表</td>
</tr>
<tr>
<td colspan="4" height="19">60</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar–tzf</td>
<td colspan="10" height="19">tar–tfbenet.tar.gz</td>
<td colspan="4" height="19">看压缩包的文件列表</td>
</tr>
<tr>
<td colspan="4" height="19">61</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar–xf</td>
<td colspan="10" height="19">tar–xfbenet.tar</td>
<td colspan="4" height="19">非压缩包的文件恢复</td>
</tr>
<tr>
<td colspan="4" height="19">62</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar–zxvf</td>
<td colspan="10" height="19">tar–zxvfbenet.tar.gz</td>
<td colspan="4" height="19">压缩包的文件解压恢复</td>
</tr>
<tr>
<td colspan="4" height="19">63</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">tar-jxvf</td>
<td colspan="10" height="19">tar–jxvfbenet.tar.bz2</td>
<td colspan="4" height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">64</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">diff</td>
<td colspan="10" height="19">difffile1file2补丁名.patch</td>
<td colspan="4" height="19">为新旧文件生成补丁文件</td>
</tr>
<tr>
<td colspan="4" height="19">65</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">diff</td>
<td colspan="10" height="19">difffile1file2</td>
<td colspan="4" height="19">比较两个文件的区别</td>
</tr>
<tr>
<td colspan="4" height="19">66</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="6" height="19">Patch</td>
<td colspan="10" height="19">Patchfile补丁名.patch</td>
<td colspan="4" height="19">打补丁</td>
</tr>
<tr>
<td colspan="4" height="19">67</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="16" height="19">./configure--prefix=/usr/l数据库专家认证l/</td>
<td colspan="4" height="19">编译前配置</td>
</tr>
<tr>
<td colspan="4" height="19">68</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="16" height="19">make</td>
<td colspan="4" height="19">编译</td>
</tr>
<tr>
<td colspan="4" height="19">69</td>
<td colspan="4" height="19">软件管理</td>
<td colspan="16" height="19">makeinstall</td>
<td colspan="4" height="19">安装编译好的源码包</td>
</tr>
<tr>
<td colspan="4" height="19">70</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="8" height="19">reboot</td>
<td colspan="8" height="19">Init6</td>
<td colspan="4" height="19">重启LINUX系统</td>
</tr>
<tr>
<td colspan="4" height="19">71</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="3" height="19">Halt</td>
<td colspan="6" height="19">Init0</td>
<td colspan="7" height="19">Shutdown–hnow</td>
<td colspan="4" height="19">关闭LINUX系统</td>
</tr>
<tr>
<td colspan="4" height="19">72</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="8" height="19">runlevel</td>
<td colspan="8" height="19"></td>
<td colspan="4" height="19">显示系统运行级</td>
</tr>
<tr>
<td colspan="4" height="19">73</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="8" height="19">Init[0123456]</td>
<td colspan="8" height="19"></td>
<td colspan="4" height="19">改变系统运行级,7种</td>
</tr>
<tr>
<td colspan="4" height="19">74</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="16" height="19">Chkconfig–-list[服务名称]</td>
<td colspan="4" height="19">查看服务的状态</td>
</tr>
<tr>
<td colspan="4" height="19">75</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="17"  height="19">Chkconfig–-level 运行级 服务名on|off|set</td>
<td colspan="3"  height="19">设置服务的启动状态</td>
</tr>
<tr>
<td colspan="4" height="19">76</td>
<td colspan="4" height="19">启动管理</td>
<td colspan="17" height="19">Chkconfig 服务名on|off|set</td>
<td colspan="3" height="19">设置非独立服务启状态</td>
</tr>
<tr>
<td colspan="4" height="19">77</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="4" height="19">Top动态</td>
<td colspan="6" height="19">Ps-aux静态</td>
<td colspan="7" height="19">进程树pstree</td>
<td colspan="3" height="19">查看系统进程</td>
</tr>
<tr>
<td colspan="4" height="19">78</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">程序名</td>
<td colspan="10" height="19">后台运行程序</td>
<td colspan="3"  height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">79</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">fg</td>
<td colspan="10" height="19">把后台运行的进程调回前台</td>
<td colspan="3"  height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">80</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">bg</td>
<td colspan="10" height="19">把前台运行进程调到后台</td>
<td colspan="3"  height="19"></td>
</tr>
<tr>
<td colspan="4" height="19">81</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">renice</td>
<td colspan="7" height="19">Renice+1180</td>
<td colspan="6" height="19">把180号进程的优先级加1</td>
</tr>
<tr>
<td colspan="4" height="19">82</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">kill</td>
<td colspan="7" height="19">KillPID</td>
<td colspan="6" height="19">终止某个PID进程</td>
</tr>
<tr>
<td rowspan="2" colspan="4" height="38">83</td>
<td rowspan="2" colspan="4" height="38">进程管理</td>
<td class="et8" rowspan="2" colspan="4" height="38">#</td>
<td rowspan="2" colspan="7" height="38">at</td>
<td colspan="7" height="19">at5pm+3days</td>
<td rowspan="2" colspan="6" height="38">指定三天后下午5:00执行/bin/ls</td>
</tr>
<tr>
<td class="et16" colspan="7" height="19">/bin/ls</td>
</tr>
<tr>
<td colspan="4" height="19">84</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">crontab</td>
<td colspan="7" height="19">Crontab-e</td>
<td colspan="6" height="19">用VI的形式来编辑自动周期性任务</td>
</tr>
<tr>
<td colspan="4" height="19">85</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">crontab</td>
<td colspan="7" height="19">Crontab-l</td>
<td colspan="6" height="19">查看自动周期性任务</td>
</tr>
<tr>
<td colspan="4" height="19">86</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">crontab</td>
<td colspan="7" height="19">Crontab-r</td>
<td colspan="6" height="19">删除自动周期性任务</td>
</tr>
<tr>
<td colspan="4" height="19">87</td>
<td colspan="4" height="19">进程管理</td>
<td colspan="7" height="19">crond</td>
<td colspan="13"  height="19">Servicecrond start|stop|restart|status</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="12" height="19">马上启动自动周期性服务</td>
<td colspan="13"  height="19">Servicecrond 启动|停止|重启|状态</td>
</tr>
<tr>
<td colspan="4" height="19"></td>
<td colspan="12" height="19"></td>
<td colspan="13"  height="19"></td>
</tr>
<tr>
<td rowspan="20" colspan="4" height="380"></td>
<td rowspan="20" colspan="4" height="380">实现磁盘配额</td>
<td colspan="22" height="19">(注安装LINUX时建立/home分区）</td>
</tr>
<tr>
<td  colspan="22"  height="19">目标：对用户zhao在/home目录上实现softlimit为5k,hardlimit为10k的磁盘配额</td>
</tr>
<tr>
<td  colspan="22"  height="19">实现步骤：</td>
</tr>
<tr>
<td  colspan="22"  height="19">1.修改包含/home的行，#vi/etc/fstab，改为：defaults,usrquota。也就是增加usrquota项。然后保存退出。</td>
</tr>
<tr>
<td  colspan="22"  height="19">2、卸载/home目录#umount/home</td>
</tr>
<tr>
<td  colspan="22"  height="19">3.挂接/home目录#mount/home</td>
</tr>
<tr>
<td  colspan="22"  height="19">4、增加用户zhao#useraddzhao</td>
</tr>
<tr>
<td  colspan="22"  height="19">5、修改密码#passwdzhao</td>
</tr>
<tr>
<td  colspan="22"  height="19">6、生成关于/home目录的quota信息#quotacheck-cmug/home</td>
</tr>
<tr>
<td  colspan="22"  height="19">#quotacheck-vu/home</td>
</tr>
<tr>
<td  colspan="22"  height="19">7、查看所有用户的信息#repquota-au</td>
</tr>
<tr>
<td  colspan="22"  height="19">8、设置配额#edquota-uzhao</td>
</tr>
<tr>
<td  colspan="22"  height="19">将soft和hard分别改为5和10</td>
</tr>
<tr>
<td  colspan="22"  height="19">9、保存并退出#wq!</td>
</tr>
<tr>
<td  colspan="22"  height="19">10、修改时间#edquota-t</td>
</tr>
<tr>
<td  colspan="22"  height="19">11、#wq!</td>
</tr>
<tr>
<td  colspan="22"  height="19">12.开启/home上的磁盘配额功能#quotaon/home</td>
</tr>
<tr>
<td  colspan="22"  height="19">13.查询配额#quota-uzhao</td>
</tr>
<tr>
<td  colspan="22"  height="19">14.验证配额#su-zhao</td>
</tr>
<tr>
<td colspan="22"  height="19">$touchmyfile</td>
</tr>
</tbody>
</table>   


 