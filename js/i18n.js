(function () {
  'use strict';

  const STORAGE_KEY = 'proteins-lang';
  const DEFAULT_LANG = 'pt-BR';
  const SUPPORTED = ['pt-BR', 'en', 'es'];
  const LANG_LABELS = { 'pt-BR': 'PT-BR', 'en': 'EN', 'es': 'ES' };
  const HTML_LANG = { 'pt-BR': 'pt-BR', 'en': 'en', 'es': 'es' };

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(stored) ? stored : DEFAULT_LANG;
  }

  function resolve(obj, key) {
    return key.split('.').reduce((acc, part) => (acc && acc[part] != null ? acc[part] : null), obj);
  }

  function translate(lang, key) {
    if (typeof TRANSLATIONS === 'undefined') return null;
    return resolve(TRANSLATIONS[lang], key);
  }

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = translate(lang, el.dataset.i18n);
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const value = translate(lang, el.dataset.i18nHtml);
      if (value != null) el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const value = translate(lang, el.dataset.i18nPlaceholder);
      if (value != null) el.placeholder = value;
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const value = translate(lang, el.dataset.i18nAlt);
      if (value != null) el.alt = value;
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const value = translate(lang, el.dataset.i18nTitle);
      if (value != null) el.setAttribute('title', value);
    });

    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const value = translate(lang, titleEl.dataset.i18n);
      if (value != null) document.title = value;
    }

    const mapFrame = document.querySelector('[data-i18n-map]');
    if (mapFrame) {
      const hl = lang === 'pt-BR' ? 'pt-BR' : lang;
      mapFrame.src = `https://maps.google.com/maps?q=Biopark+Toledo+PR&hl=${hl}&z=14&output=embed`;
      const mapTitle = translate(lang, 'contact.map.title');
      if (mapTitle) mapFrame.setAttribute('title', mapTitle);
    }
  }

  function updateLangSwitcherUI(lang) {
    const option = document.querySelector(`.lang-option[data-lang="${lang}"]`);
    if (!option) return;

    const currentFlag = document.getElementById('currentFlag');
    const currentLangLabel = document.getElementById('currentLangLabel');

    if (currentFlag) currentFlag.innerHTML = option.querySelector('.flag').innerHTML;
    if (currentLangLabel) currentLangLabel.textContent = LANG_LABELS[lang];

    document.querySelectorAll('.lang-option').forEach((el) => {
      el.classList.toggle('selected', el.dataset.lang === lang);
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = HTML_LANG[lang];
    applyTranslations(lang);
    updateLangSwitcherUI(lang);
  }

  function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  function initLangSwitcher() {
    const langSwitch = document.getElementById('langSwitch');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    if (!langSwitch || !langDropdown) return;

    langSwitch.addEventListener('click', () => {
      langDropdown.classList.toggle('show');
      langSwitch.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!langSwitch.contains(e.target)) {
        langDropdown.classList.remove('show');
        langSwitch.classList.remove('open');
      }
    });

    langOptions.forEach((option) => {
      option.addEventListener('click', () => {
        setLang(option.dataset.lang);
        langDropdown.classList.remove('show');
        langSwitch.classList.remove('open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initLangSwitcher();
    setLang(getLang());
  });

  window.ProteinsI18n = { getLang, setLang };
})();
