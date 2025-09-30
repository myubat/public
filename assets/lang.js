document.addEventListener('DOMContentLoaded', function() {
  let translations = {};

  // Load translations
  fetch('./assets/lang.json?r=2025052401') // Cache-busting to ensure fresh file
    .then(response => response.json())
    .then(data => {
      translations = data;
      updateContent(window.currentLang);
    })
    .catch(error => {
      console.error('Error loading translations:', error);
      // Fallback to Malay if lang.json fails to load
      updateContent('ms');
    });

  // Translation function
  function t(key, lang = window.currentLang) {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
  }

  // Update page content
  function updateContent(lang) {
    // Update text elements
    document.querySelectorAll('[class*="T_"]').forEach(element => {
      const key = element.className.match(/T_([^\s]+)/)[1];
      element.innerHTML = t(key, lang);
    });

    // Update chart titles and labels
    if (typeof optionProgress !== 'undefined' && optionProgress && typeof optionState !== 'undefined' && optionState &&
        typeof optionService !== 'undefined' && optionService && typeof optionAge !== 'undefined' && optionAge) {
      optionProgress.series[0].name = t('ChartProgressNewUser', lang);
      optionProgress.series[1].name = t('ChartProgressNewApplication', lang);
      optionProgress.series[2].name = t('ChartProgressAppointmentFulfilled', lang);
      progressChart.setOption(optionProgress);

      optionState.title.text = t('ChartStateTitle', lang);
      // optionState.series[0].name = t('ServiceState', lang);
      // optionState.series[1].name = t('ServiceFacility', lang);
      // optionState.series[2].name = t('ServiceTitle', lang);
      // optionState.series[3].name = t('ServiceTitleSub', lang);
      stateChart.setOption(optionState);

      optionService.title.text = t('ChartServiceTitle', lang);
      optionService.series[0].data = optionService.series[0].data.map(item => ({
        value: item.value,
        name: t(item.name, lang)
      }));
      serviceChart.setOption(optionService);

      optionAge.title.text = t('ChartAgeTitle', lang);
      optionAge.series[0].name = t('ChartAgeMale', lang);
      optionAge.series[1].name = t('ChartAgeFemale', lang);
      ageChart.setOption(optionAge);
    }

    // Update cookie
    setCookie('language', lang, 1);
  }

  // Cookie functions
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Language change handler
  document.querySelector('#language').addEventListener('change', function() {
    const newLang = this.value;
    window.history.pushState({}, '', `?lang=${newLang}`);
    updateContent(newLang);
  });

  // Initial language setup
  // let language = getCookie('language') || window.currentLang || 'ms';
  // document.querySelector('#language').value = language;
  // updateContent(language);
}, true);