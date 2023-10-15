import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<void> {
    return this.service.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(@Body() authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.service.signIn(authCredentials);
  }
}
