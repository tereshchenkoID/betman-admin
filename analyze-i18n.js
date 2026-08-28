const fs = require('fs')
const path = require('path')

// ================= НАСТРОЙКИ =================
// Путь к твоему файлу перевода
const LOCALE_FILE_PATH = path.join(__dirname, 'public/locales/ukr/translation.json')
// Папка, где лежит весь исходный код проекта
const SRC_DIR = path.join(__dirname, 'src')
// Расширения файлов, которые нужно сканировать
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']
// =============================================

// Рекурсивное получение всех ключей из JSON (включая вложенные объекты)
function getJsonKeys(obj, prefix = '') {
  let keys = []
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getJsonKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

// Рекурсивный обход папки с исходным кодом
function getFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath))
    } else if (FILE_EXTENSIONS.includes(path.extname(filePath))) {
      results.push(filePath)
    }
  })
  return results
}

function analyzeTranslations() {
  if (!fs.existsSync(LOCALE_FILE_PATH)) {
    console.error(`❌ Файл локализации не найден по пути: ${LOCALE_FILE_PATH}`)
    return
  }

  // 1. Читаем и парсим JSON переводов
  const localeJson = JSON.parse(fs.readFileSync(LOCALE_FILE_PATH, 'utf8'))
  const definedKeys = getJsonKeys(localeJson)

  // 2. Находим все файлы проекта
  const files = getFiles(SRC_DIR)

  // Ищет вызовы функций перевода: t('key')
  const tFunctionRegex = /t\(\s*['"`]([^'"`]+)['"`]\s*\)/g

  // Ищет строки в свойствах объектов: text: 'key' или text: "key"
  const textPropertyRegex = /\btext\s*:\s*['"`]([^'"`]+)['"`]/g

  const usedKeys = new Set()
  const usedPrefixes = new Set() // Для динамических ключей вида t(`roles.${key}`)

  // 3. Сканируем файлы кода
  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    let match

    // Поиск 1: Стандартные вызовы t('...')
    tFunctionRegex.lastIndex = 0
    while ((match = tFunctionRegex.exec(content)) !== null) {
      const foundKey = match[1]
      if (foundKey.includes('${')) {
        const cleanPrefix = foundKey.split('${')[0]
        if (cleanPrefix) usedPrefixes.add(cleanPrefix)
      } else {
        usedKeys.add(foundKey)
      }
    }

    // Поиск 2: Ключи из конфигов таблиц/колонок вида text: '...'
    textPropertyRegex.lastIndex = 0
    while ((match = textPropertyRegex.exec(content)) !== null) {
      const foundKey = match[1]
      // Исключаем динамические строки, если они вдруг есть в свойстве text
      if (!foundKey.includes('${')) {
        usedKeys.add(foundKey)
      }
    }
  })

  // 4. Сравниваем результаты
  const unusedKeys = []
  const missingKeys = []

  definedKeys.forEach((key) => {
    // Проверяем прямое использование
    if (usedKeys.has(key)) return

    // Проверяем вложенные/динамические совпадения (по префиксу)
    // Например, если в коде заматчился префикс "navigation.", а в JSON ключ "navigation.home"
    const isUsedDynamically = Array.from(usedPrefixes).some((prefix) => key.startsWith(prefix))
    if (isUsedDynamically) return

    // Проверяем плоские совпадения (если в JSON ключ "id", а заматчился "id" из text: 'id')
    // Также проверяем совпадение по последней части составного ключа (например, если в JSON "vouchers.id", а в text просто "id")
    const isMatchedFlat = Array.from(usedKeys).some(usedKey => key === usedKey || key.endsWith(`.${usedKey}`))
    if (isMatchedFlat) return

    unusedKeys.push(key)
  })

  // Ищем ключи, которые вызываются в коде, но их вообще нет в JSON
  usedKeys.forEach((key) => {
    // Проверяем как полное совпадение, так и вхождение в составные ключи
    const isDefined = definedKeys.some(defKey => defKey === key || defKey.endsWith(`.${key}`))
    if (!isDefined) {
      missingKeys.push(key)
    }
  })

  // 5. Выводим красивый отчет
  console.log('\n==================================================')
  console.log(`📊 ОТЧЕТ ПО АНАЛИЗУ ПЕРЕВОДОВ (${definedKeys.length} ключей в JSON)`)
  console.log('==================================================')

  console.log(`\n🛑 НЕ ИСПОЛЬЗУЮТСЯ В КОДЕ (Можно удалить: ${unusedKeys.length}):`)
  if (unusedKeys.length === 0) {
    console.log('   Все ключи используются!')
  } else {
    unusedKeys.sort().forEach(key => console.log(`   ❌  ${key}`))
  }

  console.log(`\n⚠️ ИСПОЛЬЗУЮТСЯ В КОДЕ, НО НЕТ В JSON (Забыли добавить: ${missingKeys.length}):`)
  if (missingKeys.length === 0) {
    console.log('   Потерянных ключей не обнаружено!')
  } else {
    missingKeys.sort().forEach(key => console.log(`   ❓  ${key}`))
  }
  console.log('\n==================================================\n')
}

analyzeTranslations()
