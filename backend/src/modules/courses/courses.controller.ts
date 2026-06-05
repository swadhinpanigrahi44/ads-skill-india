import { Controller, Get, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('my')
  async my(@CurrentUser() user: { id: string }) {
    const data = await this.coursesService.getMyCourses(user.id);
    return { success: true, data };
  }
}
