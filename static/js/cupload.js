(function(window, document) {

	//定义上传类
	var Cupload = function(options) {

		//初始化 new对象
		if (!(this instanceof Cupload)) {
			return new Cupload(options)
		}

		//设置默认参数
		this.localValue = {
			ele: '#cupload',
			name: 'image',
			num: 1,
			width: 148,
			height: 148,
		}

		//参数覆盖
		this.opt = this.extend(this.localValue, options, true)

		//所需变量
		this.i = 0;
		this.imageArr 		= new Array();//图片
		this.widthArr 		= new Array();//图片宽度
		this.heightArr 		= new Array();//图片高度
		this.imageBox 		= new Array();//图片盒子
		this.imagePreview 	= new Array();//图片预览
		this.imageInput 	= new Array();//图片input
		this.imageDelete 	= new Array();//图片删除遮罩
		this.deleteBtn 		= new Array();//图片删除按钮

		if ((typeof options.ele) === "string") {
			this.opt.ele = document.querySelector(options.ele)
		} else {
			this.opt.ele = options.ele
		}

		this.initDom();
	}

	Cupload.prototype = {
		constructor: this,

		//初始化
		initDom: function() {
			this.cteateImageList()
			this.createUploadBox()
			this.createOverlay()
			if (this.opt.data) {
				this.showImagePreview()
			}
		},

		//参数覆盖
		extend: function(o, n, override) {
			for (var key in n) {
				if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
					o[key] = n[key]
				}
			}
			return o
		},

		//创建图片列表
		cteateImageList: function() {
			this.imageList = document.createElement('ul')
			this.imageList.className = 'cupload-image-list'
			this.imageList.style.margin = 0
			this.imageList.style.padding = 0
			this.imageList.style.display = 'inline'
			this.imageList.style.minHeight = this.opt.height
			this.opt.ele.appendChild(this.imageList)
		},

		//创建上传框
		createUploadBox: function() {
			this.uploadBox = document.createElement('div')
			this.uploadBox.className = 'cupload-upload-box'
			this.uploadBox.style.position = 'relative'
			this.uploadBox.style.display = 'inline-block'
			this.uploadBox.style.textAlign = 'center'
			this.uploadBox.style.backgroundColor = '#fbfdff'
			this.uploadBox.style.border = '1px dashed #c0ccda'
			this.uploadBox.style.borderRadius = '6px'
			this.uploadBox.style.WebkitBoxSizing = 'border-box'
			this.uploadBox.style.boxSizing = 'border-box'
			this.uploadBox.style.width = this.opt.width + 'px'
			this.uploadBox.style.height = this.opt.height + 'px'
			this.uploadBox.style.lineHeight = this.opt.height + 'px'
			this.opt.ele.appendChild(this.uploadBox)
			this.createUploadBtn()
			this.createUploadInput()
			var _this = this
			this.uploadBox.onmouseover = function() {
				_this.uploadBox.style.borderColor = '#409eff'
			}
			this.uploadBox.onmouseout = function() {
				_this.uploadBox.style.borderColor = '#c0ccda'
			}
		},

		//创建遮罩
		createOverlay: function() {
			this.overlay = document.createElement('div')
			this.overlay.className = 'cupload-overlay'
			this.overlay.style.display = "none"
			this.overlay.style.position = "fixed"
			this.overlay.style.textAlign = "center"
			this.overlay.style.top = 0
			this.overlay.style.right = 0
			this.overlay.style.bottom = 0
			this.overlay.style.left = 0
			this.overlay.style.zIndex = 9115
			this.overlay.style.backgroundColor = "rgba(0,0,0,.3)"
			this.opt.ele.appendChild(this.overlay)
			var _this = this
			this.overlay.onclick = function() {
				_this.zoomOutImage()
			}
		},

		//创建上传按钮
		createUploadBtn: function() {
			this.uploadBtn = document.createElement('span')
			this.uploadBtn.className = 'cupload-upload-btn'
			this.uploadBtn.style.position = 'absolute'
			this.uploadBtn.style.left = this.opt.width/2 - 14 + 'px'
			this.uploadBtn.style.fontSize = '28px'
			this.uploadBtn.style.color = '#8c939d'
			this.uploadBtn.innerHTML = '+'
			this.uploadBox.appendChild(this.uploadBtn)
		},

		//创建上传input
		createUploadInput: function() {
			this.uploadInput = document.createElement('input')
			this.uploadInput.className = 'cupload-upload-input'
			this.uploadInput.style.position = 'absolute'
			this.uploadInput.style.top = 0
			this.uploadInput.style.right = 0
			this.uploadInput.style.width = '100%'
			this.uploadInput.style.height = '100%'
			this.uploadInput.style.opacity = 0
			this.uploadInput.style.cursor = 'pointer'
			this.uploadInput.type = 'file'
			this.uploadInput.multiple = 'multiple'
			this.uploadInput.accept = 'image/*'
			this.uploadInput.title = ''
			this.uploadBox.appendChild(this.uploadInput)
			var _this = this
			this.uploadInput.onchange = function() {
				_this.removeUploadBox()
				_this.uploadImage()
			}
		},

		//上传图片
		uploadImage: function() {
			if(this.uploadInput.files.length + this.imageList.children.length > this.opt.num) {
				this.createUploadBox()
				alert('图片数量超出限制，请重新选择')
				return
			}
			for(j = 0; j < this.uploadInput.files.length; j++){
				var file = this.uploadInput.files[j]
				if (!file || this.limitedSize(file)) {
					this.createUploadBox()
					return false
				}
				var reader = new FileReader()
				var _this = this
				reader.onload = function(e) {
					_this.limitedWidthAndHeight(e.target.result, file.name)
				}
				reader.readAsDataURL(file);
			}
			if (this.uploadInput.files.length + this.imageList.children.length < this.opt.num) {
				this.createUploadBox()
			}
		},

		//检测图片大小限制
		limitedSize: function(file) {
			if (this.opt.minSize && file.size < this.opt.minSize * 1024) {
				alert('图片' + file.name + '大小未到最小限制，请重新选择')
				return true
			}
			if (this.opt.maxSize && file.size > this.opt.maxSize * 1024) {
				alert('图片' + file.name + '大小超出最大限制，请重新选择')
				return true
			}
			if (this.opt.limitedSize && file.size > this.opt.limitedSize * 1024) {
				alert('图片' + file.name + '大小不符合要求，请重新选择')
				return true
			}
			return false
		},

		//检测图片像素限制
		limitedWidthAndHeight: function(src, name) {
			var tempImage = new Image()
			tempImage.src = src
			var _this = this
			tempImage.onload = function() {
				if (_this.opt.minWidth && this.width < _this.opt.minWidth) {
					alert('图片' + name + '宽度未到最小限制，请重新选择')
					_this.isCreateUploadBox()
					return false
				}
				if (_this.opt.minHeight && this.height < _this.opt.minHeight) {
					alert('图片' + name + '高度未到最小限制，请重新选择')
					_this.isCreateUploadBox()
					return false
				}
				if (_this.opt.maxWidth && this.width > _this.opt.maxWidth) {
					alert('图片' + name + '宽度超出最大限制，请重新选择')
					_this.isCreateUploadBox()
					return false
				}
				if (_this.opt.maxHeight && this.height > _this.opt.maxHeight) {
					alert('图片' + name + '高度超出最大限制，请重新选择')
					_this.isCreateUploadBox()
					return false
				}
				if (_this.opt.limitedWidth && this.width != _this.opt.limitedWidth) {
					alert('图片' + name + '宽度不符合要求，请重新选择')
					_this.isCreateUploadBox()
					return false
				}
				if (_this.opt.limitedHeight && this.height != _this.opt.limitedHeight) {
					alert('图片' + name + '高度不符合要求，请重新选择')
					_this.isCreateUploadBox()
					return false
				}
				_this.foreachNum(src, name, this.width, this.height)
			}
		},

		//检测图片数量
		foreachNum: function(src, name, width, height) {
			if(this.opt.url) {
				var key = this.opt.name
				var data = {}
				data[key] = src
				var _this = this
				this.ajaxUploadImage(data, function(res) {
					_this.createImageBox(res.responseText, res.responseText, width, height)
				})
			} else {
				this.createImageBox(src, name, width, height)
			}
		},

		//图片异步上传
		ajaxUploadImage: function(data,success) {
			var xhr = null;
		    if(window.XMLHttpRequest){
		        xhr = new XMLHttpRequest()
		    } else {
		        xhr = new ActiveXObject('Microsoft.XMLHTTP')
		    }
		    if(typeof data == 'object'){
		        var str = '';
		        for(var key in data){
		            str += key+'='+data[key]+'&';
		        }
		        data = str.replace(/&$/, '');
		    }
	        xhr.open('POST', this.opt.url, true);
	        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	        xhr.send(data);
		    xhr.onreadystatechange = function(){
		        if(xhr.readyState == 4){
		            if(xhr.status == 200){
		               success(xhr)
		            } else {
	                    alert(((xhr.responseText).split("</p>")[0]).split("<p>")[1])
	                    return false
		            }
		        }
		    }
		},

		//创建图片框
		createImageBox: function(src, name, width, height, state = true) {
			this.imageArr[this.i] = src
			this.widthArr[this.i] = width
			this.heightArr[this.i] = height
			this.imageBox[this.i] = document.createElement('li')
			this.imageBox[this.i].className = 'cupload-image-box'
			this.imageBox[this.i].style.position = 'relative'
			this.imageBox[this.i].style.display = 'inline-block'
			this.imageBox[this.i].style.marginRight = 8 + 'px'
			this.imageBox[this.i].style.backgroundColor = '#fbfdff'
			this.imageBox[this.i].style.border = '1px solid #c0ccda'
			this.imageBox[this.i].style.borderRadius = '6px'
			this.imageBox[this.i].style.WebkitBoxSizing = 'border-box'
			this.imageBox[this.i].style.boxSizing = 'border-box'
			this.imageBox[this.i].style.width = this.opt.width + 'px'
			this.imageBox[this.i].style.height = this.opt.height + 'px'
			this.imageList.appendChild(this.imageBox[this.i])
			this.createImagePreview(src, width, height)
			this.createImageInput(src)
			this.createImageDelete(name)
			if (!state) {
				this.setDefaultImage()
			}
			var _this = this
			for (var m = 0; m <= this.i; m++) {
				this.imageBox[m].index = m
				this.imageBox[m].onmouseover = function(n) {
					return function() {
						_this.showImageDelete(n)
					}
				}(m)

				this.imageBox[m].onmouseout = function(n) {
					return function() {
						_this.hideImageDelete(n)
					}
				}(m)
			}
			this.i++
		},

		//创建图片预览框
		createImagePreview: function(src, width, height) {
			this.imagePreview[this.i] = document.createElement('img')
			this.imagePreview[this.i].className = 'cupload-image-preview'
			this.imagePreview[this.i].style.position = 'absolute'
			this.imagePreview[this.i].style.top = 0
			this.imagePreview[this.i].style.left = 0
			this.imagePreview[this.i].style.right = 0
			this.imagePreview[this.i].style.bottom = 0
			this.imagePreview[this.i].style.margin = 'auto'
			this.imagePreview[this.i].src = src
			this.setImageAttribute(width, height)
			this.imageBox[this.i].appendChild(this.imagePreview[this.i])
		},

		//创建图片input
		createImageInput: function(src) {
			this.imageInput[this.i] = document.createElement('input')
			this.imageInput[this.i].type = 'hidden'
			this.imageInput[this.i].name = this.opt.name + '[]'
			this.imageInput[this.i].value = src
			this.imageBox[this.i].appendChild(this.imageInput[this.i])
		},

		//创建删除
		createImageDelete: function(name) {
			this.imageDelete[this.i] = document.createElement('div')
			this.imageDelete[this.i].className = 'cupload-image-delete'
			this.imageDelete[this.i].style.position = 'absolute'
			this.imageDelete[this.i].style.width = '100%'
			this.imageDelete[this.i].style.height = '100%'
			this.imageDelete[this.i].style.left = 0
			this.imageDelete[this.i].style.top = 0
			this.imageDelete[this.i].style.textAlign = 'center'
			this.imageDelete[this.i].style.color = '#fff'
			this.imageDelete[this.i].style.opacity = 0
			this.imageDelete[this.i].style.cursor = 'zoom-in'
			this.imageDelete[this.i].style.backgroundColor = 'rgba(0,0,0,.5)'
			this.imageDelete[this.i].style.WebkitTransition = '.3s'
			this.imageDelete[this.i].style.transition = '.3s'
			this.imageDelete[this.i].title = name
			this.imageBox[this.i].appendChild(this.imageDelete[this.i])
			this.createDeleteBtn()
			var _this = this
			for (var m = 0; m <= this.i; m++) {
				this.imageDelete[m].onclick = function(n) {
					return function() {
						_this.zoomInImage(n)
					}
				}(m)
			}
		},

		//创建删除按钮
		createDeleteBtn: function() {
			this.deleteBtn[this.i] = document.createElement('span')
			this.deleteBtn[this.i].className = 'cupload-delete-btn'
			this.deleteBtn[this.i].style.position = 'absolute'
			this.deleteBtn[this.i].style.top = 0
			this.deleteBtn[this.i].style.right = 0
			this.deleteBtn[this.i].style.margin = 0
			this.deleteBtn[this.i].style.padding = 0
			this.deleteBtn[this.i].style.fontSize = '18px'
			this.deleteBtn[this.i].style.width = '24px'
			this.deleteBtn[this.i].style.height = '24px'
			this.deleteBtn[this.i].style.cursor = 'pointer'
			this.deleteBtn[this.i].innerHTML = '×'
			this.deleteBtn[this.i].title = ''
			this.imageDelete[this.i].appendChild(this.deleteBtn[this.i])
			var _this = this
			for (var m = 0; m <= this.i; m++) {
				this.deleteBtn[m].onclick = function(n) {
					return function() {
						_this.deleteImage(n)
					}
				}(m)
			}
		},

		//设置默认图片
		setDefaultImage: function() {
			this.imageBox[this.i].style.backgroundColor = "#B2B2B2"
			this.imageDelete[this.i].title = '图片不存在'
			this.imagePreview[this.i].src = 'data:image/png;base64,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'
			if (130 / this.opt.width > 105 / this.opt.height) {
				this.imagePreview[this.i].style.width = this.opt.width - 2 + 'px'
				this.imagePreview[this.i].style.height = 105 / (130 / this.opt.width) - 2 + 'px'
			} else {
				this.imagePreview[this.i].style.width = 130 / (105 / this.opt.height) - 2 + 'px'
				this.imagePreview[this.i].style.height = this.opt.height - 2 + 'px'
			}
		},

		//设置图片宽高
		setImageAttribute: function(width, height) {
			if (width / this.opt.width > height / this.opt.height) {
				this.imagePreview[this.i].style.width = this.opt.width - 2 + 'px'
				this.imagePreview[this.i].style.height = height / (width / this.opt.width) - 2 + 'px'
			} else {
				this.imagePreview[this.i].style.width = width / (height / this.opt.height) - 2 + 'px'
				this.imagePreview[this.i].style.height = this.opt.height - 2 + 'px'
			}
		},

		//data图片预览
		showImagePreview: function() {
			var obj = this.opt.data
			if (obj.length >= this.opt.num) {
				this.removeUploadBox()
			}
			var _this = this
			var tempImage = new Image()
			tempImage.src = obj[this.i]
			tempImage.onload = function() {
				_this.createImageBox(obj[_this.i], obj[_this.i], this.width, this.height)
				setTimeout(function() {
					if (obj[_this.i]) {
						_this.showImagePreview()
					}
				}, 0);
			}
			tempImage.onerror = function() {
				_this.createImageBox(obj[_this.i], obj[_this.i], 0, 0, false)
				setTimeout(function() {
					if (obj[_this.i]) {
						_this.showImagePreview()
					}
				}, 0);
			}
		},

		//图片放大预览
		zoomInImage: function(n) {
			if(event.target.classList[0] === 'cupload-delete-btn') {
				return;
			}
			this.zommImage = document.createElement('img')
			this.zommImage.style.display = "inline-block"
			this.zommImage.style.verticalAlign = "middle"
			this.zommImage.src = this.imageArr[n]
			if (this.widthArr[n] / window.innerWidth > this.heightArr[n] / window.innerHeight) {
				this.zommImage.style.width = 0.8 * window.innerWidth + 'px'
				this.zommImage.style.height = 0.8 * this.heightArr[n] / (this.widthArr[n] / window.innerWidth) + 'px'
			} else {
				this.zommImage.style.width = 0.8 * this.widthArr[n] / (this.heightArr[n] / window.innerHeight) + 'px'
				this.zommImage.style.height = 0.8 * window.innerHeight + 'px'
			}
			this.overlay.appendChild(this.zommImage)
			this.overlay.style.lineHeight = window.innerHeight + 'px'
			this.overlay.style.cursor = "zoom-out"
			this.overlay.style.display = "block"
		},

		//关闭图片放大预览
		zoomOutImage: function() {
			this.overlay.style.display = "none"
			this.zommImage.remove()
		},

		isCreateUploadBox: function() {
			this.removeUploadBox()
			if (this.imageList.children.length < this.opt.num) {
				this.createUploadBox()
			}
		},

		//删除图片
		deleteImage: function(n) {
			this.imageBox[n].remove()
			this.removeUploadBox()
			if (this.imageList.children.length < this.opt.num) {
				this.createUploadBox()
			}
		},

		//移除上传框
		removeUploadBox: function() {
			this.uploadBox.remove()
		},

		//显示图片删除
		showImageDelete: function(m) {
			this.imageDelete[m].style.opacity = 1
		},

		//隐藏图片删除
		hideImageDelete: function(m) {
			this.imageDelete[m].style.opacity = 0
		},
	}

	window.Cupload = Cupload;
})(window, document)