#!/usr/bin/python

import pickle
import os
scriptPath=os.path.dirname(os.path.realpath(__file__))

def defaultSettings(location,configFile,serverStartString):
	config={}

	config['packageFolder']="/steep/"
	config['currentExperiment']="/normalForm/20160712/"
	# config['instructionsFolder']="/files/instructions/"
	# config['instructionsTexFile']="/latex/instructions.tex"
	# config['quiz']=True
	config["location"]=location
	config['screenServerPort']=15374

	if location=="local":
		config['webServerRoot']="/Users/jnr/Dropbox/Sites/jnromero.com/Experiments/"
		config['serverType']="regularExperiment"	
		config['serverPort']=24921
		config['webSocketPort']=13557
		ip="localhost"
		config["domain"]="http://"+ip+":"+str(config['serverPort'])
		config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
		config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	elif location=="esl":
		config['webServerRoot']="/Users/jnr/Dropbox/Sites/jnromero.com/Experiments/"
		config['serverType']="regularExperiment"	
		config['serverPort']=24921
		config['webSocketPort']=13557
		ip="10.128.228.70"
		config["domain"]="http://"+ip+":"+str(config['serverPort'])
		config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
		config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	elif location=="webf":
		config['webServerRoot']="/home/jnromero/Sites/jnromero.com/Experiments/"
		config['serverType']="regularExperiment"	
		config['serverPort']=24921
		config['webSocketPort']=13557
		config["domain"]="http://jnromero.com/experiment"
		config["websocketURL"]='ws://jnromero.com/webSockets/mainExperiment'
		config["screenServer"]="http://jnromero.com/screenServer/"
	elif location=="localDemo":
		config['webServerRoot']="/Users/jnr/Dropbox/Sites/jnromero.com/Experiments/"
		config['serverType']="demoExperiment"	
		config['serverPort']=18268
		config['webSocketPort']=13237
		ip="localhost"
		config["domain"]="http://"+ip+":"+str(config['serverPort'])
		config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
		config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	elif location=="webfDemo":
		config['webServerRoot']="/home/jnromero/Sites/jnromero.com/Experiments/"
		config['serverType']="demoExperiment"	
		config['serverPort']=18268
		config['webSocketPort']=13237
		config["domain"]="http://jnromero.com/experiments/demos/normalForm"
		config["websocketURL"]='ws://jnromero.com/webSockets/demos/normalForm'
		config["screenServer"]="http://jnromero.com/screenServer/"

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
