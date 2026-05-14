import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const passwordMessage = 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';

export class RegisterDto {
  @ApiProperty({ 
    description: 'The full name of the user', 
    example: 'John Doe' 
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  fullName: string;

  @ApiProperty({ 
    description: 'The email address used for login and OTP', 
    example: 'john@example.com',
    uniqueItems: true
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: 'The user password (min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)', 
    example: 'Password@123',
    minLength: 6
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(passwordRegex, { message: passwordMessage })
  password: string;

  @ApiProperty({ 
    description: 'The 10-digit mobile number', 
    example: '9876543210',
    pattern: '^\\d{10}$'
  })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobileNumber: string;
}
