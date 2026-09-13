/**
 * Meta (Facebook) Pixel Injector & Tracker
 * Dynamically injects official fbevents.js and fires PageView + custom events
 */

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export function initMetaPixel(pixelId: string) {
  const cleanId = (pixelId || '').trim().replace(/[^0-9]/g, '');
  if (!cleanId) return;

  // If fbq already exists, just re-init or track
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('init', cleanId);
      window.fbq('track', 'PageView');
    } catch (err) {
      console.warn('[aurabio:pixel] fbq track error:', err);
    }
    return;
  }

  // Official Meta Pixel base snippet
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );
  /* eslint-enable */

  try {
    window.fbq('init', cleanId);
    window.fbq('track', 'PageView');
  } catch (err) {
    console.warn('[aurabio:pixel] init error:', err);
  }
}

export function trackMetaPixelEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, params);
    } catch (err) {
      console.warn('[aurabio:pixel] track event error:', err);
    }
  }
}
