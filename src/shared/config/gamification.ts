
export type PdRule = {
    id: string;
    description: string;
    value: number;
    type: 'credit' | 'debit';
    editable: boolean;
};

// This now represents the default rules for the economy.
// The values can be managed from the PD Economy admin page.
export const pdRules: PdRule[] = [
    { id: 'REGISTRATION', description: 'Регистрация на платформе', value: 50, type: 'credit', editable: true },
    { id: 'PROFILE_COMPLETION', description: 'Заполнение профиля', value: 100, type: 'credit', editable: true },
    { id: 'FIRST_MATCH', description: 'Первый сыгранный матч', value: 25, type: 'credit', editable: true },
    { id: 'WIN_MATCH', description: 'Победа в матче', value: 50, type: 'credit', editable: true },
    { id: 'CREATE_TEAM', description: 'Создание команды', value: 150, type: 'credit', editable: true },
    { id: 'JOIN_TOURNAMENT', description: 'Участие в турнире', value: 200, type: 'credit', editable: true },
    { id: 'QUEST_COMPLETION', description: 'Выполнение квеста "Новичок"', value: 100, type: 'credit', editable: false },
    { id: 'STORE_PURCHASE_FRAME', description: 'Покупка: Рамка аватара "Пламя"', value: -250, type: 'debit', editable: false },
    { id: 'STORE_PURCHASE_BOOST', description: 'Покупка: Буст ранга (x2 на 7 дней)', value: -350, type: 'debit', editable: false },
    { id: 'TOURNAMENT_FEE', description: 'Взнос за участие в турнире "Weekly Cup"', value: -100, type: 'debit', editable: false },
];
