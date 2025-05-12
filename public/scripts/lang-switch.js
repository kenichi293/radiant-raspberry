function switchLang(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-jp], [data-en], [data-zh], [data-ko], [data-pt]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });

  const langs = ['ja', 'en', 'zh', 'ko', 'pt'];
  langs.forEach(code => {
    const btn = document.getElementById(`btn${code.charAt(0).toUpperCase() + code.slice(1)}`);
    if (btn) {
      btn.classList.toggle('active', lang === code);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  switchLang('ja');
});
