function dom(id){
			return document.getElementById(id);
		};
			var DwMusic = {
				audioDom:null,
				init:function(callback){
					this.audioDom = dom("audio");
					this.time(callback);
				},
				play:function(){
					this.audioDom.play();
				},
				stop:function(){
					this.audioDom.pause();
				},
				time:function(callback){
					var $this=this;
					this.audioDom.oncanplaythrough=function(){
						if(callback)callback.call(this,$this.format(this.duration));
					};
				},
				currentTime:function(callback){
					var $this=this;
					this.audioDom.ontimeupdate=function(){
						var ctime=this.currentTime;
						if(callback)callback.call(this,$this.format(ctime));
					};

				},
				format:function(time){
					var m=Math.floor(time/60);
					var s=Math.floor(time%60);
					if(m<10)m="0"+m;
					if(s<10)s="0"+s;
					return m+":"+s;
				},
				percent:function(){},
				mute:function(){},
				next:function(){},
				loadLrc:function(){}
			};

			$(function(){
				//播放器初始化
				DwMusic.init(function(time){
					$("#ptime").html(time);
				});
				DwMusic.currentTime(function(time){
					$("#time").html(time);
				});
				//播放开始和暂停
				$(".ke_op").on("click",function(){
					var $i = $(this).find("i");
					if($i.hasClass("icon-play")){
						$i.toggleClass("icon-play icon-pause");
						DwMusic.play();
					}else{
						$i.toggleClass("icon-pause icon-play");
						DwMusic.stop();
					}
				});
			});
			//鑾峰彇dom瀵硅薄--byid
function dom(id){
	return document.getElementById(id);
};

//闅忔満棰滆壊,op閫忔槑搴︼紝涓嶅啓灏�
function randDomColor(op){
	var r = Math.floor(Math.random()*256);
	var g = Math.floor(Math.random()*256);
	var b = Math.floor(Math.random()*256);
	return "rgba("+r+","+g+","+b+","+(op||1)+")";
};

//缁欏厓绱犳坊鍔犳牱寮忓垪琛�
function css(dom,opts){
	for(var key in opts){
		var val = opts[key];
		if(typeof val=="number"){
		val+="px";
	}
	dom["style"][key] = val;
	}
};
