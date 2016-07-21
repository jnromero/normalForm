import sys 
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


for totalSubjects in [2*x for x in range(4,14)]:
	print "totalSubjects",totalSubjects
	dataOut[totalSubjects]={}
	totalMatches=4
	totalGroups=totalSubjects*totalMatches

	group1=range(0,totalSubjects/2)
	group2=range(totalSubjects/2,totalSubjects)

	groups={}
	pairs={}
	games={}
	roles={}
	pays={}
	for k in range(len(group1)):
		groupNumber=k
		for n in range(totalMatches):
			matchNumber=n
			# if matchNumber not in pairs:
			# 	pairs[matchNumber]={}
			# if groupNumber not in pairs[matchNumber]:
			# 	pairs[matchNumber][groupNumber]={}


			s1=group1[k]
			ind2=(n+k)%len(group1)
			s2=group2[ind2]
			
			# pairs[matchNumber][groupNumber]=[s1,s2]
			# print groupNumber,matchNumber
			# print s1,s2
			# raw_input() 
			if s1 not in pairs:
				pairs[s1]=[-1 for x in range(totalMatches)]
				roles[s1]=[-1 for x in range(totalMatches)]
				groups[s1]=[-1 for x in range(totalMatches)]
			if s2 not in pairs:
				pairs[s2]=[-1 for x in range(totalMatches)]
				roles[s2]=[-1 for x in range(totalMatches)]
				groups[s2]=[-1 for x in range(totalMatches)]


			pairs[s1][n]=s2
			pairs[s2][n]=s1

			groups[s1][n]=groupNumber
			groups[s2][n]=groupNumber

			theseRoles=[0,1]
			random.shuffle(theseRoles)
			roles[s1][n]=theseRoles[0]
			roles[s2][n]=theseRoles[1]


	allGames=["SH","SD","PD","BO"]
	theseGames=(allGames*totalGroups)[:totalGroups]
	firstPeriodsGames=["SH","BO","SD"]#["SD","PD"]

	firstPeriodPriority={}
	firstPeriodPriority['PD']="H"
	firstPeriodPriority['BO']="H"
	firstPeriodPriority['SH']="L"
	firstPeriodPriority['SD']="H"

	redo=1
	while redo==1:
		for s in range(totalSubjects):
			games[s]=[-1 for x in range(totalMatches)]
		assignments=[]
		for s in group1:
			for m in range(1,totalMatches):
				assignments.append([s,m])
		random.shuffle(assignments)

		random.shuffle(firstPeriodsGames)
		thisFirstGames=(["PD","SD","BO","SH"]*totalSubjects)[:totalSubjects/2]
		random.shuffle(thisFirstGames)
		thisFirstGames=thisFirstGames+firstPeriodsGames
		for k in range(totalSubjects):
			thisSubject=k
			thisMatch=0
			partner=pairs[thisSubject][thisMatch]
			if games[thisSubject][thisMatch]==-1:
				thisGame=thisFirstGames.pop()
				games[thisSubject][thisMatch]=thisGame
				games[partner][thisMatch]=thisGame

		while len(assignments)>0:
			this=assignments.pop()
			thisSubject=this[0]
			thisMatch=this[1]
			partner=pairs[thisSubject][thisMatch]
			gamesForBoth=games[thisSubject]+games[partner]
			rem=getRemaining(gamesForBoth,allGames)
			if -1 in gamesForBoth and rem==[]:
				#print "not done"
				assignments=[]
			else:
				thisGame=random.choice(rem)
				games[thisSubject][thisMatch]=thisGame
				games[partner][thisMatch]=thisGame

		if sum([int(sum([int(y==-1) for y in games[x]])>0) for x in games])==0:
			redo=0
	# for thisMatch in range(4):
	# 	this=[]
	# 	for x in games:
	# 		this.append(games[x][thisMatch])
	# 	print thisMatch,this


	best=1000000
	bestPays={}
	for K in range(100000):
		gameTracker={}
		for game in allGames:
			gameTracker[game]=0

		# gameTracker={}
		# gameTracker["PDL"]=
		# gameTracker["PDH"]=
		# gameTracker["BOL"]=
		# gameTracker["BOH"]=
		# gameTracker["SHL"]=
		# gameTracker["SHH"]=
		# gameTracker["SDL"]=
		# gameTracker["SDD"]=
		#thisFirstPays(firstPeriodsPays+["H" ,"H" ,"H" ,"H" ,"L" ,"L" ,"L" ,"L"]*totalSubjects)[:totalSubjects/2]



		j=0
		for s in range(totalSubjects):
			pays[s]=[-1 for x in range(totalMatches)]
			# pays[s][0]=thisFirstPays[j]
			# j=j+1
		assignments=[]
		for s in group1:
			for m in range(0,totalMatches):
				assignments.append([s,m])
		random.shuffle(assignments)

		while len(assignments)>0:
			this=assignments.pop()
			thisSubject=this[0]
			thisMatch=this[1]
			partner=pairs[thisSubject][thisMatch]
			thisGame=games[thisSubject][thisMatch]

			if gameTracker[thisGame]==1:
				pays[thisSubject][thisMatch]="H"
				pays[partner][thisMatch]="H"
				gameTracker[thisGame]=0
			elif gameTracker[thisGame]==0:
				if thisMatch==0:
					thisGame=games[thisSubject][thisMatch]
					thisChoice=firstPeriodPriority[thisGame]
					if thisChoice=="E":
						thisChoice=random.choice(["L","H"])
				else:
					thisChoice=random.choice(["L","H"])
				if thisChoice=="H":
					diff=-1
				elif thisChoice=="L":
					diff=1
				pays[thisSubject][thisMatch]=thisChoice
				pays[partner][thisMatch]=thisChoice
				gameTracker[thisGame]=gameTracker[thisGame]+diff
			elif gameTracker[thisGame]==-1:
				pays[thisSubject][thisMatch]="L"
				pays[partner][thisMatch]="L"
				gameTracker[thisGame]=0

		total=[]
		for k in pays:
			this=abs(2-sum([x=="H" for x in pays[k]]))
			total.append(this)

		this=sum(total)#*max(total)
		if this<best:
			best=this
			bestPays=pays.copy()
			print best,K

			# for k in bestPays:
			# 	this=abs(2-sum([x=="H" for x in bestPays[k]]))
			# 	print bestPays[k],this

			if best==0:
				break
	print best



	for k in bestPays:
		this=abs(2-sum([x=="H" for x in bestPays[k]]))
		print bestPays[k],this

	for thisMatch in range(4):
		this=[]
		for x in bestPays:
			this.append(games[x][thisMatch]+bestPays[x][thisMatch])
		print thisMatch,this

	dataOut[totalSubjects]['roles']=roles
	dataOut[totalSubjects]['pairs']=pairs
	dataOut[totalSubjects]['games']=games
	dataOut[totalSubjects]['pays']=bestPays
	dataOut[totalSubjects]['groups']=groups

	import pickle
	filename='files/%s-unparsed.pickle'%(sys.argv[1])
	file = open(filename,'wb')
	pickle.dump(dataOut,file)
	file.close() 
# for k in range(100):
# 	thisSubject=random.choice(range(totalSubjects))
# 	thisMatch=random.choice(range(totalMatches))
# 	partner=pairs[thisSubject][thisMatch]
# 	print k
# 	print gamesForBoth
# 	print getUnique(gamesForBoth)
# 	rem=getRemaining(gamesForBoth,allGames)
# 	if -1 in gamesForBoth and rem==[]:
# 		print "no dice"
# 	else:
# 		thisGame=random.choice(rem)
# 		games[thisSubject][thisMatch]=thisGame
# 		games[partner][thisMatch]=thisGame
# 		raw_input() 
# 	# if [int(sum([int(x==-1) for x in games[s])>0) for s in games]
# for k in range(totalSubjects):
# 	print areThereDuplicates(pairs[k])

# games=["PD","BO","SH","SD"]
# print theseGames