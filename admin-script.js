(function () {
  var TOOLS = {
    qr: { file: 'alat-qr-kod.html', label: 'QR Kod Karta Pića' },
    resize: { file: 'alat-resize-slika.html', label: 'Batch Resize Slika' },
    wifi: { file: 'alat-wifi-poster.html', label: 'WiFi Poster' }
  };

  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('sidebarBackdrop');
  var hamburger = document.getElementById('hamburger');
  var topbarTitle = document.getElementById('topbarTitleText');
  var stage = document.getElementById('stage');
  var loadedFrames = {};

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }

  hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  backdrop.addEventListener('click', closeSidebar);

  function selectTool(key) {
    var tool = TOOLS[key];
    if (!tool) return;

    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tool === key);
    });
    topbarTitle.textContent = tool.label;

    if (!loadedFrames[key]) {
      var loading = document.createElement('div');
      loading.className = 'stage-loading';
      loading.id = 'loading-' + key;
      loading.innerHTML = '<span class="spin"></span><span>Učitavanje alata…</span>';
      stage.appendChild(loading);

      var frame = document.createElement('iframe');
      frame.className = 'tool-frame';
      frame.id = 'frame-' + key;
      frame.src = tool.file;
      frame.title = tool.label;
      frame.addEventListener('load', function () {
        var l = document.getElementById('loading-' + key);
        if (l) l.classList.add('hidden');
        setTimeout(function () { if (l && l.parentNode) l.parentNode.removeChild(l); }, 250);
      });
      stage.appendChild(frame);
      loadedFrames[key] = frame;
    }

    Object.keys(loadedFrames).forEach(function (k) {
      loadedFrames[k].classList.toggle('visible', k === key);
    });

    try {
      localStorage.setItem('dc-active-tool', key);
    } catch (e) {}

    closeSidebar();
  }

  document.querySelectorAll('.nav-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectTool(btn.dataset.tool);
    });
  });

  var initial = 'qr';
  try {
    var saved = localStorage.getItem('dc-active-tool');
    if (saved && TOOLS[saved]) initial = saved;
  } catch (e) {}

  selectTool(initial);
})();
