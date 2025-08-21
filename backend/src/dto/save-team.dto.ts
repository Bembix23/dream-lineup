// backend/src/dto/save-team.dto.ts
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PlayerDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  position?: string;
}

export class SaveTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  formation: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerDto)
  team: (PlayerDto | null)[];
}