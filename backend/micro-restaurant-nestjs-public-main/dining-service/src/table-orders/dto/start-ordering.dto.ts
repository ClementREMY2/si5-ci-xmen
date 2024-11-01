import { IsNotEmpty, IsPositive } from 'class-validator';

export class StartOrderingDto {

  tableNumber: number;

  customerName: string;

  event: string;

  @IsNotEmpty()
  @IsPositive()
  customersCount: number;
}
