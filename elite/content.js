/* ============================================================
   CONTENT LAYER — admin-editable content resolution.
   Priority: localStorage draft (admin preview in this browser)
           → published elite/content-data.js
           → hardcoded defaults in each data file.
   Load AFTER content-data.js and BEFORE all data/jsx scripts.
   ============================================================ */
(function () {
  var local = null;
  try { local = JSON.parse(localStorage.getItem("ea_content_v1") || "null"); } catch (e) {}
  window.EA_CONTENT = local || window.EA_CONTENT_PUBLISHED || null;

  /* eaContent(key, fallback): override if present and non-empty */
  window.eaContent = function (key, fallback) {
    var c = window.EA_CONTENT;
    if (c && c[key] && (!Array.isArray(c[key]) || c[key].length > 0)) return c[key];
    return fallback;
  };
})();
