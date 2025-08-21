import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPlayersDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  // 🔧 Transformer la string en array automatiquement
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(pos => pos.trim()).filter(pos => pos.length > 0);
    }
    return Array.isArray(value) ? value : [];
  })
  @IsNotEmpty()
  positions: string[];
}