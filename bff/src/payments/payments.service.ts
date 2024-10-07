import { Injectable } from '@nestjs/common';
import { Menu } from 'src/interfaces/back/menu.interface';
import { encodeObjectToBase64, saveMenu } from 'src/utils/encode64-utils';

@Injectable()
export class PaymentsService {
  async createPayment(table: any) {
    const menu = encodeObjectToBase64(table);
    console.log('menu', menu);
    const res: Menu = await saveMenu(menu);
    return res._id;
  }
}
