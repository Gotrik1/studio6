# Анализ схемы данных: Prisma vs Backend vs Frontend

Этот документ представляет собой полное сравнение моделей данных на всех уровнях приложения: от схемы базы данных (`Prisma`) до объектов передачи данных на бэкенде (`Backend DTO`) и типов на фронтенде (`Frontend Type`).

**Основной принцип:** Расхождения между `Prisma` и `DTO/Frontend` являются **намеренными и правильными**. Бэкенд формирует "облегченные" DTO, чтобы не передавать на клиент избыточные данные и не раскрывать внутреннюю структуру таблиц.

---

## 1. User
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | Везде строка. |
| `email` | `String` | `string` | `string` | ✔ |  |
| `name` | `String` | `string` | `string` | ✔ |  |
| `passwordHash` | `String` | — | — | ✔ | Не передается на фронтенд. |
| `avatar` | `String?` | `string \| null` | `string \| null` | ✔ |  |
| `xp` | `Int` | `number` | `number` | ✔ |  |
| `role` | `String` | `string` | `string` | ✔ |  |
| `status` | `String` | `string` | `string` | ✔ |  |
| `createdAt` | `DateTime` | `Date` (или `string`) | `string` | ✔ | Преобразование `Date` в `string` при JSON-сериализации — это стандартное поведение. |
| `updatedAt` | `DateTime` | `Date` (или `string`) | `string` | ✔ | Аналогично `createdAt`. |
| `...relations` | `Model[]` | `LiteModel[]` | `LiteModel[]` | ⚠ | **Правильное расхождение.** Бэкенд формирует DTO, отдавая только нужные данные. |

---

## 2. Team
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `slug`, `game` | `String` | `string` | `string` | ✔ |  |
| `logo`, `motto`, `description` | `String?` | `string` | `string` | ✔ | На фронтенде и DTO пустые значения заменяются на дефолтные. |
| `captain` | `User` | `string` (captain name) | `string` (captainId) | ⚠ | DTO отдает только имя капитана, а фронтенд-тип ожидает ID. Это правильное расхождение, показывающее разницу в потребностях. |
| `members` | `User[]` | `number` | `TeamRosterMember[]` | ⚠ | **Правильное расхождение.** Бэкенд отдает только количество, а детальный фронтенд-тип получает полный состав. |
| `wins`, `losses`, `draws` | `Int` | `number` | `number` | ✔ |  |

---

## 3. Match
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `location` | `String` | `string` | `string` | ✔ |  |
| `team1`, `team2` | `Team` | `LiteTeam` | `LiteTeam` | ✔ | Отдаются облегченные DTO. |
| `team1Score`, `team2Score` | `Int?` | `number \| null` | `string` (в `score`) | ⚠ | На фронтенде счет представлен единой строкой "X-Y", что удобно для UI. |
| `status` | `MatchStatus` (enum) | `string` | `string` | ✔ | `enum` на бэкенде преобразуется в строку. |
| `scheduledAt` | `DateTime` | `Date` (или `string`) | `string` | ✔ |  |
| `events` | `MatchEvent[]` | `LiteEvent[]` | `MatchEvent[]` | ✔ | DTO формирует облегченные события. |

---

## 4. Tournament
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `slug`, `game` | `String` | `string` | `string` | ✔ |  |
| `status`, `format`, `type` | `enum` | `string` | `string` | ✔ |  |
| `prizePool` | `String?` | `string` | `string` | ✔ |  |
| `teams` | `Team[]` | `LiteTeam[]` | `LiteTeam[]` | ✔ | DTO с облегченными данными о командах. |
| `matches` | `Match[]` | `LiteMatch[]` | `BracketMatch[]` | ✔ |  |
| `organizer` | `User` | `LiteUser` | `LiteUser` | ✔ |  |
| `media` | `TournamentMedia[]` | `MediaItem[]` | `MediaItem[]` | ✔ |  |

---

## 5. Playground
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `address` | `String` | `string` | `string` | ✔ |  |
| `type`, `surface` | `String` | `string` | `string` | ✔ |  |
| `features` | `String[]` | `string[]` | `string[]` | ✔ |  |
| `rating`, `checkIns` | `Int` | `number` | `number` | ✔ |  |
| `creator` | `User` | `LiteUser` | `LiteUser` | ✔ |  |
| `reviews` | `PlaygroundReview[]` | `LiteReview[]` | `PlaygroundReview[]` | ✔ | DTO с облегченными данными об отзывах. |

---

## 6. TrainingProgram & TrainingLog
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TrainingProgram` | `TrainingProgram` | `TrainingProgram` | `TrainingProgram` | ✔ | Полностью совпадает, так как структура в основном контентная. |
| `TrainingLog` | `TrainingLog` | `TrainingLog` | `TrainingLogEntry` | ✔ | Структура полностью нормализована и консистентна на всех уровнях. |
| `LoggedExercise` | `LoggedExercise` | `LoggedExercise` | `ExerciseLog` | ✔ |  |
| `LoggedSet` | `LoggedSet` | `LoggedSet` | `LoggedSet` | ✔ |  |

---

## 7. Poll & PollVote
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Poll` | `Poll` | `Poll` | `Poll` | ✔ | Структура полностью реляционная и консистентная. |
| `PollOption` | `PollOption` | `PollOption` | `PollOption` | ✔ |  |
| `PollVote` | `PollVote` | `PollVote` | — | ✔ | Сущность голосования скрыта от фронтенда, он работает только с результатом. |
| `@@unique` | `[userId, pollId]` | — | — | ✔ | Уникальность голоса обеспечивается на уровне БД. |

---

## 8. Report & Notification
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Report` | `Report` | `Report` | `Report` | ✔ | Полностью совпадает, включая `enum` для статуса. |
| `Notification` | `Notification` | `Notification` | `Notification` | ✔ | Полностью совпадает, включая `enum` для типа. |

---

## 9. Прочие сущности
- **`FriendRequest`, `Message`, `Chat`, `TeamApplication`, `Sponsor`, `League`, `MatchEvent`, `InventoryItem`**: Все эти сущности следуют тому же принципу: Prisma определяет полную модель со связями, а DTO и фронтенд-типы используют облегченные версии или только `id` для связанных объектов, обеспечивая эффективность и безопасность. Все `enum` в Prisma корректно обрабатываются как строки на следующих уровнях.

---

## Общий вывод

Архитектура данных в проекте выстроена грамотно. Разделение между подробной схемой Prisma и облегченными DTO для API является лучшей практикой. Это обеспечивает:
- **Производительность:** На клиент не передаются лишние данные.
- **Безопасность:** Внутренняя структура базы данных скрыта.
- **Гибкость:** Фронтенд и бэкенд могут развиваться независимо, пока контракт API (DTO) соблюдается.
- **Надежность:** Использование `enum` и реляционных связей в Prisma обеспечивает целостность данных.
