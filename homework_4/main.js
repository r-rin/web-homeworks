var pizzaArray = [
    {
        id:1,
        icon:'assets/images/pizza_7.jpg',
        title: "Імпреза",
        type: 'М’ясна піца',
        content: {
            meat: ['балик', 'салямі'],
            chicken: ['куриця'],
            cheese: ['сир моцарелла', 'сир рокфорд'],
            pineapple: ['ананаси'],
            additional: ['томатна паста', 'петрушка']
        },
        small_size:{
            weight: 370,
            size: 30,
            price: 99
        },
        big_size:{
            weight: 660,
            size: 40,
            price: 169
        },
        is_new:true,
        is_popular:true

    },
    {
        id:2,
        icon:'assets/images/pizza_2.jpg',
        title: "BBQ",
        type: 'М’ясна піца',
        content: {
            meat: ['мисливські ковбаски', 'ковбаски папероні', 'шинка'],
            cheese: ['сир домашній'],
            mushroom: ['шампінйони'],
            additional: ['петрушка', 'оливки']
        },
        small_size:{
            weight: 460,
            size: 30,
            price: 139
        },
        big_size:{
            weight: 840,
            size: 40,
            price: 199
        },
        is_popular:true
    },
    {
        id:3,
        icon:'assets/images/pizza_1.jpg',
        title: "Міксовий поло",
        type: 'М’ясна піца',
        content: {
            meat: ['вітчина', 'куриця копчена'],
            cheese: ['сир моцарелла'],
            pineapple: ['ананаси'],
            additional: ['кукурудза', 'петрушка', 'соус томатний']
        },
        small_size:{
            weight: 430,
            size: 30,
            price: 115
        },
        big_size:{
            weight: 780,
            size: 40,
            price: 179
        }
    },
    {
        id:4,
        icon:'assets/images/pizza_5.jpg',
        title: "Сициліано",
        type: 'М’ясна піца',
        content: {
            meat: ['вітчина', 'салямі'],
            cheese: ['сир моцарелла'],
            mushroom: ['шампінйони'],
            additional: ['перець болгарський',  'соус томатний']
        },
        small_size:{
            weight: 450,
            size: 30,
            price: 111
        },
        big_size:{
            weight: 790,
            size: 40,
            price: 169
        }
    },
    {
        id:17,
        icon:'assets/images/pizza_3.jpg',
        title: "Маргарита",
        type: 'Вега піца',
        content: {
            cheese: ['сир моцарелла', 'сир домашній'],
            tomato: ['помідори'],
            additional: ['базилік', 'оливкова олія', 'соус томатний']
        },
        small_size:{
            weight: 370,
            size: 30,
            price: 89
        }
    },
    {
        id:43,
        icon:'assets/images/pizza_6.jpg',
        title: "Мікс смаків",
        type: 'М’ясна піца',
        content: {
            meat: ['ковбаски'],
            cheese: ['сир моцарелла'],
            mushroom: ['шампінйони'],
            pineapple: ['ананаси'],
            additional: ['цибуля кримська', 'огірки квашені', 'соус гірчичний']
        },
        small_size:{
            weight: 470,
            size: 30,
            price: 115
        },
        big_size:{
            weight: 780,
            size: 40,
            price: 180
        }
    },
    {
        id:90,
        icon:'assets/images/pizza_8.jpg',
        title: "Дольче Маре",
        type: 'Морська піца',
        content: {
            ocean: ['криветки тигрові', 'мідії', 'ікра червона', 'філе червоної риби'],
            cheese: ['сир моцарелла'],
            additional: ['оливкова олія', 'вершки']
        },
        big_size:{
            weight: 845,
            size: 40,
            price: 399
        }
    },
    {
        id:6,
        icon:'assets/images/pizza_4.jpg',
        title: "Россо Густо",
        type: 'Морська піца',
        content: {
            ocean: ['ікра червона', 'лосось копчений'],
            cheese: ['сир моцарелла'],
            additional: ['оливкова олія', 'вершки']
        },
        small_size:{
            weight: 400,
            size: 30,
            price: 189
        },
        big_size:{
            weight: 700,
            size: 40,
            price: 299
        }
    }
];

var pizzaListNode = document.querySelector("#pizza-list");
var pizzaCardTemplate = document.querySelector("#pizza-card-template");

window.onload = () => {

    document.querySelector("h1").querySelector(".pizza-amount").textContent = pizzaArray.length;

    for (let pizzaObject of pizzaArray){
        let cardNode = createPizzaCard(pizzaObject);
        pizzaListNode.appendChild(cardNode);
    }
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