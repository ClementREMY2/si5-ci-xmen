import { IsNotEmpty } from 'class-validator';

export class RemoveFromOrderDto {
  @IsNotEmpty()
  OrderId: string;

  @IsNotEmpty()
  menuItems: string[];
}
