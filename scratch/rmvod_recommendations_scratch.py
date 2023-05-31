#!/usr/bin/python3

import pymysql
import requests
import copy
import os
import json
import re
import time

from datetime import datetime


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
        return "0.8.0" # Table playlog_live added 
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
            
            api_url = "http://www.omdbapi.com/?i=" + aImdbid + "&apikey=87edb0eb"
            response = requests.get(api_url)
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
    # NEWISH - PICKED UP FROM IMDB SCRAPING PROJECT
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
        # print(selSql)
        rowsTuple = self._stdRead(selSql)
        # print(str(rowsTuple))
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
        #    season > -1 AND 
        rowsTuple = self._stdRead(selSql)
        for row in rowsTuple:
            retList.append(row[0])
        return retList
    
    # NEW!!  # NEW!!  # NEW!!  # NEW!!  # NEW!!  # NEW!!  # NEW!!  # NEW!!  # NEW!!  
    
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
        
class RMVOD_Recommendations:
    def __init__(self):
        pass
    def generateStandardRecs(self,clientIdStrIn,sinceDtStrIn,recLimitIntIn):
        pass
        recsObj = {'meta':{},'artifacts':{},'data':{'others':{'tvseries':[],'movie':[]},'tags':{'tvseries':[],'movie':[]},'people':{'tvseries':[],'movie':[]},'server':{'tvseries':[],'movie':[]},'rewatch':{'tvseries':[],'movie':[]}}};
        vldb = VodLibDB();
        
        # People
        resList = vldb.getRecommendedArtifactPersonsListSimple(clientIdStrIn,sinceDtStrIn)
        artiList = vldb.getRecommendedArtifactsByPeopleSimple(resList,clientIdStrIn,sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['people'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
    
        # Tags
        artiList = vldb.getRecommendedArtifactsByTags(clientIdStrIn,sinceDtStrIn,recLimitIntIn,10)
        for recArti in artiList:
            recsObj['data']['tags'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
    
        # Others
        artiList = vldb.getRecommendedArtifactsByOthers(clientIdStrIn,sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['others'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        
        # Server
        artiList = vldb.getRecommendedArtifactsByServer(sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['server'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        
        # Rewatch
        artiList = vldb.getRecommendedArtifactsByRewatch(clientIdStrIn,sinceDtStrIn,recLimitIntIn)
        for recArti in artiList:
            recsObj['data']['rewatch'][recArti['majtype']].append(recArti)
            recsObj['artifacts'][recArti['artifactid']] = vldb.getArtifactById(recArti['artifactid'])
        
        now = datetime.now()
        
        recsObj['meta']['create_date'] = now.strftime("%Y-%m-%d %H:%M:%S")
        
        return recsObj





if __name__ == "__main__":
    clientId = 'thisIsAFakeId-Netscape-1675678310395'
    sinceDTStr = "2023-02-01 00:00:01"
    recLimitInt = 30
    
    rec = RMVOD_Recommendations()
    recObj = rec.generateStandardRecs(clientId,sinceDTStr,recLimitInt)
    print(json.dumps(recObj))
    
