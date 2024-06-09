#!/usr/bin/python3

# rmvod_cli.py

# vod_api.py  Copyright 2024 Paul Tourville

# This file is part of RIBBBITmedia VideoOnDemand (a.k.a. "rmvod").

# RIBBBITmedia VideoOnDemand (a.k.a. "rmvod") is free software: you 
# can redistribute it and/or modify it under the terms of the GNU \
# General Public License as published by the Free Software Foundation, 
# either version 3 of the License, or (at your option) any later 
# version.

# RIBBBITmedia VideoOnDemand (a.k.a. "rmvod") is distributed in the 
# hope that it will be useful, but WITHOUT ANY WARRANTY; without even 
# the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
# PURPOSE. See the GNU General Public License for more details.

# You should have received a copy of the GNU General Public License 
# along with RIBBBITmedia VideoOnDemand (a.k.a. "rmvod"). If not, 
# see <https://www.gnu.org/licenses/>.



# This is a wrapper for the API code which allows CLI access to some of
# the functions in the API

# The plan is that this will accept a JSON string to allow population 
# of values needed to allow the command to move forward.  This will 
# allow cron jobs and other non-interactive modes of execution to 
# perform the tasks (such as user creation or recommendations updates) 
# without step-by-step inputs, as with a menu.

# from rmvod_api import *
import os
import yaml
import json
import requests
import argparse
import configparser
import time
#from datetime import datetime
import datetime

# RMVODAPICLI is a thin compatability layer that simplifies making 
# calls to the RMVOD API and giving back results.  This is suited for 
# doing things via cron jobs and such.
class RMVODAPICLI:
    def __init__(self):
        self.apiBaseUrl = "http://rmvid/rmvod/api"
        self.pfep_dict = {}
        self.pfep_dict['recgen'] = "/artifact/recs/get"
        self.pfep_dict['statsget'] = "/site/stats/get"
        self.pfep_dict['urepsget'] = "/user/recent/episodes/get"
        self.pfep_dict['cfgget'] = "/config/get"
        self.pfep_dict['artiupd'] = "/artifact/update"
        self.pfep_dict['mfsget'] = "/mfsearch/get"
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        # self.pfep_dict[''] = ""
        
        pass
    def lookupPrefabEndpoints(self,pfep_in):
        retval = None
        try:
            retval = self.pfep_dict[pfep_in]
        except:
            # In production, this is not a thing we need to worry about.
            # print(pfep_in  + " is not a pre-defined endpoint abbreviation")
            pass
        return retval
    def execApiCall(self,epIn,jsonBodyIn):
        uri = self.apiBaseUrl + epIn
        # print(uri)
        # print(jsonBodyIn)
        jsonDict = yaml.safe_load(jsonBodyIn)
        # print(jsonDict)
        r = requests.post(uri, json=jsonDict)
        # print(r.text)
        return yaml.safe_load(r.text)
    def execEPwArgs(self,epIn,jsonBodyIn):
        pass
    def statsten(self):
        rData = self.execApiCall('/site/stats/get','\'{"days":10}\'')
        print(json.dumps(rData))
        #print(retdict['data']['listings']['tvseries']['tags'].keys())
        # for lEl in list(rData['data']['listings']['tvseries']['tags']):
            # print(lEl + ": " + str(rData['data']['listings']['tvseries']['tags'][lEl]['count']))
        return
        
# MLCLIMenu is a way of providing an interactive way to connect to the 
# RMVOD API to make updates and run queries
class MLCLIMenu:
    def __init__(self):
        # self.ml = MediaLibraryDB()
        self.apiBaseUrl = "http://rmvid/rmvod/api"
        # self.api = RMVODAPICLI()
        # self.api.apiBaseUrl = "http://rmvid/rmvod/api"
        self.mainMenuList = []
        self.mainMenuList.append({'label':'Get Site Config Parameters','detail':'Get Site Config Parameters','func':self.getSiteConfig})
        self.mainMenuList.append({'label':'Get an Artifact by ID','detail':'Get an Artifact by ID','func':self.getArtifact})
        self.mainMenuList.append({'label':'Get an Artifacts by Tag','detail':'Get an Artifacts by Tag','func':self.getArtifactsByTag})
        self.mainMenuList.append({'label':'Remove "new" Tag by age','detail':'Remove "new" Tag by age','func':self.removeNewTagByAge})
        # self.mainMenuList.append({'label':'','detail':'','func':self.function})
        self.mainMenuList.append({'label':'Exit','detail':'','func':self.doExit})
        
        
        
        # self.mainMenuList.append({'label':'Create new Artifact','detail':'Create new Artifact','func':self.doNewArti})
        # self.mainMenuList.append({'label':'Create new Artifacts from a File List','detail':'Create new Artifacts from a File List','func':self.doNewArtisFromFile})
        # self.mainMenuList.append({'label':'List Available Tags','detail':'List Available Tags','func':self.listTags})
        # self.mainMenuList.append({'label':'Create New Tag','detail':'Create New Tag','func':self.doNewTag})
        # self.mainMenuList.append({'label':"Get Artifacts By Tag",'detail':'Get Artifacts By Tag','func':self.artiByTag})
        # self.mainMenuList.append({'label':"Get Artifacts By Search String",'detail':'Get Artifacts By Search String','func':self.srchArtiByTitle})
        # self.mainMenuList.append({'label':"Get Artifacts Detail By ID",'detail':'Get Artifacts Detail By ID','func':self.srchArtiDetailById})
        # self.mainMenuList.append({'label':'Edit Artifact By ID','detail':'Edit Artifact By ID','func':self.doEditArtiById}) #doEditArtiById
        # self.mainMenuList.append({'label':'Add Tag to Artifact','detail':'Add Tag to Artifact','func':self.doTagToArti})
        # self.mainMenuList.append({'label':'Add Tag to TV Series','detail':'Add Tag to TV Series','func':self.doTagToSeries})
        # self.mainMenuList.append({'label':'Remove Tag from Artifact','detail':'Remove Tag from Artifact','func':self.doTagFromArti})
        # # self.mainMenuList.append({'label':'Emergency Title Fix','detail':'string','func':self.doTitleFix})
        # # self.mainMenuList.append({'label':'Save Library','detail':'Save Library','func':self.doSaveLib})
        # self.mainMenuList.append({'label':'Fetch some Artifact details from API','detail':'string','func':self.doArtiDeetApiFetch})
        # self.mainMenuList.append({'label':'Add missing IIMDB ID','detail':'Add missing IIMDB ID','func':self.doAddMissingImdbid})
        # self.mainMenuList.append({'label':'Update Arti Deets from OMDBAPI data','detail':'Update Arti Deets from OMDBAPI data','func':self.doUpdateArtiFromOmdb})
        # self.mainMenuList.append({'label':'string','detail':'string','func':None})
        
        self.libDirty = False
        pass
    def __artiEditForm(self,artiDictIn):
        retDict = copy.deepcopy(artiDictIn)
        tmpArtiDict = copy.deepcopy(artiDictIn)
        aProtoKeys = list(tmpArtiDict.keys())
        del aProtoKeys[aProtoKeys.index('artifactid')]
        print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        for aKey in aProtoKeys:
            tmpVal = input('Enter ' + aKey + ' for this Artifact\n  (<Enter> to accept default value: ' + str(tmpArtiDict[aKey]) + ')\n  Your value: ')
            print(tmpVal)
            if (tmpVal == ''):
                continue
            
            if (type(tmpArtiDict[aKey]) == type('string')):
                # Do the string thing
                tmpArtiDict[aKey] = tmpVal.strip()
                pass
            else:
                # Do some other magic for the Prototype's type
                print('Handle ' + tmpVal + ' as ' + str(type(tmpArtiDict[aKey])))
                if (type(tmpArtiDict[aKey]) == type(-1)):
                    tmpArtiDict[aKey] = int(tmpVal)
                elif (type(tmpArtiDict[aKey]) == type([])):
                    ### THIS REALLY OUGHT TO HAVE A TRY/EXCEPT ON IT
                    tmpArtiDict[aKey] = json.loads(tmpVal)  # list(tmpVal)
                elif (type(tmpArtiDict[aKey]) == type({})):
                    ### THIS REALLY OUGHT TO HAVE A TRY/EXCEPT ON IT
                    tmpArtiDict[aKey] = json.loads(tmpVal)  # dict(tmpVal)
                elif (type(tmpArtiDict[aKey]) == type(False)):
                    tmpArtiDict[aKey] = bool(tmpVal)
                elif (type(tmpArtiDict[aKey]) == type(3.14)):
                    tmpArtiDict[aKey] = float(tmpVal)
                else:
                    print('IDK WTF')
                pass
            pass
            print('')
        pass
        return tmpArtiDict
    def apiConnect(self):
        api = RMVODAPICLI()
        api.apiBaseUrl = self.apiBaseUrl
        return api
    def mainMenuPreso(self):
        print('Media Library Main Menu')
        print('=-=-=-=-=-=-=-=-=-=-=-=')
        mmIdx = 0
        mmLen = len(self.mainMenuList)
        for mmIdx in range(0,mmLen):
            print(str(mmIdx) + ') ' + self.mainMenuList[mmIdx]['label'])
        pass
        print('')
        retval = input('Select a number from the options above:')
        return retval
    def mainMenuSelInterp(self,selectionIn):
        retval = True
        noodle = self.mainMenuList[int(selectionIn)]['func']
        retval = noodle()
        return retval
    def mainLoop(self):
        contYN = True
        while (contYN == True):
            userSelection = self.mainMenuPreso()
            contYN = self.mainMenuSelInterp(userSelection)
        pass
        return False
    def dispSimpleDictKVP(self,dictIn,indent=""):
        parmKeys = list(dictIn.keys())
        for parmKey in parmKeys:
            parmVal = str(dictIn[parmKey])
            if type(parmVal) == type({"foo":"bar"}):
                parmVal = json.dumps(parmDict[parmKey])
            elif type(parmVal) == type([1,2]):
                parmVal = json.dumps(parmDict[parmKey])
            print(indent + parmKey + ": " + parmVal)
        return None
    def getSiteConfig(self):
        #api = RMVODAPICLI()
        ep = "/config/get"
        json = '{}'
        resp = self.apiConnect().execApiCall(ep,json)
        try:
            dataDict = resp["data"]
            sectKeys = list(dataDict.keys())
            for sectKey in sectKeys:
                print(sectKey + ":")
                self.dispSimpleDictKVP(dataDict[sectKey],"  ")
                print()
            print("Done.")
        except:
            print("Oppsie-poopsie!  Something broke!")
        return True
    def getArtifact(self): # b013a2e4-a681-4312-bba0-2e476782fe1b
        ep = "/artifact/get"
        wrkDict = {}
        wrkDict['artifactid'] = input("Enter your Artifact ID: ")
        jsonStr = json.dumps(wrkDict)
        resp = self.apiConnect().execApiCall(ep,jsonStr)
        print(json.dumps(resp))
        try:
            dataDict = resp['data'][0]
            self.dispSimpleDictKVP(dataDict,"")
        except:
            print("Oopsie-poopsie!")
        return True
    def getArtifactsByTag(self):
        ep = "/titleidlist/get"
        wrkDict = {}
        wrkDict['tag'] = input("Enter your Tag: ")
        jsonStr = json.dumps(wrkDict)
        resp = self.apiConnect().execApiCall(ep,jsonStr)
        #print(json.dumps(resp))
        artiDictList = resp['data']
        print ("Artifact ID | Title | Major Type")
        for artiDict in artiDictList:
            print(artiDict['artifactid'] + " - " + artiDict['title'] + " (" + artiDict['majtype'] + ")") 
        return True
    def removeNewTagByAge(self):
        # Get a list of artifacts with the "new" Tag
        itsOldDays = 90
        print("Removing 'new' Tag from Artifacts added more than " + str(itsOldDays) + " days ago.")
        print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        ep = "/titleidlist/get"
        wrkDict = {}
        wrkDict['tag'] = "new" #input("Enter your Tag: ")
        jsonStr = json.dumps(wrkDict)
        resp = self.apiConnect().execApiCall(ep,jsonStr)
        artiDictList = resp['data']
        for artiDict in artiDictList:
            print("Checking Artifact " + artiDict['title'])
            ep2 = "/artifact/get"
            wrkDict2 = {}
            wrkDict2['artifactid'] = artiDict['artifactid']
            jsonStr2 = json.dumps(wrkDict2)
            resp2 = self.apiConnect().execApiCall(ep2,jsonStr2)  
            fullArti = resp2['data'][0]
            arbMetaDict = yaml.safe_load(fullArti['arbmeta'])
            try:
                addDt = str(arbMetaDict['addeddt']).split(" ")[0]
                d1 = datetime.date.today()
                d2 = datetime.date.fromisoformat(addDt)
                newAge = abs((d2 - d1).days)
                if newAge > itsOldDays:
                    print(fullArti['title'] + " was added " + str(newAge) + " days ago.  Remove the 'new' Tag.")
                    oldTagsList = fullArti['tags']
                    oldTagsList.remove('new')
                    updateDict = {"artifactid": fullArti["artifactid"],"values":{"tags": oldTagsList}}
                    ep3 = "/artifact/update"
                    jsonStr3 = json.dumps(updateDict)
                    resp3 = self.apiConnect().execApiCall(ep3,jsonStr3)
                    if resp3['status']['success'] == True:
                        print("OK")
                    else:
                        print("Oh noes.")
            except:
                print("Oopsie-poopsie")
            pass
        pass
        print('-=-=-=-=-=-  END  =-=-=-=-=-=\n')
        return True
    def doExit(self):
        # if (self.libDirty == True):
            # saveYN = input("Save before exit (y/N)? ")
            # if (saveYN in ['y','Y']):
                # print(str(self.doSaveLib()))
            # pass
        # pass
        return False
    def boneyard():  # Just a place to keep all the commented code without takingup a ton of vertical space
        assert False
    # def artiByTag(self):
        # tagStr = input("Enter your tag: ")
        # print('\nArtifacts for Tag ' + tagStr + ':')
        # print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        # pLineList = []
        # try:
            # artiList = self.ml.getArtifactsByTag(tagStr)
            # for arti in artiList:
                # print(arti['title'] + ' (' + arti['artifactid'] + ')')
                # pLineList.append(arti['title'])
            # pass
        # except:
            # print('Operation failed')
        # print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        # return True
    # def srchArtiByTitle(self):
        # srchStr = input("Enter your Title search string: ")
        # print('\nArtifacts for search string ' + srchStr + ':')
        # print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        # pLineList = []
        # try:
            # artiList = self.ml.findArtifactsByName(srchStr)
            # for arti in artiList:
                # print(arti['title'] + ' (' + arti['artifactid'] + ')')
                # pLineList.append(arti['title'])
            # pass
        # except:
            # print('Operation failed')
        # print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        # return True
        # return self.fakeFunc()
    # def srchArtiDetailById(self):
        # artiIdStr = input('Enter the ID: ')
        
        # aDict = self.ml.getArtifactById(artiIdStr)
        # tList = [] 
        
        # print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        # print("Artifact details: " + str(aDict))
        # print("\nTags associated: " + str(tList))
        # print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        # return self.fakeFunc()
    # def listTags(self):
        # tagList = self.ml.getTagList()
        # print("\nAvailable Tags")
        # print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        # print(str(tagList))
        # print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        # return self.fakeFunc()
    # def doTagToArti(self):
        # tagStr = input('Enter the tag: ')
        # titleStr = input('Enter the Title of the Artifact: ')
        # tagOK = self.ml.findTag(tagStr)
        # artiList = self.ml.findArtifactsByName(titleStr)
        # print(str(tagOK))
        # print(str(artiList))
        # if ((tagOK > -1) and (len(artiList) > 0)):
            # # Tag provided is OK and we have artifact(s) to work with
            # taggedList = []
            # for artiDict in artiList:
                # aId = artiDict['artifactid']
                # taRes = self.ml.addTagtoArtifact(tagStr,aId)
                # if (taRes == True):
                    # taggedList.append(artiDict['name'])
                # pass
            # pass
            # print('Tagged ' + str(len(taggedList)) + ' artifacts.')
            # self.libDirty = True
        # else:
            # # Tag provided is poop or there are no artifacts
            # print('Tag provided is poop or there are no artifacts')
        # pass
        # return True
    # def doTagToSeries(self):
        # tagStr = input('Enter the tag: ')
        # serArtiId = input('Enter the Artifact ID of the Series: ')
        # self.ml.addTagToSeries(tagStr,serArtiId)
        # return True
    # def doTagFromArti(self):
        # tagStr = input('Enter the tag: ')
        # titleStr = input('Enter the Title of the Artifact: ')
        # tagOK = self.ml.findTag(tagStr)
        # artiList = self.ml.findArtifactsByName(titleStr)
        # print(str(tagOK))
        # print(str(artiList))
        # if ((tagOK > -1) and (len(artiList) > 0)):
            # # Tag provided is OK and we have artifact(s) to work with
            # taggedList = []
            # for artiDict in artiList:
                # aId = artiDict['artifactid']
                # taRes = self.ml.removeTagFromArtifact(tagStr,aId)
                # if (taRes == True):
                    # taggedList.append(artiDict['name'])
                # pass
            # pass
            # print('Tagged ' + str(len(taggedList)) + ' artifacts.')
            # pass
            # self.libDirty = True
        # else:
            # # Tag provided is poop or there are no artifacts
            # print('Tag provided is poop or there are no artifacts')
        # pass
        # return True
    # def doNewArti(self):
        # tmpArtiDict = self.__artiEditForm(self.ml.getArtifactPrototype())
        # print(str(tmpArtiDict))
        # print(str(self.ml.createArtifact(tmpArtiDict)))
        # self.libDirty = True
        # print('\n-=-=-=-=-=- END =-=-=-=-=-=\n')
        # return True
    # def doNewArtisFromFile(self):
        
        # # We want to take in:
         # # a FQ path to a file which contains a list of ".m4v" files
         # # a relative file path where the files listed in the list file can be found
         # # an optional "starter tag" to apply to all Artifacts created for the files
         # # an optional "majtype" value to apply to all  all Artifacts created for the files
        # # Load the "file list" file, and iterate over the list:
         # # for each filename:
          # # create a new Artifact, and set its "file" to the value from the "file list" file
          # # set optional "majtype" if given
          # # run through the list of keys for the Artifact
          # # save the artifact to the Library
          # # if an optional "starter tag" was provided, apply it
          # # give an opportunity to apply further tags (<Enter> if none)
        # # Remind the user to save the library.
        # flfFQSpec = None
        # artiFilePath = None
        
        # stepOK = False
        # while stepOK == False:
            # flfFQSpec = input("Please provide a fully-qualified filespec for the \nList File: ")
            # if os.path.exists(flfFQSpec):
                # stepOK = True
            # else:
                # print(">> File " + flfFQSpec + " not found.  Try again.")
            # pass
        # pass
        # stepOK = False
        # while stepOK == False:
            # artiFilePath = input("Please provide an Artifact \nRelative Path: ")
            
            # validOK = False
            # # Do some validation
            # if type(artiFilePath) == type("string"):
                # if artiFilePath != "":
                    # validOK = True
                # pass
            # if validOK == True:
                # stepOK = True
            # pass
        # pass
        # stepOK = False
        # while stepOK == False:
            # artiFirstTag = input(">OPTIONAL< Please provide an Artifact \nStarter Tag (or <Enter> to skip): ")
            # if artiFirstTag == "":
                # # SKIP!
                # stepOK = True
            # else:
                # validOK = False
                # # Some validation, maybe?!
                # if type(artiFirstTag) == type("string"):
                    # if artiFirstTag != "":
                        # #We should make sure the tag is valid!
                        # tagOK = self.ml.findTag(artiFirstTag)
                        # if tagOK > -1:
                            # validOK = True
                        # pass
                    # pass
                # if validOK == True:
                    # stepOK = True
                # pass
            # pass
        # pass
        # stepOK = False
        # while stepOK == False:
            # artiMajTyp = input(">OPTIONAL< Please provide an Artifact \nMajor Type (or <Enter> to skip): ")
            # if artiMajTyp == "":
                # # SKIP!
                # stepOK = True
            # else:
                # validOK = False
                # # Some validation, maybe?!
                # if type(artiMajTyp) == type("string"):
                    # if artiMajTyp != "":
                        # validOK = True
                    # pass #                validOK = True
                # if validOK == True:
                    # stepOK = True
                # pass
            # pass
        # pass
        # stepOK = False
        # perArtiDetail = False
        # while stepOK == False:
            # detailResp = input("Enter individual details per-artifact?\n(y/N): ")
            # if detailResp == "y" or detailResp == "Y":
                # # SKIP!
                # perArtiDetail = True
                # stepOK = True
            # else:
                # stepOK = True
                # pass
            # pass
        # pass
        
        # # Bring in the file list
        # flfContList = []
        # try:
            # fh2 = open(flfFQSpec,'r')
            # for line in fh2:
                # flfContList.append(line.strip())
            # fh2.close()
        # except IOError as error:
            # print('File Sad: ' + str(error))
        # else:
            # pass
        # finally:
            # pass
        # pass        
        
        # # Iterate over the list of File List Files
        # for flfFileName in flfContList:
            # print("\n====>> BEGIN - File " + flfFileName + "\n")
            # # Create the Artifact and preload known values
            # thisArtiDict = self.ml.getArtifactPrototype()
            # thisArtiDict['file'] = flfFileName
            # thisArtiDict['filepath'] = artiFilePath
            # if (type(artiMajTyp) == type("string")):
                # if (artiMajTyp != ""):
                    # thisArtiDict['majtype'] = artiMajTyp
                # pass
            # pass
            
            # if perArtiDetail == True:
                # # Run the form
                # tmpArtiDict = self.__artiEditForm(thisArtiDict)
            # else:
                # tmpArtiDict = thisArtiDict
                # thisArtiDict['title'] = flfFileName
            # pass
            
            # # Store the Artifact
            # thisArtiId = self.ml.createArtifact(tmpArtiDict)
            
            # # Add Starter Tag
            # if (type(artiFirstTag) == type("string")):
                # if (artiFirstTag != ""):
                    # taRes = self.ml.addTagtoArtifact(artiFirstTag,thisArtiId)
                # pass
            # pass
            
            # # Opportunity to add more tag(s)
            # # COMING SOON!  WATCH THIS SPACE!
            # pass
            
            # print("\n====>> END - File " + flfFileName + "\n")
            
        # pass
 
        # print("\n\nOK, that's it!\nPLEASE make sure you save the library to ensure\nall this hard work won't be lost!\n\n")       
        
        # return self.fakeFunc()
    # def doEditArtiById(self):
        # artiIdStr = input('Enter the ID: ')
        # aDict = self.ml.getArtifactById(artiIdStr)
        # tList = self.ml.getTagList()
        # artiEditedDict = self.__artiEditForm(aDict)
        # print("artiEditedDict: " + str(artiEditedDict))
        # result = self.ml.modifyArtifact(artiIdStr,artiEditedDict)
        # print("self.ml.modifyArtifact result: " + str(result))
        # return self.fakeFunc()
    # def doNewTag(self):
        # newTagStr = input("Enter your new Tag: ")
        # self.libDirty = True
        # return self.ml.createTag(newTagStr)
    # def doSaveLib(self):
        # print("Saving the library...")
        # print(str(self.ml.saveLibraryToFile()))
        # self.libDirty = False
        # return True
    # def doArtiDeetApiFetch(self):
        # print("cli.doArtiDeetApiFetch")
        # self.ml.fetchDeetsFromApi()
        # return True
    # def doAddMissingImdbid(self):
        # reqDict = self.ml.getArtifactLackingImdbid('movie')
        # imdbidIn = input("Enter IMDB ID value for Artifact " + reqDict['title'] + ": ")
        # self.ml.updateArtifactImdbid(reqDict['artifactid'],imdbidIn)
        # cont1yn = input("Continue with OMDBAPI fetch?\n[ y / N ]: ")
        # if cont1yn in ['y','Y']:
            # self.ml.fetchDeetsFromApi()
            # cont2yn = input("Continue with Artifact details update from OMDBAPI data?\n[ y / N ]: ")
            # if cont2yn in ['y','Y']:
                # self.ml.updateArtiDeetsFromOmdb(reqDict['artifactid'])
            # pass
        # pass
        # return True
    # def doUpdateArtiFromOmdb(self):
        # artiId = input("doUpdateArtiFromOmdb - Input\nArtifact ID: ")
        # self.ml.updateArtiDeetsFromOmdb(artiId)
        # return True
        return None
    def fakeFunc(self):
        return True





if __name__ == '__main__':
    descText = """This is a console-based API client for the RIBBBIT media Video On Demand (RMVOD) system."""
    #parser = argparse.ArgumentParser(description='This is a console-based API client for the RIBBBIT media Video On Demand (RMVOD) system.')
    parser = argparse.ArgumentParser(description=descText)
    # Switch
    parser.add_argument('base_uri', type=str, help="""The Base URI for the API Endpoint you wish to reach.  It should be fully-qualified, and end with no slash, such as: http://rmvid/rmvod/api""")
    parser.add_argument('endpoint', type=str, help="""The API Endpoint you wish to reach.  It should start with a slash, and express the remainder of the path to the endpoint, such as: /site/stats/get""")
    parser.add_argument('body_json', type=str, help="""The JSON String to pass to the Endpoint.  It must be single-quote encolsed  valid JSON with strings within the JSON being double-qoute enclosed and any single- or double-quotes in those strings properly escaped with one (or more as apropriate) backslash ('\\') each, such as: '{"clientid": "353f7b11-f379-4828-9d52-4e7e8b0086e8"}'  For endpoints that do not require JSON input, an empty object ( '{}' ) is still required for this UI""")
    args = parser.parse_args()
    
    doit = RMVODAPICLI()
    #doit.apiBaseUrl = "http://rmvid/rmvod/api"
    doit.apiBaseUrl = args.base_uri
    wrkEP = args.endpoint
    if (wrkEP == "menu"):
        pass
        print("This is where we would do an interactive menu thingy")
        menu = MLCLIMenu()
        menu.mainLoop()
    elif (wrkEP == "expnew"):
        menu = MLCLIMenu()
        menu.removeNewTagByAge()
    else:
        tmpEPSC = doit.lookupPrefabEndpoints(args.endpoint)
        if tmpEPSC != None:
            wrkEP = tmpEPSC
        # print(wrkEP)
        try:
            interDict = yaml.safe_load(args.body_json)
            goodJson = json.dumps(interDict)
            print(json.dumps(doit.execApiCall(wrkEP,goodJson)))
        except:
            # print("poop")
            raise Exception("Could not complete API Call")
        pass
    pass
    
# ./rmvod_cli.py "/site/stats/get" '{"days": 10}'
# ./rmvod_cli.py "/user/recent/episodes/get" '{"clientid": "353f7b11-f379-4828-9d52-4e7e8b0086e8"}'
# ./rmvod_cli.py "/config/get" '{}'
# ./rmvod_cli.py "/artifact/recs/get" '{"clientId": "353f7b11-f379-4828-9d52-4e7e8b0086e8","forceRefresh": true, "sinceDt": "2024-03-01 00:00:00", "recLimit": 20}'
# ./rmvod_cli.py mfsget {"tag":"new","string":"","majtype":"","relyear":"","sqlwhere":"", "relyearstart":"", "relyearend":""}
