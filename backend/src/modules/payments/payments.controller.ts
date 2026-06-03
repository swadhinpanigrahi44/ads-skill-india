import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateOrderDto,
  ) {
    const data = await this.paymentsService.createOrder(user.id, dto);
    return { success: true, data };
  }

  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  async status(
    @CurrentUser() user: { id: string },
    @Param('orderId') orderId: string,
  ) {
    const data = await this.paymentsService.getPaymentStatus(user.id, orderId);
    return { success: true, data };
  }

  // No JWT — authenticated by Razorpay HMAC signature on the raw body.
  @Post('webhook/razorpay')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    await this.paymentsService.handleWebhook(rawBody, signature);
    return { success: true };
  }
}
