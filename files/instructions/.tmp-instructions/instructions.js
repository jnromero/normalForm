var partial = function (func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};




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
    // clearAll();
    // message="Loading Instructions...";
    // genericScreen(message);
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


function moveInstructions(){
    window.instructionDemoIndex=0;
    window.instructionInput=[[["w","w"],1,1,9],[["y","w"],1,1,8],[["y","y"],0,1,6],[["w","y"],0,1,7]];
    pf=partial(newPeriodTest);
    window.moveInstructions=setInterval(pf,10000);
}

function stopInstructions(){
    clearInterval(window.moveInstructions);
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
        $("#mainDiv").append(title1);
    }
    else{
        var title1 = document.getElementById("captions");
    }
    title1.innerHTML=window.captions[window.captionIndex][0];
    //console.log(window.captionIndex,interval,window.captionDiff*1000);
    console.log("nextCaption",interval+window.captionDiff*1000);
    setTimeout(showCaptions,interval+window.captionDiff*1000);
}

function placeText(divid,text,top,fontSize,color,fadeTime,textAlign,left){
    var title1 = document.createElement("a");
    title1.id=divid;
    title1.innerHTML=text;
    title1.style.opacity="0";
    //title1.style.lineHeight="300px";
    title1.style.top=top+"px";
    title1.style.width="100%";
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
    placeText("we",logo.innerHTML,300,400,"rgba(0,0,0,1)",4,"center","0px");
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


function setInnerHtml(divIN,text){
  document.getElementById(divIN).innerHTML=text;
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
            //console.log("sdhfsdhf",tasksToRun[k]);
            if(tasksToRun[k].indexOf("growDiv")>-1){
                thisIndex=tasksToRun[k].lastIndexOf(",");
                tasksToRun[k]=tasksToRun[k].substring(0,thisIndex)+",0)";
                //console.log(tasksToRun[k]);
            }   
            eval(tasksToRun[k])();
        }
    }
    else{
        //console.log(window.instructionsList[window.instructionIndex]);
        if(window.instructionIndex<window.instructionsList.length){
            window.nextInstructionTask=setTimeout(performTask,window.instructionsList[window.instructionIndex][0]+window.timeDiff*1000);
        }
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
    //console.log(window.instructionsList[window.instructionIndex]);
    window.instructionsList[window.instructionIndex][1]();
    window.instructionIndex=window.instructionIndex+1;
    getTask();
}

function drawElapsedTime(){
    if(document.getElementById("instructionsElapsed")==null){
        element = createDiv("instructionsElapsed");
        $("#mainDiv").append(element);
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
    console.log(window.elapsed);
    video.currentTime = window.elapsed/1000;//msg['time']+((new Date()).getTime()-window.messageReceivedTime)/1000;
    //video.playbackRate = window.instructionSpeed;
    video.play();
    console.log("startAudo");
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




// window.elapsed=.00001*1000;
// window.startTime=(new Date()).getTime()-window.elapsed;
// pf=partial(doInstructions);
// setTimeout(pf,100);


thisStatus={}
thisStatus['period']=14;
thisStatus['match']=2;
thisStatus['correctGuesses']=35;
thisStatus['history']=[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]];
thisStatus['myMatchPay']=0;
thisStatus['theirMatchPay']=0;
thisStatus['myTotalPay']=0;
thisStatus["page"]='game';
thisStatus["stage"]="noChoices";
window.state=thisStatus;


function setInstructionParameters(){
    msg={'colActions': {1: 'L', 2: 'R'}, 'colColors': {1: 'rgba(152,78,163,1)', 2: 'rgba(255,127,0,1)', 3: 'rgba(200,200,51,1)'}, 'exchangeRate': 0.05, 'rowActions': {1: 'U', 2: 'D'}, 'rowColors': {1: 'rgba(228,26,28,1)', 2: 'rgba(55,126,184,1)', 3: 'rgba(77,175,74,1)'}, 'pays': {1: {1: [8, 1], 2: [7, 2]}, 2: {1: [6, 3], 2: [5, 4]}}, 'numberOfCols': 2, 'numberOfRows': 2, 'type': 'parameters'}
    parametersMessage(msg);
    window.state={'correctGuesses': 8, 'period': 19, 'myMatchPay': 180, 'myTotalPay': 470, 'theirMatchPay': 190, 'stage': 'noChoices', 'page': 'game', 'match': 2, 'history': [[2, 1], [1, 1], [1, 1], [1, 2], [2, 1], [1, 2], [2, 2], [1, 2], [1, 1], [1, 1], [1, 1], [1, 1], [2, 2], [2, 2], [1, 2], [1, 1], [1, 2], [2, 1], [2, 2]]}
}
function nextPeriod(){
    console.log(window.state);
    statusManager();
}



