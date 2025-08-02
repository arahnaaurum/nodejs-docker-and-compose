import { IsJWT, IsNotEmpty } from 'class-validator';

export class SigninUserResponseDto {
  @IsJWT()
  @IsNotEmpty()
  access_token: string;
}
