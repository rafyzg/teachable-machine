import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Prediction } from './interfaces/prediction.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): string {
    return 'Healthy';
  }

  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  async postPredict(@UploadedFile() file: Express.Multer.File): Promise<Prediction[]> {
    return await this.appService.getPrediction(file.buffer);
  }
}
