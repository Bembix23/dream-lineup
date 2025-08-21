import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

class PlayerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  club?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  dateOfBirth?: string;

  [key: string]: any;
}

export class SaveTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  formation: string;

  @IsArray()
  team: PlayerDto[];
}