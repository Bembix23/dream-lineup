import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FootballDataService {
  private readonly apiUrl = 'https://api.football-data.org/v4';
  private readonly apiKey = process.env.FOOTBALL_DATA_API_KEY;

  async getTeams(competitionId: string) {
    const response = await axios.get(
      `${this.apiUrl}/competitions/${competitionId}/teams`,
      {
        headers: { 'X-Auth-Token': this.apiKey },
      },
    );
    return response.data;
  }

  async getPlayersByPosition(teamId: string, position: string) {
    const response = await axios.get(`${this.apiUrl}/teams/${teamId}`, {
      headers: { 'X-Auth-Token': this.apiKey },
    });
    // Filtrer les joueurs par poste
    return response.data.squad.filter(
      (player: any) => player.position === position,
    );
  }
}
