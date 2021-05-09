let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let topLeftCell = document.querySelector(".top-left-cell");
let cells = document.querySelector(".cells");
let addressInput = document.querySelector("#address");
let formulaInput = document.querySelector("#formula");
let allCells = document.querySelectorAll(".cell");

//font family and size option
let selectFont = document.getElementById("font-family");
let selectSize = document.getElementById("font-size");

//selected row and column logic
let allTopElem = document.querySelectorAll(".top-row-cell");
let allRowElem = document.querySelectorAll(".left-col-cell");

cellsContent.addEventListener("scroll" , function(e){
    let top = e.target.scrollTop ;
    let left =  e.target.scrollLeft;

    topRow.style.top = top+"px";
    leftCol.style.left = left+"px";
    topLeftCell.style.top = top+"px";
    topLeftCell.style.left = left+"px";
})

// global
let rowId;
let colId;
let lastSelectedCell;

cells.addEventListener("click" , function(e){

    selectFont.selectedIndex = 0;
    selectSize.selectIndex = 0;

    let currentCell = e.target;
    rowId = Number(currentCell.getAttribute("rowid"));
    colId = Number(currentCell.getAttribute("colid"));
    let address = String.fromCharCode(65+colId) + (rowId+1)+"";
    let cellObject = db[rowId][colId];
    // console.log(address);

    let item = document.querySelector(".active-cell");

    if(item){
        item.classList.remove("active-cell");
    }
    //console.log(rowId + "  " + colId);

    let metaSelected = document.querySelectorAll(".active-item");
   if(metaSelected.length != 0){
    for(let i =0; i < metaSelected.length; i++){
        metaSelected[i].classList.remove("active-item");
    }
}
    //selected row and column backhground change
    allRowElem[rowId].classList.add("active-item");
    allTopElem[colId].classList.add("active-item");

    //selected cell background change 
    currentCell.classList.add("active-cell");
    
   // console.log(selectFont.value);

    addressInput.value = address;
    formulaInput.value = cellObject.formula;

    setMenu(cellObject); 
})


for(let i=0 ; i<allCells.length  ; i++){
    allCells[i].addEventListener("blur" , function(e){
        let currentElement = e.target;
        lastSelectedCell = currentElement;
        let value = currentElement.textContent;
        let cellObject = db[rowId][colId]; 
        if(value != cellObject.value){
            
            if(cellObject.formula){
                deleteFormula(cellObject);
            }

            // inside if when value is not falsy and also value is not same as already saved value in db
            cellObject.value = value;
            // console.log(db);
            updateChildrens(cellObject);
        }
    })

    allCells[i].addEventListener("keyup" , function(e){
        let { height } = e.target.getBoundingClientRect();
        let rowId = e.target.getAttribute("rowid");
        let leftColCell = document.querySelector(`div[cell-id="${rowId}"]`);
        leftColCell.style.height = height+"px";
    })
}


// for formula
formulaInput.addEventListener("blur" , function(e){
    let formula = formulaInput.value;
    if(formula && lastSelectedCell){
        let cellObject = db[rowId][colId];
        
        if(cellObject.formula != formula){    
            if(cellObject.formula){
                deleteFormula(cellObject);
            }

            let solvedValue = solveFormula(formula , cellObject);
            // set UI
            lastSelectedCell.textContent  = solvedValue;
            // set DB
            cellObject.value = solvedValue;
            cellObject.formula = formula;
            // console.log(db);
            updateChildrens(cellObject);
        }
    }
})