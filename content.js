(() => {
  if (window.top !== window || location.hostname.startsWith("archive.")) return;

  // Collect all JSON-LD objects on the page, flattening arrays and @graph.
  function jsonLdObjects() {
    const out = [];
    const visit = (node) => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (node && typeof node === "object") {
        out.push(node);
        if (node["@graph"]) visit(node["@graph"]);
      }
    };
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        visit(JSON.parse(s.textContent));
      } catch {
        // ignore malformed JSON-LD
      }
    }
    return out;
  }

  // schema.org paywall marker used by most news sites for Google's paywall guidelines.
  function isPaywalled() {
    return jsonLdObjects().some((o) => {
      const v = o.isAccessibleForFree;
      return v === false || v === "false" || v === "False";
    });
  }

  function addButton() {
    if (document.getElementById("no-walls-btn")) return;
    const url = location.origin + location.pathname; // drop tracking params / hash
    const a = document.createElement("a");
    a.id = "no-walls-btn";
    // /newest/ redirects straight to the most recent snapshot, skipping the results list.
    a.href = "https://archive.is/newest/" + url;
    a.textContent = "Ganzer Artikel";
    a.title = "Open on archive.is";
    document.body.appendChild(a);
  }

  if (isPaywalled()) addButton();
})();
