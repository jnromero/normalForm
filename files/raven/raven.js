function drawRaven(){
    console.log(window.state);
    moveTimer("timer");
    //Create Game div
    var ravenTitle=createDiv("ravenTitle");
    ravenTitle.innerHTML="You will be presented with problems that show a pattern with a bit cut out of it. Look at the pattern, think what piece is needed to complete the pattern correctly both along the rows and down the columns, BUT NOT THE DIAGONALS. You have 10 minutes to complete the quiz."
    $("#mainDiv").append(ravenTitle);


    var ravenProblems=createDiv("ravenProblems");
    $("#mainDiv").append(ravenProblems);

    for(var k=1;k<11;k++){
        var ravenProblem=createDiv("ravenProblem"+k);
        ravenProblem.className="ravenProblem";



        var ravenProblemNumber = document.createElement("div");
        ravenProblemNumber.id="ravenProblemNumber"+k;
        ravenProblemNumber.className="ravenProblemNumber";
        ravenProblemNumber.innerHTML="Question #"+k;
        ravenProblem.appendChild(ravenProblemNumber);


        var ravenProblemStatement = document.createElement("img");
        ravenProblemStatement.id="ravenProblemStatement"+k;
        ravenProblemStatement.className="ravenProblemStatement";
        ravenProblemStatement.src = config['currentExperiment']+"/files/raven/images/questions/question1.png";
        ravenProblem.appendChild(ravenProblemStatement);


        var ravenAnswers = document.createElement("div");
        ravenAnswers.id="ravenAnswers"+k;
        ravenAnswers.className="ravenAnswers";
        

        for(var j=1;j<9;j++){
            var ravenAnswer = document.createElement("img");
            ravenAnswer.id="ravenAnswer"+k+"_"+j;
            ravenAnswer.className="ravenAnswer";
            ravenAnswer.src = config['currentExperiment']+"/files/raven/images/answers/answer-1-"+(j)+".png";
            pf=partial(submitRavenAnswer,k,j);
            ravenAnswer.addEventListener("click",pf);
            ravenAnswers.appendChild(ravenAnswer);
        }
        ravenProblem.appendChild(ravenAnswers);

        ravenProblems.appendChild(ravenProblem);
    }



    drawRavenArrows();
    ravenTimer=createDiv("ravenTimer");
    ravenTimer.innerHTML="Time Remaining:<br><time id='timer'>1:00</time>"
    $("#mainDiv").append(ravenTimer);

    ravenSummary=createDiv("ravenSummary");
    ravenSummary.innerHTML="Questions Answered:<br><p id=\"ravenSummaryData\">0/10</p>"
    $("#mainDiv").append(ravenSummary);
    drawRavensAnswers();
    ravenPlusOne();
    ravenMinusOne();
    //document.getElementById("gameTableEntry_2_2").style.border="10px solid red";
}

function submitRavenAnswer(problem,choice){
    document.getElementById("ravenAnswer"+problem+"_"+choice).className="ravenAnswer ravenSelected";
    var message={"type":"submitRavenAnswer","questionNumber":problem,"choiceNumber":choice,"currentProblem":window.state['currentProblem']};
    sendMessage(message);
}

function drawRavenArrows(){
    deleteDiv("ravenLeftArrow");
    deleteDiv("ravenRightArrow");
    if(window.state['currentProblem']>1){
        var img = document.createElement("img");
        img.id="ravenLeftArrow";
        img.src = config['currentExperiment']+"/files/raven/images/leftArrow.png";
        $("#mainDiv").append(img);        
        document.getElementById("ravenLeftArrow").addEventListener("click",ravenMinusOne);
    }

    if(window.state['currentProblem']<10){
        var img = document.createElement("img");
        img.id="ravenRightArrow";
        img.src = config['currentExperiment']+"/files/raven/images/rightArrow.png";
        $("#mainDiv").append(img);
        document.getElementById("ravenRightArrow").addEventListener("click",ravenPlusOne);
    }    
}

function ravenPlusOne(){
    window.state['currentProblem']=window.state['currentProblem']+1;
    thisNumber=1200-1200*window.state['currentProblem'];
    document.getElementById("ravenProblems").style.transition=".25s ease-in-out";
    document.getElementById("ravenProblems").style.transform="translate("+thisNumber+"px,0px)";
    drawRavenArrows();
}

function ravenMinusOne(){
    window.state['currentProblem']=window.state['currentProblem']-1;
    thisNumber=1200-1200*window.state['currentProblem'];
    document.getElementById("ravenProblems").style.transition=".25s ease-in-out";
    document.getElementById("ravenProblems").style.transform="translate("+thisNumber+"px,0px)";
    drawRavenArrows();
}


function drawRavensAnswers(){
    console.log(window.state['answers']);
    var totalAnswers=0
    for(var k=1;k<11;k++){
        for(var j=1;j<9;j++){
            ravenAnswer=document.getElementById("ravenAnswer"+k+"_"+j);
            ravenAnswer.className="ravenAnswer";
            if(window.state['answers'][k]==j){
                document.getElementById("ravenAnswer"+k+"_"+j).className="ravenAnswer ravenSelected";
                totalAnswers=totalAnswers+1;
            }
        }
    }
    document.getElementById("ravenSummaryData").innerHTML=totalAnswers+"/10";
}
