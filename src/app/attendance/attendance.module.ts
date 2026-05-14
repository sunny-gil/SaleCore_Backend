import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TrackingGateway } from './tracking.gateway';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { Tracking, TrackingSchema, Activity, ActivitySchema } from './schemas/tracking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Tracking.name, schema: TrackingSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, TrackingGateway],
  exports: [AttendanceService],
})
export class AttendanceModule {}
