/*!
 * Koshe Dekhi Tools
 * ---------------------------------------------------------------
 * One single script that provides:
 *   1) Text size toolbar (bottom-left, auto-hide, − 4 +)
 *   2) SVG zoom controls (top-right inside each diagram)
 *   3) Overflow fix (tables / text / MathJax) for small screens
 *
 * Usage: add this just before </body>
 *   <script src="YOUR-HOSTED-LINK/koshe-dekhi-tools.js" charset="utf-8"></script>
 */
(function () {
  'use strict';

  if (window.__kdToolsLoaded) return;
  window.__kdToolsLoaded = true;

  /* ===== Koshe Dekhi: Text Scale & SVG Controls — CSS (minified) ===== */
  var CONTROLS_CSS = '#kdViewDock,#kdViewDock *{box-sizing:border-box}#kdViewDock{position:fixed;left:0;bottom:12px;z-index:2147483647;display:flex;align-items:center;width:max-content;max-width:calc(100vw - 16px);font-family:Arial,sans-serif}#kdViewDock .kd-handle{display:none;align-items:center;justify-content:center;width:9px;height:24px;padding:0;margin:0;border:0;border-radius:0 6px 6px 0;background:rgba(15,23,42,.45);color:#e2e8f0;line-height:1;opacity:.6;cursor:pointer;transition:opacity .2s,background .2s;-webkit-tap-highlight-color:transparent}#kdViewDock .kd-handle .kd-chev{font-size:13px;line-height:1;margin-left:-1px}#kdViewDock .kd-handle:hover,#kdViewDock .kd-handle:focus-visible,#kdViewDock .kd-handle:active{opacity:1;background:rgba(15,23,42,.85)}#kdViewDock.collapsed .kd-handle{display:inline-flex}#kdViewDock .kd-panel{display:flex;align-items:center;gap:1px;height:30px;padding:0 4px;background:rgba(15,23,42,.88);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.08);border-radius:999px;box-shadow:0 4px 14px rgba(2,6,23,.28);opacity:1;transform:translateX(0);transition:opacity .2s ease,transform .2s ease}#kdViewDock.collapsed .kd-panel{display:none}#kdViewDock .kd-panel button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;height:24px;padding:0;margin:0;border:0;border-radius:50%;background:transparent;color:#e2e8f0;font-family:Arial,sans-serif;font-weight:700;line-height:1;cursor:pointer;transition:background .15s,color .15s;-webkit-tap-highlight-color:transparent}#kdViewDock .kd-panel button:hover{background:rgba(255,255,255,.14);color:#fff}#kdViewDock .kd-panel button:active{background:rgba(96,165,250,.35)}#kdViewDock .kd-panel .kd-step{width:24px;font-size:16px}#kdViewDock .kd-panel .kd-scale-value{width:26px;border-radius:999px;color:#93c5fd;font-size:13px;font-variant-numeric:tabular-nums}.kd-svg-wrap{position:relative!important;display:block;width:fit-content;max-width:100%;margin:1.5rem auto}.kd-svg-scroll{max-width:100%;overflow:auto;border-radius:8px;-webkit-overflow-scrolling:touch}.kd-svg-wrap svg.geometry-diagram{display:block!important;margin:0!important;max-width:none!important;height:auto!important;transform:none!important;flex:none}.kd-svg-controls{position:absolute!important;top:3px!important;right:6px!important;left:auto!important;z-index:50;display:flex;align-items:center;gap:2px;padding:0;background:none;border:0;opacity:.3;transition:opacity .2s}.kd-svg-wrap:hover .kd-svg-controls,.kd-svg-wrap:active .kd-svg-controls,.kd-svg-controls:hover,.kd-svg-controls:focus-within{opacity:.85}.kd-svg-controls button{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;min-width:20px;padding:0;margin:0;border:0;border-radius:0;background:none;box-shadow:none;color:#475569;font-family:Arial,sans-serif;font-size:16px;font-weight:700;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent}.kd-svg-controls button:hover{color:#2563eb}.kd-svg-controls button:active{color:#1d4ed8}@media (max-width:380px){#kdViewDock{left:0;bottom:8px}}';

  /* ===== Overflow Fix (tables / text / MathJax) — CSS (minified) ===== */
  var OVERFLOW_CSS = '.solution-container,.solution-container *{box-sizing:border-box}html,body{max-width:100%}.solution-container{width:100%;max-width:100%;min-width:0}.solution-container p,.solution-container h1,.solution-container h2,.solution-container h3,.solution-container h4,.solution-container h5,.solution-container h6,.solution-container li{overflow-wrap:anywhere}.solution-container .stat-table-wrapper{width:100%;max-width:100%;min-width:0}.solution-container .stat-table{width:100%;max-width:100%;border-collapse:collapse}@media (max-width:900px){.solution-container .stat-table-wrapper{overflow-x:hidden}.solution-container .stat-table.is-overflowing{table-layout:fixed;width:100%!important;font-size:var(--fit-font-size,12px)!important}.solution-container .stat-table.is-overflowing th,.solution-container .stat-table.is-overflowing td{padding:var(--fit-cell-padding,4px)!important;white-space:normal!important;overflow-wrap:anywhere;word-break:normal;min-width:0;line-height:1.4}}.solution-container .MathJax_Display{max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;box-sizing:border-box}';

  /* ===== Toolbar markup ===== */
  var DOCK_HTML =
    '<button type="button" class="kd-handle" id="kdDockToggle"' +
    ' aria-expanded="false" title="টেক্সট সাইজ টুলবার খুলুন"' +
    ' aria-label="টেক্সট সাইজ টুলবার খুলুন"><span class="kd-chev">›</span></button>' +
    '<div class="kd-panel">' +
    '<button type="button" class="kd-step" id="kdTextMinus"' +
    ' aria-label="টেক্সট ছোট করুন" title="টেক্সট ছোট করুন">−</button>' +
    '<button type="button" class="kd-scale-value" id="kdTextScaleValue"' +
    ' aria-label="টেক্সট রিসেট" title="ক্লিক করলে ডিফল্ট সাইজ (4)">4</button>' +
    '<button type="button" class="kd-step" id="kdTextPlus"' +
    ' aria-label="টেক্সট বড় করুন" title="টেক্সট বড় করুন">+</button>' +
    '</div>';

  function injectStyle(id, css) {
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function injectDock() {
    if (document.getElementById('kdViewDock')) return;
    var dock = document.createElement('div');
    dock.id = 'kdViewDock';
    dock.className = 'collapsed';
    dock.innerHTML = DOCK_HTML;
    document.body.appendChild(dock);
  }

  /* ===================== Text Scale & SVG Controls ===================== */
  function initControls() {
    var dock = document.getElementById('kdViewDock');
    if (!dock || dock.dataset.kdReady) return;
    dock.dataset.kdReady = '1';

    var minus = document.getElementById('kdTextMinus');
    var plus = document.getElementById('kdTextPlus');
    var valueLabel = document.getElementById('kdTextScaleValue');
    var reset = valueLabel; /* clicking the number resets the text size */
    var toggle = document.getElementById('kdDockToggle');

    /* TEXT SCALE: 1 to 9, default 4 */
    var DEFAULT_LEVEL = 4;
    var textLevel = DEFAULT_LEVEL;
    var textScale = 1;
    var originalSizes = new WeakMap();
    var mathScaleOriginal = null;

    function levelToScale(level) {
      // Level 4 = 100%; level 1 = 60%; level 9 = 160%.
      if (level <= DEFAULT_LEVEL) {
        return 0.6 + (level - 1) * (0.4 / (DEFAULT_LEVEL - 1));
      }
      return 1 + (level - DEFAULT_LEVEL) * (0.6 / (9 - DEFAULT_LEVEL));
    }

    function getTextTargets() {
      var root = document.querySelector('.solution-container');
      if (!root) return [];

      return Array.from(root.querySelectorAll(
        '.question-title, .sub-question, .solution-box p,' +
        '.solution-box li, .solution-box td, .solution-box th,' +
        '.solution-box .sol-badge, .solution-box .final-answer,' +
        '.alert, .alert p'
      )).filter(function (el) {
        return !el.closest(
          '#kdViewDock, .kd-svg-wrap, svg, .kd-svg-controls'
        );
      });
    }

    function saveOriginalSize(el) {
      if (originalSizes.has(el)) return;

      originalSizes.set(el, {
        inline: el.style.getPropertyValue('font-size'),
        priority: el.style.getPropertyPriority('font-size'),
        computed: parseFloat(getComputedStyle(el).fontSize)
      });
    }

    function updateText() {
      textScale = levelToScale(textLevel);
      valueLabel.textContent = String(textLevel);

      getTextTargets().forEach(function (el) {
        saveOriginalSize(el);

        var data = originalSizes.get(el);
        if (!Number.isFinite(data.computed)) return;

        el.style.setProperty(
          'font-size',
          (data.computed * textScale) + 'px',
          'important'
        );
      });

      /*
        MathJax 2: update output scale as well.
        HTML-CSS output generally honors this setting.
      */
      if (window.MathJax && window.MathJax.Hub) {
        try {
          var percent = Math.round(textScale * 100);

          window.MathJax.Hub.Config({
            'HTML-CSS': { scale: percent },
            'CommonHTML': { scale: percent },
            'SVG': { scale: percent }
          });

          window.MathJax.Hub.Queue([
            'Rerender', window.MathJax.Hub
          ]);
        } catch (e) {}
      }
    }

    function resetText() {
      getTextTargets().forEach(function (el) {
        var data = originalSizes.get(el);
        if (!data) return;

        if (data.inline) {
          el.style.setProperty('font-size', data.inline, data.priority);
        } else {
          el.style.removeProperty('font-size');
        }
      });

      textLevel = DEFAULT_LEVEL;
      textScale = 1;
      valueLabel.textContent = String(DEFAULT_LEVEL);

      if (window.MathJax && window.MathJax.Hub) {
        try {
          window.MathJax.Hub.Config({
            'HTML-CSS': { scale: 100 },
            'CommonHTML': { scale: 100 },
            'SVG': { scale: 100 }
          });
          window.MathJax.Hub.Queue([
            'Rerender', window.MathJax.Hub
          ]);
        } catch (e) {}
      }
    }

    /* Auto-hide: toolbar starts hidden, opens on tap, hides when idle */
    var hideTimer = null;
    var HIDE_DELAY = 2800;

    function hideDock() {
      clearTimeout(hideTimer);
      dock.classList.add('collapsed');
      toggle.setAttribute('aria-expanded', 'false');
    }

    function armHideTimer() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hideDock, HIDE_DELAY);
    }

    function showDock() {
      dock.classList.remove('collapsed');
      toggle.setAttribute('aria-expanded', 'true');
      armHideTimer();
    }

    toggle.addEventListener('click', showDock);

    dock.addEventListener('mouseenter', function () {
      clearTimeout(hideTimer);
    });
    dock.addEventListener('mouseleave', function () {
      if (!dock.classList.contains('collapsed')) armHideTimer();
    });

    /* tapping anywhere outside the dock hides the toolbar */
    function hideOnOutsideTouch(e) {
      if (!dock.contains(e.target)) hideDock();
    }
    document.addEventListener('pointerdown', hideOnOutsideTouch, true);
    document.addEventListener('touchstart', hideOnOutsideTouch, { capture: true, passive: true });
    document.addEventListener('scroll', function () {
      if (!dock.classList.contains('collapsed')) hideDock();
    }, { passive: true });

    minus.addEventListener('click', function () {
      if (textLevel > 1) {
        textLevel--;
        updateText();
      }
      armHideTimer();
    });

    plus.addEventListener('click', function () {
      if (textLevel < 9) {
        textLevel++;
        updateText();
      }
      armHideTimer();
    });

    reset.addEventListener('click', function () {
      resetText();
      armHideTimer();
    });

    /* SVG controls */
    var svgStates = new WeakMap();

    function setupSvg(svg) {
      if (svgStates.has(svg)) return;

      var parent = svg.parentNode;
      if (!parent) return;

      var wrap = document.createElement('div');
      wrap.className = 'kd-svg-wrap';

      var scroller = document.createElement('div');
      scroller.className = 'kd-svg-scroll';

      parent.insertBefore(wrap, svg);
      wrap.appendChild(scroller);
      scroller.appendChild(svg);

      var width = parseFloat(svg.getAttribute('width'));
      if (!Number.isFinite(width) || width <= 0) {
        width = svg.getBoundingClientRect().width || 200;
      }

      var state = { width: width, level: 5 };
      svgStates.set(svg, state);

      svg.style.setProperty('width', width + 'px', 'important');
      svg.style.setProperty('height', 'auto', 'important');

      var controls = document.createElement('div');
      controls.className = 'kd-svg-controls';

      var small = document.createElement('button');
      small.type = 'button';
      small.textContent = '−';
      small.title = 'চিত্র ছোট করুন';

      var large = document.createElement('button');
      large.type = 'button';
      large.textContent = '+';
      large.title = 'চিত্র বড় করুন';

      controls.appendChild(small);
      controls.appendChild(large);
      wrap.appendChild(controls);

      function applySvgScale() {
        var scale = 0.6 + (state.level - 1) * (1 / 9);

        svg.style.setProperty(
          'width',
          (state.width * scale) + 'px',
          'important'
        );
        svg.style.setProperty('height', 'auto', 'important');
      }

      small.addEventListener('click', function () {
        if (state.level > 1) {
          state.level--;
          applySvgScale();
        }
      });

      large.addEventListener('click', function () {
        if (state.level < 10) {
          state.level++;
          applySvgScale();
        }
      });
    }

    function setupAllSvgs() {
      document.querySelectorAll('svg.geometry-diagram').forEach(setupSvg);
    }

    setupAllSvgs();

    var observer = new MutationObserver(function () {
      setupAllSvgs();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* ===================== Overflow Fix (tables / text / MathJax) ===================== */
  function initOverflowFix() {
    var root = document.querySelector('.solution-container');
    if (!root) return;

    var timer;

    function fitOverflowingTables() {
      var smallScreen = window.matchMedia(
        '(max-width: 900px)'
      ).matches;

      root.querySelectorAll('.stat-table').forEach(function (table) {
        table.classList.remove('is-overflowing');
        table.style.removeProperty('--fit-font-size');
        table.style.removeProperty('--fit-cell-padding');

        if (!smallScreen) return;

        var wrapper = table.closest('.stat-table-wrapper');
        if (!wrapper) return;

        /* Measure the table's natural width without changing its content */
        var previousLayout = table.style.tableLayout;
        var previousWidth = table.style.width;

        table.style.tableLayout = 'auto';
        table.style.width = 'max-content';

        var available = wrapper.clientWidth;
        var naturalWidth = table.scrollWidth;

        table.style.tableLayout = previousLayout;
        table.style.width = previousWidth;

        if (!available || naturalWidth <= available + 1) return;

        /* Only this overflowing table is adjusted */
        table.classList.add('is-overflowing');

        var rows = table.querySelectorAll('tr');
        var columns = 1;

        rows.forEach(function (row) {
          var count = 0;
          row.querySelectorAll('th, td').forEach(function (cell) {
            count += Math.max(1, cell.colSpan || 1);
          });
          columns = Math.max(columns, count);
        });

        var font = columns >= 10 ? 8 :
                   columns >= 7  ? 9 :
                   columns >= 5  ? 10 : 11;

        var padding = columns >= 7 ? '2px' : '3px';

        table.style.setProperty('--fit-font-size', font + 'px');
        table.style.setProperty('--fit-cell-padding', padding);

        /* Reduce further only if this table still overflows */
        requestAnimationFrame(function () {
          var size = font;

          while (
            table.scrollWidth > wrapper.clientWidth + 1 &&
            size > 7
          ) {
            size--;
            table.style.setProperty(
              '--fit-font-size',
              size + 'px'
            );
          }
        });
      });
    }

    function scheduleFit() {
      clearTimeout(timer);
      timer = setTimeout(fitOverflowingTables, 100);
    }

    fitOverflowingTables();

    window.addEventListener('resize', scheduleFit);
    window.addEventListener('orientationchange', scheduleFit);

    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(scheduleFit);
      resizeObserver.observe(root);
    }

    if ('MutationObserver' in window) {
      var mutationObserver = new MutationObserver(scheduleFit);
      mutationObserver.observe(root, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  /* ===================== Start ===================== */
  function init() {
    injectStyle('kd-controls-style', CONTROLS_CSS);
    injectStyle('abvrp-overflow-only-fix', OVERFLOW_CSS);
    injectDock();
    initControls();
    initOverflowFix();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
