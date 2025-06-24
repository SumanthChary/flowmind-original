import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  RefreshCw, 
  Download, 
  Search,
  FileText,
  User,
  Clock,
  Database,
  Server,
  Globe,
  Settings,
  Filter,
  AlertCircle,
  Zap,
  Layers,
  Activity,
  BarChart,
  Maximize,
  Minimize
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface SecurityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ isOpen, onClose }) => {
  const { currentWorkflow, runSecurityScan } = useWorkflowStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'compliance' | 'settings'>('overview');

  useEffect(() => {
    if (isOpen && currentWorkflow && !scanResults) {
      handleScan();
    }
  }, [isOpen, currentWorkflow]);

  const handleScan = async () => {
    if (!currentWorkflow) return;
    
    setIsScanning(true);
    
    try {
      const results = await runSecurityScan(currentWorkflow.id);
      setScanResults(results);
      
      if (results.vulnerabilities.length > 0) {
        toast.warning(`Security scan found ${results.vulnerabilities.length} potential issues`);
      } else {
        toast.success('Security scan completed. No vulnerabilities found!');
      }
    } catch (error) {
      toast.error('Security scan failed');
      console.error('Security scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'non-compliant': return 'text-red-600';
      case 'partial': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const toggleSectionExpansion = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const downloadReport = () => {
    if (!scanResults) return;
    
    const reportData = {
      workflowId: currentWorkflow?.id,
      workflowName: currentWorkflow?.name,
      scanDate: new Date().toISOString(),
      securityScore: scanResults.securityScore,
      vulnerabilities: scanResults.vulnerabilities,
      recommendations: scanResults.recommendations,
      compliance: scanResults.compliance
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', `security-report-${currentWorkflow?.id}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success('Security report downloaded');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-purple-600 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Security & Compliance</h2>
              <p className="text-sm text-red-100">Enterprise-grade security monitoring and protection</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Scan Now
                </>
              )}
            </button>
            {scanResults && (
              <button
                onClick={downloadReport}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: <Shield size={16} /> },
            { id: 'vulnerabilities', label: 'Vulnerabilities', icon: <AlertTriangle size={16} /> },
            { id: 'compliance', label: 'Compliance', icon: <CheckCircle size={16} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isScanning ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-600">Scanning workflow for security vulnerabilities...</p>
              </div>
            </div>
          ) : !scanResults ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <Shield size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-600">No security scan results available</p>
                <button
                  onClick={handleScan}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Run Security Scan
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Security Score */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
                      <button
                        onClick={() => toggleSectionExpansion('score')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedSection === 'score' ? <Minimize size={18} /> : <Maximize size={18} />}
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className={`text-6xl font-bold ${getSecurityScoreColor(scanResults.securityScore)}`}>
                          {scanResults.securityScore}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm text-gray-600">out of 100</div>
                          <div className={`font-medium ${getSecurityScoreColor(scanResults.securityScore)}`}>
                            {scanResults.securityScore >= 90 ? 'Excellent' : 
                             scanResults.securityScore >= 70 ? 'Good' : 
                             scanResults.securityScore >= 50 ? 'Fair' : 'Poor'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full ${
                              scanResults.securityScore >= 90 ? 'bg-green-500' : 
                              scanResults.securityScore >= 70 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${scanResults.securityScore}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>0</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                    
                    {expandedSection === 'score' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Lock size={16} className="text-gray-600 mr-2" />
                              <span className="text-sm">Access Control</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: '90%' }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">90%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Database size={16} className="text-gray-600 mr-2" />
                              <span className="text-sm">Data Protection</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: '85%' }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">85%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Globe size={16} className="text-gray-600 mr-2" />
                              <span className="text-sm">Network Security</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="h-2 rounded-full bg-yellow-500"
                                  style={{ width: '70%' }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">70%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Vulnerabilities</div>
                          <div className="text-2xl font-bold text-gray-900">{scanResults.vulnerabilities.length}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">High</span>
                          <span className="text-xs font-medium text-red-600">
                            {scanResults.vulnerabilities.filter((v: any) => v.severity === 'high').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Medium</span>
                          <span className="text-xs font-medium text-yellow-600">
                            {scanResults.vulnerabilities.filter((v: any) => v.severity === 'medium').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Low</span>
                          <span className="text-xs font-medium text-blue-600">
                            {scanResults.vulnerabilities.filter((v: any) => v.severity === 'low').length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Compliance</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {Object.values(scanResults.compliance).filter((c: any) => c.compliant).length}/
                            {Object.keys(scanResults.compliance).length}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(scanResults.compliance).map(([standard, data]: [string, any]) => (
                          <div key={standard} className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{standard}</span>
                            <span className={`text-xs font-medium ${
                              data.compliant ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {data.compliant ? 'Compliant' : 'Non-compliant'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Zap size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Recommendations</div>
                          <div className="text-2xl font-bold text-gray-900">{scanResults.recommendations.length}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {scanResults.recommendations.slice(0, 3).map((rec: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 truncate">{rec.title}</span>
                            <span className={`text-xs font-medium ${
                              rec.priority === 'high' ? 'text-red-600' : 
                              rec.priority === 'medium' ? 'text-yellow-600' : 
                              'text-blue-600'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Security Recommendations</h3>
                      <button
                        onClick={() => toggleSectionExpansion('recommendations')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedSection === 'recommendations' ? <Minimize size={18} /> : <Maximize size={18} />}
                      </button>
                    </div>
                    <div className="space-y-4">
                      {scanResults.recommendations.slice(0, expandedSection === 'recommendations' ? undefined : 3).map((rec: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-600' : 
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {rec.priority === 'high' ? <AlertTriangle size={16} /> : 
                               rec.priority === 'medium' ? <AlertCircle size={16} /> : 
                               <Zap size={16} />}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{rec.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                              <div className="mt-2 text-sm">
                                <span className="font-medium text-gray-700">Implementation: </span>
                                <span className="text-gray-600">{rec.implementation}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {scanResults.recommendations.length > 3 && expandedSection !== 'recommendations' && (
                      <button
                        onClick={() => setExpandedSection('recommendations')}
                        className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                      >
                        View all {scanResults.recommendations.length} recommendations
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'vulnerabilities' && (
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search vulnerabilities..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="all">All Severities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="all">All Types</option>
                        <option value="sensitive_data">Sensitive Data</option>
                        <option value="access_control">Access Control</option>
                        <option value="insecure_connections">Insecure Connections</option>
                      </select>
                    </div>
                  </div>

                  {/* Vulnerabilities List */}
                  {scanResults.vulnerabilities.length === 0 ? (
                    <div className="bg-green-50 rounded-xl p-8 text-center">
                      <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-800 mb-2">No Vulnerabilities Found</h3>
                      <p className="text-green-700">
                        Great job! Your workflow passed all security checks.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scanResults.vulnerabilities.map((vuln: any, index: number) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                vuln.severity === 'high' ? 'bg-red-100 text-red-600' : 
                                vuln.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                                'bg-blue-100 text-blue-600'
                              }`}>
                                <AlertTriangle size={20} />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{vuln.type.replace(/_/g, ' ')}</h4>
                                <div className="flex items-center mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                    {vuln.severity}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSectionExpansion(`vuln-${index}`)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedSection === `vuln-${index}` ? <Minimize size={18} /> : <Maximize size={18} />}
                            </button>
                          </div>
                          <p className="text-gray-700 mb-4">{vuln.description}</p>
                          
                          {expandedSection === `vuln-${index}` && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">Locations</h5>
                                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                                  {vuln.locations ? (
                                    <pre className="whitespace-pre-wrap text-gray-700 text-xs">
                                      {JSON.stringify(vuln.locations, null, 2)}
                                    </pre>
                                  ) : (
                                    <p className="text-gray-600">No specific locations identified</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Recommendation</h5>
                                <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                                  {vuln.recommendation}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  {/* Compliance Overview */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(scanResults.compliance).map(([standard, data]: [string, any]) => (
                        <div key={standard} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{standard}</h4>
                            <span className={`flex items-center ${
                              data.compliant ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {data.compliant ? (
                                <>
                                  <CheckCircle size={16} className="mr-1" />
                                  <span>Compliant</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle size={16} className="mr-1" />
                                  <span>Non-compliant</span>
                                </>
                              )}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex justify-between mb-1">
                              <span>Issues:</span>
                              <span className="font-medium">{data.issues}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last checked:</span>
                              <span>{new Date(data.lastChecked).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Compliance Requirements</h3>
                      <button
                        onClick={() => toggleSectionExpansion('compliance')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedSection === 'compliance' ? <Minimize size={18} /> : <Maximize size={18} />}
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">SOC 2</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          SOC 2 is a voluntary compliance standard for service organizations, developed by the American Institute of CPAs (AICPA), which specifies how organizations should manage customer data.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Data encryption at rest and in transit</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Access controls and user authentication</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Audit logging and monitoring</span>
                          </div>
                        </div>
                      </div>

                      {expandedSection === 'compliance' && (
                        <>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">GDPR</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">Data minimization and purpose limitation</span>
                              </div>
                              <div className="flex items-start">
                                <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">Right to access, rectification, and erasure</span>
                              </div>
                              <div className="flex items-start">
                                <AlertTriangle size={16} className="text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">Data protection impact assessment</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">HIPAA</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              The Health Insurance Portability and Accountability Act (HIPAA) sets the standard for protecting sensitive patient data in the United States.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">Protected health information (PHI) safeguards</span>
                              </div>
                              <div className="flex items-start">
                                <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">Access controls and authentication</span>
                              </div>
                              <div className="flex items-start">
                                <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">Audit controls and integrity</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {!expandedSection && (
                      <button
                        onClick={() => setExpandedSection('compliance')}
                        className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                      >
                        View all compliance requirements
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Security Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">End-to-End Encryption</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Encrypt all workflow data in transit and at rest
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Audit Logging</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Track all workflow activities for security monitoring
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Sensitive Data Detection</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Automatically detect and protect sensitive information
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Security Notifications</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Receive alerts for security events and vulnerabilities
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Access Control */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Access Control</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Level
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="basic">Basic</option>
                          <option value="enhanced" selected>Enhanced</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IP Whitelist
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add IP address"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Add
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          No IP addresses whitelisted
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Team Access</h4>
                          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                            Manage
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <User size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">You (Owner)</div>
                                <div className="text-xs text-gray-600">{user?.email}</div>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              Full Access
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SecurityPanel;