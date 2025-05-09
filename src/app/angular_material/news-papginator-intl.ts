import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class NewsPapginatorIntl extends MatPaginatorIntl  {

  override itemsPerPageLabel = 'Элементов на странице:';
  override nextPageLabel = 'Следующая страница';
  override previousPageLabel = 'Предыдущая страница';
  override firstPageLabel = 'Первая страница';
  override lastPageLabel = 'Последняя страница';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if(length === 0)
      return '0 из 0';
    return `${page + 1} из ${length}`;
  };

}
