import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home', lessons: 'Grammar', exercises: 'Exercises',
        quiz: 'Quiz', vocabulary: 'Vocabulary', reading: 'Reading',
        listening: 'Listening', writing: 'Writing', mistakes: 'Mistakes',
        levelTest: 'Level Test', progress: 'Progress', admin: 'Admin',
      },
      common: {
        loading: 'Loading…', error: 'Something went wrong', retry: 'Try again',
        save: 'Save', cancel: 'Cancel', submit: 'Submit', next: 'Next',
        back: 'Back', finish: 'Finish', start: 'Start', continue: 'Continue',
        correct: 'Correct!', incorrect: 'Incorrect', xp: 'XP', streak: 'Streak',
        level: 'Level', accuracy: 'Accuracy', score: 'Score',
        bookmark: 'Bookmark', bookmarked: 'Bookmarked', words: 'words',
        minutes: 'min', easy: 'Easy', medium: 'Medium', hard: 'Hard',
        filterByLevel: 'Filter by level', all: 'All', search: 'Search…',
      },
      auth: {
        login: 'Sign In', register: 'Create Account', email: 'Email',
        password: 'Password', logout: 'Sign out', welcome: 'Welcome back',
        noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
        signUpFree: 'Sign up free',
      },
      home: {
        title: 'Good {{time}}, ready to learn?',
        morning: 'morning', afternoon: 'afternoon', evening: 'evening',
        continueExercises: 'Continue Exercises', startFlashcards: 'Flashcards',
        reviewMistakes: 'Review Mistakes', weeklyStreak: 'day streak',
        xpToday: 'XP today', weakTopics: 'Weak Areas', dueToday: 'due today',
        noActivity: 'Start learning to build your streak!',
      },
      exercise: {
        title: 'Grammar Exercises', fillBlank: 'Fill in the blank',
        checkAnswer: 'Check Answer', explanation: 'Explanation',
        hint: 'Hint', sessionComplete: 'Session Complete!',
        questionsLeft: '{{n}} questions left', topic: 'Topic',
      },
      vocabulary: {
        title: 'Vocabulary', listView: 'List', flashcardView: 'Flashcards',
        dontKnow: "Don't Know", hard: 'Hard', know: 'Know', easy: 'Easy',
        definition: 'Definition', examples: 'Examples', synonyms: 'Synonyms',
        antonyms: 'Antonyms', pronunciation: 'Pronunciation', translation: 'Translation',
        mastered: 'Mastered', learning: 'Learning', review: 'Review', new: 'New',
        cardsToday: '{{n}} cards today',
      },
      reading: {
        title: 'Reading', comprehensionQuestions: 'Comprehension Questions',
        readText: 'Read the text, then answer questions', timeToRead: '~{{n}} min read',
      },
      listening: {
        title: 'Listening', play: 'Play', pause: 'Pause', replay: 'Replay',
        speed: 'Speed', dictation: 'Dictation', comprehension: 'Comprehension',
        typeHeard: 'Type what you hear…', submitDictation: 'Check',
      },
      writing: {
        title: 'Writing', wordCount: '{{n}} words', minWords: 'Minimum {{n}} words',
        submitReview: 'Submit for AI Review', analyzing: 'Analyzing…',
        overallScore: 'Overall Score', grammarScore: 'Grammar',
        taskScore: 'Task', coherenceScore: 'Coherence', errors: 'Errors found',
        noErrors: 'No errors found! Great job!',
      },
      levelTest: {
        title: 'Level Test', readyTitle: 'You are ready!',
        readyDesc: 'All requirements completed. Take the test to advance.',
        startTest: 'Start Test', timeLeft: 'Time left',
        passed: '🎉 Congratulations! Level up!', failed: 'Not quite yet',
        failedDesc: 'Keep practicing. Try again in 24 hours.',
        score85: '85% needed to pass',
      },
      progress: {
        title: 'My Progress', currentLevel: 'Current Level',
        nextLevel: 'Next Level', requirements: 'Requirements',
        xpHistory: 'XP History', testHistory: 'Test History',
        estimatedTime: 'Estimated time to next level',
      },
      mistakes: {
        title: 'Mistake Tracker', weakAreas: 'Weak Areas',
        noMistakes: 'No mistakes yet — keep it up!', repeatTopic: 'Practice',
        occurrences: '{{n}}× wrong',
      },
      admin: {
        title: 'Admin Panel', importData: 'Import Content',
        validJson: 'Valid JSON ✓', invalidJson: 'Invalid JSON ✗',
        imported: 'Imported: {{n}}', skipped: 'Skipped: {{n}}', errors: 'Errors: {{n}}',
        importBtn: 'Import', userStats: 'User Statistics',
      },
    },
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная', lessons: 'Грамматика', exercises: 'Упражнения',
        quiz: 'Квиз', vocabulary: 'Словарь', reading: 'Чтение',
        listening: 'Аудирование', writing: 'Письмо', mistakes: 'Ошибки',
        levelTest: 'Тест уровня', progress: 'Прогресс', admin: 'Админ',
      },
      common: {
        loading: 'Загрузка…', error: 'Что-то пошло не так', retry: 'Попробовать снова',
        save: 'Сохранить', cancel: 'Отмена', submit: 'Отправить', next: 'Далее',
        back: 'Назад', finish: 'Завершить', start: 'Начать', continue: 'Продолжить',
        correct: 'Правильно!', incorrect: 'Неправильно', xp: 'XP', streak: 'Серия',
        level: 'Уровень', accuracy: 'Точность', score: 'Результат',
        bookmark: 'В закладки', bookmarked: 'В закладках', words: 'слов',
        minutes: 'мин', easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный',
        filterByLevel: 'Фильтр по уровню', all: 'Все', search: 'Поиск…',
      },
      auth: {
        login: 'Войти', register: 'Создать аккаунт', email: 'Электронная почта',
        password: 'Пароль', logout: 'Выйти', welcome: 'С возвращением',
        noAccount: 'Нет аккаунта?', hasAccount: 'Уже есть аккаунт?',
        signUpFree: 'Зарегистрироваться',
      },
      home: {
        title: 'Добрый {{time}}, готов учиться?',
        morning: 'утро', afternoon: 'день', evening: 'вечер',
        continueExercises: 'Продолжить упражнения', startFlashcards: 'Флеш-карточки',
        reviewMistakes: 'Работа над ошибками', weeklyStreak: 'дней подряд',
        xpToday: 'XP сегодня', weakTopics: 'Слабые места', dueToday: 'на сегодня',
        noActivity: 'Начни учиться, чтобы создать серию!',
      },
      exercise: {
        title: 'Грамматические упражнения', fillBlank: 'Заполни пропуск',
        checkAnswer: 'Проверить', explanation: 'Объяснение',
        hint: 'Подсказка', sessionComplete: 'Сессия завершена!',
        questionsLeft: 'Осталось {{n}} вопросов', topic: 'Тема',
      },
      vocabulary: {
        title: 'Словарь', listView: 'Список', flashcardView: 'Карточки',
        dontKnow: 'Не знаю', hard: 'Сложно', know: 'Знаю', easy: 'Легко',
        definition: 'Определение', examples: 'Примеры', synonyms: 'Синонимы',
        antonyms: 'Антонимы', pronunciation: 'Произношение', translation: 'Перевод',
        mastered: 'Выучено', learning: 'Изучается', review: 'Повторение', new: 'Новое',
        cardsToday: '{{n}} карточек сегодня',
      },
      reading: {
        title: 'Чтение', comprehensionQuestions: 'Вопросы к тексту',
        readText: 'Прочитай текст и ответь на вопросы', timeToRead: '~{{n}} мин',
      },
      listening: {
        title: 'Аудирование', play: 'Воспроизвести', pause: 'Пауза', replay: 'Повторить',
        speed: 'Скорость', dictation: 'Диктант', comprehension: 'Понимание',
        typeHeard: 'Напечатай услышанное…', submitDictation: 'Проверить',
      },
      writing: {
        title: 'Письмо', wordCount: '{{n}} слов', minWords: 'Минимум {{n}} слов',
        submitReview: 'Отправить на проверку', analyzing: 'Анализируем…',
        overallScore: 'Общий балл', grammarScore: 'Грамматика',
        taskScore: 'Задание', coherenceScore: 'Связность', errors: 'Найдено ошибок',
        noErrors: 'Ошибок нет! Отлично!',
      },
      levelTest: {
        title: 'Тест уровня', readyTitle: 'Ты готов!',
        readyDesc: 'Все требования выполнены. Пройди тест для повышения уровня.',
        startTest: 'Начать тест', timeLeft: 'Осталось',
        passed: '🎉 Поздравляем! Уровень повышен!', failed: 'Пока не получилось',
        failedDesc: 'Продолжай практиковаться. Повтори через 24 часа.',
        score85: 'Нужно 85% для прохождения',
      },
      progress: {
        title: 'Мой прогресс', currentLevel: 'Текущий уровень',
        nextLevel: 'Следующий уровень', requirements: 'Требования',
        xpHistory: 'История XP', testHistory: 'История тестов',
        estimatedTime: 'Примерное время до следующего уровня',
      },
      mistakes: {
        title: 'Работа над ошибками', weakAreas: 'Слабые области',
        noMistakes: 'Ошибок нет — продолжай в том же духе!', repeatTopic: 'Повторить',
        occurrences: '{{n}}× неверно',
      },
      admin: {
        title: 'Панель администратора', importData: 'Импорт контента',
        validJson: 'Корректный JSON ✓', invalidJson: 'Некорректный JSON ✗',
        imported: 'Добавлено: {{n}}', skipped: 'Пропущено: {{n}}', errors: 'Ошибок: {{n}}',
        importBtn: 'Импортировать', userStats: 'Статистика пользователей',
      },
    },
  },
  hy: {
    translation: {
      nav: {
        home: 'Գլխավոր', lessons: 'Քերականություն', exercises: 'Վարժություններ',
        quiz: 'Թեստ', vocabulary: 'Բառարան', reading: 'Կարդալ',
        listening: 'Լսել', writing: 'Գրել', mistakes: 'Սխալներ',
        levelTest: 'Մակարդակի թեստ', progress: 'Առաջընթաց', admin: 'Ադմին',
      },
      common: {
        loading: 'Բեռնվում է…', error: 'Սխալ', retry: 'Կրկին փորձել',
        save: 'Պահպանել', cancel: 'Չեղարկել', submit: 'Ուղարկել', next: 'Հաջորդ',
        back: 'Հետ', finish: 'Ավարտել', start: 'Սկսել', continue: 'Շարունակել',
        correct: 'Ճիշտ!', incorrect: 'Սխալ', xp: 'XP', streak: 'Շարան',
        level: 'Մակարդակ', accuracy: 'Ճշտություն', score: 'Արդյունք',
        bookmark: 'Էջանիշ', bookmarked: 'Ավելացված', words: 'բառ',
        minutes: 'ր', easy: 'Հեշտ', medium: 'Միջին', hard: 'Դժվար',
        filterByLevel: 'Ֆիլտր ըստ մակարդակի', all: 'Բոլոր', search: 'Որոնել…',
      },
      auth: {
        login: 'Մուտք', register: 'Գրանցվել', email: 'Էլ. փոստ',
        password: 'Գաղտնաբառ', logout: 'Ելք', welcome: 'Բարի վերադարձ',
        noAccount: 'Հաշիվ չկա՞', hasAccount: 'Արդեն հաշիվ կա՞',
        signUpFree: 'Գրանցվել անվճար',
      },
      home: {
        title: 'Բարի {{time}}, պատրա՞ст ես սովորել',
        morning: 'առավոտ', afternoon: 'կեսօր', evening: 'երեկո',
        continueExercises: 'Շարունակել', startFlashcards: 'Քարտեր',
        reviewMistakes: 'Աշխատել սխալների վրա', weeklyStreak: 'օր անընդմեջ',
        xpToday: 'XP այսօր', weakTopics: 'Թույլ կողմեր', dueToday: 'այսօրվա',
        noActivity: 'Սկսիր սովորել!',
      },
      exercise: {
        title: 'Քերականության վարժություններ', fillBlank: 'Լրացրու բացը',
        checkAnswer: 'Ստուգել', explanation: 'Բացատրություն',
        hint: 'Հուշ', sessionComplete: 'Պարապմունքն ավարտված է!',
        questionsLeft: 'Մնաց {{n}} հարց', topic: 'Թեմա',
      },
      vocabulary: {
        title: 'Բառարան', listView: 'Ցուցակ', flashcardView: 'Քարտեր',
        dontKnow: 'Չգիտեմ', hard: 'Դժվար', know: 'Գիտեմ', easy: 'Հեշտ',
        definition: 'Սահմանում', examples: 'Օրինակներ', synonyms: 'Հոմանիշներ',
        antonyms: 'Հականիշներ', pronunciation: 'Արտասանություն', translation: 'Թարգմանություն',
        mastered: 'Յուրացված', learning: 'Սովորում', review: 'Կրկնություն', new: 'Նոր',
        cardsToday: '{{n}} քարտ այսօր',
      },
      reading: { title: 'Կարդալ', comprehensionQuestions: 'Հարցեր', readText: 'Կարդա և պատասխանիր', timeToRead: '~{{n}} ր' },
      listening: { title: 'Լսել', play: 'Նվագարկել', pause: 'Դադար', replay: 'Կրկնել', speed: 'Արագություն', dictation: 'Թելադրություն', comprehension: 'Հասկացողություն', typeHeard: 'Գրիր լսածը…', submitDictation: 'Ստուգել' },
      writing: { title: 'Գրել', wordCount: '{{n}} բառ', minWords: 'Նվազ. {{n}} բառ', submitReview: 'Ուղարկել ստուգման', analyzing: 'Վերլուծվում է…', overallScore: 'Ընդհանուր', grammarScore: 'Քերականություն', taskScore: 'Առաջադրանք', coherenceScore: 'Համահունչություն', errors: 'Սխալներ', noErrors: 'Սխալ չկա!' },
      levelTest: { title: 'Մակարդակի թեստ', readyTitle: 'Դու պատրաст ես!', readyDesc: 'Բոլոր պահանջները կատարված են:', startTest: 'Սկսել թեստը', timeLeft: 'Մնաց', passed: '🎉 Շնորհավոր! Մակարդակ բարձրացավ!', failed: 'Դեռ չստացվեց', failedDesc: '24 ժամ հետո փորձիր:', score85: '85% անհրաժեշտ է' },
      progress: { title: 'Իմ առաջընթաց', currentLevel: 'Ընթացիկ մակարդակ', nextLevel: 'Հաջորդ մակարդակ', requirements: 'Պահանջներ', xpHistory: 'XP պատմություն', testHistory: 'Թեստերի պատմություն', estimatedTime: 'Մոտ. ժամանակ հաջորդ մակ.' },
      mistakes: { title: 'Սխալների հետագծում', weakAreas: 'Թույլ բնագավառ', noMistakes: 'Սխալ չկա!', repeatTopic: 'Կրկնել', occurrences: '{{n}}× սխալ' },
      admin: { title: 'Ադմին կառավարիչ', importData: 'Ներմուծել', validJson: 'Ճիշտ JSON ✓', invalidJson: 'Սխալ JSON ✗', imported: 'Ավելացված: {{n}}', skipped: 'Բաց թողնված: {{n}}', errors: 'Սխալ: {{n}}', importBtn: 'Ներմուծել', userStats: 'Օգտատերերի վիճակագրություն' },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('toefl_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => localStorage.setItem('toefl_lang', lng));

export default i18n;
