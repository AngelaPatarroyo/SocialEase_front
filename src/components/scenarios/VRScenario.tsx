'use client';

import React, { useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Sphere, Plane } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface VRScenarioProps {
  scenarioId: string;
  scenarioTitle: string;
  onComplete: (rating: number, reflection: string) => void;
  onExit: () => void;
}

// 3D Person Component
function Person({ position, color, name, isAnimated = true }: { 
  position: [number, number, number]; 
  color: string; 
  name: string;
  isAnimated?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && isAnimated) {
      // Gentle bobbing animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Slight rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Head */}
      <Sphere args={[0.25, 8, 6]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color={color} />
      </Sphere>
      
      {/* Body */}
      <Cylinder args={[0.3, 0.4, 1.6, 8]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      
      {/* Arms */}
      <Cylinder args={[0.08, 0.08, 0.8, 6]} position={[-0.4, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.8, 6]} position={[0.4, 1.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder args={[0.12, 0.12, 0.8, 6]} position={[-0.15, 0.4, 0]}>
        <meshStandardMaterial color="#2F4F4F" />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 0.8, 6]} position={[0.15, 0.4, 0]}>
        <meshStandardMaterial color="#2F4F4F" />
      </Cylinder>
      
      {/* Name tag */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

// 3D Chair Component
function Chair({ position, rotation = [0, 0, 0] }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Chair seat */}
      <Cylinder args={[0.4, 0.4, 0.1, 8]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Chair back */}
      <Cylinder args={[0.4, 0.4, 0.8, 8]} position={[0, 0.65, -0.3]} rotation={[Math.PI / 6, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Chair legs */}
      {[
        [-0.3, 0.1, 0.3],
        [0.3, 0.1, 0.3],
        [-0.3, 0.1, -0.3],
        [0.3, 0.1, -0.3]
      ].map((legPos, index) => (
        <Cylinder key={index} args={[0.05, 0.05, 0.5, 6]} position={legPos as [number, number, number]}>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
      ))}
    </group>
  );
}

// 3D Table Component
function Table({ position, size = 1 }: { 
  position: [number, number, number]; 
  size?: number;
}) {
  return (
    <group position={position}>
      {/* Table top */}
      <Cylinder args={[1.2 * size, 1.2 * size, 0.1, 8]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Table legs */}
      {[
        [-0.8 * size, 0.35, 0.8 * size],
        [0.8 * size, 0.35, 0.8 * size],
        [-0.8 * size, 0.35, -0.8 * size],
        [0.8 * size, 0.35, -0.8 * size]
      ].map((legPos, index) => (
        <Cylinder key={index} args={[0.1, 0.1, 0.7, 6]} position={legPos as [number, number, number]}>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
      ))}
      
      {/* Coffee cups */}
      {[
        [-0.5, 0.4, 0.3],
        [0, 0.4, -0.3],
        [0.5, 0.4, 0.3]
      ].map((cupPos, index) => (
        <Cylinder key={index} args={[0.15, 0.12, 0.25, 8]} position={cupPos as [number, number, number]}>
          <meshStandardMaterial color="white" />
        </Cylinder>
      ))}
    </group>
  );
}

// 3D Plant Component
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Plant pot */}
      <Cylinder args={[0.4, 0.3, 0.3, 8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Plant leaves */}
      <Cylinder args={[0.3, 0.3, 1.2, 6]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#228B22" />
      </Cylinder>
      
      {/* Flowers */}
      {[0, 1, 2, 3].map((i) => (
        <Sphere key={i} args={[0.1, 6, 4]} position={[
          Math.cos(i * Math.PI / 2) * 0.2,
          1.2,
          Math.sin(i * Math.PI / 2) * 0.2
        ]}>
          <meshStandardMaterial color="#FF69B4" />
        </Sphere>
      ))}
    </group>
  );
}

// 3D Environment Component
function VREnvironment() {
  const { camera } = useThree();
  
  // Set initial camera position
  React.useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#87CEEB" />
      
      {/* Floor with pattern */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#8B4513" />
      </Plane>
      
      {/* Floor tiles pattern */}
      {Array.from({ length: 10 }, (_, i) => 
        Array.from({ length: 10 }, (_, j) => (
          <Plane 
            key={`${i}-${j}`} 
            args={[1.8, 1.8]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[(i - 5) * 2, 0.01, (j - 5) * 2]}
          >
            <meshStandardMaterial color={i % 2 === j % 2 ? "#A0522D" : "#8B4513"} />
          </Plane>
        ))
      )}
      
      {/* Walls with windows */}
      <Box args={[20, 4, 0.2]} position={[0, 2, -10]} castShadow>
        <meshStandardMaterial color="#F0F8FF" />
      </Box>
      <Box args={[0.2, 4, 20]} position={[-10, 2, 0]} castShadow>
        <meshStandardMaterial color="#F0F8FF" />
      </Box>
      <Box args={[0.2, 4, 20]} position={[10, 2, 0]} castShadow>
        <meshStandardMaterial color="#F0F8FF" />
      </Box>
      
      {/* Windows */}
      <Box args={[3, 2, 0.1]} position={[0, 2.5, -9.9]}>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      <Box args={[3, 2, 0.1]} position={[-9.9, 2.5, 0]}>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      <Box args={[3, 2, 0.1]} position={[9.9, 2.5, 0]}>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      
      {/* Main conversation group */}
      <Person position={[-2, 0, -1]} color="#4A90E2" name="Alex" />
      <Person position={[0, 0, -2]} color="#50C878" name="Sam" />
      <Person position={[2, 0, -1]} color="#FFB347" name="Jordan" />
      <Person position={[0, 0, 1]} color="#E6A4B4" name="Taylor" />
      
      {/* Main table */}
      <Table position={[0, 0, 0]} size={1.2} />
      
      {/* Chairs around main table */}
      <Chair position={[-2, 0, -1]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[0, 0, -2]} rotation={[0, 0, 0]} />
      <Chair position={[2, 0, -1]} rotation={[0, -Math.PI / 4, 0]} />
      <Chair position={[0, 0, 1]} rotation={[0, Math.PI, 0]} />
      
      {/* Additional tables and chairs */}
      <Table position={[-6, 0, -6]} size={0.8} />
      <Chair position={[-6.5, 0, -6]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[-5.5, 0, -6]} rotation={[0, -Math.PI / 4, 0]} />
      
      <Table position={[6, 0, -6]} size={0.8} />
      <Chair position={[6.5, 0, -6]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[5.5, 0, -6]} rotation={[0, -Math.PI / 4, 0]} />
      
      <Table position={[-6, 0, 6]} size={0.8} />
      <Chair position={[-6.5, 0, 6]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[-5.5, 0, 6]} rotation={[0, -Math.PI / 4, 0]} />
      
      <Table position={[6, 0, 6]} size={0.8} />
      <Chair position={[6.5, 0, 6]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[5.5, 0, 6]} rotation={[0, -Math.PI / 4, 0]} />
      
      {/* Decorative plants */}
      <Plant position={[-8, 0, -8]} />
      <Plant position={[8, 0, -8]} />
      <Plant position={[-8, 0, 8]} />
      <Plant position={[8, 0, 8]} />
      
      {/* Wall decorations */}
      <Box args={[2, 1, 0.1]} position={[0, 3, -9.9]}>
        <meshStandardMaterial color="#D2691E" />
      </Box>
      <Box args={[2, 1, 0.1]} position={[-9.9, 3, 0]}>
        <meshStandardMaterial color="#D2691E" />
      </Box>
      <Box args={[2, 1, 0.1]} position={[9.9, 3, 0]}>
        <meshStandardMaterial color="#D2691E" />
      </Box>
      
      {/* Ceiling lights */}
      <Sphere args={[0.3, 8, 6]} position={[0, 3.8, 0]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.3, 8, 6]} position={[-6, 3.8, -6]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.3, 8, 6]} position={[6, 3.8, -6]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.3, 8, 6]} position={[-6, 3.8, 6]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.3, 8, 6]} position={[6, 3.8, 6]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </Sphere>
    </>
  );
}

export default function VRScenario({ 
  scenarioId, 
  scenarioTitle, 
  onComplete, 
  onExit 
}: VRScenarioProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState(3);
  const [reflection, setReflection] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  // VR scenario steps for "Join a Group Conversation"
  const scenarioSteps = [
    {
      title: "Enter the Social Space",
      description: "You're in a casual gathering area. Look around and notice the group of people chatting.",
      action: "Observe the group from a distance"
    },
    {
      title: "Read the Group Dynamic",
      description: "Notice their body language, conversation flow, and find a natural pause to join.",
      action: "Analyze the group's conversation pattern"
    },
    {
      title: "Position Yourself",
      description: "Move closer to the group, making yourself visible and approachable.",
      action: "Move to the edge of the conversation circle"
    },
    {
      title: "Show Interest",
      description: "Make eye contact with someone in the group and show you're listening.",
      action: "Make brief eye contact and nod occasionally"
    },
    {
      title: "Join the Conversation",
      description: "Wait for a pause, then contribute something relevant to the current topic.",
      action: "Add a comment or ask a question"
    }
  ];

  const handleNextStep = () => {
    if (currentStep < scenarioSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const handleComplete = () => {
    onComplete(rating, reflection);
  };

  if (showCompletion) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            VR Scenario Complete!
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How confident did you feel? (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${
                      rating === value
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-indigo-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What did you learn from this experience?
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
                placeholder="Share your thoughts..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onExit}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Exit
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Complete
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Real 3D VR Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 2, 8], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #4682B4)' }}
      >
        <VREnvironment />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
      
      {/* Minimal VR UI */}
      <div className="absolute top-4 left-4 right-4">
        <div className="flex justify-between items-center">
          <div className="bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-sm font-medium">Step {currentStep + 1} of {scenarioSteps.length}</span>
          </div>
          
          <button
            onClick={onExit}
            className="bg-black/50 text-white p-2 rounded-lg backdrop-blur-sm hover:bg-black/70"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Simple Action Display */}
      <div className="absolute top-20 left-4 right-4">
        <div className="bg-black/50 text-white px-4 py-3 rounded-lg backdrop-blur-sm max-w-md">
          <h3 className="font-semibold mb-1">{scenarioSteps[currentStep].title}</h3>
          <p className="text-sm opacity-90">{scenarioSteps[currentStep].action}</p>
        </div>
      </div>

      {/* Next Button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleNextStep}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          {currentStep === scenarioSteps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      {/* Simple Controls Hint */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm text-xs">
          Mouse: Look • Scroll: Zoom • Drag: Move
        </div>
      </div>
    </div>
  );
}
