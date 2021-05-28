---
title: DevOps篇-Travis-CI环境搭建
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/travis-ci-logo.jpg
date: 2020-12-06 10:30:26
category: DevOps
tags: CI/CD
---

# 环境准备

- [github账号](https://github.com/)
- [dockerhub账号](https://hub.docker.com/)
- [Travis-CI账号](travis-ci.org)

# 开启服务

进入[Travis-CI官网](travis-ci.org)开启服务

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/travis-ci-open-service.png)

# 安装Travis

```bash
sudo apt-get -y update
sudo apt-get -y install build-essential zlib1g-dev libssl-dev libreadline6-dev libyaml-dev
cd /tmp
# 由于众所周知的网络原因，此处可能需要使用到http_proxy
wget http://ftp.ruby-lang.org/pub/ruby/2.1/ruby-2.1.5.tar.gz 
tar -xvzf ruby-2.1.5.tar.gz
cd ruby-2.1.5/
./configure --prefix=/usr/local
make
sudo make install
```

安装

```bash
gem install travis
```

如果网络实在太差，可以使用RubyGems 镜像

```bash
gem sources --add https://gems.ruby-china.org/
gem sources --remove https://rubygems.org/
gem sources --remove http://rubygems.org/
gem sources -l
```

# 客户端登入

```bash
travis login --org
```

- 登入失败

```text
root@mikey:/home/mikey# travis login
Outdated CLI version, run `gem install travis`.
Shell completion not installed. Would you like to install it now? |y| y
We need your GitHub login to identify you.
This information will not be sent to Travis CI, only to api.github.com.
The password will not be displayed.

Try running with --github-token or --auto if you don't want to enter your password anyway.

Username: hhufu     
Password for hhufu: ********
Bad credentials. The API can't be accessed using username/password authentication. Please create a personal access token to access this endpoint: http://github.com/settings/tokens
for a full error report, run travis report
```
解决方法: 可以使用Token进行登入
```text
root@mikey:/home/mikey# travis login --org --github-token 6534404071f94d2be86d6e3e16d691
Outdated CLI version, run `gem install travis`.
Successfully logged in as hhufu!
```
# 公钥配置

本地服务生成公钥,一路回车
```bash
ssh-keygen
```

将公钥上传致部署服务器
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@47.106.210.184
```

免密登入测试
```bash
ssh root@47.106.210.184
```


# 初始化项目

进入项目目录中

```bash
travis init --org
```
输出
```
/var/lib/gems/2.5.0/gems/travis-1.9.1/lib/travis/tools/system.rb:79: warning: Insecure world writable dir /home/mikey/Devtools in PATH, mode 040777
Outdated CLI version, run `gem install travis`.
Detected repository as hhufu/innovate, is this correct? |yes| yes
Main programming language used: |Ruby| 
.travis.yml file created!
not allowed to update service hook for hhufu/innovate
```

添加秘钥

```bash
travis encrypt-file ~/.ssh/id_rsa --add
```

当在官网查看到有秘钥存在就表示成功了

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/travis-ci-key-success.png)

# 配置文件

<details>
  <summary><span>配置文件</span></summary>
  <br>

```yaml
matrix:
  include:
  - language: node_js
    node_js:
    - 10.16.1
    branches:
      only:
      - master
    install:
    - npm install
    script:
    - npm run build
    - docker build . -t "$DOCKER_NAME/innovate-admin-vue:latest"
    addons:
      ssh_known_hosts:
      - "$SERVER_IP"
    after_success:
    - docker login -u=$DOCKER_NAME -p="$DOCKER_PWD"
    - docker push $DOCKER_NAME/innovate-admin-vue:latest
    - chmod 600 ~/.ssh/id_rsa
    - rsync -az --delete ./docker-compose.yml root@$SERVER_IP:$DOCKER_NAME/innovate-admin-vue/
    - ssh -o "StrictHostKeyChecking no" -i id_rsa root@$SERVER_IP "cd $DOCKER_NAME/innovate-admin-vue/;docker-compose
      -f docker-compose.yml pull;docker-compose -f docker-compose.yml up -d;exit"
    before_install:
    - openssl aes-256-cbc -K $encrypted_1687bb340939_key -iv $encrypted_1687bb340939_iv  -in
      id_rsa.enc -out ~/.ssh/id_rsa -d
    - chmod 600 ~/.ssh/id_rsa
    - echo -e "Host $SERVER_IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
    - cd $DOCKER_NAME/innovate-admin-vue
  - language: java
    services:
    - docker
    sudo: required
    branches:
      only:
      - master
    script:
    - mvn install -DskipTests=true -Dmaven.javadoc.skip=true -B -V
    - docker build . -t "$DOCKER_NAME/innovate-admin:latest"
    before_install:
    - openssl aes-256-cbc -K $encrypted_1687bb340939_key -iv $encrypted_1687bb340939_iv
      -in id_rsa.enc -out ~/.ssh/id_rsa -d
    - chmod 600 ~/.ssh/id_rsa
    - echo -e "Host $SERVER_IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
    - cd $DOCKER_NAME/innovate-admin
    after_success:
    - docker login -u=$DOCKER_NAME -p="$DOCKER_PWD"
    - docker push $DOCKER_NAME/innovate-admin:latest
    - chmod 600 ~/.ssh/id_rsa
    - rsync -az --delete ./docker-compose.yml root@$SERVER_IP:$DOCKER_NAME/innovate-admin/
    - ssh -o "StrictHostKeyChecking no" -i id_rsa root@$SERVER_IP "cd $DOCKER_NAME/innovate-admin/;docker-compose
      -f docker-compose.yml pull;docker-compose -f docker-compose.yml up -d;exit"
notifications:
  email:
    - biaogejiushibiao@outlook.com
  on_success: change
  on_failure: always
before_install:
- openssl aes-256-cbc -K $encrypted_1687bb340939_key -iv $encrypted_1687bb340939_iv
  -in id_rsa.enc -out ~\/.ssh/id_rsa -d

```

</details>

<br>

根据自己项目需要来进行编写，更多选项参考[官方文档](https://docs.travis-ci.com/user/tutorial/)

# 提交部署

提交代码即可完成自动部署工作

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/travis-ci-run-success.png)


# 参考资料

[官方文档](https://docs.travis-ci.com/)
[持续集成服务 Travis CI 教程](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
  


 