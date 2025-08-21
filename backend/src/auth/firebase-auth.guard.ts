import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SecurityLoggerService } from '../security-logger.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private securityLogger: SecurityLoggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const ip = request.ip || request.connection.remoteAddress || 'unknown';

    if (!authHeader) {
      this.securityLogger.logSuspiciousActivity('Missing auth header', ip);
      return false;
    }

    try {
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken;
      
      this.securityLogger.logAuthAttempt(decodedToken.uid, true, ip);
      return true;
    } catch (error) {
      this.securityLogger.logAuthAttempt('unknown', false, ip);
      this.securityLogger.logSuspiciousActivity('Invalid token', ip, { error: error.message });
      return false;
    }
  }
}