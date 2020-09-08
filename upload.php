<?php

//异步上传，post提交过来的image是字符串

//接收post传来的base64
$base64Str = $_POST['image'];
//post的数据里面，加号会被替换为空格，需要重新替换回来，如果不是post的数据，则注释掉这一行
$base64Image = str_replace(' ', '+', $base64Str);
//匹配出图片的格式
if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64Image, $result)){
	//获取后缀
    $type = $result[2];
        //设置保存路径
        $filePath = "./upload/";
        if(!file_exists($filePath)){
            mkdir($filePath, 0755);
        }
        //设置文件名
        $fileName = uniqid() . rand(0000,9999);
        //设置图片路径
        $newFile = $filePath.$fileName.".{$type}";
        //存放图片
        if (file_put_contents($newFile, base64_decode(str_replace($result[1], '', $base64Image)))){
            //返回文件路径
        die($new_file);
    }else{
        die("alert('error')");
    }
}else{
    die("alert('error')");
}
