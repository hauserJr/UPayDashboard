import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

// Get saved language from localStorage or use browser language
function getDefaultLocale() {
    const savedLocale = localStorage.getItem('language')
    if (savedLocale) {
        return savedLocale
    }

    // Browser language detection
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('zh')) {
        return 'zh-TW'
    }

    // Default to Chinese (Traditional)
    return 'zh-TW'
}

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: getDefaultLocale(),
    fallbackLocale: 'en',
    messages: {
        en,
        'zh-TW': zhTW
    }
})

export default i18n
