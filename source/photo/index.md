---
title: 照片
date: 2020-12-31 14:38:21
lazyload: true
---
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>
    <title>timeline</title>
    <style>
        .timeline-small {
            max-width: 100%;
            max-height: 630px;
            overflow: hidden;
            margin: 30px auto 0;
            box-shadow: 0 0 40px #a0a0a0;
            font-family: 'Open Sans', sans-serif;
        }
        .timeline-small-body ul {
            padding: 1em 0 0 2em;
            margin: 0;
            list-style: none;
            position: relative;
        }
        .timeline-small-body ul::before {
            content: ' ';
            height: 100%;
            width: 5px;
            background-color: #d9d9d9;
            position: absolute;
            top: 0;
            left: 2.4em;
            z-index: -1;
        }
        .timeline-small-body li div {
            display: inline-block;
            margin: 1em 0;
            vertical-align: top;
        }
        .timeline-small-body .bullet {
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            border-radius: 50%;
            background: #fff;
            z-index: 1;
            margin-right: 1rem;
        }
        .timeline-small-body .bullet.pink {
            background-color: hotpink;
            border: 3px solid #F93B69;
        }
        .timeline-small-body .bullet.green {
            background-color: lightseagreen;
            border: 3px solid #B0E8E2;
        }
        .timeline-small-body .bullet.blue {
            background-color: aquamarine;
            border: 3px solid cadetblue;
        }
        .timeline-small-body .bullet.orange {
            background-color: salmon;
            border: 3px solid #EB8B6E;
        }
        .timeline-small-body .date {
            width: 23%;
            font-size: 0.75em;
            padding-top: 0.40rem;
            padding-right: 2rem;
        }
        .timeline-small-body .desc {
            width: 50%;
        }
        .timeline-small-body h3 {
            font-size: 0.9em;
            font-weight: 400;
            margin: 0;
            margin-top: 5px;
        }
        .timeline-small-body h4 {
            margin: 0;
            font-size: 0.7em;
            font-weight: 400;
            color: #808080;
            margin-top: 5px;
        }
        .timeline-small-body img {
            margin: 5px;
            width: 100%;
            height: auto;
            display: inline-block;
         }
         img{
             width: auto;
             height: auto;
             max-width: 100%;
             max-height: 100%;  
         }
         .img-father {
            width:100%;height:300px;
         }
    </style>
</head>

<body>
    <div class="timeline-small-body">
        <ul>
        <li>
          <div class="bullet blue"></div>
          <div class="date">2021年03月13日</div>
          <div class="desc">
            <h3>阿里访客中心</h3>
            <h4>夏导带领阿里一圈</h4>
            <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/0fa8226e3e6f07afb3489cf8201701e.jpg">
            </div>
        </li>
        <li>
          <div class="bullet pink"></div>
          <div class="date">2020年03月10日</div>
          <div class="desc">
            <h3>杭州未来科技城</h3>
            <h4>租房子的心酸、辛辛苦苦加班来的两块钱都进房东的手里了</h4>
            <div class="img-father">
            <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WeChat Image_20210311235438.jpg">
            </div>
            </div>
        </li>
        <li>
          <div class="bullet blue"></div>
          <div class="date">2021年03月09日</div>
          <div class="desc">
            <h3>出发杭州</h3>
            <h4>还有几天就要实习了、提前过去租个房子</h4>
            <div class="img-father">
            <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WeChat Image_20210311235520.jpg">
                </div>
            </div>
        </li>
        <li>
          <div class="bullet blue"></div>
          <div class="date">2021年03月06日</div>
          <div class="desc">
            <h3>突如其来的惊喜</h3>
            <h4>O(∩_∩)O~~开心哈哈哈哈哈哈哈哈哈哈哈哈</h4>
            <div class="img-father">
            <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/QQ图片20210306234459.png">
                </div>
            </div>
        </li>
        <li>
          <div class="bullet pink"></div>
          <div class="date">2021年03月03日</div>
          <div class="desc">
            <h3>Service mesh</h3>
            <h4>我们要偷偷学习、然后卷死所有人</h4>
            <div class="img-father">
            <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/20191202095545.png">
                </div>
            </div>
        </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2021年03月02日</div>
              <div class="desc">
                <h3>解放桥</h3>
                <h4>夜晚的灯光还是挺好看的</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/QQ图片20210302204421.png">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet green"></div>
              <div class="date">2021年02月26日</div>
              <div class="desc">
                <h3>日月双塔</h3>
                <h4>在等、等、等</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210226_201927.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2021年02月14日</div>
              <div class="desc">
                <h3>爬山远眺</h3>
                <h4>颇有心旷神怡、会当凌绝顶、一览众山小的感觉</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210214_172640.jpg">
                </div>
                </div>
            </li>
            <li>
                <div class="bullet pink"></div>
                <div class="date">2021年02月11日</div>
                <div class="desc">
                    <h3>新年快乐</h3>
                    <h4>新年快乐、牛气冲天</h4>
            <div class="img-father">
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/1613141748819.gif">
                </div>
                </div>
            </li>
            <li>
                <div class="bullet orange"></div>
                <div class="date">2021年01月24日</div>
                <div class="desc">
                    <h3>荣誉证书</h3>
                    <h4>大学生涯结束了</h4>
            <div class="img-father">
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210124_100400.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2021年01月21日</div>
              <div class="desc">
                <h3>学习空间</h3>
                <h4>一回到家第一时间就是把电脑搭起来</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210121_164134.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2021年01月18日</div>
              <div class="desc">
                <h3>代小孩</h3>
                <h4>桂林正阳步行街</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210118_162854.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年11月14日</div>
              <div class="desc">
                <h3>锻炼身体</h3>
                <h4>跑步跑步</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20201114_185105.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2020年12月13日</div>
              <div class="desc">
                <h3>算法学习</h3>
                <h4>东哥保佑我算法</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20201213_123123.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet green"></div>
              <div class="date">2020年12月08日</div>
              <div class="desc">
                <h3>国励奖学</h3>
                <h4>终于拿到红本本了</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20201208_165131.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2020年09月04日</div>
              <div class="desc">
                <h3>旅行日记</h3>
                <h4>北海银滩</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20200904_184622.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年06月05日</div>
              <div class="desc">
                <h3>华为鲲鹏</h3>
                <h4>华为鲲鹏开发者大赛广西赛区</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20200605_140222.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年05月20日</div>
              <div class="desc">
                <h3>特殊的日子</h3>
                <h4>活抓一个小仙女</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/QQ图片20210303203439.png">
                </div>
              </div>
            </li>
            <li>
                <div class="bullet pink"></div>
                <div class="date">2020年03月03日</div>
                <div class="desc">
                    <h3>长板速降</h3>
                    <h4>第一次上山了</h4>
            <div class="img-father">
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/39799393c2bb775a.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2018年10月20日</div>
              <div class="desc">
                <h3>2017软件工程</h3>
                <h4>软件工程5班</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/1597941896099.jpeg">
                </div>
                </div>
            </li>   
            <li>
              <div class="bullet pink"></div>
              <div class="date">2018年10月13日</div>
              <div class="desc">
                <h3>毕业开会</h3>
                <h4>提前了解了解他们毕业设计都要做啥作品</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20181013_082830.jpg">
                </div>
                </div>
            </li>         
            <li>
              <div class="bullet blue"></div>
              <div class="date">2018年10月10日</div>
              <div class="desc">
                <h3>开发中心</h3>
                <h4>以后这就是我的工位了</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20181010_211452.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet green"></div>
              <div class="date">2018年02月02日</div>
              <div class="desc">
                <h3>广东打工</h3>
                <h4>第一次去广东打工、以为会在一声声靓仔中迷失自我，谁知道他们居然叫我叼毛</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/6be820f6a3b04417.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年10月12日</div>
              <div class="desc">
                <h3>班级小聚</h3>
                <h4>软件工程5班</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/1595605440433.jpeg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2017年09月24日</div>
              <div class="desc">
                <h3>校园一角</h3>
                <h4>这是目前学校最大的一栋教学楼</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20150407_09_01_22_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年09月19日</div>
              <div class="desc">
                <h3>玉圭园游</h3>
                <h4>天气可真热</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/yuguiyuan.jpeg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年09月17日</div>
              <div class="desc">
                <h3>生日快乐</h3>
                <h4>Happy birthday!</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170917_23_43_00_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年06月16日</div>
              <div class="desc">
                <h3>R720</h3>
                <h4>我的游戏本本终于到了</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170620_08_21_19_Pro.jpg">
                </div>
                </div>
            </li>              
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年06月16日</div>
              <div class="desc">
                <h3>茶园</h3>
                <h4>绿油油的</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170616_14_26_11_Pro.jpg">
                </div>
                </div>
            </li>            
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年06月11日</div>
              <div class="desc">
                <h3>茶园山峰</h3>
                <h4>总有一天要登上那座高峰</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170611_13_37_29_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2017年06月10日</div>
              <div class="desc">
                <h3>蓝天白云</h3>
                <h4>天空的蓝色</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170609_19_33_49_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2017年06月09日</div>
              <div class="desc">
                <h3>毕业散场</h3>
                <h4>人去楼空</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170609_14_42_09_Pro.jpg">
                </div>
                </div>
            </li>        
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年06月08日</div>
              <div class="desc">
                <h3>校园一角</h3>
                <h4>从宿舍楼上看的校园</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170609_16_32_03_Pro.jpg">
                </div>
                </div>
            </li>    
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年05月30日</div>
              <div class="desc">
                <h3>网吧一排</h3>
                <h4>全体宿舍</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170530_14_42_52_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年05月05日</div>
              <div class="desc">
                <h3>沙雕同桌</h3>
                <h4>这是我认识的最幽默的一个同桌</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/MTXX_20170505_224028.jpg">
                </div>
                </div>
            </li>
            <li>
                <div class="bullet green"></div>
                <div class="date">2017年05月24日</div>
                <div class="desc">
                    <h3>三江中学</h3>
                    <h4>1403班全体男生</h4>
            <div class="img-father">
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/hight-school.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet orange"></div>
              <div class="date">2017年04月22日</div>
              <div class="desc">
                <h3>锻炼身体</h3>
                <h4>高考每天学习有压力了就做运动</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/MTXX_20170521_231349.png">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年04月03日</div>
              <div class="desc">
                <h3>吊脚凉亭</h3>
                <h4>由木制和瓦片制造而成</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170403_13_09_02_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2017年01月25日</div>
              <div class="desc">
                <h3>青青草地</h3>
                <h4>感觉这张拍的比较好看</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170125_10_05_15_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2016年11月17日</div>
              <div class="desc">
                <h3>体育运动会</h3>
                <h4>1403班全体合照</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/2016-11-17[10_59_47].jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2016年11月02日</div>
              <div class="desc">
                <h3>乒乓球</h3>
                <h4>两位好基友</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20161102_17_30_26_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2016年08月18日</div>
              <div class="desc">
                <h3>自习课</h3>
                <h4>按耐不住蠢蠢欲动的下课心情</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/2016-08-18.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2016年06月08日</div>
              <div class="desc">
                <h3>野生杨梅</h3>
                <h4>估计老爸拿去做杨梅酒</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20160608_19_57_54_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet green"></div>
              <div class="date">2016年04月03日</div>
              <div class="desc">
                <h3>鸟窝</h3>
                <h4>茶园子里的鸟窝</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20160403_15_17_18_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2015年07月20日</div>
              <div class="desc">
                <h3>傻乎乎的老弟</h3>
                <h4>路上捡到了一个小孩</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/QQ图片20210303184213.png">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet green"></div>
              <div class="date">2015年07月27日</div>
              <div class="desc">
                <h3>大雨之后</h3>
                <h4>空气都清新很多</h4>
            <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20150727_18_53_27_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2015年05月05日</div>
              <div class="desc">
                <h3>学自行车</h3>
                <h4>腿不够长哈哈哈哈哈哈多吃饭长大先吧</h4>
                <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170505_20_57_14_Pro.jpg">
                </div>
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2015年01月21日</div>
              <div class="desc">
                <h3>下棋</h3>
                <h4>小弟弟还挺厉害，哈哈哈哈</h4>
                <div class="img-father">
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/WP_20170121_16_08_27_Pro.jpg">
                </div>
                </div>
            </li>
        </ul>
    </div>
</body>
</html>
