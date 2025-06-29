import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Dispute {
  id: string;
  orderId: string;
  productName: string;
  farmerName: string;
  reason: string;
  comments: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  resolvedAt?: string;
  customerName: string;
  customerEmail: string;
  refundAmount?: number;
  resolutionNotes?: string;
}

interface DisputeContextType {
  disputes: Dispute[];
  fileDispute: (dispute: Omit<Dispute, 'id' | 'status' | 'createdAt' | 'priority'>) => string;
  updateDisputeStatus: (disputeId: string, status: Dispute['status']) => void;
  resolveDispute: (disputeId: string, resolutionNotes: string, refundAmount?: number) => void;
  escalateDispute: (disputeId: string, reason: string) => void;
}

const DisputeContext = createContext<DisputeContextType | undefined>(undefined);

// Initial demo disputes to show the system in action
const initialDisputes: Dispute[] = [
  { 
    id: 'dispute-001', 
    orderId: 'order-123',
    productName: 'Organic Heirloom Tomatoes',
    farmerName: 'Rodriguez Farms',
    reason: 'Quality Issue',
    comments: 'The tomatoes were not ripe and had several soft spots. They appeared to be overripe rather than fresh as advertised.',
    status: 'OPEN',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com'
  },
  { 
    id: 'dispute-002', 
    orderId: 'order-456',
    productName: 'Free-Range Eggs - Dozen',
    farmerName: 'Green Valley Produce',
    reason: 'Missing Item',
    comments: 'I only received 10 eggs instead of the full dozen. The carton was damaged during pickup.',
    status: 'UNDER_REVIEW',
    priority: 'LOW',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@example.com'
  }
];

export const DisputeProvider = ({ children }: { children: ReactNode }) => {
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);

  const fileDispute = (newDispute: Omit<Dispute, 'id' | 'status' | 'createdAt' | 'priority'>) => {
    // Determine priority based on reason
    const getPriority = (reason: string): Dispute['priority'] => {
      switch (reason) {
        case 'Quality Issue':
        case 'Incorrect Item':
          return 'HIGH';
        case 'Missing Item':
        case 'Damaged Item':
          return 'MEDIUM';
        default:
          return 'LOW';
      }
    };

    const dispute: Dispute = {
      ...newDispute,
      id: `dispute-${Date.now()}`,
      status: 'OPEN',
      priority: getPriority(newDispute.reason),
      createdAt: new Date().toISOString(),
    };
    
    setDisputes(prev => [dispute, ...prev]);
    
    console.log('🚨 NEW DISPUTE FILED:', {
      disputeId: dispute.id,
      product: dispute.productName,
      reason: dispute.reason,
      priority: dispute.priority,
      customer: dispute.customerName
    });
    
    return dispute.id;
  };

  const updateDisputeStatus = (disputeId: string, status: Dispute['status']) => {
    setDisputes(prev => 
      prev.map(d => d.id === disputeId ? { 
        ...d, 
        status,
        resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : d.resolvedAt
      } : d)
    );
    
    console.log(`📝 DISPUTE STATUS UPDATED: ${disputeId} → ${status}`);
  };

  const resolveDispute = (disputeId: string, resolutionNotes: string, refundAmount?: number) => {
    setDisputes(prev => 
      prev.map(d => d.id === disputeId ? { 
        ...d, 
        status: 'RESOLVED',
        resolutionNotes,
        refundAmount,
        resolvedAt: new Date().toISOString()
      } : d)
    );
    
    console.log(`✅ DISPUTE RESOLVED: ${disputeId}`, {
      resolutionNotes,
      refundAmount: refundAmount ? `$${refundAmount}` : 'No refund'
    });
  };

  const escalateDispute = (disputeId: string, reason: string) => {
    setDisputes(prev => 
      prev.map(d => d.id === disputeId ? { 
        ...d, 
        status: 'ESCALATED',
        priority: 'HIGH',
        resolutionNotes: `Escalated: ${reason}`
      } : d)
    );
    
    console.log(`⚠️ DISPUTE ESCALATED: ${disputeId} - ${reason}`);
  };

  return (
    <DisputeContext.Provider value={{ 
      disputes, 
      fileDispute, 
      updateDisputeStatus, 
      resolveDispute, 
      escalateDispute 
    }}>
      {children}
    </DisputeContext.Provider>
  );
};

export const useDisputes = (): DisputeContextType => {
  const context = useContext(DisputeContext);
  if (!context) {
    throw new Error('useDisputes must be used within a DisputeProvider');
  }
  return context;
};