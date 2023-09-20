
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
        tmpAry.push('<div id="structreaturerecs">' + this.renderHTMLRecsTab() + '</div>');
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
        //tmpHtml += '<div class="headerflexcell" id="headerblock4">';
        tmpHtml += '<div id="headerblock4" style="width:100%; height:100%; overflow:auto;>'; //  class="headerflexcell"
        tmpHtml += '<div class="" id="" style="display:block;overflow:auto;">';
        tmpHtml += '<div><b>Settings</b></div>';
        tmpHtml += '<div><b>Play next in series: </b><input name="serplaynext" id="serplaynext" type="checkbox"></div>';
        tmpHtml += '<div><b>Resume play: </b><input name="resumeplay" id="resumeplay" type="checkbox"></div>';
        tmpHtml += '<div><b>Play fullscreen: </b><input name="fullscreenplay" id="fullscreenplay" type="checkbox"></div>';
        
        tmpHtml += '<div><span onclick="switchboard(\'formNewSingleArti\',\'\',{})">'  // syle="text-decoration:underline;font-weight:bold;" 
        tmpHtml += '<b><u>Create a single Artifact</u></b>'
        tmpHtml += '</span></div>';
        
        tmpHtml += '<div><span onclick="switchboard(\'formNewMultiArti\',\'\',{})">'  // syle="text-decoration:underline;font-weight:bold;" 
        tmpHtml += '<b><u>Create a multiple Artifacts</u></b>'
        tmpHtml += '</span></div>';
        
        //tmpHtml += '<div><span onclick="switchboard(\'formNewMultiArti\',\'\',{})">'  // syle="text-decoration:underline;font-weight:bold;" 
        //tmpHtml += '<b><u>Create a multiple Artifacts</u></b>'
        //tmpHtml += '</span></div>';
        
        tmpHtml += '<div><span onclick="switchboard(\'forcerecrefresh\',\'\',{})">'  // syle="text-decoration:underline;font-weight:bold;" 
        tmpHtml += '<b><u>Refresh Recs</u></b>'
        tmpHtml += '</span></div>';
        
        
        tmpHtml += '<div id="sitestatsouter" style="width:1160px;">Show Site Stats</div>';
        
        
        
        //forcerecrefresh
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
        tmpHtml += '<div id="artifactDetailDiv" class="arti-detail-float">&nbsp;</div>';
        tmpHtml += '<div id="rmvodrecsmastercontouter" class="rmvodrecsmastercontouter">';
        //tmpHtml += '<b>This would be where the Recommendations would go if they worked</b>';
        tmpHtml += '</div>';
        //tmpHtml += '';
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
        sstorTemplObj.push({'name':'apicfg','type':'dict','content':'{}'}); // Tree Metadata
        sstorTemplObj.push({'name':'recdata','type':'dict','content':'{}'}); // Tree Metadata
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
        
        this.sse.ssOKWrite('localcfg','rowsbgc',['#444444','#0c0c0c']); 
        this.sse.ssOKWrite('localcfg','sitestatsperiod',{'days':180,'weeks':26,'months':6}); 
        
        
        // This needs to happen later due to API Config fetch
        //this.apiFetchPersonsList();
        //this.apiFetchCompaniesList();
        //this.apiFetchTagsList();
        
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
        
        // Set local copy of the API's configuration
        console.log('Attempting to fetch API Config values');
        var wa = new RMVodWebApp();
        var cbFunc = function (objIn) {
            // console.log('apicfg => storing ' + JSON.stringify(objIn));
            var sse = new RMSSSEnhanced();
            sse.ssWrite('apicfg',objIn['data']);
            //console.log('apicfg => stored ' + JSON.stringify(sse.ssRead('apicfg')));
        }
        var payloadObj = {};
        var endpoint = '/rmvod/api/config/get';
        var result = wa.genericApiCall(payloadObj,endpoint,cbFunc); 
        
        this.apiFetchPersonsList();
        this.apiFetchCompaniesList();
        this.apiFetchTagsList();
                
        // These version bits will eventually need to involve polling 
        // the API and DB for their versions
        this.apiFetchRemoteVersions();
        this.postJSVer("0.9.1");
    }
    getApiConfigValue(majorKeyIn,minorKeyIn){
        console.log('getApiConfigValue: ' + majorKeyIn + ', ' + minorKeyIn);
        var retval;
        //try {
            retval = this.sse.ssRead('apicfg')[majorKeyIn][minorKeyIn];
        //} catch (e) {
            //console.log("Caught Exception " + e);
            //console.log("Gonna wait a sec and try again.");
            //var done = false;
            //var cbFunc = function() {
                //var wa = new RMVodWebApp();
                //console.log("Starting the callback " , majorKeyIn, minorKeyIn);
                //var intVal = wa.sse.ssRead('apicfg');
                //retval = intVal[majorKeyIn][minorKeyIn];
                //done = true;
                //console.log("DONE with the callback");
            //}
            //setTimeout(cbFunc,2000);
            ////while (done == false) {
                //////var otherFunc = function() {
                    //////console.log("sit here like a dummy");
                //////}
                //////setTimeout(otherFunc,250);
            ////}
            
        //}
        
        
        
        //var cbFunc = function(valIn = retval){
            //valIn = this.sse.ssRead('apicfg')[majorKeyIn][minorKeyIn];
        //}
        //try {
            //retval = this.sse.ssRead('apicfg')[majorKeyIn][minorKeyIn];
        //} catch (e) {
            //setTimeout(cbFunc,delay);
        //}
        return retval;
        
    }
    resetPageTitle(){
        document.title = "RIBBBITmedia VideoOnDemand";
        var tries = 0;
        var maxTries = 1;
        var delay = 1000;
        var startTitle = document.title;
        var cbFunc = function(){
            try {
                var wa = new RMVodWebApp();
                var apiCfg = wa.sse.ssRead('apicfg');
                wa.setPageTitle(apiCfg['API_Settings']['service_name']); 
            } catch (e) {
                console.log('API config not ready yet');
            }
        }
        while ((document.title == startTitle) & (tries < maxTries)){
            setTimeout(cbFunc,delay);
            tries += 1
        } 
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //var apiBase = this.getApiConfigValue('API_Resources','api_path');
        //const endpoint = apiBase + '/apiversion/get';
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //var apiBase = this.getApiConfigValue('API_Resources','api_path');
        //const endpoint = apiBase + '/suplist/get';
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
        ////var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //var apiBase = this.getApiConfigValue('API_Resources','api_path');
        //const endpoint = apiBase + '/suplist/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
    }
    apiFetchSiteStats(){
        var cbFunc = function (dataObjIn) {
            
            var wa = new RMVodWebApp();
            //<div id="sitestatsdatastore" data-sitestats="" style="display:none;"></div>

            wa.renderStatsContainer('sitestatsouter');
            //ml.renderStatsContainer('statstabbody');
            var dsDiv = document.getElementById("sitestatsdatastore");
            dsDiv.dataset.sitestats = JSON.stringify(dataObjIn['data']);
            
            wa.renderStatsMajIdCol('stats_majid_column');              
            
            //console.log(objIn);
            
            //var jsTreeWalker = function(objIn, indentInt, continueString) {
                //// console.log(typeof objIn);
                //switch (typeof objIn) {
                    //case typeof "string":
                        //console.log(".".repeat(indentInt) + continueString + objIn); // "leaf string "
                        //break;;
                    //case typeof 3:
                        //console.log(".".repeat(indentInt) + continueString + objIn.toString()); // "leaf integer "
                        //break;;
                    //case typeof 3.2:
                        //console.log(".".repeat(indentInt) + continueString +  objIn.toString()); //"leaf float "
                        //break;;
                    //case typeof true:
                        //console.log(".".repeat(indentInt) + continueString +  objIn.toString()); // "leaf boolean "
                        //break;;
                    //case typeof {'foo':'bar'}:
                        //if (Array.isArray(objIn)){
                        ////console.log("Array - Recursing " + objIn.length.toString());
                            //console.log(".".repeat(indentInt) + continueString + " [");
                            //for (var i = 0; i < objIn.length; i++){
                                ////console.log("..index " + i.toString());
                                //jsTreeWalker(objIn[i], indentInt + 1, i.toString() + "-");
                            //}                            
                            //console.log(".".repeat(indentInt) + "]");
                        //} else {
                            ////console.log("Object - Recursing");
                            //var keysList = Object.keys(objIn);
                            //console.log(".".repeat(indentInt) + continueString + " {");
                            //for (var i = 0; i < keysList.length; i++){
                                ////console.log("..key " + keysList[i]);
                                //jsTreeWalker(objIn[keysList[i]], indentInt + 1, keysList[i] + "-");
                            //}
                            //console.log(".".repeat(indentInt) + "}");
                        //}                        
                        
                        //break;;

                    //default:
                        //console.log("I don't know what to do with this " + typeof objIn);
                //}
            //};
            
            //jsTreeWalker(dataObjIn,0,"")
            
            
            
        }
        const payloadObj = {};
        const endpoint = '/rmvod/api/site/stats/get';
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
        ////var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //var apiBase = this.getApiConfigValue('API_Resources','api_path');
        //const endpoint = apiBase + '/suplist/get';
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/listfield/update';
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
    // Kick-off populating Episode details from OMDBAPI
    apiPopulateEpisodeDetails(artIdIn){
        var cbFunc = function (dataObj){
            console.log("apiPopulateEpisodeDetails.cbFunc " + artIdIn + ": " + JSON.stringify(dataObj));
        }
        var endpoint = '/rmvod/api/artifact/tvseries/detail/fetch';
        var payloadObj = {'artifactid':artIdIn};
        this.genericApiCall(payloadObj,endpoint,cbFunc);
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
            
            //Are we playing full-screen by default?  Let's find out.
            var fstf = document.getElementById('fullscreenplay').checked;
            wa.cc.setCookie('opt_fullscreenplay',String(fstf),365);
            
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
            var clientAbbrev = wa.sse.ssRead('apicfg')['API_Settings']['service_abbrev'];
            //wa.setPageTitle('RMVOD: ' + dataObjIn['title']);
            wa.setPageTitle(clientAbbrev + ': ' + dataObjIn['title']);
            // Setup an "interval" to post the current play time to a 
            // cookie to be used in "resume payback"
            try {
                wa.contCookiePostInterval(60000);
            } catch (e) {
                console.log('vodPlayTitleApi2 cbFunc barfed on trying wa.contCookiePostInterval(60000): ' + e);
            }
            
            // If we're supposed to play in full screen, let's do that now.
            try {
                if (wa.cc.getCookie('opt_fullscreenplay') == 'true') {
                    document.getElementById('actualvideoplayer').webkitRequestFullscreen();
                }
            } catch (e) {
                console.log("webkitEnterFullScreen not supported.  " + e);
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const apiEndpoint = apiBase + '/artifact/get'; 
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const apiEndpoint = apiBase + '/logplay/post'; 
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
        
        //dump out of FullScreen
        try {
            var pNextTF = String(document.getElementById('serplaynext').checked);
            var pFullTF = String(document.getElementById('fullscreenplay').checked);
            if ((pNextTF == 'false') & (pFullTF == 'true')) {
                //document.getElementById('actualvideoplayer').webkitExitFullScreen(); // requestFullscreen
                document.getElementById('actualvideoplayer').requestFullscreen(); // requestFullscreen
            }
        } catch (e) {
            console.log("webkitExitFullScreen not supported.  " + e);
        }
        
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/nextepisode/get';
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/suplist/get';
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/seriestidlist/get';
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
            
            console.log("RMVodWebApp.populateArtifactDetails - objIn['poster']: " + objIn['poster']);
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
            
            //popepideets
            if (objIn['majtype'] == 'tvseries') {
                innerHtml += '&nbsp;&nbsp;';
                innerHtml += '<span class="" id="" style="font-size:10px;"';
                innerHtml += 'onclick="switchboard(\'popepideets\',\'' ;
                innerHtml +=  objIn['artifactid'] + '\',{})" ';
                innerHtml += '>'; 
                innerHtml += '<u>Populate Episode Details</u>';
                innerHtml += '</span>';                
            }            
            
            var docElId = artiIdIn + '-sidelist-detail-outer';
            var deetDiv = document.getElementById(docElId);
            deetDiv.innerHTML = innerHtml;
        }
        const endpoint = '/rmvod/api/artifact/get';
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/get';
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
                    
                    wa.dispLastSrchFactors();     
                }
                if (srchValObjIn['tag'].length > 0){
                    payloadObj = {'tag':srchValObjIn['tag']};
                } 
                endpoint = "/rmvod/api/titleidlist/get";
                //var wa = new RMVodWebApp();
                //var apiBase = wa.sse.ssRead('apicfg')['API_Resources']['api_path'];
                //endpoint = apiBase + '/titleidlist/get';
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
                        
                        wa.dispLastSrchFactors();     
                    }
                }
                if (srchValObjIn['text'].length > 0){
                    payloadObj = {'srchstr':srchValObjIn['text']}; 
                }
                var endpoint = "/rmvod/api/simpletxtsrch/get";
                var wa = new RMVodWebApp();
                var apiBase = wa.sse.ssRead('apicfg')['API_Resources']['api_path'];
                var endpoint = apiBase + '/simpletxtsrch/get';
                break;
            case "majtype":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    var tmpDiv = wa.renderSALByIdList(objIn);
                    document.getElementById('sideartilistwidget').innerHTML = '';
                    document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                    
                    wa.dispLastSrchFactors();     
                }
                if (srchValObjIn['majtype'].length > 0){
                    payloadObj = {'majtype':srchValObjIn['majtype']};
                }
                endpoint = "/rmvod/api/titleidlist/get";
                //var wa = new RMVodWebApp();
                //var apiBase = wa.sse.ssRead('apicfg')['API_Resources']['api_path'];
                //endpoint = apiBase + '/titleidlist/get';
                break;
            case "relyear":  //UPDATED FOR NEW RETURN OBJECT MODEL
                cbFunc = function (dataObjIn){
                    var objIn = dataObjIn['data'];
                    var wa = new RMVodWebApp();
                    var artiTitleIdList = wa.sse.ssRead('titleidlist');
                    var tmpDiv = wa.renderSALByIdList(objIn);
                    document.getElementById('sideartilistwidget').innerHTML = '';
                    document.getElementById('sideartilistwidget').appendChild(tmpDiv);
                    
                    wa.dispLastSrchFactors();     
                }
                if (srchValObjIn['relyear2'] > 1900){
                    payloadObj = {'relyear1':srchValObjIn['relyear1'],'relyear2':srchValObjIn['relyear2']};
                }
                endpoint = "/rmvod/api/titleidlist/get";
                //var wa = new RMVodWebApp();
                //var apiBase = wa.sse.ssRead('apicfg')['API_Resources']['api_path'];
                //endpoint = apiBase + '/titleidlist/get';
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
                        
                        wa.dispLastSrchFactors();     
                    }
                }
                if (srchValObjIn[factorStrIn].length > 0){
                    payloadObj = {'whereclause':srchValObjIn[factorStrIn]};
                }
                endpoint = "/rmvod/api/titleidlist/get";
                //var wa = new RMVodWebApp();
                //var apiBase = wa.sse.ssRead('apicfg')['API_Resources']['api_path'];
                //endpoint = apiBase + '/titleidlist/get';
                break;
            default:
                console.log("execSearchSingleFactor fell through: ", factorStrIn, JSON.stringify(srchValObjIn));
        }
        
        var lastSearch = {'mode':'single','factors':payloadObj};
        this.cc.setCookie('lastsearch', JSON.stringify(lastSearch), 90);
        
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
        
        var lastSearch = {'mode':'multi','factors':sfValsObj};
        this.cc.setCookie('lastsearch', JSON.stringify(lastSearch), 90);
        
        //put a throbber in to replace any old content
        var editDiv = document.getElementById('sideartilistwidget');
        editDiv.innerHTML = '<div class="throbber-ring"></div>';        
        
        var cbFunc = function(dataObjIn){
            var objIn = dataObjIn['data'];
            var wa = new RMVodWebApp();
            var tmpDiv = wa.renderSALByIdList(objIn);
            document.getElementById('sideartilistwidget').innerHTML = '';
            document.getElementById('sideartilistwidget').appendChild(tmpDiv);  
            
            wa.dispLastSrchFactors();          
        }
        
        const endpoint = '/rmvod/api/mfsearch/get';
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/mfsearch/get';
        const payload = sfValsObj;
        this.genericApiCall(payload,endpoint,cbFunc);
        
        try { // Try to reset the Search Factors on the form
            this.resetSearchFactors();
        } catch (e) {
            console.log("Ignoring this error: " + e);
        }
        
    }
    dispLastSrchFactors(){
        try {
            var factorJson = this.cc.getCookie('lastsearch');
            var factorObj = JSON.parse(factorJson);
            var factorDispDiv = document.createElement('div');
            factorDispDiv.id = "lastsearchfactors";
            //factorDispDiv.className = "";
            factorDispDiv.style.width = "570px";
            factorDispDiv.style.height = "60px";
            factorDispDiv.style.overflow = "auto";
            //factorDispDiv.style.backgroundColor = "#0c1c1c"; //#0c0c0c
            factorDispDiv.style.color = "#c0f0f0"; //#c0c0c0
            
            var tmpHtml = "";
            tmpHtml += "<b>Last Search:  </b> Mode = " + factorObj['mode'] + "; ";
            if (factorObj['mode'] == "single") {
                var key = Object.keys(factorObj['factors'])[0];
                console.log(typeof key + " - " + key);
                if (key == undefined) {
                    tmpHtml += "Default - No filter";
                } else {
                    tmpHtml += "Factor " + key + " = " + factorObj['factors'][key];
                }
            } else {
                tmpHtml += "<br>";
                console.log(JSON.stringify(factorObj));
                var keysList = Object.keys(factorObj['factors']);
                var prFact = 0;

                for (var i = 0; i < keysList.length; i++ ){
                    var key = keysList[i];
                    if (factorObj['factors'][key] != "") {
                        tmpHtml += "Factor " + key + " = " + factorObj['factors'][key] + "<br>";
                        prFact += 1;
                    }
                }
                if (prFact == 0) {
                    tmpHtml += "Default - No filter";
                }

            }
            //factorDispDiv.innerHTML = "Last Search: " + JSON.stringify(factorObj);  //tmpHtml
            factorDispDiv.innerHTML = tmpHtml;  //tmpHtml
            
            
            try{
                document.getElementById('lastsearchfactors').innerHTML = factorDispDiv.innerHTML;
            }catch (e) {
                var lwDe = document.getElementById("sideartilistwidget");
                lwDe.style.height = "450px";
                console.log(lwDe.style.height);
                var slParentDe = document.getElementById("sideartilistwidget").parentElement;
                slParentDe.appendChild(factorDispDiv);
            }
            // append as child to parent of "sideartilistwidget" if "lastsearchfactors" is not present
            
        } catch (e) {
            console.log("dispLastSrchFactors failed: " + e);
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/get';
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/update';
        const payload = {'artifactid':wrkArtiId,'values':updateObj};
        this.genericApiCall(payload,endpoint,cbFunc);
    }
    // select Edit tab
    selectEditTab(){
        const ev = new Event('click');
        //document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev); // RNWATabWidget-tabspan-2
        document.getElementById('RNWATabWidget-tabspan-3').dispatchEvent(ev); // RNWATabWidget-tabspan-2
        return true;
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
                //const ev = new Event('click');
                //document.getElementById('tabspan2').dispatchEvent(ev); // RNWATabWidget-tabspan-2
                //document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev); // RNWATabWidget-tabspan-2
                ml.selectEditTab();
            } else {
                // Add failed
                window.alert("Sumbit failed.  Correct the problem listed below and try again.\n" + dataObjIn['status']['detail'])
            }
        }
        var payload = {'filepath':nafp,'file':nafn,'majtype':namt};
        var endpoint = "/rmvod/api/artifact/newsingle";
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //var endpoint = apiBase + '/artifact/newsingle';
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
            //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
            //const endpoint = apiBase + '/artifact/newsingle';
            this.genericApiCall(payload,endpoint,cbFunc);
        }
    }
    // DOM Util
    // Check for, and if they are present, load and respect 
    // cookie-stored option values
    onloadOptions(){
        var optList = ['serplaynext','resumeplay','fullscreenplay'];
        
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
        this.selectEditTab();
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
        //const ev = new Event('click');
        //document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev);  // RNWATabWidget-tabspan-2 // tabspan2
        this.selectEditTab();
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
        //const ev = new Event('click');
        //document.getElementById('RNWATabWidget-tabspan-2').dispatchEvent(ev); // RNWATabWidget-tabspan-2 // tabspan2
        this.selectEditTab();
    }
    // Execute an API call which associates tvepisode artifacts 
    // with a tvseries artifact
    execAddSeriesEpisodes(seriesaidIn,filepathIn,filefragIn){
        var cbFunc = function(dataObjIn) {
            //console.log('execAddSeriesEpisodes.cbFunc: \n' + JSON.stringify(dataObjIn));
            
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
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/series/artifacts/add';
        this.genericApiCall(payloadObj,endpoint,cbFunc)
    }
    execRecsForcedRefresh(){
        //var wa = new RMVodWebApp();
        var recLimitInt = 30;
        var sinceDTStr = "2023-02-01 00:00:01";
        var clientId = this.cc.getCookie('clientid');
        var forceRefresh = true;
        
        var cbFunc = function (objIn) {
            var rec = new WMCWARecommend();
            rec.targetParentElementId = 'rmvodrecsmastercontouter';
            rec.setRecSrcData(objIn);
            //rec.popMasterDiv(sinceDtStrIn);
            rec.popMasterDiv();
            rec.qsRecGenerateLinkList(objIn); 
            alert('Recommendation Refresh complete.');
            
        }
        var payloadObj = {'clientId':clientId,'sinceDt':sinceDTStr,'recLimit':recLimitInt,'forceRefresh':forceRefresh};
        var endpoint = '/rmvod/api/artifact/recs/get';
        //var result = wa.genericApiCall(payloadObj,endpoint,cbFunc);
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc);
        
        
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
    playFirstEpOfSeries(seriesAidIn){
        //console.log('playFirstEpOfSeries.seriesAidIn: ' + seriesAidIn);
        var cbFunc = function (objIn) {
            var wa = new RMVodWebApp();
            wa.vodPlayTitleApi3(objIn['data']);
        }
        var payloadObj = {'artiid':seriesAidIn};
        var endpoint = '/rmvod/api/artifact/recs/serfirstep/get';
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/recs/serfirstep/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc); 
        
        var rec = new WMCWARecommend();
        rec.hideartiDetailDiv();        
    }
    getEpiListForSeriesSeason(deIdIn){
        console.log('getEpiListForSeriesSeason: ' + deIdIn);
        var de = document.getElementById(deIdIn);
        var deetDE = document.getElementById('artifactDetailDiv');
        var artiObj = JSON.parse(deetDE.dataset.artifact)[0];
        var seriesAID = artiObj['artifactid'];
        var seriesTitle = artiObj['title'];
        var seriesSeason = de.value;
        document.getElementById('rec-series-ep-list').innerHTML = "Episode list for " + seriesTitle + " season " + String(seriesSeason);
        var cbFunc = function (objIn) {
            // console.log('getEpiListForSeriesSeason.cbFunc: ' + JSON.stringify(objIn));
            var wa = new RMVodWebApp();
            var de;
            var tde = document.getElementById('rec-series-ep-list');
            var epTIMList = objIn['data']
            for (var i = 0; i < epTIMList.length; i++) {
                
                de = wa.renderSALElementById(epTIMList[i]);
                tde.appendChild(de);
                
            }
        }
        var payloadObj = {'artiid':seriesAID,'season':seriesSeason};
        var endpoint = '/rmvod/api/artifact/recs/serseasoneplist/get';
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/recs/serseasoneplist/get';
        var result = this.genericApiCall(payloadObj,endpoint,cbFunc); 
        
    }
    
    // Stats things
    renderStatsContainer(targetDEIdIn){
        console.log("renderStatsContainer - targetDEIdIn: " + targetDEIdIn);
        var contentHtmlStr = "";
        contentHtmlStr = '\
            <div style="width:1150px;height:100%;display:block;">\
                <div id="sitestatsdatastore" data-sitestats="" style="display:none;"></div>\
                <div style="width:20%;height:100%;display:inline-flex;">\
                    <div  id="stats_majid_column" style="width:100%;height:100%;display:block;">\
                        Major Type\
                    </div>\
                </div>\
                <div style="width:20%;height:100%;display:inline-flex;">\
                    <div  id="stats_tags_column" style="width:100%;height:100%;display:block;">\
                        Tags\
                    </div>\
                </div>\
                <div style="width:24%;height:100%;display:inline-flex;">\
                    <div  id="stats_titles_column" style="width:100%;height:100%;display:block;">\
                        Titles\
                    </div>\
                </div>\
                <div style="width:34%;height:100%;display:inline-flex;">\
                    <div id="stats_title_detail_column" style="width:100%;height:100%;display:block;">\
                        Title Details\
                    </div>\
                </div>\
            </div>';
        document.getElementById(targetDEIdIn).innerHTML = contentHtmlStr;
    }
    fetchLocalStatsData(){
        var dsDiv = document.getElementById("sitestatsdatastore");
        var sdo = JSON.parse(dsDiv.dataset.sitestats);
        return sdo;
    }
    getStatsPeriodAsString(unitStrIn){
        var periodValueString = "";
        var pvObj = this.sse.ssOKRead('localcfg','sitestatsperiod'); //[unitStrIn].toString();
        console.log(JSON.stringify(pvObj));
        periodValueString = pvObj[unitStrIn].toString();
        console.log('periodValueString: ' + periodValueString);
        return periodValueString;
    }
    renderStatsMajIdCol(targetDEIdIn){
        var dObj = this.fetchLocalStatsData();
        console.log(targetDEIdIn);
        console.log(dObj['listings']['movie']['count']);
        var mtAry = Object.keys(dObj['listings']);
        var wrapDiv = document.createElement('div');
        //wrapDiv.style.backgroudColor = this.sse.ssOKRead('localcfg','rowsbgc')[];
        wrapDiv.style.width = "100%";
        wrapDiv.style.display = "block";
        for (var i = 0; i < mtAry.length; i++ ){
            var rowDiv = document.createElement('div');
            rowDiv.style.backgroundColor = this.sse.ssOKRead('localcfg','rowsbgc')[i%2];
            var labelDiv = document.createElement('div');
            labelDiv.style.display = "inline-flex";
            labelDiv.style.width = "65%";
            labelDiv.innerHTML = "<span onclick='switchboard(\"renderStatsTags\",\"" + mtAry[i] + "\",{})'>" + mtAry[i] + "</span>";
            var countDiv = document.createElement('div');
            countDiv.style.display = "inline-flex";
            countDiv.innerHTML = dObj['listings'][mtAry[i]]['count'];
            rowDiv.appendChild(labelDiv);
            rowDiv.appendChild(countDiv);
            wrapDiv.appendChild(rowDiv);
        }
        document.getElementById(targetDEIdIn).innerHTML = "";
        var headerDiv = document.createElement("div");
        headerDiv.style.width = "100%";
        headerDiv.style.display = "block";
        //headerDiv.style.backgroundColor = "#e0e0e0";
        headerDiv.style.height = "70px";
        headerDiv.innerHTML = "Artifact count by <b>Major Type</b>";
        document.getElementById(targetDEIdIn).appendChild(headerDiv);
        document.getElementById(targetDEIdIn).appendChild(wrapDiv);
        
        var clearList = ["stats_tags_column","stats_titles_column","stats_title_detail_column"];
        for (var i = 0; i < clearList.length; i++ ) {
            console.log(clearList[i]);
            document.getElementById(clearList[i]).innerHTML = "&nbsp;";
        }
        
    }
    renderStatsTagsCol(majTypeIn,targetDEIdIn){
        var dObj = this.fetchLocalStatsData();
        var mtAry = Object.keys(dObj['listings'][majTypeIn]['tags']);
        var wrapDiv = document.createElement('div');
        wrapDiv.style.width = "100%";
        wrapDiv.style.display = "block";
        for (var i = 0; i < mtAry.length; i++ ){
            var rowDiv = document.createElement('div');
            rowDiv.style.backgroundColor = this.sse.ssOKRead('localcfg','rowsbgc')[i%2];
            var labelDiv = document.createElement('div');
            labelDiv.style.display = "inline-flex";
            labelDiv.style.width = "80%";
            labelDiv.innerHTML = "<span onclick='switchboard(\"renderStatsTitles\",\"" + majTypeIn + "\",{\"tag\":\"" + mtAry[i] + "\"})'>" + mtAry[i] + "</span>";
            var countDiv = document.createElement('div');
            countDiv.style.display = "inline-flex";
            countDiv.innerHTML = dObj['listings'][majTypeIn]['tags'][mtAry[i]]['count'];
            rowDiv.appendChild(labelDiv);
            rowDiv.appendChild(countDiv);
            wrapDiv.appendChild(rowDiv);
        }
        document.getElementById(targetDEIdIn).innerHTML = "";
        
        var headerDiv = document.createElement("div");
        headerDiv.style.width = "100%";
        headerDiv.style.display = "block";
        //headerDiv.style.backgroundColor = "#e0e0e0";
        headerDiv.style.height = "70px";
        //var daysStr = this.sse.ssOKRead('localcfg','sitestatsperiod')['days'].toString;
        // this.sse.ssOKWrite('localcfg','sitestatsperiod',{'days':180,'weeks':26,'months':6}); 
        //headerDiv.innerHTML = "Top 10 <b>Tags</b> by views in the last 30 days for Major Type " + majTypeIn;
        headerDiv.innerHTML = "Top 10 <b>Tags</b> by views in the last " + this.getStatsPeriodAsString('days') + " days for Major Type " + majTypeIn;
        document.getElementById(targetDEIdIn).appendChild(headerDiv);        
        
        document.getElementById(targetDEIdIn).appendChild(wrapDiv);   
        
        var clearList = ["stats_titles_column","stats_title_detail_column"];
        for (var i = 0; i < clearList.length; i++ ) {
            document.getElementById(clearList[i]).innerHTML = "&nbsp;";
            //try {
                //document.getElementById(clearList[i]).innerHTML = "&nbsp;";
            //} catch (e) {
                //console.log("Failed to clear div " + clearList[i] + " because " + e);
            //}
        }
    }
    renderStatsTitlesCol(majTypeIn,tagIn,targetDEIdIn){
        var dObj = this.fetchLocalStatsData();
        var mtAry =dObj['listings'][majTypeIn]['tags'][tagIn]['artifacts'];
        var wrapDiv = document.createElement('div');
        wrapDiv.style.width = "100%";
        wrapDiv.style.display = "block";
        
        var tmpSortObj = {};
        var tmpPreSortList = [];
        for (var i = 0; i < mtAry.length; i++ ) {
            var tmpArtiObj = dObj['artifacts'][mtAry[i]]
            var tmpKeysList = Object.keys(tmpSortObj);
            var tmpCountNumberString = tmpArtiObj['count'].toString();
            if (tmpKeysList.indexOf(tmpCountNumberString) < 0) {
                tmpSortObj[tmpArtiObj['count'].toString()] = [tmpArtiObj];
            } else {
                tmpSortObj[tmpArtiObj['count'].toString()].push(tmpArtiObj);
            }
            if (tmpPreSortList.indexOf(tmpArtiObj['count']) < 0) {
                tmpPreSortList.push(tmpArtiObj['count']);
            }
        }
        tmpPreSortList.sort((a,b) => a-b);
        tmpPreSortList.reverse();
        
        //console.log(JSON.stringify(tmpSortObj));
        //console.log(JSON.stringify(tmpPreSortList));
        var k = 0;
        for (var i = 0; i < tmpPreSortList.length; i++ ) {
            var cntStr = tmpPreSortList[i].toString();
            for (var j = 0; j < tmpSortObj[cntStr].length; j++ ) {
                var artiObj = tmpSortObj[cntStr][j];
                
                var rowDiv = document.createElement('div');
                rowDiv.style.backgroundColor = this.sse.ssOKRead('localcfg','rowsbgc')[k%2];
                k += 1
                var labelDiv = document.createElement('div');
                labelDiv.style.display = "inline-flex";
                labelDiv.style.width = "85%";
                labelDiv.innerHTML = "<span onclick='switchboard(\"renderStatsTitleDeets\",\"" + artiObj['artifactid'] + "\",{})'>" + artiObj['title'] + "</span>";
                
                var countDiv = document.createElement('div');
                countDiv.style.display = "inline-flex";
                countDiv.innerHTML = artiObj['count'];
                rowDiv.appendChild(labelDiv);
                rowDiv.appendChild(countDiv);
                wrapDiv.appendChild(rowDiv);                
                
            }
        }
        
        document.getElementById(targetDEIdIn).innerHTML = "";
        
        var headerDiv = document.createElement("div");
        headerDiv.style.width = "100%";
        headerDiv.style.display = "block";
        //headerDiv.style.backgroundColor = "#e0e0e0";
        headerDiv.style.height = "70px";
        //var daysStr = this.sse.ssOKRead('localcfg','sitestatsperiod')['days'].toString;
        headerDiv.innerHTML = "Top 10 <b>Titles</b> by views in the last " + this.getStatsPeriodAsString('days') + " days for Tag " + tagIn;
        document.getElementById(targetDEIdIn).appendChild(headerDiv);        
        
        document.getElementById(targetDEIdIn).appendChild(wrapDiv);    
        
        var clearList = ["stats_title_detail_column"];
        for (var i = 0; i < clearList.length; i++ ) {
            document.getElementById(clearList[i]).innerHTML = "&nbsp;";
        }
    }
    renderStatsTitleDetailsCol(artiIdIn){
        var dObj = this.fetchLocalStatsData();
        
                
        //artifactid69583984-ebab-46c1-be6b-86796c6fef22
        //titleSarah Millican: Bobby Dazzler
        //majtypemovie
        //runmins-1
        //season-1
        //episode-1
        //fileSarahMillican_BobbyDazzler.m4v
        //filepathcomedy
        //directorstring
        //writerstring
        //primcaststring
        //relorgstring
        //relyear-1
        //eidridstring
        //imdbidtt26687384
        //arbmeta{"string": "string", "titleorig": "Sarah Millican: Bobby Dazzler", "titlelibrary": "Sarah Millican: Bobby Dazzler"}
        //tagsbritish,comedy,new,stand-up
        //poster/rmvod/img/poster_00/        
                
        var fieldDisplayOrderAry = ['title','seasons','episodes','tags','primcast','writer','director','runmins','relyear','artifactid','majtype','filepath','file','eidridstring','imdbid','arbmeta','artifactid','poster'];
        
        
        console.log("renderStatsTitleDetailsCol: " + artiIdIn);
        var targetDEIdIn = "stats_title_detail_column";
        
        //var mtAry = Object.keys(dObj['artifacts'][artiIdIn]);
        //console.log(JSON.stringify(mtAry));
        //var wrapDiv = document.createElement('div');
        //wrapDiv.style.width = "100%";
        //wrapDiv.style.display = "block";
        //for (var i = 0; i < mtAry.length; i++ ){
            //console.log(mtAry[i]);
            //var rowDiv = document.createElement('div');
            //rowDiv.style.backgroundColor = this.sse.ssOKRead('localcfg','rowsbgc')[i%2];
            //var labelDiv = document.createElement('div');
            //labelDiv.style.display = "inline-flex";
            //labelDiv.style.width = "29%";
            //labelDiv.innerHTML = mtAry[i];
            //var countDiv = document.createElement('div');
            //countDiv.style.display = "inline-flex";
            //countDiv.style.width = "69%";
            //countDiv.innerHTML = dObj['artifacts'][artiIdIn][mtAry[i]];
            //rowDiv.appendChild(labelDiv);
            //rowDiv.appendChild(countDiv);
            //wrapDiv.appendChild(rowDiv);
        //}
        
        document.getElementById(targetDEIdIn).innerHTML = "";
        
        var headerDiv = document.createElement("div");
        headerDiv.style.width = "100%";
        headerDiv.style.display = "block";
        //headerDiv.style.backgroundColor = "#e0e0e0";
        headerDiv.style.height = "70px";
        headerDiv.innerHTML = "<b>Title Details</b> for " + dObj['artifacts'][artiIdIn]['title'];
        document.getElementById(targetDEIdIn).appendChild(headerDiv);        
        
        
        var cbFunc = function (dObjIn) {
            
            var wa = new RMVodWebApp();
            
            var tmpOuterDiv = document.createElement("div");
            tmpOuterDiv.style.width = "100%";
            
            console.log(JSON.stringify(dObjIn));
            var artiObj = dObjIn['data'][0];
            var keys = Object.keys(artiObj);
            for (var i = 0; i < fieldDisplayOrderAry.length; i++ ) {
                var key = fieldDisplayOrderAry[i];
                if (keys.indexOf(key) > -1) {
                
                    var rowDiv = document.createElement('div');
                    rowDiv.style.backgroundColor = wa.sse.ssOKRead('localcfg','rowsbgc')[i%2];
                    var labelDiv = document.createElement('div');
                    labelDiv.style.display = "inline-flex";
                    labelDiv.style.width = "29%";
                    labelDiv.innerHTML = key;
                    var countDiv = document.createElement('div');
                    countDiv.style.display = "inline-flex";
                    countDiv.style.width = "69%";
                    countDiv.innerHTML = artiObj[key]];
                    rowDiv.appendChild(labelDiv);
                    rowDiv.appendChild(countDiv);
                    tmpOuterDiv.appendChild(rowDiv);
                }
                
            }
            
            document.getElementById(targetDEIdIn).appendChild(tmpOuterDiv); 
            
        };
        // Do the API call.
        const apiEndpoint = '/rmvod/api/artifact/get'; 
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const apiEndpoint = apiBase + '/artifact/get'; 
        const payload = {'artifactid':artiIdIn};
        this.genericApiCall(payload,apiEndpoint,cbFunc);

        
        
        //document.getElementById(targetDEIdIn).appendChild(wrapDiv);        
    }
    
    
    
    
}

//
// NEW CODE TO SUPPORT RECOMMENDATIONS -- START
//

function recsWrapper(sinceDtStrIn){
    //put a thobber in the recs tab
    document.getElementById('rmvodrecsmastercontouter').innerHTML = '<div class="throbber-ring"></div>';
    var rec = new WMCWARecommend();
    rec.renderRecQuickSearchContainer();
    var wa = new RMVodWebApp();
    var clientId = wa.cc.getCookie('clientid')
    var sinceDTStr = "2023-02-01 00:00:01";
    var recLimitInt = 30;
    var cbFunc = function (objIn) {
        var rec = new WMCWARecommend();
        rec.targetParentElementId = 'rmvodrecsmastercontouter';  //rmvodrecsmastercontouter rmvodmasterdiv
        //rec.recSrcData = objIn;
        rec.setRecSrcData(objIn);
        //rec.renderRecQuickSearchContainer();
        rec.popMasterDiv();
        rec.qsRecGenerateLinkList(objIn); 
        
    }
    var payloadObj = {'clientId':clientId,'sinceDt':sinceDTStr,'recLimit':recLimitInt};
    var endpoint = '/rmvod/api/artifact/recs/get';
    //var apiBase = wa.sse.ssRead('apicfg')['API_Resources']['api_path'];
    //const endpoint = apiBase + '/artifact/recs/get';
    var result = wa.genericApiCall(payloadObj,endpoint,cbFunc);
}
function deetShow(eventObjIn){
    var rec = new WMCWARecommend();
    document.getElementById('artifactDetailDiv').dataset.artifact = this.dataset.artifact;
    rec.artiHover(this.dataset.artifactid);
}
function deetHide(eventObjIn){
    var rec = new WMCWARecommend();
    rec.hideartiDetailDiv();
}
function recArtiDeetSeasonEpisodes(selectDEIdIn){
    var de = document.getElementById(selectDEIdIn);
    var deetDE = document.getElementById('artifactDetailDiv');
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
    setRecSrcData(rsdObjIn){
        var sse = new RMSSSEnhanced();
        sse.ssWrite('recdata',rsdObjIn);
        this.recSrcData = sse.ssRead('recdata');
    }
    //popMasterDiv(sinceDTStrIn) {
    popMasterDiv() {
        
        //  HEY  HEY HEY HEY HEY
        // Looks like sinceDTStrIn is not actually used in this method.
        // Maybe deprecate it and strip it out.
        
        
        var recsObj = this.recSrcData['data'];

        // Event Handler Functions
        var mouseEnterFunc = function(fooIn){
            //console.log("Mouse Enter registered for " + String(this.id));
            //console.log("Artifact ID: " + String(this.dataset.artifactid));
        }

        var mouseLeaveFunc = function(fooIn){
            //console.log("Mouse Leave registered for " + String(this.id));
            //console.log("Artifact ID: " + String(this.dataset.artifactid));
        }
        
        var MouseClicFunc = deetShow;
                        
        var roKeys = Object.keys(recsObj);
        var recClass = "";
        var mtClass = "";
        
        document.getElementById(this.targetParentElementId).innerHTML = "";
        
        
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
                        // arOuter.addEventListener("mouseenter",mouseEnterFunc);
                        // arOuter.addEventListener("mouseleave",mouseLeaveFunc);
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
                            //posterImg.src = 'http://rmvid/rmvod/img/poster_00/' + artiObj['imdbid'] + '.jpg' ;
                            posterImg.src = '/rmvod/img/poster_00/' + artiObj['imdbid'] + '.jpg' ;
                        } else {
                            //posterDiv.innerHTML = "<b>Oops!  No Poster!</b>";
                            posterImg.src = '/rmvod/img/RMVOD_NoPoster.png' ;
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
        var metaKeysList = Object.keys(this.recSrcData['meta']);
        if (metaKeysList.indexOf('message') > -1  ) {
            var tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = '<b>' + this.recSrcData['meta']['message'] + '</b>';
            document.getElementById(this.targetParentElementId).appendChild(tmpDiv);
        }
        
         
    }
    playFromRecs(deIdIn, ArtiIdIn){
        //Turn the tile pink
        
        //get the filename
        
        //populate the player
        
    }
    showArtiDetailDiv(){
        var artiIdIn = document.getElementById('artifactDetailDiv').dataset.artifactid;
        var artiJson = document.getElementById('artifactDetailDiv').dataset.artifact;
        var artiDetObj = JSON.parse(artiJson)[0];
        
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
                playDivHtmlStr += "<div data-artifactid='" + artiIdIn + "' style='";
                playDivHtmlStr += playDivStyle + "'>";
                playDivHtmlStr += "<select id='recDeetSeriesSeasonSelect' data-artifactid='" + artiIdIn ;
                playDivHtmlStr += "' onchange='switchboard(\"recFetchSeriesSeasonEpList\",this.id,{})'>"; //switchboard(\"recPlaySeriesFromStart\",\"" + artiIdIn + "\",{})'
                playDivHtmlStr += "<option value='NONE'>Seasons</option>";
                playDivHtmlStr += "</select>";
                
                playDivHtmlStr += "    |    ";
                playDivHtmlStr += "<span data-artifactid='" + artiIdIn;
                playDivHtmlStr += "'  onclick='switchboard(\"recPlaySeriesFromStart\",\"" + artiIdIn + "\",{})' >";
                playDivHtmlStr += "Play Series from start</span></div>";
            } else {
                playDivHtmlStr += "<div data-artifactid='" + artiIdIn + "' style='" + playDivStyle ;
                playDivHtmlStr += "'><span data-artifactid='" + artiIdIn ;
                playDivHtmlStr += "'  onclick='switchboard(\"vodPlayTitle\",\"" + artiIdIn + "\",{})' >Play this Title</span></div>";
            }
            htmlStr += playDivHtmlStr;
            
            htmlStr += "<div class='arti-detail-item'>" + artiDetObj['synopsis'] + "</div>";
            htmlStr += "<div class='arti-detail-item'><b>Director(s): </b>" + directorListStr + "</div>";
            htmlStr += "<div class='arti-detail-item'><b>Writer(s): </b>" + writerListStr + "</div>";
            htmlStr += "<div class='arti-detail-item'><b>Cast: </b>" + castListStr + "</div>";
            htmlStr += "<div class='arti-detail-item'>" + artiIdIn + "</div>";
            
            if (artiDetObj['majtype'] == 'tvseries') {
                htmlStr += "<div id='rec-series-ep-list' class='arti-detail-item'><a name='episodeList'></a>Series Ep List</div>";
            }
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
            var ph = this.posterHeightPx * 1.90;
            var pw = ph * this.posterWidthFraction;
            dpHtml += '<img width="' + pw + '" height="' + ph + '" src="/rmvod/img/poster_00/' + artiDetObj['imdbid'] + '.jpg">';
        } else {
            dpHtml += '<img width="' + pw + '" height="' + ph + '" src="/rmvod/img/RMVOD_NoPoster.png">';
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
        fd.appendChild(deetOuter);
        fd.style.display = "block";
        
        //Now that we have the select list extablished in the DOM 
        // we can do the API call to build out the options
        
        var cbFunc = function(dataIn){
            var seasonList = dataIn['data'];
            var selectDE = document.getElementById('recDeetSeriesSeasonSelect');
            var tmpDE;
            for (var i = 0; i < seasonList.length; i++ ) {
                tmpDE = document.createElement('option');
                tmpDE.value = seasonList[i];
                tmpDE.innerHTML = "Season " + String(seasonList[i]);
                selectDE.appendChild(tmpDE);
            }
        }
        var wa = new RMVodWebApp();
        var payloadObj = {'artiid':artiDetObj['artifactid']};
        var endpoint = '/rmvod/api/artifact/recs/serseasonnmbrlist/get';
        //var apiBase = this.sse.ssRead('apicfg')['API_Resources']['api_path'];
        //const endpoint = apiBase + '/artifact/recs/serseasonnmbrlist/get';
        var result = wa.genericApiCall(payloadObj,endpoint,cbFunc); 
    }
    hideartiDetailDiv(){
        var fd = document.getElementById('artifactDetailDiv');
        clearTimeout(fd.dataset.timeout);
        fd.innerHTML = '';
        fd.style.display = "none";
    }
    artiHover(artiIdIn) {
        var dDiv = document.getElementById('artifactDetailDiv');
        dDiv.innerHTML = '';
        dDiv.dataset.artifactid = artiIdIn; //artiIdIn
        this.showArtiDetailDiv();
    }
    renderRecQuickSearchContainer(){
        
        // headerblock2
        
        //<div>
            //<hr>
            //<span><b>Quick Searches from Recommendations:</b></span>
            //<div id="rec-quicklink-container">       
        var outerDiv = document.createElement('div');
        outerDiv.id = "recqsl";
        outerDiv.classname = "recqsl";
        var tmpHtml = "";
        tmpHtml += '<hr style="margin-left:75px;margin-right:75px;">'; // width:50%;text-align:center;margin-left:0
        tmpHtml += "<span><b>Quick Searches from Recommendations:</b></span>";
        //tmpHtml += '<div id="rec-quicklink-container">&nbsp;</div>'; // containerDiv.innerHTML = '<div class="throbber-ring"></div>';
        tmpHtml += '<div id="rec-quicklink-container">';
        tmpHtml += '<div class="throbber-ring"></div>';
        tmpHtml += '</div>'; // containerDiv.innerHTML = '<div class="throbber-ring"></div>';

        outerDiv.innerHTML = tmpHtml;
        document.getElementById('headerblock2').appendChild(outerDiv);
        
        //this.qsRecGenerateLinkList(this.recSrcData); // ['data']
    }
    qsRecCommonPopSideList(deIdIn) {
        //onsole.log('qsRecCommonPopSideList - deIdIn: ' + deIdIn);
        var de = document.getElementById(deIdIn);
        var artiHandleList = JSON.parse(de.dataset.timlist);
        var slPopList = []
        for (var i=0; i < artiHandleList.length; i++ ) {
            var tmpObj = {};
            tmpObj['title'] = artiHandleList[i]['title'];
            tmpObj['artifactid'] = artiHandleList[i]['artifactid'];
            tmpObj['majtype'] = artiHandleList[i]['majtype'];
            slPopList.push(tmpObj);
        }
        //console.log(JSON.stringify(slPopList));
        return slPopList;
    }
    // Build the list of "quick links" and stuff them in the target div.
    qsRecGenerateLinkListOlde(recObjIn) {
        //console.log('qsRecGenerateLinkList - recObjIn: ' + JSON.stringify(recObjIn));
        var containerDiv = document.getElementById('rec-quicklink-container');
        containerDiv.innerHTML = "&nbsp;";
        var typesList = Object.keys(recObjIn['data']);
        for (var i = 0; i < typesList.length; i++ ) {
            var mtList = Object.keys(recObjIn['data'][typesList[i]]);
            //console.log(JSON.stringify(mtList));
            for (var j = 0; j < mtList.length; j++ ) {
                var lDiv = document.createElement('div');
                var lSpan  = document.createElement('span');
                lSpan.id = typesList[i] + "-" + mtList[j] + "-rec-quicklink";
                lSpan.dataset.timlist = JSON.stringify(recObjIn['data'][typesList[i]][mtList[j]]);
                lSpan.innerHTML = "<b><u>Quick List: " + typesList[i] + " " + mtList[j] + "</u></b>";
                //lSpan.addEventListener('click', function () { qsRecCommonPopSideList(this.id)});  // recqspopsidelist
                lSpan.addEventListener('click', function () { switchboard('recqspopsidelist',this.id,{})});  // recqspopsidelist
                lDiv.appendChild(lSpan);
                containerDiv.appendChild(lDiv);
            }
        }
    }
    // Build the list of "quick links" and stuff them in the target div.
    qsRecGenerateLinkList(recObjIn) {
        //console.log('qsRecGenerateLinkList - recObjIn: ' + JSON.stringify(recObjIn));
        var containerDiv = document.getElementById('rec-quicklink-container');
        containerDiv.innerHTML = ""; //'<div class="throbber-ring"></div>';
        //containerDiv.innerHTML = '<div class="throbber-ring"></div>';
        var typesList = Object.keys(recObjIn['data']);
        for (var i = 0; i < typesList.length; i++ ) {
            var mtList = Object.keys(recObjIn['data'][typesList[i]]);
            //console.log(JSON.stringify(mtList));
            var lDiv = document.createElement('div');
            lDiv.innerHTML = "Quick List: " + typesList[i] + " ";
            for (var j = 0; j < mtList.length; j++ ) {
                //var lDiv = document.createElement('div');
                var lSpan  = document.createElement('span');
                lSpan.id = typesList[i] + "-" + mtList[j] + "-rec-quicklink";
                lSpan.dataset.timlist = JSON.stringify(recObjIn['data'][typesList[i]][mtList[j]]);
                //lSpan.innerHTML = "<b><u>Quick List: " + typesList[i] + " " + mtList[j] + "";
                //lSpan.addEventListener('click', function () { qsRecCommonPopSideList(this.id)});  // recqspopsidelist
                lSpan.innerHTML = " <b><u>" + mtList[j] + "</u></b> ";
                lSpan.addEventListener('click', function () { switchboard('recqspopsidelist',this.id,{})});  // recqspopsidelist
                lDiv.appendChild(lSpan);
                //containerDiv.appendChild(lDiv);
            }
            //lDiv.innerHTML = lDiv.innerHTML + 
            containerDiv.appendChild(lDiv);
        }
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
            ml.clockSet();
            ml.initStorage();
            ml.execSearchSingleFactor2('tag',{'tag':''});
            ml.renderStaticModernSearchWidget();
            ml.onloadOptions();
            ml.contCookieOnLoad();
            ml.resetPageTitle();
            
            //
            recsWrapper('2023-05-25 11:39:05');
            //
            //ml.renderStatsContainer('sitestatsouter');
            ////ml.renderStatsContainer('statstabbody');
            //ml.renderStatsMajIdCol('stats_majid_column');            //sitestatsouter
            ml.apiFetchSiteStats();
            
            
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
            document.getElementById('RNWATabWidget-tabspan-3').click();
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
        case 'recPlaySeriesFromStart':
            ml.playFirstEpOfSeries(objIdIn);
            break;
        case 'recFetchSeriesSeasonEpList':
            ml.getEpiListForSeriesSeason(objIdIn);
            break;
            
        case 'recqspopsidelist':
            console.log('recqspopsidelist: ' + objIdIn);
            var rec = new WMCWARecommend();
            var popList = rec.qsRecCommonPopSideList(objIdIn);
            var slDiv = ml.renderSALByIdList(popList);
            document.getElementById('sideartilistwidget').innerHTML = '';
            document.getElementById('sideartilistwidget').appendChild(slDiv);
            break;
            
        case 'popepideets':
            ml.apiPopulateEpisodeDetails(objIdIn);
            break;
            
        case 'forcerecrefresh':
            ml.execRecsForcedRefresh();
            break;
            
            
        case "renderStats" :
            ml.renderStatsContainer('statstabbody');
            ml.renderStatsMajIdCol('stats_majid_column');
            break;;
        case "renderStatsTags":
            ml.renderStatsTagsCol(objIdIn,'stats_tags_column');
            console.log(actionIn + ": " + objIdIn);
            break;;
        case "renderStatsTitles":
            ml.renderStatsTitlesCol(objIdIn,argObjIn['tag'],'stats_titles_column');
            console.log(actionIn + ": " + objIdIn + ", " + argObjIn['tag']);
            break;;
        case "renderStatsTitleDeets":
            ml.renderStatsTitleDetailsCol(objIdIn);
            break;;
            
            
            
            
            
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
 
