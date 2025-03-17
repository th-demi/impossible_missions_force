const adjectives = [
    'Silent', 'Midnight', 'Phantom', 'Shadow', 'Ghost', 'Covert', 'Stealth', 'Rogue',
    'Invisible', 'Quantum', 'Crystal', 'Mystic', 'Sonic', 'Viper', 'Cobra', 'Eagle',
    'Arctic', 'Desert', 'Jungle', 'Urban', 'Cyber', 'Digital', 'Analog', 'Tactical',
    'Supreme', 'Ultimate', 'Extreme', 'Maximum', 'Nano', 'Micro', 'Mega', 'Ultra'
  ];
  
  const nouns = [
    'Nightingale', 'Kraken', 'Phoenix', 'Dragon', 'Tiger', 'Panther', 'Falcon', 'Wolf',
    'Sentinel', 'Guardian', 'Protector', 'Defender', 'Ghost', 'Specter', 'Shadow', 'Phantom',
    'Blade', 'Dagger', 'Sword', 'Shield', 'Arrow', 'Dart', 'Bullet', 'Missile',
    'Eagle', 'Hawk', 'Owl', 'Raven', 'Serpent', 'Viper', 'Cobra', 'Scorpion'
  ];
  
  /**
   * Generate a random gadget codename
   * @returns {string} A random codename in the format "The {Adjective} {Noun}"
   */
  const generateCodename = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `The ${adjective} ${noun}`;
  };
  
  /**
   * Generate a random mission success probability
   * @returns {number} A random probability between 50 and 99
   */
  const generateSuccessProbability = () => {
    return Math.floor(Math.random() * 50) + 50; // Random number between 50-99
  };
  
  /**
   * Generate a self-destruct confirmation code
   * @returns {string} A 6-character alphanumeric code
   */
  const generateSelfDestructCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitting similar-looking characters
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
  
  module.exports = {
    generateCodename,
    generateSuccessProbability,
    generateSelfDestructCode
  };