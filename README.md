# cupload

基于原生js的图片上传插件

![](https://img.shields.io/badge/javascript-4EDD96.svg)

支持图片预览、像素限制、大小限制、多图上传、页面初始化加载图片

#### 下载使用

下载：

<pre>
  git clone https://github.com/cuuuuuirz/cupload.git
</pre>

使用：

引入js：
```html
<script src="static/js/cupload.js"></script>
```

在需要的位置添加html：
```html
<div id="cupload"></div>
```

实例化cupload对象：
```html
<script type="text/javascript">
	var cupload = new Cupload ({
		ele: "#cupload"
	});
</script>
```

#### 可选参数
//为方便比较和计算,部分参数为number型,已设置默认单位,不可再带单位。
```javascript
{
	ele		: "#cupload",		// 实例化的DOM对象id,必需,默认为cupload
	name		: "image",		// 图片input的name名,非必需,默认为image
	num		: 1,			// 可上传图片的数量,非必需,默认为1
	width		: 148,			// 预览框的宽,单位为px,非必需,默认为148
	height		: 148,			// 预览框的高,单位为px,非必需,默认为148
	minSize		: 1024,			// 图片大小最小限制,单位为KB,非必需,无默认值
	maxSize		: 2048,			// 图片大小最大限制,单位为KB,非必需,无默认值
	limitedSize	: 2048,			// 图片大小要求,单位为KB,非必需,无默认值
	minWidth	: 100,			// 图片宽度最小限制,单位为px,非必需,无默认值
	minHeight	: 100,			// 图片高度最小限制,单位为px,非必需,无默认值
	maxWidth	: 2000,			// 图片宽度最大限制,单位为px,非必需,无默认值
	maxHeight	: 2000,			// 图片高度最大限制,单位为px,非必需,无默认值
	limitedWidth	: 800,			// 图片宽度要求,单位为px,非必需,无默认值
	limitedHeight	: 800,			// 图片高度要求,单位为px,非必需,无默认值
	data		: ["1.png", "2.jpg"],	// 编辑模式下初始显示的图片路径,非必需,无默认值
}
```

### TODO
使用了FileReader的readAsDataURL方法，将图片转为base64编码格式展示和上传，图片越大，base64编码越长，上传时对服务器的性能是个考验。写这个DEMO当做抛砖引玉，望各位大佬有更好的方法指教。