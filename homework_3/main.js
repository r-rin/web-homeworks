var goodsList = [["Помідори", 2, true], ["Печиво", 1, false], ["Сир", 1, false]];
var editedDiv;

function addProduct() {
    const productName = document.querySelector(".add-product-field").value;
    if(productName.length != 0){
        goodsList[goodsList.length] = [productName, 1, false];
        const productsList = document.querySelector(".products-list");
        const shoppingCart = document.querySelector(".shopping-cart");
        
        let template = document.querySelector("#productrow").content.cloneNode(true);
        let row = template.querySelector(".row");
        row.dataset.name = productName;
        let rowSectionsCollection = row.querySelectorAll(".row-section");
        
        rowSectionsCollection[0].querySelector(".product-title").appendChild(document.createTextNode(productName));
        productsList.append(template);

        template = document.querySelector("#productcard").content.cloneNode(true);
        card = template.querySelector(".amount-box");
        card.dataset.name = productName;

        card.querySelector(".amount-title").appendChild(document.createTextNode(productName))
        shoppingCart.querySelectorAll(".row")[1].appendChild(template);
    }
}


function changeAmount(element, isIncrease) {
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

function setProductBought(element){
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

function remove(element){
    let productName = element.parentElement.parentElement.dataset.name;
    element.parentElement.parentElement.remove();

    let shoppingCart = document.querySelector(".shopping-cart");
    let cardsCollection = shoppingCart.querySelectorAll(".row")[1].querySelectorAll(".amount-box");
    let cardsArray = [].slice.call(cardsCollection);

    for(const card of [].slice.call(cardsCollection)){
        if(card.dataset.name === productName) {
            card.remove();
        }
    }
}

function editTitle(element) {
    editedDiv = element.cloneNode(true);
    let productName = editedDiv.textContent;
    
    let titleInput = document.querySelector("#titleinput").content.querySelector("input").cloneNode(true);
    titleInput.value = productName;
    
    element.replaceWith(titleInput);
    
    titleInput.addEventListener('blur', function() {
        let newDiv = editedDiv.cloneNode(true);
        newDiv.textContent = titleInput.value;
        titleInput.replaceWith(newDiv);

        let shoppingCart = document.querySelector(".shopping-cart");
        let cartRows = shoppingCart.querySelectorAll(".row");
        let cardsArray = [].slice.call(cartRows[1].querySelectorAll(".amount-box"));

        for(const card of cardsArray){
            if(card.dataset.name === productName) {
                card.querySelector(".amount-title").textContent = newDiv.textContent;
                card.dataset.name = newDiv.textContent;
            }
        }

        cardsArray = [].slice.call(cartRows[3].querySelectorAll(".amount-box"));
        for(const card of cardsArray){
            if(card.dataset.name === productName) {
                card.querySelector(".amount-title").textContent = newDiv.textContent;
                card.dataset.name = newDiv.textContent;
            }
        }
    });
    titleInput.focus();
  }