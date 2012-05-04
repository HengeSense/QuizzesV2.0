
///////////////////////// MEMLIB /////////////////////////
// Common JavaScript tasks
//////////////////////////////////////////////////////////


///////// FORMS ////////////

// Use up/down to jump fields
// onkeyup="move(this,event)"
function fieldjump (obj,e) {
	var keynum = (window.event) ? e.keyCode : e.which;
	var y=0;
	
	if (keynum==38) y=-1; // up
	if (keynum==40) y=1; // down
	if (keynum==13) y=1; // return

	if (y!==0) {
		var here=0;
		for (var i=0;i<obj.form.elements.length;i++) {
			if (obj.form.elements[i].id==obj.id) here=i;
		}
	
		var next=here+y;
		if ((next>-1) && (obj.form.elements[next])) {
			obj.form.elements[next].focus();
			return false;
		}
	}
	return true;
}


// Upload/attach
var uploadboxes=0;
var attachboxes=0;
function uploadattach (obj,n) {
	if (!n) n='';
	if (obj.value=='new') { 
		uploadboxes++; 
		if (uploadboxes<4) gid('uploadfiles'+n).innerHTML+='<br/><input type=file name=file'+uploadboxes+' size=30 />'; 
		else alert('You can only upload 3 files at a time'); 
		if (uploadboxes>=3) obj.style.color='rgb(128,128,128)'; 
	}
	else if (obj.value!='0') { 
		attachboxes++; 
		var arr= obj.value.split('/'); 
		gid('attachfiles'+n).innerHTML+='<br/><input type=checkbox name=attach'+attachboxes+' value='+arr[0]+' checked=checked /> '+arr[1]; 
		obj.selectedIndex=0; 
	}
	obj.selectedIndex=0;
}


// Copy to class
var copyclasses=0;
function copyclass (obj,n) {
	if (!n) n='';
	var clid= obj.value; 
	if (clid!='0' && !(gid('copyclass'+clid))) { 
		copyclasses++; 
		var classname = obj.options[obj.selectedIndex].text;
		gid('copyclasses'+n).innerHTML+='<br/><input type="checkbox" id="copyclass'+clid+'" name="copyclass'+copyclasses+'" value="'+clid+'" checked="checked" /> '+classname; 
		obj.selectedIndex=0; 
	}
	obj.selectedIndex=0;
}

// POST form
function formpost (uq) {
	var arr=uq.split('?');
	var url=arr[0];
	var query=arr[1];
	var form = document.createElement('form');
	form.action=url;
	form.method='post';
	var pairs=query.split('&');
	for (var i=0;i<pairs.length;i++) {
		var pair = pairs[i].split('=');
		var input = document.createElement('input');
		input.type='hidden';
		input.name=pair[0];
		input.value=pair[1];
		form.appendChild(input);
	}
	document.body.appendChild(form);
	form.submit();
}


// Add a CSS class to an object
function addclass (obj, className) {
	obj				= gid(obj);
	var classes		= obj.className.split(' ');
	var found		= false;
	
	for (var i=0; i<classes.length; i++) {
	 	if (classes[i]==className) found=true;
	}
	
	if (!found) {
		classes.push(className);
		obj.className	= classes.join(' ');
	}
}

// Drop a CSS class from an object
function dropclass (obj, className) {
	obj				= gid(obj);
	var classes		= obj.className.split(' ');
	var newClasses	= new Array();
	
	for (var i=0; i<classes.length; i++) {
		if (classes[i] != className) newClasses.push(classes[i]);
	}		

	obj.className	= newClasses.join(' ');
}

// Hide/show something
// 1 = force show
// 2 = forcehide
function showhide (id,set) {
	var element = gid(id);
	if ((element.style.display=='none') && (set!==2))
		element.style.display='block';
	else if (set!==1) element.style.display='none';
}


// Return an onject from its HTML id
function gid (i) { 
	if (typeof(i) == 'string') {
		if (document.getElementById(i)) return document.getElementById(i);
	}
	else if (typeof(i) == 'object') return i;
	else return false;
}

// Redirect browser
function go (url) {
	window.location.href=url;
}


// assignment copy scores
function copyall () {
	fields=document.getElementsByTagName('input');
	
	var score=false;
	for (var i=0;i<fields.length;i++) {
		field=fields[i];
		if (field.name.indexOf('score_')===0) {
			if (score!==false) field.value=score;
			else score=field.value;
		}
	}
}

// Convert object to query string
function setQS (obj) {
	var pairs=new Array();
	for (var k in obj) {
		pairs.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]));
	}
	return pairs.join('&');
}





////////// XML/XHTML PARSING //////////

// Return arr of tag's XML children
function getchildren (tag, xml) {	
	if (xml.getElementsByTagName(tag)[0])	return xml.getElementsByTagName(tag);
	else 									return false;
}

// Return a tag's child XML
function getchild (tag, xml) {
	if (xml.getElementsByTagName(tag)[0])	return xml.getElementsByTagName(tag)[0];
	else 									return false;

}

// Return one tag's value
function getvalue (tag, xml) {
	if (xml.getElementsByTagName(tag)[0] &&
	xml.getElementsByTagName(tag)[0].childNodes[0])
			return xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
	else 	return false;
}

// Get child's value
function myvalue (xml) {
	if (xml.hasChildNodes())	return xml.childNodes[0].nodeValue;
	else 						return false;
}

// Return XML as Object
function xml2object (xml) {
 	if (xml.childNodes) {
		var nodes 	= xml.childNodes;
		var Obj		= new Object;
		for (var i=0; i< nodes.length; i++) {
		 	if (nodes[i].hasChildNodes()) 			Obj[nodes[i].nodeName] = nodes[i].childNodes[0].nodeValue;
		 	else if (nodes[i].nodeName!='#text') 	Obj[nodes[i].nodeName] = '';
		}
		return Obj;
	}
	else return false;
}

// Create a new XML xmlect and append it to a parent xmlect
function newchild (parentObj, childTag, className) {
	var childObj = document.createElement(childTag);
	if (className) childObj.className = className;
	parentObj.appendChild(childObj);
	return childObj;
}

// Return array of <item>'s in XML
function getitems (tagName, xml) {
	var items=xml.getElementsByTagName(tagName)[0].getElementsByTagName('item');
	
	var data=new Array();
	for (var i=0;i<items.length;i++) data.push(xml2object(items[i]));
 
 	return data;
}











// Make popbox visible
var POPONDIV=false;
function popon (id,x,y) {

    if (gid('pop').className.indexOf('off')===-1) popoff();

	var embeds = document.getElementsByTagName('embed');
	for (var i=0;i<embeds.length;i++) {
		if (embeds[i].style) embeds[i].style.display='none';	
	}
	
	var width		= parseInt(gid(id).style.width);
	var title		= gid(id).getAttribute('title');
	
	// windowX, windowY, scrollX, scrollY
	var dimensions	= getXY();
	var left		= (x) ? dimensions[2]+x : dimensions[2]+Math.round((dimensions[0]-width-30)/2);
	var top			= (y) ? dimensions[3]+y : Math.max(100,dimensions[3]+50);

	
	gid('wrapper').className	= 'off';
	gid('pop').className		= 'on';
	gid('pop').style.top		= top + 'px';
	gid('pop').style.left		= left + 'px';
	gid('pop').style.width		= width + 'px';
	gid('popc').innerHTML		= '';
	gid('poptitle').innerHTML	= title;
	gid('popc').appendChild(gid(id));
	gid(id).style.display='block';  
	POPONDIV=id;
}


// Make popbox invisible
function popoff () {

	document.body.appendChild(gid(POPONDIV));
	gid(POPONDIV).style.display='none';
	
	if (typeof(POPOFFCLEAR)!=='undefined') gid(POPONDIV).innerHTML='';

	gid('wrapper').className	= 'on';
	gid('pop').className		= 'off';
	gid('popc').innerHTML		= '';
	
	var embeds = document.getElementsByTagName('embed');
	for (var i=0;i<embeds.length;i++) {
		if (embeds[i].style) embeds[i].style.display='inline';	
	}
	POPONDIV=false;
}



function popupvideo (id) {
	var iframe=document.createElement('iframe');
	iframe.src='http://player.vimeo.com/video/'+id+'?title=0&byline=0&portrait=0&autoplay=1';
	iframe.width='700';
	iframe.height='350';
	iframe.setAttribute('frameborder','0');
	iframe.setAttribute('title','Engrade Video');
	iframe.style.width='700px';
	iframe.style.display='none';
	iframe.id='video'+id;
	document.body.appendChild(iframe);
	popon(iframe.id,0,0);
}


function popiframe (url,title) {

	if (gid('popiframe')) {
		var iframe=gid('popiframe');
	}
	else {
		var iframe			= document.createElement('iframe');
		iframe.id			= 'popiframe';
		iframe.style.width	= '770px';
		iframe.style.height	= '450px';
		iframe.title		= '&nbsp;';
		iframe.setAttribute('frameborder','0');
		document.body.appendChild(iframe);
	}
	
	iframe.src			= url;
	iframe.setAttribute('title',title);
	
	popon ('popiframe',0,0);
}

function popupmsg (userlist) {
	popiframe('/mail/send-iframe.php?users='+userlist,'Send Message');
}





// Get X,Y scrolls
function getXY () {
	var scrollx = 0;
	var scrolly = 0;
	//Netscape compliant
	if( typeof( window.pageYOffset ) == 'number' ) {
		scrolly = window.pageYOffset;
		scrollx = window.pageXOffset;
	}
	//DOM compliant
	else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
		scrolly = document.body.scrollTop;
		scrollx = document.body.scrollLeft;
	}
	//IE6 standards compliant mode
	else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		scrolly = document.documentElement.scrollTop;
		scrollx = document.documentElement.scrollLeft;
	}
	
	var windowy = window.innerHeight ? window.innerHeight : document.body.offsetHeight;
	var windowx = window.innerWidth ? window.innerWidth : document.body.offsetWidth;

	return [ windowx, windowy, scrollx, scrolly ];
}




// Balloon
function popBalloon(id, msg, dir) {
	if (gid(id)) {

		var _balloon = document.createElement('div');
		gid(id).parentNode.parentNode.appendChild(_balloon);
		_balloon.setAttribute('id', 'balloon');
		addclass("balloon", "msg balloon success");
		_balloon.innerHTML = '<img class="arrow" id="arrow" src="/i/tooltip-arrow-'+dir+'.png"/>'+msg+'<a href="javascript:gid(\'balloon\').style.visibility=\'hidden\';void(0);"><img style="height:16px;width:16px;position:relative;top:2px;right:-5px;" src="/i/icons/delete.png" title="Close" /></a>'
		var targetwidth, targettop, targetheight = 0;
		targettop = gid(id).offsetTop;
        switch (dir) {
			case 'n':
				targetwidth = gid(id).offsetWidth;
				gid('balloon').style.top = (targettop-50)+'px';
				gid('arrow').style.top = '36px';
				gid('arrow').style.left = ((targetwidth/2)-7.5-gid(id).style.marginLeft-gid(id).style.marginRight)+'px';
				break;
			case 's':
				targetwidth = gid(id).offsetWidth;
				targetheight = gid(id).offsetHeight;
				gid('balloon').style.top = (targettop+targetheight+14)+'px';
				gid('arrow').style.top = '-12px';
				gid('arrow').style.left = ((targetwidth/2)-7.5-gid(id).style.marginLeft-gid(id).style.marginRight)+'px';
				break;
			
			case 'e':
				targetwidth = gid(id).offsetWidth-gid(id).marginRight-gid(id).marginLeft;
				targetheight = gid(id).offsetHeight;
				gid('balloon').style.top = (targettop-(gid('balloon').offsetHeight/2)+(targetheight/2))+'px';
				gid('balloon').style.left = (targetwidth+15)+'px';
				gid('arrow').style.top = '5px';
				gid('arrow').style.left = '-12px';
				break;
			}
		
		gid('balloon').style.visibility = 'visible';
		
		function check(e){
		var target = (e && e.target) || (event && event.srcElement);
		if (checkParent(target)) {gid('balloon').style.visibility='hidden';}
		}
		
		function checkParent(t){
			while(t.parentNode){
				if(t==gid('balloon')){
					return false
					}
				t=t.parentNode
				}
			return true
			} 
		
		document.onclick=check;
		
	}
	
	

}


//Resize iframe
function resizeframe (id) {
	var windowx = window.innerWidth ? parseInt(window.innerWidth) : parseInt(document.body.offsetWidth);
	var windowy = window.innerHeight ? parseInt(window.innerHeight) : parseInt(document.body.offsetHeight);
	
	if (windowx) {
		gid('appframe').style.width=(windowx-220)+'px';
		gid('appframe').style.height=(windowy-230)+'px';
	}
}





function localtime() {
	var Months=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
	var spans=document.getElementsByTagName('span');
	
	for (var i=0;i<spans.length;i++) {
		if ((spans[i].className) && (spans[i].className.indexOf('timestamp')>=0)) {
			var timestamp=parseInt(spans[i].innerHTML);
			var dd = new Date();
			dd.setTime(timestamp*1000);
			spans[i].innerHTML=Months[dd.getMonth()]+' '+dd.getDate()+' '+zeropad(dd.getHours(),2)+':'+zeropad(dd.getMinutes(),2)+':'+zeropad(dd.getSeconds(),2);
			
			
		}
	}
}


function zeropad ( number, width ) {
  width -= number.toString().length;
  if (width<1) return number;
  else return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number; 
}

function iseven(number){
	number2 = parseInt(number);
	return (number2%2 == 0) ? true : false;
};

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = (x.length > 1) ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2');
	return ('<b>'+(x1 + x2).split('').join('</b><b>')+'</b>').replace(/<b>,<\/b>/g, ',');
}









////// DIV TABLE SORTING //////

function sortString(a,b) {
	return ((a.sortby.toUpperCase() < b.sortby.toUpperCase()) ? -1 : ((a.sortby.toUpperCase() > b.sortby.toUpperCase()) ? 1 : 0));
}

function sortNum(a,b) {
	return (((parseFloat(a.sortby.replace(/[^0-9\.]/g, '')) < parseFloat(b.sortby.replace(/[^0-9\.]/g, ''))) || a.sortby.replace(/[^0-9\.]/g, '') == '') ? -1 : (((parseFloat(a.sortby.replace(/[^0-9\.]/g, '')) > parseFloat(b.sortby.replace(/[^0-9\.]/g, '')))  || b.sortby.replace(/[^0-9\.]/g, '') == '') ? 1 : 0));
}



function resort(field,dir,cmp) {
	var sorter = [];
	for (var i=0;i<TRACKER.length;i++) {
		sorter[i] = {};
		idstring = TRACKER[i].id.split('-');
		sorter[i].ID = idstring[1];
		sorter[i].sortby = gid(field+'-'+sorter[i].ID).innerHTML.replace(/(<([^>]+)>)/ig,"");

		//gid('f6-1000').innerHTML = sorter[i].sortby;
	}
	
	
	if (!cmp) sorter.sort(sortString);
	else sorter.sort(sortNum);
	if (dir) sorter.reverse();
	for (var i=0;i<sorter.length;i++) {
		for (var j=0;j<IDS.length;j++) {
			var curDiv = gid(IDS[j].elem+'-'+sorter[i].ID);
			gid(IDS[j].container).appendChild(curDiv);
			dropclass(IDS[j].elem+'-'+sorter[i].ID, 'alt');
			if (i%2==1) addclass(IDS[j].elem+'-'+sorter[i].ID, 'alt');
		}
	}
	if (gid('arrow')) gid('arrow').parentNode.removeChild(gid('arrow'));
	gid('sort-'+field).href="javascript:resort('"+field+"',"+(!dir-0)+","+cmp+")";
	gid('sort-'+field).innerHTML = gid('sort-'+field).innerHTML + ' <img id="arrow" style="width:15px;" src="/i/wiki_'+(dir?'down':'up')+'.png"/>';
	
	
}
















///////////////////////// MEMLIB /////////////////////////
// JS AJAX functions
//////////////////////////////////////////////////////////

var Reqs=[];

// Create a new cross-browser AJAX req object
function newReq (parent) {
 	var req = false;
	try  			{ req = new XMLHttpRequest(); }
	catch(e) { 
	 	try  		{ req = new ActiveXObject("Msxml2.XMLHTTP"); }
		catch(e) { 
			try  	{ req = new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e) { 
				alert('Your browser is too old to use this site, go to www.mozilla.com to download Firefox.');
			}
		}
	}
	req.post				= AjaxPost;
	req.get 				= AjaxGet;
	req.onreadystatechange 	= reqChangeState;
	
	if (parent) req.parent = parent;
	
	return req;
}




// Ajax times out
function reqTimeOut () {
	document.location.reload();
}



// Generic AJAX POST function
function AjaxPost (query) {
	if (query)						this.query		= query;
	
	this.to		 					= setTimeout('reqTimeOut()', 10000);
	this.open						("POST", this.url, true);
	this.setRequestHeader			('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8'); 
	this.setRequestHeader			("Content-length", this.query.length);
	this.send						(this.query);
}


// Generic AJAX GET function
function AjaxGet () {
	this.to		 					= setTimeout('reqTimeOut()', 10000);
	this.open						("GET", this.url, true);
	this.send						();
}


// Handle AJAX state changes
function reqChangeState () {
	if (this.readyState == 4) {
		clearTimeout(this.to);

		 // server error
		if (!this.responseXML)
		 	alert('Oops! There was a server error, please try again later.');
		
		// server is good
		else {	
			// parse XML data
			this.J				= new Object();
		 	this.J.success		= getvalue('success', this.responseXML);
			this.J.values		= xml2object(getchild('values', this.responseXML));
			this.J.errors		= xml2object(getchild('errors', this.responseXML));
		
			// success and failure functions
			if (this.J.success == 'true') { if (this.todo) this.todo(); }
			else alert('Error: '+getvalue('message', this.responseXML));
		}
	}
}



// Submit a form via AJAX
function ajaxForm (id) {
	var form		= gid(id);
	var Req			= newReq();
	Req.url			= form.action;
	var inputs		= form.elements;
	var q 			= {};
	q.api			= 'xml';
	
	for (var i=0;i<form.elements.length;i++) {
		e = form.elements[i];
		q[e.name]=e.value;
	}	
	
	Req.post(setQS(q));
	Reqs.push(Req);
}











// Determine browser and version.



function Browser() {
  var ua, s, i;
  this.isIE    = false;
  this.isNS    = false;
  this.version = null;
  ua = navigator.userAgent;
  
  s = "MSIE";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  // Treat any other "Gecko" browser as NS 6.1.
  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }
}



var browser = new Browser();

// Global object to hold drag information.

var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(event, id) {
  var el;
  var x, y;

  // If an element id was given, find it. Otherwise use the element being clicked on.

  if (id) dragObj.elNode = document.getElementById(id);

  else {
    if (browser.isIE)dragObj.elNode = window.event.srcElement;
    if (browser.isNS) dragObj.elNode = event.target;
    if (dragObj.elNode.nodeType == 3) dragObj.elNode = dragObj.elNode.parentNode;
  }

  // Get cursor position with respect to the page.
  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft+ document.body.scrollLeft;

    y = window.event.clientY + document.documentElement.scrollTop+ document.body.scrollTop;

  }

  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }



  // Save starting positions of cursor and element.
  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;
  dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
  dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;


  // Capture mousemove and mouseup events on the page.
  if (browser.isIE) {
    document.attachEvent("onmousemove", dragGo);
    document.attachEvent("onmouseup",   dragStop);
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }

  if (browser.isNS) {
    document.addEventListener("mousemove", dragGo,   true);
    document.addEventListener("mouseup",   dragStop, true);
    event.preventDefault();
  }
}



function dragGo(event) {
  var x, y;
  
  // Get cursor position with respect to the page.
  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft+ document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop+ document.body.scrollTop;
  }

  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Move drag element by the same amount the cursor has moved.
  gid('popc').style.display='none';
  dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
  dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";

  if (browser.isIE) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS) event.preventDefault();
}



function dragStop(event) {

  gid('popc').style.display='block';

  // Stop capturing mousemove and mouseup events.
  if (browser.isIE) {
    document.detachEvent("onmousemove", dragGo);
    document.detachEvent("onmouseup",   dragStop);
  }

  if (browser.isNS) {
    document.removeEventListener("mousemove", dragGo,   true);
    document.removeEventListener("mouseup",   dragStop, true);
  }
}







