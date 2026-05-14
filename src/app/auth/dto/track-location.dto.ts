import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackLocationDto {
  @ApiProperty({ 
    description: 'Current latitude of the agent', 
    example: 28.6139 
  })
  @IsNotEmpty({ message: 'Latitude is required' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ 
    description: 'Current longitude of the agent', 
    example: 77.2090 
  })
  @IsNotEmpty({ message: 'Longitude is required' })
  @IsNumber()
  longitude: number;
}
