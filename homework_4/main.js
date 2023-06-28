
async function fetchData() {
    try {
      const response = await fetch('./assets/js/Pizza_List.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  

var pizzaListNode = document.querySelector("#pizza-list");
var pizzaCartNode = document.querySelector("#pizza-cart");
var pizzaCardTemplate = document.querySelector("#pizza-card-template");
var pizzaCartTemplate = document.querySelector("#cart-row-template");
var pizzaCartStorage = [];
var cartAmount = 0;
var pizzaArray;

window.onload = async () => {
    pizzaArray = await fetchData();

    document.querySelector("h1").querySelector(".pizza-amount").textContent = pizzaArray.length;

    for (let pizzaObject of pizzaArray){
        let cardNode = createPizzaCard(pizzaObject);
        pizzaListNode.appendChild(cardNode);
    }

    if(localStorage.getItem("pizzaCartStorage") != null){
        pizzaCartStorage = JSON.parse(localStorage.getItem("pizzaCartStorage"));
        cartAmount = pizzaCartStorage.length;

        loadCartFromStorage();
    } else {
        updateLocalStorage();
    }
    countTotal();
    document.querySelector("#cart-amount").textContent = cartAmount;
}

function loadCartFromStorage() {
    /* pizzaCartItem = {id: ?,
                        type: "small"/"big",
                        amount: ?} */
    for(pizzaCartItem of pizzaCartStorage){
        let id = pizzaCartItem.id;
        let type = pizzaCartItem.type;
        let amount = pizzaCartItem.amount;

        let cartRow = createPizzaInCart(id, type, amount);
        pizzaCartNode.appendChild(cartRow);
    }
}

function createPizzaInCart(id, type, amount){
    let pizzaObject = null;

    for(pizza of pizzaArray){
        if(pizza.id == id){
            pizzaObject = pizza;
        }
    }

    if(pizzaObject != null){
        let templateNode = pizzaCartTemplate.content.querySelector(".cart-row").cloneNode(true);

        templateNode.dataset.id = pizzaObject.id;
        templateNode.dataset.type = type;

        let pizzaTitle = pizzaObject.title;
        let pizzaData;

        if(type == "small"){
            pizzaTitle += " (Мала)"
            pizzaData = pizzaObject.small_size;
        } else if(type == "big"){
            pizzaTitle += " (Велика)"
            pizzaData = pizzaObject.big_size;
        }

        templateNode.querySelector(".pizza-cart-title").textContent = pizzaTitle;

        let pizzaDataNode = templateNode.querySelector(".pizza-cart-data").querySelectorAll("span");

        pizzaDataNode[0].innerHTML = "<img src=\"assets/images/size-icon.svg\"/>"+pizzaData.size;
        pizzaDataNode[1].innerHTML = "<img src=\"assets/images/weight.svg\"/>"+pizzaData.weight;

        templateNode.querySelector(".pizza-cart-price").textContent = Number(amount*pizzaData.price) + "грн";
        templateNode.querySelector(".cart-amount").textContent = Number(amount);

        templateNode.querySelectorAll("img")[2].src = pizzaObject.icon;

        return templateNode;
    }

    return null;
}

function containsPizza(obj, list) {
    for(let cartObject of list){
        if(cartObject.id == obj.id && cartObject.type == obj.type){
            return true;
        }
    }
    return false;
}

function updateLocalStorage(){
    localStorage.setItem("pizzaCartStorage", JSON.stringify(pizzaCartStorage));
}

function addToCart(button){
    let pizzaType = button.dataset.size;
    let pizzaId = button.parentElement.parentElement.dataset.id;

    let pizzaObj = {id: pizzaId, type: pizzaType, amount: 1};

    if(containsPizza(pizzaObj, pizzaCartStorage)){
        changeAmount(pizzaId, pizzaType, 1);
    } else {
        let cartRow = createPizzaInCart(pizzaObj.id, pizzaObj.type, 1);
        pizzaCartNode.appendChild(cartRow);
        pizzaCartStorage.push(pizzaObj);
        updateInCartAmount();
        updateLocalStorage();
    }
    countTotal();
}

function changeAmount(pizzaId, pizzaType, value){
    let cartRow = pizzaCartNode.querySelector(`.cart-row[data-id="${pizzaId}"][data-type="${pizzaType}"]`);

    if(cartRow != null){
        let price = cartRow.querySelector(".pizza-cart-price");
        let amount = cartRow.querySelector(".cart-amount");

        let pricePerUnit =  Number(price.textContent.slice(0, -3)) / Number(amount.textContent);
        
        amount.textContent = Number(amount.textContent) + value;
        
        price.textContent = pricePerUnit * Number(amount.textContent) + "грн";

        for(let cartObj of pizzaCartStorage){
            if(cartObj.id == pizzaId && cartObj.type == pizzaType){
                cartObj.amount += value;
                updateLocalStorage();
            }
        }
        countTotal();
    }
}

function decreaseAmount(button){
    let rowContainer = button.parentElement.parentElement.parentElement.parentElement;
    let id = rowContainer.dataset.id;
    let type = rowContainer.dataset.type;

    let cartAmount = button.parentElement.querySelector(".cart-amount");
    let amountInCart = Number(cartAmount.textContent);
    if(amountInCart < 2){
        rowContainer.remove();
        for(let cartObj of pizzaCartStorage){
            if(cartObj.id == id && cartObj.type == type){
                let pizzaIndex = pizzaCartStorage.indexOf(cartObj);
                pizzaCartStorage.splice(pizzaIndex, 1);
                updateInCartAmount();
                updateLocalStorage();
                countTotal();
            }
        }
    } else {
        changeAmount(id, type, -1);
    }
}

function increaseAmount(button){
    let rowContainer = button.parentElement.parentElement.parentElement.parentElement;
    let id = rowContainer.dataset.id;
    let type = rowContainer.dataset.type;

    changeAmount(id, type, 1);
}

function removeFromCart(button){
    let rowContainer = button.parentElement.parentElement.parentElement;
    let id = rowContainer.dataset.id;
    let type = rowContainer.dataset.type;

    rowContainer.remove();
    for(let cartObj of pizzaCartStorage){
        if(cartObj.id == id && cartObj.type == type){
            let pizzaIndex = pizzaCartStorage.indexOf(cartObj);
            pizzaCartStorage.splice(pizzaIndex, 1);
            updateInCartAmount();
            updateLocalStorage();
        }
    }
    countTotal();
}

function clearCart(){
    pizzaCartNode.innerHTML = "";
    pizzaCartStorage.length = 0;
    updateInCartAmount();
    updateLocalStorage();
    countTotal();
}

function updateInCartAmount(){
    let cartAmount = pizzaCartStorage.length;
    document.querySelector("#cart-amount").textContent = cartAmount;
}

function countTotal() {
    let totalValue = 0;

    for(let cartObject of pizzaCartStorage){

        let pizzaFullData;
        let pizzaData;

        for(let existingPizza of pizzaArray){
            if(existingPizza.id == cartObject.id){
                pizzaFullData = existingPizza;
            }
        }

        if(cartObject.type == "small"){
            pizzaData = pizzaFullData.small_size;
        } else if(cartObject.type == "big"){
            pizzaData = pizzaFullData.big_size;
        }

        totalValue += cartObject.amount * pizzaData.price;
    }

    document.querySelector("#checkout-total").textContent = totalValue + " грн"
}

function createPizzaCard(pizza){
    let templateNode = pizzaCardTemplate.content.querySelector("div").cloneNode(true);

    templateNode.dataset.id = pizza.id;
    templateNode.querySelector(".pizza-image").src = pizza.icon;
    templateNode.querySelector(".pizza-title").textContent = pizza.title;
    templateNode.querySelector(".pizza-hint").textContent = pizza.type;

    const contentString = Object.values(pizza.content)
    .reduce((acc, val) => acc.concat(val), [])
    .join(", ");

    const capitalizedString = contentString.charAt(0).toUpperCase() + contentString.slice(1);

    templateNode.querySelector(".pizza-contents").textContent = capitalizedString;

    let isThereSmall = true;

    if(pizza.small_size === undefined){
        isThereSmall = false;
        Array.from(templateNode.querySelectorAll("[data-size=\"small\"]")).forEach(element => {
            element.remove();
        });
        templateNode.querySelector(".pizza-prices").dataset.available = 1;
    } else {
        let smallCollection = templateNode.querySelectorAll(".pizza-description[data-size=\"small\"]");

        smallCollection[0].innerHTML = "<img src=\"assets/images/size-icon.svg\"/>"+pizza.small_size.size;
        smallCollection[1].innerHTML = "<img src=\"assets/images/weight.svg\"/>"+pizza.small_size.weight;

        let smallPriceDiv = templateNode.querySelectorAll(".pizza-price");
        smallPriceDiv[0].textContent = pizza.small_size.price;
    }

    if(pizza.big_size === undefined){
        Array.from(templateNode.querySelectorAll("[data-size=\"big\"]")).forEach(element => {
            element.remove();
        });
        templateNode.querySelector(".pizza-prices").dataset.available = 1;
    } else {
        let bigCollection = templateNode.querySelectorAll(".pizza-description[data-size=\"big\"]");
        
        bigCollection[0].innerHTML = "<img src=\"assets/images/size-icon.svg\"/>"+pizza.big_size.size;
        bigCollection[1].innerHTML = "<img src=\"assets/images/weight.svg\"/>"+pizza.big_size.weight;
        
        let bigPriceDiv = templateNode.querySelectorAll(".pizza-price");

        if(!isThereSmall){
            bigPriceDiv[0].textContent = pizza.big_size.price;
        } else {
            bigPriceDiv[1].textContent = pizza.big_size.price;
        }
    }

    return templateNode.cloneNode(true);
}

function applyFilter(button){
    let filterButtonsArray = button.parentElement.querySelectorAll("button");
    filterButtonsArray.forEach(curButton => curButton.dataset.status = "");

    button.dataset.status = "selected";
    let filter = button.dataset.filter;

    loadPizzaCards(filter);
}

function loadPizzaCards(filter){
    pizzaListNode.innerHTML = "";
    if(filter == "all"){
        document.querySelector("h1").querySelector(".pizza-amount").textContent = pizzaArray.length;
        for (let pizzaObject of pizzaArray){
            let cardNode = createPizzaCard(pizzaObject);
            pizzaListNode.appendChild(cardNode);
        }
    } else if(filter == "vegan"){
        let filteredPizzaArray = pizzaArray.filter(pizzaObject => !("meat" in pizzaObject.content) && !("ocean" in pizzaObject.content));
        document.querySelector("h1").querySelector(".pizza-amount").textContent = filteredPizzaArray.length;
        for (let pizzaObject of filteredPizzaArray){
            let cardNode = createPizzaCard(pizzaObject);
            pizzaListNode.appendChild(cardNode);
        }
    } else {
        let filteredPizzaArray = pizzaArray.filter(pizzaObject => filter in pizzaObject.content);
        document.querySelector("h1").querySelector(".pizza-amount").textContent = filteredPizzaArray.length;
        for (let pizzaObject of filteredPizzaArray){
            let cardNode = createPizzaCard(pizzaObject);
            pizzaListNode.appendChild(cardNode);
        }
    }
}

function hideCart(){
    let asideNode = document.querySelector("aside");
    let status = asideNode.dataset.status;
    let button = document.querySelector("#hide-cart");

    if(status == "open"){
        asideNode.style.transform = "translate(45vh)"; 
        asideNode.dataset.status = "closed";
        button.style.transform = "rotate(180deg)";
    } else {
        asideNode.style.transform = "translate(0)"; 
        asideNode.dataset.status = "open";
        button.style.transform = "rotate(0deg)";
    }
}