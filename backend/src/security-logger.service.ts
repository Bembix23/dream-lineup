import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityLoggerService {
  private readonly logger = new Logger('Security');

  logAuthAttempt(userId: string, success: boolean, ip: string) {
    const status = success ? '✅ SUCCESS' : '❌ FAILED';
    this.logger.log(`${status} Auth attempt - User: ${userId} - IP: ${ip}`);
  }

  logSuspiciousActivity(activity: string, ip: string, details?: any) {
    this.logger.warn(`🚨 SUSPICIOUS: ${activity} - IP: ${ip}`, details);
  }

  logRateLimitHit(ip: string, endpoint: string) {
    this.logger.warn(`🚦 RATE_LIMIT: IP ${ip} hit limit on ${endpoint}`);
  }

  logDataAccess(userId: string, resource: string, action: string) {
    this.logger.log(`📊 DATA_ACCESS: User ${userId} ${action} ${resource}`);
  }

  logSecurityEvent(event: string, details: any) {
    this.logger.warn(`🔒 SECURITY_EVENT: ${event}`, details);
  }
}