---
title: DevOps篇-Nginx配置SSL
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/ssl-nginx.jpeg
date: 2020-12-09 10:46:57
category: DevOps
tags: Nginx
---

# 获取证书

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/ssl-nginx-cert.png)

# 上传证书

证书内容

```text
./
├── Apache
│   ├── 1_root_bundle.crt
│   ├── 2_yangbiao.ink.crt
│   └── 3_yangbiao.ink.key
├── IIS
│   ├── keystorePass.txt
│   └── yangbiao.ink.pfx
├── Nginx
│   ├── 1_yangbiao.ink_bundle.crt
│   └── 2_yangbiao.ink.key
├── Tomcat
│   ├── keystorePass.txt
│   └── yangbiao.ink.jks
└── yangbiao.ink.csr

4 directories, 10 files

```

上传证书
```shell
rsync -r ./Nginx/  root@47.106.210.183:yangbiao.ink/
```

# 配置文件

- 配置Nginx文件
```text
server {
        # 所有请求走https
        rewrite ^(.*)$  https://$host$1 permanent;
        ......
}
server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  yangbiao.ink;
        root         /usr/share/nginx/html;
        #配置证书
        ssl_certificate "/etc/pki/nginx/server.crt";
        ssl_certificate_key "/etc/pki/nginx/server.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }
```

# 测试访问




# 参考资料


 