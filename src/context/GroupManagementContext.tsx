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

  return (
    <GroupManagementContext.Provider value={{ 
      groupData, 
      proposeTimeChange, 
      respondToTimeChange, 
      finalizeTimeChange,
      cancelTimeChange 
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