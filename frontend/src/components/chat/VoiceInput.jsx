import { Mic } from 'lucide-react';

const VoiceInput = () => (
  <button className="p-3 gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all hover-lift flex items-center">
    <Mic size={16} className="sm:w-5 sm:h-5 mr-2" />
    Voice
  </button>
);

export default VoiceInput;
