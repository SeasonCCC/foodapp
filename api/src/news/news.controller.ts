import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common'
import { NewsService } from './news.service'
import { NewsDTO } from './news.dto'
import { ValidationPipe } from '../shared/validation.pipe'
import { AuthGuard } from 'src/shared/auth.guard'
import { User } from 'src/users/users.decorator'

@Controller('news')
export class NewsController {
  // private readonly newsService: NewsService
  constructor(private readonly newsService: NewsService) {
    this.newsService = newsService
  }

  @Get()
  getAllNews(@User() user) {
    console.log(user)
    return this.newsService.showAll()
  }

  @Post('addNews')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createNew(@Body() data: NewsDTO) {
    return this.newsService.create(data)
  }

  @Get(':id')
  getNewById(@Param('id') id: string) {
    return this.newsService.findOne(id)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateNew(@Param('id') id: string, @Body() data: NewsDTO) {
    return this.newsService.update(id, data)
  }

  @Delete(':id')
  deleteNew(@Param('id') id: string) {
    return this.newsService.delete(id)
  }
}
