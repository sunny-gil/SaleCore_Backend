import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'The status message', example: 'Success' })
  message: string;

  @ApiProperty({ description: 'The JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', required: false })
  token?: string;

  @ApiProperty({ 
    description: 'The user profile data', 
    required: false,
    example: {
      id: '60d0fe4f5311236168a109ca',
      fullName: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '9876543210'
    }
  })
  user?: any;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'The error status code', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'The error message', example: 'Bad Request' })
  message: string | string[];

  @ApiProperty({ description: 'The error type', example: 'Bad Request' })
  error: string;
}
