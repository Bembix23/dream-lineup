import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

@Injectable()
export class FootballDataService {
  private apiUrl = 'https://api.football-data.org/v4';
  private apiKey = process.env.FOOTBALL_DATA_API_KEY;

  async getLeagues() {
    try {
      const response = await axios.get(`${this.apiUrl}/competitions`, {
        headers: { 'X-Auth-Token': this.apiKey },
      });
      return response.data.competitions.map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        area: comp.area.name,
      }));
    } catch (error) {
      console.error('Erreur getLeagues:', error);
      throw error;
    }
  }

  async getTeams(competitionId: string) {
    const cacheDoc = await db.collection('teams').doc(competitionId).get();
    if (cacheDoc.exists) {
      return cacheDoc.data();
    }
    const response = await axios.get(
      `${this.apiUrl}/competitions/${competitionId}/teams`,
      {
        headers: { 'X-Auth-Token': this.apiKey },
      },
    );
    await db.collection('teams').doc(competitionId).set(response.data);
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
