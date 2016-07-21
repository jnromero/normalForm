import sys 
import random
def getRemaining(current,newOptions):
	out=[]
	for k in newOptions:
		if k not in current:
			out.append(k)
	return out

def getUnique(v):
	out=[]
	for k in v:
		if k not in out:
			out.append(k)
	return out 

def areThereDuplicates(v):
	out=False
	for k in v:
		this=sum([int(k==x) for x in v])
		if this>1:
			out=True
			break
	return out
import random


dataOut={}

allGames=["PDL","BOL","SHL","SDL","PDH","BOH","SHH","SDH"]
startingGames=[]#["PDL","BOL","SHL","SDL"]
gamesToBeRun=startingGames+allGames*20

firstMatchStarting=["BOL","SHL","SDH"]
firstMatchGames=firstMatchStarting+allGames*20


totalMatches=4
totalSubjects=10
groupsPerMatch=totalSubjects/2

otherMatchGames=gamesToBeRun[:groupsPerMatch*totalMatches]
theseFirstMatchGames=firstMatchGames[:groupsPerMatch]
for k in theseFirstMatchGames:
	otherMatchGames.pop(otherMatchGames.index(k))



this=[[[m,s] for m in range(totalMatches)] for s in range(totalSubjects)]
random.shuffle(this)

totalSubjects=18


def getPairs(totalSubjects,totalMatches):
	success=0
	while success==0:
		success=1
		pairs={}
		for s in range(totalSubjects):
			pairs[s]=[-1 for x in range(totalMatches)]
		for m in range(totalMatches):
			remainingSubs=range(totalSubjects)
			random.shuffle(remainingSubs)
			while len(remainingSubs)>0:
				s1=remainingSubs.pop()
				toTry=range(len(remainingSubs))
				good=0
				while len(toTry)>0:
					thisIndex=toTry.pop()
					s2=remainingSubs[thisIndex]
					if s2 not in pairs[s1]:
						s2=remainingSubs.pop(thisIndex)
						pairs[s1][m]=s2
						pairs[s2][m]=s1
						toTry=[]
						good=1
				if good==0:
					print m
					success=0
					break
	return pairs


totalSubjects=10
totalMatches=4
pairs=getPairs(totalSubjects,totalMatches)




counter=0

best=10000
success=0
while success==0:
	success=1

	otherMatchGames=gamesToBeRun[:groupsPerMatch*totalMatches]
	random.shuffle(theseFirstMatchGames)
	random.shuffle(otherMatchGames)

	# print otherMatchGames
	# print theseFirstMatchGames
	# raw_input() 
	games={}
	for s in range(totalSubjects):
		games[s]=["NON" for x in range(totalMatches)]
	g=0
	for s in range(totalSubjects):
		if games[s][0]=="NON":
			partner=pairs[s][0]
			thisGame=theseFirstMatchGames[g]
			games[s][0]=thisGame
			games[partner][0]=thisGame
			g=g+1


	for M in range(1,totalMatches):
		remainingSubs=range(totalSubjects)
		random.shuffle(remainingSubs)
		while len(remainingSubs)>0:
			s1=remainingSubs.pop()
			partner=pairs[s1][M]
			remainingSubs.pop(remainingSubs.index(partner))
			# print remainingSubs,s1,partner
			# print games
			# raw_input() 
			currentGames=[]
			currentPays=0
			for m in range(totalMatches):
				s1G=games[s1][m][:2]
				pG=games[partner][m][:2]

				s1P=games[s1][m][2:]
				pP=games[partner][m][2:]

				for x in [s1P,pP]:
					if x=="H":
						currentPays=currentPays+1
					elif x=="L":
						currentPays=currentPays-1

				for x in [s1G,pG]:
					if x not in currentGames:
						currentGames.append(x)


			if currentPays>0:
				nextPays=["L"]
			elif currentPays<0:
				nextPays=["H"]
			else:
				nextPays=["H","L"]
			remainingGames=[x for x in ["PD","BO","SH","SD"] if x not in currentGames]


			nextChoices=[]
			for g in remainingGames:
				for p in nextPays:
					nextChoices.append(g+p)

			toTry=range(len(nextChoices))
			foundOne=0
			while len(toTry)>0:
				i=toTry.pop()
				if nextChoices[i] in otherMatchGames:
					index=otherMatchGames.index(nextChoices[i])
					thisGame=otherMatchGames.pop(index)
					games[s1][M]=thisGame
					games[partner][M]=thisGame
					toTry=[]
					foundOne=1

			if foundOne==0:
				if len(otherMatchGames)<best:
					best=len(otherMatchGames)
				print M,best
				print "couldn't find suitable game",counter
				counter=counter+1

				if counter>10000:
					pairs=getPairs(totalSubjects,totalMatches)
					counter=0
				success=0
				break
				break
			# else:
			# 	for k in range(8):
			# 		print games[k]
			# 	raw_input() 


print games