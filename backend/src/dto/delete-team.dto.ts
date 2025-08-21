import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteTeamDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;
}