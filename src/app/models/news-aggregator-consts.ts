export class NewsAggregatorConsts {

  static DefaultPageSize: number = 10;
  static DefaultPageNumber: number = 1;
  static DefaultNewsRate: number = 0;
  static MaxPageLinks: number = 10;

  static LoginFailedMessage : string = 'Неверное имя пользователя или пароль'
  static ServerErrorMessage : string = 'Серверная ошибка'

  static MinLoginLenth : number = 3;
  static MinPasswordLenth : number = 10;

  private constructor() {}
}
