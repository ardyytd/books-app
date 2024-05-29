import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { MemberService } from './member.service';
import { CreateMemberDto, UpdateMemberDto } from './dtos';

@Controller('members')
@UsePipes(ValidationPipe)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.memberService.remove(id);
  }

  // --- The core task ---

  @Post(':memberId/books/:bookId/borrow')
  async borrowBook(
    @Param('memberId') memberId: number,
    @Param('bookId') bookId: number,
  ) {
    return this.memberService.borrowBook(memberId, bookId);
  }

  @Post(':memberId/books/:bookId/return')
  async returnBook(
    @Param('memberId') memberId: number,
    @Param('bookId') bookId: number,
  ) {
    return this.memberService.returnBook(memberId, bookId);
  }
}
