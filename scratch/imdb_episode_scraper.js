#!/usr/bin/env node

const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var listContDE;
var data;
var seasonList = [];
var resultObj = {'status':{'success':false,'detail':'','errcnt':0,'log':[]}, 'data':[]};
// resultObj['status']['log'].push();
try {
  data = JSON.parse(fs.readFileSync('/home/tourvilp/Desktop/series_seasons.txt', 'utf8'));
  //console.log(data['status']['success']);
  //console.log(data['data'][0]);
} catch (err) {
  console.error(err);
}
var pagesList = data['data'];
for (var i = 0; i < pagesList.length; i++ ) {
    if (pagesList[i] == null) {
        continue;
    }
    const dom = new JSDOM(pagesList[i]);
    listContDE = dom.window.document.getElementsByClassName('list detail eplist')[0];
    var epiListDE = listContDE.children;
    var epObjList = [];
    for (var j = 0; j < epiListDE.length; j++ ) {
        var epDeetObj = {};
        var epDeetCont = epiListDE[j];
        // Get details from "image" block
        try {
            var imgDiv = epDeetCont.children[0];
            epDeetObj['title'] = imgDiv.children[0].title;
            //var rawSEDE = imgDiv.children[0].children[0].children[1];
            var rawSEDE;  // = imgDiv.children[0].children[0].children[1];
            try {
                rawSEDE = imgDiv.children[0].children[0].children[1];
                epDeetObj['episode_imdbid'] = imgDiv.children[0].children[0].dataset.const;
            } catch (e) {
                var lm = "Episode appears not to have an image.  Trying alternate location for rawSEDE. " + e;
                resultObj['status']['log'].push(lm);
                try {
                    rawSEDE = imgDiv.children[1].children[2];
                    epDeetObj['episode_imdbid'] = imgDiv.children[1].dataset.const;
                } catch (e) {
                    resultObj['status']['errcnt'] += 1;
                    resultObj['status']['log'].push(imgDiv.outerHTML);
                    var lm = "Episode appears not to have an image.  Alternate location for rawSEDE failed. " + e;
                    resultObj['status']['log'].push(lm);
                }
            }
            epDeetObj['season'] = parseInt(rawSEDE.outerHTML.replace('<div>','').replace('</div>','').split(' ')[0].replace('S','').replace(",","").trim())
            epDeetObj['episode'] = parseInt(rawSEDE.outerHTML.replace('<div>','').replace('<div>','').replace('</div>','').split(' ')[1].replace('Ep','').trim())
            //epDeetObj['episode_imdbid'] = epDeetCont.children[0].children[0].children[0].dataset.const;
        } catch (e) {
            var errStr = "Parse of image block failed (i=" + i + ", j=" + j + "): " + e;
            resultObj['status']['log'].push('imgDiv.outerHTML: ' + imgDiv.outerHTML);
            resultObj['status']['log'].push(errStr);
            resultObj['status']['errcnt'] += 1;
            // throw new Error(errStr);
            continue;
        }
        // Get details from "info" block
        try {
            var infoDiv = epDeetCont.children[1];
            epDeetObj['relyear'] = parseInt(infoDiv.children[1].textContent.trim().split(" ")[2]);
            epDeetObj['synopsis'] = infoDiv.children[4].textContent.trim().replace('"','\\"');
            
            var titleEpStr = "S";
            if (epDeetObj['season'] < 10) {
                titleEpStr += "0" + epDeetObj['season'].toString();
            } else {
                titleEpStr += epDeetObj['season'].toString();
            }
            titleEpStr += "E";
            if (epDeetObj['episode'] < 10) {
                titleEpStr += "0" + epDeetObj['episode'].toString();
            } else {
                titleEpStr += epDeetObj['episode'].toString();
            }
            epDeetObj['title_se_string'] = titleEpStr;
        } catch (e) {
            //var errStr = "Parse of info block failed: " + e;
            //throw new Error(errStr);
            //console.log("Parse of info block failed: " + e);
            //continue;
            
            var errStr = "Parse of info block failed (i=" + i + ", j=" + j + "): " + e;
            resultObj['status']['log'].push('infoDiv.outerHTML: ' + infoDiv.outerHTML);
            resultObj['status']['log'].push(errStr);
            resultObj['status']['errcnt'] += 1;
            // throw new Error(errStr);
            continue;
            
            
        }            
        
        epObjList.push(epDeetObj);
        delete listContDE
        delete dom

    }
    //console.log(JSON.stringify(epObjList));
    seasonList.push(epObjList);
}
resultObj['data'] = seasonList;
if (resultObj['status']['errcnt'] === 0) {
    resultObj['status']['success'] = true;
}
//console.log(JSON.stringify(seasonList));
console.log(JSON.stringify(resultObj));

