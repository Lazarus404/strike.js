import { jsx, jsxs } from "../../jsx-runtime.js";
import { mount } from "../../index.js";
import { useState } from "../../hooks.js";
import { Btn } from "../../ui/btn.js";
import { Field } from "../../ui/field.js";
import { Stack } from "../../ui/stack.js";
let nextId = 1;
function Todo() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const visible = items.filter((item) => {
    if (filter === "open") return !item.done;
    if (filter === "done") return item.done;
    return true;
  });
  function add(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setItems((list) => [...list, { id: nextId++, text: value, done: false }]);
    setText("");
  }
  return /* @__PURE__ */ jsxs(Stack, { class: "todo", children: [
    /* @__PURE__ */ jsx("h1", { children: "Strike Todo" }),
    /* @__PURE__ */ jsx("form", { class: "todo-add", onSubmit: add, children: /* @__PURE__ */ jsxs(Stack, { row: true, gap: "0.5rem", children: [
      /* @__PURE__ */ jsx(
        Field,
        {
          label: "New item",
          value: text,
          onInput: (e) => setText(e.target.value),
          placeholder: "What needs doing?"
        }
      ),
      /* @__PURE__ */ jsx(Btn, { variant: "primary", type: "submit", children: "Add" })
    ] }) }),
    /* @__PURE__ */ jsx(Stack, { row: true, gap: "0.5rem", class: "todo-filters", children: ["all", "open", "done"].map((f) => /* @__PURE__ */ jsx(
      Btn,
      {
        variant: filter === f ? "primary" : "ghost",
        onClick: () => setFilter(f),
        children: f
      },
      f
    )) }),
    /* @__PURE__ */ jsx("ul", { class: "todo-list", children: visible.map((item) => /* @__PURE__ */ jsx("li", { class: item.done ? "done" : "", children: /* @__PURE__ */ jsxs(Stack, { row: true, gap: "0.5rem", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: item.done,
          onChange: () => setItems(
            (list) => list.map(
              (x) => x.id === item.id ? { ...x, done: !x.done } : x
            )
          )
        }
      ),
      /* @__PURE__ */ jsx("span", { children: item.text }),
      /* @__PURE__ */ jsx(
        Btn,
        {
          variant: "ghost",
          onClick: () => setItems((list) => list.filter((x) => x.id !== item.id)),
          children: "Remove"
        }
      )
    ] }) }, item.id)) })
  ] });
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  mount("#app", Todo);
}
export {
  Todo
};
