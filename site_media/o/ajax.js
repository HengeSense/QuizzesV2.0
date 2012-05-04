
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
