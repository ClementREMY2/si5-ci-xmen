import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService){}
    
    @Post()
    async createPayment(@Body() table: number) {
        return this.paymentsService.createPayment(table);
    }
}
