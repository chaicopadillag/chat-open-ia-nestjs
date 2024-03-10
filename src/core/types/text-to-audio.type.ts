export type VoiceType =
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';

export type VoicesType = {
  [key in VoiceType]: VoiceType;
};
