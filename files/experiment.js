mainDiv = createDiv("mainDiv");
$("body").prepend(mainDiv);

function parameters(message){
    console.log(message);
    window['rowColors']=message['rowColors'];
    window['colColors']=message['colColors'];
    window['pays']=message['pays'];
    window['rowActions']=message['rowActions'];
    window['colActions']=message['colActions'];
    window['numberOfRows']=message['numberOfRows'];
    window['numberOfCols']=message['numberOfCols'];
}

window.partials={} 
window.partials["selectCol1"] = partial(selectColumn,1,1);
window.partials["selectCol2"] = partial(selectColumn,2,1);
window.partials["selectCol3"] = partial(selectColumn,3,1);
window.partials["selectRow1"] = partial(selectRow,1,1);
window.partials["selectRow2"] = partial(selectRow,2,1);
window.partials["selectRow3"] = partial(selectRow,3,1);


//
// Draw interface
//

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

function drawStatus(){
    statusBar=createDiv("statusBar");
    theirChoices="(";
    for(var col in window.colActions){
        theirChoices=theirChoices+window.colActions[col]+", "
    }
    theirChoices=theirChoices.substring(0, theirChoices.length - 2)+")";


    myChoices="(";
    for(var row in window.rowActions){
        myChoices=myChoices+window.rowActions[row]+", "
    }
    myChoices=myChoices.substring(0, myChoices.length - 2)+")";


    statusBar.innerHTML="Please select \"My Choice\" "+myChoices+" and your guess for \"Other's Choice\" "+theirChoices+".";
    $("#mainDiv").append(statusBar);
}

function drawGame(){
    //Create Game div
    gameDiv=createDiv("gameDiv");
    for(var col in window.colActions){
        var gameTableColLabel = document.createElement("div");
        gameTableColLabel.className="gameTableItem gameTableColLabel active";
        gameTableColLabel.id="gameTableColLabel_"+col;
        gameTableColLabel.innerHTML=window.colActions[col];
        gameTableColLabel.style.left=120+200*(col-1)+5+"px";
        gameTableColLabel.style.top="25px";
        gameTableColLabel.style.color=window.colColors[col];
        gameTableColLabel.addEventListener("click",window.partials["selectCol"+col]);
        gameDiv.appendChild(gameTableColLabel);
    }


    for(var row in window.rowActions){
        var gameTableRowLabel = document.createElement("div");
        gameTableRowLabel.className="gameTableItem gameTableRowLabel active";
        gameTableRowLabel.id="gameTableRowLabel_"+row;
        gameTableRowLabel.innerHTML=window.rowActions[row];
        gameTableRowLabel.style.left="25px";
        gameTableRowLabel.style.top=120+200*(row-1)+5+"px";
        gameTableRowLabel.style.color=window.rowColors[row];
        gameTableRowLabel.addEventListener("click",window.partials["selectRow"+row]);
        gameDiv.appendChild(gameTableRowLabel);
    }



    gameDiv.style.top=((3-window.numberOfRows)*50+25)+"px";
    gameDiv.style.left=((3-window.numberOfCols)*50+175)+"px";;

    for(var row in window.rowActions){
        for(var col in window.colActions){
            var testEntry = document.createElement("div");
            testEntry.className="gameTableItem gameTableEntry";
            testEntry.id="gameTableEntry_"+row+"_"+col;
            testEntry.style.left=120+200*(col-1)+5+"px";
            testEntry.style.top=120+200*(row-1)+5+"px";

            var testEntryPay = document.createElement("div");
            testEntryPay.className="gameTableEntryPay1";
            testEntryPay.innerHTML=pays[row][col][0];
            testEntryPay.style.color=window.rowColors[row];
            testEntry.appendChild(testEntryPay);

            var testEntryPay = document.createElement("div");
            testEntryPay.className="gameTableEntryPay2";
            testEntryPay.innerHTML=pays[row][col][1];
            testEntryPay.style.color=window.colColors[col];
            testEntry.appendChild(testEntryPay);

            gameDiv.appendChild(testEntry);
       }
    }
    $("#mainDiv").append(gameDiv);

    //document.getElementById("gameTableEntry_2_2").style.border="10px solid red";
}

function drawHistory(){
    //Create Game div
    historyLabels=createDiv("historyLabels");
    historyDiv=createDiv("historyDiv");
    historyDivIn=createDiv("historyDivIn");
    historyDiv.appendChild(historyDivIn)

    historyLabelPeriod=createDiv("historyLabelPeriod");
    historyLabelPeriod.className="historyLabel";
    historyLabelPeriod.style.top="10px";
    historyLabelPeriod.innerHTML="Period";
    historyLabels.appendChild(historyLabelPeriod)


    historyLabelMyChoice=createDiv("historyLabelMyChoice");
    historyLabelMyChoice.className="historyLabel";
    historyLabelMyChoice.style.top="70px";
    historyLabelMyChoice.innerHTML="My Choice";
    historyLabels.appendChild(historyLabelMyChoice)

    historyLabelOthersChoice=createDiv("historyLabelOthersChoice");
    historyLabelOthersChoice.className="historyLabel";
    historyLabelOthersChoice.style.top="130px";
    historyLabelOthersChoice.innerHTML="Other's Choice";
    historyLabels.appendChild(historyLabelOthersChoice)

    historyLabelMyPayoff=createDiv("historyLabelMyPayoff");
    historyLabelMyPayoff.className="historyLabel";
    historyLabelMyPayoff.style.top="190px";
    historyLabelMyPayoff.innerHTML="My Payoff";
    historyLabels.appendChild(historyLabelMyPayoff)

    historyLabelOthersPayoff=createDiv("historyLabelOthersPayoff");
    historyLabelOthersPayoff.className="historyLabel";
    historyLabelOthersPayoff.style.top="250px";
    historyLabelOthersPayoff.innerHTML="Other's Payoff";
    historyLabels.appendChild(historyLabelOthersPayoff)



    for(period=window.currentPeriod;period>0;period--){
        for(row=0;row<5;row++){
            historyEntry=createDiv("historyEntry_"+period+"_"+row);
            historyEntry.className="historyEntry";
            historyEntry.style.top=10+row*60+"px";
            historyEntry.style.left=-100+(period)*75+"px";
            if(row==0){historyEntry.innerHTML=period;}
            else if(period>window.currentPeriod-1){historyEntry.innerHTML="?";}
            else if(row==1){
                thisChoice=window.historyOfPlay[period-1][0];
                historyEntry.innerHTML=window.rowActions[thisChoice];
                historyEntry.style.color=window.rowColors[thisChoice]
            }
            else if(row==2){
                thisChoice=window.historyOfPlay[period-1][1];
                historyEntry.innerHTML=window.colActions[thisChoice];
                historyEntry.style.color=window.colColors[thisChoice]
                //pays[1][1]=[30,30]
            }

            else if(row==3){
                myChoice=window.historyOfPlay[period-1][0];
                theirChoice=window.historyOfPlay[period-1][1];
                myPay=pays[myChoice][theirChoice][0];
                historyEntry.innerHTML=myPay;
                historyEntry.style.color=window.rowColors[myChoice]
            }
            else if(row==4){
                myChoice=window.historyOfPlay[period-1][0];
                theirChoice=window.historyOfPlay[period-1][1];
                theirPay=pays[myChoice][theirChoice][1];
                historyEntry.innerHTML=theirPay;
                historyEntry.style.color=window.colColors[theirChoice]
            }

            historyDivIn.appendChild(historyEntry)
        }
    }
    historyDivIn.style.width=75*(window.currentPeriod+3)+"px";
    $("#mainDiv").append(historyDiv);
    $("#mainDiv").append(historyLabels);
}

function drawPeriodSummary(){
    //Create Game div
    questionsDiv=createDiv("questionsDiv");

    summaryLabel=createDiv("periodSummaryLabel");
    summaryLabel.innerHTML="Period "+window.currentPeriod+" Summary:";
    questionsDiv.appendChild(summaryLabel)
    

    summaryLabel=createDiv("summaryLabel");
    summaryLabel.innerHTML="Overall Summary:";
    questionsDiv.appendChild(summaryLabel)

    summaryLabel=createDiv("totalPayoffMineLabel");
    summaryLabel.innerHTML="My Match Payoff:";
    questionsDiv.appendChild(summaryLabel)

    summaryLabel=createDiv("totalPayoffMine");
    summaryLabel.innerHTML=window.myMatchPay;
    questionsDiv.appendChild(summaryLabel)

    summaryLabel=createDiv("totalPayoffOthersLabel");
    summaryLabel.innerHTML="Other's Match Payoff:";
    questionsDiv.appendChild(summaryLabel)

    summaryLabel=createDiv("totalPayoffOthers");
    summaryLabel.innerHTML=window.theirMatchPay;
    questionsDiv.appendChild(summaryLabel)


    summaryLabel=createDiv("correctGuessesLabel");
    summaryLabel.innerHTML="Correct Guesses:";
    questionsDiv.appendChild(summaryLabel)

    summaryLabel=createDiv("correctGuesses");
    summaryLabel.innerHTML=window.correctGuesses;
    questionsDiv.appendChild(summaryLabel)


    summaryLabel=createDiv("totalPayoffLabel");
    summaryLabel.innerHTML="My Total Payoff:";
    questionsDiv.appendChild(summaryLabel)

    summaryLabel=createDiv("totalPayoff");
    summaryLabel.innerHTML=window.myTotalPay;
    questionsDiv.appendChild(summaryLabel)


    summaryMyChoice=createDiv("summaryMyChoice");
    summaryMyChoice.className="summaryEntry";
    summaryMyChoice.style.left="50px";
    summaryMyChoiceLabel=createDiv("summaryMyChoiceLabel");
    summaryMyChoiceLabel.innerHTML="My Choice:";
    summaryMyChoiceLabel.className="summaryEntryLabel";
    summaryMyChoiceEntry=createDiv("summaryMyChoiceEntry");
    summaryMyChoiceEntry.innerHTML="?";
    summaryMyChoiceEntry.style.lineHeight="100px";
    summaryMyChoiceEntry.style.height="100px";
    summaryMyChoiceEntry.className="summaryEntryEntry";
    summaryMyChoice.appendChild(summaryMyChoiceLabel)
    summaryMyChoice.appendChild(summaryMyChoiceEntry)
    questionsDiv.appendChild(summaryMyChoice)


    summaryMyChoice=createDiv("summaryOtherChoice");
    summaryMyChoice.className="summaryEntry";
    summaryMyChoice.style.left="275px";

    summaryMyChoiceLabel=createDiv("summaryOthersChoiceLabel");
    summaryMyChoiceLabel.innerHTML="Other's Choice:";
    summaryMyChoiceLabel.className="summaryEntryLabel";
    summaryMyChoice.appendChild(summaryMyChoiceLabel)

    summaryMyChoiceEntry=createDiv("summaryOthersChoiceEntryGuess");
    summaryMyChoiceEntry.innerHTML="? (guess)";
    summaryMyChoiceEntry.className="summaryEntryEntry";
    summaryMyChoice.appendChild(summaryMyChoiceEntry)

    summaryMyChoiceEntry=createDiv("summaryOthersChoiceEntryActual");
    summaryMyChoiceEntry.style.top="100px";
    summaryMyChoiceEntry.innerHTML="? (actual)";
    summaryMyChoiceEntry.className="summaryEntryEntry";
    summaryMyChoice.appendChild(summaryMyChoiceEntry)

    questionsDiv.appendChild(summaryMyChoice)




    summaryMyChoice=createDiv("summaryPayoffs");
    summaryMyChoice.className="summaryEntry";
    summaryMyChoice.style.left="500px";

    summaryMyChoiceLabel=createDiv("summaryPayoffsLabel");
    summaryMyChoiceLabel.innerHTML="Payoffs:";
    summaryMyChoiceLabel.className="summaryEntryLabel";
    summaryMyChoice.appendChild(summaryMyChoiceLabel)

    summaryMyChoiceEntry=createDiv("summaryPayoffsEntryMine");
    summaryMyChoiceEntry.innerHTML="? (mine)";
    summaryMyChoiceEntry.className="summaryEntryEntry";
    summaryMyChoice.appendChild(summaryMyChoiceEntry)

    summaryMyChoiceEntry=createDiv("summaryPayoffsEntryOthers");
    summaryMyChoiceEntry.style.top="100px";
    summaryMyChoiceEntry.innerHTML="? (other's)";
    summaryMyChoiceEntry.className="summaryEntryEntry";
    summaryMyChoice.appendChild(summaryMyChoiceEntry)

    questionsDiv.appendChild(summaryMyChoice)


    $("#mainDiv").append(questionsDiv);
}


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Actions // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function selectColumn(col,send){
    summaryOthersChoiceEntryGuess=document.getElementById("summaryOthersChoiceEntryGuess");
    summaryOthersChoiceEntryGuess.innerHTML=window.colActions[col] +" (guess)";
    summaryOthersChoiceEntryGuess.style.color=window.colColors[col];
    selectedColumn=createDiv("selectedColumnDiv");
    selectedColumn.className="selectedColumnDiv";
    selectedColumn.style.left=-80+200*col+"px";
    selectedColumn.style.color=window.colColors[col];
    selectedColumn.style.borderColor=window.colColors[col];

    selectedColumnLabel=createDiv("selectedColumnLabel");
    selectedColumnLabel.className="selectedColumnLabel";
    selectedColumnLabel.innerHTML="My Guess";
    selectedColumn.appendChild(selectedColumnLabel);

    selectedColumn.style.height=(200*window.numberOfRows+150)+"px";
    selectedColumnLabel.style.top=(200*window.numberOfRows+100)+"px";

    $("#gameDiv").append(selectedColumn);
    if(send==1){
        var message={"type":"makeChoice","col":col};
        sendMessage(message);
    }
    for(col=1;col<=window.numberOfCols;col++){
        document.getElementById("gameTableColLabel_"+col).className="gameTableItem gameTableColLabel";
        document.getElementById("gameTableColLabel_"+col).removeEventListener("click",window.partials["selectCol"+col]);
    }

}

function selectRow(row,send){
    summaryOthersChoiceEntryGuess=document.getElementById("summaryMyChoiceEntry");
    summaryOthersChoiceEntryGuess.innerHTML=window.rowActions[row];
    summaryOthersChoiceEntryGuess.style.color=window.rowColors[row];
    selectedRow=createDiv("selectedRowDiv");
    selectedRow.style.color=window.rowColors[row];
    selectedRow.style.borderColor=window.rowColors[row];


    selectedRowLabel=createDiv("selectedRowLabel");
    selectedRowLabel.innerHTML="My Choice";
    selectedRow.appendChild(selectedRowLabel);

    window.numberOfCols=Object.keys(window.colActions).length;
    selectedRow.style.top=-55-100*window.numberOfCols+200*row+"px";
    selectedRow.style.left=window.numberOfCols*100+"px";

    selectedRow.style.height=(200*window.numberOfCols+150)+"px";
    selectedRowLabel.style.top=(200*window.numberOfCols+100)+"px";

    $("#gameDiv").append(selectedRow);
    document.getElementById("historyEntry_"+window.currentPeriod+"_1").innerHTML=window.rowActions[row];
    document.getElementById("historyEntry_"+window.currentPeriod+"_1").style.color=window.rowColors[row];
    if(send==1){
        var message={"type":"makeChoice","row":row};
        sendMessage(message);
    }
    for(row=1;row<=window.numberOfRows;row++){
        document.getElementById("gameTableRowLabel_"+row).className="gameTableItem gameTableRowLabel";
        document.getElementById("gameTableRowLabel_"+row).removeEventListener("click",window.partials["selectRow"+row]);
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Messages // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function updateStatus(msg){
    statusManager();
}

function finishPeriod(send){
    othersChoice=window.state['othersChoice'];
    myGuess=window.state['col'];
    myChoice=window.state['row'];

    if(othersChoice==window.state['col']){
        deleteDiv("selectedColumnDiv");
        deleteDiv("selectedColumnLabel");
        selectedColumn=createDiv("selectedColumnDivBoth");
        selectedColumn.style.color="rgba(255,255,0,1)";
        selectedColumn.style.borderColor="yellow";
    }
    else{
        selectedColumn=createDiv("selectedColumnDiv2");
        selectedColumn.style.color=window.colColors[othersChoice];
        selectedColumn.style.borderColor=window.colColors[othersChoice];
    }

    selectedColumn.className="selectedColumnDiv";
    selectedColumn.style.left=-80+200*othersChoice+"px";

    selectedColumnLabel=createDiv("selectedColumnLabel2");
    selectedColumnLabel.className="selectedColumnLabel";
    selectedColumnLabel.innerHTML="Other's Choice";
    selectedColumn.appendChild(selectedColumnLabel);

    selectedColumn.style.height=(200*window.numberOfRows+150)+"px";
    selectedColumnLabel.style.top=(200*window.numberOfRows+100)+"px";

    $("#gameDiv").append(selectedColumn);


    summaryOthersChoiceEntryGuess=document.getElementById("summaryOthersChoiceEntryActual");
    summaryOthersChoiceEntryGuess.innerHTML=window.colActions[othersChoice] +" (actual)";
    summaryOthersChoiceEntryGuess.style.color=window.colColors[othersChoice];


    document.getElementById("summaryPayoffsEntryMine").innerHTML=window.pays[myChoice][othersChoice][0]+" (mine)";
    document.getElementById("summaryPayoffsEntryMine").style.color=window.rowColors[myChoice];
    document.getElementById("summaryPayoffsEntryOthers").innerHTML=window.pays[myChoice][othersChoice][1]+" (other's)";
    document.getElementById("summaryPayoffsEntryOthers").style.color=window.colColors[othersChoice];

    document.getElementById("historyEntry_"+window.currentPeriod+"_2").innerHTML=window.colActions[othersChoice];
    document.getElementById("historyEntry_"+window.currentPeriod+"_3").innerHTML=window.pays[myChoice][othersChoice][0];
    document.getElementById("historyEntry_"+window.currentPeriod+"_4").innerHTML=window.pays[myChoice][othersChoice][1];
    document.getElementById("historyEntry_"+window.currentPeriod+"_2").style.color=window.colColors[othersChoice];
    document.getElementById("historyEntry_"+window.currentPeriod+"_3").style.color=window.rowColors[myChoice];
    document.getElementById("historyEntry_"+window.currentPeriod+"_4").style.color=window.colColors[othersChoice];

    document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).className="gameTableItem gameTableEntry active";
    document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).style.backgroundColor="rgba(220,255,220,1)";

    if(send==1){
        var pf = partial(function(){
            var message={"type":"nextPeriod"};
            sendMessage(message);
        });
        document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).addEventListener("click",pf);
        document.getElementById("statusBar").innerHTML="Click on the payoffs for this period (in green) in the game table to move to next period.";
    }
    if(send==2){
        var pf = partial(function(){
            var message={"type":"confirmMatchOver"};
            sendMessage(message);
        });
        document.getElementById("statusBar").addEventListener("click",pf);
        document.getElementById("statusBar").innerHTML="Match Over! Click here to continue.";
    }
    if(send==3){
        document.getElementById("statusBar").innerHTML="Match Over! Please wait for the other subjects to finish.";
    }
    if(send==4){
        document.getElementById("statusBar").innerHTML="Click on the payoffs for this period (in green) in the game table to move to next period.";
    }

    document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).style.zIndex="5";
    //drawHistory();
}

window.historyOfPlay=[]
window.currentPeriod=0;
window.correctGuesses=14;



// function nextPeriodMessage(){
//     window.currentPeriod=window.historyOfPlay.length+1;
//     clearAll();
//     drawGame();
//     drawHistory();
//     drawStatus();
//     drawPeriodSummary();
// }

function reconnecting(msg){
    console.log(window.state);
    statusManager();
}


function getNames(htmlIN){
    $("#mainDiv").append(htmlIN);
}

function setName(name){
    document.getElementById("currentNameSelected").innerHTML="Name: "+name;
    window.myName=name;
}

function setDesk(desk){
    document.getElementById("currentDeskSelected").innerHTML="Desk: "+desk;
    window.myDesk=desk;
}

function setConsent(constent){
    document.getElementById("currentConsent").innerHTML="Consent Form Signed and Dated: "+constent;
    window.myConsent=constent;
}



function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}

function submitNames(){
    // var confirmation=confirmAction("Are you sure you a??");
    // if(confirmation){
    //   var message={"type":"quizAnswer","answer":window.currentConstructor,"questionType":3};
    //   sock.send(JSON.stringify(message));
    // }
    if(window.myName==undefined || window.myDesk==undefined || window.myConsent==undefined){
        alert("You must fill out name, desk and constent. Please raise your hand if you have any questions.");
    }
    else{
        var message={"type":"submitName","name":window.myName,"desk":window.myDesk};
        sendMessage(message);
    }
}



function statusManager(){
  thisStatus=window.state;
  window.currentPeriod=thisStatus['period']+1;
  window.currentMatch=thisStatus['match'];
  window.correctGuesses=thisStatus['correctGuesses'];
  window.historyOfPlay=thisStatus['history'];
  window.myMatchPay=thisStatus['myMatchPay'];
  window.theirMatchPay=thisStatus['theirMatchPay'];
  window.myTotalPay=thisStatus['myTotalPay'];

  console.log(window.state);
  if(thisStatus[0]==-1){
    message="Loading...";
    genericScreen(message);
  }
  else if(thisStatus["page"]=="generic"){
    clearAll();
    genericScreen(thisStatus["message"]);
  }
  else if(thisStatus["page"]=="getName"){
    clearAll();
    getNames(thisStatus["html"]);
  }
  else if(thisStatus["page"]=="quiz"){//quiz
    console.log("ddraw quiz",window.state);
    //drawQuizMessage();
  }
  else if(thisStatus["page"]=="game"){//quiz
    clearAll();
    drawGame();
    drawHistory();
    drawStatus();
    drawPeriodSummary();
    if(thisStatus["page"]=="noChoices"){
        "do nothings";
    }
    else if(thisStatus["stage"]=="rowSelected"){
        selectRow(thisStatus['row'],0);
    }
    else if(thisStatus["stage"]=="colSelected"){
        partial(selectColumn,thisStatus['col'],0)();
    }
    else if(thisStatus["stage"]=="bothSelected"){
        partial(selectRow,thisStatus['row'],0)();
        partial(selectColumn,thisStatus['col'],0)();
        document.getElementById("statusBar").innerHTML="Please wait for the other subject to finish making their choices.";
    }
    else if(thisStatus["stage"]=="periodSummary"){
        partial(selectRow,thisStatus['row'],0)();
        partial(selectColumn,thisStatus['col'],0)();
        finishPeriod(1);
    }
    else if(thisStatus["stage"]=="matchOver"){
        partial(selectRow,thisStatus['row'],0)();
        partial(selectColumn,thisStatus['col'],0)();
        finishPeriod(2);
    }
    else if(thisStatus["stage"]=="matchOverConfirmed"){
        partial(selectRow,thisStatus['row'],0)();
        partial(selectColumn,thisStatus['col'],0)();
        finishPeriod(3);
    }
    else if(thisStatus["stage"]=="experimentSummary"){
        partial(selectRow,thisStatus['row'],0)();
        partial(selectColumn,thisStatus['col'],0)();
        finishPeriod(0);
        document.getElementById("statusBar").innerHTML=thisStatus["summary"];
    }
  }
    else if(thisStatus["page"]=="questionnaire"){
        console.log("sdfsdf");
        pay=thisStatus["payment"];
        sid=thisStatus["subjectID"];
        showQuestionnaire(sid,pay);
    }
}




