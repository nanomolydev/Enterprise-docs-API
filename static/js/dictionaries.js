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
      icon: 'bi-file-earmark-plus'
  },
  view_document_list: {
      label: 'Просмотр списка документов',
      icon: 'bi-list-ul'
  },
  edit_document: {
      label: 'Редактирование документа',
      icon: 'bi-pencil-square'
  },
  delete_document: {
      label: 'Удаление документа',
      icon: 'bi-trash'
  },
  download_document: {
      label: 'Скачивание документа',
      icon: 'bi-download'
  },
  user_login: {
      label: 'Вход пользователя',
      icon: 'bi-box-arrow-in-right'
  },
  user_logout: {
      label: 'Выход пользователя',
      icon: 'bi-box-arrow-right'
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