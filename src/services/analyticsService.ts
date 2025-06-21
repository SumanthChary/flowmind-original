// Advanced Analytics Service
export class AnalyticsService {
  private metrics: Map<string, any[]> = new Map();
  private realTimeData: Map<string, any> = new Map();

  // Record workflow execution metrics
  recordExecution(workflowId: string, data: any) {
    const key = `execution_${workflowId}`;
    const existing = this.metrics.get(key) || [];
    
    existing.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    // Keep only last 1000 records per workflow
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }
    
    this.metrics.set(key, existing);
    this.updateRealTimeMetrics(workflowId, data);
  }

  // Record node performance metrics
  recordNodePerformance(nodeId: string, data: any) {
    const key = `node_${nodeId}`;
    const existing = this.metrics.get(key) || [];
    
    existing.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: `node_metric_${Date.now()}`
    });
    
    this.metrics.set(key, existing);
  }

  // Get workflow analytics
  getWorkflowAnalytics(workflowId: string, timeRange: string = '24h') {
    const key = `execution_${workflowId}`;
    const data = this.metrics.get(key) || [];
    
    const filteredData = this.filterByTimeRange(data, timeRange);
    
    return {
      totalExecutions: filteredData.length,
      successRate: this.calculateSuccessRate(filteredData),
      averageExecutionTime: this.calculateAverageExecutionTime(filteredData),
      errorRate: this.calculateErrorRate(filteredData),
      throughput: this.calculateThroughput(filteredData, timeRange),
      performanceTrend: this.calculatePerformanceTrend(filteredData),
      topErrors: this.getTopErrors(filteredData),
      executionTimeline: this.generateExecutionTimeline(filteredData),
      nodePerformance: this.getNodePerformanceData(workflowId)
    };
  }

  // Get real-time metrics
  getRealTimeMetrics(workflowId?: string) {
    if (workflowId) {
      return this.realTimeData.get(workflowId) || {};
    }
    
    // Return aggregated real-time data
    const allMetrics = Array.from(this.realTimeData.values());
    return {
      totalActiveWorkflows: allMetrics.length,
      totalExecutionsToday: allMetrics.reduce((sum, m) => sum + (m.executionsToday || 0), 0),
      averageResponseTime: this.calculateGlobalAverageResponseTime(allMetrics),
      systemHealth: this.calculateSystemHealth(allMetrics)
    };
  }

  // Generate performance insights
  generateInsights(workflowId: string) {
    const analytics = this.getWorkflowAnalytics(workflowId, '7d');
    const insights = [];

    // Performance insights
    if (analytics.averageExecutionTime > 5000) {
      insights.push({
        type: 'performance',
        severity: 'warning',
        message: 'Workflow execution time is above optimal threshold',
        suggestion: 'Consider optimizing node configurations or adding parallel processing'
      });
    }

    // Success rate insights
    if (analytics.successRate < 95) {
      insights.push({
        type: 'reliability',
        severity: 'error',
        message: 'Success rate is below recommended threshold',
        suggestion: 'Review error logs and add error handling nodes'
      });
    }

    // Throughput insights
    if (analytics.throughput < 10) {
      insights.push({
        type: 'throughput',
        severity: 'info',
        message: 'Low workflow throughput detected',
        suggestion: 'Consider adding more trigger conditions or scheduling optimizations'
      });
    }

    return insights;
  }

  // Export analytics data
  exportAnalytics(workflowId: string, format: 'json' | 'csv' = 'json') {
    const analytics = this.getWorkflowAnalytics(workflowId, '30d');
    const data = this.metrics.get(`execution_${workflowId}`) || [];
    
    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    
    return {
      metadata: {
        workflowId,
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
        timeRange: '30d'
      },
      analytics,
      rawData: data
    };
  }

  private updateRealTimeMetrics(workflowId: string, data: any) {
    const existing = this.realTimeData.get(workflowId) || {
      executionsToday: 0,
      lastExecution: null,
      averageExecutionTime: 0,
      successRate: 100,
      status: 'healthy'
    };

    existing.executionsToday += 1;
    existing.lastExecution = new Date().toISOString();
    existing.averageExecutionTime = (existing.averageExecutionTime + (data.duration || 0)) / 2;
    existing.successRate = data.success ? 
      Math.min(100, existing.successRate + 0.1) : 
      Math.max(0, existing.successRate - 1);

    this.realTimeData.set(workflowId, existing);
  }

  private filterByTimeRange(data: any[], timeRange: string) {
    const now = new Date();
    let cutoff = new Date();

    switch (timeRange) {
      case '1h':
        cutoff = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }

    return data.filter(item => new Date(item.timestamp) > cutoff);
  }

  private calculateSuccessRate(data: any[]): number {
    if (data.length === 0) return 100;
    const successful = data.filter(item => item.success).length;
    return Math.round((successful / data.length) * 100);
  }

  private calculateAverageExecutionTime(data: any[]): number {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + (item.duration || 0), 0);
    return Math.round(total / data.length);
  }

  private calculateErrorRate(data: any[]): number {
    if (data.length === 0) return 0;
    const errors = data.filter(item => !item.success).length;
    return Math.round((errors / data.length) * 100);
  }

  private calculateThroughput(data: any[], timeRange: string): number {
    const hours = this.getHoursFromTimeRange(timeRange);
    return Math.round(data.length / hours);
  }

  private calculatePerformanceTrend(data: any[]): string {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-10);
    const older = data.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, item) => sum + (item.duration || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + (item.duration || 0), 0) / older.length;
    
    if (recentAvg < olderAvg * 0.9) return 'improving';
    if (recentAvg > olderAvg * 1.1) return 'degrading';
    return 'stable';
  }

  private getTopErrors(data: any[]): any[] {
    const errors = data.filter(item => !item.success && item.error);
    const errorCounts = new Map();
    
    errors.forEach(item => {
      const error = item.error;
      errorCounts.set(error, (errorCounts.get(error) || 0) + 1);
    });
    
    return Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));
  }

  private generateExecutionTimeline(data: any[]): any[] {
    // Group by hour for timeline
    const timeline = new Map();
    
    data.forEach(item => {
      const hour = new Date(item.timestamp).toISOString().slice(0, 13);
      const existing = timeline.get(hour) || { executions: 0, successes: 0, failures: 0 };
      
      existing.executions += 1;
      if (item.success) {
        existing.successes += 1;
      } else {
        existing.failures += 1;
      }
      
      timeline.set(hour, existing);
    });
    
    return Array.from(timeline.entries()).map(([hour, stats]) => ({
      time: hour,
      ...stats
    }));
  }

  private getNodePerformanceData(workflowId: string): any[] {
    // Get performance data for all nodes in the workflow
    const nodeData = [];
    
    for (const [key, data] of this.metrics.entries()) {
      if (key.startsWith('node_')) {
        const nodeId = key.replace('node_', '');
        const avgDuration = data.reduce((sum: number, item: any) => sum + (item.duration || 0), 0) / data.length;
        const successRate = this.calculateSuccessRate(data);
        
        nodeData.push({
          nodeId,
          averageDuration: Math.round(avgDuration),
          successRate,
          executionCount: data.length
        });
      }
    }
    
    return nodeData;
  }

  private calculateGlobalAverageResponseTime(metrics: any[]): number {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, m) => sum + (m.averageExecutionTime || 0), 0);
    return Math.round(total / metrics.length);
  }

  private calculateSystemHealth(metrics: any[]): string {
    if (metrics.length === 0) return 'unknown';
    
    const avgSuccessRate = metrics.reduce((sum, m) => sum + (m.successRate || 0), 0) / metrics.length;
    
    if (avgSuccessRate >= 95) return 'excellent';
    if (avgSuccessRate >= 90) return 'good';
    if (avgSuccessRate >= 80) return 'fair';
    return 'poor';
  }

  private getHoursFromTimeRange(timeRange: string): number {
    switch (timeRange) {
      case '1h': return 1;
      case '24h': return 24;
      case '7d': return 24 * 7;
      case '30d': return 24 * 30;
      default: return 24;
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }
}

export const analyticsService = new AnalyticsService();