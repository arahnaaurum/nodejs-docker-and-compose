export enum PostgresErrorCode {
  UniqueViolation = 23505,
  CheckViolation = 23514,
  NotNullViolation = 23502,
  ForeignKeyViolation = 23503,
}

export const PostgresErrorMessage = {
  [PostgresErrorCode.UniqueViolation]: 'Уникальное значение уже занято',
  [PostgresErrorCode.CheckViolation]: 'Некорректное значение',
  [PostgresErrorCode.NotNullViolation]: 'Обязательное поле пустое',
  [PostgresErrorCode.ForeignKeyViolation]: 'Связанный объект не найден',
};
