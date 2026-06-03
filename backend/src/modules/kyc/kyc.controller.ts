import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SubmitKycDto } from './dto/submit-kyc.dto';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private kycService: KycService) {}

  @Get('status')
  async status(@CurrentUser() user: { id: string }) {
    const data = await this.kycService.getStatus(user.id);
    return { success: true, data };
  }

  @Post('upload-url')
  async uploadUrl(
    @CurrentUser() user: { id: string },
    @Body('documentType') documentType: string,
  ) {
    const data = await this.kycService.getUploadParams(user.id, documentType);
    return { success: true, data };
  }

  @Post('submit')
  async submit(
    @CurrentUser() user: { id: string },
    @Body() dto: SubmitKycDto,
  ) {
    const data = await this.kycService.submit(user.id, dto);
    return { success: true, data };
  }
}
