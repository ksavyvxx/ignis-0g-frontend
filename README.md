# Ignis

Каркас React и TypeScript на Vite с TanStack Query, Tailwind CSS 4 и shadcn/ui. Требуется Node.js 20.19+ или 22.12+.

```sh
npm ci
npm run dev
```

## Где верстать

- `src/app/app.tsx` — трёхпанельный экран с карточкой эксперимента, вкладками и правой панелью контекста.
- `src/app/sidebar.tsx` — каталог с поиском, фильтрами по теме и статусу, сворачиваемыми группами.
- `src/components/ui` — компоненты shadcn/ui. Для нового компонента используйте, например, `npx shadcn@latest add card`.
- `src/index.css` — токены темы Tailwind. Цвета и адаптивная сетка рабочей области заданы в `src/app/workspace.css`.
- `src/domain/types.ts` — доменные типы.
- `src/api/queries.ts` — фабрики опций запросов и ключей кэша. Их можно передавать в `useQuery`, `useQueries` и `prefetchQuery`.
- `src/mocks/catalog.ts` и `src/mocks/data.ts` — демо-каталог NASA Experiments, темы, источники и выводы.

```tsx
import { useQuery } from "@tanstack/react-query"
import { studyQueries } from "@/api/queries"

function FindingsCount({ studyId }: { studyId: string }) {
  const { data, isPending, isError } = useQuery(studyQueries.findings(studyId))

  if (isPending) return <p>Загрузка…</p>
  if (isError) return <p>Не удалось загрузить находки.</p>
  return <p>Находки: {data.length}</p>
}
```

## Подключение бэкенда

Моки включены по умолчанию. Для подключения бэкенда скопируйте `.env.example` в `.env.local`, установите `VITE_USE_MOCKS=false`, укажите `VITE_API_BASE_URL` и перезапустите Vite. Для сервера на другом origin бэкенд должен разрешать CORS для фронтенда.

Клиент в `src/api/client.ts` использует следующий стартовый контракт. Ответ успешного запроса — JSON.

| GET относительно базового URL | Ответ |
| --- | --- |
| `/studies` | `Study[]` |
| `/studies/:id` | `Study` |
| `/studies/:id/findings` | `Finding[]` |
| `/studies/:id/sources` | `Source[]` |
| `/studies/:id/relations` | `Relation[]` |

Находки и источники принадлежат исследованию. Находка ссылается на источники по ID, отношение связывает две находки внутри одного исследования. В моках неизвестный ID даёт HTTP 404, а пустая коллекция возвращает `[]`. Конкретные поля и пути можно согласовать с бэкендом в доменных типах и API-клиенте.

`npm run typecheck` проверяет типы, `npm run build` также создаёт сборку в `dist/`, `npm run preview` запускает её локально.

Иконки интерфейса используют Lucide. IBM Plex Sans и IBM Plex Mono поставляются локально в латинском и кириллическом начертаниях.
