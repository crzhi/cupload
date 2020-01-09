# cupload

基于原生js的图片上传插件

![](https://img.shields.io/badge/javascript-4EDD96.svg)

支持图片预览、像素限制、大小限制、多图上传、页面初始化加载图片

#### 下载使用

✅ 下载：

<pre>
  git clone https://github.com/cuuuuuirz/cupload.git
</pre>

✅ 使用：

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

#### 可选参数(默认值)
```javascript
{
    ele 	  : "#cupload",					  // 实例化的DOM id
    name	  : "image",					  // 图片input框的name名
    data          : ["static/image/1.png", "static/image/2.png"], //为编辑模式下初始显示的图片，默认无此参数
    width	  : 148,					  // 预览框的宽,单位为px.以下都为number型,不加单位
    height	  : 148,					  // 预览框的高,单位为px
    num		  : 1,						  // 可上传图片的数量
    size	  : 2048,					  // 图片大小限制,单位为KB
    limitedWidth  : 1920,					  // 图片宽度限制,单位为px
    limitedHeight : 1080,					  // 图片高度限制,单位为px
}
```

### TODO
