import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { AddMenuItemDto } from '../dto/add-menu-item.dto';

export class AddMenuItemDtoNotFoundException extends ErrorDto {
  constructor(addMenuItemDto: AddMenuItemDto) {
    super(HttpStatus.NOT_FOUND, 'Inconsistent AddMenuItemDto with the MenuServiceProxy', `"${addMenuItemDto.menuItemId}" is not a valid MenuItem Id`);
  }
}
