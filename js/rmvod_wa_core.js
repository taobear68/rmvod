
//rmvod_wa_core.js  Copyright 2022, 2023 Paul Tourville

//This file is part of RIBBBITmedia VideoOnDemand (a.k.a. "rmvod").

//RIBBBITmedia VideoOnDemand (a.k.a. "rmvod") is free software: you 
//can redistribute it and/or modify it under the terms of the GNU 
//General Public License as published by the Free Software 
//Foundation, either version 3 of the License, or (at your option) 
//any later version.

//RIBBBITmedia VideoOnDemand (a.k.a. "rmvod") is distributed in the 
//hope that it will be useful, but WITHOUT ANY WARRANTY; without even 
//the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
//PURPOSE. See the GNU General Public License for more details.

//You should have received a copy of the GNU General Public License 
//along with RIBBBITmedia VideoOnDemand (a.k.a. "rmvod"). If not, 
//see <https://www.gnu.org/licenses/>.

// A Class which provides standardized "Tabbed Interface" functionality
class RNWATabWidget {
    constructor() {
        // WIDGET NAME MUST BE "ALL ONE WORD", WITH NO DASHES/HYPHENS ("-")
        this.widgetName = "RNWATabWidget";
        this.tabCount = 2;
        this.defaultActiveTab = 0;
        this.tabTagLabelList = ['Tab 0','Tab 1'];
        this.tabBodyContentHtmlList = ['<div>Tab 0 Content</div>','<div>Tab 1 Content</div>'];
        this.tabPickFunction = 'tabPick';
    }
    setChildNames(){
        this.tabTabClassNameBase = this.widgetName + "TabTab";
        this.tabBodyClassNameBase = this.widgetName + "TabBody";
    }
    renderWidget() {
        this.setChildNames();
        this.tabCount = this.tabTagLabelList.length;
        
        var ctrlCont = document.createElement('div');
        ctrlCont.className = this.tabTabClassNameBase + '-outer';
        ctrlCont.id = this.widgetName + '-ctrlrow';
        ctrlCont.style.display = "inline-flex";
        for (var i=0; i< this.tabCount; i++) {
            ctrlCont.appendChild(this.renderTabTab(i));
        }
        
        var contCont = document.createElement('div');
        contCont.className = this.tabBodyClassNameBase + '-outer';
        contCont.id = this.widgetName + '-contentrow';
        contCont.style.display = "block";
        for (var i=0; i< this.tabCount; i++) {
            contCont.appendChild(this.renderTabBody(i));
        }
        
        var widgetDiv = document.createElement('div');
        widgetDiv.className = this.widgetName;
        widgetDiv.id = this.widgetName;
        widgetDiv.appendChild(ctrlCont);
        widgetDiv.appendChild(contCont);
        return widgetDiv;
    }
    renderTabTab(tabNmbrIn){
        var divOuter = document.createElement('div');
        divOuter.id = this.widgetName + '-tab-' + tabNmbrIn.toString();
        divOuter.style.display = "inline-flex"; 
        if (tabNmbrIn == this.defaultActiveTab) {
            divOuter.className = this.tabTabClassNameBase + '-sel';
        } else {
            divOuter.className = this.tabTabClassNameBase + '-unsel';
        }
        var spanTab = document.createElement('span');
        spanTab.id = this.widgetName + '-tabspan-' + tabNmbrIn.toString() 
        if (tabNmbrIn == this.defaultActiveTab) {
            spanTab.className = this.tabTabClassNameBase + '-sel';
        } else {
            spanTab.className = this.tabTabClassNameBase + '-unsel';
        }
        spanTab.setAttribute("onclick",this.tabPickFunction + "(this.id);");
        spanTab.innerText = this.tabTagLabelList[tabNmbrIn];
        divOuter.appendChild(spanTab);
        return divOuter;
    }
    renderTabBody(tabNmbrIn){
        var divOuter = document.createElement('div');
        divOuter.id = this.widgetName + '-body-' + tabNmbrIn.toString();
        if (tabNmbrIn == this.defaultActiveTab) {
            divOuter.className = this.tabBodyClassNameBase + '-sel';
        } else {
            divOuter.className = this.tabBodyClassNameBase + '-unsel';
        }
        divOuter.innerHTML = this.tabBodyContentHtmlList[tabNmbrIn];
        return divOuter;
    }
    selectTab(tabSpanDeIdIn){
        var deIdBreakdown = tabSpanDeIdIn.split("-");
        this.widgetName = deIdBreakdown[0];
        var tabNmbr = deIdBreakdown[2];
        var tll = document.getElementById(tabSpanDeIdIn).parentElement.parentElement.children.length;
        for (var i = 0; i < tll; i++) {
            if (i == tabNmbr) {
                document.getElementById(this.widgetName + "-tab-" + i.toString()).className = this.widgetName + 'TabTab-sel';
                document.getElementById(this.widgetName + "-tabspan-" + i.toString()).className = this.widgetName + 'TabTab-sel';
                document.getElementById(this.widgetName + "-body-" + i.toString()).className = this.widgetName + 'TabBody-sel';
            } else {
                document.getElementById(this.widgetName + "-tab-" + i.toString()).className = this.widgetName + 'TabTab-unsel';
                document.getElementById(this.widgetName + "-tabspan-" + i.toString()).className = this.widgetName + 'TabTab-unsel';
                document.getElementById(this.widgetName + "-body-" + i.toString()).className = this.widgetName + 'TabBody-unsel';
            }
        }
    }
}

// A Class which provides standardized "List Field Widget" functionality
class RNWAListFieldWidget {
    constructor(){
        // WIDGET NAME MUST BE "ALL ONE WORD", WITH NO DASHES/HYPHENS ("-")
        this.widgetName = "RNWATabWidget";
        this.recordId = '';
        this.listMembers = [];
        this.choiceList = [];
        this.addChoiceFunction = 'addChoice';
        this.removeMemberFunction = 'removeMember';
        this.addMemberFunction = 'addMember';
    }
    renderWidget(){
        var widgetDiv = document.createElement('div');
        widgetDiv.id = this.widgetName;
        widgetDiv.className = this.widgetName;
        
        var reIdDiv = document.createElement('div');
        reIdDiv.id = this.widgetName + '_DocId';
        reIdDiv.style.display = "none";
        reIdDiv.innerText = this.recordId;
        widgetDiv.appendChild(reIdDiv);
        
        
        var listDiv = document.createElement('div');
        listDiv.id = this.widgetName + '_Box';
        listDiv.className = this.widgetName + 'Box';
        for (var i = 0; i < this.listMembers.length; i++) {
            listDiv.appendChild(this.renderListMember(i,this.listMembers[i]));
        }
        
        var addButtonDiv = document.createElement('div');
        addButtonDiv.id = this.widgetName + "_AddMember";
        addButtonDiv.className = this.widgetName + "AddMember";
        
        var addButtonSpan = document.createElement('span');
        addButtonSpan.id = this.widgetName + "_AddMemberButton";
        addButtonSpan.className = this.widgetName + "AddMemberButton";
        addButtonSpan.setAttribute("onclick",this.addChoiceFunction + "(this.id);");
        addButtonSpan.innerHTML = "&nbsp;+&nbsp;";
        addButtonDiv.appendChild(addButtonSpan);
        listDiv.appendChild(addButtonDiv);
        
        widgetDiv.appendChild(listDiv);
        
        widgetDiv.appendChild(this.renderChoiceList());
        
        return widgetDiv
    }
    renderListMember(lmIdxIn,lmValStrIn){
        var idxZFStr = ('0000'+lmIdxIn.toString()).slice(-4)
        var lmDiv = document.createElement('div');
        lmDiv.id = this.widgetName + '_Member_' + idxZFStr;
        lmDiv.className = this.widgetName + 'Member';
        
        var labelSpan = document.createElement('span');
        labelSpan.className = this.widgetName + 'MemberLabel';
        labelSpan.innerText = lmValStrIn;
        
        var rmvSpan = document.createElement('span');
        rmvSpan.id = this.widgetName  + "_Member_" + idxZFStr + "_rmv";
        rmvSpan.className = this.widgetName + 'MemberRmv';
        rmvSpan.setAttribute("onclick",this.removeMemberFunction + "(this.id);");
        rmvSpan.innerText = "X";
        
        lmDiv.appendChild(labelSpan);
        lmDiv.appendChild(rmvSpan);
                
        return lmDiv;
    }
    renderChoiceList(){
        var slDiv = document.createElement('div');
        slDiv.id = this.widgetName + "_SelectDiv";
        slDiv.name = this.widgetName + "SelectDiv";
        
        var selectDE = document.createElement('select');
        selectDE.id = this.widgetName + "_Select";
        selectDE.name = this.widgetName + "Select";
        selectDE.className = this.widgetName + "Select";
        selectDE.setAttribute("onchange",this.addMemberFunction + "(this.id);");
        
        var opt = document.createElement('option');
        opt.value = "none";
        opt.innerHTML = "None";
        selectDE.appendChild(opt);        
        
        for (var i = 0; i < this.choiceList.length; i++) {
            var opt = document.createElement('option');
            opt.value = this.choiceList[i];
            opt.innerHTML = this.choiceList[i];
            selectDE.appendChild(opt);
        }
        
        slDiv.appendChild(selectDE);
        
        return slDiv
    }
}

// A Class which provides a minimum set of standardized Browser Cookie
// handling methods
class CookieCrisp {
    // This is an abstraction layer over cookie handling.
    constructor(){
        const jsonTemplZero = {'appName':'CookieCrisp','revNmbr':0,'recentPlays':[]};
        this.cookieJar = {'appName':'CookieCrisp','revNmbr':0,'recentPlays':'one,two,three'};
        this.template = {'appName':'CookieCrisp','revNmbr':0,'recentPlays':'one,two,three'};
        this.cExpDays = 90;
        this.maxRecentPlays = 100;
    }
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }    
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    clearCookie(cname){
        document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    initializeCookie(){
        var cookies = document.cookie.split(";");
    
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        var tkList = Object.keys(this.template);
        for (var idx = 0; idx < tkList.length; idx++ ) {
            this.setCookie(tkList[idx],this.template[tkList[idx]], this.cExpDays);
        }
    }
    extantCookieCheck(){
        var retval = false
        try{
            var anStr = this.getCookie('appName');
            if (anStr != this.template['appName']) {
                throw("Cookie key appName not found.  Initializing cookies.");
            }
            retval = true;
        } catch (e) {
            this.initializeCookie();
        }
        return retval;
    }
    addRecentPlay(artiIdIn){
        var cStr = this.getCookie('recentPlays');
        var rpList = [];
        if (cStr.length > 1) {
            rpList = cStr.split(',');
        }
        if (rpList.indexOf(artiIdIn) < 0) {
            rpList.push(artiIdIn);
            while (rpList.length > this.maxRecentPlays) {
                rpList.splice(0,1);
            }
        }
        var newCStr = '';
        for (var idx = 0; idx < rpList.length; idx++ ) {
            newCStr += rpList[idx];
            if (idx < (rpList.length - 1)) {
                newCStr += ',';
            } 
        }
        this.setCookie('recentPlays',newCStr,this.cExpDays);
    }
}

// A Class which provides HTML generator functions for the rmvid web app.  
// Some are just heaps of string assignments and some are strings of
// document.createElementcalls.  The bottom line is that these
// methods were moved out to a separate class to shave some time
// of loading the rmvid web app base class and reduce its memory 
// footprint a bit
class RMVWAHtmlGenerator {
    constructor(){
    }
    renderDEThreeCellHeader(){
        var hContDiv = document.createElement('div');
        hContDiv.id = 'headercont';
        hContDiv.className = 'headercont';
        hContDiv.style.width = '1200px';
        hContDiv.style.height = '101px';
        hContDiv.style.display = 'inline-flex';
        //hContDiv.style.width = '1200px';
        
        var cell1Div = document.createElement('div');
        cell1Div.style.width = "100px";
        cell1Div.style.height = "100px";
        var tmpHtml = '';
        tmpHtml += '<a href="/rmvod/rmvod.html">';
        tmpHtml += '<img src="/rmvod/img/rmvod_badge_center.png" height="75" width="75" style="height:75px;width:75px;">';
        tmpHtml += '</a>';
        cell1Div.innerHTML = tmpHtml;
        
        var cell2Div = document.createElement('div');
        cell2Div.style.width = "880px";
        cell2Div.style.height = "100px";
        cell2Div.style.marginLeft = "10px";
        //cell2Div.style.overflow = "auto";
        var tmpHtml = '';
        tmpHtml += '<span id="header-title" style="font-weight:bold;font-size:large;">&nbsp;</span><br>';
        tmpHtml += '<div id="header-artifact-details" style="width:870px;height:60px;overflow:auto;">';
        tmpHtml += '<span id="header-synopsis" style="">&nbsp;</span><br>';
        tmpHtml += '<span id="header-production" style="">&nbsp;</span><br>';
        tmpHtml += '<span id="header-cast" style="">&nbsp;</span><br>';
        tmpHtml += '<span id="" style="">&nbsp;</span><br>';
        tmpHtml += '</div>';
        cell2Div.innerHTML = tmpHtml;
        
        var cell3Div = document.createElement('div');
        cell3Div.style.width = "200px";
        cell3Div.style.height = "100px";
        cell3Div.style.marginLeft = "10px";
        cell3Div.style.marginTop = "30px";
        cell3Div.id = "headerblock3";
        var tmpHtml = '';
        tmpHtml += "<b>0000-11-22 11:22</b>"
        cell3Div.innerHTML = tmpHtml;
        
        hContDiv.appendChild(cell1Div);
        hContDiv.appendChild(cell2Div);
        hContDiv.appendChild(cell3Div);
        
        return hContDiv;
    }
    // USES NEW TAB WIDGET
    renderDETabWidget(){
        var tw = new RNWATabWidget();
        tw.widgetName = "RNWATabWidget";
        tw.tabCount = 4;
        tw.defaultActiveTab = 1;
        tw.tabTagLabelList = ['Player','List/Search','Recs','Edit','Settings'];
        var tmpAry = [];
        tmpAry.push('<div id="structfeatureplayer">' + this.renderHTMLPlayerTab() + '</div>');
        tmpAry.push('<div id="structfeaturesearch">' + this.renderHTMLSearchTab() + '</div>');
        // NEW for recs
        tmpAry.push('<div id="structreaturerecs">' + this.renderHTMLRecsTab() + '</div>'>);
        tmpAry.push('<div id="structfeatureedit">' + this.renderHTMLEditTab() + '</div>');
        tmpAry.push('<div id="structfeaturesettings">' + this.renderHTMLSettingsTab() + '</div>');
        tw.tabBodyContentHtmlList = tmpAry;
        tw.tabPickFunction = 'tabPick';
        
        return tw.renderWidget();
    }
    renderDETabContainer(){ // <<====DEPRECATED
        const methNm = 'renderDETabContainer';
        console.log("DO NOT CALL " + methNm + " -- IT IS DEPRECATED!");
        throw new Error(methNm + " <<====DEPRECATED");
    }
    renderDEFeatureContainer(){ // <<====DEPRECATED
        const methNm = 'renderDEFeatureContainer';
        console.log("DO NOT CALL " + methNm + " -- IT IS DEPRECATED!");
        throw new Error(methNm + " <<====DEPRECATED");
    }
    renderDEListContainer(){  // <<==== DEPRECATED
        const methNm = 'renderDEListContainer';
        console.log("DO NOT CALL " + methNm + " -- IT IS DEPRECATED!");
        throw new Error(methNm + " <<====DEPRECATED");
    }
    renderDEFooterContainer(){

        var footerOuterDiv = document.createElement('div');
        footerOuterDiv.style.textAlign = 'center';
        var fHtml = '<span id="copyright_notice" style="font-family:courier;font-size:small;color:#888888;">';
        fHtml += 'RIBBBIT media VideoOnDemand -- Copyright (c) 2022, 2023 Paul Tourville -- ';
        fHtml += 'Distributed under the <a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3</a>.</span>'
        footerOuterDiv.innerHTML = fHtml;
        var versionsContainerDiv = document.createElement('div');
        var tmpHtml = "";
        tmpHtml += '<span id="version_html" style="font-family:courier;font-size:small;color:#888888;">html version: 0.3.1</span>';
        tmpHtml += '&nbsp;&nbsp;';
        tmpHtml += '<span id="version_js" style="font-family:courier;font-size:small;color:#888888;">js version: 0.2.1</span>';
        tmpHtml += '&nbsp;&nbsp;';
        tmpHtml += '<span id="version_db" style="font-family:courier;font-size:small;color:#888888;">db version: 0.1.0</span>';
        tmpHtml += '&nbsp;&nbsp;';
        tmpHtml += '<span id="version_api" style="font-family:courier;font-size:small;color:#888888;">api version: 0.1.2</span>';
        tmpHtml += '&nbsp;&nbsp;';
        tmpHtml += '<span id="version_css" style="font-family:courier;font-size:small;color:#888888;">css version: 0.2.1</span>';
        tmpHtml += '&nbsp;&nbsp;';
        versionsContainerDiv.innerHTML = tmpHtml;
        
        footerOuterDiv.appendChild(versionsContainerDiv);
        
        return footerOuterDiv;
    }
    renderDESearchWidgetContainer(){
        // Search Modes: Simple (Single Factor - exec. on change), Complex (Multiple Factor - exec. on button click)
        //
        // Factors:
        //   Search By Tag (select list)
        //   Search by String (title, persons)
        //   Search by Release Year range
        //   Search with arbitrary SQL WHERE Clause
        
        var factorDivWidth = "470px";
        var factorDivMargin = "10px";
        var factorTitleDivWidth = "150px";
        
        var newSrchWidget = document.createElement('div');
        newSrchWidget.style.margin = "8px";
        
        var mfPicker = document.createElement('div');
        
        var tmpHtml = 'Multi-Factor Search:&nbsp;<input name="mfsearchyn"  id="mfsearchyn" ';
        tmpHtml += ' onchange="switchboard(\'mfSetCheck\',this.id,{})" ';
        tmpHtml += ' type="checkbox">';
        
        mfPicker.innerHTML = tmpHtml;
        
        newSrchWidget.appendChild(mfPicker);

        var lastContainer = document.createElement('div');
        lastContainer.innerHTML = 'Search Factors:<br>';

        //   Search By Tag (select list)
        var sfdTag = document.createElement('div');
        sfdTag.style.margin = factorDivMargin;
        sfdTag.style.width = factorDivWidth;
        var dTitle = document.createElement('div');
        dTitle.innerHTML = "Tag:";
        dTitle.style.display = "inline-flex";
        dTitle.style.width = factorTitleDivWidth;
        var dCont = document.createElement('div');
        dCont.style.display= "inline-flex";
        dCont.innerHTML = '<select style="font-family:arial;font-size:18px;" id="tag-search-select" name="tag-search-select" onchange="switchboard(\'execTagSearch\',\'tag-search-select\',{})"><option value="">None</option></select>';
        sfdTag.appendChild(dTitle);
        sfdTag.appendChild(dCont);
        
        lastContainer.appendChild(sfdTag);
        
        
        // Search by string
        var sfdString = document.createElement('div');
        sfdString.style.margin = factorDivMargin;
        sfdString.style.width = factorDivWidth;
        var dTitle = document.createElement('div');
        dTitle.innerHTML = "String:";
        dTitle.style.display = "inline-flex";
        dTitle.style.width = factorTitleDivWidth;
        var dCont = document.createElement('div');
        dCont.style.display= "inline-flex";
        dCont.innerHTML = '<input id="txt-srch-str" type="text" size="15" onchange="switchboard(\'execTxtSrch\',\'txt-srch-str\',{})">';
        sfdString.appendChild(dTitle);
        sfdString.appendChild(dCont);
        
        lastContainer.appendChild(sfdString);
        

        //   Search By MajType (select list)
        var sfdTag = document.createElement('div');
        sfdTag.style.margin = factorDivMargin;
        sfdTag.style.width = factorDivWidth;
        var dTitle = document.createElement('div');
        dTitle.innerHTML = "Major Type:";
        dTitle.style.display = "inline-flex";
        dTitle.style.width = factorTitleDivWidth;
        var dCont = document.createElement('div');
        dCont.style.display= "inline-flex";
        var tmpHtml = '<select style="font-family:arial;font-size:18px;" id="majtype-search-select" name="majtype-search-select" onchange="switchboard(\'execMajTypSrch\',this.id,{})">';
        tmpHtml += '<option value="">All</option>';
        tmpHtml += '<option value="movie">Movies</option>';
        tmpHtml += '<option value="tvseries">TV Series</option>';
        tmpHtml += '</select>';
        
        dCont.innerHTML = tmpHtml;
        sfdTag.appendChild(dTitle);
        sfdTag.appendChild(dCont);
        
        lastContainer.appendChild(sfdTag);
        
        
        // Search by release year range

        var sfdRelYr = document.createElement('div');
        sfdRelYr.style.margin = factorDivMargin;
        sfdRelYr.style.width = factorDivWidth;
        var dTitle = document.createElement('div');
        dTitle.innerHTML = "Release Year Range:";
        dTitle.style.display = "inline-flex";
        dTitle.style.width = factorTitleDivWidth;
        var dCont = document.createElement('div');
        dCont.style.display= "inline-flex";
        var tmpHtml = 'Start:&nbsp;<input id="relyear-srch-start" type="text" size="5" >'; 
        tmpHtml += '&nbsp;-&nbsp;';
        tmpHtml += 'End:&nbsp;<input id="relyear-srch-end" type="text" size="5" onchange="switchboard(\'execRelyearSrch\',this.id,{})">';
        dCont.innerHTML = tmpHtml;
        sfdRelYr.appendChild(dTitle);
        sfdRelYr.appendChild(dCont);
        
        lastContainer.appendChild(sfdRelYr);
        
        
        // Search by SQL WHERE Clause
        var sfdSqlWhere = document.createElement('div');
        sfdSqlWhere.style.margin = factorDivMargin;
        sfdSqlWhere.style.width = factorDivWidth;
        var dTitle = document.createElement('div');
        dTitle.innerHTML = "SQL WHERE Clause:";
        dTitle.style.display = "inline-flex";
        dTitle.style.width = factorTitleDivWidth;
        var dCont = document.createElement('div');
        dCont.style.display= "inline-flex";
        var tmpHtml = '<textarea id="sql-where-srch" name="sql-where-srch" rows="5" cols="30" onchange="switchboard(\'execWhereClauseSrch\',this.id,{})"></textarea>';
        dCont.innerHTML = tmpHtml;
        sfdSqlWhere.appendChild(dTitle);
        sfdSqlWhere.appendChild(dCont);
        
        lastContainer.appendChild(sfdSqlWhere);
        
        // Multi-Factor Search Exec button/link
        var sfdMFSExec = document.createElement('div');
        sfdMFSExec.id = "mfsexeccontainer";
        sfdMFSExec.style.display = 'none';
        var tmpHtml = '<span id="mfsexeclink" style="margin-left:400px;font-weight: bold; text-decoration: underline; " onclick="switchboard(\'execmfsrch\',this.id,{})">';
        tmpHtml += 'Search';
        tmpHtml += '</span>';
        sfdMFSExec.innerHTML = tmpHtml;
        lastContainer.appendChild(sfdMFSExec);
        
        newSrchWidget.appendChild(lastContainer);
        
        
        
        return newSrchWidget;
    }
    renderStackFormRow(argsObjIn){
        var argsObj = {};
        var defaultValuesObj = {};
        defaultValuesObj['rowDivClassName'] = "";
        defaultValuesObj['labelDivClassName'] = "";
        defaultValuesObj['contentDivClassName'] = "";
        defaultValuesObj['labelSpanClassName'] = "";
        defaultValuesObj['contentSpanClassName'] = "";
        defaultValuesObj['rowWidth'] = "260px";
        defaultValuesObj['labelWidth'] = "80px";
        defaultValuesObj['fieldWidth'] = "160px";
        defaultValuesObj['labelContentHtml'] = "Label:";
        defaultValuesObj['fieldContentHtml'] = "Field edit content";
        
        var dvoKeys = Object.keys(defaultValuesObj);
        var aoiKeys = Object.keys(argsObjIn);
        for (var i = 0; i < dvoKeys.length; i++ ) {
            if (aoiKeys.indexOf(dvoKeys[i]) > -1) {
                argsObj[dvoKeys[i]] = argsObjIn[dvoKeys[i]];
            } else {
                argsObj[dvoKeys[i]] = defaultValuesObj[dvoKeys[i]];
            }
        }
        
        var rowOuterDiv = document.createElement('div');
        if (argsObj['rowDivClassName'] != "") {
            rowOuterDiv.className = argsObj['rowDivClassName'];
        } else {
            var styleStr = "";
            styleStr += "width:" + argsObj['rowWidth'] + ";";
            styleStr += 'display:block;';
            styleStr += 'border:2px;border-style:solid;border-color:#000000;';
            styleStr += 'margin:2px;padding:2px;';
            //styleStr += '';
            
            rowOuterDiv.style = styleStr;
        }
        
        var labelDiv = document.createElement('div');
        if (argsObj['labelDivClassName'] != "") {
            labelDiv.className = argsObj['labelDivClassName'];
        } else {
            var styleStr = "";
            styleStr += "width:" + argsObj['labelWidth'] + ";";
            styleStr += 'justify-content:right;display:inline-flex;';
            styleStr += 'vertical-align:top;';
            styleStr += 'border:2px;border-style:solid;border-color:#000000;';
            styleStr += 'margin:2px;padding:2px;';
            //styleStr += '';
            
            labelDiv.style = styleStr;
        }
        
        var labelSpan = document.createElement('span');
        if (argsObj['labelSpanClassName'] != "") {
            labelSpan.className = argsObj['labelSpanClassName'];
        } else {
            labelSpan.style = "font-weight:bold;";
        }
        labelSpan.innerHTML = argsObj['labelContentHtml'];
        
        var contentDiv = document.createElement('div');
        if (argsObj['contentDivClassName'] != "") {
            contentDiv.className = argsObj['contentDivClassName'];
        } else {
            var styleStr = "";
            styleStr += "width:" + argsObj['fieldWidth'] + ";";
            styleStr += 'justify-content:left;display:inline-flex;';
            styleStr += 'vertical-align:top;';
            styleStr += 'border:2px;border-style:solid;border-color:#000000;';
            styleStr += 'margin:2px;padding:2px;';
            //styleStr += '';

            contentDiv.style = styleStr;
        }
            
        var contentSpan = document.createElement('span');
        if (argsObj['contentSpanClassName'] != "") {
            contentSpan.className = argsObj['contentSpanClassName'];
        } else {
            contentSpan.style = "";
        }
        contentSpan.innerHTML = argsObj['fieldContentHtml'];
        
        labelDiv.appendChild(labelSpan);
        contentDiv.appendChild(contentSpan);
        
        rowOuterDiv.appendChild(labelDiv);
        rowOuterDiv.appendChild(contentDiv);
        
        return rowOuterDiv;
    }
    renderHTMLSettingsTab(){
        
        var tmpHtml = '';
        tmpHtml += '<div class="headerflexcell" id="headerblock4">';
        tmpHtml += '<div class="" id="" style="display:block">';
        tmpHtml += '<div><b>Settings</b></div>';
        tmpHtml += '<div><b>Play next in series: </b><input name="serplaynext" id="serplaynext" type="checkbox"></div>';
        tmpHtml += '<div><b>Resume play: </b><input name="resumeplay" id="resumeplay" type="checkbox"></div>';
        
        tmpHtml += '<div><span onclick="switchboard(\'formNewSingleArti\',\'\',{})">'  // syle="text-decoration:underline;font-weight:bold;" 
        tmpHtml += '<b><u>Create a single Artifact</u></b>'
        tmpHtml += '</span></div>';
        
        tmpHtml += '<div><span onclick="switchboard(\'formNewMultiArti\',\'\',{})">'  // syle="text-decoration:underline;font-weight:bold;" 
        tmpHtml += '<b><u>Create a multiple Artifacts</u></b>'
        tmpHtml += '</span></div>';
        
        tmpHtml += '</div>';
        tmpHtml += '</div>';   
        return tmpHtml;     
    }
    renderHTMLSearchTab(){
        var tmpHtml = '';
        tmpHtml += '<div style="display:inline-flex;">';
        tmpHtml += '<div style="width:580px;height:518px;">';
        tmpHtml += '<div id="headerblock2">';
        tmpHtml += '<div style="margin:8px;">';
        tmpHtml += '&nbsp;';
        tmpHtml += '</div></div></div>';
        tmpHtml += '<div style="width:580px;height:518px;">';
        tmpHtml += '<div class="listwidget" id="sideartilistwidget" style="">';
        tmpHtml += '<div>&nbsp;</div>';
        tmpHtml += '</div></div>';
        return tmpHtml;        
    }
    renderHTMLPlayerTab(){ 
        return this.renderHTMLTabBodyChicken();
    }
    renderHTMLEditTab(){ 
        return this.renderHTMLTabBodyChicken();
    }
    // NEW for recs
    renderHTMLRecsTab(){
        var tmpHtml = '';
        tmpHTHtml += '<div id="rmvodrecsmastercontouter" class="rmvodrecsmastercontouter">';
        tmpHTHtml += '<b>This would be where the Recommendations would go if they worked</b>';
        tmpHTHtml += '</div>';
        //tmpHTHtml += '';
        return tmpHtml;
    }
    renderHTMLTabBodyChicken(){
        var tmpHtml = '';
        tmpHtml += '<div style="margin-left:375px; margin-right:80px;">';
        tmpHtml += '&nbsp;<br>';
        tmpHtml += '<img src="/rmvod/img/rmvod_badge_center.png" height=450 width=450>';
        tmpHtml += '</div>';     
        return tmpHtml;  
    }
    renderHTMLVideoPlayer(urlStrIn){
        var playerHTML = '';
        playerHTML += '<div style="width:1100px;height:500px;vertical-align:top;horizontal-align:center;">';
        playerHTML += '<video id="actualvideoplayer" width=1100 height=500 style="vertical-align:top;horizontal-align:center;" autoplay=true controls=true>';
        playerHTML += '<source src="' + urlStrIn + '" type="video/mp4">' ;
        playerHTML += 'Your browser does not support the video tag';
        playerHTML += '</video>';
        playerHTML += "</div>";
        return playerHTML;
    }
}

// A Class intended to provide a set of standardized DOM actions with
// aother activities frequently called with the DOM actions.
// This was started as a proof-of-concept, and may eventually be removed.
class RMVWADOMActions{
    constructor(){
    }
    setInnerText(idIn,valStrIn){
        try{
            document.getElementById(idIn).innerText = valStrIn;
        } catch (e) {
            console.log("RMVWADOMActions.setInnerText FAILED: " + idIn + ", " + valStrIn + " (" + e + ")");
        }
    }
    setInnerHTML(idIn,valStrIn){
        //document.getElementById(idIn).innerHTML = valStrIn;
        try{
            document.getElementById(idIn).innerHTML = valStrIn;
        } catch (e) {
            console.log("RMVWADOMActions.setInnerText FAILED: " + idIn + ", " + valStrIn + " (" + e + ")");
        }    
    }
    clearInner(idIn){
        this.setInnerHTML(idIn,'');
    }
    updateVersions(objIn){
        this.setInnerText('version_html',"html version: " + objIn['html_version']);
        this.setInnerText('version_db',"db version: " + objIn['db_version']);
        this.setInnerText('version_api',"api version: " + objIn['api_version']);
        this.setInnerText('version_css',"css version: " + objIn['css_version']);
    }
    getInputValue(idIn){
        return document.getElementById(idIn).value
    }
}

// A Class which provides the core functionality of the rmvod web 
// application.
class RMVodWebApp {
    constructor(){
        this.logUtil = new RMLogUtil('RMPCWebApp',3);
        this.sse = new RMSSSEnhanced();
        this.api = new RMAPI();
        this.sut = new RMSessionUtil();
        this.cc = new CookieCrisp();
        this.cc.extantCookieCheck();
    }
    // Method should only be called on-load.  Performs session storage
    // setup, and other "run once on load" functions.
    initStorage(){  // <<==== HERE BE CRUFT
        var sstorTemplObj = [];
        sstorTemplObj.push({'name':'blob','type':'dict','content':'{}'}); // Tree Metadata
        
        sstorTemplObj.push({'name':'titleidlist','type':'list','content':'[]'}); // Tree Metadata
        
        sstorTemplObj.push({'name':'localcfg','type':'dict','content':'{}'}); // Tree Metadata
        sstorTemplObj.push({'name':'refdata','type':'dict','content':{}});
        sstorTemplObj.push({'name':'filterdata','type':'dict','content':{}});
        sstorTemplObj.push({'name':'sortdata','type':'dict','content':{}});
        sstorTemplObj.push({'name':'indexdata','type':'dict','content':{}});
        this.sse.sstorInit(sstorTemplObj);
        
        var libDict = {};
        libDict['n2a'] = {};
        libDict['artifacts'] = {};
        libDict['tags'] = [];
        libDict['a2t'] = {};
        libDict['t2a'] = {};
        libDict['series'] = [];
        libDict['persons'] = [];
        libDict['companies'] = [];
        
        this.sse.ssWrite('blob',libDict);
        
        this.sse.ssOKWrite('localcfg','dirtycheckinterval',500); // freshcheckinterval
        this.sse.ssOKWrite('localcfg','freshcheckinterval',1000); // freshcheckinterval
        this.sse.ssOKWrite('localcfg','apibaseuri','/freezer/api/');       // API Base URI
        this.sse.ssOKWrite('localcfg','apiepblobget','blob/get');    // API Endpoint - Single Object Fetch
        
        this.apiFetchPersonsList();
        this.apiFetchCompaniesList();
        this.apiFetchTagsList();
        
        var bid;
        // Browser ID Cookie
        //console.log('RMVodWebApp.initStorage - About to try to fetch clientid cookie');
        try {
            bid = this.cc.getCookie('clientid');
            //console.log('RMVodWebApp.initStorage - Tried to fetch clientid cookie.  Got back (' + bid + ')');
        } catch (e) {
            console.log('RMVodWebApp.initStorage - Failed to fetch clientid cookie (' + e + ')');
        }
        //console.log('RMVodWebApp.initStorage - About to try to create clientid value if I don\'t have it yet (' + bid + ')');
        try {
            if  ((bid == undefined) || (bid == '')){
                bid = this.generateMyUuid();
                //console.log('RMVodWebApp.initStorage - Tried to create clientid value.  Got back (' + bid + ')');
                var didit = this.cc.setCookie('clientid',bid,370);
                //console.log('RMVodWebApp.initStorage - Tried to set clientid cookie.  Got back (' + didit + ')');
            }
        } catch (e) {
            console.log('RMVodWebApp.initStorage - Failed to set clientid cookie (' + e + ')');
        }
        //console.log('RMVodWebApp.initStorage - I should have a valid clientid value now');
        console.log('bid: ' + bid);
        
        // These version bits will eventually need to involve polling 
        // the API and DB for their versions
        this.apiFetchRemoteVersions();
        this.postJSVer("0.9.1d");
    }
    resetPageTitle(){
        document.title = "RIBBBITmedia VideoOnDemand";
    }
    setPageTitle(titleStrIn){
        document.title = titleStrIn;
    }
    // Returns a "likely unique" ID for this browser to be used in 
    // play request logging.
    generateMyUuid(){  // <<==== HERE BE CRUFT
        var browserId;
        try {
            //var browserId = Crypto.randomUUID();
            //var c = new Crypto();
            //browserId = c.randomUUID();
            //browserId = randomUUID();
            var re = /\ /g;
            browserId = 'thisIsAFakeId-' + navigator.appName.replace(re,'') + '-' + Date.now();
        } catch (e) {
            //var re = /\ /g;
            browserId = 'thisIsAFakeId-' + Date.now();
            console.log("RMVodWebApp.generateMyUuid - crypto.randomUUID barfed because (" + e + ").  Using " + browserId);
        }
        return browserId;
    }
    postCSSVer(verStrIn){  // <<==== DEPRECATED
        const methNm = 'postCSSVer';
        console.log("DO NOT CALL " + methNm + " -- IT IS DEPRECATED!");
        throw methNm + " <<====DEPRECATED";
    }
    // Sets the "javascript version" in the footer of the main page
    // Performs DOM updates directly.
    postJSVer(verStrIn){
        //console.log("postJSVer: " + verStrIn);
        document.getElementById("version_js").innerText = "js version: " + verStrIn;
    }
    // Initiates an "interval" which updates the clock in the page 
    // header.
    // Performs DOM updates directly.
    clockSet() {
        var gtFunc = function () {
            var dObj = new Date();
            var yr = dObj.getFullYear();
            var mo = dObj.getMonth() + 1;
            var dy = dObj.getDate();
            var hr = dObj.getHours();
            var mn = dObj.getMinutes();
            var sc = dObj.getSeconds();
            var moStr = mo.toString();
            if (mo < 10) {
                moStr = "0" + mo.toString();
            }
            var dyStr = dy.toString();
            if (dy < 10) {
                dyStr = "0" + dy.toString();
            }
            var hrStr = hr.toString();
            if (hr < 10) {
                hrStr = "0" + hr.toString();
            }
            var mnStr = mn.toString();
            if (mn < 10) {
                mnStr = "0" + mn.toString();
            }
            var scStr = sc.toString();
            if (sc < 10) {
                scStr = "0" + sc.toString();
            }
            var dateStr = yr.toString() + '-' + moStr + '-' + dyStr;
            var timeStr = hrStr + ':' + mnStr;
            var datTimStr = dateStr + ' ' + timeStr;
            document.getElementById('headerblock3').innerHTML = '<div><b>' + datTimStr + '</b></div>';
        }
        gtFunc();
        var intv = setInterval(gtFunc,15000);
    }
    // Method which performs a standard call to the rmvod API
    // Returns an empty Object
    genericApiCall(payloadObjIn,endpointIn,cbFuncIn){
        /*
         * payloadeObjIn must minimally be {}
         * 
         * endpointIn should be the full path to the endpoint
         * 
         * cbFuncIn should accept one argument, which would be the 
         * JSON.parse of the responseText
         * 
         * */
        var contentRet ={};
        const apiEndpoint = endpointIn;
        const payload = payloadObjIn;
        const bodyDataStr = JSON.stringify(payload);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            var sse = new RMSSSEnhanced();
            var responseObj = {}
            if (this.readyState == this.DONE) {
                if (this.onreadystatechange) {
                    if (([200,201,202].indexOf(this.status) > -1)) {
                        xhttp.onreadystatechange = null;
                        var fetchObj =  JSON.parse(this.responseText);
                        if ((typeof cbFuncIn) == "function") {
                            cbFuncIn(fetchObj);
                        }
                    } else {
                        // Is it good to report on error?  
                        // If so, do it here. 
                    }
                }
            }
        }
        xhttp.open("POST", apiEndpoint, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(bodyDataStr);
        return contentRet;
    }
    
    
    // METHODS MAKE API CALL
    // Poll the API for the versions of server-side resources.
    // Performs DOM updates directly.
    apiFetchRemoteVersions(){ //UPDATED FOR NEW RETURN OBJECT MODEL
        var cbFunc = function (objIn) {
            var da = new RMVWADOMActions();
            da.updateVersions(objIn['data'][0]);
        }
        const payloadObj = {};
        const endpoint = '/rmvod/api/apiversion/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Retrieves a fresh copy of the "persons" list
    // Stores result in Session Storage
    apiFetchPersonsList(){ //UPDATED FOR NEW RETURN OBJECT MODEL
        //// Write to Session Store
        var cbFunc = function (objIn) {
            var dataObjIn = objIn['data'];
            var sse = new RMSSSEnhanced();
            var theBlob = sse.ssRead('blob');
            theBlob['persons'] = dataObjIn;
            sse.ssWrite('blob',theBlob);
        }
        const payloadObj = {'table':'persons'};
        const endpoint = '/rmvod/api/suplist/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Retrieves a fresh copy of the "vompanies" list
    // Stores result in Session Storage
    apiFetchCompaniesList(){ //UPDATED FOR NEW RETURN OBJECT MODEL
        //// Write to Session Store
        var cbFunc = function (objIn) {
            var dataObjIn = objIn['data'];
            var sse = new RMSSSEnhanced();
            var theBlob = sse.ssRead('blob');
            theBlob['companies'] = dataObjIn;
            sse.ssWrite('blob',theBlob);
        }
        const payloadObj = {'table':'companies'};
        const endpoint = '/rmvod/api/suplist/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Retrieves a fresh copy of the "tags" list
    // Stores result in Session Storage
    apiFetchTagsList(){ //UPDATED FOR NEW RETURN OBJECT MODEL
        var cbFunc = function (objIn) {
            var dataObjIn = objIn['data'];
            // Write to Session Store
            var sse = new RMSSSEnhanced();
            var theBlob = sse.ssRead('blob');
            theBlob['tags'] = dataObjIn;
            sse.ssWrite('blob',theBlob);
        }
        const payloadObj = {'table':'tags'};
        const endpoint = '/rmvod/api/suplist/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Associated with RNWAListFieldWidget, this method performs an
    // API call to corrspond with action taken by the user on a
    // RNWAListFieldWidget control.
    // Performs a refreshFieldListWidget when done.
    apiExecListAction(deIdIn, actionIn){ //UPDATED FOR NEW RETURN OBJECT MODEL
        var listName = deIdIn.split('_')[0];
        var artiId = document.getElementById(listName + '_DocId').innerText;
        var endpoint = "/rmvod/api/artifact/listfield/update";
        var payloadObj = {};
        payloadObj['action'] = actionIn;
        payloadObj['field'] = listName;
        payloadObj['artifactid'] = artiId;
        
        switch (actionIn){
            case 'add-member':
                var actionValue = document.getElementById(deIdIn).value;
                payloadObj['value'] = actionValue;
                break;
            case 'remove-member':
                var actionValue = document.getElementById(deIdIn).parentElement.children[0].innerText;
                payloadObj['value'] = actionValue;
                break;
            case 'add-choice':
                var actionValue = document.getElementById(deIdIn).value;
                payloadObj['value'] = actionValue;
                break;
            default:
                console.log('apiExecListAction - Well, this is a fine how do you do.  ' + deIdIn + ", " + actionIn);
        }
        var cbFunc = function(dataObjIn){
            console.log('apiExecListAction.cbFunc: dataObjIn = ' + JSON.stringify(dataObjIn));
            var objIn = dataObjIn['data'][0];
            var fieldNm = Object.keys(objIn)[0];
            var wa = new RMVodWebApp()
            wa.refreshFieldListWidget(fieldNm,objIn[fieldNm]);
        }
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // This really is the point of the whole thing, isn't it?  
    // This method initiates playback of an artifact based on its 
    // artifactid.  
    // There's some plumbing in here which fiddles with cookies and
    // intervals related to resuming playback on reload.
    // Performs DOM updates directly.
    vodPlayTitleApi3(artiIdIn){ //UPDATED FOR NEW RETURN OBJECT MODEL
        var cbFunc = function (objIn) {
            var dataObjIn = objIn['data'][0];
            
            var wa = new RMVodWebApp();
            wa.cc.setCookie('playing_aid',dataObjIn['artifactid'],365);
            try {
                const tmpIntvHandle = this.cc.getCookie('cont_play_sample_int_handle');
                clearInterval(tmpIntvHandle);
                this.cc.clearCookie('cont_play_sample_int_handle');
            } catch (e) {
                console.log("Attempt to clear left-over interval failed.");
            }
            // Setup HTML for the "actual player"
            var artiDir = dataObjIn['filepath'];
            var artiFil = dataObjIn['file'];
            var srcURI = '/rmvod/vidsrc/' + artiDir + '/' + artiFil ;
            var hr = new RMVWAHtmlGenerator();
            document.getElementById('structfeatureplayer').innerHTML = hr.renderHTMLVideoPlayer(srcURI);
            var avpDE = document.getElementById('actualvideoplayer');
            // Set a "playback ended" event for the player
            avpDE.addEventListener('ended', (event) => {pbEnded(artiIdIn)});
            // Get the current "Source" for the player to put in the 
            // artifact_source_uri cookie
            var currSrc = avpDE.currentSrc;
            wa.cc.setCookie('artifact_source_uri',currSrc,5);
            // Event to set Tab 0  as the active tab
            document.getElementById('RNWATabWidget-tabspan-0').click();  //  RNWATabWidget-tabspan-0
            // Populate the artifact details in the page header
            wa.renderArtifactDetailHeader(dataObjIn);
            // Set the browser title to the title of the artifact
            wa.setPageTitle('RMVOD: ' + dataObjIn['title']);
            // Setup an "interval" to post the current play time to a 
            // cookie to be used in "resume payback"
            try {
                wa.contCookiePostInterval(60000);
            } catch (e) {
                console.log('vodPlayTitleApi2 cbFunc barfed on trying wa.contCookiePostInterval(60000): ' + e);
            }
        }
        // Add this artifactid to the "recent plays" cookie
        this.cc.addRecentPlay(artiIdIn);
        // Make this artifact's list entry appear "played" if present.
        try {
            const listTitleSpanId = artiIdIn + '_list-title-span';
            document.getElementById(listTitleSpanId).className = 'listtitleseen';
        } catch (e) {
            console.log('vodPlayTitleApi2 - Setting the classname for the playing artifact failed');
        }
        // Do the API call.
        const apiEndpoint = '/rmvod/api/artifact/get'; 
        const payload = {'artifactid':artiIdIn};
        this.genericApiCall(payload,apiEndpoint,cbFunc);
        this.apiLogPlay(artiIdIn);
    }
    // Make an API call to log what is being played
    apiLogPlay(artiIdIn){
        var cbFunc = function(dataObjIn){
            //console.log('RMVodWebApp.apiLogPlay.cdFunc: ' + JSON.stringify(dataObjIn));
        }
        const apiEndpoint = '/rmvod/api/logplay/post'; 
        const payload = {'artifactid':artiIdIn,'clientid':this.cc.getCookie('clientid')};
        this.genericApiCall(payload,apiEndpoint,cbFunc);        
    }
    // This method is called when playback completes -- that is, the 
    // video has played all the way to the end.  If the artifact which
    // has just finished playing is a tvepisode, do an API call to see 
    // what the "next" episode in the series is, and intiate playback
    // of that espisode by way of vodPlayTitleApi3.
    vodPlayNextTitle(artiIdIn){ //UPDATED FOR NEW RETURN OBJECT MODEL
        // Clear browser title
        this.resetPageTitle();
        //// Confirm checkbox is checked
        if (document.getElementById('serplaynext').checked == false) {
            console.log('serplaynext not checked');
            return;
        }
        var cbFunc = function(dataObjIn){
            var objIn = dataObjIn['data'][0];
            var wa = new RMVodWebApp();
            wa.vodPlayTitleApi3(objIn['artifactid']);
        }
        const payloadObj = {'artifactid':artiIdIn};
        const endpoint = '/rmvod/api/nextepisode/get';
        this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Refresh the Tag select list in the search widget by way of 
    // direct API call.
    // Performs DOM updates directly.
    tagSelListRefresh(){ //UPDATED FOR NEW RETURN OBJECT MODEL  //  NEEDS TO BE BETTER - maybe involve apiFetchTagsList
        var tsl = document.getElementById('tag-search-select');
        // Clear the current list of options
        while (tsl.length > 0) {
            tsl.remove(0);
        }
        // Add "None" option back
        var noneOpt = document.createElement('option');
        noneOpt.value = '';
        noneOpt.innerHTML = 'None';
        tsl.appendChild(noneOpt);
        // Fetch Tags from API and repopulate
        
        var cbFunc = function (dataObjIn) {
            var objIn = dataObjIn['data'];
            var tsl = document.getElementById('tag-search-select');
            var lLen = objIn.length;
            if ( lLen > 0 ) {
                for (var i = 0; i < lLen; i++ ){
                    var opt = document.createElement('option');
                    opt.value = objIn[i];
                    opt.innerHTML = objIn[i];
                    tsl.appendChild(opt);
                }
            }
        }
        const endpoint = '/rmvod/api/suplist/get';
        const payload = {'table':'tags'};
        this.genericApiCall(payload,endpoint,cbFunc);
    }
    // Display list of TV Series Episodes in the Side List.
    // Performs DOM updates directly.
    populateSeriesEpisodes(seriesArtiIdIn){ //UPDATED FOR NEW RETURN OBJECT MODEL
        const cbFunc = function (objIn) {
            var epListDEID = seriesArtiIdIn += '-sidelist-episode-list-outer';
            document.getElementById(epListDEID).innerHTML = '';
            var wa = new RMVodWebApp();
            for (var idx = 0; idx < objIn['data'].length; idx++) {
                var listDiv = wa.renderSALElementById(objIn['data'][idx]);
                document.getElementById(epListDEID).appendChild(listDiv);
            }
        }
        const endpoint = '/rmvod/api/seriestidlist/get';
        const payloadObj = {'artifactid':seriesArtiIdIn};
        this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Display artifact details in the Side List.
    // Performs DOM updates directly.
    populateArtifactDetails(artiIdIn){ //UPDATED FOR NEW RETURN OBJECT MODEL
        this.apiFetchPersonsList();
        this.apiFetchCompaniesList();
        this.apiFetchTagsList();
                
        const cbFunc = function (dataObjIn) {
            
            var objIn = dataObjIn['data'][0];
            
            var wa = new RMVodWebApp();
            const colList = ['title','majtype','relyear','tags','synopsis','runmins','director','writer','primcast','relorg','season','episode','file','filepath','eidrid','imdbid','arbmeta','artifactid'];
            var dValStr = "" ;
            
            try {
                if ((objIn['poster'] != '') && (objIn['imdbid'] != 'string') && (objIn['imdbid'] != 'none') && (objIn['imdbid'] != '')){
                    dValStr += '<img src="'  + objIn['poster'] + '" width="300" height="460"><br>';
                }
            } catch (e) {
                console.log("Tried to include poster image, but failed: " + e + "\n" + objIn['poster']);
            }
            
            for ( var idx=0; idx<colList.length; idx++ ) {
                dValStr += '<b>' + colList[idx] + ": </b>"; 
                switch (colList[idx]) {
                    case 'director':
                    case 'writer':
                    case 'primcast':
                        dValStr += wa.l2sSrch(objIn[colList[idx]]) + '<br>';
                        break;
                    case "imdbid":
                        if ((objIn[colList[idx]] != 'none') && (objIn[colList[idx]] != 'string')) {
                            dValStr += '<a target="_blank" href="https://www.imdb.com/title/' + objIn[colList[idx]] + '">' + objIn[colList[idx]] + '</a><br>';
                        } else {
                            dValStr += objIn[colList[idx]] + '<br>';
                        }
                        break;
                    default:
                        dValStr +=  objIn[colList[idx]]  + '<br>';
                        break;
                }
            }
            
            var innerHtml = '<span class="" id="" style="" >';
            innerHtml += dValStr;
            innerHtml += '</span><br>'
            innerHtml += '<span class="" id="" style="font-size:10px;"';
            innerHtml += 'onclick="switchboard(\'initiateArtiEdit\',\'' + objIn['artifactid'] + '\',{})" ';
            innerHtml += '>'; 
            innerHtml += '<u>Edit</u>';
            innerHtml += '</span>';
            
            var regex = /'/g;
            if (objIn['majtype'] == 'tvseries') {
                innerHtml += '&nbsp;&nbsp;';
                innerHtml += '<span class="" id="" style="font-size:10px;"';
                innerHtml += 'onclick="switchboard(\'seriesAddEpisodesForm\',\'' ;
                innerHtml +=  objIn['artifactid'] + '\',{\'title\':\'' + objIn['title'].replace(regex,"\\\'") ;
                innerHtml += '\',\'artifactid\':\'' + objIn['artifactid'] ;
                innerHtml += '\',\'filepath\':\'' + objIn['filepath'] ;
                innerHtml += '\',\'file\':\'' + objIn['file'] ;
                innerHtml += '\'})" ';
                innerHtml += '>'; 
                innerHtml += '<u>Associate Episodes</u>';
                innerHtml += '</span>';                
            }
            
            var docElId = artiIdIn + '-sidelist-detail-outer';
            var deetDiv = document.getElementById(docElId);
            deetDiv.innerHTML = innerHtml;
        }
        const endpoint = '/rmvod/api/artifact/get';
        const payloadObj = {'artifactid':artiIdIn};
        this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    // Execute a single-factor artifact search based on the value
    // in the search widget most recently changed.
    // Performs DOM updates directly.
    execSearchSingleFactor2(factorStrIn,srchValObjIn,ignoreMFSIn) { // UPDATED FOR NEW RETURN OBJECT MODEL
        if (typeof ignoreMFSIn != typeof true) {
            ignoreMFSIn = false;
        }
        
        if (ignoreMFSIn === false) {
            try{ // React correctly to MultiFactor Search Y/N
                var mfsyn = document.getElementById('mfsearchyn');
                if (mfsyn.checked == true) {
                    return;
                } 
            } catch (e) {
                console.log('mfsearchyn must not exist yet.');
            }
        } else {
            console.log('Ignoring mfsearchyn due to ignoreMFSIn' );
        }
        
        //put a throbber in to replace any old content
        var editDiv = document.getElementById('sideartilistwidget');
        editDiv.innerHTML = '<div class="throbber-ring"></div>';        
                
               
        var payloadObj = {};
        var endpoint = '';
        var cbFunc = function(){};
        switch (factorStrIn) {
            case "tag":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    var tmpDiv = wa.renderSALByIdList(objIn);
                    document.getElementById('sideartilistwidget').innerHTML = '';
                    document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                }
                if (srchValObjIn['tag'].length > 0){
                    payloadObj = {'tag':srchValObjIn['tag']};
                } 
                endpoint = "/rmvod/api/titleidlist/get";
                break;
            case "text":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    if (objIn.length > 0) {
                        var tmpDiv = wa.renderSALByIdList(objIn);
                        document.getElementById('sideartilistwidget').innerHTML = '';
                        document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                    }
                }
                if (srchValObjIn['text'].length > 0){
                    payloadObj = {'srchstr':srchValObjIn['text']}; 
                }
                var endpoint = "/rmvod/api/simpletxtsrch/get";
                break;
            case "majtype":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    var tmpDiv = wa.renderSALByIdList(objIn);
                    document.getElementById('sideartilistwidget').innerHTML = '';
                    document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                }
                if (srchValObjIn['majtype'].length > 0){
                    payloadObj = {'majtype':srchValObjIn['majtype']};
                }
                endpoint = "/rmvod/api/titleidlist/get";
                break;
            case "relyear":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    var tmpDiv = wa.renderSALByIdList(objIn);
                    document.getElementById('sideartilistwidget').innerHTML = '';
                    document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                }
                if (srchValObjIn['relyear2'] > 1900){
                    payloadObj = {'relyear1':srchValObjIn['relyear1'],'relyear2':srchValObjIn['relyear2']};
                }
                endpoint = "/rmvod/api/titleidlist/get";
                break;
            case "whereclause":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    if (objIn.length > 0) {
                        var tmpDiv = wa.renderSALByIdList(objIn);
                        document.getElementById('sideartilistwidget').innerHTML = '';
                        document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                    }
                }
                if (srchValObjIn[factorStrIn].length > 0){
                    payloadObj = {'whereclause':srchValObjIn[factorStrIn]};
                }
                endpoint = "/rmvod/api/titleidlist/get";
                break;
            default:
                console.log("execSearchSingleFactor fell through: ", factorStrIn, JSON.stringify(srchValObjIn));
        }
        if (endpoint != '') { // If we've set an endpoint, call the API
            this.genericApiCall(payloadObj,endpoint,cbFunc);
        } else {
            console.log('execSearchSingleFactor2 - endpoint is empty');
        }
        try { // Try to reset the Search Factors on the form
            this.resetSearchFactors();
        } catch (e) {
            console.log("Ignoring this error: " + e.toString());
        }
    }
    // Execute a multi-factor artifact search based on the values
    // in the search widget.
    // Performs DOM updates directly.
    execSearchMultiFactor(){ // UPDATED FOR NEW RETURN OBJECT MODEL
        var sfValsObj = {}
        // Get TAG value:
        sfValsObj['tag'] =  document.getElementById('tag-search-select').value;
        // Get STRING value:
        sfValsObj['string'] =  document.getElementById('txt-srch-str').value;// txt-srch-str
        // Get MAJOR TYPE value:
        sfValsObj['majtype'] =  document.getElementById('majtype-search-select').value;// majtype-search-select
        // Get YEAR value:
        sfValsObj['relyearstart'] =  (document.getElementById('relyear-srch-start').value).toString();
        sfValsObj['relyearend'] =  (document.getElementById('relyear-srch-end').value).toString();
        // Get SQL WHERE value
        sfValsObj['sqlwhere'] =  document.getElementById('sql-where-srch').value;// sql-where-srch
        
        //put a throbber in to replace any old content
        var editDiv = document.getElementById('sideartilistwidget');
        editDiv.innerHTML = '<div class="throbber-ring"></div>';        
        
        var cbFunc = function(dataObjIn){
            var objIn = dataObjIn['data'];
            var wa = new RMVodWebApp();
            var tmpDiv = wa.renderSALByIdList(objIn);
            document.getElementById('sideartilistwidget').innerHTML = '';
            document.getElementById('sideartilistwidget').appendChild(tmpDiv);            
        }
        
        const endpoint = '/rmvod/api/mfsearch/get';
        const payload = sfValsObj;
        this.genericApiCall(payload,endpoint,cbFunc);
        
        try { // Try to reset the Search Factors on the form
            this.resetSearchFactors();
        } catch (e) {
            console.log("Ignoring this error: " + e);
        }
        
    }
    // Render the Artifact Edit form with values from an API call.
    // Performs DOM updates directly.
    renderArtifactEdit(artiIdIn){ //UPDATED FOR NEW RETURN OBJECT MODEL
        console.log('renderArtifactEdit: ' + artiIdIn);
        
        //put a throbber in to replace any old content
        var editDiv = document.getElementById('structfeatureedit');
        editDiv.innerHTML = '<div class="throbber-ring"></div>';        
        
        var cbFunc = function (objIn) {
            //var wa = new RMVodWebApp();
            
            var dataObjIn = objIn['data'][0];
            
            var sse = new RMSSSEnhanced();
            
            // Maybe move these renderers out to RMVWAHtmlGenerator... someday?
            var simpleDisplayField = function (artiIdIn,labelIn,fieldNameIn,currentValueIn) {
                const fieldId = artiIdIn + '-edit-' + fieldNameIn + '-value';
                
                var rowContDiv = document.createElement('div');
                rowContDiv.className = "edit-form-row";
                
                var labelDiv = document.createElement('div');
                labelDiv.className = "edit-form-field-label";
                labelDiv.innerHTML = "<span style=\"\"><b>" + labelIn + ":&nbsp;</b></span>";
                
                // This needs an onChange script
                var valueDiv = document.createElement('div');
                valueDiv.className = "edit-form-field-value-orig";
                valueDiv.innerHTML = '<i><b>' + currentValueIn + '</b></i>';
                
                rowContDiv.appendChild(labelDiv);
                rowContDiv.appendChild(valueDiv);
                return rowContDiv;
            }
            var simpleTextField = function (artiIdIn,labelIn,fieldNameIn,currentValueIn) {
                const fieldId = artiIdIn + '-edit-' + fieldNameIn + '-value';
                
                var rowContDiv = document.createElement('div');
                rowContDiv.className = "edit-form-row";
                
                var labelDiv = document.createElement('div');
                labelDiv.className = "edit-form-field-label";
                labelDiv.innerHTML = "<span style=\"\"><b>" + labelIn + ":&nbsp;</b></span>";
                
                // This needs an onChange script
                var valueDiv = document.createElement('div');
                valueDiv.className = "edit-form-field-value-orig";
                var tmpHtml = '';
                tmpHtml = '<input type="text" class="edit-simple-text" ';
                tmpHtml += 'id="' + fieldId + '" ';
                // updateArtifactField
                // tmpHtml += 'onchange="console.log(\'' + fieldId + ' has changed.\')"';
                tmpHtml += 'onchange="switchboard(\'updateArtifactField\',\'' + fieldId + '\',{\'field\':\'' + fieldNameIn + '\'})" ';
                tmpHtml += ' value="' + currentValueIn + '">';
                
                valueDiv.innerHTML = tmpHtml;
                
                rowContDiv.appendChild(labelDiv);
                rowContDiv.appendChild(valueDiv);
                
                return rowContDiv;
            }
            var simpleTextareaField = function (artiIdIn,labelIn,fieldNameIn,currentValueIn) {
                const fieldId = artiIdIn + '-edit-' + fieldNameIn + '-value';
                
                var rowContDiv = document.createElement('div');
                rowContDiv.className = "edit-form-row";
                
                var labelDiv = document.createElement('div');
                labelDiv.className = "edit-form-field-label";
                labelDiv.innerHTML = "<span style=\"\"><b>" + labelIn + ":&nbsp;</b></span>";
                
                // This needs an onChange script
                var valueDiv = document.createElement('div');
                valueDiv.className = "edit-form-field-value-orig";
                // This needs an onChange script
                
                var tmpHtml = '';
                tmpHtml = '<textarea class="edit-simple-textarea" ';
                tmpHtml += 'id="' + fieldId + '" ';
                //tmpHtml += 'onchange="console.log(\'' + fieldId + ' has changed.\')"';
                //tmpHtml += 'onchange="console.log(' + fieldId + ' has changed.)"';
                tmpHtml += 'onchange="switchboard(\'updateArtifactField\',\'' + fieldId + '\',{\'field\':\'' + fieldNameIn + '\'})" ';
                tmpHtml += '>';
                tmpHtml += currentValueIn;
                tmpHtml += '</textarea>';
                
                valueDiv.innerHTML = tmpHtml;
                
                rowContDiv.appendChild(labelDiv);
                rowContDiv.appendChild(valueDiv);
                
                return rowContDiv;
            }
            var simpleListField = function (artiIdIn,labelIn,fieldNameIn,currentValueListIn,optionListIn) { // <== DEPRECATED
                var foo = document.createElement('div');
                foo.innerHTML = "<b>simpleListField is no longer a thing.</b>";
                return foo;
            }
            var fancyListField = function (artiIdIn,labelIn,fieldNameIn,currentValueListIn,optionListIn) {
                var lew = new RNWAListFieldWidget();
                lew.widgetName = fieldNameIn;
                lew.recordId = artiIdIn;
                lew.choiceList = optionListIn; //sse.ssRead('blob')['persons'];
                lew.listMembers = currentValueListIn;
                lew.addChoiceFunction = 'addChoice';
                lew.removeMemberFunction = 'removeMember';
                lew.addMemberFunction = 'addMember'; 
                
                var tmpDiv = document.createElement('div');
                //tmpDiv.style = "display:block;";
                tmpDiv.style = "display:inline-flex;";
                tmpDiv.appendChild(lew.renderWidget());
                
                var row = document.createElement('div');
                row.className = "edit-form-row ";
                var label = document.createElement('div');
                label.className = "edit-form-field-label";
                label.innerHTML = '<span style=""><b>' + wrkFieldName + ':&nbsp;</b></span>';
                
                row.appendChild(label);
                row.appendChild(tmpDiv);  
                return row;              
                
            }
            var simpleSelectField = function (artiIdIn,labelIn,fieldNameIn,currentValueIn,optionListIn) {
                const fieldId = artiIdIn + '-edit-' + fieldNameIn + '-value';
                
                var rowContDiv = document.createElement('div');
                rowContDiv.className = "edit-form-row";
                
                var labelDiv = document.createElement('div');
                labelDiv.className = "edit-form-field-label";
                labelDiv.innerHTML = "<span style=\"\"><b>" + labelIn + ":&nbsp;</b></span>";
                
                // This needs an onChange script
                var valueDiv = document.createElement('div');
                valueDiv.className = "edit-form-field-value-orig";
                
                var tmpHtml = '';
                
                
                tmpHtml += '<select id="' + fieldId + '" '
                //tmpHtml += ' onchange="console.log(\'' + fieldId + ' has changed.\')" ';
                tmpHtml += ' onchange="switchboard(\'updateArtifactField\',\'' + fieldId + '\',{\'field\':\'' + fieldNameIn + '\'})" ';
                tmpHtml += ' name="">';
                for (var idx=0; idx<optionListIn.length; idx++ ){
                    var optionVal = optionListIn[idx];
                    if (optionVal == currentValueIn) {
                        tmpHtml += '<option value="' + optionListIn[idx] + '" selected>' + optionListIn[idx] + '</option>';
                    } else {
                        tmpHtml += '<option value="' + optionListIn[idx] + '">' + optionListIn[idx] + '</option>';
                    }
                }
                tmpHtml += '</select>';
                
                valueDiv.innerHTML = tmpHtml;
                
                
                rowContDiv.appendChild(labelDiv);
                rowContDiv.appendChild(valueDiv);
                
                return rowContDiv;
            }
            //
            var wrkFieldList = ['title','artifactid','majtype','runmins','season','episode','synopsis'];
            wrkFieldList.push('file');
            wrkFieldList.push('filepath');
            wrkFieldList.push('director');
            wrkFieldList.push('writer');
            wrkFieldList.push('primcast');
            wrkFieldList.push('relorg');
            wrkFieldList.push('relyear');
            wrkFieldList.push('eidrid');
            wrkFieldList.push('imdbid');
            wrkFieldList.push('arbmeta');
            wrkFieldList.push('tags');
            //wrkFieldList.push('');
            
            var edOuterDiv = document.createElement('div');
            edOuterDiv.className = 'edit-form-outer-container';
            
            var fieldDiv; 
            for (var idx=0; idx<wrkFieldList.length; idx++ ) {
                var wrkFieldName = wrkFieldList[idx];
                switch (wrkFieldName) {
                    case 'artifactid':
                        fieldDiv = simpleDisplayField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName]);
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    case 'title' :
                    case 'runmins' :
                    case 'season' :
                    case 'episode' :
                    case 'file' :
                    case 'filepath' :
                    case 'eidrid' :
                    case 'imdbid' :
                    case 'relyear' :
                        fieldDiv = simpleTextField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName]);
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    case 'director' :
                    case 'writer' :
                    case 'primcast' :
                        // const personList = ['Person One', 'Person Two'];
                        const personList = sse.ssRead('blob')['persons'];
                        fieldDiv = fancyListField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName],personList);
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    case 'tags' :
                        // const personList = ['Person One', 'Person Two'];
                        const tagList = sse.ssRead('blob')['tags'];
                        fieldDiv = fancyListField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName],tagList);
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    case 'relorg' :
                        // const companyList = ['Company One', 'Company Two'];
                        const companyList = sse.ssRead('blob')['companies'];
                        fieldDiv = fancyListField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName],companyList);
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    case 'synopsis' :
                    case 'arbmeta' :
                        fieldDiv = simpleTextareaField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName]);
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    case 'majtype' :
                        var optList = ['movie','tvseries','tvepisode'];
                        fieldDiv = simpleSelectField(artiIdIn,wrkFieldName,wrkFieldName,dataObjIn[wrkFieldName],optList); // dataObjIn[wrkFieldName]
                        edOuterDiv.appendChild(fieldDiv);
                        break;
                    default:
                        console.log('renderArtifactEdit.cbFunc - fscking oops!  ' + wrkFieldName);
                        break;
                }
            }
            
            var editDiv = document.getElementById('structfeatureedit');
            editDiv.innerHTML = '';
            editDiv.appendChild(edOuterDiv);
            
            //// THIS SHOULD BE DONE WITH A "CLICK" EVENT TO THE EDIT TAB 
            //// INSTEAD OF THIS DIRECT ACTION ON DIVS
            //document.getElementById('structfeatureplayer').style.display = 'none';
            //document.getElementById('structfeaturesearch').style.display = 'none';
            //document.getElementById('structfeatureedit').style.display = 'block';
            
            //END of cbFunc 
        }
        const endpoint = '/rmvod/api/artifact/get';
        const payloadObj = {'artifactid':artiIdIn};
        this.genericApiCall(payloadObj,endpoint,cbFunc);
        //END OF renderArtifactEdit
    }
    // Push updated Artifact Edit value(s) to the API
    postArtifactFieldEdit(deidIn,argObjIn){  //UPDATED FOR NEW RETURN OBJECT MODEL
        console.log('postArtifactFieldEdit ' + deidIn + ': ' + JSON.stringify(argObjIn));
        var wrkArtiId = deidIn.substring(0,36);
        var wrkFieldName = argObjIn['field'];
        var updateObj = {};
        //udpateObj['artifactid'] = wrkArtiId;
        switch (wrkFieldName) {
            case 'artifactid':
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': we should never be here');
                break;
            case 'title' :
            case 'runmins' :
            case 'season' :
            case 'episode' :
            case 'file' :
            case 'filepath' :
            case 'eidrid' :
            case 'imdbid' :
            case 'relyear' :
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': simpleTextField');
                var strValue = document.getElementById(deidIn).value;
                updateObj[wrkFieldName] = strValue;
                console.log(JSON.stringify(updateObj));
                break;
            case 'director' :
            case 'writer' :
            case 'primcast' :
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': simpleListField');
                var strValue = document.getElementById(deidIn).value;
                updateObj[wrkFieldName] = JSON.parse(strValue);
                console.log(JSON.stringify(updateObj));
                break;
            case 'relorg' :
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': simpleListField');
                var strValue = document.getElementById(deidIn).value;
                updateObj[wrkFieldName] = JSON.parse(strValue);
                console.log(JSON.stringify(updateObj));
                break;
            case 'synopsis' :
            case 'arbmeta' :
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': simpleTextareaField');
                var strValue = document.getElementById(deidIn).value;
                updateObj[wrkFieldName] = strValue;
                // updateObj[wrkFieldName] = strValue.replace(/'/g,"\'");
                console.log(JSON.stringify(updateObj));
                break;
            case 'majtype' :
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': simpleSelectField');
                break;
            case 'tags' :
                console.log('postArtifactFieldEdit - ' + wrkFieldName + ': simpleListField');
                var strValue = document.getElementById(deidIn).value;
                updateObj[wrkFieldName] = JSON.parse(strValue);
                console.log(JSON.stringify(updateObj));
                break;
            default:
                console.log('postArtifactFieldEdit - fscking oops!  ' + wrkFieldName);
                break;
        }
        // Now, we do exciting things.
        var cbFunc = function (dataObjIn) {
            console.log('postArtifactFieldEdit.cbFunc: ' + JSON.stringify(dataObjIn));
        }
        const endpoint = '/rmvod/api/artifact/update';
        const payload = {'artifactid':wrkArtiId,'values':updateObj};
        this.genericApiCall(payload,endpoint,cbFunc);
    }
    // Submit "Add Single Artifact" form
    // Performs DOM updates directly.
    apiSubmitNewSingleArtiForm(){ //UPDATED FOR NEW RETURN OBJECT MODEL
        var nafp = document.getElementById('nafilepath').value;
        var nafn = document.getElementById('nafilename').value;
        var namt = document.getElementById('namajtype').value;
        var cbFunc = function(dataObjIn){
            // console.log("apiSubmitNewSingleArtiForm.cbFunc: " + JSON.stringify(dataObjIn))
            var ml =  new RMVodWebApp();
            if (dataObjIn['status']['success'] == true) {
                // Add succeeded
                ml.renderArtifactEdit(dataObjIn['data'][0]['artifactid']);
                const ev = new Event('click');
                //document.getElementById('tabspan2').dispatchEvent(ev); // RNWATabWidget-tabspan-2
                document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev); // RNWATabWidget-tabspan-2
            } else {
                // Add failed
                window.alert("Sumbit failed.  Correct the problem listed below and try again.\n" + dataObjIn['status']['detail'])
            }
        }
        var payload = {'filepath':nafp,'file':nafn,'majtype':namt};
        var endpoint = "/rmvod/api/artifact/newsingle";
        this.genericApiCall(payload,endpoint,cbFunc);
    }
    // Submit "Add Multiple Artifacts" form
    // Performs DOM updates directly.
    apiSubmitNewMultiArtiForm(){ //UPDATED FOR NEW RETURN OBJECT MODEL
        var nafp = document.getElementById('nafilepath').value;
        var nafn = document.getElementById('nafilename').value;
        var namt = document.getElementById('namajtype').value;     
        var natag = document.getElementById('natag').value;
        var laFileList = nafn.split('\n');
        var resObj = {'success':[],'failure':[]};
        for (var i = 0; i < laFileList.length; i++ ) {
            var cbFunc = function(dataObjIn){
                // dataObjIn is the result object returned from the API
                var ml =  new RMVodWebApp();
                if (dataObjIn['status']['success'] == true) {
                    // Add succeeded
                    var tmpDiv = document.createElement('div');
                    tmpDiv.innerHTML = ' > ' + dataObjIn['status']['detail'] + ' Succeeded! ';
                    document.getElementById('mutiaddresult').appendChild(tmpDiv);
                } else {
                    // Add failed
                    var tmpDiv = document.createElement('div');
                    tmpDiv.innerHTML = ' > Add Failed: ' + dataObjIn['status']['detail'];
                    document.getElementById('mutiaddresult').appendChild(tmpDiv);
                }
            }
            var payload = {'filepath':nafp,'file':laFileList[i],'majtype':namt,'tags':[natag]};
            var endpoint = "/rmvod/api/artifact/newsingle";
            this.genericApiCall(payload,endpoint,cbFunc);
        }
    }
    
    
    // DOM Util
    // Check for, and if they are present, load and respect 
    // cookie-stored option values
    onloadOptions(){
        var optList = ['serplaynext','resumeplay'];
        
        for (var idx=0; idx < optList.length; idx++ ) {
            var optNm = optList[idx];
            var tmpCookie = this.cc.getCookie('opt_' + optNm);
            var cbDE = document.getElementById(optNm);
            switch (tmpCookie) {
                case true:
                case 'true':
                    cbDE.checked = true;
                    break;
                case false:
                case "false":
                    cbDE.checked = false;
                    break;
                default:
                    console.log('onloadOptions - No cookie value for ' + optNm);
                    cbDE.checked = false;
                    break;
            }
            var tmpFunc = function(){switchboard('checkboxChange',this.id ,{});}
            
            cbDE.addEventListener("change", tmpFunc);
        }
    }
    // Perform functions that accompany a state change of the "Multi-
    // Factor Search" Checkbox.
    handleMFSCBStateChange(checkedBoolIn){
        if (checkedBoolIn == true) {
            document.getElementById('mfsexeccontainer').style.display = 'block';
        } else {
            document.getElementById('mfsexeccontainer').style.display = 'none';
        }
    }

    
    // HTML Util
    // Take a string in and return the string wrapped in a span, which
    // has an onclick function, which calls execDirectStringSrch.
    srchSpan(strIn) {
        // Takes a simple string in, and wraps it in a span with onclick
        // set to do execDirectStringSrch in the switchboard
        var retStr = '';
        retStr += '<span onclick="switchboard(\'execDirectStringSrch\',\'\',{\'srchstr\':\'';
        retStr += strIn;
        retStr += '\'})" style="text-decoration:underline;">';
        retStr += strIn;
        retStr += '</span>'
        return retStr;
    }
    // This just turns an Array object into a String list with 
    // commas between the elements.
    l2s(arrayIn){
        var listStr = '';
        var aLen = arrayIn.length;
        for (var i = 0; i < aLen; i++) {
            listStr += arrayIn[i];
            if (i < (aLen - 1)) {
                listStr += ', ';
            }
        }
        return listStr
    }
    // This just turns an Array object into a HTML list of 
    // "searchable" elements with commas between the elements.
    l2sSrch(arrayIn){
        var plainValList = ['string','none',''];
        var listStr = '';
        var aLen = arrayIn.length;
        for (var i = 0; i < aLen; i++) {
            if (plainValList.indexOf(arrayIn[i]) == -1) {
                listStr += this.srchSpan(arrayIn[i]);
            } else {
                listStr += arrayIn[i];
            }
            if (i < (aLen - 1)) {
                listStr += ', ';
            }
        }
        return listStr
    }
    // Render the "Search Widget"
    renderStaticModernSearchWidget(){
        var hr = new RMVWAHtmlGenerator();
        var newSrchWidget = hr.renderDESearchWidgetContainer();
        
        var targDiv = document.getElementById('headerblock2');
        targDiv.innerHTML = '';
        targDiv.appendChild(newSrchWidget);
        
        this.tagSelListRefresh();
    }
    // Render the "Side Artifact List" using a provided list of 
    // artifactid values.  Returns a DOM element.
    renderSALByIdList(artiIdListIn){
        // Whole List -- No details or episodes
        var allowedMajTypes = ['tvseries','movie'];
        var tmpDiv = document.createElement('div');
        for (var idx = 0; idx<artiIdListIn.length; idx++ ) {
            if (allowedMajTypes.indexOf(artiIdListIn[idx]['majtype']) > -1){
                tmpDiv.appendChild(this.renderSALElementById(artiIdListIn[idx]));
            }
        }
        return tmpDiv;
    }
    // Render an individual artifact for the "Side Artifact List" based 
    // on its majtype value.  Returns the DOM element
    renderSALElementById(artiTitleIdObjIn){
        var elementDiv = undefined;
        switch (artiTitleIdObjIn['majtype']) {
            case 'movie' :
                // This is how we do a "movie" row
                elementDiv = this.renderSideListMovie(artiTitleIdObjIn);
                break;
                
            case 'tvepisode' :
                // This is how we do an episode of a tv series
                elementDiv = this.renderSideListTvEpisode(artiTitleIdObjIn);
                break;
                
            case 'tvseries' :
                // This is how we do a tv series header/container
                elementDiv = this.renderSideListTvSeries(artiTitleIdObjIn);
                break;
            
            default :
                // this is where we punt.
                break;
        }
        return elementDiv;
    }
    // Render a "movie" for the "Side Artifact List".  Returns a DOM
    // element.
    renderSideListMovie(artiTIDobjIn){
        var rplStr = this.cc.getCookie('recentPlays');
        if (rplStr == undefined) {
            rplStr = '';
        }
        
        var titleSpanStyle = "";
        var tdSpanClass = "listtitleunseen";
        if (rplStr.indexOf(artiTIDobjIn['artifactid']) > -1) {
            tdSpanClass = "listtitleseen";
        }
        const spanId = artiTIDobjIn['artifactid'] + '_list-title-span';
        var tdSpanOnclick = "switchboard('vodPlayTitle','" + artiTIDobjIn['artifactid'] + "',{})"; //artiTIDobjIn['artifactid'];
        var tdTitle = artiTIDobjIn['title'];
        var titleDiv = document.createElement('div');
        titleDiv.className = "listelconttitle";
        var trunclength = 42;
        if (tdTitle.length > trunclength) {
            titleDiv.innerHTML = '<span id="' + spanId + '" class="' + tdSpanClass + '" onclick="' + tdSpanOnclick + '"><b><u>' + tdTitle.substring(0,(trunclength-3)) + '...</u></b></span>';
        } else {
            titleDiv.innerHTML = '<span id="' + spanId + '" class="' + tdSpanClass + '" onclick="' + tdSpanOnclick + '"><b><u>' + tdTitle + '</u></b></span>';
        }
        
        // Expand Button DIV
        var bdSpanClass = '';
        var bdSpanOnclick = "switchboard('xpopsldetail','" + artiTIDobjIn['artifactid'] + "',{})"; 
        var buttDiv = document.createElement('div');
        buttDiv.className = "listelcontxpbutt";
        buttDiv.innerHTML = '<span class="' + bdSpanClass + '" onclick="' + bdSpanOnclick + '"><u>Det</u></span>';
        
        // Container for Title and Button
        var titleRowDiv = document.createElement('div');
        titleRowDiv.className = "listelconttitlelink";
        titleRowDiv.appendChild(titleDiv);
        titleRowDiv.appendChild(buttDiv);
        
        // Container/placeholder for Artifact Detail
        var detailOuterDiv = document.createElement('div');
        detailOuterDiv.id = artiTIDobjIn['artifactid'] + '-sidelist-detail-outer';
        detailOuterDiv.className = "listeldetailouter";
        detailOuterDiv.style.display = 'none';
        
        // Container for whole List element
        var listElContainer =  document.createElement('div');
        listElContainer.className = "listelcontainer";
        listElContainer.id = artiTIDobjIn['artifactid'] + '-sidelist-element';
        listElContainer.appendChild(titleRowDiv);
        listElContainer.appendChild(detailOuterDiv);
        
        return listElContainer;
    }
    // Render a "tvseries" for the "Side Artifact List".  Returns a DOM
    // element.
    renderSideListTvSeries(artiTIDobjIn){
        var tdSpanClass = "";
        var tdSpanOnclick = "switchboard('tvsExpandEpisodes','" + artiTIDobjIn['artifactid'] + "',{})"; //artiTIDobjIn['artifactid'];
        var tdTitle = artiTIDobjIn['title']; // + "(series)";
        var titleDiv = document.createElement('div');
        titleDiv.className = "listelconttitle";
        
        var trunclength = 38;
        if (tdTitle.length >= trunclength) {
            titleDiv.innerHTML = '<span class="' + tdSpanClass + '" onclick="' + tdSpanOnclick + '"><b><u>' + tdTitle.substring(0,(trunclength-3)) + '...<span style="color:#c0c080">(series)</span></u></b></span>';
        } else {
            titleDiv.innerHTML = '<span class="' + tdSpanClass + '" onclick="' + tdSpanOnclick + '"><b><u>' + tdTitle + '<span style="color:#c0c080">(series)</u></b></span>';
        }
        
        // Container for Title and Button
        var titleRowDiv = document.createElement('div');
        titleRowDiv.className = "listelconttitlelink";
        titleRowDiv.appendChild(titleDiv);
        
        // Container/placeholder for Artifact Detail  <<==== NEW
        var detailOuterDiv = document.createElement('div');
        detailOuterDiv.id = artiTIDobjIn['artifactid'] + '-sidelist-detail-outer';
        detailOuterDiv.className = "listeldetailouter";
        detailOuterDiv.style.display = 'none';
        
        // Container/placeholder for Episode List
        var epListOuterDiv = document.createElement('div');
        epListOuterDiv.id = artiTIDobjIn['artifactid'] + '-sidelist-episode-list-outer';
        epListOuterDiv.className = "listelseriescollep";
        
        // Container for whole List element
        var listElContainer =  document.createElement('div');
        listElContainer.className = "listelcontainer";
        listElContainer.id = artiTIDobjIn['artifactid'] + '-sidelist-element';
        listElContainer.appendChild(titleRowDiv);
        listElContainer.appendChild(detailOuterDiv);
        listElContainer.appendChild(epListOuterDiv);
        
        return listElContainer;
    }
    // Render a "tvseries" for the "Side Artifact List".  Returns a DOM
    // element.
    renderSideListTvEpisode(artiTIDobjIn){
        var rplStr = this.cc.getCookie('recentPlays');
        if (rplStr == undefined) {
            rplStr = '';
        }
        
        const spanId = artiTIDobjIn['artifactid'] + '_list-title-span';
        
        var tdSpanClass = "listtitleunseen";
        if (rplStr.indexOf(artiTIDobjIn['artifactid']) > -1) {
            tdSpanClass = "listtitleseen";
        }
        var tdSpanOnclick = "switchboard('vodPlayTitle','" + artiTIDobjIn['artifactid'] + "',{})";
        var tdTitle = artiTIDobjIn['title'];
        var titleDiv = document.createElement('div');
        titleDiv.className = "listelseriescolleptitle";
        
        var trunclength = 35;
        if (tdTitle.length >= trunclength) {
            titleDiv.innerHTML = '<span id="' + spanId + '" class="' + tdSpanClass + '" onclick="' + tdSpanOnclick + '"><b><u>' + tdTitle.substring(0,(trunclength-3)) + '...</u></b></span>'; //...(series)
        } else {
            titleDiv.innerHTML = '<span id="' + spanId + '" class="' + tdSpanClass + '" onclick="' + tdSpanOnclick + '"><b><u>' + tdTitle + '</u></b></span>'; // (series)
        }
        
        // Expand Button DIV
        var bdSpanClass = '';
        var bdSpanOnclick = "switchboard('xpopsldetail','" + artiTIDobjIn['artifactid'] + "',{})";
        var buttDiv = document.createElement('div');
        buttDiv.className = "listelcontxpbutt";
        buttDiv.innerHTML = '<span class="' + bdSpanClass + '" onclick="' + bdSpanOnclick + '"><u>Det</u></span>';
        
        // Container for Title and Button
        var titleRowDiv = document.createElement('div');
        titleRowDiv.className = "listelseriescolleptitlelink";
        titleRowDiv.appendChild(titleDiv);
        titleRowDiv.appendChild(buttDiv);
        
        // Container/placeholder for Artifact Detail
        var detailOuterDiv = document.createElement('div');
        detailOuterDiv.id = artiTIDobjIn['artifactid'] + '-sidelist-detail-outer';
        detailOuterDiv.className = "listelseriescollepdetail";
        detailOuterDiv.style.display = 'none';
        
        // Container for whole List element
        var listElContainer =  document.createElement('div');
        listElContainer.className = "listelseriescollepcont";
        listElContainer.id = artiTIDobjIn['artifactid'] + '-sidelist-episode-element';
        listElContainer.appendChild(titleRowDiv);
        listElContainer.appendChild(detailOuterDiv);
        
        return listElContainer;
    }
    // Render the base page layout for the rmvod web application.
    // Performs DOM updates directly.
    basePageLayout02(){  //  BASE PAGE LAYOUT FOR vodlib_static_3.html
        var hr = new RMVWAHtmlGenerator();
        var masterCont = document.getElementById('mastercont');
        masterCont.innerHTML = '';
        masterCont.appendChild(hr.renderDEThreeCellHeader());
        masterCont.appendChild(hr.renderDETabWidget()); 
        masterCont.appendChild(hr.renderDEFooterContainer());
    }
    // Render "Show Details" button for a TV Series Artifact.  
    // Performs DOM update directly.
    tvsDetailShowButton(artiIdIn) {
        var innerHtml = '';
        innerHtml += '<span class="" id="" style="font-size:10px;"';
        innerHtml += 'onclick="switchboard(\'xpopslseriesdetail\',\'' + artiIdIn + '\',{})" ';
        innerHtml += '>';
        innerHtml += '<u>Show Series Details</u>';
        innerHtml += '</span>';
        
        var docElId = artiIdIn + '-sidelist-detail-outer';
        var deetDiv = document.getElementById(docElId);
        deetDiv.innerHTML = innerHtml;       
    }
    // Clears "search" form fields.
    // Performs DOM updates directly.
    resetSearchFactors(){
        // Clear Text Search
        document.getElementById('txt-srch-str').value = '';
        // Clear Dates
        document.getElementById('relyear-srch-start').value = '';
        document.getElementById('relyear-srch-end').value = '';
        //Reset Tag Select List
        document.getElementById('tag-search-select').value = 'None'; // tag-search-select
        // Reset Major Type Select List
        document.getElementById('majtype-search-select').value = 'All'; // majtype-search-select
        // Reset SQL WHERE Clause
        document.getElementById('sql-where-srch').value = '';// sql-where-srch
        
    }
    // Render the "Now Playing" artifact detail header
    // Performs DOM updates directly.
    renderArtifactDetailHeader(artiObj){
        //console.log('renderArtifactDetailHeader');
        var prodStr = '';
        prodStr += 'Writer(s): ' + this.l2sSrch(artiObj['writer']) + ' | ';
        prodStr += 'Director(s): ' + this.l2sSrch(artiObj['director']) + ' | ';
        prodStr += 'Runtime: ' + artiObj['runmins'] + ' | ';
        prodStr += 'Release Yr.: ' + artiObj['relyear'] + ' | ';
        
        var castStr = '';
        castStr +=  this.l2sSrch(artiObj['primcast']);
        
        var synoStr = '';
        synoStr += 'Synopsis: ';
        if (artiObj['majtype'] == "tvepisode") {
            synoStr += '(Season ' + artiObj['season'] + ' Episode: ' + artiObj['episode'] + ') ';
        }
        synoStr += artiObj['synopsis'];
        
        document.getElementById('header-title').innerText = 'Now Playing: ' + artiObj['title'];
        document.getElementById('header-synopsis').innerText = synoStr;
        document.getElementById('header-production').innerHTML = 'Production: ' + prodStr;
        document.getElementById('header-cast').innerHTML = 'Cast: ' + castStr;
    }
    // Refresh "Filed List Widget"
    // Performs DOM updates directly.
    refreshFieldListWidget(fieldNmIn,valuesListIn){
        var blobKey = '';
        switch (fieldNmIn) {
            case 'tags':
                blobKey = 'tags';
                break;
            case 'relorg':
                blobKey = 'companies';
                break;
            case 'director':
            case 'writer':
            case 'primcast':
                blobKey = 'persons';             
                break;
            default:
                console.log('renderFieldListWidget: ' + fieldNmIn + ", " + JSON.stringify(valuesListIn));
                return;
        }
        
        var lew = new RNWAListFieldWidget();
        lew.widgetName = fieldNmIn;
        lew.recordId = "";
        lew.choiceList = this.sse.ssRead('blob')[blobKey];
        lew.listMembers = valuesListIn;
        lew.addChoiceFunction = 'addChoice';
        lew.removeMemberFunction = 'removeMember';
        lew.addMemberFunction = 'addMember'; 
        var lewDE = lew.renderWidget();
        var boxDiv = document.getElementById(fieldNmIn + '_Box');
        boxDiv.innerHTML = lewDE.children[1].innerHTML;        
        
    }
    // A placeholder method for a "unified" "New Artifact Form"
    renderUnifiedNewArtifactForm(ModeStrIn){ // Someday
        // Someday
    }
    // Render a form for data entry to create a new single artifact
    // Performs DOM updates directly.
    renderNewSingleArtiForm(){ // Reworked to use hg.renderStackFormRow
        //Web UI for Create a Single Artifact:
        //You put in filepath, file, majtype
        //API Call => If file exists, create bare-bones Artifact with 
        //filename as title, and send the artifactid back to the UI.  
        //UI initiates "Edit" on returned artifactid
        var tmpHtml = "";
        
        tmpHtml += '<p>';
        tmpHtml += 'Create a single Artifact by providing the filepath component and filename which will identify files in the video storage location.<br>';
        tmpHtml += 'You will also need to provide the Major Type for the artifact.<br>';
        tmpHtml += '<b>Note:</b>If you are creating a "tvseries" artifact, set the filename to the leading part of the filename which is common to all the filenames of the "tvepisode" artifacts to be added subsequently';
        tmpHtml += '</p>';
        
        var hg = new RMVWAHtmlGenerator();
        
        var argsObj = {};
        argsObj['labelContentHtml'] = 'Path: ';
        argsObj['fieldContentHtml'] = '<input id="nafilepath" type="text" class="">';
        argsObj['rowWidth'] = '800px';
        argsObj['labelWidth'] = '190px';
        argsObj['fieldWidth'] = '480px';
        
        var row1 = hg.renderStackFormRow(argsObj);
        
        argsObj['labelContentHtml'] = 'Filename: ';
        argsObj['fieldContentHtml'] = '<input id="nafilename" type="text" class="">';
        var row2 = hg.renderStackFormRow(argsObj);
        
        var tmpHtml2 = '<select name="namajtype" id="namajtype" class="">';
        tmpHtml2 += '<option value="none"></option>';
        tmpHtml2 += '<option value="movie">movie</option>';
        tmpHtml2 += '<option value="tvseries">tvseries</option>';
        tmpHtml2 += '<option value="tvepisode">tvepisode</option>';
        tmpHtml2 += '</select>';
        
        argsObj['labelContentHtml'] = 'Major Type: ';
        argsObj['fieldContentHtml'] = tmpHtml2;
        var row3 = hg.renderStackFormRow(argsObj);
        
        var fooDiv = document.createElement('div');
        fooDiv.style = 'display:block;';
        fooDiv.appendChild(row1);
        fooDiv.appendChild(row2);
        fooDiv.appendChild(row3);
        tmpHtml += fooDiv.outerHTML;
        
        tmpHtml += '<div style="padding-left:200px;"><span style="font-weight:bold;text-decoration:underline;" onclick="switchboard(\'singleNewArtiSubmit\',\'\',{})">Submit</span></div>';
        
        var div = document.createElement('div');
        div.className = "";
        div.style.overflow = 'auto';
        div.id = "";
        div.innerHTML = tmpHtml;
        
        var targetDiv = document.getElementById('structfeatureedit');
        targetDiv.innerHTML = "";
        targetDiv.appendChild(div);
        
        // tabspan2
        const ev = new Event('click');
        document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev); // RNWATabWidget-tabspan-2 // tabspan2
    }
    // Render a form for data entry to associate tvepisode artifacts 
    // with a tvseries artifact.
    // Performs DOM updates directly.
    renderSeriesEpisodeAddForm(argObjIn){ // Reworked to use hg.renderStackFormRow
        //Web UI for Associate Episodes with Series:
        //You put in filepath, file, majtype
        //API Call => If file exists, create bare-bones Artifact with 
        //filename as title, and send the artifactid back to the UI.  
        //UI initiates "Edit" on returned artifactid
        var tmpHtml = "";
        tmpHtml += '<p>';
        tmpHtml += 'Add Episodes to TV Series <b>' + argObjIn['title'] + '</b> by providing the filepath component and filename fragment which will identify files in the video storage location.<br>';
        tmpHtml += 'This requires that the Artifacts for the Episodes have already been created.';
        tmpHtml += '</p>';
        
        var hg = new RMVWAHtmlGenerator();
        
        var argsObj = {};
        argsObj['labelContentHtml'] = 'Path: ';
        argsObj['fieldContentHtml'] = '<input id="nafilepath" type="text" class="">';
        argsObj['rowWidth'] = '800px';
        argsObj['labelWidth'] = '190px';
        argsObj['fieldWidth'] = '480px';
        var row1 = hg.renderStackFormRow(argsObj);
        
        argsObj['labelContentHtml'] = 'Filename fragment: ';
        argsObj['fieldContentHtml'] = '<input id="nafilename" type="text" class="">';
        var row2 = hg.renderStackFormRow(argsObj);        
        
        argsObj['labelContentHtml'] = 'Artifact ID: ';
        argsObj['fieldContentHtml'] = '<input id="naartifactid" type="text" class="" value="' + argObjIn['artifactid'] + '">';
        var row3 = hg.renderStackFormRow(argsObj);        
                
        var fooDiv = document.createElement('div');
        fooDiv.style = 'display:block;';
        fooDiv.appendChild(row1);
        fooDiv.appendChild(row2);
        fooDiv.appendChild(row3);
        tmpHtml += fooDiv.outerHTML;
        
        tmpHtml += '<div style="padding-left:200px;"><span style="font-weight:bold;text-decoration:underline;" onclick="switchboard(\'seriesEpisodeAddSubmit\',\'\',{})">Submit</span></div>';
        
        var div = document.createElement('div');
        div.className = "";
        div.style.overflow = 'auto';
        div.id = "";
        div.innerHTML = tmpHtml;
        
        var targetDiv = document.getElementById('structfeatureedit');
        targetDiv.innerHTML = "";
        targetDiv.appendChild(div);
        
        document.getElementById('nafilepath').value = argObjIn['filepath'];
        document.getElementById('nafilename').value = argObjIn['file'];
        
        // tabspan2
        const ev = new Event('click');
        document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev);  // RNWATabWidget-tabspan-2 // tabspan2
    }
    // Render a form for data entry to create multiple new artifacts
    // Performs DOM updates directly.
    renderNewMultiArtiForm(){ // Reworked to use hg.renderStackFormRow
        //Web UI for Create a Single Artifact:
        //You put in filepath, file, majtype
        //API Call => If file exists, create bare-bones Artifact with 
        //filename as title, and send the artifactid back to the UI.  
        //UI initiates "Edit" on returned artifactid
        var tmpHtml = "";
        tmpHtml += '<p>';
        tmpHtml += 'Create multiple Artifacts by providing the filepath component and a newline-separated list of filenames which will identify files in the video storage location.<br>';
        tmpHtml += 'You will also need to provide the Major Type for the artifacts and an initial Tag to be assigned.';
        tmpHtml += '</p>';
        
        
        var hg = new RMVWAHtmlGenerator();
        
        var argsObj = {};
        argsObj['labelContentHtml'] = 'Path: ';
        argsObj['fieldContentHtml'] = '<input id="nafilepath" type="text" class="">';
        argsObj['rowWidth'] = '800px';
        argsObj['labelWidth'] = '190px';
        argsObj['fieldWidth'] = '490px';
        
        var row1 = hg.renderStackFormRow(argsObj);
        
        argsObj['labelContentHtml'] = 'Filename: ';
        argsObj['fieldContentHtml'] = '<textarea id="nafilename" cols="40" rows="12" class=""></textarea>';
        var row2 = hg.renderStackFormRow(argsObj);
                
        var tmpHtml2 = '<select name="namajtype" id="namajtype" class="">';
        tmpHtml2 += '<option value="none"></option>';
        tmpHtml2 += '<option value="movie">movie</option>';
        tmpHtml2 += '<option value="tvseries">tvseries</option>';
        tmpHtml2 += '<option value="tvepisode">tvepisode</option>';
        tmpHtml2 += '</select>';
        
        argsObj['labelContentHtml'] = 'Major Type: ';
        argsObj['fieldContentHtml'] = tmpHtml2;
        var row3 = hg.renderStackFormRow(argsObj);
        
        const tagList = this.sse.ssRead('blob')['tags'];
        
        var tmpHtml3 = '<select name="natag" id="natag" class="">';
        tmpHtml3 += '<option value="none">None</option>';
        
        for (var i = 0; i < tagList.length; i++ ){
            tmpHtml3 += '<option value="' + tagList[i] + '">' + tagList[i] + '</option>';
        }
        tmpHtml3 += '</select>';
        
        argsObj['labelContentHtml'] = 'Starting Tag: ';
        argsObj['fieldContentHtml'] = tmpHtml3;
        var row4 = hg.renderStackFormRow(argsObj);
        
        
        var fooDiv = document.createElement('div');
        fooDiv.style = 'display:block;';
        fooDiv.appendChild(row1);
        fooDiv.appendChild(row2);
        fooDiv.appendChild(row3);
        fooDiv.appendChild(row4);
        tmpHtml += fooDiv.outerHTML;        
        
        
        tmpHtml += '<div style="padding-left:200px;"><span style="font-weight:bold;text-decoration:underline;" onclick="switchboard(\'multiNewArtiSubmit\',\'\',{})">Submit</span></div>';
        tmpHtml += '<div id="mutiaddresult">';
        
        tmpHtml += '</div>';
        
        var div = document.createElement('div');
        div.className = "";
        div.style.overflow = 'auto';
        div.id = "";
        div.innerHTML = tmpHtml;
        
        var targetDiv = document.getElementById('structfeatureedit');
        targetDiv.innerHTML = "";
        targetDiv.appendChild(div);
        
        // tabspan2
        const ev = new Event('click');
        document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev); // RNWATabWidget-tabspan-2 // tabspan2
    }
    // Execute an API call which associates tvepisode artifacts 
    // with a tvseries artifact
    execAddSeriesEpisodes(seriesaidIn,filepathIn,filefragIn){
        var cbFunc = function(dataObjIn) {
            console.log('execAddSeriesEpisodes.cbFunc: \n' + JSON.stringify(dataObjIn));
            
            var tmpHtml = '';
            
            if (dataObjIn['status']['success'] == true) {
                // It worked
                tmpHtml += "<b>Success!</b><br>";
                tmpHtml += "The following Artifact IDs were associated:<br>";
                for (var i = 0; i < dataObjIn['data'].length; i++ ) {
                    tmpHtml += dataObjIn['data'][i] + "<br>";
                }
            } else {
                // It didn't work
                tmpHtml += "<b>ERROR!</b> " + dataObjIn['status']['detail'] + "<br>";
                tmpHtml += "Log:<br>";
                for (var i = 0; i < dataObjIn['status']['log'].length; i++ ) {
                    tmpHtml += dataObjIn['status']['log'][i] + "<br>";
                }
                if (dataObjIn['data'].length > 0) {
                    tmpHtml += "<br>";
                    tmpHtml += "The following Artifact IDs were associated:<br>";
                    for (var i = 0; i < dataObjIn['data'].length; i++ ) {
                        tmpHtml += dataObjIn['data'][i] + "<br>";
                    }                    
                }     
            }
            var tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = tmpHtml;
            document.getElementById('structfeatureedit').appendChild(tmpDiv);
        }
        var payloadObj = {'seriesaid': seriesaidIn, 'filepath':filepathIn, 'filefrag':filefragIn};
        var endpoint = '/rmvod/api/series/artifacts/add';
        this.genericApiCall(payloadObj,endpoint,cbFunc)
    }
    
    
    // Cookie Handling
    contCookieOnLoad() {
        // OnLoad, if "Resume Playback" is checked, check to see if 3 
        // "Continue" cookies are set.  If so, get the values of the 
        // 3 cookies, clear the 3 cookies, and begin playback of the 
        // SRC URI at the "Progress" Point
        
        //  We're going to fake checking the chekcbox for now
        
        var cbFunc = function () {
            // resumeplay
            try {
                var playerDE = document.getElementById('actualvideoplayer');
                var wa = new RMVodWebApp();
                playerDE.currentTime = wa.cc.getCookie('playback_offset');
                if (playerDE.currentSrc == wa.cc.getCookie('artifact_source_uri')) {
                    clearInterval(intervHandle);
                } else {
                    if ((playerDE.currentSrc != "") & (wa.cc.getCookie('artifact_source_uri') == "")) {
                        wa.cc.setCookie('artifact_source_uri', playerDE.currentSrc,5);
                        if (playerDE.currentSrc == wa.cc.getCookie('artifact_source_uri')) {
                            clearInterval(intervHandle);
                        }
                    } else {
                        console.log("contCookieOnLoad.cbFunc - Still waiting for Cookie artifact_source_uri to match what's in the player");
                        console.log('contCookieOnLoad.cbFunc - playerDE.currentSrc: ' + playerDE.currentSrc);
                        console.log("contCookieOnLoad.cbFunc - wa.cc.getCookie('artifact_source_uri'): " + wa.cc.getCookie('artifact_source_uri'));
                    }
                }
            } catch (e) {
                console.log("contCookieOnLoad.cbFunc - Resume Play Position failed because " + e);
            }
        }
        
        var cbDE = document.getElementById('resumeplay');
        if (cbDE.checked == true) {
            var playAID = this.cc.getCookie('playing_aid');
            this.vodPlayTitleApi3(playAID);
            var intervHandle = setInterval(cbFunc,1000);
            this.cc.setCookie('cont_play_sample_int_handle',intervHandle,5);
        }
    }
    contCookiePostInterval(delayMsIn){
        // On Start of "Normal" Playback, an Interval is started (6000ms, 
        // for example) which periodically writes cookies to track the 
        // progress of playback of the current video. Initially 3 cookies 
        // are written:  The handle of the Interval, the SRC URI for 
        // the artifact, and the Integer "Progress" of the playback, 
        // in seconds.
        
        // On each running of the Interval, the Handle and SRC URI are 
        // confirmed to be correct, and the Progress is written
        
        // On natural conclusion of playback, the 3 "Continue" cookies 
        // are cleared
        var delayMs = 60000;
        if (delayMsIn != undefined){
            if(typeof delayMsIn == 'number') {
                delayMs = parseInt(delayMsIn);
            }
        }
        
        var cbFunc = function () {
            var wa = new RMVodWebApp();
            var playerDE = document.getElementById('actualvideoplayer');
            if (playerDE.paused == false) {
                var currTime = parseInt(playerDE.currentTime);
                var currSrc = playerDE.currentSrc;
                wa.cc.setCookie('artifact_source_uri',currSrc);
                wa.cc.setCookie('playback_offset',currTime);
            }
        }
        
        var intervalHandle = setInterval(cbFunc,delayMs);
        this.cc.setCookie('cont_play_sample_int_handle',intervalHandle,5);
        return intervalHandle;
    }
    contCookieNaturalEnd () {
        var intHandleIn = this.cc.getCookie('cont_play_sample_int_handle');
        clearInterval(intHandleIn);
        this.cc.clearCookie('artifact_source_uri');
        this.cc.clearCookie('playback_offset');
        this.cc.clearCookie('cont_play_sample_int_handle');
        this.cc.clearCookie('play_aid');
    }

}



//
// NEW CODE TO SUPPORT RECOMMENDATIONS -- START
//


function recsWrapper(sinceDtStrIn){
    
        //var recApiRetObj = {"meta": {"create_date": "2023-05-21 11:41:18"}, "data": {"others": {"tvseries": [{"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "imdbid": "tt0101049"}, {"artifactid": "a290ee00-577d-4178-8392-4e0ac761d0c2", "title": "Thunderbirds", "majtype": "tvseries", "imdbid": "tt0057790"}, {"artifactid": "d055800c-314e-49b6-9903-6cf453addacc", "title": "The Cleaner", "majtype": "tvseries", "imdbid": "tt12994356"}, {"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "imdbid": "tt3063454"}, {"artifactid": "73c34aae-d65c-4971-88db-724748804e3c", "title": "Bob's Burgers", "majtype": "tvseries", "imdbid": "tt1561755"}, {"artifactid": "ab8a0b85-96d1-48b4-b20b-7c097b24b90a", "title": "Keeping Up Appearances", "majtype": "tvseries", "imdbid": "tt0098837"}, {"artifactid": "0d38af65-46e1-4e2b-9195-686c7b932870", "title": "Stephen Fry In America", "majtype": "tvseries", "imdbid": "tt1307789"}, {"artifactid": "aa1e7a07-ea94-4c90-af43-7272c050af67", "title": "Stephen Fry: Last Chance To See", "majtype": "tvseries", "imdbid": "tt1409667"}], "movie": [{"artifactid": "e9253d1b-0711-4f65-b6e2-a6decc050ef6", "title": "1941", "majtype": "movie", "imdbid": "tt0078723"}, {"artifactid": "128070c1-c4f6-47bb-b7ab-6b94e30b3f41", "title": "Star Trek II: The Wrath of Khan", "majtype": "movie", "imdbid": "tt0084726"}, {"artifactid": "d03dcf5a-8ca6-40f4-89f8-09d13559ab66", "title": "Star Trek: The Motion Picture", "majtype": "movie", "imdbid": "tt0079945"}, {"artifactid": "08872109-9bbe-4b21-9125-fe8711d54300", "title": "The Four Horsemen - Discussions With Richard Dawkins", "majtype": "movie", "imdbid": "none"}, {"artifactid": "25abfc69-49db-4465-bce7-62b9e39feabd", "title": "The Best of The Colbert Report", "majtype": "movie", "imdbid": "none"}, {"artifactid": "53aade09-535b-4c96-9c1e-695284f476c6", "title": "ElephantParts", "majtype": "movie", "imdbid": "tt0082316"}, {"artifactid": "ca6c898f-d7c4-44d9-ad70-ba0b393a63f4", "title": "A Charlie Brown Christmas", "majtype": "movie", "imdbid": "tt0059026"}, {"artifactid": "56fafebd-21cb-4b99-83f9-35cbe768f2d7", "title": "Anne of Green Gables (Part 1)", "majtype": "movie", "imdbid": "tt0088727"}, {"artifactid": "93bd3736-2f79-464a-ae5a-b4c2709f06b3", "title": "Stooges: The Men Behind The Mayhem", "majtype": "movie", "imdbid": "tt0281229"}, {"artifactid": "f026cdfc-bb69-4857-b48f-25a21a15db73", "title": "The Last Remake of Beau Geste", "majtype": "movie", "imdbid": "tt0076297"}, {"artifactid": "912e453c-8d54-47c7-abe9-4d61b424dc45", "title": "One Flew Over The Cuckoo's Nest", "majtype": "movie", "imdbid": "tt0073486"}, {"artifactid": "0ea8c809-1020-474e-a6df-9074372cfa52", "title": "Despicable Me", "majtype": "movie", "imdbid": "tt1323594"}, {"artifactid": "5b4006c9-7c17-4040-8dfb-f6d79100a33d", "title": "Trainwreck", "majtype": "movie", "imdbid": "tt3152624"}, {"artifactid": "98f97e19-a027-4a8b-af96-0e886142c953", "title": "I Feel Pretty", "majtype": "movie", "imdbid": "tt6791096"}, {"artifactid": "0c8828a9-aa8a-4961-ba55-14c143fbe3a4", "title": "Revolution OS", "majtype": "movie", "imdbid": "tt0308808"}, {"artifactid": "487598cb-9b6c-47e5-8908-500a6d32e986", "title": "The Aviator", "majtype": "movie", "imdbid": "tt0338751"}, {"artifactid": "3559eaa9-1de2-4e16-8a2b-126acb6f9233", "title": "Sneakers", "majtype": "movie", "imdbid": "tt0105435"}, {"artifactid": "19a808dd-61ac-4676-abeb-2892c001205e", "title": "Shaun of the Dead", "majtype": "movie", "imdbid": "tt0365748"}, {"artifactid": "b973a96d-45c6-4d35-87fa-c96ad68125aa", "title": "The Andromeda Strain", "majtype": "movie", "imdbid": "tt0066769"}, {"artifactid": "e9ffd375-35f5-4d66-9a7c-d9f2b6efca94", "title": "2010: The Year We Make Contact", "majtype": "movie", "imdbid": "tt0086837"}, {"artifactid": "bd96a7cf-f725-449e-8256-d9bce4559ba7", "title": "Downfall.m4v", "majtype": "movie", "imdbid": "tt0363163"}, {"artifactid": "93d6764b-4553-4c2e-b825-d93cd26167ec", "title": "Big Hero 6", "majtype": "movie", "imdbid": "tt2245084"}, {"artifactid": "da235d5e-b37b-41a5-9f03-284cb902e89e", "title": "Greg Davies: The Back Of My Mums Head", "majtype": "movie", "imdbid": "tt3387320"}, {"artifactid": "457e6c3c-591e-46ab-8b75-c7ed31d0cfbc", "title": "TimMinchinBack.m4v", "majtype": "movie", "imdbid": "tt24518132"}, {"artifactid": "b16596a5-6d77-4e94-a617-8b87155828ed", "title": "Greg Davies: Firing Cheeseballs At A Dog", "majtype": "movie", "imdbid": "tt2396686"}, {"artifactid": "c7e34b0f-d3ea-4521-b39a-99b3d89812a6", "title": "Jo Brand: Barely Live", "majtype": "movie", "imdbid": "string"}, {"artifactid": "69583984-ebab-46c1-be6b-86796c6fef22", "title": "Sarah Millican: Bobby Dazzler", "majtype": "movie", "imdbid": "string"}, {"artifactid": "c8f35db3-7525-418e-b23a-4a610ae4654f", "title": "Jon Richardson: Nidiot", "majtype": "movie", "imdbid": "string"}, {"artifactid": "08c74e39-e523-4d4f-864c-7a0cc67c4419", "title": "Dara O'Briain: Talks Funny", "majtype": "movie", "imdbid": "tt1368982"}, {"artifactid": "b53e9f60-b76b-4781-9014-85be9bed1679", "title": "Ice Station Zebra", "majtype": "movie", "imdbid": "tt0063121"}]}, "tags": {"tvseries": [{"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "imdbid": "tt0101049"}, {"artifactid": "2f91b427-7c8c-4acd-8e40-2a0c5823f149", "title": "American Experience", "majtype": "tvseries", "imdbid": "tt0094416"}, {"artifactid": "7805b0b7-b274-4c75-ae6b-68bd8efe57cb", "title": "Avenue 5", "majtype": "tvseries", "imdbid": "tt10234362"}, {"artifactid": "c201f148-f45e-4248-afc1-f277371f6bef", "title": "Blackadder", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "73c34aae-d65c-4971-88db-724748804e3c", "title": "Bob's Burgers", "majtype": "tvseries", "imdbid": "tt1561755"}, {"artifactid": "3ef463f3-8a82-426e-9a6e-5260973115e8", "title": "Connections 1", "majtype": "tvseries", "imdbid": "tt0078588"}, {"artifactid": "7099fc66-cb10-4b6c-b41a-9c1f3f511f6c", "title": "Father Ted", "majtype": "tvseries", "imdbid": "tt0111958"}, {"artifactid": "86238ca3-6862-4721-b6fe-e8d2e875fdda", "title": "Fawlty Towers", "majtype": "tvseries", "imdbid": "tt0072500"}, {"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "imdbid": "tt0106004"}, {"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "imdbid": "tt3609352"}, {"artifactid": "82510bf0-ef28-4924-a9c5-03bae33e523a", "title": "House, M.D.", "majtype": "tvseries", "imdbid": "tt0412142"}, {"artifactid": "c9e7007b-4628-4578-9f02-8d847ae32550", "title": "Inside Amy Schumer", "majtype": "tvseries", "imdbid": "tt2578508"}, {"artifactid": "ab8a0b85-96d1-48b4-b20b-7c097b24b90a", "title": "Keeping Up Appearances", "majtype": "tvseries", "imdbid": "tt0098837"}, {"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "imdbid": "tt3063454"}, {"artifactid": "95a82dab-d94a-4eab-862c-2876e697547a", "title": "Modern Marvels: Engineering Disasters", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "c7b49b7b-8707-42a0-946c-9f0f771ff784", "title": "Monty Python's Flying Circus", "majtype": "tvseries", "imdbid": "tt0063929"}, {"artifactid": "aec0549e-cc1b-40e7-a0af-db641e9ed8ff", "title": "Moon Machines", "majtype": "tvseries", "imdbid": "tt1203167"}, {"artifactid": "bcac590f-a5c1-424f-aa14-82c3526e0405", "title": "NCIS", "majtype": "tvseries", "imdbid": "tt0364845"}, {"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "imdbid": "tt0387764"}, {"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "imdbid": "tt0050051"}, {"artifactid": "8b1ab865-5c43-488f-954a-dba13c277163", "title": "Poldark", "majtype": "tvseries", "imdbid": "tt3636060"}, {"artifactid": "6cbad761-e403-4f0d-bf49-bbefdfaaa839", "title": "Star Wars: Rebels", "majtype": "tvseries", "imdbid": "tt2930604"}, {"artifactid": "0d38af65-46e1-4e2b-9195-686c7b932870", "title": "Stephen Fry In America", "majtype": "tvseries", "imdbid": "tt1307789"}, {"artifactid": "aa1e7a07-ea94-4c90-af43-7272c050af67", "title": "Stephen Fry: Last Chance To See", "majtype": "tvseries", "imdbid": "tt1409667"}, {"artifactid": "7c7203c2-c4b6-4df7-945e-cfa505fc5257", "title": "The Day The Universe Changed", "majtype": "tvseries", "imdbid": "tt0199208"}, {"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "imdbid": "tt0077004"}, {"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "imdbid": "tt0073990"}, {"artifactid": "4948bc8c-6d9b-4ad7-9c3b-ba0cc0b5fd45", "title": "The IT Crowd", "majtype": "tvseries", "imdbid": "tt0487831"}, {"artifactid": "c9ab7d43-5531-4d5f-835c-c7b5c3ff8879", "title": "The Thin Blue Line", "majtype": "tvseries", "imdbid": "tt0112194"}, {"artifactid": "a290ee00-577d-4178-8392-4e0ac761d0c2", "title": "Thunderbirds", "majtype": "tvseries", "imdbid": "tt0057790"}], "movie": [{"artifactid": "0935ea10-163b-419b-a911-3b9dfdd557dc", "title": "A Mighty Wind", "majtype": "movie", "imdbid": "tt0310281"}, {"artifactid": "04fb8351-651e-4740-9b50-13a9392a7897", "title": "Beerfest", "majtype": "movie", "imdbid": "tt0486551"}, {"artifactid": "0c9db4eb-dd69-420f-ade8-776d17a641f8", "title": "BillHicksLive_T5.m4v", "majtype": "movie", "imdbid": "none"}, {"artifactid": "07273465-c4ef-49a7-b709-7d7137a180bc", "title": "Clerks III", "majtype": "movie", "imdbid": "tt11128440"}, {"artifactid": "0a715f56-09bc-4bc8-9d87-a7559f885151", "title": "CrudeAwakening.m4v", "majtype": "movie", "imdbid": "tt0776794"}, {"artifactid": "08c74e39-e523-4d4f-864c-7a0cc67c4419", "title": "Dara O'Briain: Talks Funny", "majtype": "movie", "imdbid": "tt1368982"}, {"artifactid": "0ea8c809-1020-474e-a6df-9074372cfa52", "title": "Despicable Me", "majtype": "movie", "imdbid": "tt1323594"}, {"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "imdbid": "tt0058083"}, {"artifactid": "0613a102-b416-4fc9-b381-137692055511", "title": "GrandDayOut.m4v", "majtype": "movie", "imdbid": "tt0104361"}, {"artifactid": "0d940d56-938a-4eea-bc29-1f7b7a4a684a", "title": "Hackers", "majtype": "movie", "imdbid": "tt0113243"}, {"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "imdbid": "tt0077745"}, {"artifactid": "03189fe8-a68f-4631-8eb2-8277c248a987", "title": "Jojo Rabbit", "majtype": "movie", "imdbid": "tt2584384"}, {"artifactid": "0e53430e-3795-4d68-b832-9d460f8b8d3a", "title": "JurassicPark4-mpg.m4v", "majtype": "movie", "imdbid": "string"}, {"artifactid": "02719058-c660-4132-a3c1-a7a93b1693e9", "title": "Medicine Man", "majtype": "movie", "imdbid": "tt0104839"}, {"artifactid": "0ccfac0f-b474-4828-a8a5-26534bd93cf4", "title": "MysteryMen", "majtype": "movie", "imdbid": "tt0132347"}, {"artifactid": "0690c787-619f-40b6-b9d8-99918241166f", "title": "Network", "majtype": "movie", "imdbid": "tt0074958"}, {"artifactid": "034bd2ca-f283-410b-ac31-2aa0d15e0f92", "title": "O Brother, Where Art Thou?", "majtype": "movie", "imdbid": "tt0190590"}, {"artifactid": "06ae6051-bed9-4bec-ab8c-eb1193851963", "title": "Platoon", "majtype": "movie", "imdbid": "tt0091763"}, {"artifactid": "0c8828a9-aa8a-4961-ba55-14c143fbe3a4", "title": "Revolution OS", "majtype": "movie", "imdbid": "tt0308808"}, {"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "imdbid": "tt0080684"}, {"artifactid": "00edc024-9c5d-4b97-a9e5-b79b7ee48f0f", "title": "Strategic Air Command", "majtype": "movie", "imdbid": "tt0048667"}, {"artifactid": "00b298bf-9998-4c90-8c00-55a70a13f881", "title": "The Death Of Stalin", "majtype": "movie", "imdbid": "tt4686844"}, {"artifactid": "08872109-9bbe-4b21-9125-fe8711d54300", "title": "The Four Horsemen - Discussions With Richard Dawkins", "majtype": "movie", "imdbid": "none"}, {"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "imdbid": "tt0056218"}, {"artifactid": "090187c5-1182-48f0-9ada-a1595a110e53", "title": "The Onion Movie", "majtype": "movie", "imdbid": "tt0392878"}, {"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "imdbid": "tt0078163"}, {"artifactid": "0ef74b4c-1d25-41de-99b8-ec615e06f425", "title": "The Russians Are Coming, the Russians Are Coming", "majtype": "movie", "imdbid": "tt0060921"}, {"artifactid": "01e0a408-c1f5-481e-be2e-d7b8338bbf25", "title": "upright_citizens_d1-mpg.m4v", "majtype": "movie", "imdbid": "tt0167739"}, {"artifactid": "08d55215-1f90-4dd9-b065-c64246ed0fee", "title": "Waterworld", "majtype": "movie", "imdbid": "tt0114898"}, {"artifactid": "06733bf7-0db1-40ce-8098-0d34e946832a", "title": "Zoolander", "majtype": "movie", "imdbid": "tt0196229"}]}, "people": {"tvseries": [{"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "imdbid": "tt0050051"}, {"artifactid": "07b9a75a-b08c-4f20-bf78-b859a16874d1", "title": "Star Trek: The Next Generation", "majtype": "tvseries", "imdbid": "tt0092455"}, {"artifactid": "1038cc43-ac2a-44e3-b4ec-ee885c693d5a", "title": "Barney Miller", "majtype": "tvseries", "imdbid": "tt0072472"}, {"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "imdbid": "tt0101049"}, {"artifactid": "1e193909-b7ec-48d0-9b14-f28f88692baf", "title": "All In The Family", "majtype": "tvseries", "imdbid": "tt0066626"}, {"artifactid": "2412bd7c-cdaa-4a74-93d3-bac6b039da15", "title": "Columbo", "majtype": "tvseries", "imdbid": "tt1466074"}, {"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "imdbid": "tt0073990"}, {"artifactid": "2c0d048e-6cc2-418c-9229-cc9a6f77769b", "title": "Taxi", "majtype": "tvseries", "imdbid": "tt0077089"}, {"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "imdbid": "tt0387764"}, {"artifactid": "305d6fa5-b580-49f6-a183-1e3cf88d3b9d", "title": "The Twilight Zone", "majtype": "tvseries", "imdbid": "tt0052520"}, {"artifactid": "3062158b-e3cf-463e-9890-ad300ac963ac", "title": "Star Trek", "majtype": "tvseries", "imdbid": "tt0060028"}, {"artifactid": "38279df9-7995-4178-906d-6dea19c575a0", "title": "Space: 1999", "majtype": "tvseries", "imdbid": "tt0072564"}, {"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "imdbid": "tt0106004"}, {"artifactid": "4298bd88-0cc1-42a1-9e4a-1fa2a3993d6a", "title": "Chernobyl", "majtype": "tvseries", "imdbid": "tt7366338"}, {"artifactid": "4e1ae46f-a5f9-489b-b541-fa12ae7b0350", "title": "Cosmos: A Personal Voyage", "majtype": "tvseries", "imdbid": "tt0081846"}, {"artifactid": "4e4e3fa6-5e21-407e-b60a-929725621b2d", "title": "Hogans Heroes", "majtype": "tvseries", "imdbid": "tt0058812"}, {"artifactid": "62852250-d1dc-400c-8586-7809e41a23fa", "title": "QI", "majtype": "tvseries", "imdbid": "tt0380136"}, {"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "imdbid": "tt0077004"}, {"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "imdbid": "tt3063454"}, {"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "imdbid": "tt3609352"}], "movie": [{"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "imdbid": "tt0080684"}, {"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "imdbid": "tt0078163"}, {"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "imdbid": "tt0058083"}, {"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "imdbid": "tt0077745"}, {"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "imdbid": "tt0056218"}, {"artifactid": "0f2de6e4-ff23-4c1f-b49f-6a47e7234069", "title": "Sleeper", "majtype": "movie", "imdbid": "tt0070707"}, {"artifactid": "12576b2d-38bb-49d4-9aa2-a91bd67db5dc", "title": "The Simpsons Movie", "majtype": "movie", "imdbid": "tt0462538"}, {"artifactid": "128070c1-c4f6-47bb-b7ab-6b94e30b3f41", "title": "Star Trek II: The Wrath of Khan", "majtype": "movie", "imdbid": "tt0084726"}, {"artifactid": "13985629-fb3c-4a32-8e0b-3ed8ae6e90f5", "title": "Crimson Tide", "majtype": "movie", "imdbid": "tt0112740"}, {"artifactid": "1593680d-4aa8-4860-bddb-9efdf7054e86", "title": "Twister", "majtype": "movie", "imdbid": "tt0117998"}, {"artifactid": "16c0510e-78fa-46e9-8ae8-ad8957627f4f", "title": "Airport 1975", "majtype": "movie", "imdbid": "tt0071110"}, {"artifactid": "1a2d3dbc-20fa-4ba7-a2b6-3e788302f807", "title": "Three Days of the Condor", "majtype": "movie", "imdbid": "tt0073802"}, {"artifactid": "1e8dfd91-564d-46db-93c1-8718b52141da", "title": "Earthquake", "majtype": "movie", "imdbid": "tt0071455"}, {"artifactid": "1f4bd566-641d-4667-ab6a-fc1419090394", "title": "Duel", "majtype": "movie", "imdbid": "tt0067023"}]}, "server": {"tvseries": [{"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "imdbid": "tt0050051"}, {"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "imdbid": "tt0073990"}, {"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "imdbid": "tt0387764"}, {"artifactid": "2f91b427-7c8c-4acd-8e40-2a0c5823f149", "title": "American Experience", "majtype": "tvseries", "imdbid": "tt0094416"}, {"artifactid": "3ef463f3-8a82-426e-9a6e-5260973115e8", "title": "Connections 1", "majtype": "tvseries", "imdbid": "tt0078588"}, {"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "imdbid": "tt0106004"}, {"artifactid": "48d00929-8f80-4cf8-873a-224f3ebed793", "title": "From The Earth To The Moon", "majtype": "tvseries", "imdbid": "tt0120570"}, {"artifactid": "4948bc8c-6d9b-4ad7-9c3b-ba0cc0b5fd45", "title": "The IT Crowd", "majtype": "tvseries", "imdbid": "tt0487831"}, {"artifactid": "6cbad761-e403-4f0d-bf49-bbefdfaaa839", "title": "Star Wars: Rebels", "majtype": "tvseries", "imdbid": "tt2930604"}, {"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "imdbid": "tt0077004"}, {"artifactid": "7099fc66-cb10-4b6c-b41a-9c1f3f511f6c", "title": "Father Ted", "majtype": "tvseries", "imdbid": "tt0111958"}, {"artifactid": "7805b0b7-b274-4c75-ae6b-68bd8efe57cb", "title": "Avenue 5", "majtype": "tvseries", "imdbid": "tt10234362"}, {"artifactid": "7c7203c2-c4b6-4df7-945e-cfa505fc5257", "title": "The Day The Universe Changed", "majtype": "tvseries", "imdbid": "tt0199208"}, {"artifactid": "82510bf0-ef28-4924-a9c5-03bae33e523a", "title": "House, M.D.", "majtype": "tvseries", "imdbid": "tt0412142"}, {"artifactid": "86238ca3-6862-4721-b6fe-e8d2e875fdda", "title": "Fawlty Towers", "majtype": "tvseries", "imdbid": "tt0072500"}, {"artifactid": "8b1ab865-5c43-488f-954a-dba13c277163", "title": "Poldark", "majtype": "tvseries", "imdbid": "tt3636060"}, {"artifactid": "95a82dab-d94a-4eab-862c-2876e697547a", "title": "Modern Marvels: Engineering Disasters", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "imdbid": "tt3609352"}, {"artifactid": "aec0549e-cc1b-40e7-a0af-db641e9ed8ff", "title": "Moon Machines", "majtype": "tvseries", "imdbid": "tt1203167"}, {"artifactid": "bcac590f-a5c1-424f-aa14-82c3526e0405", "title": "NCIS", "majtype": "tvseries", "imdbid": "tt0364845"}, {"artifactid": "c201f148-f45e-4248-afc1-f277371f6bef", "title": "Blackadder", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "c7b49b7b-8707-42a0-946c-9f0f771ff784", "title": "Monty Python's Flying Circus", "majtype": "tvseries", "imdbid": "tt0063929"}, {"artifactid": "c9ab7d43-5531-4d5f-835c-c7b5c3ff8879", "title": "The Thin Blue Line", "majtype": "tvseries", "imdbid": "tt0112194"}, {"artifactid": "c9e7007b-4628-4578-9f02-8d847ae32550", "title": "Inside Amy Schumer", "majtype": "tvseries", "imdbid": "tt2578508"}, {"artifactid": "e019ff17-9988-4861-bf13-a5a0de75de84", "title": "The Newsroom", "majtype": "tvseries", "imdbid": "tt1870479"}, {"artifactid": "e0a80e99-ac6b-49fa-852b-0b70e9300d1f", "title": "Engineering An Empire", "majtype": "tvseries", "imdbid": "tt0848954"}, {"artifactid": "e29b9ae9-6e5e-416c-b15b-5bba98a0a962", "title": "Still Game", "majtype": "tvseries", "imdbid": "tt0281491"}, {"artifactid": "ed308628-d4bf-4dde-acf5-f3a84d74b1dc", "title": "The Goes Wrong Show", "majtype": "tvseries", "imdbid": "tt9860664"}, {"artifactid": "f55c8c4d-511b-49e5-8e6b-c8be152fa4b8", "title": "Frost/Nixon: The Complete Interviews", "majtype": "tvseries", "imdbid": "tt0261639"}, {"artifactid": "f7d84e14-f7b0-4700-abfe-9c3ad796506b", "title": "Jeeves And Wooster", "majtype": "tvseries", "imdbid": "tt0098833"}], "movie": [{"artifactid": "00b298bf-9998-4c90-8c00-55a70a13f881", "title": "The Death Of Stalin", "majtype": "movie", "imdbid": "tt4686844"}, {"artifactid": "00edc024-9c5d-4b97-a9e5-b79b7ee48f0f", "title": "Strategic Air Command", "majtype": "movie", "imdbid": "tt0048667"}, {"artifactid": "01e0a408-c1f5-481e-be2e-d7b8338bbf25", "title": "upright_citizens_d1-mpg.m4v", "majtype": "movie", "imdbid": "tt0167739"}, {"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "imdbid": "tt0080684"}, {"artifactid": "02719058-c660-4132-a3c1-a7a93b1693e9", "title": "Medicine Man", "majtype": "movie", "imdbid": "tt0104839"}, {"artifactid": "03189fe8-a68f-4631-8eb2-8277c248a987", "title": "Jojo Rabbit", "majtype": "movie", "imdbid": "tt2584384"}, {"artifactid": "034bd2ca-f283-410b-ac31-2aa0d15e0f92", "title": "O Brother, Where Art Thou?", "majtype": "movie", "imdbid": "tt0190590"}, {"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "imdbid": "tt0078163"}, {"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "imdbid": "tt0058083"}, {"artifactid": "04fb8351-651e-4740-9b50-13a9392a7897", "title": "Beerfest", "majtype": "movie", "imdbid": "tt0486551"}, {"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "imdbid": "tt0077745"}, {"artifactid": "051bdfca-0418-4943-802e-6d20875822f9", "title": "The Imitation Game", "majtype": "movie", "imdbid": "tt2084970"}, {"artifactid": "0613a102-b416-4fc9-b381-137692055511", "title": "GrandDayOut.m4v", "majtype": "movie", "imdbid": "tt0104361"}, {"artifactid": "06733bf7-0db1-40ce-8098-0d34e946832a", "title": "Zoolander", "majtype": "movie", "imdbid": "tt0196229"}, {"artifactid": "0690c787-619f-40b6-b9d8-99918241166f", "title": "Network", "majtype": "movie", "imdbid": "tt0074958"}, {"artifactid": "06ae6051-bed9-4bec-ab8c-eb1193851963", "title": "Platoon", "majtype": "movie", "imdbid": "tt0091763"}, {"artifactid": "07273465-c4ef-49a7-b709-7d7137a180bc", "title": "Clerks III", "majtype": "movie", "imdbid": "tt11128440"}, {"artifactid": "0848f99b-272a-4024-8010-c2ecfa423888", "title": "Gia", "majtype": "movie", "imdbid": "tt0123865"}, {"artifactid": "08d55215-1f90-4dd9-b065-c64246ed0fee", "title": "Waterworld", "majtype": "movie", "imdbid": "tt0114898"}, {"artifactid": "090187c5-1182-48f0-9ada-a1595a110e53", "title": "The Onion Movie", "majtype": "movie", "imdbid": "tt0392878"}, {"artifactid": "0935ea10-163b-419b-a911-3b9dfdd557dc", "title": "A Mighty Wind", "majtype": "movie", "imdbid": "tt0310281"}, {"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "imdbid": "tt0056218"}, {"artifactid": "0a715f56-09bc-4bc8-9d87-a7559f885151", "title": "CrudeAwakening.m4v", "majtype": "movie", "imdbid": "tt0776794"}, {"artifactid": "0c9db4eb-dd69-420f-ade8-776d17a641f8", "title": "BillHicksLive_T5.m4v", "majtype": "movie", "imdbid": "none"}, {"artifactid": "0ccfac0f-b474-4828-a8a5-26534bd93cf4", "title": "MysteryMen", "majtype": "movie", "imdbid": "tt0132347"}, {"artifactid": "0d940d56-938a-4eea-bc29-1f7b7a4a684a", "title": "Hackers", "majtype": "movie", "imdbid": "tt0113243"}, {"artifactid": "0e53430e-3795-4d68-b832-9d460f8b8d3a", "title": "JurassicPark4-mpg.m4v", "majtype": "movie", "imdbid": "string"}, {"artifactid": "0ef74b4c-1d25-41de-99b8-ec615e06f425", "title": "The Russians Are Coming, the Russians Are Coming", "majtype": "movie", "imdbid": "tt0060921"}, {"artifactid": "0f2de6e4-ff23-4c1f-b49f-6a47e7234069", "title": "Sleeper", "majtype": "movie", "imdbid": "tt0070707"}, {"artifactid": "0f3ae067-76cd-4a0b-a0f2-0acd60ea2134", "title": "police_squad-mpg.m4v", "majtype": "movie", "imdbid": "tt0083466"}]}, "rewatch": {"tvseries": [{"artifactid": "07b9a75a-b08c-4f20-bf78-b859a16874d1", "title": "Star Trek: The Next Generation", "majtype": "tvseries", "imdbid": "tt0092455"}, {"artifactid": "1038cc43-ac2a-44e3-b4ec-ee885c693d5a", "title": "Barney Miller", "majtype": "tvseries", "imdbid": "tt0072472"}, {"artifactid": "159af384-d810-4a45-8110-c5b0ac713387", "title": "Mythbusters", "majtype": "tvseries", "imdbid": "tt0383126"}, {"artifactid": "1e193909-b7ec-48d0-9b14-f28f88692baf", "title": "All In The Family", "majtype": "tvseries", "imdbid": "tt0066626"}, {"artifactid": "21a05c78-cef4-4d00-9a0c-17870024ea8a", "title": "Nova", "majtype": "tvseries", "imdbid": "tt0206501"}, {"artifactid": "2412bd7c-cdaa-4a74-93d3-bac6b039da15", "title": "Columbo", "majtype": "tvseries", "imdbid": "tt1466074"}, {"artifactid": "2c0d048e-6cc2-418c-9229-cc9a6f77769b", "title": "Taxi", "majtype": "tvseries", "imdbid": "tt0077089"}, {"artifactid": "305d6fa5-b580-49f6-a183-1e3cf88d3b9d", "title": "The Twilight Zone", "majtype": "tvseries", "imdbid": "tt0052520"}, {"artifactid": "3062158b-e3cf-463e-9890-ad300ac963ac", "title": "Star Trek", "majtype": "tvseries", "imdbid": "tt0060028"}, {"artifactid": "38279df9-7995-4178-906d-6dea19c575a0", "title": "Space: 1999", "majtype": "tvseries", "imdbid": "tt0072564"}, {"artifactid": "3d5e4d5f-daa3-4350-ad31-1863a3cec79d", "title": "Stephen Hawking's Universe", "majtype": "tvseries", "imdbid": "tt0124259"}, {"artifactid": "4298bd88-0cc1-42a1-9e4a-1fa2a3993d6a", "title": "Chernobyl", "majtype": "tvseries", "imdbid": "tt7366338"}, {"artifactid": "4e1ae46f-a5f9-489b-b541-fa12ae7b0350", "title": "Cosmos: A Personal Voyage", "majtype": "tvseries", "imdbid": "tt0081846"}, {"artifactid": "4e4e3fa6-5e21-407e-b60a-929725621b2d", "title": "Hogans Heroes", "majtype": "tvseries", "imdbid": "tt0058812"}, {"artifactid": "62852250-d1dc-400c-8586-7809e41a23fa", "title": "QI", "majtype": "tvseries", "imdbid": "tt0380136"}, {"artifactid": "6d31322b-4ea7-4178-bfcd-6e764a2cf197", "title": "Dirty Jobs", "majtype": "tvseries", "imdbid": "tt0458259"}, {"artifactid": "71a084a7-2a32-40a0-8b12-771f385e30ee", "title": "Garth Marenghi's Darkplace", "majtype": "tvseries", "imdbid": "tt0397150"}, {"artifactid": "737fd8de-aca2-42d5-82b2-2b3d771cbd51", "title": "Poirot", "majtype": "tvseries", "imdbid": "tt0094525"}, {"artifactid": "a7baf85b-4c03-4da1-8154-4b32b08d00d9", "title": "The Beatles: Get Back", "majtype": "tvseries", "imdbid": "tt9735318"}, {"artifactid": "c064bf86-1668-4e46-8471-02134fa03660", "title": "The Computer Chronicles", "majtype": "tvseries", "imdbid": "tt0421311"}, {"artifactid": "c8e9a53a-87b6-4d57-bebf-17de614a0838", "title": "The Orville", "majtype": "tvseries", "imdbid": "tt5691552"}, {"artifactid": "cd7ff82e-e783-415a-af87-f4b0e10cd198", "title": "That Mitchell And Webb Look", "majtype": "tvseries", "imdbid": "tt0499410"}, {"artifactid": "d6ce1f59-49b2-4cce-a940-9433b6bff2a0", "title": "Waiting For God", "majtype": "tvseries", "imdbid": "tt0098945"}, {"artifactid": "d79c032d-e68a-458b-a558-e071a0851c77", "title": "Star Trek: Strange New Worlds", "majtype": "tvseries", "imdbid": "tt12327578"}, {"artifactid": "ddcaeca0-cad1-4413-a2f7-e52a6cbe526d", "title": "Cosmos: A Spacetime Odyssey", "majtype": "tvseries", "imdbid": "tt2395695"}, {"artifactid": "fc366455-7e29-49c1-a9d2-a0d3189ac29a", "title": "'Allo 'Allo!", "majtype": "tvseries", "imdbid": "tt0086659"}, {"artifactid": "fd5e0b6d-5d6a-489c-9249-c25c790a1f8c", "title": "The Blacklist", "majtype": "tvseries", "imdbid": "tt2741602"}], "movie": [{"artifactid": "0ddeff78-c3c4-4dc2-8d2f-a60111436be1", "title": "Tron", "majtype": "movie", "imdbid": "tt0084827"}, {"artifactid": "20f02a64-0478-4e43-92cf-b61874a64828", "title": "The Return Of The Pink Panther", "majtype": "movie", "imdbid": "tt0072081"}, {"artifactid": "4c310798-15ff-4a1a-851e-d11e2e7147b1", "title": "In the Shadow of the Moon", "majtype": "movie", "imdbid": "tt0925248"}, {"artifactid": "4d44b9a0-59d7-4f60-bbea-eb15038a97fe", "title": "Start the Revolution Without Me", "majtype": "movie", "imdbid": "tt0066402"}, {"artifactid": "6b1f7bcd-4140-4b6b-9522-f32788bd7848", "title": "Star Wars: Episode IV - A New Hope", "majtype": "movie", "imdbid": "tt0076759"}, {"artifactid": "78342703-3b00-4658-8dcb-d569cabbf962", "title": "Casino Royale 1967", "majtype": "movie", "imdbid": "tt0061452"}, {"artifactid": "7e678e3e-443a-4665-b290-c9bde2e823d4", "title": "Airport", "majtype": "movie", "imdbid": "tt0065377"}, {"artifactid": "c099d22a-a60d-441b-a6ab-16ffb2f817f3", "title": "The Wonder Of It All", "majtype": "movie", "imdbid": "tt0928406"}, {"artifactid": "d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab", "title": "Everything Everywhere All At Once", "majtype": "movie", "imdbid": "tt6710474"}, {"artifactid": "e984940f-628a-4159-b004-e01e89f5971e", "title": "Tora! Tora! Tora!", "majtype": "movie", "imdbid": "tt0066473"}, {"artifactid": "f37d754f-dbf8-45a2-8214-578d505f483d", "title": "The Dirty Dozen", "majtype": "movie", "imdbid": "tt0061578"}, {"artifactid": "fd60c95a-d646-45ec-8cfe-7c15e8cc5dc2", "title": "The Pink Panther Strikes Again", "majtype": "movie", "imdbid": "tt0075066"}]}}};
        var recApiRetObj = {"meta": {"create_date": "2023-05-25 11:39:05"}, "artifacts": {"022622d3-69a7-4b64-b95a-0022522089f0": [{"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "runmins": 124, "season": -1, "episode": -1, "file": "StarWarsEp5-mpg.m4v", "filepath": "scifi", "director": ["Irvin Kershner"], "writer": ["George Lucas", "Lawrence Kasdan", "Leigh Brackett"], "primcast": ["Anthony Daniels", "Billy Dee Williams", "Carrie Fisher", "David Prowse", "Frank Oz", "Harrison Ford", "Kenny Baker", "Mark Hamill", "Peter Mayhew"], "relorg": ["20th Century Fox", "Lucasfilm Ltd."], "relyear": 1980, "eidrid": "string", "imdbid": "tt0080684", "arbmeta": "{\"franchise\": \"Star Wars\",  \"titleorig\": \"Star Wars: Episode V u2013 The Empire Strikes Back\", \"titlelibrary\": \"Star Wars: Episode V u2013 The Empire Strikes Back\"}", "tags": ["fantasy", "science_fiction"], "synopsis": "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader and bounty hunter Boba Fett."}], "03d66d13-0c0f-463a-af0b-edbb78d6b517": [{"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "drama/PerryMason", "director": [], "writer": ["Erle Stanley Gardner"], "primcast": ["Barbara Hale", "Ray Collins", "Raymond Burr", "William Hopper", "William Talman"], "relorg": ["CBS Television", "Paisano Productions"], "relyear": 1957, "eidrid": "string", "imdbid": "tt0050051", "arbmeta": "{\"Title\": \"Perry Mason\", \"Year\": \"1957u20131966\", \"Rated\": \"TV-PG\", \"Released\": \"21 Sep 1957\", \"Runtime\": \"1 min\", \"Genre\": \"Crime, Drama, Mystery\", \"Director\": \"N/A\", \"Writer\": \"Erle Stanley Gardner\", \"Actors\": \"Raymond Burr, Barbara Hale, William Hopper\", \"Plot\": \"The cases of a master criminal defense attorney, handling the most difficult of cases in the aid of the innocent.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 3 Primetime Emmys. 6 wins & 6 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZjEzYmZkYWYtNjM2ZC00OTg0LWI5MWMtYWU0OWE3OTQ0N2M0XkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.3\", \"imdbVotes\": \"9,426\", \"imdbID\": \"tt0050051\", \"Type\": \"series\", \"totalSeasons\": \"9\", \"Response\": \"True\"}", "tags": ["detective", "drama"], "synopsis": "The cases of a master criminal defense attorney, handling the most difficult of cases in the aid of the innocent."}], "03e80511-7d56-4aa0-9fa0-006d9d4fab18": [{"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "runmins": 98, "season": -1, "episode": -1, "file": "RevengeOfThePinkPanther-mpg.m4v", "filepath": "comedy", "director": ["Blake Edwards"], "writer": ["Blake Edwards", "Frank Waldman", "Ron Clark"], "primcast": ["Dyan Cannon", "Herbert Lom", "Peter Sellers", "Robert Webber"], "relorg": ["Jewel Productions", "Pimlico Films", "Sellers-Edwards Productions", "United Artists", "United Artists Corporation"], "relyear": 1978, "eidrid": "string", "imdbid": "tt0078163", "arbmeta": "{\"franchise\": \"Pink Panther\", \"titleorig\": \"RevengeOfThePinkPanther-mpg.m4v\", \"titlelibrary\": \"RevengeOfThePinkPanther-mpg.m4v\"}", "tags": ["comedy"]}], "04cd098c-16b4-41bd-a1a8-40b31e4d2be8": [{"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "runmins": 112, "season": -1, "episode": -1, "file": "FailSafe-mpg.m4v", "filepath": "drama", "director": ["Sidney Lumet"], "writer": ["Eugene Burdick", "Harvey Wheeler", "Walter Bernstein"], "primcast": ["Dan O'Herlihy", "Frank Overton", "Henry Fonda", "Larry Hagman", "Walter Matthau"], "relorg": ["Columbia Pictures", "string"], "relyear": 1964, "eidrid": "string", "imdbid": "tt0058083", "arbmeta": "{\"Title\": \"Fail Safe\", \"Year\": \"1964\", \"Rated\": \"Approved\", \"Released\": \"07 Oct 1964\", \"Runtime\": \"2 min\", \"Genre\": \"Drama, Thriller\", \"Director\": \"Sidney Lumet\", \"Writer\": \"Walter Bernstein, Eugene Burdick, Harvey Wheeler\", \"Actors\": \"Henry Fonda, Walter Matthau, Fritz Weaver\", \"Plot\": \"A technical malfunction sends American planes to Moscow to deliver a nuclear attack. Can all-out war be averted?\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 1 BAFTA Award3 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNjcyZjA1NzktYmNmYy00M2UwLWFmNTktNzRmNjNiZWUyZGI1XkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"93%\"}, {\"Source\": \"Metacritic\", \"Value\": \"75/100\"}], \"Metascore\": \"75\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"22,310\", \"imdbID\": \"tt0058083\", \"Type\": \"movie\", \"DVD\": \"31 Oct 2000\", \"BoxOffice\": \"$3,924,000\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["cold_war", "drama"], "synopsis": "A technical malfunction sends American planes to Moscow to deliver a nuclear attack. Can all-out war be averted?"}], "0504fffb-b0f7-4c81-b77a-8b99ee77f086": [{"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "runmins": 115, "season": -1, "episode": -1, "file": "InvasionBodySnatchers.m4v", "filepath": "scifi", "director": ["Philip Kaufman"], "writer": ["W. D. Richter"], "primcast": ["Brooke Adams", "Donald Sutherland", "Jeff Goldblum", "Leonard Nimoy", "Veronica Cartwright"], "relorg": ["United Artists"], "relyear": 1978, "eidrid": "string", "imdbid": "tt0077745", "arbmeta": "{\"Title\": \"Invasion of the Body Snatchers\", \"Year\": \"1978\", \"Rated\": \"PG\", \"Released\": \"22 Dec 1978\", \"Runtime\": \"2 min\", \"Genre\": \"Horror, Sci-Fi\", \"Director\": \"Philip Kaufman\", \"Writer\": \"W.D. Richter, Jack Finney\", \"Actors\": \"Donald Sutherland, Brooke Adams, Jeff Goldblum\", \"Plot\": \"When strange seeds drift to earth from space, mysterious pods begin to grow and invade San Francisco, replicating the city's residents one body at a time.\", \"Language\": \"English, French\", \"Country\": \"United States\", \"Awards\": \"3 wins & 10 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTkzY2Y3ZTMtYTg4Yy00OTNjLTlkNjctMGVlZDMwZWIxMzA0XkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.4/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"92%\"}, {\"Source\": \"Metacritic\", \"Value\": \"75/100\"}], \"Metascore\": \"75\", \"imdbRating\": \"7.4\", \"imdbVotes\": \"60,503\", \"imdbID\": \"tt0077745\", \"Type\": \"movie\", \"DVD\": \"05 Sep 2006\", \"BoxOffice\": \"$24,946,533\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["science_fiction"]}], "07b9a75a-b08c-4f20-bf78-b859a16874d1": [{"artifactid": "07b9a75a-b08c-4f20-bf78-b859a16874d1", "title": "Star Trek: The Next Generation", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "scifi/StarTrek/TNG", "director": [], "writer": ["Gene Roddenberry"], "primcast": ["Brent Spiner", "Denise Crosby", "Gates McFadden", "Jonathan Frakes", "LeVar Burton", "Marina Sirtis", "Michael Dorn", "Patrick Stewart", "Wil Wheaton"], "relorg": ["Paramount Domestic Television"], "relyear": 1987, "eidrid": "string", "imdbid": "tt0092455", "arbmeta": "{\"Title\": \"Star Trek: The Next Generation\", \"Year\": \"1987u20131994\", \"Rated\": \"TV-PG\", \"Released\": \"26 Sep 1987\", \"Runtime\": \"44 min\", \"Genre\": \"Action, Adventure, Sci-Fi\", \"Director\": \"N/A\", \"Writer\": \"Gene Roddenberry\", \"Actors\": \"Patrick Stewart, Brent Spiner, Jonathan Frakes\", \"Plot\": \"Set almost 100 years after Captain Kirk's 5-year mission, a new generation of Starfleet officers set off in the U.S.S. Enterprise-D on its own mission to go where no one has gone before.\", \"Language\": \"English, Klingon, French\", \"Country\": \"United States\", \"Awards\": \"Won 18 Primetime Emmys. 36 wins & 61 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOWFhYjE4NzMtOWJmZi00NzEyLTg5NTctYmIxMTU1ZDIxMDAyXkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.6/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.6\", \"imdbVotes\": \"119,104\", \"imdbID\": \"tt0092455\", \"Type\": \"series\", \"totalSeasons\": \"7\", \"Response\": \"True\", \"titleorig\": \"Star Trek: The Next Generation\", \"titlelibrary\": \"Star Trek: The Next Generation\",\"franchise\":\"Star Trek\"}", "tags": ["adventure", "science_fiction"], "synopsis": "Set almost 100 years after Captain Kirk's 5-year mission, a new generation of Starfleet officers set off in the U.S.S. Enterprise-D on its own mission to go where no one has gone before."}], "099d0df4-b254-4be6-9809-aba84dfa6b32": [{"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "runmins": 126, "season": -1, "episode": -1, "file": "TheManchurianCandidate_1964.m4v", "filepath": "drama", "director": ["John Frankenheimer"], "writer": ["George Axelrod", "John Frankenheimer", "Richard Condon"], "primcast": ["Frank Sinatra", "Janet Leigh", "Laurence Harvey"], "relorg": ["string"], "relyear": 1962, "eidrid": "string", "imdbid": "tt0056218", "arbmeta": "{\"Title\": \"The Manchurian Candidate\", \"Year\": \"1962\", \"Rated\": \"PG-13\", \"Released\": \"24 Oct 1962\", \"Runtime\": \"126 min\", \"Genre\": \"Drama, Thriller\", \"Director\": \"John Frankenheimer\", \"Writer\": \"Richard Condon, George Axelrod, John Frankenheimer\", \"Actors\": \"Frank Sinatra, Laurence Harvey, Janet Leigh\", \"Plot\": \"An American POW in the Korean War is brainwashed as an unwitting assassin for an international Communist conspiracy.\", \"Language\": \"English, Spanish\", \"Country\": \"United States\", \"Awards\": \"Nominated for 2 Oscars. 5 wins & 8 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOTY0ZTA1ZjUtN2MyNi00ZGRmLWExYmMtOTkyNzI1NGQ2Y2RlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.9/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"97%\"}, {\"Source\": \"Metacritic\", \"Value\": \"94/100\"}], \"Metascore\": \"94\", \"imdbRating\": \"7.9\", \"imdbVotes\": \"75,533\", \"imdbID\": \"tt0056218\", \"Type\": \"movie\", \"DVD\": \"25 Jan 2001\", \"BoxOffice\": \"$2,757,256\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["cold_war", "drama", "korean_war"], "synopsis": "An American POW in the Korean War is brainwashed as an unwitting assassin for an international Communist conspiracy."}], "0f2de6e4-ff23-4c1f-b49f-6a47e7234069": [{"artifactid": "0f2de6e4-ff23-4c1f-b49f-6a47e7234069", "title": "Sleeper", "majtype": "movie", "runmins": 89, "season": -1, "episode": -1, "file": "Sleeper-mpg.m4v", "filepath": "comedy", "director": ["Woody Allen"], "writer": ["Marshall Brickman", "Woody Allen"], "primcast": ["Bartlett Robinson", "Diane Keaton", "Don Keefer", "Douglas Rain", "John Beck", "Mary Gregory", "Woody Allen"], "relorg": ["United Artists"], "relyear": 1973, "eidrid": "string", "imdbid": "tt0070707", "arbmeta": "{\"Title\": \"Sleeper\", \"Year\": \"1973\", \"Rated\": \"PG\", \"Released\": \"17 Dec 1973\", \"Runtime\": \"2 min\", \"Genre\": \"Comedy, Sci-Fi\", \"Director\": \"Woody Allen\", \"Writer\": \"Woody Allen, Marshall Brickman\", \"Actors\": \"Woody Allen, Diane Keaton, John Beck\", \"Plot\": \"A nerdish store owner is revived out of cryostasis into a future world to fight an oppressive government.\", \"Language\": \"English, Yiddish\", \"Country\": \"United States\", \"Awards\": \"2 wins & 2 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMGM3ZjM4ZTAtODBiNC00ZjcxLWJhYjctYzdlYTZjMzY4ZjE1XkEyXkFqcGdeQXVyMTUzMDUzNTI3._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.1/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"100%\"}, {\"Source\": \"Metacritic\", \"Value\": \"77/100\"}], \"Metascore\": \"77\", \"imdbRating\": \"7.1\", \"imdbVotes\": \"43,107\", \"imdbID\": \"tt0070707\", \"Type\": \"movie\", \"DVD\": \"05 Jul 2000\", \"BoxOffice\": \"$18,344,729\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy", "science_fiction"], "synopsis": "A nerdish store owner is revived out of cryostasis into a future world to fight an oppressive government."}], "1038cc43-ac2a-44e3-b4ec-ee885c693d5a": [{"artifactid": "1038cc43-ac2a-44e3-b4ec-ee885c693d5a", "title": "Barney Miller", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/BarneyMiller", "director": [], "writer": [], "primcast": ["Abe Vigoda", "Barbara Barrie", "Gregory Sierra", "Hal Linden", "Jack Soo", "James Gregory", "Max Gail", "Ron Carey", "Ron Glass", "Steve Landesberg"], "relorg": ["Columbia Pictures Television", "Four D Productions"], "relyear": 1974, "eidrid": "string", "imdbid": "tt0072472", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "The Captain of the NYPD 12th Precinct and his staff handle the various local troubles and characters that come into the squad room."}], "117de369-33dd-4295-bfa5-a939c6ff50d7": [{"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/BitOfFryAndLaurie", "director": [], "writer": ["Hugh Laurie", "Stephen Fry"], "primcast": ["Deborah Norton", "Hugh Laurie", "Stephen Fry"], "relorg": ["BBC"], "relyear": 1987, "eidrid": "string", "imdbid": "tt0101049", "arbmeta": "{\"Title\": \"A Bit of Fry and Laurie\", \"Year\": \"1987u20131995\", \"Rated\": \"TV-PG\", \"Released\": \"26 Dec 1987\", \"Runtime\": \"30 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Stephen Fry, Hugh Laurie, Deborah Norton\", \"Plot\": \"Comedy sketches written and performed by renowned duo Stephen Fry and Hugh Laurie.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZDA5M2FlMzktYzZmZC00ZDM3LTg4YWMtM2RmZDY4NGE5ZTM5XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.3\", \"imdbVotes\": \"9,525\", \"imdbID\": \"tt0101049\", \"Type\": \"series\", \"totalSeasons\": \"4\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "Comedy sketches written and performed by renowned duo Stephen Fry and Hugh Laurie."}], "12576b2d-38bb-49d4-9aa2-a91bd67db5dc": [{"artifactid": "12576b2d-38bb-49d4-9aa2-a91bd67db5dc", "title": "The Simpsons Movie", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "simpsons_movie-mpg.m4v", "filepath": "comedy", "director": ["David Silverman", "string"], "writer": ["Al Jean", "James L. Brooks", "Matt Groening", "string"], "primcast": ["Dan Castellaneta", "Julie Kavner", "Nancy Cartwright", "string"], "relorg": ["string"], "relyear": 2007, "eidrid": "string", "imdbid": "tt0462538", "arbmeta": "{\"Title\": \"The Simpsons Movie\", \"Year\": \"2007\", \"Rated\": \"PG-13\", \"Released\": \"27 Jul 2007\", \"Runtime\": \"87 min\", \"Genre\": \"Animation, Adventure, Comedy\", \"Director\": \"David Silverman\", \"Writer\": \"James L. Brooks, Matt Groening, Al Jean\", \"Actors\": \"Dan Castellaneta, Julie Kavner, Nancy Cartwright\", \"Plot\": \"After Homer pollutes the town's water supply, Springfield is encased in a gigantic dome by the EPA and the Simpsons are declared fugitives.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 1 BAFTA Award5 wins & 34 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTgxMDczMTA5N15BMl5BanBnXkFtZTcwMzk1MzMzMw@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.3/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"87%\"}, {\"Source\": \"Metacritic\", \"Value\": \"80/100\"}], \"Metascore\": \"80\", \"imdbRating\": \"7.3\", \"imdbVotes\": \"329,405\", \"imdbID\": \"tt0462538\", \"Type\": \"movie\", \"DVD\": \"18 Dec 2007\", \"BoxOffice\": \"$183,135,014\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["animation", "comedy"], "synopsis": "After Homer pollutes the town's water supply, Springfield is encased in a gigantic dome by the EPA and the Simpsons are declared fugitives."}], "128070c1-c4f6-47bb-b7ab-6b94e30b3f41": [{"artifactid": "128070c1-c4f6-47bb-b7ab-6b94e30b3f41", "title": "Star Trek II: The Wrath of Khan", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "star_trek2_twok-mpg.m4v", "filepath": "scifi", "director": ["Nicholas Meyer"], "writer": ["Gene Roddenberry", "Harve Bennett", "Jack B. Sowards"], "primcast": ["Bibi Besch", "DeForest Kelley", "George Takei", "James Doohan", "Kirstie Alley", "Leonard Nimoy", "Merritt Butrick", "Nichelle Nichols", "Paul Winfield", "Ricardo Montalban", "Walter Koenig", "William Shatner"], "relorg": ["Paramount Pictures"], "relyear": 1982, "eidrid": "string", "imdbid": "tt0084726", "arbmeta": "{\"Title\": \"Star Trek II: The Wrath of Khan\", \"Year\": \"1982\", \"Rated\": \"PG\", \"Released\": \"04 Jun 1982\", \"Runtime\": \"113 min\", \"Genre\": \"Action, Adventure, Sci-Fi\", \"Director\": \"Nicholas Meyer\", \"Writer\": \"Gene Roddenberry, Harve Bennett, Jack B. Sowards\", \"Actors\": \"William Shatner, Leonard Nimoy, DeForest Kelley\", \"Plot\": \"With the assistance of the Enterprise crew, Admiral Kirk must stop an old nemesis, Khan Noonien Singh, from using the life-generating Genesis Device as the ultimate weapon.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"3 wins & 9 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNmZiZmM2OTUtZDlmOC00YzYyLThkMGEtZWFkMjJmM2EwZDVkXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.7/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"86%\"}, {\"Source\": \"Metacritic\", \"Value\": \"68/100\"}], \"Metascore\": \"68\", \"imdbRating\": \"7.7\", \"imdbVotes\": \"121,692\", \"imdbID\": \"tt0084726\", \"Type\": \"movie\", \"DVD\": \"06 Aug 2002\", \"BoxOffice\": \"$79,707,906\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\", \"titleorig\": \"Star Trek II: The Wrath of Khan\", \"titlelibrary\": \"Star Trek II: The Wrath of Khan\",\"franchise\":\"Star Trek\"}", "tags": ["science_fiction"], "synopsis": "With the assistance of the Enterprise crew, Admiral Kirk must stop an old nemesis, Khan Noonien Singh, from using the life-generating Genesis Device as the ultimate weapon."}], "13985629-fb3c-4a32-8e0b-3ed8ae6e90f5": [{"artifactid": "13985629-fb3c-4a32-8e0b-3ed8ae6e90f5", "title": "Crimson Tide", "majtype": "movie", "runmins": 116, "season": -1, "episode": -1, "file": "CrimsonTide.m4v", "filepath": "action", "director": ["Tony Scott"], "writer": ["Michael Schiffer", "Richard P. Henrick"], "primcast": ["Daniel von Bargen", "Danny Nucci", "Denzel Washington", "Eric Bruskotter", "Gene Hackman", "George Dzundza", "Jaime P. Gomez", "James Gandolfini", "Jason Robards", "Jim Reid Boyce", "Lillo Brancato, Jr.", "Mark Christopher Lawrence", "Matt Craven", "Michael Milhoan", "Rick Schroder", "Rocky Carroll", "Ryan Phillippe", "Scott Burkholder", "Steve Zahn", "Viggo Mortensen"], "relorg": ["Buena Vista Pictures Distribution", "Don Simpson/Jerry Bruckheimer Films", "Hollywood Pictures"], "relyear": 1995, "eidrid": "string", "imdbid": "tt0112740", "arbmeta": "{\"Title\": \"Crimson Tide\", \"Year\": \"1995\", \"Rated\": \"R\", \"Released\": \"12 May 1995\", \"Runtime\": \"116 min\", \"Genre\": \"Action, Drama, Thriller\", \"Director\": \"Tony Scott\", \"Writer\": \"Michael Schiffer, Richard P. Henrick\", \"Actors\": \"Gene Hackman, Denzel Washington, Matt Craven\", \"Plot\": \"On a U.S. nuclear missile sub, a young First Officer stages a mutiny to prevent his trigger happy Captain from launching his missiles before confirming his orders to do so.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 3 Oscars. 5 wins & 9 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMmFkY2IxNTAtMWRiNS00MWU2LWI1NDYtY2YxYTQyYTk5OTBhXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.3/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"89%\"}, {\"Source\": \"Metacritic\", \"Value\": \"66/100\"}], \"Metascore\": \"66\", \"imdbRating\": \"7.3\", \"imdbVotes\": \"112,882\", \"imdbID\": \"tt0112740\", \"Type\": \"movie\", \"DVD\": \"16 May 2006\", \"BoxOffice\": \"$91,387,195\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["action", "drama"], "synopsis": "On a U.S. nuclear missile sub, a young First Officer stages a mutiny to prevent his trigger happy Captain from launching his missiles before confirming his orders to do so."}], "1593680d-4aa8-4860-bddb-9efdf7054e86": [{"artifactid": "1593680d-4aa8-4860-bddb-9efdf7054e86", "title": "Twister", "majtype": "movie", "runmins": 113, "season": -1, "episode": -1, "file": "twister-mpg.m4v", "filepath": "drama", "director": ["Jan de Bont"], "writer": ["Anne-Marie Martin", "Michael Crichton"], "primcast": ["Bill Paxton", "Cary Elwes", "Helen Hunt"], "relorg": ["string"], "relyear": 1996, "eidrid": "string", "imdbid": "tt0117998", "arbmeta": "{\"Title\": \"Twister\", \"Year\": \"1996\", \"Rated\": \"PG-13\", \"Released\": \"10 May 1996\", \"Runtime\": \"113 min\", \"Genre\": \"Action, Adventure, Thriller\", \"Director\": \"Jan de Bont\", \"Writer\": \"Michael Crichton, Anne-Marie Martin\", \"Actors\": \"Helen Hunt, Bill Paxton, Cary Elwes\", \"Plot\": \"Bill and Jo Harding, advanced storm chasers on the brink of divorce, must join together to create an advanced weather alert system by putting themselves in the cross-hairs of extremely violent tornadoes.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 2 Oscars. 11 wins & 17 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BODExYTM0MzEtZGY2Yy00N2ExLTkwZjItNGYzYTRmMWZlOGEzXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.4/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"63%\"}, {\"Source\": \"Metacritic\", \"Value\": \"68/100\"}], \"Metascore\": \"68\", \"imdbRating\": \"6.4\", \"imdbVotes\": \"196,150\", \"imdbID\": \"tt0117998\", \"Type\": \"movie\", \"DVD\": \"24 Nov 1998\", \"BoxOffice\": \"$241,830,615\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["action", "drama"], "synopsis": "Bill and Jo Harding, advanced storm chasers on the brink of divorce, must join together to create an advanced weather alert system by putting themselves in the cross-hairs of extremely violent tornadoes."}], "16c0510e-78fa-46e9-8ae8-ad8957627f4f": [{"artifactid": "16c0510e-78fa-46e9-8ae8-ad8957627f4f", "title": "Airport 1975", "majtype": "movie", "runmins": 107, "season": -1, "episode": -1, "file": "airport75-mpg.m4v", "filepath": "drama/disaster", "director": ["Jack Smight"], "writer": ["Arthur Hailey", "Don Ingalls"], "primcast": ["Augusta Summerland", "Charlton Heston", "Dana Andrews", "Ed Nelson", "Efrem Zimbalist Jr.", "George Kennedy", "Gloria Swanson", "Helen Reddy", "Karen Black", "Linda Blair", "Myrna Loy", "Nancy Olson", "Roy Thinnes", "Sid Caesar", "Susan Clark"], "relorg": ["Universal Pictures"], "relyear": 1974, "eidrid": "string", "imdbid": "tt0071110", "arbmeta": "{\"franchise\": \"Airport\", \"titleorig\": \"Airport 1975\", \"titlelibrary\": \"Airport 1975\"}", "tags": ["disaster", "drama"], "synopsis": "A 747 in flight collides with a small plane, and is rendered pilotless. Somehow the control tower must get a pilot aboard so the jet can land."}], "1a2d3dbc-20fa-4ba7-a2b6-3e788302f807": [{"artifactid": "1a2d3dbc-20fa-4ba7-a2b6-3e788302f807", "title": "Three Days of the Condor", "majtype": "movie", "runmins": 117, "season": -1, "episode": -1, "file": "3_days_Condor-mpg.m4v", "filepath": "drama", "director": ["Sydney Pollack"], "writer": ["David Rayfiel", "James Grady", "Lorenzo Semple Jr."], "primcast": ["Addison Powell", "Carlin Glynn", "Cliff Robertson", "Dino Narizzano", "Don McHenry", "Faye Dunaway", "Hank Garrett", "Hansford Rowe", "Helen Stenborg", "James Keane", "Jess Osuna", "John Houseman", "Max von Sydow", "Michael Kane", "Michael Miller", "Patrick Gorman", "Robert Redford", "Sal Schillizzi", "Sydney Pollack", "Tina Chen", "Walter McGinn"], "relorg": ["Paramount Pictures"], "relyear": 1975, "eidrid": "string", "imdbid": "tt0073802", "arbmeta": "{\"Title\": \"Three Days of the Condor\", \"Year\": \"1975\", \"Rated\": \"R\", \"Released\": \"25 Sep 1975\", \"Runtime\": \"117 min\", \"Genre\": \"Crime, Mystery, Thriller\", \"Director\": \"Sydney Pollack\", \"Writer\": \"James Grady, Lorenzo Semple Jr., David Rayfiel\", \"Actors\": \"Robert Redford, Faye Dunaway, Cliff Robertson\", \"Plot\": \"A bookish CIA researcher in Manhattan finds all his co-workers dead, and must outwit those responsible until he figures out who he can really trust.\", \"Language\": \"English, French\", \"Country\": \"United States\", \"Awards\": \"Nominated for 1 Oscar. 6 wins & 4 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMjQ1MmI4ODYtMTQwYi00OWM3LWFkOTQtZGJmMjViNTI4MDBiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.4/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"88%\"}, {\"Source\": \"Metacritic\", \"Value\": \"63/100\"}], \"Metascore\": \"63\", \"imdbRating\": \"7.4\", \"imdbVotes\": \"56,212\", \"imdbID\": \"tt0073802\", \"Type\": \"movie\", \"DVD\": \"19 May 2009\", \"BoxOffice\": \"$27,476,252\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["cold_war", "drama", "intrigue"], "synopsis": "A bookish CIA researcher in Manhattan finds all his co-workers dead, and must outwit those responsible until he figures out who he can really trust."}], "1e193909-b7ec-48d0-9b14-f28f88692baf": [{"artifactid": "1e193909-b7ec-48d0-9b14-f28f88692baf", "title": "All In The Family", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/AllInTheFamily", "director": [], "writer": ["Norman Lear"], "primcast": ["Carroll O'Connor", "Danielle Brisebois", "Jean Stapleton", "Rob Reiner", "Sally Struthers"], "relorg": [], "relyear": 1971, "eidrid": "string", "imdbid": "tt0066626", "arbmeta": "{\"Title\": \"All in the Family\", \"Year\": \"1971u20131979\", \"Rated\": \"TV-PG\", \"Released\": \"12 Jan 1971\", \"Runtime\": \"2 min\", \"Genre\": \"Comedy, Drama\", \"Director\": \"N/A\", \"Writer\": \"Norman Lear\", \"Actors\": \"Carroll O'Connor, Jean Stapleton, Rob Reiner\", \"Plot\": \"A working class man constantly squabbles with his family over the important issues of the day.\", \"Language\": \"English\", \"Country\": \"USA\", \"Awards\": \"Won 22 Primetime Emmys. 42 wins & 73 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMjEyOTExMDA5OF5BMl5BanBnXkFtZTcwNjM2NjQ3Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.4/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.4\", \"imdbVotes\": \"16,729\", \"imdbID\": \"tt0066626\", \"Type\": \"series\", \"totalSeasons\": \"9\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "A working class man constantly squabbles with his family over the important issues of the day."}], "1e8dfd91-564d-46db-93c1-8718b52141da": [{"artifactid": "1e8dfd91-564d-46db-93c1-8718b52141da", "title": "Earthquake", "majtype": "movie", "runmins": 123, "season": -1, "episode": -1, "file": "earthquake-mpg.m4v", "filepath": "drama/disaster", "director": ["Mark Robson"], "writer": ["George Fox", "Mario Puzo"], "primcast": ["Ava Gardner", "Barry Sullivan", "Charlton Heston", "Genevi\u00e8ve Bujold", "George Kennedy", "Lloyd Nolan", "Lorne Greene", "Marjoe Gortner", "Richard Roundtree", "Victoria Principal"], "relorg": ["Universal Pictures"], "relyear": 1974, "eidrid": "string", "imdbid": "tt0071455", "arbmeta": "{\"Title\": \"Earthquake\", \"Year\": \"1974\", \"Rated\": \"PG\", \"Released\": \"15 Nov 1974\", \"Runtime\": \"1 min\", \"Genre\": \"Action, Drama, Thriller\", \"Director\": \"Mark Robson\", \"Writer\": \"George Fox, Mario Puzo\", \"Actors\": \"Charlton Heston, Ava Gardner, George Kennedy\", \"Plot\": \"Various interconnected people struggle to survive when an earthquake of unimaginable magnitude hits Los Angeles, California.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 1 Oscar. 3 wins & 7 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BN2MzYTFiOTUtNTE3Mi00MTlkLWJmMjctZWU3N2Y5OGMwY2JhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"5.9/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"47%\"}, {\"Source\": \"Metacritic\", \"Value\": \"56/100\"}], \"Metascore\": \"56\", \"imdbRating\": \"5.9\", \"imdbVotes\": \"16,294\", \"imdbID\": \"tt0071455\", \"Type\": \"movie\", \"DVD\": \"09 May 2006\", \"BoxOffice\": \"$79,666,653\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["disaster", "drama"], "synopsis": "Various interconnected people struggle to survive when an earthquake of unimaginable magnitude hits Los Angeles, California."}], "1f4bd566-641d-4667-ab6a-fc1419090394": [{"artifactid": "1f4bd566-641d-4667-ab6a-fc1419090394", "title": "Duel", "majtype": "movie", "runmins": 90, "season": -1, "episode": -1, "file": "Duel.m4v", "filepath": "horror", "director": ["Steven Spielberg"], "writer": ["Richard Matheson"], "primcast": ["Dennis Weaver", "Eddie Firestone", "Jacqueline Scott"], "relorg": ["Universal Television"], "relyear": 1971, "eidrid": "string", "imdbid": "tt0067023", "arbmeta": "{\"Title\": \"Duel\", \"Year\": \"1971\", \"Rated\": \"PG\", \"Released\": \"13 Nov 1971\", \"Runtime\": \"90 min\", \"Genre\": \"Action, Thriller\", \"Director\": \"Steven Spielberg\", \"Writer\": \"Richard Matheson\", \"Actors\": \"Dennis Weaver, Jacqueline Scott, Eddie Firestone\", \"Plot\": \"A business commuter is pursued and terrorized by the malevolent driver of a massive tractor-trailer.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 1 Primetime Emmy. 3 wins & 5 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNzRkNjE4NjQtZTQ2NC00YTg1LThiZTMtNmRhYmQzODBlMDc2XkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.6/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"88%\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.6\", \"imdbVotes\": \"70,639\", \"imdbID\": \"tt0067023\", \"Type\": \"movie\", \"DVD\": \"17 Jul 2001\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["horror"]}], "2412bd7c-cdaa-4a74-93d3-bac6b039da15": [{"artifactid": "2412bd7c-cdaa-4a74-93d3-bac6b039da15", "title": "Columbo", "majtype": "tvseries", "runmins": 90, "season": -1, "episode": -1, "file": "", "filepath": "drama/Columbo", "director": [], "writer": ["Richard Levinson", "William Link"], "primcast": ["John Finnegan", "Mike Lally", "Peter Falk"], "relorg": [], "relyear": 1971, "eidrid": "string", "imdbid": "tt1466074", "arbmeta": "{\"Title\": \"Columbo\", \"Year\": \"1971u20132003\", \"Rated\": \"TV-PG\", \"Released\": \"01 Mar 1971\", \"Runtime\": \"50S min\", \"Genre\": \"Crime, Drama, Mystery\", \"Director\": \"N/A\", \"Writer\": \"Richard Levinson, William Link\", \"Actors\": \"Peter Falk, Mike Lally, John Finnegan\", \"Plot\": \"Los Angeles homicide detective Lieutenant Columbo uses his humble ways and ingenuous demeanor to winkle out even the most well-concealed of crimes.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 13 Primetime Emmys. 22 wins & 49 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BODBlYjcwNWMtZDM0OS00YzZjLTllOWYtYjg2MDM0NjQ5NjRmXkEyXkFqcGdeQXVyMjExMjk0ODk@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.3\", \"imdbVotes\": \"35,001\", \"imdbID\": \"tt1466074\", \"Type\": \"series\", \"totalSeasons\": \"13\", \"Response\": \"True\"}", "tags": ["detective", "drama"], "synopsis": "Los Angeles homicide detective Lieutenant Columbo uses his humble ways and ingenuous demeanor to winkle out even the most well-concealed of crimes."}], "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba": [{"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/FallAndRiseOfReginaldPerrin", "director": [], "writer": [], "primcast": ["John Barron", "Leonard Rossiter", "Pauline Yates"], "relorg": [], "relyear": 1976, "eidrid": "string", "imdbid": "tt0073990", "arbmeta": "{\"Title\": \"The Fall and Rise of Reginald Perrin\", \"Year\": \"1976u20131979\", \"Rated\": \"N/A\", \"Released\": \"08 Sep 1976\", \"Runtime\": \"1 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Leonard Rossiter, Pauline Yates, John Barron\", \"Plot\": \"Disillusioned after a long career at Sunshine Desserts, Perrin goes through a mid-life crisis and fakes his own death. Returning in disguise after various attempts at finding a 'new life', he gets his old job back and finds nothin...\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Nominated for 7 BAFTA 7 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNDdlMTJhOWUtOTY4Ny00MWQ1LTkwYjQtMWJmNWNmMGY4ODk3XkEyXkFqcGdeQXVyNjc4NTExMTk@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"1,972\", \"imdbID\": \"tt0073990\", \"Type\": \"series\", \"totalSeasons\": \"3\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "Disillusioned after a long career at Sunshine Desserts, Perrin goes through a mid-life crisis and fakes his own death. Returning in disguise after various attempts at finding a 'new life', he gets his old job back and finds nothing has changed. He is eventually found out, and in the second series has success with a chain of shops selling useless junk. That becomes so successful that he feels he has created a monster and decides to destroy it. In the third and final series he has a dream of forming a commune which his long suffering colleagues help bring to reality. Unfortunately that also fails and he finds himself back in a job not unlike the one he originally had at Sunshine Desserts."}], "2c0d048e-6cc2-418c-9229-cc9a6f77769b": [{"artifactid": "2c0d048e-6cc2-418c-9229-cc9a6f77769b", "title": "Taxi", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/Taxi", "director": [], "writer": ["David Davis", "James L. Brooks", "Stan Daniels"], "primcast": ["Andy Kaufman", "Carol Kane", "Christopher Lloyd", "Danny DeVito", "Jeff Conaway", "Judd Hirsch", "Marilu Henner", "Randall Carver", "Tony Danza"], "relorg": ["Paramount Domestic Television"], "relyear": 1978, "eidrid": "string", "imdbid": "tt0077089", "arbmeta": "{\"Title\": \"Taxi\", \"Year\": \"1978u20131983\", \"Rated\": \"TV-PG\", \"Released\": \"12 Sep 1978\", \"Runtime\": \"2 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"James L. Brooks, Stan Daniels, David Davis\", \"Actors\": \"Judd Hirsch, Jeff Conaway, Danny DeVito\", \"Plot\": \"The staff of a New York City taxicab company go about their job while they dream of greater things.\", \"Language\": \"English\", \"Country\": \"USA\", \"Awards\": \"Won 18 Primetime Emmys. 27 wins & 55 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTM5Nzg2NTA2OV5BMl5BanBnXkFtZTcwMjk5MzYyMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.7/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.7\", \"imdbVotes\": \"13,783\", \"imdbID\": \"tt0077089\", \"Type\": \"series\", \"totalSeasons\": \"4\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "The staff of a New York City taxicab company go about their job while they dream of greater things."}], "2ed24c32-8365-404a-96ec-711ee2d2cdf6": [{"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/PeepShow", "director": [], "writer": ["Andrew O'Connor", "Jesse Armstrong", "Sam Bain"], "primcast": ["David Mitchell", "Matt King", "Robert Webb"], "relorg": ["Objective Productions"], "relyear": 2003, "eidrid": "string", "imdbid": "tt0387764", "arbmeta": "{\"Title\": \"Peep Show\", \"Year\": \"2003u20132015\", \"Rated\": \"TV-MA\", \"Released\": \"12 Nov 2004\", \"Runtime\": \"41S min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"Jesse Armstrong, Sam Bain, Andrew O'Connor\", \"Actors\": \"David Mitchell, Robert Webb, Matt King\", \"Plot\": \"Mark and Jez are a couple of twenty-something roommates who have nothing in common - except for the fact that their lives are anything but normal. Mayhem ensues as the pair strive to cope with day-to-day life.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Won 2 BAFTA 9 wins & 37 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZjYwMWJhOWMtZTc5ZC00MGY0LTg0ZjktMzFhODhhZGZhNDRjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.7/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.7\", \"imdbVotes\": \"59,913\", \"imdbID\": \"tt0387764\", \"Type\": \"series\", \"totalSeasons\": \"9\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "Mark and Jez are a couple of twenty-something roommates who have nothing in common - except for the fact that their lives are anything but normal. Mayhem ensues as the pair strive to cope with day-to-day life."}], "305d6fa5-b580-49f6-a183-1e3cf88d3b9d": [{"artifactid": "305d6fa5-b580-49f6-a183-1e3cf88d3b9d", "title": "The Twilight Zone", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "drama/TheTwilightZone", "director": [], "writer": ["Rod Serling"], "primcast": [], "relorg": [], "relyear": 1959, "eidrid": "string", "imdbid": "tt0052520", "arbmeta": "{\"string\": \"string\"}", "tags": ["drama", "fantasy", "horror", "new"], "synopsis": "Ordinary people find themselves in extraordinarily astounding situations, which they each try to solve in a remarkable manner."}], "3062158b-e3cf-463e-9890-ad300ac963ac": [{"artifactid": "3062158b-e3cf-463e-9890-ad300ac963ac", "title": "Star Trek", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "scifi/StarTrek/TOS", "director": [], "writer": ["Gene Roddenberry"], "primcast": ["DeForest Kelley", "Leonard Nimoy", "William Shatner"], "relorg": ["Desilu Productions", "Norway Corporation", "Paramount Television"], "relyear": 1966, "eidrid": "string", "imdbid": "tt0060028", "arbmeta": "{\"Title\": \"Star Trek\", \"Year\": \"1966u20131969\", \"Rated\": \"TV-PG\", \"Released\": \"08 Sep 1966\", \"Runtime\": \"50 min\", \"Genre\": \"Action, Adventure, Sci-Fi\", \"Director\": \"N/A\", \"Writer\": \"Gene Roddenberry\", \"Actors\": \"William Shatner, Leonard Nimoy, DeForest Kelley\", \"Plot\": \"In the 23rd Century, Captain James T. Kirk and the crew of the U.S.S. Enterprise explore the galaxy and defend the United Federation of Planets.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 1 Primetime Emmy. 11 wins & 31 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNDRkMTNiNjgtZDIyOC00NmE1LTlkZjEtMGZiNTcyZDQ0NjcxXkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.4/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.4\", \"imdbVotes\": \"83,325\", \"imdbID\": \"tt0060028\", \"Type\": \"series\", \"totalSeasons\": \"3\", \"Response\": \"True\", \"titleorig\": \"Star Trek\", \"titlelibrary\": \"Star Trek\",\"franchise\":\"Star Trek\"}", "tags": ["science_fiction"], "synopsis": "In the 23rd Century, Captain James T. Kirk and the crew of the U.S.S. Enterprise explore the galaxy and defend the United Federation of Planets."}], "38279df9-7995-4178-906d-6dea19c575a0": [{"artifactid": "38279df9-7995-4178-906d-6dea19c575a0", "title": "Space: 1999", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "scifi/Space1999", "director": [], "writer": [], "primcast": ["Alibe Parsons", "Anton Phillips", "Barbara Bain", "Barry Morse", "Catherine Schell", "Clifton Jones", "Jeffery Kissoon", "John Hug", "Martin Landau", "Nick Tate", "Prentis Hancock", "Sam Dastor", "Suzanne Roquette", "Tony Anholt", "Yasuko Nagazumi", "Zienia Merton"], "relorg": [], "relyear": 1975, "eidrid": "string", "imdbid": "tt0072564", "arbmeta": "{\"Title\": \"Space: 1999\", \"Year\": \"1975u20131977\", \"Rated\": \"TV-14\", \"Released\": \"05 Sep 1975\", \"Runtime\": \"50 min\", \"Genre\": \"Adventure, Drama, Sci-Fi\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Martin Landau, Barbara Bain, Nick Tate\", \"Plot\": \"The crew of Moonbase Alpha must struggle to survive when a massive explosion throws the Moon from orbit into deep space.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"1 nomination\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYjE5ZGViOTAtYWEyNy00ZjFkLTgyYTktN2YxNTg1M2I1MzQ0XkEyXkFqcGdeQXVyNDA3MDAwOQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.3\", \"imdbVotes\": \"8,429\", \"imdbID\": \"tt0072564\", \"Type\": \"series\", \"totalSeasons\": \"2\", \"Response\": \"True\"}", "tags": ["british", "science_fiction"], "synopsis": "The crew of Moonbase Alpha must struggle to survive when a massive explosion throws the Moon from orbit into deep space.\n\n [NOTE: For a discussion of episode order, see https://moonbasealpha.fandom.com/wiki/Episode_order .  DVD set was in production order, and filenames reflect that, but metadata gathered from IMDB and Wikipedia is in IMDB's order, and that is the order  presented here.]"}], "3f45db1f-e61f-4da3-87b0-baaf5f208cd6": [{"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/Frasier", "director": [], "writer": [], "primcast": ["Dan Butler", "David Hyde Pierce", "Jane Leeves", "John Mahoney", "Kelsey Grammer", "Peri Gilpin"], "relorg": ["Grammnet Productions", "Grub Street Productions", "Paramount Domestic Television", "Paramount Network Television"], "relyear": 1993, "eidrid": "string", "imdbid": "tt0106004", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "Dr. Frasier Crane moves back to his hometown of Seattle, where he lives with his father, and works as a radio psychiatrist."}], "4298bd88-0cc1-42a1-9e4a-1fa2a3993d6a": [{"artifactid": "4298bd88-0cc1-42a1-9e4a-1fa2a3993d6a", "title": "Chernobyl", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "boats/Chernobyl", "director": [], "writer": ["Craig Mazin"], "primcast": ["Adam Nagaitis", "Adrian Rawlins", "Alan Williams", "Alex Ferns", "Barry Keoghan", "Con O'Neill", "David Dencik", "Emily Watson", "Fares Fares", "Jared Harris", "Jessie Buckley", "Mark Lewis Jones", "Michael McElhatton", "Paul Ritter", "Ralph Ineson", "Robert Emms", "Sam Troughton", "Stellan Skarsg\u00e5rd"], "relorg": ["HBO", "Sister Pictures", "Sky UK", "The Mighty Mint", "Word Games"], "relyear": 2019, "eidrid": "string", "imdbid": "tt7366338", "arbmeta": "{\"Title\": \"Chernobyl\", \"Year\": \"2019\", \"Rated\": \"TV-MA\", \"Released\": \"06 May 2019\", \"Runtime\": \"330 min\", \"Genre\": \"Drama, History, Thriller\", \"Director\": \"N/A\", \"Writer\": \"Craig Mazin\", \"Actors\": \"Jessie Buckley, Jared Harris, Stellan Skarsgu00e5rd\", \"Plot\": \"In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst man-made catastrophes.\", \"Language\": \"English, Russian, Ukrainian\", \"Country\": \"United States, United Kingdom\", \"Awards\": \"Won 10 Primetime Emmys. 85 wins & 59 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZGQ2YmMxZmEtYjI5OS00NzlkLTlkNTEtYWMyMzkyMzc2MDU5XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"9.4/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"9.4\", \"imdbVotes\": \"732,568\", \"imdbID\": \"tt7366338\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["based_on_a_true_story", "cold_war", "disaster"], "synopsis": "In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst man-made catastrophes"}], "4e1ae46f-a5f9-489b-b541-fa12ae7b0350": [{"artifactid": "4e1ae46f-a5f9-489b-b541-fa12ae7b0350", "title": "Cosmos: A Personal Voyage", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/Cosmos_1980", "director": [], "writer": ["Ann Druyan", "Carl Sagan", "Steven Soter"], "primcast": ["Carl Sagan", "Jaromir Hanzlik", "Jonathan Fahn"], "relorg": [], "relyear": 1980, "eidrid": "string", "imdbid": "tt0081846", "arbmeta": "{\"Title\": \"Cosmos\", \"Year\": \"1980\", \"Rated\": \"TV-PG\", \"Released\": \"28 Sep 1980\", \"Runtime\": \"780 min\", \"Genre\": \"Documentary\", \"Director\": \"N/A\", \"Writer\": \"Ann Druyan, Carl Sagan, Steven Soter\", \"Actors\": \"Carl Sagan, Jaromu00edr Hanzlu00edk, Jonathan Fahn\", \"Plot\": \"Astronomer Carl Sagan leads us on an engaging guided tour of the various elements and cosmological theories of the universe.\", \"Language\": \"English\", \"Country\": \"United States, United Kingdom\", \"Awards\": \"Won 3 Primetime Emmys. 4 wins & 3 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BM2YzYzc0OWUtNmIwZi00MTBlLThjYTgtYmU1ODlhMzdjMzdjXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"9.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"9.3\", \"imdbVotes\": \"40,881\", \"imdbID\": \"tt0081846\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["documentary"], "synopsis": "Astronomer Carl Sagan leads us on an engaging guided tour of the various elements and cosmological theories of the universe."}], "4e4e3fa6-5e21-407e-b60a-929725621b2d": [{"artifactid": "4e4e3fa6-5e21-407e-b60a-929725621b2d", "title": "Hogans Heroes", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "HogansHeroes_S0", "filepath": "comedy/HogansHeroes", "director": ["Edward H. Feldman"], "writer": ["Albert S. Ruddy", "Bernard Fein"], "primcast": ["Bob Crane", "Cynthia Lynn", "Howard Caine", "Ivan Dixon", "John Banner", "Kenneth Washington", "Larry Hovis", "Leon Askin", "Richard Dawson", "Roberrt Clary", "Sigrid Valdis", "Werner Klemperer"], "relorg": ["Alfran Productions", "Bing Crosby Productions", "Bob Crane Enterprises", "CBS Enterprises", "CBS Films", "CBS Productions", "Viacom Enterprises"], "relyear": 1965, "eidrid": "string", "imdbid": "tt0058812", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "military", "new", "world_war_2"], "synopsis": "The inmates of a German World War II prisoner of war camp conduct an espionage and sabotage campaign right under the noses of their warders."}], "62852250-d1dc-400c-8586-7809e41a23fa": [{"artifactid": "62852250-d1dc-400c-8586-7809e41a23fa", "title": "QI", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "QI_S", "filepath": "comedy/QI", "director": [], "writer": ["John Lloyd"], "primcast": ["Alan Davies", "Stephen Fry"], "relorg": ["BBC"], "relyear": 2003, "eidrid": "string", "imdbid": "tt0380136", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy"], "synopsis": "A comedy panel game in which being Quite Interesting is more important than being right. Sandi Toksvig is joined each week by four comedians to share anecdotes and trivia, and maybe answer some questions as well."}], "6f4b23e1-83fe-4136-aca4-9210efd0fcf2": [{"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "drama/DuchessOfDukeStreet", "director": [], "writer": [], "primcast": ["Christopher Cazenove", "Gemma Jones", "John Cater", "John Welsh", "Richard Vernon", "Victoria Plucknett"], "relorg": [], "relyear": 1976, "eidrid": "string", "imdbid": "tt0077004", "arbmeta": "{\"string\": \"string\"}", "tags": ["drama", "kitten"], "synopsis": "Louisa is an ordinary girl living in Victorian London. She is looking for a job and ends up talking her way into the kitchen of a Lords townhouse. The Lord has a rather snooty French chef, Louisa quickly develops a strong desire to become a top cook, women back then couldn't be chefs. Through hard work and sheer determination she wins over the chef and he begins to teach her his art. She quickly proves that she has a huge talent in the art of cooking. This brings her to the attention of three very different men, all of which will play huge but very different roles in her future. Partly because of who she knows, but mostly by her own extremely strong will and work ethic she goes on to be very successful, in a time when independent women were something of an oddity."}], "75fa506c-05ab-49a5-be5f-7ef158a820a2": [{"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/ManDown", "director": [], "writer": [], "primcast": ["Deirdre Mullins", "Greg Davies", "Gwyneth Powell", "Isy Suttie", "Jeany Spark", "Mike Wozniak", "Rik Mayall", "Roisin Conaty", "Stephanie Cole", "Tony Robinson"], "relorg": ["Avalon Television", "Channel 4"], "relyear": 2013, "eidrid": "string", "imdbid": "tt3063454", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy"], "synopsis": "A deadbeat drama teacher gets a wake-up call when his girlfriend leaves him."}], "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54": [{"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/GraceAndFrankie", "director": [], "writer": ["Howard J. Morris", "Marta Kauffman"], "primcast": ["Baron Vaughn", "Brooklyn Decker", "Ethan Embry", "Jane Fonda", "June Diane Raphael", "Lily Tomlin", "Martin Sheen", "Sam Waterston"], "relorg": ["Okay Goodnight", "Skydance Television"], "relyear": 2015, "eidrid": "string", "imdbid": "tt3609352", "arbmeta": "{\"Title\": \"Grace and Frankie\", \"Year\": \"2015u20132022\", \"Rated\": \"TV-MA\", \"Released\": \"08 May 2015\", \"Runtime\": \"30 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"Marta Kauffman, Howard J. Morris\", \"Actors\": \"Jane Fonda, Lily Tomlin, Sam Waterston\", \"Plot\": \"Finding out that their husbands are not just work partners, but have also been romantically involved for the last twenty years, two women with an already strained relationship try to cope with the circumstances together.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 13 Primetime Emmys. 3 wins & 60 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BM2NlNjY0MTgtZGZiZS00NjRmLTg2NjYtN2FiYjBjN2VjZGRhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.2/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.2\", \"imdbVotes\": \"51,850\", \"imdbID\": \"tt3609352\", \"Type\": \"series\", \"totalSeasons\": \"7\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "Finding out that their husbands are not just work partners, but have also been romantically involved for the last twenty years, two women with an already strained relationship try to cope with the circumstances together."}], "0935ea10-163b-419b-a911-3b9dfdd557dc": [{"artifactid": "0935ea10-163b-419b-a911-3b9dfdd557dc", "title": "A Mighty Wind", "majtype": "movie", "runmins": 92, "season": -1, "episode": -1, "file": "AMightyWind.m4v", "filepath": "comedy/ChristopherGuest", "director": ["Christopher Guest"], "writer": ["Christopher Guest", "Eugene Levy"], "primcast": ["Bob Balaban", "Catherine O'Hara", "Christopher Guest", "Eugene Levy", "Fred Willard", "Harry Shearer", "Jane Lynch", "John Michael Higgins", "Michael McKean", "Parker Posey"], "relorg": ["Castle Rock Entertainment", "Warner Bros. Pictures"], "relyear": 2003, "eidrid": "string", "imdbid": "tt0310281", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "mocumentary"], "synopsis": "Mockumentary captures the reunion of 1960s folk trio the Folksmen as they prepare for a show at The Town Hall to memorialize a recently deceased concert promoter. "}], "2f91b427-7c8c-4acd-8e40-2a0c5823f149": [{"artifactid": "2f91b427-7c8c-4acd-8e40-2a0c5823f149", "title": "American Experience", "majtype": "tvseries", "runmins": 120, "season": -1, "episode": -1, "file": "", "filepath": "docu/pbs", "director": [], "writer": [], "primcast": [], "relorg": [], "relyear": 1988, "eidrid": "string", "imdbid": "tt0094416", "arbmeta": "{\"Title\": \"American Experience\", \"Year\": \"1987u2013\", \"Rated\": \"TV-PG\", \"Released\": \"04 Oct 1988\", \"Runtime\": \"1 min\", \"Genre\": \"Documentary, Biography, History\", \"Director\": \"N/A\", \"Writer\": \"Stephen Fitzmeyer, Henry Hampton\", \"Actors\": \"David McCullough, David Ogden Stiers, Michael Murphy\", \"Plot\": \"A series showcasing documentaries on American history.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 1 Oscar. 84 wins & 121 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BODdkOGZiNTItNThiOS00OWRmLWEyYmQtODRjZTY0NjM0OGFlXkEyXkFqcGdeQXVyOTQ5ODkxMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.6/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.6\", \"imdbVotes\": \"1,929\", \"imdbID\": \"tt0094416\", \"Type\": \"series\", \"totalSeasons\": \"34\", \"Response\": \"True\"}", "tags": ["documentary"]}], "7805b0b7-b274-4c75-ae6b-68bd8efe57cb": [{"artifactid": "7805b0b7-b274-4c75-ae6b-68bd8efe57cb", "title": "Avenue 5", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "Avenue5_S", "filepath": "comedy/Avenue5", "director": [], "writer": ["Armando Iannucci"], "primcast": ["Ethan Phillips", "Hugh Laurie", "Josh Gad", "Lenora Crichlow", "Nikki Amuka-Bird", "Rebecca Front", "Suzy Nakamura", "Zach Woods"], "relorg": ["HBO"], "relyear": 2020, "eidrid": "string", "imdbid": "tt10234362", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "science_fiction"], "synopsis": "The troubled crew of Avenue 5, a space cruise ship filled with spoiled, rich, snotty space tourists, must try and keep everyone calm after their ship gets thrown off course into space and ends up needing three years to return to Earth."}], "04fb8351-651e-4740-9b50-13a9392a7897": [{"artifactid": "04fb8351-651e-4740-9b50-13a9392a7897", "title": "Beerfest", "majtype": "movie", "runmins": 111, "season": -1, "episode": -1, "file": "Beerfest.m4v", "filepath": "comedy/BrokenLizard", "director": ["Jay Chandrasekhar"], "writer": ["Broken Lizard"], "primcast": ["Cloris Leachman", "Eric Christian Olsen", "Erik Stolhanske", "Jay Chandrasekhar", "J\u00fcrgen Prochnow", "Kevin Heffernan", "Mo'Nique", "Paul Soter", "Ralf M\u00f6ller", "Steve Lemme", "Will Forte"], "relorg": ["string", "Warner Bros."], "relyear": 2006, "eidrid": "string", "imdbid": "tt0486551", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "Two brothers travel to Germany for Oktoberfest, only to stumble upon a secret, centuries-old competition described as a \"Fight Club\" with beer games."}], "0c9db4eb-dd69-420f-ade8-776d17a641f8": [{"artifactid": "0c9db4eb-dd69-420f-ade8-776d17a641f8", "title": "BillHicksLive_T5.m4v", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "BillHicksLive_T5.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": -1, "eidrid": "string", "imdbid": "none", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "stand-up"]}], "c201f148-f45e-4248-afc1-f277371f6bef": [{"artifactid": "c201f148-f45e-4248-afc1-f277371f6bef", "title": "Blackadder", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/BlackAdder", "director": ["Geoff Posner", "Mandie Fletcher", "Martin Shardlow", "Richard Boden"], "writer": ["Ben Elton", "Richard Curtis", "Rowan Atkinson"], "primcast": ["Hugh Laurie", "Miranda Richardson", "Rowan Atkinson", "Stephen Fry", "Tim McInnerny", "Tony Robinson"], "relorg": [], "relyear": 1983, "eidrid": "string", "imdbid": "none", "arbmeta": "{\"Response\": \"False\", \"Error\": \"Incorrect IMDb ID.\"}", "tags": ["british", "comedy"], "synopsis": "Blackadder is a series of four period British sitcoms.  The periods are: Middle Ages, Elizabethan, Regency of Prince George, and The Great War."}], "73c34aae-d65c-4971-88db-724748804e3c": [{"artifactid": "73c34aae-d65c-4971-88db-724748804e3c", "title": "Bob's Burgers", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "BobsBurgers_s", "filepath": "comedy/BobsBurgers", "director": [], "writer": ["Jim Dauterive", "Loren Bouchard"], "primcast": ["Dan Mintz", "Eugene Mirman", "H. Jon Benjamin", "John Roberts", "Kristen Schaal", "Larry Murphy"], "relorg": ["20th Television", "20th Television Animation", "Buck & Millie Productions", "Wilo Productions"], "relyear": 2011, "eidrid": "string", "imdbid": "tt1561755", "arbmeta": "{\"Title\": \"Bob's Burgers\", \"Year\": \"2011u2013\", \"Rated\": \"TV-14\", \"Released\": \"09 Jan 2011\", \"Runtime\": \"30S min\", \"Genre\": \"Animation, Comedy\", \"Director\": \"N/A\", \"Writer\": \"Loren Bouchard, Jim Dauterive\", \"Actors\": \"H. Jon Benjamin, Dan Mintz, Eugene Mirman\", \"Plot\": \"Bob Belcher runs his dream restaurant with his wife and three children as their last hope of holding the family together.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 2 Primetime Emmys. 17 wins & 90 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZGJiNmM1NDctNWUxYS00YzE4LWJjNTgtYTJhYzE0NjFmMTMwXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.2/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.2\", \"imdbVotes\": \"79,735\", \"imdbID\": \"tt1561755\", \"Type\": \"series\", \"totalSeasons\": \"13\", \"Response\": \"True\"}", "tags": ["animation", "comedy", "kitten"], "synopsis": "Bob Belcher runs his dream restaurant with his wife and three children as their last hope of holding the family together."}], "07273465-c4ef-49a7-b709-7d7137a180bc": [{"artifactid": "07273465-c4ef-49a7-b709-7d7137a180bc", "title": "Clerks III", "majtype": "movie", "runmins": 100, "season": -1, "episode": -1, "file": "Clerks3.m4v", "filepath": "comedy", "director": ["Kevin Smith"], "writer": ["Kevin Smith"], "primcast": ["Austin Zajur", "Brian O'Halloran", "Jason Mewes", "Jeff Anderson", "Kevin Smith", "Trevor Fehrman"], "relorg": ["Bondit Media Capital", "Destro Films", "Lionsgate", "Mewesings", "Three Point Capital", "View Askew Productions"], "relyear": -1, "eidrid": "string", "imdbid": "tt11128440", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "Dante, Elias, and Jay and Silent Bob are enlisted by Randal after a heart attack to make a movie about the convenience store that started it all."}], "3ef463f3-8a82-426e-9a6e-5260973115e8": [{"artifactid": "3ef463f3-8a82-426e-9a6e-5260973115e8", "title": "Connections 1", "majtype": "tvseries", "runmins": 50, "season": -1, "episode": -1, "file": "", "filepath": "docu/Connections1", "director": [], "writer": [], "primcast": ["Bruce Boa", "James Burke", "Kenneth Kendall"], "relorg": [], "relyear": 1978, "eidrid": "string", "imdbid": "tt0078588", "arbmeta": "{\"Title\": \"Connections\", \"Year\": \"1978u2013\", \"Rated\": \"N/A\", \"Released\": \"17 Oct 1978\", \"Runtime\": \"50 min\", \"Genre\": \"Documentary, History\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"James Burke, Kenneth Kendall, Bruce Boa\", \"Plot\": \"Follow James Burke through the history of science and technology in this collection of 10 1-hour episodes, starting with \"The Trigger Effect.\"\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNjI2YzgxOWQtMmNjMS00NmNjLThmYWUtMjA1NmZkNDliMzdkL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjk1NTk3NDM@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"9.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"9.3\", \"imdbVotes\": \"1,237\", \"imdbID\": \"tt0078588\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["british", "documentary"], "synopsis": "Follow James Burke through the history of science and technology in this collection of 10 1-hour episodes, starting with \"The Trigger Effect.\""}], "0a715f56-09bc-4bc8-9d87-a7559f885151": [{"artifactid": "0a715f56-09bc-4bc8-9d87-a7559f885151", "title": "CrudeAwakening.m4v", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "CrudeAwakening.m4v", "filepath": "docu", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 2006, "eidrid": "string", "imdbid": "tt0776794", "arbmeta": "{\"Title\": \"A Crude Awakening: The Oil Crash\", \"Year\": \"2006\", \"Rated\": \"Not Rated\", \"Released\": \"01 Mar 2006\", \"Runtime\": \"84 min\", \"Genre\": \"Documentary, War\", \"Director\": \"Basil Gelpke, Raymond McCormack, Reto Caduff(co-director)\", \"Writer\": \"Basil Gelpke, Raymond McCormack\", \"Actors\": \"Wade Adams, Abdul Samad Al-Awadi, Fadhil J. Al-Chalabi, Roscoe Bartlett\", \"Plot\": \"A theatrical documentary on the planet's dwindling oil resources.\", \"Language\": \"English\", \"Country\": \"Switzerland, Germany\", \"Awards\": \"4 wins & 2 nominations.\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTM2NDY5Mzc4NV5BMl5BanBnXkFtZTcwMzM3MDQzMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.8/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"73%\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.8\", \"imdbVotes\": \"1,917\", \"imdbID\": \"tt0776794\", \"Type\": \"movie\", \"DVD\": \"03 Apr 2007\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["documentary"]}], "08c74e39-e523-4d4f-864c-7a0cc67c4419": [{"artifactid": "08c74e39-e523-4d4f-864c-7a0cc67c4419", "title": "Dara O'Briain: Talks Funny", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "DaraOBriain_TalksFunny.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": -1, "eidrid": "string", "imdbid": "tt1368982", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy", "new", "stand-up"]}], "0ea8c809-1020-474e-a6df-9074372cfa52": [{"artifactid": "0ea8c809-1020-474e-a6df-9074372cfa52", "title": "Despicable Me", "majtype": "movie", "runmins": 95, "season": -1, "episode": -1, "file": "DespicableMe.m4v", "filepath": "comedy", "director": ["Chris Renaud", "Pierre Coffin"], "writer": ["Cinco Paul", "Ken Daurio", "Sergio Pablos"], "primcast": ["Jason Segel", "Julie Andrews", "Kristen Wiig", "Miranda Cosgrove", "Russell Brand", "Steve Carell", "Will Arnett"], "relorg": ["string"], "relyear": 2010, "eidrid": "string", "imdbid": "tt1323594", "arbmeta": "{\"string\": \"string\"}", "tags": ["action", "animation", "comedy", "kitten"], "synopsis": "When a criminal mastermind uses a trio of orphan girls as pawns for a grand scheme, he finds their love is profoundly changing him for the better."}], "7099fc66-cb10-4b6c-b41a-9c1f3f511f6c": [{"artifactid": "7099fc66-cb10-4b6c-b41a-9c1f3f511f6c", "title": "Father Ted", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/FatherTed", "director": [], "writer": ["Arthur Mathews", "Graham Linehan"], "primcast": ["Ardal O'Hanlon", "Dermot Morgan", "Frank Kelly"], "relorg": [], "relyear": 1995, "eidrid": "string", "imdbid": "tt0111958", "arbmeta": "{\"Title\": \"Father Ted\", \"Year\": \"1995u20131998\", \"Rated\": \"TV-14\", \"Released\": \"21 Apr 1995\", \"Runtime\": \"2 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Dermot Morgan, Ardal O'Hanlon, Frank Kelly\", \"Plot\": \"Three misfit priests and their housekeeper live on Craggy Island, not the peaceful and quiet part of Ireland that it seems to be.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Won 3 BAFTA 15 wins & 4 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYzI2YzQ5MWMtZGU0OC00ZDZkLWFiMGQtMWQzNmQ2Y2E3NDUyXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.7/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.7\", \"imdbVotes\": \"40,303\", \"imdbID\": \"tt0111958\", \"Type\": \"series\", \"totalSeasons\": \"3\", \"Response\": \"True\"}", "tags": ["british", "comedy", "kitten"], "synopsis": "Three misfit priests and their housekeeper live on Craggy Island, not the peaceful and quiet part of Ireland that it seems to be."}], "86238ca3-6862-4721-b6fe-e8d2e875fdda": [{"artifactid": "86238ca3-6862-4721-b6fe-e8d2e875fdda", "title": "Fawlty Towers", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/FawltyTowers", "director": [], "writer": ["Connie Booth", "John Cleese"], "primcast": ["Andrew Sachs", "Connie Booth", "John Cleese", "Prunella Scales"], "relorg": [], "relyear": 1975, "eidrid": "string", "imdbid": "tt0072500", "arbmeta": "{\"Title\": \"Fawlty Towers\", \"Year\": \"1975u20131979\", \"Rated\": \"TV-PG\", \"Released\": \"19 Sep 1975\", \"Runtime\": \"1 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"John Cleese, Prunella Scales, Andrew Sachs\", \"Plot\": \"Hotel owner Basil Fawlty's incompetence, short fuse, and arrogance form a combination that ensures accidents and trouble are never far away.\", \"Language\": \"English, Spanish\", \"Country\": \"United Kingdom\", \"Awards\": \"Won 3 BAFTA 5 wins & 2 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNzg2NWQ5MDQtMWY0MC00MWFiLWIyMDEtYTI2MTMzN2YzOTI0XkEyXkFqcGdeQXVyNTA4NzExMDg@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.8/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.8\", \"imdbVotes\": \"92,713\", \"imdbID\": \"tt0072500\", \"Type\": \"series\", \"totalSeasons\": \"2\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "Hotel owner Basil Fawlty's incompetence, short fuse, and arrogance form a combination that ensures accidents and trouble are never far away."}], "0613a102-b416-4fc9-b381-137692055511": [{"artifactid": "0613a102-b416-4fc9-b381-137692055511", "title": "GrandDayOut.m4v", "majtype": "movie", "runmins": 23, "season": -1, "episode": -1, "file": "GrandDayOut.m4v", "filepath": "comedy", "director": ["Nick Park"], "writer": ["Nick Park", "Steve Rushton"], "primcast": ["Peter Sallis"], "relorg": ["Aardman Animations", "National Film and Television School"], "relyear": 1989, "eidrid": "string", "imdbid": "tt0104361", "arbmeta": "{\"franchise\": \"Wallace & Gromit\",  \"titleorig\": \"GrandDayOut.m4v\", \"titlelibrary\": \"GrandDayOut.m4v\"}", "tags": ["animation", "comedy"], "synopsis": "Wallace takes a break from trying to decide on a holiday destination only to find he has no cheese for his crackers. The solution to both problems is a trip to the moon, with dog Gromit, because everybody knows the moon's made of cheese."}], "0d940d56-938a-4eea-bc29-1f7b7a4a684a": [{"artifactid": "0d940d56-938a-4eea-bc29-1f7b7a4a684a", "title": "Hackers", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "Hackers.m4v", "filepath": "drama", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 1995, "eidrid": "string", "imdbid": "tt0113243", "arbmeta": "{\"Title\": \"Hackers\", \"Year\": \"1995\", \"Rated\": \"PG-13\", \"Released\": \"15 Sep 1995\", \"Runtime\": \"105 min\", \"Genre\": \"Crime, Drama, Romance\", \"Director\": \"Iain Softley\", \"Writer\": \"Rafael Moreu\", \"Actors\": \"Jonny Lee Miller, Angelina Jolie, Jesse Bradford\", \"Plot\": \"Hackers are blamed for making a virus that will capsize five oil tankers.\", \"Language\": \"English, Italian, Spanish, Japanese, Russian\", \"Country\": \"United States\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNmExMTkyYjItZTg0YS00NWYzLTkwMjItZWJiOWQ2M2ZkYjE4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.2/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"31%\"}, {\"Source\": \"Metacritic\", \"Value\": \"46/100\"}], \"Metascore\": \"46\", \"imdbRating\": \"6.2\", \"imdbVotes\": \"69,751\", \"imdbID\": \"tt0113243\", \"Type\": \"movie\", \"DVD\": \"24 Apr 2001\", \"BoxOffice\": \"$7,563,728\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["drama"]}], "82510bf0-ef28-4924-a9c5-03bae33e523a": [{"artifactid": "82510bf0-ef28-4924-a9c5-03bae33e523a", "title": "House, M.D.", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "HouseMD_S", "filepath": "drama/HouseMD", "director": [], "writer": ["David Shore"], "primcast": ["Amber Tamblyn", "Charlyne Yi", "Hugh Laurie", "Jennifer Morrison", "Jesse Spencer", "Kal Penn", "Lisa Edelstein", "Odette Annable", "Olivia Wilde", "Omar Epps", "Peter Jacobson", "Robert Sean Leonard"], "relorg": [], "relyear": 2004, "eidrid": "string", "imdbid": "tt0412142", "arbmeta": "{\"Title\": \"House\", \"Year\": \"2004u20132012\", \"Rated\": \"TV-14\", \"Released\": \"16 Nov 2004\", \"Runtime\": \"44 min\", \"Genre\": \"Drama, Mystery\", \"Director\": \"N/A\", \"Writer\": \"David Shore\", \"Actors\": \"Hugh Laurie, Omar Epps, Robert Sean Leonard\", \"Plot\": \"An antisocial maverick doctor who specializes in diagnostic medicine does whatever it takes to solve puzzling cases that come his way using his crack team of doctors and his wits.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 5 Primetime Emmys. 57 wins & 140 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMDA4NjQzN2ItZDhhNC00ZjVlLWFjNTgtMTEyNDQyOGNjMDE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.7/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.7\", \"imdbVotes\": \"458,247\", \"imdbID\": \"tt0412142\", \"Type\": \"series\", \"totalSeasons\": \"8\", \"Response\": \"True\"}", "tags": ["detective", "drama", "medical"], "synopsis": "An antisocial maverick doctor who specializes in diagnostic medicine does whatever it takes to solve puzzling cases that come his way using his crack team of doctors and his wits."}], "c9e7007b-4628-4578-9f02-8d847ae32550": [{"artifactid": "c9e7007b-4628-4578-9f02-8d847ae32550", "title": "Inside Amy Schumer", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/InsideAmySchumer", "director": [], "writer": ["Amy Schumer"], "primcast": [], "relorg": [], "relyear": 2013, "eidrid": "string", "imdbid": "tt2578508", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "kitten", "new"], "synopsis": "Amy Schumer switches from sketches to doing stand-up to interviewing people on the street and people of interest, usually following a certain theme."}], "03189fe8-a68f-4631-8eb2-8277c248a987": [{"artifactid": "03189fe8-a68f-4631-8eb2-8277c248a987", "title": "Jojo Rabbit", "majtype": "movie", "runmins": 108, "season": -1, "episode": -1, "file": "JoJoRabbit.m4v", "filepath": "comedy", "director": ["Taika Waititi"], "writer": ["Christine Leunens", "Taika Waititi"], "primcast": ["Roman Griffin Davis", "Scarlett Johansson", "Thomasin McKenzie"], "relorg": ["string"], "relyear": 2019, "eidrid": "string", "imdbid": "tt2584384", "arbmeta": "{\"Title\": \"Jojo Rabbit\", \"Year\": \"2019\", \"Rated\": \"PG-13\", \"Released\": \"08 Nov 2019\", \"Runtime\": \"108 min\", \"Genre\": \"Comedy, Drama, War\", \"Director\": \"Taika Waititi\", \"Writer\": \"Christine Leunens, Taika Waititi\", \"Actors\": \"Roman Griffin Davis, Thomasin McKenzie, Scarlett Johansson\", \"Plot\": \"A young German boy in the Hitler Youth whose hero and imaginary friend is the country's dictator is shocked to discover that his mother is hiding a Jewish girl in their home.\", \"Language\": \"English, German\", \"Country\": \"New Zealand, United States, Czech Republic\", \"Awards\": \"Won 1 Oscar. 49 wins & 193 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZjU0Yzk2MzEtMjAzYy00MzY0LTg2YmItM2RkNzdkY2ZhN2JkXkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.9/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"80%\"}, {\"Source\": \"Metacritic\", \"Value\": \"58/100\"}], \"Metascore\": \"58\", \"imdbRating\": \"7.9\", \"imdbVotes\": \"379,379\", \"imdbID\": \"tt2584384\", \"Type\": \"movie\", \"DVD\": \"08 Nov 2019\", \"BoxOffice\": \"$33,370,906\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "A young German boy in the Hitler Youth whose hero and imaginary friend is the country's dictator is shocked to discover that his mother is hiding a Jewish girl in their home."}], "0e53430e-3795-4d68-b832-9d460f8b8d3a": [{"artifactid": "0e53430e-3795-4d68-b832-9d460f8b8d3a", "title": "JurassicPark4-mpg.m4v", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "JurassicPark4-mpg.m4v", "filepath": "scifi", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 2015, "eidrid": "string", "imdbid": "string", "arbmeta": "{\"franchise\": \"Jurassic Park\", \"titleorig\": \"JurassicPark4-mpg.m4v\", \"titlelibrary\": \"JurassicPark4-mpg.m4v\"}", "tags": ["science_fiction"]}], "ab8a0b85-96d1-48b4-b20b-7c097b24b90a": [{"artifactid": "ab8a0b85-96d1-48b4-b20b-7c097b24b90a", "title": "Keeping Up Appearances", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "KeepingUpAppearances_S", "filepath": "comedy/KeepingUpAppearances", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 1990, "eidrid": "string", "imdbid": "tt0098837", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy", "new"], "synopsis": "A snobbish housewife is determined to climb the social ladder, in spite of her family's working class connections and the constant chagrin of her long suffering husband."}], "02719058-c660-4132-a3c1-a7a93b1693e9": [{"artifactid": "02719058-c660-4132-a3c1-a7a93b1693e9", "title": "Medicine Man", "majtype": "movie", "runmins": 106, "season": -1, "episode": -1, "file": "MedicineMan.m4v", "filepath": "drama", "director": ["John McTiernan"], "writer": ["Sally Robinson", "Tom Schulman"], "primcast": ["Jose Wilker", "Lorraine Bracco", "Sean Connery"], "relorg": ["string"], "relyear": 1992, "eidrid": "string", "imdbid": "tt0104839", "arbmeta": "{\"Title\": \"Medicine Man\", \"Year\": \"1992\", \"Rated\": \"PG-13\", \"Released\": \"07 Feb 1992\", \"Runtime\": \"1 min\", \"Genre\": \"Adventure, Drama, Romance\", \"Director\": \"John McTiernan\", \"Writer\": \"Tom Schulman, Sally Robinson\", \"Actors\": \"Sean Connery, Lorraine Bracco, Josu00e9 Wilker\", \"Plot\": \"In the beautiful and dangerous Amazon rainforest, dissimilar people must make their choices between business, science, and love.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"1 nomination\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BODc3NTFkYTEtMTUzZi00ZTI4LWJjMGItNWI4ZGFlOTNhNGY1XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.0/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"17%\"}, {\"Source\": \"Metacritic\", \"Value\": \"43/100\"}], \"Metascore\": \"43\", \"imdbRating\": \"6.0\", \"imdbVotes\": \"23,544\", \"imdbID\": \"tt0104839\", \"Type\": \"movie\", \"DVD\": \"07 Jun 2001\", \"BoxOffice\": \"$45,500,797\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["adventure", "drama", "romance"], "synopsis": "In the beautiful and dangerous Amazon rainforest, dissimilar people must make their choices between business, science, and love."}], "95a82dab-d94a-4eab-862c-2876e697547a": [{"artifactid": "95a82dab-d94a-4eab-862c-2876e697547a", "title": "Modern Marvels: Engineering Disasters", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/ModernMarvelsEngineeringDisasters", "director": [], "writer": [], "primcast": [], "relorg": [], "relyear": 1995, "eidrid": "string", "imdbid": "none", "arbmeta": "{\"Response\": \"False\", \"Error\": \"Incorrect IMDb ID.\"}", "tags": ["documentary"], "synopsis": "A subset of episodes from the long-running History Channel series \"Modern Marvels\". \n This series uncovers the causes and consequences of major engineering and construction failures."}], "c7b49b7b-8707-42a0-946c-9f0f771ff784": [{"artifactid": "c7b49b7b-8707-42a0-946c-9f0f771ff784", "title": "Monty Python's Flying Circus", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/MontyPythonsFlyingCircus", "director": [], "writer": ["Eric Idle", "Graham Chapman", "John Cleese", "Michael Palin", "Terry Gilliam", "Terry Jones"], "primcast": ["Eric Idle", "Graham Chapman", "John Cleese", "Michael Palin", "Terry Gilliam", "Terry Jones"], "relorg": ["BBC"], "relyear": 1969, "eidrid": "string", "imdbid": "tt0063929", "arbmeta": "{\"franchise\": \"Monty Python\",\"titleorig\": \"Monty Python's Flying Circus\", \"titlelibrary\": \"Monty Python's Flying Circus\"}", "tags": ["british", "comedy"], "synopsis": "Classic British Sketch Comedy Show"}], "aec0549e-cc1b-40e7-a0af-db641e9ed8ff": [{"artifactid": "aec0549e-cc1b-40e7-a0af-db641e9ed8ff", "title": "Moon Machines", "majtype": "tvseries", "runmins": 44, "season": -1, "episode": -1, "file": "", "filepath": "docu", "director": [], "writer": [], "primcast": ["Bill Stoney", "Robert Seamans", "Sonny Morea"], "relorg": [], "relyear": 2008, "eidrid": "string", "imdbid": "tt1203167", "arbmeta": "{\"Title\": \"Moon Machines\", \"Year\": \"2008u2013\", \"Rated\": \"N/A\", \"Released\": \"16 Jun 2008\", \"Runtime\": \"N/A\", \"Genre\": \"Documentary\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Robert Seamans, Bill Stoney, Sonny Morea\", \"Plot\": \"A collection of documentaries about project apollo,from the designers and engineers viewpoint.Each episode focused on individual components or equipment for the Apollo programme.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTMxMTIyNDM3NF5BMl5BanBnXkFtZTcwNzE0NzU2Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.8/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.8\", \"imdbVotes\": \"402\", \"imdbID\": \"tt1203167\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["documentary", "space_race"], "synopsis": "A collection of documentaries about project Apollo, from the designers and engineers viewpoint.  Each episode focused on individual components or equipment for the Apollo program."}], "0ccfac0f-b474-4828-a8a5-26534bd93cf4": [{"artifactid": "0ccfac0f-b474-4828-a8a5-26534bd93cf4", "title": "MysteryMen", "majtype": "movie", "runmins": 121, "season": -1, "episode": -1, "file": "MysteryMen.m4v", "filepath": "comedy", "director": ["Kinka Usher"], "writer": ["Bob Burden", "Neil Cuthbert"], "primcast": ["Ben Stiller", "Janeane Garofalo", "William H. Macy"], "relorg": ["Universal Pictures"], "relyear": 1999, "eidrid": "string", "imdbid": "tt0132347", "arbmeta": "{\"Title\": \"Mystery Men\", \"Year\": \"1999\", \"Rated\": \"PG-13\", \"Released\": \"06 Aug 1999\", \"Runtime\": \"121 min\", \"Genre\": \"Action, Comedy, Fantasy\", \"Director\": \"Kinka Usher\", \"Writer\": \"Neil Cuthbert, Bob Burden\", \"Actors\": \"Ben Stiller, Janeane Garofalo, William H. Macy\", \"Plot\": \"A group of inept amateur superheroes must try to save the day when a supervillain threatens to destroy a major superhero and the city.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"3 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYjZhZmY4NDctNWU5Mi00MGI0LTkzMGUtMjRiZWM2MTdiNjBkXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.1/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"61%\"}, {\"Source\": \"Metacritic\", \"Value\": \"65/100\"}], \"Metascore\": \"65\", \"imdbRating\": \"6.1\", \"imdbVotes\": \"67,330\", \"imdbID\": \"tt0132347\", \"Type\": \"movie\", \"DVD\": \"18 Jan 2005\", \"BoxOffice\": \"$29,762,011\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "A group of inept amateur superheroes must try to save the day when a supervillain threatens to destroy a major superhero and the city."}], "bcac590f-a5c1-424f-aa14-82c3526e0405": [{"artifactid": "bcac590f-a5c1-424f-aa14-82c3526e0405", "title": "NCIS", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "NCIS_S", "filepath": "drama/NCIS", "director": [], "writer": ["Don McGill", "Donald P. Bellisario"], "primcast": ["Brian Dietzen", "Cote de Pablo", "David McCallum", "Diona Reasonover", "Duane Henry", "Emily Wickersham", "Gary Cole", "Jennifer Esposito", "Katrina Law", "Lauren Holly", "Maria Bello", "Mark Harmon", "Michael Weatherly", "Pauley Perrette", "Rocky Carroll", "Sasha Alexander", "Sean Murray", "Wilmer Valderrama"], "relorg": ["Belisarius Productions", "CBS Television", "Paramount Television"], "relyear": 2003, "eidrid": "string", "imdbid": "tt0364845", "arbmeta": "{\"string\": \"string\"}", "tags": ["action", "detective", "drama", "military", "police_procedural"], "synopsis": "The cases of the Naval Criminal Investigative Service's Washington, D.C. Major Case Response Team, led by Special Agent Leroy Jethro Gibbs."}], "0690c787-619f-40b6-b9d8-99918241166f": [{"artifactid": "0690c787-619f-40b6-b9d8-99918241166f", "title": "Network", "majtype": "movie", "runmins": 121, "season": -1, "episode": -1, "file": "Network.m4v", "filepath": "comedy", "director": ["Sidney Lumet"], "writer": ["Paddy Chayefsky"], "primcast": ["Faye Dunaway", "Peter Finch", "William Holden"], "relorg": ["Metro-Goldwyn-Mayer"], "relyear": 1976, "eidrid": "string", "imdbid": "tt0074958", "arbmeta": "{\"Title\": \"Network\", \"Year\": \"1976\", \"Rated\": \"R\", \"Released\": \"27 Nov 1976\", \"Runtime\": \"2 min\", \"Genre\": \"Drama\", \"Director\": \"Sidney Lumet\", \"Writer\": \"Paddy Chayefsky\", \"Actors\": \"Faye Dunaway, William Holden, Peter Finch\", \"Plot\": \"A television network cynically exploits a deranged former anchor's ravings and revelations about the news media for its own profit, but finds that his message may be difficult to control.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 4 Oscars. 20 wins & 26 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNzY0NjU5ODUtOTAzMC00NTU5LWJkZjctYWMyOWY2MTZmOWM1XkEyXkFqcGdeQXVyMTI3ODAyMzE2._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.1/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"92%\"}, {\"Source\": \"Metacritic\", \"Value\": \"83/100\"}], \"Metascore\": \"83\", \"imdbRating\": \"8.1\", \"imdbVotes\": \"158,958\", \"imdbID\": \"tt0074958\", \"Type\": \"movie\", \"DVD\": \"06 May 2005\", \"BoxOffice\": \"$23,689,877\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy", "drama"], "synopsis": "A television network cynically exploits a deranged former anchor's ravings and revelations about the news media for its own profit, but finds that his message may be difficult to control."}], "034bd2ca-f283-410b-ac31-2aa0d15e0f92": [{"artifactid": "034bd2ca-f283-410b-ac31-2aa0d15e0f92", "title": "O Brother, Where Art Thou?", "majtype": "movie", "runmins": 107, "season": -1, "episode": -1, "file": "OBrother.m4v", "filepath": "comedy", "director": ["Joel Coen", "Roger Deakins"], "writer": ["Ethan Coen", "Joel Coen"], "primcast": ["Brian Reddy", "Charles Durning", "Chris Thomas King", "Daniel von Bargen", "Del Pentecost", "Ed Gale", "George Clooney", "Holly Hunter", "J.R. Horne", "John Goodman", "John Turturro", "Michael Badalucco", "Ray McKinnon", "Royce D. Applegate", "Tim Blake Nelson", "Wayne Duvall"], "relorg": ["StudioCanal", "Touchstone Pictures", "Universal Pictures"], "relyear": 2001, "eidrid": "string", "imdbid": "tt0190590", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "In the deep south during the 1930s, three escaped convicts search for hidden treasure while a relentless lawman pursues them."}], "06ae6051-bed9-4bec-ab8c-eb1193851963": [{"artifactid": "06ae6051-bed9-4bec-ab8c-eb1193851963", "title": "Platoon", "majtype": "movie", "runmins": 120, "season": -1, "episode": -1, "file": "Platoon.m4v", "filepath": "drama", "director": ["Oliver Stone"], "writer": ["Oliver Stone"], "primcast": ["Charlie Sheen", "Tom Berenger", "Willem Dafoe"], "relorg": ["string"], "relyear": 1986, "eidrid": "string", "imdbid": "tt0091763", "arbmeta": "{\"Title\": \"Platoon\", \"Year\": \"1986\", \"Rated\": \"R\", \"Released\": \"06 Feb 1987\", \"Runtime\": \"120 min\", \"Genre\": \"Drama, War\", \"Director\": \"Oliver Stone\", \"Writer\": \"Oliver Stone\", \"Actors\": \"Charlie Sheen, Tom Berenger, Willem Dafoe\", \"Plot\": \"Chris Taylor, a neophyte recruit in Vietnam, finds himself caught in a battle of wills between two sergeants, one good and the other evil. A shrewd examination of the brutality of war and the duality of man in conflict.\", \"Language\": \"English, Vietnamese\", \"Country\": \"United States, United Kingdom\", \"Awards\": \"Won 4 Oscars. 24 wins & 15 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMzRjZjdlMjQtODVkYS00N2YzLWJlYWYtMGVlN2E5MWEwMWQzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.1/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"89%\"}, {\"Source\": \"Metacritic\", \"Value\": \"92/100\"}], \"Metascore\": \"92\", \"imdbRating\": \"8.1\", \"imdbVotes\": \"411,448\", \"imdbID\": \"tt0091763\", \"Type\": \"movie\", \"DVD\": \"15 Aug 2000\", \"BoxOffice\": \"$138,530,565\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["action", "drama", "vietnam_war"], "synopsis": "Chris Taylor, a neophyte recruit in Vietnam, finds himself caught in a battle of wills between two sergeants, one good and the other evil. A shrewd examination of the brutality of war and the duality of man in conflict."}], "8b1ab865-5c43-488f-954a-dba13c277163": [{"artifactid": "8b1ab865-5c43-488f-954a-dba13c277163", "title": "Poldark", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "Poldark_S", "filepath": "drama/Poldark", "director": [], "writer": ["Debbie Horsfield"], "primcast": ["Aidan Turner", "Beatie Edney", "Caroline Blakiston", "Christian Brassington", "Eleanor Tomlinson", "Ellise Chappell", "Gabriella Wilde", "Harry Richardson", "Heida Reed", "Jack Farthing", "John Nettles", "Josh Whitehouse", "Kerri McLean", "Kyle Soller", "Luke Norris", "Peter Sullivan", "Phil Davis", "Pip Torrens", "Ruby Bentall", "Sean Gilder", "Tim Dutton", "Tom York", "Vincent Regan", "Warren Clarke"], "relorg": ["BBC One"], "relyear": 2015, "eidrid": "string", "imdbid": "tt3636060", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "drama", "kitten"], "synopsis": "Ross Poldark returns home after American Revolutionary War and rebuilds his life with a new business venture, making new enemies and finding a new love where he least expects it."}], "0c8828a9-aa8a-4961-ba55-14c143fbe3a4": [{"artifactid": "0c8828a9-aa8a-4961-ba55-14c143fbe3a4", "title": "Revolution OS", "majtype": "movie", "runmins": 85, "season": -1, "episode": -1, "file": "RevolutionOS.m4v", "filepath": "docu", "director": ["J.T.S. Moore"], "writer": ["J.T.S. Moore"], "primcast": ["Eric Raymond", "Linus Torvalds", "Richard M. Stallman"], "relorg": ["string"], "relyear": 2001, "eidrid": "string", "imdbid": "tt0308808", "arbmeta": "{\"Title\": \"Revolution OS\", \"Year\": \"2001\", \"Rated\": \"N/A\", \"Released\": \"15 Feb 2002\", \"Runtime\": \"85 min\", \"Genre\": \"Documentary, Comedy\", \"Director\": \"J.T.S. Moore\", \"Writer\": \"J.T.S. Moore\", \"Actors\": \"Linus Torvalds, Richard M. Stallman, Eric Raymond\", \"Plot\": \"While Microsoft may be the biggest software company in the world, not every computer user is a fan of their products, or their way of doing business. While Microsoft's Windows became the most widely used operating system for perso...\", \"Language\": \"English, Swedish\", \"Country\": \"United States\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTgyNDU0NTIwNV5BMl5BanBnXkFtZTcwNzE4MDQyMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.3/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"43%\"}, {\"Source\": \"Metacritic\", \"Value\": \"46/100\"}], \"Metascore\": \"46\", \"imdbRating\": \"7.3\", \"imdbVotes\": \"2,524\", \"imdbID\": \"tt0308808\", \"Type\": \"movie\", \"DVD\": \"16 Sep 2003\", \"BoxOffice\": \"$3,500\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["documentary", "technology"], "synopsis": "While Microsoft may be the biggest software company in the world, not every computer user is a fan of their products, or their way of doing business. While Microsoft's Windows became the most widely used operating system for personal computers."}], "6cbad761-e403-4f0d-bf49-bbefdfaaa839": [{"artifactid": "6cbad761-e403-4f0d-bf49-bbefdfaaa839", "title": "Star Wars: Rebels", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "StarWarsRebels_S", "filepath": "scifi/StarWarsRebels", "director": ["string"], "writer": ["string"], "primcast": ["Dave Filoni", "Freddie Prinze Jr.", "Steve Blum", "Taylor Gray", "Tiya Sircar", "Vanessa Marshall"], "relorg": ["Disney\u2013ABC Domestic Television", "Lucasfilm Animation", "Lucasfilm Ltd."], "relyear": 2014, "eidrid": "string", "imdbid": "tt2930604", "arbmeta": "{\"franchise\":\"Star Wars\",\"string\": \"string\", \"titleorig\": \"Star Wars: Rebels\", \"titlelibrary\": \"Star Wars: Rebels\"}", "tags": ["action", "adventure", "animation", "fantasy", "science_fiction"], "synopsis": "A brave and clever ragtag starship crew stands up against the evil Empire as it tightens its grip on the galaxy and hunts down the last of the Jedi Knights."}], "0d38af65-46e1-4e2b-9195-686c7b932870": [{"artifactid": "0d38af65-46e1-4e2b-9195-686c7b932870", "title": "Stephen Fry In America", "majtype": "tvseries", "runmins": -1, "season": -1, "episode": -1, "file": "StephenFryInAmerica_S", "filepath": "docu/StephenFryInAmerica", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 2008, "eidrid": "string", "imdbid": "tt1307789", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "documentary"], "synopsis": "English actor-comedian Stephen Fry travels through the US regions by London cab"}], "aa1e7a07-ea94-4c90-af43-7272c050af67": [{"artifactid": "aa1e7a07-ea94-4c90-af43-7272c050af67", "title": "Stephen Fry: Last Chance To See", "majtype": "tvseries", "runmins": -1, "season": -1, "episode": -1, "file": "StephenFryLastChanceToSee_S", "filepath": "docu/StephenFryLastChanceToSee", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 2009, "eidrid": "string", "imdbid": "tt1409667", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "documentary"]}], "00edc024-9c5d-4b97-a9e5-b79b7ee48f0f": [{"artifactid": "00edc024-9c5d-4b97-a9e5-b79b7ee48f0f", "title": "Strategic Air Command", "majtype": "movie", "runmins": 112, "season": -1, "episode": -1, "file": "StrategicAirCommand.m4v", "filepath": "drama", "director": ["Anthony Mann"], "writer": ["Beirne Lay Jr.", "Valentine Davies"], "primcast": ["Frank Lovejoy", "James Stewart", "June Allyson"], "relorg": ["string"], "relyear": 1955, "eidrid": "string", "imdbid": "tt0048667", "arbmeta": "{\"Title\": \"Strategic Air Command\", \"Year\": \"1955\", \"Rated\": \"Approved\", \"Released\": \"25 Mar 1955\", \"Runtime\": \"112 min\", \"Genre\": \"Action, Drama, War\", \"Director\": \"Anthony Mann\", \"Writer\": \"Valentine Davies, Beirne Lay Jr.\", \"Actors\": \"James Stewart, June Allyson, Frank Lovejoy\", \"Plot\": \"An ex-pilot and current baseballer is recalled into the U.S. Air Force and assumes an increasingly important role in Cold War deterrence.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 1 Oscar. 1 win & 1 nomination total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNjdhMjM3ZDUtMzA0Ny00NmZiLTgxYjctYTczNjU2ODQxYzg1XkEyXkFqcGdeQXVyMjI4MjA5MzA@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"6.3\", \"imdbVotes\": \"3,611\", \"imdbID\": \"tt0048667\", \"Type\": \"movie\", \"DVD\": \"01 May 2012\", \"BoxOffice\": \"$6,500,000\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["cold_war", "drama"], "synopsis": "An ex-pilot and current baseballer is recalled into the U.S. Air Force and assumes an increasingly important role in Cold War deterrence."}], "7c7203c2-c4b6-4df7-945e-cfa505fc5257": [{"artifactid": "7c7203c2-c4b6-4df7-945e-cfa505fc5257", "title": "The Day The Universe Changed", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/DayTheUniverseChanged", "director": [], "writer": [], "primcast": ["James Burke", "Peter Sproule", "Roger Avon"], "relorg": [], "relyear": 1985, "eidrid": "string", "imdbid": "tt0199208", "arbmeta": "{\"Title\": \"The Day the Universe Changed\", \"Year\": \"1985\", \"Rated\": \"N/A\", \"Released\": \"19 Mar 1985\", \"Runtime\": \"52 min\", \"Genre\": \"Documentary, History\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"James Burke, Roger Avon, Peter Sproule\", \"Plot\": \"James Burke explores key moments in Western History where new knowledge in science changed the way the modern Western world thinks.\", \"Language\": \"English\", \"Country\": \"United Kingdom, United States, Italy, France, Finland\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNjQxMzNlOTAtZTE5ZS00ZDgwLWFlNzAtYWNhZTkwMDY2Y2NmXkEyXkFqcGdeQXVyNjExODE1MDc@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"9.1/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"9.1\", \"imdbVotes\": \"565\", \"imdbID\": \"tt0199208\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["documentary"], "synopsis": "James Burke explores key moments in Western History where new knowledge in science changed the way the modern Western world thinks."}], "00b298bf-9998-4c90-8c00-55a70a13f881": [{"artifactid": "00b298bf-9998-4c90-8c00-55a70a13f881", "title": "The Death Of Stalin", "majtype": "movie", "runmins": 107, "season": -1, "episode": -1, "file": "DeathOfStalin.m4v", "filepath": "comedy", "director": ["Armando Iannucci"], "writer": ["Armando Iannucci", "Fabien Nury", "Thierry Robin"], "primcast": ["Adrian McLoughlin", "Andrea Riseborough", "Cara Horgan", "Daniel Fearn", "Dave Wong", "Dermot Crowley", "Diana Quick", "Gerald Lepkowski", "Jason Isaacs", "Jeffrey Tambor", "Jonathan Aris", "Jonny Phillips", "Luke D'Silva", "Michael Palin", "Nick Sidi", "Olga Kurylenko", "Paddy Considine", "Paul Chahidi", "Paul Whitehouse", "Richard Brake", "Rupert Friend", "Simon Russell Beale", "Steve Buscemi", "Sylvestra Le Touzel"], "relorg": ["AFPI", "Canal+", "Cine+", "France 3 Cinema", "France Televisions", "Gaumont", "La Cie Cinematographique", "Main Journey", "Panache Productions", "Quad Productions", "Title Media"], "relyear": 2017, "eidrid": "string", "imdbid": "tt4686844", "arbmeta": "{\"Title\": \"The Death of Stalin\", \"Year\": \"2017\", \"Rated\": \"R\", \"Released\": \"09 Mar 2018\", \"Runtime\": \"2 min\", \"Genre\": \"Comedy, Drama, History\", \"Director\": \"Armando Iannucci\", \"Writer\": \"Fabien Nury, Thierry Robin, Armando Iannucci\", \"Actors\": \"Steve Buscemi, Simon Russell Beale, Jeffrey Tambor\", \"Plot\": \"Moscow, 1953. After being in power for nearly 30 years, Soviet dictator Joseph Vissarionovich Stalin takes ill and quickly dies. Now the members of the Council of Ministers scramble for power.\", \"Language\": \"English\", \"Country\": \"United Kingdom, France, Belgium, Canada, United States\", \"Awards\": \"Nominated for 2 BAFTA 18 wins & 40 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTcxMDc1NjcyNl5BMl5BanBnXkFtZTgwNDU0NDYxMzI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.2/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"95%\"}, {\"Source\": \"Metacritic\", \"Value\": \"88/100\"}], \"Metascore\": \"88\", \"imdbRating\": \"7.2\", \"imdbVotes\": \"102,480\", \"imdbID\": \"tt4686844\", \"Type\": \"movie\", \"DVD\": \"11 Jun 2018\", \"BoxOffice\": \"$8,047,856\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["based_on_a_true_story", "cold_war", "comedy"], "synopsis": "Moscow, 1953. After being in power for nearly 30 years, Soviet dictator Joseph Vissarionovich Stalin takes ill and quickly dies. Now the members of the Council of Ministers scramble for power."}], "08872109-9bbe-4b21-9125-fe8711d54300": [{"artifactid": "08872109-9bbe-4b21-9125-fe8711d54300", "title": "The Four Horsemen - Discussions With Richard Dawkins", "majtype": "movie", "runmins": 117, "season": -1, "episode": -1, "file": "Dawkins_FourHorsemen.m4v", "filepath": "docu", "director": ["string"], "writer": ["string"], "primcast": ["Christopher Hitchens", "Daniel Dennett", "Richard Dawkins", "Sam Harris"], "relorg": ["string"], "relyear": 2007, "eidrid": "string", "imdbid": "none", "arbmeta": "{\"Response\": \"False\", \"Error\": \"Incorrect IMDb ID.\"}", "tags": ["atheism", "documentary"], "synopsis": "A literal round table discussion with Richard Dawkins, Daniel Dennett, Christopher Hitchens, and Sam Harris.  Conversation mostly centers on identifying and reducing the harm that religion and religious thinking does to humanity."}], "4948bc8c-6d9b-4ad7-9c3b-ba0cc0b5fd45": [{"artifactid": "4948bc8c-6d9b-4ad7-9c3b-ba0cc0b5fd45", "title": "The IT Crowd", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/ITCrowd", "director": [], "writer": ["Graham Linehan"], "primcast": ["Chris O'Dowd", "Katherine Parkinson", "Richard Ayoade"], "relorg": ["Channel 4"], "relyear": 2006, "eidrid": "string", "imdbid": "tt0487831", "arbmeta": "{\"Title\": \"The IT Crowd\", \"Year\": \"2006u20132013\", \"Rated\": \"TV-14\", \"Released\": \"03 Feb 2006\", \"Runtime\": \"1 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Chris O'Dowd, Richard Ayoade, Katherine Parkinson\", \"Plot\": \"The comedic misadventures of Roy, Moss and their grifting supervisor Jen, a rag-tag team of IT support workers at a large corporation headed by a hotheaded yuppie.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Won 3 BAFTA 9 wins & 18 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMjE5MThjMzAtNWVmNC00YThkLTlmNzktMTM3Yzk4YTZhMTgwXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.5/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.5\", \"imdbVotes\": \"150,769\", \"imdbID\": \"tt0487831\", \"Type\": \"series\", \"totalSeasons\": \"4\", \"Response\": \"True\"}", "tags": ["british", "comedy", "technology"], "synopsis": "The comedic misadventures of Roy, Moss and their grifting supervisor Jen, a rag-tag team of IT support workers at a large corporation headed by a hotheaded yuppie."}], "090187c5-1182-48f0-9ada-a1595a110e53": [{"artifactid": "090187c5-1182-48f0-9ada-a1595a110e53", "title": "The Onion Movie", "majtype": "movie", "runmins": 86, "season": -1, "episode": -1, "file": "onion_movie-mpg.m4v", "filepath": "comedy", "director": ["Mike Maguire", "Tom Kuntz"], "writer": ["Robert Siegel", "Todd Hanson"], "primcast": ["Amir Talai", "Len Cariou", "Sarah McElligott"], "relorg": ["string"], "relyear": 2008, "eidrid": "string", "imdbid": "tt0392878", "arbmeta": "{\"Title\": \"The Onion Movie\", \"Year\": \"2008\", \"Rated\": \"Not Rated\", \"Released\": \"07 Jan 2008\", \"Runtime\": \"86 min\", \"Genre\": \"Comedy\", \"Director\": \"Tom Kuntz, Mike Maguire\", \"Writer\": \"Todd Hanson, Robert Siegel\", \"Actors\": \"Len Cariou, Sarah McElligott, Amir Talai\", \"Plot\": \"Satirical interpretations of world events and curious human behavior.\", \"Language\": \"English, Russian, Spanish\", \"Country\": \"United States\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNDdkMDUxMmUtNWQ1Yi00OWY3LWI2ZDktOTBmNzVkMTAwODM5XkEyXkFqcGdeQXVyMTY5Nzc4MDY@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.2/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"6.2\", \"imdbVotes\": \"16,016\", \"imdbID\": \"tt0392878\", \"Type\": \"movie\", \"DVD\": \"03 Jun 2008\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "Satirical interpretations of world events and curious human behavior."}], "0ef74b4c-1d25-41de-99b8-ec615e06f425": [{"artifactid": "0ef74b4c-1d25-41de-99b8-ec615e06f425", "title": "The Russians Are Coming, the Russians Are Coming", "majtype": "movie", "runmins": 126, "season": -1, "episode": -1, "file": "TheRussiansAreComing.m4v", "filepath": "comedy", "director": ["Norman Jewison"], "writer": ["Nathaniel Benchley", "William Rose"], "primcast": ["Alan Arkin", "Andrea Dromm", "Ben Blue", "Brian Keith", "Carl Reiner", "Eva Marie Saint", "John Philip Law", "Jonathan Winters", "Paul Ford", "Tessie O'Shea", "Theodore Bikel"], "relorg": ["The Mirisch Corporation", "United Artists"], "relyear": 1966, "eidrid": "string", "imdbid": "tt0060921", "arbmeta": "{\"Title\": \"The Russians Are Coming the Russians Are Coming\", \"Year\": \"1966\", \"Rated\": \"Unrated\", \"Released\": \"25 May 1966\", \"Runtime\": \"126 min\", \"Genre\": \"Comedy, War\", \"Director\": \"Norman Jewison\", \"Writer\": \"Nathaniel Benchley, William Rose\", \"Actors\": \"Carl Reiner, Eva Marie Saint, Alan Arkin\", \"Plot\": \"Without hostile intent, a Soviet submarine runs aground off New England. Men are sent for a boat, but many villagers go into a tizzy, risking bloodshed.\", \"Language\": \"English, Russian\", \"Country\": \"United States\", \"Awards\": \"Nominated for 4 Oscars. 5 wins & 13 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZGNlMzJlNWQtZjk3NC00ZDA5LTg0N2MtOTc2NmJkYmI5MjM1XkEyXkFqcGdeQXVyNjE5MjUyOTM@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.0/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"86%\"}, {\"Source\": \"Metacritic\", \"Value\": \"69/100\"}], \"Metascore\": \"69\", \"imdbRating\": \"7.0\", \"imdbVotes\": \"9,053\", \"imdbID\": \"tt0060921\", \"Type\": \"movie\", \"DVD\": \"15 Oct 2002\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["cold_war", "comedy"], "synopsis": "Without hostile intent, a Soviet submarine runs aground off New England. Men are sent for a boat, but many villagers go into a tizzy, risking bloodshed."}], "c9ab7d43-5531-4d5f-835c-c7b5c3ff8879": [{"artifactid": "c9ab7d43-5531-4d5f-835c-c7b5c3ff8879", "title": "The Thin Blue Line", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/ThinBlueLine", "director": [], "writer": ["Ben Elton"], "primcast": ["David Haig", "James Dreyfus", "Kevin Allen", "Mark Addy", "Mina Anwar", "Rowan Atkinson", "Rudolph Walker", "Serena Evans"], "relorg": ["Tiger Aspect Productions"], "relyear": 1995, "eidrid": "string", "imdbid": "tt0112194", "arbmeta": "{\"Title\": \"The Thin Blue Line\", \"Year\": \"1995u20131996\", \"Rated\": \"N/A\", \"Released\": \"13 Nov 1995\", \"Runtime\": \"30 min\", \"Genre\": \"Comedy, Crime\", \"Director\": \"N/A\", \"Writer\": \"Ben Elton\", \"Actors\": \"Rowan Atkinson, Mina Anwar, James Dreyfus\", \"Plot\": \"Various mishaps at a police station in an English town. The main character is the anachronistic, yet charming and funny Inspector Fowler. CID foil to Fowler, Inspector Grim is a bumbling, seething idiot.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"1 win & 1 nomination\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNDk1OTcwMzEtMzNjZi00MGEwLTkxYzctNWE5ODI3MzhmN2U0XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.5/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.5\", \"imdbVotes\": \"7,145\", \"imdbID\": \"tt0112194\", \"Type\": \"series\", \"totalSeasons\": \"2\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "Various mishaps at a police station in an English town. The main character is the anachronistic, yet charming and funny Inspector Fowler. CID foil to Fowler, Inspector Grim is a bumbling, seething idiot."}], "a290ee00-577d-4178-8392-4e0ac761d0c2": [{"artifactid": "a290ee00-577d-4178-8392-4e0ac761d0c2", "title": "Thunderbirds", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "scifi", "director": [], "writer": ["Gerry Anderson", "Sylvia Anderson"], "primcast": ["Charles Tingwell", "Christine Finn", "David Graham", "David Holliday", "Jeremy Wilkin", "John Tate", "Matt Zimmerman", "Paul Maxwell", "Peter Dyneley", "Ray Barrett", "Shane Rimmer", "Sylvia Anderson"], "relorg": ["AP Films", "ATV", "ITC Entertainment"], "relyear": 1965, "eidrid": "string", "imdbid": "tt0057790", "arbmeta": "{\"franchise\": \"Thunderbirds\",  \"titleorig\": \"Thunderbirds\", \"titlelibrary\": \"Thunderbirds\"}", "tags": ["action", "adventure", "british", "science_fiction"], "synopsis": "In the year 2065, the Tracy family run International Rescue - a top-secret organization whose ongoing mission is to rescue people trapped in extraordinarily dangerous situations."}], "01e0a408-c1f5-481e-be2e-d7b8338bbf25": [{"artifactid": "01e0a408-c1f5-481e-be2e-d7b8338bbf25", "title": "upright_citizens_d1-mpg.m4v", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "upright_citizens_d1-mpg.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 1998, "eidrid": "string", "imdbid": "tt0167739", "arbmeta": "{\"Title\": \"Upright Citizens Brigade\", \"Year\": \"1998u20132000\", \"Rated\": \"TV-14\", \"Released\": \"19 Aug 1998\", \"Runtime\": \"30 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"Matt Besser, Amy Poehler, Ian Roberts\", \"Actors\": \"Matt Besser, Amy Poehler, Ian Roberts\", \"Plot\": \"Agents Adair, Antoine, Colby, and Trotter both monitor and create chaos across the universe. The sketches seen throughout most of the show are different subjects being monitored. At the end of each episode, all the sketches and ch...\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTYxOTk3NDUxN15BMl5BanBnXkFtZTcwNzMzNDQyMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"2,408\", \"imdbID\": \"tt0167739\", \"Type\": \"series\", \"totalSeasons\": \"3\", \"Response\": \"True\"}", "tags": ["comedy"]}], "08d55215-1f90-4dd9-b065-c64246ed0fee": [{"artifactid": "08d55215-1f90-4dd9-b065-c64246ed0fee", "title": "Waterworld", "majtype": "movie", "runmins": 177, "season": -1, "episode": -1, "file": "Waterworld_Ext-mpg.m4v", "filepath": "action", "director": ["Kevin Reynolds"], "writer": ["David Twohy", "Peter Rader"], "primcast": ["Chris Douridas", "Dennis Hopper", "Gerard Murphy", "Jack Black", "Jack Kehler", "Jeanne Tripplehorn", "John Fleck", "John Toles-Bey", "Kevin Costner", "Kim Coates", "Lee Arenberg", "Leonardo Cimino", "Michael Jeter", "Neil Giuntoli", "R. D. Call", "Rick Aviles", "Robert A. Silverman", "Robert Joy", "Robert LaSardo", "Sab Shimono", "Sean Whalen", "Tina Majorino", "William Preston", "Zakes Mokae", "Zitto Kazann"], "relorg": ["Davis Entertainment", "Gordon Company", "Licht/Mueller Film Corporation", "Universal Pictures"], "relyear": 1995, "eidrid": "string", "imdbid": "tt0114898", "arbmeta": "{\"Title\": \"Waterworld\", \"Year\": \"1995\", \"Rated\": \"PG-13\", \"Released\": \"28 Jul 1995\", \"Runtime\": \"177 min\", \"Genre\": \"Action, Adventure, Sci-Fi\", \"Director\": \"Kevin Reynolds\", \"Writer\": \"Peter Rader, David Twohy\", \"Actors\": \"Kevin Costner, Jeanne Tripplehorn, Dennis Hopper\", \"Plot\": \"In a future where the polar ice-caps have melted and Earth is almost entirely submerged, a mutated mariner fights starvation and outlaw \"smokers,\" and reluctantly helps a woman and a young girl try to find dry land.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 1 Oscar. 6 wins & 9 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYzE4NTRmMDYtNWYzYi00YmNkLTk4NDEtYjFmMDc4ODQ3ODY2XkEyXkFqcGdeQXVyNTUyMzE4Mzg@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.2/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"45%\"}, {\"Source\": \"Metacritic\", \"Value\": \"56/100\"}], \"Metascore\": \"56\", \"imdbRating\": \"6.2\", \"imdbVotes\": \"195,972\", \"imdbID\": \"tt0114898\", \"Type\": \"movie\", \"DVD\": \"04 Nov 2008\", \"BoxOffice\": \"$88,246,220\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["action"], "synopsis": "[Extended Cut] In a future where the polar ice-caps have melted and Earth is almost entirely submerged, a mutated mariner fights starvation and outlaw \"smokers,\" and reluctantly helps a woman and a young girl try to find dry land."}], "06733bf7-0db1-40ce-8098-0d34e946832a": [{"artifactid": "06733bf7-0db1-40ce-8098-0d34e946832a", "title": "Zoolander", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "Zoolander.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 2001, "eidrid": "string", "imdbid": "tt0196229", "arbmeta": "{\"Title\": \"Zoolander\", \"Year\": \"2001\", \"Rated\": \"PG-13\", \"Released\": \"28 Sep 2001\", \"Runtime\": \"90 min\", \"Genre\": \"Comedy\", \"Director\": \"Ben Stiller\", \"Writer\": \"Drake Sather, Ben Stiller, John Hamburg\", \"Actors\": \"Ben Stiller, Owen Wilson, Christine Taylor\", \"Plot\": \"At the end of his career, a clueless fashion model is brainwashed to kill the Prime Minister of Malaysia.\", \"Language\": \"English\", \"Country\": \"Germany, United States, Australia\", \"Awards\": \"1 win & 11 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BODI4NDY2NDM5M15BMl5BanBnXkFtZTgwNzEwOTMxMDE@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.5/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"64%\"}, {\"Source\": \"Metacritic\", \"Value\": \"61/100\"}], \"Metascore\": \"61\", \"imdbRating\": \"6.5\", \"imdbVotes\": \"263,954\", \"imdbID\": \"tt0196229\", \"Type\": \"movie\", \"DVD\": \"12 Mar 2002\", \"BoxOffice\": \"$45,172,250\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy"]}], "e9253d1b-0711-4f65-b6e2-a6decc050ef6": [{"artifactid": "e9253d1b-0711-4f65-b6e2-a6decc050ef6", "title": "1941", "majtype": "movie", "runmins": 146, "season": -1, "episode": -1, "file": "1941-mpg.m4v", "filepath": "comedy", "director": ["Steven Spielberg"], "writer": ["Bob Gale", "Robert Zemeckis"], "primcast": ["Bobby Di Cicco", "Christopher Lee", "Dan Aykroyd", "Dianne Kay", "Eddie Deezen", "John Belushi", "John Candy", "Lionel Stander", "Lorraine Gary", "Murray Hamilton", "Nancy Allen", "Ned Beatty", "Robert Stack", "Slim Pickens", "Tim Matheson", "Toshir\u014d Mifune", "Treat Williams", "Warren Oates", "Wendie Jo Sperber"], "relorg": ["Universal Pictures"], "relyear": 1979, "eidrid": "string", "imdbid": "tt0078723", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "world_war_2"], "synopsis": "Director's Cut - Hysterical Californians prepare for a Japanese invasion in the days after Pearl Harbor."}], "d03dcf5a-8ca6-40f4-89f8-09d13559ab66": [{"artifactid": "d03dcf5a-8ca6-40f4-89f8-09d13559ab66", "title": "Star Trek: The Motion Picture", "majtype": "movie", "runmins": 132, "season": -1, "episode": -1, "file": "StarTrek1-mpg.m4v", "filepath": "scifi", "director": ["Robert Wise"], "writer": ["Harold Livingston"], "primcast": ["DeForest Kelley", "George Takei", "James Doohan", "Leonard Nimoy", "Majel Barrett", "Nichelle Nichols", "Persis Khambatta", "Stephen Collins", "Walter Koenig", "William Shatner"], "relorg": ["Paramount Pictures"], "relyear": 1979, "eidrid": "string", "imdbid": "tt0079945", "arbmeta": "{\"string\": \"string\", \"titleorig\": \"Star Trek: The Motion Picture\", \"titlelibrary\": \"Star Trek: The Motion Picture\",\"franchise\":\"Star Trek\"}", "tags": ["science_fiction"], "synopsis": "When an alien spacecraft of enormous power is spotted approaching Earth, Admiral James T. Kirk resumes command of the overhauled USS Enterprise in order to intercept it."}], "25abfc69-49db-4465-bce7-62b9e39feabd": [{"artifactid": "25abfc69-49db-4465-bce7-62b9e39feabd", "title": "The Best of The Colbert Report", "majtype": "movie", "runmins": 180, "season": -1, "episode": -1, "file": "tbo_colber-report-mpg.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["Stephen Colbert"], "relorg": ["string"], "relyear": 2007, "eidrid": "string", "imdbid": "none", "arbmeta": "{\"Response\": \"False\", \"Error\": \"Incorrect IMDb ID.\"}", "tags": ["comedy"], "synopsis": "The Best of The Colbert Report"}], "53aade09-535b-4c96-9c1e-695284f476c6": [{"artifactid": "53aade09-535b-4c96-9c1e-695284f476c6", "title": "ElephantParts", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "ElephantParts.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 1981, "eidrid": "string", "imdbid": "tt0082316", "arbmeta": "{\"Title\": \"Elephant Parts\", \"Year\": \"1981\", \"Rated\": \"N/A\", \"Released\": \"01 Jul 1981\", \"Runtime\": \"60 min\", \"Genre\": \"Comedy, Music\", \"Director\": \"William Dear\", \"Writer\": \"Michael Nesmith, Bill Martin, William Dear, Ezra D. Rappaport (additional material)\", \"Actors\": \"Michael Nesmith, Bill Martin, Lark Geib, Robert Ackerman\", \"Plot\": \"A collection of comedy skits and music videos, such as a game-show spoof called \"Name That Drug\", a visit to the office of the Clandestine Typing Service, and a man providing a skewed ...\", \"Language\": \"English\", \"Country\": \"USA\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTkxMjE1MzMxMl5BMl5BanBnXkFtZTcwOTc1MjIyMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.7/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.7\", \"imdbVotes\": \"342\", \"imdbID\": \"tt0082316\", \"Type\": \"movie\", \"DVD\": \"N/A\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy"]}], "ca6c898f-d7c4-44d9-ad70-ba0b393a63f4": [{"artifactid": "ca6c898f-d7c4-44d9-ad70-ba0b393a63f4", "title": "A Charlie Brown Christmas", "majtype": "movie", "runmins": 25, "season": -1, "episode": -1, "file": "CharlieBrownXMas_Title2.m4v", "filepath": "holiday", "director": ["Bill Melendez"], "writer": ["Charles M. Schulz"], "primcast": ["Ann Altieri", "Bill Melendez", "Chris Doran", "Christopher Shea", "Geoffrey Ornstein", "Karen Mendelson", "Kathy Steinberg", "Peter Robbins", "Sally Dryer", "Tracy Stratford"], "relorg": ["string"], "relyear": 1965, "eidrid": "string", "imdbid": "tt0059026", "arbmeta": "{\"string\": \"string\"}", "tags": ["holiday"], "synopsis": "Depressed at the commercialism he sees around him, Charlie Brown tries to find a deeper meaning to Christmas."}], "56fafebd-21cb-4b99-83f9-35cbe768f2d7": [{"artifactid": "56fafebd-21cb-4b99-83f9-35cbe768f2d7", "title": "Anne of Green Gables (Part 1)", "majtype": "movie", "runmins": 100, "season": -1, "episode": -1, "file": "AnneOfGreenGablesPart1.m4v", "filepath": "drama/AnneOfGreenGables", "director": ["Kevin Sullivan"], "writer": ["Joe Wiesenfeld", "Kevin Sullivan"], "primcast": ["Colleen Dewhurst", "Jonathan Crombie", "Marilyn Lightstone", "Megan Follows", "Patricia Hamilton", "Richard Farnsworth", "Schuyler Grant"], "relorg": ["CBC"], "relyear": 1985, "eidrid": "string", "imdbid": "tt0088727", "arbmeta": "{\"Title\": \"Anne of Green Gables\", \"Year\": \"1985\", \"Rated\": \"TV-G\", \"Released\": \"17 Feb 1986\", \"Runtime\": \"199 min\", \"Genre\": \"Drama, Family\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Megan Follows, Colleen Dewhurst, Richard Farnsworth\", \"Plot\": \"An orphan girl, sent to an elderly brother and sister by mistake, charms her new home and community with her fiery spirit and imagination.\", \"Language\": \"English\", \"Country\": \"Canada, West Germany, United States\", \"Awards\": \"Won 1 Primetime Emmy. 12 wins & 6 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNjBmYjU2YjQtNjc3NS00NmMzLTk3OWUtNDM0ZDEyOGQ4ZWI0XkEyXkFqcGdeQXVyMzU3MTc5OTE@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.5/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"83%\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.5\", \"imdbVotes\": \"20,979\", \"imdbID\": \"tt0088727\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["drama", "kitten"], "synopsis": "An orphan girl, sent to an elderly brother and sister by mistake, charms her new home and community with her fiery spirit and imagination."}], "93bd3736-2f79-464a-ae5a-b4c2709f06b3": [{"artifactid": "93bd3736-2f79-464a-ae5a-b4c2709f06b3", "title": "Stooges: The Men Behind The Mayhem", "majtype": "movie", "runmins": 63, "season": -1, "episode": -1, "file": "StoogesMenBehindTheMayhem.m4v", "filepath": "docu", "director": ["Paul E. Gierucki"], "writer": ["Paul E. Gierucki", "William Michael Hunt"], "primcast": ["Bonnie Bonnell", "Curly Howard", "Edward Bernds", "Janie Howard Hanky", "Joe Besser", "Joe DeRita", "Julie Gibson", "Larry Fine", "Lola Jensen", "Lyla Budnick", "Moe Howard", "Paul 'Mousie' Garner", "Paul E. Gierucki", "Shemp Howard", "Ted Healy", "Ted Healy Jr."], "relorg": ["string"], "relyear": 1994, "eidrid": "string", "imdbid": "tt0281229", "arbmeta": "{\"string\": \"string\"}", "tags": ["biography", "documentary"], "synopsis": "For six decades, the Three Stooges ran amuck in a riotous frenzy of eye-poking, ear-slapping, kicks, jabs, punches and frying pans to the cranium. Now Laughsmith Entertainment and A&E offer fans of the Moronic Maestros a chance to relive the Golden Age of Stoogery. Through rare recordings, exclusive interviews and outtakes of behind-the-scenes antics, \"Stooges: The Men behind the Mayhem\" tells the pure, uncensored Stooge story--from the early vaudeville years with Shemp and Ted Healy, through the golden years at Columbia Pictures with Curly, to the final feature films with Curly Joe DeRita, \"the last Stooge.\" Whether you're fascinated by the unrestrained id, or just enjoy the good, clean humor of pliers applied to the nose, you'll find something to love in this in-depth look at America's most beloved madcaps The Three Stooges!"}], "f026cdfc-bb69-4857-b48f-25a21a15db73": [{"artifactid": "f026cdfc-bb69-4857-b48f-25a21a15db73", "title": "The Last Remake of Beau Geste", "majtype": "movie", "runmins": 85, "season": -1, "episode": -1, "file": "TheLastRemakeOfBeauGeste.m4v", "filepath": "comedy", "director": ["Marty Feldman"], "writer": ["Chris Allen", "Marty Feldman"], "primcast": ["Ann-Margaret", "Henry Gibson", "James Earl Jones", "Marty Feldman", "Michael York", "Peter Ustinov", "Roy Kinnear", "Spike Milligan", "Terry-Thomas", "Trevor Howard"], "relorg": ["string", "Universal Pictures"], "relyear": 1977, "eidrid": "string", "imdbid": "tt0076297", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "An aging Sir Hector Geste (Trevor Howard) takes a young greedy wife who's after his famed Blue Water sapphire, but his sons hide the gem and join the French Foreign Legion in North Africa."}], "912e453c-8d54-47c7-abe9-4d61b424dc45": [{"artifactid": "912e453c-8d54-47c7-abe9-4d61b424dc45", "title": "One Flew Over The Cuckoo's Nest", "majtype": "movie", "runmins": 133, "season": -1, "episode": -1, "file": "OneFlewOverCuckoosNest.m4v", "filepath": "drama", "director": ["Milos Forman"], "writer": ["Bo Goldman", "Ken Kesey", "Lawrence Hauben"], "primcast": ["Jack Nicholson", "Louise Fletcher", "Michael Berryman"], "relorg": ["Fantasy Films", "United Artists"], "relyear": 1975, "eidrid": "string", "imdbid": "tt0073486", "arbmeta": "{\"Title\": \"One Flew Over the Cuckoo's Nest\", \"Year\": \"1975\", \"Rated\": \"R\", \"Released\": \"19 Nov 1975\", \"Runtime\": \"133 min\", \"Genre\": \"Drama\", \"Director\": \"Milos Forman\", \"Writer\": \"Lawrence Hauben, Bo Goldman, Ken Kesey\", \"Actors\": \"Jack Nicholson, Louise Fletcher, Michael Berryman\", \"Plot\": \"In the Fall of 1963, a Korean War veteran and criminal pleads insanity and is admitted to a mental institution, where he rallies up the scared patients against the tyrannical nurse.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 5 Oscars. 38 wins & 16 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZjA0OWVhOTAtYWQxNi00YzNhLWI4ZjYtNjFjZTEyYjJlNDVlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.7/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"93%\"}, {\"Source\": \"Metacritic\", \"Value\": \"84/100\"}], \"Metascore\": \"84\", \"imdbRating\": \"8.7\", \"imdbVotes\": \"997,860\", \"imdbID\": \"tt0073486\", \"Type\": \"movie\", \"DVD\": \"16 Dec 1997\", \"BoxOffice\": \"$108,981,275\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["drama", "new"], "synopsis": "In the Fall of 1963, a Korean War veteran and criminal pleads insanity and is admitted to a mental institution, where he rallies up the scared patients against the tyrannical nurse."}], "5b4006c9-7c17-4040-8dfb-f6d79100a33d": [{"artifactid": "5b4006c9-7c17-4040-8dfb-f6d79100a33d", "title": "Trainwreck", "majtype": "movie", "runmins": 125, "season": -1, "episode": -1, "file": "Trainwreck.m4v", "filepath": "comedy", "director": ["Judd Apatow"], "writer": ["Amy Schumer"], "primcast": ["Amy Schumer", "Bill Hader", "Brie Larson", "Colin Quinn", "John Cena", "LeBron James", "Tilda Swinton"], "relorg": ["Universal Pictures"], "relyear": 2015, "eidrid": "string", "imdbid": "tt3152624", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "kitten"], "synopsis": "Having thought that monogamy was never possible, a commitment-phobic career woman may have to face her fears when she meets a good guy."}], "98f97e19-a027-4a8b-af96-0e886142c953": [{"artifactid": "98f97e19-a027-4a8b-af96-0e886142c953", "title": "I Feel Pretty", "majtype": "movie", "runmins": 110, "season": -1, "episode": -1, "file": "AmySchumerIFeelPretty.m4v", "filepath": "comedy", "director": ["Abby Kohn", "Marc Silverstein"], "writer": ["Abby Kohn", "Marc Silverstein"], "primcast": ["Aidy Bryant", "Amy Schumer", "Emily Ratajkowski", "Lauren Hutton", "Michelle Williams", "Naomi Campbell", "Rory Scovel", "Tom Hopper"], "relorg": ["H. Brothers", "STX Entertainment", "STXfilms", "Tang Media Productions", "Voltage Pictures", "Wonderland"], "relyear": 2018, "eidrid": "string", "imdbid": "tt6791096", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "kitten"], "synopsis": "A woman struggling with insecurity wakes from a fall believing she is the most beautiful and capable woman on the planet. Her new confidence empowers her to live fearlessly, but what happens when she realizes her appearance never changed?"}], "487598cb-9b6c-47e5-8908-500a6d32e986": [{"artifactid": "487598cb-9b6c-47e5-8908-500a6d32e986", "title": "The Aviator", "majtype": "movie", "runmins": 170, "season": -1, "episode": -1, "file": "aviator-mpg.m4v", "filepath": "boats", "director": ["Martin Scorsese"], "writer": ["John Logan"], "primcast": ["Alan Alda", "Alec Baldwin", "Cate Blanchett", "John C. Reilly", "Jude Law", "Kate Beckinsale", "Leonardo DiCaprio"], "relorg": ["Miramax Films"], "relyear": 2004, "eidrid": "string", "imdbid": "tt0338751", "arbmeta": "{\"Title\": \"The Aviator\", \"Year\": \"2004\", \"Rated\": \"PG-13\", \"Released\": \"25 Dec 2004\", \"Runtime\": \"170 min\", \"Genre\": \"Biography, Drama\", \"Director\": \"Martin Scorsese\", \"Writer\": \"John Logan\", \"Actors\": \"Leonardo DiCaprio, Cate Blanchett, Kate Beckinsale\", \"Plot\": \"A biopic depicting the early years of legendary director and aviator Howard Hughes' career from the late 1920s to the mid 1940s.\", \"Language\": \"Persian, English\", \"Country\": \"United States, Germany\", \"Awards\": \"Won 5 Oscars. 85 wins & 131 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZTYzMjA2M2EtYmY1OC00ZWMxLThlY2YtZGI3MTQzOWM4YjE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.5/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"86%\"}, {\"Source\": \"Metacritic\", \"Value\": \"77/100\"}], \"Metascore\": \"77\", \"imdbRating\": \"7.5\", \"imdbVotes\": \"360,155\", \"imdbID\": \"tt0338751\", \"Type\": \"movie\", \"DVD\": \"24 May 2005\", \"BoxOffice\": \"$102,610,330\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["based_on_a_true_story", "drama", "world_war_2"], "synopsis": "A biopic depicting the early years of legendary director and aviator Howard Hughes' career from the late 1920s to the mid 1940s."}], "3559eaa9-1de2-4e16-8a2b-126acb6f9233": [{"artifactid": "3559eaa9-1de2-4e16-8a2b-126acb6f9233", "title": "Sneakers", "majtype": "movie", "runmins": 126, "season": -1, "episode": -1, "file": "Sneakers.m4v", "filepath": "comedy", "director": ["Phil Alden Robinson"], "writer": ["Lawrence Lasker", "Phil Alden Robinson", "Walter F. Parkes", "Walter Parkes"], "primcast": ["Ben Kingsley", "Dan Aykroyd", "David Strathairn", "Donal Logue", "Eddie Jones", "George Hearn", "James Earl Jones", "Lee Garlington", "Mary McDonnell", "River Phoenix", "Robert Redford", "Sidney Poitier", "Stephen Tobolowsky", "Timothy Busfield"], "relorg": ["Universal Studios"], "relyear": 1992, "eidrid": "string", "imdbid": "tt0105435", "arbmeta": "{\"Title\": \"Sneakers\", \"Year\": \"1992\", \"Rated\": \"PG-13\", \"Released\": \"11 Sep 1992\", \"Runtime\": \"126 min\", \"Genre\": \"Comedy, Crime, Drama\", \"Director\": \"Phil Alden Robinson\", \"Writer\": \"Phil Alden Robinson, Lawrence Lasker, Walter F. Parkes\", \"Actors\": \"Robert Redford, Dan Aykroyd, Sidney Poitier\", \"Plot\": \"A security pro finds his past coming back to haunt him, when he and his unique team are tasked with retrieving a particularly important item.\", \"Language\": \"English, Russian, Chinese\", \"Country\": \"United States\", \"Awards\": \"2 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZTg0MTU0Y2YtNWEyNC00NDU3LWJhNjYtZGIzMWI0YWMwMTdhXkEyXkFqcGdeQXVyNjMwMjk0MTQ@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.1/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"80%\"}, {\"Source\": \"Metacritic\", \"Value\": \"65/100\"}], \"Metascore\": \"65\", \"imdbRating\": \"7.1\", \"imdbVotes\": \"59,085\", \"imdbID\": \"tt0105435\", \"Type\": \"movie\", \"DVD\": \"18 Jan 2005\", \"BoxOffice\": \"$51,432,691\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy", "drama", "heist", "intrigue", "technology"], "synopsis": "A security pro finds his past coming back to haunt him, when he and his unique team are tasked with retrieving a particularly important item."}], "19a808dd-61ac-4676-abeb-2892c001205e": [{"artifactid": "19a808dd-61ac-4676-abeb-2892c001205e", "title": "Shaun of the Dead", "majtype": "movie", "runmins": 99, "season": -1, "episode": -1, "file": "shaun_of_the_dead-mpg.m4v", "filepath": "comedy", "director": ["Edgar Wright"], "writer": ["Edgar Wright", "Simon Pegg"], "primcast": ["Bill Nighy", "Dylan Moran", "Jessica Stevenson", "Julia Deakin", "Kate Ashfield", "Lucy Davis", "Martin Freeman", "Matt Lucas", "Nick Frost", "Penelope Wilton", "Peter Serafinowicz", "Rafe Spall", "Reece Shearsmith", "Simon Pegg", "Tamsin Greig"], "relorg": ["string"], "relyear": 2004, "eidrid": "string", "imdbid": "tt0365748", "arbmeta": "{\"Title\": \"Shaun of the Dead\", \"Year\": \"2004\", \"Rated\": \"R\", \"Released\": \"24 Sep 2004\", \"Runtime\": \"99 min\", \"Genre\": \"Comedy, Horror\", \"Director\": \"Edgar Wright\", \"Writer\": \"Simon Pegg, Edgar Wright\", \"Actors\": \"Simon Pegg, Nick Frost, Kate Ashfield\", \"Plot\": \"The uneventful, aimless lives of a London electronics salesman and his layabout roommate are disrupted by the zombie apocalypse.\", \"Language\": \"English\", \"Country\": \"United Kingdom, France, United States\", \"Awards\": \"Nominated for 3 BAFTA 13 wins & 20 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTg5Mjk2NDMtZTk0Ny00YTQ0LWIzYWEtMWI5MGQ0Mjg1OTNkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.9/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"92%\"}, {\"Source\": \"Metacritic\", \"Value\": \"76/100\"}], \"Metascore\": \"76\", \"imdbRating\": \"7.9\", \"imdbVotes\": \"553,356\", \"imdbID\": \"tt0365748\", \"Type\": \"movie\", \"DVD\": \"21 Dec 2004\", \"BoxOffice\": \"$13,542,874\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "The uneventful, aimless lives of a London electronics salesman and his layabout roommate are disrupted by the zombie apocalypse."}], "b973a96d-45c6-4d35-87fa-c96ad68125aa": [{"artifactid": "b973a96d-45c6-4d35-87fa-c96ad68125aa", "title": "The Andromeda Strain", "majtype": "movie", "runmins": 130, "season": -1, "episode": -1, "file": "AndromedaStrain.m4v", "filepath": "scifi", "director": ["Robert Wise"], "writer": ["Nelson Gidding"], "primcast": ["Arthur Hill", "David Wayne", "George Mitchell", "James Olson", "Kate Reid", "Paula Kelly"], "relorg": ["Universal Pictures"], "relyear": 1971, "eidrid": "string", "imdbid": "tt0066769", "arbmeta": "{\"Title\": \"The Andromeda Strain\", \"Year\": \"1971\", \"Rated\": \"G\", \"Released\": \"12 Mar 1971\", \"Runtime\": \"2 min\", \"Genre\": \"Mystery, Sci-Fi, Thriller\", \"Director\": \"Robert Wise\", \"Writer\": \"Michael Crichton, Nelson Gidding\", \"Actors\": \"James Olson, Arthur Hill, David Wayne\", \"Plot\": \"A team of top scientists work feverishly in a secret, state-of-the-art laboratory to discover what has killed the citizens of a small town and learn how this deadly contagion can be stopped.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 2 Oscars. 4 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYzY4NGZkOTMtNTRjNy00NWY4LWI2ZmUtODc3NWY3MTBhNzE2XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.2/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"67%\"}, {\"Source\": \"Metacritic\", \"Value\": \"60/100\"}], \"Metascore\": \"60\", \"imdbRating\": \"7.2\", \"imdbVotes\": \"37,504\", \"imdbID\": \"tt0066769\", \"Type\": \"movie\", \"DVD\": \"01 Apr 2003\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["science_fiction"]}], "e9ffd375-35f5-4d66-9a7c-d9f2b6efca94": [{"artifactid": "e9ffd375-35f5-4d66-9a7c-d9f2b6efca94", "title": "2010: The Year We Make Contact", "majtype": "movie", "runmins": 116, "season": -1, "episode": -1, "file": "2010.m4v", "filepath": "scifi", "director": ["Peter Hyams"], "writer": ["Peter Hyams"], "primcast": ["Bob Balaban", "Dana Elcar", "Douglas Rain", "Elya Baskin", "Helen Mirren", "James McEachin", "John Lithgow", "Keir Dullea", "Madolyn Smith", "Mary Jo Deschanel", "Natasha Shneider", "Oleg Rudnik", "Roy Scheider", "Savely Kramarov", "Taliesin Jaffe", "Vladimir Skomarovsky"], "relorg": ["Metro-Goldwyn-Mayer", "MGM/UA Entertainment Co."], "relyear": 1984, "eidrid": "string", "imdbid": "tt0086837", "arbmeta": "{\"Title\": \"2010: The Year We Make Contact\", \"Year\": \"1984\", \"Rated\": \"PG\", \"Released\": \"07 Dec 1984\", \"Runtime\": \"116 min\", \"Genre\": \"Adventure, Mystery, Sci-Fi\", \"Director\": \"Peter Hyams\", \"Writer\": \"Arthur C. Clarke, Peter Hyams\", \"Actors\": \"Roy Scheider, John Lithgow, Helen Mirren\", \"Plot\": \"A joint USA-Soviet expedition is sent to Jupiter to learn exactly what happened to the \"Discovery\" and its H.A.L. 9000 computer.\", \"Language\": \"English, Russian\", \"Country\": \"United States\", \"Awards\": \"Nominated for 5 Oscars. 1 win & 8 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOTU1NDQwZjQtODc2YS00MTE4LWE5YTctMmYwYmNiYTU2MzRmXkEyXkFqcGdeQXVyODU2MDg1NzU@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.7/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"66%\"}, {\"Source\": \"Metacritic\", \"Value\": \"53/100\"}], \"Metascore\": \"53\", \"imdbRating\": \"6.7\", \"imdbVotes\": \"53,440\", \"imdbID\": \"tt0086837\", \"Type\": \"movie\", \"DVD\": \"19 Sep 2000\", \"BoxOffice\": \"$40,400,657\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["science_fiction"], "synopsis": "A joint USA-Soviet expedition is sent to Jupiter to learn exactly what happened to the \"Discovery\" and its H.A.L. 9000 computer."}], "bd96a7cf-f725-449e-8256-d9bce4559ba7": [{"artifactid": "bd96a7cf-f725-449e-8256-d9bce4559ba7", "title": "Downfall.m4v", "majtype": "movie", "runmins": 156, "season": -1, "episode": -1, "file": "Downfall.m4v", "filepath": "boats", "director": ["Oliver Hirschbiegel"], "writer": ["Bernd Eichinger"], "primcast": ["Alexander Held", "Alexandra Maria Lara", "Bruno Ganz", "Christian Berkel", "Corinna Harfouch", "Heino Ferch", "Juliane K\u00f6hler", "Matthias Habich", "Thomas Kretschmann", "Ulrich Matthes"], "relorg": ["Constantin Film"], "relyear": 2004, "eidrid": "string", "imdbid": "tt0363163", "arbmeta": "{\"string\": \"string\"}", "tags": ["based_on_a_true_story", "new", "world_war_2"], "synopsis": "Traudl Junge, the final secretary for Adolf Hitler, tells of the Nazi dictator's final days in his Berlin bunker at the end of WWII."}], "93d6764b-4553-4c2e-b825-d93cd26167ec": [{"artifactid": "93d6764b-4553-4c2e-b825-d93cd26167ec", "title": "Big Hero 6", "majtype": "movie", "runmins": 102, "season": -1, "episode": -1, "file": "BigHero6.m4v", "filepath": "comedy", "director": ["Chris Williams", "Don Hall"], "writer": ["Dan Gerson", "Jordan Roberts", "Robert L. Baird"], "primcast": ["Alan Tudyk", "Damon Wayans Jr.", "Daniel Henney", "Genesis Rodriguez", "James Cromwell", "Jamie Chung", "Maya Rudolph", "Ryan Potter", "Scott Adsit", "T.J. Miller"], "relorg": ["", "Walt Disney Animation Studios", "Walt Disney Pictures"], "relyear": 2015, "eidrid": "string", "imdbid": "tt2245084", "arbmeta": "{\"string\": \"string\"}", "tags": ["action", "adventure", "animation", "comedy"], "synopsis": "A special bond develops between plus-sized inflatable robot Baymax and prodigy Hiro Hamada, who together team up with a group of friends to form a band of high-tech heroes."}], "da235d5e-b37b-41a5-9f03-284cb902e89e": [{"artifactid": "da235d5e-b37b-41a5-9f03-284cb902e89e", "title": "Greg Davies: The Back Of My Mums Head", "majtype": "movie", "runmins": 84, "season": -1, "episode": -1, "file": "GregDavies-BackOfMumsHead.m4v", "filepath": "comedy", "director": ["string"], "writer": ["Greg Davies"], "primcast": ["Greg Davies"], "relorg": ["string"], "relyear": 2013, "eidrid": "string", "imdbid": "tt3387320", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "new", "stand-up"], "synopsis": "Greg Davies' acclaimed live comedy. Stung by his mother's suggestion that he is 'not normal', Greg puts everyone under the microscope."}], "457e6c3c-591e-46ab-8b75-c7ed31d0cfbc": [{"artifactid": "457e6c3c-591e-46ab-8b75-c7ed31d0cfbc", "title": "TimMinchinBack.m4v", "majtype": "movie", "runmins": 132, "season": -1, "episode": -1, "file": "TimMinchinBack.m4v", "filepath": "comedy", "director": ["string"], "writer": ["Tim Minchin"], "primcast": ["Tim Minchin"], "relorg": ["string"], "relyear": 2022, "eidrid": "string", "imdbid": "tt24518132", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "concert", "new"]}], "b16596a5-6d77-4e94-a617-8b87155828ed": [{"artifactid": "b16596a5-6d77-4e94-a617-8b87155828ed", "title": "Greg Davies: Firing Cheeseballs At A Dog", "majtype": "movie", "runmins": 76, "season": -1, "episode": -1, "file": "GregDavies-FiringCheeseballs.m4v", "filepath": "comedy", "director": ["string"], "writer": ["Greg Davies"], "primcast": ["Greg Davies"], "relorg": ["string"], "relyear": 2011, "eidrid": "string", "imdbid": "tt2396686", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "new", "stand-up"], "synopsis": "Greg Davies hotly anticipated debut stand-up was a smash hit at the 2010 Edinburgh festival. It promises to address every single issue important to the human race... It lies... But it'll be funny!"}], "c7e34b0f-d3ea-4521-b39a-99b3d89812a6": [{"artifactid": "c7e34b0f-d3ea-4521-b39a-99b3d89812a6", "title": "Jo Brand: Barely Live", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "JoBrandBarelyLive.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": -1, "eidrid": "string", "imdbid": "string", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy", "new", "stand-up"]}], "69583984-ebab-46c1-be6b-86796c6fef22": [{"artifactid": "69583984-ebab-46c1-be6b-86796c6fef22", "title": "Sarah Millican: Bobby Dazzler", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "SarahMillican_BobbyDazzler.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": -1, "eidrid": "string", "imdbid": "tt26687384", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy", "new", "stand-up"]}], "c8f35db3-7525-418e-b23a-4a610ae4654f": [{"artifactid": "c8f35db3-7525-418e-b23a-4a610ae4654f", "title": "Jon Richardson: Nidiot", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "JonRichardson_Nidiot.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": -1, "eidrid": "string", "imdbid": "string", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy", "new", "stand-up"]}], "b53e9f60-b76b-4781-9014-85be9bed1679": [{"artifactid": "b53e9f60-b76b-4781-9014-85be9bed1679", "title": "Ice Station Zebra", "majtype": "movie", "runmins": 148, "season": -1, "episode": -1, "file": "IceStationZebra.m4v", "filepath": "drama", "director": ["John Sturges"], "writer": ["Alistair MacLean", "Douglas Heyes", "Harry Julian Fink"], "primcast": ["Ernest Borgnine", "Patrick McGoohan", "Rock Hudson"], "relorg": ["string"], "relyear": 1968, "eidrid": "string", "imdbid": "tt0063121", "arbmeta": "{\"Title\": \"Ice Station Zebra\", \"Year\": \"1968\", \"Rated\": \"G\", \"Released\": \"23 Oct 1968\", \"Runtime\": \"2 min\", \"Genre\": \"Adventure, Thriller\", \"Director\": \"John Sturges\", \"Writer\": \"Alistair MacLean, Douglas Heyes, Harry Julian Fink\", \"Actors\": \"Rock Hudson, Ernest Borgnine, Patrick McGoohan\", \"Plot\": \"USN nuclear sub USS Tigerfish must rush to the North Pole to rescue the staff of Drift Ice Station Zebra weather station.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 2 Oscars. 2 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNWFmM2FjNjQtNzk5Ny00NDcxLWFiZTEtYmVjMjMxZWQ3NDA3XkEyXkFqcGdeQXVyMjI4MjA5MzA@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.6/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"47%\"}, {\"Source\": \"Metacritic\", \"Value\": \"49/100\"}], \"Metascore\": \"49\", \"imdbRating\": \"6.6\", \"imdbVotes\": \"10,491\", \"imdbID\": \"tt0063121\", \"Type\": \"movie\", \"DVD\": \"27 Sep 2005\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["cold_war", "drama"], "synopsis": "USN nuclear sub USS Tigerfish must rush to the North Pole to rescue the staff of Drift Ice Station Zebra weather station."}], "d055800c-314e-49b6-9903-6cf453addacc": [{"artifactid": "d055800c-314e-49b6-9903-6cf453addacc", "title": "The Cleaner", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/TheCleaner", "director": [], "writer": ["Greg Davies"], "primcast": ["Greg Davies"], "relorg": ["BBC One"], "relyear": 2021, "eidrid": "string", "imdbid": "tt12994356", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy"], "synopsis": "Paul 'Wicky' Wickstead, a state-certified cleaning technician, is responsible for the removal of any signs of death from crime scenes."}], "051bdfca-0418-4943-802e-6d20875822f9": [{"artifactid": "051bdfca-0418-4943-802e-6d20875822f9", "title": "The Imitation Game", "majtype": "movie", "runmins": 114, "season": -1, "episode": -1, "file": "ImitationGame.m4v", "filepath": "boats", "director": ["Morten Tyldum"], "writer": ["Andrew Hodges", "Graham Moore"], "primcast": ["Benedict Cumberbatch", "Keira Knightley", "Matthew Goode"], "relorg": ["string"], "relyear": 2014, "eidrid": "string", "imdbid": "tt2084970", "arbmeta": "{\"Title\": \"The Imitation Game\", \"Year\": \"2014\", \"Rated\": \"PG-13\", \"Released\": \"25 Dec 2014\", \"Runtime\": \"114 min\", \"Genre\": \"Biography, Drama, Thriller\", \"Director\": \"Morten Tyldum\", \"Writer\": \"Graham Moore, Andrew Hodges\", \"Actors\": \"Benedict Cumberbatch, Keira Knightley, Matthew Goode\", \"Plot\": \"During World War II, the English mathematical genius Alan Turing tries to crack the German Enigma code with help from fellow mathematicians while attempting to come to terms with his troubled private life.\", \"Language\": \"English, German\", \"Country\": \"United Kingdom, United States\", \"Awards\": \"Won 1 Oscar. 49 wins & 165 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOTgwMzFiMWYtZDhlNS00ODNkLWJiODAtZDVhNzgyNzJhYjQ4L2ltYWdlXkEyXkFqcGdeQXVyNzEzOTYxNTQ@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"90%\"}, {\"Source\": \"Metacritic\", \"Value\": \"71/100\"}], \"Metascore\": \"71\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"759,696\", \"imdbID\": \"tt2084970\", \"Type\": \"movie\", \"DVD\": \"31 Mar 2015\", \"BoxOffice\": \"$91,125,683\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["based_on_a_true_story", "world_war_2"], "synopsis": "During World War II, the English mathematical genius Alan Turing tries to crack the German Enigma code with help from fellow mathematicians while attempting to come to terms with his troubled private life."}], "0848f99b-272a-4024-8010-c2ecfa423888": [{"artifactid": "0848f99b-272a-4024-8010-c2ecfa423888", "title": "Gia", "majtype": "movie", "runmins": 1998, "season": -1, "episode": -1, "file": "Gia.m4v", "filepath": "boats", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 1998, "eidrid": "string", "imdbid": "tt0123865", "arbmeta": "{\"Title\": \"Gia\", \"Year\": \"1998\", \"Rated\": \"R\", \"Released\": \"31 Jan 1998\", \"Runtime\": \"120 min\", \"Genre\": \"Biography, Drama, Romance\", \"Director\": \"Michael Cristofer\", \"Writer\": \"Jay McInerney, Michael Cristofer\", \"Actors\": \"Angelina Jolie, Faye Dunaway, Elizabeth Mitchell\", \"Plot\": \"The story of the life of Gia Carangi, a top fashion model from the late 1970s, from her meteoric rise to the forefront of the modeling industry, to her untimely death.\", \"Language\": \"English, German, French\", \"Country\": \"United States\", \"Awards\": \"Won 1 Primetime Emmy. 10 wins & 13 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNDlhNjljMDMtOGFiYS00NTFjLWE4MDEtOGJmYmFhY2ZjMDEwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.9/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"93%\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"6.9\", \"imdbVotes\": \"45,552\", \"imdbID\": \"tt0123865\", \"Type\": \"movie\", \"DVD\": \"18 Jul 2000\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["based_on_a_true_story"]}], "0f3ae067-76cd-4a0b-a0f2-0acd60ea2134": [{"artifactid": "0f3ae067-76cd-4a0b-a0f2-0acd60ea2134", "title": "police_squad-mpg.m4v", "majtype": "movie", "runmins": -1, "season": -1, "episode": -1, "file": "police_squad-mpg.m4v", "filepath": "comedy", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 1982, "eidrid": "string", "imdbid": "tt0083466", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "police_procedural"]}], "48d00929-8f80-4cf8-873a-224f3ebed793": [{"artifactid": "48d00929-8f80-4cf8-873a-224f3ebed793", "title": "From The Earth To The Moon", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "boats/FromTheEarthToTheMoon", "director": [], "writer": [], "primcast": ["Lane Smith", "Nick Searcy", "Tom Hanks"], "relorg": [], "relyear": 1998, "eidrid": "string", "imdbid": "tt0120570", "arbmeta": "{\"Title\": \"From the Earth to the Moon\", \"Year\": \"1998\", \"Rated\": \"TV-14\", \"Released\": \"05 Apr 1998\", \"Runtime\": \"2 min\", \"Genre\": \"Action, Drama, History\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Tom Hanks, Nick Searcy, Lane Smith\", \"Plot\": \"Dramatized portrayal of the Apollo manned space program.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 3 Primetime Emmys. 22 wins & 33 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOWIzMjU1OTQtY2QwNC00YTUwLTg2NmUtYzg2ZDQ3YTkzNzA4XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.6/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.6\", \"imdbVotes\": \"12,261\", \"imdbID\": \"tt0120570\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["based_on_a_true_story", "space_race"], "synopsis": "Dramatized portrayal of the Apollo manned space program."}], "e019ff17-9988-4861-bf13-a5a0de75de84": [{"artifactid": "e019ff17-9988-4861-bf13-a5a0de75de84", "title": "The Newsroom", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "drama/TheNewsroom", "director": [], "writer": ["Aaron Sorkin"], "primcast": ["Emily Mortimer", "Jeff Daniels", "John Gallagher Jr."], "relorg": [], "relyear": 2012, "eidrid": "string", "imdbid": "tt1870479", "arbmeta": "{\"Title\": \"The Newsroom\", \"Year\": \"2012u20132014\", \"Rated\": \"TV-MA\", \"Released\": \"24 Jun 2012\", \"Runtime\": \"55 min\", \"Genre\": \"Drama\", \"Director\": \"N/A\", \"Writer\": \"Aaron Sorkin\", \"Actors\": \"Jeff Daniels, Emily Mortimer, John Gallagher Jr.\", \"Plot\": \"A newsroom undergoes some changes in its workings and morals as a new team is brought in, bringing unexpected results for its existing news anchor.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 1 Primetime Emmy. 9 wins & 32 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZDI0OWIwMTgtZGIyOC00ODRhLWIwNjAtOWViZmMwOWYwOGViXkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.6/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.6\", \"imdbVotes\": \"115,044\", \"imdbID\": \"tt1870479\", \"Type\": \"series\", \"totalSeasons\": \"3\", \"Response\": \"True\"}", "tags": ["drama"], "synopsis": "A newsroom undergoes some changes in its workings and morals as a new team is brought in, bringing unexpected results for its existing news anchor."}], "e0a80e99-ac6b-49fa-852b-0b70e9300d1f": [{"artifactid": "e0a80e99-ac6b-49fa-852b-0b70e9300d1f", "title": "Engineering An Empire", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/EngineeringaAnEmpire", "director": [], "writer": [], "primcast": [], "relorg": [], "relyear": 1995, "eidrid": "string", "imdbid": "tt0848954", "arbmeta": "{\"string\": \"string\"}", "tags": ["documentary"], "synopsis": "A Documentary series hosted by Peter Weller which discusses some of the world's great empires.  [Note: IMDB lists episodes numbered 1 to 14, but skips #2.  This series was acquired on DVD as a bundle published by The History Channel, and there was an issue with Disc 3, Episode 1, and the set did not include the episode on Rome.]"}], "e29b9ae9-6e5e-416c-b15b-5bba98a0a962": [{"artifactid": "e29b9ae9-6e5e-416c-b15b-5bba98a0a962", "title": "Still Game", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/StillGame", "director": [], "writer": ["Ford Kiernan", "Greg Hemphill"], "primcast": ["Ford Kiernan", "Gavin Mitchell", "Greg Hemphill", "James Martin", "Jane McCarry", "Mark Cox", "Paul Riley", "Sanjeev Kohli"], "relorg": ["BBC"], "relyear": 2003, "eidrid": "string", "imdbid": "tt0281491", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy"], "synopsis": "Cult Scottish comedy about the lives of two OAP's Jack and Victor and their views on how it used to be in the old days and how bad it is now in the fictional area of Craiglang, Glasgow."}], "ed308628-d4bf-4dde-acf5-f3a84d74b1dc": [{"artifactid": "ed308628-d4bf-4dde-acf5-f3a84d74b1dc", "title": "The Goes Wrong Show", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/TheGoesWrongShow", "director": [], "writer": [], "primcast": ["Bryony Corrigan", "Charlie Russell", "Henry Shields"], "relorg": [], "relyear": 2019, "eidrid": "string", "imdbid": "tt9860664", "arbmeta": "{\"Title\": \"The Goes Wrong Show\", \"Year\": \"2019u2013\", \"Rated\": \"TV-PG\", \"Released\": \"15 Aug 2020\", \"Runtime\": \"29 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"Henry Lewis, Jonathan Sayer, Henry Shields\", \"Actors\": \"Henry Shields, Bryony Corrigan, Charlie Russell\", \"Plot\": \"A series of brand new, hand-crafted, half hours of theatrical catastrophe as The Cornley Polytechnic Drama Society undertake more (overly) ambitious endeavours.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"1 win & 1 nomination\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMzdkZjI2NWUtZTFhNi00MWNjLWJlYjItODNlMTZjZmIyNTBhXkEyXkFqcGdeQXVyMTEyOTM3MTg3._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.5/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.5\", \"imdbVotes\": \"2,196\", \"imdbID\": \"tt9860664\", \"Type\": \"series\", \"totalSeasons\": \"2\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "A series of brand new, hand-crafted, half hours of theatrical catastrophe as The Cornley Polytechnic Drama Society undertake more (overly) ambitious endeavours."}], "f55c8c4d-511b-49e5-8e6b-c8be152fa4b8": [{"artifactid": "f55c8c4d-511b-49e5-8e6b-c8be152fa4b8", "title": "Frost/Nixon: The Complete Interviews", "majtype": "tvseries", "runmins": 90, "season": -1, "episode": -1, "file": "", "filepath": "docu/FrostNixonComplete", "director": ["Jorn H. Winther"], "writer": [], "primcast": ["David Frost", "Richard Nixon"], "relorg": [], "relyear": 1977, "eidrid": "string", "imdbid": "tt0261639", "arbmeta": "{\"Title\": \"David Frost Interviews Richard Nixon\", \"Year\": \"1977\", \"Rated\": \"Not Rated\", \"Released\": \"04 May 1977\", \"Runtime\": \"85 min\", \"Genre\": \"Documentary, History\", \"Director\": \"Jorn H. Winther\", \"Writer\": \"N/A\", \"Actors\": \"David Frost, Richard Nixon\", \"Plot\": \"Originally broadcast in May of 1977, this series of interviews between Sir David Frost and U.S. President Richard Nixon, delves into the various controversies of Nixon's presidency, including (most famously) the Watergate scandal....\", \"Language\": \"English\", \"Country\": \"United Kingdom, United States\", \"Awards\": \"N/A\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTU4OTY3Mzg5NV5BMl5BanBnXkFtZTcwMzc1ODI3Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"438\", \"imdbID\": \"tt0261639\", \"Type\": \"movie\", \"DVD\": \"20 Apr 2017\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["documentary"], "synopsis": "Originally broadcast in May of 1977, this series of interviews between Sir David Frost and U.S. President Richard Nixon, delves into the various controversies of Nixon's presidency, including (most famously) the Watergate scandal...."}], "f7d84e14-f7b0-4700-abfe-9c3ad796506b": [{"artifactid": "f7d84e14-f7b0-4700-abfe-9c3ad796506b", "title": "Jeeves And Wooster", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "comedy/JeevesAndWooster", "director": [], "writer": ["Clive Exton", "P. G. Wodehouse"], "primcast": ["Charlotte Attenborough", "Diana Blackburn", "Elizabeth Kettle", "Elizabeth Morton", "Elizabeth Spriggs", "Fiona Gillies", "Francesca Folan", "Hugh Laurie", "Jane Downs", "Jean Heywood", "John Turner", "John Woodnutt", "Mary Wimbush", "Michael Siberry", "Nicholas Palliser", "Patricia Lawrence", "Philip Locke", "Pip Torrens", "Richard Braine", "Richard Garnett", "Robert Daws", "Roger Brierley", "Simon Treves", "Stephen Fry", "Vivian Pickles"], "relorg": ["Granada Television", "Picture Partnership Productions"], "relyear": 1990, "eidrid": "string", "imdbid": "tt0098833", "arbmeta": "{\"Title\": \"Jeeves and Wooster\", \"Year\": \"1990u20131993\", \"Rated\": \"TV-PG\", \"Released\": \"22 Apr 1990\", \"Runtime\": \"55 min\", \"Genre\": \"Comedy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Stephen Fry, Hugh Laurie, Richard Dixon\", \"Plot\": \"Bertram Wooster, a well-intentioned, wealthy layabout, has a habit of getting himself into trouble and it's up to his brilliant valet, Jeeves, to get him out.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Won 2 BAFTA 2 wins & 3 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNTExZDVkM2YtZTJkMS00NmU4LTk4YmQtZDZkOTJjMzZlYWFiXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.4/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.4\", \"imdbVotes\": \"12,480\", \"imdbID\": \"tt0098833\", \"Type\": \"series\", \"totalSeasons\": \"4\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "Bertram Wooster, a well-intentioned, wealthy layabout, has a habit of getting himself into trouble and it's up to his brilliant valet, Jeeves, to get him out."}], "0ddeff78-c3c4-4dc2-8d2f-a60111436be1": [{"artifactid": "0ddeff78-c3c4-4dc2-8d2f-a60111436be1", "title": "Tron", "majtype": "movie", "runmins": 96, "season": -1, "episode": -1, "file": "Tron20ThAnniversary.m4v", "filepath": "scifi", "director": ["Steven Lisberger"], "writer": ["Steven Lisberger"], "primcast": ["Barnard Hughes", "Bruce Boxleitner", "Cindy Morgan", "David Warner", "Jeff Bridges"], "relorg": ["Buena Vista Distribution", "Lisberger-Kushner Productions", "Walt Disney Productions"], "relyear": 1982, "eidrid": "string", "imdbid": "tt0084827", "arbmeta": "{\"Title\": \"TRON\", \"Year\": \"1982\", \"Rated\": \"PG\", \"Released\": \"09 Jul 1982\", \"Runtime\": \"96 min\", \"Genre\": \"Action, Adventure, Sci-Fi\", \"Director\": \"Steven Lisberger\", \"Writer\": \"Steven Lisberger, Bonnie MacBird, Charles S. Haas\", \"Actors\": \"Jeff Bridges, Bruce Boxleitner, David Warner\", \"Plot\": \"A computer hacker is abducted into the digital world and forced to participate in gladiatorial games where his only chance of escape is with the help of a heroic security program.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Nominated for 2 Oscars. 2 wins & 8 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMzZhNjYyZDYtZmE4MC00M2RlLTlhOGItZDVkYTVlZTYxOWZlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"6.7/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"72%\"}, {\"Source\": \"Metacritic\", \"Value\": \"58/100\"}], \"Metascore\": \"58\", \"imdbRating\": \"6.7\", \"imdbVotes\": \"121,545\", \"imdbID\": \"tt0084827\", \"Type\": \"movie\", \"DVD\": \"05 Apr 2011\", \"BoxOffice\": \"$33,000,000\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["science_fiction"]}], "20f02a64-0478-4e43-92cf-b61874a64828": [{"artifactid": "20f02a64-0478-4e43-92cf-b61874a64828", "title": "The Return Of The Pink Panther", "majtype": "movie", "runmins": 114, "season": -1, "episode": -1, "file": "ReturnOfThePinkPanther-mpg.m4v", "filepath": "comedy", "director": ["Blake Edwards"], "writer": ["Blake Edwards", "Frank Waldman"], "primcast": ["Burt Kwouk", "Catherine Schell", "Christopher Plummer", "Herbert Lom", "Peter Sellers"], "relorg": ["ITC Entertainment", "Jewel Productions", "Mirisch-Geoffrey", "Pimlico Films", "United Artists"], "relyear": 1975, "eidrid": "string", "imdbid": "tt0072081", "arbmeta": "{\"franchise\": \"Pink Panther\", \"titleorig\": \"ReturnOfThePinkPanther-mpg.m4v\", \"titlelibrary\": \"ReturnOfThePinkPanther-mpg.m4v\"}", "tags": ["comedy"], "synopsis": "Inspector Jacques Clouseau (Peter Sellers) is put on the case when the Pink Panther diamond is stolen, with the Phantom's trademark glove the only clue."}], "4c310798-15ff-4a1a-851e-d11e2e7147b1": [{"artifactid": "4c310798-15ff-4a1a-851e-d11e2e7147b1", "title": "In the Shadow of the Moon", "majtype": "movie", "runmins": 100, "season": -1, "episode": -1, "file": "InTheShadowOfTheMoon.m4v", "filepath": "docu", "director": ["David Sington"], "writer": ["string"], "primcast": ["Alan Bean", "Buzz Aldrin", "Charles Duke", "David Scott", "Edgar Mitchell", "Eugene Cernan", "Harrison Schmitt", "Jim Lovell", "John Young", "Michael Collins"], "relorg": ["string"], "relyear": 2007, "eidrid": "string", "imdbid": "tt0925248", "arbmeta": "{\"Title\": \"In the Shadow of the Moon\", \"Year\": \"2007\", \"Rated\": \"PG\", \"Released\": \"02 Nov 2007\", \"Runtime\": \"2 min\", \"Genre\": \"Documentary, History\", \"Director\": \"David Sington\", \"Writer\": \"N/A\", \"Actors\": \"Buzz Aldrin, Alan Bean, Eugene Cernan\", \"Plot\": \"The crew members of NASA's Apollo missions tell their story in their own words.\", \"Language\": \"English, French, Japanese\", \"Country\": \"United Kingdom, United States\", \"Awards\": \"6 wins & 13 nominations\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYjhjN2NjYTgtNTU2ZS00ODM2LWJjODYtOGRhYWYwNThjMTBmL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"95%\"}, {\"Source\": \"Metacritic\", \"Value\": \"84/100\"}], \"Metascore\": \"84\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"6,774\", \"imdbID\": \"tt0925248\", \"Type\": \"movie\", \"DVD\": \"19 Feb 2008\", \"BoxOffice\": \"$1,134,358\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["documentary", "space_race"], "synopsis": "The crew members of NASA's Apollo missions tell their story in their own words"}], "4d44b9a0-59d7-4f60-bbea-eb15038a97fe": [{"artifactid": "4d44b9a0-59d7-4f60-bbea-eb15038a97fe", "title": "Start the Revolution Without Me", "majtype": "movie", "runmins": 90, "season": -1, "episode": -1, "file": "StartTheRevolutionWithoutMe.m4v", "filepath": "comedy", "director": ["Bud Yorkin"], "writer": ["Fred Freeman", "Lawrence J. Cohen"], "primcast": ["Billie Whitelaw", "Donald Sutherland", "Ewa Aulin", "Gene Wilder", "Hugh Griffith", "Jack MacGowran", "Orson Welles", "Victor Spinetti"], "relorg": ["Norbud Productions", "Warner Bros.-Seven Arts"], "relyear": 1970, "eidrid": "string", "imdbid": "tt0066402", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy"], "synopsis": "Two mismatched sets of identical twins, one aristocrat, one peasant, mistakenly exchange identities on the eve of the French Revolution."}], "6b1f7bcd-4140-4b6b-9522-f32788bd7848": [{"artifactid": "6b1f7bcd-4140-4b6b-9522-f32788bd7848", "title": "Star Wars: Episode IV - A New Hope", "majtype": "movie", "runmins": 121, "season": -1, "episode": -1, "file": "StarWarsEp4-mpg.m4v", "filepath": "scifi", "director": ["George Lucas"], "writer": ["George Lucas"], "primcast": ["Alec Guinness", "Carrie Fisher", "Harrison Ford", "Mark Hamill", "Peter Cushing"], "relorg": ["string"], "relyear": 1977, "eidrid": "string", "imdbid": "tt0076759", "arbmeta": "{\"franchise\": \"Star Wars\", \"titleorig\": \"Star Wars: Episode IV u2013 A New Hope\", \"titlelibrary\": \"Star Wars: Episode IV u2013 A New Hope\"}", "tags": ["fantasy", "science_fiction"], "synopsis": "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth ..."}], "78342703-3b00-4658-8dcb-d569cabbf962": [{"artifactid": "78342703-3b00-4658-8dcb-d569cabbf962", "title": "Casino Royale 1967", "majtype": "movie", "runmins": 131, "season": -1, "episode": -1, "file": "CasinoRoyale_1967.m4v", "filepath": "comedy", "director": ["John Huston", "Ken Hughes", "Val Guest"], "writer": ["John Law", "Michael Sayers", "Wolf Mankowitz"], "primcast": ["David Niven", "Peter Sellers", "Ursula Andress"], "relorg": ["string"], "relyear": 1967, "eidrid": "string", "imdbid": "tt0061452", "arbmeta": "{\"Title\": \"Casino Royale\", \"Year\": \"1967\", \"Rated\": \"Approved\", \"Released\": \"28 Apr 1967\", \"Runtime\": \"1 min\", \"Genre\": \"Comedy\", \"Director\": \"Val Guest, Ken Hughes, John Huston\", \"Writer\": \"Wolf Mankowitz, John Law, Michael Sayers\", \"Actors\": \"David Niven, Peter Sellers, Ursula Andress\", \"Plot\": \"In an early spy spoof, aging Sir James Bond comes out of retirement to take on SMERSH.\", \"Language\": \"English, French, Gaelic, German, Japanese\", \"Country\": \"United Kingdom, United States\", \"Awards\": \"Nominated for 1 Oscar. 4 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BZjJlYzgyZTQtNDFiMy00ZGFjLTk2N2ItN2ViNzNhNzhhNGM1XkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"5.0/10\"}, {\"Source\": \"Rotten Tomatoes\", \"Value\": \"26%\"}, {\"Source\": \"Metacritic\", \"Value\": \"48/100\"}], \"Metascore\": \"48\", \"imdbRating\": \"5.0\", \"imdbVotes\": \"30,339\", \"imdbID\": \"tt0061452\", \"Type\": \"movie\", \"DVD\": \"15 Oct 2002\", \"BoxOffice\": \"N/A\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["comedy"], "synopsis": "In an early spy spoof, aging Sir James Bond comes out of retirement to take on SMERSH."}], "7e678e3e-443a-4665-b290-c9bde2e823d4": [{"artifactid": "7e678e3e-443a-4665-b290-c9bde2e823d4", "title": "Airport", "majtype": "movie", "runmins": 137, "season": -1, "episode": -1, "file": "Airport.m4v", "filepath": "drama", "director": ["George Seaton", "Henry Hathaway"], "writer": ["Arthur Hailey", "George Seaton"], "primcast": ["Barbara Hale", "Barry Nelson", "Burt Lancaster", "Dana Wynter", "Dean Martin", "Gary Collins", "George Kennedy", "Helen Hayes", "Jacqueline Bisset", "Jean Seberg", "Lloyd Nolan", "Maureen Stapleton", "Van Heflin", "Whit Bissell"], "relorg": ["Universal Pictures"], "relyear": 1970, "eidrid": "notarealvalue", "imdbid": "tt0065377", "arbmeta": "{\"franchise\": \"Airport\",  \"titleorig\": \"Airport\", \"titlelibrary\": \"Airport\"}", "tags": ["disaster", "drama", "suspense"], "synopsis": "A bomber on board an airplane, an airport almost closed by snow, and various personal problems of the people involved."}], "c099d22a-a60d-441b-a6ab-16ffb2f817f3": [{"artifactid": "c099d22a-a60d-441b-a6ab-16ffb2f817f3", "title": "The Wonder Of It All", "majtype": "movie", "runmins": 82, "season": -1, "episode": -1, "file": "WonderOfItAll.m4v", "filepath": "docu", "director": ["Jeffrey Roth"], "writer": ["Gregory Schwartz", "Jeffrey Roth", "Paul M. Basta"], "primcast": ["Alan Bean", "Buzz Aldrin", "Charlie Duke", "Edgar Mitchell", "Gene Cernan", "Harrison Schmitt", "John Young"], "relorg": ["Playground Productions", "Quiver Distribution"], "relyear": 2007, "eidrid": "string", "imdbid": "tt0928406", "arbmeta": "{\"Title\": \"The Wonder of it All\", \"Year\": \"2007\", \"Rated\": \"N/A\", \"Released\": \"19 Jul 2019\", \"Runtime\": \"82 min\", \"Genre\": \"Documentary\", \"Director\": \"Jeffrey Roth\", \"Writer\": \"Jeffrey Roth, Paul Basta, Gregory Schwartz\", \"Actors\": \"Eugene Cernan, Yuri Gagarin, John F. Kennedy\", \"Plot\": \"\"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon and returning him safely to the Earth.\" These words spoken by President John F. Kennedy in May 1961 ch...\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"1 nomination\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BYTllODAwMTgtNDVmNS00NTlmLWI0OTktOTQ2OGRjZWQ3ZGU3XkEyXkFqcGdeQXVyODIzMzIzOQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"7.2/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"7.2\", \"imdbVotes\": \"218\", \"imdbID\": \"tt0928406\", \"Type\": \"movie\", \"DVD\": \"21 Jul 2009\", \"BoxOffice\": \"$781,016\", \"Production\": \"N/A\", \"Website\": \"N/A\", \"Response\": \"True\"}", "tags": ["documentary", "space_race"], "synopsis": "\"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon and returning him safely to the Earth.\" These words spoken by President John F. Kennedy in May 1961 changed the lives of twelve Americans who walked on the moon. The Wonder of it All focuses on Apollo astronauts; Buzz Aldrin, Alan Bean, Edgar Mitchell, John Young, Charles Duke, Eugene Cernan and Harrison Schmitt as they reflect on the training, tragedies, being on the moon and the effect of space travel. Becoming heroes to a nation, they fulfilled the dream to set foot on another world and in so doing, forever changed the way we view ourselves."}], "d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab": [{"artifactid": "d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab", "title": "Everything Everywhere All At Once", "majtype": "movie", "runmins": 140, "season": -1, "episode": -1, "file": "EverythingEverywhereAllAtOnce.m4v", "filepath": "drama", "director": ["Daniel Kwan", "Daniel Scheinert"], "writer": ["Daniel Kwan", "Daniel Scheinert"], "primcast": ["Harry Shum Jr.", "James Hong", "Jamie Lee Curtis", "Jenny Slate", "Ke Huy Quan", "Michelle Yeoh", "Stephanie Hsu"], "relorg": ["A24"], "relyear": 2022, "eidrid": "string", "imdbid": "tt6710474", "arbmeta": "{\"string\": \"string\"}", "tags": ["action", "comedy", "drama", "martial_arts", "new"], "synopsis": "An aging Chinese immigrant is swept up in an insane adventure, in which she alone can save the world by exploring other universes connecting with the lives she could have led."}], "e984940f-628a-4159-b004-e01e89f5971e": [{"artifactid": "e984940f-628a-4159-b004-e01e89f5971e", "title": "Tora! Tora! Tora!", "majtype": "movie", "runmins": 144, "season": -1, "episode": -1, "file": "ToraToraTora.m4v", "filepath": "boats", "director": ["Akira Kurosawa", "Kinji Fukasaku", "Richard Fleischer", "Toshio Masuda"], "writer": ["Akira Kurosawa", "Hideo Oguni", "Larry Forrester", "Ry\u016bz\u014d Kikushima"], "primcast": ["E. G. Marshall", "Eijir\u014d T\u014dno", "James Whitmore", "Jason Robards", "Joseph Cotten", "Martin Balsam", "So Yamamura", "Takahiro Tamura", "Tatsuya Mihashi"], "relorg": ["20th Century Fox", "Toei Company", "Williams-Fleischer Productions"], "relyear": 1970, "eidrid": "string", "imdbid": "tt0066473", "arbmeta": "{\"string\": \"string\"}", "tags": ["action", "based_on_a_true_story", "drama", "world_war_2"], "synopsis": "The story of the 1941 Japanese air raid on Pearl Harbor, and the series of preceding American blunders that aggravated its effectiveness."}], "f37d754f-dbf8-45a2-8214-578d505f483d": [{"artifactid": "f37d754f-dbf8-45a2-8214-578d505f483d", "title": "The Dirty Dozen", "majtype": "movie", "runmins": 150, "season": -1, "episode": -1, "file": "TheDirtyDozen.m4v", "filepath": "drama", "director": ["Robert Aldrich"], "writer": ["Lukas Heller", "Nunnally Johnson"], "primcast": ["Charles Bronson", "Clint Walker", "Ernest Borgnine", "George Kennedy", "Jim Brown", "John Cassavetes", "Lee Marvin", "Ralph Meeker", "Richard Jaeckel", "Robert Ryan", "Robert Webber", "Telly Savalas", "Trini Lopez"], "relorg": ["Metro-Goldwyn-Mayer"], "relyear": 1967, "eidrid": "string", "imdbid": "tt0061578", "arbmeta": "{\"string\": \"string\"}", "tags": ["action", "adventure", "drama"], "synopsis": "During World War II, a rebellious U.S. Army Major is assigned a dozen convicted murderers to train and lead them into a mass assassination mission of German officers."}], "fd60c95a-d646-45ec-8cfe-7c15e8cc5dc2": [{"artifactid": "fd60c95a-d646-45ec-8cfe-7c15e8cc5dc2", "title": "The Pink Panther Strikes Again", "majtype": "movie", "runmins": 103, "season": -1, "episode": -1, "file": "PinkPantherStrikesAgain-mpg.m4v", "filepath": "comedy", "director": ["Blake Edwards"], "writer": ["Blake Edwards", "Frank Waldman"], "primcast": ["Colin Blakely", "Herbert Lom", "Leonard Rossiter", "Lesley-Anne Down", "Peter Sellers"], "relorg": ["Amjo Productions", "United Artists"], "relyear": 1976, "eidrid": "string", "imdbid": "tt0075066", "arbmeta": "{\"franchise\": \"Pink Panther\", \"titleorig\": \"PinkPantherStrikesAgain-mpg.m4v\", \"titlelibrary\": \"PinkPantherStrikesAgain-mpg.m4v\"}", "tags": ["comedy"], "synopsis": "After escaping from an insane asylum, the bonkers Charles Dreyfus sends 26 assassins on the trail of the forever bumbling Inspector Clouseau."}], "159af384-d810-4a45-8110-c5b0ac713387": [{"artifactid": "159af384-d810-4a45-8110-c5b0ac713387", "title": "Mythbusters", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/MythBusters", "director": [], "writer": [], "primcast": ["Adam Savage", "Bisi Ezerioha", "Brian Louden", "Faye Hadley", "Grant Imahara", "Jamie Hyneman", "Jessi Combs", "Jon Lung", "Kari Byron", "Scottie Chapman", "Tory Belleci"], "relorg": ["Beyond Television Productions"], "relyear": 2003, "eidrid": "string", "imdbid": "tt0383126", "arbmeta": "{\"string\": \"string\"}", "tags": ["documentary"], "synopsis": "A weekly documentary in which two Hollywood special effects experts attempt to debunk urban legends by directly testing them."}], "21a05c78-cef4-4d00-9a0c-17870024ea8a": [{"artifactid": "21a05c78-cef4-4d00-9a0c-17870024ea8a", "title": "Nova", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "Nova_S", "filepath": "docu/pbs", "director": [], "writer": [], "primcast": [], "relorg": ["PBS"], "relyear": 1974, "eidrid": "string", "imdbid": "tt0206501", "arbmeta": "{\"Title\": \"Nova\", \"Year\": \"1974u2013\", \"Rated\": \"TV-PG\", \"Released\": \"03 Mar 1974\", \"Runtime\": \"1 min\", \"Genre\": \"Documentary\", \"Director\": \"N/A\", \"Writer\": \"Daniel Hart, Alan Kwan, Tacita Morway\", \"Actors\": \"Jay O. Sanders, Craig Sechler, Stacy Keach\", \"Plot\": \"Science documentaries about various topics.\", \"Language\": \"English\", \"Country\": \"United States\", \"Awards\": \"Won 1 Primetime Emmy. 21 wins & 61 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNTJkYmM3YmItZDY1NC00OTU3LWIxNDMtNzVhOWQzNDMyNmI0XkEyXkFqcGdeQXVyODQ1NTk5OQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.7/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.7\", \"imdbVotes\": \"2,792\", \"imdbID\": \"tt0206501\", \"Type\": \"series\", \"totalSeasons\": \"49\", \"Response\": \"True\"}", "tags": ["documentary"], "synopsis": "Science documentaries about various topics."}], "3d5e4d5f-daa3-4350-ad31-1863a3cec79d": [{"artifactid": "3d5e4d5f-daa3-4350-ad31-1863a3cec79d", "title": "Stephen Hawking's Universe", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/StephenHawkingsUniverse", "director": [], "writer": [], "primcast": ["Eugene Babaev", "Jeff Rawle", "Stephen Hawking"], "relorg": [], "relyear": 1997, "eidrid": "string", "imdbid": "tt0124259", "arbmeta": "{\"Title\": \"Stephen Hawking's Universe\", \"Year\": \"1997u2013\", \"Rated\": \"Not Rated\", \"Released\": \"13 Oct 1997\", \"Runtime\": \"360 min\", \"Genre\": \"Documentary\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Stephen Hawking, Eugene Babaev, Jeff Rawle\", \"Plot\": \"6-part documentary series from arguably the greatest scientific mind in the world, the wheelchair-bound Stephen Hawking, which describes all current thinking on the Big Bang, origins of the universe, dark matter, black holes, etc....\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"1 nomination\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMjAzOTkzNTUyMl5BMl5BanBnXkFtZTcwMDE1MDcyMQ@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.3/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.3\", \"imdbVotes\": \"1,030\", \"imdbID\": \"tt0124259\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["documentary"], "synopsis": "6-part documentary series from arguably the greatest scientific mind in the world, the wheelchair-bound Stephen Hawking, which describes all current thinking on the Big Bang, origins of the universe, dark matter, black holes, etc...."}], "6d31322b-4ea7-4178-bfcd-6e764a2cf197": [{"artifactid": "6d31322b-4ea7-4178-bfcd-6e764a2cf197", "title": "Dirty Jobs", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "", "filepath": "docu/DirtyJobs", "director": [], "writer": [], "primcast": ["Mike Rowe"], "relorg": [], "relyear": 2003, "eidrid": "string", "imdbid": "tt0458259", "arbmeta": "{\"string\": \"string\"}", "tags": ["documentary"], "synopsis": "Follows the exploits of Mike Rowe as he performs various dirty and dangerous jobs around the USA."}], "71a084a7-2a32-40a0-8b12-771f385e30ee": [{"artifactid": "71a084a7-2a32-40a0-8b12-771f385e30ee", "title": "Garth Marenghi's Darkplace", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/GarthMarenghisDarkPlace", "director": ["Richard Ayoade"], "writer": ["Matthew Holness", "Richard Ayoade"], "primcast": ["Matt Berry", "Matthew Holness", "Richard Ayoade"], "relorg": ["Channel 4"], "relyear": 2004, "eidrid": "string", "imdbid": "tt0397150", "arbmeta": "{\"Title\": \"Garth Marenghi's Darkplace\", \"Year\": \"2004\", \"Rated\": \"TV-MA\", \"Released\": \"29 Jan 2004\", \"Runtime\": \"22S min\", \"Genre\": \"Comedy, Fantasy, Horror\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"Richard Ayoade, Matt Berry, Matthew Holness\", \"Plot\": \"This parody series is an unearthed 80s horror/drama, complete with poor production values, awful dialogue and hilarious violence. The series is set in a Hospital in Romford, which is situated over the gates of Hell.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Nominated for 1 BAFTA Award1 nomination total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOWIyNDI4M2YtNjI5ZS00NDE3LTk2NmQtZTc1YTUwNjgwYWMyXkEyXkFqcGdeQXVyMjMwNjYyMzE@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.5/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.5\", \"imdbVotes\": \"18,401\", \"imdbID\": \"tt0397150\", \"Type\": \"series\", \"totalSeasons\": \"1\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "This parody series is an unearthed 80s horror/drama, complete with poor production values, awful dialogue and hilarious violence. The series is set in a Hospital in Romford, which is situated over the gates of Hell."}], "737fd8de-aca2-42d5-82b2-2b3d771cbd51": [{"artifactid": "737fd8de-aca2-42d5-82b2-2b3d771cbd51", "title": "Poirot", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "Poirot_S", "filepath": "drama/Poirot", "director": ["string"], "writer": ["Agatha Christie", "Clive Exton"], "primcast": ["David Suchet", "Hugh Fraser", "Pauline Moran", "Philip Jackson"], "relorg": ["Agatha Christie Ltd.", "Carnival Films", "Granada Productions", "ITV Studios", "LWT", "Mittal Productions", "Picture Partnership Productions", "WGBH Boston"], "relyear": 1989, "eidrid": "string", "imdbid": "tt0094525", "arbmeta": "{\"string\": \"string\"}", "tags": ["detective", "drama", "mystery", "new"], "synopsis": "The cases of eccentric, but sharp, Belgian detective Hercule Poirot."}], "a7baf85b-4c03-4da1-8154-4b32b08d00d9": [{"artifactid": "a7baf85b-4c03-4da1-8154-4b32b08d00d9", "title": "The Beatles: Get Back", "majtype": "tvseries", "runmins": 468, "season": -1, "episode": -1, "file": "BeatlesGetBack_S", "filepath": "docu/BeatlesGetBack", "director": ["Peter Jackson"], "writer": ["string"], "primcast": ["George Harrison", "John Lennon", "Paul McCartney", "Ringo Starr"], "relorg": ["string"], "relyear": 2021, "eidrid": "string", "imdbid": "tt9735318", "arbmeta": "{\"string\": \"string\"}", "tags": ["documentary", "music", "new"], "synopsis": "Documentary about the music group The Beatles featuring in-studio footage that was shot in early 1969 for the 1970 feature film 'Let It Be.'"}], "c064bf86-1668-4e46-8471-02134fa03660": [{"artifactid": "c064bf86-1668-4e46-8471-02134fa03660", "title": "The Computer Chronicles", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "TheComputerChronicles_S", "filepath": "docu/ComputerChronicles", "director": ["string"], "writer": ["string"], "primcast": ["Cynthia Steele", "Gary Kildall", "George Morrow", "Herb Lechner", "Jan Lewis", "Janelle Stelson", "Maria Gabriel", "Paul Schindler", "Stewart Chiefet", "Tim Bajarain", "Wendy Woods"], "relorg": ["PBS"], "relyear": 1983, "eidrid": "string", "imdbid": "tt0421311", "arbmeta": "{\"string\": \"string\"}", "tags": ["documentary", "technology"], "synopsis": "The most popular television program about consumer technology during the rise of the personal computer revolution from 1983 to 2002. Episodes featured interviews with luminaries from the tech industry."}], "c8e9a53a-87b6-4d57-bebf-17de614a0838": [{"artifactid": "c8e9a53a-87b6-4d57-bebf-17de614a0838", "title": "The Orville", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "TheOrville_S", "filepath": "comedy/TheOrville", "director": [], "writer": ["Seth MacFarlane"], "primcast": [], "relorg": ["20th Television", "Disney Media Distribution", "Fuzzy Door Productions"], "relyear": 2017, "eidrid": "string", "imdbid": "tt5691552", "arbmeta": "{\"string\": \"string\"}", "tags": ["comedy", "new", "science_fiction"], "synopsis": "Set 400 years in the future, finds the crew of the U.S.S. Orville continuing their mission of exploration, as they navigate both the mysteries of the universe and the complexities of their own interpersonal relationships."}], "cd7ff82e-e783-415a-af87-f4b0e10cd198": [{"artifactid": "cd7ff82e-e783-415a-af87-f4b0e10cd198", "title": "That Mitchell And Webb Look", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/ThatMitchellAndWebbLook", "director": [], "writer": [], "primcast": ["David Mitchell", "James Bachman", "Robert Webb"], "relorg": [], "relyear": 2006, "eidrid": "string", "imdbid": "tt0499410", "arbmeta": "{\"Title\": \"That Mitchell and Webb Look\", \"Year\": \"2006u20132010\", \"Rated\": \"N/A\", \"Released\": \"14 Sep 2006\", \"Runtime\": \"720 min\", \"Genre\": \"Comedy, Fantasy\", \"Director\": \"N/A\", \"Writer\": \"N/A\", \"Actors\": \"David Mitchell, Robert Webb, James Bachman\", \"Plot\": \"A comedy sketch show featuring David Mitchell and Robert Webb.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Won 1 BAFTA Award1 win & 8 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BMTI4OTI4ODE1Ml5BMl5BanBnXkFtZTcwMjA3NDM3Mg@@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.0/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.0\", \"imdbVotes\": \"9,064\", \"imdbID\": \"tt0499410\", \"Type\": \"series\", \"totalSeasons\": \"4\", \"Response\": \"True\"}", "tags": ["british", "comedy"], "synopsis": "A comedy sketch show featuring David Mitchell and Robert Webb."}], "d6ce1f59-49b2-4cce-a940-9433b6bff2a0": [{"artifactid": "d6ce1f59-49b2-4cce-a940-9433b6bff2a0", "title": "Waiting For God", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "", "filepath": "comedy/WaitingForGod", "director": [], "writer": ["Michael Aitkens"], "primcast": ["Daniel Hill", "Graham Crowden", "Janine Duvitski", "Stephanie Cole"], "relorg": ["BBC"], "relyear": 1990, "eidrid": "string", "imdbid": "tt0098945", "arbmeta": "{\"string\": \"string\"}", "tags": ["british", "comedy", "new"], "synopsis": "When Tom Ballard moves to Bayview Retirement Vilage, he meets Diana Trent, a feisty old woman who complains about everything and wants nothing more than just to die. Much to the dislike of Harvey Baines, the head of the home, the two form a friendship and eventually a romance, helping each other out of tight situations. Tom's son, Geofrey, and daughter-in-law, Marion (whom Tom doesn't particularly like) are constantly stopping in and Jane, a worker at the home, is Diana's worst nightmare being constantly cheerful. Together, though, Tom and Diana make it together while they are waiting for God."}], "d79c032d-e68a-458b-a558-e071a0851c77": [{"artifactid": "d79c032d-e68a-458b-a558-e071a0851c77", "title": "Star Trek: Strange New Worlds", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "StarTrekSNW_S", "filepath": "scifi/StarTrekSNW", "director": ["string"], "writer": ["string"], "primcast": ["string"], "relorg": ["string"], "relyear": 2022, "eidrid": "string", "imdbid": "tt12327578", "arbmeta": "{\"string\": \"string\", \"titleorig\": \"StarTrekSNW_S\", \"titlelibrary\": \"StarTrekSNW_S\",\"franchise\":\"Star Trek\"}", "tags": ["new", "science_fiction"]}], "ddcaeca0-cad1-4413-a2f7-e52a6cbe526d": [{"artifactid": "ddcaeca0-cad1-4413-a2f7-e52a6cbe526d", "title": "Cosmos: A Spacetime Odyssey", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "cosmosndt_S", "filepath": "docu/CosmosNDT", "director": ["string"], "writer": ["string"], "primcast": ["Neil deGrasse Tyson"], "relorg": ["string"], "relyear": 2014, "eidrid": "string", "imdbid": "tt2395695", "arbmeta": "{\"string\": \"string\"}", "tags": ["documentary", "new"], "synopsis": "An exploration of our discovery of the laws of nature and coordinates in space and time."}], "fc366455-7e29-49c1-a9d2-a0d3189ac29a": [{"artifactid": "fc366455-7e29-49c1-a9d2-a0d3189ac29a", "title": "'Allo 'Allo!", "majtype": "tvseries", "runmins": 30, "season": -1, "episode": -1, "file": "AlloAllo_s", "filepath": "comedy/AlloAllo", "director": [], "writer": ["David Croft", "Jeremy Lloyd"], "primcast": ["Arthur Bostrom", "Carmen Silvera", "David Janson", "Derek Royle", "Francesca Gonshaw", "Gavin Richards", "Gorden Kaye", "Guy Siner", "Hilary Minster", "Jack Haig", "John D. Collins", "John Louis Mansi", "Kenneth Connor", "Kim Hartman", "Kirsten Cooke", "Nicholas Frankau", "Richard Gibson", "Richard Marner", "Robin Parkinson", "Roger Kitter", "Rose Hill", "Sam Kelly", "Sue Hodge", "Vicki Michelle"], "relorg": ["BBC"], "relyear": 1982, "eidrid": "string", "imdbid": "tt0086659", "arbmeta": "{\"Title\": \"'Allo 'Allo!\", \"Year\": \"1982u20131992\", \"Rated\": \"N/A\", \"Released\": \"30 Dec 1982\", \"Runtime\": \"45 min\", \"Genre\": \"Comedy, History, War\", \"Director\": \"N/A\", \"Writer\": \"David Croft, Jeremy Lloyd\", \"Actors\": \"Gorden Kaye, Carmen Silvera, Vicki Michelle\", \"Plot\": \"In France during World War II, Renu00e9 Artois runs a small cafu00e9 where Resistance fighters, Gestapo men, German Army officers and escaped Allied POWs interact daily, ignorant of one another's true identity or presence, exasperating Renu00e9.\", \"Language\": \"English\", \"Country\": \"United Kingdom\", \"Awards\": \"Nominated for 5 BAFTA 1 win & 5 nominations total\", \"Poster\": \"https://m.media-amazon.com/images/M/MV5BNDNhNjlkYjYtMzYwNi00MTM2LTlkZTAtOTZiZDEwMzQ1OWM1XkEyXkFqcGdeQXVyNTg4MDc2NTQ@._V1_SX300.jpg\", \"Ratings\": [{\"Source\": \"Internet Movie Database\", \"Value\": \"8.4/10\"}], \"Metascore\": \"N/A\", \"imdbRating\": \"8.4\", \"imdbVotes\": \"25,376\", \"imdbID\": \"tt0086659\", \"Type\": \"series\", \"totalSeasons\": \"9\", \"Response\": \"True\"}", "tags": ["british", "comedy", "world_war_2"], "synopsis": "In France during World War II, Rene Artois runs a small cafe where Resistance fighters, Gestapo men, German Army officers and escaped Allied POWs interact daily, ignorant of one another's true identity or presence, exasperating Rene."}], "fd5e0b6d-5d6a-489c-9249-c25c790a1f8c": [{"artifactid": "fd5e0b6d-5d6a-489c-9249-c25c790a1f8c", "title": "The Blacklist", "majtype": "tvseries", "runmins": 60, "season": -1, "episode": -1, "file": "TheBlacklist_S", "filepath": "drama/TheBlacklist", "director": ["string"], "writer": ["Jon Bokenkamp"], "primcast": ["Diego Klattenhoff", "James Spader", "Megan Boone"], "relorg": ["Sony Pictures Television", "Universal Television"], "relyear": 2013, "eidrid": "string", "imdbid": "tt2741602", "arbmeta": "{\"string\": \"string\"}", "tags": ["crime", "drama", "intrigue", "kitten", "mystery", "new"], "synopsis": "A new FBI profiler, Elizabeth Keen, has her entire life uprooted when a mysterious criminal, Raymond Reddington, who has eluded capture for decades, turns himself in and insists on speaking only to her."}]}, "data": {"others": {"tvseries": [{"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "imdbid": "tt0101049"}, {"artifactid": "a290ee00-577d-4178-8392-4e0ac761d0c2", "title": "Thunderbirds", "majtype": "tvseries", "imdbid": "tt0057790"}, {"artifactid": "d055800c-314e-49b6-9903-6cf453addacc", "title": "The Cleaner", "majtype": "tvseries", "imdbid": "tt12994356"}, {"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "imdbid": "tt3063454"}, {"artifactid": "73c34aae-d65c-4971-88db-724748804e3c", "title": "Bob's Burgers", "majtype": "tvseries", "imdbid": "tt1561755"}, {"artifactid": "ab8a0b85-96d1-48b4-b20b-7c097b24b90a", "title": "Keeping Up Appearances", "majtype": "tvseries", "imdbid": "tt0098837"}, {"artifactid": "0d38af65-46e1-4e2b-9195-686c7b932870", "title": "Stephen Fry In America", "majtype": "tvseries", "imdbid": "tt1307789"}, {"artifactid": "aa1e7a07-ea94-4c90-af43-7272c050af67", "title": "Stephen Fry: Last Chance To See", "majtype": "tvseries", "imdbid": "tt1409667"}], "movie": [{"artifactid": "e9253d1b-0711-4f65-b6e2-a6decc050ef6", "title": "1941", "majtype": "movie", "imdbid": "tt0078723"}, {"artifactid": "128070c1-c4f6-47bb-b7ab-6b94e30b3f41", "title": "Star Trek II: The Wrath of Khan", "majtype": "movie", "imdbid": "tt0084726"}, {"artifactid": "d03dcf5a-8ca6-40f4-89f8-09d13559ab66", "title": "Star Trek: The Motion Picture", "majtype": "movie", "imdbid": "tt0079945"}, {"artifactid": "08872109-9bbe-4b21-9125-fe8711d54300", "title": "The Four Horsemen - Discussions With Richard Dawkins", "majtype": "movie", "imdbid": "none"}, {"artifactid": "25abfc69-49db-4465-bce7-62b9e39feabd", "title": "The Best of The Colbert Report", "majtype": "movie", "imdbid": "none"}, {"artifactid": "53aade09-535b-4c96-9c1e-695284f476c6", "title": "ElephantParts", "majtype": "movie", "imdbid": "tt0082316"}, {"artifactid": "ca6c898f-d7c4-44d9-ad70-ba0b393a63f4", "title": "A Charlie Brown Christmas", "majtype": "movie", "imdbid": "tt0059026"}, {"artifactid": "56fafebd-21cb-4b99-83f9-35cbe768f2d7", "title": "Anne of Green Gables (Part 1)", "majtype": "movie", "imdbid": "tt0088727"}, {"artifactid": "93bd3736-2f79-464a-ae5a-b4c2709f06b3", "title": "Stooges: The Men Behind The Mayhem", "majtype": "movie", "imdbid": "tt0281229"}, {"artifactid": "f026cdfc-bb69-4857-b48f-25a21a15db73", "title": "The Last Remake of Beau Geste", "majtype": "movie", "imdbid": "tt0076297"}, {"artifactid": "912e453c-8d54-47c7-abe9-4d61b424dc45", "title": "One Flew Over The Cuckoo's Nest", "majtype": "movie", "imdbid": "tt0073486"}, {"artifactid": "0ea8c809-1020-474e-a6df-9074372cfa52", "title": "Despicable Me", "majtype": "movie", "imdbid": "tt1323594"}, {"artifactid": "5b4006c9-7c17-4040-8dfb-f6d79100a33d", "title": "Trainwreck", "majtype": "movie", "imdbid": "tt3152624"}, {"artifactid": "98f97e19-a027-4a8b-af96-0e886142c953", "title": "I Feel Pretty", "majtype": "movie", "imdbid": "tt6791096"}, {"artifactid": "0c8828a9-aa8a-4961-ba55-14c143fbe3a4", "title": "Revolution OS", "majtype": "movie", "imdbid": "tt0308808"}, {"artifactid": "487598cb-9b6c-47e5-8908-500a6d32e986", "title": "The Aviator", "majtype": "movie", "imdbid": "tt0338751"}, {"artifactid": "3559eaa9-1de2-4e16-8a2b-126acb6f9233", "title": "Sneakers", "majtype": "movie", "imdbid": "tt0105435"}, {"artifactid": "19a808dd-61ac-4676-abeb-2892c001205e", "title": "Shaun of the Dead", "majtype": "movie", "imdbid": "tt0365748"}, {"artifactid": "b973a96d-45c6-4d35-87fa-c96ad68125aa", "title": "The Andromeda Strain", "majtype": "movie", "imdbid": "tt0066769"}, {"artifactid": "e9ffd375-35f5-4d66-9a7c-d9f2b6efca94", "title": "2010: The Year We Make Contact", "majtype": "movie", "imdbid": "tt0086837"}, {"artifactid": "bd96a7cf-f725-449e-8256-d9bce4559ba7", "title": "Downfall.m4v", "majtype": "movie", "imdbid": "tt0363163"}, {"artifactid": "93d6764b-4553-4c2e-b825-d93cd26167ec", "title": "Big Hero 6", "majtype": "movie", "imdbid": "tt2245084"}, {"artifactid": "da235d5e-b37b-41a5-9f03-284cb902e89e", "title": "Greg Davies: The Back Of My Mums Head", "majtype": "movie", "imdbid": "tt3387320"}, {"artifactid": "457e6c3c-591e-46ab-8b75-c7ed31d0cfbc", "title": "TimMinchinBack.m4v", "majtype": "movie", "imdbid": "tt24518132"}, {"artifactid": "b16596a5-6d77-4e94-a617-8b87155828ed", "title": "Greg Davies: Firing Cheeseballs At A Dog", "majtype": "movie", "imdbid": "tt2396686"}, {"artifactid": "c7e34b0f-d3ea-4521-b39a-99b3d89812a6", "title": "Jo Brand: Barely Live", "majtype": "movie", "imdbid": "string"}, {"artifactid": "69583984-ebab-46c1-be6b-86796c6fef22", "title": "Sarah Millican: Bobby Dazzler", "majtype": "movie", "imdbid": "tt26687384"}, {"artifactid": "c8f35db3-7525-418e-b23a-4a610ae4654f", "title": "Jon Richardson: Nidiot", "majtype": "movie", "imdbid": "string"}, {"artifactid": "08c74e39-e523-4d4f-864c-7a0cc67c4419", "title": "Dara O'Briain: Talks Funny", "majtype": "movie", "imdbid": "tt1368982"}, {"artifactid": "b53e9f60-b76b-4781-9014-85be9bed1679", "title": "Ice Station Zebra", "majtype": "movie", "imdbid": "tt0063121"}]}, "tags": {"tvseries": [{"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "imdbid": "tt0101049"}, {"artifactid": "2f91b427-7c8c-4acd-8e40-2a0c5823f149", "title": "American Experience", "majtype": "tvseries", "imdbid": "tt0094416"}, {"artifactid": "7805b0b7-b274-4c75-ae6b-68bd8efe57cb", "title": "Avenue 5", "majtype": "tvseries", "imdbid": "tt10234362"}, {"artifactid": "c201f148-f45e-4248-afc1-f277371f6bef", "title": "Blackadder", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "73c34aae-d65c-4971-88db-724748804e3c", "title": "Bob's Burgers", "majtype": "tvseries", "imdbid": "tt1561755"}, {"artifactid": "3ef463f3-8a82-426e-9a6e-5260973115e8", "title": "Connections 1", "majtype": "tvseries", "imdbid": "tt0078588"}, {"artifactid": "7099fc66-cb10-4b6c-b41a-9c1f3f511f6c", "title": "Father Ted", "majtype": "tvseries", "imdbid": "tt0111958"}, {"artifactid": "86238ca3-6862-4721-b6fe-e8d2e875fdda", "title": "Fawlty Towers", "majtype": "tvseries", "imdbid": "tt0072500"}, {"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "imdbid": "tt0106004"}, {"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "imdbid": "tt3609352"}, {"artifactid": "82510bf0-ef28-4924-a9c5-03bae33e523a", "title": "House, M.D.", "majtype": "tvseries", "imdbid": "tt0412142"}, {"artifactid": "c9e7007b-4628-4578-9f02-8d847ae32550", "title": "Inside Amy Schumer", "majtype": "tvseries", "imdbid": "tt2578508"}, {"artifactid": "ab8a0b85-96d1-48b4-b20b-7c097b24b90a", "title": "Keeping Up Appearances", "majtype": "tvseries", "imdbid": "tt0098837"}, {"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "imdbid": "tt3063454"}, {"artifactid": "95a82dab-d94a-4eab-862c-2876e697547a", "title": "Modern Marvels: Engineering Disasters", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "c7b49b7b-8707-42a0-946c-9f0f771ff784", "title": "Monty Python's Flying Circus", "majtype": "tvseries", "imdbid": "tt0063929"}, {"artifactid": "aec0549e-cc1b-40e7-a0af-db641e9ed8ff", "title": "Moon Machines", "majtype": "tvseries", "imdbid": "tt1203167"}, {"artifactid": "bcac590f-a5c1-424f-aa14-82c3526e0405", "title": "NCIS", "majtype": "tvseries", "imdbid": "tt0364845"}, {"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "imdbid": "tt0387764"}, {"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "imdbid": "tt0050051"}, {"artifactid": "8b1ab865-5c43-488f-954a-dba13c277163", "title": "Poldark", "majtype": "tvseries", "imdbid": "tt3636060"}, {"artifactid": "6cbad761-e403-4f0d-bf49-bbefdfaaa839", "title": "Star Wars: Rebels", "majtype": "tvseries", "imdbid": "tt2930604"}, {"artifactid": "0d38af65-46e1-4e2b-9195-686c7b932870", "title": "Stephen Fry In America", "majtype": "tvseries", "imdbid": "tt1307789"}, {"artifactid": "aa1e7a07-ea94-4c90-af43-7272c050af67", "title": "Stephen Fry: Last Chance To See", "majtype": "tvseries", "imdbid": "tt1409667"}, {"artifactid": "7c7203c2-c4b6-4df7-945e-cfa505fc5257", "title": "The Day The Universe Changed", "majtype": "tvseries", "imdbid": "tt0199208"}, {"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "imdbid": "tt0077004"}, {"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "imdbid": "tt0073990"}, {"artifactid": "4948bc8c-6d9b-4ad7-9c3b-ba0cc0b5fd45", "title": "The IT Crowd", "majtype": "tvseries", "imdbid": "tt0487831"}, {"artifactid": "c9ab7d43-5531-4d5f-835c-c7b5c3ff8879", "title": "The Thin Blue Line", "majtype": "tvseries", "imdbid": "tt0112194"}, {"artifactid": "a290ee00-577d-4178-8392-4e0ac761d0c2", "title": "Thunderbirds", "majtype": "tvseries", "imdbid": "tt0057790"}], "movie": [{"artifactid": "0935ea10-163b-419b-a911-3b9dfdd557dc", "title": "A Mighty Wind", "majtype": "movie", "imdbid": "tt0310281"}, {"artifactid": "04fb8351-651e-4740-9b50-13a9392a7897", "title": "Beerfest", "majtype": "movie", "imdbid": "tt0486551"}, {"artifactid": "0c9db4eb-dd69-420f-ade8-776d17a641f8", "title": "BillHicksLive_T5.m4v", "majtype": "movie", "imdbid": "none"}, {"artifactid": "07273465-c4ef-49a7-b709-7d7137a180bc", "title": "Clerks III", "majtype": "movie", "imdbid": "tt11128440"}, {"artifactid": "0a715f56-09bc-4bc8-9d87-a7559f885151", "title": "CrudeAwakening.m4v", "majtype": "movie", "imdbid": "tt0776794"}, {"artifactid": "08c74e39-e523-4d4f-864c-7a0cc67c4419", "title": "Dara O'Briain: Talks Funny", "majtype": "movie", "imdbid": "tt1368982"}, {"artifactid": "0ea8c809-1020-474e-a6df-9074372cfa52", "title": "Despicable Me", "majtype": "movie", "imdbid": "tt1323594"}, {"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "imdbid": "tt0058083"}, {"artifactid": "0613a102-b416-4fc9-b381-137692055511", "title": "GrandDayOut.m4v", "majtype": "movie", "imdbid": "tt0104361"}, {"artifactid": "0d940d56-938a-4eea-bc29-1f7b7a4a684a", "title": "Hackers", "majtype": "movie", "imdbid": "tt0113243"}, {"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "imdbid": "tt0077745"}, {"artifactid": "03189fe8-a68f-4631-8eb2-8277c248a987", "title": "Jojo Rabbit", "majtype": "movie", "imdbid": "tt2584384"}, {"artifactid": "0e53430e-3795-4d68-b832-9d460f8b8d3a", "title": "JurassicPark4-mpg.m4v", "majtype": "movie", "imdbid": "string"}, {"artifactid": "02719058-c660-4132-a3c1-a7a93b1693e9", "title": "Medicine Man", "majtype": "movie", "imdbid": "tt0104839"}, {"artifactid": "0ccfac0f-b474-4828-a8a5-26534bd93cf4", "title": "MysteryMen", "majtype": "movie", "imdbid": "tt0132347"}, {"artifactid": "0690c787-619f-40b6-b9d8-99918241166f", "title": "Network", "majtype": "movie", "imdbid": "tt0074958"}, {"artifactid": "034bd2ca-f283-410b-ac31-2aa0d15e0f92", "title": "O Brother, Where Art Thou?", "majtype": "movie", "imdbid": "tt0190590"}, {"artifactid": "06ae6051-bed9-4bec-ab8c-eb1193851963", "title": "Platoon", "majtype": "movie", "imdbid": "tt0091763"}, {"artifactid": "0c8828a9-aa8a-4961-ba55-14c143fbe3a4", "title": "Revolution OS", "majtype": "movie", "imdbid": "tt0308808"}, {"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "imdbid": "tt0080684"}, {"artifactid": "00edc024-9c5d-4b97-a9e5-b79b7ee48f0f", "title": "Strategic Air Command", "majtype": "movie", "imdbid": "tt0048667"}, {"artifactid": "00b298bf-9998-4c90-8c00-55a70a13f881", "title": "The Death Of Stalin", "majtype": "movie", "imdbid": "tt4686844"}, {"artifactid": "08872109-9bbe-4b21-9125-fe8711d54300", "title": "The Four Horsemen - Discussions With Richard Dawkins", "majtype": "movie", "imdbid": "none"}, {"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "imdbid": "tt0056218"}, {"artifactid": "090187c5-1182-48f0-9ada-a1595a110e53", "title": "The Onion Movie", "majtype": "movie", "imdbid": "tt0392878"}, {"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "imdbid": "tt0078163"}, {"artifactid": "0ef74b4c-1d25-41de-99b8-ec615e06f425", "title": "The Russians Are Coming, the Russians Are Coming", "majtype": "movie", "imdbid": "tt0060921"}, {"artifactid": "01e0a408-c1f5-481e-be2e-d7b8338bbf25", "title": "upright_citizens_d1-mpg.m4v", "majtype": "movie", "imdbid": "tt0167739"}, {"artifactid": "08d55215-1f90-4dd9-b065-c64246ed0fee", "title": "Waterworld", "majtype": "movie", "imdbid": "tt0114898"}, {"artifactid": "06733bf7-0db1-40ce-8098-0d34e946832a", "title": "Zoolander", "majtype": "movie", "imdbid": "tt0196229"}]}, "people": {"tvseries": [{"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "imdbid": "tt0050051"}, {"artifactid": "07b9a75a-b08c-4f20-bf78-b859a16874d1", "title": "Star Trek: The Next Generation", "majtype": "tvseries", "imdbid": "tt0092455"}, {"artifactid": "1038cc43-ac2a-44e3-b4ec-ee885c693d5a", "title": "Barney Miller", "majtype": "tvseries", "imdbid": "tt0072472"}, {"artifactid": "117de369-33dd-4295-bfa5-a939c6ff50d7", "title": "A Bit Of Fry And Laurie", "majtype": "tvseries", "imdbid": "tt0101049"}, {"artifactid": "1e193909-b7ec-48d0-9b14-f28f88692baf", "title": "All In The Family", "majtype": "tvseries", "imdbid": "tt0066626"}, {"artifactid": "2412bd7c-cdaa-4a74-93d3-bac6b039da15", "title": "Columbo", "majtype": "tvseries", "imdbid": "tt1466074"}, {"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "imdbid": "tt0073990"}, {"artifactid": "2c0d048e-6cc2-418c-9229-cc9a6f77769b", "title": "Taxi", "majtype": "tvseries", "imdbid": "tt0077089"}, {"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "imdbid": "tt0387764"}, {"artifactid": "305d6fa5-b580-49f6-a183-1e3cf88d3b9d", "title": "The Twilight Zone", "majtype": "tvseries", "imdbid": "tt0052520"}, {"artifactid": "3062158b-e3cf-463e-9890-ad300ac963ac", "title": "Star Trek", "majtype": "tvseries", "imdbid": "tt0060028"}, {"artifactid": "38279df9-7995-4178-906d-6dea19c575a0", "title": "Space: 1999", "majtype": "tvseries", "imdbid": "tt0072564"}, {"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "imdbid": "tt0106004"}, {"artifactid": "4298bd88-0cc1-42a1-9e4a-1fa2a3993d6a", "title": "Chernobyl", "majtype": "tvseries", "imdbid": "tt7366338"}, {"artifactid": "4e1ae46f-a5f9-489b-b541-fa12ae7b0350", "title": "Cosmos: A Personal Voyage", "majtype": "tvseries", "imdbid": "tt0081846"}, {"artifactid": "4e4e3fa6-5e21-407e-b60a-929725621b2d", "title": "Hogans Heroes", "majtype": "tvseries", "imdbid": "tt0058812"}, {"artifactid": "62852250-d1dc-400c-8586-7809e41a23fa", "title": "QI", "majtype": "tvseries", "imdbid": "tt0380136"}, {"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "imdbid": "tt0077004"}, {"artifactid": "75fa506c-05ab-49a5-be5f-7ef158a820a2", "title": "Man Down", "majtype": "tvseries", "imdbid": "tt3063454"}, {"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "imdbid": "tt3609352"}], "movie": [{"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "imdbid": "tt0080684"}, {"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "imdbid": "tt0078163"}, {"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "imdbid": "tt0058083"}, {"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "imdbid": "tt0077745"}, {"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "imdbid": "tt0056218"}, {"artifactid": "0f2de6e4-ff23-4c1f-b49f-6a47e7234069", "title": "Sleeper", "majtype": "movie", "imdbid": "tt0070707"}, {"artifactid": "12576b2d-38bb-49d4-9aa2-a91bd67db5dc", "title": "The Simpsons Movie", "majtype": "movie", "imdbid": "tt0462538"}, {"artifactid": "128070c1-c4f6-47bb-b7ab-6b94e30b3f41", "title": "Star Trek II: The Wrath of Khan", "majtype": "movie", "imdbid": "tt0084726"}, {"artifactid": "13985629-fb3c-4a32-8e0b-3ed8ae6e90f5", "title": "Crimson Tide", "majtype": "movie", "imdbid": "tt0112740"}, {"artifactid": "1593680d-4aa8-4860-bddb-9efdf7054e86", "title": "Twister", "majtype": "movie", "imdbid": "tt0117998"}, {"artifactid": "16c0510e-78fa-46e9-8ae8-ad8957627f4f", "title": "Airport 1975", "majtype": "movie", "imdbid": "tt0071110"}, {"artifactid": "1a2d3dbc-20fa-4ba7-a2b6-3e788302f807", "title": "Three Days of the Condor", "majtype": "movie", "imdbid": "tt0073802"}, {"artifactid": "1e8dfd91-564d-46db-93c1-8718b52141da", "title": "Earthquake", "majtype": "movie", "imdbid": "tt0071455"}, {"artifactid": "1f4bd566-641d-4667-ab6a-fc1419090394", "title": "Duel", "majtype": "movie", "imdbid": "tt0067023"}]}, "server": {"tvseries": [{"artifactid": "03d66d13-0c0f-463a-af0b-edbb78d6b517", "title": "Perry Mason", "majtype": "tvseries", "imdbid": "tt0050051"}, {"artifactid": "264ca0c4-6d06-4b58-88a9-1a4c472ee7ba", "title": "The Fall and Rise of Reginald Perrin", "majtype": "tvseries", "imdbid": "tt0073990"}, {"artifactid": "2ed24c32-8365-404a-96ec-711ee2d2cdf6", "title": "Peep Show", "majtype": "tvseries", "imdbid": "tt0387764"}, {"artifactid": "2f91b427-7c8c-4acd-8e40-2a0c5823f149", "title": "American Experience", "majtype": "tvseries", "imdbid": "tt0094416"}, {"artifactid": "3ef463f3-8a82-426e-9a6e-5260973115e8", "title": "Connections 1", "majtype": "tvseries", "imdbid": "tt0078588"}, {"artifactid": "3f45db1f-e61f-4da3-87b0-baaf5f208cd6", "title": "Frasier", "majtype": "tvseries", "imdbid": "tt0106004"}, {"artifactid": "48d00929-8f80-4cf8-873a-224f3ebed793", "title": "From The Earth To The Moon", "majtype": "tvseries", "imdbid": "tt0120570"}, {"artifactid": "4948bc8c-6d9b-4ad7-9c3b-ba0cc0b5fd45", "title": "The IT Crowd", "majtype": "tvseries", "imdbid": "tt0487831"}, {"artifactid": "6cbad761-e403-4f0d-bf49-bbefdfaaa839", "title": "Star Wars: Rebels", "majtype": "tvseries", "imdbid": "tt2930604"}, {"artifactid": "6f4b23e1-83fe-4136-aca4-9210efd0fcf2", "title": "The Duchess Of Duke Street", "majtype": "tvseries", "imdbid": "tt0077004"}, {"artifactid": "7099fc66-cb10-4b6c-b41a-9c1f3f511f6c", "title": "Father Ted", "majtype": "tvseries", "imdbid": "tt0111958"}, {"artifactid": "7805b0b7-b274-4c75-ae6b-68bd8efe57cb", "title": "Avenue 5", "majtype": "tvseries", "imdbid": "tt10234362"}, {"artifactid": "7c7203c2-c4b6-4df7-945e-cfa505fc5257", "title": "The Day The Universe Changed", "majtype": "tvseries", "imdbid": "tt0199208"}, {"artifactid": "82510bf0-ef28-4924-a9c5-03bae33e523a", "title": "House, M.D.", "majtype": "tvseries", "imdbid": "tt0412142"}, {"artifactid": "86238ca3-6862-4721-b6fe-e8d2e875fdda", "title": "Fawlty Towers", "majtype": "tvseries", "imdbid": "tt0072500"}, {"artifactid": "8b1ab865-5c43-488f-954a-dba13c277163", "title": "Poldark", "majtype": "tvseries", "imdbid": "tt3636060"}, {"artifactid": "95a82dab-d94a-4eab-862c-2876e697547a", "title": "Modern Marvels: Engineering Disasters", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "9aebc8fa-82a0-4c34-a516-3bd1ab7b5c54", "title": "Grace And Frankie", "majtype": "tvseries", "imdbid": "tt3609352"}, {"artifactid": "aec0549e-cc1b-40e7-a0af-db641e9ed8ff", "title": "Moon Machines", "majtype": "tvseries", "imdbid": "tt1203167"}, {"artifactid": "bcac590f-a5c1-424f-aa14-82c3526e0405", "title": "NCIS", "majtype": "tvseries", "imdbid": "tt0364845"}, {"artifactid": "c201f148-f45e-4248-afc1-f277371f6bef", "title": "Blackadder", "majtype": "tvseries", "imdbid": "none"}, {"artifactid": "c7b49b7b-8707-42a0-946c-9f0f771ff784", "title": "Monty Python's Flying Circus", "majtype": "tvseries", "imdbid": "tt0063929"}, {"artifactid": "c9ab7d43-5531-4d5f-835c-c7b5c3ff8879", "title": "The Thin Blue Line", "majtype": "tvseries", "imdbid": "tt0112194"}, {"artifactid": "c9e7007b-4628-4578-9f02-8d847ae32550", "title": "Inside Amy Schumer", "majtype": "tvseries", "imdbid": "tt2578508"}, {"artifactid": "e019ff17-9988-4861-bf13-a5a0de75de84", "title": "The Newsroom", "majtype": "tvseries", "imdbid": "tt1870479"}, {"artifactid": "e0a80e99-ac6b-49fa-852b-0b70e9300d1f", "title": "Engineering An Empire", "majtype": "tvseries", "imdbid": "tt0848954"}, {"artifactid": "e29b9ae9-6e5e-416c-b15b-5bba98a0a962", "title": "Still Game", "majtype": "tvseries", "imdbid": "tt0281491"}, {"artifactid": "ed308628-d4bf-4dde-acf5-f3a84d74b1dc", "title": "The Goes Wrong Show", "majtype": "tvseries", "imdbid": "tt9860664"}, {"artifactid": "f55c8c4d-511b-49e5-8e6b-c8be152fa4b8", "title": "Frost/Nixon: The Complete Interviews", "majtype": "tvseries", "imdbid": "tt0261639"}, {"artifactid": "f7d84e14-f7b0-4700-abfe-9c3ad796506b", "title": "Jeeves And Wooster", "majtype": "tvseries", "imdbid": "tt0098833"}], "movie": [{"artifactid": "00b298bf-9998-4c90-8c00-55a70a13f881", "title": "The Death Of Stalin", "majtype": "movie", "imdbid": "tt4686844"}, {"artifactid": "00edc024-9c5d-4b97-a9e5-b79b7ee48f0f", "title": "Strategic Air Command", "majtype": "movie", "imdbid": "tt0048667"}, {"artifactid": "01e0a408-c1f5-481e-be2e-d7b8338bbf25", "title": "upright_citizens_d1-mpg.m4v", "majtype": "movie", "imdbid": "tt0167739"}, {"artifactid": "022622d3-69a7-4b64-b95a-0022522089f0", "title": "Star Wars: Episode V - The Empire Strikes Back", "majtype": "movie", "imdbid": "tt0080684"}, {"artifactid": "02719058-c660-4132-a3c1-a7a93b1693e9", "title": "Medicine Man", "majtype": "movie", "imdbid": "tt0104839"}, {"artifactid": "03189fe8-a68f-4631-8eb2-8277c248a987", "title": "Jojo Rabbit", "majtype": "movie", "imdbid": "tt2584384"}, {"artifactid": "034bd2ca-f283-410b-ac31-2aa0d15e0f92", "title": "O Brother, Where Art Thou?", "majtype": "movie", "imdbid": "tt0190590"}, {"artifactid": "03e80511-7d56-4aa0-9fa0-006d9d4fab18", "title": "The Revenge Of The Pink Panther", "majtype": "movie", "imdbid": "tt0078163"}, {"artifactid": "04cd098c-16b4-41bd-a1a8-40b31e4d2be8", "title": "Fail Safe", "majtype": "movie", "imdbid": "tt0058083"}, {"artifactid": "04fb8351-651e-4740-9b50-13a9392a7897", "title": "Beerfest", "majtype": "movie", "imdbid": "tt0486551"}, {"artifactid": "0504fffb-b0f7-4c81-b77a-8b99ee77f086", "title": "Invasion of the Body Snatchers", "majtype": "movie", "imdbid": "tt0077745"}, {"artifactid": "051bdfca-0418-4943-802e-6d20875822f9", "title": "The Imitation Game", "majtype": "movie", "imdbid": "tt2084970"}, {"artifactid": "0613a102-b416-4fc9-b381-137692055511", "title": "GrandDayOut.m4v", "majtype": "movie", "imdbid": "tt0104361"}, {"artifactid": "06733bf7-0db1-40ce-8098-0d34e946832a", "title": "Zoolander", "majtype": "movie", "imdbid": "tt0196229"}, {"artifactid": "0690c787-619f-40b6-b9d8-99918241166f", "title": "Network", "majtype": "movie", "imdbid": "tt0074958"}, {"artifactid": "06ae6051-bed9-4bec-ab8c-eb1193851963", "title": "Platoon", "majtype": "movie", "imdbid": "tt0091763"}, {"artifactid": "07273465-c4ef-49a7-b709-7d7137a180bc", "title": "Clerks III", "majtype": "movie", "imdbid": "tt11128440"}, {"artifactid": "0848f99b-272a-4024-8010-c2ecfa423888", "title": "Gia", "majtype": "movie", "imdbid": "tt0123865"}, {"artifactid": "08d55215-1f90-4dd9-b065-c64246ed0fee", "title": "Waterworld", "majtype": "movie", "imdbid": "tt0114898"}, {"artifactid": "090187c5-1182-48f0-9ada-a1595a110e53", "title": "The Onion Movie", "majtype": "movie", "imdbid": "tt0392878"}, {"artifactid": "0935ea10-163b-419b-a911-3b9dfdd557dc", "title": "A Mighty Wind", "majtype": "movie", "imdbid": "tt0310281"}, {"artifactid": "099d0df4-b254-4be6-9809-aba84dfa6b32", "title": "The Manchurian Candidate (1964)", "majtype": "movie", "imdbid": "tt0056218"}, {"artifactid": "0a715f56-09bc-4bc8-9d87-a7559f885151", "title": "CrudeAwakening.m4v", "majtype": "movie", "imdbid": "tt0776794"}, {"artifactid": "0c9db4eb-dd69-420f-ade8-776d17a641f8", "title": "BillHicksLive_T5.m4v", "majtype": "movie", "imdbid": "none"}, {"artifactid": "0ccfac0f-b474-4828-a8a5-26534bd93cf4", "title": "MysteryMen", "majtype": "movie", "imdbid": "tt0132347"}, {"artifactid": "0d940d56-938a-4eea-bc29-1f7b7a4a684a", "title": "Hackers", "majtype": "movie", "imdbid": "tt0113243"}, {"artifactid": "0e53430e-3795-4d68-b832-9d460f8b8d3a", "title": "JurassicPark4-mpg.m4v", "majtype": "movie", "imdbid": "string"}, {"artifactid": "0ef74b4c-1d25-41de-99b8-ec615e06f425", "title": "The Russians Are Coming, the Russians Are Coming", "majtype": "movie", "imdbid": "tt0060921"}, {"artifactid": "0f2de6e4-ff23-4c1f-b49f-6a47e7234069", "title": "Sleeper", "majtype": "movie", "imdbid": "tt0070707"}, {"artifactid": "0f3ae067-76cd-4a0b-a0f2-0acd60ea2134", "title": "police_squad-mpg.m4v", "majtype": "movie", "imdbid": "tt0083466"}]}, "rewatch": {"tvseries": [{"artifactid": "07b9a75a-b08c-4f20-bf78-b859a16874d1", "title": "Star Trek: The Next Generation", "majtype": "tvseries", "imdbid": "tt0092455"}, {"artifactid": "1038cc43-ac2a-44e3-b4ec-ee885c693d5a", "title": "Barney Miller", "majtype": "tvseries", "imdbid": "tt0072472"}, {"artifactid": "159af384-d810-4a45-8110-c5b0ac713387", "title": "Mythbusters", "majtype": "tvseries", "imdbid": "tt0383126"}, {"artifactid": "1e193909-b7ec-48d0-9b14-f28f88692baf", "title": "All In The Family", "majtype": "tvseries", "imdbid": "tt0066626"}, {"artifactid": "21a05c78-cef4-4d00-9a0c-17870024ea8a", "title": "Nova", "majtype": "tvseries", "imdbid": "tt0206501"}, {"artifactid": "2412bd7c-cdaa-4a74-93d3-bac6b039da15", "title": "Columbo", "majtype": "tvseries", "imdbid": "tt1466074"}, {"artifactid": "2c0d048e-6cc2-418c-9229-cc9a6f77769b", "title": "Taxi", "majtype": "tvseries", "imdbid": "tt0077089"}, {"artifactid": "305d6fa5-b580-49f6-a183-1e3cf88d3b9d", "title": "The Twilight Zone", "majtype": "tvseries", "imdbid": "tt0052520"}, {"artifactid": "3062158b-e3cf-463e-9890-ad300ac963ac", "title": "Star Trek", "majtype": "tvseries", "imdbid": "tt0060028"}, {"artifactid": "38279df9-7995-4178-906d-6dea19c575a0", "title": "Space: 1999", "majtype": "tvseries", "imdbid": "tt0072564"}, {"artifactid": "3d5e4d5f-daa3-4350-ad31-1863a3cec79d", "title": "Stephen Hawking's Universe", "majtype": "tvseries", "imdbid": "tt0124259"}, {"artifactid": "4298bd88-0cc1-42a1-9e4a-1fa2a3993d6a", "title": "Chernobyl", "majtype": "tvseries", "imdbid": "tt7366338"}, {"artifactid": "4e1ae46f-a5f9-489b-b541-fa12ae7b0350", "title": "Cosmos: A Personal Voyage", "majtype": "tvseries", "imdbid": "tt0081846"}, {"artifactid": "4e4e3fa6-5e21-407e-b60a-929725621b2d", "title": "Hogans Heroes", "majtype": "tvseries", "imdbid": "tt0058812"}, {"artifactid": "62852250-d1dc-400c-8586-7809e41a23fa", "title": "QI", "majtype": "tvseries", "imdbid": "tt0380136"}, {"artifactid": "6d31322b-4ea7-4178-bfcd-6e764a2cf197", "title": "Dirty Jobs", "majtype": "tvseries", "imdbid": "tt0458259"}, {"artifactid": "71a084a7-2a32-40a0-8b12-771f385e30ee", "title": "Garth Marenghi's Darkplace", "majtype": "tvseries", "imdbid": "tt0397150"}, {"artifactid": "737fd8de-aca2-42d5-82b2-2b3d771cbd51", "title": "Poirot", "majtype": "tvseries", "imdbid": "tt0094525"}, {"artifactid": "a7baf85b-4c03-4da1-8154-4b32b08d00d9", "title": "The Beatles: Get Back", "majtype": "tvseries", "imdbid": "tt9735318"}, {"artifactid": "c064bf86-1668-4e46-8471-02134fa03660", "title": "The Computer Chronicles", "majtype": "tvseries", "imdbid": "tt0421311"}, {"artifactid": "c8e9a53a-87b6-4d57-bebf-17de614a0838", "title": "The Orville", "majtype": "tvseries", "imdbid": "tt5691552"}, {"artifactid": "cd7ff82e-e783-415a-af87-f4b0e10cd198", "title": "That Mitchell And Webb Look", "majtype": "tvseries", "imdbid": "tt0499410"}, {"artifactid": "d6ce1f59-49b2-4cce-a940-9433b6bff2a0", "title": "Waiting For God", "majtype": "tvseries", "imdbid": "tt0098945"}, {"artifactid": "d79c032d-e68a-458b-a558-e071a0851c77", "title": "Star Trek: Strange New Worlds", "majtype": "tvseries", "imdbid": "tt12327578"}, {"artifactid": "ddcaeca0-cad1-4413-a2f7-e52a6cbe526d", "title": "Cosmos: A Spacetime Odyssey", "majtype": "tvseries", "imdbid": "tt2395695"}, {"artifactid": "fc366455-7e29-49c1-a9d2-a0d3189ac29a", "title": "'Allo 'Allo!", "majtype": "tvseries", "imdbid": "tt0086659"}, {"artifactid": "fd5e0b6d-5d6a-489c-9249-c25c790a1f8c", "title": "The Blacklist", "majtype": "tvseries", "imdbid": "tt2741602"}], "movie": [{"artifactid": "0ddeff78-c3c4-4dc2-8d2f-a60111436be1", "title": "Tron", "majtype": "movie", "imdbid": "tt0084827"}, {"artifactid": "20f02a64-0478-4e43-92cf-b61874a64828", "title": "The Return Of The Pink Panther", "majtype": "movie", "imdbid": "tt0072081"}, {"artifactid": "4c310798-15ff-4a1a-851e-d11e2e7147b1", "title": "In the Shadow of the Moon", "majtype": "movie", "imdbid": "tt0925248"}, {"artifactid": "4d44b9a0-59d7-4f60-bbea-eb15038a97fe", "title": "Start the Revolution Without Me", "majtype": "movie", "imdbid": "tt0066402"}, {"artifactid": "6b1f7bcd-4140-4b6b-9522-f32788bd7848", "title": "Star Wars: Episode IV - A New Hope", "majtype": "movie", "imdbid": "tt0076759"}, {"artifactid": "78342703-3b00-4658-8dcb-d569cabbf962", "title": "Casino Royale 1967", "majtype": "movie", "imdbid": "tt0061452"}, {"artifactid": "7e678e3e-443a-4665-b290-c9bde2e823d4", "title": "Airport", "majtype": "movie", "imdbid": "tt0065377"}, {"artifactid": "c099d22a-a60d-441b-a6ab-16ffb2f817f3", "title": "The Wonder Of It All", "majtype": "movie", "imdbid": "tt0928406"}, {"artifactid": "d4f2e83f-1ec2-42fd-8e13-aaa6e80121ab", "title": "Everything Everywhere All At Once", "majtype": "movie", "imdbid": "tt6710474"}, {"artifactid": "e984940f-628a-4159-b004-e01e89f5971e", "title": "Tora! Tora! Tora!", "majtype": "movie", "imdbid": "tt0066473"}, {"artifactid": "f37d754f-dbf8-45a2-8214-578d505f483d", "title": "The Dirty Dozen", "majtype": "movie", "imdbid": "tt0061578"}, {"artifactid": "fd60c95a-d646-45ec-8cfe-7c15e8cc5dc2", "title": "The Pink Panther Strikes Again", "majtype": "movie", "imdbid": "tt0075066"}]}}};
        //var recsObj = recApiRetObj['data'];
        var rec = new WMCWARecommend();
        rec.targetParentElementId = 'rmvodrecsmastercontouter';  //rmvodrecsmastercontouter rmvodmasterdiv
        rec.recSrcData = recApiRetObj;
        rec.popMasterDiv(sinceDtStrIn);
    }
function deetShow(eventObjIn){
    //console.log("deetShow: " + JSON.stringify(eventObjIn));
    //console.log("deetShow: " + this.dataset.artifactid);
    var rec = new WMCWARecommend();
    document.getElementById('artifactDetailDiv').dataset.artifact = this.dataset.artifact;
    rec.artiHover(this.dataset.artifactid);
}
function deetHide(eventObjIn){
    //console.log("deetHide: " + JSON.stringify(eventObjIn));
    var rec = new WMCWARecommend();
    rec.hideartiDetailDiv();
}
function recArtiDeetSeasonEpisodes(selectDEIdIn){
    // console.log(selectDEIdIn);
    var de = document.getElementById(selectDEIdIn);
    var deetDE = document.getElementById('artifactDetailDiv');
    //console.log(deetDE.dataset.artifact);
    //console.log(deetDE.dataset.atrifactid);
    var artiObj = JSON.parse(deetDE.dataset.artifact)[0];
    console.log("recArtiDeetSeasonEpisodes: " + document.getElementById(selectDEIdIn).value);
    document.getElementById('rec-series-ep-list').innerHTML = "Show episode list for " + artiObj['title'] + " season " + String(de.value);
}

class WMCWARecommend {
    constructor(){
        this.targetParentElementId = 'rmvodmasterdiv';
        this.recSrcData = {'meta':{'create_date':''},'data':{}}
        this.maxRecs = 20;
        this.posterHeightPx = 215;
        this.posterWidthFraction = 0.75;
        this.posterLeftMarginPx = 25;
        this.artiHoverDelayMs = 1000;
        
        this.recClassDefLU = {};
        this.recClassDefLU['tags'] = "Based on Tags of things you've watched";
        this.recClassDefLU['people'] = "Based on People involved in creating things you've watched";
        this.recClassDefLU['others'] = "Based on what other people have watched on this server";
        this.recClassDefLU['server'] = "Based on the server's recommendation";
        this.recClassDefLU['rewatch'] = "Based on things you've watched, and may want to revisit";        
        
        this.artiClassDefLU = {};
        this.artiClassDefLU['tvseries'] = "TV Series";
        this.artiClassDefLU['movie'] = "Movie";
    }
    popMasterDiv(sinceDTStrIn) {
        
        var recsObj = this.recSrcData['data'];

        // Event Handler Functions
        // var mouseEnterFunc = deetShow;
        var mouseEnterFunc = function(fooIn){
            //console.log("Mouse Enter registered for " + String(this.id));
            //console.log("Artifact ID: " + String(this.dataset.artifactid));
        }

        // var mouseLeaveFunc = deetHide;
        var mouseLeaveFunc = function(fooIn){
            //console.log("Mouse Leave registered for " + String(this.id));
            //console.log("Artifact ID: " + String(this.dataset.artifactid));
        }
        
        //var MouseClicFunc = function(fooIn){
            //console.log("Mouse Click registered for " + String(this.id));
            //console.log("Artifact ID: " + String(this.dataset.artifactid));
        //}
        var MouseClicFunc = deetShow;
                        
        var roKeys = Object.keys(recsObj);
        var recClass = "";
        var mtClass = "";
        for ( var i = 0; i < roKeys.length; i++ ) {
            var rtKeys = Object.keys(recsObj[roKeys[i]]);
            var rowCont;
            //var mtCount = 0;
            for ( var j = 0; j < rtKeys.length; j++ ) {
                mtClass = rtKeys[j];
                recClass = roKeys[i];
                if (recsObj[roKeys[i]][rtKeys[j]].length < 1) {
                    console.log('recsObj[' + roKeys[i] + '][' + rtKeys[j] + '] has no elements.  Skipping.')
                    continue;
                }
                rowCont = document.createElement('div');
                rowCont.id = "recs:" + roKeys[i] + ":" + rtKeys[j] + "_rowcont";
                rowCont.className = "recs-carousel-rowcontainer";
                //console.log("About to process individual artifacts for " + roKeys[i] + ":" + rtKeys[j] + " - " + String(recsObj[roKeys[i]][rtKeys[j]].length));
                for ( var k = 0; k < recsObj[roKeys[i]][rtKeys[j]].length; k++ ) {
                    try {
                        var artiObj = recsObj[roKeys[i]][rtKeys[j]][k];
                        //console.log("recClass: " + recClass + ", mtClass: " + mtClass + ", k: " + String(k) + " - " + JSON.stringify(recsObj[roKeys[i]][rtKeys[j]][k]));
                        
                        // Prep the outer Div for the Artifact Tile
                        var arOuter = document.createElement('div');
                        var idStr = "recs:" + roKeys[i] + ":" + rtKeys[j] + ":" + String(k);
                        arOuter.id = idStr;
                        var cnStr = "recs-carousel-rec-outer"
                        arOuter.className = cnStr;
                        var artiId = artiObj['artifactid'];
                        arOuter.dataset.artifactid = artiId;  // <<<<======== LET'S MAKE A POINT OF MAKING BETTER USE OF THIS FUNCTIONALITY
                        arOuter.dataset.artifact = JSON.stringify(this.recSrcData['artifacts'][artiId]);
                        // Add event listeners to the Artifact Tile
                        // -- note: at a later date it might make sense to 
                        // have different zones of the tile (maybe one
                        // for artifact details, and one for direct play
                        // ...and a third for ... looking at the episode
                        // list if it's a series...?
                        arOuter.addEventListener("mouseenter",mouseEnterFunc);
                        arOuter.addEventListener("mouseleave",mouseLeaveFunc);
                        arOuter.addEventListener("click",MouseClicFunc);
                        
                        var htmlStr = "";
                        var ih = this.posterHeightPx;
                        var iw = parseInt(ih * this.posterWidthFraction);
                        
                        // Prep the "Poster Div"
                        var posterDiv = document.createElement('div');
                        posterDiv.style.marginLeft = String(this.posterLeftMarginPx) + "px";
                        var posterImg = document.createElement('img');
                        posterImg.width = iw ;
                        posterImg.height = ih ;
                        if (artiObj['imdbid'] != '' & artiObj['imdbid'] != undefined & artiObj['imdbid'] != 'string' & artiObj['imdbid'] != 'none') {
                            posterImg.src = 'http://rmvid/rmvod/img/poster_00/' + artiObj['imdbid'] + '.jpg' ;
                        } else {
                            //posterDiv.innerHTML = "<b>Oops!  No Poster!</b>";
                            posterImg.src = 'http://rmvid/rmvod/img/RMVOD_NoPoster.png' ;
                            // RMVOD_NoPoster.png
                        }
                        posterDiv.appendChild(posterImg);
                        
                        // Prep the "Title Div"
                        var titleDiv = document.createElement('div');
                        titleDiv.style.marginLeft = "5px";
                        titleDiv.style.marginRight = "5px";
                        titleDiv.innerHTML = '<b>' + artiObj['title'] + '</b>';
                        
                        // Assemble the "Artifact Tile"
                        arOuter.appendChild(posterDiv);
                        arOuter.appendChild(titleDiv);
                        
                        // Add the "Artifact Tile" to the Carousel Row
                        rowCont.appendChild(arOuter);
                        
                        // If we've exceeded the maximum number of 
                        // recommendations, bail out of the loop
                        if (k > this.maxRecs) {
                            break;
                        }
                    } catch (e) {
                        console.log( "Well, that's fucked.  INDEX: " + String(k) + "; JSON: " + JSON.stringify(artiObj) + " (" + e + ")");
                    }
                }
                //mtCount += 1;
                
                var labelDiv = document.createElement('div');
                labelDiv.style.marginTop = "10px";
                labelDiv.style.marginBottom = "2px";
                labelDiv.innerHTML = "<b>" + this.artiClassDefLU[mtClass] + " Recommendations " + this.recClassDefLU[recClass] + "</b>";
                
                var recOuter = document.createElement('div');
                recOuter.id = "recs:" + recClass + ":" + mtClass + "_outer";
                recOuter.className = "recs-carousel-outer"; 
                
                recOuter.appendChild(rowCont);
                
                document.getElementById(this.targetParentElementId).appendChild(labelDiv);  
                document.getElementById(this.targetParentElementId).appendChild(recOuter);              
            }
        }
    }
    playFromRecs(deIdIn, ArtiIdIn){
        //Turn the tile pink
        
        //get the filename
        
        //populate the player
        
    }
    showArtiDetailDiv(){
        var artiIdIn = document.getElementById('artifactDetailDiv').dataset.artifactid;
        //console.log('showArtiDetailDiv - artiIdIn: ' + artiIdIn);
        
        //console.log(document.getElementById('artifactDetailDiv').dataset.artifact);
        
        var artiJson = document.getElementById('artifactDetailDiv').dataset.artifact;
        //console.log(artiJson);
        var artiDetObj = JSON.parse(artiJson)[0];
        //console.log(Object.keys(this.recSrcData));
        
        var tagListStr = "";
        var writerListStr = "";
        var directorListStr = "";
        var castListStr = "";
        
        // Make tag list
        try {
            var iterLimit = 5;
            var iterLimit = artiDetObj['tags'].length;
            //var tagListStr = "";
            for (var i=0; i < iterLimit; i++ ) {
                tagListStr += artiDetObj['tags'][i];
                if (i < (iterLimit - 1)) {
                    tagListStr += ", ";
                }
            }     
        } catch(e) {
            console.log("Could not create tagList.");
        }
        // Make writer list
        try {
            var iterLimit = 5;
            var iterLimit = artiDetObj['writer'].length;
            //var writerListStr = "";
            for (var i=0; i < iterLimit; i++ ) {
                writerListStr += artiDetObj['writer'][i];
                if (i < (iterLimit - 1)) {
                    writerListStr += ", ";
                }
            }     
        } catch (e) {
            console.log("Could not create writerList.");
        }
        // Make director list
        try {
            var iterLimit = 100;
            var iterLimit = artiDetObj['director'].length;
            //var directorListStr = "";
            for (var i=0; i < iterLimit; i++ ) {
                directorListStr += artiDetObj['director'][i];
                if (i < (iterLimit - 1)) {
                    directorListStr += ", ";
                }
            }   
        } catch(e) {
            console.log("Could not create directorList.");
        }
        // Make cast list
        try {
            var iterLimit = 100;
            var iterLimit = artiDetObj['primcast'].length;
            //var castListStr = "";
            for (var i=0; i < iterLimit; i++ ) {
                castListStr += artiDetObj['primcast'][i];
                if (i < (iterLimit - 1)) {
                    castListStr += ", ";
                }
            }  
        } catch (e) {
            console.log("Could not create castList.");
        }
        
        try {
            var htmlStr = '';
            htmlStr += "<div><span class='arti-detail-title'><b>" + artiDetObj['title'] + "</b></span>" + "</div>";
            htmlStr += "<div class='arti-detail-item'>" + artiDetObj['relyear'] + "    |  " + artiDetObj['majtype'];
            htmlStr += "    |    Runtime:" + artiDetObj['runmins'] + " minutes    |    ";
            htmlStr += tagListStr;
            htmlStr +=  "</div>";
            
            var playDivStyle = "border: 2px black solid;padding:3px;"
            var playDivHtmlStr = '';
            if (artiDetObj['majtype'] == 'tvseries') {
                
                // Build season option list
                // Once integrated we would probably get this from the API
                var seasonNrList = [1,2,3,4,5];
                var seasonOptListStr = "";
                for (var n = 0; n < seasonNrList.length; n++ ) {
                    var sNum = seasonNrList[n];
                    seasonOptListStr += "<option value='" + String(sNum) + "'>Season " + String(sNum) + "</option>";
                }
                
                playDivHtmlStr += "<div data-artifactid='" + artiIdIn + "' style='";
                playDivHtmlStr += playDivStyle + "'>";
                playDivHtmlStr += "<select id='recDeetSeriesSeasonSelect' data-artifactid='" + artiIdIn ;
                playDivHtmlStr += "' onchange='recArtiDeetSeasonEpisodes(this.id)'>";
                playDivHtmlStr += "<option value='NONE'>Seasons</option>";
                playDivHtmlStr += seasonOptListStr;
                playDivHtmlStr += "</select>";
                playDivHtmlStr += "    |    <span data-artifactid='" + artiIdIn;
                playDivHtmlStr += "'  onclick='console.log(\"Play " + artiIdIn + " from the beginning.\")' >";
                playDivHtmlStr += "Play Series from start</span></div>";
            } else {
                playDivHtmlStr += "<div data-artifactid='" + artiIdIn + "' style='" + playDivStyle ;
                playDivHtmlStr += "'><span data-artifactid='" + artiIdIn ;
                playDivHtmlStr += "'  onclick='console.log(\"Play " + artiIdIn + "\")' >Play this Title</span></div>";
            }
            //console.log(playDivHtmlStr);
            htmlStr += playDivHtmlStr;
            
            htmlStr += "<div class='arti-detail-item'>" + artiDetObj['synopsis'] + "</div>";
            htmlStr += "<div class='arti-detail-item'><b>Director(s): </b>" + directorListStr + "</div>";
            htmlStr += "<div class='arti-detail-item'><b>Writer(s): </b>" + writerListStr + "</div>";
            htmlStr += "<div class='arti-detail-item'><b>Cast: </b>" + castListStr + "</div>";
            htmlStr += "<div class='arti-detail-item'>" + artiIdIn + "</div>";
            
            if (artiDetObj['majtype'] == 'tvseries') {
                htmlStr += "<div id='rec-series-ep-list' class='arti-detail-item'><a name='episodeList'></a>Series Ep List</div>";
            }
            
            //htmlStr += "<div>" +  + "</div>";
        } catch (e) {
            console.log("Could not create htmlStr.");
        }
        
        
        var deetPoster = document.createElement('div');
        deetPoster.style.display = "block";
        deetPoster.style.width = "40%";
        deetPoster.style.height = "100%";
        deetPoster.style.padding = "7px";
        var dpHtml = "<div style='padding:3px;'><span onclick='deetHide()'><b>X [close]</b></span></div>";
        if (artiDetObj['imdbid'] != '' & artiDetObj['imdbid'] != undefined & artiDetObj['imdbid'] != 'string' & artiDetObj['imdbid'] != 'none') {
            
            //this.posterHeightPx = 215;
            //this.posterWidthFraction = 0.75;    
            var ph = this.posterHeightPx * 1.90;
            var pw = ph * this.posterWidthFraction;
            
            //deetPoster.innerHTML = '<img width="161" height="215" src="http://rmvid/rmvod/img/poster_00/' + artiDetObj['imdbid'] + '.jpg">';
            dpHtml += '<img width="' + pw + '" height="' + ph + '" src="http://rmvid/rmvod/img/poster_00/' + artiDetObj['imdbid'] + '.jpg">';
        } else {
            //                            posterImg.src = 'http://rmvid/rmvod/img/RMVOD_NoPoster.png' ;
            dpHtml += '<img width="' + pw + '" height="' + ph + '" src="http://rmvid/rmvod/img/RMVOD_NoPoster.png">';
        }

        deetPoster.innerHTML = dpHtml;
        
        
        var deetContent = document.createElement('div');
        deetContent.style.display = "block";
        deetContent.style.width = "60%";
        deetContent.style.height = "95%";
        deetContent.style.padding = "7px";
        deetContent.style.overflow = "auto";
        deetContent.innerHTML = htmlStr
                
        
        var deetOuter = document.createElement('div');
        deetOuter.style.display = "inline-flex";
        deetOuter.style.width = "100%";
        deetOuter.style.height = "100%";
        
        deetOuter.appendChild(deetPoster);
        deetOuter.appendChild(deetContent);
         
        var fd = document.getElementById('artifactDetailDiv');
        //fd.innerHTML = htmlStr;
        fd.appendChild(deetOuter);
        fd.style.display = "block";
    }
    hideartiDetailDiv(){
        var fd = document.getElementById('artifactDetailDiv');
        clearTimeout(fd.dataset.timeout);
        fd.innerHTML = '';
        fd.style.display = "none";
    }
    artiHover(artiIdIn) {
        //this.artiHoverDelayMs;
        //var artiId = 0;
        //console.log(artiIdIn);
        var dDiv = document.getElementById('artifactDetailDiv');
        dDiv.innerHTML = '';
        //dDiv.dataset.artifactid = dDiv.dataset.artifactid; //artiIdIn
        dDiv.dataset.artifactid = artiIdIn; //artiIdIn
        //dDiv.dataset.timeout = setTimeout(this.showArtiDetailDiv,this.artiHoverDelayMs);
        this.showArtiDetailDiv();
        
    }
    
}



//
// NEW CODE TO SUPPORT RECOMMENDATIONS -- END
//






// Provide a single entrypoint into the RMVodWebApp
function switchboard(actionIn,objIdIn,argObjIn) {
    var ml = new RMVodWebApp();
    
    switch (actionIn) {
        
        case "firstthing":
            ml.basePageLayout02();
            ml.resetPageTitle();
            ml.clockSet();
            ml.initStorage();
            ml.execSearchSingleFactor2('tag',{'tag':''});
            ml.renderStaticModernSearchWidget();
            ml.onloadOptions();
            ml.contCookieOnLoad();
            
            //
            recsWrapper('2023-05-25 11:39:05');
            //
            
            break;

        case 'simpleNamesList':  
            var tmpDiv = ml.renderArtifactBlocksByTag(objIdIn);
            document.getElementById('div01').appendChild(tmpDiv);
            break;        
            
        case "vodPlayTitle":
            ml.vodPlayTitleApi3(objIdIn);
            break;
            
        case "vodPlayNextTitle":
            ml.contCookieNaturalEnd();
            ml.vodPlayNextTitle(objIdIn);
            break;
            
        case 'tvsExpandEpisodes':
            var serDeetDivId = objIdIn +  '-sidelist-detail-outer';
            var epListDivId = objIdIn + '-sidelist-episode-list-outer';
            var dispState = document.getElementById(epListDivId).style.display;
            if (dispState == 'block') {
                document.getElementById(epListDivId).style.display = 'none';
                document.getElementById(epListDivId).innerHTML = '';
                document.getElementById(serDeetDivId).style.display = 'none';
                document.getElementById(serDeetDivId).innerHTML = '';
            } else {
                document.getElementById(epListDivId).style.display = 'block';
                ml.populateSeriesEpisodes(objIdIn);
                document.getElementById(serDeetDivId).style.display = 'block';
                ml.tvsDetailShowButton(objIdIn);
            }
            break;
        
        case 'xpopsldetail' :
            deid = objIdIn + '-sidelist-detail-outer';
            var deObj = document.getElementById(deid);
            var dispState = deObj.style.display;
            if (dispState == 'block') {
                deObj.style.display = 'none';
            } else {
                deObj.style.display = 'block';
                ml.populateArtifactDetails(objIdIn);
            }
            break;
        case 'xpopslseriesdetail' :
            deid = objIdIn + '-sidelist-detail-outer';
            var deObj = document.getElementById(deid);
            var dispState = deObj.style.display;
            ml.populateArtifactDetails(objIdIn);
            break;
        
        case 'execTagSearch' :
            tagVal = document.getElementById(objIdIn).value;
            ml.execSearchSingleFactor2('tag',{'tag':tagVal});
            break;   
            
        case 'execTxtSrch' :
            var srchBoxDE = document.getElementById(objIdIn);
            ml.execSearchSingleFactor2('text',{'text':srchBoxDE.value});
            break;
            
        case 'execMajTypSrch':
            var mtVal = document.getElementById(objIdIn).value;
            ml.execSearchSingleFactor2('majtype',{'majtype':mtVal});
            break;
            
        case 'execRelyearSrch':
            var ryVal2 = document.getElementById(objIdIn).value;
            var ryVal1 = document.getElementById('relyear-srch-start').value;
            ml.execSearchSingleFactor2('relyear',{'relyear1':ryVal1,'relyear2':ryVal2});
            break;
            
        case 'execWhereClauseSrch':
            const re = /'/g;
            var rawWCStr = document.getElementById(objIdIn).value.replace(re,"\'");
            ml.execSearchSingleFactor2('whereclause',{'whereclause':rawWCStr});
            break;
            
        case 'execDirectStringSrch' :
            ml.execSearchSingleFactor2('text',{'text':argObjIn['srchstr']},true);
            break;
        
        case 'initiateArtiEdit':
            ml.renderArtifactEdit(objIdIn);
            document.getElementById('RNWATabWidget-tabspan-2').click();
            break;
            
        case 'updateArtifactField' :
            ml.postArtifactFieldEdit(objIdIn,argObjIn);
            break;
            
        case 'checkboxChange':
            const cookieNm = 'opt_' + objIdIn;
            const cookieVal = document.getElementById(objIdIn).checked;
            ml.cc.setCookie(cookieNm,cookieVal,365);
            break;
        
        case 'listAction':
            ml.apiExecListAction(objIdIn,argObjIn['action']);
            break;
            
        case 'formNewSingleArti': 
            ml.renderNewSingleArtiForm();
            break;
            
        case 'formNewMultiArti':
            ml.renderNewMultiArtiForm();
            break;
            
        case 'singleNewArtiSubmit':
            ml.apiSubmitNewSingleArtiForm();
            break;
            
        case 'multiNewArtiSubmit':
            ml.apiSubmitNewMultiArtiForm();
            break;
            
        case 'mfSetCheck':
            var de = document.getElementById(objIdIn);
            ml.handleMFSCBStateChange(de.checked);
            break;
            
        case 'execmfsrch': 
            ml.execSearchMultiFactor();
            break;
            
        case 'seriesAddEpisodesForm':
            ml.renderSeriesEpisodeAddForm(argObjIn); 
            break;
        case 'seriesEpisodeAddSubmit':
            var seriesaid = document.getElementById('naartifactid').value;
            var filepath = document.getElementById('nafilepath').value;
            var filefrag = document.getElementById('nafilename').value;
            ml.execAddSeriesEpisodes(seriesaid,filepath,filefrag);
            break;
        /* 
         * Oh no... we should never get here!
         * */
        default:
            var xcStr = 'Action ' + actionIn + ' is not recognized!  ';
            xcStr += 'Received objIdIn = ' + objIdIn + '  and ';
            xcStr += 'argObjIn = ' + JSON.stringify(argObjIn) + '.';
            throw new Error(xcStr); 
    }
}

// Handle "Playback Ends" event
function pbEnded (artiIdIn) {
    console.log('The playback it has ended');
    switchboard('vodPlayNextTitle',artiIdIn,{});
}   

// Handle "Remove Member" event of RNWAListFieldWidget
function removeMember(deIdIn) {
    console.log('removeMember - ' + deIdIn);
    switchboard('listAction',deIdIn,{'action':'remove-member'})
}

// Handle "Add Member" event of RNWAListFieldWidget
function addMember(deIdIn) {
    console.log('addMember - ' + deIdIn);
    switchboard('listAction',deIdIn,{'action':'add-member'})
}

// Handle "Add Choice" event of RNWAListFieldWidget
function addChoice(deIdIn) {
    var re = /_AddMemberButton/;
    if (deIdIn.search(re) > -1) {
        var de = document.getElementById(deIdIn);
        var newDeId = deIdIn.replace(re,'_new_option');
        de.parentElement.innerHTML = '<input id="' + newDeId + '" type="text" onchange="addChoice(this.id)">';
        document.getElementById(newDeId).focus();
    } else {
        switchboard('listAction',deIdIn,{'action':'add-choice'});
    }
}

function tabPick(deIdIn){
    // RNWATabWidget.selectTab
    var tw = new RNWATabWidget();
    tw.selectTab(deIdIn);
}
 
