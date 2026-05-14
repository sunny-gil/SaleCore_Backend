import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { PunchDto, TrackDto } from './dto/attendance.dto';
import { BulkTrackDto } from './dto/bulk-track.dto';

@ApiTags('Attendance & Tracking')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('punch-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Punch-in with location' })
  @ApiBody({ type: PunchDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async punchIn(@Request() req: any, @Body() punchDto: PunchDto) {
    return this.attendanceService.punchIn(req.user.userId, punchDto);
  }

  @Post('punch-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Punch-out with location' })
  @ApiBody({ type: PunchDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async punchOut(@Request() req: any, @Body() punchDto: PunchDto) {
    return this.attendanceService.punchOut(req.user.userId, punchDto);
  }

  @Post('track')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tracking location' })
  @ApiBody({ type: TrackDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async track(@Request() req: any, @Body() trackDto: TrackDto) {
    return this.attendanceService.track(req.user.userId, trackDto);
  }

  @Post('bulk-track')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Sync offline tracking data',
    description: 'Use this when the mobile app comes back online after a period of no network. It processes an array of locations with their original timestamps.'
  })
  @ApiBody({ type: BulkTrackDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async bulkTrack(@Request() req: any, @Body() bulkTrackDto: BulkTrackDto) {
    return this.attendanceService.bulkTrack(req.user.userId, bulkTrackDto.locations);
  }

  @Post('today-stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get daily summary stats for the current agent' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getTodayStats(@Request() req: any) {
    return this.attendanceService.getTodayStats(req.user.userId);
  }
}
