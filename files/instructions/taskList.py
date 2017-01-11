import pickle

def addToDict(baseDict,dictToAdd):
	for x in dictToAdd:
		baseDict[x]=dictToAdd[x]
	return baseDict

def makeSlideAutomatic(slideInfo):
	taskListOut=[]
	baseColor=slideInfo[0]
	backgroundColor="rgba(%s,%s,%s,.1)"%tuple(baseColor)
	titleColor="rgba(%s,%s,%s,1)"%tuple([int(float(x)/2) for x in baseColor])
	taskListOut.append({"func":"runJavascriptFunction","args":{"functionName":"clearAllInstructions"}})	
	taskListOut.append({"func":"changeBackgroundColor","args":{"color":backgroundColor}})
	#title
	titleDict={"text":slideInfo[1][0],"divID":"instructionsSlideTitle","top":50,"color":titleColor,"fontSize":400,"fadeTime":1}
	if len(slideInfo[1])>1:
		titleDict=addToDict(titleDict,slideInfo[1][1])
	taskListOut.append(getPlaceText(**titleDict))

	totalEntries=len(slideInfo)-2
	if totalEntries==4:
		entryTops=[200,350,500,650]
	elif totalEntries==5:
		entryTops=[200,325,450,525,650]
	elif totalEntries==6:
		entryTops=[175,275,375,475,575,675]
	elif totalEntries==7:
		entryTops=[150,250,350,450,550,650,750]

	for k in range(1,len(slideInfo)-1):
		entryDict={"text":slideInfo[k+1][0],"divID":"instructionsSlideEntry%s"%(k),"top":entryTops[k-1]}
		if len(slideInfo[k+1])>1:
			entryDict=addToDict(entryDict,slideInfo[k+1][1])
		taskListOut.append(getPlaceText(**entryDict))
	return taskListOut

def getPlaceText(text,divID,top,left=0,color="rgba(0,0,0,1)",fontSize=300,fadeTime=2,textAlign="center"):
	argsDict={}
	argsDict['text']=text
	argsDict['divID']=divID
	argsDict['top']=top
	argsDict['left']=left
	argsDict['color']=color
	argsDict['fontSize']=fontSize
	argsDict['fadeTime']=fadeTime
	argsDict['textAlign']=textAlign
	return {"func":"placeText","args":argsDict}

def mouseSequence(sequence):
	this={"func":"mouseSequence","runOnRefresh":False,"args":{"sequence":sequence}}
	print(this)
	return this


tasks=[
#Intro Slide
{"func":"changeBackgroundColor","args":{
	"color":"rgba(0,0,255,.1)"}},
{"func":"placeText","args":{
	"text":"Welcome To",
	"top":150,
	"left":0,
	"color":"rgba(0,0,0,1)",
	"textAlign":"center",
	"divID":"automatic",
	"fontSize":300,
	"fadeTime":2,
	"textAlign":"center"}},
{"func":"placeText","args":{
	"text":"The Economic Science",
	"top":625,
	"left":0,
	"color":"rgba(0,0,0,1)",
	"textAlign":"center",
	"divID":"automatic2",
	"fontSize":300,
	"fadeTime":2,
	"textAlign":"center"}},
{"func":"placeText","args":{
	"text":"Laboratory",
	"top":700,
	"left":0,
	"color":"rgba(0,0,0,1)",
	"textAlign":"center",
	"divID":"automatic3",
	"fontSize":300,
	"fadeTime":2,
	"textAlign":"center"}},
{"func":"runJavascriptFunction","args":{
	"functionName":"drawLogoESL"}}]


#Welcome Slide
tasks+=makeSlideAutomatic([[0,255,0],["Welcome"],
	["Economics Experiment."],
	["Will get paid in cash at the end of the experiment."],
	["Please remain silent."],
	["Please raise your hand for help."]
	])

#Welcome Slide 2
tasks+=makeSlideAutomatic([[255,0,0],["Welcome"],
	["Do not talk, laugh or exclaim out loud."],
	["Keep your eyes on your screen only."],
	["Turn off cell phones, etc. and put them away."],
	["We appreciate your cooperation."]
	])


#Agenda
thisStyle={"textAlign":"left","left":200}
tasks+=makeSlideAutomatic([[0,0,255],["Agenda"],
	["1. Instructions",thisStyle],
	["2. Quiz",thisStyle],
	["3. Experiment",thisStyle],
	["4. Three Additional Tasks",thisStyle],
	["5. Survey",thisStyle],
	["6. Payment",thisStyle]
	])


#Experiment overview
tasks+=makeSlideAutomatic([[255,0,0],["Experiment Overview"],
	["Matched in pairs."],
	["Your choice affects your payoff."],
	["Your choice affects their payoff."],
	["Their choice affects your payoff."]
	])


#Experiment details
tasks+=makeSlideAutomatic([[0,255,0],["Experiment Details"],
	["Exchange Rate: 20 Francs = $1"],
	["5 Matches (may have different # of periods)"],
	["At beginning of each match, randomly matched with another subject"],
	["Your identity is anonymous"],
	["Matched with same subject for entire match"],
	["Randomly matched with another subject (anonymous)"]
	])

#Experimental Interface
tasks+=[
	{"func":"runJavascriptFunction","args":{"functionName":"clearAllInstructions"}},
	{"func":"setInstructionParameters","args":{}},
	{"func":"instructionsSetState","args":{}},
	{"func":"placeCursor","args":{"x":500,"y":500}},
]

#Game Table
tasks+=[
	{"func":"runJavascriptFunction","args":{"functionName":"toggleOverlay"}},
	{"func":"highlightDiv","args":{"divName":"gameDiv"}},
	mouseSequence([["toDiv",{"divName":"gameDiv"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableRowLabel_1"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableRowLabel_2"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableColLabel_1"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableColLabel_2"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableRowLabel_2"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableColLabel_1"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableEntryPay1_2_1"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableEntryPay2_2_1"}]]),
	{"func":"unHighlightDiv","args":{"divName":"gameDiv"}}
]


#Show Payoff Summary
tasks+=[
	{"func":"highlightDiv","args":{"divName":"questionsDiv"}},
	mouseSequence([["toDiv",{"divName":"periodSummaryLabel"}]]),
	mouseSequence([["toDiv",{"divName":"summaryLabel"}]]),
	{"func":"unHighlightDiv","args":{"divName":"questionsDiv"}}
]



#Show History
tasks+=[
	{"func":"highlightDiv","args":{"divName":"historyDiv"}},
	{"func":"highlightDiv","args":{"divName":"historyLabels"}},
	mouseSequence([["toDiv",{"divName":"historyLabels"}]]),
	{"func":"unHighlightDiv","args":{"divName":"historyDiv"}},
	{"func":"unHighlightDiv","args":{"divName":"historyLabels"}},
]


#Show StatusBar:status#1
tasks+=[
	{"func":"highlightDiv","args":{"divName":"statusBar"}},
	mouseSequence([["toDiv",{"divName":"statusBar"}]]),
	{"func":"unHighlightDiv","args":{"divName":"statusBar"}},
	{"func":"runJavascriptFunction","args":{"functionName":"toggleOverlay"}},
]

# //Make Row choice
tasks+=[
	mouseSequence([["toDiv",{"divName":"gameTableRowLabel_1"}],["clickDiv",{"divName":"gameTableRowLabel_1","func":"instructionsSelectRow","args":{"row":1}}]]),
	mouseSequence([["toDiv",{"divName":"summaryMyChoiceEntry"}]]),
]

# //Make Col choice
tasks+=[
	mouseSequence([["toDiv",{"divName":"gameTableColLabel_2"}],["clickDiv",{"divName":"gameTableColLabel_2","func":"instructionsSelectCol","args":{"col":2}}]]),
	mouseSequence([["toDiv",{"divName":"summaryOthersChoiceEntryGuess"}]]),
]

# //Status #2
tasks+=[
	mouseSequence([["toDiv",{"divName":"statusBar"}]]),
]
# //Status #3
tasks+=[
	{"func":"instructionsFinishPeriod","args":{}},
	mouseSequence([["toDiv",{"divName":"selectedColumnDiv2","anchor":"south"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableEntry_1_1"}]]),
	mouseSequence([["toDiv",{"divName":"summaryOthersChoiceEntryActual"}]]),
	mouseSequence([["toDiv",{"divName":"summaryPayoffs"}]]),
	mouseSequence([["toDiv",{"divName":"historyEntry_20_0"}]]),
	mouseSequence([["toDiv",{"divName":"summaryLabel"}]]),
	mouseSequence([["toDiv",{"divName":"totalPayoffMineLabel"}]]),
	mouseSequence([["toDiv",{"divName":"correctGuessesLabel"}]]),
	mouseSequence([["toDiv",{"divName":"gameTableEntry_1_1"}]]),
	mouseSequence([["clickDiv",{"divName":"gameTableEntry_1_1","func":"instructionsMovetoNextPeriod","args":{}}]]),
]

#Number of Periods Per Match
tasks+=makeSlideAutomatic([[0,255,0],["Number of Periods Per Match"],
	["Each Period 1 Number drawn from set"],
	["{1,2,3,...,98,99,100} (and replaced)."],
	["If Number is 1 - The match ends."],
	["If Number is not 1 - There match will continue."],
	["Expected number of periods is 100 (but may be different)."],
	["This procedure has been performed on the computer,"],
	["before the experiment."]
	])


#Payoffs
thisStyle={"textAlign":"left","left":200}
thisStyle2={"textAlign":"left","left":250}

tasks+=makeSlideAutomatic([[255,0,0],["Payoffs"],
	["Your payment will contain the following:",thisStyle],
	["1. $5 Show up fee.",thisStyle2],
	["2. Payment from randomly selected block of 30 periods.",thisStyle2],
	["3. Bonus payment for raffle tickets.",thisStyle2],
	["4. Payment for Three Additional Tasks.",thisStyle2],
	["Francs converted to dollars at the end.",thisStyle],
	["Paid in cash, in private.",thisStyle]
	])

#Random Block of 30 Periods
tasks+=makeSlideAutomatic([[0,0,255],["Random Block of 30 Periods"],
	["Randomly select 1 period."],
	["Block contains that period, and following 29."],
	["Block can span multiple matches."],
	["If period is at end, then block loops to 1st period."],
	["Each period equally likely to be paid."],
	["Random period pre-selected, written on board."]
	])

#Random Block of 30 Periods: Examples
tasks+=makeSlideAutomatic([[255,0,0],["Random Block of 30 Periods: Examples"],
	["Randomly selected period: Match #4 Period #14,",{"top":200,"textAlign":"left","left":200}],
	["Block: Match #4 P14-P43.",{"top":300,"textAlign":"left","left":200}],
	["Randomly selected period: Match #2 Period #91,",{"top":450,"textAlign":"left","left":200}],
	["Block: Match #2 P91-P100 and Match #3 P1-P20.",{"top":550,"textAlign":"left","left":200}],
	["Randomly selected period: Match #5 Period #81,",{"top":700,"textAlign":"left","left":200}],
	["Block: Match #5 P81-P85 and Match #1 P1-P25.",{"top":800,"textAlign":"left","left":200}]
	])


filename='generatedFiles/tasks2.pickle'
file = open(filename,'wb')
pickle.dump(tasks,file)
file.close() 


