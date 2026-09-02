import { jsx, jsxs } from "../../jsx-runtime.js";
import { mount } from "../../index.js";
import { useState, useLayoutEffect } from "../../hooks.js";
import { Btn } from "../../ui/btn.js";
import { Field } from "../../ui/field.js";
import { Stack } from "../../ui/stack.js";
import { Text } from "../../ui/text.js";
const PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/work", label: "Work" },
  { path: "/contact", label: "Contact" }
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
function Nav({ path }) {
  return /* @__PURE__ */ jsx("nav", { class: "site-nav", "aria-label": "Primary", children: /* @__PURE__ */ jsxs(Stack, { row: true, gap: "1rem", class: "site-nav__row", children: [
    /* @__PURE__ */ jsx("a", { href: "#/", class: "site-brand", children: "Northline" }),
    PAGES.map((p) => /* @__PURE__ */ jsx(
      "a",
      {
        href: "#" + p.path,
        class: path === p.path ? "is-active" : void 0,
        "aria-current": path === p.path ? "page" : void 0,
        children: p.label
      },
      p.path
    ))
  ] }) });
}
function Home() {
  return /* @__PURE__ */ jsxs(Stack, { gap: 16, class: "site-page", children: [
    /* @__PURE__ */ jsx(Text, { as: "h1", tone: "title", children: "Quiet tools for busy teams" }),
    /* @__PURE__ */ jsx(Text, { children: "Northline is a sample multi-page site built with Strike JSX. Hash routes swap pages without a full reload." }),
    /* @__PURE__ */ jsxs(Stack, { row: true, gap: 8, children: [
      /* @__PURE__ */ jsx(Btn, { onClick: () => location.hash = "#/work", children: "See work" }),
      /* @__PURE__ */ jsx(Btn, { variant: "ghost", onClick: () => location.hash = "#/contact", children: "Contact" })
    ] })
  ] });
}
function About() {
  return /* @__PURE__ */ jsxs(Stack, { gap: 16, class: "site-page", children: [
    /* @__PURE__ */ jsx(Text, { as: "h1", tone: "title", children: "About" }),
    /* @__PURE__ */ jsx(Text, { children: "We keep the stack small: one VDOM, function components, and JSX that compiles to the same vnode tree as hand-written elements." }),
    /* @__PURE__ */ jsx(Text, { tone: "muted", children: "This About view is a separate page in the same SPA shell." })
  ] });
}
function Work() {
  const items = [
    { title: "Harbor desk", blurb: "Ops dashboard for a coastal logistics team." },
    { title: "Ledger light", blurb: "Invoice list with filters and offline drafts." },
    { title: "Studio board", blurb: "Project board for a three-person studio." }
  ];
  return /* @__PURE__ */ jsxs(Stack, { gap: 16, class: "site-page", children: [
    /* @__PURE__ */ jsx(Text, { as: "h1", tone: "title", children: "Work" }),
    /* @__PURE__ */ jsx("ul", { class: "site-work", children: items.map((item) => /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx(Text, { as: "strong", children: item.title }),
      /* @__PURE__ */ jsx(Text, { tone: "muted", children: item.blurb })
    ] }, item.title)) })
  ] });
}
function Contact() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSent(true);
  }
  return /* @__PURE__ */ jsxs(Stack, { gap: 16, class: "site-page", children: [
    /* @__PURE__ */ jsx(Text, { as: "h1", tone: "title", children: "Contact" }),
    sent ? /* @__PURE__ */ jsxs(Text, { children: [
      "Thanks, ",
      name,
      ". We will reply soon."
    ] }) : /* @__PURE__ */ jsx("form", { class: "site-contact", onSubmit: submit, children: /* @__PURE__ */ jsxs(Stack, { gap: 12, children: [
      /* @__PURE__ */ jsx(
        Field,
        {
          label: "Name",
          value: name,
          onInput: (e) => setName(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(
        Field,
        {
          label: "Note",
          value: note,
          onInput: (e) => setNote(e.target.value),
          placeholder: "What should we know?"
        }
      ),
      /* @__PURE__ */ jsx(Btn, { type: "submit", children: "Send" })
    ] }) })
  ] });
}
function Page({ path }) {
  if (path === "/about") return /* @__PURE__ */ jsx(About, {});
  if (path === "/work") return /* @__PURE__ */ jsx(Work, {});
  if (path === "/contact") return /* @__PURE__ */ jsx(Contact, {});
  return /* @__PURE__ */ jsx(Home, {});
}
function Site() {
  const path = useRoute();
  return /* @__PURE__ */ jsxs("div", { class: "site", children: [
    /* @__PURE__ */ jsx(Nav, { path }),
    /* @__PURE__ */ jsx("main", { class: "site-main", children: /* @__PURE__ */ jsx(Page, { path }) }),
    /* @__PURE__ */ jsx("footer", { class: "site-foot", children: /* @__PURE__ */ jsx(Text, { tone: "muted", as: "span", children: "Northline sample \xB7 Strike JSX" }) })
  ] });
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  if (!location.hash) location.hash = "#/";
  mount("#app", Site);
}
export {
  Site
};
