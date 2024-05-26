export const TodoForm = `
<div class="todo-form pt-5">
<div class="flex items-center gap-3">
  <div class="relative w-full">
    <input
      type="search"
      class="w-full bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      placeholder="Search Todos"
      value=""
    />
    <button
      type="button"
      class="search absolute bottom-2 right-2 top-2 rounded-lg bg-blue-700 px-4 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      <svg
        class="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          class="fill-white"
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        ></path>
      </svg>
    </button>
  </div>
  <button
    type="button"
    class="btn rounded-lg bg-emerald-700 px-4 py-2.5 font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
  >
    Add&nbsp;Todos
  </button>
</div>
</div>
`;
