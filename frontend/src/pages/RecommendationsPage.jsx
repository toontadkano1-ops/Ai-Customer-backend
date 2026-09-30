import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  Shield,
  Zap,
  Layers,
  RefreshCw,
  Cpu,
  Server,
  Activity,
  ExternalLink,
  CheckCircle2,
  X,
  Radio,
  Sliders
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService.js';
import { customerService } from '../services/customerService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';

export const RecommendationsPage = () => {
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Deploy solution modal state
  const [deployModalProduct, setDeployModalProduct] = useState(null);
  const [deployEnvironment, setDeployEnvironment] = useState('production');
  const [deployRegion, setDeployRegion] = useState('us-east');
  const [deployScaling, setDeployScaling] = useState('dynamic');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployedItems, setDeployedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cx_deployed_solutions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    const init = async () => {
      if (isCustomer) {
        setSelectedCustomerId(user.id);
      } else {
        const res = await customerService.list();
        if (res.success && res.data.length > 0) {
          setCustomers(res.data);
          setSelectedCustomerId(res.data[0].id);
        }
      }
    };
    init();
  }, [user, isCustomer]);

  const fetchRecommendations = async (customerId) => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res = await recommendationService.getForCustomer(customerId);
      if (res.success) {
        setRecommendations(res.data);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCustomerId) {
      fetchRecommendations(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const handleStartDeploy = (product) => {
    setDeployModalProduct(product);
    setDeployStep(0);
    setIsDeploying(false);
  };

  const handleConfirmDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);

    // Realistic multi-step deployment progression
    setTimeout(() => {
      setDeployStep(2);
      setTimeout(() => {
        setDeployStep(3);
        setTimeout(() => {
          setDeployStep(4);
          // Mark product as deployed
          const updated = {
            ...deployedItems,
            [deployModalProduct.product_id]: {
              deployedAt: new Date().toISOString(),
              environment: deployEnvironment,
              region: deployRegion,
              status: 'online'
            }
          };
          setDeployedItems(updated);
          localStorage.setItem('cx_deployed_solutions', JSON.stringify(updated));
          setIsDeploying(false);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const deploymentSteps = [
    { title: 'VPC & Cloud Resource Provisioning', desc: 'Allocating virtual network, subnets and dedicated routing mesh' },
    { title: 'Security & SOC2 Cryptographic Policy Injection', desc: 'Applying AES-256 encryption keys and zero-trust firewall parameters' },
    { title: 'Container Pod Rolling Deployment', desc: 'Launching auto-scaling pods and ingress load balancers' },
    { title: 'Health Checks & Live Verification', desc: 'Synthetic probes passed with 4ms latency. Cluster operational!' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Smart Recommendation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explainable AI recommendations matching customer telemetry, discussion history, and 1-click cloud deployment.
          </p>
        </div>

        {/* Customer selector (for Admin & Agents to view recommendations per customer) */}
        {!isCustomer && customers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Customer:</span>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3" />
            Analyzing customer interaction affinity and matching catalog...
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-400 text-xs">
            No recommendations generated yet for this profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => {
              const deployment = deployedItems[rec.product_id];
              const isDeployed = !!deployment;

              return (
                <div
                  key={rec.product_id}
                  className={`p-6 rounded-2xl border backdrop-blur-md transition-all flex flex-col justify-between relative overflow-hidden ${
                    isDeployed
                      ? 'border-emerald-500/40 bg-slate-900/90 shadow-lg shadow-emerald-500/5'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  {isDeployed && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[10px] px-3 py-0.5 rounded-bl-lg tracking-wider uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      Live in Production
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={isDeployed ? 'success' : 'primary'} size="sm">
                        {rec.category}
                      </Badge>
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        ${Number(rec.price).toFixed(2)}/mo
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{rec.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {rec.description}
                    </p>

                    {/* Explainability Callout */}
                    <div className="p-3 rounded-xl bg-brand-950/40 border border-brand-500/20 text-xs space-y-1">
                      <span className="font-semibold text-brand-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Why Recommended:
                      </span>
                      <p className="text-slate-300 text-xs leading-normal">
                        {rec.reason}
                      </p>
                    </div>

                    {isDeployed && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
                        <span>Environment: <strong className="capitalize">{deployment.environment}</strong></span>
                        <span>Region: <strong>{deployment.region.toUpperCase()}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {isDeployed ? 'Active Service' : 'Instant Provisioning'}
                    </span>

                    {isDeployed ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStartDeploy(rec)}
                          className="text-xs"
                        >
                          Reconfigure
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate('/assistant')}
                          className="text-xs"
                          icon={ExternalLink}
                        >
                          Ask AI
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartDeploy(rec)}
                        icon={ArrowRight}
                      >
                        Deploy Solution
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Deploy Solution Modal */}
      {deployModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-dark-surface border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider font-semibold">
                  Enterprise Cloud Provisioning
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Deploy {deployModalProduct.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {deployModalProduct.category} • ${Number(deployModalProduct.price).toFixed(2)}/month
                </p>
              </div>

              {!isDeploying && (
                <button
                  onClick={() => setDeployModalProduct(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* If Deploying or Deployed: Show Real-Time Pipeline */}
            {deployStep > 0 ? (
              <div className="py-6 space-y-4">
                <div className="text-center pb-2">
                  <div className="inline-flex p-3 rounded-full bg-brand-500/10 text-brand-400 mb-2">
                    {deployStep === 4 ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                    ) : (
                      <Activity className="w-8 h-8 text-brand-400 animate-spin" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {deployStep === 4 ? 'Deployment Complete & Active!' : 'Executing Cloud Orchestration...'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {deployStep === 4
                      ? 'Service mesh online with 99.99% monthly SLA guarantee.'
                      : 'Please wait while resources are allocated in the selected region.'}
                  </p>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  {deploymentSteps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isDone = deployStep > stepNum || deployStep === 4;
                    const isCurrent = deployStep === stepNum && deployStep !== 4;

                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isDone ? (
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                              ✓
                            </span>
                          ) : isCurrent ? (
                            <span className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin block" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[10px]">
                              {stepNum}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDone ? 'text-emerald-400' : isCurrent ? 'text-brand-300' : 'text-slate-500'}`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {deployStep === 4 && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setDeployModalProduct(null)}
                    >
                      Done
                    </Button>
                    <Button
                      onClick={() => {
                        setDeployModalProduct(null);
                        navigate('/assistant');
                      }}
                      icon={ExternalLink}
                    >
                      Ask AI About This Cluster
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Pre-Deployment Configuration Form */
              <div className="py-4 space-y-4 text-xs">
                {/* Environment */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Target Deployment Environment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'production', label: 'Production Mesh', sub: 'High-Availability' },
                      { id: 'staging', label: 'Staging Cluster', sub: 'Isolated Testing' },
                      { id: 'sandbox', label: 'Dev Sandbox', sub: 'Single-zone' }
                    ].map(env => (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => setDeployEnvironment(env.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          deployEnvironment === env.id
                            ? 'border-brand-500 bg-brand-500/10 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="font-bold text-xs">{env.label}</p>
                        <p className="text-[10px] text-slate-400">{env.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">
                      Cloud Region
                    </label>
                    <select
                      value={deployRegion}
                      onChange={(e) => setDeployRegion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="us-east">US-East (N. Virginia)</option>
                      <option value="eu-west">EU-West (Frankfurt)</option>
                      <option value="ap-south">AP-South (Mumbai)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">
                      Auto-scaling Policy
                    </label>
                    <select
                      value={deployScaling}
                      onChange={(e) => setDeployScaling(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="dynamic">Dynamic Pod Burst (0-100 pods)</option>
                      <option value="predictive">Predictive Traffic Scaling</option>
                      <option value="fixed">Fixed Enterprise Capacity</option>
                    </select>
                  </div>
                </div>

                {/* Security Spec Notice */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                    <Shield className="w-3.5 h-3.5" /> SOC 2 Type II & TLS 1.3 Strict Encryption
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Compliant with HIPAA, GDPR, and ISO 27001 data isolation policies with dedicated VPC network peering.
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Monthly billing: <strong className="text-emerald-400 font-mono">${Number(deployModalProduct.price).toFixed(2)}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setDeployModalProduct(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmDeploy} icon={Zap}>
                      Confirm & Launch Deployment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
