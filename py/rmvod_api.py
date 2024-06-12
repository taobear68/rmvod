#!/usr/bin/python3

import argparse

from flask import Flask
from flask import request

app = Flask(__name__)

import pymysql
import copy
import json
import uuid
import base64
import os
import yaml
import requests
import configparser

import re
import time

from datetime import datetime

# rmvod_api.py  Copyright 2022, 2023, 2024 Paul Tourville

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

#fileStr = "vodLibrarydb.py"
fileStr = "rmvod_api.py"
versionStr = "0.9.2"

# moving to "proper" deployment via WSGI:  https://flask.palletsprojects.com/en/2.0.x/deploying/mod_wsgi/
class VodLibDB:
    def __init__(self):
        self.dbc = {}
        self.dbc['host'] = 'localhost'
        self.dbc['user'] = 'vodlibapi'
        self.dbc['password'] = 'vodlibapipw'
        self.dbc['database'] = 'vodlib'
        
        self.keylists = {}
        self.keylists['artifact'] = ['artifactid','title','majtype','runmins','season','episode','file','filepath','director','writer','primcast','relorg','relyear','eidrid','imdbid','arbmeta']
        pass
    def _connect(self):
        dbc = pymysql.connect(host=self.dbc['host'],user=self.dbc['user'],password=self.dbc['password'],database=self.dbc['database'])
        return dbc
        pass
    def _stdRead(self,sqlIn):
        data = None
        try:
            assert sqlIn.split(" ")[0].upper() == "SELECT"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            data = cursor.fetchall()
            dbc.close()
        except:
            print("Poop")
        return data
    def _stdUpdate(self,sqlIn):
        retval = None
        try:
            assert sqlIn.split(" ")[0].upper() == "UPDATE"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            dbc.commit()
            dbc.close()
            pass
        except:
            print("_stdUpdate Poop: " + sqlIn)
            raise Exception("Update failed!")
        return retval
    def _stdInsert(self,sqlIn):
        retval = None
        try:
            assert sqlIn.split(" ")[0].upper() == "INSERT"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            dbc.commit()
            dbc.close()
            pass
        except:
            print("_stdInsert Poop : " + sqlIn)
        return retval
    def _stdDelete(self,sqlIn):
        retval = None
        try:
            assert sqlIn.split(" ")[0].upper() == "DELETE"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            dbc.commit()
            dbc.close()
            pass
        except:
            print("_stdDelete: Poop")
        return retval
    def getDBVersion(self):
        return "0.9.2" # Table playlog_live added 
    def fetchArtiDeetsFromOmdbapi(self):
        print("vldb.fetchArtiDeetsFromOmdbapi")
        maxRows = 10
        selSql = 'SELECT artifactid, title, majtype, imdbid, arbmeta '
        selSql += 'FROM artifacts '
        selSql += 'WHERE imdbid != "string" AND arbmeta = \'{"string": "string"}\' '
        selSql += 'ORDER BY title LIMIT ' + str(maxRows) + ';'
        rowsTuple = None
        try:
            rowsTuple = self._stdRead(selSql)
        except:
            print("Source list query failed!")
            return False
        pass
        
        for rowTuple in rowsTuple:
            aId = rowTuple[0]
            aTitle = rowTuple[1]
            aMajtype = rowTuple[2]
            aImdbid = rowTuple[3]
            aArbmeta = rowTuple[4]
            
            uri = "https://www.omdbapi.com/?i=" +  imdbIdIn
            try:
                uri = "https://www.omdbapi.com/?apikey=" + self.config['API_Resources']['omdbapi_key'] + "&i=" +  imdbIdIn
                print(uri)
            except:
                print("No OMDBAPI Key set.  Access to resources may be limited.  See https://www.omdbapi.com/ for details.")
            pass
            
            response = requests.get(uri)
            try:
                jsonStr = json.dumps(response.json()).replace("'","\\\'")
            except:
                print("json.dumps failed for " + aImdbid + ".  Skipping")
                continue
            pass
            
            updSql = "UPDATE artifacts SET arbmeta = '" + jsonStr + "' WHERE artifactid = '" + aId + "'"
            if True == True:
                try:
                    self._stdUpdate(updSql)
                except:
                    print("Update failed for " + aTitle + " (" + aId + ")")
                pass
            else:
                print(api_url +  " -- " + jsonStr)
            pass
        pass
        return True
    def createArtifact(self,artiDictIn):
        retval = None
        
        artiProto = {}
        artiProto['artifactid'] = 'string'
        artiProto['title'] = 'string'
        artiProto['majtype'] = 'string'
        artiProto['runmins'] = -1
        artiProto['season'] = -1
        artiProto['episode'] = -1
        artiProto['file'] = 'string'
        artiProto['filepath'] = 'string'
        artiProto['director'] = ['string']
        artiProto['writer'] = ['string']
        artiProto['primcast'] = ['string']
        artiProto['relorg'] = ['string'] 
        artiProto['relyear'] = -1
        artiProto['eidrid'] = 'string'
        artiProto['imdbid'] = 'string'
        artiProto['arbmeta'] = {'string':'string'}
        
        # Prototype artifact keys list
        apKeys = list(artiProto.keys())
        
        # "new" artifact keys list
        naKeys = list(artiDictIn.keys())
        
        try:
            assert type(artiDictIn) == type({'this':'that'})
            print("Dict OK")
            assert type(artiDictIn['artifactid']) == type("string")
            print("ID Type OK")
            print(len(artiDictIn['artifactid']))
            assert 32 < len(artiDictIn['artifactid']) < 40
            print("ID Length OK")
            assert type(artiDictIn['title']) == type("string")
            print("Title Type OK")
            assert 1 < len(artiDictIn['title']) < 200
            print("Title Length OK")
        except:
            print("createArtifact - Basic dictionary validation failed on '" + str(artiDictIn) + "'")
            return False
        pass
        
        
        sqlSetStr = ""
        sqlInsSetStr = ""
        
        # Preload the artifact ID so the insert will have it.
        artiProto['artifactid'] = artiDictIn['artifactid']
        
        for key in apKeys:
            valTyp = type(artiProto[key])
            if valTyp == type("string"):
                sqlInsSetStr += key + ' = ' + "'" + artiProto[key] + "'"
            elif valTyp == type(-1):
                sqlInsSetStr += key + ' = ' + str(artiProto[key])
            elif valTyp == type(3.14):
                sqlInsSetStr += key + ' = ' + str(artiProto[key])
            elif valTyp == type(['string']):
                sqlInsSetStr += key + ' = ' +  "'" + json.dumps(artiProto[key]) + "'"
            elif valTyp == type({'string':'string'}):
                sqlInsSetStr += key + ' = ' +  "'" + json.dumps(artiProto[key]) + "'"
            else:
                raise Exception("Illegal Value Type in artiProto")
            pass
                
            #sqlInsSetStr += key + ' = ' + artiProto[key]
            if key in naKeys:
                # validate new value
                if type(artiDictIn[key]) == type(artiProto[key]):
                    artiProto[key] = artiDictIn[key]
                else:
                    pass
                pass
            pass
            
            valTyp = type(artiProto[key])
            if valTyp == type("string"):
                sqlSetStr += key + ' = ' + artiProto[key]
            elif valTyp == type(-1):
                sqlSetStr += key + ' = ' + str(artiProto[key])
            elif valTyp == type(3.14):
                sqlSetStr += key + ' = ' + str(artiProto[key])
            elif valTyp == type(['string']):
                sqlSetStr += key + ' = ' + json.dumps(artiProto[key])
            elif valTyp == type({'string':'string'}):
                sqlSetStr += key + ' = ' + json.dumps(artiProto[key])
            else:
                raise Exception("Illegal Value Type in artiProto 2: Electric Boogaloo!")
            pass
            
            
            if apKeys.index(key) < (len(apKeys) - 1):
                sqlSetStr += ", "
                sqlInsSetStr += ", "
            else:
                sqlSetStr += " "
                sqlInsSetStr += " "
            pass
        pass
        
        insertSql = "INSERT INTO artifacts SET " + sqlInsSetStr + ";"
        print ("VodLibDB.createArtifact: " + insertSql)
        try:
            self._stdInsert(insertSql)
        except:
            raise Exception("New Artifact Insert failed")
            return False
        pass
        
        try:
            self.updateArtifactByIdAndDict(artiDictIn['artifactid'],artiProto)
            retval = True
        except:
            raise Exception("New Artifact Update failed")
            return False
        pass
        
        return retval
    def createPerson(self,persNameIn):
        retval = None
        # Confirm the Person exists in the 'persons' table
        persCheckSql = 'SELECT personname FROM persons WHERE personname = "' + persNameIn + '"'
        # print(persCheckSql)
        resTuple = self._stdRead(persCheckSql)
        # If not there, add it
        if (type(resTuple) == type(None)) or (len(resTuple) == 0):
            # It's not there
            persAddSql = 'INSERT INTO persons  SET personname = "' + persNameIn + '"'
            self._stdInsert(persAddSql)
        pass
        return retval
    def createCompany(self,compNameIn):
        retval = None
        # Confirm the Company exists in the 'companies' table
        compCheckSql = 'SELECT companyname FROM companies WHERE companyname = "' + compNameIn + '"'
        resTuple = self._stdRead(compCheckSql)
        # If not there, add it
        if (type(resTuple) == type(None)) or (len(resTuple) == 0):
            # It's not there
            compAddSql = 'INSERT INTO companies  SET companyname = "' + compNameIn + '"'
            self._stdInsert(compAddSql)
        return retval
    def createTag(self,tagNameIn):
        retval = None
        tagAddSql = 'INSERT INTO tags  SET tag = "' + tagNameIn + '"'
        retval = self._stdInsert(tagAddSql)
        return retval
    def createArtiText(self,artiIdIn,fieldNmIn,contentIn):
        insSql = "INSERT INTO artitexts SET artifactid = '" + artiIdIn 
        insSql += "', artifield = '" + fieldNmIn 
        insSql += "', artitext = '" + contentIn + "'"
        retval = self._stdInsert(insSql)
        return retval
    def getArtifactTagsById(self,artiIdIn):
        retList = [];
        tagSql = "SELECT tag FROM t2a WHERE artifactid = '" + artiIdIn + "'"
        resTuple = self._stdRead(tagSql)
        for res in resTuple:
            retList.append(res[0])
        return retList
    def getArtifactSubListsById(self,artiIdIn):
        retDict = {'director':[],'writer':[],'primcast':[],'relorg':[]}
        personSql = "SELECT personname, artifactid, artifield FROM p2a WHERE artifactid = '" + artiIdIn + "'"
        companySql = "SELECT companyname, artifactid, artifield FROM c2a WHERE artifactid = '" + artiIdIn + "'"
        personResult = self._stdRead(personSql)
        companyResult = self._stdRead(companySql)
        for person in personResult:
            name = person[0]
            field = person[2]
            retDict[field].append(name)
        for company in companyResult:
            name = company[0]
            field = company[2]
            retDict[field].append(name)
        return retDict
    def getSeriesStats(self,artiIdIn):
        sqlStr = """SELECT r.title, COUNT(s.episodeaid) AS "episodes", COUNT(DISTINCT a.season) AS "seasons" 
FROM s2e s  
JOIN artifacts a ON s.episodeaid = a.artifactid 
JOIN artifacts r ON s.seriesaid = r.artifactid 
WHERE s.seriesaid = '""" + artiIdIn + """' """

        retDict = {"episodes":-1,"seasons":-1}
        try:
            pass
            baseTuple = self._stdRead(sqlStr)
            # +-------+----------+---------+
            # | title | episodes | seasons |
            # +-------+----------+---------+
            # | QI    |      185 |      13 |
            # +-------+----------+---------+
            retDict["episodes"] = baseTuple[0][1]
            retDict["seasons"] = baseTuple[0][2]

        except:
            pass
            print("getSeriesStats failed for Artifact ID " + artiIdIn)
        
        
        pass
        return retDict
    def getArtifactById(self,artiIdIn,listJsonFlagIn=False):
        keyList = self.keylists['artifact']
        sqlStr = "SELECT " 
        fListStr = ""
        for key in keyList:
            fListStr += key + ", "
        sqlStr += fListStr[0:-2]
        sqlStr += " FROM artifacts WHERE artifactid = '" + artiIdIn + "'"
        
        baseTuple = self._stdRead(sqlStr)
        retList = []
        for record in baseTuple:
            # Get the core of the record
            retDict = {}
            for key in keyList:
                keyIdx = keyList.index(key)
                retDict[key] = record[keyIdx]
            pass
            # Get the "list elements"
            listFieldDict = self.getArtifactSubListsById(artiIdIn)
            lfdKeys = list(listFieldDict.keys())
            for lfdKey in lfdKeys:
                if listJsonFlagIn == False:
                    retDict[lfdKey] = listFieldDict[lfdKey]
                else:
                    retDict[lfdKey] = json.dumps(listFieldDict[lfdKey])
                pass
            pass
            
            # Get Episode and Season Counts
            if retDict['majtype'] == 'tvseries':
                serStatDict = self.getSeriesStats(artiIdIn)
                retDict['seasons'] = serStatDict['seasons']
                retDict['episodes'] = serStatDict['episodes']
                pass
            
            # Get the tags
            tagList = self.getArtifactTagsById(artiIdIn)
            if listJsonFlagIn == False:
                retDict['tags'] = tagList
            else:
                retDict['tags'] = json.dumps(tagList)
            pass
            
            textsSql = 'SELECT artifield, artitext FROM artitexts WHERE artifactid = "'
            textsSql += artiIdIn
            textsSql += '"'
            rowsTuple = self._stdRead(textsSql)
            for rowTuple in rowsTuple:
                retDict[rowTuple[0]] = rowTuple[1]
            
            retList.append(retDict)
        pass
        return retList
    def getArtifactListByTagList(self,tagListIn):
        retval = None
        assert type(tagListIn) == type(['thing'])
        if len(tagListIn) > 0:
            fetchSql = "SELECT t.artifactid, a.title, a.majtype "
            fetchSql += "FROM t2a  t "
            fetchSql += "JOIN artifacts  a ON a.artifactid = t.artifactid "
            tagListStr = ''
            tliLen = len(tagListIn)
            for tag in tagListIn:
                tagListStr += "'" + tag + "'"
                if tagListIn.index(tag) < (tliLen - 1):
                    tagListStr += ', '
                else:
                    tagListStr += ' '
                pass
            pass
            
            fetchSql += "WHERE t.tag IN (" + tagListStr + ")"
        else:
            fetchSql = "SELECT a.artifactid, a.title, a.majtype "
            fetchSql += "FROM artifacts  a "
        pass
        
        fetchSql += "ORDER BY a.title"
        
        listTuple = self._stdRead(fetchSql)
        
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        
        return retList
    def getArtifactListByMajtype(self,majtypeStrIn):
        assert type(majtypeStrIn) == type('thing')
        if len(majtypeStrIn) > 0:
            fetchSql = '';
            fetchSql += "SELECT artifactid, title, majtype "
            fetchSql += "FROM artifacts "
            fetchSql += "WHERE majtype = '" + majtypeStrIn + "' "
        else:
            fetchSql = "SELECT artifactid, title, majtype "
            fetchSql += "FROM artifacts  "
        pass
        fetchSql += "ORDER BY title"
        listTuple = self._stdRead(fetchSql)
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        pass
        return retList
    def getArtifactListByIdList(self,artiIdListIn):
        assert type(artiIdListIn) == type(['thing'])
        if len(artiIdListIn) > 0:
            fetchSql = '';
            fetchSql += "SELECT artifactid, title, majtype "
            fetchSql += "FROM artifacts "
            fetchSql += "WHERE artifactid in ("
            i = 0
            for artiId in artiIdListIn:
                fetchSql += "'" + artiId + "'"
                if (i < (len(artiIdListIn) - 1 )):
                    fetchSql += ','
                pass
                i += 1
            fetchSql += ') ' 
        else:
            fetchSql = "SELECT artifactid, title, majtype "
            fetchSql += "FROM artifacts  "
        pass
        fetchSql += "ORDER BY title"
        listTuple = self._stdRead(fetchSql)
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        pass
        return retList
    def getArtifactListByArbWhereClause(self,whereClauseStrIn):
        assert type(whereClauseStrIn) == type('thing')
        if len(whereClauseStrIn) > 0:
            fetchSql = '';
            fetchSql += "SELECT artifactid, title, majtype "
            fetchSql += " FROM artifacts "
            fetchSql += " WHERE " + whereClauseStrIn + " "
        else:
            fetchSql = "SELECT artifactid, title, majtype "
            fetchSql += "FROM artifacts  "
        pass
        fetchSql += " ORDER BY title"
        print("getArtifactListByArbWhereClause - fetchSql: " + fetchSql)
        listTuple = self._stdRead(fetchSql)
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        pass
        return retList
    def getArtifactListByRelyear(self,relyear1In, relyear2In):
        fetchSql = "SELECT artifactid, title, majtype "
        fetchSql += "FROM artifacts  "
        fetchSql += "ORDER BY title"
        try:
            if (int(relyear1In) > 1900) and  (int(relyear2In) > 1900) and (int(relyear2In) > int(relyear1In)): 
                # We're working with both years
                pass
                fetchSql = "SELECT artifactid, title, majtype "
                fetchSql += " FROM artifacts  "
                fetchSql += " WHERE relyear >= " + str(relyear1In) + " AND relyear <= " + str(relyear2In) + " "
                fetchSql += " ORDER BY title"
            elif (int(relyear2In) > 1900):
                # We're just doing one year, so we're counting on relyear2In
                pass
                fetchSql = "SELECT artifactid, title, majtype "
                fetchSql += " FROM artifacts  "
                fetchSql += " WHERE relyear = " + str(relyear2In) + " "
                fetchSql += " ORDER BY title"
            else: 
                raise Exception("getArtifactListByRelyear - Unable to interpret dates")
            pass
        except:
            print ("getArtifactListByRelyear - Something is broken with the year values provided: " + str(relyear1In) + " and " + str(relyear2In) + ".")
            pass
        pass
        listTuple = self._stdRead(fetchSql)
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        pass
        return retList
    def getArtifactListByTitleFrag(self,titleFragIn):
        retval = None
        assert type(titleFragIn) == type("string")
        fetchSql = "SELECT a.artifactid, a.title, a.majtype "
        fetchSql += "FROM artifacts  a "
        fetchSql += "WHERE a.title LIKE '%" + titleFragIn + "%'"
        fetchSql += "ORDER BY a.title"
        listTuple = self._stdRead(fetchSql)
        
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        pass
        return retList
    def getArtifactListByPersTitleStr(self,titleFragIn):  ####  NEW NEW NEW  
        retval = None
        
        wrkTitleFrag = str(titleFragIn)
        print('getArtifactListByPersTitleStr.wrkTitleFrag: ' + wrkTitleFrag)
        #assert type(titleFragIn) == type("string")
        
        
        fetchSql = 'SELECT p.artifactid AS "artifactid", a.title AS "title", a.majtype AS "majtype" ' 
        fetchSql += 'FROM p2a p ' 
        fetchSql += 'JOIN artifacts a ON p.artifactid = a.artifactid '
        fetchSql += 'WHERE p.personname LIKE "%' + wrkTitleFrag + '%" '
        
        fetchSql += 'UNION '
        
        fetchSql += 'SELECT a.artifactid AS "artifactid" , a.title AS "title", a.majtype AS "majtype" '  
        fetchSql += 'FROM artifacts a '
        fetchSql += 'WHERE a.title LIKE "%' + wrkTitleFrag + '%" '
        
        fetchSql += 'ORDER BY 2'
            
        print(fetchSql)
        listTuple = self._stdRead(fetchSql)
        
        retList = []
        for itemTuple in listTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['majtype'] = itemTuple[2]
            retList.append(tmpDict)
        pass
        return retList
    def getEpisodeListBySeriesId(self,sEpiIdIn):
        fetchSql = "SELECT episodeaid FROM s2e WHERE seriesaid = '" + sEpiIdIn + "'";
        resTuple = self._stdRead(fetchSql)
        resList = [];
        for itemTuple in resTuple:
            resList.append(itemTuple[0])
        pass
        return resList
    def getNextEpisodeArtifact(self,sEpiIdIn):
        retDict = {}
        selSql = "SELECT DISTINCT a.artifactid "
        selSql += "FROM artifacts a "
        selSql += "JOIN s2e s ON a.artifactid = s.episodeaid "
        selSql += "WHERE s.seriesaid = (select seriesaid from s2e where episodeaid = '"
        selSql += sEpiIdIn
        selSql += "' LIMIT 1) " 
        selSql += "ORDER BY a.title;"  
        rowsTuple = self._stdRead(selSql)
        idList = []
        for rowTuple in rowsTuple:
            idList.append(rowTuple[0])
        pass
        lastEpIdx = idList.index(sEpiIdIn)
        retList = []
        if lastEpIdx < (len(idList) - 1) :
            nextEpId = idList[lastEpIdx + 1]
            retList = self.getArtifactById(nextEpId,False)
        pass
        return retList
    def getEpisodeTIMListBySeriesId(self,sEpiIdIn):
        fetchSql = "SELECT a.artifactid, a.title, a.majtype "
        fetchSql += " FROM artifacts  a "
        fetchSql += " WHERE a.artifactid IN ("
        fetchSql += " SELECT episodeaid FROM s2e WHERE seriesaid = '" + sEpiIdIn + "') " 
        try:
            fetchSql += "ORDER BY a.title"
        
            resTuple = self._stdRead(fetchSql)
            retList = []
            for itemTuple in resTuple:
                tmpDict = {}
                tmpDict['artifactid'] = itemTuple[0]
                tmpDict['title'] = itemTuple[1]
                tmpDict['majtype'] = itemTuple[2]
                retList.append(tmpDict)
            pass
        except:
            print("getEpisodeTIMListBySeriesId - Secondary query failed!")
            print("getEpisodeTIMListBySeriesId - epiArtiIdList: " + str(len(epiArtiIdList)))
            print ("getEpisodeTIMListBySeriesId - fetchSql: \n" + fetchSql)
        pass
        return retList
    def getTagList(self):
        retval = None
        try:
            tagSQL = "SELECT tag FROM tags ORDER BY tag"
            rowsTuple = self._stdRead(tagSQL)
            tagList = []
            for row in rowsTuple:
                tagList.append(row[0])
            retval = tagList
        except:
            print("getTagList - POOP")
        return retval
    def getSupportList(self,tableNameIn):
        retval = None
        slSql = ''
        if tableNameIn == 'persons':
            slSql = 'SELECT personname FROM persons ORDER BY personname'
        elif tableNameIn == 'companies':
            slSql = 'SELECT companyname FROM companies ORDER BY companyname'
        elif tableNameIn == 'tags':
            slSql = 'SELECT tag FROM tags ORDER BY tag'
        else:
            print (str(tableNameIn) + ' is invalid')
            return retval
            
        try:
            rowsTuple = self._stdRead(slSql)
            itemList = []
            for row in rowsTuple:
                itemList.append(row[0])
            retval = itemList
        except:
            print("getSupportList - POOP")
        return retval
    def findTag(self,tagNmIn):
        retval = None
        sqlStr = "SELECT tag FROM tags WHERE tag LIKE '%" + tagNmIn + "%'"
        resTuple = self._stdRead(sqlStr)
        resList = []
        for row in resTuple:
            resList.append(row[0])
        pass
        retval = resList
        return retval
    def addTagtoArtifact(self,tagStrIn,artiIdIn):
        retval = None
        self.createTag(tagStrIn)
        tagSql = "INSERT INTO t2a SET tag = '" + tagStrIn + "', artifactid = '" + artiIdIn + "'"
        self._stdInsert(tagSql)
        return retval
    def updateJoinTable(self,artiIdin,keyIn,tableIn,valListIn):
        # We're going to simplify this... Clear out the values for thi
        # table, artifactid, and fieldname, then insert the ones 
        # provided.  This is taking a more declarative approach.  The 
        # expectation is that the full current list will be provided for 
        # all updates.  This COULD be tedious or ropy for very long lists
        # but most movies have fairly constrained director, writer, and 
        # distribution company lists.  Their primary casts are usually 
        # not that big either.  We'll take the hit on big lists.
        
        # updateJoinTable: c539d5b6-316e-4c61-93d6-29613d15ef5d, tags, t2a, ['horror', 'science_fiction', 'thriller', 'world_war_2']
        # 127.0.0.1 - - [11/Oct/2022 13:34:30] "POST /artifact/update HTTP/1.1" 200 -
        
        
        retval = None
        if tableIn == 'p2a':
            p2aPreClearSql = 'DELETE FROM p2a WHERE artifactid = "'
            p2aPreClearSql += artiIdin
            p2aPreClearSql += '" AND artifield = "'
            p2aPreClearSql += keyIn
            p2aPreClearSql += '"'
            self._stdDelete(p2aPreClearSql)
            for val in valListIn:
                self.createPerson(val)
                p2aInsSql = 'INSERT INTO p2a SET personname = "'
                p2aInsSql += val
                p2aInsSql += '", artifactid = "'
                p2aInsSql += artiIdin
                p2aInsSql += '", artifield = "'
                p2aInsSql += keyIn
                p2aInsSql += '"'
                self._stdInsert(p2aInsSql)
                pass
            pass
        elif tableIn == 'c2a':
            c2aPreClearSql = 'DELETE FROM c2a WHERE artifactid = "'
            c2aPreClearSql += artiIdin
            c2aPreClearSql += '" AND artifield = "'
            c2aPreClearSql += keyIn
            c2aPreClearSql += '"'
            self._stdDelete(c2aPreClearSql)
            for val in valListIn:
                self.createCompany(val)
                
                c2aInsSql = 'INSERT INTO c2a SET companyname = "'
                c2aInsSql += val
                c2aInsSql += '", artifactid = "'
                c2aInsSql += artiIdin
                c2aInsSql += '", artifield = "'
                c2aInsSql += keyIn
                c2aInsSql += '"'
                self._stdInsert(c2aInsSql)
                pass
            pass
        elif tableIn == 't2a':
            t2aPreClearSql = 'DELETE FROM t2a WHERE artifactid = "'
            t2aPreClearSql += artiIdin
            t2aPreClearSql += '"'
            self._stdDelete(t2aPreClearSql)
            for val in valListIn:
                self.createTag(val)
                
                t2aInsSql = 'INSERT INTO t2a SET tag = "'
                t2aInsSql += val
                t2aInsSql += '", artifactid = "'
                t2aInsSql += artiIdin
                t2aInsSql += '"'
                self._stdInsert(t2aInsSql)
                pass
            pass
        elif tableIn == 'artitexts':
            atUpdateSql = 'INSERT INTO artitexts VALUES ("'
            atUpdateSql += artiIdin
            atUpdateSql += '","'
            atUpdateSql += keyIn
            atUpdateSql += '","'
            atUpdateSql += valListIn[0]
            atUpdateSql += '") ON DUPLICATE KEY UPDATE artitext = "'
            atUpdateSql += valListIn[0]
            atUpdateSql += '"'
            # print('updateJoinTable: ' + atUpdateSql)
            self._stdInsert(atUpdateSql)
        else:
            print('updateJoinTable - Unknown table type: ' + tableIn)
        pass
        return retval
    def updateArtifactByIdAndDict(self,artiIdIn,updateDictIn):
        # keyList is the reference key list from "self"
        keyList = self.keylists['artifact']
        # workingUD is the "working" Update Dictionary
        workingUD = {}
        # workingTagsList should be obvious
        workingTagsList = []
        
        # diKeys is the list of keys in updateDictIn
        # Among other things, we will use this to identifiy
        # fields which are handled outside the "artifacts" table 
        diKeys = list(updateDictIn.keys())
        
        #  We're building up workingUD to include only those KVPs
        # represented in keyList 
        for rKey in keyList:
            if rKey in diKeys:
                workingUD[rKey] = updateDictIn[rKey]
            pass
        pass
        
        # Put tags (if any) in workingTagsList for separate handling
        if "tags" in diKeys:
            for udiTag in updateDictIn['tags']:
                workingTagsList.append(udiTag)
            pass
        pass
        
        # Set up join table references
        joinTableFieldList = ['director','writer','primcast','relorg','synopsis','tags']
        joinTableLUDict = {'director':'p2a','writer':'p2a','primcast':'p2a','relorg':'c2a','synopsis':'artitexts','tags':'t2a'}
        
        # Start setting up the UPDATE SQL for the artifacts table
        workingArtiSql = ""
        
        # get the list of keys from the workingUD dictionary, since
        # we should be done populating it now
        # "Working Artifact Key List"
        # wakList = list(workingUD.keys())
        wakList = list(updateDictIn.keys())
        
        #  Now, let's build up the daWKList - this is the keys for 
        # fields we will actually be updating natively in the artifact.
        daWAKList = []
        for key in wakList:
            if key not in joinTableFieldList:
                daWAKList.append(key)
            pass
        pass
        
        # Process the artifact fields
        if len(daWAKList) > 0:
            # print('going to try to build up workingArtiSql')
            # Start setting up the UPDATE SQL for the artifacts table
            workingArtiSql = "UPDATE artifacts SET "
            for daWKey in daWAKList:
                wakVal = workingUD[daWKey]
                workingArtiSql += daWKey + ' = ' 
                wakValTyp = type(wakVal)
                
                # Handle different value types
                if wakValTyp == type('string'):
                    workingArtiSql += "'" + wakVal.replace("'","\\\'") + "'"
                elif wakValTyp == type(-1):
                    workingArtiSql +=  str(wakVal) 
                elif wakValTyp == type(3.14):
                    workingArtiSql +=  str(wakVal) 
                elif wakValTyp == type(['poop']):
                    # Actually, all the lists have been farmed out to 
                    # joining tables, so... this needs to be more complex
                    workingArtiSql +=  "'" + json.dumps(wakVal) + "'"
                elif wakValTyp == type({'poop':'poop'}):
                    workingArtiSql +=  "'" + json.dumps(wakVal) + "'" 
                else:
                    print(daWKey + ' UNKNOWN! WTF?!')
                    raise Exception ('UNHANDLED TYPE')
                pass
                if daWAKList.index(daWKey) < (len(daWAKList) - 1):
                    workingArtiSql += ', '
                pass
            workingArtiSql += " WHERE artifactid = '" + artiIdIn + "'"
            self._stdUpdate(workingArtiSql)
        pass
        
        for wak in wakList:
            if wak in joinTableFieldList:
                #This is where we handle "join table keys"
                newVal = updateDictIn[wak]
                jTable = joinTableLUDict[wak]
                if jTable == 'artitexts':
                    newVal = [updateDictIn[wak]]
                self.updateJoinTable(artiIdIn,wak,jTable,newVal)
                pass
            pass
        pass
        
        # Update the Artifact
        pass
    def deleteArtifact(self,artiIdIn):
        retval = None
        tblNmList = ['artifacts','c2a','p2a','t2a']
        for tblNm in tblNmList:
            try:
                delArtiSql = "DELETE FROM "
                delArtiSql += tblNm
                delArtiSql += " WHERE artifactid = '"
                delArtiSql += artiIdIn
                delArtiSql += "'"
                self._stdDelete(delArtiSql)
            except:
                print("Delete of " + artiIdIn + " from " + tblNm + " FAILED")
                retval = False
            pass
        pass
        if retval == None:
            retval = True
        pass
        return retval
    def removeTagFromArtifact(self,artiIdIn,tagStrIn):
        retval = None
        try:
            pass
            delArtiTagSql = "DELETE FROM "
            delArtiTagSql += "t2a"
            delArtiTagSql += " WHERE artifactid = '"
            delArtiTagSql += artiIdIn
            delArtiTagSql += "' AND tag = '"
            delArtiTagSql += tagStrIn
            delArtiTagSql += "'"
            self._stdDelete(delArtiTagSql)
        except:
            print('POOP! removeTagFromArtifact',artiIdIn,tagStrIn)
            pass
            
        return retval
    def getArtifactNeedingImdbId(self,majtypeIn="movie"):
        selSql = "SELECT title,artifactid "
        selSql += "FROM artifacts "
        selSql += "WHERE imdbid = 'string' AND majtype = '" 
        selSql += majtypeIn
        selSql += "' LIMIT 1"
        
        rowsTuple = self._stdRead(selSql)
        retDict = {}
        if len(rowsTuple) > 0:
            retDict['title'] = rowsTuple[0][0]
            retDict['artifactid'] = rowsTuple[0][1]
        else:
            raise Exception("No result found")
        pass
        return retDict
    def getArtifactCountByFieldValue(self,fieldIn,valueIn):
        count = 0
        selSql = "SELECT COUNT(*) FROM artifacts WHERE "
        selSql += fieldIn
        selSql += " = '"
        selSql += valueIn
        selSql += "'"
        
        rowsTuple = self._stdRead(selSql)
        count = rowsTuple[0][0]
        
        return count
    def setImdbId(self,artiIdIn,imdbIdIn):
        retval = False
        try:
            assert type(artiIdIn) == type('string')
            assert 32 < len(artiIdIn) < 40
            assert type(imdbIdIn) == type('string')  # tt1856101
            assert (imdbIdIn == 'none') or (8 < len(imdbIdIn) < 12)
            
            updSql = "UPDATE artifacts "
            updSql += "SET imdbid = '" + imdbIdIn + "' "
            updSql += "WHERE artifactid = '" + artiIdIn + "'"
            
            self._stdUpdate(updSql)
            
            retval = True
        except:
            print("setImdbId update failed with values: artiIdIn: " + artiIdIn + "; imdbIdIn: " + imdbIdIn )
        return retval
    def assignTagToSeries(self, seriesAIDIn, tagIn):
        retval = False
        
        # Confirm the Series exists (e.g. SELECT title, artifactid FROM artifacts WHERE majtype = 'tvseries' and title LIKE 'Perry Mason%';)
        sql1 = "SELECT COUNT(*) FROM artifacts WHERE majtype = 'tvseries' AND artifactid = '"
        sql1 += seriesAIDIn
        sql1 += "'"
        rowsTuple = self._stdRead(sql1)
        if rowsTuple[0][0] == 0:
            print("Series with ID " + seriesAIDIn + " not found")
            return retval
        pass
        
        # Confirm the Tag exists (e.g. SELECT tag FROM tags WHERE tag = 'detective';)
        sql2 = "SELECT COUNT(*) FROM tags WHERE tag = '"
        sql2 += tagIn
        sql2 += "'"
        rowsTuple = self._stdRead(sql2)
        if rowsTuple[0][0] == 0:
            print("Tag " + tagIn + " not found")
            return retval
        pass
        
        # Get the list of Episodes (e.g. select episodeaid from s2e where seriesaid = '03d66d13-0c0f-463a-af0b-edbb78d6b517';)
        sql3 = "SELECT episodeaid FROM s2e WHERE seriesaid = '"
        sql3 += seriesAIDIn
        sql3 += "'"
        rowsTuple = self._stdRead(sql3)
        epIdList = []
        for rowTuple in rowsTuple:
             epIdList.append(rowTuple[0])
             
        epIdList.append(seriesAIDIn)
        
        # For each Episode in the above result, insert into t2a a 
        for aId in epIdList:
            sql4 = "INSERT INTO t2a SET tag = '"
            sql4 += tagIn
            sql4 += "', artifactid = '"
            sql4 += aId
            sql4 += "'"
            try:
                self._stdInsert(sql4)
            except:
                print("Tag assignment " + tagIn + ", " + aId + " failed.")
            pass
        pass
        
        retval = True
        
        return retval
    def getTVEposidesByPathFileFrag(self,pathIn,fnFragIn):
        retval = []
        # > Get list of "tvepisode" artifacts with the filePath and fnFrag
        sqlStr = "SELECT a.artifactid, a.title, a.file, a.filepath"
        sqlStr += " FROM artifacts a  "
        sqlStr += " WHERE majtype = 'tvepisode' "
        sqlStr += " AND filepath = '" + pathIn + "' "
        sqlStr += " AND file LIKE '%" + fnFragIn + "%' "
        print('\n' + sqlStr + '\n')
        
        resTuple = self._stdRead(sqlStr)
        
        resList = [];
        for itemTuple in resTuple:
            tmpDict = {}
            tmpDict['artifactid'] = itemTuple[0]
            tmpDict['title'] = itemTuple[1]
            tmpDict['file'] = itemTuple[2]
            tmpDict['filepath'] = itemTuple[3]
            resList.append(tmpDict)
        return resList
    def addEpisodeToSeries(self,serAIDIn,epAIDIn):
        insSql = 'INSERT INTO s2e SET seriesaid = "' + serAIDIn + '", episodeaid = "' + epAIDIn +'"'
        result = self._stdInsert(insSql)
    def logPlay(self,artiIdIn,clientIdIn):
        retval = None
        insSql = 'INSERT INTO playlog_live SET '
        insSql += 'clientid = "' + clientIdIn + '", ';
        insSql += 'artifactid = "' + artiIdIn + '" ';
        retval = self._stdInsert(insSql)
        
        return retval
    # NEWISH - PICKED UP FROM WEB SCRAPING PROJECT
    def getEpisodeBySeriesIdAndTitleFrag(self,seriesAdiIn,titleFragIn):
        selSql = """SELECT 
  artifactid 
FROM 
  artifacts 
WHERE 
  title LIKE '%""" + titleFragIn + """%'  
  AND artifactid IN (
    SELECT 
      episodeaid 
    FROM 
      s2e 
    WHERE 
      seriesaid = '""" + seriesAdiIn + """'
    ) 
LIMIT 1
"""
        rowsTuple = self._stdRead(selSql)
        EpAid = rowsTuple[0][0]
        return EpAid
    def getListOfSeriesSeasons(self,seriesImdbIn):
        retList = []
        selSql = """SELECT 
    DISTINCT season 
FROM 
    artifacts 
WHERE 
    season > -1 AND 
    artifactid IN (
        SELECT 
            episodeaid 
        FROM 
            s2e 
        WHERE 
            seriesaid = (
                SELECT 
                    artifactid 
                FROM 
                    artifacts 
                WHERE 
                    imdbid = '""" + seriesImdbIn + """'
                )
        ) 
ORDER BY 
    1"""
        rowsTuple = self._stdRead(selSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList
    def getTvsEpisodeAidList(self,seriesAidIn):
        retList = []
        selSql = """SELECT 
    artifactid
FROM 
    artifacts 
WHERE 
    artifactid IN (
        SELECT 
            episodeaid 
        FROM 
            s2e 
        WHERE 
            seriesaid = '""" + seriesAidIn + """' 
        ) 
ORDER BY 
    1"""
        rowsTuple = self._stdRead(selSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList
    def getAIDofFirstEpisode(self,seriesAidIn):
        sqlStr = """SELECT s.episodeaid, a.file, a.season, a.episode
FROM s2e s 
JOIN artifacts a ON s.episodeaid = a.artifactid
WHERE seriesaid = '""" + seriesAidIn + """'
ORDER BY 3,4
LIMIT 1"""
        interTuple = self._stdRead(sqlStr)
        return interTuple[0][0]
    def getSeriesEpisodeListSingleSeason(self,seriesAidIn,seasonIntIn):
        sqlStr = """SELECT s.episodeaid, a.file, a.season, a.episode
FROM s2e s 
JOIN artifacts a ON s.episodeaid = a.artifactid
WHERE seriesaid = '""" + seriesAidIn + """'
AND season = """ + str(seasonIntIn) + """
ORDER BY 3,4"""
        interTuple = self._stdRead(sqlStr)
        aidList = []
        for rowTuple in interTuple:
            aidList.append(rowTuple[0])
        return self.getArtifactListByIdList(aidList)
        
        pass
    def getSeriesEpByImdbIdAndSEStr(self,serImdbIdIn,epSEStrIn):
        epListSql = """SELECT e.artifactid
    FROM artifacts e
    JOIN s2e s ON e.artifactid = s.episodeaid
    JOIN artifacts o on s.seriesaid = o.artifactid
    WHERE o.imdbid = '""" + serImdbIdIn + """'
    AND e.title LIKE "%_""" + epSEStrIn + """%"
    ORDER BY e.title
    LIMIT 1"""
        resTuple = self._stdRead(epListSql)
        artiId = resTuple[0][0]
        return self.getArtifactById(artiId)
    #####  METHODS RELATED TO "RECOMMENDATIONS"
    def getRecommendedArtifactPersonsListSimple(self,clientIdIn=None,sinceDTIn="2001-09-11 08:35:00"):
        assert ((type(clientIdIn) == type(None) ) or (type(clientIdIn) == type("string")))
        assert type(sinceDTIn) == type("string")        
        
        localSql = """SELECT DISTINCT a.personname /* , a.artifactid  */
FROM p2a a
JOIN (
    SELECT personname, COUNT(artifactid) as 'credits'  
    FROM p2a  
    WHERE personname != 'string'  
    GROUP BY 1 
    ) b ON a.personname = b.personname
JOIN (
    SELECT artifactid 
    FROM playlog_live 
    WHERE clientid = '""" + clientIdIn + """' 
    AND reqtime  > '""" + sinceDTIn + """'
    ) c ON a.artifactid = c.artifactid
WHERE b.credits > 1"""

        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList        
    def getRecommendedArtifactPersonsList(self,clientIdIn=None,sinceDTIn="2001-09-11 08:35:00",majtypModeIn=3, rowCntIn=100):
        assert ((type(clientIdIn) == type(None) ) or (type(clientIdIn) == type("string")))
        assert type(sinceDTIn) == type("string")
        assert type(majtypModeIn) == type(3)
        assert type(rowCntIn) == type(3)
        

        
        
        # Let's get started with building out the query
        localSql = """SELECT t.personname, COUNT(l.reqtime) as 'plays', MIN(l.reqtime) as "firstplay", MAX(l.reqtime) as "lastplay"  
FROM playlog_live l  
JOIN s2e e ON l.artifactid = e.episodeaid 
JOIN artifacts a ON e.seriesaid = a.artifactid  
JOIN p2a t on t.artifactid = e.seriesaid 
WHERE """ # l.clientid = 'thisIsAFakeId-Netscape-1675678310395' \
        
        # Set clientid condition based on input
        if clientIdIn == None:
            localSql += """ l.clientid != null """
        else:
            localSql += """ l.clientid = '""" + clientIdIn + """' """
            
        # Set reqtime condition based on input
        localSql += """AND l.reqtime > '""" + sinceDTIn + """' """
        
        # Set majtype ocndition based on input
        if majtypModeIn == 1:
            localSql += """ AND a.majtype = 'tvseries' """
        elif majtypModeIn == 2:
            localSql += """ AND a.majtype = 'tvepisode' """
        elif majtypModeIn == 3:
            localSql += """ AND (a.majtype = 'tvseries' OR a.majtype = 'tvepisode') """
        elif majtypModeIn == 4:
            localSql += """ AND a.majtype = 'movie' """
        else:
            # Uh... this is bad.  Throw an error, maybe...?
            # ...or just fall back to ...
            localSql += """ AND a.majtype = 'tvseries' """
            pass
        
        # ...and let's finish off the query
        localSql += """ 
AND t.personname != "string" 
GROUP BY t.personname 
ORDER BY 3 DESC
LIMIT """ + str(rowCntIn) + """ """
        
        # print(localSql)
        
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList
    def getRecommendedArtifactsByPeopleSimple(self,peopleListIn=[],clientIdIn=None,sinceDTIn="2001-09-11 08:35:00",rowCntIn=100):
        peopleListStr = ''
        idx = 0
        while idx < len(peopleListIn):
            peopleListStr += '"' + peopleListIn[idx] + '"'
            if idx < (len(peopleListIn) - 1):
                peopleListStr += ", "
            pass
            idx += 1
        pass

        localSql = """SELECT * FROM (
    (
        SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid 
        FROM p2a a
        JOIN artifacts b ON a.artifactid = b.artifactid
        WHERE a.personname IN (""" + peopleListStr + """ ) 
        AND a.artifactid NOT IN  ( 
            SELECT artifactid 
            FROM playlog_live l 
            WHERE  l.clientid = '""" + clientIdIn + """' 
            AND   l.reqtime > '""" + sinceDTIn + """' 
            ) 
        AND b.majtype IN ("movie","tvseries") 
        ORDER BY 1
        LIMIT 20
        )
    UNION DISTINCT
    (
        SELECT DISTINCT c.artifactid, c.title, c.majtype, c.imdbid 
        FROM p2a a
        JOIN s2e b ON a.artifactid = b.episodeaid
        JOIN artifacts c ON b.seriesaid = c.artifactid
        WHERE a.personname IN (""" + peopleListStr + """ ) 
        AND a.artifactid NOT IN  ( 
            SELECT artifactid 
            FROM playlog_live l 
            WHERE  l.clientid = '""" + clientIdIn + """'  
            AND   l.reqtime > '""" + sinceDTIn + """' 
            ) 
        AND c.majtype IN ("movie","tvseries") 
        ORDER BY 1
        LIMIT 20
        )
    ) tt
 """

        #print(localSql)
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            tmpObj = {'artifactid':row[0],'title':row[1],'majtype':row[2],'imdbid':row[3]}
            retList.append(tmpObj)
            # retList.append(row[0])
        return retList  
    def getRecommendedArtifactsByPeople(self,peopleListIn):
        peopleListStr = ''
        idx = 0
        while idx < len(peopleListIn):
            peopleListStr += '"' + peopleListIn[idx] + '"'
            if idx < (len(peopleListIn) - 1):
                peopleListStr += ", "
            pass
            idx += 1
        pass
        
        localSql = """SELECT DISTINCT u.artifactid, /* u.personname, */ u.title
FROM (
    (
        SELECT DISTINCT n.artifactid, m.personname, n.title, n.majtype
        FROM (
            SELECT a.artifactid, p.personname, p.artifield, a.title, a.majtype
            FROM p2a p 
            JOIN artifacts a ON p.artifactid = a.artifactid
            WHERE p.personname in (""" + peopleListStr + """) 
            AND a.majtype = 'tvepisode' 
            ) m
        JOIN s2e s ON m.artifactid = s.episodeaid
        JOIN artifacts n ON s.seriesaid = n.artifactid
        )
    UNION ALL
    (
        SELECT a.artifactid, p.personname, a.title, a.majtype
        FROM p2a p 
        JOIN artifacts a ON p.artifactid = a.artifactid
        WHERE p.personname in (""" + peopleListStr + """) 
        AND (a.majtype = 'tvseries' OR a.majtype = 'movie')
        )
    ) u
ORDER BY 2"""
        
        pass
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList
    def getClientArtifacts(self,clientIdIn=None,sinceDTIn='2023-02-01 00:00:00',limitIn=100):
        assert ((type(clientIdIn) == type(None)) or (type(clientIdIn) == type("string")))
        assert type(sinceDTIn) == type("string")
        assert type(limitIn) == type(69)
        localSql = "SELECT DISTINCT artifactid FROM playlog_live WHERE "
        if clientIdIn != None:
            localSql += " clientid = '" + clientIdIn + "' AND "
        localSql += " reqtime >= '" + sinceDTIn + "' "
        localSql += " ORDER BY reqtime DESC LIMIT " + str(limitIn) + " " 
        print(localSql)
        pass
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList        
    def getRecommendedArtifactsByTags(self,clientIdIn=None,sinceDTIn='2023-02-01 00:00:00',limitIn=10,tagLimitIn=5):
        
        clientIdStr = ''
        # Set clientid condition based on input
        if clientIdIn == None:
            clientIdStr += """ != null """
        else:
            clientIdStr += """ = '""" + clientIdIn + """' """    
        
        # Set reqtime condition based on input
        reqtimeStr = " > '" + sinceDTIn + "' "        
        
        
                
        localSql = """SELECT * FROM (
( 
    SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
    FROM artifacts a 
    JOIN t2a t ON a.artifactid = t.artifactid 
    WHERE t.artifactid IN ( 
        /* List of artifactid values with same tag as popular list */ 
        SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
            /* List of tags popular with this user */ 
            SELECT w.tag FROM (
                SELECT t.tag, COUNT(l.reqtime) as 'plays'  
                FROM playlog_live l  
                JOIN artifacts a ON l.artifactid = a.artifactid  
                JOIN t2a t on l.artifactid = t.artifactid 
                WHERE l.clientid """ + clientIdStr +  """ 
                AND l.reqtime """ + reqtimeStr + """   
                AND a.majtype = 'movie'  
                GROUP BY t.tag 
                ORDER BY 2 DESC 
                LIMIT """ + str(tagLimitIn) + """
                ) w 
            )  
        AND z.artifactid NOT IN ( 
            /* List of artifact id values this user has seen */ 
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid """ + clientIdStr +  """ 
            )
    )
    AND a.majtype = 'movie'
    ORDER BY a.artifactid
    LIMIT """ + str(limitIn) + """  
    )  
UNION ALL 
( 
    SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid 
    FROM artifacts b 
    JOIN t2a u ON b.artifactid = u.artifactid 
    WHERE u.artifactid IN ( 
        /* List of artifactid values with same tag as popular list */ 
        SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
            /* List of tags popular with this user */ 
            SELECT r.tag FROM (
                SELECT y.tag, COUNT(m.reqtime) as 'plays'  
                /* SELECT w.title, COUNT(l.reqtime) as 'plays' */ 
                FROM playlog_live m  
                JOIN artifacts c ON m.artifactid = c.artifactid  
                JOIN s2e e ON c.artifactid = e.episodeaid 
                JOIN artifacts w ON e.seriesaid = w.artifactid
                JOIN t2a y on w.artifactid = y.artifactid 
                WHERE m.clientid """ + clientIdStr +  """  
                AND m.reqtime """ + reqtimeStr + """    
                AND c.majtype = 'tvepisode'  
                /* AND t.tag != 'new' */ 
                GROUP BY 1 
                ORDER BY 2 DESC 
                LIMIT """ + str(tagLimitIn) + """ 
                ) r 
            )  
        AND z.artifactid NOT IN ( 
            /* List of artifact id values this user has seen */ 
            SELECT DISTINCT x.seriesaid 
            FROM playlog_live l
            JOIN s2e x ON l.artifactid = x.episodeaid
            WHERE l.clientid """ + clientIdStr +  """   
            ) 
    ) 
    AND b.majtype = 'tvseries'
    ORDER BY b.artifactid 
    LIMIT """ + str(limitIn) + """  
    ) 
ORDER BY 2
) nn """
        #print(localSql)
        
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            # a.artifactid, a.title, a.majtype, a.imdbid
            tmpObj = {'artifactid':row[0],'title':row[1],'majtype':row[2],'imdbid':row[3]}
            retList.append(tmpObj)
            # retList.append(row[0])
        return retList    
    def getRecommendedArtifactsByOthers(self,clientIdIn,sinceDTIn='2023-02-01 00:00:00',limitIn=20):
        assert type(clientIdIn) == type("thing")
        assert len(clientIdIn) > 10
        assert type(limitIn) == type(10)
        localSql = """SELECT * FROM (
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        JOIN playlog_live b ON a.artifactid = b.artifactid 
        WHERE b.clientid  != '""" + clientIdIn + """' 
        AND b.reqtime  > '""" + sinceDTIn + """' 
        AND b.artifactid NOT IN (
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid = '""" + clientIdIn + """'
            ) 
        AND a.majtype = 'movie' 
        LIMIT """ + str(limitIn) + """ 
        )
        UNION DISTINCT
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        JOIN s2e c ON a.artifactid = c.seriesaid 
        JOIN playlog_live b ON c.episodeaid = b.artifactid 
        WHERE b.clientid  != '""" + clientIdIn + """' 
        AND b.reqtime  > '""" + sinceDTIn + """' 
        AND a.artifactid NOT IN (
            SELECT e.seriesaid  
            FROM playlog_live d 
            JOIN s2e e ON d.artifactid = e.episodeaid 
            WHERE d.clientid = '""" + clientIdIn + """'
            ) 
        AND a.majtype = 'tvseries' 
        LIMIT """ + str(limitIn) + """ 
        ) 
    ) tt  """
        #print(localSql)
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            # a.artifactid, a.title, a.majtype, a.imdbid
            tmpObj = {'artifactid':row[0],'title':row[1],'majtype':row[2],'imdbid':row[3]}
            retList.append(tmpObj)
            # retList.append(row[0])
        return retList 
    def getRecommendedArtifactsByServer(self,sinceDtIn='2023-02-01 00:00:00',limitIn=20):
        pass
        localSql = """SELECT * FROM (
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        WHERE a.artifactid NOT IN (
            SELECT DISTINCT artifactid 
            FROM playlog_live 
            WHERE reqtime  > '""" + sinceDtIn + """' 
            )
        AND a.majtype = 'movie' 
        ORDER BY 1
        LIMIT """ + str(limitIn) + """
        )
    UNION DISTINCT
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        WHERE a.artifactid NOT IN (
            SELECT e.seriesaid  
            FROM playlog_live d 
            JOIN s2e e ON d.artifactid = e.episodeaid 
            WHERE reqtime  > '""" + sinceDtIn + """' 
            )
        AND a.majtype = 'tvseries' 
        ORDER BY 1
        LIMIT """ + str(limitIn) + """
        )
    ) ff """
        #print(localSql)
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            # a.artifactid, a.title, a.majtype, a.imdbid
            tmpObj = {'artifactid':row[0],'title':row[1],'majtype':row[2],'imdbid':row[3]}
            retList.append(tmpObj)
            # retList.append(row[0])
        return retList     
    def getRecommendedArtifactsByRewatch(self,clientIdIn=None,sinceDtIn='2023-02-01 00:00:00',limitIn=20):    
        
        localSql = """SELECT * FROM (
    (
        SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid  
        FROM playlog_live a 
        JOIN artifacts b  ON  a.artifactid = b.artifactid
        WHERE  a.clientid = '""" + clientIdIn + """'  
        AND   a.reqtime > '""" + sinceDtIn + """' 
        AND b.majtype = "movie"
        ORDER BY 1
        LIMIT """ + str(limitIn) + """ 
        )
    UNION DISTINCT
    (
        SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid  
        FROM playlog_live a 
        JOIN s2e c ON a.artifactid = c.episodeaid
        JOIN artifacts b  ON  c.seriesaid = b.artifactid
        WHERE  a.clientid = '""" + clientIdIn + """'  
        AND   a.reqtime > '""" + sinceDtIn + """' 
        AND b.majtype = "tvseries"
        ORDER BY 1
        LIMIT """ + str(limitIn) + """ 
        )
    ) dd """
        #print(localSql)
        retList = []
        rowsTuple = self._stdRead(localSql)
        for row in rowsTuple:
            # a.artifactid, a.title, a.majtype, a.imdbid
            tmpObj = {'artifactid':row[0],'title':row[1],'majtype':row[2],'imdbid':row[3]}
            retList.append(tmpObj)
            # retList.append(row[0])
        return retList  
    def getRecSeriesList(self,seriesArtiIdIn):

        sqlStr = """SELECT DISTINCT a.season FROM s2e s
JOIN artifacts a ON s.episodeaid = a.artifactid
WHERE s.seriesaid = '""" + seriesArtiIdIn + """'
ORDER BY 1"""
        pass
        retList = []
        rowsTuple = self._stdRead(sqlStr)
        for row in rowsTuple:
            retList.append(row[0])
        return retList
    def writeRecToCache(self,clientIdIn=None,recDictIn=None,expDurDaysIn=7):
        # print("writeRecToCache - clientIdIn: " + clientIdIn + ", expDurDaysIn: " + str(expDurDaysIn) ) # + ", recDictIn: " + json.dumps(recDictIn))
        uRecId = str(uuid.uuid4())
        
        md = {}
        md['desc'] = "Recommendations cache"
        md['record_data_model'] = "json"
        
        tmpJson = json.dumps(recDictIn)
        intJson = tmpJson.replace("\\\"","\\\\\\\"")
        quotedJson = intJson.replace("'","\\\'")
        
        tmpSql = """INSERT INTO common_texts
SET id = '""" + uRecId + """',
    record_type = "recommendation",
    filt_crit_1 = '""" + clientIdIn + """',
    filt_crit_2 = "",
    filt_crit_3 = "",
    create_date = NOW(),
    update_date = NOW(),
    expire_date = INTERVAL """ + str(expDurDaysIn) + """ DAY + NOW() ,
    metadata = '""" + json.dumps(md) + """',
    record_data = '""" + quotedJson + """'"""
        
        
        # print("writeRecToCache - tmpSql: " + tmpSql)
        self._stdInsert(tmpSql)
        # print("writtenRecToCache")
        return True
    def getRecJsonFromCache(self,clientIdIn=None):
        tmpSql = """SELECT record_data 
FROM common_texts 
WHERE filt_crit_1 = '""" + clientIdIn + """' 
    AND expire_date > NOW()
ORDER BY expire_date DESC
LIMIT 1"""
        rowsTuple = self._stdRead(tmpSql)
        retval = None
        if (len(rowsTuple) > 0):
            for row in rowsTuple:
                retval = row[0]
        return retval
    def getSiteStats(self,intervalIntIn):  ####    NEW!!   WORK IN PROGRESS!!!
        retval = None
        print("VodLibDB.getSiteStats - START")
        topCnt = 10;
        tmpTagsList = []
        retDict = {"artifacts":{},"listings":{}}
        #print("VodLibDB.getSiteStats - intervalIntIn: " + intervalIntIn)
        # {
            # "artifacts":{
                # "457e6c3c-591e-46ab-8b75-c7ed31d0cfbc":{"title":"Tim Minchin: Back","artifactid":"457e6c3c-591e-46ab-8b75-c7ed31d0cfbc","majtype":"movie"},
                # "c7e34b0f-d3ea-4521-b39a-99b3d89812a6":{"title":"Jo Brand: Barely Live","artifactid":"c7e34b0f-d3ea-4521-b39a-99b3d89812a6","majtype":"movie"},
                # "08c74e39-e523-4d4f-864c-7a0cc67c4419":{"title":"Dara O'Briain: Talks Funny","artifactid":"08c74e39-e523-4d4f-864c-7a0cc67c4419","majtype":"movie"},
                # "53aade09-535b-4c96-9c1e-695284f476c6":{"title":"ElephantParts","artifactid":"53aade09-535b-4c96-9c1e-695284f476c6","majtype":"movie"},
                # "1a06de9a-9a5b-4423-8bd8-1bd66ead0d9f":{"title":"A Shot In The Dark","artifactid":"1a06de9a-9a5b-4423-8bd8-1bd66ead0d9f","majtype":"movie"},
                # "e9253d1b-0711-4f65-b6e2-a6decc050ef6":{"title":"1941","artifactid":"e9253d1b-0711-4f65-b6e2-a6decc050ef6","majtype":"movie"},
                # "da235d5e-b37b-41a5-9f03-284cb902e89e":{"title":"Greg Davies: The Back Of My Mums Head","artifactid":"da235d5e-b37b-41a5-9f03-284cb902e89e","majtype":"movie"},
                # "c8f35db3-7525-418e-b23a-4a610ae4654f":{"title":"Jon Richardson: Nidiot","artifactid":"c8f35db3-7525-418e-b23a-4a610ae4654f","majtype":"movie"},
                # "69583984-ebab-46c1-be6b-86796c6fef22":{"title":"Sarah Millican: Bobby Dazzler","artifactid":"69583984-ebab-46c1-be6b-86796c6fef22","majtype":"movie"},
                # "04fb8351-651e-4740-9b50-13a9392a7897":{"title":"Beerfest","artifactid":"04fb8351-651e-4740-9b50-13a9392a7897","majtype":"movie"},
                # "da22e03b-bc63-4332-b527-dd9f082797f1":{"title":"The Sand Pebbles","artifactid":"da22e03b-bc63-4332-b527-dd9f082797f1","majtype":"movie"},
                # "05ebd587-7fe7-4739-ba27-8d0f1d9bf57d":{"title":"There Will Be Blood","artifactid":"05ebd587-7fe7-4739-ba27-8d0f1d9bf57d","majtype":"movie"},
                # "a39ce7c8-6484-48b5-9a2e-d1d055e0a176":{"title":"Vertigo","artifactid":"a39ce7c8-6484-48b5-9a2e-d1d055e0a176","majtype":"movie"},
                # "a8fa58c5-3cf0-40fb-a2d8-9ed4453bbd69":{"title":"M*A*S*H","artifactid":"a8fa58c5-3cf0-40fb-a2d8-9ed4453bbd69","majtype":"movie"},
                # "14ada598-05a0-4f95-8f64-1f26877b0a69":{"title":"No Country For Old Men","artifactid":"14ada598-05a0-4f95-8f64-1f26877b0a69","majtype":"movie"},
                # "8eba8eed-77f1-4eb4-a703-ce2cdf099c5e":{"title":"I Am Sam","artifactid":"8eba8eed-77f1-4eb4-a703-ce2cdf099c5e","majtype":"movie"},
                # "b53e9f60-b76b-4781-9014-85be9bed1679":{"title":"Ice Station Zebra","artifactid":"b53e9f60-b76b-4781-9014-85be9bed1679","majtype":"movie"},
                # "5f71c282-7620-4793-9166-4356dfc90846":{"title":"Westworld","artifactid":"5f71c282-7620-4793-9166-4356dfc90846","majtype":"movie"},
                # "d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab":{"title":"Everything Everywhere All At Once","artifactid":"d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab","majtype":"movie"},
                # "487598cb-9b6c-47e5-8908-500a6d32e986":{"title":"The Aviator","artifactid":"487598cb-9b6c-47e5-8908-500a6d32e986","majtype":"movie"},
                # "03189fe8-a68f-4631-8eb2-8277c248a987":{"title":"Jojo Rabbit","artifactid":"03189fe8-a68f-4631-8eb2-8277c248a987","majtype":"movie"},
                # "d32185ed-3f6d-4501-ace4-494f7ceeec43":{"title":"The Maltese Falcon","artifactid":"d32185ed-3f6d-4501-ace4-494f7ceeec43","majtype":"movie"}
        
            # }
            # "listings":{
                # "movie":{
                    # "tags":{
                        # "comedy":{
                            # "count":46,
                            # "artifacts":[
                                # "457e6c3c-591e-46ab-8b75-c7ed31d0cfbc",
                                # "c7e34b0f-d3ea-4521-b39a-99b3d89812a6",
                                # "08c74e39-e523-4d4f-864c-7a0cc67c4419",
                                # "53aade09-535b-4c96-9c1e-695284f476c6",
                                # "1a06de9a-9a5b-4423-8bd8-1bd66ead0d9f",
                                # "e9253d1b-0711-4f65-b6e2-a6decc050ef6",
                                # "da235d5e-b37b-41a5-9f03-284cb902e89e",
                                # "c8f35db3-7525-418e-b23a-4a610ae4654f",
                                # "69583984-ebab-46c1-be6b-86796c6fef22",
                                # "04fb8351-651e-4740-9b50-13a9392a7897",
                            # ]
                        # },
                        # "new":{
                            # "count":25,
                            # "artifacts":[
                                # "c7e34b0f-d3ea-4521-b39a-99b3d89812a6",
                                # "da22e03b-bc63-4332-b527-dd9f082797f1",
                                # "08c74e39-e523-4d4f-864c-7a0cc67c4419",
                                # "05ebd587-7fe7-4739-ba27-8d0f1d9bf57d",
                                # "c8f35db3-7525-418e-b23a-4a610ae4654f",
                                # "1a06de9a-9a5b-4423-8bd8-1bd66ead0d9f",
                                # "69583984-ebab-46c1-be6b-86796c6fef22",
                                # "a39ce7c8-6484-48b5-9a2e-d1d055e0a176",
                                # "a8fa58c5-3cf0-40fb-a2d8-9ed4453bbd69",
                                # "14ada598-05a0-4f95-8f64-1f26877b0a69",
                            # ]
                        # },
                        # "drama":{
                            # "count":24,
                            # "artifacts":[
                                # "da22e03b-bc63-4332-b527-dd9f082797f1",
                                # "8eba8eed-77f1-4eb4-a703-ce2cdf099c5e",
                                # "b53e9f60-b76b-4781-9014-85be9bed1679",
                                # "5f71c282-7620-4793-9166-4356dfc90846",
                                # "a39ce7c8-6484-48b5-9a2e-d1d055e0a176",
                                # "d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab",
                                # "05ebd587-7fe7-4739-ba27-8d0f1d9bf57d",
                                # "487598cb-9b6c-47e5-8908-500a6d32e986",
                                # "03189fe8-a68f-4631-8eb2-8277c248a987",
                                # "d32185ed-3f6d-4501-ace4-494f7ceeec43",
                            # ]
                        # }
                    # }
                # }
            # }
        # }        
        
        majtypeCntSql = """SELECT majtype, COUNT(artifactid) 
FROM artifacts 
GROUP BY 1 
ORDER BY 1 """
        # print("VodLibDB.getSiteStats - majtypeCntSql: " + majtypeCntSql)
        rowsTuple = self._stdRead(majtypeCntSql)
        majtypeList = []
        for rowTuple in rowsTuple:
            tmpDict = {"name":rowTuple[0],"count":rowTuple[1]}
            majtypeList.append(tmpDict)
            retDict["listings"][rowTuple[0]] = {"tags":{},"count":rowTuple[1]}
        pass
        
        # Most Played Tags Last 6 Months (movie)
        movieTagsSQL = """SELECT t.tag, COUNT(l.reqtime) 
FROM playlog_live l 
JOIN t2a t ON l.artifactid = t.artifactid 
JOIN artifacts a ON l.artifactid = a.artifactid 
WHERE l.reqtime > INTERVAL -""" + str(intervalIntIn) + """ DAY + NOW() 
AND a. majtype = 'movie' 
GROUP BY 1 
ORDER BY 2 DESC 
LIMIT """ + str(topCnt) + """ """
        # print("VodLibDB.getSiteStats - movieTagsSQL: " + movieTagsSQL)
        rowsTuple = self._stdRead(movieTagsSQL)
        for rowTuple in rowsTuple:
            retDict["listings"]["movie"]["tags"][rowTuple[0]] = {"count":rowTuple[1],"artifacts":[]}
            tmpTagsList.append(rowTuple[0])
        pass
        
        
        for tagName in tmpTagsList:
            # Most Played artifacts for a specified tag Last 6 Months (movie)
            movieTitlesByTagSQL = """SELECT a.title, a.artifactid, COUNT(l.reqtime) 
FROM playlog_live l 
JOIN t2a t ON l.artifactid = t.artifactid 
JOIN artifacts a ON l.artifactid = a.artifactid 
WHERE l.reqtime > INTERVAL -""" + str(intervalIntIn) + """ DAY + NOW() 
AND a. majtype = 'movie' 
AND t.tag = '""" + tagName + """' 
GROUP BY 1 
ORDER BY 2 DESC 
LIMIT """ + str(topCnt) + """  """
            # print("VodLibDB.getSiteStats - movieTitlesByTagSQL: " + movieTitlesByTagSQL)

            rowsTuple = self._stdRead(movieTitlesByTagSQL)
            for rowTuple in rowsTuple:
                retDict['artifacts'][rowTuple[1]] = {"title":rowTuple[0],"artifactid":rowTuple[1],"majtype":"movie","count":rowTuple[2]}
                retDict["listings"]["movie"]["tags"][tagName]['artifacts'].append(rowTuple[1])
            pass
        pass
        
        
        
        tmpTagsList = []
        
        # Most Played Tags Last 6 Months (tvseries)
        tvseriesTagsSQL = """SELECT t.tag, COUNT(l.reqtime) 
FROM playlog_live l 
JOIN s2e s ON l.artifactid = s.episodeaid 
JOIN t2a t ON s.seriesaid = t.artifactid 
JOIN artifacts a ON s.seriesaid = a.artifactid
WHERE l.reqtime > INTERVAL -""" + str(intervalIntIn) + """ DAY + NOW() 
AND a. majtype = 'tvseries' 
GROUP BY 1 
ORDER BY 2 DESC 
LIMIT """ + str(topCnt) + """ """
        # print("VodLibDB.getSiteStats - tvseriesTagsSQL: " + tvseriesTagsSQL)
        rowsTuple = self._stdRead(tvseriesTagsSQL)
        for rowTuple in rowsTuple:
            retDict["listings"]["tvseries"]["tags"][rowTuple[0]] = {"count":rowTuple[1],"artifacts":[]}
            tmpTagsList.append(rowTuple[0])
        pass
        
        
        for tagName in tmpTagsList:
            # Most Played artifacts for a specified tag Last 6 Months (tvseries)
            tvseriesTitlesByTagSQL = """SELECT a.title, a.artifactid, COUNT(l.reqtime) 
FROM playlog_live l
JOIN s2e s ON l.artifactid = s.episodeaid
JOIN t2a t ON s.seriesaid = t.artifactid
JOIN artifacts a ON s.seriesaid = a.artifactid
WHERE l.reqtime > INTERVAL -""" + str(intervalIntIn) + """ DAY + NOW()
AND a. majtype = 'tvseries'
AND t.tag = '""" + tagName + """'
GROUP BY 1
ORDER BY 3 DESC
LIMIT """ + str(topCnt) + """  """
            # print("VodLibDB.getSiteStats - tvseriesTitlesByTagSQL: " + tvseriesTitlesByTagSQL)
            rowsTuple = self._stdRead(tvseriesTitlesByTagSQL)
            for rowTuple in rowsTuple:
                retDict['artifacts'][rowTuple[1]] = {"title":rowTuple[0],"artifactid":rowTuple[1],"majtype":"tvseries","count":rowTuple[2]}
                retDict["listings"]["tvseries"]["tags"][tagName]['artifacts'].append(rowTuple[1])
            pass
        pass
        print("VodLibDB.getSiteStats - END")
        return retDict
    def getRecentEpisodes(self,clientidIn):
        
        colList = ['clientid','seriestitle','seriesartifactid','episodetitle','episodeartifactid','season','episode','reqtime']
        
        sql = """SELECT 
    m.clientid AS 'clientid', 
    m.title AS "seriestitle", 
    m.artifactid AS "seriesartifactid", 
    f.title AS "episodetitle", 
    f.artifactid AS "episodeartifactid", 
    f.season, 
    f.episode, 
    m.reqtime  
FROM user_series_last_episode m  
JOIN playlog_live h ON (m.reqtime = h.reqtime AND m.clientid = h.clientid)
JOIN artifacts f ON h.artifactid = f.artifactid  
JOIN s2e t ON (h.artifactid = t.episodeaid AND m.artifactid = t.seriesaid)  
"""
        if type(clientidIn) == type("string") and len(clientidIn) > 10 :
            sql += """WHERE m.clientid = '""" + clientidIn + """' 
"""
          
        sql += """ORDER BY 8 DESC
LIMIT 30"""
        print("getRecentEpisodes sql: " + sql)
        retList = []
        rowsTuple = self._stdRead(sql)
        for rowTuple in rowsTuple:
            retDict = {};
            for colLbl in colList:
                if colLbl == "reqtime":
                    retDict[colLbl] = rowTuple[colList.index(colLbl)].strftime('%Y-%m-%d %H:%M:%S')
                else:
                    retDict[colLbl] = rowTuple[colList.index(colLbl)]
            retList.append(retDict)
        pass
        return retList
    def generateRecsAllUsers(self, sinceDtIn='2023-02-01 00:00:00', limitIn=30, omdbapiKeyIn=""):
        
        print("generateRecsAllUsers: sinceDtIn = " + sinceDtIn + "; limitIn = " + str(limitIn) + "; omdbapiKeyIn = " + omdbapiKeyIn)
        # We'll use this to get "poster" links to use in the recommendations
        # NOTE:  There is a known problem with this, which is that the 
        # "omdbapi_key" is not accessible by the means listed below.  
        # Probably the simplest way to access it is to have it passed in 
        # as a parameter.  Alternately, this could be trimmed down to 
        # just check to see if the poster file is there, and if not, 
        # return the "oops no poster" link.
        def fetchPosterFile(imdbidIn,apiKeyIn=""):
            # This version pulls from OMDbAPI, and depends on a key being set in the config file
            if imdbidIn == '' or imdbidIn == 'string' or imdbidIn == 'none':
                print("fetchPosterFile - Got a bad imdbid: " + str(imdbidIn))
                return ''
            baseDir = '/var/www/html'
            uriPath = '/rmvod/img/poster_00/' + imdbidIn + '.jpg'
            filnm = baseDir + uriPath
            if not (os.path.exists(filnm)):
                try: 
                    # posterUri = self.fetchPosterLink(imdbidIn)
                    #posterUri = "http://img.omdbapi.com/?apikey=" + self.config['API_Resources']['omdbapi_key'] + "&i=" + imdbidIn
                    posterUri = "http://img.omdbapi.com/?apikey=" + apiKeyIn + "&i=" + imdbidIn
                    print("fetchPosterFile2 - posterUri: " + posterUri)
                    response = requests.get(posterUri)
                    print("fetchPosterFile2 - HTTP Response: " + str(response.status_code))
                    if (int(response.status_code) >= 400):
                        raise Exception("Poster fetch failed with code " + str(response.status_code))
                    #whitespace
                    fh = open(filnm,"wb")
                    fh.write(response.content)
                    fh.close()
                except:
                    print('Tried to fetch ' + posterUri + ' and save it as ' + filnm + ' but failed miserably')
                    uriPath = ''
                    # # Hard-coded for now.  Should be a .cfg option.
                    uriPath = "/rmvod/img/RMVOD_NoPoster.png"
                    pass
                pass
            # print("MediaLibraryDB.fetchPosterFile - uriPath: " + uriPath)
            return uriPath        
        
        
        
        # Get the list of unique userids from the user table
        #  ==> SELECT DISTINCT userid FROM users WHERE lockedtf = false AND activetf = true AND confirmtf = true
        sql_client_id = """SELECT DISTINCT userid FROM users WHERE lockedtf = false AND activetf = true AND confirmtf = true """
        result_tuple = self._stdRead(sql_client_id);
        client_id_list = []
        for rt_row in result_tuple:
            client_id_list.append(rt_row[0])
        pass
        
        now = datetime.now()
        currDTS = now.strftime("%Y-%m-%d %H:%M:%S")
        #recsObj['meta']['create_date'] = now.strftime("%Y-%m-%d %H:%M:%S")
        
        # retDict = {'meta':{},'artifacts':{},'data':{'others':{'tvseries':[],'movie':[]},'tags':{'tvseries':[],'movie':[]},'people':{'tvseries':[],'movie':[]},'server':{'tvseries':[],'movie':[]},'rewatch':{'tvseries':[],'movie':[]}}};
        
        dbc = self._connect()
        cursor = dbc.cursor()
        # cursor.execute(sqlIn)
        # dbc.commit()
        # dbc.close()        
        # Setup reference tables...
        # Trunc and Repopulate rec_logged_plays
        sql_rec_logged_plays = """CREATE OR REPLACE TEMPORARY TABLE rec_logged_plays
SELECT 
  l.clientid, 
  l.artifactid, 
  e.title, 
  e.majtype, 
  MAX(l.reqtime) AS "reqtime", 
  s.seriesaid, 
  a.title AS "seriestitle"
FROM playlog_live l
JOIN artifacts e ON l.artifactid = e.artifactid 
LEFT OUTER JOIN s2e s ON l.artifactid = s.episodeaid 
LEFT OUTER JOIN artifacts a ON s.seriesaid = a.artifactid
WHERE l.reqtime > '""" + sinceDtIn + """'
GROUP BY 1, 2 
ORDER BY reqtime DESC """
        # ACTION: Exec sql_rec_logged_plays
        cursor = dbc.cursor()
        cursor.execute(sql_rec_logged_plays)
        dbc.commit()
        cursor.close()
        
        #
        # Trunc and Repopulate rec_tag_plays_by_client
        sql_rec_tag_plays_by_client = """CREATE OR REPLACE TEMPORARY TABLE rec_tag_plays_by_client
SELECT p.clientid, "tvseries" as "majtype", t.tag, COUNT(p.seriesaid) AS "artifactcount"
FROM rec_logged_plays p 
JOIN t2a t ON p.seriesaid = t.artifactid
WHERE p.majtype = "tvepisode" 
GROUP BY 1, 2, 3 
UNION
/* Tags associated with TV Series I've Watched */
SELECT p.clientid, "movie" as "majtype", t.tag, COUNT(p.artifactid) AS "artifactcount"
FROM rec_logged_plays p 
JOIN t2a t ON p.artifactid = t.artifactid
WHERE p.majtype = "movie" 
GROUP BY 1, 2, 3  """
        # ACTION: Exec sql_rec_tag_plays_by_client
        cursor = dbc.cursor()
        cursor.execute(sql_rec_tag_plays_by_client)
        dbc.commit()
        cursor.close()
        #
        # Trunc and Repopulate rec_person_plays_by_client
        sql_rec_person_plays_by_client = """CREATE OR REPLACE TEMPORARY TABLE rec_person_plays_by_client
SELECT p.clientid, "tvseries" as "majtype", a.personname, COUNT(p.seriesaid) AS "artifactcount"
FROM rec_logged_plays p
JOIN p2a a ON p.seriesaid = a.artifactid
WHERE a.personname != "string"
AND p.majtype = "tvepisode"
GROUP BY 1, 2, 3
UNION
SELECT p.clientid, "movie" as "majtype", a.personname, COUNT(p.artifactid) AS "artifactcount"
FROM rec_logged_plays p
JOIN p2a a ON p.artifactid = a.artifactid
WHERE a.personname != "string"
AND p.majtype = "movie"
GROUP BY 1, 2, 3 """
        # ACTION: Exec sql_rec_person_plays_by_client
        cursor = dbc.cursor()
        cursor.execute(sql_rec_person_plays_by_client)
        dbc.commit()
        cursor.close()
        #
        # Build the Recs...
        # for each user...
        for userId in client_id_list:
            print("userId: " + userId)
            recDict = {'meta':{},'artifacts':{},'data':{'new':{'tvseries':[],'movie':[]},'others':{'tvseries':[],'movie':[]},'tags':{'tvseries':[],'movie':[]},'people':{'tvseries':[],'movie':[]},'server':{'tvseries':[],'movie':[]},'rewatch':{'tvseries':[],'movie':[]}}};
            recDict['meta']['create_date'] = currDTS
            recDict['meta']['generator'] = 'generateRecsAllUsers-' + userId
            recDict['meta']['clientid'] = userId
            
            pass
            sqlObj = {}
            sqlObj['new'] = {}
            sqlObj['rewatch'] = {}
            sqlObj['others'] = {}
            sqlObj['people'] = {}
            sqlObj['tags'] = {}
            sqlObj['server'] = {}
            #   Fetch "new" Recs for tvseries 
            sql_new_tv = """SELECT DISTINCT '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM t2a t 
    JOIN artifacts a on t.artifactid = a.artifactid 
    WHERE t.tag = 'new' AND a.majtype = 'tvseries'  
    ORDER BY t.artifactid 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['new']['tvseries'] = sql_new_tv
            #  Fetch "new" Recs for movies 
            sql_new_movie = """SELECT DISTINCT '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM t2a t JOIN artifacts a on t.artifactid = a.artifactid 
    WHERE t.tag = 'new' AND a.majtype = 'movie'  
    ORDER BY t.artifactid 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['new']['movie'] = sql_new_movie
            #   Fetch "rewatch" Recs for tvseries 
            sql_rewatch_tv = """SELECT DISTINCT p.clientid, p.seriesaid AS "artifactid", p.seriestitle AS "title" , "tvseries" AS "majtype",  a.imdbid  
    FROM rec_logged_plays p
    JOIN artifacts a ON p.seriesaid = a.artifactid
    WHERE p.majtype = "tvepisode" 
      AND p.clientid = '""" + userId + """' 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['rewatch']['tvseries'] = sql_rewatch_tv
            #   Fetch "rewatch" Recs for movies 
            sql_rewatch_movie = """SELECT DISTINCT p.clientid, p.artifactid, p.title,  "movie" AS "majtype", a.imdbid 
    FROM rec_logged_plays p
    JOIN artifacts a ON p.artifactid = a.artifactid
    WHERE p.majtype = "movie" 
      AND p.clientid = '""" + userId + """' 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['rewatch']['movie'] = sql_rewatch_movie
            #   Fetch "other" Recs for tvseries 
            sql_other_tv = """SELECT '""" + userId + """' AS "clientid",  p.seriesaid AS "artifactid", p.seriestitle AS "title", "tvseries" AS "majtype", a.imdbid 
    FROM rec_logged_plays p
    JOIN artifacts a ON p.seriesaid = a.artifactid
    WHERE p.majtype = "tvepisode" 
      AND p.clientid != '""" + userId + """' 
    GROUP BY 1, 2 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['others']['tvseries'] = sql_other_tv
            #   Fetch "other" Recs for movies 
            sql_other_movie = """SELECT '""" + userId + """' AS "clientid",  p.artifactid, p.title, "movie" AS "majtype", a.imdbid  
    FROM rec_logged_plays p
    JOIN artifacts a ON p.seriesaid = a.artifactid
    WHERE p.majtype = "movie" 
      AND p.clientid != '""" + userId + """' 
    GROUP BY 1, 2 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['others']['movie'] = sql_other_movie
            #   Fetch "people" Recs for tvseries 
            sql_people_tv = """SELECT DISTINCT '""" + userId + """' AS "clientid",  a.artifactid, a.title, a.majtype, a.imdbid 
    FROM p2a pp 
    JOIN artifacts a ON pp.artifactid = a.artifactid 
    WHERE pp.personname IN (SELECT personname FROM rec_person_plays_by_client WHERE clientid = '""" + userId + """' ) 
    AND pp.artifactid NOT IN (SELECT DISTINCT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" AND clientid = '""" + userId + """'  )
    AND a.majtype IN ( "tvseries" /* ,  "tvepisode" */ )
    AND pp.personname NOT IN ("N/A", "string") 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['people']['tvseries'] = sql_people_tv
            #   Fetch "people" Recs for movies 
            sql_people_movie = """SELECT DISTINCT '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM p2a pp 
    JOIN artifacts a ON pp.artifactid = a.artifactid 
    WHERE pp.personname IN (SELECT personname FROM rec_person_plays_by_client WHERE clientid = '""" + userId + """' ) 
    AND pp.artifactid NOT IN (SELECT DISTINCT artifactid FROM rec_logged_plays WHERE majtype = "movie" AND clientid = '""" + userId + """'  )
    AND a.majtype IN ( "movie")
    AND pp.personname NOT IN ("N/A", "string") 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['people']['movie'] = sql_people_movie
            #   Fetch "tag" Recs for tvseries 
            sql_tag_tv = """SELECT DISTINCT  '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM t2a tt
    JOIN artifacts a ON tt.artifactid = a.artifactid
    WHERE tt.tag IN (SELECT tag FROM rec_tag_plays_by_client WHERE clientid = '""" + userId + """' )
    AND tt.artifactid NOT IN (SELECT DISTINCT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" AND clientid = '""" + userId + """'   )
    AND a.majtype IN ("tvseries")
    LIMIT """ + str(limitIn) + """ """
            sqlObj['tags']['tvseries'] = sql_tag_tv
            #   Fetch "tag" Recs for movies 
            sql_tag_movie = """SELECT DISTINCT  '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM t2a tt
    JOIN artifacts a ON tt.artifactid = a.artifactid
    WHERE tt.tag IN (SELECT tag FROM rec_tag_plays_by_client WHERE clientid = '""" + userId + """' )
    AND tt.artifactid NOT IN (SELECT DISTINCT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" AND clientid = '""" + userId + """'  )
    AND a.majtype IN ("movie")
    LIMIT """ + str(limitIn) + """ """
            sqlObj['tags']['movie'] = sql_tag_movie
            #   Fetch "server" Recs for tvseries 
            sql_server_tv = """SELECT DISTINCT  '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM artifacts a 
    WHERE a.majtype = "tvseries" 
      AND a.artifactid NOT IN ( SELECT seriesaid  FROM rec_logged_plays WHERE majtype = 'tvepisode'  ) 
    LIMIT """ + str(limitIn) + """ """
            sqlObj['server']['tvseries'] = sql_server_tv
            #   Fetch "server" Recs for movies 
            sql_server_movie = """SELECT DISTINCT  '""" + userId + """' AS "clientid", a.artifactid, a.title, a.majtype, a.imdbid 
    FROM artifacts a 
    WHERE a.majtype = "movie" 
      AND a.artifactid NOT IN ( SELECT artifactid FROM rec_logged_plays WHERE majtype = "movie' )
    LIMIT """ + str(limitIn) + """ """
            sqlObj['server']['movie'] = sql_server_movie
            for recType in list(sqlObj.keys()):
                for artifactType in list(sqlObj[recType].keys()):
                    cursor = dbc.cursor()
                    print("recType: " + recType + "; artifactType: " + artifactType)
                    try:
                        cursor.execute(sqlObj[recType][artifactType])
                        result_tuple = cursor.fetchall()   
                        cursor.close()                 
                        for rt_row in result_tuple:
                            # Turns out we don't actually need this at 
                            # this point, but we have it, so might as 
                            # well call it out.
                            clientId = rt_row[0]
                            # Build the Dict we'll use to populate the 
                            # recYype/artifactType slot
                            artiDict = {"artifactid":rt_row[1], "title":rt_row[2], "majtype":rt_row[3], "imdbid":rt_row[4]}
                            # Stuff the Dict into the recYype/artifactType slot
                            recDict['data'][recType][artifactType].append(artiDict)
                            # See if this artifact is already in the 
                            # "artifacts" sub-Dict.  If not do the following.
                            if rt_row[1] not in list(recDict['artifacts'].keys()) :
                                # Log the full artifact in the "artifacts" sub-Dict.
                                recDict['artifacts'][rt_row[1]] = self.getArtifactById(rt_row[1])
                                # Add a "poster" link to the artifact
                                try:
                                    # recDict['artifacts'][rt_row[1]][0]['poster'] = fetchPosterFile2(rt_row[4])
                                    recDict['artifacts'][rt_row[1]][0]['poster'] = fetchPosterFile(rt_row[4],omdbapiKeyIn)
                                except:
                                    print("Could not get Poster link for artifactid " + [rt_row[1]])
                                pass
                        pass
                    except Exception as e:
                        eMsg = ""
                        if hasattr(e, "message"):
                            eMsg = e.messgae
                        print("FAILED! (" + eMsg + ") SQL: " + sqlObj[recType][artifactType])
                        cursor.close()  
                    pass
                pass
            # Finally, close the database connection, which should purge the temporary tables
            #dbc.close()
            # Write client's new Recs to DB and deactivate previous.
            self.writeRecToCache(userId,recDict,7)
        pass
        dbc.close()
        return False


class MediaLibraryDB:
    def __init__(self):
        # Metadata for this isntantiation
        self.meta = {}
        
        # Set-up the data store for the whole point of why we're here.
        self.intializeLibDict()
        
        # fun fact about tags -- all tags are stored "smash-case lower"
        # with spaces converted to underscores
        #  See function __normalizeTagStr for all the deets
        self.libMeta = {}
        self.libMeta['libstore'] = {'path':'/home/tourvilp/Desktop/vodlib/DBSCRATCH/data','file':'vml_test.json'}
        self.libMeta['retdicttempl'] = {'method':'','params':[],'status':{},'data':[]}
        self.libMeta['retdicttempl']['status']['success'] = False
        self.libMeta['retdicttempl']['status']['detail'] = ''
        self.libMeta['retdicttempl']['status']['log'] = []
        
        # set config param defaults
        self.config = {}
        self.config['API_Settings'] = {'do_recs': 'on', 'service_name': 'RIBBBITmedia VideoOnDemand', 'service_abbrev': 'RMVOD', 'recs_exp_days': '7'}
        self.config['API_Resources'] = {'image_path': '/rmvod/img', 'poster_path': '/rmvod/img/poster_00', 'video_path': '/rmvod/vidsrc', 'api_path': '/rmvod/api', 'logo_tile_image': '/rmvod/img/rmvod_badge_center.png'}
        self.config['Database'] = {'db_host': 'localhost', 'db_user': 'vodlibapi', 'db_password': 'vodlibapipw', 'db_db': 'vodlib'}

        # Update config params from file if present
        self.cfgReader()
        pass
    def __normalizeTagStr(self,tagStrIn):
        istr0 = tagStrIn.lower()
        istr1 = istr0.strip()
        istr2 = istr1.replace(' ','_')
        return istr2
    def cfgReader(self):
        cfgFile = '/etc/rmvod/rmvod_api.cfg'
        cfgDict = {}
        cfExists = os.path.exists(cfgFile)
        if ( not cfExists) :
            print("oh noes.  Will not be updating config from file because it's not there.")
            return cfgDict
        config = configparser.ConfigParser()
        config.read(cfgFile)
        for secNm in config.sections():
            cfgDict[secNm] = {}
            for key in config[secNm]:
                # Set the value we're going to return
                cfgDict[secNm][key] = config[secNm][key]
                # Set the 
                self.config[secNm][key] = config[secNm][key]
        #{'API_Settings': {'do_recs': 'on', 'service_name': 'RIBBBITmedia VideoOnDemand', 'service_abbrev': 'RMVOD'}, 
        #'API_Resources': {'image_path': '/rmvod/img', 'poster_path': '/rmvod/img/poster_00', 'video_path': '/rmvod/vidsrc', 'api_path': '/rmvod/api', 'logo_tile_image': '/rmvod/img/rmvod_badge_center.png'}, 
        #'Database': {'db_host': 'localhost', 'db_user': 'vodlibapi', 'db_password': 'vodlibapipw', 'db_db': 'vodlib'}}
        return cfgDict
    def dbHandleConfigged(self):
        db = VodLibDB()
        db.dbc['host'] = self.config['Database']['db_host']
        db.dbc['user'] = self.config['Database']['db_user']
        db.dbc['password'] = self.config['Database']['db_password']
        db.dbc['database'] = self.config['Database']['db_db']
        return db
    def getDBVersion(self): # Updated to use .cfg
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        return vldb.getDBVersion()
    def artifactFileCheck(self,pathIn,fileIn): # Updated to use .cfg
        basePath = '/var/www/html/rmvod/vidsrc/'
        #basePath = '/var/www/html' + self.config['API_Resources']['video_path']
        exist = os.path.exists(basePath + pathIn + '/' + fileIn)
        return  exist    
    def newArtiPreCheck(self,pathIn,fileIn): # Updated to use .cfg
        #basePath = '/var/www/html/rmvod/vidsrc/'
        basePath = '/var/www/html' + self.config['API_Resources']['video_path'] + "/"
        exist = os.path.exists(basePath + pathIn + '/' + fileIn)
        
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        count = vldb.getArtifactCountByFieldValue('file',fileIn)
        
        retval = False
        if (exist == True) and (count == 0):
            retval = True
        return retval
    def intializeLibDict(self):
        self.libDict = {}
        self.libDict['n2a'] = {}
        self.libDict['artifacts'] = {}
        self.libDict['tags'] = []
        self.libDict['a2t'] = {}
        self.libDict['t2a'] = {}
        self.libDict['series'] = []
        
        vldb = VodLibDB()
        self.libDict['tags'] = vldb.getTagList()
        
        self.artifactProto = {}
        self.artifactProto['artifactid'] = 'string'
        self.artifactProto['title'] = 'string'
        self.artifactProto['majtype'] = 'string'
        self.artifactProto['runmins'] = -1
        self.artifactProto['season'] = -1
        self.artifactProto['episode'] = -1
        self.artifactProto['file'] = 'string'
        self.artifactProto['filepath'] = 'string'
        self.artifactProto['director'] = ['string']
        self.artifactProto['writer'] = ['string']
        self.artifactProto['primcast'] = ['string']
        self.artifactProto['relorg'] = ['string'] 
        self.artifactProto['relyear'] = -1
        self.artifactProto['eidrid'] = 'string'
        self.artifactProto['imdbid'] = 'string'
        self.artifactProto['arbmeta'] = {'string':'string'}
        
        pass
    def readCssFile(self,cssFilPathIn):
        verNmbrStr = "Undetermined";
        srchStr = "rmvod_core.css version"
        try:
            fh2 = open(cssFilPathIn,'rt')
            foundIt = False
            while foundIt == False:
                lineStr = fh2.readline()
                if (lineStr == ""):
                    print(srchStr + ' not found in ' + cssFilPathIn)
                    break
                if (srchStr in lineStr):
                    foundIt = True
                    partList = lineStr.split(" ")
                    verNmbrStr = partList[3]
                pass
            pass
            fh2.close()
        except IOError as error:
            print('File Sad: ' + str(error))
        else:
            pass
        finally:
            pass
        pass
        return verNmbrStr  
    def readHtmlFile(self,htmlFilPathIn):
        verNmbrStr = "Undetermined";
        srchStr = "<!-- rmvod.html version "
        try:
            fh2 = open(htmlFilPathIn,'rt')
            foundIt = False
            while foundIt == False:
                lineStr = fh2.readline()
                if (lineStr == ""):
                    print(srchStr + ' not found in ' + cssFilPathIn)
                    break
                if (srchStr in lineStr):
                    foundIt = True
                    partList = lineStr.split(" ")
                    verNmbrStr = partList[3]
                pass
            pass
            fh2.close()
        except IOError as error:
            print('File Sad: ' + str(error))
        else:
            pass
        finally:
            pass
        pass
        return verNmbrStr
    def loadJsonLibrary(self,jsonStrIn):
        retval = False
        try:
            self.libDict = json.loads(jsonStrIn)
            retval = True
        except:
            print("POOP!  JSON Load FAILED!!!")
        pass
        return retval
    def extractJsonLibrary(self):
        pass
        retDict = {}
        retDict = {'n2a':{},'artifacts':{},'tags':[],'t2a':{},'a2t':{}}
        artiList = self.findArtifactsByName('')
        for artiListDict in artiList:
            artiId = artiListDict['artifactid']
            thisArtiDict = self.getArtifactById(artiId)
            retDict['artifacts'][artiId] = thisArtiDict
            retDict['a2t'] = thisArtiDict['tags']
            retDict['n2a'][thisArtiDict['title']] = artiId
        pass
            
        return json.dumps(retDict)
    def extractJsonLibraryFile(self):
        return json.dumps(self.libDict)
    def loadLibraryFromFile(self,fqFilPathIn=None):
        fqfp = None
        if (fqFilPathIn == None):
            fqfp = self.libMeta['libstore']['path'] + '/' + self.libMeta['libstore']['file']
        else:
            fqfp = fqFilPathIn
        pass
        try:
            fh2 = open(fqfp,'rb')
            b64InBytes = fh2.read()
            fh2.close()
        except IOError as error:
            print('File Sad: ' + str(error))
        else:
            readString = base64.b64decode(b64InBytes)
            self.loadJsonLibrary(readString)
        finally:
            pass
        pass
    def saveLibraryToFile(self,fqFilPathIn=None):
        # WRITE CURRENT BUFFER OUT TO FILE
        masterString = self.extractJsonLibrary()
        b64OutBytes = base64.b64encode(masterString.encode('ascii'))
        fqfp = None
        if (fqFilPathIn == None):
            fqfp = self.libMeta['libstore']['path'] + '/' + self.libMeta['libstore']['file']
        else:
            fqfp = fqFilPathIn
        None
        try:
            fh1 = open(fqfp,'wb')
            fh1.write(b64OutBytes)
            fh1.close()
        except IOError as error:
            print('File Sad: ' + str(error))
        else:
            pass
        finally:
            pass
        pass
    def createTag(self,tagStrIn): # Updated to use .cfg
        retval = False
        try:
            ntag = self.__normalizeTagStr(tagStrIn)
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            vldb.createTag(ntag)
            retval = True
        except:
            retval = False
            pass
        pass
        return retval
    def createArtitext(self,artiIdIn,fieldNameIn,contentIn): # Updated to use .cfg
        retval = False
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            vldb.createArtiText(artiIdIn,fieldNameIn,contentIn)
            retval = True
        except:
            retval = False
            pass
        pass
        return retval
    def deleteTag(self,tagStrIn):
        retval = False
        tidx = self.findTag(tagStrIn)
        if (tidx > -1) :
            # Tag is present
            try:
                ntag = self.__normalizeTagStr(tagStrIn)
                del self.libDict['tags'][tidx]
                del self.libDict['t2a'][ntag]
                retval = True
            except:
                retval = False
                pass
            pass
        else:
            # Tag is not present
            retval = True
        pass
        return retval
    def findTag(self,tagStrIn): # Updated to use .cfg
        ntag = self.__normalizeTagStr(tagStrIn)
        retval = -1
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            resTagList = vldb.findTag(ntag)
            retval = len(resTagList)
        except:
            retval = -1
        pass
        return retval
    def getSupportList(self,tableNameIn): # UPDATED FOR NEW RETURN OBJECT MODEL  # Updated to use .cfg
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getSupportList'
        tmpRetObj['params'] = [tableNameIn]
        
        retval = None
        try:
            assert tableNameIn in ['persons','companies','tags']
            # vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            tmpRetObj['data'] = vldb.getSupportList(tableNameIn)
            tmpRetObj['status']['success'] = True 
        except:
            pass
        pass
        return tmpRetObj
    def createArtifact(self,artifactDictIn): # Updated to use .cfg
        # We should be confirming that the title doesn't already exist
        try:
            assert (type(artifactDictIn['title']) == type("A String"))
        except:
            raise Exception("createArtifact - FATAL: No Title Provided")
        pass
        aId = str(uuid.uuid4())
        artifactDictIn['artifactid'] = aId
        pKeyList = list(self.artifactProto.keys())
        aKeyList = list(artifactDictIn.keys())
        skipKeysList = []
        inserDict = {}
        for pKey in pKeyList:
            if pKey in aKeyList:
                try:
                    assert (type(self.artifactProto[pKey]) == type(artifactDictIn[pKey]))
                    inserDict[pKey] = artifactDictIn[pKey]
                except:
                    print("createArtifact: POOP " + str(pKey))
                    skipKeysList.append(pKey)
                pass
            else:
                print("createArtifact: MISSING " + str(pKey))
                inserDict[pKey] = artifactDictIn[pKey]
            pass
        pass
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        vldb.createArtifact(inserDict)
        return aId
    def modifyArtifact(self,artifactIdIn,artifactDictIn): # UPDATED FOR NEW RETURN OBJECT MODEL  # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'modifyArtifact'
        tmpRetObj['params'] = [artifactIdIn, artifactDictIn]
        
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            foo = vldb.updateArtifactByIdAndDict(artifactIdIn,artifactDictIn)
            tmpRetObj['status']['success'] = True
        except:
            print('Artifact update failed')
        pass
        return tmpRetObj
    def artifactListFieldAction(self,paramObjIn): # UPDATED FOR NEW RETURN OBJECT MODEL
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'artifactListFieldAction'
        tmpRetObj['params'] = [paramObjIn]
        
        artiObj = self.getArtifactById(paramObjIn['artifactid'])
        wrkList = artiObj[paramObjIn['field']]
        tmpRetObj['data'].append({paramObjIn['field']:wrkList})
        tmpRetObj['status']['log'].append(json.dumps(tmpRetObj['data'][0]))
        if paramObjIn['action'] == 'remove-member':
            try:
                wrkList.remove(paramObjIn['value'])
                self.modifyArtifact(artiObj['artifactid'],{paramObjIn['field']:wrkList})
                tmpRetObj['data'][0][paramObjIn['field']] = wrkList
                tmpRetObj['status']['success'] = True
            except:
                print('artifactListFieldAction: ' +  paramObjIn['value'] + ' is not a valid ' + paramObjIn['field'])
            pass
        elif paramObjIn['action'] == 'add-member':
            if not (paramObjIn['value'] in wrkList):
                wrkList.append(paramObjIn['value'])
                self.modifyArtifact(artiObj['artifactid'],{paramObjIn['field']:wrkList})
                tmpRetObj['data'][0][paramObjIn['field']] = wrkList
                tmpRetObj['status']['success'] = True
            else:
                print('artifactListFieldAction: ' +  paramObjIn['value'] + ' is already a member of ' + paramObjIn['field'])
            pass
        elif paramObjIn['action'] == 'add-choice':
            wrkList.append(paramObjIn['value']);
            self.modifyArtifact(artiObj['artifactid'],{paramObjIn['field']:wrkList})
            artiObj2 = self.getArtifactById(paramObjIn['artifactid'])
            tmpRetObj['data'][0][paramObjIn['field']] = artiObj2[paramObjIn['field']]
            tmpRetObj['status']['success'] = True
            
        else:
            print('artifactListFieldAction: ' +  "Don't know what to do with this: " + paramObjIn['action'])
            print(str(paramObjIn))
        pass
        return tmpRetObj
                
        pass
    def modifyArtifactTitle(self,oldTitleIn,newTitleIn,artifactIdIn):
        retval = False
        try:
            self.modifyArtifact(artifactIdIn,{'title':newTitleIn})
            retval = True
        except:
            print('Title Update failed')
        return retval
    def deleteArtifact(self,artifactId=None,artifactName=None): # Updated to use .cfg
        retval = False
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        retval = vldb.deleteArtifact()
        return retval
    def getTagList(self): # Updated to use .cfg
        retval = None
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        retval = vldb.getTagList()
        return retval
    def getArtifactByIdNew(self,artiIdIn): # UPDATED FOR NEW RETURN OBJECT MODEL # Updated to use .cfg
        retval = None
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getArtifactByIdNew'
        tmpRetObj['params'] = [artiIdIn]
        tmpRetObj['status']['success'] = True
                
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retval = vldb.getArtifactById(artiIdIn,False)[0]
            retval = self.titleLibTweak(retval)
            tmpRetObj['data'].append(retval)
        except:
            tmpRetObj['status']['success'] = False
            tmpRetObj['status']['detail'] = "getArtifactById for " + artiIdIn + " FAILED"
            print("getArtifactById for " + artiIdIn + " FAILED")
        pass
        try:
            tmpRetObj['data'][0]['poster'] = self.fetchPosterFile2(retval['imdbid'])
        except:
            # Hard-coded for now.  Should be a .cfg option.
            tmpRetObj['data'][0]['poster'] = "/rmvod/img/RMVOD_NoPoster.png"
            print("getArtifactById couldn't get the poster file.  Sad.")
            
        
        return tmpRetObj
    ###### THIS NEEDS TO BE DECOMMISSIONED!!!!  WHOA DOGGIES!
    def getArtifactById(self,artiIdIn): # Updated to use .cfg  
        return self.getArtifactByIdNew(artiIdIn)['data'][0]
        # tmpObj = self.getArtifactByIdNew(artiIdIn)
        # print(json.dumps(tmpObj['data'][0]))
        # print("THIS IS MediaLibraryDB.getArtifactById!  THIS SHOULD NEVER BE USED!  FIX YOUR SHIT!  USE getArtifactByIdNew INSTEAD!")
        # raise Exception("Called deprecated method getArtifactById -- Time to die.")
        pass
    def getNextEpisodeArtifactById(self,artiIdIn): # UPDATED FOR NEW RETURN OBJECT MODEL # Updated to use .cfg
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getNextEpisodeArtifactById'
        tmpRetObj['params'] = [artiIdIn]
        tmpRetObj['status']['success'] = True
                
        retval = None
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            tmpres = vldb.getNextEpisodeArtifact(artiIdIn)[0]
            tmpRetObj['data'] = vldb.getNextEpisodeArtifact(artiIdIn)
        except:
            print("getNextEpisodeArtifactById for " + artiIdIn + " FAILED")
        return tmpRetObj # retval
    def getArtifactByName(self,artiNameIn): # Updated to use .cfg
        retval = False
        try:
            vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            resList = vldb.getArtifactListByTitleFrag(artiNameFragStrIn)
            artiId = resList[0]['artifactid']
            retval = self.getArtifactById(artiId)
        except:
            print(getArtifactByName + ": DUNG!")
        return retval
    def addTagtoArtifact(self,tagStrIn,artifactIdIn): # Updated to use .cfg
        retval = False
        stepfail = False
        ntag = self.__normalizeTagStr(tagStrIn)
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        retval = vldb.addTagtoArtifact(ntag,artifactIdIn)
        return retval
    def addTagToSeries(self,tagIn,seriesAIDIn): # Updated to use .cfg
        nTag = self.__normalizeTagStr(tagIn)
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        retval = vldb.assignTagToSeries(seriesAIDIn, nTag)
        return retval
    def removeTagFromArtifact(self,tagStrIn,artifactIdIn): # Updated to use .cfg
        retval = False
        ntag = self.__normalizeTagStr(tagStrIn)
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retval = vldb.removeTagFromArtifact(artifactIdIn,ntag)
        except:
            print("Well, poop.")
        pass
        return retval
    def getArtifactsByTag(self,tagStrIn):   # UPDATED FOR NEW RETURN OBJECT MODEL  # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getArtifactsByTag'
        tmpRetObj['params'] = [tagStrIn]
        print("getArtifactsByTag.tagStrIn: " + tagStrIn)
        ntag = self.__normalizeTagStr(tagStrIn)
        retobj = []
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retobj = vldb.getArtifactListByTagList([ntag])
            tmpRetObj['data'] = retobj
            tmpRetObj['status']['success'] = True
        except:
            print('getArtifactsByTag  BARF')
            pass
        pass
        return tmpRetObj
    def getArtifactsByMajtype(self,majtypeStrIn): # UPDATED FOR NEW RETURN OBJECT MODEL   # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getArtifactsByMajtype'
        tmpRetObj['params'] = [majtypeStrIn]
        
        retobj = [];
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retobj = vldb.getArtifactListByMajtype(majtypeStrIn)
            tmpRetObj['data'] = retobj
            tmpRetObj['status']['success'] = True
            pass
        except:
            print('getArtifactsByMajtype  BARF')
            pass
        pass
        return tmpRetObj
    def getArtifactsByRelyear(self,relyear1In,relyear2In): # UPDATED FOR NEW RETURN OBJECT MODEL   # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getArtifactsByRelyear'
        tmpRetObj['params'] = [relyear1In,relyear2In]
                
        retobj = [];
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retobj = vldb.getArtifactListByRelyear(relyear1In,relyear2In)
            tmpRetObj['data'] = retobj
            tmpRetObj['status']['success'] = True
            pass
        except:
            print('getArtifactsByRelyear  BARF')
            pass
        pass
        return tmpRetObj  
    def findArtifactsBySrchStr(self,srchStrIn): # UPDATED FOR NEW RETURN OBJECT MODEL    # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'findArtifactsBySrchStr'
        tmpRetObj['params'] = [srchStrIn]
        
        retobj = []
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retobj = vldb.getArtifactListByPersTitleStr(str(srchStrIn))
            tmpRetObj['data'] = retobj
            tmpRetObj['status']['success'] = True
        except:
            print('findArtifactsBysrchStr  BARF')
            pass
        pass
        return tmpRetObj
    def getArtifactsByMultiFactorSrch(self,mfSrchObjIn): # UPDATED FOR NEW RETURN OBJECT MODEL    # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getArtifactsByMultiFactorSrch'
        tmpRetObj['params'] = [mfSrchObjIn]
        
        retobj = []
        idList = []
        tmpResObj = {"tag":[],"string":[],"majtype":[],'relyear':[],'sqlwhere':[]}
        tmpResObj = {}
        if (mfSrchObjIn['tag'] != ''):
            tmpResObj['tag'] = self.getArtifactsByTag(mfSrchObjIn['tag'])
        if (mfSrchObjIn['string'] != ''):
            tmpResObj['string'] = self.findArtifactsBySrchStr(mfSrchObjIn['string'])
        if (mfSrchObjIn['majtype'] != ''):
            tmpResObj['majtype'] = self.getArtifactsByMajtype(mfSrchObjIn['majtype'])
        if (mfSrchObjIn['relyearend'] != ''):
            try:
                tmpResObj['relyear'] = self.getArtifactsByRelyear(int(mfSrchObjIn['relyearstart']),int(mfSrchObjIn['relyearend']))
            except:
                if int(mfSrchObjIn['relyearend']) > 1900:
                    tmpResObj['relyear'] = self.getArtifactsByRelyear(int(mfSrchObjIn['relyearend']),int(mfSrchObjIn['relyearend']))
                else:
                    print('Cannot process dates.  Sad.')
        if (mfSrchObjIn['sqlwhere'] != ''):
            tmpResObj['sqlwhere'] = self.getArtifactsByArbWhereClause(mfSrchObjIn['sqlwhere'])
        troKeys = list(tmpResObj.keys())
        for key in troKeys:
            if len(tmpResObj[key]['data']) > 0: # If we got results
                if len(idList) == 0: # If this would be our first result
                    for lElObj in tmpResObj[key]['data']: # For each result on this key
                        idList.append(lElObj['artifactid'])
                    pass
                else:
                    tmpIdList = []
                    for lElObj in tmpResObj[key]['data']:
                        if lElObj['artifactid'] in idList:
                            tmpIdList.append(lElObj['artifactid'])
                        pass
                    pass
                    idList = tmpIdList
                pass
            pass
        pass
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        retobj = vldb.getArtifactListByIdList(idList);
        tmpRetObj['status']['success'] = True 
        tmpRetObj['data'] = retobj
        return tmpRetObj        
    def getArtifactsByArbWhereClause(self,whereClauseStrIn):   # Updated to use .cfg
        retobj = []
        print ('MediaLibraryDB.getArtifactsByArbWhereClause: ' + whereClauseStrIn)
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retobj = vldb.getArtifactListByArbWhereClause(whereClauseStrIn)
            print("WHEE!")
        except:
            print('getArtifactsByArbWhereClause  BARF')
            pass
        pass
        return retobj
    def findArtifactsByName(self,artiNameFragStrIn):   # Updated to use .cfg
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'findArtifactsByName'
        tmpRetObj['params'] = [artiNameFragStrIn]
        
        try:
            tmpRetObj['data'] = vldb.getArtifactListByTitleFrag(artiNameFragStrIn)
            tmpRetObj['status']['success'] = True
        except:
            print("findArtifactsByName FAILED!")
        
            
        return tmpRetObj
    def getIdTitleListBySeriesArtiId(self,atriIdIn): # UPDATED FOR NEW RETURN OBJECT MODEL   # Updated to use .cfg
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getIdTitleListBySeriesArtiId'
        tmpRetObj['params'] = [atriIdIn]
        tmpRetObj['status']['success'] = True
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        tmpRetObj['data'] = vldb.getEpisodeTIMListBySeriesId(atriIdIn)
        return tmpRetObj
    def getTagsByArtifact(self,artifactIdIn):
        retval = False
        try:
            tagsList = self.libDict['a2t'][artifactIdIn]
            retval = tagsList
        except:
            print('getTagsByArtifact: POOP')
        pass
        return retval
    def getArtifactPrototype(self):
        artiProtoDict = {}
        artiProtoDict = copy.deepcopy(self.artifactProto)
        pass
        return artiProtoDict
    def fetchDeetsFromApi(self):   # Updated to use .cfg
        print("ml.fetchDeetsFromApi")
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        vldb.fetchArtiDeetsFromOmdbapi()
        return True
    def getArtifactLackingImdbid(self,majtypeIn):   # Updated to use .cfg
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        retDict = vldb.getArtifactNeedingImdbId(majtypeIn)
        return retDict
    def updateArtifactImdbid(self,artiIdIn,imdbidIn):   # Updated to use .cfg
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        vldb.setImdbId(artiIdIn,imdbidIn)
    def updateArtiDeetsFromOmdb(self,artiIdIn):
        artiDict = self.getArtifactById(artiIdIn)
        arbmetaStr = artiDict['arbmeta']
        print(arbmetaStr)
        arbMetaDict = None
        try:
            arbMetaDict = json.loads(arbmetaStr)
        except:
            print('Could not json.loads arbmetaStr. ')
            return False
        amdKeysList = list(arbMetaDict.keys())
        if not ( 'Title' in amdKeysList ):
            # This artifact does not have a "Title" key
            # so we're going to skip it.
            return False
        pass
        updateDict = {}
        # Get "writer" values and put them in a List
        writerList = arbMetaDict['Writer'].split(',')
        if len(writerList) > 0:
            updateDict['writer'] = []
        pass
        for writer in writerList:
            updateDict['writer'].append(writer.strip())
        pass
        
        # Get "Director" values and put them in a List
        directorList = arbMetaDict['Director'].split(',')
        if len(directorList) > 0:
            updateDict['director'] = []
        for director in directorList:
            updateDict['director'].append(director.strip())
        pass
        
        # Get "Actor" values and put them in a List
        actorList = arbMetaDict['Actors'].split(',')
        if len(actorList) > 0:
            updateDict['primcast'] = []
        for actor in actorList:
            updateDict['primcast'].append(actor.strip())
        pass
        
        # Get the "Plot" value and put it in an artitext
        plotStr = arbMetaDict['Plot'].replace("'","\\\'")
        self.createArtitext(artiIdIn,'synopsis',plotStr)
        
        # Update the artifact in the DB based on the values 
        # pulled from OMDBAPI data
        retval = self.modifyArtifact(artiIdIn,updateDict)
        
        return retval
    def fetchPosterLink(self,imdbidIn):  # Deprecated
        # This version tries to pull posters from IMDB... as of 
        # 20230905 IMDB has tucked their poster image files away 
        # somewhere and are throwing 404s now, so this is prolly 
        # deprecated.
        raise Exception("MediaLibraryDB.fetchPosterLink DEPRECATED")
        
        posterUri = ''
        if imdbidIn == 'string' or imdbidIn == 'none' or imdbidIn == '':
            return posterUri
        try:
            uri = "https://www.omdbapi.com/?i=" +  imdbIdIn
            try:
                uri = "https://www.omdbapi.com/?apikey=" + self.config['API_Resources']['omdbapi_key'] + "&i=" +  imdbIdIn
                print(uri)
            except:
                print("No OMDBAPI Key set.  Access to resources may be limited.  See https://www.omdbapi.com/ for details.")
            pass
            
            response = requests.get(uri)
            responseDict = response.json()
            print(json.dumps(responseDict))
            posterUri = responseDict['Poster']
        except:
            print("fetchPosterLink Failed to fetch " + uri)
            pass
        return posterUri        
    def fetchPosterFile(self,imdbidIn): # Deprecated
        # This version tries to pull posters from IMDB... as of 
        # 20230905 IMDB has tucked their poster image files away 
        # somewhere and are throwing 404s now, so this is prolly 
        # deprecated.
        raise Exception("MediaLibraryDB.fetchPosterFile DEPRECATED")
        
        if imdbidIn == '' or imdbidIn == 'string' or imdbidIn == 'none':
            print("fetchPosterFile - Got a bad imdbid: " + str(imdbidIn))
            return ''
        baseDir = '/var/www/html'
        uriPath = '/rmvod/img/poster_00/' + imdbidIn + '.jpg'
        filnm = baseDir + uriPath
        if not (os.path.exists(filnm)):
            try: 
                posterUri = self.fetchPosterLink(imdbidIn)
                response = requests.get(posterUri)
                fh = open(filnm,"wb")
                fh.write(response.content)
                fh.close()
            except:
                print('Tried to fetch ' + posterUri + ' and save it as ' + filnm + ' but failed miserably')
                uriPath = ''
                # # Hard-coded for now.  Should be a .cfg option.
                uriPath = "/rmvod/img/RMVOD_NoPoster.png"
                pass
            pass
        # print("MediaLibraryDB.fetchPosterFile - uriPath: " + uriPath)
        return uriPath
    def fetchPosterFile2(self,imdbidIn):
        # This version pulls from OMDbAPI, and depends on a key being set in the config file
        if imdbidIn == '' or imdbidIn == 'string' or imdbidIn == 'none':
            print("fetchPosterFile - Got a bad imdbid: " + str(imdbidIn))
            return ''
        baseDir = '/var/www/html'
        uriPath = '/rmvod/img/poster_00/' + imdbidIn + '.jpg'
        filnm = baseDir + uriPath
        if not (os.path.exists(filnm)):
            try: 
                # posterUri = self.fetchPosterLink(imdbidIn)
                posterUri = "http://img.omdbapi.com/?apikey=" + self.config['API_Resources']['omdbapi_key'] + "&i=" + imdbidIn
                print("fetchPosterFile2 - posterUri: " + posterUri)
                response = requests.get(posterUri)
                print("fetchPosterFile2 - HTTP Response: " + str(response.status_code))
                if (int(response.status_code) >= 400):
                    raise Exception("Poster fetch failed with code " + str(response.status_code))
                #whitespace
                fh = open(filnm,"wb")
                fh.write(response.content)
                fh.close()
            except:
                print('Tried to fetch ' + posterUri + ' and save it as ' + filnm + ' but failed miserably')
                uriPath = ''
                # # Hard-coded for now.  Should be a .cfg option.
                uriPath = "/rmvod/img/RMVOD_NoPoster.png"
                pass
            pass
        # print("MediaLibraryDB.fetchPosterFile - uriPath: " + uriPath)
        return uriPath
    def librarifyTitle(self,titleIn):
        titleOut = titleIn
        if titleIn[0:4] == "The ":
            titleOut = titleIn[4:] + ", The"
        elif titleIn[0:2] == "A ":
            titleOut = titleIn[2:] + ", A"
        return titleOut
    def titleLibTweak(self,artiObjIn):
        arbmetaDict = {}
        try:
            arbmetaDict = json.loads(artiObjIn['arbmeta'])
        except:
            print('titleLibTweak - json.loads failed on arbmeta for ' + artiObjIn['title']);
            #return artiObjIn

        if 'addeddt' not in list(arbmetaDict.keys()):
            print('/var/www/html/rmvod/vidsrc', artiObjIn['filepath'], artiObjIn['file'])
            dateStr = '2000-01-01'
            try:
                pass
                dateStr = self.getArtiFileCTime('/var/www/html/rmvod/vidsrc/',artiObjIn['filepath'],artiObjIn['file'])
                #print("dateStr",dateStr)
                arbmetaDict['addeddt'] = dateStr
                #print("arbmetaDict",json.dumps(arbmetaDict))
                #print("arbmetaDict",str(arbmetaDict))
            except:
                print("Dammitall -- Could not get dateStr from file")

            #arbmetaDict['addeddt'] = self.getArtiFileCTime('/var/www/html/rmvod/vidsrc/',artiObjIn['filepath'],artiObjIn['file'])
            #arbmetaDict['addeddt'] = dateStr + ' 00:00:01'
            #arbmetaDict['addeddt'] = dateStr


        print("arbmetaDict",json.dumps(arbmetaDict))


        straightTitle = artiObjIn['title']
        #print("straightTitle",straightTitle)
        libTitle = self.librarifyTitle(straightTitle)
        #print("libTitle",libTitle)
        arbmetaDict['titleorig'] = straightTitle
        arbmetaDict['titlelibrary'] = libTitle
        #print("arbmetaDict",json.dumps(arbmetaDict))
        artiObjIn['arbmeta'] = json.dumps(arbmetaDict)
        #print(artiObjIn['arbmeta'])
        return artiObjIn
    def addEpisodesToSeries(self,seriesArtiIdIn,filePathIn,fnFragIn): # UPDATED FOR NEW RETURN OBJECT MODEL   # Updated to use .cfg
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()

        retDict = {}
        retDict['method'] = 'addEpisodesToSeries'
        retDict['params'] = [seriesArtiIdIn,filePathIn,fnFragIn]
        retDict['status'] = {'success':False,'detail':'','log':[]}
        retDict['data'] = []
        
        serEpiList = vldb.getEpisodeListBySeriesId(seriesArtiIdIn)
        
        # > Confirm the seriesArtiId is good
        # > Get tags associated with the series
        seriesArti = self.getArtifactById(seriesArtiIdIn)
        
        # > Get list of "tvepisode" artifacts with the filePath and fnFrag
        episodeList = vldb.getTVEposidesByPathFileFrag(filePathIn,fnFragIn)
        
        seriesAddList = []
        failCount = 0
        if (len(episodeList) > 0):
            # > For each artifact:
            for artifactDict in episodeList:
                # > Confirm the artifact's file is present
                filExist = self.artifactFileCheck(filePathIn,artifactDict['file'])
                # > If not, skip it (Maybe print something(?))
                if filExist == False:
                    xStr = 'File does not exist: ' + artifactDict['file']
                    retDict['status']['log'].append(xStr)
                    failCount += 1
                    continue
                pass
                # > Is it is already associated with a series?
                if artifactDict['artifactid'] in serEpiList:
                    # > If so:
                    # > Skip it (Maybe print something(?))
                    xStr = "Artifact is already an associated episode: " + artifactDict['artifactid']
                    retDict['status']['log'].append(xStr)
                    print(xStr)
                    continue
                else:
                    pass
                    # > If not:
                    # > Add it to the series (insert into s2e)
                    vldb.addEpisodeToSeries(seriesArtiIdIn,artifactDict['artifactid'])
                    # > Add tags associated with the series to the artifact (?)
                    # > Append it to retDict['result']
                    retDict['data'].append(artifactDict['artifactid'])
                    xStr = "Artifact added to series: " + artifactDict['artifactid']
                    retDict['status']['log'].append(xStr)
                pass
            pass
        else:
            failCount += 1
            retDict['status']['detail'] = "No artifacts found for Path " + filePathIn + " and Filename fragment " + fnFragIn
        
        pass
        if failCount == 0:
            retDict['status']['success'] = True
        return retDict
    def apiCreateSingleArtifact(self,argDictIn): # UPDATED FOR NEW RETURN OBJECT MODEL
        artifactid = None
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'apiCreateSingleArtifact'
        tmpRetObj['params'] = [argDictIn]
        
        assert type(argDictIn) == type({'this':'that'})
        dictIn = argDictIn
        tmpRetObj['status']['success'] = False
        tmpRetObj['status']['detail'] = 'did not even begin'
        tmpRetObj['data'] = [{'artifactid':''}]
        evenTry = True
        if dictIn['majtype'] != 'tvseries':
            try:
                checkVal = self.newArtiPreCheck(dictIn['filepath'],dictIn['file'])
                assert checkVal == True
            except:
                evenTry = False
                sdStr = "Artifact for file = " + dictIn['file'] 
                sdStr += " already exists, or file is not present in the specified path."
                tmpRetObj['status']['success'] = False
                tmpRetObj['status']['detail'] = sdStr
                tmpRetObj['data'] = [{'artifactid':''}]
        else:
            pass
        pass
        if evenTry == True:
            try:
                print("trying newSingleArtifact...")
                
                artiData = {}
                artiData['title'] = dictIn['file']
                artiData['file'] = dictIn['file']
                artiData['majtype'] = dictIn['majtype']
                artiData['filepath'] = dictIn['filepath']
                artiData['runmins'] = -1
                artiData['season'] = -1
                artiData['episode'] = -1
                artiData['relyear'] = -1
                artiData['director'] = '[]'
                artiData['writer'] = '[]'
                artiData['primcast'] = '[]'
                artiData['relorg'] = '[]'
                artiData['eidrid'] = 'string'
                artiData['imdbid'] = 'string'
                artiData['arbmeta'] = '{}'
                artifactid = self.createArtifact(artiData)
                tmpRetObj['status']['success'] = True
                tmpRetObj['status']['detail'] = dictIn['file']
                tmpRetObj['data'] = [{'artifactid':artifactid}]

            except:
                print("newSingleArtifact EXCEPTION!")
                detailStr = 'Attempt to insert failed with input values ' + json.dumps(dictIn) + ' and artifact values ' + json.dumps(artiData)
                tmpRetObj['status']['success'] = False
                tmpRetObj['status']['detail'] = detailStr
                tmpRetObj['data'] = [{'artifactid':artifactid}]
                pass
            pass
        return tmpRetObj
    def apiLogPlay(self,artiIdIn,clientIdIn):   # Updated to use .cfg
        retDict = {}
        retDict['method'] = 'apiLogPlay'
        retDict['params'] = [artiIdIn,clientIdIn]
        retDict['status'] = {'success':False,'detail':'','log':[]}
        retDict['data'] = []
        
        try:
            #vldb = VodLibDB()
            vldb = self.dbHandleConfigged()
            retval = vldb.logPlay(artiIdIn,clientIdIn)
            retDict['status']['success'] = True
            retDict['status']['detail'] = retval
        except:
            print('MediaLibraryDB.apiLogPlay is sad.')
            retDict['status']['detail'] = 'MediaLibraryDB.apiLogPlay is sad.'
        return retDict
    def generateStandardRecsAllUsers(self, sinceDtStrIn, recLimitIntIn):
        vldb = self.dbHandleConfigged()
        vldb.generateRecsAllUsers(sinceDtStrIn,recLimitIntIn,self.config['API_Resources']['omdbapi_key'])
        pass
        # generateRecsAllUsers
        return True
    def generateStandardRecs(self,clientIdStrIn,sinceDtStrIn,recLimitIntIn):   # Updated to use .cfg
        # print ("generateStandardRecs got: " + clientIdStrIn + ", " + sinceDtStrIn + ", " + str(recLimitIntIn))
        pass
        recsObj = {'meta':{},'artifacts':{},'data':{'others':{'tvseries':[],'movie':[]},'tags':{'tvseries':[],'movie':[]},'people':{'tvseries':[],'movie':[]},'server':{'tvseries':[],'movie':[]},'rewatch':{'tvseries':[],'movie':[]}}};
        
        # Let's bail out if Recs are not on.
        # self.config['API_Settings'] = {'do_recs': 'on'
        if (self.config['API_Settings']['do_recs'] != "on"):
            recsObj['meta']['message'] = "Recommendations disabled on this Server."
            return recsObj
            
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        # print ("generateStandardRecs instantiated VodLibDB.")
        # People
        resList = vldb.getRecommendedArtifactPersonsListSimple(clientIdStrIn,sinceDtStrIn)
        # print ("generateStandardRecs: resList " + str(resList))
        
        artiList = vldb.getRecommendedArtifactsByPeopleSimple(resList,clientIdStrIn,sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['people'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
            
            #self.fetchPosterFile(recsObj['artifacts'][recArti['artifactid']]['imdbid'])
            # print(recsObj['artifacts'][recArti['artifactid']]['imdbid'])
            
        # print ("generateStandardRecs: artiList " + str(artiList))
    
        # Tags
        artiList = vldb.getRecommendedArtifactsByTags(clientIdStrIn,sinceDtStrIn,recLimitIntIn,10)
        for recArti in artiList:
            recsObj['data']['tags'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        # print ("generateStandardRecs: Tags artiList " + str(artiList))
    
        # Others
        artiList = vldb.getRecommendedArtifactsByOthers(clientIdStrIn,sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['others'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        # print ("generateStandardRecs: Others artiList " + str(artiList))
        
        # Server
        artiList = vldb.getRecommendedArtifactsByServer(sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['server'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        # print ("generateStandardRecs: Server artiList " + str(artiList))
        
        # Rewatch
        artiList = vldb.getRecommendedArtifactsByRewatch(clientIdStrIn,sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['rewatch'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        # print ("generateStandardRecs: Rewatch artiList" + str(artiList))
        
        ###
        artiIdList = list(recsObj['artifacts'].keys())
        # print(str(artiIdList))
        
        
        
        for artiId in artiIdList:

            posterLink = self.fetchPosterFile2(recsObj['artifacts'][artiId][0]['imdbid'])

            recsObj['artifacts'][artiId][0]['poster'] = posterLink
        
        ###
        
        now = datetime.now()
        
        recsObj['meta']['create_date'] = now.strftime("%Y-%m-%d %H:%M:%S")
        
        # badImdbid = ['none','string','']
        # for artiKey in recsObj['artifacts'].keys():
            # if not (recsObj['artifacts'][artiKey]['imdbid'] in badImdbid):
                # self.fetchPosterFile(recsObj['artifacts'][artiKey]['imdbid'])
            # pass
        # pass
            
        
        return recsObj
    def fetchRecsFromCache(self,clientIdIn, sinceDTIn, recLimitIn, forceBoolIn=False):
        vldb = self.dbHandleConfigged()
        recsObj = {'meta':{},'artifacts':{},'data':{'others':{'tvseries':[],'movie':[]},'tags':{'tvseries':[],'movie':[]},'people':{'tvseries':[],'movie':[]},'server':{'tvseries':[],'movie':[]},'rewatch':{'tvseries':[],'movie':[]}}};
        recsJson = vldb.getRecJsonFromCache(clientIdIn)
        if recsJson == None or forceBoolIn == True:
            # genRecsObj = self.generateStandardRecs(clientIdIn,sinceDTIn,recLimitIn)
            # vldb.writeRecToCache(clientIdIn,genRecsObj,int(self.config['API_Settings']['recs_exp_days']))
            
            vldb.generateRecsAllUsers(sinceDTIn, recLimitIn, self.config['API_Resources']['omdbapi_key'])
            
            recsJson = vldb.getRecJsonFromCache(clientIdIn)
            
            recsObj = genRecsObj
        else:
            recsObj = yaml.safe_load(recsJson.replace("'","\\\\\'"))
        return recsObj
    def getSeriesFirstEpisodeAid(self,seriesAidIn):   # Updated to use .cfg
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getSeriesFirstEpisodeAid'
        tmpRetObj['params'] = [seriesAidIn]
        tmpRetObj['status']['success'] = True
                        
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        tmpRetObj['data'] = vldb.getAIDofFirstEpisode(seriesAidIn)
        
        return  tmpRetObj
    def getSeriesSeasonEpisodeList(self,seriesAidIn,seasonIntIn):   # Updated to use .cfg
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getSeriesSeasonEpisodeList'
        tmpRetObj['params'] = [seriesAidIn,seasonIntIn]
        tmpRetObj['status']['success'] = True
                        
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        tmpRetObj['data'] = vldb.getSeriesEpisodeListSingleSeason(seriesAidIn,seasonIntIn)
        return tmpRetObj
    def getSeriesSeasonNumberList(self,seriesAidIn):   # Updated to use .cfg
        # getRecSeriesList(self,seriesArtiIdIn)
        #vldb = VodLibDB()
        vldb = self.dbHandleConfigged()
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getSeriesSeasonNumberList'
        tmpRetObj['params'] = [seriesAidIn]
        tmpRetObj['status']['success'] = True
                                
        tmpRetObj['data'] = vldb.getRecSeriesList(seriesAidIn)
        return tmpRetObj
    def fetchApiConfig(self): 
        # take the current config, strip out the private stuff, and
        # send it back to the client
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'fetchApiConfig'
        tmpRetObj['params'] = []
        tmpRetObj['status']['success'] = True
        
        clientCfg = copy.deepcopy(self.config)
        clientCfg.pop('Database')
        tmpRetObj['data'] = clientCfg
        
        return tmpRetObj
    def omdbFetchSingleArti(self,imdbIdIn):
        uri = "https://www.omdbapi.com/?i=" +  imdbIdIn
        try:
            uri = "https://www.omdbapi.com/?apikey=" + self.config['API_Resources']['omdbapi_key'] + "&i=" +  imdbIdIn
            print(uri)
        except:
            print("No OMDBAPI Key set.  Access to resources may be limited.  See https://www.omdbapi.com/ for details.")
        pass
        
        response = requests.get(uri)
        return response.json()
    def omdbFetchSeriesSeason(self,serImdbIdIn,seasonNmbrIn):
        serDict = self.omdbFetchSingleArti(serImdbIdIn)
        if serDict['Response'] == 'True' \
        and serDict['Type'] == 'series' \
        and seasonNmbrIn <= int(serDict['totalSeasons']):
            
            uri = "https://www.omdbapi.com/?i=" +  serImdbIdIn + "&season=" + str(seasonNmbrIn) + "&detail=full"
            try:
                uri = "https://www.omdbapi.com/?apikey=" + self.config['API_Resources']['omdbapi_key'] + "&i=" +  serImdbIdIn + "&season=" + str(seasonNmbrIn) + "&detail=full"
                print(uri)
            except:
                print("No OMDBAPI Key set.  Access to resources may be limited.  See https://www.omdbapi.com/ for details.")
            pass
            
            response = requests.get(uri)
            return response.json()
        else:
            print(serImdbIdIn + " appears not to be a series, or is in some other way broken.")
            return serDict
        pass
    def omdbProcessSeries(self,serImdbIdIn):  # seasonNmbrIn
        vldb = self.dbHandleConfigged()
        
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'omdbProcessSeries'
        tmpRetObj['params'] = [serImdbIdIn]
                
        # print(serImdbIdIn)
        warnList = []
        errList = []
        
        seriesArti = self.omdbFetchSingleArti(serImdbIdIn)
        
        # if seriesArti['Response'] == "False" or seriesArti['Type'] != "series" or int(seriesArti['totalSeasons']) < 1:
            # # Can't process this one.
            # raise Exception("IMDB ID " + serImdbIdIn + " Cannot be processed as a series.")

        try:
            assert seriesArti['Response'] != "False"
            assert seriesArti['Type'] == "series"
            assert int(seriesArti['totalSeasons']) > 0
        except:
            raise Exception("IMDB ID " + serImdbIdIn + " Cannot be processed as a series.  JSON: " + json.dumps(seriesArti))
        
        # Artifact Update Dict
        aud = {}
        aud['relyear'] = int(seriesArti['Released'].split(' ')[2])   #":"23 Sep 1995",
        if seriesArti['Director'] != "N/A":
            aud['director'] = seriesArti['Director'].split(', ')
        aud['writer'] = seriesArti['Writer'].split(', ')
        aud['primcast'] = seriesArti['Actors'].split(', ')
        aud['synopsis'] = seriesArti['Plot'].replace('"','\\\"')
        
        ##  This is where we would modify the Series Artifact
        whereClause = ' imdbid = "' + serImdbIdIn + '" '
        resDict = self.getArtifactsByArbWhereClause(whereClause)
        # print(json.dumps(resDict))
        serArtiId = resDict[0]['artifactid']
        self.modifyArtifact(serArtiId,aud)
        
        # print("Series aud: " + json.dumps(aud))
        
        seasonCount = int(seriesArti['totalSeasons'])
        for seasonNmbr in range(1,seasonCount + 1): 
            # print("=====>> SEASON Number " + str(seasonNmbr))
        
            respDict = self.omdbFetchSeriesSeason(serImdbIdIn,seasonNmbr)
            # print(json.dumps(respDict))
            if respDict['Response'] == 'True':
                try:
                    season = respDict['Season']
                    for episode in respDict['Episodes']:
                        seaStr = "S" + season
                        if int(season) < 10:
                            seaStr = "S0" + season
                        epStr = "E" + episode['Episode']
                        if int(episode['Episode']) < 10:
                            epStr = "E0" + episode['Episode']
                        pass
                        seStr = seaStr + epStr
                        # try to get the corresponding artifact
                        # print(respDict['Title'] + "_" + seStr + ": " + episode['Title'])
                        
                        # Artifact Update Dict
                        aud = {}
                        aud['season'] = int(respDict['Season'])
                        aud['episode'] = int(episode['Episode'])
                        aud['relyear'] = int(episode['Released'].split(' ')[2])   #":"23 Sep 1995",
                        aud['director'] = episode['Director'].split(', ')
                        aud['writer'] = episode['Writer'].split(', ')
                        aud['primcast'] = episode['Actors'].split(', ')
                        aud['imdbid'] = episode['imdbID']
                        aud['synopsis'] = episode['Title'] + ' - ' + episode['Plot'].replace('"','\\\"')
                        
                        # print(json.dumps(aud))
                        
                        try:
                            ##  This is where we would modify the Episode Artifact
                            # print("MediaLibraryDB.omdbProcessSeries seStr: " + seStr)
                            resDict = vldb.getSeriesEpByImdbIdAndSEStr(serImdbIdIn,seStr)[0]
                            
                            # print(json.dumps(resDict))
                            
                            serArtiId = resDict['artifactid']
                            self.modifyArtifact(serArtiId,aud)
                            # # print("Series: " + json.dumps(aud))
                            
                            # print("Episode AUD: " + json.dumps(aud))
                        except:
                            xcStr = "MediaLibraryDB.omdbProcessSeries failed to update Episode " + seriesArti['Title'] +  " - " + serImdbIdIn + " " + seStr
                            warnList.append(xcStr)
                            print(xcStr)
    
                        pass
                    pass
                except:
                    xcStr = "I cant work like this:\n" + json.dumps(respDict)
                    errList.append(errList)
                    print(errList)
            else:
                xcStr = imdbIdIn + " - Failed to fetch Season " + str(seasonNmbrIn)
                warnList.append(xcStr)
                print(xcStr)
            pass
            
        if len(errList) == 0:
            tmpRetObj['status']['success'] = True
        else:
            tmpRetObj['status']['success'] = False
        tmpRetObj['status']['detail'] = "Warnings: " + str(warnList) + "; Errors: " + str(errList)
        tmpRetObj['data'] = []
        
        return tmpRetObj
    def getSiteStats(self,perDaysIn):
        print("getSiteStats - BEGIN")
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'getSiteStats'
        tmpRetObj['params'] = []
        tmpRetObj['status']['success'] = False
        try:
            assert type(perDaysIn) == type(1)
            assert perDaysIn > 0
            assert perDaysIn < 180
            print("getSiteStats - BEGIN try block")
            vldb = self.dbHandleConfigged()
            statsDict = vldb.getSiteStats(60)
            tmpRetObj['data'] = statsDict
            tmpRetObj['status']['success'] = True
            print("getSiteStats - END try block")
        except:
            print("getSiteStats - BARF!  perDaysIn: " + perDaysIn)
            tmpRetObj['status']['detail'] = "Could not fetch Site Statistics"
            tmpRetObj['status']['success'] = False
            tmpRetObj['data'] = []
        return tmpRetObj
    def sessionDBHandle(self):
        pass
    def sessCreateUser(self,loginNameIn,properNameIn,passwordIn,emailIn,commentIn):
        pass
    def sessGetUserAttrsByLoginName(self,loginnameIn):
        pass
    def sessGetUserAttrsByUserID(self,loginnameIn):
        pass
    def sessGetUserAttrsBySessionToken(self,loginnameIn):
        pass
    def sessConfirmUser(self,useridIn):
        pass
    def sessGetActiveSessionTimeout(self,loginnameIn):
        pass
    def sessStartSessionWithCreds(self,loginnameIn,passwordIn):
        pass
    def sessEndSessionWithToken(self,sessiontokenIn):
        pass
    def sessUpdateUserMeta(self,useridIn, metadictIn):
        pass
    def sessUserAuthCheck(self,useridIn):
        pass
    def sessUpdateCookies(self,useridIn,cookieDictIn):
        pass
    def userGetRecentEpisodes(self,clientIdIn):
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['method'] = 'userGetRecentEpisodes'
        tmpRetObj['params'] = [clientIdIn]
        tmpRetObj['status']['success'] = False
        try:
            vldb = self.dbHandleConfigged()
            print("userGetRecentEpisodes - got vldb")
            rowsList = vldb.getRecentEpisodes(clientIdIn)
            print("userGetRecentEpisodes - got rowsList")
            tmpRetObj['data'] = rowsList
            tmpRetObj['status']['success'] = True
        except:
            pass
            print("userGetRecentEpisodes - BARF!  clientIdIn: " + clientIdIn)
            tmpRetObj['status']['detail'] = "Could not userGetRecentEpisodes"
            tmpRetObj['status']['success'] = False
            tmpRetObj['data'] = []            
        
        # vldb = self.dbHandleConfigged()
        # print("userGetRecentEpisodes - got vldb")
        # rowsList = vldb.getRecentEpisodes(clientIdIn)
        # print("userGetRecentEpisodes - got rowsList")
        # tmpRetObj['data'] = rowsList
        # tmpRetObj['status']['success'] = True        
        
        
        pass
        return tmpRetObj
    def getArtiFileCTime(self,basedirIn,artidirIn,artifileIn):
        workingpath = basedirIn + artidirIn + "/" + artifileIn
        retval = None
        try:
            filCTime = os.path.getctime(workingpath)
            #print("filCTime", filCTime)
            filCTimeInt = int(filCTime)
            #print("filCTimeInt", filCTimeInt)
            dtstr = str(datetime.fromtimestamp(filCTimeInt))
            #dtstr = datetime.fromtimestamp(filCTimeInt))
            #print("dtstr",dtstr)
            #dtstr = datetime.fromtimestamp(int(os.path.getctime(workingpath)))
            retval = dtstr
        except:
            print("Could not get file create time for " + workingpath)
        return retval



class RNUserSession:
    def __init__(self):
        self.dbc = {"host":"","database":"","user":"","password":""}
        self.dbc['host'] = 'localhost'
        self.dbc['database'] = 'vodlib'
        self.dbc['user'] = 'vodlibapi'
        self.dbc['password'] = 'vodlibapipw'
        self.sessionMaxDurationDays = 365
        pass
    def echoDb(self):
        print(str(self.dbc))
    def _connect(self):
        dbc = pymysql.connect(host=self.dbc['host'],user=self.dbc['user'],password=self.dbc['password'],database=self.dbc['database'])
        return dbc
        pass
    def _stdRead(self,sqlIn):
        data = None
        try:
            assert sqlIn.split(" ")[0].upper() == "SELECT"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            data = cursor.fetchall()
            dbc.close()
        except:
            print("_stdRead FAILED to execute: " + sqlIn)
        return data
    def _stdUpdate(self,sqlIn):
        retval = None
        try:
            assert sqlIn.split(" ")[0].upper() == "UPDATE"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            dbc.commit()
            dbc.close()
            pass
        except:
            print("_stdUpdate FAILED to execute: " + sqlIn)
            raise Exception("Update failed!")
        return retval
    def _stdInsert(self,sqlIn):
        retval = None
        try:
            assert sqlIn.split(" ")[0].upper() == "INSERT"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            dbc.commit()
            dbc.close()
            pass
        except:
            print("_stdInsert FAILED to execute: " + sqlIn)
        return retval
    def _stdDelete(self,sqlIn):
        retval = None
        try:
            assert sqlIn.split(" ")[0].upper() == "DELETE"
            dbc = self._connect()
            cursor = dbc.cursor()
            cursor.execute(sqlIn)
            dbc.commit()
            dbc.close()
            pass
        except:
            print("_stdDelete:  FAILED to execute: " + sqlIn)
        return retval
    def createUser(self,loginNameIn,properNameIn,passwordIn,emailIn,commentIn):
        # Generate UserID
        uId = str(uuid.uuid4())
        # artifactDictIn['artifactid'] = aId
        sqlStr = """INSERT INTO users 
        SET 
            userid = '""" + uId + """', 
            loginname = '""" + loginNameIn + """', 
            propername = '""" + properNameIn + """', 
            activetf = true, 
            confirmtf = false, 
            lockedtf = false,
            password = PASSWORD('""" + passwordIn + """'),
            email = '""" + emailIn + """', 
            createdt = NOW(), 
            sessiontoken = '""" + uId + """', 
            comment = '""" + commentIn + """' """
        
        self._stdRead(sqlStr)
        pass
    def getUserAttrsByLoginName(self,loginnameIn):
        keylist = ['userid', 'loginname', 'propername', 'activetf', 'confirmtf', 'lockedtf', 'createdt', 'sessiontoken', 'sessionexpiredt', 'comment', 'metajson']
        retDict = {}
        sqlStr = """SELECT userid, loginname, propername, activetf, confirmtf, lockedtf, createdt, sessiontoken, sessionexpiredt, comment, metajson
FROM users 
WHERE loginname = '""" + loginnameIn + """' """
        resultTuple = self._stdRead(sqlStr)
        for i in range(0,len(keylist)):
            if keylist[i] in ['createdt', 'sessionexpiredt']:
                retDict[keylist[i]] = resultTuple[0][i].strftime('%Y-%m-%d %H:%M:%S')
            else:
                retDict[keylist[i]] = resultTuple[0][i]
        return retDict
    def getUserAttrsByUserID(self,useridIn):
        keylist = ['userid', 'loginname', 'propername', 'activetf', 'confirmtf', 'lockedtf', 'createdt', 'sessiontoken', 'sessionexpiredt', 'comment', 'metajson']
        retDict = {}
        sqlStr = """SELECT userid, loginname, propername, activetf, confirmtf, lockedtf, createdt, sessiontoken, sessionexpiredt, comment, metajson
FROM users 
WHERE userid = '""" + useridIn + """' """
        resultTuple = self._stdRead(sqlStr)
        for i in range(0,len(keylist)):
            retDict[keylist[i]] = resultTuple[0][i]
        return retDict
    def getUserAttrsBySessionToken(self,sessiontokenIn):
        keylist = ['userid', 'loginname', 'propername', 'activetf', 'confirmtf', 'lockedtf', 'createdt', 'sessiontoken', 'sessionexpiredt', 'comment', 'metajson']
        retDict = {}
        sqlStr = """SELECT userid, loginname, propername, activetf, confirmtf, lockedtf, createdt, sessiontoken, sessionexpiredt, comment, metajson
FROM users 
WHERE sessiontoken = '""" + sessiontokenIn + """' """
        # print("getUserAttrsBySessionToken - sessiontokenIn: " + sessiontokenIn + ", " + sqlStr )
        resultTuple = self._stdRead(sqlStr)
        # print("getUserAttrsBySessionToken - resultTuple: " + str(resultTuple))
        for i in range(0,len(keylist)):
            #retDict[keylist[i]] = resultTuple[0][i]
            if keylist[i] in ['createdt', 'sessionexpiredt']:
                retDict[keylist[i]] = resultTuple[0][i].strftime('%Y-%m-%d %H:%M:%S')
            else:
                retDict[keylist[i]] = resultTuple[0][i]
            
        return retDict
    def confirmUser(self,useridIn):
        sqlStr = """UPDATE users 
SET confirmtf = true 
WHERE userid = '""" + useridIn + """'
AND confirmtf = false """
        self._stdUpdate(sqlStr)
        pass
    def getActiveSessionTimeout(self,loginnameIn):
        sqlStr = """SELECT sessionexpiredt 
FROM users 
WHERE loginname = '""" + loginnameIn + """' 
AND activetf = true 
AND confirmtf = true 
AND lockedtf = false
AND sessionexpiredt > NOW()
AND sessiontoken != userid """  ### AND password = PASSWORD('password') 

        resultTuple = self._stdRead(sqlStr)
        return resultTuple
        pass
    def startSessionWithCreds(self,loginnameIn,passwordIn):
        wrkToken = ''
        currSessSQL = """SELECT sessiontoken 
FROM users 
WHERE sessiontoken != userid
AND loginname = '""" + loginnameIn + """' 
AND password = PASSWORD('""" + passwordIn + """')  
AND sessionexpiredt > NOW() 
AND activetf = true 
AND confirmtf = true 
AND lockedtf = false"""
        try:
            # print(currSessSQL)
            currSessTuple = self._stdRead(currSessSQL)
            wrkToken = currSessTuple[0][0]
            # print(wrkToken)
            return self.getUserAttrsBySessionToken(wrkToken)
        except:
            print("startSessionWithCreds: Could not find current session for " + loginnameIn)
        
        
        sessToken = str(uuid.uuid4())
        # print(sessToken)
        sqlStr = """UPDATE users 
SET sessiontoken = '""" +  sessToken + """', 
    sessionexpiredt = NOW() + INTERVAL +""" + str(self.sessionMaxDurationDays) + """ DAY,
    lastlogindt = NOW()
WHERE loginname = '""" + loginnameIn + """' 
AND password = PASSWORD('""" + passwordIn + """') 
AND activetf = true 
AND confirmtf = true 
AND lockedtf = false""" 
        
        # print(sqlStr)
        try:
            self._stdUpdate(sqlStr)
            return self.getUserAttrsByLoginName(loginnameIn)
        except:
            print("Could not create Session for user " + loginnameIn) # + " with Token " + sessToken)
            return {'status':-1, 'message': "Could not create Session for user " + loginnameIn}
        pass
    def endSessionWithToken(self,sessiontokenIn):
        sqlStr = """UPDATE users
SET sessiontoken = userid, 
    sessionexpiredt = NOW()
WHERE sessiontoken = '""" + sessiontokenIn + """'  """
        try:
            self._stdUpdate(sqlStr)
        except:
            print("Could not end Session for Token " + sessiontokenIn)
        pass
    def udpateUserMeta(self,userIdIn, metaDictIn):
        # Take in a Dictionary of KVPs to be added/updated in the metajson field for the user
        # Load the User's data from the DB and load the metajson into a Dictionary
        # Iterate over the keys in the supplied Dictionary, and update the metajson Dictionary
        # Dump the updated metajson Dictionary back out to a string, and update the value in the DB
        
        
        #assert type(metaDictIn) == type({'foo':'bar'})
        uAttr = self.getUserAttrsByUserID(userIdIn)
        uMDict = json.loads(uAttr['metajson'])
        updKeys = list(metaDictIn.keys())
        for key in updKeys:
            uMDict[key] = metaDictIn[key]
        
        sqlStr = """UPDATE users SET metajson = '""" + json.dumps(uMDict) + """' WHERE userid = '""" + userIdIn + """' """
        return self._stdUpdate(sqlStr)
    def userAuthCheck(self,userIDIn):
        retDict = {'success':False,'details':{}}
        try: 
            sqlStr = """SELECT sessiontoken, metajson 
FROM users 
WHERE userid = '""" + userIDIn + """' 
    AND sessiontoken != userid 
    AND sessionexpiredt > NOW() 
    AND activetf = true 
    AND confirmtf = true 
    AND lockedtf = false """
            resTuple = self._stdRead(sqlStr)
            retDict['success'] = True
            retDict['details'] = {'sessiontoken': resTuple[0][0], 'metajson': json.loads(resTuple[0][1])}
        except:
            print("userAuthCheck failed for user " + userIDIn)
        return retDict
    def updateCookies(self,userIdIn,cookieDictIn):
        assert type(cookieDictIn) == type({'this':'that'})
        return self.udpateUserMeta(userIdIn, {'cookies':cookieDictIn})
        
        pass
    def setUserCookiesByToken(self,tokenIn,cookieDictIn):
        userDict = self.getUserAttrsBySessionToken(tokenIn)
        userId = userDict['userid']
        return self.updateCookies(userId,cookieDictIn)
        pass
        

# Example first user for dev/testing.

# INSERT INTO users SET userid = "T0TALLYFAKEUSERID01", loginname = "fakeguy1",
# propername = "Fake Guy", activetf = TRUE, confirmtf = TRUE, lockedtf = FALSE,
# password = PASSWORD("password"), email = "fakeguy@example.com", createdt = NOW(),
# lastlogindt = NOW(), sessiontoken = "", comment = "First fake user";

class MLCLI:
    def __init__(self):
        self.ml = MediaLibraryDB()
        
        self.mainMenuList = []
        self.mainMenuList.append({'label':'Create new Artifact','detail':'Create new Artifact','func':self.doNewArti})
        self.mainMenuList.append({'label':'Create new Artifacts from a File List','detail':'Create new Artifacts from a File List','func':self.doNewArtisFromFile})
        self.mainMenuList.append({'label':'List Available Tags','detail':'List Available Tags','func':self.listTags})
        self.mainMenuList.append({'label':'Create New Tag','detail':'Create New Tag','func':self.doNewTag})
        self.mainMenuList.append({'label':"Get Artifacts By Tag",'detail':'Get Artifacts By Tag','func':self.artiByTag})
        self.mainMenuList.append({'label':"Get Artifacts By Search String",'detail':'Get Artifacts By Search String','func':self.srchArtiByTitle})
        self.mainMenuList.append({'label':"Get Artifacts Detail By ID",'detail':'Get Artifacts Detail By ID','func':self.srchArtiDetailById})
        self.mainMenuList.append({'label':'Edit Artifact By ID','detail':'Edit Artifact By ID','func':self.doEditArtiById}) #doEditArtiById
        self.mainMenuList.append({'label':'Add Tag to Artifact','detail':'Add Tag to Artifact','func':self.doTagToArti})
        self.mainMenuList.append({'label':'Add Tag to TV Series','detail':'Add Tag to TV Series','func':self.doTagToSeries})
        self.mainMenuList.append({'label':'Remove Tag from Artifact','detail':'Remove Tag from Artifact','func':self.doTagFromArti})
        # self.mainMenuList.append({'label':'Emergency Title Fix','detail':'string','func':self.doTitleFix})
        # self.mainMenuList.append({'label':'Save Library','detail':'Save Library','func':self.doSaveLib})
        self.mainMenuList.append({'label':'Fetch some Artifact details from API','detail':'string','func':self.doArtiDeetApiFetch})
        self.mainMenuList.append({'label':'Add missing IIMDB ID','detail':'Add missing IIMDB ID','func':self.doAddMissingImdbid})
        self.mainMenuList.append({'label':'Update Arti Deets from OMDBAPI data','detail':'Update Arti Deets from OMDBAPI data','func':self.doUpdateArtiFromOmdb})
        self.mainMenuList.append({'label':'Exit','detail':'','func':self.doExit})
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
    def artiByTag(self):
        tagStr = input("Enter your tag: ")
        print('\nArtifacts for Tag ' + tagStr + ':')
        print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        pLineList = []
        try:
            artiList = self.ml.getArtifactsByTag(tagStr)
            for arti in artiList:
                print(arti['title'] + ' (' + arti['artifactid'] + ')')
                pLineList.append(arti['title'])
            pass
        except:
            print('Operation failed')
        print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        return True
    def srchArtiByTitle(self):
        srchStr = input("Enter your Title search string: ")
        print('\nArtifacts for search string ' + srchStr + ':')
        print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        pLineList = []
        try:
            artiList = self.ml.findArtifactsByName(srchStr)
            for arti in artiList:
                print(arti['title'] + ' (' + arti['artifactid'] + ')')
                pLineList.append(arti['title'])
            pass
        except:
            print('Operation failed')
        print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        return True
        return self.fakeFunc()
    def srchArtiDetailById(self):
        artiIdStr = input('Enter the ID: ')
        
        aDict = self.ml.getArtifactById(artiIdStr)
        tList = [] 
        
        print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        print("Artifact details: " + str(aDict))
        print("\nTags associated: " + str(tList))
        print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        return self.fakeFunc()
    def listTags(self):
        tagList = self.ml.getTagList()
        print("\nAvailable Tags")
        print('-=-=-=-=-=- BEGIN =-=-=-=-=-=\n')
        print(str(tagList))
        print('\n-=-=-=-=-=- DONE =-=-=-=-=-=\n')
        return self.fakeFunc()
    def doTagToArti(self):
        tagStr = input('Enter the tag: ')
        titleStr = input('Enter the Title of the Artifact: ')
        tagOK = self.ml.findTag(tagStr)
        artiList = self.ml.findArtifactsByName(titleStr)
        print(str(tagOK))
        print(str(artiList))
        if ((tagOK > -1) and (len(artiList) > 0)):
            # Tag provided is OK and we have artifact(s) to work with
            taggedList = []
            for artiDict in artiList:
                aId = artiDict['artifactid']
                taRes = self.ml.addTagtoArtifact(tagStr,aId)
                if (taRes == True):
                    taggedList.append(artiDict['name'])
                pass
            pass
            print('Tagged ' + str(len(taggedList)) + ' artifacts.')
            self.libDirty = True
        else:
            # Tag provided is poop or there are no artifacts
            print('Tag provided is poop or there are no artifacts')
        pass
        return True
    def doTagToSeries(self):
        tagStr = input('Enter the tag: ')
        serArtiId = input('Enter the Artifact ID of the Series: ')
        self.ml.addTagToSeries(tagStr,serArtiId)
        return True
    def doTagFromArti(self):
        tagStr = input('Enter the tag: ')
        titleStr = input('Enter the Title of the Artifact: ')
        tagOK = self.ml.findTag(tagStr)
        artiList = self.ml.findArtifactsByName(titleStr)
        print(str(tagOK))
        print(str(artiList))
        if ((tagOK > -1) and (len(artiList) > 0)):
            # Tag provided is OK and we have artifact(s) to work with
            taggedList = []
            for artiDict in artiList:
                aId = artiDict['artifactid']
                taRes = self.ml.removeTagFromArtifact(tagStr,aId)
                if (taRes == True):
                    taggedList.append(artiDict['name'])
                pass
            pass
            print('Tagged ' + str(len(taggedList)) + ' artifacts.')
            pass
            self.libDirty = True
        else:
            # Tag provided is poop or there are no artifacts
            print('Tag provided is poop or there are no artifacts')
        pass
        return True
    def doNewArti(self):
        tmpArtiDict = self.__artiEditForm(self.ml.getArtifactPrototype())
        print(str(tmpArtiDict))
        print(str(self.ml.createArtifact(tmpArtiDict)))
        self.libDirty = True
        print('\n-=-=-=-=-=- END =-=-=-=-=-=\n')
        return True
    def doNewArtisFromFile(self):
        
        # We want to take in:
         # a FQ path to a file which contains a list of ".m4v" files
         # a relative file path where the files listed in the list file can be found
         # an optional "starter tag" to apply to all Artifacts created for the files
         # an optional "majtype" value to apply to all  all Artifacts created for the files
        # Load the "file list" file, and iterate over the list:
         # for each filename:
          # create a new Artifact, and set its "file" to the value from the "file list" file
          # set optional "majtype" if given
          # run through the list of keys for the Artifact
          # save the artifact to the Library
          # if an optional "starter tag" was provided, apply it
          # give an opportunity to apply further tags (<Enter> if none)
        # Remind the user to save the library.
        flfFQSpec = None
        artiFilePath = None
        
        stepOK = False
        while stepOK == False:
            flfFQSpec = input("Please provide a fully-qualified filespec for the \nList File: ")
            if os.path.exists(flfFQSpec):
                stepOK = True
            else:
                print(">> File " + flfFQSpec + " not found.  Try again.")
            pass
        pass
        stepOK = False
        while stepOK == False:
            artiFilePath = input("Please provide an Artifact \nRelative Path: ")
            
            validOK = False
            # Do some validation
            if type(artiFilePath) == type("string"):
                if artiFilePath != "":
                    validOK = True
                pass
            if validOK == True:
                stepOK = True
            pass
        pass
        stepOK = False
        while stepOK == False:
            artiFirstTag = input(">OPTIONAL< Please provide an Artifact \nStarter Tag (or <Enter> to skip): ")
            if artiFirstTag == "":
                # SKIP!
                stepOK = True
            else:
                validOK = False
                # Some validation, maybe?!
                if type(artiFirstTag) == type("string"):
                    if artiFirstTag != "":
                        #We should make sure the tag is valid!
                        tagOK = self.ml.findTag(artiFirstTag)
                        if tagOK > -1:
                            validOK = True
                        pass
                    pass
                if validOK == True:
                    stepOK = True
                pass
            pass
        pass
        stepOK = False
        while stepOK == False:
            artiMajTyp = input(">OPTIONAL< Please provide an Artifact \nMajor Type (or <Enter> to skip): ")
            if artiMajTyp == "":
                # SKIP!
                stepOK = True
            else:
                validOK = False
                # Some validation, maybe?!
                if type(artiMajTyp) == type("string"):
                    if artiMajTyp != "":
                        validOK = True
                    pass #                validOK = True
                if validOK == True:
                    stepOK = True
                pass
            pass
        pass
        stepOK = False
        perArtiDetail = False
        while stepOK == False:
            detailResp = input("Enter individual details per-artifact?\n(y/N): ")
            if detailResp == "y" or detailResp == "Y":
                # SKIP!
                perArtiDetail = True
                stepOK = True
            else:
                stepOK = True
                pass
            pass
        pass
        
        # Bring in the file list
        flfContList = []
        try:
            fh2 = open(flfFQSpec,'r')
            for line in fh2:
                flfContList.append(line.strip())
            fh2.close()
        except IOError as error:
            print('File Sad: ' + str(error))
        else:
            pass
        finally:
            pass
        pass        
        
        # Iterate over the list of File List Files
        for flfFileName in flfContList:
            print("\n====>> BEGIN - File " + flfFileName + "\n")
            # Create the Artifact and preload known values
            thisArtiDict = self.ml.getArtifactPrototype()
            thisArtiDict['file'] = flfFileName
            thisArtiDict['filepath'] = artiFilePath
            if (type(artiMajTyp) == type("string")):
                if (artiMajTyp != ""):
                    thisArtiDict['majtype'] = artiMajTyp
                pass
            pass
            
            if perArtiDetail == True:
                # Run the form
                tmpArtiDict = self.__artiEditForm(thisArtiDict)
            else:
                tmpArtiDict = thisArtiDict
                thisArtiDict['title'] = flfFileName
            pass
            
            # Store the Artifact
            thisArtiId = self.ml.createArtifact(tmpArtiDict)
            
            # Add Starter Tag
            if (type(artiFirstTag) == type("string")):
                if (artiFirstTag != ""):
                    taRes = self.ml.addTagtoArtifact(artiFirstTag,thisArtiId)
                pass
            pass
            
            # Opportunity to add more tag(s)
            # COMING SOON!  WATCH THIS SPACE!
            pass
            
            print("\n====>> END - File " + flfFileName + "\n")
            
        pass
 
        print("\n\nOK, that's it!\nPLEASE make sure you save the library to ensure\nall this hard work won't be lost!\n\n")       
        
        return self.fakeFunc()
    def doEditArtiById(self):
        artiIdStr = input('Enter the ID: ')
        aDict = self.ml.getArtifactById(artiIdStr)
        tList = self.ml.getTagList()
        artiEditedDict = self.__artiEditForm(aDict)
        print("artiEditedDict: " + str(artiEditedDict))
        result = self.ml.modifyArtifact(artiIdStr,artiEditedDict)
        print("self.ml.modifyArtifact result: " + str(result))
        return self.fakeFunc()
    def doNewTag(self):
        newTagStr = input("Enter your new Tag: ")
        self.libDirty = True
        return self.ml.createTag(newTagStr)
    def doSaveLib(self):
        print("Saving the library...")
        print(str(self.ml.saveLibraryToFile()))
        self.libDirty = False
        return True
    def doExit(self):
        if (self.libDirty == True):
            saveYN = input("Save before exit (y/N)? ")
            if (saveYN in ['y','Y']):
                print(str(self.doSaveLib()))
            pass
        pass
        return False
    def doArtiDeetApiFetch(self):
        print("cli.doArtiDeetApiFetch")
        self.ml.fetchDeetsFromApi()
        return True
    def doAddMissingImdbid(self):
        reqDict = self.ml.getArtifactLackingImdbid('movie')
        imdbidIn = input("Enter IMDB ID value for Artifact " + reqDict['title'] + ": ")
        self.ml.updateArtifactImdbid(reqDict['artifactid'],imdbidIn)
        cont1yn = input("Continue with OMDBAPI fetch?\n[ y / N ]: ")
        if cont1yn in ['y','Y']:
            self.ml.fetchDeetsFromApi()
            cont2yn = input("Continue with Artifact details update from OMDBAPI data?\n[ y / N ]: ")
            if cont2yn in ['y','Y']:
                self.ml.updateArtiDeetsFromOmdb(reqDict['artifactid'])
            pass
        pass
        return True
    def doUpdateArtiFromOmdb(self):
        artiId = input("doUpdateArtiFromOmdb - Input\nArtifact ID: ")
        self.ml.updateArtiDeetsFromOmdb(artiId)
        return True
    def fakeFunc(self):
        return True

pass

@app.route('/')
def index():
    # print(json.dumps(request))
    ## THE FOLLOWING HTML SHOULD PROBABLY NOT BE HERE FOR FUTURE USE.
    ## IT IS INTENDED PRIMARILY FOR DEVELOPMENT AND TESTING OF THE 
    ## WEB SERVICE FOR RMPC

    retval = """<!DOCTYPE html>

<!-- rmvod.html version 0.4.3  -->

<!--
rmvod.html  Copyright 2022, 2023 Paul Tourville

This file is part of RIBBBITmedia VideoOnDemand (a.k.a. "rmvod").

RIBBBITmedia VideoOnDemand (a.k.a. "rmvod") is free software: you 
can redistribute it and/or modify it under the terms of the GNU 
General Public License as published by the Free Software 
Foundation, either version 3 of the License, or (at your option) 
any later version.

RIBBBITmedia VideoOnDemand (a.k.a. "rmvod") is distributed in the 
hope that it will be useful, but WITHOUT ANY WARRANTY; without 
even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE. See the GNU General Public License for more 
details.

You should have received a copy of the GNU General Public License 
along with RIBBBITmedia VideoOnDemand (a.k.a. "rmvod"). If not, 
see <https://www.gnu.org/licenses/>.
-->

<html>
    <head>
        <link rel="stylesheet" href="/rmvod/css/rmvod_core.css">
        <style>
        </style>
        <script type="text/javascript" src="/rmvod/js/RMWebAppCoreUtil.js"></script> 
        <script type="text/javascript" src="/rmvod/js/rmvod_wa_core.js"></script> 
    </head>
    <body onload="switchboard('firstthing','',{})">
        <div class="mastercont" id="mastercont">
        </div>
    </body>
</html>
    
    
"""
    return retval

@app.route('/apiversion/get',methods = ['POST','GET'])
def apiVersion():  # UPDATED FOR NEW RETURN OBJECT MODEL
    ml = MediaLibraryDB()
    cssVerStr = ml.readCssFile('/var/www/html/rmvod/css/rmvod_core.css')
    htmlVerStr = ml.readHtmlFile('/var/www/html/rmvod/rmvod.html')
    
    tmpRetObj = copy.deepcopy(ml.libMeta['retdicttempl'])
    tmpRetObj['method'] = 'apiVersion'
    tmpRetObj['status']['success'] = True
    tmpRetObj['data'] = [{'api_version':versionStr,'api_file':fileStr,'db_version':ml.getDBVersion(),'css_version':cssVerStr,'html_version':htmlVerStr}]
    
    return json.dumps(tmpRetObj)

@app.route('/titleidlist/get',methods=['POST','GET'])
def getListTitleId():  # UPDATED FOR NEW RETURN OBJECT MODEL
    
    ml = MediaLibraryDB()
    
    dictIn = {}
    diKeysList = []
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        pass
    except:
        dictIn = {}
        diKeysList = []
    pass
    if "title" in diKeysList:
        # Let's search for artifacts based on a title fragment
        result = ml.findArtifactsByName(dictIn['title'])
        pass
    elif "tag" in diKeysList:
        # Let's search for artifacts based on a tag
        result = ml.getArtifactsByTag(dictIn['tag'])
        pass
    elif "majtype" in diKeysList:
        # Let's search for artifacts based on a majtype
        result = ml.getArtifactsByMajtype(dictIn['majtype'])
        pass
    elif "relyear2" in diKeysList:
        # Let's search for artifacts based on a release year
        result = ml.getArtifactsByRelyear(dictIn['relyear1'],dictIn['relyear2'])
        pass
    elif "whereclause" in diKeysList:
        print("WHERE clause: " + dictIn['whereclause'])
        # Just a placeholder
        result = ml.getArtifactsByArbWhereClause(dictIn['whereclause'])
        pass
    else:
        # I'm not sure, but I think "tag" has a way of dealing with 
        # no input... investigate using that, instead, maybe?
        result = ml.findArtifactsByName('')
        pass
    return json.dumps(result)

@app.route('/seriestidlist/get',methods=['POST'])
def getSeriesEpisodesTIDList():  # UPDATED FOR NEW RETURN OBJECT MODEL
    ml = MediaLibraryDB()
    dictIn = {}
    result = {}
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        result = ml.getIdTitleListBySeriesArtiId(dictIn['artifactid'])
    except:
        dictIn = {}
        result = copy.deepcopy(ml.libMeta['retdicttempl'])
    pass    
    return json.dumps(result)

@app.route('/artifact/get',methods=['POST','GET'])
def getArtifactObj(): # UPDATED FOR NEW RETURN OBJECT MODEL
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        # print("getArtifactObj got: " + json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "artifactid" in diKeysList
        assert type(dictIn['artifactid']) == type("string")
        assert 32 < len(dictIn['artifactid']) < 40
    except:
        print("What came in: " + request.json)
        dictIn = {}
        diKeysList = []
    pass
    ml = MediaLibraryDB()
    artiDict = ml.getArtifactByIdNew(dictIn['artifactid']) # getArtifactByIdNew
    return json.dumps(artiDict)

@app.route('/nextepisode/get',methods=['POST','GET'])
def getNxtEpArtifactObj(): # UPDATED FOR NEW RETURN OBJECT MODEL
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "artifactid" in diKeysList
        assert type(dictIn['artifactid']) == type("string")
        assert 32 < len(dictIn['artifactid']) < 40
    except:
        print("What came in: " + request.json)
        dictIn = {}
        diKeysList = []
    pass
    ml = MediaLibraryDB()
    artiDict = ml.getNextEpisodeArtifactById(dictIn['artifactid'])
    return json.dumps(artiDict)

@app.route('/suplist/get',methods=['POST','GET'])
def getSupportList(): # UPDATED FOR NEW RETURN OBJECT MODEL
    
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "table" in diKeysList
        assert type(dictIn['table']) == type("string")
        assert dictIn['table'] in ['persons','companies','tags']
    except:
        print("What came in: " + request.json)
        dictIn = {}
        diKeysList = []
    pass
    ml = MediaLibraryDB()
    artiDict = ml.getSupportList(dictIn['table'])
    return json.dumps(artiDict)
    
    pass

@app.route('/artifact/listfield/update',methods=['POST'])
def updateArtifactListField(): # UPDATED FOR NEW RETURN OBJECT MODEL
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "artifactid" in diKeysList
        assert type(dictIn['artifactid']) == type("string")
        assert 32 < len(dictIn['artifactid']) < 40
    except:
        print("What came in: " + request.json)
        dictIn = {}
        diKeysList = []
    pass
    ml = MediaLibraryDB()
    response = ml.artifactListFieldAction(reqJson)
    return json.dumps(response)

@app.route('/artifact/update',methods=['POST'])
def updateArtifact():  # UPDATED FOR NEW RETURN OBJECT MODEL
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "artifactid" in diKeysList
        assert type(dictIn['artifactid']) == type("string")
        assert 32 < len(dictIn['artifactid']) < 40
        
        assert 'values' in diKeysList
        assert type(dictIn['values']) == type({'key':'value'})
    except:
        print("What came in: " + request.json)
        dictIn = {}
        diKeysList = []
    pass
    ml = MediaLibraryDB()
    result = ml.modifyArtifact(dictIn['artifactid'],dictIn['values']) # sartifactIdIn,artifactDictIn)
    return json.dumps(result)
    pass

@app.route('/artifact/newsingle',methods=['POST'])
def newSingleArtifact(): # UPDATED FOR NEW RETURN OBJECT MODEL
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "majtype" in diKeysList
        assert "file" in diKeysList
        assert "filepath" in diKeysList
        pass
    except:
        print("What came in: " + request.json)
        dictIn = {}
        diKeysList = []
    pass
    ml = MediaLibraryDB()  
    result = ml.apiCreateSingleArtifact(dictIn)
    return json.dumps(result)
    pass
    
@app.route('/mfsearch/get',methods=['POST'])
def multiFactorSearch(): # UPDATED FOR NEW RETURN OBJECT MODEL 
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    srchStr = ""
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    ml = MediaLibraryDB()
    retobj = ml.getArtifactsByMultiFactorSrch(request.json)
    return json.dumps(retobj)
    pass

@app.route('/simpletxtsrch/get',methods=['POST','GET'])   ####  NEW NEW NEW  
def simpleTextSearch(): # UPDATED FOR NEW RETURN OBJECT MODEL
    print('BEGIN simpleTextSearch ====>>')
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    srchStr = ""
    print(reqJson)
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
        assert "srchstr" in diKeysList
        assert type(dictIn['srchstr']) == type("string")
        assert 1 < len(dictIn['srchstr']) < 100
        print("simpleTextSearch GOT THROUGH THE ASSERTS!!")
    except:
        print("What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    pass
    srchStr = str(dictIn['srchstr'])
    print(srchStr)
    
    ml = MediaLibraryDB()
    result = ml.findArtifactsBySrchStr(srchStr)
    return json.dumps(result)

@app.route('/series/artifacts/add',methods=['POST'])
def addArtisToSeries(): # UPDATED FOR NEW RETURN OBJECT MODEL
    #  addEpisodesToSeries(self,seriesArtiIdIn,filePathIn,fnFragIn)
    print('BEGIN addArtisToSeries ====>>')
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    srchStr = ""
    print(reqJson)
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    ml = MediaLibraryDB()
    retobj = ml.addEpisodesToSeries(dictIn['seriesaid'],dictIn['filepath'],dictIn['filefrag'])
    return json.dumps(retobj)
    pass

@app.route('/logplay/post',methods=['POST'])
def logPlayback():
    ml = MediaLibraryDB()
    retDict = ml.apiLogPlay(request.json['artifactid'],request.json['clientid'])
    return json.dumps(retDict)

@app.route('/artifact/recs/get',methods=['POST','GET'])
def getRecs():
    ml = MediaLibraryDB()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    retDict = {'meta':{},'artifacts':{},'data':{'others':{'tvseries':[],'movie':[]},'tags':{'tvseries':[],'movie':[]},'people':{'tvseries':[],'movie':[]},'server':{'tvseries':[],'movie':[]},'rewatch':{'tvseries':[],'movie':[]}}};

    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])    
    print(json.dumps(dictIn))
    forceRefresh = False;
    try:
        pass
        print("forceRefresh: " + str(dictIn['forceRefresh']))
        assert type(dictIn['forceRefresh']) == type(True)
        forceRefresh = dictIn['forceRefresh']
    except:
        pass
        print("Could not set forceRefresh based on requester input.  Using default value: " + str(forceRefresh))
    try:
        retDict = ml.fetchRecsFromCache(dictIn['clientId'],dictIn['sinceDt'],dictIn['recLimit'], forceRefresh)  # fetchRecsFromCache
    except:
        print( "Oh noes!  " + json.dumps(retDict))
    return json.dumps(retDict)

@app.route('/artifact/recs/serfirstep/get',methods=['POST'])
def getSeriesFirstEpAid():
    ml = MediaLibraryDB()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])    
    
    # print("What came in: " + str(request.json))
    return json.dumps(ml.getSeriesFirstEpisodeAid(dictIn['artiid']))

@app.route('/artifact/recs/serseasoneplist/get',methods=['POST'])
def getSeriesSeasonEpList():
    ml = MediaLibraryDB()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])    
    
    # print("What came in: " + str(request.json))
    return json.dumps(ml.getSeriesSeasonEpisodeList(dictIn['artiid'],dictIn['season']))    

@app.route('/artifact/recs/serseasonnmbrlist/get',methods=['POST'])
def getSeriesSeasonNmbrList():
    ml = MediaLibraryDB()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])    
    
    # # print("What came in: " + str(request.json))
    return json.dumps(ml.getSeriesSeasonNumberList(dictIn['artiid']))    

@app.route('/config/get',methods=['POST'])
def getApiConfig():
    ml = MediaLibraryDB()
    return json.dumps(ml.fetchApiConfig())
    
@app.route('/site/stats/get',methods=['POST'])
def getSiteStats():
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])    
    
    ml = MediaLibraryDB()
    return json.dumps(ml.getSiteStats(dictIn['days']))

@app.route('/artifact/tvseries/detail/fetch',methods=['POST'])
def runOmdbApiUpdateTvseries():
    ml = MediaLibraryDB()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])    
    artiDict = ml.getArtifactByIdNew(dictIn['artifactid'])
    print(json.dumps(artiDict))
    return json.dumps(ml.omdbProcessSeries(artiDict['data'][0]['imdbid']))

@app.route('/session/start',methods=['POST'])
def startUserSession():
    #ml = MediaLibraryDB()
    rus = RNUserSession()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    sessStartResult = rus.startSessionWithCreds(dictIn['credu'],dictIn['credp'])
    print(sessStartResult)
    return json.dumps(sessStartResult)

@app.route('/session/verify',methods=['POST'])
def verifyUserSession():
    #ml = MediaLibraryDB()
    rus = RNUserSession()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    result = rus.getUserAttrsBySessionToken(dictIn['token'])
    return json.dumps(result)

@app.route('/session/end',methods=['POST'])
def endUserSession():
    #ml = MediaLibraryDB()
    rus = RNUserSession()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    result = rus.endSessionWithToken(dictIn['token'])
    return json.dumps(result)

@app.route('/session/setcookies',methods=['POST'])
def userSessionSetCookies():
    #ml = MediaLibraryDB()
    rus = RNUserSession()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([])
    result = rus.setUserCookiesByToken(dictIn['token'],dictIn['cookies'])
    return json.dumps(result)
    
@app.route('/user/recent/episodes/get',methods=['POST'])
def userRecentEpisodes():
    ml = MediaLibraryDB()
    #rus = RNUserSession()
    dictIn = {}
    diKeysList = []
    reqJson = request.json
    try:
        dictIn = yaml.safe_load(json.dumps(request.json))
        diKeysList = list(dictIn.keys())
    except:
        print("FAIL!  What came in: " + str(request.json))
        dictIn = {}
        diKeysList = []
        return json.dumps([]) 
    result = ml.userGetRecentEpisodes(dictIn['clientid'])
    print(str(result))
    return json.dumps(result)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Optional app description')
    # Switch
    parser.add_argument('--cli', action='store_true', help='A boolean switch')
    parser.add_argument('--onerun', action='store_true', help='Run once')
    parser.add_argument("--allrecs", action="store_true", help="Eun Recommendations")
    args = parser.parse_args()

    if (args.cli == True):
        mlc = MLCLI()
        mlc.mainLoop()
    elif (args.onerun == True):
        
        # Do the "onerun"
        # #VodLibDB.getSiteStats(180)
        # vldb = VodLibDB()
        # print(json.dumps(vldb.getSiteStats(180)))
        
        ml = MediaLibraryDB()
        print(json.dumps(ml.getSiteStats()))
        #MediaLibraryDB
    elif (args.allrecs == True):
        ml = MediaLibraryDB()
        print("Executing recommendations...")
        ml.generateStandardRecsAllUsers('2022-01-01 00:00:00',30)
        print("Done.")

    else:
        app.run(host='0.0.0.0',port=5000)
    pass

















# /* 
   # CREATE TEMP TABLE TO COVER CONDENSING playlog_live AND 
   # JOINING TV SERIES DATA
   # THIS WORKS
   # Get list of views grouped by clientid and artifactid
   # with majtype and series artifactid and title where apropriate
 # */
# CREATE OR REPLACE TEMPORARY TABLE rec_logged_plays
# SELECT 
  # l.clientid, 
  # l.artifactid, 
  # e.title, 
  # e.majtype, 
  # MAX(l.reqtime) AS "reqtime", 
  # s.seriesaid, 
  # a.title AS "seriestitle"
# FROM playlog_live l
# JOIN artifacts e ON l.artifactid = e.artifactid 
# LEFT OUTER JOIN s2e s ON l.artifactid = s.episodeaid 
# LEFT OUTER JOIN artifacts a ON s.seriesaid = a.artifactid
# WHERE l.reqtime > '2022-01-01 00:00:00'
# GROUP BY 1, 2 
# ORDER BY reqtime DESC ;

# /*
   # CREATE A TEMP TABLE TO CONDENSE TAG POPULARITY AMONG
   # ARTIFACTS WATCHED PER clientid FOR tvseries AND movie
   # VALUES FOR majtype
# */
# /* TAGS AND WATCH-ARTIFACT COUNTS FOR clientid VALUES */ 
# /* Tags associated with Movies I've Watched */
# CREATE OR REPLACE TEMPORARY TABLE rec_tag_plays_by_client
# SELECT p.clientid, "tvseries" as "majtype", t.tag, COUNT(p.seriesaid) AS "artifactcount"
# FROM rec_logged_plays p 
# JOIN t2a t ON p.seriesaid = t.artifactid
# WHERE p.majtype = "tvepisode" 
# GROUP BY 1, 2, 3 
# UNION
# /* Tags associated with TV Series I've Watched */
# SELECT p.clientid, "movie" as "majtype", t.tag, COUNT(p.artifactid) AS "artifactcount"
# FROM rec_logged_plays p 
# JOIN t2a t ON p.artifactid = t.artifactid
# WHERE p.majtype = "movie" 
# GROUP BY 1, 2, 3 ;


# /*
   # CREATE A TEMP TABLE TO CONDENSE PERSON POPULARITY AMONG
   # ARTIFACTS WATCHED PER clientid FOR tvseries AND movie
   # VALUES FOR majtype
# */
# CREATE OR REPLACE TEMPORARY TABLE rec_person_plays_by_client
# SELECT p.clientid, "tvseries" as "majtype", a.personname, COUNT(p.seriesaid) AS "artifactcount"
# FROM rec_logged_plays p
# JOIN p2a a ON p.seriesaid = a.artifactid
# WHERE a.personname != "string"
# AND p.majtype = "tvepisode"
# GROUP BY 1, 2, 3
# UNION
# SELECT p.clientid, "movie" as "majtype", a.personname, COUNT(p.artifactid) AS "artifactcount"
# FROM rec_logged_plays p
# JOIN p2a a ON p.artifactid = a.artifactid
# WHERE a.personname != "string"
# AND p.majtype = "movie"
# GROUP BY 1, 2, 3 ;


# /* ==> REC: REWATCH <== */
# /* WHAT I'VE WATCHED */
# /* What I've Watched TV */
# SELECT DISTINCT seriesaid AS "artifactid", seriestitle AS "title" , "tvseries" AS "majtype" 
# FROM rec_logged_plays 
# WHERE majtype = "tvepisode" 
  # AND clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8"
# LIMIT 30;
# /* What I've watched movies */
# SELECT DISTINCT artifactid, title,  "movie" AS "majtype"
# FROM rec_logged_plays 
# WHERE majtype = "movie" 
  # AND clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8"
# LIMIT 30;


# /* ==> REC: PEOPLE <== */
# /* TV Series */
# SELECT DISTINCT a.artifactid, a.title, a.majtype
# FROM p2a pp 
# JOIN artifacts a ON pp.artifactid = a.artifactid 
# WHERE pp.personname IN (SELECT personname FROM rec_person_plays_by_client WHERE clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8") 
# AND pp.artifactid NOT IN (SELECT DISTINCT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" AND clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8" )
# AND a.majtype IN ( "tvseries" /* ,  "tvepisode" */ )
# AND pp.personname NOT IN ("N/A", "string") 
# LIMIT 30 ;
# /* Movie */
# SELECT DISTINCT a.artifactid, a.title, a.majtype
# FROM p2a pp 
# JOIN artifacts a ON pp.artifactid = a.artifactid 
# WHERE pp.personname IN (SELECT personname FROM rec_person_plays_by_client WHERE clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8") 
# AND pp.artifactid NOT IN (SELECT DISTINCT artifactid FROM rec_logged_plays WHERE majtype = "movie" AND clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8" )
# AND a.majtype IN ( "movie")
# AND pp.personname NOT IN ("N/A", "string") 
# LIMIT 30 ;



# /* ==> REC: TAG <== */
# /* TV Series */
# SELECT DISTINCT a.artifactid, a.title, a.majtype
# FROM t2a tt
# JOIN artifacts a ON tt.artifactid = a.artifactid
# WHERE tt.tag IN (SELECT tag FROM rec_tag_plays_by_client WHERE clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8")
# AND tt.artifactid NOT IN (SELECT DISTINCT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" AND clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8"  )
# AND a.majtype IN ("tvseries")
# LIMIT 30 ;
# /* Movie */
# SELECT DISTINCT a.artifactid, a.title, a.majtype
# FROM t2a tt
# JOIN artifacts a ON tt.artifactid = a.artifactid
# WHERE tt.tag IN (SELECT tag FROM rec_tag_plays_by_client WHERE clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8")
# AND tt.artifactid NOT IN (SELECT DISTINCT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" AND clientid = "353f7b11-f379-4828-9d52-4e7e8b0086e8"  )
# AND a.majtype IN ("movie")
# LIMIT 30 ;


# /* ==>  REC: OTHER <== */
# /* WHAT THEY'VE WATCHED */
# /* What Others have watched TV */
# SELECT clientid, seriesaid AS "artifactid", seriestitle AS "title", "tvseries" AS "majtype"
# FROM rec_logged_plays 
# WHERE majtype = "tvepisode" 
  # AND clientid != "353f7b11-f379-4828-9d52-4e7e8b0086e8"
# GROUP BY 1, 2 ;
# /* What others have watched movies */
# SELECT clientid, artifactid, title, "movie" AS "majtype" /* MAX(reqtime) as "reqtime" */ 
# FROM rec_logged_plays 
# WHERE majtype = "movie" 
  # AND clientid != "353f7b11-f379-4828-9d52-4e7e8b0086e8"
# GROUP BY 1, 2 ;


# */ ==> REC: SERVER <== */
# /* WHAT NO ONE HAS WATCHED */
# /* Movies No One Has Watched */
# SELECT DISTINCT a.artifactid, a.title, a.majtype
# FROM artifacts a 
# WHERE a.majtype = "movie" 
  # AND a.artifactid NOT IN ( SELECT artifactid FROM rec_logged_plays ) 
# LIMIT 30;
# /* TV Series No One Has Watched */
# SELECT DISTINCT a.artifactid, a.title, a.majtype
# FROM artifacts a 
# WHERE a.majtype = "tvseries" 
  # AND a.artifactid NOT IN ( SELECT seriesaid FROM rec_logged_plays WHERE majtype = "tvepisode" )
# LIMIT 30;



# /* ==> REC: NEW <== */
# /* NEW VIDEOS */
# /* movies */
# SELECT DISTINCT a.artifactid, a.title, a.majtype 
# FROM t2a t JOIN artifacts a on t.artifactid = a.artifactid 
# WHERE t.tag = 'new' AND a.majtype = 'movie'  
# ORDER BY t.artifactid limit 30;
# /* tveries */
# SELECT DISTINCT a.artifactid, a.title, a.majtype 
# FROM t2a t 
# JOIN artifacts a on t.artifactid = a.artifactid 
# WHERE t.tag = 'new' AND a.majtype = 'tvseries'  
# ORDER BY t.artifactid limit 30;
