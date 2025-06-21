// Advanced Security Service
export class SecurityService {
  private securityPolicies: Map<string, any> = new Map();
  private auditLogs: any[] = [];
  private threatDetection: Map<string, any> = new Map();

  // Initialize security policies
  constructor() {
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies() {
    this.securityPolicies.set('default', {
      encryption: {
        enabled: true,
        algorithm: 'AES-256-GCM',
        keyRotation: '90d'
      },
      authentication: {
        required: true,
        mfa: false,
        sessionTimeout: '24h'
      },
      authorization: {
        rbac: true,
        defaultRole: 'viewer',
        adminApproval: true
      },
      dataProtection: {
        piiDetection: true,
        dataClassification: true,
        retentionPolicy: '7y'
      },
      networkSecurity: {
        ipWhitelist: [],
        rateLimiting: true,
        ddosProtection: true
      }
    });
  }

  // Scan workflow for security vulnerabilities
  async scanWorkflow(workflow: any) {
    const startTime = Date.now();
    const vulnerabilities = [];
    const recommendations = [];

    // Check for sensitive data exposure
    const sensitiveDataCheck = this.checkSensitiveData(workflow);
    if (sensitiveDataCheck.found) {
      vulnerabilities.push({
        type: 'sensitive_data_exposure',
        severity: 'high',
        description: 'Potential sensitive data found in workflow configuration',
        locations: sensitiveDataCheck.locations,
        recommendation: 'Use environment variables or secure storage for sensitive data'
      });
    }

    // Check for insecure connections
    const connectionCheck = this.checkInsecureConnections(workflow);
    if (connectionCheck.found) {
      vulnerabilities.push({
        type: 'insecure_connections',
        severity: 'medium',
        description: 'Insecure HTTP connections detected',
        locations: connectionCheck.locations,
        recommendation: 'Use HTTPS for all external connections'
      });
    }

    // Check for insufficient access controls
    const accessCheck = this.checkAccessControls(workflow);
    if (accessCheck.issues.length > 0) {
      vulnerabilities.push({
        type: 'access_control',
        severity: 'medium',
        description: 'Insufficient access controls detected',
        issues: accessCheck.issues,
        recommendation: 'Implement proper role-based access controls'
      });
    }

    // Check for data validation issues
    const validationCheck = this.checkDataValidation(workflow);
    if (validationCheck.issues.length > 0) {
      vulnerabilities.push({
        type: 'data_validation',
        severity: 'low',
        description: 'Missing or insufficient data validation',
        issues: validationCheck.issues,
        recommendation: 'Add input validation and sanitization'
      });
    }

    // Generate security recommendations
    recommendations.push(...this.generateSecurityRecommendations(workflow));

    const scanResult = {
      workflowId: workflow.id,
      scanId: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      vulnerabilities,
      recommendations,
      securityScore: this.calculateSecurityScore(vulnerabilities),
      compliance: this.checkCompliance(workflow, vulnerabilities)
    };

    // Log security scan
    this.auditLog('security_scan', {
      workflowId: workflow.id,
      vulnerabilitiesFound: vulnerabilities.length,
      securityScore: scanResult.securityScore
    });

    return scanResult;
  }

  // Monitor for security threats
  async monitorThreats(workflowId: string, executionData: any) {
    const threats = [];

    // Check for unusual execution patterns
    const patternThreat = this.detectUnusualPatterns(workflowId, executionData);
    if (patternThreat) {
      threats.push(patternThreat);
    }

    // Check for data exfiltration attempts
    const exfiltrationThreat = this.detectDataExfiltration(executionData);
    if (exfiltrationThreat) {
      threats.push(exfiltrationThreat);
    }

    // Check for privilege escalation
    const privilegeThreat = this.detectPrivilegeEscalation(executionData);
    if (privilegeThreat) {
      threats.push(privilegeThreat);
    }

    // Update threat detection data
    if (threats.length > 0) {
      this.threatDetection.set(workflowId, {
        lastThreatDetected: new Date().toISOString(),
        threatCount: (this.threatDetection.get(workflowId)?.threatCount || 0) + threats.length,
        threats
      });

      // Log security threats
      this.auditLog('threat_detected', {
        workflowId,
        threatCount: threats.length,
        threats: threats.map(t => t.type)
      });
    }

    return threats;
  }

  // Encrypt sensitive data
  async encryptData(data: any, keyId?: string): Promise<string> {
    // Simulate encryption process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const encrypted = Buffer.from(JSON.stringify(data)).toString('base64');
    
    this.auditLog('data_encrypted', {
      keyId: keyId || 'default',
      dataSize: JSON.stringify(data).length
    });

    return `encrypted:${encrypted}`;
  }

  // Decrypt sensitive data
  async decryptData(encryptedData: string, keyId?: string): Promise<any> {
    // Simulate decryption process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!encryptedData.startsWith('encrypted:')) {
      throw new Error('Invalid encrypted data format');
    }

    const base64Data = encryptedData.replace('encrypted:', '');
    const decrypted = Buffer.from(base64Data, 'base64').toString();
    
    this.auditLog('data_decrypted', {
      keyId: keyId || 'default',
      dataSize: decrypted.length
    });

    return JSON.parse(decrypted);
  }

  // Validate user permissions
  validatePermissions(userId: string, workflowId: string, action: string): boolean {
    // Simulate permission validation
    const userRole = this.getUserRole(userId);
    const requiredPermission = this.getRequiredPermission(action);
    
    const hasPermission = this.checkRolePermission(userRole, requiredPermission);
    
    this.auditLog('permission_check', {
      userId,
      workflowId,
      action,
      userRole,
      requiredPermission,
      granted: hasPermission
    });

    return hasPermission;
  }

  // Generate security report
  generateSecurityReport(workflowId?: string) {
    const logs = workflowId 
      ? this.auditLogs.filter(log => log.workflowId === workflowId)
      : this.auditLogs;

    const report = {
      reportId: `report_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      timeRange: '30d',
      summary: {
        totalEvents: logs.length,
        securityScans: logs.filter(log => log.action === 'security_scan').length,
        threatsDetected: logs.filter(log => log.action === 'threat_detected').length,
        encryptionOperations: logs.filter(log => log.action.includes('encrypt')).length,
        permissionChecks: logs.filter(log => log.action === 'permission_check').length
      },
      threatAnalysis: this.analyzeThreatTrends(logs),
      complianceStatus: this.getComplianceStatus(),
      recommendations: this.getSecurityRecommendations(logs),
      auditTrail: logs.slice(-100) // Last 100 events
    };

    return report;
  }

  private checkSensitiveData(workflow: any) {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /api[_-]?key/i,
      /token/i,
      /credential/i,
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ // Email
    ];

    const locations = [];
    const workflowStr = JSON.stringify(workflow);

    sensitivePatterns.forEach((pattern, index) => {
      const matches = workflowStr.match(pattern);
      if (matches) {
        locations.push({
          pattern: pattern.toString(),
          matches: matches.length,
          type: this.getSensitiveDataType(index)
        });
      }
    });

    return {
      found: locations.length > 0,
      locations
    };
  }

  private checkInsecureConnections(workflow: any) {
    const locations = [];
    const workflowStr = JSON.stringify(workflow);
    
    // Check for HTTP URLs (not HTTPS)
    const httpPattern = /http:\/\/[^\s"']+/g;
    const matches = workflowStr.match(httpPattern);
    
    if (matches) {
      locations.push(...matches.map(url => ({ url, issue: 'insecure_http' })));
    }

    return {
      found: locations.length > 0,
      locations
    };
  }

  private checkAccessControls(workflow: any) {
    const issues = [];

    // Check if workflow has proper access controls
    if (!workflow.access_controls) {
      issues.push('No access controls defined');
    }

    // Check for overly permissive settings
    if (workflow.public_access) {
      issues.push('Public access enabled - potential security risk');
    }

    return { issues };
  }

  private checkDataValidation(workflow: any) {
    const issues = [];

    workflow.nodes?.forEach((node: any) => {
      if (node.type === 'trigger' && !node.data.config?.validation) {
        issues.push(`Trigger node "${node.data.label}" lacks input validation`);
      }
      
      if (node.type === 'action' && node.data.config?.actionType === 'api' && !node.data.config?.validation) {
        issues.push(`API action node "${node.data.label}" lacks response validation`);
      }
    });

    return { issues };
  }

  private generateSecurityRecommendations(workflow: any) {
    const recommendations = [];

    // Always recommend encryption for sensitive workflows
    recommendations.push({
      type: 'encryption',
      priority: 'high',
      title: 'Enable End-to-End Encryption',
      description: 'Encrypt sensitive data in transit and at rest',
      implementation: 'Configure encryption settings in workflow security panel'
    });

    // Recommend access controls
    recommendations.push({
      type: 'access_control',
      priority: 'medium',
      title: 'Implement Role-Based Access Control',
      description: 'Define user roles and permissions for workflow access',
      implementation: 'Set up RBAC in team collaboration settings'
    });

    // Recommend audit logging
    recommendations.push({
      type: 'audit',
      priority: 'medium',
      title: 'Enable Comprehensive Audit Logging',
      description: 'Track all workflow activities for security monitoring',
      implementation: 'Enable audit logging in security settings'
    });

    return recommendations;
  }

  private calculateSecurityScore(vulnerabilities: any[]): number {
    let score = 100;

    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  private checkCompliance(workflow: any, vulnerabilities: any[]) {
    const standards = ['SOC2', 'GDPR', 'HIPAA', 'ISO27001'];
    const compliance: any = {};

    standards.forEach(standard => {
      compliance[standard] = {
        compliant: vulnerabilities.filter(v => v.severity === 'high').length === 0,
        issues: vulnerabilities.filter(v => this.affectsCompliance(v, standard)).length,
        lastChecked: new Date().toISOString()
      };
    });

    return compliance;
  }

  private detectUnusualPatterns(workflowId: string, executionData: any) {
    // Simulate pattern detection
    const executionCount = executionData.executionCount || 0;
    const avgExecutionTime = executionData.avgExecutionTime || 0;

    if (executionCount > 1000 && avgExecutionTime < 100) {
      return {
        type: 'unusual_execution_pattern',
        severity: 'medium',
        description: 'Unusually high execution frequency detected',
        details: { executionCount, avgExecutionTime }
      };
    }

    return null;
  }

  private detectDataExfiltration(executionData: any) {
    // Simulate data exfiltration detection
    const dataTransferred = executionData.dataTransferred || 0;
    
    if (dataTransferred > 1000000) { // 1MB threshold
      return {
        type: 'potential_data_exfiltration',
        severity: 'high',
        description: 'Large amount of data transferred detected',
        details: { dataTransferred }
      };
    }

    return null;
  }

  private detectPrivilegeEscalation(executionData: any) {
    // Simulate privilege escalation detection
    if (executionData.privilegeChanges) {
      return {
        type: 'privilege_escalation_attempt',
        severity: 'high',
        description: 'Unauthorized privilege escalation detected',
        details: executionData.privilegeChanges
      };
    }

    return null;
  }

  private getSensitiveDataType(patternIndex: number): string {
    const types = ['password', 'secret', 'api_key', 'token', 'credential', 'credit_card', 'ssn', 'email'];
    return types[patternIndex] || 'unknown';
  }

  private getUserRole(userId: string): string {
    // Simulate user role lookup
    return 'editor'; // Default role
  }

  private getRequiredPermission(action: string): string {
    const permissionMap: any = {
      'read': 'read',
      'write': 'write',
      'execute': 'execute',
      'delete': 'admin',
      'share': 'write'
    };

    return permissionMap[action] || 'read';
  }

  private checkRolePermission(role: string, permission: string): boolean {
    const rolePermissions: any = {
      'viewer': ['read'],
      'editor': ['read', 'write', 'execute'],
      'admin': ['read', 'write', 'execute', 'admin']
    };

    return rolePermissions[role]?.includes(permission) || false;
  }

  private auditLog(action: string, details: any) {
    this.auditLogs.push({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      ...details
    });

    // Keep only last 10000 logs
    if (this.auditLogs.length > 10000) {
      this.auditLogs.splice(0, this.auditLogs.length - 10000);
    }
  }

  private analyzeThreatTrends(logs: any[]) {
    const threatLogs = logs.filter(log => log.action === 'threat_detected');
    const last30Days = threatLogs.filter(log => 
      new Date(log.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    return {
      totalThreats: threatLogs.length,
      threatsLast30Days: last30Days.length,
      threatTypes: this.groupBy(last30Days, 'threats'),
      trend: last30Days.length > threatLogs.length * 0.1 ? 'increasing' : 'stable'
    };
  }

  private getComplianceStatus() {
    return {
      SOC2: { status: 'compliant', lastAudit: '2024-01-15', nextAudit: '2024-07-15' },
      GDPR: { status: 'compliant', lastReview: '2024-02-01', nextReview: '2024-08-01' },
      HIPAA: { status: 'ready', lastAssessment: '2024-01-20', nextAssessment: '2024-07-20' },
      ISO27001: { status: 'compliant', lastCertification: '2024-01-10', nextCertification: '2025-01-10' }
    };
  }

  private getSecurityRecommendations(logs: any[]) {
    const recommendations = [];

    // Analyze logs for recommendations
    const failedPermissionChecks = logs.filter(log => 
      log.action === 'permission_check' && !log.granted
    ).length;

    if (failedPermissionChecks > 10) {
      recommendations.push({
        type: 'access_control',
        priority: 'high',
        title: 'Review Access Controls',
        description: `${failedPermissionChecks} failed permission checks detected`,
        action: 'Review and update user permissions'
      });
    }

    return recommendations;
  }

  private affectsCompliance(vulnerability: any, standard: string): boolean {
    // Simplified compliance mapping
    const complianceMap: any = {
      'SOC2': ['sensitive_data_exposure', 'access_control'],
      'GDPR': ['sensitive_data_exposure', 'data_validation'],
      'HIPAA': ['sensitive_data_exposure', 'insecure_connections'],
      'ISO27001': ['access_control', 'insecure_connections']
    };

    return complianceMap[standard]?.includes(vulnerability.type) || false;
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown';
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }

  // Get audit logs
  getAuditLogs(workflowId?: string, limit: number = 100) {
    let logs = this.auditLogs;
    
    if (workflowId) {
      logs = logs.filter(log => log.workflowId === workflowId);
    }

    return logs.slice(-limit);
  }

  // Get threat detection data
  getThreatDetectionData(workflowId?: string) {
    if (workflowId) {
      return this.threatDetection.get(workflowId) || null;
    }

    return Object.fromEntries(this.threatDetection);
  }
}

export const securityService = new SecurityService();