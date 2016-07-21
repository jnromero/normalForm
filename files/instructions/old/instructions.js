var partial = function (func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};


function test(ts){
    alert(ts);
}

var mainDiv = document.createElement("div");
mainDiv.id = "mainDiv";
$("body").prepend(mainDiv);





function moveTimer(){
    timerSeconds=window.previewTimeTotal-((new Date()).getTime()-window.previewTimeStart)/1000;
    if(timerSeconds>0){
        var pretty = makeTimePretty(timerSeconds);
        if(document.getElementById("timer")!=null){document.getElementById("timer").innerHTML=pretty;}
        //document.getElementById("timer").style.transform="scale(1.3)";
        //document.getElementById("timer").style.transition="all .2s ease";
        //setTimeout(function(){document.getElementById("timer").style.transform="scale(1)";},100);
        setTimeout(moveTimer,1000);
        console.log(document.getElementById("timer")!=null);
    }
    else{
        if(document.getElementById("timer")!=null){
            document.getElementById("timer").innerHTML="0:00";
        }
    }

}



// function changeSliderSpeedODL(divName){
//     console.log("changeSliderSpeed");
//     newTime=1000000*window.speed;
// document.getElementById("slider_allHistoryDiv").style.transform="translate3d(19500px,0px,0px)";
// document.getElementById("slider_allHistoryDiv").style.transition="all 100s linear";
// setTimeout(function(){document.getElementById("slider_allHistoryDiv").style.transform="translate3d(19300px,0px,0px)";},20);

//     // document.getElementById(divName+"_allHistoryDiv").style.transform="translate3d(-200px,0px,0px)";
//     // document.getElementById(divName+"_allHistoryDiv").style.transition="all 5s linear";
//     // setTimeout(function(){document.getElementById(divName+"_allHistoryDiv").style.transform="translate3d(-250px,0px,0px)";},2000);
// }

//drawSlider();
// window.setTimeout(startSlider,10);
// window.setInterval(changeSliderSpeed,500);


// constructor=[["w","y"],["w","y"],["w","y"],["y","q"],["w","q"],["w","y"],["w","y"],["w","y"],["y","q"],["w","q"],["w","w"],["y","w"],["w","y"],["y","q"],["w","q"],["y"]]
// constructor=[["w","w"],["y","w"],["w","y"],["y","q"],["w","q"],["y"]]
// drawConstructor(constructor);
// drawGame();

// thispos=0;
// timerSeconds=(new Date()).getTime()/1000;
// for(k=0;k<100000;k++){
//     if(1000*((new Date()).getTime()/1000-timerSeconds)>100){
//         timerSeconds=(new Date()).getTime()/1000;
//         thispos=thispos-10;
//         document.getElementById('historyDiv').style.left=thispos+"px";
//         document.getElementById('historyLabelsDiv').style.left=thispos+"px";
//     }
// }


function parametersMessage(incoming){
  speed=incoming['speed']
  payoffs=incoming['payoffs']
  choices=incoming['choices']
  window.speed=incoming['speed'];
  window.ruleLockFixedCost=incoming['ruleLockFixedCost'];
  window.ruleLockMarginalCost=incoming['ruleLockMarginalCost'];
  window.actions=choices;
  window.payoffs=payoffs;
  window.constructorChoices=choices;
}

function reconnectingMessage(incoming){
  console.log("reconnectingMessage");
  window.state=incoming['status'];
  window.previewTimeTotal=incoming['prePlayTimeRemaining'];
  window.currentUnlockedTime=incoming['currentUnlockedTime'];
  window.unlockedTimeUpdate=(new Date()).getTime();
  window.previewTimeStart=(new Date()).getTime();
  statusManager();
}



function reconnectInstructionsMessage(incoming){
    reloadInstructionsMessage(incoming);
}



function startInstructionsMessage(incoming){
    clearAll();
    window.instructionIndex=0;
    window.elapsed=incoming['time']*1000+.0000001;
    window.startTime=(new Date()).getTime()-window.elapsed;
    doInstructions();
}


function loadInstructionsMessage(incoming){
    console.log("loadVideo");
    var video = document.createElement('video');
    video.id = 'videoHolder';
    video.src = incoming['source'];
    video.height='0px';
    document.body.appendChild(video);
}



function reloadInstructionsMessage(incoming){
    console.log("loadVideo");
    var video = document.createElement('video');
    video.id = 'videoHolder';
    video.src = incoming['source'];
    video.height='0px';
    document.body.appendChild(video);
    startInstructionsMessage(incoming);
}

function endInstructionsMessage(incoming){
    clearTimeout(window.nextInstructionTask);
    clearTimeout(window.moveInstructionsTimer);
    deleteDiv('videoHolder');
    deleteDiv('captions');
    deleteDiv('instructionsElapsed');
    clearAll();
    statusManager();
}

function matchStartedMessage(incoming){
  window.state=incoming['status'];
  window.previewTimeTotal=incoming['prePlayTime'];
  window.previewTimeStart=(new Date()).getTime();
  statusManager();
}


function hypotheticalStartedMessage(incoming){
  window.state=incoming['status'];
  window.previewTimeTotal=incoming['prePlayTime'];
  window.previewTimeStart=(new Date()).getTime();
  statusManager();
}


function hypotheticalChoiceMessage(incoming){
  // window.hypotheticalChoiceRuleNumber=incoming['ruleNumber'];
  // window.hypotheticalChoiceRuleOutput=incoming['ruleOutput'];

// hypRuleNumber']=hypRuleOut.number
//       msg['hypRuleOutput']=hypRuleOut.output
//       msg['hypRuleLength']=hypRuleOut.length
//       msg['regularRuleNumber']=regularRuleOut.number
//       msg['regularRuleOutput']=regularRuleOut.output
//       msg['regularRuleLength
    displayHypHistoryMessage(incoming)
}



function moveInstructions(){
    window.instructionDemoIndex=0;
    window.instructionInput=[[["w","w"],1,1,9],[["y","w"],1,1,8],[["y","y"],0,1,6],[["w","y"],0,1,7]];
    pf=partial(newPeriodTest);
    window.moveInstructions=setInterval(pf,10000);
}

function stopInstructions(){
    clearInterval(window.moveInstructions);
}


function drawMessage(message,fontColorIN){
    div=createDiv("inGameMessage")
    var div2 = document.createElement("div");
    div2.id = "inGameMessageInside";
    var div3 = document.createElement("div");
    div3.id = "inGameMessageText";
    div3.innerHTML=message;
    div3.style.color=fontColorIN;

    div2.appendChild(div3);
    div.appendChild(div2);
    mainDiv.appendChild(div);

}

function wakeUpMessage(incoming){
}


function messageManager(msg){
  var incoming = JSON.parse(msg);
  console.log(incoming['type']);
  window.state=incoming['status'];
  window.timer=incoming['timer'];
  window.timerCheck=(new Date()).getTime();
  eval(incoming['type']+'Message(incoming);');
}


function getRuleSet(type){
    if(type=="hypHyp"){
        typeOut="hyp";
    }
    else if(type=="hypActual"){
        typeOut="regular";
    }
    else if(type=="regular"){
        typeOut="regular";
    }
    else{
        typeOut=type;
    }
    return typeOut
}










function addHypHistory(){
    var message={"type":"addHypHistory"};
    sock.send(JSON.stringify(message));
}


window.ruleSets=[]
window.ruleNumbers=[]
window.ruleLastUsed=[]
window.ruleFrequency=[]
window.firstPeriodRule=[]
window.constructors=[]
window.constructors["hyp"]=[[-1,-1],[-1]];
window.constructors["regular"]=[[-1,-1],[-1]];


function getHypHistory(number){
    var message={"type":"getHypHistory","number":number};
    sock.send(JSON.stringify(message));

}


function drawHypTabs(){
    for(k=1;k<=window.hypHistories;k++){
        var hypSliderButton = createDiv("hypSliderButton_"+k);
        hypSliderButton.className="hypSliderSwitchButton";
        hypSliderButton.style.left=(10+65*(k-1))+"px";
        hypSliderButton.innerHTML="History "+k;
        hypSliderButton.style.backgroundColor="rgba(225,225,225,1)";
        hypSliderButton.style.border="1px solid rgba(255,0,0,.3)";
        var pf = partial(getHypHistory,k);
        hypSliderButton.addEventListener("click",pf);
        $("#mainDiv").append(hypSliderButton);
    }

    document.getElementById("hypSliderButton_"+window.hypTab).style.backgroundColor="rgba(255,255,255,1)";
    document.getElementById("hypSliderButton_"+window.hypTab).style.border="1px solid red";

    if(window.hypHistories<9){
        var hypSliderButton = createDiv("hypSliderButton_Add");
        hypSliderButton.className="hypSliderSwitchButton";
        hypSliderButton.style.left=(10+65*(window.hypHistories))+"px";
        hypSliderButton.innerHTML="New History";
        hypSliderButton.addEventListener("click",addHypHistory);
        $("#mainDiv").append(hypSliderButton);
    }
    // var hypSliderButton = createDiv("hypActualSliderButton_"+number);
    // hypSliderButton.className="actualSliderSwitchButton";
    // hypSliderButton.style.left=(650+65*(number-1))+"px";
    // hypSliderButton.innerHTML="History "+number;
    // var pf = partial(showHypHistory,number);
    // hypSliderButton.addEventListener("click",pf);
    // $("#mainDiv").append(hypSliderButton);
}


function showHypotheticalMessage(incoming){
    window.hypHistory=incoming['hypHistory'];
    window.hypHistories=incoming['totalHypHistories'];
    window.hypTab=incoming['hypHistoryNumber'];
}

function hypHistoryMessage(incoming){
    window.hypHistory=incoming['hypHistory'];
    window.hypHistories=incoming['totalHypHistories'];
    window.hypTab=incoming['hypHistoryNumber'];
    window.hypHistoryComplete=incoming['hypHistoryComplete'];
    drawHistory("hyp");
    drawHistory("hypActual");
    drawHypTabs();
    displayHypHistoryMessage({"nothing":"nothing"});
}



function deleteHypothetical(){
    deleteDiv("hypLeft");
    deleteDiv("hypRight");
    deleteDiv("hypTitle");
    deleteDiv("hypActualTitle");
    deleteDiv("hypConstructorDiv");
    deleteDiv("hypDefaultDiv");
    deleteDiv("hypDefaultDiv");
    deleteDiv("hypActualRuleList");
    deleteDiv("hypRuleList");
    deleteDiv("hypActual_history");
    deleteDiv("hyp_history");
}


function drawHypothetical(){
    clearAll();
    hypLeft=createDiv("hypLeft");
    $("#mainDiv").append(hypLeft);
    hypRight=createDiv("hypRight");
    $("#mainDiv").append(hypRight);

    var div = createDiv("hypTitle");
    div.innerHTML="Hypothetical Rules";
    $("#mainDiv").append(div);

    var div = createDiv("hypActualTitle");
    div.innerHTML="Starting Rules";
    $("#mainDiv").append(div);

    drawGame("hyp");
    drawRules("hyp");
    drawRules("hypActual");
    drawConstructor("hyp");
    drawDefault("hyp");
    getHypHistory(-1);


    var topInfoLeft=createDiv("topInfoLeft");
    var topInfoMiddle=createDiv("topInfoMiddle");
    topInfoMiddle.innerHTML="The match will start in <time id='timer'>5:00</time>";
    $("#mainDiv").append(topInfoLeft);
    $("#mainDiv").append(topInfoMiddle);

}




function drawHypotheticalForInstructions1(){
    clearAll();
    hypLeft=createDiv("hypLeft");
    $("#mainDiv").append(hypLeft);
    hypRight=createDiv("hypRight");
    $("#mainDiv").append(hypRight);



    window.firstPeriodRule["regular"]=0
    window.firstPeriodRule["hyp"]=0
    window.state=[];
    window.state['page']='na';
    window.hypHistories=4;
    window.hypTab=3;
    window.ruleSets["regular"]=[[[1]]];
    window.ruleNumbers["regular"]=[1];
    window.ruleLastUsed["regular"]=[0];
    window.ruleFrequency["regular"]=[0];
    window.firstPeriodRule["regular"]=1;


    window.ruleSets["hyp"]=[[[0]],[[0,1],[1,0],[1]]];
    window.ruleNumbers["hyp"]=[0,2];
    window.ruleLastUsed["hyp"]=[0,0];
    window.ruleFrequency["hyp"]=[0,0];
    window.firstPeriodRule["hyp"]=0;

    incoming=[];
    incoming['hypHistory']=[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,1],[1,0],[0,1],[1,0],[1,1],[-1,-1]];
    incoming['totalHypHistories']=4;
    incoming['hypHistoryNumber']=4;
    incoming['hypHistoryComplete']=1;
    hypHistoryMessage(incoming);


    var div = createDiv("hypTitle");
    div.innerHTML="Hypothetical Rules";
    $("#mainDiv").append(div);

    var div = createDiv("hypActualTitle");
    div.innerHTML="Starting Rules";
    $("#mainDiv").append(div);



    drawGame("hyp");
    drawRules("hyp");
    drawRules("hypActual");
    drawConstructor("hyp");
    drawDefault("hyp");
    //getHypHistory(-1);

    drawHypTabs();

    incoming['hypRuleOutput']=0;
    incoming['hypRuleNumber']=0;
    incoming['hypRuleLength']=0;


    incoming['hypActualRuleOutput']=1;
    incoming['hypActualRuleNumber']=0;
    incoming['hypActualRuleLength']=0;


    incoming['regularRuleOutput']=1;
    incoming['regularRuleNumber']=1;
    incoming['regularRuleLength']=0;
    displayHypHistoryMessage(incoming)


    var topInfoLeft=createDiv("topInfoLeft");
    var topInfoMiddle=createDiv("topInfoMiddle");
    topInfoMiddle.innerHTML="The match will start in <time id='timer'>5:00</time>";
    $("#mainDiv").append(topInfoLeft);
    $("#mainDiv").append(topInfoMiddle);
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);

}




function drawHypotheticalForInstructions2(){
    clearAll();
    hypLeft=createDiv("hypLeft");
    $("#mainDiv").append(hypLeft);
    hypRight=createDiv("hypRight");
    $("#mainDiv").append(hypRight);



    window.firstPeriodRule["regular"]=0
    window.firstPeriodRule["hyp"]=0
    window.state=[];
    window.state['page']='na';
    window.hypHistories=4;
    window.hypTab=3;
    window.ruleSets["regular"]=[[[1]]];
    window.ruleNumbers["regular"]=[1];
    window.ruleLastUsed["regular"]=[0];
    window.ruleFrequency["regular"]=[0];
    window.firstPeriodRule["regular"]=1;


    window.ruleSets["hyp"]=[[[1]],[[0,0],[0,1],[1,0],[1]]];
    window.ruleNumbers["hyp"]=[1,2];
    window.ruleLastUsed["hyp"]=[0,0];
    window.ruleFrequency["hyp"]=[0,0];
    window.firstPeriodRule["hyp"]=0;

    incoming=[];
    incoming['hypHistory']=[[-1,-1],[0,0],[1,1],[1,0],[0,0],[1,1],[1,1],[1,1],[0,0],[0,0],[0,1],[1,1],[0,1],[0,0],[0,1],[-1,-1]];
    incoming['totalHypHistories']=4;
    incoming['hypHistoryNumber']=3;
    incoming['hypHistoryComplete']=1;
    hypHistoryMessage(incoming);


    var div = createDiv("hypTitle");
    div.innerHTML="Hypothetical Rules";
    $("#mainDiv").append(div);

    var div = createDiv("hypActualTitle");
    div.innerHTML="Starting Rules";
    $("#mainDiv").append(div);



    drawGame("hyp");
    drawRules("hyp");
    drawRules("hypActual");
    drawConstructor("hyp");
    drawDefault("hyp");
    //getHypHistory(-1);

    drawHypTabs();

    incoming['hypRuleOutput']=1;
    incoming['hypRuleNumber']=1;
    incoming['hypRuleLength']=0;



    incoming['regularRuleOutput']=1;
    incoming['regularRuleNumber']=1;
    incoming['regularRuleLength']=0;
    displayHypHistoryMessage(incoming)


    var topInfoLeft=createDiv("topInfoLeft");
    var topInfoMiddle=createDiv("topInfoMiddle");
    topInfoMiddle.innerHTML="The match will start in <time id='timer'>5:00</time>";
    $("#mainDiv").append(topInfoLeft);
    $("#mainDiv").append(topInfoMiddle);
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);

}






















function statusManager(){
  thisStatus=window.state;
  console.log(window.state['page'],window.state['stage']);
  if(thisStatus[0]==-1){
    message="Loading...";
    genericScreen(message);
  }
  else if(thisStatus["page"]=="generic"){
    clearAll();
    genericScreen(thisStatus["message"]);
  }
  else if(thisStatus["page"]=="quiz"){//quiz
    clearAll();
    drawRules("regular");
    window.speed=100;
    drawHistory("regular");

    for(k=0;k<window.currentHistory.length;k++){
        period=28-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            //document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    document.getElementById("regular_historyIN").style.transform="translateX("+(-200)+"px)";

    // fillHistory("slider",window.currentHistory,28,"all");
    drawGame("regular");
    if(thisStatus["stage"]=="question"){
      displayQuestion();
      if(window.questionType==3 || window.questionType==5){
        drawConstructor("regular");
      }
    }
    else if(thisStatus["stage"]!="question"){
      displaySolution();
    }
  }
  else if(thisStatus["page"]=="quizSummary"){
    message="Please wait for others finish the quiz. <br> You earned "+window.state["summary"]+".";
    genericScreen(message);
  }
  else if(thisStatus["page"]=="payoffsOnly"){//Show only payoff table for a bit
    $("#genericScreen").hide();
    window.timerMessage="You will be able to make rules in "
    window.timerLocation=[0,125,1280,75]
    window.actionProfileFrequencies=[0,0,0,0];
    window.stop=0;
    drawMessage("Please take this time to review the payoff table.","#FF0000");
    drawGame("regular");
    document.getElementById("gameDiv").style.transform="scale(3)";
    document.getElementById("gameDiv").style.transformOrigin="bottom right";
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="defaultNotSet"){//default Rule Not Set yet
    window.ruleSets=[];
    window.ruleNumbers=[];
    window.ruleLastUsed=[];
    window.ruleFrequency=[];
    window.firstPeriodRule=[];
    deleteDiv("genericScreen");
    drawIfNeeded("gameDiv");
    document.getElementById("gameDiv").style.transform="scale(1)";
    document.getElementById("gameDiv").style.transition="all .5s ease-out";
    drawIfNeeded("regularDefaultDiv");
    document.getElementById("regularDefaultDiv").style.transform="scale(3)";
    document.getElementById("regularDefaultDiv").style.transformOrigin="bottom left";
    document.getElementById("regularDefaultDiv").style.transition="all .5s ease-out";

    drawMessage("Match will start in <time id='timer'>1:00</time><br>You must set your default rule before play can begin.","#FF0000");
    moveTimer();


  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="defaultNotSetNoFirstPeriod"){//default Rule Not Set yet
    window.lockCosts=0;
    window.stop=0;
    window.timerMessage="Play will begin in "
    window.timerLocation=[0,125,1280,75]
    drawMessage("You must set your default rule before play can begin.","#FF0000");
    drawIfNeeded("gameDiv");
    drawDefault("regular");
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="hypothetical"){//prematch
    console.log(thisStatus);
    clearAll();
    drawIfNeeded("hypothetical");
    moveTimer();
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="preMatch"){//prematch
    console.log(thisStatus);
    deleteHypothetical();
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("regularConstructorDiv");
    drawIfNeeded("regularRuleList");
    drawInfo();
    drawMessage("Match will start in <time id='timer'>1:00</time>","#FF0000");
    moveTimer();

  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="regular"){//regualr
    drawSlider();
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("constructorDiv");
    drawIfNeeded("ruleList");
    drawInfo();
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="regularNoFirstPeriod"){//regualr
    drawSlider();
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("constructorDiv");
    drawIfNeeded("ruleList");
    drawInfo();
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="unlocked"){//Unlocked
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("regularConstructorDiv");
    drawIfNeeded("regularRuleList");
    drawIfNeeded("regular_history");

    deleteDiv("rulesLocked");
    deleteDiv("noButtonOverlay");
    deleteDiv("inGameMessage");
    drawInfo();
    //drawLockRules();
    drawLockButton();
    window.rulesUnlocked=1;
    updateUnlockTime();
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="locked"){//Locked
    console.log("leocked");
    deleteHypothetical();
    drawIfNeeded("gameDiv");
    drawIfNeeded("regularRuleList");
    drawIfNeeded("regular_history");
    deleteDiv("inGameMessage");
    deleteDiv("regularConstructorDiv");
    deleteDiv("defaultDiv");
    drawInfo();
    drawLock();
    drawUnlockButton();
  }
  else if(thisStatus["page"]=="game" && thisStatus["stage"]=="postMatch"){//MatchOver
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("regularConstructorDiv");
    drawIfNeeded("regularRuleList");
    deleteDiv("regular_history");
    deleteDiv("rulesLocked");
    deleteDiv("noButtonOverlay");
    deleteDiv("inGameMessage");
    deleteDiv("lockRulesButton");

    drawInfo();
    drawMessage("The Match Has Finished","#FF0000");
    moveTimer();
  }
}


function genericScreen(message){
    var generic = document.createElement("div");
    generic.id = "genericScreen";
    var genericScreenInside = document.createElement("div");
    genericScreenInside.id = "genericScreenInside";
    var genericScreenText = document.createElement("div");
    genericScreenText.id = "genericScreenText";
    $("#mainDiv").append(generic);
    generic.appendChild(genericScreenInside);
    genericScreenInside.appendChild(genericScreenText);
    document.getElementById("genericScreenText").innerHTML=message;
}


window.captionIndex=0;
function showCaptions(reloadType){
    if(document.getElementById('videoHolder')!=null){
        window.captionDiff=window.captions[window.captionIndex][2]-document.getElementById('videoHolder').currentTime;
    }
    else{
        window.captionDiff=0;
    }
    if(reloadType=="refresh"){
        window.captionDiff=0;
        thisCaptionTime=0;
        window.captionIndex=0;
        while(thisCaptionTime<window.elapsed){
            thisCaptionTime=thisCaptionTime+window.captions[window.captionIndex][1]*1000;
            window.captionIndex=window.captionIndex+1;
            interval=thisCaptionTime-window.elapsed;
        }
        window.captionIndex=window.captionIndex-1;
        console.log(window.captionIndex);
    }
    else{
        window.captionIndex=window.captionIndex+1;
        interval=window.captions[window.captionIndex][1]*1000;
    }


    if(document.getElementById("captions")==null){
        var title1 = createDiv('captions');
        $("body").append(title1);
    }
    else{
        var title1 = document.getElementById("captions");
    }
    title1.innerHTML=window.captions[window.captionIndex][0];
    console.log(window.captionIndex,interval,window.captionDiff*1000);
    setTimeout(showCaptions,interval+window.captionDiff*1000);
}


function placeText(divid,text,top,fontSize,color,fadeTime,textAlign,left){
    var title1 = document.createElement("a");
    title1.id=divid;
    title1.innerHTML=text;
    title1.style.opacity="0";
    title1.style.top=top+"px";
    title1.style.width="1280px";
    title1.style.fontSize=fontSize+"%";
    title1.style.left=left;
    title1.style.textAlign=textAlign;
    title1.style.color=color;
    title1.style.position="absolute";
    $("#mainDiv").append(title1);
    setTimeout(function(){
        document.getElementById(divid).style.opacity = "1";
        document.getElementById(divid).style.transition = "opacity "+fadeTime+"s ease";
    },50);
}


function drawLogoVSEEL(){
    var logo = document.createElement("a");
    logo.id="vseelLogo";
    logo.style.opacity="0";
    letters=["","V","S","E","E","L"]
    for(k=1;k<=5;k++){
        var test = document.createElement("div");
        test.className="welcomeScreenTitle spin"+k+" animated"+k;
        test.innerHTML=letters[k];
        logo.appendChild(test);
    }
    placeText("we",logo.innerHTML,400,400,"rgba(0,0,0,1)",4,"center","0px");
}

function drawLogoESL(){
    var logo = document.createElement("a");
    logo.id="vseelLogo";
    logo.style.opacity="0";
    letters=["","E","S","L"]
    for(k=1;k<=3;k++){
        var test = document.createElement("div");
        test.className="welcomeScreenTitle spin"+k+" animated"+k;
        test.innerHTML=letters[k];
        logo.appendChild(test);
    }
    placeText("we",logo.innerHTML,400,400,"rgba(0,0,0,1)",4,"center","0px");
}


function drawInstructionDemo(){
    window.payoffs=[];
    window.payoffs[0]=[7,8,6,4];
    window.payoffs[1]=[3,4,19,4];
    window.payoffs[2]=[5,6,6,4];
    window.payoffs[3]=[1,2,6,4];
    window.actionProfileFrequencies=[6,19,6,6];

    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[1,1],[0,0],[1,0],[0]],[[1,0],[0,1],[0,1],[0]],[[0,0],[1,0],[0]],[[1,1],[0]],[[0,1],[0]],[[1,0],[1]],[[0,0],[1]],[[1,0],[0,1],[1,0],[1]]];
    window.ruleNumbers["regular"]=[0,2,3,4,6,7,8,9,12];
    window.ruleLastUsed["regular"]=[0,2,3,4,6,7,8,9,12];
    window.ruleFrequency["regular"]=[0,2,3,4,6,7,8,9,12];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    window.state['page']!="quiz";
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[1,1],[0,1],[1,0],[0,1],[1,0],[1,0],[1,1],[0,0],[1,0],[1,0],[0,0],[0,0],[1,1],[1,0],[1,1],[0,1],[1,1],[0,1],[1,0],[0,1],[1,1],[1,1],[1,1],[0,0],[1,0]];
    window.currentPayoffHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0]];
    window.currentPeriod=44;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            //document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=0;
    window.nextPeriodRuleLength=3;
    //window.currentPeriod
    window.nextPeriodRule=2;
    drawNextAction("regular");
    
    // thisPeriod=100;
    // updateType="all";
    // fillHistory("slider",historyIN,thisPeriod,updateType);
    // window.speed=10;
    // changeSliderSpeed("slider");
    // window.currentPeriod=100;
    // setInterval(function(){
    //     window.currentPeriod=window.currentPeriod+1;
    //     fillHistory("slider",[0,0],window.currentPeriod); 
    //     fakeMessage=[];
    //     fakeMessage['ruleType']="regular";
    //     fakeMessage['lastRuleNumber']=5;
    //     fakeMessage['lastRuleLastUsed']=2;
    //     fakeMessage['lastRuleFrequency']=24;
    //     fakeMessage['currentRules']=[[[1]],[[0,0],[1]],[[1,1],[0]],[[0,1],[0]],[[1,0],[0,1],[1]],[[0,1],[1,0],[0,1],[0]]];
    //     fakeMessage['currentRuleNumbers']=[0,2,3,4,5,6];
    //     fakeMessage['lastUsed']=[18,23,19,22,-1,-1];
    //     fakeMessage['ruleFrequency']=[6,5,5,7,0,0];
    //     fakeMessage['nextPeriodPlay']=0;
    //     fakeMessage['nextPeriodRule']=5;
    //     fakeMessage['nextPeriodRuleLength']=2;
    //     fakeMessage['firstPeriodRule']=2;
    //     fakeMessage['updateType']="everything";
    //     updateRulesMessage(fakeMessage);
    // },5000);
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();
}





function drawInstructionDemo2(){
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[0,0],[1]],[[1,1],[1]],[[0,1],[0,0],[0]]];
    window.ruleNumbers["regular"]=[0,4,7,9];
    window.ruleLastUsed["regular"]=[5,3,7,2];
    window.ruleFrequency["regular"]=[9,3,5,4];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[1,0],[0,0],[0,1],[0,0],[0,0],[0,0],[1,1],[0,0],[1,1],[0,0],[1,1],[1,0],[0,1],[1,0],[0,1],[0,0],[0,0],[1,1],[0,0],[0,0],[0,1],[0,0]]
    window.currentPayoffHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0]];
    window.currentPeriod=28;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            //document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=0;
    window.nextPeriodRuleLength=2;
    //window.currentPeriod
    window.nextPeriodRule=9;
    drawNextAction("regular");

    window.state["match"]="Instructions";
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();
}




function drawInstructionDemo3(){
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[0,0],[1]],[[1,1],[1]],[[0,1],[0,0],[0]]];
    window.ruleNumbers["regular"]=[0,4,7,9];
    window.ruleLastUsed["regular"]=[5,3,7,2];
    window.ruleFrequency["regular"]=[9,3,5,4];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[1,0],[0,0],[0,1],[0,0],[0,0],[0,0],[1,1],[0,0],[1,1],[0,0],[1,1],[1,0],[0,1],[1,0],[0,1],[0,0],[0,0],[1,1],[0,0],[0,0],[0,1],[0,0]]
    window.currentPayoffHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0]];
    window.currentPeriod=28;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            //document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=0;
    window.nextPeriodRuleLength=2;
    //window.currentPeriod
    window.nextPeriodRule=9;
    drawNextAction("regular");

    window.state["match"]="Instructions";
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();
    drawLock();
    drawUnlockButton();
}




function highlightArea(divName,width,height,top,left,borderWidth,borderColor){
    thisDiv=createDiv(divName);
    thisDiv.className="highlightDiv";
    thisDiv.style.borderWidth=borderWidth+"px";
    thisDiv.style.borderColor=borderColor;
    thisDiv.style.width=width+"px";
    thisDiv.style.height=height+"px";
    thisDiv.style.top=top+"px";
    thisDiv.style.left=left+"px";
    $("#mainDiv").append(thisDiv);
}



function toggleOverlay(){
    if(document.getElementById("mainDivOverlay")!=null){
        var element = document.getElementById("mainDivOverlay");
        element.parentNode.removeChild(element);
    }
    else{
        var mainDivOverlay = document.createElement("div");
        mainDivOverlay.id = "mainDivOverlay";
        $("#mainDiv").append(mainDivOverlay);
    }
}

function growDiv(divName,scale,origin,time){
    if(document.getElementById(divName).style.transform.indexOf("scale("+scale+")")>-1){
        document.getElementById(divName).style.zIndex = "1";
        document.getElementById(divName).style.transform=document.getElementById(divName).style.transform.replace("scale("+scale+")","");
    }
    else{
        document.getElementById(divName).style.zIndex = "3";
        document.getElementById(divName).style.transform += " scale("+scale+")";
    }

    document.getElementById(divName).style.transition = time+"s ease-out";
    document.getElementById(divName).style.transformOrigin = origin;
}



function highlightText(divName,color,scale,time){
    document.getElementById(divName).style.fontSize=parseInt(scale*100)+"%";
    document.getElementById(divName).style.color=color;
    document.getElementById(divName).style.transition = time+"s ease-out";
}


function highlightDivBorder(divName,color,time,width){
    document.getElementById(divName).style.border=width+"px solid "+color;
    document.getElementById(divName).style.transition = time+"s ease-out";
}



function instructionHighlightArea(sx,sy,wx,wy){
    deleteDiv("instructionHighlight");
    if(wx>0){
        var title1 = document.createElement("a");
        title1.id="instructionHighlight";
        title1.style.top=sy+"px";
        title1.style.left=sx+"px";
        title1.style.width=wx+"px";
        title1.style.height=wx+"px";
        title1.style.border="10px solid blue";
        title1.style.position="absolute";
        title1.style.boxSizing = "border-box";
        title1.style.zIndex = "4";
        $("#mainDiv").append(title1);
    }
}




function getStartTime(){
    window.startTime=(new Date()).getTime();
}


function getTask(reloadType){
    if(reloadType=="refresh"){
        thisTaskTime=0;
        thisTaskIndex=-1;
        tasksToRun=["startAudio"];
        while(thisTaskTime<window.elapsed){
            thisTaskIndex=thisTaskIndex+1;
            thisTaskTime=thisTaskTime+window.instructionsList[thisTaskIndex][0];
            if(thisTaskTime>window.elapsed){
                //console.log("refresh",thisTaskTime-window.elapsed);
                window.nextInstructionTask=setTimeout(performTask,thisTaskTime-window.elapsed);
                window.instructionIndex=thisTaskIndex;
            }
            else{
                if(window.instructionsList[thisTaskIndex][3].indexOf("startMouseSequence")>-1){
                    window.instructionsList[thisTaskIndex][3]=window.instructionsList[thisTaskIndex][3].split("]],0)").join("]],10000000)");
                    console.log(window.instructionsList[thisTaskIndex][3]);
                }
                if(window.instructionsList[thisTaskIndex][3]=="clearAll"){tasksToRun=["startAudio","clearAll"];}
                else if(window.instructionsList[thisTaskIndex][3]=="startAudio"){"do nothing";}
                else{tasksToRun.push(window.instructionsList[thisTaskIndex][3])}
                //window.instructionsList[thisTaskIndex][1]();
            }
        }

        for(k=0;k<tasksToRun.length;k++){
            console.log("sdhfsdhf",tasksToRun[k]);
            if(tasksToRun[k].indexOf("growDiv")>-1){
                thisIndex=tasksToRun[k].lastIndexOf(",");
                tasksToRun[k]=tasksToRun[k].substring(0,thisIndex)+",0)";
                console.log(tasksToRun[k]);
            }   
            eval(tasksToRun[k])();
        }
    }
    else{
        window.nextInstructionTask=setTimeout(performTask,window.instructionsList[window.instructionIndex][0]+window.timeDiff*1000);
    }
}

function performTask(){
    if(document.getElementById('videoHolder')!=null){
        window.timeDiff=window.instructionsList[window.instructionIndex][2]/1000-document.getElementById('videoHolder').currentTime;
    }
    else{
        window.timeDiff=0;
    }
    //console.log(timeDiff);
    console.log(window.instructionsList[window.instructionIndex]);
    window.instructionsList[window.instructionIndex][1]();
    window.instructionIndex=window.instructionIndex+1;
    getTask();
}

function drawElapsedTime(){
    if(document.getElementById("instructionsElapsed")==null){
        element = createDiv("instructionsElapsed");
        $("body").append(element);
    }
    else{
        element = document.getElementById("instructionsElapsed");
    }
    element.innerHTML=makeTimePretty(((new Date()).getTime()-window.startTime)/1000);
    window.moveInstructionsTimer=setTimeout(drawElapsedTime,100);
}


function startAudio(){
    drawElapsedTime();
    var video=document.getElementById("videoHolder");
    video.currentTime = window.elapsed/1000;//msg['time']+((new Date()).getTime()-window.messageReceivedTime)/1000;
    //video.playbackRate = window.instructionSpeed;
    video.play();
    showCaptions("refresh");
}
function changeBackgroundColor(colorIN){
    document.getElementById("mainDiv").style.backgroundColor=colorIN;
}


function doInstructions(){
    getTask("refresh");
}


function updateStatusMessage(incoming){
  //location.reload();
  window.state=incoming['status'];
  statusManager();
}


function updateRulesMessage(incoming){
    //console.log("updateRulesMessage",incoming['ruleType'],getRuleSet(incoming['ruleType']),getRuleSet(incoming['ruleType']) in window.ruleSets);
    ruleType=getRuleSet(incoming['ruleType']);
    window.ruleSets[ruleType]=eval(JSON.parse(JSON.stringify(incoming['currentRules'])));
    window.ruleNumbers[ruleType]=eval(JSON.parse(JSON.stringify(incoming['currentRuleNumbers'])));
    window.ruleLastUsed[ruleType]=eval(JSON.parse(JSON.stringify(incoming['lastUsed'])));
    window.ruleFrequency[ruleType]=eval(JSON.parse(JSON.stringify(incoming['ruleFrequency'])));
    window.firstPeriodRule[ruleType]=eval(JSON.parse(JSON.stringify(incoming['firstPeriodRule'])));
    if(incoming['updateType']=="everything"){
        if(thisStatus["page"]=="game" && thisStatus["stage"]=="hypothetical"){
            drawRules("hyp");            
            drawRules("hypActual");    
            if(window.hypHistory!=undefined){updateHypHistoryOnServer();}
        }  
        else{
            drawRules("regular");            
            drawInfo();
        }
    }
    else{
        window.nextPeriodPlay=incoming['nextPeriodPlay'];
        window.nextPeriodRule=incoming['nextPeriodRule'];
        window.nextPeriodRuleLength=incoming['nextPeriodRuleLength'];
        updateRuleStats(ruleType,incoming['lastRuleNumber'],incoming['lastRuleLastUsed'],incoming['lastRuleFrequency']);
    }
  window.nextPeriodPlay=incoming['nextPeriodPlay'];
  window.nextPeriodRule=incoming['nextPeriodRule'];
  window.nextPeriodRuleLength=incoming['nextPeriodRuleLength'];

  if(ruleType=="regular"){
      drawNextAction("regular");
  }

    if(thisStatus["page"]=="game" && thisStatus["stage"]=="defaultNotSet"){
        statusManager();
    }

}


function quizQuestionMessage(incoming){
  window.questionType=incoming['questionType'];
  window.questionNumber=incoming['questionNumber'];
  window.question=incoming['question'];
  window.questionParams=incoming['questionParams'];
  window.tries=incoming['tries']
  window.price=incoming['price']
  window.quizEarnings=incoming['quizEarnings']
  window.currentHistory=incoming['history'];
  window.actualX=-100;
  window.deltaX=-100;
  window.targetX=-100;
  window.lastTimeCheck=(new Date()).getTime();

    window.ruleSets=[]
    window.ruleNumbers=[]
    window.ruleLastUsed=[]
    window.ruleFrequency=[]
    window.firstPeriodRule=[]
    window.firstPeriodRule['regular']=0;
    window.ruleSets['regular']=incoming['rules'];
    window.ruleNumbers['regular']=incoming['ruleNumbers'];
    window.ruleLastUsed['regular']=incoming['ruleLastUsed'];
    window.ruleFrequency['regular']=incoming['ruleFrequency'];
  window.lastRule=-1;
  window.lastRuleLength=-1;
  window.constructors['regular']=[[-1,-1],[-1]];
  window.answerStatement=incoming['answerStatement'];
  window.questionStatement=incoming['questionStatement'];
  statusManager();
}


function newHistoryMessage(incoming){
  window.currentHistory=incoming['history'];
  window.currentPayoffHistory=incoming['payoffHistory'];
  window.currentPeriod=incoming['period'];
  window.actionProfileFrequencies=incoming['actionProfileFrequencies'];
  window.lastPlay=incoming['lastPlay'];

  for(k=0;k<window.currentHistory.length;k++){
    period=window.currentPeriod-window.currentHistory.length+k+1;
    if(isDivNotThere("regular_history_square_"+period+"_1")){
        drawHistoryPeriodLabels('regular',period);
        drawHistoryPeriod('regular',period,0);
        drawHistoryPeriod('regular',period,1);
        fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
        fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
        document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
    }
  }

  for(k=0;k<window.currentPeriod-21;k++){
    deleteHistoryPeriod('regular',k);
  }
  document.getElementById("regular_historyIN").style.transform="translateX("+(1150-window.currentPeriod*50)+"px)";
  document.getElementById("regular_historyIN").style.transition="all .5s ease";
  document.getElementById("regular_historyIN").style.transitionDelay=".5s";


  drawHistoryPeriod('regular',window.currentPeriod+1,0);
    drawHistoryPeriodLabels('regular',window.currentPeriod+1);


  for(k=0;k<4;k++){
    document.getElementById("gameTable_4_"+(k+1)).innerHTML=window.actionProfileFrequencies[k];
    if(k==window.lastPlay){
        document.getElementById("gameTable_4_"+(k+1)).style.color="red";
        document.getElementById("gameTable_4_"+(k+1)).style.fontSize="200%";
        document.getElementById("gameTable_4_"+(k+1)).style.transition = "all .5s ease-out";


        document.getElementById("gameTable_2_"+(k+1)).style.color="green";
        document.getElementById("gameTable_2_"+(k+1)).style.fontSize="200%";
        document.getElementById("gameTable_2_"+(k+1)).style.transition = "all .5s ease-out";
    }
    else{
        for(j=2;j<5;j++){
            document.getElementById("gameTable_"+j+"_"+(k+1)).style.color="black";
            document.getElementById("gameTable_"+j+"_"+(k+1)).style.fontSize="125%";
        }
    }


        document.getElementById("regular_historyPayoffLabel_"+window.currentPeriod).style.color="green";
        document.getElementById("regular_historyPayoffLabel_"+window.currentPeriod).style.fontSize="200%";
        document.getElementById("regular_historyPayoffLabel_"+window.currentPeriod).style.transition = "all .5s ease-out";
        if(window.currentPeriod>1){
            document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod-1)).style.color="black";
            document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod-1)).style.fontSize="100%";
        }
  }


  window.matchPayoff=incoming['matchPayoff'];
  window.unlockCosts=incoming['unlockCosts'];
  window.totalPayoff=incoming['totalPayoff'];
  window.lockCosts=incoming['lockCosts'];
  window.lastRule=incoming['lastRule'];
  window.lastRuleLength=incoming['lastRuleLength'];
  if(isNaN(window.actualX)){
    window.actualX=-100;
  }
  else{
    window.actualX=window.actualX+50
  }
  window.targetX=-100
  window.lastTimeCheck=(new Date()).getTime();
  window.serverTime=incoming['elapsed']*1000;
  //statusManager();
    drawInfo();
}


function displayQuestion(){
    quizDiv=createDiv("quizDiv");
    $('#mainDiv').append(quizDiv);
    deleteDiv("quizAnswerDiv");

    quizEarningsDiv=createDiv("quizEarningsDiv");
    quizEarningsDiv.innerHTML="Quiz Earnings: "+window.quizEarnings;
    quizDiv.appendChild(quizEarningsDiv);




    if(window.questionType==1){
        quizQuestionDiv=createDiv("quizQuestionDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". (Try #"+window.tries+" - "+window.price+") Given the current history, what action will be played in the next period?";

        quizQuestionHint=createDiv("quizQuestionHint");
        quizQuestionHint.innerHTML="Hint: for an example see lines 125-126 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);
        var listEntryButton1 = document.createElement("a");
        listEntryButton1.className = "wSquare square answerW";
        answer=0;
        confirmationStatement="Are you sure you want to submit W as your answer??";
        if(thisStatus["stage"]=="question"){
            var pf = partial(submitAnswer,confirmationStatement,answer,window.questionType);
            listEntryButton1.addEventListener("click",pf);
        }
        quizDiv.appendChild(listEntryButton1);

        var listEntryButton2 = document.createElement("a");
        listEntryButton2.className = "ySquare square answerY";
        answer=1;
        confirmationStatement="Are you sure you want to submit Y as your answer??";
        if(thisStatus["stage"]=="question"){
            var pf = partial(submitAnswer,confirmationStatement,answer,window.questionType);
            listEntryButton2.addEventListener("click",pf);
        }
        quizDiv.appendChild(listEntryButton2);
    }
    else if(window.questionType==2){
        quizQuestionDiv=createDiv("quizQuestionDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". (Try #"+window.tries+" - "+window.price+") "+window.questionStatement;


        quizQuestionHint=createDiv("quizQuestionHint");
        quizQuestionHint.innerHTML="Hint: for an example see lines 53-59 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);

        for(k=1;k<=8;k++){
            var answerButton = document.createElement("a");
            answerButton.className = "blankSquare square answerW";
            answerButton.style.top=(125)+"px";
            answerButton.style.left=(-10+k*100)+"px";
            answerButton.innerHTML=k;
            answer=k;
            confirmationStatement="Are you sure you want to submit "+k+" as your answer??";
            if(thisStatus["stage"]=="question"){
                var pf = partial(submitAnswer,confirmationStatement,answer,window.questionType);
                answerButton.addEventListener("click",pf);
            }
            quizDiv.appendChild(answerButton);
        }
    }
    else if(window.questionType==3){
        quizQuestionDiv=createDiv("quizQuestionLeftDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". (Try #"+window.tries+" - "+window.price+") ADD a rule to the set to ensure that "+window.actions[window.questionParams[0]]+" will be played next period.";
        quizQuestionHint=createDiv("quizQuestionHint2");
        quizQuestionHint.innerHTML="Hint: for an example see lines 128-129 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);

    }
    else if(window.questionType==4){
        quizQuestionDiv=createDiv("quizQuestionDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". (Try #"+window.tries+" - "+window.price+") DELETE a rule from the set to ensure that "+window.actions[window.questionParams[0]]+" will be played next period.";
        quizQuestionHint=createDiv("quizQuestionHint");
        quizQuestionHint.innerHTML="Hint: for an example see lines 94-95 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);
    }
    else if(window.questionType==5){
        quizQuestionDiv=createDiv("quizQuestionLeftDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". (Try #"+window.tries+" - "+window.price+") COPY and SWITCH a rule from the set to ensure that "+window.actions[window.questionParams[0]]+" will be played next period.";
        quizQuestionHint=createDiv("quizQuestionHint2");
        quizQuestionHint.innerHTML="Hint: for an example see lines 93 of the instructions on how to COPY and SWITCH a rule.";
        quizQuestionDiv.appendChild(quizQuestionHint);

    }
    quizDiv.appendChild(quizQuestionDiv);
}


function submitAnswer(confirmationStatement,answer,questionType){
    var confirmation=confirmAction(confirmationStatement);
    if(confirmation){
        var message={"type":"quizAnswer","answer":answer,"questionType":questionType};
        sock.send(JSON.stringify(message));
    }
}

function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}

function answerSolutionMessage(incoming){
  window.answerMessage=incoming;
  window.quizEarnings=incoming['quizEarnings']
  statusManager();
}


         // msg['solution']="correct"
         // msg['solutionText']="The answer is correct."
         // msg['buttonText']="Next Question."



function sendSimpleMessage(input){
    var message={"type":input};
    sock.send(JSON.stringify(message));    
}



//         sendSimpleMessage("nextQuestion")
// sendSimpleMessage("tryAgain")



function displaySolution(){
    drawIfNeeded("quizDiv");
    quizAnswerDiv=createDiv("quizAnswerDiv");
    quizAnswerDiv.innerHTML=window.answerMessage['solutionText'];
    console.log(window.answerMessage['solution']);
    quizAnswerDivButton=createDiv("quizAnswerDivButton");
    quizAnswerDivButton.innerHTML=answerMessage['buttonText'];
    if(window.answerMessage['solution']=="incorrect" && window.tries<2){
        quizAnswerDiv.style.borderColor = "red";
        quizAnswerDivButton.style.borderColor = "red";
        quizAnswerDivButton.style.backgroundColor = "rgba(255,0,0,.2)";
        var pf = partial(sendSimpleMessage,"tryAgain");
        quizAnswerDivButton.addEventListener("click",pf);
    }


    else if(window.tries>1 && window.answerMessage['solution']=="incorrect"){
        quizAnswerDiv.innerHTML=quizAnswerDiv.innerHTML+"<br>"+window.answerStatement
        quizAnswerDiv.style.borderColor = "red";
        quizAnswerDivButton.style.borderColor = "red";
        quizAnswerDivButton.style.backgroundColor = "rgba(255,0,0,.2)";
        var pf = partial(sendSimpleMessage,"tryAgain");
        quizAnswerDivButton.addEventListener("click",pf);
    }


    else if(window.answerMessage['solution']=="correct"){
        quizAnswerDiv.innerHTML=quizAnswerDiv.innerHTML+"<br>"+window.answerStatement
        quizAnswerDiv.style.borderColor = "green";
        quizAnswerDivButton.style.borderColor = "green";
        quizAnswerDivButton.style.backgroundColor = "rgba(0,255,0,.2)";
        var pf = partial(sendSimpleMessage,"nextQuestion");
        quizAnswerDivButton.addEventListener("click",pf);
    }

    $('#mainDiv').append(quizAnswerDiv);
    $('#quizAnswerDiv').append(quizAnswerDivButton);
}
//     quizQuestionDiv=createDiv("quizQuestionDiv");





//   if(window.answerMessage['solution']=="correct"){
//     var x=0;
//     var y=255;
//     thisText="Next Question";
//   }
//   else if(window.answerMessage['solution']=="incorrect"){
//     var x=255;
//     var y=0;
//     thisText="Try Again";
//   }



//   var myRectangle={
//     start:[0,774],
//     end:[930,1024],
//     text:"",
//     context:window.context3,
//     borderWidth:4,
//     backgroundColor:"white",
//     borderColor:"rgba("+x+","+y+",0,1)",
//     fontType:"40px Proxima Nova"
//   };
//   drawRectangle2(myRectangle);

//   var myRectangle={
//     start:[0,774],
//     end:[930,824],
//     text:window.answerMessage['solutionText'],
//     context:window.context3,
//     borderWidth:4,
//     backgroundColor:"transparent",
//     borderColor:"transparent",
//     fontType:"26px Proxima Nova"
//   };
//   drawRectangle2(myRectangle);

//   var myRectangle={
//     start:[730,974],
//     end:[930,1024],
//     text:thisText,
//     context:window.context3,
//     borderWidth:4,
//     backgroundColor:"rgba("+x+","+y+",0,.2)",
//     borderColor:"rgba("+x+","+y+",0,1)",
//     fontType:"16px Proxima Nova"
//   };
//   drawRectangle2(myRectangle);

//   window.buttons['solution']=[]
//   if(window.answerMessage['solution']=="correct"){
//     fontStyle = {};
//     fontStyle['font'] = "24px Proxima Nova";
//     fontStyle['color'] = '#008800';
//     wrapText(window.context3,window.answerStatement,465,874,465,30,fontStyle);
//     window.buttons['solution'].push([730,924,200,100,["nextQuestion"]])
//   }
//   else if(window.tries>1 && window.answerMessage['solution']=="incorrect"){
//     fontStyle = {};
//     fontStyle['font'] = "24px Proxima Nova";
//     fontStyle['color'] = '#008800';
//     wrapText(window.context3,window.answerStatement,465,874,465,30,fontStyle);
//     window.buttons['solution'].push([730,924,200,100,["tryAgain"]])
//   }
//   else{
//     window.buttons['solution'].push([730,924,200,100,["tryAgain"]])    
//   }

//   // var myRectangle={x:615,y:175,action:window.answerMessage['buttonText'],context:window.context3,borderWidth:1,borderColor:color,h:30,w:150};
//   // drawRectangle(myRectangle);
// }

// drawTopInfo();
// historySequence=[["y","w"],["w","y"]]
// drawHistory(historySequence,5);
// document.getElementById('history_square_2_0').className="ySquare square";
// highlightHistory(1,3,6);

//document.getElementById('historyDiv').classList.add('horizTranslate');

// window.setInterval(addHistory,4000);
// addHistory();
// function addHistory(){
//     historySequence.push(['w','w']);
//     drawHistory(historySequence,3);
// }


//window.setInterval(testing,10);
// testing();
// function testing(){
//     thispos=thispos-.125;
//     document.getElementById('historyLabelsDiv').style.left=thispos+"px"
//     document.getElementById('historyDiv').style.left=thispos+"px"
// }



// var testDiv = document.createElement("div");
// testDiv.className = "testDiv";
// $("body").append(testDiv);


// testDiv.style.transition = "all .5s ease-out";
// testDiv.style.transform = "translate(100px,0px)";

//drawInstructionDemo(0


function newPeriodTest(){
    input=window.instructionInput[window.instructionDemoIndex%window.instructionInput.length];
    window.currentPeriod=window.currentPeriod+1;
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    drawHistoryPeriod('regular',window.currentPeriod,1);
    drawHistoryPeriodLabels('regular',window.currentPeriod);

    fillHistory("regular",window.currentPeriod,0,input[0][0]);
    fillHistory("regular",window.currentPeriod,1,input[0][1]);
        window.nextPeriodPlay=input[1];
        window.nextPeriodRuleLength=input[2];
    //window.currentPeriod
        window.nextPeriodRule=input[3];
        drawNextAction("regular");
  document.getElementById("regular_historyIN").style.transform="translateX("+(1150-window.currentPeriod*50)+"px)";
  document.getElementById("regular_historyIN").style.transition="all .5s ease";
  document.getElementById("regular_historyIN").style.transitionDelay=".5s";
    window.instructionDemoIndex=window.instructionDemoIndex+1;
}



function setInnerHtml(divIN,text){
  document.getElementById(divIN).innerHTML=text;
}

window.historyOfPlay=[[1,2],[3,2],[3,3],[2,3],[1,2],[2,1],[1,3],[3,1],[1,2],[3,2],[3,3],[2,3],[1,2],[2,1],[1,3],[3,1],[1,2],[3,2],[3,3],[2,3],[1,2],[2,1],[1,3],[3,1],[1,2],[3,2],[3,3],[2,3],[1,2],[2,1],[1,3],[3,1]];


// window.elapsed=.00001*1000;
// window.startTime=(new Date()).getTime()-window.elapsed;
// pf=partial(doInstructions);
// setTimeout(pf,100);



