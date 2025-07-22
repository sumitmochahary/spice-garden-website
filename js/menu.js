// Write code for fetching menu details using Axios API
const menuTableBody = document.getElementById("menuTableBody");
const categoryFilter = document.getElementById("categoryFilter");

let fullMenuList = [];

window.addEventListener("DOMContentLoaded",()=>{
    axios
    .get("http://localhost:3000/menu")
    .then((response)=>{
        fullMenuList = response.data;
        renderMenu(fullMenuList);
    })
    .catch((err)=> console.error("Failed to load menu from JSON:",err))
});

function addMenuToTable(itemName,price){
    const row = document.createElement("tr");

    const itemCell = document.createElement("td");
    itemCell.textContent = itemName;

    const priceCell = document.createElement("td");
    priceCell.textContent = price;

    row.appendChild(itemCell);
    row.appendChild(priceCell);
    menuTableBody.appendChild(row);
}

function renderMenu(menuList){
    menuTableBody.innerHTML = "";
    menuList.forEach(menu=>addMenuToTable(menu.itemName, menu.price));
}

categoryFilter.addEventListener("change", function(){
    const selectedCategory = this.value;
    const filteredMenu = selectedCategory === "All" ? fullMenuList : fullMenuList.filter(menu=>menu.category === selectedCategory);
    renderMenu(filteredMenu);
})