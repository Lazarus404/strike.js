import {h, mount} from "../../index.js";
import {useState} from "../../hooks.js";
import {Btn} from "../../ui/btn.js";
import {Field} from "../../ui/field.js";
import {Stack} from "../../ui/stack.js";
let nextId = 1;
function Todo() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const visible = items.filter((item) => {
    if (filter === "open")
      return !item.done;
    if (filter === "done")
      return item.done;
    return true;
  });
  function add(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value)
      return;
    setItems((list) => [...list, {id: nextId++, text: value, done: false}]);
    setText("");
  }
  return /* @__PURE__ */ h(Stack, {
    class: "todo"
  }, /* @__PURE__ */ h("h1", null, "Strike Todo"), /* @__PURE__ */ h("form", {
    class: "todo-add",
    onSubmit: add
  }, /* @__PURE__ */ h(Stack, {
    row: true,
    gap: "0.5rem"
  }, /* @__PURE__ */ h(Field, {
    label: "New item",
    value: text,
    onInput: (e) => setText(e.target.value),
    placeholder: "What needs doing?"
  }), /* @__PURE__ */ h(Btn, {
    variant: "primary",
    type: "submit"
  }, "Add"))), /* @__PURE__ */ h(Stack, {
    row: true,
    gap: "0.5rem",
    class: "todo-filters"
  }, ["all", "open", "done"].map((f) => /* @__PURE__ */ h(Btn, {
    key: f,
    variant: filter === f ? "primary" : "ghost",
    onClick: () => setFilter(f)
  }, f))), /* @__PURE__ */ h("ul", {
    class: "todo-list"
  }, visible.map((item) => /* @__PURE__ */ h("li", {
    key: item.id,
    class: item.done ? "done" : ""
  }, /* @__PURE__ */ h(Stack, {
    row: true,
    gap: "0.5rem"
  }, /* @__PURE__ */ h("input", {
    type: "checkbox",
    checked: item.done,
    onChange: () => setItems((list) => list.map((x) => x.id === item.id ? {...x, done: !x.done} : x))
  }), /* @__PURE__ */ h("span", null, item.text), /* @__PURE__ */ h(Btn, {
    variant: "ghost",
    onClick: () => setItems((list) => list.filter((x) => x.id !== item.id))
  }, "Remove"))))));
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  mount("#app", Todo);
}
export {
  Todo
};
