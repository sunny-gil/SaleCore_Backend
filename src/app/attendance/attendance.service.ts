import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Tracking, Activity } from './schemas/tracking.schema';
import { PunchDto, TrackDto } from './dto/attendance.dto';
import axios from 'axios';

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
      startTime: { $lte: currentTimestamp }
    }).sort({ startTime: -1 });

    if (currentActivity) {
      const distance = this.calculateDistance(
        currentActivity.latitude,
        currentActivity.longitude,
        latitude,
        longitude
      );

      if (distance <= 2) {
        if (currentTimestamp > currentActivity.endTime) {
          currentActivity.endTime = currentTimestamp;
          currentActivity.durationInMinutes = Math.round(
            (currentTimestamp.getTime() - currentActivity.startTime.getTime()) / (1000 * 60)
          );
          await currentActivity.save();
        }
      } else {
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

    const punchIn = await this.attendanceModel.findOne({
      userId: userObjId,
      type: 'PUNCH_IN',
      timestamp: { $gte: startOfToday },
    }).sort({ timestamp: 1 });

    const punchOut = await this.attendanceModel.findOne({
      userId: userObjId,
      type: 'PUNCH_OUT',
      timestamp: { $gte: startOfToday },
    }).sort({ timestamp: -1 });

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
    try {
      // Using OpenStreetMap Nominatim (Free, no key required)
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          format: 'json',
          lat: lat,
          lon: lon,
          zoom: 18,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'SaleCoreBackend/1.0'
        }
      });

      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }
      return `Area near (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    } catch (error) {
      console.error('Geocoding error:', error.message);
      return `Area near (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
  }
}
