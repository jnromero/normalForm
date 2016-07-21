#!/usr/bin/python

import urllib
import time


filename='input.txt'
fileInput = open(filename,'r')
inputData=fileInput.read()
fileInput.close() 

import re

for k in re.findall(r"\[\[slnc\ [0-9]+\]\]", inputData):
	inputData=inputData.replace(k,"")
inputData=inputData.replace("\n"," ")
inputData=inputData.replace("  "," ")


filename='taskList.txt'
taskFile = open(filename,'r')
taskData=taskFile.read()
taskFile.close() 
tasks=taskData.split("\n")
tasks=[x.split("+++") for x in tasks if x[:2]!="//"]


lastfound=-1
tasksFound=[]
for k in re.findall(r"\[\[[0-9]*\]\]", inputData):
	lastfound=inputData.find(str(k),lastfound+1)
	number=int(k.replace("[[","").replace("]]",""))
	if number=="":
		number=1
	tasksFound.append([lastfound,number])

filename='output.txt'
file = open(filename,'r')
fileData=file.read()
file.close() 

javascriptString="window.instructionsList=["
taskListIndex=0
taskIndex=0
lastTaskTime=0
lastWord=0
tasksFoundIndex=0

[0]
for k in fileData.split("\n"):
	this=k.split("\t")
	print this
	if len(this)>1:
		lastWord=inputData.find(this[1],lastWord)
		print lastWord
		if tasksFoundIndex<len(tasksFound):
			nextEntry=tasksFound[tasksFoundIndex]
			if nextEntry[0]<lastWord:
				totalExtraTime=0
				for j in range(nextEntry[1]):
					print nextEntry
					print taskListIndex,len(tasks),taskIndex
					if taskListIndex<len(tasks):
						if len(tasks[taskListIndex])>1:
							extraTime=int(tasks[taskListIndex][1])
							print extraTime,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
						else:
							extraTime=0
						javascriptString="%s[%s,%s,%s],"%(javascriptString,int(1000*(float(this[0])-lastTaskTime))+extraTime,tasks[taskListIndex][0],int(1000*(float(this[0])))+extraTime)
						print "[%s,%s],"%(int(1000*(float(this[0])-lastTaskTime))+extraTime,tasks[taskListIndex][0])
						lastTaskTime=float(this[0])
						totalExtraTime=totalExtraTime+extraTime
						taskListIndex=taskListIndex+1
				print lastTaskTime
				lastTaskTime=lastTaskTime+float(totalExtraTime)/1000
				print lastTaskTime
				tasksFoundIndex=tasksFoundIndex+1
javascriptString=javascriptString+"]"

import simplejson as sj
filename='taskList.js'
file = open(filename,'w')
#file.writelines(sj.dumps(javascriptString))
file.writelines(javascriptString)
file.close() 

string=""
lines=fileData.split("\n")
this=lines[0].split("\t")
globalStart=float(this[0])
start=globalStart
thisString=""
j=1



taskIndex=0
words=[]
times=[]
lastTime=0
for k in fileData.split("\n"):
	if len(k)>0:
		this=k.split("\t")
		if this[1]=="." or this[1]==",":
			words[-1]=words[-1]+this[1]
		else:

			while this[1].find("/")>-1:
				print "[%s,%s],"%(int(1000*(float(this[0])-lastTime)),tasks[taskIndex])
				taskIndex=taskIndex+1
				lastTime=float(this[0])

				this[1]=this[1].replace("/","",1)

			if this[1]=="/":
				"do nothing"
			else:
				words.append(this[1].replace("/",""))
				times.append(float(this[0]))

out=[]

print words
print times
thisString=""
start=times[0]
for k in range(len(words)):
	if words[k]=="." or words[k]==",":
		thisString=thisString[:-1]+words[k]+" "
	else:
		thisString=thisString+words[k]+" "

	stop=0
	if words[k]=="." and len(thisString)>20:
		stop=1
	elif len(thisString)>50:
		stop=1

	if k<len(words)-1:
		if words[k+1]==".":
			stop=0
		elif words[k+1]==",":
			stop=0

	
	if stop==1:
		print thisString,times[k]-start
		out.append([thisString,times[k],times[k]-start])
		thisString=""
		start=times[k]

string=""
string2="window.captions=["
j=1
for k in out:
	oldTime=k[1]-k[2]
	newTime=k[1]
	oldTimeMinutes=int(round(float(oldTime-oldTime%60)/60))
	newTimeMinutes=int(round(float(newTime-newTime%60)/60))
	oldTimeString="00:%02d:%06.3f"%(oldTimeMinutes,oldTime-oldTimeMinutes*60)
	newTimeString="00:%02d:%06.3f"%(newTimeMinutes,newTime-newTimeMinutes*60)
	string=string+"%s\n%s --> %s\n%s\n\n"%(j,oldTimeString.replace(".",","),newTimeString.replace(".",","),k[0])
	string2=string2+"['%s',%.02f,%.02f],"%(k[0],k[2],k[1])
	j=j+1
string2=string2[:-1]+"]"

filename='captions.srt'
file = open(filename,'w')
file.writelines(string)
file.close() 

filename='captionsList.js'
file = open(filename,'w')
file.writelines(string2)
file.close() 