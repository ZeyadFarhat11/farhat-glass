const addBtn = document.querySelector("button.add");
const container = document.querySelector(".container");
const submitBtn = document.querySelector(".get-invoice");

function deleteRow(e) {
  e.target.parentElement.remove();
}

async function getInvoice(e) {
  const clientName = document.querySelector(".client-name").value;
  const rows = getRows();
  try {
    const res = await axios.post("/invoice", { rows, client: clientName });
    if (res.status === 200) {
      window.location = `/invoice/${res.data.filename}`;
    }
  } catch (err) {
    alert(err.message);
    console.log(err);
  }
}
submitBtn.addEventListener("click", getInvoice);

function getRows() {
  return [...document.querySelectorAll(".row")].map((row) => [
    row.querySelector('[name="title"]').value,
    row.querySelector('[name="qty"]').value,
    row.querySelector('[name="price"]').value,
    row.querySelector('[name="total"]').value,
  ]);
}

addBtn.addEventListener("click", (e) => {
  container.insertAdjacentHTML(
    "beforeend",
    `
  <div class="row">
    <span>
      <input type="text" placeholder="الصنف" name="title" list="titles"  />
    </span>
    <span><input type="text" placeholder="الكمية" name="qty" /></span>
    <span><input type="text" placeholder="السعر" name="price" /></span>
    <span><input type="text" placeholder="الاجمالي" name="total" /></span>
    <button type="button" class="delete">-</button>
  </div>`
  );
  document
    .querySelectorAll("button.delete")
    .forEach((e) => e.addEventListener("click", deleteRow));
});
document
  .querySelectorAll("button.delete")
  .forEach((e) => e.addEventListener("click", deleteRow));
