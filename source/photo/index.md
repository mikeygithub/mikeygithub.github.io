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
    </style>
</head>

<body>
    <div class="timeline-small-body">
        <ul>
            <li>
                <div class="bullet pink"></div>
                <div class="date">2021年02月11日</div>
                <div class="desc">
                    <h3>新年快乐</h3>
                    <h4>新年快乐、牛气冲天</h4>
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/1613141748819.gif">
                </div>
            </li>
            <li>
                <div class="bullet orange"></div>
                <div class="date">2021年01月24日</div>
                <div class="desc">
                    <h3>荣誉证书</h3>
                    <h4>大学生涯结束了</h4>
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210124_100400.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2021年01月21日</div>
              <div class="desc">
                <h3>学习空间</h3>
                <h4>一回到家第一时间就是把电脑搭起来</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210121_164134.jpg">
                </div>
            </li>
            <li>
              <div class="bullet pink"></div>
              <div class="date">2021年01月18日</div>
              <div class="desc">
                <h3>猪猪女孩</h3>
                <h4>桂林正阳步行街</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20210118_162854.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年11月14日</div>
              <div class="desc">
                <h3>锻炼身体</h3>
                <h4>跑步跑步</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20201114_185105.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年12月13日</div>
              <div class="desc">
                <h3>算法学习</h3>
                <h4>东哥保佑我算法</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20201213_123123.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年12月08日</div>
              <div class="desc">
                <h3>国励奖学</h3>
                <h4>终于拿到红本本了</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20201208_165131.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年09月04日</div>
              <div class="desc">
                <h3>旅行日记</h3>
                <h4>北海银滩</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20200904_184622.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2020年06月05日</div>
              <div class="desc">
                <h3>华为鲲鹏</h3>
                <h4>华为鲲鹏开发者大赛广西赛区</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/IMG_20200605_140222.jpg">
                </div>
            </li>
            <li>
                <div class="bullet pink"></div>
                <div class="date">2020年03月03日</div>
                <div class="desc">
                    <h3>长板速降</h3>
                    <h4>第一次上山了</h4>
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/39799393c2bb775a.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2018年10月20日</div>
              <div class="desc">
                <h3>2017软件工程</h3>
                <h4>软件工程5班</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/1597941896099.jpeg">
                </div>
            </li>            <li>
              <div class="bullet blue"></div>
              <div class="date">2018年02月02日</div>
              <div class="desc">
                <h3>广东打工</h3>
                <h4>第一次去广东打工、以为会在一声声靓仔中迷失自我，谁知道他们居然叫我叼毛</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/6be820f6a3b04417.jpg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年10月12日</div>
              <div class="desc">
                <h3>班级小聚</h3>
                <h4>软件工程5班</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/1595605440433.jpeg">
                </div>
            </li>
            <li>
              <div class="bullet blue"></div>
              <div class="date">2017年09月19日</div>
              <div class="desc">
                <h3>玉圭园游</h3>
                <h4>天气可真热</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/yuguiyuan.jpeg">
                </div>
            </li>
            <li>
                <div class="bullet green"></div>
                <div class="date">2017年05月24日</div>
                <div class="desc">
                    <h3>三江中学</h3>
                    <h4>1403班全体男生</h4>
                    <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/hight-school.jpg">
                </div>
            </li>
            <li>
              <div class="bullet orange"></div>
              <div class="date">2017年04月22日</div>
              <div class="desc">
                <h3>出来了哈</h3>
                <h4>高考每天学习有压力了就做运动</h4>
                <img src="https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/photo/MTXX_20170521_231349.png">
                </div>
            </li>
        </ul>
    </div>
</body>
</html>

