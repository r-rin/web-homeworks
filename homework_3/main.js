let goodsList = [];
let editedDiv;
let editedDivSection;
const productsList = document.querySelector(".products-list");
const shoppingCart = document.querySelector(".shopping-cart");

const doPageReload = false;

function updateLocalStorage(){
    localStorage.setItem("storedArray", JSON.stringify(goodsList));
}

window.onload = () => {
    let starterArray = [["Помідори", 2, true], ["Печиво", 1, false], ["Сир", 1, false]];

    if(localStorage.getItem("storedArray") != null){
        starterArray = JSON.parse(localStorage.getItem("storedArray"));
    }

    for(let productArray of starterArray){
        addProduct(productArray);
        goodsList.push(productArray);
        updateLocalStorage();
    } 
}

function isUnique(title) {
    for(let productArray of goodsList){
        let existingTitle = String(productArray[0]).toLowerCase();
        if(existingTitle.localeCompare(title.toLowerCase()) == 0) return false;
    }
    return true;
}

function addProduct(productArray) {
    let productTitle = productArray[0];
    let productAmount = productArray[1];
    let productSold = productArray[2];

    let row = document.querySelector("#productrow").content.querySelector(".row").cloneNode(true);
    row.dataset.name = productTitle;
    let rowSectionsCollection = row.querySelectorAll(".row-section");
        
    rowSectionsCollection[0].querySelector(".product-title").appendChild(document.createTextNode(productTitle));
    rowSectionsCollection[1].querySelector(".quanity").appendChild(document.createTextNode(productAmount));

    if(productAmount <= 1){
        rowSectionsCollection[1].querySelector(".remove-button").disabled = true;
    }

    if(productSold){
        rowSectionsCollection[0].querySelector(".product-title").style.textDecoration = "line-through";
        rowSectionsCollection[1].querySelector(".remove-button").remove();
        rowSectionsCollection[1].querySelector(".add-button").remove();
        rowSectionsCollection[2].querySelector(".cancel-button").remove();
        rowSectionsCollection[2].querySelector(".button").dataset.status = "1";
        rowSectionsCollection[2].querySelector(".button").textContent = "Не куплено";
    }
    productsList.append(row);

    card = document.querySelector("#productcard").content.querySelector(".amount-box").cloneNode(true);
    card.dataset.name = productTitle;

    card.querySelector(".amount-title").appendChild(document.createTextNode(productTitle));
    card.querySelector(".quanity-added").appendChild(document.createTextNode(productAmount));

    if(productSold){
        card.querySelector(".amount-title").style.textDecoration = "line-through";
        card.querySelector(".quanity-added").style.textDecoration = "line-through";
        shoppingCart.querySelectorAll(".row")[3].appendChild(card);
    } else {
        shoppingCart.querySelectorAll(".row")[1].appendChild(card);
    }
}


function addNewProduct() {
    const productName = document.querySelector(".add-product-field").value;
    let array = [productName, 1, false];
    if((productName.length != 0) && isUnique(productName)){
        addProduct(array);
        goodsList.push(array);
        updateLocalStorage();
    } else {
        window.alert("Надана порожня назва або назва товару, який вже існує!");
    }
}

function changeAmount(element, isIncrease) {
    let productName = element.parentElement.parentElement.dataset.name;

    for(let productArray of goodsList){
        if(productName.localeCompare(productArray[0]) == 0){
            if(isIncrease){
                productArray[1] = productArray[1] + 1;
            } else {
                productArray[1] = productArray[1] - 1;
            }
            updateLocalStorage();
            if(doPageReload){
                location.reload();
            } else {
                changeAmountOnPage(element, isIncrease);
            }
        }
    }
}

function changeAmountOnPage(element, isIncrease) {
    let productName = element.parentElement.parentElement.dataset.name;
    let section = element.parentElement;
    let quanityElem = section.querySelector(".quanity");
    let decreaseButton = section.querySelector(".remove-button");

    if(quanityElem.textContent === "1" && isIncrease){
        decreaseButton.disabled = false;
    } else if(quanityElem.textContent === "2" && !isIncrease) {
        decreaseButton.disabled = true;
    }

    if(isIncrease){
        quanityElem.textContent = Number(quanityElem.textContent) + 1;
    } else {
        quanityElem.textContent = Number(quanityElem.textContent) - 1;
    }

    let shoppingCart = document.querySelector(".shopping-cart");
    let cardsCollection = shoppingCart.querySelectorAll(".row")[1].querySelectorAll(".amount-box");
    let cardsArray = [].slice.call(cardsCollection);
    
    for(const card of cardsArray){
        if(card.dataset.name === productName) {
            let quanity = card.querySelector(".quanity-added");
            
            if(isIncrease){
                quanity.textContent = Number(quanity.textContent) + 1;
            } else {
                quanity.textContent = Number(quanity.textContent) - 1;
            }
        }
    }
}

function setProductBought(element) {
    let productName = element.parentElement.parentElement.dataset.name;

    for(let productArray of goodsList){
        if(productName.localeCompare(productArray[0]) == 0){
            productArray[2] = !productArray[2];
            updateLocalStorage();
            if(doPageReload){
                location.reload();
            } else {
                setProductBoughtOnPage(element);
            }
        }
    }
}

function setProductBoughtOnPage(element){
    let productName = element.parentElement.parentElement.dataset.name;
    let statusValue = element.dataset.status;
    let currentRow = element.parentElement.parentElement;
    let rowSectionsCollection = currentRow.querySelectorAll(".row-section");

    if(statusValue === "1"){
        element.dataset.status = "0";
        element.textContent = "Куплено";

        let amount = rowSectionsCollection[1].querySelector(".quanity").textContent;
        
        let rowSectionAmount = document.querySelector("#productrow").content.querySelector(".row").querySelectorAll(".row-section")[1].cloneNode(true);
        rowSectionAmount.querySelector(".quanity").textContent = amount;

        let removeButton = document.querySelector("#productrow").content.querySelector(".row").querySelectorAll(".row-section")[2].querySelector(".cancel-button").cloneNode(true);
        rowSectionsCollection[2].appendChild(removeButton);

        if(Number(amount) > 1){
            rowSectionAmount.querySelector(".remove-button").disabled = false;
        }
        
        rowSectionsCollection[0].querySelector(".product-title").style.textDecoration = "none";
        rowSectionsCollection[1].replaceWith(rowSectionAmount);

        

        let shoppingCart = document.querySelector(".shopping-cart");
        let cardsCollection = shoppingCart.querySelectorAll(".row")[3].querySelectorAll(".amount-box");
        let cardsArray = [].slice.call(cardsCollection);

        for(const card of cardsArray){
            if(card.dataset.name === productName) {
                let cardCopy = card.cloneNode(true);
                card.remove();

                cardCopy.querySelector(".amount-title").style.textDecoration = "none";
                cardCopy.querySelector(".quanity-added").style.textDecoration = "none";

                shoppingCart.querySelectorAll(".row")[1].appendChild(cardCopy);
            }
        }

    } else if(statusValue === "0"){
        element.dataset.status = "1";
        element.textContent = "Не куплено";
        
        rowSectionsCollection[1].querySelector(".add-button").remove();
        rowSectionsCollection[1].querySelector(".remove-button").remove();

        rowSectionsCollection[0].querySelector(".product-title").style.textDecoration = "line-through";

        rowSectionsCollection[2].querySelector(".cancel-button").remove();

        let shoppingCart = document.querySelector(".shopping-cart");
        let cardsCollection = shoppingCart.querySelectorAll(".row")[1].querySelectorAll(".amount-box");
        let cardsArray = [].slice.call(cardsCollection);

        for(const card of cardsArray){
            if(card.dataset.name === productName) {
                let cardCopy = card.cloneNode(true);
                card.remove();

                cardCopy.querySelector(".amount-title").style.textDecoration = "line-through";
                cardCopy.querySelector(".quanity-added").style.textDecoration = "line-through";

                shoppingCart.querySelectorAll(".row")[3].appendChild(cardCopy);
            }
        }
    }
}

function remove(element) {
    let productName = element.parentElement.parentElement.dataset.name;

    for(let productArray of goodsList){
        if(productName.localeCompare(productArray[0]) == 0){
            goodsList.pop(productArray);
            updateLocalStorage();
            if(doPageReload){
                location.reload();
            } else {
                removeOnPage(element);
            }
        }
    }
}

function removeOnPage(element){
    let productName = element.parentElement.parentElement.dataset.name;
    element.parentElement.parentElement.remove();

    let cardsCollection = shoppingCart.querySelectorAll(".row")[1].querySelectorAll(".amount-box");
    let cardsArray = [].slice.call(cardsCollection);

    for(const card of cardsArray){
        if(card.dataset.name === productName) {
            card.remove();
        }
    }
}

function editTitle(element) {

    let rowSectionsCollection = element.parentElement.parentElement.querySelectorAll(".row-section");
    let boughtButton = rowSectionsCollection[2].querySelector(".button");

    if(boughtButton.dataset.status == "0"){
        editedDiv = element.cloneNode(true);
        editedDivSection = element.parentElement.parentElement;
        let productTitle = editedDiv.textContent;
    
        let titleInput = document.querySelector("#titleinput").content.querySelector("input").cloneNode(true);
        titleInput.value = productTitle;
    
        element.replaceWith(titleInput);
    
        titleInput.addEventListener('blur', function() {
            let newTitle = titleInput.value;
            if(isUnique(newTitle) && newTitle.length > 0){
                editedDivSection.dataset.name = newTitle;
                let newDiv = editedDiv.cloneNode(true);
                newDiv.textContent = newTitle;
                titleInput.replaceWith(newDiv);

                let cartRows = shoppingCart.querySelectorAll(".row");
                let cardsArray = [].slice.call(cartRows[1].querySelectorAll(".amount-box"));

                for(const card of cardsArray){
                    if(card.dataset.name === productTitle) {
                        card.querySelector(".amount-title").textContent = newTitle;
                        card.dataset.name = newTitle;
                    }
                }

                for(let productArray of goodsList){
                    if(productTitle.localeCompare(productArray[0]) == 0){
                        productArray[0] = newTitle;
                        updateLocalStorage();
                    }
                }
            } else {
                window.alert("Надана порожня назва або назва товару, який вже існує!");
            }
            
        });

        titleInput.focus();
    }
    
  }