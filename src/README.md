
前端纳米学位网站优化项目
===============================

##该项目的简介


##怎么使用这个项目

######0.  特别说明，为了便于用户进行快速浏览网站运行效果，特此把此网站的副本托管在了GitHub Pages上。
          访问连接https://luocooldong.github.io/index.html

######1.  克隆代码库到本地
    git clone https://github.com/luocooldong/Website-Optimization_P6.git
	
######2.  双击打开dist/index.html文件即可运行，浏览最后的效果。

######3.  说明src文件夹内存放的是项目的源代码，dist文件夹内存放的是经过自动化Grunt构建工具构建后的代码
          HTML，CSS ，JavaScript文件都经过了最小化的处理。保证了网页加载的速度。
	
######4.  用户如果想自己重新构建引用，那么可以在Website-Optimization_P6根文件夹中运行npm install命令，
          这样系统就会根据package.json文件中提前设定好的依赖包下载响应的包。待报下载完成后，然后grunt serve命令，
		  这样该项目就会根据src文件夹内的文件自动构建(jshint校验--css最小化--js最小化--内联特定css和js--html最小化--开启服务器并在浏览器中预览)
		  到dist文件夹中。并会自动做好监视，当src中的文件被修改时，就会重新开始自动构建新的。

		
		 	  
##在项目中所进行的一些重要文件的修改

(1) index.html  
#######对于字体的处理， 提高响应式网站的加载速度               
				为了提高字体的加载速度，特此对自己进行了额外的处理。
                下载google字体的webfont版本，然后把下载下来的TTFS文件转码成base64的形式，存放在CSS文件中。
				使用工具异步加载该字体，并将该字体存储在localStorage中，以便第二次访问网站时可以直接使用。 
				参考链接：https://www.w3ctech.com/topic/693
#######对于引用CSS的处理，优化关键路径，  
                减少关键路径资源数(把一些非公共需要的css文件内联HTML中)，
				减少关键路径字节数(最小化处理)
				把一些公共css文件中阻止关键呈现的css属性放到html的head中
				对于print打印时用到的css文件，需要在引用的时候添加media媒体查询
#######对于引用js文件的处理， 优化关键路径
                对于那些影响DOM构建的js引用，添加async属性，这样DOM的构建就不会收到js执行的阻止
				(这样处理的前提是已经确认好了预加载js的语句不会对于css和dom产生影响，否则这样做会破坏了原来界面像素的正常渲染)
#######对于项目中的用到的图片，已经及时的替换为了pagespeed建议优化后的图片
                这样做会节省很多的资源开销
#######经过准确的在Github Pages上的部署，以及在pagespeed上的测试，分别在移动设备和桌面设备山上取得了95和96分的好成绩。


(2)pizza.html
#######对于pizza.html的处理同样遵循了和index.html一样的处理方式，
              不同的时尽量的吧pizza.html单独占有的资源文件css，js全部内联到了html中去。
(3)views/js/main.js
#######为了使pizza页面在滚动保持在60fps的帧速，消除了引起页面滚动时产生的卡顿，
              经过在timeline(时间轴)定位，找出了红色标记的函数updatePositions，里面存在了大量的布局重复（需要大量的计算），
			  即是出现了强制同步布局的现象(FSL)，所以我们要停止FSL。
			  所以对于里面的一些计算量比较大，补药反复计算的变量进行了提前计算，并设定变量中间值例如数组进行保留。
			  对于一些样式的属性的自身取值后修改然后再付给自身也进行处理。
			  同时要消除一些在for循环里嵌套一些不必要的会进行大量处理的函数，相反，把一些要用到的值在进行循环之前就已经计算好。
#######为了使页面上的pizza尺寸滑块调整pizza大小的时间小于5毫秒
              同样也是先消除强制同步布局引起的卡顿。
			  在timeline中进过定位，找到了引起卡顿的地方是在changePizzaSizes函数中。
			  这里面以非常紧凑的形式执行了大量的任务，显然是不应该的，执行的太多了，其实是有很多不必要的。
			  同时里面也在不断的调用determineDx函数。
			  1.  修改点  提前保存变量
			      对于相同的自我检测代码可以提前抽取出来放到前面，这样后面就可以方便调用，而不用再重新取一些已经进过检测后的值。
				  将这些DOM节点操作集合到变量randomPizzas中，然后再for循环中可以使用，而不用再每次都查询DOM
			  2.  修改点  停止强制同步布局
			      以dom操作的形式访问到元素的几何属性，然后再立即把这个值赋值给元素的样式style属性，这样做明显导致了强制同步布局。
				  解决办法，是把要设定的值提前以硬编码的形式放在switch case语句中，然后根据全局变量latestPizzaSize(即上一次选定披萨尺寸的大小)，
				  来设定要披萨的宽度值，最后在for循环里把值赋值给元素的样式style属性。
			  3.  删除determineDx函数  执行了太多无用的任务  更不应该在for循环中出现
			  4.  'px'像素值创建公式同样也会导致大量不必要的工作，所以在这里换成了"%"的形式
#######RequestAnimationFrame动画效果的使用
              简洁：RequestAnimationFrame方法用来通知浏览器重采样动画。
			  用户不需要再通过setInterval或setTimeout定时器来实现主循环来指定循环
			  间隔时间，浏览器会基于当前页面是否可见，CPU的负荷情况来自行决定最佳的帧速度，
			  从而更合理的使用CPU，实现如最优帧速率，选择绘制下一帧的最佳时机等等。
			  所以这样会极大的提升网站事件的运行效能。
			  
              
##一些资源

######网站优化
    网站性能优化: https://www.udacity.com/course/website-performance-optimization--ud884
    浏览器渲染优化: https://www.udacity.com/course/browser-rendering-optimization--ud860
	网页基础知识(Google开发者Web):  https://developers.google.com/web/fundamentals/
	Chrome 开发者工具:  https://developers.google.com/web/tools/chrome-devtools/
    Github Pages: https://luocooldong.github.io/index.html
	RequestAnimationFrame动画： https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	响应式网站webfonts字体优化：http://bdadam.com/blog/loading-webfonts-with-high-performance.html
	