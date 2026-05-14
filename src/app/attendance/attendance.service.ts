import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Tracking, Activity } from './schemas/tracking.schema';
import { PunchDto, TrackDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(Tracking.name) private trackingModel: Model<Tracking>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  async punchIn(userId: string, punchDto: PunchDto) {
    const { latitude, longitude } = punchDto;
    const attendance = new this.attendanceModel({
      userId: new Types.ObjectId(userId),
      type: 'PUNCH_IN',
      latitude,
      longitude,
    });
    await attendance.save();
    return { message: 'Punch-in successful, tracking started' };
  }

  async punchOut(userId: string, punchDto: PunchDto) {
    const { latitude, longitude } = punchDto;
    const attendance = new this.attendanceModel({
      userId: new Types.ObjectId(userId),
      type: 'PUNCH_OUT',
      latitude,
      longitude,
    });
    await attendance.save();
    return { message: 'Punch-out successful, tracking stopped' };
  }

  async track(userId: string, trackDto: TrackDto, customTimestamp?: Date) {
    const { latitude, longitude } = trackDto;
    const userObjId = new Types.ObjectId(userId);
    const currentTimestamp = customTimestamp || new Date();

    // 1. Save raw breadcrumb
    const tracking = new this.trackingModel({
      userId: userObjId,
      latitude,
      longitude,
      timestamp: currentTimestamp,
    });
    await tracking.save();

    // 2. Process Activity/Stay Logic (2km Radius)
    let currentActivity = await this.activityModel.findOne({
      userId: userObjId,
      startTime: { $lte: currentTimestamp } // Look for activity before or at this time
    }).sort({ startTime: -1 });

    if (currentActivity) {
      const distance = this.calculateDistance(
        currentActivity.latitude,
        currentActivity.longitude,
        latitude,
        longitude
      );

      // If this point is historically later than the activity end time, update it
      if (distance <= 2) {
        if (currentTimestamp > currentActivity.endTime) {
          currentActivity.endTime = currentTimestamp;
          currentActivity.durationInMinutes = Math.round(
            (currentTimestamp.getTime() - currentActivity.startTime.getTime()) / (1000 * 60)
          );
          await currentActivity.save();
        }
      } else {
        // Agent has moved to a new area (> 2km)
        // Only create new activity if it's actually a new point in time
        if (currentTimestamp > currentActivity.endTime) {
          const address = await this.getAddressFromCoords(latitude, longitude);
          const newActivity = new this.activityModel({
            userId: userObjId,
            address,
            latitude,
            longitude,
            startTime: currentTimestamp,
            endTime: currentTimestamp,
            distanceFromLastStop: Math.round(distance * 100) / 100,
          });
          await newActivity.save();
        }
      }
    } else {
      const address = await this.getAddressFromCoords(latitude, longitude);
      const initialActivity = new this.activityModel({
        userId: userObjId,
        address,
        latitude,
        longitude,
        startTime: currentTimestamp,
        endTime: currentTimestamp,
        distanceFromLastStop: 0,
      });
      await initialActivity.save();
    }

    return { message: 'Location tracked successfully' };
  }

  async bulkTrack(userId: string, locations: any[]) {
    // Sort locations by timestamp to ensure chronological processing
    const sortedLocations = locations.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (const loc of sortedLocations) {
      await this.track(userId, { 
        latitude: loc.latitude, 
        longitude: loc.longitude 
      }, new Date(loc.timestamp));
    }

    return { message: `${locations.length} locations synced successfully from offline storage` };
  }

  async getTodayStats(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Get the first Punch-In of today
    const punchIn = await this.attendanceModel.findOne({
      userId: userObjId,
      type: 'PUNCH_IN',
      timestamp: { $gte: startOfToday },
    }).sort({ timestamp: 1 });

    // 2. Get the last Punch-Out of today (optional info)
    const punchOut = await this.attendanceModel.findOne({
      userId: userObjId,
      type: 'PUNCH_OUT',
      timestamp: { $gte: startOfToday },
    }).sort({ timestamp: -1 });

    // 3. Sum total distance traveled today from Activity records
    const activities = await this.activityModel.find({
      userId: userObjId,
      startTime: { $gte: startOfToday },
    });

    const totalDistance = activities.reduce((sum, activity) => sum + activity.distanceFromLastStop, 0);

    return {
      punchInTime: punchIn ? punchIn.timestamp : null,
      punchOutTime: punchOut ? punchOut.timestamp : null,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalStops: activities.length,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private async getAddressFromCoords(lat: number, lon: number): Promise<string> {
    return `Area near (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  }
}
