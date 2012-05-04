
function itemlike (itemid) {
	Req				= newReq();
	Req.url			= '/items/rate.php';
	Req.todo 		= inclike;
	var q			= {};
	q.api			= 'xml';
	q.itemid		= itemid;
	q.rating		= 1;

	Req.post(setQS(q));

}


function inclike () {
	if (this.J.success==='true') {
	
		var itemid=this.J.values.itemid;
		
		var current = gid('likes-'+itemid).innerHTML;
		
		if (current==='') 		gid('likes-'+itemid).innerHTML='1';
		else if (current==='0')	gid('likes-'+itemid).innerHTML='1';
		else 					gid('likes-'+itemid).innerHTML=(parseInt(current)+1);               
 	
		gid('likelink-'+itemid).href='';
	 }
	
	else if (this.J.error) alert(this.J.error);
}
 


function itembookmark (itemid) {
	Req				= newReq();
	Req.url			= '/items/bookmark.php';
	Req.todo 		= itembookmarkdo;
	var q			= {};
	q.api			= 'xml';
	q.itemid		= itemid;
	Req.post(setQS(q));

}



function itembookmarkdel (itemid) {
	Req				= newReq();
	Req.url			= '/items/bookmark-del.php';
	Req.todo 		= itembookmarkdo;
	var q			= {};
	q.api			= 'xml';
	q.itemid		= itemid;
	Req.post(setQS(q));

}


function itembookmarkdo () {
	if (this.J.success==='true') {
		if (gid('bookmarkon')) { 
			showhide('bookmarkon');
			showhide('bookmarkoff');
		}
	}
	
	else if (this.J.error) alert(this.J.error);
}


