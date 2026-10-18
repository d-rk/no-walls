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

  function meta(attr, value) {
    return document.querySelector(`meta[${attr}="${value}"]`)?.content;
  }

  // Medium articles, including publications on custom domains.
  function isMediumArticle() {
    const medium =
      /(^|\.)medium\.com$/.test(location.hostname) ||
      meta("property", "al:android:package") === "com.medium.reader" ||
      meta("name", "twitter:app:name:iphone") === "Medium";
    return medium && meta("property", "og:type") === "article";
  }

  function addButton(href) {
    if (document.getElementById("no-walls-btn")) return;
    const a = document.createElement("a");
    a.id = "no-walls-btn";
    a.href = href;
    a.textContent = "Ganzer Artikel";
    document.body.appendChild(a);
  }

  const url = location.origin + location.pathname; // drop tracking params / hash
  if (isMediumArticle()) {
    addButton("https://freedium-mirror.cfd/" + url);
  } else if (isPaywalled()) {
    // /newest/ redirects straight to the most recent snapshot, skipping the results list.
    addButton("https://archive.is/newest/" + url);
  }
})();
