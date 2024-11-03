import { IsNotEmpty } from 'class-validator';

export class RemoveFromOrderDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  menuItems: string[];
}
