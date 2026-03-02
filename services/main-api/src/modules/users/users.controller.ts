import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── GET /users (Admin only) ─────────────────────────────────────────

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Danh sách tất cả users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Danh sách users phân trang' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.usersService.findAll({
      page: page || 1,
      limit: limit || 20,
      search: search || undefined,
      role: role || undefined,
      isActive:
        isActive === 'true'
          ? true
          : isActive === 'false'
            ? false
            : undefined,
    });
  }

  // ─── GET /users/stats (Admin only) ──────────────────────────────────

  @Get('stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Thống kê users' })
  async getStats() {
    return this.usersService.getStats();
  }

  // ─── GET /users/:id ──────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin user theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  // ─── PUT /users/:id ──────────────────────────────────────────────────

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.usersService.update(id, user.id, dto);
  }

  // ─── DELETE /users/:id (Admin or self) ────────────────────────────────

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tài khoản (soft delete)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    // Admin can delete anyone, users can only delete themselves
    if (!user.roles.includes('ADMIN') && user.id !== id) {
      return { error: 'Bạn không có quyền xóa tài khoản này' };
    }
    return this.usersService.softDelete(id);
  }
}
