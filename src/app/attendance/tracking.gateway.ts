import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TrackDto } from './dto/attendance.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TrackingGateway');

  constructor(private readonly attendanceService: AttendanceService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // In a real app, we would validate the JWT token here
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user_${userId}`);
      this.logger.log(`User ${userId} joined their tracking room`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TrackDto,
  ) {
    const userId = client.handshake.query.userId as string;
    
    if (!userId) {
      return { event: 'error', data: 'Unauthorized: userId missing in handshake' };
    }

    this.logger.log(`Location update from user ${userId}: ${data.latitude}, ${data.longitude}`);

    // 1. Process the tracking logic in the database (Radius, Distance, Stay-time)
    await this.attendanceService.track(userId, data);

    // 2. Broadcast the live location to any listening admin rooms
    // Useful for real-time map views in the admin dashboard
    this.server.emit('agentMoved', {
      userId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(),
    });

    return { event: 'success', data: 'Location received' };
  }
}
