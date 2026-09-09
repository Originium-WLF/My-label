/* =========================================================================
   ДАННЫЕ САЙТА — правь только этот файл, чтобы обновить контент.
   ========================================================================= */

/* Роли для эффекта печатной машинки в шапке */
const ROLES = [
  'Full-stack разработчик',
  'Люблю чистый код',
  'Строю инструменты для разработчиков',
  'Open source энтузиаст',
];

/* -------------------------------------------------------------------------
   ПРОЕКТЫ
   tags   — используются для фильтров (первый тег = категория)
   status — 'live' | 'wip' | 'archived'
   links  — любые ссылки: { label, url }
   ------------------------------------------------------------------------- */
const PROJECTS = [
  {
    title: 'My Label',
    tagline: 'Лейбл и витрина собственных проектов',
    description:
      'Личная площадка, где собраны релизы, эксперименты и всё, что выходит под моим именем. Статика, ноль зависимостей, мгновенная загрузка.',
    tags: ['Web', 'HTML', 'CSS', 'JavaScript'],
    status: 'live',
    year: '2026',
    accent: 1,
    links: [{ label: 'GitHub', url: 'https://github.com/Originium-WLF/My-label' }],
  },
  {
    title: 'Originium Core',
    tagline: 'Ядро для быстрых прототипов',
    description:
      'Набор переиспользуемых модулей: роутинг, состояние, работа с API и утилиты. Позволяет собрать рабочий прототип за вечер.',
    tags: ['Library', 'TypeScript', 'Node.js'],
    status: 'wip',
    year: '2026',
    accent: 2,
    links: [{ label: 'GitHub', url: 'https://github.com/Originium-WLF' }],
  },
  {
    title: 'WLF Bot',
    tagline: 'Многофункциональный бот для сообществ',
    description:
      'Модерация, роли, статистика и мини-игры. Модульная архитектура: каждая команда — отдельный плагин, который можно включить на лету.',
    tags: ['Bot', 'Python', 'API'],
    status: 'live',
    year: '2025',
    accent: 3,
    links: [{ label: 'GitHub', url: 'https://github.com/Originium-WLF' }],
  },
  {
    title: 'Pixel Forge',
    tagline: 'Редактор пиксель-арта в браузере',
    description:
      'Слои, палитры, экспорт в спрайт-лист и покадровая анимация. Работает офлайн, всё хранится локально.',
    tags: ['Web', 'Canvas', 'JavaScript'],
    status: 'wip',
    year: '2025',
    accent: 4,
    links: [{ label: 'GitHub', url: 'https://github.com/Originium-WLF' }],
  },
  {
    title: 'Dotfiles',
    tagline: 'Моё окружение разработки',
    description:
      'Конфиги терминала, редактора и тайлингового менеджера окон. Один скрипт разворачивает всю среду на чистой системе.',
    tags: ['Tools', 'Shell', 'Linux'],
    status: 'live',
    year: '2024',
    accent: 5,
    links: [{ label: 'GitHub', url: 'https://github.com/Originium-WLF' }],
  },
  {
    title: 'Lumen API',
    tagline: 'Лёгкий REST-бэкенд',
    description:
      'Аутентификация, роли, лимиты запросов и автогенерация документации. Проектировался как стартовая точка для новых сервисов.',
    tags: ['Backend', 'Node.js', 'PostgreSQL'],
    status: 'archived',
    year: '2024',
    accent: 6,
    links: [{ label: 'GitHub', url: 'https://github.com/Originium-WLF' }],
  },
];

/* -------------------------------------------------------------------------
   СТЕК
   ------------------------------------------------------------------------- */
const STACK = [
  { group: 'Frontend', items: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Vite'] },
  { group: 'Backend',  items: ['Node.js', 'Python', 'Express', 'FastAPI', 'REST', 'WebSocket'] },
  { group: 'Данные',   items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite'] },
  { group: 'Инструменты', items: ['Git', 'Docker', 'Linux', 'CI/CD', 'Figma'] },
];

/* -------------------------------------------------------------------------
   КОНТАКТЫ
   icon — ключ из набора иконок в main.js: github | telegram | discord | mail
   ------------------------------------------------------------------------- */
const CONTACTS = [
  { label: 'GitHub',   handle: '@Originium-WLF', url: 'https://github.com/Originium-WLF', icon: 'github' },
  { label: 'Telegram', handle: '@Originium_WLF', url: 'https://t.me/', icon: 'telegram' },
  { label: 'Discord',  handle: 'originium_wlf',  url: 'https://discord.com/', icon: 'discord' },
  { label: 'Email',    handle: 'Написать письмо', url: 'mailto:hello@example.com', icon: 'mail' },
];
