function PhotoGallery() {}
PhotoGallery.prototype.getData = () => {
  const album = new Promise((resolve, reject) => {
    fetch("http://localhost:3000/photos").then((data) => {
      resolve(data.json());
    });
  });

  return album;
};

const data = new PhotoGallery().getData();
const photo_box = document.getElementById("photo_box");
const pagination_element = document.getElementById("pagination");

let current_page = 1;
let rows = 7;

function DisplayList(items, wrapper, rows_per_page, page) {
  wrapper.innerHTML = "";
  page--;
  let start = rows_per_page * page;
  let end = start + rows_per_page;
  items.then((data) => {
    const paginated_items = data.slice(start, end);

    paginated_items.map((res) => {
      document.getElementById(
        "photo_box"
      ).innerHTML += `<img id="img" src="${res.ThumbnailUrl}"  alt=${res.Url}>`;
      popupModal();
    });
  });

  const popupModal = function () {
    const photo_box = document.getElementById("photo_box").childNodes;

    photo_box.forEach((ele) => {
      ele.addEventListener("click", (e) => {
        document.getElementById(
          "parant"
        ).innerHTML += `<div class="popup_modal" id="popup_modal">
              <img
                class="image"
                src="${e.target.alt}"
                alt="img"
              />
              <i class="fas fa-times" id="cross"></i>
            </div>`;
        removeModal();
      });
    });
  };

  const removeModal = function () {
    document
      .getElementById("parant")
      .firstElementChild.childNodes[3].addEventListener("click", () => {
        document.getElementById("popup_modal").remove();
      });
  };
}

function setupPagination(items, wrapper, rows_per_page) {
  wrapper.innerHTML = "";
  items.then((items) => {
    let page_count = Math.ceil(items.length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
      let btn = paginationButton(i);

      wrapper.appendChild(btn);
    }
  });
}

function paginationButton(page) {
  const button = document.createElement("button");
  button.innerText = page;
  if (current_page == page) {
    button.classList.add("active");
  }
  button.addEventListener("click", () => {
    current_page = page;
    DisplayList(data, photo_box, rows, current_page);
    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");
    button.classList.add("active");
  });

  return button;
}

DisplayList(data, photo_box, rows, current_page);
setupPagination(data, pagination_element, rows);
