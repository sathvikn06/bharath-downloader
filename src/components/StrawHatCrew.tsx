import React from 'react';
import { motion } from 'motion/react';

export function StrawHatCrew() {
  const crew = [
    { name: 'luffy', url: 'https://media.tenor.com/kBdHxD9lTD4AAAAC/luffy-running.gif' },
    { name: 'zoro', url: 'https://media.tenor.com/RmByHu_4dAQAAAAC/one-piece-zoro.gif' },
    { name: 'sanji', url: 'https://media.tenor.com/0WSSr_EcUwYAAAAC/one-piece-sanji.gif' },
    { name: 'nami', url: 'https://media.tenor.com/YoVlXKsfr7oAAAAC/luffy-nami.gif' },
    { name: 'chopper', url: 'https://media.tenor.com/YqEtYABZ5DoAAAAC/one-piece-chopper.gif' },
    { name: 'usopp', url: 'https://media.tenor.com/mq7GYO5nFt0AAAAC/one-piece-usopp.gif' },
    { name: 'brook', url: 'https://media.tenor.com/iJQf9EMRx-cAAAAC/brook-one-piece.gif' },
    { name: 'franky', url: 'https://media.tenor.com/VpU3ZNhgwA0AAAAC/one-piece-franky.gif' },
    { name: 'jinbe', url: 'https://media.tenor.com/k0nv-w1a6TUAAAAC/one-piece-one-piece-opening.gif' }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none z-50 h-24 sm:h-32 opacity-80 mix-blend-multiply dark:mix-blend-screen">
      <motion.div
        initial={{ left: '-200%' }}
        animate={{ left: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: 'linear',
        }}
        className="absolute bottom-0 flex items-end gap-2 h-full whitespace-nowrap"
      >
        {crew.reverse().map((member, i) => (
          <img 
            key={i}
            src={member.url} 
            alt={member.name} 
            className="h-16 sm:h-24 object-contain"
          />
        ))}
      </motion.div>
    </div>
  );
}
