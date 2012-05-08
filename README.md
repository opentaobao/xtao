# xtao

方便TOP组件开发的命令行工具。在使用此工具/开发组件前请务必阅读[TOP组件开发规范](top-widget-specification.md)

## 安装

	npm install xtao

## 使用

### 创建一个新组件
	
	xtao create widgetname [options]

	Options
		-v version 指定版本号（默认为1.0）

此命令帮助快速建立一个新组件的文件结构以及模板文件。

### 构建组件
	
	xtao build [options]

	Options
		-f 强制生成src/demo.html

此命令帮助自动根据config.json生成demo页面。

