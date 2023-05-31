#!/usr/bin/python3

import pymysql
import requests
import copy
import os
import json
import re
import time


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
    # NEW NEW NEW NEW NEW NEW NEW
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

class IMDBFetch:
    def __init__(self):
        self.libMeta = {}
        #self.libMeta['libstore'] = {'path':'/home/tourvilp/Desktop/vodlib/DBSCRATCH/data','file':'vml_test.json'}
        self.libMeta['retdicttempl'] = {'method':'','params':[],'status':{},'data':[]}
        self.libMeta['retdicttempl']['status']['success'] = False
        self.libMeta['retdicttempl']['status']['detail'] = ''
        self.libMeta['retdicttempl']['status']['log'] = []        
        pass
    # Determines what seasons we have on the system and returns a list
    # of season numbers
    def seasonsList(self,serImdbIdIn):
        # Obviously, this needs to do something more sophisticated
        #return [1,2,3,4,5,6,7,8,9]
        vldb = VodLibDB()
        sList = vldb.getListOfSeriesSeasons(serImdbIdIn)
        if len(sList) == 0:
            sList = [1,2,3,4,5,6,7,8,9]
        return sList
    # Pulls TV Series Season Episode List HTML pages from IMDB and 
    # Stores them in a list for further processing in JavaScript
    def fetchSeriesSeasonEpLists(self,serIdIn):
        tmpRetObj = copy.deepcopy(self.libMeta['retdicttempl'])
        tmpRetObj['status']['method'] = 'fetchSeriesSeasonEpLists'
        tmpRetObj['status']['params'] = [serIdIn]   
        errCnt = 0  
        
        # Get list of season numbers.  For now, let's pretend
        #seasonList = [1,2,3,4,5,6,7]
        seasonList = self.seasonsList(serIdIn)
        
        # We need to pre-populate the html list with Nones
        htmlList = (max(seasonList) + 1) * [None]
        
        # https://www.imdb.com/title/tt1466074/episodes?season=1
        for seasonNumber in seasonList:
            wrkUri = 'https://www.imdb.com/title/' + serIdIn + '/episodes?season=' + str(seasonNumber)
            try:
                reqRes = requests.get(wrkUri)
                # htmlList[int(seasonNumber)] = reqRes.content
                htmlList[int(seasonNumber)] = reqRes.text
            except:
                errCnt += 1
                logStr = "Failed to fetch " + wrkUri
                print(logStr)
                tmpRetObj['status']['log'].append(logStr)
                continue
            pass
        pass
        
        tmpRetObj['data'] = htmlList
        if errCnt == 0:
            tmpRetObj['status']['success'] = True
        else:
            tmpRetObj['status']['success'] = False
        return tmpRetObj
    # Loads Episode data (JSON) from a file
    def getEpiData(self,fileNmIn):
        fh = open(fileNmIn,"r")
        dataJsonIn = fh.read()
        dataDict = json.loads(dataJsonIn)
        if dataDict['status']['success'] == False:
            print('Previous operation FAILED: ')
            print(json.dumps(dataDict['status']))
        pass
        return dataDict['data']
    # Take a Series ArtifactID and a list of lists (seasons, episiodes), 
    # and post updates to the corresponding Episode Artifacts
    def updateSeriesEpDetails(self,serAidIn,updateDataListIn):
        vldb = VodLibDB()
        for season in updateDataListIn:
            # We're in a season, now
            for episode in season:
                # Now we have a dictionary containing the update data 
                # for one episode
                # example: 
                # {
                #     'title': 'Ransom for a Dead Man', 
                #     'season': 1, 
                #     'episode': 0, 
                #     "episode_imdbid":"tt0066933",
                #     'relyear': 1971, 
                #     'synopsis': 'A brilliant tort attorney gets rid of her boring husband by faking his kidnapping and keeping the ransom. The FBI may be fooled, but not Columbo.', 
                #     'title_se_string': 'S01E00'
                #     }
                
                # So, let's see if we can fetch the existing episode data
                currEpAid = None
                currEpData = None
                try:
                    currEpAid = vldb.getEpisodeBySeriesIdAndTitleFrag(serAidIn,episode['title_se_string'])
                    currEpData = vldb.getArtifactById(currEpAid,False)
                    pass
                except:
                    print("ERROR: Could not get current episode data for " + episode['title_se_string'])
                    continue
                    pass
                pass
                
                # OK, now on to the real business
                updateDict = {}
                updateDict['imdbid'] = episode['episode_imdbid']
                updateDict['season'] = episode['season']
                updateDict['episode'] = episode['episode']
                updateDict['relyear'] = episode['relyear']
                updateDict['synopsis'] = episode['title'] + ' - ' + re.sub('"',"'",episode['synopsis'])
                
                ### Let's see if we can get a couple additional deets
                moreUpdateDict = self.augmentArtiDeetsFromOmdb(currEpAid,updateDict['imdbid'])
                for mudKey in list(moreUpdateDict.keys()):
                    updateDict[mudKey] = moreUpdateDict[mudKey]
                pass
                
                # Let's post the update to the Episode Artifact
                try:
                    vldb.updateArtifactByIdAndDict(currEpAid,updateDict)
                except:
                    print("Update FAILED for ArtifactID " + currEpAid)
                    continue
                pass
                # time.sleep(1.0)
                pass
            
            pass
        pass
    # Get the Artifact for the "series"
    def getSeriesArti(self,artiIdIn):
        vldb = VodLibDB()
        artiDict = vldb.getArtifactById(artiIdIn,False)
        return artiDict
    # Get the "SxxEyy" string from a title and make sure the 
    # "S" and "E" are uppercase
    def tvsEpiTitleSESmashUpper(self,titleStrIn):
        # While we're here, let's replace spaces with underscores
        tmpStr = titleStrIn.replace(" ","_")
        titleStrIn = tmpStr
        # OK, now on to the Smash Upper
        lastSeg = titleStrIn.split("_")[-1]
        seStr = lastSeg.split(".")[0]
        newSeStr = seStr.replace("s","S").replace("e","E")
        newTitleStr = titleStrIn.replace(seStr,newSeStr)
        return newTitleStr
    # Make sure the Season number is 2-digits (zero-padded)
    # expects tvsEpiTitleSESmashUpper to have already been run
    def tvsEpiTitleSEPadSeason(self,titleStrIn):
        # Expects S and E to already be smashed upper
        lastSeg = titleStrIn.split("_")[-1]
        seStr = lastSeg.split(".")[0]
        newSeStr = seStr
        seasonNmbr = int(seStr.split('E')[0].replace("S",""))
        if seasonNmbr < 10:
            newSeStr = "S0" + str(seasonNmbr) + "E" + seStr.split('E')[1]
        else:
            newSeStr = "S" + str(seasonNmbr) + "E" + seStr.split('E')[1]
        newTitleStr = titleStrIn.replace(seStr,newSeStr)
        return newTitleStr
    # Remove the filename extension ".m4v" from the title if it's there
    def artiTitleStripM4v(self,titleStrIn):
        newTitleStr = titleStrIn.replace('.m4v','')
        return newTitleStr
    # Do all the title fix actions in the right order
    def tvsEpTitleFix(self,titleStrIn):
        upper = self.tvsEpiTitleSESmashUpper(titleStrIn)
        # print(upper)
        padded = self.tvsEpiTitleSEPadSeason(upper)
        # print(padded)
        stripped = self.artiTitleStripM4v(padded)
        # print(stripped)
        return stripped
    # Takes the ArtifactID for a TV Series and performs standard fixes 
    # of the "title" value of the related episodes to help with matching
    # artifacts to data from external APIs
    def tvsFixEpisodeTitlesBySeries(self,seriesAidIn):
        vldb = VodLibDB()
        epAidList = vldb.getTvsEpisodeAidList(seriesAidIn)
        for epAid in epAidList:
            artiDict = vldb.getArtifactById(epAid,False)[0]
            newArtiTitle = self.tvsEpTitleFix(artiDict['title'])
            if artiDict['title'] != newArtiTitle:
                vldb.updateArtifactByIdAndDict(epAid,{'title':newArtiTitle})
                print(artiDict['title'] + " => " + newArtiTitle)
            pass
        pass
        return True
    # Takes the artifactID for a TV Series and fetches details from 
    # external sources to populate certain fields in the Episode
    # Artifacts
    def updateSeriesEpisodesFromImdbPhase1(self,seriesAidIn):
        
        self.tvsFixEpisodeTitlesBySeries(seriesArtiId)
        
        
        seriesArti = self.getSeriesArti(seriesArtiId)[0]
        print(str(seriesArti))
        print("Processing series: " + seriesArti['title'])
        
        foo = self.fetchSeriesSeasonEpLists(seriesArti['imdbid'])
        print(str(type(foo)))
        print("fetchSeriesSeasonEpLists Success = " + str(foo['status']['success']))
        
        for wPage in foo['data']:
            if wPage == None:
                print("Empty page -- skipping")
                continue
            tmpFoo = {}
            tmpFoo['status'] = foo['status']
            tmpFoo['data'] = [wPage]
            pgIdx = foo['data'].index(tmpFoo['data'][0])
            print("Working Season Page #" + str(pgIdx))
            
            fooJson = json.dumps(tmpFoo)
            fh = open('/home/tourvilp/Desktop/series_seasons.txt','w')
            fh.write(fooJson + '\n')
            fh.close()
            
            print("Calling imdb_episode_scraper.js...")
            os.system("/home/tourvilp/Desktop/imdb_episode_scraper.js > /home/tourvilp/Desktop/series_seasons_json.txt")
            print("imdb_episode_scraper.js done.")
            
            print("Fetching JSON data...")
            dd = f.getEpiData("/home/tourvilp/Desktop/series_seasons_json.txt")
            print("Processing Episodes")
            self.updateSeriesEpDetails(seriesArtiId,dd)
        pass
    # Generate an Update Dictionary of certain values from an external 
    # source from the ArtifactID and IMDB ID of an Artifact
    def augmentArtiDeetsFromOmdb(self,artiIdIn,imdbIdIn):
        updateDict = {}
        vldb = VodLibDB()
        artiDict = vldb.getArtifactById(artiIdIn,False)[0]
        
        # omdbApiKey = '87edb0eb' # old, free
        omdbApiKey = '6ae0bfce' # new, patreon

        api_url = "http://www.omdbapi.com/?i=" + imdbIdIn + "&apikey=" + omdbApiKey
        response = requests.get(api_url)
        newDataDict = response.json()
        
        # print(json.dumps(newDataDict))
        
        neededKeys = ['Director','Writer','Actors','Runtime']
        nddKeys = list(newDataDict.keys())
        haveKeyCount = 0
        for key in neededKeys:
            if key in nddKeys:
                haveKeyCount += 1
            pass
        pass
        if haveKeyCount == 0:
            print("Augmented Detail Fetch failed for ArtifactID " + artiIdIn)
            return updateDict
        pass
        
        try:
            # print(str(type(artiDict['director'])))
            updateDict['director'] = copy.deepcopy(artiDict['director'])
            #updateDict['director'] = []
            for personNm in newDataDict['Director'].split(","):
                personNmClean = personNm.strip()
                if not (personNmClean in updateDict['director']) :
                    if personNmClean != "N/A":
                        updateDict['director'].append(personNmClean)
                    pass
                pass
            pass
        except:
            # print("ArtifactId " + artiIdIn + " failed to add Director value")
            pass
        pass
        try:
            updateDict['director'].remove('string')
        except:
            pass
        pass
        
        try:
            # print(str(type(artiDict['writer'])))
            updateDict['writer'] = copy.deepcopy(artiDict['writer'])
            #updateDict['writer'] = []
            for personNm in newDataDict['Writer'].split(","):
                personNmClean = personNm.replace("(creator)","").replace("(created by)","").replace("(story by)","").replace("(story)","").replace("(teleplay by)","").replace("(teleplay)","").strip()
                if not (personNmClean in updateDict['writer']) :
                    if personNmClean != "N/A":
                        updateDict['writer'].append(personNmClean)
                    pass
                pass
        except:
            # print("ArtifactId " + artiIdIn + " failed to add Writer value")
            pass
        pass
        try:
            updateDict['writer'].remove('string')
        except:
            pass
        pass
        
        try:
            # print(str(type(artiDict['primcast'])))
            updateDict['primcast'] = copy.deepcopy(artiDict['primcast'])
            #updateDict['primcast'] = []
            for personNm in newDataDict['Actors'].split(","):
                personNmClean = personNm.strip()
                if not (personNmClean in updateDict['primcast']) :
                    if personNmClean != "N/A":
                        updateDict['primcast'].append(personNmClean)
                    pass
                pass
            pass
        except:
            # print("ArtifactId " + artiIdIn + " failed to add Actors value")
            pass
        pass
        try:
            updateDict['primcast'].remove('string')
        except:
            pass
        pass
        
        #"Runtime":"192 min",
        try:
            rtStrList = newDataDict['Runtime'].split(" ")
            assert rtStrList[1] == 'min'
            minsNum = int(rtStrList[0])
            assert type(minsNum) == type(3)
            updateDict['runmins'] = minsNum
        except:
            # Well, this is disappointing
            pass
        pass
        
        return updateDict
    def fetchArtiDeetsFromOmdbapi(self): # FROM rmvod_api.py
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
    def updateArtiDeetsFromOmdb(self,artiIdIn):  # FROM rmvod_api.py
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
            updateDict['writer'].replace("(created by)").replace("(story by)").replace("(teleplay by)").append(writer.strip())
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
    
if (__name__ == '__main__'):
    seriesArtiId = input('Series Artifact ID: ')
    if len(seriesArtiId) == 36:
        f = IMDBFetch()
        f.updateSeriesEpisodesFromImdbPhase1(seriesArtiId)
    else:
        print("Invalid input.  Aborting.")
    pass
