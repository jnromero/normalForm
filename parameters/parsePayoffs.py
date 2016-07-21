import random
import pickle
import sys
filename='files/%s-unparsed.pickle'%(sys.argv[1])
file = open(filename,'rb')
dataIN=pickle.load(file)
file.close() 




games=["PDL","PDH","BOL","BOH","SHL","SHH","SDL","SDH"]


#				CC			CD 		DC			DD	


import random

totalMatches=4
match={}


dataOut={}

dataOut['games']={}
dataOut['games']["PDL"]={1:{1:[30,30],2:[19,31]},2:{1:[31,19],2:[20,20]}}#30
dataOut['games']["PDH"]={1:{1:[30,30],2:[1,49]},2:{1:[49,1],2:[20,20]}}#20
dataOut['games']["BOL"]={1:{1:[10,10],2:[29,31]},2:{1:[31,29],2:[10,10]}}#30
dataOut['games']["BOH"]={1:{1:[10,10],2:[11,49]},2:{1:[49,11],2:[10,10]}}#30
dataOut['games']["SHL"]={1:{1:[30,30],2:[9,11]},2:{1:[11,9],2:[10,10]}}#
dataOut['games']["SHH"]={1:{1:[30,30],2:[-9,29]},2:{1:[29,-9],2:[10,10]}}
dataOut['games']["SDL"]={1:{1:[20,20],2:[20,20]},2:{1:[59,21],2:[21,59]}}#
dataOut['games']["SDH"]={1:{1:[20,20],2:[20,20]},2:{1:[41,39],2:[39,41]}}

for subs in dataIN:
	dataOut[subs]={}
	for sub in range(subs):
		dataOut[subs][sub]={}
		for m in range(totalMatches):
			dataOut[subs][sub][m]={}

	for sub in dataIN[subs]['pairs']:
		for match in range(totalMatches):
			dataOut[subs][sub][match]['groups']=dataIN[subs]['groups'][sub][match]
			dataOut[subs][sub][match]['roles']=dataIN[subs]['roles'][sub][match]
			dataOut[subs][sub][match]['game']=dataIN[subs]['games'][sub][match]+dataIN[subs]['pays'][sub][match]
			dataOut[subs][sub][match]['game']

	gameLengths=[123,94,110,85]
	random.shuffle(gameLengths)
	dataOut['supergameLengths']={}
	for m in range(totalMatches):
		dataOut['supergameLengths'][m]=gameLengths[m]




print dataOut

import pickle
filename='files/%s-matching.pickle'%(sys.argv[1])
file = open(filename,'wb')
pickle.dump(dataOut,file)
file.close() 






