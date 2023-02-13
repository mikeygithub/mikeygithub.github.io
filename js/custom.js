//背景黑色线条
// !function(){function o(w,v,i){return w.getAttribute(v)||i}function j(i){return document.getElementsByTagName(i)}function l(){var i=j("script"),w=i.length,v=i[w-1];return{l:w,z:o(v,"zIndex",-1),o:o(v,"opacity",0.5),c:o(v,"color","0,0,0"),n:o(v,"count",99)}}function k(){r=u.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,n=u.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function b(){e.clearRect(0,0,r,n);var w=[f].concat(t);var x,v,A,B,z,y;t.forEach(function(i){i.x+=i.xa,i.y+=i.ya,i.xa*=i.x>r||i.x<0?-1:1,i.ya*=i.y>n||i.y<0?-1:1,e.fillRect(i.x-0.5,i.y-0.5,1,1);for(v=0;v<w.length;v++){x=w[v];if(i!==x&&null!==x.x&&null!==x.y){B=i.x-x.x,z=i.y-x.y,y=B*B+z*z;y<x.max&&(x===f&&y>=x.max/2&&(i.x-=0.03*B,i.y-=0.03*z),A=(x.max-y)/x.max,e.beginPath(),e.lineWidth=A/2,e.strokeStyle="rgba("+s.c+","+(A+0.2)+")",e.moveTo(i.x,i.y),e.lineTo(x.x,x.y),e.stroke())}}w.splice(w.indexOf(i),1)}),m(b)}var u=document.createElement("canvas"),s=l(),c="c_n"+s.l,e=u.getContext("2d"),r,n,m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(i){window.setTimeout(i,1000/45)},a=Math.random,f={x:null,y:null,max:20000};u.id=c;u.style.cssText="position:fixed;top:0;left:0;z-index:"+s.z+";opacity:"+s.o;j("body")[0].appendChild(u);k(),window.onresize=k;window.onmousemove=function(i){i=i||window.event,f.x=i.clientX,f.y=i.clientY},window.onmouseout=function(){f.x=null,f.y=null};for(var t=[],p=0;s.n>p;p++){var h=a()*r,g=a()*n,q=2*a()-1,d=2*a()-1;t.push({x:h,y:g,xa:q,ya:d,max:6000})}setTimeout(function(){b()},100)}();
//点击爆炸效果
if (!document.getElementById('clickBoom')){
    let canvas=document.createElement("canvas");
    canvas.classList.add('fireworks');
    canvas.id = 'clickBoom';
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '99999999';
    canvas.style.pointerEvents = 'none'
}
let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
let ff = navigator.userAgent.indexOf('Firefox') > 0;
let tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
if (iOS) document.body.classList.add('iOS');
let fireworks = (function() {
    let getFontSize = function() {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    var canvas = document.querySelector('.fireworks');
    var ctx = canvas.getContext('2d');
    var numberOfParticules = 24;
    var distance = 200;
    var x = 0;
    var y = 0;
    var animations = [];
    var setCanvasSize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    var updateCoords = function(e) {
        x = e.clientX || e.touches[0].clientX;
        y = e.clientY || e.touches[0].clientY;
    }
    var colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99'];
    var createCircle = function(x,y) {
        var p = {};
        p.x = x;
        p.y = y;
        p.color = colors[anime.random(0, colors.length - 1)];
        p.color = '#FFF';
        p.radius = 0;
        p.alpha = 1;
        p.lineWidth = 6;
        p.draw = function() {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.lineWidth = p.lineWidth;
            ctx.strokeStyle = p.color;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        return p;
    }
    let createParticule = function (x, y) {
        let p = {};
        p.x = x;
        p.y = y;
        p.color = colors[anime.random(0, colors.length - 1)];
        p.radius = anime.random(getFontSize(), getFontSize() * 2);
        p.draw = function () {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        return p;
    };
    var createParticles = function(x,y) {
        var particules = [];
        for (var i = 0; i < numberOfParticules; i++) {
            var p = createParticule(x, y);
            particules.push(p);
        }
        return particules;
    }
    var removeAnimation = function(animation) {
        var index = animations.indexOf(animation);
        if (index > -1) animations.splice(index, 1);
    }
    var animateParticules = function(x, y) {
        setCanvasSize();
        var particules = createParticles(x, y);
        var circle = createCircle(x, y);
        var particulesAnimation = anime({
            targets: particules,
            x: function(p) { return p.x + anime.random(-distance, distance); },
            y: function(p) { return p.y + anime.random(-distance, distance); },
            radius: 0,
            duration: function() { return anime.random(1200, 1800); },
            easing: 'easeOutExpo',
            complete: removeAnimation
        });
        var circleAnimation = anime({
            targets: circle,
            radius: function() { return anime.random(getFontSize() * 8.75, getFontSize() * 11.25); },
            lineWidth: 0,
            alpha: {
                value: 0,
                easing: 'linear',
                duration: function() { return anime.random(400, 600); }
            },
            duration: function() { return anime.random(1200, 1800); },
            easing: 'easeOutExpo',
            complete: removeAnimation
        });
        animations.push(particulesAnimation);
        animations.push(circleAnimation);
    }
    anime({
        duration: Infinity,
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animations.forEach(function(anim) {
                anim.animatables.forEach(function(animatable) {
                    animatable.target.draw();
                });
            });
        }
    });
    document.addEventListener(tap, function(e) {
        updateCoords(e);
        animateParticules(x, y);
    }, false);
})();

