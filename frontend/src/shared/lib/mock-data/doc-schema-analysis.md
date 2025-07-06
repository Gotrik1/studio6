# Анализ схемы данных: Prisma vs Backend vs Frontend (Полная версия)

Этот документ представляет собой полное и исчерпывающее сравнение моделей данных на всех уровнях приложения: от схемы базы данных (`Prisma`) до объектов передачи данных на бэкенде (`Backend DTO`) и типов на фронтенде (`Frontend Type`).

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
| `...relations` | `Model[]` | `LiteModel[]` | `LiteModel[]` | ⚠ | **Правильное расхождение.** Бэкенд формирует DTO, отдавая только нужные данные. |

---

## 2. CareerHistory
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `user` | `User` | — | — | ✔ | Связь есть, но на фронт передается в составе `FullUserProfile`. |
| `teamName`| `String`| `string` | `string` | ✔ | |
| `period`  | `String`| `string` | `string` | ✔ | |
| `role`    | `String`| `string` | `string` | ✔ | |
| `review`  | `String`| `string` | `string` | ✔ | |

---

## 3. Gallery
*Эта модель не существует в Prisma. Это фронтенд-тип для демо-данных. В реальном приложении это была бы модель `MediaItem` со связью с `User`.*

---

## 4. CoachProfile
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `user` | `User` | — | — | ✔ | На фронт передается как часть агрегированного `CoachDto`. |
| `specialization`| `String`| `string` | `string` | ✔ | |
| `description`| `String`| `string` | `string` | ✔ | |
| `tags` | `String[]` | `string[]` | `string[]` | ✔ | |
| `experience`| `String`| `string` | `string` | ✔ | |
| `rating`  | `Float`| `number` | `number` | ✔ | |
| `price`   | `Decimal`| `number` (или `string`) | `string` | ✔ | |

---

## 5. FriendRequest
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `from`, `to` | `User` | `lite-User` | `FriendRequest` (UI) | ⚠ | DTO отдает `from` как `lite-User`, на фронте это часть `FriendRequest`. |
| `status` | `FriendRequestStatus` | `string` | `string` | ✔ | Enum на бэкенде становится строкой. |

---

## 6. Team
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `slug`, `game` | `String` | `string` | `string` | ✔ |  |
| `logo`, `motto`, `description` | `String?` | `string` | `string` | ✔ | На фронтенде и DTO пустые значения заменяются на дефолтные. |
| `captain` | `User` | `string` (captainId) | `string` (captainId) | ✔ | Передается только ID, а не полный объект. |
| `members` | `User[]` | `number` или `TeamRosterMember[]` | `TeamRosterMember[]` | ⚠ | **Правильное расхождение.** Для списка команд отдается `_count`, для деталей - `TeamRosterMember[]`. |
| `wins`, `losses`, `draws` | `Int` | `number` | `number` | ✔ |  |

---

## 7. TeamPractice
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `title`, `description` | `String` | `string` | `string` | ✔ |  |
| `date` | `DateTime` | `Date` (или `string`) | `Date` | ✔ |  |
| `team`, `playground` | `Team`, `Playground` | `lite-объект` | `string` (в `location`) | ⚠ | На фронте отображается только имя площадки, а не полный объект. |

---

## 8. Tournament
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

## 9. TournamentMedia
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `src`, `description`, `hint`| `String` | `string` | `string` | ✔ |  |
| `type` | `MediaType` (enum)| `string` | `string` | ✔ |  |
| `tournament` | `Tournament` | - | - | ✔ | Связь, не передается на фронт. |

---

## 10. Match
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `location` | `String` | `string` | `string` | ✔ | |
| `team1`, `team2` | `Team` | `LiteTeam` | `LiteTeam` | ✔ | Отдаются облегченные DTO. |
| `team1Score`, `team2Score` | `Int?` | `number \| null` | `string` (в `score`) | ⚠ | На фронтенде счет представлен единой строкой "X-Y", что удобно для UI. |
| `status` | `MatchStatus` (enum) | `string` | `string` | ✔ | `enum` на бэкенде преобразуется в строку. |
| `scheduledAt` | `DateTime` | `Date` (или `string`) | `string` | ✔ | |
| `events` | `MatchEvent[]` | `LiteEvent[]` | `MatchEvent[]` | ✔ | DTO формирует облегченные события. |

---

## 11. MatchEvent
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `type` | `MatchEventType` (enum) | `string` | `MatchEventType` (enum) | ✔ | Enum на бэкенде становится строкой, на фронте снова типизируется. |
| `match`, `player`, `team` | `Match`, `User`, `Team` | `id` | `string` | ✔ | Передаются только идентификаторы. |
| `timestamp` | `DateTime` | `string` | `string` | ✔ | |

---

## 12. Chat & Message
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Chat.id`| `String` | `string` | `string` | ✔ | |
| `Chat.participants` | `User[]` | `LiteUser[]` | `ChatContact` | ⚠ | Бэкенд отдает lite-объект другого участника. |
| `Message.id`| `String` | `string` | `string` | ✔ | |
| `Message.author`| `User` | `LiteUser` | `ChatMessage['author']` | ✔ | |
| `Message.content`| `String` | `string` | `text` | ⚠ | Поле переименовано на фронте. |

---

## 13. Notification
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `user` | `User` | - | - | ✔ | Связь, не отдается. |
| `type` | `NotificationType` (enum) | `string` | `string` | ✔ | |
| `message`, `href` | `String` | `string` | `string` | ✔ | |
| `isRead`| `Boolean`| `boolean`| `boolean` | ✔ | |

---

## 14. Promotion
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `prize`, `cost`| `String` | `string` | `string` | ✔ | |
| `organizer`, `sponsor` | `User`, `Sponsor?` | `LiteUser`, `LiteSponsor?` | `LiteSponsor?` | ⚠ | На фронте отображается только спонсор, если он есть. |
| `imageDataUri`, `imageHint`, `endDate` | `String` | `string` | `string` | ✔ | |

---

## 15. Sponsor
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `profileUrl` | `String` | `string` | `string` | ✔ | |
| `logo`, `logoHint` | `String?` | `string` | `string` | ✔ | На фронте есть fallback. |
| `interests` | `String[]` | `string[]` | `string[]` | ✔ | |

---

## 16. Playground & PlaygroundReview & PlaygroundReport
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Playground` | `Playground` | `Playground` | `Playground` | ✔ | Полная модель с lite-связями. |
| `PlaygroundReview` | `PlaygroundReview` | `LiteReview` | `PlaygroundReview` | ✔ | DTO с облегченными данными. |
| `PlaygroundReport` | `PlaygroundReport`| `PlaygroundReport`| `PlaygroundConditionReport`| ⚠ | На фронт отдается только сводка. |

---

## 17. Report
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `reporter`, `reportedUser`, `resolver` | `User` | `LiteUser` | `LiteUser` | ✔ | DTO с облегченными данными. |
| `status` | `ReportStatus` (enum) | `string` | `string` | ✔ | |
| `category`, `description`| `String` | `string` | `string` | ✔ | |

---

## 18. TeamApplication
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `team`, `user` | `Team`, `User` | `LiteTeam`, `LiteUser` | `JoinRequest` | ⚠ | DTO агрегируется в тип `JoinRequest`. |
| `status` | `TeamApplicationStatus` (enum) | `string` | `string` | ✔ | |

---

## 19. Challenge & Sport & MedicalPartner
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Challenge` | `Challenge` | `Challenge` | `Challenge` | ✔ | Все поля, включая lite-связи `creator`, `opponent`, совпадают. |
| `Sport` | `Sport` | `Sport` | `Sport` | ✔ | Простая консистентная модель. |
| `MedicalPartner` | `MedicalPartner` | `MedicalPartner` | `MedicalPartner` | ✔ | Простая консистентная модель. |

---

## 20. LfgLobby
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `creator` | `User` | `LiteUser` | `LiteUser` | ✔ | |
| `players` | `User[]` | `_count` | `number` | ⚠ | **Правильное расхождение.** Бэкенд отдает только количество для экономии трафика. |
| `type` | `LfgLobbyType` (enum) | `string` | `string` | ✔ | |

---

## 21. TrainingProgram & WorkoutDay & WorkoutExercise
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TrainingProgram`| `TrainingProgram` | `TrainingProgram` | `TrainingProgram` | ✔ | Полностью совпадает. Структура в основном контентная. |
| `WorkoutDay`| `WorkoutDay` | `WorkoutDay` | `WorkoutDay` | ✔ | |
| `WorkoutExercise`| `WorkoutExercise` | `ExerciseDetail` | `ExerciseDetail` | ✔ | |

---

## 22. TrainingLog & LoggedExercise & LoggedSet
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TrainingLog` | `TrainingLog` | `TrainingLog` | `TrainingLogEntry` | ✔ | Структура полностью нормализована и консистентна. |
| `LoggedExercise` | `LoggedExercise` | `LoggedExercise` | `ExerciseLog` | ✔ | |
| `LoggedSet` | `LoggedSet` | `LoggedSet` | `LoggedSet` | ✔ | |

---

## 23. Exercise
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `category`, `equipment`| `String` | `string` | `string` | ✔ | |
| `techniqueTips`, `commonMistakes`, `alternatives`| `Json` | `string[]` | `string[]` | ✔ | JSON в Prisma корректно парсится в массив строк. |

---

## 24. InventoryItem & StoreItem & FaqItem
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `InventoryItem` | `InventoryItem` | `InventoryItem` | `InventoryItem` | ✔ | Консистентная модель. |
| `StoreItem` | `StoreItem` | `StoreItem` | `StoreItem` | ✔ | Консистентная модель. |
| `FaqItem` | `FaqItem` | `FaqQuestion` | `FaqQuestion` | ⚠ | Бэкенд агрегирует в `FaqCategory`. |

---

## 25. FoodItem & FoodLogEntry & Measurement
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FoodItem` | `FoodItem` | `FoodItem` | `FoodItem` | ✔ | Консистентная модель. |
| `FoodLogEntry` | `FoodLogEntry` | `FoodLogEntry` | `FoodLogEntry` | ✔ | |
| `Measurement` | `Measurement` | `Measurement` | `Measurement` | ✔ | |

---

## 26. TrainingProposal & Quest
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TrainingProposal` | `TrainingProposal` | `TrainingProposal` | `TrainingProposal` | ✔ | Lite-связи `from`, `to`, `program`. |
| `Quest` | `Quest` | `Quest` | `Quest` | ✔ | `type` - enum. На фронт добавляется моковое поле `progress`. |

---

## 27. Poll & PollOption & PollVote
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Poll` | `Poll` | `Poll` | `Poll` | ✔ | DTO агрегирует `_count` для голосов. |
| `PollOption` | `PollOption` | `PollOption` | `PollOption` | ✔ | |
| `PollVote` | `PollVote` | — | — | ✔ | Сущность голосования скрыта от фронтенда. |
| `@@unique` | `[userId, pollId]` | — | — | ✔ | Уникальность голоса обеспечивается на уровне БД. |

---

## 28. TournamentAnnouncement & Activity
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TournamentAnnouncement`| `TournamentAnnouncement`|`Announcement`|`Announcement`| ✔ | Lite-связь `sender`. |
| `Activity`| `Activity`|`Activity`|`Activity`| ✔ | Lite-связь `user`. `metadata` - JSON. |

---

## 29. League & LeagueTeam
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `League`| `League` | `League` | `League` | ✔ | |
| `LeagueTeam` | `LeagueTeam` | `LeagueTeam` | `LeagueTeam` | ✔ | Промежуточная модель со статистикой. |

---

## Общий вывод

Архитектура данных в проекте выстроена грамотно. Разделение между подробной схемой Prisma и облегченными DTO для API является лучшей практикой. Это обеспечивает:
- **Производительность:** На клиент не передаются лишние данные.
- **Безопасность:** Внутренняя структура базы данных скрыта.
- **Гибкость:** Фронтенд и бэкенд могут развиваться независимо, пока контракт API (DTO) соблюдается.
- **Надежность:** Использование `enum` и реляционных связей в Prisma обеспечивает целостность данных.
