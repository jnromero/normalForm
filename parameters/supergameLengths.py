import random

for match in range(5):
	period=1
	rn=1
	while 3<4:
		if random.random()<.01:
			break
		period=period+1
	print match,period



x=[86,122,80,67,142]
print x
randomPeriod=random.choice(range(sum(x)))+1
print randomPeriod
print "self.data['random30PeriodBlockStart']=%s"%(randomPeriod)
total=0
match=0
for k in x:
	match=match+1
	if randomPeriod>total and randomPeriod<=total+k:
		print "self.data['random30PeriodBlockStartMatch']=%s"%(match)
		print "self.data['random30PeriodBlockStartPeriod']=%s"%(k-(total+k-randomPeriod))
		print match,k-(total+k-randomPeriod)
	total=total+k

# string=""
# for k in range(40):
# 	string=string+"['%.01f','%.01f'],"%(4-float(k)/10,4-float(k)/10)
# print string