// Write JS code to dynamically add order form fields
let totalAmount = 0;
let mainCourseCount = 0;
const orderItems = [];

function addOrder() {
  const orderTableBody = document.getElementById("orderTableBody");
  const totalOutput = document.querySelector("output");

  const row = document.createElement("tr");

  // Category Name
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Category Name";
  const categoryCell = document.createElement("td");
  categoryCell.appendChild(categoryInput);
  row.appendChild(categoryCell);

  // Item Name
  const itemInput = document.createElement("input");
  itemInput.type = "text";
  itemInput.placeholder = "Item Name";
  const itemCell = document.createElement("td");
  itemCell.appendChild(itemInput);
  row.appendChild(itemCell);

  // Price
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.value = 0;
  priceInput.min = 0;
  const priceCell = document.createElement("td");
  priceCell.appendChild(priceInput);
  row.appendChild(priceCell);

  // Quantity
  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.value = 0;
  qtyInput.min = 0;
  const qtyCell = document.createElement("td");
  qtyCell.appendChild(qtyInput);
  row.appendChild(qtyCell);

  // Subtotal
  const subTotalCell = document.createElement("td");
  const subTotalSpan = document.createElement("span");
  subTotalSpan.textContent = "0.00";
  subTotalCell.appendChild(subTotalSpan);
  row.appendChild(subTotalCell);

  // Add Button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add";
  addBtn.classList.add("btn", "btn-success", "btn-sm");
  const addBtnCell = document.createElement("td");
  addBtnCell.appendChild(addBtn);
  row.appendChild(addBtnCell);

  orderTableBody.appendChild(row);

  // Calculate Subtotal
  function updateSubtotal() {
    const price = parseFloat(priceInput.value) || 0;
    const qty = parseInt(qtyInput.value) || 0;
    const subtotal = price * qty;
    subTotalSpan.textContent = subtotal.toFixed(2);
  }

  priceInput.addEventListener("input", updateSubtotal);
  qtyInput.addEventListener("input", updateSubtotal);

  // Handle Add button
  addBtn.onclick = function () {
    const subtotal = parseFloat(subTotalSpan.textContent);
    totalAmount += subtotal;
    totalOutput.textContent = totalAmount.toFixed(2);

    if (categoryInput.value.toLowerCase().includes("main course")) {
      mainCourseCount += parseInt(qtyInput.value) || 0;
    }

    // Make fields read-only
    [categoryInput, itemInput, priceInput, qtyInput].forEach(
      (input) => (input.readOnly = true)
    );

    // Disable the button
    addBtn.disabled = true;
  };
}

// Write JS function to submit and persist the order details using Axios API
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      document.querySelectorAll("#orderTableBody tr").forEach((row) => {
        const cells = row.querySelectorAll("td");

        const category = cells[0].querySelector("input").value;
        const item = cells[1].querySelector("input").value;
        const price = parseFloat(cells[2].querySelector("input").value) || 0;
        const qty = parseInt(cells[3].querySelector("input").value) || 0;

        if (item && qty > 0) {
          orderItems.push({ category, item, price, qty });
        }
      });

      if (mainCourseCount >= 2) {
        orderItems.push({
          category: "Beverage",
          item: "Soft Drink (Free)",
          price: 0,
          qty: 1,
        });
      }

      const order = {
        orderId: document.getElementById("order-id").value,
        customerName: document.getElementById("customer-name").value,
        email: document.getElementById("email-id").value,
        contactNumber: document.getElementById("contact-number").value,
        orderDate: document.getElementById("order-date").value,
        address: document.getElementById("order-address").value,
        totalAmount: totalAmount.toFixed(2),
        orderItems: orderItems,
      };

      axios
        .post("http://localhost:3001/order", order)
        .then(() => {
          if (mainCourseCount >= 2) {
            alert(
              `Total amount to be paid: INR ${order.totalAmount}\nThe order is eligible for a free soft drink!`
            );
          } else {
            `Total amount to be paid: INR ${order.totalAmount}`;
          }
        })
        .catch((err) => {
          console.error("Error saving order: ", err);
        });
    });
  } else {
    console.error("Form element not found!");
  }
});
