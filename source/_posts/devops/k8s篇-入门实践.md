---
title: k8s篇-入门实践
date: 2020-07-07 11:05:00
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/k8s.jpeg
category: DevOps
tags: Kubernates
---

# 搭建服务

- [virtualbox](https://www.virtualbox.org/)
- [centos7.8](http://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-Everything-2009.iso)


<details>
    <summary>
        <span>centos7 cannot find a valid baseurl for repo</span>
    </summary>

原因：无法解析添加DNS重启网卡即可

`vi /etc/sysconfig/network-scripts/ifcfg-enp0s3`

修改

`
onboot=yes
`

重启网络

`service network restart`

</details>



<details>
    <summary>
        <span>修改为静态IP</span>
    </summary>
```
BOOTPROTO="static" # 使用静态IP地址，默认为dhcp 
IPADDR="19.37.33.66" # 设置的静态IP地址
NETMASK="255.255.255.0" # 子网掩码 
GATEWAY="19.37.33.1" # 网关地址 
DNS1="192.168.241.2" # DNS服务器（此设置没有用到，所以我的里面没有添加）
ONBOOT=yes  #设置网卡启动方式为 开机启动 并且可以通过系统服务管理器 systemctl 控制网卡
```

重启网络

`service network restart`

</details>






# 环境准备

- 至少2台 2核4G 的服务器 Cent OS 7.6 / 7.7 / 7.8

### 服务器信息 CentOS Linux release 7.8.2003 (Core)

````shell
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                4
````


K8s

- kubelet

Docker 镜像

- etcd
- kube-proxy
- kube-apiserver
- kube-controller-manager
- kube-scheduler

# 安装Kubernates

- 修改 hostname,不能使用localhost
````
如果您需要修改 hostname，可执行如下指令：
# 修改 hostname
hostnamectl set-hostname your-new-host-name
# 查看修改结果
hostnamectl status
# 设置 hostname 解析
echo "127.0.0.1   $(hostname)" >> /etc/hosts
````

- 检查网络

````
[root@server-781e6bf7-bce3-4d09-adc8-2a169fdb8719 ~]# ip route show
default via 192.168.0.1 dev eth0 proto dhcp metric 100 
169.254.169.254 via 192.168.0.254 dev eth0 proto dhcp metric 100 
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 
172.18.0.0/16 dev br-66ad3449f59f proto kernel scope link src 172.18.0.1 
172.19.0.0/16 dev br-3d8dbba954bf proto kernel scope link src 172.19.0.1 
192.168.0.0/24 dev eth0 proto kernel scope link src 192.168.0.39 metric 100 
[root@server-781e6bf7-bce3-4d09-adc8-2a169fdb8719 ~]# ip address
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether fa:16:3e:c1:b5:a5 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.39/24 brd 192.168.0.255 scope global noprefixroute dynamic eth0
       valid_lft 53761sec preferred_lft 53761sec
    inet6 fe80::f816:3eff:fec1:b5a5/64 scope link 
       valid_lft forever preferred_lft forever
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:54:bb:c6:75 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:54ff:febb:c675/64 scope link 
       valid_lft forever preferred_lft forever
4: br-66ad3449f59f: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:ee:d9:c2:68 brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.1/16 brd 172.18.255.255 scope global br-66ad3449f59f
       valid_lft forever preferred_lft forever
    inet6 fe80::42:eeff:fed9:c268/64 scope link 
       valid_lft forever preferred_lft forever
5: br-3d8dbba954bf: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:6c:a5:67:cc brd ff:ff:ff:ff:ff:ff
    inet 172.19.0.1/16 brd 172.19.255.255 scope global br-3d8dbba954bf
       valid_lft forever preferred_lft forever
    inet6 fe80::42:6cff:fea5:67cc/64 scope link 
       valid_lft forever preferred_lft forever
9: veth7dba01e@if8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-66ad3449f59f state UP group default 
    link/ether aa:7c:a6:ae:85:2c brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::a87c:a6ff:feae:852c/64 scope link 
       valid_lft forever preferred_lft forever
15: veth9f52d5f@if14: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-3d8dbba954bf state UP group default 
    link/ether e2:bd:35:53:c6:0c brd ff:ff:ff:ff:ff:ff link-netnsid 1
    inet6 fe80::e0bd:35ff:fe53:c60c/64 scope link 
       valid_lft forever preferred_lft forever
````

- 安装 Docker

- 安装 nfs-utils

- 安装 kubectl / kubeadm / kubelet


````
# 在 master 节点和 worker 节点都要执行
# 最后一个参数 1.18.6 用于指定 kubenetes 版本，支持所有 1.18.x 版本的安装
# 腾讯云 docker hub 镜像
# export REGISTRY_MIRROR="https://mirror.ccs.tencentyun.com"
# DaoCloud 镜像
# export REGISTRY_MIRROR="http://f1361db2.m.daocloud.io"
# 华为云镜像
# export REGISTRY_MIRROR="https://05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com"
# 阿里云 docker hub 镜像
export REGISTRY_MIRROR=https://registry.cn-hangzhou.aliyuncs.com
curl -sSL https://kuboard.cn/install-script/v1.18.x/install_kubelet.sh | sh -s 1.18.6
````


<details>
<summary>
脚本内容
</summary>

```
#!/bin/bash

# 在 master 节点和 worker 节点都要执行

# 安装 docker
# 参考文档如下
# https://docs.docker.com/install/linux/docker-ce/centos/ 
# https://docs.docker.com/install/linux/linux-postinstall/

# 卸载旧版本
yum remove -y docker \
docker-client \
docker-client-latest \
docker-ce-cli \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-selinux \
docker-engine-selinux \
docker-engine

# 设置 yum repository
yum install -y yum-utils \
device-mapper-persistent-data \
lvm2
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装并启动 docker
yum install -y docker-ce-19.03.8 docker-ce-cli-19.03.8 containerd.io
systemctl enable docker
systemctl start docker

# 安装 nfs-utils
# 必须先安装 nfs-utils 才能挂载 nfs 网络存储
yum install -y nfs-utils
yum install -y wget

# 关闭 防火墙
systemctl stop firewalld
systemctl disable firewalld

# 关闭 SeLinux
setenforce 0
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config

# 关闭 swap
swapoff -a
yes | cp /etc/fstab /etc/fstab_bak
cat /etc/fstab_bak |grep -v swap > /etc/fstab

# 修改 /etc/sysctl.conf
# 如果有配置，则修改
sed -i "s#^net.ipv4.ip_forward.*#net.ipv4.ip_forward=1#g"  /etc/sysctl.conf
sed -i "s#^net.bridge.bridge-nf-call-ip6tables.*#net.bridge.bridge-nf-call-ip6tables=1#g"  /etc/sysctl.conf
sed -i "s#^net.bridge.bridge-nf-call-iptables.*#net.bridge.bridge-nf-call-iptables=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.all.disable_ipv6.*#net.ipv6.conf.all.disable_ipv6=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.default.disable_ipv6.*#net.ipv6.conf.default.disable_ipv6=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.lo.disable_ipv6.*#net.ipv6.conf.lo.disable_ipv6=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.all.forwarding.*#net.ipv6.conf.all.forwarding=1#g"  /etc/sysctl.conf
# 可能没有，追加
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
echo "net.bridge.bridge-nf-call-ip6tables = 1" >> /etc/sysctl.conf
echo "net.bridge.bridge-nf-call-iptables = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.all.disable_ipv6 = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.default.disable_ipv6 = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.lo.disable_ipv6 = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.all.forwarding = 1"  >> /etc/sysctl.conf
# 执行命令以应用
sysctl -p

# 配置K8S的yum源
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
       http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 卸载旧版本
yum remove -y kubelet kubeadm kubectl

# 安装kubelet、kubeadm、kubectl
# 将 ${1} 替换为 kubernetes 版本号，例如 1.17.2
yum install -y kubelet-${1} kubeadm-${1} kubectl-${1}

# 修改docker Cgroup Driver为systemd
# # 将/usr/lib/systemd/system/docker.service文件中的这一行 ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
# # 修改为 ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd
# 如果不修改，在添加 worker 节点时可能会碰到如下错误
# [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". 
# Please follow the guide at https://kubernetes.io/docs/setup/cri/
sed -i "s#^ExecStart=/usr/bin/dockerd.*#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd#g" /usr/lib/systemd/system/docker.service

# 设置 docker 镜像，提高 docker 镜像下载速度和稳定性
# 如果您访问 https://hub.docker.io 速度非常稳定，亦可以跳过这个步骤
curl -sSL https://kuboard.cn/install-script/set_mirror.sh | sh -s ${REGISTRY_MIRROR}

# 重启 docker，并启动 kubelet
systemctl daemon-reload
systemctl restart docker
systemctl enable kubelet && systemctl start kubelet

docker version
```
</details>


<br>


- 初始化 master 节点


````
# 只在 master 节点执行
# 替换 x.x.x.x 为 master 节点实际 IP（请使用内网 IP）
# export 命令只在当前 shell 会话中有效，开启新的 shell 窗口后，如果要继续安装过程，请重新执行此处的 export 命令
export MASTER_IP=x.x.x.x
# 替换 apiserver.demo 为 您想要的 dnsName
export APISERVER_NAME=apiserver.demo
# Kubernetes 容器组所在的网段，该网段安装完成后，由 kubernetes 创建，事先并不存在于您的物理网络中
export POD_SUBNET=10.100.0.1/16
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts
curl -sSL https://kuboard.cn/install-script/v1.18.x/init_master.sh | sh -s 1.18.6
````

<details>
    <summary>脚本代码</summary>

​    
​    ````
​    #!/bin/bash
​    
​    # 只在 master 节点执行
​    
    # 脚本出错时终止执行
    set -e
    
    if [ ${#POD_SUBNET} -eq 0 ] || [ ${#APISERVER_NAME} -eq 0 ]; then
      echo -e "\033[31;1m请确保您已经设置了环境变量 POD_SUBNET 和 APISERVER_NAME \033[0m"
      echo 当前POD_SUBNET=$POD_SUBNET
      echo 当前APISERVER_NAME=$APISERVER_NAME
      exit 1
    fi


​    
​    # 查看完整配置选项 https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2
​    rm -f ./kubeadm-config.yaml
​    cat <<EOF > ./kubeadm-config.yaml
​    apiVersion: kubeadm.k8s.io/v1beta2
​    kind: ClusterConfiguration
​    kubernetesVersion: v${1}
​    imageRepository: registry.aliyuncs.com/k8sxio
​    controlPlaneEndpoint: "${APISERVER_NAME}:6443"
​    networking:
​      serviceSubnet: "10.96.0.0/16"
​      podSubnet: "${POD_SUBNET}"
​      dnsDomain: "cluster.local"
​    EOF
​    
​    # kubeadm init
​    # 根据您服务器网速的情况，您需要等候 3 - 10 分钟
​    kubeadm init --config=kubeadm-config.yaml --upload-certs
​    
    # 配置 kubectl
    rm -rf /root/.kube/
    mkdir /root/.kube/
    cp -i /etc/kubernetes/admin.conf /root/.kube/config
    
    # 安装 calico 网络插件
    # 参考文档 https://docs.projectcalico.org/v3.13/getting-started/kubernetes/self-managed-onprem/onpremises
    echo "安装calico-3.13.1"
    rm -f calico-3.13.1.yaml
    wget https://kuboard.cn/install-script/calico/calico-3.13.1.yaml
    kubectl apply -f calico-3.13.1.yaml
    
    ````

</details>


<br>


- 检查 master 初始化结果

````
# 只在 master 节点执行
# 执行如下命令，等待 3-10 分钟，直到所有的容器组处于 Running 状态
watch kubectl get pod -n kube-system -o wide
# 查看 master 节点初始化结果
kubectl get nodes -o wide
````


成功

````
Every 2.0s: kubectl get pod -n kube-system -o wide                                                                                                                                                                                               Tue Jul 28 17:31:56 2020

NAME                                       READY   STATUS     RESTARTS   AGE    IP             NODE     NOMINATED NODE   READINESS GATES
calico-kube-controllers-5b8b769fcd-dw2fq   0/1     Pending    0          99s    <none>         <none>   <none>           <none>
calico-node-gcw6r                          0/1     Init:0/3   0          99s    192.168.0.39   mikey    <none>           <none>
coredns-66db54ff7f-2f9qn                   0/1     Pending    0          99s    <none>         <none>   <none>           <none>
coredns-66db54ff7f-csm5w                   0/1     Pending    0          99s    <none>         <none>   <none>           <none>
etcd-mikey                                 1/1     Running    0          108s   192.168.0.39   mikey    <none>           <none>
kube-apiserver-mikey                       1/1     Running    0          108s   192.168.0.39   mikey    <none>           <none>
kube-controller-manager-mikey              1/1     Running    0          108s   192.168.0.39   mikey    <none>           <none>
kube-proxy-xhmgq                           1/1     Running    0          99s    192.168.0.39   mikey    <none>           <none>
kube-scheduler-mikey                       1/1     Running    0          108s   192.168.0.39   mikey    <none>           <none>

````

````
[root@server-781e6bf7-bce3-4d09-adc8-2a169fdb8719 ~]# kubectl get nodes -o wide
NAME    STATUS     ROLES    AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION                CONTAINER-RUNTIME
mikey   NotReady   master   2m18s   v1.18.6   192.168.0.39   <none>        CentOS Linux 7 (Core)   3.10.0-1062.12.1.el7.x86_64   docker://19.3.8

````

- 初始化 worker节点
>获得 join命令参数在 master 节点上执行

```kubeadm token create --print-join-command```
    
可获取kubeadm join 命令及参数，如下所示

kubeadm token create 命令的输出

>kubeadm join apiserver.demo:6443 --token mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303

`该 token 的有效时间为 2 个小时，2小时内，您可以使用此 token 初始化任意数量的 worker 节点`


- 初始化worker

针对所有的 worker 节点执行

````
# 只在 worker 节点执行
# 替换 x.x.x.x 为 master 节点的内网 IP
export MASTER_IP=x.x.x.x
# 替换 apiserver.demo 为初始化 master 节点时所使用的 APISERVER_NAME
export APISERVER_NAME=apiserver.demo
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts
# 替换为 master 节点上 kubeadm token create 命令的输出
kubeadm join apiserver.demo:6443 --token mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:031a838dcdb8a66e0a5ddb826a2ada6065d3f68d5ddfa97226270a0e56861160
````

出现问题`kubeadm reset`进行重置


# 参考资料

[单节点安装](https://kuboard.cn/install/install-k8s.html#%E6%96%87%E6%A1%A3%E7%89%B9%E7%82%B9)

[Kubernates 教学](https://kuboard.cn/learning/k8s-bg/what-is-k8s.html#%E5%9B%9E%E9%A1%BE)<br/>


![扫一扫，关注我](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/wechat.jpg)