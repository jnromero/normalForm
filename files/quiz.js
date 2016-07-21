function drawQuiz(message){
	result=message['answerInfo'];
    msg={
    	'colActions': {1: 'L', 2: 'R'}, 
    	'colColors': {1: 'rgba(152,78,163,1)', 2: 'rgba(255,127,0,1)', 3: 'rgba(200,200,51,1)'}, 
    	'exchangeRate': 0.05, 
    	'rowActions': {1: 'U', 2: 'D'}, 
    	'rowColors': {1: 'rgba(228,26,28,1)', 2: 'rgba(55,126,184,1)', 3: 'rgba(77,175,74,1)'}, 
    	'pays': {1: {1: [8, 1], 2: [7, 2]}, 2: {1: [6, 3], 2: [5, 4]}}, 
    	'numberOfCols': 2, 
    	'numberOfRows': 2, 
    	'type': 'parameters'}
    parameters(msg);
    window.state={
    	'correctGuesses': 12, 
    	'period': 22, 
    	'myMatchPay': 180, 
    	'myTotalPay': 470, 
    	'theirMatchPay': 190, 
    	'stage': 'noChoices', 
    	'page': 'game', 
    	'match': 2, 
    	'history': [[2, 1],  [1, 1],  [1, 2], [1, 1], [1, 1], [1, 1], [1, 2], [1, 1], [1, 1], [2, 2],  [1, 2], [2, 2], [1, 2],[2, 2],[2, 1], [1, 1],[1, 2], [2, 1], [2, 2],[1, 2], [2, 1], [2, 2]]
    }
	window.state["row"]=2;
	window.state["col"]=1;
	window.state["stage"]="bothSelected";
	updateStatusOnServer();
	statusManager();

	questionNumber=result['questionNumber'];
    if(questionNumber==1){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="1.  Given the current screen shot, what is the current period?"
		drawStatement(150,100,statement,questionNumber,result,options);
    }
    else if(questionNumber==2){
    	statement="2.  What action did you guess that the other player is going to play?"
		drawStatement(850,100,statement,questionNumber,result,["U","D","L","R"]);
    }
    else if(questionNumber==3){
    	statement="3.  What action did you play this period?"
		drawStatement(850,100,statement,questionNumber,result,["U","D","L","R"]);
    }
    else if(questionNumber==4){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="4.  Given your choice this period, what is your payoff if the subject that you are matched with actually plays L?";
		drawStatement(850,100,statement,questionNumber,result,options);
    }
    else if(questionNumber==5){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="5.  Given your choice this period, what is the payoff of the subject that you are matched with if they actually play R?";
		drawStatement(850,100,statement,questionNumber,result,options);
    }
    else if(questionNumber==6){
    	statement="6.  What action did the subject that you are matched with play in period 17?";
		drawStatement(850,100,statement,questionNumber,result,["U","D","L","R"]);
    }
    else if(questionNumber==7){
    	statement="7.  What action did you play in period 10?";
		drawStatement(850,100,statement,questionNumber,result,["U","D","L","R"]);
    }
    else if(questionNumber==8){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="8.  What payoff did you receive in period 8?";
		drawStatement(850,100,statement,questionNumber,result,options);
    }
    else if(questionNumber==9){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="9.  What payoff did the subject that you are matched with receive in period 18?";
		drawStatement(850,100,statement,questionNumber,result,options);
    }
    else if(questionNumber==10){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="10.  How many times have you correctly guessed the choice of the subject that you are matched with during this current match?";
		drawStatement(650,575,statement,questionNumber,result,options);
    }
    else if(questionNumber==11){
		options=[]
		for(k=0;k<31;k++){options.push(k);}
    	statement="11.  How many matches are there in this experiment?";
		drawStatement(650,400,statement,questionNumber,result,options);
    }
    else if(questionNumber==12){
		options=['Random']
		for(k=0;k<111;k++){options.push(k);}
    	statement="12.  How many periods does each match have?";
		drawStatement(650,575,statement,questionNumber,result,options);
    }



}





function drawStatement(left,top,statement,questionNumber,result,options){
    	var questionBox = document.createElement("div");
	    questionBox.id="quizQuestionStatement";
	    questionBox.style.top=top+"px";
	    questionBox.style.left=left+"px";
	    questionBox.style.width="450px";
	    questionBox.style.height="250px";
	    questionBox.innerHTML=statement;
		document.getElementById('mainDiv').appendChild(questionBox);

    	if(result['correct']!=1){
    		makeDropdownQuiz(options)
			makeButtonQuiz(340,190,100,50,"rgba(0,255,0,.1)","Submit","submitAnswer")
	    	document.getElementById("submitAnswer").addEventListener("click",partial(checkAnswer,questionNumber));

	    }

    	if(result['correct']==0){
			drawTextQuiz("correctOrNot",200,125,250,50,"red",result['answer']+" is incorrect, Try Again.")
		}
    	else if(result['correct']==1){
			drawTextQuiz("correctOrNot",0,150,450,50,"green",result['answer']+" is Correct!")
			makeButtonQuiz(240,190,200,50,"rgba(0,255,0,.1)","Next Question","nextQuestionButton")
	    	document.getElementById("nextQuestionButton").addEventListener("click",partial(getNextQuestion,questionNumber));
		}

}




//drawQuiz(questionNumber,result);
answers={}
answers[1]="23";
answers[2]="L";
answers[3]="D";
answers[4]="6";
answers[5]="4";
answers[6]="R";
answers[7]="D";
answers[8]="8";
answers[9]="3";
answers[10]="12";
answers[11]="4";
answers[12]="Random";



function checkAnswer(questionNumber){
	answer=document.getElementById("quizAnswer").value;
	if(answer==""){
		alert("Must submit answer to question.");
	}
	else{
		msg={}
		msg['questionNumber']=questionNumber;
		msg['answer']=answer;
		if(answer==answers[questionNumber]){
			msg['correct']=1;
		}
		else{
			msg['correct']=0;
		}
		var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
		if(pageName=="quiz.html"){
			msg={answerInfo:msg};
			drawQuiz(msg);
		}
		else{
			var message={"type":"checkQuizAnswer","answerInfo":msg};
	        sendMessage(message);
		}
	}
	
}


function getNextQuestion(questionNumber){
	msg={}
	msg['questionNumber']=questionNumber+1;
	msg['answer']="";
	msg['correct']=-1;
	var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	if(pageName=="quiz.html" ){
		msg={answerInfo:msg};
		drawQuiz(msg);
	}
	else{
		var message={"type":"checkQuizAnswer","answerInfo":msg};
        sendMessage(message);
	}
}



function makeDropdownQuiz(options){
    var select = document.createElement("select");
    select.style.fontSize="100%";
    select.style.position="absolute";
    select.style.top="175px";
    select.style.left="100px";
    select.id="quizAnswer";

    blank=[['']]
    options=blank.concat(options);
    for(k=0;k<options.length;k++){
	    var option = document.createElement("option");
	    option.value=options[k];
	    option.innerHTML=options[k];
	    select.appendChild(option);
    }
    document.getElementById("quizQuestionStatement").appendChild(select);
}



function makeButtonQuiz(left,top,width,height,color,inner,id){
    var select = document.createElement("button");
    select.style.fontSize="100%";
    select.style.position="absolute";
    select.style.top=top+"px";
    select.style.left=left+"px";
    select.style.width=width+"px";
    select.style.height=height+"px";
    select.style.backgroundColor=color;
    select.id=id;
    select.innerHTML=inner;
    document.getElementById("quizQuestionStatement").appendChild(select);
}


function drawTextQuiz(id,left,top,width,height,color,inner){
    var correctTitle= document.createElement("div");
    correctTitle.id="correctOrNot";
    correctTitle.style.position="absolute";
    correctTitle.style.top=top+"px";
    correctTitle.style.left=left+"px";
    correctTitle.style.width=width+"px";
    correctTitle.style.height=height+"px";
    correctTitle.style.textAlign="center";
    correctTitle.style.color=color;
    correctTitle.innerHTML=inner;
    document.getElementById("quizQuestionStatement").appendChild(correctTitle);
}



function updateStatusOnServer(){
	var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	if(pageName=="game.html" || pageName=="game.py" ){
	    var message={"type":"updateStatusFromClient","status":window.state};
	    sendMessage(message);
	}
}

