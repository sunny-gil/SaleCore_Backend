import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PunchDto {
  @ApiProperty({ description: 'Latitude', example: 28.6139 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: 77.2090 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'Optional remarks', example: 'Starting field work', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class TrackDto {
  @ApiProperty({ description: 'Latitude', example: 28.6139 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: 77.2090 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
