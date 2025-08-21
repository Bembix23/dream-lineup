import { IsString, IsNotEmpty } from 'class-validator';

export class RenameTeamDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  newName: string;
}