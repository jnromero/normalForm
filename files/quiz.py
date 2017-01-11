from __future__ import print_function

class ExperimentQuiz():
   def __init__(self):
      self.setQuizQuestionAnswers()
      self.setQuizQuestions()
      # self.reconnectQuiz(sid)

   def displayQuiz(self,sid):
      if self.data[sid].status['quizQuestionNumber']>self.numberOfQuizQuestions:
         self.setQuizParameters(sid)
         self.quizSetState(sid)
         self.drawQuizOverStatement(sid)
      else:
         self.setQuizParameters(sid)
         self.quizSetState(sid)
         self.quizQuestionStatement(sid)


   def setQuizParameters(self,sid="all",output="send"):
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
      self.messageToId(msg,sid,output)

   def quizSetState(self,sid):
      self.data[sid].status['correctGuesses']=12
      self.data[sid].status['period']=22
      self.data[sid].status['myMatchPay']=180 
      self.data[sid].status['myTotalPay']=470
      self.data[sid].status['theirMatchPay']=190 
      self.data[sid].status['stage']='bothSelected' 
      self.data[sid].status['rowSelected']=2
      self.data[sid].status['colSelected']=1
      self.data[sid].status['page']='game'
      self.data[sid].status['match']=2 
      self.data[sid].status['history']=[[2, 1],  [1, 1],  [1, 2], [1, 1], [1, 1], [1, 1], [1, 2], [1, 1], [1, 1], [2, 2],  [1, 2], [2, 2], [1, 2],[2, 2],[2, 1], [1, 1],[1, 2], [2, 1], [2, 2],[1, 2], [2, 1], [2, 2]]
      self.updateStatus(sid)


   def setQuizQuestionAnswers(self):
      self.quizAnswers={}
      self.quizAnswers[1]="23";
      self.quizAnswers[2]="L";
      self.quizAnswers[3]="D";
      self.quizAnswers[4]="6";
      self.quizAnswers[5]="4";
      self.quizAnswers[6]="R";
      self.quizAnswers[7]="D";
      self.quizAnswers[8]="8";
      self.quizAnswers[9]="3";
      self.quizAnswers[10]="12";
      self.quizAnswers[11]="5";
      self.quizAnswers[12]="Random";


   def setQuizQuestions(self):
      self.numberOfQuizQuestions=12
      self.quizQuestions={}
      for questionNumber in range(1,self.numberOfQuizQuestions+1):
         if questionNumber==1:
            statement="Given the current screen shot, what is the current period?"
            location=[150,100]
            options=range(31)
         elif questionNumber==2:
            statement="What action did you guess that the other player is going to play?"
            location=[850,100]
            options=["U","D","L","R"]
         elif questionNumber==3:
            statement="What action did you play this period?"
            location=[850,100]
            options=["U","D","L","R"]
         elif questionNumber==4:
            statement="Given your choice this period, what is your payoff if the subject that you are matched with actually plays L?"
            location=[850,100]
            options=range(31)
         elif questionNumber==5:
            statement="Given your choice this period, what is the payoff of the subject that you are matched with if they actually play R?"
            location=[850,100]
            options=range(31)
         elif questionNumber==6:
            statement="What action did the subject that you are matched with play in period 17?"
            location=[850,100]
            options=["U","D","L","R"]
         elif questionNumber==7:
            statement="What action did you play in period 10?"
            location=[850,100]
            options=["U","D","L","R"]
         elif questionNumber==8:
            statement="What payoff did you receive in period 8?"
            location=[850,100]
            options=range(31)
         elif questionNumber==9:
            statement="What payoff did the subject that you are matched with receive in period 18?"
            location=[850,100]
            options=range(31)
         elif questionNumber==10:
            statement="How many times have you correctly guessed the choice of the subject that you are matched with during the experiment?"
            location=[650,575]
            options=range(31)
         elif questionNumber==11:
            statement="How many matches are there in this experiment?"
            location=[650,400]
            options=range(31)
         elif questionNumber==12:
            statement="How many periods does each match have?"
            location=[650,575]
            options=['Random']+range(101)  
         self.quizQuestions[questionNumber]={}       
         self.quizQuestions[questionNumber]['statement']=statement
         self.quizQuestions[questionNumber]['location']=location
         self.quizQuestions[questionNumber]['options']=options

