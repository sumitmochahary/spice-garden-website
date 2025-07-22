// Write JS function to reserve a table, persist the data using Axios API
async function reserve(event) {
  event.preventDefault();

  const username = document.getElementById("userName").value;
  const useremail = document.getElementById("userEmail").value;
  const phone = document.getElementById("userPhone").value;
  const date = document.getElementById("inputDate").value;
  const time = document.getElementById("inputTime").value;
  const persons = document.getElementById("numPersons").value;

  const reservationData = {
    username,
    useremail,
    phone,
    date,
    time,
    persons,
  };

  try {
    await axios.post("http://localhost:3002/reservations", reservationData);
    alert("You have successfully booked a table");
  } catch (error) {
    alert("Error reserving data");
  }
}
