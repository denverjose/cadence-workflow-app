import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import type { Cadence } from 'shared';

const cadences = new Map<string, Cadence>();

@Controller('cadences')
export class CadenceController {
  @Post()
  create(@Body() body: unknown) {
    const cadence = body as Cadence;
    if (!cadence?.id || !Array.isArray(cadence.steps)) {
      throw new BadRequestException('Invalid cadence payload');
    }

    cadences.set(cadence.id, cadence);
    return cadence;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return cadences.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const cadence = body as Cadence;
    if (!cadence?.id || !Array.isArray(cadence.steps)) {
      throw new BadRequestException('Invalid cadence payload');
    }

    cadences.set(id, cadence);
    return cadence;
  }
}

export { cadences };
