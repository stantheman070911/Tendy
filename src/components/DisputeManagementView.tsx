import React, { useState } from 'react';
import { useDisputes, type Dispute } from '../context/DisputeContext';
import { useNotifications } from '../context/NotificationContext';

export const DisputeManagementView: React.FC = () => {
  const { disputes, updateDisputeStatus, resolveDispute, escalateDispute } = useDisputes();
  const { addNotification } = useNotifications();
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | Dispute['status']>('ALL');

  const filteredDisputes = disputes.filter(dispute => 
    filterStatus === 'ALL' || dispute.status === filterStatus
  );

  const openDisputes = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW');
  const resolvedDisputes = disputes.filter(d => d.status === 'RESOLVED');

  const handleStatusUpdate = (disputeId: string, status: Dispute['status']) => {
    updateDisputeStatus(disputeId, status);
    addNotification(`Dispute status updated to ${status.toLowerCase().replace('_', ' ')}`, 'success');
  };

  const handleResolveDispute = (disputeId: string) => {
    if (!resolutionNotes.trim()) {
      addNotification('Please provide resolution notes', 'warning');
      return;
    }

    const refund = refundAmount ? parseFloat(refundAmount) : undefined;
    resolveDispute(disputeId, resolutionNotes, refund);
    
    addNotification(
      `✅ Dispute resolved successfully${refund ? ` with $${refund} refund` : ''}`,
      'success'
    );
    
    setSelectedDispute(null);
    setResolutionNotes('');
    setRefundAmount('');
  };

  const handleEscalateDispute = (disputeId: string) => {
    if (!escalationReason.trim()) {
      addNotification('Please provide escalation reason', 'warning');
      return;
    }

    escalateDispute(disputeId, escalationReason);
    addNotification('Dispute escalated to senior support team', 'warning');
    
    setSelectedDispute(null);
    setEscalationReason('');
  };

  // New function to handle quick resolution
  const handleQuickResolve = (disputeId: string) => {
    if (window.confirm('Are you sure you want to mark this dispute as resolved?')) {
      resolveDispute(disputeId, 'Resolved by host after review.', 0);
      addNotification('Dispute has been marked as resolved', 'success');
    }
  };

  const getPriorityColor = (priority: Dispute['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'text-error bg-error/10 border-error/30';
      case 'MEDIUM':
        return 'text-harvest-gold bg-harvest-gold/10 border-harvest-gold/30';
      case 'LOW':
        return 'text-info bg-info/10 border-info/30';
    }
  };

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'OPEN':
        return 'text-error bg-error/10 border-error/30';
      case 'UNDER_REVIEW':
        return 'text-harvest-gold bg-harvest-gold/10 border-harvest-gold/30';
      case 'RESOLVED':
        return 'text-success bg-success/10 border-success/30';
      case 'ESCALATED':
        return 'text-purple-600 bg-purple-100 border-purple-300';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  return (
    <div className="space-y-lg">
      
      {/* Header with Stats */}
      <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md mb-lg">
          <div>
            <h2 className="text-3xl font-lora text-evergreen">Dispute Management</h2>
            <p className="text-charcoal/80">Monitor and resolve customer disputes</p>
          </div>
          
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-evergreen"
          >
            <option value="ALL">All Disputes</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="text-center p-md bg-error/5 rounded-lg border border-error/20">
            <div className="text-2xl font-bold text-error">{openDisputes.length}</div>
            <div className="text-sm text-charcoal/80">Open Disputes</div>
          </div>
          <div className="text-center p-md bg-harvest-gold/5 rounded-lg border border-harvest-gold/20">
            <div className="text-2xl font-bold text-harvest-gold">
              {disputes.filter(d => d.status === 'UNDER_REVIEW').length}
            </div>
            <div className="text-sm text-charcoal/80">Under Review</div>
          </div>
          <div className="text-center p-md bg-success/5 rounded-lg border border-success/20">
            <div className="text-2xl font-bold text-success">{resolvedDisputes.length}</div>
            <div className="text-sm text-charcoal/80">Resolved</div>
          </div>
          <div className="text-center p-md bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {disputes.filter(d => d.status === 'ESCALATED').length}
            </div>
            <div className="text-sm text-charcoal/80">Escalated</div>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-md">
        {filteredDisputes.length === 0 ? (
          <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm text-center">
            <i className="ph-bold ph-check-circle text-success text-6xl mb-md"></i>
            <h3 className="text-2xl font-lora text-charcoal mb-sm">
              {filterStatus === 'ALL' ? 'No Disputes' : `No ${filterStatus.toLowerCase().replace('_', ' ')} Disputes`}
            </h3>
            <p className="text-charcoal/80">
              {filterStatus === 'ALL' 
                ? 'Great job! There are no active disputes to review.' 
                : `No disputes with ${filterStatus.toLowerCase().replace('_', ' ')} status.`
              }
            </p>
          </div>
        ) : (
          filteredDisputes.map(dispute => (
            <div key={dispute.id} className="bg-white rounded-xl border border-stone/10 shadow-sm overflow-hidden">
              
              {/* Dispute Header */}
              <div className="p-lg border-b border-stone/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-evergreen">{dispute.productName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(dispute.priority)}`}>
                        {dispute.priority} PRIORITY
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(dispute.status)}`}>
                        {dispute.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-sm">
                      <div>
                        <span className="text-charcoal/60">Customer:</span>
                        <p className="font-semibold">{dispute.customerName}</p>
                      </div>
                      <div>
                        <span className="text-charcoal/60">Farmer:</span>
                        <p className="font-semibold">{dispute.farmerName}</p>
                      </div>
                      <div>
                        <span className="text-charcoal/60">Order ID:</span>
                        <p className="font-semibold">{dispute.orderId}</p>
                      </div>
                      <div>
                        <span className="text-charcoal/60">Filed:</span>
                        <p className="font-semibold">{getTimeAgo(dispute.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Quick Resolve Button - NEW */}
                    {(dispute.status === 'OPEN' || dispute.status === 'UNDER_REVIEW') && (
                      <button
                        onClick={() => handleQuickResolve(dispute.id)}
                        className="h-10 px-4 bg-success text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <i className="ph-bold ph-check-circle mr-2"></i>
                        Mark Resolved
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedDispute(selectedDispute === dispute.id ? null : dispute.id)}
                      className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {selectedDispute === dispute.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dispute Details */}
              {selectedDispute === dispute.id && (
                <div className="p-lg bg-parchment">
                  <div className="space-y-md">
                    
                    {/* Issue Details */}
                    <div>
                      <h4 className="font-semibold text-evergreen mb-2">Issue: {dispute.reason}</h4>
                      <div className="bg-white rounded-lg p-md border border-stone/20">
                        <p className="text-charcoal">{dispute.comments}</p>
                      </div>
                    </div>

                    {/* Resolution Notes (if resolved) */}
                    {dispute.resolutionNotes && (
                      <div>
                        <h4 className="font-semibold text-evergreen mb-2">Resolution Notes</h4>
                        <div className="bg-white rounded-lg p-md border border-stone/20">
                          <p className="text-charcoal">{dispute.resolutionNotes}</p>
                          {dispute.refundAmount && (
                            <p className="text-success font-semibold mt-2">
                              Refund Issued: ${dispute.refundAmount.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons for Open/Under Review Disputes */}
                    {(dispute.status === 'OPEN' || dispute.status === 'UNDER_REVIEW') && (
                      <div className="space-y-md">
                        
                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-sm">
                          {dispute.status === 'OPEN' && (
                            <button
                              onClick={() => handleStatusUpdate(dispute.id, 'UNDER_REVIEW')}
                              className="h-10 px-4 bg-harvest-gold text-evergreen font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Start Review
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleStatusUpdate(dispute.id, 'UNDER_REVIEW')}
                            className="h-10 px-4 border border-evergreen text-evergreen font-semibold rounded-lg hover:bg-evergreen hover:text-parchment transition-colors"
                          >
                            Contact Customer
                          </button>
                          
                          <button
                            onClick={() => handleStatusUpdate(dispute.id, 'UNDER_REVIEW')}
                            className="h-10 px-4 border border-evergreen text-evergreen font-semibold rounded-lg hover:bg-evergreen hover:text-parchment transition-colors"
                          >
                            Contact Farmer
                          </button>
                        </div>

                        {/* Resolution Form */}
                        <div className="bg-white rounded-lg p-md border border-stone/20">
                          <h5 className="font-semibold text-evergreen mb-md">Resolve Dispute</h5>
                          
                          <div className="space-y-md">
                            <div>
                              <label className="block font-semibold text-charcoal mb-2">
                                Resolution Notes *
                              </label>
                              <textarea
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                rows={3}
                                placeholder="Describe how the issue was resolved..."
                                className="w-full p-3 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-evergreen"
                              />
                            </div>
                            
                            <div>
                              <label className="block font-semibold text-charcoal mb-2">
                                Refund Amount (Optional)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-evergreen"
                              />
                            </div>
                            
                            <div className="flex gap-sm">
                              <button
                                onClick={() => handleResolveDispute(dispute.id)}
                                className="flex-1 h-12 bg-success text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                              >
                                <i className="ph-bold ph-check mr-2"></i>
                                Resolve Dispute
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Escalation Form */}
                        <div className="bg-white rounded-lg p-md border border-stone/20">
                          <h5 className="font-semibold text-evergreen mb-md">Escalate to Senior Support</h5>
                          
                          <div className="space-y-md">
                            <div>
                              <label className="block font-semibold text-charcoal mb-2">
                                Escalation Reason *
                              </label>
                              <textarea
                                value={escalationReason}
                                onChange={(e) => setEscalationReason(e.target.value)}
                                rows={2}
                                placeholder="Why does this dispute need escalation?"
                                className="w-full p-3 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-evergreen"
                              />
                            </div>
                            
                            <button
                              onClick={() => handleEscalateDispute(dispute.id)}
                              className="h-10 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <i className="ph-bold ph-warning mr-2"></i>
                              Escalate Dispute
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};