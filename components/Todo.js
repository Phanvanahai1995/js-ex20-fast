import { Header } from "./Header.js";
import { TodoForm } from "./TodoForm.js";

const Todo = `
        <div class="todo flex min-h-screen items-center bg-gray-50">
          <div class="mx-auto w-full max-w-3xl px-4 py-6">
            ${Header}
            ${TodoForm}
            <div class="todo_item-inner py-3">
            </div>
            <div class="btn-inner_complete"></div>
            <div class="todo_item-success py-3 hide">
            </div>
          </div>
        </div>
`;

export default Todo;
