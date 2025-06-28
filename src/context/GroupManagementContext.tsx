import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Group {
  id: string;
  name: string;
  pickupTime: string;
  proposedTime?: string;
  proposedBy?: string;
  proposalDate?: string;
  memberResponses?: { [memberId: string]: 'accept' | 'decline' };
  totalMembers?: number;
}

interface GroupManagementContextType {
  groupData: Group | null;
  proposeTimeChange: (newTime: string, hostId: string) => void;
  respondToTimeChange: (memberId: string, response: 'accept' | 'decline') => void;
  finalizeTimeChange: () => void;
  cancelTimeChange: () => void;
  // SPECIFICATION FIX: Add new edge case functions
  handleFullGroup: () => void;
  cancelGroup: (productId: string) => void;
}

const GroupManagementContext = createContext<GroupManagementContextType | undefined>(undefined);

// Demo group data with realistic details
const initialGroupData: Group = {
  id: "group03",
  name: "Community Apple Box",
  pickupTime: "Saturday, 4:00 PM - 6:00 PM",
  totalMembers: 8
};

export const GroupManagementProvider = ({ children }: { children: ReactNode }) => {
  const [groupData, setGroupData] = useState<Group>(initialGroupData);

  const proposeTimeChange = (newTime: string, hostId: string) => {
    setGroupData(prevData => prevData ? { 
      ...prevData, 
      proposedTime: newTime,
      proposedBy: hostId,
      proposalDate: new Date().toISOString(),
      memberResponses: {} // Reset responses for new proposal
    } : null);
    
    console.log(`🕒 TIME CHANGE PROPOSED: Host ${hostId} proposed new time "${newTime}" for group "${prevData?.name}"`);
  };

  const respondToTimeChange = (memberId: string, response: 'accept' | 'decline') => {
    setGroupData(prevData => {
      if (!prevData || !prevData.proposedTime) return prevData;
      
      const updatedResponses = {
        ...prevData.memberResponses,
        [memberId]: response
      };
      
      console.log(`👥 MEMBER RESPONSE: Member ${memberId} ${response}ed the time change proposal`);
      console.log(`📊 CURRENT RESPONSES:`, updatedResponses);
      
      return {
        ...prevData,
        memberResponses: updatedResponses
      };
    });
  };

  const finalizeTimeChange = () => {
    setGroupData(prevData => {
      if (!prevData || !prevData.proposedTime) return prevData;
      
      console.log(`✅ TIME CHANGE FINALIZED: "${prevData.pickupTime}" → "${prevData.proposedTime}"`);
      
      return { 
        ...prevData, 
        pickupTime: prevData.proposedTime, 
        proposedTime: undefined,
        proposedBy: undefined,
        proposalDate: undefined,
        memberResponses: undefined
      };
    });
  };

  const cancelTimeChange = () => {
    setGroupData(prevData => {
      if (!prevData) return prevData;
      
      console.log(`❌ TIME CHANGE CANCELED: Proposal for "${prevData.proposedTime}" was canceled`);
      
      return {
        ...prevData,
        proposedTime: undefined,
        proposedBy: undefined,
        proposalDate: undefined,
        memberResponses: undefined
      };
    });
  };

  // SPECIFICATION FIX: Add function to handle race condition for a full group
  const handleFullGroup = () => {
    console.log('🏃‍♂️ RACE CONDITION: Simulating group that just filled up');
    
    // In a real app, this would be triggered by a failed API call
    // For demo purposes, we'll show what happens when someone tries to join a full group
    
    // This would typically be called from a failed join attempt
    return {
      success: false,
      message: "Sorry, the last spot was just taken by another user. Please check back for new groups soon!",
      errorType: 'RACE_CONDITION_FULL_GROUP'
    };
  };

  // SPECIFICATION FIX: Add function for farmer-initiated cancellation
  const cancelGroup = (productId: string) => {
    console.log(`🚨 CRITICAL ACTION: Farmer has canceled group buy for product ${productId}`);
    console.log(`💰 TRANSACTION: Processing full refunds for all participants`);
    console.log(`📧 NOTIFICATIONS: Sending cancellation emails to all group members`);
    
    // In a real app, this would:
    // 1. Update the product/group status to "Canceled"
    // 2. Process refunds for all authorized payments
    // 3. Send notifications to all group members
    // 4. Update the farmer's cancellation history
    
    return {
      success: true,
      message: "Group buy has been canceled. All card authorizations have been released and refunds are being processed.",
      refundsProcessed: true,
      notificationsSent: true
    };
  };

  return (
    <GroupManagementContext.Provider value={{ 
      groupData, 
      proposeTimeChange, 
      respondToTimeChange, 
      finalizeTimeChange,
      cancelTimeChange,
      handleFullGroup,
      cancelGroup
    }}>
      {children}
    </GroupManagementContext.Provider>
  );
};

export const useGroupManagement = (): GroupManagementContextType => {
  const context = useContext(GroupManagementContext);
  if (!context) {
    throw new Error('useGroupManagement must be used within a GroupManagementProvider');
  }
  return context;
};