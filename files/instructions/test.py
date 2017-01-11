

def f(x,y):
	print x,y

z={"x":1,"y":2,"a":2}

f(**z)

# raw_input() 
# y={**{"a":4},**{"b":5}}

# print y
# raw_input() 

# x=[3,4]
# y="%s,%s"% tuple(x)
# print y
# raw_input() 


# def f(x,y,z):
# 	print x,y,z
# 	print args

# f(2,**{'y':3,'z':4})
# raw_input() 


# class Test():
# 	def __init__(d):
# 		"do Nothing"
# 	def f(self,funcName,args):
# 		method = getattr(self,funcName)
# 		method(**args)

# 	def g(self,y,z):
# 		print y,z


# test=Test()



# d={"funcName":"g","args":{"y":2,"z":3}}
# test.f(**d)