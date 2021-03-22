import {h, mount} from "../../index.js";
import {useState} from "../../hooks.js";
import {Btn} from "../../ui/btn.js";
import {Field} from "../../ui/field.js";
import {Text} from "../../ui/text.js";
function Login({onSubmit, pending, error}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return /* @__PURE__ */ h("form", {
    class: "strike-stack login",
    style: {gap: 12},
    onSubmit: (e) => {
      e.preventDefault();
      onSubmit({email, pw});
    }
  }, /* @__PURE__ */ h(Text, {
    as: "h1",
    tone: "title"
  }, "Sign in"), /* @__PURE__ */ h(Field, {
    label: "Email",
    value: email,
    onInput: (e) => setEmail(e.target.value)
  }), /* @__PURE__ */ h(Field, {
    label: "Password",
    type: "password",
    value: pw,
    onInput: (e) => setPw(e.target.value)
  }), error && /* @__PURE__ */ h(Text, {
    tone: "danger",
    class: "strike-err"
  }, error), /* @__PURE__ */ h(Btn, {
    type: "submit",
    state: pending ? "busy" : "rest",
    disabled: pending
  }, "Sign in"));
}
function App() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return /* @__PURE__ */ h(Login, {
    pending,
    error,
    onSubmit: ({email, pw}) => {
      setError("");
      setPending(true);
      setTimeout(() => {
        setPending(false);
        if (!email || !pw)
          setError("Email and password required");
        else
          setError("");
      }, 400);
    }
  });
}
if (typeof document !== "undefined" && document.getElementById("app")) {
  mount("#app", App);
}
export {
  Login
};
