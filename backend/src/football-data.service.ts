import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

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

  async getPlayersByPositions(teamId: string, positions: string[]) {
    const cacheDoc = await db.collection('players').doc(teamId).get();
    let squad: any[] = [];
    const cacheData = cacheDoc.data();
    if (cacheDoc.exists && cacheData && Array.isArray(cacheData.squad)) {
      squad = cacheData.squad;
    } else {
      const response = await axios.get(`${this.apiUrl}/teams/${teamId}`, {
        headers: { 'X-Auth-Token': this.apiKey },
      });
      squad = Array.isArray(response.data.squad) ? response.data.squad : [];
      await db.collection('players').doc(teamId).set({ squad });
    }
    return squad.filter((player: any) => positions.includes(player.position));
  }

  async saveTeam(userId: string, name: string, formation: string, team: any[]) {
    console.log('Sauvegarde équipe pour:', userId, name, formation, team);
    await db.collection('users').doc(userId).collection('teams').add({
      name,
      formation,
      team,
      createdAt: new Date(),
    });
    return { success: true };
  }

  async getTeamsSaved(userId: string) {
    const snapshot = await db.collection('users').doc(userId).collection('teams').get();
    const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Service returning:', teams); // Debug
    return teams; // S'assurer que c'est bien un tableau
  }

  async renameTeam(userId: string, teamId: string, newName: string) {
    await db
      .collection('users')
      .doc(userId)
      .collection('teams')
      .doc(teamId)
      .update({ name: newName });
  }

  async deleteTeam(userId: string, teamId: string) {
    await db
      .collection('users')
      .doc(userId)
      .collection('teams')
      .doc(teamId)
      .delete();
  }
}
