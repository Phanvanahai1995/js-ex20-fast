import { ModalHtml, ModalItem } from "./components/Modal.js";
import Todo from "./components/Todo.js";
import { arrowDown, arrowRight } from "./ui/arrow.js";

const root = document.querySelector("#root");

const SERVER_API = `https://fs2vym-8080.csb.app/todos`;
const SEVER_API_SELECTED = `https://fs2vym-8080.csb.app/finished`;

root.insertAdjacentHTML("afterbegin", Todo);

const todo = root.querySelector(".todo");
const searchEl = root.querySelector("input[type='search']");
const todoItemInner = root.querySelector(".todo_item-inner");
const todoItemInnerSelected = root.querySelector(".todo_item-success");
const btnInnerComplete = root.querySelector(".btn-inner_complete");
const btn = root.querySelector(".btn");
let isActiveBtn = false;

const query = {};

// const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
// const allTextNodes = [];
// let currentNode = treeWalker.nextNode();

// while (currentNode) {
//   allTextNodes.push(currentNode);
//   currentNode = treeWalker.nextNode();
// }

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
  query.q = keyword;

  getTodoItem(SERVER_API, todoItemInner);
  getTodoItem(SEVER_API_SELECTED, todoItemInnerSelected, true);

  if (keyword.trim()) {
    btnInnerComplete.innerHTML = ``;
    todoItemInnerSelected.classList.remove("hide");
  } else {
    isActiveBtn = false;
    renderBtnCompleted();
    todoItemInnerSelected.classList.add("hide");
  }
});

searchEl.addEventListener("input", (e) => {
  handleSearch(e);

  // CSS.highlights.clear();

  // const str = e.target.value.trim().toLowerCase();
  // if (!str) {
  //   return;
  // }

  // const ranges = allTextNodes
  //   .map((el) => {
  //     return { el, text: el.textContent.toLowerCase() };
  //   })
  //   .map(({ text, el }) => {
  //     const indices = [];
  //     let startPos = 0;
  //     while (startPos < text.length) {
  //       const index = text.indexOf(str, startPos);
  //       if (index === -1) break;
  //       indices.push(index);
  //       startPos = index + str.length;
  //     }

  //     return indices.map((index) => {
  //       const range = new Range();
  //       range.setStart(el, index);
  //       range.setEnd(el, index + str.length);
  //       return range;
  //     });
  //   });

  // const searchResultsHighlight = new Highlight(...ranges.flat());

  // CSS.highlights.set("search-results", searchResultsHighlight);
});

async function renderBtnCompleted() {
  try {
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
  } catch (err) {
    console.error(err);
  }
}

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
    const queryString = Object.keys(query)
      ? `?${new URLSearchParams(query).toString()}`
      : "";

    const res = await fetch(api + queryString);

    if (!res.ok) throw new Error("Something went wrong");

    const data = await res.json();

    let html = data
      .map(
        (
          item
        ) => `<div class="mt-2.5 flex w-full items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow">
    <span class="font-normal text-gray-700">${(item.title =
      item.title.startsWith("<") && item.title.endsWith(">")
        ? item.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        : item.title)}</span>
    <div class="flex gap-2">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-700 hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
      >
       <i data-id=${
         item.id
       } class="btn-delete fa-regular fa-trash-can flex items-center justify-center"></i>
      </button>
      <button
      
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
      <i  data-id=${
        item.id
      } class="btn-repair fa-solid fa-pen-to-square flex items-center justify-center"></i>
      </button>
      <button
        type="button"
        class="btn-success ${
          active ? `bg-emerald-700` : `bg-gray-400`
        } flex h-10 w-10 items-center justify-center rounded-lg hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
      <i  data-id=${
        item.id
      }  class="btn-success fa-regular fa-square-check flex items-center justify-center"></i>
       
      </button>
    </div>
  </div>`
      )
      .join("");

    element.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
}

getTodoItem(SERVER_API, todoItemInner);
getTodoItem(SEVER_API_SELECTED, todoItemInnerSelected, true);
renderBtnCompleted();

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
    const id = e.target.dataset.id;
    sendRequestDeleteData(id, todoItemInner, SERVER_API);
  }

  if (e.target.classList.contains("btn-repair")) {
    todo.insertAdjacentHTML("beforebegin", ModalItem);
    const id = e.target.dataset.id;

    const modalItem = root.querySelector(".modal-item");

    const input = modalItem?.querySelector("input[type='text']");
    const btnSave = modalItem?.querySelector(".save-btn_item");

    btnSave?.addEventListener("click", function (e) {
      const title = { id: id, title: input.value };

      sendRequestPatchData(id, title, todoItemInner, SERVER_API);
      modalItem.remove();
    });
  }

  if (e.target.classList.contains("btn-success")) {
    const title = e.target.parentElement.parentElement.parentElement.innerText;
    const id = e.target.dataset.id;

    sendRequestData(title, SEVER_API_SELECTED, todoItemInnerSelected, true);
    sendRequestDeleteData(id, todoItemInner, SERVER_API);
    renderBtnCompleted();
  }
});

todoItemInnerSelected.addEventListener("click", function (e) {
  e.stopPropagation();
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;
    sendRequestDeleteData(id, todoItemInnerSelected, SEVER_API_SELECTED);
  }

  if (e.target.classList.contains("btn-repair")) {
    todo.insertAdjacentHTML("beforebegin", ModalItem);
    const id = e.target.dataset.id;

    const modalItem = root.querySelector(".modal-item");

    const input = modalItem?.querySelector("input[type='text']");
    const btnSave = modalItem?.querySelector(".save-btn_item");

    btnSave?.addEventListener("click", function (e) {
      const title = { title: input.value };

      sendRequestPatchData(
        id,
        title,
        todoItemInnerSelected,
        SEVER_API_SELECTED,
        true
      );
      modalItem.remove();
    });
  }

  if (e.target.classList.contains("btn-success")) {
    const title = e.target.parentElement.parentElement.parentElement.innerText;
    const id = e.target.dataset.id;

    sendRequestData(title, SERVER_API, todoItemInner);
    sendRequestDeleteData(id, todoItemInnerSelected, SEVER_API_SELECTED, true);
    renderBtnCompleted();
  }
});

async function sendRequestData(title, api, element, active) {
  try {
    const newData = { title: title };
    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!res.ok) throw new Error("Send data found!");

    getTodoItem(api, element, active);
    renderBtnCompleted();
  } catch (err) {
    console.error(err);
  }
}

async function sendRequestDeleteData(id, element, API, active) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete data not found!");

    getTodoItem(API, element, active);
    renderBtnCompleted();
  } catch (err) {
    console.error(err);
  }
}

async function sendRequestPatchData(id, title, element, API, active) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(title),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Send data not found!");

    getTodoItem(API, element, active);
    renderBtnCompleted();
  } catch (err) {
    console.error(err);
  }
}
