import sys
import time
import json
import random
import math
import functions
from operator import itemgetter
import os
from twisted.internet import reactor
from twisted.internet import task
import pickle


class fakeClient():
   def __init__(self,sid):
      self.peer="1.1.1.1"
      self.subjectID=sid


class experimentClass():
   def __init__(self,config):
      "do init stuff"
      self.config=config
      self.currentExperimentPath=self.config['webServerRoot']+self.config['currentExperiment']
      self.setParameters()
      self.data['matchType']="regular"

   # - store data in self.data[subjectID] which is a Subject object (defined below)
   # - send messages like self.customMessage(subjectID,msg)
   # - list of all subjects at self.data['subjectIDs']

   def setParameters(self):
      print "!!!!!!SET PARAMETERS!!!!!!!!"
      filename=self.currentExperimentPath+'/parameters/files/20160502-02-matching.pickle'
      # print filename
      #filename=self.currentExperimentPath+'/parameters/matchingData.pickle'
      print filename
      file = open(filename,'rb')
      self.data['matchingData']=pickle.load(file)
      file.close() 
      #self.data['matchingData'][totalSubjects][subject][match]['game']
      #game
      #group
      #self.data['matchingData']['supergameLengths']
      #game=self.data['matchingData'][totalSubjects][subject][match]['game']
      #self.data['matchingData']['games'][game]

      self.data['doneWithQuiz']=[]
      self.data['instructionsRunning']=0
      self.data['experimentRunning']=0
      self.data['quizRunning']=0
      self.data['exchangeRate']=float(1)/1000#dollars per point.  So 0.05 if 5 cents per point.
      self.data['groupSize']=2
      self.data['totalMatches']=4

      self.data['supergameLengths']={}
      self.data['supergameLengths'][0]=2
      self.data['supergameLengths'][1]=2
      self.data['supergameLengths'][2]=2
      self.data['supergameLengths'][3]=2

      self.data['rowColors']={1:"rgba(228,26,28,1)",2:"rgba(55,126,184,1)",3:"rgba(77,175,74,1)"}
      self.data['colColors']={1:"rgba(152,78,163,1)",2:"rgba(255,127,0,1)",3:"rgba(200,200,51,1)"}
      


      # self.data['rawPays']={
      #    1:{1:[27,30],2:[25,25],3:[25,10]},
      #    2:{1:[25,25],2:[20,20],3:[25,10]},
      #    3:{1:[10,25],2:[10,25],3:[10,10]}
      # }

      # self.data['rowActions']={1:"U",2:"M",3:"D"}
      # self.data['colActions']={1:"L",2:"C",3:"R"}


      # self.data['rawPays']={
      #    1:{1:[10,20],2:[0,0]},
      #    2:{1:[0,0],2:[30,10]}
      # }

      # self.data['rawPays']={
      #    1:{1:[1,8],2:[2,7]},
      #    2:{1:[3,6],2:[4,5]}
      # }


      self.data['rowActions']={1:"U",2:"D"}
      self.data['colActions']={1:"L",2:"R"}

      self.data['numberOfRows']=len(self.data['rowActions'])
      self.data['numberOfCols']=len(self.data['colActions'])

      #self.getRolePayoffs()




   def setMatchings(self):
      #self.data['matchingData'][totalSubjects][subject][match]['game']
      #game
      #group
      #self.data['matchingData']['supergameLengths']
      #game=self.data['matchingData'][totalSubjects][subject][match]['game']
      #self.data['matchingData']['games'][game]


      totalSubjects=len(self.data['subjectIDs'])
      if totalSubjects<8:
         print "NOT ENOUGH SUBJECTS"
      else:
         thisData=self.data['matchingData'][totalSubjects]
         newData={}
         for k in range(len(self.data['subjectIDs'])):
            sid=self.data['subjectIDs'][k]
            newData[sid]=thisData[k]



         self.data['pays']={}
         self.data['roles']={}
         self.data['matching']={}

         groups={}
         for sid in newData:
            for match in newData[sid]:
               if match not in self.data['pays']:
                  self.data['pays'][match]={}
               if match not in self.data['roles']:
                  self.data['roles'][match]={}
               thisGroup=newData[sid][match]['groups']
               thisGame=newData[sid][match]['game']
               thisRole=int(newData[sid][match]['roles'])
               rawPays=self.data['matchingData']['games'][thisGame]
               self.data['roles'][match][sid]=thisRole
               if thisRole==0:
                  self.data['pays'][match][sid]=rawPays
               elif thisRole==1:
                  self.data['pays'][match][sid]=self.otherPlayersPayoffs(rawPays)

               if match not in groups:
                  groups[match]={}
               if thisGroup not in groups[match]:
                  groups[match][thisGroup]=[]
               groups[match][thisGroup].append(sid)

         for match in groups:
            self.data['matching'][match]={}
            for group in groups[match]:
               for sid in groups[match][group]:
                  allMembers=groups[match][group]
                  self.data['matching'][match][sid]=[x for x in allMembers if x!=sid]#allother memebers


         self.data['supergameLengths']=self.data['matchingData']['supergameLengths']
         # self.data['supergameLengths']={}
         # self.data['supergameLengths'][0]=2
         # self.data['supergameLengths'][1]=2
         # self.data['supergameLengths'][2]=2
         # self.data['supergameLengths'][2]=2
         print "matching set!!!!!!!"



   def getRolePayoffs(self):
      self.data['pays']={}
      self.data['pays'][0]=self.data['rawPays']
      newPays={}
      for c1 in self.data['rawPays']:
         for c2 in self.data['rawPays'][c1]:
            this=self.data['rawPays'][c1][c2]
            if c2 not in newPays:
               newPays[c2]={}
            newPays[c2][c1]=[this[1],this[0]]
      self.data['pays'][1]=newPays


   def otherPlayersPayoffs(self,pays):
      newPays={}
      for c1 in pays:
         for c2 in pays[c1]:
            this=pays[c1][c2]
            if c2 not in newPays:
               newPays[c2]={}
            newPays[c2][c1]=[this[1],this[0]]
      return newPays



   def sendParameters(self,sid):
      msg={x:self.data[x] for x in ['exchangeRate','rowColors','colColors','pays','rowActions','colActions','numberOfCols','numberOfRows']}
      msg['pays']=self.data['pays'][self.currentMatch][sid]#corrected for role already
      msg['type']="parameters"
      self.customMessage(sid,msg)
   
   def reconnectingClient(self,client):
      # msg={}
      # msg['type']='reconnecting'
      # self.data[client.subjectID].status={"page":"generic","message":["Please wait for experiment to start."]}
      # try:
      #    msg['prePlayTimeRemaining']=self.data['preStageLengths'][self.currentMatch]-(time.time()-self.prePlayStart)
      # except:
      #    "no more play!"
      # self.customMessage(client.subjectID,msg)
      sid=client.subjectID
      if self.data['experimentRunning']==1:#experimetn has started
         self.sendParameters(sid)
         self.getStatus(sid)
      self.updateStatus(sid)

      if self.data['instructionsRunning']==1:
         self.reconnectInstructions(client)
      if self.data['quizRunning']==1:
         self.reconnectQuiz(sid)


   def gotNames(self,message,client):
      self.taskDone(message)
      toDelete=[]
      for sid in self.data['subjectIDs']:
         print sid,self.data[sid].name
         if self.data[sid].name=="default":
            toDelete.append(sid)
      for sid in toDelete:
         print "deleting....",sid
         self.deleteSubject(sid)

   def getNames(self,message,client):
      self.taskDone(message)
      for sid in self.data['subjectIDs']:
         self.data[sid].status={"page":"getName"}
         filename=self.currentExperimentPath+'/files/names.txt'
         file = open(filename,'r')
         fileData=file.read()
         file.close() 
         thisHTML="<div id='nameSelect'>"
         for k in fileData.split("\n"):
            thisName=k.replace("'"," ")
            start=thisName.find(" ")
            thisName=thisName[start+1:]
            thisHTML=thisHTML+"""<button onclick="setName('%s')">%s</button>\n"""%(thisName,thisName)
         thisHTML=thisHTML+"""<button onclick="setName('Not On List')">Not On List</button></div>\n"""
         #thisHTML=thisHTML+"""<button onclick="submitNames()">Submit</button>\n</div>"""

         thisHTML=thisHTML+"<div id='deskSelect'>"
         for a in ["A","B","C","D","E"]:
            for n in range(1,9):
               thisHTML=thisHTML+"""<button onclick="setDesk('%s')">%s</button>\n"""%(a+str(n),a+str(n))
         thisHTML=thisHTML+"</div>"


         thisHTML=thisHTML+"""<button id="consentButton" onclick="setConsent('Yes')">Click here if you have filled out your consent form.</button>\n"""


         thisHTML=thisHTML+"<div id='nameSelectTitle'>Please click on your name and your desk, and to confirm that you have signed and dated your consent form.  <br> This information will not be kept, and will only be used to speed up the payment at the end of the experiment.</div>"
         thisHTML=thisHTML+"<div id='currentNameSelected'>Name: Not Selected</div>"
         thisHTML=thisHTML+"<div id='currentDeskSelected'>Desk: Not Selected</div>"
         thisHTML=thisHTML+"<div id='currentConsent'>Consent Form Signed and Date: Not Selected</div>"
         thisHTML=thisHTML+"""<button id="submitNameButton" onclick="submitNames()">Submit</button>\n</div>"""

         #thisHTML=thisHTML+"""<button onclick="setName('Not On List')">Not On List</button>\n"""
         #thisHTML=thisHTML+"""<button onclick="submitNames()">Submit</button>\n</div>"""
 
         # <ol id='names'>"
         # thisHTML=thisHTML+"<li>Click Your Name</li>"
         # for k in range(10):
         #    thisHTML=thisHTML+"<li><a href=''>%s</a></li>"%(k)
         # thisHTML=thisHTML+"</ol>"


         self.data[sid].status['html']=thisHTML
         self.updateStatus(sid)

   def submitName(self,message,client):
      sid=client.subjectID
      self.data[sid].name=message['name']
      self.data[sid].desk=message['desk']
      self.data[sid].status={"page":"generic","message":["Next, there will be video instructions.  <br> Everyone will see the exact same instructions.  <br> Please wait for instructions to start."]}
      self.updateStatus(sid)

   def startExperiment(self,message,client):
      self.data['experimentRunning']=1
      self.taskDone(message)
      #self.data['matching'],self.data['roles']=functions.makeMatches(self.data['subjectIDs'],self.data['groupSize'],self.data['totalMatches'])
      self.currentMatch=-1
      self.startMatch()
      print "Starting Experiment!"

   def startMatch(self):
      self.currentMatch=self.currentMatch+1
      self.currentPeriods={}
      for sid in self.data['subjectIDs']:
         self.data[sid].choices[self.currentMatch]={}
         self.data[sid].guesses[self.currentMatch]={}
         self.data[sid].history[self.currentMatch]=[]
         self.data[sid].correctGuesses[self.currentMatch]=0
         self.data[sid].myMatchPayoffs[self.currentMatch]=0
         self.data[sid].opponentMatchPayoffs[self.currentMatch]=0

         self.currentPeriods[sid]=0
         self.sendParameters(sid)
         self.data[sid].status={"page":"game","stage":"noChoices"}
         self.getStatus(sid)
         self.updateStatus(sid)

   def checkIfGroupFinished(self,sid):
      #allMembers including myself
      allMembers=self.data['matching'][self.currentMatch][sid]+[sid]
      complete=True
      print "sdfs",self.data['matching'][self.currentMatch][sid]
      if self.data['matching'][self.currentMatch][sid]==["randomPlayer"]:
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
      self.getStatus(sid)
      print self.data[sid].status
      self.updateStatus(sid)
      self.checkIfMatchFinished()

   def finishExperiment(self):
      for sid in self.data['subjectIDs']:
         self.data[sid].status['stage']="experimentSummary"
         showup=5
         expEarnings=self.data[sid].totalPayoffs*self.data['exchangeRate']
         bonus=self.data[sid].bonusPay
         total=5+expEarnings+bonus
         self.data[sid].status['summary']="Experiment Over! SubjectID: %s Payment: %s+$%.02f+%s=%.02f"%(sid,showup,expEarnings,bonus,total)
         self.getStatus(sid)
         self.updateStatus(sid)
   def checkIfMatchFinished(self):
      complete=True
      for sid in self.data['subjectIDs']:
         if self.data[sid].status['stage']!="matchOverConfirmed":
            complete=False
            break
      print self.currentMatch,self.data['totalMatches']
      if complete:
         self.getBonusPayment()
         if self.currentMatch+1<self.data['totalMatches']:
            self.startMatch()
         else:
            print "FINSISHING"
            #self.finishExperiment()
            self.startQuestionnaire()

   def getBonusPayment(self):
      cgs=[]
      for sid in self.data['subjectIDs']:
         cgs.append(self.data[sid].correctGuesses[self.currentMatch])
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
      self.data[winner].bonusPay=self.data[winner].bonusPay+5
   def nextPeriod(self,message,client):
      sid=client.subjectID
      self.currentPeriods[sid]=self.currentPeriods[sid]+1
      self.data[sid].status={"page":"game","stage":"noChoices"}
      self.getStatus(sid)
      self.updateStatus(sid)

   def getStatus(self,subjectID):
      self.data[subjectID].status['period']=self.currentPeriods[subjectID]
      self.data[subjectID].status['match']=self.currentMatch
      self.data[subjectID].status['history']=self.data[subjectID].history[self.currentMatch]
      self.data[subjectID].status['correctGuesses']=self.data[subjectID].correctGuesses[self.currentMatch]
      self.data[subjectID].status['myMatchPay']=self.data[subjectID].myMatchPayoffs[self.currentMatch]
      self.data[subjectID].status['theirMatchPay']=self.data[subjectID].opponentMatchPayoffs[self.currentMatch]
      self.data[subjectID].status['myTotalPay']=self.data[subjectID].totalPayoffs
         
   def periodSummary(self,sid):
      allMembers=self.data['matching'][self.currentMatch][sid]+[sid]
      if self.data['matching'][self.currentMatch][sid]==["randomPlayer"]:
         s=sid
         partner="randomPlayer"
         myChoice=self.data[s].choices[self.currentMatch][self.currentPeriods[s]]
         myGuess=self.data[s].guesses[self.currentMatch][self.currentPeriods[s]]
         theirChoice=random.choice([2,1])
         if myGuess==theirChoice:
            self.data[s].correctGuesses[self.currentMatch]=self.data[s].correctGuesses[self.currentMatch]+1
         theseChoices=[myChoice,theirChoice]
         self.data[s].history[self.currentMatch].append(theseChoices)
         self.data[s].status['stage']='periodSummary'

         if self.currentPeriods[sid]+1==self.data['supergameLengths'][self.currentMatch]:
            self.data[s].status['stage']='matchOver'

         self.data[s].status['othersChoice']=theirChoice
         ourPay=self.data['pays'][self.currentMatch][s][myChoice][theirChoice]
         myPay=ourPay[0]
         theirPay=ourPay[1]

         self.data[s].myMatchPayoffs[self.currentMatch]=self.data[s].myMatchPayoffs[self.currentMatch]+myPay
         self.data[s].opponentMatchPayoffs[self.currentMatch]=self.data[s].opponentMatchPayoffs[self.currentMatch]+theirPay
         self.data[s].totalPayoffs=self.data[s].totalPayoffs+myPay


         self.getStatus(s)
         self.updateStatus(s)


      else:
         for s in allMembers:
            partner=self.data['matching'][self.currentMatch][s][0]
            myChoice=self.data[s].choices[self.currentMatch][self.currentPeriods[s]]
            myGuess=self.data[s].guesses[self.currentMatch][self.currentPeriods[s]]
            theirChoice=self.data[partner].choices[self.currentMatch][self.currentPeriods[partner]]
            if myGuess==theirChoice:
               self.data[s].correctGuesses[self.currentMatch]=self.data[s].correctGuesses[self.currentMatch]+1
            theseChoices=[myChoice,theirChoice]
            self.data[s].history[self.currentMatch].append(theseChoices)
            self.data[s].status['stage']='periodSummary'

            if self.currentPeriods[sid]+1==self.data['supergameLengths'][self.currentMatch]:
               self.data[s].status['stage']='matchOver'

            self.data[s].status['othersChoice']=self.data[partner].choices[self.currentMatch][self.currentPeriods[partner]]

            ourPay=self.data['pays'][self.currentMatch][s][myChoice][theirChoice]
            myPay=ourPay[0]
            theirPay=ourPay[1]

            self.data[s].myMatchPayoffs[self.currentMatch]=self.data[s].myMatchPayoffs[self.currentMatch]+myPay
            self.data[s].opponentMatchPayoffs[self.currentMatch]=self.data[s].opponentMatchPayoffs[self.currentMatch]+theirPay
            self.data[s].totalPayoffs=self.data[s].totalPayoffs+myPay


            self.getStatus(s)
            self.updateStatus(s)

   def makeChoice(self,message,client):
      sid=client.subjectID
      if "row" in message:
         self.data[sid].status["row"]=message['row']
         self.data[sid].choices[self.currentMatch][self.currentPeriods[sid]]=message['row']
      elif "col" in message:
         self.data[sid].status["col"]=message['col']
         self.data[sid].guesses[self.currentMatch][self.currentPeriods[sid]]=message['col']
      if "row" in self.data[sid].status and "col" not in self.data[sid].status:
         self.data[sid].status["stage"]="rowSelected"
      elif "col" in self.data[sid].status and "row" not in self.data[sid].status:
         self.data[sid].status["stage"]="colSelected"
      elif "col" in self.data[sid].status and "row" in self.data[sid].status:
         self.data[sid].status["stage"]="bothSelected"


      #check to see if we are done:
      if self.checkIfGroupFinished(sid):
         self.periodSummary(sid)
      else:
         self.updateStatus(sid)

   def simulation(self):
      for k in range(10):
         self.newConnection({'subjectID':"test%s"%(k),"viewType":"regular"},fakeClient(""))
      self.stopAccepting(self.data['monitorTasks'][0],{})
      self.startExperiment(self.data['monitorTasks'][4],{})


      for match in range(3):
         print self.currentMatch
         class StopHere(Exception): pass
         try:
            for period in range(self.data['supergameLengths'][self.currentMatch]-1):
               for k in range(10):
                  self.makeChoice({"type":"makeChoice","row":random.choice([1,2])},fakeClient("test%s"%(k)))
                  self.makeChoice({"type":"makeChoice","col":random.choice([1,2])},fakeClient("test%s"%(k)))
               for k in range(10):
                  self.nextPeriod({"type":"nextPeriod"},fakeClient("test%s"%(k)))

               if match==2 and period==18:
                  raise StopHere

            for k in range(10):
               self.makeChoice({"type":"makeChoice","row":1},fakeClient("test%s"%(k)))
               self.makeChoice({"type":"makeChoice","col":1},fakeClient("test%s"%(k)))
            for k in range(10):
               self.confirmMatchOver({"type":"confirmMatchOver"},fakeClient("test%s"%(k)))
         except StopHere:
            print "%s"%(self.data['test0'].status)
            raw_input() 
      print "HEY!"   

   def displayDemo(self,viewType,subjectID):
      if viewType=="quiz":
         msg={}
         msg['type']='startQuiz'
         msg['title']='Start Quiz'
         msg['status']=''
         msg['index']=0
         self.startQuiz(msg,{})
      elif viewType=="firstMatch" or viewType=="regular":
         self.data['matchType']="regularDemo"
         thisClient=self.clientsById[subjectID]
         msg={}
         msg['type']='startExperiment'
         msg['title']='Start Experiment'
         msg['status']=''
         msg['index']=0
         self.data['pays']={}
         self.data['pays'][0]={}
         self.data['pays'][0][subjectID]={1:{1:[30,30],2:[10,40]},2:{1:[40,10],2:[20,20]}}

         self.data['matching']={}
         self.data['matching'][0]={}
         self.data['matching'][0][subjectID]=["randomPlayer"]
         self.data['matching'][0]["randomPlayer"]=[subjectID]

         self.data['supergameLengths']={}
         self.data['supergameLengths'][0]=30
         self.startExperiment(msg,{})

class subjectClass():
   def __init__(self):
      self.choices={}
      self.guesses={}
      self.history={}
      self.correctGuesses={}
      self.myMatchPayoffs={}
      self.opponentMatchPayoffs={}
      self.bonusPay=0#In Dollars
      self.totalPayoffs=0#Me,You
      self.quizEarnings=0
      self.quizAnswers=[]
      self.name="default"
      self.desk="default"
      self.status={"page":"generic","message":["Please read, sign, and date your consent form. <br> You may read over the instructions as we wait to begin."]}

class monitorClass():
   def __init__(self):
      "do init stuff"
      self.monitorTasks()

   def getMonitorTable(self):
      table=[]
      titles=['#','subjectID',"Connection",'Name','Desk',"Status","Period","Choices","Total"]
      try:

         sortedSubs=[]
         for sid in self.data['subjectIDs']:
            sortedSubs.append([self.data[sid].desk,sid])
         sortedSubs.sort()
         print sortedSubs
         for k in sortedSubs:
            subjectID=k[1]
            this=[]
            refreshLink="<a href='javascript:void(0)' onclick='refreshClient(\"%s\");'>%s</a>"%(subjectID,subjectID)
            this.append(refreshLink)
            this.append(self.data[subjectID].connectionStatus)
            this.append(self.data[subjectID].name)
            this.append(self.data[subjectID].desk)
            this.append("%s"%(self.data[subjectID].status['page']))
            if hasattr(self,'currentPeriods'):
               this.append("%s"%(self.currentPeriods[subjectID]))
            else:
               this.append("NA")
            this.append("%s"%(self.data[subjectID].totalPayoffs))
            totalPoints=self.data[subjectID].totalPayoffs
            totalPay=totalPoints*self.data['exchangeRate']+self.data[subjectID].quizEarnings
            this.append("$5+%.02f+%s=%.02f"%(totalPay,self.data[subjectID].bonusPay,totalPay+self.data[subjectID].bonusPay+5))
            table.append(this)
      except Exception as thisExept: 
         print "can't get table at this time because:"
         print thisExept
      return table,titles
   
   def monitorTasks(self):
      taskList=[]


      thisPath=os.path.dirname(os.path.realpath(__file__))
      this=thisPath.find("/experiments/")
      thisPath=thisPath[this:]

      msg={}
      msg['type']='getNames'
      msg['title']='Get Names'
      msg['status']=''
      taskList.append(msg)


      msg={}
      msg['type']='gotNames'
      msg['title']='Got Names'
      msg['status']=''
      taskList.append(msg)


      msg={}
      msg['type']='loadInstructions'
      msg['title']='Load Instructions'
      msg['source']=self.config['domain']+self.config['currentExperiment']+"/files/instructions/audio/output.m4a"
      msg['status']=''
      taskList.append(msg)

      filename=self.currentExperimentPath+"/files/instructions/audio/output.duration"
      file = open(filename,'r')
      fileData=file.read()
      file.close() 

      msg={}
      msg['type']='startInstructions'
      msg['title']='Start Instructions'
      msg['totalTime']=float(fileData)
      msg['status']=''
      taskList.append(msg)
      # print float(fileData)
      # msg={}
      # msg['type']='startTrial'
      # msg['title']='Practice'
      # msg['status']=''
      # taskList.append(msg)

      msg={}
      msg['type']='startQuiz'
      msg['title']='Start Quiz'
      msg['status']=''
      taskList.append(msg)

      msg={}
      msg['type']='startExperiment'
      msg['title']='Start Experiment'
      msg['status']=''
      taskList.append(msg)


      msg={}
      msg['type']='makeReceipt'
      msg['title']='Make Receipt'
      msg['status']=''
      taskList.append(msg)

      for k in range(len(taskList)):
         taskList[k]['index']=k

      self.data['monitorTasks']=taskList


