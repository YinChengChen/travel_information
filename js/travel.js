var data = [];
let travelUrl = "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97";



// Call the function with the URL we want to load
loadData(travelUrl).then(function (response) {
    let dataJson = response;
    //console.log(dataJson);
    tmpData = JSON.parse(dataJson);
    data = tmpData.result.records;
    let regionList = [];
    let tmplist = [];
    //console.log('data length:', data.length);
    pageSet(data.length, "0");
    selectionPageIndex(data);
    displayOfSpot(data.slice(0, 10));
    //取得地區清單
    for (var i = 0; i < data.length; i++) {
        //console.log(data[i].Zone);
        // 避免地區重複
        tmplist.push(data[i].Zone);
        regionList = tmplist.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        });
    }
    //console.log(tmplist);
    //建立清單
    let selection = document.getElementById('regionList');
    for (let j = 0; j < regionList.length; j++) {
        let option = document.createElement('OPTION');
        option.textContent = regionList[j];
        selection.appendChild(option);
    }
    //選擇地區->顯示該地區前10筆資料
    selection.addEventListener('change', function () {
        //console.log('region:', selection.value);
        if (selection.value.indexOf('--') !== -1) {
            let ZoneTitle = document.getElementById("zoneTitle");
            ZoneTitle.textContent = "全行政區景點";
            pageSet(data.length);
            selectionPageIndex(data);
            displayOfSpot(data.slice(0, 10));
        } else {
            let keyZone = selection.value;
            let ZoneTitle = document.getElementById("zoneTitle");
            ZoneTitle.textContent = keyZone + "景點";
            let selectionData = [];
            data.forEach(function (element) {
                //console.log(value, index);
                if (element.Zone === keyZone) {
                    return selectionData.push(element);
                }
            });
            //console.log('data length:', selectionData.length);
            pageSet(selectionData.length);
            selectionPageIndex(selectionData);
            //顯示查詢地點
            displayOfSpot(selectionData);
        }

    }, false);
    //熱門行政區
    let hotspotNode = document.querySelector(".hotspot");
    let hotspotButtonNode = hotspotNode.getElementsByTagName("button");
    //console.log(hotspotButtonNode);
    for (let j = 0; j < hotspotButtonNode.length; j++){
        hotspotButtonNode[j].addEventListener("click", function () {
            //console.log("text: ", event.currentTarget.textContent);
            let keyZone = event.currentTarget.textContent;
            let ZoneTitle = document.getElementById("zoneTitle");
            ZoneTitle.textContent = keyZone + "景點";
            let selectionData = [];
            data.forEach(function (element) {
                //console.log(value, index);
                if (element.Zone === keyZone) {
                    return selectionData.push(element);
                }
            });
            //console.log('data length:', selectionData.length);
            pageSet(selectionData.length);
            selectionPageIndex(selectionData);
            //顯示查詢地點
            displayOfSpot(selectionData);
        }, false);
    }

}, function (error) {
    console.log(Error);
});

// function
// Promise reference :https://github.com/mdn/js-examples/blob/master/promises-test/index.html
function loadData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(console.error("The data didn't load successfully."));
            }
        };
        xhr.onerror = function () {
            // xhr fails to begin with
            reject(console.error('There was a network error.'));
        };
        xhr.send();
    });
}
//建立頁碼
function pageSet(dataLength) {
    let pageNumber = Math.ceil(dataLength / 10);
    //console.log('page:', pageNumber);
    let pageNode = document.getElementById('pagenumber');
    clearNode(pageNode);
    pageNode.setAttribute("class", "pagination");
    let prevNode = document.createElement("A");
    prevNode.textContent = "<< prev";
    prevNode.setAttribute('href', '#here');
    pageNode.appendChild(prevNode);
    for (let n = 0; n < pageNumber; n++) {
        let numberNode = document.createElement("A");
        numberNode.textContent = n + 1;
        //刷新地點都顯示第一頁
        if (n == 0) {
            numberNode.setAttribute("class", "selected");
        }
        numberNode.setAttribute("href", "#here");
        numberNode.setAttribute("id", n + 1);
        pageNode.appendChild(numberNode);
    }
    let nextNode = document.createElement("A");
    nextNode.textContent = "next >>";
    nextNode.setAttribute("href", "#here");
    pageNode.appendChild(nextNode);
}
//指定頁碼資訊
function selectionPageIndex(dataList) {
    let pageNode = document.getElementById("pagenumber");
    let pageIndex = pageNode.getElementsByTagName("a");
    //console.log(pageNode);
    for (let i = 0; i < pageIndex.length; i++) {
        pageIndex[i].addEventListener("click", function () {
            console.log(pageIndex);
            if (event.currentTarget.textContent.indexOf("prev") != -1){
                let currentIndex = document.querySelector(".selected");
                if (parseInt(currentIndex.textContent) !== 1){
                    let pageNumber = parseInt(currentIndex.textContent) - 1;
                    let prevNode = pageIndex[pageNumber];
                    currentIndex.removeAttribute("class");
                    prevNode.setAttribute("class", "selected");
                    //選取資料範圍
                    let endIndex = parseInt(prevNode.textContent) * 10;
                    let startIndex = parseInt(prevNode.textContent) * 10 - 10;
                    let selectionData = dataList.slice(startIndex, endIndex);
                    displayOfSpot(selectionData);
                }
            }else if(event.currentTarget.textContent.indexOf("next") != -1){
                let currentIndex = document.querySelector(".selected");
                if(parseInt(currentIndex.textContent) < (pageIndex.length - 2)){
                    let pageNumber = parseInt(currentIndex.textContent) + 1;
                    let nextNode = pageIndex[pageNumber];
                    currentIndex.removeAttribute("class");
                    nextNode.setAttribute("class", "selected");
                    //選取資料範圍
                    let endIndex = parseInt(nextNode.textContent) * 10;
                    let startIndex = parseInt(nextNode.textContent) * 10 - 10;
                    let selectionData = dataList.slice(startIndex, endIndex);
                    displayOfSpot(selectionData);
                }
            }else{
                //console.log('No. ', i, ' value: ', event.currentTarget.textContent, typeof (event.currentTarget.textContent));
                let deleteElement = document.querySelector(".selected");
                //console.log('selected:', deleteElement);
                deleteElement.removeAttribute("class");
                event.currentTarget.setAttribute("class", "selected");
                //選取資料範圍
                let endIndex = parseInt(event.currentTarget.textContent) * 10;
                let startIndex = parseInt(event.currentTarget.textContent) * 10 - 10;
                let selectionData = dataList.slice(startIndex, endIndex);
                displayOfSpot(selectionData);
            }
        }, false);
    }

}
//顯示景點資訊
function displayOfSpot(dataList) {
    //找到父節點
    let fatherNode = document.getElementById("content");

    //清除節點上的資訊
    clearNode(fatherNode);
    //建立新資訊
    dataList.forEach(function (x) {
        //建立圖片
        let imgNode = document.createElement("DIV");
        imgNode.setAttribute("class", "picture");
        imgNode.setAttribute("style", 'background: url(' + x.Picture1 + ') no-repeat; background-position: center;background-size: cover;');
        let topIndex = parseFloat(imgNode.getAttribute("height")) - 52;
        //建立圖片上的字詞
        let nameNode = document.createElement("DIV");
        nameNode.setAttribute("class", "spotname");
        let spotNode = document.createElement("H4");
        let zoneNode = document.createElement("H5");
        spotNode.textContent = x.Name;
        zoneNode.textContent = x.Zone;
        nameNode.appendChild(spotNode);
        nameNode.appendChild(zoneNode);
        //建立卡片
        let cardNode = document.createElement("DIV");
        cardNode.setAttribute("class", "card");
        //建立資訊
        let iconList = ["img/icons_clock.png", "img/icons_pin.png", "img/icons_phone.png", "img/icons_tag.png"];
        let infoList = [x.Opentime, x.Add, x.Tel, x.Ticketinfo];
        let infoListNode = document.createElement("DIV");
        infoListNode.setAttribute("class", "flex-container");
        for (let k = 0; k < infoList.length; k++) {
            let infoNode = document.createElement("DIV");
            let imgNode = document.createElement("IMG");
            imgNode.setAttribute("src", iconList[k]);
            let textNode = document.createElement("SPAN");
            textNode.textContent = infoList[k];
            if (k < 2) {
                infoNode.setAttribute("class", "item item2");
            } else {
                infoNode.setAttribute("class", "item item3");
            }
            infoNode.appendChild(imgNode);
            infoNode.appendChild(textNode);
            infoListNode.appendChild(infoNode);
        }
        // 組合
        cardNode.appendChild(imgNode);
        cardNode.appendChild(nameNode);
        cardNode.appendChild(infoListNode);
        fatherNode.appendChild(cardNode);
    });
}
//清除節點
function clearNode(fatherNode) {
    while (fatherNode.firstChild) {
        fatherNode.removeChild(fatherNode.firstChild);
    }
}

