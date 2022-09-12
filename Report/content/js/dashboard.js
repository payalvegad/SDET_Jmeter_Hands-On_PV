/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "^(01_Homepage|02_Login|03_Go To My Info|04_Click Personal Details|Dashboard_Report_Genration)(-success|-failure)?$";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6747572815533981, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7"], "isController": false}, {"data": [0.0, 500, 1500, "01_Homepage"], "isController": true}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC"], "isController": false}, {"data": [0.25, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-5"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://opensource-demo.orangehrmlive.com/-4"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://opensource-demo.orangehrmlive.com/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://opensource-demo.orangehrmlive.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://opensource-demo.orangehrmlive.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details"], "isController": false}, {"data": [0.0, 500, 1500, "02_Login"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "03_Go To My Info"], "isController": true}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees"], "isController": false}, {"data": [1.0, 500, 1500, "04_Click Personal Details"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 96, 0, 0.0, 1008.1562499999998, 0, 32288, 366.0, 1802.1, 2198.199999999995, 32288.0, 1.2006903969782625, 274.0008366138655, 1.3662030472209021], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 3.5612369011976046, 1.9209627619760479], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0", 3, 0, 0.0, 949.0, 937, 967, 943.0, 967.0, 967.0, 967.0, 0.075340917652377, 0.13074297916823627, 0.06967563380546975], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1", 3, 0, 0.0, 327.6666666666667, 298, 373, 312.0, 373.0, 373.0, 373.0, 0.07656772415201246, 0.12636665411806744, 0.057425793114009346], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 3, 0, 0.0, 362.3333333333333, 355, 367, 365.0, 367.0, 367.0, 367.0, 0.07660878447395301, 0.5900522296348315, 0.057681028153728296], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 3.3268826452599387, 2.0098671636085625], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 3, 0, 0.0, 1825.6666666666667, 1800, 1870, 1807.0, 1870.0, 1870.0, 1870.0, 0.07379710715339959, 1.1760693277698513, 0.48984271222818065], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 3, 0, 0.0, 155.0, 148, 161, 156.0, 161.0, 161.0, 161.0, 0.07706931100035964, 0.07458563203257462, 0.06450039016338693], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0", 2, 0, 0.0, 780.0, 568, 992, 780.0, 992.0, 992.0, 992.0, 0.07152564194263644, 1.508464612688649, 0.05022161773120664], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/", 3, 0, 0.0, 3277.3333333333335, 2698, 4211, 2923.0, 4211.0, 4211.0, 4211.0, 0.18298261665141813, 650.2113949565417, 0.8707756747483989], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 3, 0, 0.0, 155.66666666666666, 152, 160, 155.0, 160.0, 160.0, 160.0, 0.07706139224248651, 0.07472847900077062, 0.06539682603390701], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1", 2, 0, 0.0, 338.5, 157, 520, 338.5, 520.0, 520.0, 520.0, 0.07168201856564281, 0.06937195351421097, 0.05656159277445253], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 3, 0, 0.0, 151.66666666666666, 147, 156, 152.0, 156.0, 156.0, 156.0, 0.07707129094412332, 0.07473807803468209, 0.06465257707129095], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6", 3, 0, 0.0, 151.33333333333334, 149, 154, 151.0, 154.0, 154.0, 154.0, 0.07706337177939326, 0.07480565580929384, 0.06532324873487631], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7", 3, 0, 0.0, 155.33333333333334, 152, 158, 156.0, 158.0, 158.0, 158.0, 0.07705347511172754, 0.07479604908306366, 0.06456238441978733], "isController": false}, {"data": ["01_Homepage", 3, 0, 0.0, 3678.6666666666665, 3003, 4799, 3234.0, 4799.0, 4799.0, 4799.0, 0.17728400898238977, 646.4582325338316, 0.9508240013000827], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 3, 0, 0.0, 441.3333333333333, 401, 475, 448.0, 475.0, 475.0, 475.0, 0.07641559897093661, 0.9386034492090986, 0.05447596411014035], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails", 2, 0, 0.0, 1157.0, 765, 1549, 1157.0, 1549.0, 1549.0, 1549.0, 0.07012868613906517, 1.819031281777061, 0.32770094060100285], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 2.6497097190366974, 1.2654995699541285], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages", 7, 0, 0.0, 342.14285714285717, 277, 588, 305.0, 588.0, 588.0, 588.0, 0.11949266827128249, 4.835352172632764, 0.07643329855243167], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-6", 3, 0, 0.0, 1881.0, 1768, 2103, 1772.0, 2103.0, 2103.0, 2103.0, 0.21100014066676046, 300.7633919151779, 0.14691709013222676], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-5", 3, 0, 0.0, 1918.0, 1795, 2110, 1849.0, 2110.0, 2110.0, 2110.0, 0.20976087260523005, 237.7166299949308, 0.148102647357013], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-4", 3, 0, 0.0, 1526.0, 1481, 1571, 1526.0, 1571.0, 1571.0, 1571.0, 0.21451555237754738, 102.4695125357526, 0.1497838085448695], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-3", 3, 0, 0.0, 1429.6666666666667, 1271, 1656, 1362.0, 1656.0, 1656.0, 1656.0, 0.21229920033967872, 108.28503157950605, 0.15030949242799518], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-2", 3, 0, 0.0, 290.6666666666667, 152, 553, 167.0, 553.0, 553.0, 553.0, 0.2374544878898211, 0.38818243430425836, 0.16580074105588094], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-1", 3, 0, 0.0, 313.6666666666667, 304, 324, 313.0, 324.0, 324.0, 324.0, 0.2237303303751212, 0.9646185630919532, 0.14267178294429114], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-0", 3, 0, 0.0, 708.0, 484, 1116, 524.0, 1116.0, 1116.0, 1116.0, 0.21095562899936712, 0.21713596969270796, 0.1295811432037128], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 3.579064098465473, 1.6084558823529411], "isController": false}, {"data": ["02_Login", 3, 0, 0.0, 3518.0, 3491, 3537, 3526.0, 3537.0, 3537.0, 3537.0, 0.2306805074971165, 8.602685866013072, 2.2752667243367934], "isController": true}, {"data": ["03_Go To My Info", 3, 0, 0.0, 12551.0, 0, 32288, 5365.0, 32288.0, 32288.0, 32288.0, 0.057515337423312884, 1.3492701243769172, 0.29420443107745403], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 3, 0, 0.0, 316.6666666666667, 310, 323, 317.0, 323.0, 323.0, 323.0, 0.0765774964263835, 0.0969931766259955, 0.047636587132428014], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 10.94534943853428, 1.2997746749408985], "isController": false}, {"data": ["04_Click Personal Details", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4", 2, 0, 0.0, 342.5, 160, 525, 342.5, 525.0, 525.0, 525.0, 0.07166147121000394, 0.06956201404564837, 0.057315180586907453], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31", 2, 0, 0.0, 632.5, 481, 784, 632.5, 784.0, 784.0, 784.0, 1.0804970286331712, 3.1549669097784983, 0.635214073473798], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed", 2, 0, 0.0, 539.0, 502, 576, 539.0, 576.0, 576.0, 576.0, 1.070090957731407, 1.16205189941145, 0.6040161851257357], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5", 2, 0, 0.0, 343.5, 157, 530, 343.5, 530.0, 530.0, 530.0, 0.07164863509350147, 0.06954955398724653, 0.056605220498674495], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 3, 0, 0.0, 312.6666666666667, 304, 321, 313.0, 321.0, 321.0, 321.0, 0.07655600071452268, 0.16806434531860057, 0.04680083637430781], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2", 2, 0, 0.0, 167.5, 162, 173, 167.5, 173.0, 173.0, 173.0, 0.07257947452460443, 0.07038224433880098, 0.0581202823341559], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3", 2, 0, 0.0, 311.0, 151, 471, 311.0, 471.0, 471.0, 471.0, 0.07179523997558962, 0.06962175126539111, 0.05679115662131601], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 3, 0, 0.0, 340.0, 316, 372, 332.0, 372.0, 372.0, 372.0, 0.07656186198448346, 0.3509583790577787, 0.0469539544201715], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 96, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
