# 麦奇个人博客


## 博客介绍

>记录开发学习过程中遇到的问题

## 搭建技术

>[Hexo](https://hexo.io/) + [Fluid](https://fluid-dev.github.io/)


## 百度统计

[百度统计](https://tongji.baidu.com/web/10000300596/overview/index?siteId=16089451)

## 创建文章
```jshelllanguage
hexo new post -path=/os/计算机操作系统 计算机操作系统
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

## 友链添加

```
  nickname:麦奇  
  avatar:https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/avatar.png    
  site:https://mikeygithub.github.io/      
  info:麦奇的博客    
```

## CDN加速

https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/copy.png

## 涉及插件

[hexo-tag-dplayer](https://github.com/MoePlayer/hexo-tag-dplayer)


{% meting "740245788" "netease" "playlist" "theme:#FF4081" "mode:circulation" "mutex:true" "listmaxheight:540px" "preload:auto" %}

```text
{% aplayerlist %}
{
    "narrow": false,                          // （可选）播放器袖珍风格
    "autoplay": true,                         // （可选) 自动播放，移动端浏览器暂时不支持此功能
    "mode": "random",                         // （可选）曲目循环类型，有 'random'（随机播放）, 'single' (单曲播放), 'circulation' (循环播放), 'order' (列表播放)， 默认：'circulation' 
    "showlrc": 3,                             // （可选）歌词显示配置项，可选项有：1,2,3
    "mutex": true,                            // （可选）该选项开启时，如果同页面有其他 aplayer 播放，该播放器会暂停
    "theme": "#e6d0b2",	                      // （可选）播放器风格色彩设置，默认：#b7daff
    "preload": "metadata",                    // （可选）音乐文件预载入模式，可选项： 'none' 'metadata' 'auto', 默认: 'auto'
    "listmaxheight": "513px",                 // (可选) 该播放列表的最大长度
    "music": [
        {
            "title": "CoCo",
            "author": "Jeff Williams",
            "url": "https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/music/周传雄 - 青花.mp3",
            "pic": "https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/copy/2st-nf.png",
            "lrc": "caffeine.txt"
        },
    ]
}
{% endaplayerlist %}
```

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