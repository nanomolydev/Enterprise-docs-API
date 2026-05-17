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
export const LogsInfo = {
  created_document: {
      label: 'Создание файла',
      icon: 'bi-file-earmark-plus',
      className: 'circle_green'
  },
  view_document_list: {
      label: 'Просмотр списка документов',
      icon: 'bi-list-ul',
      className: 'circle_grey'
  },
  edit_document: {
      label: 'Редактирование документа',
      icon: 'bi-pencil-square',
      className: 'circle_yellow'
  },
  delete_document: {
      label: 'Удаление документа',
      icon: 'bi-trash',
      className: 'circle_red'
  },
  download_document: {
      label: 'Скачивание документа',
      icon: 'bi-download',
      className: 'circle_green'
  },
  user_login: {
      label: 'Вход пользователя',
      icon: 'bi-box-arrow-in-right',
      className: 'circle_blue'
  },
  user_logout: {
      label: 'Выход пользователя',
      icon: 'bi-box-arrow-right',
      className: 'circle_purple'
  }

}
export const RoleInfo = {
  Admin: {
    id: 1,
    label: 'Администратор',
    className: 'close-level'
  },
  Employee: {
    id: 2,
    label: 'Сотрудник',
    className: 'dsp-level'
  },
  Reader: {
    id: 3,
    label: 'Читатель',
    className: 'open-level'
  }
  
  
};
export const ActionsLogs = {
  created_document: 'Создание документа',
  view_document_list: 'Просмотр списка документов',
  edit_document: 'Редактирование документа',
  delete_document: 'Удаление документа',
  download_document: 'Скачивание документа',
  user_login: 'Вход пользователя',
  user_logout: 'Выход пользователя',
}