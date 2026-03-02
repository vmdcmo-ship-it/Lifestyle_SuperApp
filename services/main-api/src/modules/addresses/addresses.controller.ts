import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@ApiTags('Addresses')
@ApiBearerAuth('access-token')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Them dia chi moi' })
  @ApiResponse({ status: 201, description: 'Dia chi da tao' })
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sach dia chi cua toi' })
  @ApiResponse({ status: 200, description: 'Danh sach dia chi' })
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.addressesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiet dia chi' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Thong tin dia chi' })
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.addressesService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cap nhat dia chi' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Dia chi da cap nhat' })
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoa dia chi' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Da xoa' })
  async remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.addressesService.remove(user.id, id);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Dat lam dia chi mac dinh' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Da dat mac dinh' })
  async setDefault(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.addressesService.setDefault(user.id, id);
  }
}
