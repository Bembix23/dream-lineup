import { IsString, IsNotEmpty } from 'class-validator';

export class GetTeamsDto {
  @IsString()
  @IsNotEmpty()
  competitionId: string;
}