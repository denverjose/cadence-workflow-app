import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollments/enrollments.controller';
import { CadenceController } from './cadences/cadences.controller';
import { TemporalService } from './temporal/temporal.service';

@Module({
  controllers: [CadenceController, EnrollmentController],
  providers: [TemporalService],
})
export class AppModule {}
