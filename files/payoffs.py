



games=["PDL","PDH","BOL","BOH","SHL","SHH"]


#				CC			CD 		DC			DD	
payoffs={}
payoffs["PDL"]={1:{1:[30,30],2:[19,31]},2:{1:[31,19],2:[20,20]}}#30
payoffs["PDH"]={1:{1:[30,30],2:[1,49]},2:{1:[49,1],2:[20,20]}}#20
payoffs["BOL"]={1:{1:[10,10],2:[29,31]},2:{1:[31,29],2:[10,10]}}#30
payoffs["BOH"]={1:{1:[10,10],2:[11,49]},2:{1:[49,11],2:[10,10]}}#30
payoffs["SHL"]={1:{1:[30,30],2:[9,11]},2:{1:[11,9],2:[10,10]}}#
payoffs["SHH"]={1:{1:[30,30],2:[-9,29]},2:{1:[29,-9],2:[10,10]}}



import random

totalSubjects=12
totalMatches=3
match={}






def generateMatching(totalSubjects):
	matching=[-1 for x in range(totalSubjects)]
	remaining=[x for x in range(totalSubjects)]
	while len(remaining)>0:
		random.shuffle(remaining)
		this1=remaining.pop()
		this2=remaining.pop()
		matching[this1]=this2
		matching[this2]=this1

	return matching


def getNonoverlappingMatching(totalSubjects,totalMatches):
	matchings=[]
	matchings.append(generateMatching(totalSubjects))
	while len(matchings)<totalMatches:
		potential=generateMatching(totalSubjects)
		add=1
		for k in matchings:
			if sum([int(a==b) for a,b in zip(k,potential)])>0:
				add=0
		if add==1:
			matchings.append(potential)

	return matchings




for totalSubjects in [8,12,14,16]:
	j=0
	best=100000000
	while 3<4:
		j=j+1
		#print j
		matching=getNonoverlappingMatching(totalSubjects,totalMatches)
		allGames=[totalSubjects*games][0][:totalSubjects*totalMatches/2]
		random.shuffle(allGames)
		stillPossible=1
		while stillPossible==1:
			assignedGames=[[0 for k in x] for x in matching]
			for a in range(totalMatches):
				for b in range(totalSubjects):
					if assignedGames[a][b]==0:
						me=b
						partner=matching[a][b]
						gamesSoFar=[]
						for m in range(totalMatches):
							this=assignedGames[m][me][2:]
							if this not in gamesSoFar:
								gamesSoFar.append(this)
							this=assignedGames[m][partner][2:]
							if this not in gamesSoFar:
								gamesSoFar.append(this)

						if "PD" in gamesSoFar and "BO" in gamesSoFar and "SH" in gamesSoFar:
							stillPossible=0
						else:
							l=0
							while l=0
							this=random.choice(range(len(allGames)))
							if allGames[this][:2] not in gamesSoFar:
								assignedGames[a][me]=allGames[this]
								assignedGames[a][partner]=allGames[this]
								del allGames[this]
								l=1

		total=0
		for a in range(totalMatches):
			for b in range(totalMatches):
				if a<b:
					# print [x[:2] for x,y in zip(assignedGames[a],assignedGames[b])]
					# print [y[:2] for x,y in zip(assignedGames[a],assignedGames[b])]
					# print [int(x[:2]==y[:2]) for x,y in zip(assignedGames[a],assignedGames[b])]
					total=total+sum([int(x[:2]==y[:2]) for x,y in zip(assignedGames[a],assignedGames[b])])
		if total<best:
			best=total
			print "best",best
		if total==0:
			break


	for k in assignedGames:
		print k

	raw_input() 



j=0
while 3<4:
	j=j+1
	print j
	matching=getNonoverlappingMatching(totalSubjects,totalMatches)
	allGames=[totalSubjects*games][0][:totalSubjects*totalMatches/2]
	random.shuffle(allGames)
	assignedGames=[[0 for k in x] for x in matching]
	for a in range(len(matching)):
		for b in range(len(matching[a])):
			me=b
			partner=matching[a][b]
			if assignedGames[a][b]==0:
				thisGame=allGames.pop()
				assignedGames[a][me]=thisGame
				assignedGames[a][partner]=thisGame

	good=1
	for a in range(totalMatches):
		for b in range(totalMatches):
			if a<b:
				# print [x[:2] for x,y in zip(assignedGames[a],assignedGames[b])]
				# print [y[:2] for x,y in zip(assignedGames[a],assignedGames[b])]
				# print [int(x[:2]==y[:2]) for x,y in zip(assignedGames[a],assignedGames[b])]

				if sum([int(x[:2]==y[:2]) for x,y in zip(assignedGames[a],assignedGames[b])])>0:#someone plays same game twice
					good=0
	if good==1:
		break

for k in assignedGames:
	print k

raw_input() 
print assignedGames

print assignedGames
# random.shuffle(lst)
# for x in lst:
#   # ...
# If you really need the remainder (which is a bit of a code smell, IMHO), at least you can pop() from the end of the list now (which is fast!):

# while lst:
#   x = lst.pop()



# for k in range(totalMatches);
# 	match[k]=[x for x in range(totalSubjects)]
# 	random.shuffle(match[k])

# # matches
# # subjects

# # matching