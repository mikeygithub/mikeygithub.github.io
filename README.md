# 麦奇个人博客


## 博客介绍

>记录开发学习过程中遇到的问题

## 搭建技术

>[Hexo](https://hexo.io/) + [Fluid](https://fluid-dev.github.io/) + [Serverless]() +[Travis-CI]() + YuQue


## 百度统计

[百度统计](https://tongji.baidu.com/web/10000300596/overview/index?siteId=16089451)

## 创建文章
```jshelllanguage
hexo new post -path=/os/计算机操作系统 计算机操作系统
```

文章置顶
```text
sticky: 100
```

<p class="note note-primary">标签</p>

可选便签：

primary
secondary
success
danger
warning
info
light


## CDN加速

https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/copy.png

## 涉及插件

[hexo-tag-dplayer](https://github.com/MoePlayer/hexo-tag-dplayer)

<details>
    <summary><span>读取音乐信息</span>
    </summary>
    <br>


```java
public class ReadMusicList {
    public static void main(String[] args) throws Exception{
        read("/home/mikey/Downloads/jsDeliver/resource/music");
    }
    public static void read(String path) throws Exception{
        File[] files = new File(path).listFiles();
        for (File file:files) {
            // {"title": "青花","author": "周传雄","url": "https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/music/周传雄 - 青花.mp3"}
            String name = file.getName();
            int index = name.indexOf('.');
            String song = name.substring(0, index);
            String songName = song.substring(song.lastIndexOf(" ")+1);
            String author = song.substring(0, song.indexOf(" "));
            String url = "https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/music/";
            System.out.println("{\"title\": \""+songName+"\",\"author\":\""+author+"\",\"url\":\""+url+name+"\",\"pic\": \"https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/music.png\"},");
        }

    }
}
```


</details>
