filename='output.txt'
file = open(filename,'r')
fileData=file.read()
file.close() 

lines=fileData.split("\n")
for k in range(len(lines)-2):
	this=lines[k].split("\t")
	this2=lines[k+1].split("\t")
	print this
	print float(this[0])-float(this2[0])