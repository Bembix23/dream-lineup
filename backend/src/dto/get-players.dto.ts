import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class GetPlayersDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  positions: string[];
}