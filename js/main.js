(function () {
  "use strict";

  // Anno nel footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Vulnerable Lab: selezione dello scenario ----------
  var SCENARI = {
    sql: {
      titolo: "SQL Injection",
      rete: "sql_net",
      porta: "5000",
      tinta: "var(--sql)",
      cosa: "In breve: input non filtrato che permette di alterare le query inviate al database."
    },
    auth: {
      titolo: "Broken Authentication",
      rete: "auth_net",
      porta: "5001",
      tinta: "var(--auth)",
      cosa: "In breve: meccanismi di login e di gestione delle sessioni implementati in modo debole."
    },
    priv: {
      titolo: "Privilege Escalation",
      rete: "priv_net",
      porta: "5002",
      tinta: "var(--priv)",
      cosa: "In breve: ottenere permessi superiori a quelli assegnati al proprio account."
    },
    misc: {
      titolo: "Security Misconfiguration",
      rete: "misconf_net",
      porta: "5003",
      tinta: "var(--misc)",
      cosa: "In breve: impostazioni predefinite o errate che espongono il servizio."
    }
  };

  document.querySelectorAll("[data-lab]").forEach(function (lab) {
    var lanes = lab.querySelectorAll(".lane");
    var panel = lab.querySelector("[data-panel]");
    if (!panel) return;

    function select(key) {
      var s = SCENARI[key];
      if (!s) return;
      lanes.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.lane === key));
      });
      panel.style.setProperty("--panel-tint", s.tinta);
      panel.querySelector("[data-p-title]").textContent = s.titolo;
      panel.querySelector("[data-p-net]").textContent = s.rete;
      panel.querySelector("[data-p-port]").textContent = s.porta;
      panel.querySelector("[data-p-summary]").textContent =
        "Scenario dedicato a " + s.titolo + ", isolato nella rete " + s.rete +
        " ed esposto sulla porta " + s.porta + ".";
      panel.querySelector("[data-p-what]").textContent = s.cosa;
    }

    lanes.forEach(function (b) {
      b.addEventListener("click", function () { select(b.dataset.lane); });
    });

    select("sql");
  });

  // ---------- Copia negli appunti ----------
  var status = document.querySelector("[data-copy-status]");

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy;
      var done = function (ok) {
        btn.textContent = ok ? "Copiato" : "Non copiato";
        btn.classList.toggle("is-done", ok);
        if (status) status.textContent = ok ? "Copiato negli appunti" : "Copia non riuscita";
        setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove("is-done");
        }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  });

  // ---------- Form di contatto → mailto ----------
  var form = document.querySelector("[data-mailto-form]");
  if (form) {
    var note = form.querySelector("[data-form-note]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;
      form.querySelectorAll("input, textarea").forEach(function (f) {
        var bad = !f.checkValidity();
        f.setAttribute("aria-invalid", String(bad));
        if (bad && !firstInvalid) firstInvalid = f;
      });

      if (firstInvalid) {
        note.textContent = "Compila tutti i campi, con un indirizzo email valido.";
        firstInvalid.focus();
        return;
      }

      var d = new FormData(form);
      var body =
        d.get("messaggio") + "\n\n" +
        "—\n" + d.get("nome") + "\n" + d.get("email");
      var url =
        "mailto:Gabriele.Florio28@gmail.com" +
        "?subject=" + encodeURIComponent(d.get("oggetto")) +
        "&body=" + encodeURIComponent(body);

      note.textContent = "Ho aperto il tuo programma di posta. Premi invio lì per spedire il messaggio.";
      window.location.href = url;
    });
  }
})();
