/**
 * @author: wuming.xiaowm
 * @date : 6/24 2012
 * @description: 生成器接口
 */

var page = {};

// @include "io.jsx"
// @include "page/table.jsx"
// @include "page/web.jsx"
// @include "json2-min.jsx"


/**
 * 生成网页接口 
 * @param {Object} data
 * @param {Object} option
 * @param {Object} psd
 */
page.init = function(data,option,psd){ 
	IO.saveFile('e:/test/a.js',JSON.stringify(data),'gb2312');
	page.option = option;
	page.psd = psd;
	page.title = data.name;
	page.width = option.width;
	page.height = option.height;
	
	//文件保存路径
	this.filePath = option.path;
	//文件编码
	if(typeof(option) != 'undefined' && typeof(option.encode) != 'undefined'){
		page.encode = option.encode;
	}else{
		page.encode = "gb2312";
	}
	this.option = option;
	
	//具体解析器
	switch(option.builder) {
		case "EDM":
			this.htmlCode = page.edmHtml(data);
			break;
		case "BBS":
			this.htmlCode = page.bssHtml(data);
			break;
		default:
			this.htmlCode = page.normalPage(data);
			break;
	}
	
	this.saveFile();
};

/**
 *存储文件 
 */
page.init.prototype.saveFile = function(){
	IO.saveFile(this.filePath, this.htmlCode, page.encode);
};

/**
 * edm
 * @param {Object} data
 */
page.edmHtml = function(data){
	var html = new XML('<html xmlns="http://www.w3.org/1999/xhtml"></html>'),
		head = new XML('<head></head>'),
		title = new XML('<title>' + data.name + '</title>'),
		body = new XML('<body></body>');
	
	//body.appendChild(new XML('<style>td{border:1px solid #F00;}</style>'));
	body.appendChild(new page.table(data));
	head.appendChild(title);
	html.appendChild(head);
	html.appendChild(body);
	return '<!DOCTYPE html>'+html.toXMLString();	
};

/**
 * 论坛贴 
 * @param {Object} data
 */
page.bssHtml = function(data){
	return new page.table(data).toXMLString();	
}

/**
 * 普通网页 
 * @param {Object} data
 */
page.normalPage = function(data){
	return '<!DOCTYPE html>'+ page.formatHtml(new page.web(data).toXMLString());
};

/**
 * 获取PSD里的(切片)图片 
 * @param {Object} top
 * @param {Object} right
 * @param {Object} bottom
 * @param {Object} left
 */
page.getPsdImg = function(top,right,bottom,left){
	var img = new XML('<img />'),
		div = new XML('<DIV></DIV>');
	if(bottom - top <=0 || right-left <=0){
		return new XML();
	}	
	
	var image = page.psd.exportSelection([[left,top],[right,top],[right,bottom],[left,bottom]],page.option.exportConfig);
	img['@src'] = 'slices/'+image.name;
	img['@width'] = image.width;
	img['@height'] = image.height;
	img['@border']= "0";
	img['@style'] = 'display:block;margin:0px;padding:0px;'
	div['@style'] = 'overflow:hidden;width:'+image.width+'px;height:'+image.height+'px;';
	div.appendChild(img);
	return {element:div,imgObject:image};
};

page.formatHtml = function(htmlCode){
	var obj = htmlCode.split("</span>"),
		html = [];
	for(var i=1;i<obj.length;i++){
		
	}
	
	
	
	return htmlCode.replace(new RegExp('</span>\s<span', 'g'),'</span><span');
}