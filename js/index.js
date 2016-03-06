// JavaScript Document
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

function fnLoad(){
	var oW=id('welcome');
	var bTime=false;
	var bImgTime=true;
	var iTime=new Date().getTime();
	var oTimer=0;
	bind(oW,"webkitTransitionEnd",end);
	bind(oW,"transitionend",end);
	oTimer=setInterval(function(){
		if(new Date().getTime()-iTime>=5000){
			bTime=true;	
		}	
		if(bImgTime&&bTime){
			clearInterval(oTimer);
			//alert('执行跳转了');
			oW.style.opacity=0;	
		}
	},1000);
	function end()
	{
		removeClass(oW,"pageShow");
		fnTab();
	}
}

function fnTab(){
	var oTab=id('tabPic');	
	var oList=id('picList');
	var aNav=oTab.getElementsByTagName('nav')[0].children;	
	var iNow=0;
	var iX=0;
	var iW=view().w;
	var oTimer=0;
	var iStart=0;
	var iStartTouchX=0;
	var arr=[];
	auto();
	fnScore();
	function auto(){
		oTimer=setInterval(function(){
			iNow++;	
			iNow=iNow%aNav.length;
			tab();
		},2000);
	}
	bind(oTab,"touchstart",fnStart);
	bind(oTab,"touchmove",fnMove);
	bind(oTab,"touchend",fnEnd);
	function fnStart(ev){
		oList.style.WebKitTransition=oList.style.transition="0.5s";         /*清除掉*/
		var ev=ev.changedTouches[0];
		iStartTouchX=ev.pageX;
		iStart=iX;
		clearInterval(oTimer);
	}
	function fnMove(ev){
		var ev=ev.changedTouches[0];
		var iDis=ev.pageX-iStartTouchX;
		iX=iStart+iDis;
		oList.style.WebKitTransform=oList.style.transform="translateX("+iX+"px)";
	}
	function fnEnd()
	{
		iNow=iX/iW;
		iNow=-Math.round(iNow);
		//console.log(iX);
		if(iNow<0)
		{
			iNow=0;
		}
		if(iNow>aNav.length-1)
		{
			iNow=aNav.length-1;
		}
		tab();
		auto();
	}
	
	function tab(){
		iX=-iNow*iW;
		oList.style.WebKitTransition=oList.style.transition="0.5s";
		oList.style.WebKitTransform=oList.style.transform="translateX("+iX+"px)";
		for(var i=0;i<aNav.length;i++){
			removeClass(aNav[i],"active");	
		}
		addClass(aNav[iNow],"active");	
	}
}

function fnScore(){
	var oScore=id("score");
	var aLi=oScore.getElementsByTagName("li");
	var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
	for(var i=0;i<aLi.length;i++){
		fn(aLi[i]);
	}
	function fn(oLi){
		var aNav=oLi.getElementsByTagName("a");
		var oInput=oLi.getElementsByTagName("input")[0];
		for(var i=0;i<aNav.length;i++){
			aNav[i].index=i;
			bind(aNav[i],"touchstart",function(){
				for(var i=0;i<aNav.length;i++)
				{
					if(i<=this.index)
					{
						addClass(aNav[i],"active");
					}					
					else
					{
						removeClass(aNav[i],"active");
					}
				}
				oInput.value=arr[this.index];
			});
		}
	}
	fnIndex();
}
function fnInfo(oInfo,sInfo)
{
	oInfo.innerHTML=sInfo;
	oInfo.style.WebkitTransform="scale(1)";
	oInfo.style.opacity=1;
	setTimeout(function(){
		oInfo.style.WebkitTransform="scale(0)";
		oInfo.style.opacity=0;
	},1000);
}
function fnIndex(){
	var oIndex=id("index");
	var oBtn=oIndex.getElementsByClassName("btn")[0];
	var oInfo=oIndex.getElementsByClassName("info")[0];
	var bScore=false;
	bind(oBtn,"touchend",fnEnd);
	function fnEnd()
	{
		bScore=fnScoreChecked();
		if(bScore)
		{
			if(bTag())
			{
				fnIndexOut();		
			}
			else
			{
				fnInfo(oInfo,"给景区添加标签");	
			}
		}
		else
		{
			fnInfo(oInfo,"给景区评分");
		}
	}
	function fnScoreChecked()
	{
		var oScore=id("score");
		var aInput=oScore.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++)
		{
			if(aInput[i].value==0)
			{
				return false;
			}
		}
		return true;
	}
	function bTag()
	{
		var oTag=id("indexTag");
		var aInput=oTag.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++)
		{
			if(aInput[i].checked)
			{
				return true;
			}
		}
		return false;
	}
}

function fnIndexOut(){
	var oMask=id('mask');
	var oIndex=id('index');
	var oNews=id('news');
	addClass(oMask,'pageShow');
	addClass(oNews,'pageShow');
	fnNews();
	setTimeout(function(){
		oMask.style.opacity=1;
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";	
	},20);
	setTimeout(function(){
		oNews.style.transition=".8s";	
		oMask.style.opacity=0;
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";
		oNews.style.opacity=1;	
	},1000);
	
}

function fnNews()
{
	var oNews=id("news");
	var oInfo=oNews.getElementsByClassName("info")[0];
	var aInput=oNews.getElementsByTagName("input");
	aInput[0].onchange=function()
	{ 
		if(this.files[0].type.split("/")[0]=="video")
		{
			fnNewsOut();
		}
		else
		{
			fnInfo(oInfo,"请上传视频");
		}
	};
	aInput[1].onchange=function()
	{
		if(this.files[0].type.split("/")[0]=="image")
		{
			fnNewsOut();
		}
		else
		{
			fnInfo(oInfo,"请上传图片");
		}
	};
}
function fnNewsOut()
{
	var oNews=id("news");
	var oForm=id("form");
	addClass(oForm,"pageShow");
	oNews.style.cssText="";
	removeClass(oNews,"pageShow");
}
