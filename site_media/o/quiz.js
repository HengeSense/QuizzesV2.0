function Quiz () {
	this.sections = {};
	this.MC = new Array('A','B','C','D');
	this.MClayout = MClayout;
	this.presubmitlayout = presubmitlayout;
	this.presubmit = presubmit;
	this.showquestion = showquestion;
	this.pickanswer = pickanswer;
	this.timeDown=timeDown;
	this.timeShow=timeShow;
	this.submit=submit;
}


function showquestion (s,q) {
	this.MClayout();

	gid('EQtitle').innerHTML=this.title;
	this.timeShow();

	var question=this.sections[s].questions[q];
	gid('EQquestion').innerHTML=question.question;

	for (o in question.options) 
		gid('EQoptions').innerHTML+= 
		'<a href="javascript:EQuiz.pickanswer('+s+','+q+','+question.options[o].value+');void(0)" id="option'+question.options[o].value+'">'
		+ '<div>'+this.MC[o]+'</div>'
		+ question.options[o].name
		+ '</a>';
	
	if (q>0) 	gid('EQfooter').innerHTML+='<a href="javascript:EQuiz.showquestion(0,'+(q-1)+');void(0)">&laquo; Prev</a> ';
	else 		gid('EQfooter').innerHTML+='<a class="noclick">&laquo; Prev</a>';
	
	gid('EQfooter').innerHTML+='<b>Question '+(q+1)+' of '+objcount(this.sections[s].questions)+'<br/>';
	gid('EQfooter').innerHTML+='<a id="EQnextbutton" class="noclick">Next &raquo;</a>';
	
	if (question.answer>-1) EQuiz.pickanswer(s,q,question.answer);
}

function presubmit () {
	this.presubmitlayout();

	gid('EQtitle').innerHTML=this.title;
	this.timeShow();

	gid('EQpagetitle').innerHTML='Quiz complete.';
	gid('EQpageinfo').innerHTML='You may now submit your quiz or go back and check your answers.<br/><br/>';


	gid('EQfooter').innerHTML='<a href="javascript:EQuiz.showquestion(0,0);void(0)">&laquo; Check Answers</a>';
	gid('EQfooter').innerHTML+='<b>Quiz Complete</b>';
	gid('EQfooter').innerHTML+='<a href="javascript:EQuiz.submit();void(0)">Submit Quiz &raquo;</a> ';

}


function submit () {

	//if (this.demo) document.location.href='quiz.php?id='+this.itemid;

	//else {
		gid('EQuiz').innerHTML='';
		var form='<form action="/result/" method="POST" id="submit"><input type="hidden" name="csrfmiddlewaretoken" value="097f90b66f486159aeb80804ffc3d510" />';
		form+='<input type="hidden" name="clid" value="'+this.clid+'"/>';
		form+='<input type="hidden" name="id" value="'+this.id+'"/>';
		form+='<input type="hidden" name="stuid" value="'+this.stuid+'"/>';
                if (window.mode=='mobi') form+='<input type="hidden" name="go" value="/mobi/student/quizzes.php" />'
		for (s in this.sections) {
			for (q in this.sections[s].questions) {
				form+='<input type="hidden" name="question'+this.sections[s].questions[q].questid+'" value="'+this.sections[s].questions[q].answer+'"/>';
			} 
		} 
		form+='</form>';
		gid('EQuiz').innerHTML=form;
		gid('submit').submit();
        //document.location.href='?id='+this.itemid;
	//}
}


function pickanswer (s,q,o) {
	this.sections[s].questions[q].answer=o;
	for (i in this.sections[s].questions[q].options) dropclass('option'+i,'answer');
	addclass('option'+o,'answer');
	dropclass('EQnextbutton','noclick');
	if (objcount(this.sections[s].questions)>q+1) gid('EQnextbutton').href="javascript:EQuiz.showquestion(0,"+(q+1)+");void(0)";
	else gid('EQnextbutton').href="javascript:EQuiz.presubmit();void(0)";
}


function timeDown () {
	this.timeLeft--;
	if (this.timeLeft==0) this.submit();
	else this.timeShow();
}

function timeShow () {
	if ((gid('EQtime')) && (this.timeLeft>0)) {
		gid('EQtime').innerHTML='Time Left: ';
		var min = Math.ceil(this.timeLeft/60);
		if (this.timeLeft>60) gid('EQtime').innerHTML+=min+' min';
		else if (this.timeLeft==60) gid('EQtime').innerHTML+='1:00';
		else if (this.timeLeft>9) gid('EQtime').innerHTML+='<b>0:'+(this.timeLeft%60)+'</b>';
		else gid('EQtime').innerHTML+='0:0'+(this.timeLeft%60);
	}
}

function MClayout () {
	gid('EQuiz').innerHTML='<div id="EQheader"><div id="EQtitle"></div><div id="EQtime"></div></div><div id="EQmain"><div id="EQquestion"></div><div id="EQoptions"></div></div><div id="EQfooter"></div>';
}

function presubmitlayout () {
	gid('EQuiz').innerHTML='<div id="EQheader"><div id="EQtitle"></div><div id="EQtime"></div></div><div id="EQmain"><div id="EQpagetitle"></div><div id="EQpageinfo"></div></div><div id="EQfooter"></div>';
}


function objcount (obj) {
	var c=0; for (i in obj) c++; return c;
}

function shuffle (obj) {
	var count=objcount(obj)-1;
	for (i in obj) {
		var j=Math.round(Math.random()*count);
		var a = obj[i];
		var b = obj[j];
		obj[i]=b;
		obj[j]=a;					
	}
	return obj;
}

