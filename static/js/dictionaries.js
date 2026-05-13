export const AccessLevel = {
  public: {
    label: 'Открытый',
    className: 'open-level'
  },
  official_use: {
    label: 'ДСП',
    className: 'dsp-level'
  },
  confidential: {
    label: 'Конфиденциально',
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