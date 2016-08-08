#!/usr/bin/python

import pickle
import os
scriptPath=os.path.dirname(os.path.realpath(__file__))

def defaultSettings(location,configFile,serverStartString):
	config={}

	config['packageFolder']="/steep/"
	config['currentExperiment']="/normalForm/"
	config['screenServerPort']=1234

	if location=="myComputer":
		config['webServerRoot']="/Users/myUsername/experiments/"
		config['serverType']="regularExperiment"	
		config['serverPort']=2345
		config['webSocketPort']=3456
		ip="localhost"
		config["domain"]="http://"+ip+":"+str(config['serverPort'])
		config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
		config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	# elif location=="labComputer":
	# 	config['webServerRoot']="/Users/labAdmin/myUsername/experiments/"
	# 	config['serverType']="regularExperiment"	
	# 	config['serverPort']=4567
	# 	config['webSocketPort']=5678
	# 	ip="12.345.67.89"
	# 	config["domain"]="http://"+ip+":"+str(config['serverPort'])
	# 	config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
	# 	config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])

	config["location"]=location

	config=setOtherFileLocations(config,serverStartString)
	writeJavascriptConfigFile(config,configFile)
	return config



def setOtherFileLocations(config,serverStartString):
	config['dataFolder']=config['currentExperiment']+"/data/"+serverStartString+"/"
	if not os.path.exists(config['webServerRoot']+config['dataFolder']):
		os.makedirs(config['webServerRoot']+config['dataFolder'])

	config['configJsURL']=config['domain']+config['dataFolder']+"/config.js"
	config['configJsPath']=config['webServerRoot']+config['dataFolder']+"/config.js"

	config['dataFileURL']=config['domain']+config['dataFolder']+"/%s.pickle"%(serverStartString)
	config['dataFilePath']=config['webServerRoot']+config['dataFolder']+"/%s.pickle"%(serverStartString)
	return config

def writeJavascriptConfigFile(config,configFile):
	string="//Config File Location: %s\n"%(configFile)
	string=string+"window.config=%s;"%(config)
	file = open(config['configJsPath'],'w')
	file.writelines(string)
	file.close() 
