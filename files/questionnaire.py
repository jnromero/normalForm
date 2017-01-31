from __future__ import print_function
import pickle
import json
import time
from twisted.internet import reactor
import random

class ExperimentQuestionnaire():
   def __init__(self):
      "self.doNothering=1"
      print("@#@#$@#$")


   def showQuestionnaire(self,message,client):
      sid=client.subjectID

      msgs=[]

      msgs+=self.runJavascriptFunction("clearAll",sid,"return")

      msg={"type":"makeDropdown","id":"genderSelect","top":"100px","options":[['male',"Male"],['female','Female']]}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeDropdown","id":"ageSelect","top":"175px","options":[['16',"Under 17"],['17','17'],['18','18'],['19','19'],['20','20'],['21','21'],['22','22'],['23','23'],['24','24'],['25','25'],['26','Over 25']]}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeDropdown","id":"majorSelect","top":"250px","options":[['economics',"Economics"],['business','Other Business'],['engineering','Engineering'],['science','Science'],['other','Other']]}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeDropdown","id":"yearSelect","top":"325px","options":[['1',"1"],['2','2'],['3','3'],['4','4'],['5','5'],['6','6+']]}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeDropdown","id":"microSelect","top":"400px","options":[['yes',"Yes"],['no','No']]}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeDropdown","id":"gameTheorySelect","top":"475px","options":[['yes',"Yes"],['no','No']]}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeDropdown","id":"gpaSelect","top":"550px","options":[["%.01f"%(float(40-x)/10),"%.01f"%(float(40-x)/10)] for x in range(41)]}
      msgs+=self.messageToId(msg,sid,"return")


      titles=[["genderSelectTitle","Gender:"],["ageSelectTitle","Age:"],["majorSelectTitle","Major:"],["yearSelectTitle","Academic Year:"],["microSelectTitle","Have you taken Intermediate Micro (ECON 361)?:"],["gameTheorySelectTitle","Have you taken Game Theory (ECON 431)?:"],["gpaSelectTitle","What is your GPA?:"]];
      j=0
      for title in titles:
         msg={"type":"dropdownTitle","id":title[0],"top":"%spx"%(100+75*j),"title":title[1]}
         msgs+=self.messageToId(msg,sid,"return")
         j+=1

      msg={"type":"makeTextTitle","id":"strategyTitle","top":"50px","title":"What type of strategy did you use for this experiment?"}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeTextTitle","id":"likedTitle","top":"300px","title":"Was there anything that you especially liked about this experiment?"}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeTextTitle","id":"confusedTitle","top":"550px","title":"Was there anything that was confusing to you in this expeirment?"}
      msgs+=self.messageToId(msg,sid,"return")


      msg={"type":"makeTextBox","id":"strategyText","top":"100px"}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeTextBox","id":"likedText","top":"350px"}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"makeTextBox","id":"confusedText","top":"600px"}
      msgs+=self.messageToId(msg,sid,"return")
      
      msg={"type":"makeButton","listOfIds":[x[0] for x in titles]+['strategyText','likedText','confusedText']}
      msgs+=self.messageToId(msg,sid,"return")


      msg={"type":"placeTextQuestionnaire","id":"questionnaireSubjectID","text":"subjectID: "+sid,"left":"1400px","top":"850px","width":"200px","height":"50px"}
      msgs+=self.messageToId(msg,sid,"return")

      msg={"type":"placeTextQuestionnaire","id":"questionnaireEarnings","text":"Earnings: $%.02f"%(self.data[sid].finalPayoffs['total']),"left":"1400px","top":"800px","width":"200px","height":"50px"}
      msgs+=self.messageToId(msg,sid,"return")

      self.sendListOfMessages(msgs)

   def questionnaireAnswers(self,message,client):
      sid=client.subjectID
      self.data[sid].questionnaireAnswers=message['answers']
      self.data[sid].status['page']="generic"
      self.updateStatus(sid)
      self.monitorMessage()
