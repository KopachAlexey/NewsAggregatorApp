import { AddCard } from "./add-card";

export class NewsAggregatorConsts {

  static DefaultPageSize: number = 10;
  static DefaultPageNumber: number = 1;
  static DefaultNewsRate: number = 0;
  static MaxPageLinks: number = 10;

  static LoginFailedMessage : string = 'Неверное имя пользователя или пароль'
  static ServerErrorMessage : string = 'Серверная ошибка'

  static MinLoginLenth : number = 3;
  static MinPasswordLenth : number = 10;

  static addCards : AddCard[] = [
    {
      title : 'Реклама',
      imgUrl : 'https://thumbs.dreamstime.com/z/advertising-word-cloud-business-concept-58626746.jpg',
      description : 'Здесь может быть ваша реклама',
      subtitle : 'По вопросам размещения рекламмы обращайтесь по телефону  +375 (29) 702-83-93',
      ctaText : 'Перейти',
      features : [
        'Долгосрочный эффект',
        'Ссылки на ваш сайт',
        'Креативные концепции',
      ]
    }
  ];

  private constructor() {}
}
