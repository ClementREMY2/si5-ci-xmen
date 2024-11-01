import { IsMongoId, IsNotEmpty, IsPositive } from 'class-validator';

export class AddMenuItemDto {
  @IsMongoId()
  menuItemId: string;

}
