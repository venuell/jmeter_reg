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
var seriesFilter = "";
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
    cell.colSpan = 6;
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

    var data = {"OkPercent": 97.5609756097561, "KoPercent": 2.4390243902439024};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9629629629629629, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/menu-373"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/addCRNRegistrationItems-438"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350-2"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/menu-338"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getRegistrationEvents-422"], "isController": false}, {"data": [1.0, 500, 1500, "\/samlsso-347-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getRegistrationEvents-439"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T07_EnterCRN3-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/menu-429"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/term\/search?mode=registration-386"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T03_Login"], "isController": true}, {"data": [1.0, 500, 1500, "\/samlsso-349"], "isController": false}, {"data": [1.0, 500, 1500, "\/samlsso-347"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/classRegistration-387"], "isController": false}, {"data": [0.0, 500, 1500, "R03_Add_Drop_T17_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T02_Register_For_Classes"], "isController": true}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-434"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-433"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/-464"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getRegistrationEvents-445"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-437"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T07_EnterCRN5"], "isController": true}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T13_Click_Submit"], "isController": true}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-436"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T07_EnterCRN4"], "isController": true}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T07_EnterCRN3"], "isController": true}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/term\/saveTerm-384"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-365"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-485"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345"], "isController": false}, {"data": [0.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/saml\/logout-455"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-328"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/registration-315"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T01_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/submitRegistration\/batch-442"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/-314"], "isController": false}, {"data": [1.0, 500, 1500, "\/samlsso-347-1"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T05_Click_Continue"], "isController": true}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getTerms-383"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/classRegistration\/getTerms-382"], "isController": false}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T04_Enter_Term"], "isController": true}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T07_EnterCRN2"], "isController": true}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T07_EnterCRN1"], "isController": true}, {"data": [1.0, 500, 1500, "R03_Add_Drop_T12_Click_Add_to_Summary"], "isController": true}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-1"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-414"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-3"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-2"], "isController": false}, {"data": [1.0, 500, 1500, "\/StudentRegistrationSsb\/ssb\/menu-492"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 1, 2.4390243902439024, 43.07317073170733, 2, 342, 139.00000000000023, 246.1999999999999, 342.0, 26.28205128205128, 284.67986278044873, 72.46156350160255], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/StudentRegistrationSsb\/ssb\/menu-373", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 250.0, 553.955078125, 222.16796875], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/addCRNRegistrationItems-438", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 72.11143092105263, 66.25205592105263], "isController": false}, {"data": ["\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350-2", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 13.157894736842104, 695.6979851973684, 14.198704769736842], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/menu-338", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 236.328125, 173.046875], "isController": false}, {"data": ["\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350-1", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 23.49853515625, 68.2373046875], "isController": false}, {"data": ["\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350-0", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 6.15063048245614, 159.76219846491227], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getRegistrationEvents-422", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 129.7607421875, 26.4404296875], "isController": false}, {"data": ["\/samlsso-347-0", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 55.6640625, 102.12053571428571], "isController": false}, {"data": ["\/StudentRegistrationSsb\/saml\/SSO\/alias\/studentregss-sp-350", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 6.666666666666667, 357.3307291666667, 75.18229166666667], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getRegistrationEvents-439", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 133.0879407051282, 27.118389423076923], "isController": false}, {"data": ["R03_Add_Drop_T07_EnterCRN3-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 89.84375, 173.66536458333334], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/menu-429", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 443.1640625, 177.5390625], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/term\/search?mode=registration-386", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 6.490384615384615, 18.73497596153846], "isController": false}, {"data": ["R03_Add_Drop_T03_Login", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 4.975124378109452, 315.5074238184079, 71.51741293532338], "isController": true}, {"data": ["\/samlsso-349", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 29.41176470588235, 158.9211856617647, 38.775275735294116], "isController": false}, {"data": ["\/samlsso-347", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 249.83723958333334, 157.9318576388889], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/classRegistration-387", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 5.405405405405405, 842.0238597972973, 5.81714527027027], "isController": false}, {"data": ["R03_Add_Drop_T17_Logout", 1, 1, 100.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 187.52034505208334, 79.85432942708333], "isController": true}, {"data": ["R03_Add_Drop_T02_Register_For_Classes", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 8.849557522123893, 90.35363661504425, 66.4753871681416], "isController": true}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-434", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 81.19419642857143, 148.85602678571428], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-433", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 80.35714285714286, 148.85602678571428], "isController": false}, {"data": ["\/StudentRegistrationSsb\/-464", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 333.3333333333333, 223.30729166666666, 343.75], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getRegistrationEvents-445", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 126.59584603658536, 25.795541158536583], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-437", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 77.84598214285714, 148.85602678571428], "isController": false}, {"data": ["R03_Add_Drop_T07_EnterCRN5", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 77.84598214285714, 148.85602678571428], "isController": true}, {"data": ["R03_Add_Drop_T13_Click_Submit", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 3.401360544217687, 124.98007015306123, 168.2378029336735], "isController": true}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getSectionDetailsFromCRN-436", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 75.05580357142857, 148.85602678571428], "isController": false}, {"data": ["R03_Add_Drop_T07_EnterCRN4", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 75.05580357142857, 148.85602678571428], "isController": true}, {"data": ["R03_Add_Drop_T07_EnterCRN3", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 89.84375, 173.66536458333334], "isController": true}, {"data": ["\/StudentRegistrationSsb\/ssb\/term\/saveTerm-384", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 19.325657894736842, 52.88856907894737], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-365", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 169.0955528846154, 68.50961538461539], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-485", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 79.13643973214286, 30.970982142857142], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 10.526315789473683, 60.135690789473685, 49.1467927631579], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/saml\/logout-455", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 324.951171875, 89.111328125], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-328", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 150.0244140625, 108.3984375], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/registration-315", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 18.51851851851852, 984.519675925926, 18.428096064814817], "isController": false}, {"data": ["R03_Add_Drop_T01_Launch", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 2.444987775061125, 138.59546913202934, 7.962924052567238], "isController": true}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/submitRegistration\/batch-442", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 3.952569169960474, 124.71822504940711, 191.32133152173913], "isController": false}, {"data": ["\/StudentRegistrationSsb\/-314", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 2.923976608187134, 3.332305372807017, 1.5476516812865495], "isController": false}, {"data": ["\/samlsso-347-1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 333.3333333333333, 1239.2578125, 471.0286458333333], "isController": false}, {"data": ["R03_Add_Drop_T05_Click_Continue", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 3.3222591362126246, 550.891559385382, 17.039555647840533], "isController": true}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getTerms-383", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 28.90625, 71.94010416666667], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/getTerms-382", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 92.63392857142857, 76.66015625], "isController": false}, {"data": ["R03_Add_Drop_T04_Enter_Term", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 43.701171875, 65.77555338541667], "isController": true}, {"data": ["R03_Add_Drop_T07_EnterCRN2", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 81.19419642857143, 148.85602678571428], "isController": true}, {"data": ["R03_Add_Drop_T07_EnterCRN1", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 80.35714285714286, 148.85602678571428], "isController": true}, {"data": ["R03_Add_Drop_T12_Click_Add_to_Summary", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 17.241379310344826, 113.11287715517241, 39.938038793103445], "isController": true}, {"data": ["\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-1", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 34.85317887931034, 35.32462284482759], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 13508.30078125, 0.0], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 250.0, 51.513671875, 266.6015625], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/selfServiceMenu\/data-414", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 369.3033854166667, 148.27473958333334], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-3", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 168.9453125, 51.97975852272727], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/registration\/registerPostSignIn-345-2", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 21.062077702702705, 38.77217060810811], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/menu-492", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 443.1640625, 173.046875], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404", 1, 100.0, 2.4390243902439024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 1, "404", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/StudentRegistrationSsb\/ssb\/classRegistration\/saml\/logout-455", 1, 1, "404", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
