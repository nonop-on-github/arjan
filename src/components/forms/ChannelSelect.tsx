
import { Label } from "@/components/ui/label";
import { Channel } from "@/types/finance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelSelectProps {
  channelId: string;
  channels: Channel[];
  onChannelChange: (channelId: string) => void;
}

export function ChannelSelect({ channelId, channels, onChannelChange }: ChannelSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Canal</Label>
      <Select
        value={channelId}
        onValueChange={onChannelChange}
      >
        <SelectTrigger>
          <SelectValue>
            {channels.find(c => c.id === channelId)?.name || "Sélectionner un canal"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {channels.map((channel) => (
            <SelectItem key={channel.id} value={channel.id}>
              <div className="flex items-center gap-2">
                <span>{channel.icon}</span>
                <span>{channel.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
