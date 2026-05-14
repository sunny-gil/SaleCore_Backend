import { IsArray, IsNotEmpty, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TrackPointDto {
  @ApiProperty({ description: 'Latitude', example: 28.6139 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: 77.2090 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'The time when this location was captured on the phone', example: '2026-05-14T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  timestamp: string;
}

export class BulkTrackDto {
  @ApiProperty({ type: [TrackPointDto], description: 'Array of captured locations from offline period' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackPointDto)
  locations: TrackPointDto[];
}
