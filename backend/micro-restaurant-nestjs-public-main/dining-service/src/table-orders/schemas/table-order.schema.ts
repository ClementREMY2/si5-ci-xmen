import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { OrderingLine } from './ordering-line.schema';

import { PreparationDto } from '../dto/preparation.dto';
import { MenuItem } from './menu-item.schema';

export type TableOrderDocument = TableOrder & Document;

@Schema({
  versionKey: false,
})
export class TableOrder {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: false})
  tableNumber: number;

  @ApiProperty()
  @Prop({ required: false })
  customerName: string;

  @ApiProperty()
  @Prop({ required: false })
  event: string;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  customersCount: number;

  @ApiProperty()
  @Prop({ required: true, default: new Date() })
  opened: Date;

  @ApiProperty()
  @Prop({ default: [] })
  preparations: string[];

  @ApiProperty()
  @Prop({ default: null })
  billed: Date;
}

export const TableOrderSchema = SchemaFactory.createForClass(TableOrder);
