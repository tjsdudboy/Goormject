//1. 상수생성
//2. 셀에 배열 생성
//3. 셀에 객체생성(각각의 명칭)
//4. 셀 요소(input) 생성
//5. cell 랜더링(??)
//6. 10개의 셀을 하나의 로우 요소로 생성
//7. 행, 열 해더에 숫자 및 영어 넣기
//8. 해더, disabled 생성
//9. 셀 클릭시 행, 열 해더의 스타일 변경
//10. cell 클릭시 위치의 해더 표시
//11. 다른 셀 클릭시 이전 적용된 셀의 스타일 제거 
//12. 엑셀 전송
//13. cell: 에 현재 선택한 셀의 위치 표시

//1. 상수 생성
const spreadsheetContainer = document.querySelector("#spreadsheet-container");
const Rows = 10;
const Cols = 10;
SpreadSheet = [];
const Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const exportBtn = document.querySelector("#export-btn");


//2. 셀에 배열 생성
function initSpreadsheet () {
    for(let i= 0; i<Rows; i++) {
        let SpreadSheetRow = [];
        for(let j= 0; j<Cols; j++) {
            let cellData = "";
            let isHeader = false;
            let disabled = false;
            
            if(j===0){
                cellData = i;
                isHeader = true;
                disabled = true;
            }
           
            if(i===0){
                cellData = Alphabet[j-1];
                isHeader = true;
                disabled = true;
            }

            if(!cellData){
                cellData ="";
            }
        
            const rowName = i;
            const columnName = Alphabet[j-1];
            //3. 셀에 객체생성(각강의 명칭) => 셀에 데이터,속성 등
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName,columnName, false);
            SpreadSheetRow.push(cell);
        }
        SpreadSheet.push(SpreadSheetRow);
    }
    drawsheet();
    console.log("spreadsheet",SpreadSheet);
}

//3. 셀에 객체생성(각각의 명칭) => 셀 양상???

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName,columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

//4. 셀 요소(input) 생성
function CreatCellEl (cell) {
    const cellEl = document.createElement("input");
    cellEl.className= "cell";
    cellEl.id="cell_" + cell.row + cell.column;
    cellEl.value= cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handlecellClick(cell);
    cellEl.onchange =(e) => handleonchange(e.target.value, cell);
    return cellEl
}
 
//5. cell 랜더링(??)
function drawsheet () {
    for(let i = 0; i < SpreadSheet.length; i++) {
        //6. 10개의 셀을 하나의 로우 요소로 생성
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className="cell-row";
        for(let j = 0; j<SpreadSheet[i].length; j++){
            const cell = SpreadSheet[i][j]
            spreadsheetContainer.append(CreatCellEl(cell));// append는 자식 요소 생성
        }
        spreadsheetContainer.append(rowContainerEl)
    }
}
//10. cell 클릭시 위치의 해더 표시

function handlecellClick(cell) {
    ClearHeaderActiveStates()
    const columheader = SpreadSheet[0][cell.column];
    const rowheader = SpreadSheet[cell.row][0];
    columheaderEl = getElFromRowColumn(columheader.row, columheader.column);
    rowheaderEl = getElFromRowColumn(rowheader.row, rowheader.column);
    columheaderEl.classList.add("active");
    rowheaderEl.classList.add("active");
    // console.log('clcked cell',cell);
    // console.log("columnheader",columheader);
    // console.log("rowheader",rowheader);    
    document.querySelector("#cell-status").innerHTML = cell.columnName + ""+cell.rowName
}

function getElFromRowColumn(row, col) {
    return document.querySelector("#cell_"+ row + col);
}

function ClearHeaderActiveStates(){
    const headers= document.querySelectorAll(".header");
    headers.forEach((header) => {
        header.classList.remove("active");
    });
}

exportBtn.onclick = function(e) {
    console.log(spreadsheet);
}


function handleonchange(data,cell) {
    cell.data = data;
}

exportBtn.onclick = function(e) {
    let csv = ""
    for(let i = 0; i< SpreadSheet.length;i++){
        if(i===0) continue;
        csv+=
             SpreadSheet[i]
                .filter((item) => !item.isHeader)
                .map((item) => item.data)
                .join(",") +"\r\n";
    }
    const csvObj = new Blob([csv])
    const csvUrl = URL.createObjectURL(csvObj)
    console.log("csv", csvUrl)

    const a = document.createElement("a")
    a.href = csvUrl
    a.download = "Spreadsheet File Name.csv"
    a.click()
    console.log(csv);
}

initSpreadsheet();