import {h, mount} from "../../index.js";
import {useState, useLayoutEffect} from "../../hooks.js";
import {Btn} from "../../ui/btn.js";
import {Field} from "../../ui/field.js";
import {Stack} from "../../ui/stack.js";
import {Text} from "../../ui/text.js";
const PAGES = [
  {path: "/", label: "Home"},
  {path: "/about", label: "About"},
  {path: "/work", label: "Work"},
  {path: "/contact", label: "Contact"}
];
function pathFromHash() {
  const raw = typeof location !== "undefined" && location.hash.slice(1) || "/";
  return raw.startsWith("/") ? raw : "/" + raw;
}
function useRoute() {
  const [path, setPath] = useState(pathFromHash);
  useLayoutEffect(() => {
    const onHash = () => setPath(pathFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return path;
}
function Nav({path}) {
  return /* @__PURE__ */ h("nav", {
    class: "site-nav",
    "aria-label": "Primary"
  }, /* @__PURE__ */ h(Stack, {
    row: true,
    gap: "1rem",
    class: "site-nav__row"
  }, /* @__PURE__ */ h("a", {
    href: "#/",
    class: "site-brand"
  }, "Northline"), PAGES.map((p) => /* @__PURE__ */ h("a", {
    key: p.path,
    href: "#" + p.path,
    class: path === p.path ? "is-active" : void 0,
    "aria-current": path === p.path ? "page" : void 0
  }, p.label))));
}
function Home() {
  return /* @__PURE__ */ h(Stack, {
    gap: 16,
    class: "site-page"
  }, /* @__PURE__ */ h(Text, {
    as: "h1",
    tone: "title"
  }, "Quiet tools for busy teams"), /* @__PURE__ */ h(Text, null, "Northline is a sample multi-page site built with Strike JSX. Hash routes swap pages without a full reload."), /* @__PURE__ */ h(Stack, {
    row: true,
    gap: 8
  }, /* @__PURE__ */ h(Btn, {
    onClick: () => location.hash = "#/work"
  }, "See work"), /* @__PURE__ */ h(Btn, {
    variant: "ghost",
    onClick: () => location.hash = "#/contact"
  }, "Contact")));
}
function About() {
  return /* @__PURE__ */ h(Stack, {
    gap: 16,
    class: "site-page"
  }, /* @__PURE__ */ h(Text, {
    as: "h1",
    tone: "title"
  }, "About"), /* @__PURE__ */ h(Text, null, "We keep the stack small: one VDOM, function components, and JSX that compiles to the same vnode tree as hand-written elements."), /* @__PURE__ */ h(Text, {
    tone: "muted"
  }, "This About view is a separate page in the same SPA shell."));
}
function Work() {
  const items = [
    {title: "Harbor desk", blurb: "Ops dashboard for a coastal logistics team."},
    {title: "Ledger light", blurb: "Invoice list with filters and offline drafts."},
    {title: "Studio board", blurb: "Project board for a three-person studio."}
  ];
  return /* @__PURE__ */ h(Stack, {
    gap: 16,
    class: "site-page"
  }, /* @__PURE__ */ h(Text, {
    as: "h1",
    tone: "title"
  }, "Work"), /* @__PURE__ */ h("ul", {
    class: "site-work"
  }, items.map((item) => /* @__PURE__ */ h("li", {
    key: item.title
  }, /* @__PURE__ */ h(Text, {
    as: "strong"
  }, item.title), /* @__PURE__ */ h(Text, {
    tone: "muted"
  }, item.blurb)))));
}
function Contact() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  function submit(e) {
    e.preventDefault();
    if (!name.trim())
      return;
    setSent(true);
  }
  return /* @__PURE__ */ h(Stack, {
    gap: 16,
    class: "site-page"
  }, /* @__PURE__ */ h(Text, {
    as: "h1",
    tone: "title"
  }, "Contact"), sent ? /* @__PURE__ */ h(Text, null, "Thanks, ", name, ". We will reply soon.") : /* @__PURE__ */ h("form", {
    class: "site-contact",
    onSubmit: submit
  }, /* @__PURE__ */ h(Stack, {
    gap: 12
  }, /* @__PURE__ */ h(Field, {
    label: "Name",
    value: name,
    onInput: (e) => setName(e.target.value)
  }), /* @__PURE__ */ h(Field, {
    label: "Note",
    value: note,
    onInput: (e) => setNote(e.target.value),
    placeholder: "What should we know?"
  }), /* @__PURE__ */ h(Btn, {
    type: "submit"
  }, "Send"))));
}
function Page({path}) {
  if (path === "/about")
    return /* @__PURE__ */ h(About, null);
  if (path === "/work")
    return /* @__PURE__ */ h(Work, null);
  if (path === "/contact")
    return /* @__PURE__ */ h(Contact, null);
  return /* @__PURE__ */ h(Home, null);
}
function Site() {
  const path = useRoute();
  return /* @__PURE__ */ h("div", {
    class: "site"
  }, /* @__PURE__ */ h(Nav, {
    path
  }), /* @__PURE__ */ h("main", {
    class: "site-main"
  }, /* @__PURE__ */ h(Page, {
    path
  })), /* @__PURE__ */ h("footer", {
    class: "site-foot"
  }, /* @__PURE__ */ h(Text, {
    tone: "muted",
    as: "span"
  }, "Northline sample \xB7 Strike JSX")));
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  if (!location.hash)
    location.hash = "#/";
  mount("#app", Site);
}
export {
  Site
};
