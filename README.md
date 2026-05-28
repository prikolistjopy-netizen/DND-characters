# D&D Character Seed Generator

Простой MVP на Vite + React + TypeScript: одна кнопка генерирует зерно D&D-персонажа и готовый английский prompt draft для fantasy character art.

## Как запустить

```bash
npm install
npm run dev
```

Затем откройте локальный адрес, который покажет Vite в терминале.

## Команды

- `npm run dev` — запуск приложения для разработки.
- `npm run build` — проверка TypeScript и сборка production-версии.
- `npm run test` — быстрые тесты генератора.

## Структура

- `src/data/seedData.ts` — все списки режимов, классов, рас, силуэтов, экипировки, поз и визуальных эффектов.
- `src/lib/generator.ts` — логика взвешенной генерации, совместимости, проверки конфликтов и сборки prompt draft.
- `src/App.tsx` — простой интерфейс: кнопка генерации, Seed Output, Prompt Draft, Copy-кнопки и Debug / Generation Trace.
- `src/styles.css` — стили страницы.
- `src/lib/generator.test.ts` — базовые тесты, которые много раз генерируют персонажей и проверяют критичные запреты.
