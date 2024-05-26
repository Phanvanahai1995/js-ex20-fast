import { ModalHtml, ModalItem } from "./components/Modal.js";
import Todo from "./components/Todo.js";
import { arrowDown, arrowRight } from "./ui/arrow.js";

const root = document.querySelector("#root");

const SERVER_API = `https://todo-3dd5f-default-rtdb.firebaseio.com/todos.json`;
const SEVER_API_SELECTED = `https://todo-3dd5f-default-rtdb.firebaseio.com/finished.json`;

root.insertAdjacentHTML("afterbegin", Todo);

const todo = root.querySelector(".todo");
const searchEl = root.querySelector("input[type='search']");
const todoItemInner = root.querySelector(".todo_item-inner");
const todoItemInnerSelected = root.querySelector(".todo_item-success");
const btnInnerComplete = root.querySelector(".btn-inner_complete");
const btn = root.querySelector(".btn");
let isActiveBtn = false;

const query = {};

const debounce = (func, timeout = 300) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

const handleSearch = debounce((e) => {
  const keyword = e.target.value ? e.target.value.trim() : "";

  getTodoItem(SERVER_API, todoItemInner);
});

searchEl.addEventListener("input", handleSearch);

async function renderBtnCompleted() {
  const res = await fetch(SEVER_API_SELECTED);

  if (!res.ok) throw new Error("Something went wrong");

  const data = await res.json();

  const BtnHtml = `
      <button type="button" class="${
        isActiveBtn ? `bg-emerald-700` : `bg-gray-400`
      } hover:bg-gray-500 focus:ring-gray-100 mt-2.5 flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all focus:outline-none focus:ring-4 btn-complete">
        <span class="font-medium text-white span-element">Completed Todos ${
          Object.keys(data).length
        }</span>${isActiveBtn ? arrowDown : arrowRight}
      </button>
  `;

  btnInnerComplete.innerHTML = BtnHtml;
}

renderBtnCompleted();

btnInnerComplete.addEventListener("click", function (e) {
  e.stopPropagation();

  if (
    e.target.classList.contains("btn-complete") ||
    e.target.classList.contains("span-element")
  ) {
    isActiveBtn = !isActiveBtn;
    renderBtnCompleted();

    isActiveBtn
      ? todoItemInnerSelected.classList.remove("hide")
      : todoItemInnerSelected.classList.add("hide");
  }
});

async function getTodoItem(api, element, active) {
  try {
    const res = await fetch(api);

    if (!res.ok) throw new Error("Something went wrong");

    const data = await res.json();

    const keys = Object.keys(data);

    let html = "";
    for (const key of keys) {
      html += `<div class="mt-2.5 flex w-full items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow">
     <span class="font-normal text-gray-700">${data[key].title}</span>
     <div class="flex gap-2">
       <button
         type="button"
         class="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-700 hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
       >
        <i data-key=${key} class="btn-delete fa-regular fa-trash-can flex items-center justify-center"></i>
       </button>
       <button
       
         type="button"
         class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
       >
       <i data-key=${key} data-id=${
        data[key].id
      } class="btn-repair fa-solid fa-pen-to-square flex items-center justify-center"></i>
       </button>
       <button
         type="button"
         class="btn-success ${
           active ? `bg-emerald-700` : `bg-gray-400`
         } flex h-10 w-10 items-center justify-center rounded-lg hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
       >
       <i data-title=${data[key].title} data-key=${key} data-id=${
        data[key].id
      } class="btn-success fa-regular fa-square-check flex items-center justify-center"></i>
        
       </button>
     </div>
   </div>`;
    }

    element.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
}

getTodoItem(SERVER_API, todoItemInner);
getTodoItem(SEVER_API_SELECTED, todoItemInnerSelected, true);

btn.addEventListener("click", function () {
  todo.insertAdjacentHTML("beforebegin", ModalHtml);
});

root.addEventListener("click", function (e) {
  const modal = root.querySelector(".modal");

  if (modal) {
    if (e.target.classList.contains("save-btn")) {
      const input = modal.querySelector("input[type='text']");
      if (!input.value.trim()) {
        alert("Vui lòng nhập dữ liệu");
        return;
      }

      sendRequestData(input.value, SERVER_API, todoItemInner);
      modal.remove();
    }

    if (e.target.classList.contains("cancel-btn")) {
      modal.remove();
    }
  }

  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.key;
    sendRequestDeleteData(
      id,
      "https://todo-3dd5f-default-rtdb.firebaseio.com/todos",
      todoItemInner,
      SERVER_API
    );
  }

  if (e.target.classList.contains("btn-repair")) {
    todo.insertAdjacentHTML("beforebegin", ModalItem);
    const id = +e.target.dataset.id;
    const key = e.target.dataset.key;

    const modalItem = root.querySelector(".modal-item");

    const input = modalItem?.querySelector("input[type='text']");
    const btnSave = modalItem?.querySelector(".save-btn_item");

    btnSave?.addEventListener("click", function (e) {
      const title = { id: id, title: input.value };

      sendRequestPatchData(
        key,
        title,
        "https://todo-3dd5f-default-rtdb.firebaseio.com/todos",
        todoItemInner,
        SERVER_API
      );
      modalItem.remove();
    });
  }

  if (e.target.classList.contains("btn-success")) {
    const title = e.target.parentElement.parentElement.parentElement.innerText;
    const key = e.target.dataset.key;

    sendRequestData(title, SEVER_API_SELECTED, todoItemInnerSelected, true);
    sendRequestDeleteData(
      key,
      "https://todo-3dd5f-default-rtdb.firebaseio.com/todos",
      todoItemInner,
      SERVER_API
    );
    renderBtnCompleted();
  }
});

todoItemInnerSelected.addEventListener("click", function (e) {
  e.stopPropagation();
  if (e.target.classList.contains("btn-delete")) {
    const key = e.target.dataset.key;
    sendRequestDeleteData(
      key,
      "https://todo-3dd5f-default-rtdb.firebaseio.com/finished",
      todoItemInnerSelected,
      SEVER_API_SELECTED
    );
  }

  if (e.target.classList.contains("btn-repair")) {
    todo.insertAdjacentHTML("beforebegin", ModalItem);
    const id = +e.target.dataset.id;
    const key = e.target.dataset.key;

    const modalItem = root.querySelector(".modal-item");

    const input = modalItem?.querySelector("input[type='text']");
    const btnSave = modalItem?.querySelector(".save-btn_item");

    btnSave?.addEventListener("click", function (e) {
      const title = { id: id, title: input.value };

      sendRequestPatchData(
        key,
        title,
        "https://todo-3dd5f-default-rtdb.firebaseio.com/finished",
        todoItemInnerSelected,
        SEVER_API_SELECTED,
        true
      );
      modalItem.remove();
    });
  }

  if (e.target.classList.contains("btn-success")) {
    const title = e.target.parentElement.parentElement.parentElement.innerText;
    const key = e.target.dataset.key;

    sendRequestData(title, SERVER_API, todoItemInner);
    sendRequestDeleteData(
      key,
      "https://todo-3dd5f-default-rtdb.firebaseio.com/finished",
      todoItemInnerSelected,
      SEVER_API_SELECTED,
      true
    );
  }
});

async function sendRequestData(title, api, element, active) {
  const newData = { id: Math.round(Math.random() * 1000 + 1), title: title };
  const res = await fetch(`${api}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });

  if (!res.ok) throw new Error("Send data found!");

  getTodoItem(api, element, active);
  renderBtnCompleted();
}

async function sendRequestDeleteData(id, api, element, API, active) {
  const res = await fetch(`${api}/${id}.json`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Send data found!");

  getTodoItem(API, element, active);
  renderBtnCompleted();
}

async function sendRequestPatchData(id, title, api, element, API, active) {
  const res = await fetch(`${api}/${id}.json?print=pretty`, {
    method: "PATCH",
    body: JSON.stringify(title),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Send data found!");

  getTodoItem(API, element, active);
  renderBtnCompleted();
}
