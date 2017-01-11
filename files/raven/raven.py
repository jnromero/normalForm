class ravensProgrssiveMatrixTest():
   def startRaven(self,message,client):
      self.taskDone(message)
      self.currentMatch=-1
      print("Starting Raven!")
      for sid in self.data['subjectIDs']:
         self.data[sid].status={"page":"raven","answers":self.data[sid].ravensAnswers,"currentProblem":1}
         self.updateStatus(sid)
      self.initializeTimer("all",600,self.endRaven)
      #self.initializeTimer(sid,5,self.pleaseMakeChoice,sid)
   def endRaven(self):
      print("donzo")
   
   def submitRavenAnswer(self,message,client):
      sid=client.subjectID
      questionNumber=message['questionNumber']
      choiceNumber=message['choiceNumber']
      self.data[sid].ravensAnswers[questionNumber]=choiceNumber
      self.data[sid].status['answers']=self.data[sid].ravensAnswers
      self.data[sid].status['currentProblem']=message['currentProblem']
      self.updateStatus(sid)

