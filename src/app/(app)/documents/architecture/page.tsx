'use client';

export default function ArchitecturePage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-card text-card-foreground rounded-lg shadow-sm">
      <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert max-w-none space-y-6">
        <h1 className="font-headline text-4xl font-bold border-b pb-2">Техническая Документация Проекта "ProDvor"</h1>
        
        <section>
          <p><strong>Версия:</strong> 1.3</p>
          <p><strong>Дата последнего обновления:</strong> 27.07.2024</p>
          <p className="mt-4 text-muted-foreground">Этот документ является основным техническим руководством для разработчиков фронтенд-части платформы "ProDvor". Он описывает архитектуру, технологический стек, стандарты кодирования и ключевые принятые решения.</p>
        </section>
        
        <hr />

        <section>
          <h2 className="font-headline text-3xl font-bold">1. Введение</h2>
          <h3 className="font-headline text-2xl font-semibold">1.1. Общее описание продукта</h3>
          <p><strong>ProDvor</strong> — это социальная веб-платформа, предназначенная для объединения участников дворового и любительского спорта. Она предоставляет инструменты для создания профилей, команд, организации турниров и ведения спортивной жизни онлайн.</p>
          <h4>Цели фронтенда:</h4>
          <ul>
            <li>Предоставить пользователям интуитивно понятный, быстрый и адаптивный интерфейс.</li>
            <li>Обеспечить высокую производительность и доступность на всех современных устройствах.</li>
            <li>Создать масштабируемую и поддерживаемую кодовую базу, готовую к быстрому добавлению нового функционала.</li>
          </ul>
          <h4>Краткая сводка функционала:</h4>
          <ul>
            <li>Профили пользователей с различными ролями (игрок, тренер, судья и т.д.).</li>
            <li>Создание и управление командами.</li>
            <li>Организация и участие в турнирах.</li>
            <li>Интерактивная карта спортивных площадок.</li>
            <li>Лента активности и система постов.</li>
            <li>Система рейтингов (ELO) и достижений (ачивок).</li>
            <li>Разделы для спонсоров, судей, болельщиков и медицинских партнеров.</li>
          </ul>
          <h3 className="font-headline text-2xl font-semibold">1.2. Термины и сокращения</h3>
          <ul>
            <li><strong>FSD (Feature-Sliced Design)</strong> — основная архитектурная методология проекта.</li>
            <li><strong>RSC (React Server Components)</strong> — серверные компоненты React, используемые по умолчанию.</li>
            <li><strong>ADR (Architecture Decision Record)</strong> — запись об архитектурном решении.</li>
            <li><strong>NFR (Non-Functional Requirements)</strong> — нефункциональные требования.</li>
            <li><strong>API</strong> — интерфейс взаимодействия с бэкендом.</li>
          </ul>
        </section>

        <hr />

        <style jsx>{`
          .prose h1 { margin-bottom: 1rem; }
          .prose h2 { margin-top: 2rem; margin-bottom: 1rem; }
          .prose h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; }
          .prose h4 { margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600; }
          .prose p, .prose ul { margin-bottom: 1rem; }
          .prose ul { list-style-position: inside; list-style-type: disc; padding-left: 1rem; }
          .prose hr { border-color: hsl(var(--border)); margin-top: 2rem; margin-bottom: 2rem; }
        `}</style>
      </article>
    </div>
  )
}
