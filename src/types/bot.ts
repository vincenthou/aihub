export enum BotId {
  CHATGPT = 'chatgpt',
  BING = 'bing',
  GPT4 = 'gpt-4',
}

export interface BotProps {
  id: BotId;
  name: string;
  avatar: any;
}