import { jsx, jsxs } from "https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/jsx-runtime.js";
import { mount } from "https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/index.js";
import { useState } from "https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/hooks.js";
import { Btn } from "https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/ui/btn.js";
import { Field } from "https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/ui/field.js";
import { Text } from "https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/ui/text.js";
function Login({ onSubmit, pending, error }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return /* @__PURE__ */ jsxs(
    "form",
    {
      class: "strike-stack login",
      style: { gap: 12 },
      onSubmit: (e) => {
        e.preventDefault();
        onSubmit({ email, pw });
      },
      children: [
        /* @__PURE__ */ jsx(Text, { as: "h1", tone: "title", children: "Sign in" }),
        /* @__PURE__ */ jsx(
          Field,
          {
            label: "Email",
            value: email,
            onInput: (e) => setEmail(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Field,
          {
            label: "Password",
            type: "password",
            value: pw,
            onInput: (e) => setPw(e.target.value)
          }
        ),
        error && /* @__PURE__ */ jsx(Text, { tone: "danger", class: "strike-err", children: error }),
        /* @__PURE__ */ jsx(Btn, { type: "submit", state: pending ? "busy" : "rest", disabled: pending, children: "Sign in" })
      ]
    }
  );
}
function App() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return /* @__PURE__ */ jsx(
    Login,
    {
      pending,
      error,
      onSubmit: ({ email, pw }) => {
        setError("");
        setPending(true);
        setTimeout(() => {
          setPending(false);
          if (!email || !pw) setError("Email and password required");
          else setError("");
        }, 400);
      }
    }
  );
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  mount("#app", App);
}
export {
  Login
};
