import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PunchInDto {
  @ApiProperty({ 
    description: 'Current latitude of the user', 
    example: 28.6139 
  })
  @IsNotEmpty({ message: 'Latitude is required' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ 
    description: 'Current longitude of the user', 
    example: 77.2090 
  })
  @IsNotEmpty({ message: 'Longitude is required' })
  @IsNumber()
  longitude: number;
}
