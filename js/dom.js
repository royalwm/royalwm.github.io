//获取对象
function $(element) {
    if (element.substring(0, 1) == "#") {
        return document.getElementById(element.substring(1));
    }
    if (element.substring(0, 1) == ".") {
        return document.getElementsByClassName(element.substring(1))[0];
    }
};
//获取内联样式和内部样式
function getStyle(dom, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(dom, null)[attr];
    } else {
        return dom.currentStyle[attr];
    }
};
//动画移动函数dom对象，move(this,{width:"100px",height:"100px",opacity:"0.8"},0.1);bit速率0-1
function move(dom, json, bit, callback) {
    clearInterval(dom.timer);
    var cur = 0;
    var target = 0;
    var speed = 0;
    dom.timer = setInterval(function() {
        var mark = true;
        for (var key in json) {
            if (key == "opacity") {
                cur = getStyle(dom, key) * 100 || 100;
                target = json["opacity"] * 100;
            } else {
                cur = parseInt(getStyle(dom, key)) || 0;
                target = parseInt(json[key]);
            }
            if (bit > 1) bit = 1;
            speed = (target - cur) * bit;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (cur != target) {
                mark = false;
                if (key == "opacity") {
                    //alert(speed)
                    dom.style["opacity"] = (cur + speed) / 100;
                } else {
                    dom.style[key] = cur + speed + "px";
                }
            }
            if (mark) {
                clearInterval(dom.timer);
                if (callback) callback.call(dom);
            }
        }
    }, 60);
};
//获取鼠标的位置
function captureMouse(element) {
    var mouse = {
            x: 0,
            y: 0,
            event: null
        },
        // document.documentElement.scrollLeft
        // document.body.scrollTop
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    element.addEventListener('mousemove', function(evt) {

        var x,
            y,
            e = evt || window.event; // ie  w3c

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + body_scrollLeft + element_scrollLeft;
            y = e.clientY + body_scrollTop + element_scrollTop;
        }
        x -= offsetLeft;
        y -= offsetTop;

        mouse.x = x;
        mouse.y = y;
        mouse.event = e;
    }, false);

    return mouse;
};

function getXY(element) {
    element.addEventListener("mouseover", function(e) {
        var ev = e || window.event;
        var x = 0,
            y = 0;
        if (ev.pageX) {
            x = ev.pageX;
            y = ev.pageY;
        } else {
            //拿到scrollTop 和scrollLeft
            var sleft = 0,
                stop = 0;
            //ie678---
            if (document.documentElement) {
                stop = document.documentElement.scrollTop;
                sleft = document.documentElement.scrollLeft;
            } else {
                //ie9+ 谷歌
                stop = document.body.scrollTop;
                sleft = document.body.scrollLeft;
            }
            x = ev.clientX + sleft;
            y = ev.clientY + stop;
        }
    }, false);
    return {
        x: x,
        y: y
    };
};

//drag({id:boxDom,ghost:true,callback:function(){}}); ghost镜像 position位置 arrow方向 有水平h 水平v opacity:镜像透明度
function drag(options) {
    var opts = mix({}, {
        position: options.id.parentElement,
        arrow: "null",
        opacity: 0.2,
        ghost: false
    }, options);
    var dom = opts.id;
    dom.onmousedown = function(e) {
        var sx = getXY(e).x;
        var sy = getXY(e).y;
        var ol = dom.offsetLeft;
        var ot = dom.offsetTop;
        this.style.cursor = "move";
        if (opts.ghost) var divGhost = dom.cloneNode();
        document.onmousemove = function(e) {
            var tx = getXY(e).x;
            var ty = getXY(e).y;
            var x = 0,
                y = 0;
            if (opts.arrow == "null") {
                x = tx - (sx - ol);
                y = ty - (sy - ot);
            } else if (opts.arrow == "h") {
                y = dom.style.top;
                x = tx - (sx - ol);
            } else if (opts.arrow == "v") {
                x = dom.style.left;
                y = ty - (sy - ot);
            }
            var MaxLeft = 0;
            var maxTop = 0;
            if (opts.position == document.getElementsByTagName("body")[0]) {
                var maxX = Math.max(window.innerWidth, document.body.clientWidth);
                var maxY = Math.max(window.innerHeight, document.body.clientHeight);
                MaxLeft = maxX - dom.offsetWidth;
                MaxTop = maxY - dom.offsetHeight;
            } else {
                var maxX = opts.position.offsetWidth + opts.position.offsetLeft;
                var maxY = opts.position.offsetTop + opts.position.offsetHeight;
                MaxLeft = maxX - dom.offsetWidth;
                MaxTop = maxY - dom.offsetHeight;
            }
            if (x <= 0) x = 0;
            if (y <= 0) y = 0;
            if (x >= MaxLeft) x = MaxLeft;
            if (y >= MaxTop) y = MaxTop;
            if (opts.ghost) {
                opts.position.appendChild(divGhost);
                divGhost.style.left = x + "px";
                divGhost.style.top = y + "px";
                divGhost.style.opacity = opts.opacity;
            } else {
                dom.style.left = x + "px";
                dom.style.top = y + "px";
            }
        }
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
            if (opts.ghost) {
                dom.style.left = divGhost.style.left;
                dom.style.top = divGhost.style.top;
                opts.position.removeChild(divGhost);
            }
            dom.style.cursor = "default";
            if (opts.callback) opts.callback.call(dom);
        }
    }
}
//对象的混入
function mix(source, target) {
    var args = [].slice.call(arguments);
    var i = 1;
    if (args.length == 1) {
        return source;
    }
    while (target = args[i++]) {
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                source[key] = target[key];
            }
        }
    }
    return source;
}

function randomColor() {
    var r = Math.floor(Math.random() * 255).toString(16);
    var g = Math.floor(Math.random() * 255).toString(16);
    var b = Math.floor(Math.random() * 255).toString(16);
    return "#" + r + g + b;
}
//随机大小
function randomFloorSize(start, end) {
    return Math.floor(Math.random() * end) + start;
}
//克隆json
function cloneJson(obj) {
    var target = {};
    for (var key in obj) {
        if ((typeof obj[key]).toLowerCase() != "object") {
            if (obj.hasOwnProperty(key)) target[key] = obj[key];
        } else {
            target[key] = cloneJson(obj[key]);
        }
    }
    return target;
}
//clock(id:xx,background:xx,hoursColor:xx,minutesColor:xx,secondsColor:xx)
function clock(options) {
    var opts = mix({}, options);
    var cw = opts.id.width;
    var rate = cw / 200;
    var r = cw / 2;
    var ch = opts.id.height;
    var context = opts.id.getContext("2d");

    function background() {
        context.save();
        context.beginPath();
        context.lineWidth = 10 * rate;
        context.strokeStyle = opts.background || "#ccc";
        context.translate(r, ch / 2);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = 10 * rate + "px 微软雅黑";
        var arr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
        for (var i = 0; i < arr.length; i++) {
            var rad = Math.PI * 2 / 12 * i;
            var x = Math.cos(rad) * (r - 30 * rate);
            var y = Math.sin(rad) * (r - 30 * rate);
            context.fillText(arr[i], x, y);
        };
        context.arc(0, 0, r - 5 * rate, Math.PI * 2, false);
        context.stroke();
        for (var i = 0; i < 60; i++) {
            context.beginPath();
            var rad = Math.PI * 2 / 60 * i;
            var x = Math.cos(rad) * (r - 15 * rate);
            var y = Math.sin(rad) * (r - 15 * rate);
            if (i % 5 == 0) {
                context.fillStyle = "#000";
                context.arc(x, y, 3 * rate, Math.PI * 2, false);
            } else {
                context.fillStyle = "#ccc";
                context.arc(x, y, 2 * rate, Math.PI * 2, false);
            }
            context.fill();
        };
    }

    function dot() {
        context.beginPath();
        context.fillStyle = "#ccc";
        context.arc(0, 0, 5 * rate, Math.PI * 2, false);
        context.fill();
    }

    function drawHours(hours, minutes) {
        context.save();
        var rad = Math.PI * 2 / 12 * hours;
        var rad2 = Math.PI * 2 / 12 / 60 * minutes;
        context.rotate(rad + rad2);
        context.beginPath();
        context.lineWidth = 4 * rate;
        context.strokeStyle = opts.hoursColor || "#000";
        context.moveTo(0, 10 * rate);
        context.lineTo(0, -r + 65 * rate);
        context.lineCap = "round";
        context.stroke();
        context.restore();
    }

    function drawMinute(minute) {
        context.save();
        var rad = Math.PI * 2 / 60 * minute;
        context.rotate(rad);
        context.beginPath();
        context.lineWidth = 3 * rate;
        context.strokeStyle = opts.minutesColor || "red";
        context.moveTo(0, 15 * rate);
        context.lineTo(0, -r + 50 * rate);
        context.lineCap = "round";
        context.stroke();
        context.restore();
    }

    function drawSeconds(seconds) {
        context.save();
        var rad = Math.PI * 2 / 60 * seconds;
        context.rotate(rad);
        context.beginPath();
        context.lineWidth = 2 * rate;
        context.strokeStyle = opts.secondsColor || "red";
        context.moveTo(0, 20 * rate);
        context.lineTo(0, -r + 40 * rate);
        context.lineCap = "round";
        context.stroke();
        context.restore();
    }
    var timer = setInterval(function() {
        context.clearRect(0, 0, cw, ch);
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        background();
        dot();
        drawHours(hours, minutes);
        drawMinute(minutes);
        drawSeconds(seconds);
        context.restore();
    }, 1000);
}

function mix(source, target) {
    var args = [].slice.call(arguments);
    var i = 1;
    if (args.length == 1) {
        return source;
    }
    while (target = args[i++]) {
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                source[key] = target[key];
            }
        }
    }
    return source;
}