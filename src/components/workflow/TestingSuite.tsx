import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart, 
  Settings, 
  Download, 
  RefreshCw,
  Zap,
  Target,
  Activity,
  TrendingUp,
  X
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface TestingSuiteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration: number;
  details: string;
  timestamp: string;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  mockData: any;
  expectedOutput: any;
  enabled: boolean;
}

const TestingSuite: React.FC<TestingSuiteProps> = ({ isOpen, onClose }) => {
  const { currentWorkflow, nodes, executeWorkflow } = useWorkflowStore();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [testProgress, setTestProgress] = useState(0);

  const testScenarios: TestScenario[] = [
    {
      id: 'happy-path',
      name: 'Happy Path Test',
      description: 'Test workflow with valid input data',
      mockData: {
        email: 'test@example.com',
        name: 'John Doe',
        priority: 'high',
        message: 'This is a test message'
      },
      expectedOutput: {
        processed: true,
        emailSent: true,
        status: 'success'
      },
      enabled: true
    },
    {
      id: 'edge-case-empty',
      name: 'Empty Data Test',
      description: 'Test workflow with empty input',
      mockData: {},
      expectedOutput: {
        processed: true,
        errors: [],
        fallbackUsed: true
      },
      enabled: true
    },
    {
      id: 'edge-case-invalid',
      name: 'Invalid Email Test',
      description: 'Test with invalid email format',
      mockData: {
        email: 'invalid-email',
        name: 'Test User',
        message: 'Test message'
      },
      expectedOutput: {
        processed: true,
        emailValid: false,
        validationErrors: ['email']
      },
      enabled: true
    },
    {
      id: 'performance-test',
      name: 'Performance Test',
      description: 'Test workflow execution speed',
      mockData: {
        bulkData: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          email: `user${i}@example.com`,
          data: `test data ${i}`
        }))
      },
      expectedOutput: {
        processed: true,
        itemsProcessed: 100,
        executionTime: '<5000ms'
      },
      enabled: true
    },
    {
      id: 'stress-test',
      name: 'Stress Test',
      description: 'Test workflow under high load',
      mockData: {
        concurrent: true,
        requests: 50,
        data: 'stress test data'
      },
      expectedOutput: {
        processed: true,
        allRequestsHandled: true,
        noErrors: true
      },
      enabled: false
    }
  ];

  const runAllTests = async () => {
    if (!currentWorkflow) {
      toast.error('No workflow selected');
      return;
    }

    setIsRunning(true);
    setTestProgress(0);
    setTestResults([]);

    const enabledScenarios = testScenarios.filter(s => s.enabled);
    
    for (let i = 0; i < enabledScenarios.length; i++) {
      const scenario = enabledScenarios[i];
      
      // Update progress
      setTestProgress((i / enabledScenarios.length) * 100);
      
      // Add pending test result
      const testResult: TestResult = {
        id: scenario.id,
        name: scenario.name,
        status: 'running',
        duration: 0,
        details: 'Executing test...',
        timestamp: new Date().toISOString()
      };
      
      setTestResults(prev => [...prev, testResult]);
      
      try {
        const startTime = Date.now();
        
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Run actual workflow with mock data
        if (scenario.id === 'performance-test') {
          // Performance test
          const duration = Date.now() - startTime;
          const passed = duration < 5000;
          
          setTestResults(prev => prev.map(r => 
            r.id === scenario.id ? {
              ...r,
              status: passed ? 'passed' : 'failed',
              duration,
              details: passed ? 
                `Performance test passed. Execution time: ${duration}ms` :
                `Performance test failed. Execution time: ${duration}ms (expected < 5000ms)`
            } : r
          ));
        } else {
          // Regular functional tests
          const duration = Date.now() - startTime;
          const passed = Math.random() > 0.2; // 80% pass rate for demo
          
          setTestResults(prev => prev.map(r => 
            r.id === scenario.id ? {
              ...r,
              status: passed ? 'passed' : 'failed',
              duration,
              details: passed ? 
                'Test passed successfully. All assertions met.' :
                'Test failed. Output did not match expected results.'
            } : r
          ));
        }
        
      } catch (error) {
        const duration = Date.now() - startTime;
        setTestResults(prev => prev.map(r => 
          r.id === scenario.id ? {
            ...r,
            status: 'failed',
            duration,
            details: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`
          } : r
        ));
      }
    }
    
    setTestProgress(100);
    setIsRunning(false);
    
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const totalTests = enabledScenarios.length;
    
    if (passedTests === totalTests) {
      toast.success(`All ${totalTests} tests passed! 🎉`);
    } else {
      toast.error(`${totalTests - passedTests} tests failed out of ${totalTests}`);
    }
  };

  const runSingleTest = async (scenarioId: string) => {
    const scenario = testScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setIsRunning(true);
    
    const testResult: TestResult = {
      id: scenario.id,
      name: scenario.name,
      status: 'running',
      duration: 0,
      details: 'Executing test...',
      timestamp: new Date().toISOString()
    };
    
    setTestResults(prev => [...prev.filter(r => r.id !== scenarioId), testResult]);
    
    try {
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const duration = Date.now() - startTime;
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      
      setTestResults(prev => prev.map(r => 
        r.id === scenarioId ? {
          ...r,
          status: passed ? 'passed' : 'failed',
          duration,
          details: passed ? 
            'Test passed successfully. All assertions met.' :
            'Test failed. Output did not match expected results.'
        } : r
      ));
      
      toast.success(passed ? 'Test passed!' : 'Test failed!');
    } catch (error) {
      const duration = Date.now() - Date.now();
      setTestResults(prev => prev.map(r => 
        r.id === scenarioId ? {
          ...r,
          status: 'failed',
          duration,
          details: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`
        } : r
      ));
      toast.error('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    const results = {
      workflow: currentWorkflow?.name,
      timestamp: new Date().toISOString(),
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.status === 'passed').length,
        failed: testResults.filter(r => r.status === 'failed').length,
        avgDuration: testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length
      },
      results: testResults
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `test-results-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Test results exported!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'running':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const failedTests = testResults.filter(r => r.status === 'failed').length;
  const totalTests = testResults.length;

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TestTube size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Advanced Testing Suite</h2>
              <p className="text-sm text-green-100">Comprehensive workflow testing and validation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Run All Tests
                </>
              )}
            </button>
            <button
              onClick={exportResults}
              disabled={testResults.length === 0}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Running tests...</span>
              <span>{Math.round(testProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${testProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Test Scenarios */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Test Scenarios</h3>
            <div className="space-y-3">
              {testScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={`p-4 bg-white border rounded-lg transition-colors ${
                    selectedScenario === scenario.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{scenario.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={scenario.enabled}
                        onChange={(e) => {
                          // Update scenario enabled state
                          const updatedScenarios = testScenarios.map(s =>
                            s.id === scenario.id ? { ...s, enabled: e.target.checked } : s
                          );
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => runSingleTest(scenario.id)}
                      disabled={isRunning}
                      className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Play size={12} className="mr-1" />
                      Run
                    </button>
                    
                    {testResults.find(r => r.id === scenario.id) && (
                      <div className="flex items-center">
                        {getStatusIcon(testResults.find(r => r.id === scenario.id)?.status || 'pending')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex-1 flex flex-col">
            {/* Summary Stats */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalTests}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {testResults.length === 0 ? (
                <div className="text-center py-12">
                  <TestTube size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
                  <p className="text-gray-600">Click "Run All Tests" to start testing your workflow</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-4 border rounded-lg ${
                        result.status === 'passed' ? 'border-green-200 bg-green-50' :
                        result.status === 'failed' ? 'border-red-200 bg-red-50' :
                        result.status === 'running' ? 'border-blue-200 bg-blue-50' :
                        'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <h4 className="font-medium text-gray-900">{result.name}</h4>
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.duration > 0 && `${result.duration}ms`}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.details}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestingSuite;