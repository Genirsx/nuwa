import { AgentInfo } from "./AgentInfo";
import { MembersList } from "./MembersList";

/**
 * Interface for channel member data
 */
interface Member {
    address: string;
    avatar: string;
}

/**
 * Props for the ChannelSidebar component
 */
interface ChannelSidebarProps {
    /** ID of the current agent */
    agentId?: string;
    /** List of channel members */
    members: Member[];
    /** Navigation function for routing */
    navigate: (path: string) => void;
}

/**
 * ChannelSidebar component - Displays channel information and member list
 * Features:
 * - Agent profile display
 * - Channel statistics
 * - Member list with avatars and addresses
 */
export function ChannelSidebar({ agentId, members, navigate }: ChannelSidebarProps) {
    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            {/* Agent profile section with stats */}
            <AgentInfo
                agentId={agentId}
                membersCount={members.length}
                navigate={navigate}
            />
            {/* List of channel members */}
            <MembersList members={members} />
        </div>
    );
} 