# Анализ схемы данных: Prisma vs Backend vs Frontend (Полная версия)

Этот документ представляет собой полное и исчерпывающее сравнение моделей данных на всех уровнях приложения: от схемы базы данных (`Prisma`) до объектов передачи данных на бэкенде (`Backend DTO`) и типов на фронтенде (`Frontend Type`).

**Основной принцип:** Расхождения между `Prisma` и `DTO/Frontend` являются **намеренными и правильными**. Бэкенд формирует "облегченные" DTO, чтобы не передавать на клиент избыточные данные и не раскрывать внутреннюю структуру таблиц.

---

## 1. User
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | Везде строка. |
| `email` | `String` | `string` | `string` | ✔ | |
| `name` | `String` | `string` | `string` | ✔ | |
| `passwordHash` | `String` | — | — | ✔ | Не передается на фронтенд. |
| `avatar` | `String?` | `string \| null` | `string \| null` | ✔ | |
| `xp` | `Int` | `number` | `number` | ✔ | |
| `role` | `String` | `string` | `string` | ✔ | |
| `status` | `String` | `string` | `string` | ✔ | |
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
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| - | — | — | `GalleryItem` | ⚠ | *Эта модель не существует в Prisma. Это фронтенд-тип для демо-данных. В реальном приложении это была бы модель `MediaItem` со связью с `User`.* |

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
| Поле         | Prisma                | Backend DTO/entity | Frontend Type        | Совпадает | Комментарий                                                             |
| :---         | :---                  | :---               | :---                 | :---      | :---                                                                    |
| `id`         | `String`              | `string`           | `string`             | ✔         |                                                                         |
| `from`, `to` | `User`                | `lite-User`        | `FriendRequest` (UI) | ⚠         | DTO отдает `from` как `lite-User`, на фронте это часть `FriendRequest`. |
| `status`     | `FriendRequestStatus` | `string`           | `string`             | ✔         | Enum на бэкенде становится строкой.                                     |

---

## 6. Team
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `slug`, `game` | `String` | `string` | `string` | ✔ | |
| `logo`, `motto`, `description` | `String?` | `string` | `string` | ✔ | На фронтенде и DTO пустые значения заменяются на дефолтные. |
| `captain` | `User` | `string` (captainId) | `string` (captainId) | ✔ | Передается только ID, а не полный объект. |
| `members` | `User[]` | `number` или `TeamRosterMember[]` | `TeamRosterMember[]` | ⚠ | **Правильное расхождение.** Для списка команд отдается `_count`, для деталей - `TeamRosterMember[]`. |
| `wins`, `losses`, `draws` | `Int` | `number` | `number` | ✔ | |

---

## 7. TeamPractice
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `title`, `description` | `String` | `string` | `string` | ✔ | |
| `date` | `DateTime` | `Date` (или `string`) | `Date` | ✔ | |
| `team`, `playground` | `Team`, `Playground` | `lite-объект` | `string` (в `location`) | ⚠ | На фронте отображается только имя площадки, а не полный объект. |

---

## 8. Tournament
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `slug`, `game` | `String` | `string` | `string` | ✔ | |
| `status`, `format`, `type` | `enum` | `string` | `string` | ✔ | |
| `prizePool` | `String?` | `string` | `string` | ✔ | |
| `teams` | `Team[]` | `LiteTeam[]` | `LiteTeam[]` | ✔ | DTO с облегченными данными о командах. |
| `matches` | `Match[]` | `LiteMatch[]` | `BracketMatch[]` | ✔ | |
| `organizer` | `User` | `LiteUser` | `LiteUser` | ✔ | |
| `media` | `TournamentMedia[]` | `MediaItem[]` | `MediaItem[]` | ✔ | |

---

## 9. TournamentMedia
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `src`, `description`, `hint`| `String` | `string` | `string` | ✔ | |
| `type` | `MediaType` (enum)| `string` | `string` | ✔ | |
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

## 12. Chat
| Поле           | Prisma     | Backend DTO/entity       | Frontend Type        | Совпадает | Комментарий                                                  |
| :---           | :---       | :---                     | :---                 | :---      | :---                                                         |
| `id`           | `String`   | `string`                 | `string`             | ✔         |                                                              |
| `participants` | `User[]`   | `LiteUser[]`             | `ChatContact`        | ⚠         | DTO агрегируется в тип `ChatContact`.                        |
| `messages`     | `Message[]`| `LiteMessage` (last one) | `lastMessage: string`| ⚠         | На фронт передается только последнее сообщение в виде строки.|
| `name`         | `String?`  | `string?`                | `name: string`       | ✔         |                                                              |
| `type`         | `ChatType` | `string`                 | `string`             | ✔         | `enum` на бэке.                                              |

---

## 13. Message
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `author` | `User` | `LiteUser` | `ChatMessage['author']` | ✔ | DTO с lite-объектом пользователя. |
| `chat` | `Chat` | - | - | ✔ | Связь, не отдается на фронт. |
| `content` | `String` | `string` | `text` | ⚠ | На фронте поле называется `text` для универсальности. |
| `createdAt`| `DateTime` | `Date` (или `string`) | `string`| ✔ | |

---

## 14. Notification
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `user` | `User` | — | — | ✔ | Связь, не отдается. |
| `type` | `NotificationType` (enum) | `string` | `string` | ✔ | |
| `message`, `href` | `String` | `string` | `string` | ✔ | |
| `isRead`| `Boolean`| `boolean`| `boolean` | ✔ | |

---

## 15. Promotion
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `prize`, `cost`| `String` | `string` | `string` | ✔ | |
| `organizer`, `sponsor` | `User`, `Sponsor?` | `LiteUser`, `LiteSponsor?` | `LiteSponsor?` | ⚠ | На фронте отображается только спонсор, если он есть. |
| `imageDataUri`, `imageHint`, `endDate` | `String` | `string` | `string` | ✔ | |

---

## 16. Sponsor
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `profileUrl` | `String` | `string` | `string` | ✔ | |
| `logo`, `logoHint` | `String?` | `string` | `string` | ✔ | На фронте есть fallback. |
| `interests` | `String[]` | `string[]` | `string[]` | ✔ | |

---

## 17. Playground
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `name`, `address`| `String` | `string` | `string` | ✔ | |
| `type`, `surface`| `String` | `string` | `string` | ✔ | |
| `features` | `String[]` | `string[]` | `string[]` | ✔ | |
| `status` | `PlaygroundStatus`| `string` | `string` | ✔ | |
| `creator`| `User` | `LiteUser` | `LiteUser` | ✔ | DTO с lite-объектом пользователя. |

---

## 18. PlaygroundReview
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `author` | `User` | `LiteUser` | `LiteUser` | ✔ | |
| `playground` | `Playground` | — | — | ✔ | Связь, не отдается на фронт. |
| `rating` | `Int` | `number` | `number` | ✔ | |
| `comment` | `String`| `string` | `string` | ✔ | |

---

## 19. PlaygroundReport
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `playground`| `Playground`| — | — | ✔ | Связь, не отдается. |
| `reporter`| `User` | — | — | ✔ | Связь, не отдается. |
| `category`, `comment`, `summary` | `String` | `string` | `string` | ✔ | |
| `severity`, `status`| `String` | `string` | `string` | ✔ | |

---

## 20. Report
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `reporter`, `reportedUser`, `resolver` | `User` | `LiteUser` | `LiteUser` | ✔ | DTO с облегченными данными. |
| `status` | `ReportStatus` (enum) | `string` | `string` | ✔ | |
| `category`, `description`| `String` | `string` | `string` | ✔ | |

---

## 21. TeamApplication
| Поле           | Prisma                         | Backend DTO/entity     | Frontend Type | Совпадает   | Комментарий                                                               |
| :---           | :---                           | :---                   | :---          | :---        | :---                                                                      |
| `team`, `user` | `Team`, `User`                 | `LiteTeam`, `LiteUser` | `JoinRequest` | ⚠           | DTO агрегируется в тип `JoinRequest`, поле `user` становится `applicant`. |
| `status`       | `TeamApplicationStatus` (enum) | `string`               | `string`      | ✔           |                                                                           |
| `message`      | `String?`                      | `string?`              | `string`      | ✔           |                                                                           |

---

## 22. Challenge
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `title`, `description` | `String` | `string` | `string` | ✔ | |
| `creator`, `opponent` | `User` | `ChallengeCreator` | `ChallengeCreator` | ✔ | DTO с lite-объектом пользователя. |
| `discipline` | `Sport` | `string` | `string` | ⚠ | На фронт передается только название дисциплины. |
| `status` | `ChallengeStatus`| `string` | `string` | ✔ | |
| `wager` | `Int`| `number`| `number`| ✔ | |

---

## 23. Sport
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `icon` | `String` | `string` | `string` | ✔ | |
| `category` | `String` | `string` | `string` | ✔ | |

---

## 24. MedicalPartner
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `specialization`, `contact` | `String` | `string` | `string` | ✔ | |
| `avatar`, `avatarHint`| `String?` | `string?` | `string?` | ✔ | |

---

## 25. LfgLobby
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `creator` | `User` | `LiteUser` | `LiteUser` | ✔ | |
| `players` | `User[]` | `_count` | `number` | ⚠ | **Правильное расхождение.** Бэкенд отдает только количество для экономии трафика. |
| `type` | `LfgLobbyType` (enum) | `string` | `string` | ✔ | |

---

## 26. TrainingProgram
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description` | `String` | `string` | `string` | ✔ | |
| `goal`, `splitType`| `String` | `string` | `string` | ✔ | В будущем можно заменить на `enum`. |
| `daysPerWeek`| `Int` | `number` | `number` | ✔ | |
| `weeklySplit` | `WorkoutDay[]`| `WorkoutDay[]` | `WorkoutDay[]` | ✔ | Полная вложенная структура передается как есть. |

---

## 27. WorkoutDay
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `day`, `title` | `String`/`Int`| `string`/`number` | `string`/`number` | ✔ | |
| `exercises`| `WorkoutExercise[]`|`ExerciseDetail[]`|`ExerciseDetail[]`| ⚠ | Название типа отличается, но структура совпадает. |
| `program` | `TrainingProgram`| — | — | ✔ | Связь не передается. |

---

## 28. WorkoutExercise
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `sets`, `reps`| `String` | `string` | `string` | ✔ | |
| `plannedWeight`, `technique` | `String?` | `string?` | `string?` | ✔ | |
| `isSupersetWithPrevious`| `Boolean` | `boolean` | `boolean` | ✔ | |

---

## 29. TrainingLog
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `user` | `User` | — | — | ✔ | Связь не передается. |
| `date` | `DateTime` | `Date` | `string` | ✔ | |
| `status`| `TrainingLogStatus` | `string` | `string` | ✔ | |
| `mood`| `Mood?` | `string?` | `string?` | ✔ | |
| `notes`| `String?` | `string?` | `string?` | ✔ | |

---

## 30. LoggedExercise
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | `string` | `string` | ✔ | |
| `trainingLog`| `TrainingLog`| — | — | ✔ | Связь не передается. |
| `exercise`| `Exercise` | `Exercise` | `Exercise` | ✔ | Полный объект упражнения. |
| `sets` | `LoggedSet[]` | `LoggedSet[]` | `LoggedSet[]` | ✔ | |

---

## 31. LoggedSet
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `loggedExercise`| `LoggedExercise`| — | — | ✔ | Связь не передается. |
| `plannedReps`| `String?` | `string?`| `string?`| ✔ | |
| `plannedWeight`|`String?` | `string?`| `string?`| ✔ | |
| `loggedReps`, `loggedWeight`, `rpe` | `Int?` | `number?`| `number?`| ✔ | |
| `isCompleted` | `Boolean` | `boolean`| `boolean`| ✔ | |

---

## 32. Exercise
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `category`, `equipment`| `String` | `string` | `string` | ✔ | |
| `techniqueTips`, `commonMistakes`, `alternatives`| `Json` | `string[]` | `string[]` | ✔ | JSON в Prisma корректно парсится в массив строк. |

---

## 33. InventoryItem
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `category`, `type`| `String` | `string`| `string` | ✔ | |
| `purchaseDate` | `DateTime` | `Date`| `string`| ✔ | |
| `lifespanMonths` | `Int` | `number`| `number`| ✔ | |

---

## 34. StoreItem
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`| `String`| `string`| `string`| ✔ | |
| `price` | `Float` | `number` | `number` | ✔ | |
| `category` | `String`| `string`| `string`| ✔ | |
| `isRealMoney` | `Boolean`| `boolean`| `boolean`| ✔ | |

---

## 35. FaqItem
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `category`, `question`, `answer` | `String` | `string` | `string` | ⚠ | На фронтенде DTO агрегируется в `FaqCategory`. |

---

## 36. FoodItem
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `category` | `String` | `string` | `string` | ✔ | |
| `calories`, `protein`, `fat`, `carbs` | `Float`| `number` | `number` | ✔ | |
| `description` | `String?`| `string?` | `string?` | ✔ | |

---

## 37. FoodLogEntry
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `foodItem` | `FoodItem` | `FoodItem` | `FoodItem` | ✔ | Полная информация о продукте. |
| `user` | `User` | — | — | ✔ | Связь, не отдается. |
| `grams`| `Int`| `number`| `number`| ✔ | |
| `meal` | `String`| `string`| `MealType` (enum)| ✔ | На фронте есть `enum` для удобства. |

---

## 38. Measurement
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `user`| `User` | — | — | ✔ | Связь не отдается. |
| `date`| `DateTime` | `Date` | `string` | ✔ | |
| `weight`| `Float`| `number` | `number` | ✔ | |
| `bodyFat`, `chest`, `waist`, `hips`, `biceps`, `thigh` | `Float?` | `number?`| `number?`| ✔ | |

---

## 39. TrainingProposal
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `sport`, `comment` | `String`| `string` | `string` | ✔ | |
| `from`, `to`| `User` | `LiteUser` | `LiteUser` | ✔ | DTO с lite-объектом пользователя. |
| `program` | `TrainingProgram?`| `LiteProgram?` | `LiteProgram?` | ✔ | |
| `status` | `TrainingProposalStatus` (enum) | `string` | `string` | ✔ | |

---

## 40. Quest
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `title`, `description` | `String` | `string` | `string` | ✔ | |
| `reward`, `goal` | `Int` | `number` | `number` | ✔ | |
| `href` | `String` | `string` | `string` | ✔ | |
| `type` | `QuestType` (enum) | `string` | `QuestType` (enum) | ✔ | |
| `progress`| — | — | `number` | ⚠ | Поле `progress` — это мок-данные, генерируемые на фронтенде для демонстрации. |

---

## 41. Poll
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `title`, `question`| `String`| `string` | `string` | ✔ | |
| `options`| `PollOption[]`| `PollOption[]`| `PollOption[]`| ✔ | DTO включает `_count` для голосов. |
| `votes`| `PollVote[]`| `_count` | `totalVotes: number` | ⚠ | Бэкенд отдает агрегированное количество голосов. |
| `author`| `User?` | `LiteUser?` | `LiteUser?` | ✔ | |
| `isActive` | `Boolean` | `boolean` | `boolean` | ✔ | |

---

## 42. PollOption
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `text`| `String` | `string` | `string` | ✔ | |
| `poll` | `Poll` | — | — | ✔ | Связь, не отдается. |
| `votes`| `PollVote[]`|`_count` | `votes: number` | ⚠ | DTO отдает агрегированное количество голосов. |

---

## 43. PollVote
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user`, `poll`, `pollOption`| `User`, `Poll`, `PollOption`| — | — | ✔ | Сущность-связь, не передается на фронт напрямую. |
| `@@unique` | `[userId, pollId]` | — | — | ✔ | Уникальность голоса обеспечивается на уровне БД. |

---

## 44. TournamentAnnouncement
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `subject`, `message`| `String` | `string` | `string` | ✔ | |
| `tournament`, `sender`| `Tournament`, `User`| `LiteUser` | `Announcement` | ⚠ | На фронте агрегируется в тип `Announcement`. |
| `sentTo`| `Int`| `number` | `number` | ✔ | |

---

## 45. Activity
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`| `String` | `string` | `string` | ✔ | |
| `type`| `ActivityType` (enum)| `string`| `string`| ✔ | |
| `user`, `playground`| `User`, `Playground?`| `LiteUser` | `LiteUser`| ✔ | |
| `metadata` | `Json` | `object` | `object` | ✔ | |

---

## 46. League
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id`, `name`, `description`, `game`| `String` | `string` | `string` | ✔ | |
| `image`, `imageHint`| `String?` | `string?` | `string?` | ✔ | |
| `teams` | `LeagueTeam[]`|`LeagueTeam[]`|`LeagueTeam[]`| ✔ | |
| `matches` | `Match[]`| `LiteMatch[]`| `LeagueMatch[]`| ✔ | |

---

## 47. LeagueTeam
| Поле | Prisma | Backend DTO/entity | Frontend Type | Совпадает | Комментарий |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `league`, `team`| `League`, `Team` | `LiteTeam` | `LeagueTeam` | ⚠ | Промежуточная модель. На фронте агрегируется в `LeagueTeam`. |
| `played`, `wins`, `losses`, `draws`, `points` | `Int`| `number` | `number` | ✔ | |

---

## Общий вывод

Архитектура данных в проекте выстроена грамотно. Разделение между подробной схемой Prisma и облегченными DTO для API является лучшей практикой. Это обеспечивает:
- **Производительность:** На клиент не передаются лишние данные.
- **Безопасность:** Внутренняя структура базы данных скрыта.
- **Гибкость:** Фронтенд и бэкенд могут развиваться независимо, пока контракт API (DTO) соблюдается.
- **Надежность:** Использование `enum` и реляционных связей в Prisma обеспечивает целостность данных.