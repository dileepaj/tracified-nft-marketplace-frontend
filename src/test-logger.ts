
export default function () {
  const consoleOriginal = window.console;

  window.console = new Proxy(consoleOriginal, {
    get(obj, prop) {
      if (!obj[prop]) return obj[prop];

      if (typeof obj[prop] !== "function") return obj[prop];

      return function () {
        let panel = document.getElementById("consoleLogger");
        if (!panel) {
          panel = document.createElement("div");
          panel.id = "consoleLogger";
          panel.style.background = "white"
          document.body.appendChild(panel);
        }
        panel = document.getElementById("consoleLogger");

        const line = document.createElement("p");
        line.innerText = `${prop.toString()} : ${Array.from(arguments).map((arg) => {

          if (typeof arg === "object") {
            consoleOriginal.log(arg, arg.constructor.name)
          }
          return typeof arg === "object" ? arg.constructor.name + " " + arg.toString() : arg.toString();
        }).join(", ")}`

        if (panel) panel.appendChild(line);

        return obj[prop](...arguments);
      }
    }
  });
}
