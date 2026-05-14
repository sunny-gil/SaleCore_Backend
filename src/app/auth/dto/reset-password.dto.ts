import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const passwordMessage = 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';

export class ResetPasswordDto {
  @ApiProperty({ 
    description: 'Registered user email', 
    example: 'john@example.com' 
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: '6-digit OTP received in email', 
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsNotEmpty({ message: 'OTP is required' })
  @MinLength(6, { message: 'OTP must be 6 digits' })
  otp: string;

  @ApiProperty({ 
    description: 'New password for the account', 
    example: 'NewPassword@123',
    minLength: 6
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(passwordRegex, { message: passwordMessage })
  password: string;

  @ApiProperty({ 
    description: 'Confirm the new password', 
    example: 'NewPassword@123' 
  })
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}
