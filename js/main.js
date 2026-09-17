/* ============================================
   HOPETSY — Site Interactivity
   ============================================ */

/* ╔══════════════════════════════════════════════╗
   ║  ⚙️  你只需要改下面这两项  ⚙️                    ║
   ╚══════════════════════════════════════════════╝

   1. EMAIL    → 接收客户询盘的邮箱（客户填表后，询盘发到这个邮箱）
   2. WHATSAPP  → 你的 WhatsApp 号码（国家码+号码，不要加号和空格）
                  例：中国 13800000000 → 8613800000000
                      美国 5551234567 → 15551234567

   改完保存即可，无需其他操作。
   ──────────────────────────────────────────────── */
const HOPETSY = {
  email: 'sophia@hopetsy.com',       // 接收客户询盘的邮箱
  whatsapp: '8618695623608',           // 你的 WhatsApp 号码
  brand: 'Hopetsy',
  whatsappGreeting: "Hello Hopetsy! I'm interested in your pet travel products."
};
/* ╔══════════════════════════════════════════════╗
   ║  改完上面两项就够了，下面代码一般不用动         ║
   ╚══════════════════════════════════════════════╝ */


(function () {
  'use strict';

  const waLink = 'https://wa.me/' + HOPETSY.whatsapp + '?text=' + encodeURIComponent(HOPETSY.whatsappGreeting);
  const mailLink = 'mailto:' + HOPETSY.email;

  /* ---- Wire all WhatsApp buttons ---- */
  document.querySelectorAll('.wa-float, .wa-link, [data-wa]').forEach(el => {
    el.setAttribute('href', waLink);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ---- Wire mailto links ---- */
  document.querySelectorAll('[data-mailto], .mailto-link').forEach(el => {
    el.setAttribute('href', mailLink);
  });

  /* ---- Make footer email clickable ---- */
  document.querySelectorAll('.footer-links li').forEach(li => {
    const txt = li.textContent.trim();
    const emailMatch = txt.match(/[\w.+-]+@[\w.-]+\.\w+/);
    if (emailMatch && !li.querySelector('a')) {
      const email = emailMatch[0];
      li.innerHTML = li.innerHTML.replace(email, '<a href="mailto:' + email + '">' + email + '</a>');
    }
    if (txt.includes('WhatsApp') && !li.querySelector('a')) {
      li.innerHTML = li.innerHTML.replace(/WhatsApp/, '<a href="' + waLink + '" target="_blank" rel="noopener">WhatsApp</a>');
    }
  });

  /* ---- Sticky header shadow ---- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMobile = document.querySelector('.close-mobile');
  const openMenu = () => { mobileMenu && mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenuFn = () => { mobileMenu && mobileMenu.classList.remove('open'); document.body.style.overflow = ''; };
  navToggle && navToggle.addEventListener('click', openMenu);
  closeMobile && closeMobile.addEventListener('click', closeMenuFn);
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenuFn));

  /* ---- Product gallery (PDP) ---- */
  const thumbs = document.querySelectorAll('.pdp-thumb');
  const mainImg = document.querySelector('.pdp-main-img');
  if (thumbs.length && mainImg) {
    thumbs.forEach(t => {
      t.addEventListener('click', () => {
        thumbs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        mainImg.textContent = t.textContent.trim();
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const ans = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---- Tabs (business page) ---- */
  const tabs = document.querySelectorAll('.tab');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const group = tab.dataset.group;
        document.querySelectorAll('[data-content]').forEach(c => {
          c.style.display = c.dataset.content === group ? '' : 'none';
        });
      });
    });
  }

  /* ---- Build WhatsApp message from form data ---- */
  function buildWhatsAppMessage(form) {
    const d = new FormData(form);
    const get = k => (d.get(k) || '').toString().trim();
    const interests = d.getAll('interest').join(', ') || '—';
    let msg = "Hello Hopetsy! I'd like to request a quote.\n\n";
    msg += "Name: " + (get('name') || '—') + "\n";
    msg += "Company: " + (get('company') || '—') + "\n";
    msg += "Country: " + (get('country') || '—') + "\n";
    msg += "Email: " + (get('email') || '—') + "\n";
    msg += "WhatsApp: " + (get('whatsapp') || '—') + "\n";
    msg += "Interested In: " + interests + "\n";
    msg += "Estimated Quantity: " + (get('quantity') || '—') + "\n";
    msg += "Customization: " + (get('customization') || '—') + "\n";
    msg += "Message: " + (get('message') || '—') + "\n";
    return encodeURIComponent(msg);
  }

  /* ---- Show inline result (success or fallback) ---- */
  function showResult(card, type) {
    if (type === 'success') {
      card.innerHTML =
        '<div style="text-align:center;padding:48px 24px">' +
        '<div style="font-size:3.5rem;margin-bottom:16px">✅</div>' +
        '<h2 style="margin-bottom:12px">Thank you! We\'ve received your request.</h2>' +
        '<p style="color:var(--slate);max-width:440px;margin:0 auto 24px">' +
        'Our team will get back to you within 24 hours with product details, pricing, and customization options.</p>' +
        '<a href="index.html" class="btn btn--outline">Back to Home</a>' +
        '</div>';
    } else {
      card.innerHTML =
        '<div style="text-align:center;padding:48px 24px">' +
        '<div style="font-size:3.5rem;margin-bottom:16px">💬</div>' +
        '<h2 style="margin-bottom:12px">Almost there!</h2>' +
        '<p style="color:var(--slate);max-width:440px;margin:0 auto 20px">' +
        'For the fastest response, please send your request directly via WhatsApp — ' +
        'our team will reply immediately.</p>' +
        '<a href="' + waLink + '" target="_blank" rel="noopener" class="btn btn--primary btn--lg">Chat on WhatsApp →</a>' +
        '<a href="index.html" class="btn btn--outline" style="margin-left:8px">Back to Home</a>' +
        '</div>';
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---- Quote form: real submission via FormSubmit.co + WhatsApp option ---- */
  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    /* "Send via WhatsApp" button */
    const waSendBtn = quoteForm.querySelector('.wa-send');
    if (waSendBtn) {
      waSendBtn.addEventListener('click', () => {
        if (!quoteForm.checkValidity()) {
          quoteForm.reportValidity();
          return;
        }
        const msg = buildWhatsAppMessage(quoteForm);
        window.open('https://wa.me/' + HOPETSY.whatsapp + '?text=' + msg, '_blank');
      });
    }

    /* Main submit → FormSubmit.co AJAX (email delivery) */
    quoteForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = quoteForm.querySelector('button[type="submit"]');
      const card = document.querySelector('.form-card');
      const original = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;

      try {
        const formData = new FormData(quoteForm);
        const response = await fetch('https://formsubmit.co/ajax/' + HOPETSY.email, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const data = await response.json();

        if (data.success === 'true' || data.success === true) {
          showResult(card, 'success');
        } else {
          /* Activation pending or other issue — fallback to WhatsApp */
          showResult(card, 'fallback');
        }
      } catch (err) {
        /* Network/CORS error — fallback to WhatsApp */
        showResult(card, 'fallback');
        btn.innerHTML = original;
        btn.disabled = false;
      }
    });
  }

  /* ---- Newsletter form ---- */
  document.querySelectorAll('.newsletter-form').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const btn = f.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      f.querySelector('input').value = '';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    });
  });

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      io.observe(el);
    });
  }
})();
