fetch("./desserts.json")
  .then((response) => response.json())
  .then((desserts) => {
    const dessertList = document.getElementById("dessert-list");

    desserts.forEach((dessert) => {
      const div = document.createElement("div");
      div.classList.add("dessert-card");

      div.innerHTML = `

        <img src="${dessert.image.thumbnail}" alt="${dessert.name}" />
        <h3>${dessert.name}</h3>
        <p class="category">${dessert.category}</p>
        <p class="price">$${dessert.price.toFixed(2)}</p>
        <button class="add-to-cart">🛒 Add to Cart</button>
      `;
      dessertList.appendChild(div);
    });
  })
  .catch((error) => {
    console.error("Failed to load desserts.json:", error);
  });
