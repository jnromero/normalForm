import time
from os import system


system("say --quality=127 --rate=180 -o output.aac -v 'Tom' -f input.txt")

raw_input() 


import subprocess, time, tempfile, re

pipe_output, file_name = tempfile.TemporaryFile()
cmd = "say --rate=15 'hello my name is alex, and I am a computer' --interactive"

p = subprocess.Popen(cmd, stdout=pipe_output, 
                     stderr=subprocess.STDOUT)
while p.poll() is None:
    # p.poll() returns None while the program is still running
    # sleep for 1 second
    time.sleep(1)
    last_line =  open(file_name).readlines()
    # it's possible that it hasn't output yet, so continue
    if len(last_line) == 0: continue
    last_line = last_line[-1]
    # Matching to "[bytes downloaded]  number%  [speed] number:number:number"
    match_it = re.match(".* ([0-9]*)%.* ([0-9]*:[0-9]*:[0-9]*).*", last_line)
    if not match_it: continue
    # in this case, the percentage is stored in match_it.group(1), 
    # time in match_it.group(2).  We could do something with it here...

raw_input() 
raw_input() 

import subprocess, time, os, sys
subprocess.Popen(['say', "'hello my name is alex, and I am a computer'",'--interactive'], shell=False,stdin=subprocess.PIPE,stderr=subprocess.PIPE,stdout=subprocess.PIPE)

for line in p.stdout:
    print(">>> " + str(line.rstrip()))
    p.stdout.flush()

raw_input() 
raw_input() 
raw_input() 

test=system('say "hello my name is alex, and I am a computer" --interactive')

raw_input() 
raw_input() 
raw_input() 
raw_input() 
raw_input() 
filename='test.txt'
file = open(filename,'r')
fileData=file.read()
file.close() 

for k in range(100):
	fileData=fileData.replace("\n\n","\n")
	fileData=fileData.replace("  "," ")
fileData=fileData.replace("\n"," ")

system("say --rate=180 -o /Users/jnr/Desktop/hello2.aac -v 'Alex' -f test.txt")

filename='captions.srt'
file = open(filename,'w')
file.writelines("")
file.close() 

fileData=fileData.split(" ")

index=1
totalTime=0
while len(fileData)>0:
	for k in range(5,100):
		thisString=""
		for j in fileData[:k]:
			thisString=thisString+j+" "

		start=time.time()
		system("say --rate=180 '"+thisString+"'")
		thisTime=time.time()-start
		if thisTime>3 or len(thisString)>100:
			print thisTime,thisString
			fileData=fileData[k:]
			filename='captions.srt'
			file = open(filename,'a')

			oldMinutes=int(round((totalTime-totalTime%60)/60))
			oldSeconds=totalTime-60*oldMinutes
			totalTime=totalTime+thisTime
			minutes=int(round((totalTime-totalTime%60)/60))
			seconds=totalTime-60*minutes
			
			oldTime="00:%02d:%06.3f"%(oldMinutes,oldSeconds)
			newTime="00:%02d:%06.3f"%(minutes,seconds)
			file.writelines("%s\n%s --> %s\n%s\n\n"%(index,oldTime.replace(".",","),newTime.replace(".",","),thisString))
			file.close() 
			index=index+1

			break



# import scikits.audiolab

# aiff_file = scikits.audiolab.Sndfile('/Users/jnr/Desktop/hello2.aiff')
# print aiff_file.nframes / float(aiff_file.samplerate)

# import aifc

# filename='/Users/jnr/Desktop/hello2.aiff'
# fileData = aifc.open(filename,'r')

# print fileData.getnchannels()