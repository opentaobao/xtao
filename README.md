# xtao

方便TOP组件开发的命令行工具。在使用此工具/开发组件前请务必阅读：TOP组件开发规范

## 安装

	npm install -g xtao

## 使用

### 创建一个新组件
	
	xtao create widgetname [options]

	Options
		-v(--version) version 指定版本号（默认为1.0）
		-f(--iframe) 生成iframe模板文件

此命令帮助快速建立一个新组件的文件结构以及模板文件，如下所示：

	widgetname
		|
		|--version(默认1.0)
		     |
		     |--assets                  <--该目录下存放组件所需资源文件
		     |	  |  
		     |	  |--widgetname.css     <--组件样式文件  
		     |  
		     |--demo  
		     |	  |  
		     |	  |--src                <--个性化的设置可以修改该目录下对应文件（此目录下的文件都会在build的时候合并到demo文件中）
		     |	  	  |
		     |	  	  |--config.html    <--demo的配置部分
		     |	  	  |--preview.html   <--demo的预览部分
		     |	  	  |--demo.css       <--demo的样式文件
		     |	  	  |--demo.js        <--demo的脚本文件
		     |
		     |--widgetname.js           <--组件脚本文件
		     |--config.json             <--组件参数配置文件

### 构建组件
	
	xtao build [options]

	Options
		-f(--force) 强制根据config.json生成src/config.html（默认只在第一次时候生成）
		-a(--all) 生成用于最终发布的demo/demo.html

此命令帮助自动根据config.json生成demo页面，如下所示：

	...
		     |
		     |--assets                  
		     |	  |  
		     |	  |--widgetname.css     
		     |  
		     |--demo  
		     |	  |  
		     |	  |--src                
		     |	  |	  |
		     |	  |	  |--config.html     <--根据config.json自动生成（需-f或者初次）
		     |	  |	  |--preview.html   
		     |	  |	  |--demo.css       
		     |	  |	  |--demo.js        
		     |	  |	          
		     |	  |--demo-dev.html        <--自动生成的用于daily测试的demo	          
		     |	  |--demo-pro.html        <--自动生成的用于预发测试的demo	          
		     |	  |--demo.html  	        <--自动生成的用于最终发布的demo（需-a参数）  
		     |	  	          
		     |	  	          
		     |--widgetname.js           
		     |--config.json             



