import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDTO } from './news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getAllNews() {
    return this.newsService.showAll();
  }

  @Post()
  createNew(@Body() data: NewsDTO) {
    return this.newsService.create(data);
  }

  @Get(':id')
  getNewById(@Param('id') id: string) {
    return this.newsService.find(id);
  }

  @Put(':id')
  updateNew(@Param('id') id: string, @Body() data: NewsDTO) {
    return this.newsService.update(id, data);
  }

  @Delete(':id')
  deleteNew(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}