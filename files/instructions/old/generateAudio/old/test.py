import time
from os import system





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


say "Hello! This is the computer talking." --interactive >> outfile & while true ; do date +%T.%T.%N.%N >> outfile ; done


>> outfile & while true ; do date +%T.%N >> outfile ; done