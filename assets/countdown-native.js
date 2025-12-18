(() => {
  if (window.startCountdown) return;

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

  const formatDiff = (ms, fmt) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return fmt
      .replace('%-D', days)
      .replace('%-H', hours)
      .replace('%H', pad(hours))
      .replace('%M', pad(minutes))
      .replace('%S', pad(seconds));
  };

  window.startCountdown = function startCountdown(elOrId, endDate, fmt, opts = {}) {
    const el =
      typeof elOrId === 'string'
        ? document.getElementById(elOrId.replace(/^#/, ''))
        : elOrId;
    if (!el || !endDate) return null;

    const end =
      typeof endDate === 'string'
        ? new Date(endDate)
        : endDate;

    if (Number.isNaN(end.getTime())) return null;

    const onFinish = opts.onFinish;
    const onUpdate = opts.onUpdate;
    const expiredText = opts.expiredText || '';

    let timer = null;

    const tick = () => {
      const ms = end.getTime() - Date.now();
      if (ms <= 0) {
        el.textContent = expiredText;
        if (typeof onFinish === 'function') onFinish(el);
        if (timer) clearInterval(timer);
        return;
      }
      el.textContent = formatDiff(ms, fmt);
      if (typeof onUpdate === 'function') onUpdate(el);
    };

    timer = setInterval(tick, 1000);
    tick();
    return timer;
  };
})();

