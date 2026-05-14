export const AccessLevel = {
  public: {
    label: 'Открытый',
    className: 'open-level'
  },
  official_use: {
    label: 'ДСП',
    full_label: 'Для служебного пользования',
    className: 'dsp-level'
  },
  confidential: {
    label: 'Конфиденц.',
    full_label: 'Конфиденциально',
    className: 'close-level'
  },
};
export const StatusDoc = {
    active: {
        label: 'Активный',
        className: 'active-status',
        icon: 'bi-check2-circle'
    },
    reviewing: {
        label: 'На согласовании',
        className: 'reviewing-status',
        icon: 'bi-eye'
    },
    archived: {
        label: 'Архив',
        className: 'archive-status',
        icon: 'bi-archive'
    },
    expired: {
        label: 'Истёк срок хранения',
        className: 'expired-status',
        icon: 'bi-calendar2-x'
    }
}
export const CategoryDoc = {
  personal_doc: 'Кадровый документ',
  financial_doc: 'Финансовый документ',
  contract_doc: 'Договор',
  internal_doc: 'Внутренний регламент',
  technical_doc: 'Техническая документация'
}