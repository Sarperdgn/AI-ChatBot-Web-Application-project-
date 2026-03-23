import ConversationItem from './ConversationItem.jsx';

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation
}) {
  return (
    <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onSelect={onSelectConversation}
        />
      ))}
    </div>
  );
}
