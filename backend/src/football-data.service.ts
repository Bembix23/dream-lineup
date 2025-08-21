import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getDb } from './firebase-init'; // ✅ Nouveau import

@Injectable()
export class FootballDataService {
  private apiKey = process.env.FOOTBALL_DATA_API_KEY;

  async getLeagues() {
    const response = await axios.get('https://api.football-data.org/v4/competitions', {
      headers: { 'X-Auth-Token': this.apiKey },
    });
    return response.data.competitions.map((comp: any) => ({
      id: comp.id,
      name: comp.name,
      area: comp.area.name,
    }));
  }

  async getTeams(competitionId: string) {
    const db = getDb(); // ✅ Utiliser getDb()
    const cacheDoc = await db.collection('teams').doc(competitionId).get();

    if (cacheDoc.exists) {
      return cacheDoc.data();
    }

    const response = await axios.get(`https://api.football-data.org/v4/competitions/${competitionId}/teams`, {
      headers: { 'X-Auth-Token': this.apiKey },
    });

    await cacheDoc.ref.set(response.data);
    return response.data;
  }

  async getPlayersByPositions(teamId: string, positions: string[]) {
    const db = getDb(); // ✅ Utiliser getDb()
    const cacheDoc = await db.collection('players').doc(teamId).get();

    if (cacheDoc.exists) {
      const cachedData = cacheDoc.data();
      if (cachedData?.squad) {
        return cachedData.squad.filter((player: any) => positions.includes(player.position));
      }
    }

    const response = await axios.get(`https://api.football-data.org/v4/teams/${teamId}`, {
      headers: { 'X-Auth-Token': this.apiKey },
    });

    await cacheDoc.ref.set(response.data);
    return response.data.squad.filter((player: any) => positions.includes(player.position));
  }

  async saveTeam(userId: string, name: string, formation: string, team: any[]) {
    const db = getDb(); // ✅ Utiliser getDb()
    await db.collection('users').doc(userId).collection('teams').add({
      name,
      formation,
      team,
      createdAt: new Date(),
    });
    return { success: true };
  }

  async getTeamsSaved(userId: string) {
    const db = getDb(); // ✅ Utiliser getDb()
    const snapshot = await db.collection('users').doc(userId).collection('teams').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async renameTeam(userId: string, teamId: string, newName: string) {
    const db = getDb(); // ✅ Utiliser getDb()
    await db.collection('users').doc(userId).collection('teams').doc(teamId).update({ name: newName });
  }

  async deleteTeam(userId: string, teamId: string) {
    const db = getDb(); // ✅ Utiliser getDb()
    await db.collection('users').doc(userId).collection('teams').doc(teamId).delete();
  }
}
