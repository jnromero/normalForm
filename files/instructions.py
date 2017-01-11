from __future__ import print_function
import pickle
import json
import time
from twisted.internet import reactor
import random

class ExperimentInstructions():
   def __init__(self):
      "self.doNothering=1"

   def setInstructionParameters(self,sid="all",output="send"):
      print("setInstructionParameters",sid)
      msg={}
      msg['type']="parameters"
      msg['pays']={1: {1: [8, 1], 2: [7, 2]}, 2: {1: [6, 3], 2: [5, 4]}}
      msg['colActions']={1: 'L', 2: 'R'}
      msg['colColors']={1: 'rgba(152,78,163,1)', 2: 'rgba(255,127,0,1)', 3: 'rgba(200,200,51,1)'}
      msg['exchangeRate']=0.05
      msg['rowActions']={1: 'U', 2: 'D'}
      msg['rowColors']={1: 'rgba(228,26,28,1)', 2: 'rgba(55,126,184,1)', 3: 'rgba(77,175,74,1)'} 
      msg['pays']={1: {1: [8, 1], 2: [7, 2]}, 2: {1: [6, 3], 2: [5, 4]}}
      msg['numberOfCols']=2
      msg['numberOfRows']=2 
      return self.messageToId(msg,sid,output)

   def instructionsSetState(self,sid="all",output="send"):
      for s in self.getSubjectIDList(sid):
         self.data[s].status['correctGuesses']=8
         self.data[s].status['period']=19
         self.data[s].status['myMatchPay']=180 
         self.data[s].status['myTotalPay']=470
         self.data[s].status['theirMatchPay']=190 
         self.data[s].status['stage']='noChoices' 
         self.data[s].status['rowSelected']='No'
         self.data[s].status['colSelected']='No'
         self.data[s].status['page']='game'
         self.data[s].status['match']=2 
         self.data[s].status['history']=[[2, 1], [1, 1], [1, 1], [1, 2], [2, 1], [1, 2], [2, 2], [1, 2], [1, 1], [1, 1], [1, 1], [1, 1], [2, 2], [2, 2], [1, 2], [1, 1], [1, 2], [2, 1], [2, 2]]
      return self.updateStatus(sid,output)

   def instructionsFinishPeriod(self,sid="all",output="send"):
      for s in self.getSubjectIDList(sid):
         self.data[s].status['history']=[[2, 1], [1, 1], [1, 1], [1, 2], [2, 1], [1, 2], [2, 2], [1, 2], [1, 1], [1, 1], [1, 1], [1, 1], [2, 2], [2, 2], [1, 2], [1, 1], [1, 2], [2, 1], [2, 2],[1,1]]
         self.data[s].status['othersChoice']=1 
         self.data[s].status['theirMatchPay']=191
         self.data[s].status['myMatchPay']=188 
         self.data[s].status['myTotalPay']=478
         self.data[s].status['stage']="periodSummary"
      return self.updateStatus(sid,output)

   def instructionsSelectRow(self,row,sid="all",output="send"):
      for s in self.getSubjectIDList(sid):
         self.data[s].status['rowSelected']=row 
      return self.updateStatus(sid,output)

   def instructionsSelectCol(self,col,sid="all",output="send"):
      for s in self.getSubjectIDList(sid):
         self.data[s].status['colSelected']=col
         self.data[s].status['stage']="bothSelected"
      return self.updateStatus(sid,output)

   def instructionsMovetoNextPeriod(self,sid="all",output="send"):
      for s in self.getSubjectIDList(sid):
         self.data[s].status['period']=20
         self.data[s].status['stage']='noChoices' 
         self.data[s].status['rowSelected']='No'
         self.data[s].status['colSelected']='No'
      return self.updateStatus(sid,output)

