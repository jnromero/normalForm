from __future__ import print_function
import random
from twisted.internet import reactor
from twisted.internet import task

class experimentClass():
   def __init__(self):
      self.setParameters()
      self.data['matchType']="regular"
      self.monitorTaskList=['loadInstructions','startQuiz','startExperiment']

   # - store data in self.data[subjectID] which is a Subject object (defined below)
   # - send messages like self.messageToId(msg,sid)
   # - list of all subjects at self.data['subjectIDs']

   def setParameters(self):
      print("!!!!!!SET PARAMETERS!!!!!!!!")

      self.data['francsPerDollar']=20
      self.data['exchangeRate']=float(1)/self.data['francsPerDollar']#dollars per point.  So 0.05 if 5 cents per point.
      
      self.data['rowColors']={1:"rgba(228,26,28,1)",2:"rgba(55,126,184,1)",3:"rgba(77,175,74,1)"}
      self.data['colColors']={1:"rgba(152,78,163,1)",2:"rgba(255,127,0,1)",3:"rgba(200,200,51,1)"}

      self.data['rowActions']={1:"U",2:"D"}
      self.data['colActions']={1:"L",2:"R"}

      self.data['numberOfRows']=len(self.data['rowActions'])
      self.data['numberOfCols']=len(self.data['colActions'])

      self.data['groupSize']=2

      self.data['totalMatches']=2
      self.data['supergameLengths']={0:86,1:122,2:80,3:67,4:142} 
      self.data['supergameLengths']={0:2,1:2,2:3,3:3,4:3} 

      self.data['rawPays']={}
      self.data['rawPays'][0]={1:{1:[20,0],2:[-1,-1]},2:{1:[-1,-1],2:[0,10]}}
      self.data['rawPays'][1]={1:{1:[20,0],2:[-1,-1]},2:{1:[-1,-1],2:[0,10]}}
      self.data['rawPays'][2]={1:{1:[20,0],2:[-1,-1]},2:{1:[-1,-1],2:[0,10]}}
      self.data['rawPays'][3]={1:{1:[20,0],2:[-1,-1]},2:{1:[-1,-1],2:[0,10]}}
      self.data['rawPays'][4]={1:{1:[20,0],2:[-1,-1]},2:{1:[-1,-1],2:[0,10]}}

   def setMatchings(self):
      totalSubjects=len(self.data['subjectIDs'])
      if totalSubjects%2!=0:
         print("NEED MULTIPLE OF 2, CAN'T STOP ACCEPTING")
         self.data['serverStatus']['acceptingClients']=1
         self.monitorMessage()
      else:
         thisMatchSubjects=self.data['subjectIDs'][:]
         groups=[]
         for groupNumber in range(totalSubjects/2):
            groups.append(thisMatchSubjects[groupNumber*2:groupNumber*2+2])

         self.data['pays']={}
         self.data['order']={}
         self.data['matching']={}
         self.data['roles']={}

         for match in range(self.data['totalMatches']):
            random.shuffle(thisMatchSubjects)
            self.data['pays'][match]={}
            self.data['matching'][match]={}
            self.data['order'][match]={}
            self.data['roles'][match]={}
            for groupNumber in range(totalSubjects/2):
               player1=thisMatchSubjects[2*groupNumber+0]
               player2=thisMatchSubjects[2*groupNumber+1]
               thesePays=self.data['rawPays'][match]
               thesePays,thisOrder=self.rawPayoffsSwitchActions(thesePays,0)
               self.data['order'][match][player1]=thisOrder
               thesePays,thisOrder=self.rawPayoffsSwitchActions(thesePays,1)
               self.data['order'][match][player2]=thisOrder

               self.data['pays'][match][player1]=self.rawPayoffsToRolePayoffs(thesePays,0)
               self.data['pays'][match][player2]=self.rawPayoffsToRolePayoffs(thesePays,1)
               self.data['matching'][match][player1]=[player2]
               self.data['matching'][match][player2]=[player1]
               self.data['roles'][match][player1]=0
               self.data['roles'][match][player2]=1
      print("matching set!!!!!!!")



   def rawPayoffsSwitchActions(self,pays,player):
      #this function switched the names of actions for a given player
      player1Actions=[x for x in pays]
      player2Actions=[x for x in pays[player1Actions[0]]]
      if player==0:
         newPays={}
         random.shuffle(player1Actions)
         for o,n in zip(range(len(player1Actions)),player1Actions):
            newPays[n]={}
            for a2 in player2Actions:
               newPays[n][a2]=pays[o+1][a2]
         actionsOut=player1Actions
      elif player==1:
         newPays={}
         random.shuffle(player2Actions)
         for a1 in player1Actions:
            newPays[a1]={}
            for o,n in zip(range(len(player2Actions)),player2Actions):
               newPays[a1][o+1]=pays[a1][n]
         actionsOut=player2Actions
      return newPays,actionsOut



   def rawPayoffsToRolePayoffs(self,pays,role):
      #this ensures that players have correct payoffs when they have separate roles
      if role==0:
         paysOut=pays
      elif role==1:
         newPays={}
         for c1 in pays:
            for c2 in pays[c1]:
               this=pays[c1][c2]
               if c2 not in newPays:
                  newPays[c2]={}
               newPays[c2][c1]=[this[1],this[0]]
         paysOut=newPays
      return paysOut

   
   def reconnectingClient(self,client):
      sid=client.subjectID
      if self.data['serverStatus']['page']=="experiment":#experimetn has started
         self.sendParameters(sid)
         self.data[sid].getStatus()
      self.updateStatus(sid)



   def displayFinalSummary(self,subjectID):
      if 'paymentSummary' not in self.data[subjectID].status:
         self.data[subjectID].status['paymentSummary']="Please wait for other subjects to finish."
      if "doneWithEverything" in self.data[subjectID].status:
         self.data[subjectID].status['page']="generic"
         self.data[subjectID].status['message']="subjectID: %s <br>"%(subjectID)+self.data[subjectID].status['paymentSummary']
         self.updateStatus(subjectID)



   def startExperiment(self,message,client):
      self.experimentSpecificMonitorTableEntries()
      self.data['serverStatus']['page']="experiment"      
      self.taskDone(message)
      self.data['currentMatch']=-1
      self.startMatch()
      print("Starting Experiment!")


   def startMatch(self):
      self.data['currentMatch']+=1
      for sid in self.data['subjectIDs']:
         self.data[sid].newMatch(self.data['currentMatch'])
         self.sendParameters(sid)
         self.data[sid].getStatus()
         self.updateStatus(sid)

   def checkIfGroupFinished(self,sid):
      #allMembers including myself
      allMembers=self.data['matching'][self.data['currentMatch']][sid]+[sid]
      complete=True
      if self.data['matching'][self.data['currentMatch']][sid]==["randomPlayer"]:
         if self.data[sid].status["stage"]=="bothSelected":
            complete=True
         else:
            complete=False
      else:
         for s in allMembers:
            if self.data[s].status["stage"]!="bothSelected":
               complete=False
               break
      return complete

   def confirmMatchOver(self,message,client):
      sid=client.subjectID
      self.data[sid].status['stage']="matchOverConfirmed"
      self.data[sid].getStatus()
      print(self.data[sid].status)
      self.updateStatus(sid)
      self.checkIfMatchFinished()


   def calculateFinalPayoffs(self,subjectID):
      #must determine how final payoffs will be calculated here
      self.data[subjectID].finalPayoffs['game']=5#francs
      # self.data[subjectID].finalPayoffs['bonus']=5#dollars

      self.data[subjectID].finalPayoffs['total']=self.data[subjectID].finalPayoffs['showup']#dollars
      self.data[subjectID].finalPayoffs['total']+=self.data[subjectID].finalPayoffs['bonus']#dollars
      self.data[subjectID].finalPayoffs['total']+=self.data[subjectID].finalPayoffs['game']*self.data['exchangeRate']

      self.data[subjectID].status['payment']="%.02f"%(self.data[subjectID].finalPayoffs['total'])

      self.data[subjectID].status['page']="generic"

      self.data[subjectID].status['message']="subjectID: %s <br>"%(subjectID)
      self.data[subjectID].status['message']="Show Up Fee: $5 <br>"
      self.data[subjectID].status['message']+="Bonus Payment: $%s <br>"%(self.data[subjectID].finalPayoffs['bonus'])
      self.data[subjectID].status['message']+="Game Earnings: %s francs <br>"%(self.data[subjectID].finalPayoffs['game'])
      self.data[subjectID].status['message']+="Total Payoff = $%.02f"%(self.data[subjectID].finalPayoffs['total'])

      self.updateStatus(subjectID)
      self.finalPayoffsSpecificMonitorTableEntries()
      self.monitorMessage()

   def checkIfMatchFinished(self):
      complete=True
      for sid in self.data['subjectIDs']:
         if self.data[sid].status['stage']!="matchOverConfirmed":
            complete=False
            break
      if complete:
         if self.data['currentMatch']+1<self.data['totalMatches']:
            self.startMatch()
         else:
            self.getBonusPayment()
            for sid in self.data['subjectIDs']:
               self.calculateFinalPayoffs(sid)
         self.monitorMessage()
   def getBonusPayment(self):
      cgs=[]
      for sid in self.data['subjectIDs']:
         cgs.append(self.data[sid].correctGuesses)
      probs=[float(x)/sum(cgs) for x in cgs]
      draw=random.random()
      total=0
      winner=-1
      for k in probs:
         winner=winner+1
         total=total+k
         if draw<total:
            break

      winner=self.data['subjectIDs'][winner]
      self.data[winner].finalPayoffs['bonus']+=5


   def nextPeriod(self,message,client,update="True"):
      sid=client.subjectID
      self.data[sid].currentPeriod+=1
      #update pays with delta, then add to status
      self.data[sid].status={"page":"game","stage":"makingChoices","rowSelected":"No","colSelected":"No"}
      self.data[sid].getStatus()
      if update=="True":
         self.updateStatus(sid)
      self.monitorMessage()

   def updateStatusFromClient(self,message,client):
      sid=client.subjectID
      self.data[sid].status=message['status']
      self.updateStatus(sid)

         
   def periodSummary(self,sid):
      allMembers=self.data['matching'][self.data['currentMatch']][sid]+[sid]
      if self.data['matching'][self.data['currentMatch']][sid]==["randomPlayer"]:
         s=sid
         partner="randomPlayer"
         myChoice=self.data[s].choices[self.data['currentMatch']][self.data[s].currentPeriod]
         myGuess=self.data[s].guesses[self.data['currentMatch']][self.data[s].currentPeriod]
         theirChoice=random.choice([2,1])
         if myGuess==theirChoice:
            self.data[s].correctGuesses+=1
         theseChoices=[myChoice,theirChoice]
         self.data[s].history[self.data['currentMatch']].append(theseChoices)
         self.data[s].status['stage']='periodSummary'

         if self.data[sid].currentPeriod+1==self.data['supergameLengths'][self.data['currentMatch']]:
            self.data[s].status['stage']='matchOver'

         self.data[s].status['othersChoice']=theirChoice
         ourPay=self.data['pays'][self.data['currentMatch']][s][myChoice][theirChoice]
         myPay=ourPay[0]
         theirPay=ourPay[1]
         self.data[s].payoffHistory[self.data['currentMatch']].append([myPay,theirPay])

         self.data[s].myMatchPayoffs[self.data['currentMatch']]=self.data[s].myMatchPayoffs[self.data['currentMatch']]+myPay
         self.data[s].opponentMatchPayoffs[self.data['currentMatch']]=self.data[s].opponentMatchPayoffs[self.data['currentMatch']]+theirPay
         self.data[s].totalPayoffs=self.data[s].totalPayoffs+myPay
         self.data[s].payoffVector.append(myPay)


         self.data[s].getStatus()
         self.updateStatus(s)


      else:
         for s in allMembers:
            partner=self.data['matching'][self.data['currentMatch']][s][0]
            myChoice=self.data[s].choices[self.data['currentMatch']][self.data[s].currentPeriod]
            myGuess=self.data[s].guesses[self.data['currentMatch']][self.data[s].currentPeriod]
            theirChoice=self.data[partner].choices[self.data['currentMatch']][self.data[partner].currentPeriod]
            if myGuess==theirChoice:
               self.data[s].correctGuesses+=1
            theseChoices=[myChoice,theirChoice]
            self.data[s].history[self.data['currentMatch']].append(theseChoices)
            self.data[s].status['stage']='periodSummary'

            if self.data[sid].currentPeriod+1==self.data['supergameLengths'][self.data['currentMatch']]:
               self.data[s].status['stage']='matchOver'

            self.data[s].status['othersChoice']=self.data[partner].choices[self.data['currentMatch']][self.data[partner].currentPeriod]

            ourPay=self.data['pays'][self.data['currentMatch']][s][myChoice][theirChoice]
            myPay=ourPay[0]
            theirPay=ourPay[1]
            self.data[s].payoffHistory[self.data['currentMatch']].append([myPay,theirPay])

            self.data[s].myMatchPayoffs[self.data['currentMatch']]=self.data[s].myMatchPayoffs[self.data['currentMatch']]+myPay
            self.data[s].opponentMatchPayoffs[self.data['currentMatch']]=self.data[s].opponentMatchPayoffs[self.data['currentMatch']]+theirPay
            self.data[s].totalPayoffs=self.data[s].totalPayoffs+myPay
            self.data[s].payoffVector.append(myPay)


            self.data[s].getStatus()
            self.updateStatus(s)
      self.monitorMessage()

   def makeChoice(self,message,client):
      sid=client.subjectID
      thisChoice=int(message['value'])
      selectionType=message['selectionType']
      self.data[sid].status[selectionType+"Selected"]=thisChoice

      if message['selectionType']=="row":
         self.data[sid].choices[self.data['currentMatch']][self.data[sid].currentPeriod]=thisChoice
         thisOrder=self.data['order'][self.data['currentMatch']][sid]
         choiceFromRawGame=thisOrder[thisChoice-1]
         self.data[sid].choicesFromRawPaysGame[self.data['currentMatch']][self.data[sid].currentPeriod]=choiceFromRawGame
      elif message['selectionType']=="col":
         self.data[sid].status["col"]=thisChoice
         self.data[sid].guesses[self.data['currentMatch']][self.data[sid].currentPeriod]=thisChoice

      if self.data[sid].status['colSelected']!="No" and self.data[sid].status['rowSelected']!="No":
         self.data[sid].status['stage']="bothSelected"
      #check to see if we are done:
      if self.checkIfGroupFinished(sid):
         self.periodSummary(sid)
      else:
         self.updateStatus(sid)
      self.monitorMessage() 


   def experimentSpecificMonitorTableEntries(self):
      self.data['monitorTableInfo']=[
      ['Status'         ,'self.data[sid].status["page"]'],
      ['Match'          ,'self.data["currentMatch"]'],
      ['Period'         ,'self.data[sid].currentPeriod'],
      ['Row'            ,'self.data[sid].status["rowSelected"]'],
      ['Col'            ,'self.data[sid].status["colSelected"]'],
      ['MatchPay'       ,'self.data[sid].myMatchPayoffs[self.data["currentMatch"]]'],
      ['Pay t-3'        ,'self.data[sid].payoffHistory[self.data["currentMatch"]][-3]'],
      ['Pay t-2'        ,'self.data[sid].payoffHistory[self.data["currentMatch"]][-2]'],
      ['Pay t-1'        ,'self.data[sid].payoffHistory[self.data["currentMatch"]][-1]'],
      ]
      self.updateMonitorTableEntries()


   def finalPayoffsSpecificMonitorTableEntries(self):
      self.data['monitorTableInfo']=[
      ['Status'         ,'self.data[sid].status["page"]'],
      ['Game'           ,'self.data[sid].finalPayoffs["game"]'],
      ['Bonus'          ,'self.data[sid].finalPayoffs["bonus"]'],
      ['Raven'          ,'self.data[sid].finalPayoffs["ravensPayoff"]'],
      ['SPMine'         ,'self.data[sid].finalPayoffs["socialPreferenceMine"]'],
      ['SPTheirs'       ,'self.data[sid].finalPayoffs["socialPreferenceTheirs"]'],
      ['Total'          ,'self.data[sid].finalPayoffs["total"]'],
      ]  
      self.updateMonitorTableEntries()


   def sendParameters(self,sid):
      msg={x:self.data[x] for x in ['exchangeRate','rowColors','colColors','pays','rowActions','colActions','numberOfCols','numberOfRows']}
      msg['pays']=self.data['pays'][self.data['currentMatch']][sid]#corrected for role already
      msg['type']="parameters"
      self.messageToId(msg,sid)


   def experimentDemo(self,sid,viewType):
      self.data['matchType']="regularDemo"
      msg={}
      msg['type']='startExperiment'
      msg['title']='Start Experiment'
      msg['status']=''
      msg['index']=0


      if 'pays' not in self.data:
         self.data['pays']={}
         self.data['matching']={}
         self.data['supergameLengths']={}
         self.data['order']={}
         self.data['roles']={}
         for match in range(10):
            self.data['pays'][match]={}
            self.data['matching'][match]={}
            self.data['order'][match]={}
            self.data['roles'][match]={}
            self.data['order'][match]["randomPlayer"]=["U","D"]
            self.data['roles'][match]["randomPlayer"]=1
            self.data['supergameLengths'][match]=30

      for match in range(10):
         self.data['pays'][match][sid]={1:{1:[30,30],2:[10,40]},2:{1:[40,10],2:[20,20]}}
         self.data['matching'][match][sid]=["randomPlayer"]
         # self.data['matching'][match]["randomPlayer"]=[sid]
         self.data['order'][match][sid]=["U","D"]
         self.data['roles'][match][sid]=0

      self.data['currentMatch']=1
      self.data[sid].newMatch(1)
      self.sendParameters(sid)
      self.data[sid].getStatus()
      self.updateStatus(sid)

class subjectClass():
   def __init__(self):
      self.choices={}
      self.choicesFromRawPaysGame={}
      self.guesses={}
      self.history={}
      self.payoffHistory={}
      self.correctGuesses=0
      self.myMatchPayoffs={}
      self.opponentMatchPayoffs={}
      self.totalPayoffs=0#Me,You
      self.payoffVector=[]#list of period payoffs to make it easy to determine payoff for block of 30 periods.
      self.quizEarnings=0
      self.quizAnswers=[]

      #for Final Payoff Calculations
      self.finalPayoffs={}
      self.finalPayoffs['showup']=5#dollars
      self.finalPayoffs['game']=0#francs
      self.finalPayoffs['bonus']=0#dollars
      self.finalPayoffs['total']=0
      self.status={"page":"generic","message":["Please read, sign, and date your consent form. <br> You may read over the instructions as we wait to begin."]}

   def newMatch(self,match):
      self.currentPeriod=0
      self.currentMatch=match
      self.choices[self.currentMatch]={}
      self.choicesFromRawPaysGame[self.currentMatch]={}
      self.guesses[self.currentMatch]={}
      self.history[self.currentMatch]=[]
      self.payoffHistory[self.currentMatch]=[]
      self.myMatchPayoffs[self.currentMatch]=0
      self.opponentMatchPayoffs[self.currentMatch]=0
      self.status={"page":"game","stage":"makingChoices","rowSelected":"No","colSelected":"No"}

   def getStatus(self):
      self.status['period']=self.currentPeriod
      self.status['match']=self.currentMatch
      self.status['history']=self.history[self.currentMatch]
      self.status['correctGuesses']=self.correctGuesses
      print(self.correctGuesses)
      self.status['myMatchPay']=self.myMatchPayoffs[self.currentMatch]
      self.status['theirMatchPay']=self.opponentMatchPayoffs[self.currentMatch]
      self.status['myTotalPay']=self.totalPayoffs

